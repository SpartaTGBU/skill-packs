---
disable-model-invocation: true  # skl: on-demand pack skill
name: comfyui
description: >
  Drive a local ComfyUI server headlessly: export workflows in API format, expose a small param map
  (prompt, seed, steps, cfg, size, lora), submit to /prompt, poll /history, fetch outputs from /view,
  and save graph plus seed beside every output; recipes for ControlNet, LoRA, upscaling and
  inpainting. Use when generating images or video with ComfyUI, scripting or batching a workflow,
  turning a UI graph into an API call, or adding ControlNet, LoRA, upscale or inpaint passes.
---

# ComfyUI

Prompt craft and model choice live in `atelier:image-generation`; delivery in
`atelier:asset-pipeline`. This skill is the reproducible local pipeline.

## KEY RULE: API format, not UI format

ComfyUI saves two different JSON shapes:

| | UI (editor) format | API format |
|---|---|---|
| Top level | `{"nodes":[...],"links":[...],"groups":...}` | `{"3":{"class_type":"KSampler","inputs":{...}}, ...}` |
| Accepted by `POST /prompt` | No | Yes |
| Keeps layout, notes, groups | Yes | No |

Export with the editor's "Export (API)" menu item (older builds: enable dev mode in settings, then
"Save (API Format)"). Keep both: the UI file for humans to edit, the API file for scripts. If a
script gets `{"nodes":...}` it has the wrong file; do not hand-convert, re-export.

Inputs in API format are either literals or links `["<node_id>", <output_index>]`.

## Param map (expose few knobs)

Keep a sidecar `<workflow>.params.json` that names the only fields a caller may change:

```json
{"prompt":   ["6",  "text"],
 "negative": ["7",  "text"],
 "seed":     ["3",  "seed"],
 "steps":    ["3",  "steps"],
 "cfg":      ["3",  "cfg"],
 "width":    ["5",  "width"],
 "height":   ["5",  "height"],
 "lora":     ["10", "lora_name"],
 "lora_strength": ["10", "strength_model"]}
```

Node ids differ per workflow; read them from the API export. Validate values before submit
(steps 1-150, cfg 1-30, width/height multiples of 8 or 64 per model, lora name in the server's list).
Everything else in the graph is frozen; to change it, edit and re-export the workflow.

## Run loop (HTTP, stdlib only)

Server defaults to `127.0.0.1:8188`. Endpoints used:

| Call | Purpose |
|---|---|
| `POST /prompt` body `{"prompt":<api graph>,"client_id":"<uuid>"}` | Queue; returns `prompt_id`, `number`, `node_errors` |
| `GET /history/<prompt_id>` | Empty `{}` until done; then `outputs` per node and `status` |
| `GET /view?filename=&subfolder=&type=output` | Download a result (percent-encode params) |
| `POST /upload/image` (multipart `image`, `type=input`) | Put an init/mask/control image on the server |
| `GET /object_info/<NodeClass>` | Valid option lists (checkpoints, loras) for validation |
| `GET /ws?clientId=<uuid>` | Optional live progress events instead of polling |

```python
import json, time, uuid, urllib.request, urllib.parse, pathlib
BASE = "http://127.0.0.1:8188"
def call(path, body=None):
    req = urllib.request.Request(BASE + path, data=json.dumps(body).encode() if body else None,
                                 headers={"Content-Type": "application/json"})
    return urllib.request.urlopen(req, timeout=30).read()

graph = json.load(open("wf.api.json")); pmap = json.load(open("wf.params.json"))
for k, v in {"prompt": "...", "seed": 184467}.items():
    node, field = pmap[k]; graph[node]["inputs"][field] = v
r = json.loads(call("/prompt", {"prompt": graph, "client_id": str(uuid.uuid4())}))
pid = r["prompt_id"]                       # non-empty r["node_errors"] or HTTP 400 = invalid graph
while not (h := json.loads(call(f"/history/{pid}"))): time.sleep(1)
out = pathlib.Path("out") / pid; out.mkdir(parents=True, exist_ok=True)
for node in h[pid]["outputs"].values():
    for img in node.get("images", []):
        q = urllib.parse.urlencode({k: img[k] for k in ("filename", "subfolder", "type")})
        (out / img["filename"]).write_bytes(call(f"/view?{q}"))
(out / "graph.api.json").write_text(json.dumps(graph, indent=1))
```

Rules:
- Add a wall-clock timeout to the poll loop; check `h[pid]["status"]["status_str"]` for `error`.
- Do not retry `POST /prompt` blindly; a dropped response may still have queued. Check history first.
- History is in memory and lost on server restart; copy outputs out promptly.
- Keep `subfolder` exactly as returned (Windows servers return backslashes).
- Cancel only your own job: use the per-job cancel route if your build has one (check its API
  docs), else `POST /queue {"delete":["<prompt_id>"]}` for a pending job. `POST /interrupt` stops
  whatever is running, including other clients' jobs.

## Provenance: save graph + seed beside outputs

For every kept output write, next to the image: the exact API graph submitted, the param values,
model/checkpoint/LoRA file names with sha256, ComfyUI version, and wall time. ComfyUI PNGs embed
the graph in metadata; strip it from public deliverables (`atelier:asset-pipeline`) but keep it in
the master. Fixed seed + same graph + same model files + same versions should reproduce the image
closely (GPU nondeterminism can still shift pixels).

## Recipes

Build each in the editor once, export API format, add a param map.

**ControlNet (structure from a reference)**
Load image -> preprocessor (Canny, depth, lineart, OpenPose) -> `ControlNetApplyAdvanced` between
the text conditioning and KSampler. Strength 0.5-0.9; end_percent 0.6-0.8 lets the model refine
details late. Match the ControlNet to the base model family (SD1.5 vs SDXL vs FLUX).

**LoRA (style or character)**
`LoraLoader` between checkpoint and CLIP/sampler. strength_model 0.6-1.0, strength_clip similar;
stack at most 2-3 and lower each. Include the trigger word in the prompt. Record LoRA file hash
and license; many LoRAs are non-commercial or derived from scraped likeness; skip those.

**Upscaling**
Two-step: model upscaler (`UpscaleModelLoader` + `ImageUpscaleWithModel`, 2x or 4x ESRGAN-class)
then optional low-denoise img2img pass (denoise 0.2-0.35) for detail. Tile for large outputs to fit
VRAM. Never upscale past what the delivery needs.

**Inpainting**
Upload image and mask (white = change). Use an inpaint checkpoint or `InpaintModelConditioning`;
denoise 0.6-1.0 for new content, 0.3-0.5 to touch up. Grow the mask 8-16 px and feather it;
crop-and-stitch the masked region at native resolution for small edits on big images.

**img2img / variations**
`LoadImage` -> `VAEEncode` -> KSampler with denoise 0.3-0.7. Lower keeps composition.

Sampler defaults to start from (tune per model card): SDXL 25-35 steps, cfg 5-7, dpmpp_2m karras;
FLUX-class 20-30 steps, guidance ~3.5, cfg 1.0. Use the model card's resolution buckets.

## Video

Same API for video models (Wan, LTX, Hunyuan class): outputs arrive as `gifs`/`videos` entries or
image sequences depending on the save node. Encode final delivery with ffmpeg, not in-graph. See
`atelier:ai-video` for shot planning.

## Safety

- Talk only to a local or trusted server. Keep it bound to `127.0.0.1`; if remote, put it behind
  an authenticated tunnel or VPN. Never pass `--listen 0.0.0.0` on an untrusted network; the API
  has no auth and runs arbitrary graphs.
- Custom nodes are arbitrary Python with full user rights. Do not install a node pack because a
  workflow asks for it. Check the repo, maintainer, stars/age, and read `__init__.py` and install
  scripts first; prefer core nodes; pin to a commit. Missing-node errors (`missing_node_type`) mean
  stop and ask, not auto-install.
- Download checkpoints only from the publisher's official page; prefer `.safetensors` over
  pickle `.ckpt`/`.pt`; verify the hash.
- Workflows found online are untrusted input: inspect them for odd nodes (shell, HTTP, file write)
  before running.

## Verify

- Submit returns empty `node_errors`; history status `success`.
- Open every output; check against the brief (`atelier:image-generation` section 6).
- `graph.api.json`, params and hashes saved beside the output; rerun with the same seed once to
  confirm it reproduces.
