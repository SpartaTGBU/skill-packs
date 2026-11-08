# Checks without special tooling

All commands read `out.mp4`. Replace times and paths.

## Reading time and holds
Frame rate: `ffprobe -v error -select_streams v -show_entries stream=r_frame_rate -of csv=p=0 out.mp4`.
List each text with its start and end from your shot table; required seconds = 0.3 x words + 0.5,
at least 1.2 [up]. Pass when end minus start is at least that. For the 1.2 s turn hold, grab frames at
land time and land time + 1.2 s: both must show the same shot (`ffmpeg -ss T -i out.mp4 -frames:v 1 a.png`),
and the cut list (below) must have no cut between.

## Stills (4 s rule [up])
`ffmpeg -i out.mp4 -vf "freezedetect=n=0.003:d=4" -an -f null - 2>&1 | grep freeze_`
Any `freeze_start` line is a failure unless the hold is deliberate and says so in the storyboard.
Use d=1.2 to see every real hold.

## Cut list
`ffmpeg -i out.mp4 -vf "select='gt(scene,0.4)',showinfo" -an -f null - 2>&1 | grep -o "pts_time:[0-9.]*"`
Compare with the shot table; whips and dissolves may need a lower threshold (0.2).

## Black level and lifted whites (grade test)
`ffmpeg -ss 5 -i out.mp4 -frames:v 1 -vf "signalstats,metadata=print" -f null - 2>&1 | grep -E "YMIN|YLOW|YHIGH|YMAX"`
Fail "milky" when YLOW (1st percentile luma) is above about 30 on 0-255 in a shot meant to have dark
areas, or YHIGH is below about 220 in a shot meant to have bright ones [practice]. Sample one frame per shot.

## Motion curve (no constant speed)
Track one moving element's x per frame (export a strip of 12 frames, note the pixel x of its left
edge). Constant speed means equal differences between frames for most of the move. An ease or
spring shows differences that grow then shrink. Fail on equal steps over more than 8 frames [practice] unless the
move is stepped art on purpose.

## Focal point (one thing brightest per shot)
`ffmpeg -ss T -i out.mp4 -frames:v 1 -vf "gblur=sigma=20,format=gray,scale=64:36" -f rawvideo - | python3 -c "import sys;d=sys.stdin.buffer.read();i=d.index(max(d));print(i%64/64,i//64/36)"`
Prints the x,y (0-1) of the brightest blurred cell. Pass when it falls inside the box of the shot's
named focal point [practice]. Dark-on-light shots: use the darkest cell and say so.

## Faces and panels (no tooling)
Per aspect ratio, grab a frame: `ffmpeg -ss T -i out.mp4 -frames:v 1 f.png`. Draw the face box
(hairline to chin, ear to ear; record the four edges as pixel coordinates) and each panel box:
`ffmpeg -i f.png -vf "drawbox=x=420:y=180:w=240:h=300:color=red@0.6:t=4,drawbox=x=300:y=900:w=480:h=160:color=cyan@0.6:t=4" box.png`
Open it. Overlap of the two boxes in any frame fails. Do this at 16:9 and again at 9:16.

## Safe zone (vertical)
On a 1080x1920 frame: `drawbox=x=56:y=250:w=884:h=1230:color=yellow@0.5:t=3`. Everything the viewer
must read sits inside the yellow box.

## Voice against music (needs stems)
You need `voice.wav` and `music.wav` rendered at the final levels (stems from your mix, or a
separation tool of your choice; nothing here requires one). Per second, band-limit and meter:
```bash
for f in voice music; do
 ffmpeg -i $f.wav -ar 44100 -af "highpass=f=500,lowpass=f=4000,asetnsamples=n=44100:p=0,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=$f.txt" -f null -
done
paste -d' ' <(grep -o 'RMS_level=.*' voice.txt|cut -d= -f2) <(grep -o 'RMS_level=.*' music.txt|cut -d= -f2) \
 | awk '$1>-50{a++; if($1-$2>=3)h++} END{print h/a}'   # fraction of active seconds; pass at 0.8 or more
```
Each file holds one RMS_level per second (`asetnsamples` makes the windows one second long). A voice second is active when its level is above -50 dB
[practice]. The awk line counts active seconds where voice level minus music level is at least 3 dB and divides; pass at 80% or more. Stems must be sample-aligned (same start, same sample rate).
Without stems, skip it and do a phone-volume listen, and say so.

## Whole mix
`ffmpeg -i out.mp4 -af ebur128=peak=true -f null - 2>&1 | tail -12` gives integrated LUFS, LRA and true peak.
