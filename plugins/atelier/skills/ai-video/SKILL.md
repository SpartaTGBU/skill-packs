---
disable-model-invocation: true  # skl: on-demand pack skill
name: ai-video
description: >
  Plan, prompt and assemble AI-generated video shots (Higgsfield, Seedance, Kling, Veo, Runway,
  Wan and similar): a shot list, a shot-grammar prompt per clip, image-to-video from locked
  keyframes, one camera move per shot, model routing, a cost check before batches, consent for
  likeness and voice, and continuity across shots. Use when asked to generate a video clip, ad,
  b-roll, cinematic shot, music-video sequence, or animate an image with an AI video model.
---

# AI video

Generated video is shot-based, not film-based: each model call yields one 4-10s shot. Treat it like
directing a shoot with an unreliable camera: plan shots, lock the look in stills, generate each
shot from a keyframe, pick takes, then cut. Edit and finish with atelier:video-editing; motion
graphics and titles with atelier:video-composition; check every take with atelier:visual-qa.

## 1. Before generating anything

1. **Consent and rights.** A real person's face, body or voice needs that person's documented
   consent for this use; never generate a real public figure, a private individual from a photo,
   or a cloned voice without it. No minors in likeness work. Check the brand/IP of any logo,
   character or product shown. Label generated content where platforms or law require it
   (e.g. platform AI-content toggles, EU AI Act transparency for deepfakes).
2. **Shot list** (a table, agreed before spending): shot #, duration, purpose in the story,
   subject, action, camera move, framing, transition in/out, audio.
3. **Cost check.** Look up the current per-second or per-generation price and credits for the
   chosen model and tier; estimate `shots x takes (3-4 each) x seconds x price` plus keyframe
   images. State the estimate and get approval before any batch over a few calls. Run one test
   shot at the lowest tier/resolution first.
4. **Access.** Use the vendor's official API, CLI or MCP with the user's own key from the
   environment; never paste keys into prompts, files or logs. Higgsfield and similar aggregators
   front several models under one account; direct vendor APIs (Runway, Google Veo via Vertex/
   Gemini, Kling, ByteDance Seedance via its cloud) are equally valid. Local open-weight models
   (Wan, HunyuanVideo, LTX-Video) through ComfyUI (atelier:comfyui) avoid per-shot cost when a GPU
   with enough VRAM exists.

## 2. Shot-grammar prompt

One prompt per shot, in this order; one sentence or short clause per slot:

| Slot | Content | Example |
|---|---|---|
| Subject | who/what, with fixed identifying details | a woman in a rust wool coat, short black bob |
| Action | one verb phrase, physically plausible in the duration | turns from the window and looks at camera |
| Camera move | exactly one | slow push-in |
| Lens / framing | focal length, shot size, angle | 50mm, medium close-up, eye level |
| Light | source, direction, quality, time | soft window light from left, overcast morning |
| Style | medium, film stock, grade, era | 35mm film, muted teal-orange grade, fine grain |
| Duration | seconds, and pace | 5s, unhurried |

Add a short negative/avoid list only if the model supports it (e.g. "no text, no extra people,
no morphing hands"). In-frame text renders poorly: add titles later in compositing.

**Camera moves (one per shot):** static/locked-off, push-in (dolly in), pull-out, pan L/R, tilt
up/down, truck/track L/R, pedestal, orbit/arc, crane up/down, handheld (subtle), FPV fly-through,
crash zoom, dolly zoom (vertigo). Combining moves ("orbit while zooming and tilting") is the most
common cause of warped geometry; split it into two shots instead.

Action budget: one main action per shot, sized to the duration (a 5s shot holds a turn, a step,
a pour; not "walks in, sits, opens laptop, smiles"). Physics-heavy actions (liquids, hands with
objects, crowds, fast sports) fail most; frame them so failure is cheap to hide.

## 3. Image-to-video from locked keyframes

Text-to-video drifts in identity, wardrobe and palette between shots. The reliable path:
1. Build a **look frame** and **character/product sheet** in stills (atelier:image-generation):
   same subject at 2-3 angles, wardrobe and palette fixed.
2. Generate one **keyframe per shot** at the delivery aspect ratio (16:9, 9:16), composed as the
   first frame. Approve keyframes as a storyboard before any video spend.
3. Image-to-video each keyframe; the prompt then only describes **action + camera + pace**, not
   appearance (the image carries it). Restating appearance invites drift.
4. Where supported, give a start and end frame to control where the move lands; use the end frame
   of shot N (extracted at full resolution) as the start frame of shot N+1 for continuous action.
5. Use reference/"elements"/character features for identity when the model offers them.

## 4. Model routing (subject to change; checked 2026-11)

Models update every few months; confirm current versions, limits and prices before choosing.

| Need | Strong options | Notes |
|---|---|---|
| Photoreal, natural motion, native audio | Veo (Google), Seedance (ByteDance) | Veo generates synced dialogue/SFX; good prompt adherence |
| Character action, dynamic motion, start/end frames | Kling | strong physics; multiple durations |
| Multi-shot consistency, camera control | Seedance, Runway | Runway offers references and video-to-video restyle |
| Stylized, anime, motion effects presets | Higgsfield presets, Kling, Hailuo/MiniMax | aggregator presets map to camera-move vocabulary |
| Restyle or extend existing footage | Runway video-to-video, Luma | keep source motion, change look |
| Talking head / lip-sync | dedicated lip-sync/avatar models | consent required (section 1) |
| Local, private, no per-shot fee | Wan 2.x, HunyuanVideo, LTX-Video via ComfyUI | needs 12-24 GB+ VRAM; slower, lower ceiling |

Route per shot, not per project, but keep shots that cut together on the same model and settings
where possible: mixing models within a scene shifts grain, color and motion style.

## 5. Generation loop

- Fix and log per take: model + version, mode (t2v/i2v), prompt, negative, seed (if exposed),
  duration, resolution, aspect, keyframe file, cost. Save into `shots/<nn>/takes.jsonl` next to
  the outputs so any take is reproducible.
- Generate 2-4 takes per shot; change one variable at a time between rounds (move, then action
  wording, then style).
- Generate at the delivery aspect; cropping 16:9 to 9:16 later throws away most of the frame.
- Upscale and frame-interpolate only the selected takes, at the end.

## 6. Pick takes (look, do not trust thumbnails)

Extract frames (atelier:visual-qa) and reject takes with: morphing faces or hands, extra limbs or
fingers, identity drift within the shot, objects popping in/out, warped straight lines and text,
melting backgrounds during camera moves, physics errors (liquids, cloth through bodies), flicker,
and motion that stalls in the last second. Trim the usable span; the first and last 0.5s are often
weakest.

## 7. Continuity across shots

- Same subject sheet, wardrobe, palette, light direction and time of day across a scene; write
  them once in a scene bible and paste the same phrasing into every prompt.
- Respect screen direction (180-degree rule): a subject exiting right enters the next shot from
  left. Match eyelines in shot/reverse-shot.
- Cut on action: end shot N mid-movement and start shot N+1 continuing it.
- Vary shot size between consecutive shots (wide, medium, close) so cuts do not jump.
- Unify in the edit: one grade/LUT over all shots, matched grain, consistent frame rate (conform
  everything to 24 or 30 fps, no mixed rates), and a sound bed that runs across cuts.

## 8. Assemble and deliver

1. Conform takes (fps, size, pix_fmt) and cut in atelier:video-editing; add titles/captions with
   atelier:video-composition rather than prompting text into frames.
2. Audio: model-native audio, licensed music, or VO with consent; master to -14 LUFS for social.
3. Disclose AI generation where required; keep the takes log as provenance.
4. Run atelier:visual-qa on the final cut, then forge:verification.

## Anti-patterns

- Spending on a full batch before a one-shot test and an approved cost estimate.
- Several camera moves, or several actions, in one prompt.
- Re-describing appearance in image-to-video prompts; text-to-video for recurring characters.
- Generating legible text, logos or UI inside the shot instead of compositing it.
- Real people or voices without consent; unlogged prompts and seeds.
- Shipping the first take without frame-level review.
