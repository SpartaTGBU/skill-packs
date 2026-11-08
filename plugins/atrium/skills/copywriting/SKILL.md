---
disable-model-invocation: true  # skl: on-demand pack skill
name: copywriting
description: >
  Writes and rewrites conversion copy for web pages (homepage, landing, pricing, feature, about),
  headlines, hero sections and CTAs, using a diagnose-first protocol and line-level tests that
  remove vague and AI-sounding phrasing. Use when the user asks to write, rewrite or improve
  marketing or page copy, a headline, tagline, value proposition, CTA or hero, says "this copy is
  weak/generic", or is building a landing page. For polishing existing copy use atrium:copy-editing.
---

# Copywriting

Clear beats clever. Specific beats impressive. Write so the right reader recognises their
problem and knows exactly what to do next.

## 1. Gather context

Check for a BRAND.md (atrium:brand-guidelines) and use it. Then establish, asking only for gaps:
- **Page purpose**: what the page is for and the ONE primary action. Secondary action, if any.
- **Audience**: who lands here, what they are trying to get done, what they fear, the words they
  use for the problem (from reviews, calls, support tickets, forums; quote, do not paraphrase).
- **Offer**: what they get, price/plan, risk reversal (trial, guarantee), what makes it different.
- **Proof available**: real numbers, named customers, testimonials with permission, awards.
- **Traffic source**: ad, search, email, social, direct. Match the message of whatever sent them.
- **Writing sample**: if the user has copy or posts they like, match its rhythm and vocabulary.

## 2. Diagnose before writing

| Case | Signal | Action |
|------|--------|--------|
| **A. Blank or slop** | No copy, or generic filler | Build from the brief, section by section |
| **B. Real voice present** | Draft has specific lines, a point of view | Keep what works; restore voice; fix only weak lines |
| **C. Point edit** | "Change the headline", "fix this CTA" | Change only what was asked. Return only changed lines |

Never rewrite a whole page when asked for a point edit. Never flatten a distinctive voice into
generic polish.

## 3. Drafting protocol

1. **Decompose**: list the units (headline, subhead, each section, each CTA).
2. **Generate and lock**: write 2–3 candidates per unit, keep the best, fix its single worst flaw.
3. **Three-question gate** for every line:
   - Can the reader picture it? (concrete noun, scene, number, action)
   - Is it falsifiable? (a claim that could be checked, not a mood)
   - Swap test: could a competitor publish this line unchanged? If yes, it is not done.
   Where a line fails for lack of facts, write `[NEED: customer count / time saved / example]`.
   Never fill the gap with an invented number or quote.
4. **Ration the punch**: 1–2 memorable moments per page. Everything else is plain and clear.
5. **Leave-it-alone test**: if a line already passes all three questions, do not touch it.

## 4. Principles

- Clarity over cleverness. If a pun costs comprehension, cut the pun.
- Benefits over features, and connect them: feature → what it lets you do → why it matters.
- Specific over vague: "Close the books in 2 days" beats "Streamline your finances".
- Customer language over company language: use their words for the problem.
- One idea per section. One primary CTA per page, repeated.
- Every claim supportable. Superlatives and competitor comparisons need substantiation; flag them.
- Active voice, present tense, second person, short sentences, short paragraphs.

## 5. AI tells to avoid

Rewrite any line built on these patterns:
- Contrast reveals: "It's not X. It's Y." / "This isn't just X, it's Y."
- Negation lists: "No meetings. No spreadsheets. No stress."
- Trailing pile-ons: "...faster, smarter, and more efficient."
- Self-answered questions and colon reveals: "The result? ..." / "Here's the thing: ..."
- Stock openers: "In today's fast-paced world", "Imagine a world where", "Meet X".
- Vague power words: seamless, robust, powerful, unlock, elevate, streamline, empower,
  revolutionize, game-changer, cutting-edge, next-level, supercharge, effortless.
- Em dashes in short copy (headlines, CTAs, buttons, captions). Use a period or comma.
- Rule-of-three by reflex. Use two or four if that is what the facts support.
For a deeper pass, run forge:humanizer on the result.

## 6. Page structure

### Headline
State the outcome, for whom, or the problem solved. Patterns to adapt (not fill in blindly):
- [Outcome] without [pain]  |  [Do the job] for [audience]  |  The [category] for [specific use]
- [Number/time] + [result] (only with a real number)  |  Name the problem in the reader's words
Test: would the target reader stop scrolling? Does it say what the product does?

### Hero
Headline + subhead (how it works or who it is for, one sentence) + primary CTA + proof cue
(logo strip, rating, user count if real). Frame it as a transformation: before → after.
"Now you can" test: "Now you can ___" should complete naturally from the hero.

### Body sections (use what the page needs, in roughly this order)
1. Social proof near the top (logos, a short quote, a real number).
2. Problem: the situation in the reader's words; the cost of leaving it.
3. Solution: what the product does, as outcomes; 3–5 benefit blocks, each feature → benefit.
4. How it works: 3–4 steps, removes the "is this hard?" objection.
5. Proof in depth: testimonials with name/role/company, case-study snippets, before/after.
6. Objections: FAQ answering price, switching cost, time to value, security, "is it for me".
7. Final CTA: restate the outcome, repeat the primary action, add risk reversal.

### CTAs
Formula: verb + what they get + optional qualifier. "Start my free trial", "Get the pricing
sheet", "Book a 20-minute demo". Avoid Submit, Sign up, Learn more, Click here. Put the risk
reducer next to the button ("No card required", "Cancel anytime") only if true.

## 7. Page notes

- **Homepage**: who it is for and what it does in 5 seconds; route each segment to its next step.
- **Landing page**: one audience, one offer, one action; match the ad or email that sent them;
  remove navigation that leaks attention.
- **Pricing**: name plans by who they are for; lead with the recommended plan; answer "what
  happens when I outgrow it"; FAQ on billing, cancellation, overages. Coordinate with atrium:pricing.
- **Feature page**: the job this feature does, a concrete scenario, a visual, how it connects to
  the rest of the product, a CTA to try it.
- **About page**: why the company exists, who is behind it, what it believes; proof of
  credibility; still ends in a next step.

## 8. Output format

- **Point edit (C)**: only the changed lines, old → new, one-line reason each.
- **Full or restore (A/B)**: copy by section in page order, with section labels; then
  - 2–3 alternatives for the headline and primary CTA, each with the angle it takes;
  - short annotations where a choice is non-obvious;
  - all `[NEED: ...]` gaps collected in one list;
  - SEO title (under ~60 characters) and meta description (under ~155 characters) if it is a web
    page; coordinate keywords with atrium:seo-content.

## 9. Review checklist before delivering

- [ ] One primary action, stated in every CTA consistently.
- [ ] Headline passes the 5-second test and the swap test.
- [ ] Every claim is true, sourced, or marked `[NEED: ...]`; no invented numbers or quotes.
- [ ] Reader's words used for the problem.
- [ ] No pattern from section 5.
- [ ] Brand terminology and mechanics followed.
- [ ] Testimonials and comparisons flagged for permission and substantiation.
- [ ] Reads aloud cleanly; no sentence over ~25 words in the hero.

## Related

atrium:copy-editing (polish and review), atrium:brand-guidelines (voice), atrium:cro (page
experiments and layout), atrium:email-marketing, atrium:paid-ads (ad copy), atrium:launch,
atrium:customer-research (sourcing customer language), atelier:frontend-design (building the page).
