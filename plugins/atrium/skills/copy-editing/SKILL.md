---
disable-model-invocation: true  # skl: on-demand pack skill
name: copy-editing
description: >
  Edits and reviews existing marketing copy with seven focused sweeps (clarity, voice, so-what,
  proof, specificity, emotion, risk), an optional expert-panel score, a plain-English quick pass,
  and a content-refresh workflow for aging pages and posts. Use when the user asks to edit, polish,
  tighten, proofread, critique or score copy, says "make this better" about an existing draft,
  wants feedback before publishing, or needs to refresh or update old content that is losing traffic.
---

# Copy editing

Edit what exists; do not replace it with something new. The author's voice and intent survive the
edit. Each change has a reason the author can accept or reject.

## 1. Before editing

- Load BRAND.md if it exists (atrium:brand-guidelines).
- Establish the piece's goal, audience, primary action and channel. Ask if unclear.
- Ask how deep: **quick pass** (mechanics and plain English), **full sweeps**, or **refresh**
  (content older than a year or losing traffic; see section 6).
- If the copy is mostly unusable (no clear point, wrong audience), say so and recommend
  atrium:copywriting instead of polishing it.

## 2. Seven sweeps

Do one sweep at a time, each with a single question. After each sweep, re-check that earlier sweeps
still hold (tightening for clarity can break voice; adding proof can break clarity).

1. **Clarity**: can the target reader understand every sentence on first read? Cut jargon, nested
   clauses, undefined acronyms, ambiguous pronouns. One idea per sentence.
2. **Voice**: does it sound like the brand and the same writer throughout? Flag shifts in
   formality, person (we/you), and tense.
3. **So what**: does each feature or claim connect to something the reader cares about? Add the
   "which means..." bridge where missing; cut lines that never earn one.
4. **Prove it**: is every claim supported? Mark unsupported claims and suggest the proof type
   (number, named customer, testimonial, demo, third-party source). Flag superlatives and
   competitor comparisons for substantiation.
5. **Specificity**: replace vague with concrete, using only real facts. "Many teams" becomes the
   actual count if the user has it; otherwise `[NEED: number]`. Never invent a figure to sound
   specific.
6. **Emotion**: does it touch the reader's real stake (time, money, status, fear, relief)? Add it
   through scenario and consequence, not adjectives or exclamation marks.
7. **Zero risk**: near every CTA, are the reader's doubts answered? Price clarity, cancellation,
   time to value, security, guarantee, what happens next. Only add reassurances that are true.

## 3. Expert panel (optional; use for launches, pricing and high-traffic pages)

Pick 3–5 personas relevant to the piece (e.g. target buyer, skeptical CFO, direct-response
copywriter, brand lead, SEO editor). Each scores the copy 1–10 with one line of reasoning and the
single change that would raise the score most. Revise and re-score until every persona is at 7+
and the average is 8+, or until two rounds bring no gain. Report scores per round.

## 4. Quick pass (plain English)

Words: replace inflated with plain.

| Instead of | Use |
|------------|-----|
| utilize, leverage | use |
| facilitate | help, let |
| commence | start |
| in order to | to |
| at this point in time | now |
| a large number of | many (or the number) |
| prior to | before |
| with regard to | about |
| is able to | can |
| functionality | feature, what it does |

Sentences: aim for 25 words or fewer; put the point first; active voice; one clause of
qualification at most. Paragraphs: 2–4 sentences on the web. Headings: say what the section
delivers, not a teaser. Lists: parallel grammar. Numbers: numerals for data; consistent units.

## 5. Common problems and AI tells

| Problem | Example | Fix |
|---------|---------|-----|
| Contrast reveal | "It's not a tool. It's a partner." | State what it does |
| Negation list | "No setup. No code. No hassle." | One concrete positive |
| Pile-on ending | "faster, smarter, better" | Keep the one that is true and specific |
| Self-answered question | "The result? Happier teams." | State the result with evidence |
| Stock opener | "In today's fast-paced world" | Start with the reader's situation |
| Vague power words | seamless, robust, unlock, elevate | The actual effect |
| Hedge stack | "may potentially help" | Commit, or cut |
| Feature dump | specs without outcomes | Add "which means..." |
| Buried lede | key point in paragraph 3 | Move it to the top |
| Passive voice hiding the actor | "Mistakes were made" | Name who did what |
| Em-dash habit | several per paragraph | Periods and commas |
| Exclamation inflation | "Amazing!!" | Let the fact carry it |

Use forge:humanizer for a deeper AI-tell pass after the sweeps.

## 6. Content refresh

Triggers: traffic or ranking decline, stats or examples older than about 12 months, product or
pricing changes, a competitor publishing a stronger piece, new search intent, broken links.

Refresh vs rewrite:
- **Refresh** when the URL still ranks or earns links and the angle is still right.
- **Rewrite** (same URL) when intent shifted, the structure is wrong, or over half is outdated.
- **Merge and 301** when two pages compete for the same query.
- **Retire** when the topic no longer fits the business; redirect to the closest page.

Six passes:
1. **Facts**: update every stat, date, price, screenshot, product name; cite sources and years.
2. **Gap check**: read the current top results for the main query (web search, or OpenSEO/Search
   Console data if connected). Build a grid: section | ours | top results | Keep / Revise / New.
3. **Structure**: add missing sections from the grid; cut sections nobody needs; answer the main
   question early.
4. **Proof**: add new examples, data, quotes (real and permitted) and original insight.
5. **Links**: fix broken links; add internal links to and from newer related pages.
6. **SEO hygiene**: title, meta, headings, image alt text; coordinate with atrium:seo-content.

Preserve: keep the URL (or 301 it), keep existing anchor IDs that other pages link to, show a
visible "Last updated" date, and note what changed for the author.

Suggested cadence (adjust to the business): pricing and comparison pages every 3–6 months,
high-traffic posts every 6 months, evergreen guides yearly.

## 7. Working with the author

1. Present findings grouped by sweep, highest impact first.
2. For each: location, issue, why it matters, proposed edit.
3. Recommend which to accept; the author decides.
4. Apply accepted edits, then re-run the checklist on the changed parts.

## 8. Output

- **Quick pass**: the edited text plus a short change list (old → new, reason) for non-trivial edits.
- **Full sweeps**: a findings table (sweep, location, issue, proposed edit, priority), then the
  revised copy, then open `[NEED: ...]` items.
- **Panel**: scores per persona per round, then the final copy.
- **Refresh**: the gap grid, the change log, the refreshed piece, and the redirect/anchor notes.

## 9. Final checklist

- [ ] Author's voice and intent preserved; brand rules followed.
- [ ] Every sentence understandable on first read by the target reader.
- [ ] Every claim supported, or flagged; no invented numbers, quotes or customers.
- [ ] CTA clear and consistent; risk reducers present and true.
- [ ] No AI tells from section 5.
- [ ] Spelling, grammar, punctuation, consistent mechanics.
- [ ] Links work; facts dated; legal flags (superlatives, comparisons, testimonials) raised.

## Related

atrium:copywriting (new copy), atrium:brand-guidelines (voice rules), atrium:seo-content (search
optimisation), atrium:cro (testing variants), forge:humanizer (AI-tell removal).
