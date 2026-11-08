# Review room: notes that become the next cut

Goal: the viewer watches a cut, points at a frame, writes a note; the maker reads the notes from a
file and answers them one by one in the next take.

## Minimal build spec (no framework; no page ships with this skill)
- A static HTML page with a `<video>` for the cut, a click handler on the picture, and a tiny local
  server bound to 127.0.0.1 only (nothing leaves the machine).
- On click, record: cut name, time in seconds, frame number (time x frame rate, take the rate from
  ffprobe, do not assume), pin position as x and y in 0-1, free text, done flag.
- Save the pinned frame as an image with the pin drawn on it (ffmpeg grab at the note time plus a
  canvas overlay), so the maker sees what the note points at.
- Also allow a note without a pin and a note on the whole film.
- A "Send" button appends one line to a log file; the maker watches that file instead of waiting
  to be told.
- Optional: two cuts side by side, synced, for comparing takes.

## Loop
1. Export, check, tell the person the cut is in the room.
2. Watch the log for a send event.
3. Read every note and its pinned frame; copy the words into the project record before changing anything.
4. Answer note by note in the next cut. Mark a note done only when the new cut truly answers it.
   A note you disagree with stays open and gets a written reply.
5. Taste or direction notes are the person's decision: ask.

## Check it works
- Click at a known pixel of a known frame; the saved x,y and the drawn pin agree.
- The server refuses connections from other hosts (curl from another interface fails).
- Time and frame survive a reload; notes file is valid JSON after two quick submits.
