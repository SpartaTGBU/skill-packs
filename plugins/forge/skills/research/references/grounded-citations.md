# Grounded citations

Every claim taken from an outside source gets an inline numbered citation and a `Sources:` list.
Numbers and URLs come from retrieval, never from memory: you only ever emit small integers you were
handed, so a wrong URL cannot be invented.

Use when an answer or artifact rests on fetched information (research, comparisons, news, state of X,
reports/docs/decks that report outside facts, multi-source synthesis). Skip when retrieval is incidental
(a quick syntax lookup mid-coding), for casual chat, or creative writing.

## The ledger

Keep a source ledger for the task: a scratch file (e.g. `sources.md` in your scratchpad) with one row
per source: `id | normalised URL | title | retrieved date | evidence quotes`. Rules:

- Register a URL at retrieval time, right after each search/fetch, BEFORE writing prose. Reconstructing the list from a draft later reintroduces hallucinated URLs.
- Same page = same id (normalise: strip tracking params and fragments, https, no trailing slash). Ids never change mid-task; never renumber by hand. New task, new ledger. Parallel subagents must share one ledger file or their ids collide.
- Render the `Sources:` block mechanically from the ledger (copy, do not retype URLs).

## Writing

- Cite per sentence, as you write: `Ice floats because it is less dense than liquid water.[1][2]`. No space before the bracket, each id in its own brackets, at most 3 ids per sentence. Never one dump at the end of a paragraph.
- Only ids in the ledger. Claims from your own knowledge get no citation (or `[unverified]` in fact-check mode).
- Conflicting sources: present both readings with their own ids and say which you weight and why.
- Quote figures, dates and names exactly as the source states them. Flag gaps ("no source found for X") instead of smoothing over.
- A search snippet supports only what it literally says; fetch the page when the claim needs the body.
- Do not put citations inside generated code or config; use prose deliverables and doc headers.
- End with the Sources block (`Sources:` in chat, `## Sources` in files; footnotes/endnotes/a Sources slide for docx/PDF/decks).

## Verify before delivering

Check by reading the draft: every `[n]` exists in the ledger; the Sources block lists exactly the cited ids with the ledger URLs; no registered source is silently uncited (it usually means a claim lost its attribution); coverage of source-bearing sentences is reasonable. A small grep helps: `grep -o '\[[0-9]\+\]' draft.md | sort -u`.

## Fact-checking mode (medical, legal, financial, safety, disputed claims, or on request)

1. Attach a verbatim quote per source, copied (never retyped or paraphrased) from the fetched page text, not a snippet. If you cannot find the sentence in the page, you do not have evidence.
2. Mark a load-bearing claim you could not source `[unverified]`. It is for the rare claim that cannot be checked; a draft dominated by it needed more retrieval, and the summary should say so.
3. Corroborate disputed facts with a second independent source. One source is reporting, two are corroboration.
4. Render evidence beneath each source (claim, source URL, exact supporting text).

## Multi-platform sweeps

"What are people saying about X" is not one web search. Fan out: open web (docs, articles), community discussion (forums, Reddit, HN), blogs/changelogs/RSS, video, code (`gh search repos` / `gh search issues`), social. Register every URL from every route. Keep opinion apart from measurement: a forum thread shows users report something, not that it is true; pair with a primary source or label it sentiment. Report per-route gaps rather than silently narrowing.

Rationale: citing while composing from retrieved numbered snippets yields better attribution than post-hoc insertion (ALCE, arXiv:2305.14627); verbatim quotes collected at browse time keep figures from drifting (WebGPT, arXiv:2112.09332).
