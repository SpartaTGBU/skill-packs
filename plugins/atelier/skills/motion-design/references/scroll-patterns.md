# Scroll patterns: canonical skeletons

Tool order: CSS scroll-driven animation (`animation-timeline: view()/scroll()`) then IntersectionObserver (or Motion `whileInView`) then GSAP ScrollTrigger only for real pin/scrub. Framework-free CSS/IO versions are in `web-springs.md`. The React skeletons below assume Motion (`motion/react`) and GSAP; port the structure to other stacks.

Failure that recurs: the trigger fires halfway through scroll instead of pinning at viewport top. Fix: `start: "top top"`, not `"top center"` or `"top 80%"`. Isolate GSAP/Three in leaf client components with `useEffect` cleanup (`ctx.revert()`); never mix GSAP/Three with Motion in one component tree; one scroll-hijack and one marquee per page at most.

## Sticky stack (cards pin and the previous card recedes)

```tsx
"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
gsap.registerPlugin(ScrollTrigger);

export function StickyStack({ cards }: { cards: React.ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || !ref.current) return;
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>(".stack-card");
      els.forEach((card, i) => {
        if (i === els.length - 1) return;
        ScrollTrigger.create({ trigger: card, start: "top top", endTrigger: els[els.length - 1],
          end: "top top", pin: true, pinSpacing: false });
        gsap.to(card, { scale: 0.92, opacity: 0.55, ease: "none",
          scrollTrigger: { trigger: els[i + 1], start: "top bottom", end: "top top", scrub: true } });
      });
    }, ref);
    return () => ctx.revert();
  }, [reduce]);
  return (<div ref={ref} className="relative">
    {cards.map((c, i) => <div key={i} className="stack-card sticky top-0 min-h-[100dvh] flex items-center justify-center">{c}</div>)}
  </div>);
}
```
Points: every card but the last is pinned; the scale/opacity of card i is driven by card i+1's trigger.

## Horizontal pan (vertical scroll drives a sideways track)

```tsx
export function HorizontalPan({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null), track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || !wrap.current || !track.current) return;
    const ctx = gsap.context(() => {
      const distance = track.current!.scrollWidth - window.innerWidth;
      gsap.to(track.current, { x: -distance, ease: "none", scrollTrigger: {
        trigger: wrap.current, start: "top top", end: () => `+=${distance}`,
        pin: true, scrub: 1, invalidateOnRefresh: true } });
    }, wrap);
    return () => ctx.revert();
  }, [reduce]);
  return (<section ref={wrap} className="relative overflow-hidden">
    <div ref={track} className="flex h-[100dvh] items-center">{children}</div></section>);
}
```
Pin the wrapper, scrub the inner track, scroll length equals horizontal travel. Starting the tween before the pin shows half a slide.

## Reveal stagger (lighter than GSAP)

```tsx
<motion.li initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }} />
```

## Rules

- Forbidden: `window.addEventListener("scroll", ...)` for animation, scroll progress held in React state, rAF loops that set React state. Use `useScroll`, ScrollTrigger, IntersectionObserver or CSS timelines. Continuous values (pointer, scroll) go in motion values, never `useState`.
- `layout`/`layoutId` only for visible state changes (reorder, expanding modal, shared element); not "for safety".
- `staggerChildren` needs parent variants and children in the same client component tree.
- Grain/noise only on a fixed `pointer-events-none` overlay. Document the z-index scale.
