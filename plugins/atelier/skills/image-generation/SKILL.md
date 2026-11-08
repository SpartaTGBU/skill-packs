---
disable-model-invocation: true  # skl: on-demand pack skill
name: image-generation
description: >
  Generate and edit raster images with diffusion and multimodal models: subject-first prompt
  grammar, quoted in-image text, edit-vs-generate choice, model routing, a local prompt library
  with recorded results, a seeded iteration loop, and consent and licensing checks. Use when asked
  to make a hero image, illustration, product shot, photo edit, mockup, texture or concept art with
  an AI image model, to pick which image model to use, or to improve a prompt that keeps failing.
---

# Image generation

Treat a generated image like any other asset: briefed, reproducible, reviewed, licensed.
Local graph pipelines live in `atelier:comfyui`; delivery formats and manifests in
`atelier:asset-pipeline`; vector work in `atelier:illustration-and-icons`.

## 1. Brief before prompting

Write five lines before the first call:

| Field | Example |
|---|---|
| Purpose and placement | Landing hero, right column, behind headline |
| Output | 2400x1350 (16:9), PNG master, sRGB |
| Subject | One ceramic teapot, steam, three-quarter view |
| Style anchor | Studio product photo, soft key light from left, matte grey sweep |
| Must not | No hands, no text, no logos, no extra objects |

Pick the aspect ratio from the layout slot, not the model's default square. Generate at or above
the final pixel size, or plan an upscale pass (`atelier:comfyui`, upscaling recipe).

## 2. Prompt grammar (subject first)

Order clauses by importance; models weight early tokens more and drop late detail.

```
[subject + action] , [setting] , [composition / camera] , [lighting] , [style / medium] , [palette] , [quality / constraints]
```

- One subject per sentence. Name counts ("two birds"), positions ("left third"), and relations.
- Camera language works on photo models: lens (35mm, 85mm), angle (low, eye level, top-down),
  depth of field, framing (close-up, medium, wide).
- Style by medium and era ("risograph print, two inks"), not by living artist's name.
- In-image text: put the exact string in double quotes and say where it goes:
  `a shop sign reading "OPEN LATE" in bold condensed sans, centered`. Keep it under ~6 words;
  check every letter in the output. For anything longer, render text in code over a clean plate.
- Negative constraints: models with a negative-prompt field (SD-class, some Flux pipelines) take
  them there; instruction models take "no X" sentences, used sparingly.
- Natural-language models (Nano Banana, GPT Image) prefer full sentences; tag-trained local
  checkpoints prefer comma lists. Match the model.

Anti-slop: avoid default glossy-3D-blob, purple-teal gradient, centered symmetrical "epic"
composition, plastic skin, lens flare, and "8k ultra detailed masterpiece" filler. Specify a real
material, a real light source and an off-centre composition instead.

## 3. Edit or generate

| Situation | Do |
|---|---|
| Image is 80% right | Edit: masked inpaint or instruction edit ("make the mug blue, keep everything else") |
| Need same subject in new pose/scene | Reference-image or character-consistency mode; or a trained LoRA locally |
| Wrong composition | Regenerate; edits will not fix layout |
| Exact layout, product or logo | Generate background plate only; composite the real asset in code or an editor |
| Need more pixels | Upscale; do not regenerate at a larger size and lose the approved image |

Instruction edits: name what changes and what must stay ("keep lighting, framing and the face
unchanged"). One change per edit pass; chained small edits beat one big edit.

## 4. Model routing (as of 2026-11; check vendor docs, this moves fast)

| Need | First choice | Notes |
|---|---|---|
| Everyday instruction following, multi-turn edits, consistency across a set | Nano Banana (Gemini image models; Pro tier for portraits and fine detail) | Strong at "change only X" edits; outputs carry an invisible watermark |
| Photoreal product, people, environments | FLUX (FLUX.2 family; Kontext-style models for edits) | Open-weight variants exist; check each variant's license |
| Legible text, layout, diagrams-as-images, UI mockups | GPT Image | Best at long quoted strings; still verify spelling |
| Hero art, mood, aesthetic exploration | Midjourney | No official public API; manual or approved workflows only |
| Private data, offline, batch, LoRA, ControlNet, full control | Local SD-class (SDXL, SD3.5, open FLUX, Qwen-Image) via `atelier:comfyui` | Reproducible by seed; needs a GPU (8 GB VRAM floor for SDXL, 12-24 GB for FLUX-class) |

Use the project's existing provider when one is configured. Do not add a paid API without asking.
Never hard-code API keys; read them from the environment.

## 5. Prompt library (retrieve before writing)

Keep a local, versioned library and search it before writing a prompt from scratch:

```
prompts/
  library.jsonl        # one record per kept result
  outputs/<id>.png     # the image the record describes
```

Record per generation worth keeping:

```json
{"id":"2026-11-01-teapot-03","model":"flux-2-pro","model_version":"<as reported>",
 "prompt":"...","negative":"","seed":184467,"size":"2400x1350","steps":28,"cfg":3.5,
 "refs":["refs/teapot.jpg"],"edit_of":null,"output":"outputs/2026-11-01-teapot-03.png",
 "verdict":"keep","notes":"left light too hard; try 30% softer","license":"vendor ToS 2026-11"}
```

- Grep the library by subject and style before prompting; adapt a proven prompt instead of
  inventing one.
- Log failures with a one-line reason too; they stop repeat mistakes.
- Hosted models without seed control: record request id and timestamp instead; accept that
  exact reproduction is not guaranteed.

## 6. Iteration loop

1. Draft prompt from the brief (or from a library hit).
2. Generate 4 variants at low cost (draft tier, smaller size, fewer steps).
3. Look at every variant. Score against the brief: subject, composition, light, style, text,
   artifacts (hands, eyes, teeth, edges, duplicated limbs, melted text, extra fingers).
4. Change ONE thing per round: wording, seed, guidance, reference, or model. Fix the seed while
   tuning words; vary the seed once words are right.
5. Stop at 3-5 rounds. If still wrong, change approach (edit, reference image, composite, or a
   different model) instead of piling on adjectives.
6. Final at full size, then upscale/clean, then hand to `atelier:asset-pipeline`.

Verify by opening the final file at 100% and at the size it will display. Check text letter by
letter, check the crop on mobile, and check contrast of any overlaid UI text (4.5:1 body,
3:1 large).

## 7. Consent, likeness, licensing

- Real people: generate or edit a recognizable person only with documented consent and for the
  agreed use. No sexualised, defamatory or deceptive depictions of real people, ever.
- No impersonation: no fake press photos, fake receipts or documents, or brand logos presented
  as genuine.
- Reference images: use only images you have rights to; record their source in the manifest.
- Style: do not prompt by a living artist's name for commercial work; describe the technique.
- Terms: commercial-use rights differ by vendor, tier and open-weight license (some open
  weights are non-commercial). Record the model, version and license in the record and in the
  asset manifest.
- Disclosure: keep vendor watermarks and C2PA credentials intact; label AI imagery where the
  platform or law requires it.
- Never upload private or client data to a hosted model without permission; route to local.

## Done checklist

- [ ] Brief written; aspect and size match the slot
- [ ] Prompt, model, version, seed/request id, refs saved in the library
- [ ] Output viewed at 100%; text and anatomy checked
- [ ] Consent and license recorded; watermarks/credentials intact
- [ ] Master saved; delivery variants made via `atelier:asset-pipeline`
