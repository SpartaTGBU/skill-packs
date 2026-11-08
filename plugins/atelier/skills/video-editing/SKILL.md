---
disable-model-invocation: true  # skl: on-demand pack skill
name: video-editing
description: >
  Edit existing footage headlessly with ffmpeg: probe first, stream-copy when possible, then trim,
  concat, crop/scale, grade or LUT, picture-in-picture, chroma key, stabilize, normalize loudness
  (EBU R128), add captions (burn-in or sidecar), and export to delivery presets in batch, with a
  probe-and-look verify loop. Use when asked to cut, join, crop, resize, reformat, color-correct,
  subtitle, denoise, compress, transcode or batch-process video files, or to prep footage for
  YouTube, social or broadcast.
---

# Video editing

Scripted, reproducible edits, not click-through NLE work. ffmpeg (6.x+) and ffprobe are the tools;
an MLT project rendered with `melt` is the option when someone will reopen the edit in Kdenlive or
Shotcut. To build new motion graphics, use atelier:video-composition; for generated shots,
atelier:ai-video; for the final look-at-frames pass, atelier:visual-qa.

## 1. Probe first, never guess

Before any command, read the real stream facts:
```sh
ffprobe -v error -show_entries \
  stream=index,codec_type,codec_name,profile,pix_fmt,width,height,sample_aspect_ratio,r_frame_rate,avg_frame_rate,color_transfer,color_primaries,channels,sample_rate:format=duration,bit_rate \
  -of json in.mp4
```
- **fps**: `r_frame_rate` != `avg_frame_rate` means variable frame rate (phone/screen captures).
  VFR breaks concat, sync and some editors: convert once with `-fps_mode cfr -r 30` (or the
  source's nominal rate) before editing.
- **pix_fmt / bit depth**: 10-bit (`yuv420p10le`) or HDR (`color_transfer=smpte2084` PQ or
  `arib-std-b67` HLG) needs tone-mapping before SDR delivery; never just drop to 8-bit.
- **rotation**: phone clips may carry a display-matrix rotation side-data; check before cropping.
- **audio**: channels, sample rate (48 kHz for video), and whether a stream exists at all.
- Keep the probe JSON next to the job; every later step quotes its numbers.

## 2. Stream-copy when possible

Re-encoding costs quality and time. Use `-c copy` when the operation does not touch pixels or
samples: remux (MKV to MP4), cut on keyframes, concat of identical-spec clips, swap/drop tracks,
add metadata or a sidecar subtitle. Any filter (`-vf`, `-af`, `-filter_complex`) forces a
re-encode of that stream; copy the other stream (`-c:a copy`) when it is untouched.

Always map explicitly (`-map 0:v:0 -map 0:a:0`) so streams are not silently dropped or picked
wrong, and add `-map_metadata 0` when metadata matters.

## 3. Recipes

| Task | Command core |
|---|---|
| Trim, fast (keyframe-aligned, may start a bit early) | `-ss 00:01:05 -to 00:02:10 -i in.mp4 -c copy` |
| Trim, frame-accurate | `-ss 65 -i in.mp4 -t 65 -c:v libx264 -crf 18 -c:a aac` (input `-ss` is accurate when re-encoding) |
| Concat, same codec/size/fps | `printf "file '%s'\n" a.mp4 b.mp4 > list.txt; ffmpeg -f concat -safe 0 -i list.txt -c copy out.mp4` |
| Concat, mixed sources | normalize each (scale, fps, `setsar=1`, `aresample=48000`) then `concat=n=2:v=1:a=1` filter |
| Crop to 9:16 from 16:9 | `-vf "crop=ih*9/16:ih:(iw-ow)/2:0,scale=1080:1920"` (move x to follow the subject) |
| Scale with letterbox | `scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:-1:-1:color=black,setsar=1` |
| Basic grade | `eq=contrast=1.05:saturation=1.1:gamma=0.98`, `colorbalance=rs=.03:bs=-.03`, `curves=preset=medium_contrast` |
| LUT | `lut3d=file=look.cube:interp=tetrahedral` (apply after any log-to-Rec.709 conversion LUT) |
| HDR to SDR | `zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p` |
| Picture-in-picture | `[1:v]scale=iw/4:-2[p];[0:v][p]overlay=W-w-48:H-h-48` (margin >= 2.5% of width) |
| Chroma key | `[1:v]chromakey=0x00FF00:0.12:0.08,despill=type=green[k];[0:v][k]overlay` (tune similarity 0.08-0.2) |
| Stabilize (2-pass, needs libvidstab) | pass 1 `-vf vidstabdetect=shakiness=6:result=t.trf -f null -`; pass 2 `-vf vidstabtransform=input=t.trf:smoothing=20:zoom=2,unsharp=5:5:0.8` |
| Stabilize, fallback | `deshake` (single pass, weaker) |
| Denoise | `hqdn3d=2:1.5:3:3` (light) or `nlmeans` (slow, better) |
| Speed 2x | `-filter_complex "[0:v]setpts=PTS/2[v];[0:a]atempo=2[a]"` (chain `atempo` for > 2x) |
| Fades | `fade=t=in:st=0:d=0.5`, `afade=t=out:st=58.5:d=1.5` |
| Crossfade | `xfade=transition=fade:duration=0.5:offset=<len1-0.5>` plus `acrossfade=d=0.5` |
| GIF | `fps=12,scale=720:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse=dither=bayer` |

Filter order: deinterlace/fps fix, crop, scale, grade/LUT, overlays and text, then `format=yuv420p`
last. Grade on the full-quality source, not on a compressed proxy.

## 4. Audio and loudness (EBU R128)

Targets, integrated loudness with true peak <= -1 dBTP:

| Destination | Integrated |
|---|---|
| YouTube, Spotify, most streaming/social | -14 LUFS |
| Podcasts, Apple, general web | -16 LUFS |
| Broadcast (EBU R128) | -23 LUFS (ATSC A/85: -24 LKFS) |

Two-pass `loudnorm` (single pass is dynamic and can pump):
```sh
ffmpeg -i in.mp4 -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null - 2> pass1.txt
# read input_i, input_tp, input_lra, input_thresh, target_offset from pass1.txt, then:
ffmpeg -i in.mp4 -af loudnorm=I=-14:TP=-1:LRA=11:measured_I=..:measured_TP=..:measured_LRA=..:measured_thresh=..:offset=..:linear=true \
  -c:v copy -c:a aac -b:a 192k -ar 48000 out.mp4
```
Also: `highpass=f=80` on voice, `afftdn` for hiss, duck music under VO with `sidechaincompress`.
Measure after: `-af ebur128=peak=true -f null -` and read the summary.

## 5. Captions

- **Sidecar (default)**: SRT or WebVTT, toggleable, searchable, accessible, survives re-encodes.
  Mux into MP4 with `-c:s mov_text` or MKV with `-c:s srt`; or upload separately.
- **Burn-in**: only for social autoplay where the platform ignores sidecars, or for styled
  captions. `-vf "subtitles=subs.srt:force_style='FontName=Inter,FontSize=22,Outline=2,MarginV=60'"`;
  for full styling author ASS and use `ass=subs.ass`. Burn-in forces a re-encode.
- Line rules: max 2 lines, ~32-42 characters per line, 1-7 s on screen, ~17 characters/s reading
  speed, keep inside title-safe and above platform UI (see atelier:video-composition section 3).
- Generate the transcript with a local ASR (e.g. whisper.cpp) and proof-read names and numbers;
  never ship unreviewed auto-captions.

## 6. Delivery presets

All web/social deliveries: `-pix_fmt yuv420p -movflags +faststart`, AAC 48 kHz, closed GOP
helps scrubbing (`-g` = 2x fps).

| Target | Video | Notes |
|---|---|---|
| Web/social master, H.264 | `-c:v libx264 -preset slow -crf 18 -profile:v high` | widest compatibility; CRF 18-23 (lower = bigger) |
| YouTube 1080p30 | H.264 as above, or `-b:v 12M -maxrate 16M -bufsize 24M` for bitrate caps | AAC 384k stereo |
| H.265 / HEVC | `-c:v libx265 -crf 22 -preset medium -tag:v hvc1` | ~40% smaller; `hvc1` tag for Apple playback |
| AV1 | `-c:v libsvtav1 -crf 32 -preset 6` | smallest; check the target player supports it |
| Edit hand-off / mezzanine | `-c:v prores_ks -profile:v 3 -pix_fmt yuv422p10le` (HQ), profile 4 + `yuva444p10le` for alpha | `.mov`, PCM audio `-c:a pcm_s16le` |
| Web transparent | VP9 `-c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 30` | `.webm` |
| GPU fast path | `h264_nvenc -preset p5 -cq 21` / `hevc_vaapi` | faster, slightly worse per bit; verify quality |

Keep a lossless or high-quality master; derive every delivery from it, never re-encode a delivery.

## 7. Batch pipelines

- One script per job (bash with `set -euo pipefail`, or Python `subprocess.run([...], check=True)`
  with argument lists, never shell-interpolated filenames). Quote paths; filenames contain spaces.
- Probe each input, branch on facts (skip copy-able files, normalize VFR), write to a separate
  `out/` dir, never overwrite sources. Use `-n` (fail if exists) or explicit `-y` only on outputs.
- Log each command with its probe summary; make the job idempotent (skip outputs that exist and
  pass the verify step).
- Parallelize across files (`xargs -P` or a pool) with `-threads` capped so N jobs fit the cores;
  one GPU encoder session per job on consumer NVENC limits.
- For long edits that a human will touch later, write an MLT XML and render with
  `melt project.mlt -consumer avformat:out.mp4 vcodec=libx264 crf=18 acodec=aac`; the same file
  opens in Kdenlive/Shotcut.

## 8. Verify loop (every output)

1. `ffprobe` the output: codec, pix_fmt, size, fps, duration within one frame of expected, audio
   stream present, channel layout.
2. Decode the whole file for errors: `ffmpeg -v error -i out.mp4 -f null -` prints nothing when
   clean.
3. Loudness and true peak within 0.5 LU and under -1 dBTP of target.
4. Look at frames: a contact sheet and the frames around every cut, overlay and caption change
   (atelier:visual-qa has the recipes and the checklist: black frames, freezes, banding, sync).
5. A/V sync: check a clap, plosive or cut point; drift over a long file means VFR or wrong `-r`.
6. Report: output path, the probe summary, loudness, size, and any known issues.

Run forge:verification before calling the edit done.

## Anti-patterns

- Guessing fps, pix_fmt or resolution instead of probing; mixing VFR and CFR clips in concat.
- Re-encoding for a trim or remux that `-c copy` could do; chaining several lossy encodes.
- `-crf` without `-pix_fmt yuv420p` on 10-bit or 4:4:4 sources, producing files phones will not play.
- Single-pass `loudnorm` for final masters; normalizing peaks instead of loudness.
- Burned-in captions as the only copy; no sidecar for accessibility.
- Stretching aspect ratio (`scale=1080:1920` on 16:9 input) instead of crop or pad.
