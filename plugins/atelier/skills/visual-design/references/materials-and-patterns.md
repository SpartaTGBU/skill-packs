# Pattern vocabulary and materials

Names to design and communicate with. Pull a pattern only when the design read calls for it. Motion implementations live in `atelier:motion-design`.

## Vocabulary

- Hero: asymmetric split (text one side, asset the other); editorial manifesto (large type, no asset); video/media mask (type as window to video); kinetic type; curtain reveal; scroll-pinned hero.
- Navigation: dock magnification; magnetic button; gooey menu; dynamic-island pill for status; radial menu; speed-dial FAB; mega-menu reveal.
- Layout: bento grid; masonry; chroma grid (borders with animated gradients); split-screen scroll; sticky-stack sections.
- Cards: parallax tilt; spotlight border; glass panel; holographic foil; swipe stack; morphing modal (button expands into dialog).
- Scroll: sticky stack; horizontal scroll hijack; sequence scroll; zoom parallax; scroll-progress path (SVG line draw); liquid-swipe transition.
- Galleries: 3D dome; coverflow; drag-to-pan grid; accordion image slider; hover image trail.
- Type effects: marquee (max one per page); text-mask reveal; scramble decode; circular text path; gradient stroke; letters dodging cursor.
- Micro-interactions: skeleton shimmer; directional hover fill; ripple; SVG line drawing; mesh gradient background; lens blur depth.

## Surface upgrades

True glass (blur + 1px inner border + inset highlight); spotlight borders; grain/noise overlay on a fixed `pointer-events-none` layer only (never on scrolling containers, it repaints every frame); tinted shadows; consistent light direction across all shadows.

## Liquid glass, honest web approximation

Label it an approximation in code comments. Always keep enough contrast without blur; `prefers-reduced-transparency` support is uneven, test it.

```css
.glass-approx{
  position:relative;isolation:isolate;overflow:hidden;border-radius:999px;
  border:1px solid rgb(255 255 255/.32);
  background:linear-gradient(135deg,rgb(255 255 255/.30),rgb(255 255 255/.08)),rgb(255 255 255/.12);
  backdrop-filter:blur(24px) saturate(180%) contrast(1.05);
  -webkit-backdrop-filter:blur(24px) saturate(180%) contrast(1.05);
  box-shadow:inset 0 1px 0 rgb(255 255 255/.48),inset 0 -1px 0 rgb(255 255 255/.12),0 18px 60px rgb(0 0 0/.18);
}
.glass-approx::before{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;pointer-events:none;
  background:radial-gradient(circle at 20% 0%,rgb(255 255 255/.55),transparent 34%),
             linear-gradient(90deg,rgb(255 255 255/.18),transparent 42%,rgb(255 255 255/.14))}
@media (prefers-color-scheme:dark){.glass-approx{border-color:rgb(255 255 255/.18);
  background:linear-gradient(135deg,rgb(255 255 255/.16),rgb(255 255 255/.04)),rgb(15 23 42/.42);
  box-shadow:inset 0 1px 0 rgb(255 255 255/.22),0 18px 60px rgb(0 0 0/.42)}}
@media (prefers-reduced-transparency:reduce){.glass-approx{background:rgb(255 255 255/.96);backdrop-filter:none;-webkit-backdrop-filter:none}}
```

## Performance and DOM cost

LCP < 2.5s (preload the hero image), INP < 200ms, CLS < 0.1 (reserve space for images, fonts, embeds). Lazy-load anything below the fold; Motion and Three.js are not tiny. Animate only `transform` and `opacity`.
