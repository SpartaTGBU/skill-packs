# Web spring + motion snippets

Copy-paste, framework-free. All gated for reduced motion. All animate transform/opacity only.

## Spring easings (CSS vars)

```css
:root{
  --spring-settle:cubic-bezier(.2,.8,.2,1);   /* default interactive */
  --spring-pop:cubic-bezier(.34,1.56,.64,1);   /* one tiny overshoot, sparingly */
  --fast:160ms; --mid:260ms; --enter:480ms;
}
```

## Tactile press + settle hover (every clickable)

```css
.btn{transition:transform var(--fast) var(--spring-settle),
              background var(--fast) var(--spring-settle);}
.btn:hover{transform:translateY(-1px)}
.btn:active{transform:scale(.98)}
@media (prefers-reduced-motion:reduce){.btn{transition:none}.btn:hover,.btn:active{transform:none}}
```

## Leading / trailing edge moving highlight (the stretch)

An underline/pill that moves between nav items and STRETCHES because its two
edges ride different-speed springs. Set --x and --w from JS on hover.

```css
.nav{position:relative}
.nav .ind{position:absolute;bottom:0;height:2px;background:var(--accent);
  left:var(--x,0);width:var(--w,0);
  transition:left var(--mid) var(--spring-settle), width var(--fast) var(--spring-settle);}
/* left (trailing) is SLOW(--mid), width (leading reach) is FAST(--fast) => it stretches then settles */
@media (prefers-reduced-motion:reduce){.nav .ind{transition:none}}
```
```js
const nav=document.querySelector('.nav'), ind=nav.querySelector('.ind');
nav.querySelectorAll('a').forEach(a=>a.addEventListener('mouseenter',()=>{
  const r=a.getBoundingClientRect(), nr=nav.getBoundingClientRect();
  ind.style.setProperty('--x',(r.left-nr.left)+'px');
  ind.style.setProperty('--w',r.width+'px');
}));
```

## 3D tilt card with pointer spotlight (clamped, springy return)

```css
.tilt{perspective:1000px}
.tilt .face{transform:rotateX(var(--rx,0)) rotateY(var(--ry,0));
  transition:transform 120ms var(--spring-settle);transform-style:preserve-3d;
  position:relative;overflow:hidden}
.tilt .face::after{content:'';position:absolute;inset:0;opacity:0;transition:opacity 200ms;
  background:radial-gradient(240px circle at var(--mx,50%) var(--my,50%),
    color-mix(in srgb,var(--accent) 18%,transparent),transparent 60%)}
.tilt:hover .face::after{opacity:1}
@media (prefers-reduced-motion:reduce){.tilt .face{transition:none}.tilt .face{transform:none}}
```
```js
document.querySelectorAll('.tilt').forEach(t=>{
  const f=t.querySelector('.face'); let raf;
  t.addEventListener('pointermove',e=>{
    const r=t.getBoundingClientRect(), px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
    cancelAnimationFrame(raf); raf=requestAnimationFrame(()=>{
      f.style.setProperty('--ry',((px-.5)*12).toFixed(2)+'deg');   // clamp ~±6–9deg
      f.style.setProperty('--rx',((.5-py)*8).toFixed(2)+'deg');
      f.style.setProperty('--mx',(px*100)+'%'); f.style.setProperty('--my',(py*100)+'%');
    });
  });
  t.addEventListener('pointerleave',()=>{f.style.setProperty('--ry','0deg');f.style.setProperty('--rx','0deg');});
});
```

## Scroll-reveal stagger (CSS scroll-driven, no library)

```css
@media (prefers-reduced-motion:no-preference){
  @supports (animation-timeline:view()){
    .reveal{animation:rise linear both;animation-timeline:view();
      animation-range:entry 0% cover 28%;}
  }
}
@keyframes rise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
```
Fallback (IntersectionObserver) when `view()` unsupported:
```js
if(!CSS.supports('animation-timeline','view()')){
  const io=new IntersectionObserver((es)=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.2});
  document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.setProperty('--i',i%8);io.observe(el)});
}
```
```css
.reveal{opacity:0;transform:translateY(22px);transition:opacity var(--enter) var(--spring-settle),transform var(--enter) var(--spring-settle);transition-delay:calc(var(--i,0)*45ms)}
.reveal.in{opacity:1;transform:none}
```

## Perspective scroll-3D scaffold (layers at different translateZ)

True 3D parallax: a perspective viewport, layers pushed back in Z move slower.
Dark Framer-style canvas recommended (pure black, one electric accent, pill shapes).

```css
.scene3d{perspective:6px;perspective-origin:50%;height:100vh;overflow-x:hidden;overflow-y:auto}
.scene3d .layer{position:absolute;inset:0;transform-style:preserve-3d}
.scene3d .back{transform:translateZ(-6px) scale(2)}   /* far, moves slowest */
.scene3d .mid {transform:translateZ(-3px) scale(1.5)}
.scene3d .front{transform:translateZ(0)}
@media (prefers-reduced-motion:reduce){.scene3d{perspective:none}.scene3d .layer{transform:none}}
```

## Content swap (blur out fast, blur in slow)

```css
.swap{transition:opacity 120ms linear, filter 120ms linear}
.swap.out{opacity:0;filter:blur(8px)}       /* exit fast */
.swap.in {opacity:1;filter:blur(0);transition:opacity 220ms var(--spring-settle),filter 220ms var(--spring-settle);transition-delay:80ms}
```

## Reduced motion catch-all

```css
@media (prefers-reduced-motion:reduce){
  *{animation-duration:.001ms!important;animation-iteration-count:1!important;
    transition-duration:.001ms!important;scroll-behavior:auto!important}
}
```
Use the catch-all only as a backstop; prefer per-component reduced-motion blocks.
