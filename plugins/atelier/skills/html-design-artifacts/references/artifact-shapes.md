# Artifact shapes

Pick one shape per file. Every size and number here is tagged [practice] inline: generic web defaults, not from any tool; change with the user's targets.

| Shape | Stage | Navigation | Per-view budget | Typical blocks |
|---|---|---|---|---|
| Board | free canvas, grid of fixed-size artboards on a grey ground | scroll or pan; optional jump list | one screen state per artboard, label above | `section.board > figure.artboard#id` |
| Deck | 1280x720 stage (example) [practice] scaled to the window | arrows, counter, hash per slide (`#s3`) | one idea, about 40 words max [practice] | `section.slide#sN` |
| Prototype | device frame at 390x844 or 1440x900 [practice] | clicks between `section.screen` elements; Back works | one task per path, 3 to 7 screens [practice] | `[data-go="screen-id"]` |
| Wireframe | grey single-colour layout on page width | scroll | regions labelled, no imagery | `div.box[data-label]` |

## Decision rules

- [practice] Slide over 40 words: split it into two slides or move detail to a notes line.
- [practice] Prototype under 3 screens is a single view (use a board); over 7, cut paths or split the file.
- [practice] File over 5 MB: split by shape or reduce images (see SKILL.md packaging).

## Skeleton rules

- Root custom properties hold tokens: colours, two font stacks, spacing step, radius.
- Scale a fixed stage with one `transform: scale()` computed from `innerWidth / W` and
  `innerHeight / H` (W, H = stage size) (take the smaller); never scale individual elements.
- Screens toggled by `hidden` attribute and a `location.hash`, so each state has a link and the
  browser Back button behaves.
- A variant switcher (theme, density, copy length) writes `data-*` attributes on `<html>`; CSS reads
  them. No framework needed.
- Print: `@page { size: 1280px 720px; margin: 0 }`, `.slide { break-after: page }`. Verify [practice]: print to PDF; page count equals slide count and no slide is clipped or split.
- Every artboard or slide carries a visible id label outside the design area, hidden in print.
