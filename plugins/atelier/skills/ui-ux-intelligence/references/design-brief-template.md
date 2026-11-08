# Design brief template

Save as DESIGN.md at the project root (or `design/MASTER.md`, with `design/pages/<name>.md` for
overrides; the page file wins). Delete sections that do not apply.

```
# <Product> design brief
Intent: <one sentence: who it serves, what they do, how it should feel and why>
Surface: persuade | operate | read | transact     Platform: <...>     Stack: <...>
Dials: variance <n>  motion <n>  density <n>

## Tokens
Color roles: background, surface, text, text-muted, primary, accent, success, warning, danger, border, focus (light + dark values, measured contrast per pair)
Type: family, scale steps (size/line-height), weights; named styles (heading, title, body, caption, button)
Space: fixed token list, no in-between values
Radius, elevation, icon size and stroke; motion durations and one easing

## Components
For each: anatomy, variants, states (default, hover, focus-visible, active, disabled, loading, error, empty), sizes, keyboard/pointer/touch behavior, edge cases (long label, overflow)

## Pages
Pattern per page, section order, primary action, proof placement

## Accessibility acceptance
Testable lines: contrast pairs, target sizes, focus order, reduced motion, text scaling

## Do / Don't
Each do paired with a concrete don't

## Review checklist
Runnable in code review; mirrors the pre-delivery list
```

Author notes: tokens first; no rule that depends only on an adjective; say "must" for
non-negotiable and "should" for preference; when aesthetics and accessibility clash, accessibility wins and the conflict is noted.
