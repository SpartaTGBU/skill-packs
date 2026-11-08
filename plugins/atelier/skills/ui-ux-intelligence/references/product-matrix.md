# Product matrix (starting points, [practice])

Our own heuristics; the columns are a common way to organise this (pro-max uses similar ones), the rows are ours; every row ends with a checkable test; adjust to the actual audience. Each row is a
default to argue against, not a verdict. Contrast and target numbers in SKILL.md apply to all rows.

| Product | Mood (color) | Look and type | Layout to start from | Rule out | Row test |
|---|---|---|---|---|---|
| B2B SaaS | Cool neutrals, one saturated action hue | Flat with light depth; neutral sans | Hero, proof, how it works, pricing | Neon, heavy glass, stock-photo heroes | Primary button vs page background at 3:1 or more, text on it 4.5:1 [WCAG] |
| Developer tool | Low chroma, one accent | Dark-capable, dense; sans plus mono | Code-first hero, docs link prominent | Marketing fluff above the install step | Light and dark themes both pass 4.5:1 [WCAG] for code and body text; code font is monospace |
| Fintech / banking | Deep blue/green, plain neutrals | Restrained, 7:1 text contrast where space allows [practice]; tabular numerals [practice] | Trust strip, numbers stated plainly | Playful gradients, ambiguous confirmations | Money figures use tabular numerals [practice]: digits in a column align (check with a right-edge ruler) |
| Healthcare | Soft cool or green, dark text | Body 18px+ and line height 1.6+ [practice]; humanist sans | Booking or contact first, reassurance | Low-contrast pastels, tiny type | Body text 18px or more [practice]; no text under 16px at 375 wide [practice] |
| Wellness / beauty | Warm neutrals, muted accent | Soft depth, organic shapes; serif display plus sans | Emotion-led hero, services, booking | Harsh motion, neon, dark-heavy | Muted accent text still 4.5:1 [WCAG] on the warm background |
| E-commerce | Neutral base, one sale accent | Neutral frame so product shows; legible sans | Browse, filter, product, checkout | Decorative layouts that hide price or stock | Price and stock visible on the card without hover (screenshot at 375) |
| Creative portfolio | Mostly monochrome plus one accent | Expressive allowed; one display face distinct from body face [practice] | Work first, minimal chrome | Slow intros before any work appears | First work item visible within one viewport at 1440 and 375 |
| Dashboard / analytics | Neutral base, color-blind-checked categorical set | Flat, dense; sans with tabular numerals | KPI strip, trend, detail table | Decorative charts, color-only legends | Every chart passes grayscale: series still distinguishable |
| Content / docs | Paper-like, high contrast | No decoration behind text; readable serif or sans, 60-75ch measure [pro-max] | Reading column, nav, search | Narrow low-contrast text, auto-playing media | Measure 60-75 characters [pro-max] by counting one desktop line |
| Consumer mobile app | Brand accent on neutral | Platform-native; system font first | Tab bar (5 max [practice]), one-hand reach | Gesture-only critical actions | Tab bar has at most 5 items [practice] and each hit box measures 44pt or more [pro-max] |

How to use: find the nearest row, copy the Avoid column into the brief, then change one thing
deliberately so the result is not the row's cliche. For a hybrid, take pattern from the job and
style from the audience.
