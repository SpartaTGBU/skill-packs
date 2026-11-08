---
disable-model-invocation: true  # skl: on-demand pack skill
name: blender
description: >
  Build, light, render and export scenes in Blender from scripts: a BRIEF.md first, a modeling
  strategy before geometry, bpy for bulk work, headless `blender -b -P` runs, Cycles/EEVEE render
  settings, camera and lighting defaults, and a render-and-look check after every step. Use when
  asked to model a product, prop, room or layout in Blender, write a bpy script, render stills or
  turntables headlessly, set up GPU rendering, or drive Blender through an MCP bridge.
---

# Blender

Blender is the scriptable, headless 3D tool here. Treat it as code: every scene is reproducible from
a `.py` file plus assets, and every step ends with a rendered image you actually look at. Asset
rules (topology, budgets, UVs, export) live in `atelier:3d-modeling`; web delivery in
`atelier:web-3d`; printable parts in `atelier:cad-and-3d-print`.

## 1. Brief first (write `BRIEF.md` before touching geometry)

| Field | Example |
|---|---|
| Subject and purpose | "Desk lamp, product hero still + 8 s turntable for landing page" |
| Real dimensions (meters) | base Ø 0.16, arm 0.42, shade Ø 0.18 |
| Materials | powder-coated steel (rough 0.45), brushed brass (metal 1, rough 0.3), frosted glass |
| Style / mood | clean studio, soft key, warm 3200 K practical, neutral grey sweep |
| Output | 2048x2048 PNG, alpha; MP4 1080p 30 fps; GLB < 5 MB |
| Constraints | Blender version, GPU or CPU only, render-time budget per frame, poly budget |
| References | file paths or URLs the user supplied; note license/provenance |

Ask only for the fields that change the work (dimensions, output, materials). Infer the rest and
state assumptions in the brief.

## 2. Propose a modeling strategy, then build

Before any geometry, write 4-8 lines: block-out primitives, which parts are modifiers (Bevel,
Mirror, Array, Solidify, Boolean), which are curves, what gets instanced, and what is out of scope.
Get a yes on anything ambiguous, then:

1. Block-out at true scale with primitives; render a clay preview.
2. Refine forms: bevels on every visible hard edge (real objects have no 0 mm edges; 1-3 mm on
   product scale), support loops or weighted normals for shading.
3. Materials (Principled BSDF), then lighting, then camera, then final render.
4. Render a preview after each stage and look at it. Fix before moving on.

Honest limits: scripted modeling is strong for hard-surface, products, architecture, furniture,
packaging, layout, lighting and camera work. Organic heads, characters, cloth and hair come out
lumpy from code. Route those to sculpting (by a human), photogrammetry/scans, or an image-to-3D
generator, then clean up and light in Blender. Say this up front instead of shipping a bad character.

## 3. Script conventions (bpy)

- Units: `scene.unit_settings.system = 'METRIC'`, `scale_length = 1.0`. 1 BU = 1 m.
- Apply scale after sizing: `bpy.ops.object.transform_apply(scale=True)`; unapplied scale breaks
  bevels, physics, UVs and exports.
- Start scripts idempotent: delete or reuse objects by name, so reruns do not duplicate.
- Prefer data API (`bpy.data.meshes.new`, `bmesh`, `obj.modifiers.new`) over `bpy.ops`; ops need
  the right context and fail silently or differently in background mode.
- Name everything (`Lamp_Base`, `MAT_Brass`); group with collections (`GEO`, `LIGHTS`, `CAMS`).
- Instance repeated parts (`Collection` instances, linked duplicates, Geometry Nodes) instead of
  copying meshes.
- Keep the script and `.blend` in the project; save with `bpy.ops.wm.save_as_mainfile(filepath=...)`.
- Pass arguments after `--`: `sys.argv[sys.argv.index("--")+1:]`.

Version-sensitive identifiers: the EEVEE engine enum is `BLENDER_EEVEE_NEXT` in 4.2-4.5 and
`BLENDER_EEVEE` in 4.1 and earlier and again in 5.0+. Check instead of guessing:
`bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items.keys()`. Print `bpy.app.version`
at the top of every script.

## 4. Headless runs

```bash
blender -b scene.blend -P build.py -- --variant brass          # run a script against a file
blender -b scene.blend -o //out/still_#### -F PNG -f 1            # render frame 1
blender -b scene.blend -o //out/turn_#### -s 1 -e 240 -a          # render a range
blender -b scene.blend -E CYCLES -f 1 -- --cycles-device OPTIX    # engine + GPU backend
blender -b --factory-startup -P make_scene.py                     # no user prefs/addons
```

Argument order matters: options apply left to right, so put `-o`, `-F`, `-s/-e`, `-E` before `-f`
or `-a`. `//` is relative to the `.blend`. `#` pads frame numbers. Encode video from the PNG
sequence with ffmpeg (see `atelier:video-composition`) rather than rendering straight to a movie
file; a crash mid-render then loses one frame, not the clip.

## 5. Render settings

GPU (Cycles), set in script because background mode ignores the UI:

```python
p = bpy.context.preferences.addons["cycles"].preferences
p.compute_device_type = "OPTIX"   # or CUDA, HIP (AMD), METAL (Apple), ONEAPI (Intel)
p.get_devices()
for d in p.devices: d.use = (d.type != "CPU")
scene.cycles.device = "GPU"
```

| Setting | Preview | Final still | Final animation |
|---|---|---|---|
| Cycles samples | 64-128 | 512-2048 | 256-1024 |
| Adaptive noise threshold | 0.05 | 0.01 | 0.01-0.02 |
| Denoiser | OIDN or OptiX | OIDN, with albedo+normal passes | OIDN; check for temporal flicker |
| Light paths (max bounces) | 4 | 12 (glass/liquids: transmission 12+) | 8-12 |
| EEVEE render samples | 16 | 64-128 | 64 |

- Cycles for product, glass, metal, caustic-ish and anything that must look photographic. EEVEE for
  stylized work, fast previews, motion graphics, and long animations under time budget; enable
  ray tracing (4.2+) for usable reflections.
- Color management: AgX (default 4.0+) or Filmic for photoreal; Standard only for flat/UI-matched
  colors. Never judge colors under the wrong view transform.
- Transparent background: `scene.render.film_transparent = True`, PNG RGBA or EXR.
- Motion blur on for real-camera moves; shutter 0.5 (180 degrees).
- Quick verification renders: `BLENDER_WORKBENCH` or EEVEE at 25-50 % resolution.

## 6. Lighting and camera defaults

- Product: three-point with large area lights. Key at ~45 degrees side and above, fill on the
  opposite side at 1/4-1/2 the key's power, rim/back light to separate the silhouette. Bigger
  light = softer shadow; size lights relative to the subject, not the room.
- Add an HDRI world for reflections at low strength (0.2-0.5) if the studio lights dominate; check
  the HDRI license.
- Use realistic power: area lights for a 20 cm product are tens of watts at 0.5-1 m, not 1000 W.
  Use color temperature (Blackbody node) instead of hand-picked tints.
- Ground the subject: a seamless sweep (bent plane, Bevel) or a shadow catcher; floating objects
  without contact shadows read fake.
- Camera: 50-85 mm for products (35 mm sensor), 24-35 mm for interiors, avoid wide lenses close to
  products (distortion). Depth of field f/2.8-f/8 with the focus object set, not a distance guess.
  Keep verticals vertical for architecture (shift instead of tilt).
- Composition: subject on thirds or deliberate center, 10-15 % headroom, consistent camera height
  across a product set.
- Turntable: parent the camera to an empty at the subject center, rotate 360 degrees with linear
  interpolation over 240 frames (8 s at 30 fps) so the loop has no ease.

## 7. MCP bridge (optional)

A Blender MCP bridge (an add-on running a local socket server in the Blender UI) lets the agent run
Python and grab viewport screenshots in a live session. If one is configured:

- After every step: fetch scene info (objects, transforms, materials) and a viewport screenshot;
  compare against the brief's dimensions and look.
- Send small code chunks; one failed chunk should not leave half a scene.
- It executes arbitrary Python inside Blender with your user's rights. Use it only on your own
  machine, never point it at untrusted scenes or add-ons, and keep asset-download integrations off
  unless the user asked for them (licensing).

Without a bridge, use headless runs plus preview renders. That path is reproducible and preferred
for anything that will be rerun.

## 8. Verify before calling it done

1. Render the deliverable (or a 50 % preview) and open the image. Check: scale against a known
   object, no black/blown areas, no shading artifacts on bevels, no z-fighting, no floating parts,
   shadows contacting the ground, materials reading as specified.
2. `print` the object list, dimensions (`obj.dimensions`), triangle counts, and unapplied scales.
3. For animation, render every 10th frame first, check flicker and denoise artifacts, then full.
4. Report: output paths, Blender version, engine, samples, render time per frame, what was
   assumed, what was not verified. See `forge:verification`.

## Anti-slop

- No default grey cube lighting, default 50 mm head-on camera, or pure-black world.
- No perfectly sharp edges, no single point light, no 100 % saturated albedo (keep base color
  sRGB ~30-240), no mirror-perfect metals (roughness 0.15+ unless chrome).
- Imperfection on purpose: subtle roughness variation, slight bevel, contact shadows.
