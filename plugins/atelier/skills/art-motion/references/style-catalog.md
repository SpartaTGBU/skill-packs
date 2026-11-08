# Look catalog: choose a renderer treatment

Use this when Stage 1 has named an artist, era or material and you must decide how code will paint
it. Tags: [up] = in MIT huashu-art-motion; [practice] = our starting value, measurement overrides.
Anything marked (hypothesis) is untested on a second subject; try it before promising it.

## Step 1: find the renderer family that matches the mark-making

| The look is made of | Family | What code does per frame | Known risk |
|---|---|---|---|
| long directional strokes (oil, expressionism) | stroke field | flow-field strokes in passes: vertical surfaces, perspective floor, remainder; palette per region; dark outline per stroke | slow per frame; for a wavy-line look (Munch) keep margin >= max displacement or edges show blank [practice] |
| many small marks (impressionism, pointillism, pop, constructivism) | dabs and dots | short offset warm/cool dabs; equal-size pure dots with complementary accents; tiled Ben-Day dots on a 45 degree grid; variable halftone with bold red/black geometry | faces shatter under dabs; dot grids look mechanical |
| transparent or absorbent media (watercolour, ink) | wash and ink | layered transparent washes with a water edge and cel crescent shadows; ink adds only to paper, keeps large blanks, dry-brush skips sampled along arc length, blur bleed, seal stamp | blur must be deterministic: render one frame twice, diff must be zero |
| flat shapes (cut paper, flat vector, Bauhaus, cubism) | flat and cut | irregular scissor edge plus pinned shadow; grain-stipple fill with no outline; pure geometry on a grid; translucent facets with unclipped triangles | reads as clip art if grouping and scale contrast are not re-solved |
| tesserae (mosaic) | tiles | stones placed along distance-field contours, grout from Voronoi; compute layout once, animate colour only | stone size must leave grout visible; start slightly above half the spacing [practice] and check on your render |
| few pixels or neon | low-res and glow | pixel: render about 240x135, nearest-neighbour upscale, 14-colour palette, 1 px outline [up, one demo]; vaporwave: two-colour neon, perspective grid, RGB-split VHS overlay | do not smooth the upscale |
| light as subject | light-led | anime sky: clouds, rays, hard cel bands (part minus offset copy), bloom; chiaroscuro: paint bright then multiply a window or candle light map; early CGI: plastic shading, checker reflection, chrome ball, wireframe-to-shaded entrance | bloom hides weak drawing |
| frame rate is the style | stepped time | rubber hose about 12 fps, shadow puppet about 10 fps [up demo values]; cave painting: two alternating poses make a running animal | applying steps to the whole piece |

## Step 2: styles with no recipe here
Ukiyo-e (fill offset a few px from the key line) and Hopper or Dali (twin bright and dark render
with sheared shadows) are hypotheses. For any other period (Egyptian, Gothic, Klimt, Art Nouveau,
Picasso blue) write 3 observable traits from 3 works, render one frame, and keep the look only if a
viewer can name the period with no caption (Stage 4 Check 6).

## Step 3: renderer cost and speed
- Halftone: a tiled pattern fill beats per-dot drawing; batch dots into one path [practice].
- Cel shadow: draw the part, subtract a copy shifted toward the light, fill the remainder.
- Characters from a reference [practice]: lay a coarse grid (20 px to start, halve it if joints
  blur), read joint positions per part, smooth the path (Catmull-Rom is one choice), then flat fill,
  style texture, clean contour.
