# Narration, voice, timing

## Script shape
Title, then one block per scene: id, narration, markers for picture changes, optional pause markers, private notes. Per scene tune the gap before the voice, the hold after, and a minimum length. Chapters: YouTube shows them only with at least 3 and each 10 s or longer [upstream].
Test: count sentences minus markers/cues; the result must be 0.

## Pronunciation
- Override acronyms, versions ("version two point one"), domains ("example dot com"), symbols.
- Homophones confuse the speech diff and overrides cannot fix it: reword.
- A repeated cue word matches its first occurrence; use a marker for later ones. Cue matching ignores punctuation, so "visitor's" matches "visitors".

## Voice sources
- Local open TTS (Kokoro-class; upstream cites 54 voices, 8 languages): free, offline.
- Cloud TTS: paid, uploads the script, needs the user's key from environment or a git-ignored file. ElevenLabs: speed times pace must stay within 0.7-1.2 [upstream AGENTS.md].
- Own recording: one take split by matching script words (about 0.15 s kept around speech [upstream]), or one file per scene. Script pauses add no silence to recordings; if the diff disagrees, change the script to match what was said.

## Languages
English, Spanish, French, Italian, Brazilian Portuguese, Hindi, Japanese, Mandarin work locally [upstream].
- Write natively, do not translate word for word.
- Romance languages and Hindi usually need an espeak-ng phonemizer; Japanese and Chinese a G2P library.
- CJK: sentence ends 。！？, Latin acronyms in kana, CJK-capable font, compare ASR by sound.

## Speed and pace (two separate knobs) [upstream AGENTS.md]
- `speed`: voice only, range 0.6-1.6; Kokoro default 0.9, 1 elsewhere.
- `pace`: voice, pauses and animation together, range 0.7-1.6; 1 normal, 1.15-1.3 for social or expert viewers, above 1.4 hard to follow.
- Spoken length is about 150 words per minute.
