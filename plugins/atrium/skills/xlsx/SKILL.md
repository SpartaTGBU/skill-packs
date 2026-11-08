---
disable-model-invocation: true  # skl: on-demand pack skill
name: xlsx
description: >
  Create, read, edit and review Excel workbooks (.xlsx, .xlsm, .csv) with openpyxl and pandas:
  live formulas instead of pasted values, financial formatting conventions, charts, and a
  LibreOffice headless recalculation check that catches formula errors before delivery. Use when
  a spreadsheet is input or output, when asked for a model, tracker, budget, forecast or data
  export in Excel, to clean or analyze tabular data, fix broken formulas, or convert between
  xlsx, csv and ods.
---

# Excel workbooks (.xlsx)

A workbook that will be reused must stay live: inputs in cells, everything else computed by
formulas a reviewer can trace. Python is for building and checking the sheet, not for doing the
math and pasting results.

## Discovery first

- What decision or process does the sheet support, and who maintains it after you?
- Inputs and their sources (exports, invoices, the user's assumptions). Never invent figures;
  if a number is an estimate, label it in an adjacent note cell and say who or what it came from.
- Existing workbook or template? If so, its conventions (colors, number formats, sheet layout,
  naming) override everything below. Match them.
- Period granularity (monthly/quarterly), currency, fiscal year start, units (thousands?).
- Ask for anything missing before building; a model on guessed inputs is worse than none.

## Pick the tool

| Task | Tool |
|---|---|
| Analyze, clean, pivot, join data | pandas (`pd.read_excel(path, sheet_name=None)` loads all sheets) |
| Build or edit a workbook with formulas and formatting | openpyxl |
| Preserve macros (.xlsm) | `load_workbook(path, keep_vba=True)` |
| Recalculate, convert .xls/.ods/.csv | `soffice --headless --convert-to xlsx file` |

If an import fails, install `openpyxl` / `pandas` with pip. pandas writes values only and drops
formatting; use it for data, openpyxl for the deliverable.

## Formulas, not hardcoded results

```python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill
from openpyxl.utils import get_column_letter

wb = Workbook()
inp = wb.active; inp.title = "Inputs"
inp["A1"], inp["B1"] = "Growth rate", 0.08                  # store 8% as 0.08
inp["A2"], inp["B2"] = "Starting revenue", 120000
inp["C1"] = "Estimate: owner's plan, Oct call"               # source / label every assumption
for c in ("B1", "B2"):
    inp[c].font = Font(color="0000FF")                       # blue = input

m = wb.create_sheet("Model")
m["A1"] = "Year"; m["A2"] = "Revenue"
for i in range(5):
    col = get_column_letter(i + 2)
    m[f"{col}1"] = str(2026 + i)                             # years as text, no 2,026
    m[f"{col}2"] = "=Inputs!B2" if i == 0 else f"={get_column_letter(i+1)}2*(1+Inputs!$B$1)"
    m[f"{col}2"].font = Font(color="008000" if i == 0 else "000000")  # green = cross-sheet link
    m[f"{col}2"].number_format = '$#,##0;($#,##0);"-"'
wb.save("model.xlsx")
```

Rules:
- Every total, ratio, growth step and lookup is a formula (`=SUM(B2:B13)`, `=B5/B4`), never a
  value computed in Python. The only typed numbers are inputs, each in one place.
- No magic numbers inside formulas: `=B4*(1+$B$1)`, not `=B4*1.08`. Use absolute refs (`$B$1`)
  for assumptions so formulas copy cleanly across.
- Guard divisions: `=IF(B4=0,"-",B5/B4)` or `=IFERROR(B5/B4,0)` where zero is meaningful.
- Quote sheet names with spaces: `='Q3 Actuals'!B2`.
- Prefer widely supported functions (SUM, SUMIFS, INDEX/MATCH, IF, ROUND, EOMONTH). Newer dynamic
  functions (XLOOKUP, FILTER, UNIQUE, LET, SEQUENCE) need an `_xlfn.` prefix when written by a
  library and may break in older Excel or LibreOffice; avoid unless the user's Excel supports them.
- Merged cells: write only the top-left cell. Avoid merging inside data ranges (breaks sorting).
- Keep one formula pattern per row; an odd one-off cell in a row is where errors hide.

## Editing an existing workbook

- `load_workbook(path)` keeps formulas as strings. `load_workbook(path, data_only=True)` gives
  the last cached values, which are `None` if the file was never opened in a spreadsheet app.
- Never save a workbook opened with `data_only=True`: every formula is replaced by its value.
  Open twice if you need both views: one to read values, one to edit and save.
- openpyxl drops pivot tables, slicers and some chart types it does not understand. If the file
  has them, check after saving, or edit only data sheets and warn the user.
- Inserting rows/columns does not rewrite references in other formulas. Prefer appending, or
  rebuild affected formulas and re-run the error scan.
- Large files: `load_workbook(path, read_only=True)` to read; `Workbook(write_only=True)` to write.

## Formatting conventions (unless the file or user has its own)

| Element | Convention |
|---|---|
| Hardcoded inputs | Blue font (0000FF) |
| Formulas | Black font |
| Links to other sheets | Green font (008000) |
| Links to other files | Red font (FF0000); avoid external links where possible |
| Key assumptions to review | Yellow fill (FFFF00) |
| Currency | `$#,##0;($#,##0);"-"`, units in the header ("Revenue ($000)") |
| Percent | Stored as fractions, format `0.0%` |
| Multiples | `0.0"x"` |
| Years | Text ("2026"), not numbers |
| Negatives | Parentheses, not minus signs |

Also: bold header row, freeze panes below headers (`ws.freeze_panes = "B2"`), sensible column
widths, inputs and outputs on separate, clearly named sheets, a short Notes sheet listing
assumptions with sources and dates. Charts: openpyxl `BarChart`/`LineChart` with a
`Reference` to the formula cells, so they update with the model.

## Recalculate and scan for errors (required before delivery)

openpyxl does not calculate. Have LibreOffice recalculate, then read cached values:

```bash
mkdir -p recalc && soffice --headless --calc --convert-to xlsx --outdir recalc/ model.xlsx
```

```python
from openpyxl import load_workbook
ERRORS = ("#REF!", "#DIV/0!", "#VALUE!", "#NAME?", "#N/A", "#NUM!", "#NULL!")
vals = load_workbook("recalc/model.xlsx", data_only=True)
forms = load_workbook("model.xlsx")
problems, n_formulas = [], 0
for ws in forms.worksheets:
    for row in ws.iter_rows():
        for cell in row:
            if isinstance(cell.value, str) and cell.value.startswith("="):
                n_formulas += 1
                v = vals[ws.title][cell.coordinate].value
                if v is None or (isinstance(v, str) and v.startswith(ERRORS)):
                    problems.append((ws.title, cell.coordinate, cell.value, v))
print(n_formulas, "formulas;", len(problems), "problems")
for p in problems[:50]:
    print(p)
```

Fix every problem and re-run until clean. Deliver the original (`model.xlsx`) or the recalculated
copy; the recalculated one opens with values visible in viewers that do not calculate.

A clean scan proves the formulas evaluate, not that they are right. Then:
- Spot-check 3-5 key outputs by hand (or a quick pandas calculation) against the formula result.
- Check ranges cover all rows (a `SUM(B2:B12)` that misses row 13 is the classic error).
- Check signs (costs negative or positive consistently) and units (thousands vs units).
- Check off-by-one references when a formula is copied across periods.

## Data work with pandas

- Read with explicit `dtype` for IDs and ZIP codes so leading zeros survive; parse dates with
  `parse_dates`. Check `df.shape`, `df.isna().sum()`, duplicates on key columns before analysis.
- Report row counts at each step (loaded, filtered, deduplicated) so the result is auditable.
- Write results with `df.to_excel(path, index=False)`, then open with openpyxl to format; or keep
  raw data on a Data sheet and build summaries as formulas (SUMIFS over the Data sheet).
- CSV out: state encoding (UTF-8 with BOM if the user opens it in Excel) and delimiter.

## Review checklist

- [ ] Discovery answered; every input has a source or an "estimate" label.
- [ ] No hardcoded results where a formula belongs; no constants buried in formulas.
- [ ] Recalc scan: zero errors, zero empty formula results.
- [ ] Key outputs spot-checked; ranges, signs and units verified.
- [ ] Formatting conventions applied consistently (or the existing file's conventions matched).
- [ ] Headers, frozen panes, column widths, sheet names readable; no leftover test data.
- [ ] Macros preserved if .xlsm; pivots/charts still present if the source had them.
- [ ] Workbook opens without repair prompts (LibreOffice conversion succeeded without warnings).

Related: atrium:financial-modeling (three-statement models, scenarios, DCF structure),
atrium:saas-metrics (MRR, churn, cohort sheets), atrium:bookkeeping-close (reconciliations),
atrium:marketing-analytics (campaign data). Forecasts and valuations are planning aids, not
investment or tax advice; recommend a qualified professional for high-stakes decisions.
