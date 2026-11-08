---
disable-model-invocation: true  # skl: on-demand pack skill
name: web-3d
description: >
  Put 3D on the web with three.js, React Three Fiber or a model viewer: glTF loading, lighting and
  color management, Draco/Meshopt/KTX2 compression, draw-call and triangle budgets, resize and
  disposal, reduced-motion, and a checklist for scenes that render black or blank, verified by
  screenshot. Use when adding a 3D hero, product viewer or scene to a site, debugging a black or
  empty canvas, optimizing a heavy GLB, or porting a Blender asset to the browser.
---

# Web 3D

Use the project's stack: plain three.js, React Three Fiber (R3F) + drei in React apps, or
`<model-viewer>` when the need is "spin a product" and nothing else (least code). Do not add a 3D
library to a page that only needs a looping video or an image sequence; a 1-3 MB MP4/WebM is often
the better hero (see `forge:ponytail`). Asset prep is in `atelier:3d-modeling`; motion rules in
`atelier:motion-design`.

## 1. Minimal correct setup (three.js r155+)

- Renderer: `antialias: true`, `setPixelRatio(Math.min(devicePixelRatio, 2))`,
  `outputColorSpace = SRGBColorSpace` (default since r152), a tone mapping chosen on purpose
  (`ACESFilmicToneMapping`, `AgXToneMapping`, or `NeutralToneMapping` for product color accuracy),
  `toneMappingExposure` around 1.
- Camera: `PerspectiveCamera(fov 35-50, aspect, near 0.1, far 100)` for meter-scale scenes; frame
  the model from its bounding box, never hard-code a position for an unknown asset.
- Lights: an environment map (RGBE/HDR or `RoomEnvironment` via PMREM) for PBR reflections plus
  one directional key if shadows are needed. Since r155 lights use physical units; old tutorials'
  intensities look dark.
- Textures: color maps (`map`, `emissiveMap`) get `colorSpace = SRGBColorSpace`; data maps
  (normal, roughness, metalness, AO) stay linear. GLTFLoader does this for you.
- Size: canvas fills a container with explicit height; observe the container with
  `ResizeObserver`, update `camera.aspect`, `updateProjectionMatrix()`, `renderer.setSize`.
- R3F: `<Canvas camera={{ fov: 40, position: [0, 1, 3] }} dpr={[1, 2]}>` inside a parent with a
  real height; drei `useGLTF`, `Environment`, `Bounds`/`Center`, `ContactShadows`. Use
  `frameloop="demand"` for static viewers and call `invalidate()` on change.

## 2. "Renders black or blank" checklist

Run through this in order before changing anything else:

1. **Canvas size 0**: the parent has no height (common with `height: 100%` chains, flex children,
   R3F `<Canvas>` in an unsized div). Check `canvas.clientHeight` in devtools.
2. **Console errors**: failed GLB/texture fetch (404, CORS), missing Draco/KTX2 decoder path,
   WebGL context lost, shader compile error.
3. **Camera inside or behind the model**, or the model is 100x too big/small (cm vs m): compute
   `Box3().setFromObject(model)`, log its size and center, frame it.
4. **Near/far clip**: model outside `near..far`, or `near` tiny (0.0001) with huge `far` causing
   z-fighting.
5. **No light** with `MeshStandardMaterial`/`MeshPhysicalMaterial`: black. Add an environment map
   or lights. `MeshBasicMaterial` ignoring lights rendering fine is the tell.
6. **Metal with no environment**: metalness 1 reflects nothing, renders black. Needs an env map.
7. **Color space / tone mapping**: washed out (double sRGB) or too dark/saturated (missing sRGB on
   color textures); tone mapping applied twice in postprocessing.
8. **Never rendered**: no animation loop, or `frameloop="demand"` without `invalidate()`; render
   called before the async load finished.
9. **Normals flipped / single-sided faces** seen from behind: try `side: DoubleSide` to diagnose,
   then fix the asset.
10. **Object not added** to the scene, `visible = false`, opacity 0, or scaled to 0 by an animation
    clip.
11. **WebGL unavailable**: headless browsers without GPU flags, blocklisted drivers. Detect and
    show a fallback image.

## 3. Compression and loading

| Asset part | Tool | Typical gain | Cost |
|---|---|---|---|
| Geometry | Meshopt (`EXT_meshopt_compression`) | 5-10x with gzip/brotli | tiny decoder, fast; good default |
| Geometry | Draco (`KHR_draco_mesh_compression`) | 10-20x | WASM decoder (~300 KB), slower decode |
| Textures | KTX2 Basis: ETC1S for color/most maps, UASTC for normal maps | GPU memory 4-8x smaller | transcoder WASM; needs `KTX2Loader.detectSupport(renderer)` |
| Textures | WebP/AVIF in glTF (`EXT_texture_webp`/`_avif`) | smaller download | no GPU-memory savings |

- Pipeline: `gltf-transform optimize in.glb out.glb` (dedup, prune, weld, simplify, resize,
  compress); add texture compression flags per its docs. Keep the uncompressed source.
- Host decoder files yourself (Draco, Basis transcoder) and set the loader paths; do not depend on
  a third-party CDN at runtime unless the project already does.
- Load lazily: render a poster image first, start loading when the canvas nears the viewport,
  show progress, and keep the page usable if loading fails.
- Cache: `useGLTF.preload`, HTTP caching, one loader instance per type.

## 4. Performance budgets

| Budget | Mobile mid-range | Desktop |
|---|---|---|
| Frame time | 16.7 ms (60 fps), hold 30 fps minimum | 16.7 ms or monitor rate |
| Draw calls | < 50-100 | < 200-300 |
| Triangles visible | < 100k-300k | < 1M |
| Texture memory | < 64-128 MB | < 256 MB |
| GLB download (hero) | < 3-5 MB | < 10 MB |
| Shadow maps | 1, 1024 | 1-2, 2048 |

- Measure: `renderer.info.render.calls/triangles`, `renderer.info.memory`, browser performance
  panel, a stats overlay in dev only. Profile on a real phone, not the dev laptop.
- Reduce draw calls: merge static meshes sharing a material, `InstancedMesh` for repeats, texture
  atlases, fewer materials.
- Bake lighting/AO into textures for static scenes; avoid real-time shadows when a baked contact
  shadow will do.
- Cap DPR at 2 (1.5 on low-end), pause rendering when the tab is hidden or the canvas is off-screen
  (`IntersectionObserver`), and use `frameloop="demand"` when nothing moves.
- Postprocessing (bloom, SSAO, DOF) costs full-screen passes; budget each one.

## 5. Lifecycle and disposal

- On unmount/route change: `geometry.dispose()`, `material.dispose()`, each texture `dispose()`,
  `renderer.dispose()`, remove listeners and `ResizeObserver`, cancel the animation frame. R3F
  disposes objects it created; you dispose what you created imperatively.
- Handle `webglcontextlost`/`restored`; show the fallback image when lost.
- One renderer per page if possible; multiple canvases multiply GPU memory (drei `View` shares one).

## 6. Accessibility and motion

- `prefers-reduced-motion: reduce`: no autorotate, no scroll-driven camera flights, no parallax;
  show a static, well-framed view and let the user drag. Respect it in both CSS and JS
  (`matchMedia`).
- The canvas is not content: give it `role="img"` and an `aria-label` describing the object, or a
  visible text description; never put essential info only in 3D.
- Controls: OrbitControls with limits (min/max distance, polar angle) so users cannot get lost
  inside the model; damping on; keyboard and touch must work; do not hijack page scroll (use
  `enableZoom` only on intent, e.g. ctrl+wheel or a focused canvas).
- Fallback image for no-WebGL and for no-JS.

## 7. Verify by screenshot

1. Run the page; open it in a real browser or Playwright. Headless Chromium may need a software GL
   backend (`--use-angle=swiftshader` or `--enable-unsafe-swiftshader`) to get WebGL; a blank
   screenshot with no console error often means no GL, not a bug in the scene.
2. Wait for the model-loaded signal (expose `window.__sceneReady = true`), then screenshot at
   mobile (390x844) and desktop (1440x900). Look at the images: framing, exposure, color, no black
   materials, no clipped model.
3. Collect console errors and `renderer.info` numbers; report draw calls, triangles, GLB size, time
   to first render on a throttled profile.
4. Test with reduced motion emulated and with WebGL disabled (fallback appears).

## Anti-slop

- No floating rainbow torus knot, no default grey on black, no endless autorotate as the only idea.
- Light like a photographer (env + key + contact shadow), frame like a product shot, use a tone
  mapping that keeps brand colors true.
- If the 3D does not explain or sell anything a photo cannot, ship the photo.
