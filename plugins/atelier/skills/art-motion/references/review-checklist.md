# Review checklist, ordered by how a defect is detected

Run the group that matches the stage; defects of one kind are cheapest to catch in the group named.
Tags: [up] = a gate or finding from MIT huashu-art-motion; [practice] = our judgment.

## Group 1: read the shot sheet (no render yet)
- Style line, palette line and character policy exist; palette values are real colours and none is blue-violet.
- Every row has a concrete noun and a verb; none says "solid colour" or "black".
- Last row is not a text card; shots 2-6 s; text-led rows at most 30% [practice]; neighbours differ in composition.
- On-screen numbers equal the voice script's numbers.
- No layout, character or prop matches a sample or famous work.

## Group 2: look at a contact sheet
| You see | Do |
|---|---|
| a screenshot, photo or clip redrawn in code | replace with the full-bleed asset |
| flat colour, black, or starfield with a tiny mover | the hero fills at least half the frame [practice] |
| a different style per shot, chibi code people, faces on coins | lock one style and palette; hands/backs or generated frames |
| fixed header, page number chrome, fading bullets | remove |

## Group 3: measure with ffmpeg (commands are in SKILL.md Stage 4 Checks)
- Too static: fast-motion share under 3.5% is red, under 6% amber [up]. Our ffmpeg scene count only approximates upstream's measure and is noisy on clips under about 10 s; use it to decide where to look.
- Dead frames: a near-single-colour stretch over 0.3 s mid-film is red [up].
- Blue-violet: a frame counts when at least 30% of its pixels have hue 225-300 degrees, saturation >= 0.30 and value 0.06-0.90; red when at least 30% of the film's frames count, amber at 12% [up]. Waived only if the topic is blue-violet. Tested script (save as `bv.py`; stdlib only):
  ```
  ffmpeg -v error -i out.mp4 -vf "fps=2,scale=160:90" -f rawvideo -pix_fmt rgb24 - | python3 -I bv.py
  ```
  ```python
  import sys, colorsys
  W, H = 160, 90; n = W*H*3; frames = bad = 0
  while len(b := sys.stdin.buffer.read(n)) == n:
      hit = sum(225 <= h*360 <= 300 and s >= .30 and .06 <= v <= .90
                for h, s, v in (colorsys.rgb_to_hsv(b[i]/255, b[i+1]/255, b[i+2]/255) for i in range(0, n, 3)))
      frames += 1; bad += hit/(W*H) >= .30
  print(f"{bad}/{frames} blue-violet frames = {bad/max(frames,1):.2f}")
  ```
- Camera: three identical moves in a row, or a centred quote card as ending, fails [up].
- Push-in count: see Camera moves in SKILL.md.
- Light films with no captions: keep graphics out of the subtitle zone.

## Group 4: watch at normal speed
Judder, camera feel and a slack ending cannot be seen in frames. One full watch, real speed, full screen.

## Delivery
Someone who did not build it reviews the final video only. Record measured facts (duration, gate
results) and justify every amber. Write new proven techniques and traps back into these files.
For a reference film you are studying: dump stills with ffmpeg, note cut times, camera moves and
loops per segment, and rebuild the mechanism, not the pixels.
