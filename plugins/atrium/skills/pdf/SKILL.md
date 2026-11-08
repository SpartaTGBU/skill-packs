---
disable-model-invocation: true  # skl: on-demand pack skill
name: pdf
description: >
  Read, create, edit and review PDFs with pypdf, pdfplumber, reportlab and poppler/qpdf tools:
  text and table extraction, OCR of scans, merge, split, rotate, watermark, encrypt, fill
  fillable and flat forms, and generate reports, with visual validation by rendering pages.
  Use when a .pdf is input or output, when asked to extract data or tables from a PDF, combine
  or split files, fill out a form, OCR a scanned document, convert a document to PDF, or produce
  a printable report or invoice.
---

# PDF files

PDF is a page description format, not a document model: text is positioned glyphs, tables are
lines and text that happen to align, and scans are images. Choose tools by what is actually in
the file.

## Discovery first

- What is the goal: extract data, transform the file (merge/split/fill), or produce a new PDF?
- Is the PDF text-based or scanned? Check: `pdftotext -l 1 file.pdf - | head`; empty or garbage
  output means OCR is needed. Is it encrypted? `pdfinfo file.pdf`.
- For forms: who signs, which fields are required, and where the values come from. Never invent
  values (IDs, dates, amounts); ask for missing ones and leave them blank rather than guess.
- For new PDFs: page size (A4/Letter), brand, and whether the source should be a .docx or
  .pptx instead (then convert; see atrium:docx, atrium:pptx).

## Tools

| Task | Tool |
|---|---|
| Plain text, fast | `pdftotext -layout -f 2 -l 5 file.pdf out.txt` (poppler) |
| Text with positions, tables | pdfplumber |
| Merge, split, rotate, metadata, encrypt, forms | pypdf |
| Page surgery on the command line | qpdf |
| New PDFs from code | reportlab |
| Images inside a PDF | `pdfimages -png file.pdf img/p` |
| Pages to images (QA, OCR) | `pdftoppm -png -r 150 file.pdf out/page` |
| OCR | `ocrmypdf` if installed, else pdftoppm + tesseract |
| Office/HTML to PDF | `soffice --headless --convert-to pdf file.docx` |

If a Python import fails, install `pypdf`, `pdfplumber` or `reportlab` with pip. If a PDF
viewer tool is connected (an interactive viewer MCP), it can be used to annotate, highlight,
fill and sign visually with screenshot checks; it is optional, and plain reading never needs it.

## Extract text and tables

```python
import pdfplumber, pandas as pd
frames = []
with pdfplumber.open("statement.pdf") as pdf:
    for n, page in enumerate(pdf.pages, 1):
        text = page.extract_text() or ""
        for t in page.extract_tables():
            if len(t) > 1:
                df = pd.DataFrame(t[1:], columns=t[0]); df["page"] = n
                frames.append(df)
if frames:
    pd.concat(frames, ignore_index=True).to_excel("tables.xlsx", index=False)
```

- Tables without ruling lines: try `page.extract_tables({"vertical_strategy": "text",
  "horizontal_strategy": "text"})`, or crop first with `page.within_bbox((x0, top, x1, bottom))`.
- Check extracted numbers against the rendered page for a sample of rows; merged cells, wrapped
  lines and multi-page tables cause silent shifts. Report what could not be extracted.
- Clean numeric columns explicitly (thousands separators, parentheses for negatives, currency).
- Downstream spreadsheet work: atrium:xlsx.

## OCR scanned pages

```bash
ocrmypdf --skip-text -l eng scan.pdf searchable.pdf        # adds a text layer, keeps images
# fallback without ocrmypdf:
pdftoppm -png -r 300 scan.pdf ocr/p && for f in ocr/p-*.png; do tesseract "$f" "${f%.png}" -l eng; done
```

300 dpi is the floor for small print. OCR output has errors: flag low-confidence fields, never
silently "correct" numbers, and have critical values (amounts, IDs) confirmed by the user.

## Merge, split, rotate, protect

```python
from pypdf import PdfReader, PdfWriter
w = PdfWriter()
for path in ["cover.pdf", "report.pdf", "appendix.pdf"]:
    w.append(path)                                   # merge
w.pages[0].rotate(90)                                # rotate clockwise
w.add_metadata({"/Title": "Q3 Report", "/Author": "Finance"})
w.write("combined.pdf")

r = PdfReader("combined.pdf")
part = PdfWriter(); [part.add_page(p) for p in r.pages[2:6]]
part.write("pages-3-6.pdf")                          # split by range
```

- qpdf equivalents: `qpdf --empty --pages a.pdf b.pdf 1-3 -- out.pdf`,
  `qpdf in.pdf --pages . 3-6 -- out.pdf`, `qpdf --rotate=+90:1 in.pdf out.pdf`.
- Encrypt: `w.encrypt(user_password=..., owner_password=..., algorithm="AES-256")`. Decrypt only
  with a password the user supplies; never try to bypass protection.
- Watermark/stamp: make a one-page PDF with reportlab, then `page.merge_page(stamp_page)` on each
  page of the reader, writing the results to a new writer.
- Compress: `w.compress_identical_objects()` or `page.compress_content_streams()`; for big scans,
  `qpdf --object-streams=generate` or re-OCR at lower resolution.

## Create with reportlab

```python
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

st = getSampleStyleSheet()
doc = SimpleDocTemplate("invoice.pdf", pagesize=A4, title="Invoice 1042",
                        leftMargin=50, rightMargin=50, topMargin=50, bottomMargin=50)
rows = [["Item", "Qty", "Amount"], ["Consulting", "10 h", "1,500.00"]]
tbl = Table(rows, colWidths=[300, 60, 100])
tbl.setStyle(TableStyle([("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                         ("LINEBELOW", (0, 0), (-1, 0), 0.5, colors.grey),
                         ("ALIGN", (1, 0), (-1, -1), "RIGHT")]))
doc.build([Paragraph("Invoice 1042", st["Title"]), Spacer(1, 12), tbl])
```

- Platypus (flowables) for multi-page documents; `canvas.Canvas` for precise single-page layout.
  The canvas origin is bottom-left, in points (72 per inch).
- Built-in fonts cover Latin-1 only; register a TTF (`pdfmetrics.registerFont(TTFont(...))`)
  for other scripts, and use real subscript/superscript tags, not Unicode lookalikes.
- For rich layout, writing HTML or .docx and converting is often easier than reportlab.

## Fill forms

Fillable (AcroForm) PDFs:

```python
from pypdf import PdfReader, PdfWriter
r = PdfReader("form.pdf")
for name, f in (r.get_fields() or {}).items():
    print(name, f.get("/FT"), f.get("/V"), f.get("/_States_", ""))   # name, type, value, options
w = PdfWriter(clone_from=r)
for page in w.pages:
    w.update_page_form_field_values(page, {"FullName": "Jane Doe", "Agree": "/Yes"},
                                    auto_regenerate=False)
w.set_need_appearances_writer(True)                 # viewers redraw filled values
w.write("filled.pdf")
```

- Field names are often cryptic; map them to labels by checking each field's `/Rect` against
  the text near it on the page. Checkboxes and radio buttons take their export value
  (e.g. `/Yes`, `/1`), listed in the field's states.

Flat (non-fillable) forms: overlay text at measured coordinates.
1. Locate labels and blank lines with pdfplumber: `page.extract_words()` and `page.lines`
   give `x0, top, x1, bottom` in points from the top-left.
2. If the page is a scan, render it (`pdftoppm -r 150`), find positions on the image, zoom into
   crops to refine, and convert: points = pixels x 72 / dpi.
3. Draw values with reportlab on a page the same size; reportlab's y runs from the bottom, so
   `y = page_height - top_from_pdfplumber - small_offset`. Merge the overlay onto the page.
4. Render the filled pages and inspect every field: right box, no overlap with labels, fits.

Signatures: insert an image of a signature only when the user provides it and asks; a drawn
image is not a cryptographic signature. Legal effect of a filled form is for the user or a
professional to judge; route contract content to atrium:contract-review.

## Review checklist

- [ ] Correct source: text vs scan detected; OCR applied where needed and errors flagged.
- [ ] Extracted figures spot-checked against rendered pages; gaps reported, nothing invented.
- [ ] Page count, order and rotation correct after merge/split; bookmarks/metadata as intended.
- [ ] Forms: every required field filled from user-provided data; checked by rendering.
- [ ] Generated PDFs: fonts embedded, text selectable, page size and margins right, no overflow.
- [ ] Encryption/permissions as requested; no passwords written to logs or output files.
- [ ] Output opens in a second tool (pdfinfo, pypdf) without errors.
