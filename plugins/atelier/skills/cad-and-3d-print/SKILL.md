---
disable-model-invocation: true  # skl: on-demand pack skill
name: cad-and-3d-print
description: >
  Design printable and manufacturable parts in parametric CAD (OpenSCAD, FreeCAD, build123d or
  CadQuery) and prepare meshes for FDM/resin printing: wall thickness, 45-degree overhangs,
  clearances, orientation, STL/3MF/STEP export, manifold checks and slicer preview. Use when asked
  to model a bracket, enclosure, adapter or replacement part, make an STL printable, remove
  overhangs, fix a non-manifold mesh, or choose print tolerances and orientation.
---

# CAD and 3D printing

Parts are code: a parametric script with named dimensions, exported to a mesh for the printer and
STEP for anyone who needs to edit it. Visual 3D assets (games, web, renders) belong in
`atelier:3d-modeling` and `atelier:blender`.

## 1. Brief

Ask for what changes the geometry: function and mating parts (measured with calipers, in mm),
loads and direction, printer type and nozzle (default FDM, 0.4 mm), material (default PLA; PETG
for outdoor/heat to ~70 C, ASA/ABS for heat and UV, TPU for flex), bed face and visible faces, and
quantity. Write assumptions next to the parameters.

## 2. Pick the CAD tool

| Tool | Best for | Headless use |
|---|---|---|
| OpenSCAD | simple CSG parts, parametric boxes, quick adapters | `openscad -o part.stl -D 'w=40' part.scad` |
| build123d / CadQuery (Python, OpenCascade) | real B-rep, fillets, chamfers, STEP, larger assemblies | `python part.py` with `export_step`/`export_stl` |
| FreeCAD | sketch + PartDesign workflow, editable by a human in a GUI, assemblies | `freecadcmd script.py` |

Use what the project already has. Prefer B-rep tools (build123d/CadQuery/FreeCAD) when fillets,
STEP output or downstream CNC/injection molding matter; OpenSCAD's mesh output is fine for most
printed parts. In OpenSCAD set `$fn` (64-128 for visible curves) on export, and a newer build with
the Manifold backend renders complex booleans far faster.

## 3. Modeling rules

- All key dimensions are named parameters at the top (`wall = 2.0`, `clearance = 0.3`); derived
  values are computed, never retyped.
- Model mating features from measured counterparts plus clearance, not nominal sizes.
- Fillet internal corners (stress), chamfer bed-side edges 0.4-0.6 mm (elephant foot).
- Keep features printable without supports where possible (section 4); design supports in only on
  purpose (sacrificial layers, breakaway tabs).
- Version the script; export a dated STL/3MF plus STEP from the same commit.

## 4. Design for FDM printing (0.4 mm nozzle, 0.2 mm layers)

| Feature | Rule |
|---|---|
| Wall thickness | multiples of line width (~0.45 mm): 0.8 min, 1.2-1.6 normal, 2.0+ structural |
| Overhangs | <= 45 degrees from vertical prints clean; beyond that chamfer, add supports, or reorient |
| Bridges | <= 10-20 mm unsupported; longer needs supports or a redesign |
| Horizontal holes | teardrop or flat-topped (diamond) shape to avoid sagging roofs |
| Hole sizing | holes print 0.1-0.3 mm undersized; oversize or drill/ream |
| Clearance: press fit | 0.1-0.15 mm per side |
| Clearance: snug/sliding | 0.2-0.3 mm per side |
| Clearance: loose / print-in-place | 0.3-0.5 mm per side |
| Minimum feature | ~0.8 mm wide; embossed text >= 0.6 mm tall stroke, >= 0.5 mm high |
| Threads | print M8+; for M3-M6 use heat-set inserts (follow insert maker's hole size) or nut traps |
| Snap fits | 1.5-3 % strain, flex along layers, not across them |

Resin (SLA/MSLA): walls >= 1-2 mm, drain holes (>= 3 mm) for hollow parts, clearances ~0.1-0.2 mm,
orient to minimize cross-section per layer, supports on non-visible faces.

Tolerances are printer and material specific. For a fit that matters, print a test coupon (a
peg and holes at 0.1/0.2/0.3/0.4 mm clearance) before the full part.

## 5. Orientation

- Layers are the weak direction (interlayer bonds fail first). Orient so loads run along layers;
  a bracket printed so its bending stress pulls layers apart will snap.
- Largest flat face on the bed; cosmetic face up or on a textured bed.
- Minimize supports and their contact with cosmetic faces; consider splitting the part and
  joining with pins, dovetails or screws instead of heavy supports.
- Round holes along Z print round; holes along X/Y need the teardrop treatment.

## 6. Formats

- **3MF**: preferred for slicers. Units are explicit (mm), can carry multiple objects, colors,
  and print settings.
- **STL**: universal but unitless (assumed mm) and triangle soup; check scale on import.
- **STEP**: exact B-rep for editing, CNC, sharing with other CAD users. Export it whenever the
  source tool can.
- Chord tolerance for mesh export: ~0.01-0.05 mm deviation; too fine bloats files, too coarse shows
  facets on curves.

## 7. Mesh repair and validation

Check every exported or downloaded mesh before slicing, with a script (trimesh in Python, admesh,
or Blender's 3D-Print Toolbox):

- Watertight / manifold: every edge shared by exactly two faces; no holes; consistent winding;
  normals out; positive volume.
- No self-intersections or internal shells; one body unless intended.
- Extents match the brief (mm, not cm or inches; a 40 mm part showing 1.57 is in inches).
- Quantify overhang: total area of faces whose normal points down steeper than the 45 degree limit
  (`normal_z < -cos(45 deg)`) and sit above the bed (`z > ~0.01 mm`). Report it before and after
  changes.
- Undercuts on reliefs: cast rays from above; more than two hits per ray marks an undercut.

Fixing a downloaded STL you cannot re-model:

- Small holes and flipped faces: auto-repair (merge vertices, fix normals, fill holes); re-check.
- 2.5D reliefs (flat back, decorative top) with undercuts: rebuild as a heightfield, sampling top
  height on a 0.25-0.5 mm grid, then top surface + flat bottom + side walls. Removes all undercuts
  while keeping the top-down look. A 0.5 mm grid can reach ~800k faces; decimate before shipping.
- Chamfering steps by a cone dilation (~42 degree slope) removes overhangs but adds volume and
  softens detail; offer it rather than doing it silently.
- When building a gridded mesh from known topology, skip automatic processing that may reorder or
  rewind faces, then verify watertightness explicitly.
- Render shaded views (top, iso, underside) and look at them before and after; art reliefs are
  easy to destroy.

## 8. Slicer check

- Slice with the user's slicer and printer profile (PrusaSlicer, OrcaSlicer, Bambu Studio and
  Cura all have CLIs or can be scripted; e.g. PrusaSlicer `--export-gcode --load profile.ini part.3mf`).
- Read the layer preview: first layer contact, unsupported islands, bridges, thin walls dropped
  (walls under one line width vanish), gaps in perimeters, estimated time and filament.
- Infill 15-25 % gyroid/grid for general parts; strength comes more from perimeters (3-4 walls)
  than infill.
- If no slicer is available, say so and report which checks were done instead.

## 9. Verify and report

Report: parameters, material and printer assumed, exported files (STL/3MF/STEP paths), mesh
checks (watertight, volume, extents, triangle count), overhang area, slicer result or why none, and
what still needs a test print. A part is not "done" until the fit is tested; offer a coupon or a
quick draft print. See `forge:verification`.

## Anti-slop

- No magic numbers buried in geometry, no zero-clearance mating parts, no sharp internal corners on
  loaded parts, no supports inside threads or snap features.
- Do not "fix" an art model by smoothing away its style; preserve the look, change only what blocks
  printing, and show before/after renders.
