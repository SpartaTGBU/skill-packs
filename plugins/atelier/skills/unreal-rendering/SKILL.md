---
disable-model-invocation: true  # skl: on-demand pack skill
name: unreal-rendering
description: >
  Render cinematics and stills from Unreal Engine 5 with Level Sequences and Movie Render Queue:
  presets saved as assets, command-line and Python batch renders, warm-up frames, spatial and
  temporal anti-aliasing samples, EXR/ProRes output, path tracer settings, and Lumen/Nanite notes.
  Use when setting up a UE5 cinematic or product render, automating Movie Render Queue, getting
  clean motion blur and AA, rendering with the path tracer, or fixing flicker, noise or pop-in in
  rendered frames.
---

# Unreal rendering (UE5)

Goal: final frames that are reproducible from a saved config, rendered without clicking, and
checked frame by frame. Version matters a lot in UE5; state the engine version in every note and
check menu names against Epic's docs for that version (dev.epicgames.com). Assets come from
`atelier:3d-modeling`; finishing and encoding in `atelier:video-composition`.

## 1. Brief

Record: engine version, deliverable (stills or shots, resolution, fps, duration, color target
sRGB/Rec.709 or ACES/linear EXR for grading), engine path (Lumen real-time vs path tracer),
render-time budget per frame, hardware (GPU, VRAM), and which assets are licensed (Fab/Marketplace,
Quixel, scans, own).

## 2. Scene and sequence setup

- **Level Sequence** per shot (or a master sequence with shot tracks). Camera = **Cine Camera
  Actor** with real filmback (e.g. 36x24 mm), focal length 35-85 mm, focus via tracking or a
  keyed focus distance; aperture f/2.8-f/8.
- Keep frame rate set on the sequence (24/25/30/60) and render at the same rate.
- **Post Process Volume** (unbound) for exposure: set manual exposure (or min=max EV) for
  cinematics; auto exposure causes brightness pumping between frames.
- Lighting: directional + sky light + sky atmosphere for exteriors; rect lights for product and
  interior; light temperature in Kelvin. Keep physical intensities (lux, candela) consistent with
  the exposure.
- Animate with the sequencer, not with Blueprints running on tick, so renders are deterministic.

## 3. Movie Render Queue (MRQ)

Enable the Movie Render Queue plugin (plus Apple ProRes / Avid DNx plugins if needed). UE 5.4+
also ships the node-based Movie Render Graph; the same principles apply, configs are graph assets.

Configure once, save as an asset, reuse everywhere:

| Setting | Value / guidance |
|---|---|
| Output | resolution, frame range = sequence, file name `{sequence_name}/{sequence_name}.{frame_number}` |
| Anti-aliasing: spatial samples | 1-4 (more for fine detail, no motion blur) |
| Anti-aliasing: temporal samples | 8-32 for motion blur quality; total samples = spatial x temporal |
| Override AA method | set to None when using high sample counts (TSR/TAA smear across samples) |
| Engine warm-up count / render warm-up frames | 32-64 frames before the first shot frame; more for Lumen, particles, cloth |
| Use camera cut for warm-up | on when the sequence has pre-roll |
| Console variables | screen percentage, Lumen quality, motion blur quality, texture streaming off (examples below) |
| Game overrides | cinematic quality, disable texture streaming, LOD bias 0 |
| Output format | EXR 16-bit half (grading/comp), PNG 8-bit (stills), ProRes 422 HQ / 4444 (editorial) |
| Additional passes | object IDs, depth, motion vectors, custom stencil when compositing |

Save the configuration as a **preset asset** (`/Game/Cinematics/MRQ/MRQ_Final_4K`), and save the
whole **queue** as an asset too. Commit both with the project. A preview preset (half res, 1x4
samples, PNG) and a final preset should both exist.

Console variables often used in final presets (verify names in your version):
`r.ScreenPercentage 100`, `r.MotionBlurQuality 4`, `r.DepthOfFieldQuality 4`,
`r.Streaming.FullyLoadUsedTextures 1` or `r.TextureStreaming 0`, Lumen final gather and
reflection quality cvars raised for final.

## 4. Command-line render

Render without the editor UI so it can run unattended:

```
UnrealEditor-Cmd "<Project>.uproject" "/Game/Maps/Studio" -game
  -MoviePipelineConfig="/Game/Cinematics/MRQ/Q_Shots.Q_Shots"
  -windowed -resx=1280 -resy=720 -log -NoLoadingScreen -notexturestreaming -unattended
```

- `-MoviePipelineConfig` takes a saved queue asset, or combine `-LevelSequence=<path>` with a
  preset asset for one sequence. Exact flag handling has changed across 5.x; test with a 10-frame
  range first and read the log.
- `-game` runs the map as a game (no editor UI); `-windowed -resx -resy` is just the preview window,
  the output resolution comes from the preset.
- Python alternative (editor scripting): load the queue via `MoviePipelineQueueSubsystem`, set the
  executor (`MoviePipelinePIEExecutor` in-editor, a new-process executor for isolation), render,
  and bind to the finished callback. Use this for batch variants (colors, cameras).
- Write logs to a file and grep for `LogMovieRenderPipeline` errors and shader compile warnings.
- Pre-compile shaders (open the map once, let compilation finish) so renders do not bake in
  default materials.
- Mark the run: engine version, preset name, commit, date in the output folder name or a
  sidecar text file.

## 5. Path tracer

For reference-quality stills and product shots (enable it in project settings, needs ray-tracing
capable GPU, DX12):

| Setting | Guidance |
|---|---|
| Samples per pixel | 256-1024 preview with denoise, 2048-8192 final stills |
| Max bounces | 8-16 (glass/liquids higher) |
| Denoiser | on for previews and most finals; check fine texture loss |
| Motion blur | reference motion blur from MRQ temporal samples |
| AA in MRQ | samples multiply: keep spatial x temporal x spp within budget |

- Not every real-time feature matches: some materials, particles, translucency sorting and older
  Nanite fallback geometry may differ. Compare a frame against Lumen before committing.
- Path tracing time scales with resolution and samples; test a crop region first.

## 6. Lumen and Nanite notes (UE 5.0+)

- **Lumen**: dynamic GI and reflections. Use hardware ray tracing when the GPU supports it for
  better reflections and fewer leaks. Temporal accumulation needs warm-up frames; camera cuts
  without warm-up show light pop and noise. Thin walls (< 10 cm) leak light; thicken them.
  Emissive surfaces do light but are noisy at small sizes; add real lights.
- **Nanite**: virtual geometry, removes most LOD and triangle concerns for opaque static meshes.
  Limits vary by version (translucency, some deformation and masked materials historically
  unsupported or slower); check the Nanite visualization modes for fallbacks.
- **Virtual shadow maps** pair with Nanite; raise page budget if shadows shimmer.
- **Texture streaming** causes blurry first frames; disable or fully load for renders.
- Hair, cloth and particles need simulation warm-up; pre-roll the sequence.

## 7. MCP and automation bridges (optional)

Editor bridges exist that let an agent create Level Sequences, add tracks, and queue MRQ jobs over
a local connection, including an experimental official plugin in recent versions. Treat them as
conveniences over the same Python API: prefer scripts in the project repo for anything rerun, keep
the bridge bound to localhost, and do not install editor plugins from unknown sources.

## 8. Verify

1. Render 10 frames around each risky moment (camera cut, fast motion, light change) with the
   final preset. Inspect at 100 % zoom: AA crawl, motion blur stepping, Lumen noise or boil,
   texture pop, shadow shimmer, denoiser smear, exposure pumping.
2. Scrub the full sequence for flicker (frame-difference in ffmpeg helps spot boiling).
3. Check EXR in a viewer with the correct view transform; check the ProRes in the editor timeline.
4. Report: engine version, preset asset paths, samples, render time per frame, output paths,
   frames inspected, known issues. See `forge:verification`.

## Anti-slop

- No auto-exposure pumping, no default sky with a default directional sun at noon, no ultra-wide
  lens for products, no camera moves without ease or motivation.
- Light shots like a DP: motivated key, controlled contrast, negative fill, practical lights.
- Ship the config, not just the frames: anyone should rerender from the saved preset.
