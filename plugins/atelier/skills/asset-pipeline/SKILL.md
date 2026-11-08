---
disable-model-invocation: true  # skl: on-demand pack skill
name: asset-pipeline
description: >
  Prepare visual assets for delivery: choose formats (AVIF, WebP, PNG, JPEG, SVG; EXR or 16-bit
  PNG masters for renders), generate responsive sizes with srcset, hit compression budgets, manage
  colour spaces (sRGB, Display P3, ACES), name and lay out files, and keep a provenance and license
  manifest. Use when exporting or optimizing images for web or apps, setting up an image build
  step, fixing slow or blurry images, organizing a design asset folder, or recording where assets
  came from.
---

# Asset pipeline

Masters in, generated deliverables out, every file traceable. Use the project's existing image
tooling first (framework image component, CDN transforms, a sharp/libvips script). Generate
variants from masters by script; never hand-export deliverables one by one.

## 1. Formats

| Content | Deliver | Master |
|---|---|---|
| Photos, renders, AI images | AVIF, WebP fallback, JPEG last resort | Lossless PNG/TIFF or camera raw |
| UI screenshots, flat art with text | PNG (oxipng) or lossless WebP; AVIF if it stays crisp | PNG |
| Icons, logos, line art, diagrams | SVG (`atelier:illustration-and-icons`) | SVG source + editor file |
| Transparency over photos | AVIF/WebP with alpha; PNG fallback | PNG with alpha |
| 3D renders, compositing | 8-bit sRGB deliverables | OpenEXR (half float, linear) or 16-bit PNG |
| Animation | MP4/WebM video (`atelier:video-editing`), never GIF over ~1 MB | Image sequence or ProRes |

Never re-encode a lossy file as a master. Never deliver a raster of something that exists as
vector.

## 2. Responsive sizes

Widths: 320, 640, 960, 1280, 1920, 2560 (drop sizes larger than the master; never upscale to fill
the ladder). Cap density at 2x for photos; 3x only for small crisp UI art.

```html
<picture>
  <source type="image/avif" srcset="hero-w640.avif 640w, hero-w1280.avif 1280w, hero-w1920.avif 1920w">
  <source type="image/webp" srcset="hero-w640.webp 640w, hero-w1280.webp 1280w, hero-w1920.webp 1920w">
  <img src="hero-w1280.jpg" width="1920" height="1080" alt="..."
       sizes="(min-width: 64rem) 50vw, 100vw" fetchpriority="high">
</picture>
```

- `sizes` must match the real layout slot; a wrong `sizes` downloads the biggest file every time.
- Always set `width`/`height` (or CSS `aspect-ratio`) to prevent layout shift.
- The LCP image: never `loading="lazy"`, add `fetchpriority="high"`, consider a preload. All
  below-the-fold images: `loading="lazy" decoding="async"`.
- Art direction (different crop on mobile) uses `<source media=...>`, not just smaller files.
- Native apps: platform densities (Android mdpi..xxxhdpi, iOS @1x/@2x/@3x) or vector drawables
  (`atelier:mobile-native`).

## 3. Compression budgets

| Slot | Budget (largest variant actually served on mobile) |
|---|---|
| Hero / LCP image | <= 200 KB (aim 100-150 KB) |
| Content image | <= 100 KB |
| Thumbnail / avatar | <= 30 KB |
| Icon SVG | <= 2 KB each after svgo |
| Total image weight, initial view | <= 500 KB |

Starting quality (tune by eye): AVIF q 45-60 (speed 4-6), WebP q 75-82, JPEG mozjpeg q 75-82
progressive, PNG through oxipng (`-o 4`, `--strip safe`) or pngquant for flat art. Compare
encoded vs master at 100% on the hard parts (skin, gradients, text, edges); raise quality only
where banding or smearing shows. Lighthouse `image-delivery-insight` and `unsized-images` audits
must pass.

Tools: sharp or libvips for batch resize/encode; `avifenc`, `cwebp`, `oxipng`, `svgo`; ImageMagick
for odd formats; `ffmpeg` for sequences; `exiftool` for metadata. Pin tool versions in the
script so outputs stay stable.

## 4. Colour spaces

- Web and apps default: sRGB, ICC profile embedded or tagged. Untagged files are assumed sRGB.
- Wide gamut: Display P3 only when the content needs it (product colour, saturated art) and the
  target displays it. Embed the P3 profile; provide sRGB fallback where support is unknown. CSS
  colours: `color(display-p3 ...)` inside `@supports` or `@media (color-gamut: p3)`.
- Renders and compositing: work scene-linear (ACES or linear sRGB), store EXR, apply the view
  transform (AgX, Filmic, ACES output) once at export to sRGB/P3. Never sharpen or compress in
  linear.
- HDR stills: only with an explicit SDR fallback and a target that renders HDR.
- Print: keep RGB masters; convert to CMYK only with the printer's profile, as the last step.
- Check: open the deliverable in a colour-managed viewer next to the master; colours must match.

## 5. Naming and folder layout

- kebab-case, lowercase, ASCII: `pricing-hero-team.avif`.
- Variant suffixes: `-w640` for width, `@2x` for density, `-dark` for theme, `-p3` for gamut.
- No spaces, no `final-v2-REAL`; versions live in git or the manifest, not the name.
- Content-hashed names (`hero.3f9a1c.avif`) only if the build adds them; enables long cache
  (`Cache-Control: max-age=31536000, immutable`).

```
assets/
  src/            # masters: PNG/TIFF/EXR/SVG/editor files (Git LFS if large)
  dist/           # generated; gitignored or built in CI
  manifest.json   # provenance + license per master
  build-images.*  # the one script that makes dist/ from src/
```

## 6. Provenance and license manifest

One record per master; generated variants inherit it.

```json
{"path":"src/pricing-hero-team.png","sha256":"...","source":"generated|photo|stock|commissioned|in-house",
 "author":"...","license":"...","license_url":"...","attribution_required":false,
 "model":"...","seed":184467,"prompt_ref":"prompts/library.jsonl#2026-11-01-teapot-03",
 "consent":"model release on file|n/a","added":"2026-11-01","notes":""}
```

- No license, no ship. Stock and fonts: record the exact license tier and seat/usage limits.
- People: record the model release or consent reference; no consent, no use.
- AI images: record model, version, seed or request id and the vendor terms (`atelier:image-generation`).
- Strip private metadata (GPS, camera serials, editor paths, embedded workflow graphs) from
  deliverables with `exiftool` or the encoder's strip option; keep the master untouched.
- C2PA Content Credentials: re-encoding and metadata stripping remove them. If a source carries
  credentials, or the project must disclose AI use, preserve or re-sign them with a C2PA tool at
  the final export step and check them in a C2PA verifier. Do not strip vendor watermarks.

## 7. Verify

- Build script runs headless from a clean checkout and reproduces `dist/` exactly.
- Every deliverable: within budget, correct dimensions, colour profile present, opens in a browser.
- Spot-check the largest and smallest variant at 100% against the master; no banding, halos,
  wrong crop or lost alpha.
- Page check: run Lighthouse or the project's perf test; no unsized images, LCP image not lazy,
  correct candidate chosen at mobile and desktop widths (DevTools network panel).
- Every master has a manifest record with a license; `alt` text written for every meaningful
  image, `alt=""` for decorative ones.
