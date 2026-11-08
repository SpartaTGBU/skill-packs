# Starting values

Rough starting points of our own; keep a project's own good system and fix how it is used.
Tagged figures are restated from Hallmark (MIT, NOTICE.md) or are WCAG thresholds.

- Spacing: one base step (4px is common), everything a multiple of it.
- Buttons: app controls compact with an expanded hit area; marketing controls larger, 44-52px tall [H].
- Marketing sections [H]: gaps of at least 120px at 1440, varied; section heads at least 40px at 1440. Landing pages only, not app screens.
- Containers [H]: cap near 1360-1520, never past 1920.
- Neutrals: pick a tint by setting (graphite for apps, warm for paper/food/craft, ink for night/water/technical) with very low saturation. Roles: deepest surface, page, card, raised, hairline, primary/secondary/muted text. Hairline is the text colour at low opacity.
- Accent: a real brand colour becomes the accent and leaves the surfaces; otherwise take a hue from the setting (warm: amber/coral; cool: cobalt/teal; natural: moss/sage). Avoid violet-blue unless the brand is that. It covers a small share of the screen.
- Buttons by theme: primary is the accent or a text-colour fill; secondary is a raised surface with a hairline.
- Contrast: body text 4.5:1; large text, icons, focus rings, field edges 3:1 [H, matches WCAG]; functional text not under 11px [H gate 75].
- Type: body around 16px with comfortable leading; headlines scale down on phones.
- Motion: one ease-out curve (for example `cubic-bezier(0.2, 0, 0, 1)`); feedback faster than entrances; both well under half a second.
