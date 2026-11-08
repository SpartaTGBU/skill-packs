---
disable-model-invocation: true  # skl: on-demand pack skill
name: 3d-modeling
description: >
  Make 3D assets that are correct for their target: topology, triangle budgets for web, mobile,
  game and hero use, UVs and texel density, PBR texture sets, LODs, normal/AO baking, scale, units
  and axes, and glTF/GLB, FBX and USD export checked by a validator. Use when creating or auditing a
  model, choosing poly or texture budgets, unwrapping or baking, packing PBR maps, building LODs, or
  exporting an asset for a game engine, the web or AR.
---

# 3D modeling and asset prep

Tool-agnostic asset rules. Do the modeling in `atelier:blender` (or the user's DCC), ship to the
browser with `atelier:web-3d`, render cinematics in `atelier:unreal-rendering`, print with
`atelier:cad-and-3d-print`.

## 1. Decide the target first

Write down: target (web, mobile app/AR, game platform, offline render, print), camera distance
(how big on screen), whether it deforms (rigged) and the export format. Budgets follow from that.

| Target | Triangles per asset | Textures | Notes |
|---|---|---|---|
| Web hero / product viewer | 30k-150k | 2048 PBR set, KTX2 | whole page scene < ~500k tris, GLB < 5-10 MB |
| Web background prop | 500-10k | 512-1024, shared atlas | instancing beats unique meshes |
| AR (mobile quick view) | < 100k | 2048 max | single GLB/USDZ, a few MB |
| Mobile game character | 5k-20k | 1024-2048 | 1 material if possible |
| Mobile game prop | 200-3k | 256-1024 atlas | |
| PC/console character | 40k-120k (LOD0) | 4096 set, UDIMs for heroes | |
| PC/console prop | 500-15k | 1024-2048 | Nanite/virtual geometry relaxes this in UE5 |
| VR (standalone headset) | scene total ~300k-750k | 1024-2048 | 72-90 fps, keep draw calls < 100 |
| Offline render hero | as needed; subdivision at render | 4K-8K or UDIM | budget is render time, not tris |

These are working ranges, not platform rules. Spend triangles on silhouette and close-up areas;
flat faces need two triangles. Re-check against the project's measured frame time.

## 2. Topology

- Quads for anything that subdivides or deforms; triangles are fine on rigid game/web meshes
  (everything is triangulated on export anyway).
- Deforming meshes: edge loops follow muscle/joint lines, 3 loops around each bend, no poles on
  joints.
- Hard-surface: bevel visible edges (real objects catch light on edges), then either support loops
  for subdivision or weighted normals / custom normals for low-poly.
- No n-gons on curved surfaces, no long thin triangles (shading and baking artifacts), no
  interior faces, no zero-area faces, no duplicate vertices, no flipped normals.
- Manifold where it matters (printing, booleans, baking cages). Open meshes are fine for
  single-sided cards (foliage, decals) when the material is double-sided.
- Keep separate parts separate when they move or use different materials; merge static parts that
  share a material to save draw calls.

## 3. UVs and texel density

- Seams on hard edges and hidden areas; every hard edge (split normal) should be a UV seam, or
  baked normals show lines.
- Uniform texel density across an asset and across a set. Common game references: ~10.24 px/cm
  (1024 px per m) first-person, ~5.12 px/cm third-person; web/AR usually lower. Scale UV islands
  up only for faces the camera sees close.
- Padding: 4-8 px at 1024, 8-16 px at 2048, so mips do not bleed.
- Straighten islands of man-made surfaces (straight trim, readable text). Avoid stretching; check
  with a checker texture.
- Second UV channel only when needed (lightmaps in engines, which need non-overlapping UVs).
- Mirrored/overlapping UVs save space but break unique baked AO; offset overlaps 1 UV unit out of
  the bake.

## 4. PBR texture sets (metal/roughness)

| Map | Color space | Notes |
|---|---|---|
| Base color / albedo | sRGB | no baked lighting; dielectrics ~30-240 sRGB, metals 180-255 |
| Metallic | linear | 0 or 1; gradients only for transitions (dirt over metal) |
| Roughness | linear | the most important map for realism; never flat 0.5 |
| Normal | linear | glTF/Blender/Unity: OpenGL (Y+); Unreal/3ds Max: DirectX (Y-). Flip G when converting |
| Ambient occlusion | linear | multiply in-engine or pack |
| Emissive | sRGB | plus a strength value |
| Height/displacement | linear | offline/parallax only |

- Pack ORM for glTF and engines: R = occlusion, G = roughness, B = metallic.
- Power-of-two sizes (512, 1024, 2048, 4096). Mips on. Prefer one material per asset on real-time
  targets; atlases or trim sheets for sets.
- Record each texture's source and license (scan library, generated, hand-painted).

## 5. Baking (high to low)

1. Model high-poly detail; build the low-poly that matches its silhouette.
2. Unwrap low-poly; split normals = UV seams; triangulate before baking so baker and engine
   agree on triangulation.
3. Bake with a cage or ray distance just large enough to enclose the high-poly; too large picks up
   other parts. Explode multi-part assets (or bake by matching names) to avoid cross-projection.
4. Bake normal (tangent space, MikkTSpace, correct Y convention), AO, curvature, ID, thickness.
5. Inspect in the target renderer, not just the baker: look for wavy edges (add bevel/supports),
   seams (padding, split normals), and skew (more geometry on the low-poly).

## 6. LODs

- LOD0 full, then roughly 50 % triangle reduction per level (LOD1 50 %, LOD2 25 %, LOD3 ~10 %), a
  billboard/impostor last for far props.
- Switch by screen size, not distance alone; check popping in motion.
- Preserve silhouette and UV seams when decimating; keep the same materials across LODs.
- glTF has no core LOD; use `MSFT_lod` or separate files and swap in code. UE5 Nanite meshes do not
  need hand LODs (but translucent, skinned in older versions, and foliage edge cases may).

## 7. Scale, units, axes

| Format / engine | Up | Units | Watch out for |
|---|---|---|---|
| glTF/GLB | +Y | meters | front of asset faces +Z; exporters convert from Z-up |
| Blender | +Z | meters (scale 1.0) | apply transforms before export |
| Unreal | +Z | centimeters | FBX from Blender: scale 1.0 + unit settings or 100x mistakes |
| Unity | +Y | meters | FBX "Apply Transform"; check 90 degree X rotation on import |
| USD | per-stage `upAxis`, `metersPerUnit` | set both explicitly | |

Model at real size. Pivot at a useful point (bottom center for props, hinge for doors). Apply
rotation and scale (all 1.0, 0 rotation) before export.

## 8. Export

- **GLB**: web, AR, interchange. One file, embedded textures, PBR metal/rough. Use for anything
  bound for `atelier:web-3d`. Compression (Draco/Meshopt, KTX2) is a delivery step.
- **FBX**: game engines with skeletal animation; check scale, smoothing groups ("Face" smoothing),
  tangent space and embedded media settings.
- **USD/USDZ**: film/VFX pipelines, Apple AR (USDZ). Set `upAxis`, `metersPerUnit`, and author
  materials as UsdPreviewSurface for portability.
- **OBJ/STL**: static geometry only; STL for printing (see `atelier:cad-and-3d-print`).
- Animations: bake constraints/IK to keyframes, one action per clip, name clips; check the frame
  rate matches the target.

## 9. Validate before handing off

- glTF: run the Khronos glTF-Validator (release CLI, web drop page, or the `gltf-validator` npm
  library) and fix every error; read warnings. `gltf-transform inspect model.glb` lists meshes,
  materials, texture sizes and memory. Zero errors is the bar.
- Mesh hygiene: triangle count vs budget, no non-manifold edges where it matters, no loose
  vertices, normals outward, transforms applied, texture sizes power of two.
- Look at it: open in the target viewer (three.js editor, engine, AR viewer) under neutral
  lighting and a hard HDRI; turn it around; check normals, seams, scale against a 1.8 m reference.
- Report the numbers: tris, materials/draw calls, texture memory, file size, validator result.

## Anti-slop

- No generic bevel-everything blobs, no uniform noise as "detail", no stock-HDRI-only lookdev.
- Wear and dirt where physics puts them (edges, cavities, contact points), not uniformly.
- Real proportions from references or measurements, never guessed sizes.
