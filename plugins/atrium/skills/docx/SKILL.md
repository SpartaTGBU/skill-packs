---
disable-model-invocation: true  # skl: on-demand pack skill
name: docx
description: >
  Create, read, edit and review Word documents (.docx) with python-docx and direct OOXML edits:
  styled reports, letters, memos and templates; tracked changes (redlines) and comments;
  conversion and visual QA through LibreOffice headless. Use when a .docx/.doc/.dotx file is
  input or output, when asked for a Word document, report, letter, memo or contract draft, to
  redline or comment on a document, accept or reject changes, extract text from Word, or
  convert Word to or from PDF.
---

# Word documents (.docx)

A .docx is a zip of XML parts. The body is `word/document.xml`; styles, numbering, comments,
headers and footers each live in their own part, linked through `word/_rels/document.xml.rels`
and registered in `[Content_Types].xml`.

## Discovery first

Before writing, establish:
- Purpose and reader (client, board, internal, regulator), and the decision the document supports.
- Required structure, length, house style or template (.dotx or a previous document to match).
- Source material and numbers. Never invent figures, quotes or citations; mark estimates as
  estimates and name their source. Ask for anything missing.
- For edits: is the output a clean copy, or a redline (tracked changes) the other side will review?
  Whose name goes in the author field?

## Pick the approach

| Task | Approach |
|---|---|
| New document | python-docx, built on styles (or on the user's template) |
| Read / summarize | `pandoc file.docx -t markdown` (keeps headings, tables) or python-docx paragraphs + tables |
| Light edit, formatting preserved | python-docx, editing runs, not `paragraph.text` |
| Redline / comments | Unzip, edit the XML, rezip (python-docx has no tracked-change API) |
| Legacy .doc, .rtf, .odt | Convert first: `soffice --headless --convert-to docx file.doc` |
| PDF output | `soffice --headless --convert-to pdf file.docx` |

If `import docx` fails, install `python-docx` (pip). Use `lxml` for XML work; never round-trip
OOXML through `xml.etree`, which rewrites namespace prefixes and can corrupt the file.

## Create with python-docx

```python
from docx import Document
from docx.shared import Pt, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = Document("house-template.docx")   # or Document(); a .dotx must be saved as .docx first
sec = doc.sections[0]
sec.page_width, sec.page_height = Cm(21.0), Cm(29.7)          # A4; Letter = 21.59 x 27.94 cm
sec.left_margin = sec.right_margin = Cm(2.5)

body = doc.styles["Normal"].font
body.name, body.size = "Calibri", Pt(11)

doc.add_heading("Quarterly Review", level=0)                 # Title style
doc.add_heading("Summary", level=1)                          # Heading 1, feeds the TOC
p = doc.add_paragraph("Revenue grew ")
p.add_run("12%").bold = True
p.add_run(" against plan (source: finance close, Sept).")
doc.add_paragraph("First point", style="List Bullet")      # real list style, no typed bullets
doc.add_paragraph("Step one", style="List Number")

t = doc.add_table(rows=1, cols=3, style="Table Grid")
for cell, label in zip(t.rows[0].cells, ["Metric", "Q2", "Q3"]):
    cell.text = label
    cell.paragraphs[0].runs[0].bold = True
for row in data:
    cells = t.add_row().cells
    for c, v in zip(cells, row):
        c.text = str(v)

footer = sec.footer.paragraphs[0]
footer.text = "Confidential"
footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_page_break()
doc.save("review.docx")
```

Rules:
- Use built-in styles (Title, Heading 1-3, List Bullet, List Number, Caption) so navigation,
  TOC and accessibility work. Never fake headings with bold Normal text or bullets with "•".
- Change look through styles, not per-run formatting, so the document stays editable.
- Pictures: `doc.add_picture(path, width=Cm(15))`; keep within the text width.
- Page numbers and a table of contents need field codes (`PAGE`, `TOC \o "1-3"`). Insert the
  field XML and tell the user to update fields on open (F9), or refresh it by converting
  through LibreOffice.
- Tables: set widths on cells (Word ignores column width alone); right-align numbers; repeat
  the header row on long tables (`w:tblHeader` on the first row's `w:trPr`).

## Edit without losing formatting

Word splits visible text across many runs (spell-check marks, revision ids, style changes).
`paragraph.text = ...` collapses the paragraph into one unstyled run. Instead:

```python
def replace_in_paragraph(par, old, new):
    full = "".join(r.text for r in par.runs)
    if old not in full or not par.runs:
        return False
    start = full.index(old)
    pos = 0
    for r in par.runs:                       # find the run where the match begins
        if pos <= start < pos + len(r.text):
            first = r
            break
        pos += len(r.text)
    tail = full[start + len(old):]           # rest of paragraph moves into the first run
    first.text = full[pos:start] + new + tail
    for r in par.runs[par.runs.index(first) + 1:]:
        r.text = ""
    return True
```

This keeps the first matched run's formatting. Also walk tables (`for t in doc.tables` ->
rows -> cells -> paragraphs), headers and footers; `doc.paragraphs` covers only the body.

## Raw XML workflow (redlines, comments, anything python-docx lacks)

```bash
mkdir work && cd work && unzip -q ../in.docx      # inspect for symlinks/odd paths if from outside
# edit word/document.xml (and other parts) with lxml or careful text edits
rm -f ../out.docx && zip -qrX ../out.docx '[Content_Types].xml' _rels docProps word customXml 2>/dev/null
```

Zip from inside the folder so `[Content_Types].xml` sits at the root. Remove the old output
first or deleted parts survive. Untrusted inputs: reject entries with `..` or absolute paths.

### Tracked changes

Wrap the edit in revision elements; each needs a unique `w:id`, `w:author`, `w:date` (ISO 8601).

```xml
<w:del w:id="901" w:author="Reviewer" w:date="2026-10-30T09:00:00Z">
  <w:r><w:rPr>…same as original…</w:rPr><w:delText>30 days</w:delText></w:r>
</w:del>
<w:ins w:id="902" w:author="Reviewer" w:date="2026-10-30T09:00:00Z">
  <w:r><w:rPr>…same as original…</w:rPr><w:t>45 days</w:t></w:r>
</w:ins>
```

- Split the original run so only the changed words sit inside `w:del`/`w:ins`; copy its `w:rPr`.
- Deleted text must use `w:delText`, never `w:t`.
- Minimal redlines: change the clause, not the whole paragraph; reviewers reject noisy diffs.
- Deleting a whole paragraph also marks its paragraph mark: add `<w:del …/>` inside that
  paragraph's `w:pPr/w:rPr`, or the empty paragraph remains.
- Formatting-only changes use `w:rPrChange` holding the old properties.
- Accept all changes for a clean copy: LibreOffice (Edit > Track Changes > Accept All) or
  `pandoc --track-changes=accept in.docx -o clean.docx` (pandoc rebuilds styling; check it).
  Afterwards remove empty paragraphs left by deleted paragraphs.

### Comments

A comment touches four places:
1. `word/comments.xml`: `<w:comment w:id="5" w:author="Reviewer" w:date="…" w:initials="RV">`
   containing normal paragraphs.
2. The body: `<w:commentRangeStart w:id="5"/>` before the anchored text,
   `<w:commentRangeEnd w:id="5"/>` after it, then a run holding `<w:commentReference w:id="5"/>`.
3. `word/_rels/document.xml.rels`: a relationship of type
   `http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments`.
4. `[Content_Types].xml`: an Override for `/word/comments.xml` with content type
   `application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml`.
Replies and resolved state need `commentsExtended.xml` (`w15:commentEx` with `paraIdParent`,
`done`); skip unless the user needs threads. Reuse existing parts if the file already has them.

## Render and inspect

```bash
soffice --headless --convert-to pdf --outdir out/ review.docx
pdftoppm -png -r 80 out/review.pdf out/page      # out/page-1.png ...
```

Look at every page image: headings, table overflow past margins, orphaned headings at page
bottom, image scaling, header/footer, numbering restarts, leftover template text. Re-render after
fixes. LibreOffice substitutes missing fonts, so small layout shifts against Word are expected.

## Review checklist

- [ ] Opens cleanly: python-docx loads it and LibreOffice converts it without errors.
- [ ] Structure uses real heading and list styles; TOC (if any) reflects the headings.
- [ ] Every number, name and date traces to a source; estimates are labelled.
- [ ] No placeholder text: grep the text dump for `lorem|TODO|TBD|\[insert|XXX`.
- [ ] Redlines: only intended text changed, author and date set, ids unique, deleted text in
      `w:delText`; the clean (accepted) version reads correctly.
- [ ] Comments anchored to the right text and registered in rels and content types.
- [ ] Rendered pages checked visually; tables fit; consistent fonts and spacing.
- [ ] Prose edited for tone (atrium:copy-editing, forge:humanizer); brand applied if one exists
      (atrium:brand-guidelines).

Legal documents: a redline is drafting support, not legal advice; route substantive review
through atrium:contract-review and recommend counsel for high-stakes terms.
