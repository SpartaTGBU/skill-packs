# Scenes, layouts, camera

## Building a scene
A scene is a function of time. Create every element unconditionally and give it enter/exit times (seconds, word, or marker). Draw order: camera, background, headline, content, cursor on top. Arrows reference only earlier elements. If an enter time is past scene end, lengthen the hold.

## Layout choice [practice]
Place from the safe area and a unit derived from the long side, never fixed pixels. Portrait stacks what landscape puts side by side.
| Content | Layout | Test |
|---|---|---|
| One figure | Large number plus caption | Number height under 40% of the narrow side, caption still 32 px or more |
| Comparison of two | Two cards, one note each | Card widths and top edges equal within 2% |
| Process of 3+ steps | Boxes in sequence joined by arrows | One arrow per cue |
| One thing with parts | Central box, parts around it | Parts 6 or fewer |

## Camera
| Rule | Test |
|---|---|
| Scene is one full picture; camera only adds close-ups | Frame at scene end shows all elements |
| Open wide, or start close and widen; end pulled back [practice] | Last still shows every element of the scene (zoom 1.0) |
| A shot holds whole cards and labels | No label clipped by the frame edge; arrows may leave |
| Next element near the previous | Both fit in one shot |
| Bare lines or unlabeled icons get no close-up | Label them or aim at a labelled thing |
| Travelling object | Camera static while it moves |
| Headline near the top | Zoom about 1.1 or less keeps it whole, 1.3 or more pushes it out [upstream tool behaviour, check by still] |

## Looks [practice]
Looks: hand-drawn, clean product, chalk, blueprint, dark developer, editorial. Choose by the brand or subject the user gave; do not infer taste from audience type. Pass/fail on the chosen look: (1) text contrast 4.5:1 or better, (2) nothing under the 32 px floor, (3) the look matches a reference the user named or the product's own colors and fonts; if no reference exists, use clean product. Exact geometry (a radius touching a circle) uses plain strokes because hand-drawn wobble breaks it.

## Safe areas
Vertical apps overlay buttons and captions. Numbers for 1080x1920 [upstream presets, 2026 templates]: top 15%, bottom 35%, right up to 20%, left up to 11%. Test: crop those bands from a still; only background allowed. Captions sit just above the bottom 35%; logo in a top corner below the 15% line.

## Other blocks
Charts, TeX (one fixed string per formula), code morphs, terminal commands, icons, screenshots, clips (record at fixed fps, trim first), alpha overlay export, GIF for READMEs.
