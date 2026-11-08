---
disable-model-invocation: true  # skl: on-demand pack skill
name: humanizer
description: Edit prose to remove AI-writing tells (inflated significance, filler transitions, rule-of-three, vague attributions, em-dash overuse, chatbot residue) and add a real voice, optionally matching the user's writing sample. Use when asked to humanize or de-AI text, or when polishing docs, READMEs, PR descriptions, release notes, commit messages or blog posts before publishing, including your own.
---

# Humanizer

Remove the statistical fingerprints of LLM prose and make the writing sound like a specific person wrote it. Based on Wikipedia's "Signs of AI writing" (WikiProject AI Cleanup), via blader/humanizer (MIT, see LICENSE). The 34 patterns, before/after examples, voice-calibration procedure and a worked example are in `references/patterns.md`: load it when doing the work.

Also apply it to your own user-facing prose (PR descriptions, docs, release notes, summaries). In technical writing keep exact terms, commands and numbers untouched; only the connective prose changes.

## Inputs

Inline text (rewrite in reply), a file (read it, edit only the prose sections, show the changed parts rather than silently overwriting), and optionally a sample of the user's own writing to match.

## Process

1. Read the input (and the voice sample first, if given: sentence length, word level, punctuation habits, verbal tics).
2. Find every pattern instance using `references/patterns.md`.
3. Rewrite each, preserving meaning and facts; prefer plain constructions (is/are/has), specific details over generic claims, varied sentence rhythm.
4. Add soul: opinions where appropriate, first person if it fits, acknowledged uncertainty. Removing slop alone leaves sterile text that is just as obvious.
5. Audit: ask "what still makes this obviously AI-written?", answer in a few bullets, revise once more.

## Output

1. Draft rewrite
2. Remaining tells (brief bullets)
3. Final rewrite
4. Short change summary (optional)

Never invent facts, quotes or personal experience to add "voice".
