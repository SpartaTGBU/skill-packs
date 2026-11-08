---
disable-model-invocation: true  # skl: on-demand pack skill
name: pptx
description: >
  Create, read, edit and review PowerPoint decks (.pptx) with python-pptx and direct OOXML edits:
  layout-based slides, template filling, native charts, speaker notes, and visual QA by
  rendering every slide to an image through LibreOffice headless. Use when a .pptx/.ppt file is
  input or output, when asked for a deck, presentation, pitch, slides, board or QBR update,
  to fill or restyle a template, extract text from slides, or check a deck for overflow and
  layout problems.
---

# PowerPoint decks (.pptx)

A .pptx is a zip of XML: `ppt/presentation.xml` holds the slide order (`p:sldIdLst`), each slide
is `ppt/slides/slideN.xml`, and slides inherit from layouts and masters. Build on that
inheritance; do not position everything by hand.

## Discovery first

- Audience, setting (presented live, read async, printed) and the one decision or takeaway.
- Length limit, template or brand (colors, fonts, logo). If a brand exists, use it
  (atrium:brand-guidelines); a supplied template overrides every design default below.
- Source content and numbers. Never invent data, quotes or logos; label estimates and cite
  sources in a footnote or the notes. Ask for anything missing.
- Write the storyline first: one line per slide stating its point. Get agreement on that outline
  before building when the deck is longer than a few slides.

## Pick the approach

| Task | Approach |
|---|---|
| Read / summarize | python-pptx: iterate `slide.shapes`, `shape.has_text_frame`, tables, `notes_slide` |
| New deck | python-pptx from the template's layouts (or the default template) |
| Fill a template | python-pptx placeholders; XML edits for reorder/duplicate |
| Legacy .ppt / .odp | `soffice --headless --convert-to pptx file.ppt` first |
| PDF handout | `soffice --headless --convert-to pdf deck.pptx` |

If `import pptx` fails, install `python-pptx` with pip.

## Create from layouts

```python
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE

prs = Presentation("brand-template.pptx")       # or Presentation(); then set 16:9:
# prs.slide_width, prs.slide_height = Inches(13.333), Inches(7.5)
for i, layout in enumerate(prs.slide_layouts):  # learn the template before using it
    print(i, layout.name, [(p.placeholder_format.idx, p.name) for p in layout.placeholders])

s = prs.slides.add_slide(prs.slide_layouts[1])  # "Title and Content"
s.shapes.title.text = "Churn fell to 2.1% after onboarding change"   # title states the point
body = s.placeholders[1].text_frame
body.text = "Monthly logo churn, Jan-Sep (source: billing export)"
for line in ["Onboarding call added in May", "Largest drop in SMB segment"]:
    p = body.add_paragraph(); p.text = line; p.level = 1    # one paragraph per bullet

data = CategoryChartData()
data.categories = ["Q1", "Q2", "Q3"]
data.add_series("Churn %", (3.4, 2.8, 2.1))
s2 = prs.slides.add_slide(prs.slide_layouts[5])             # "Title Only"
s2.shapes.title.text = "Q3 churn is the lowest this year"
s2.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, Inches(0.7), Inches(1.6),
                    Inches(11.9), Inches(5.2), data)        # native, editable chart
s2.notes_slide.notes_text_frame.text = "Talk track: ..."
prs.save("deck.pptx")
```

Rules:
- Use placeholders so titles, fonts and positions come from the master; add free shapes only
  for diagrams, callouts and images.
- Bullets: one `<a:p>` per point and let the layout supply the bullet glyph. Never type "•" or
  "-" into the text.
- To change text but keep formatting, set `run.text` on existing runs; `text_frame.text = ...`
  collapses everything into one run with default styling.
- Charts: native charts (`add_chart`) stay editable; use chart images only when the chart type
  is unsupported. python-pptx cannot insert SVG/EMF; convert to PNG at 2x size first.
- Tables: `shapes.add_table`, right-align numbers, at most ~6 rows x 5 columns on a slide.

## Editing a template

python-pptx cannot duplicate or reorder slides. Work in the XML for those:

```bash
mkdir work && cd work && unzip -q ../template.pptx
# reorder/remove: edit <p:sldIdLst> in ppt/presentation.xml (order of <p:sldId> = slide order)
# duplicate: copy slideN.xml and its _rels file, add a relationship in
#   ppt/_rels/presentation.xml.rels, a <p:sldId> with a new id and r:id, and a content-type Override
rm -f ../out.pptx && zip -qrX ../out.pptx '[Content_Types].xml' _rels docProps ppt
```

- Removing a slide = drop its `<p:sldId>`; also delete the slide part and its relationship, or it
  stays in the file as an orphan.
- Inventory before editing: dump every slide's placeholders and text, map content to slots, then
  edit. When content has fewer items than the template has slots (3 cards in a 4-card layout),
  delete the whole unused group (shape, icon, caption), not just its text.
- Text with leading or trailing spaces needs `xml:space="preserve"` on `<a:t>`.
- Use lxml for XML edits; untrusted archives: reject entries with `..`, absolute paths, symlinks.

## Design rules (when no template or brand decides)

- Palette: one dominant color, one or two supporting neutrals, one accent used sparingly for
  emphasis. Strong text/background contrast (WCAG AA, 4.5:1 for body text).
- Type: titles 36-44 pt, body 14-16 pt minimum (18+ for live presentation), at most two fonts.
  Prefer fonts LibreOffice renders at true width (Arial, Calibri, Cambria, Times New Roman,
  Courier New) when the QA render must be trusted; others (Georgia, Aptos) may be substituted,
  so text-fit checks on them are approximate.
- Layout: margins at least 0.5 in; consistent gaps of 0.3-0.5 in; left-align body text; align
  edges to a grid. Vary layouts across the deck (two-column, big number, chart + takeaway, image
  + text) instead of repeating title + bullets.
- Every slide carries a visual element (chart, table, diagram, image, large number), but no
  decoration: no accent lines under titles, no edge stripes, no clip art, no gradients for show.
- One idea per slide; titles are full-sentence takeaways; at most ~6 bullets of one line each.
- Diagrams: build with shapes, or see atelier:diagrams; for slide aesthetics see atelier:frontend-design.

## Visual QA (required before delivery)

Render every slide to an image and look at each one:

```bash
rm -rf qa && mkdir qa
soffice --headless --convert-to pdf --outdir qa/ deck.pptx
pdftoppm -jpeg -r 110 qa/deck.pdf qa/slide       # qa/slide-01.jpg ...
```

Check in this order:
1. Text overflow: text running past its box, the slide edge or into the footer (most common defect).
2. Overlaps: shapes or text colliding; chart labels clashing.
3. Leftover template content: placeholder prompts ("Click to add title"), sample text, empty
   placeholders that render as boxes, unused template groups.
4. Spacing: margins under 0.5 in, uneven gaps, misaligned edges between similar elements.
5. Contrast and legibility: light text on light fills, tiny chart labels.
6. Consistency: same title position, font sizes and colors across slides.

Also scan the extracted text: grep for `lorem|ipsum|TODO|TBD|\[insert|xxx|Click to` and for
numbers that disagree between slides. For a fresh eye, have a separate reviewer (a subagent, if
available) inspect the images with this checklist without seeing your intent. Fix, delete the old
images, re-render, and re-check until a full pass finds nothing.

Fixes for overflow, in order: cut words, split the slide, enlarge the box, then reduce font size
(never below the minimums above). Avoid relying on autofit; LibreOffice and PowerPoint differ.

## Review checklist

- [ ] Storyline: each title states a takeaway; the sequence answers the audience's question.
- [ ] Every number traces to a source; estimates labelled; units and periods stated.
- [ ] Brand or template applied; fonts and colors consistent.
- [ ] Visual QA pass clean on every slide (overflow, overlap, leftovers, spacing, contrast).
- [ ] Speaker notes present if the deck is presented by someone else.
- [ ] Charts native and editable; images sharp at full size.
- [ ] File opens without repair prompt; slide count and order as agreed.
- [ ] Copy tightened (atrium:copywriting, atrium:copy-editing, forge:humanizer).
