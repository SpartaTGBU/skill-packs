# Product demos

Rebuild the app's screens with its own colors, fonts and wording; a cursor clicks and types; the camera zooms to what the voice names.

## Capture
Open the live site clean (no cookies, no login). Save first-screen and full-page shots at 2x pixel density so zooms stay sharp [practice] (very tall full-page captures may need slicing [practice]; upstream's tool caps at 8000 px [upstream tool default]), mobile if relevant, computed colors, fonts, logo, and exact wording of headings, nav, buttons, labels. Crop cookie banners and chat widgets. Check each font's licence allows video use [practice].

## Truth rules
- Labels come from the app's own templates.
- Show only shipped features; no admin or debug views, no roadmap.
- Sample data looks like sample data (example.com, an invented project). No made-up customers or results.
- Claims in narration trace to the live site; show prices only if the site does.
- If site and app disagree, ask.

## Brand setup [practice]
Accent (primary button), background, ink, body font, headline font (serif fallback ok), logo (SVG preferred), on a clean look.

## Cursor
- Every click is tied to a marker so it lands on the spoken word.
- Lead time: start the move about 0.5-1 s before the click [practice; upstream's example cues the move at the target time minus 0.7 s]; measure by scrubbing frames and confirm the cursor rests on the target for 2+ frames before the click.
- Keep the first click at least 0.7 s into the scene so the transition does not hide it [upstream tool default].
- Typing is driven by a cue so it ends on the word.
- Keep key text out of the bottom-right corner (watermarks, zoom crops) [practice].
- Product name as plain text in frame one.
