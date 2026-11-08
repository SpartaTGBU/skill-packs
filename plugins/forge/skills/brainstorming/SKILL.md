---
disable-model-invocation: true  # skl: on-demand pack skill
name: brainstorming
description: Find out what the user actually wants before anything is built - relentless clarifying questions one at a time, alternatives laid out with trade-offs, and a design the user approves before any code. Use before building features, components, behaviour changes or anything new (software or not), when a request is ambiguous, when the user says "let's build X", "brainstorm", "grill me", "stress-test this plan", or before forge:writing-specs / forge:writing-plans. Tiny, fully specified tasks skip it.
---

# Brainstorming

You build what you believe the user wants, and that belief is usually thinner than it feels. This
skill finds out what they want, and why, before anything gets built. When you understand the why,
you make the hundred unmentioned decisions the way they would have.

## Gate 0: does this need brainstorming at all?

Ask yourself: what do I know about what they want, and why?

| Situation | Do this |
|-----------|---------|
| Everything that matters is in the request ("make the icon cornflower blue", a 1-2 file fix with an obvious outcome) | Skip this skill. Do it via forge:ponytail, then say what you did. |
| Something non-trivial is missing, or several files / a real design choice | Short brainstorm: a few questions, approaches, a short design. |
| Ambiguous, cross-system, risky (auth, data, migrations, money), or multi-session | Full brainstorm: full design written per forge:writing-specs, plus builder check. |

If it grows mid-conversation, say so and step up a size. If it is really several independent
projects, say so, agree on an order, and brainstorm them one at a time.

Once past Gate 0, in order: (1) lay out approaches and have the user pick one, (2) write the design
(short or full), (3) get it approved, (4) go to forge:writing-plans.

## Look before you ask

In an existing project, or when given context (spec, plan, handoff, files, earlier conversation),
read it and the code it connects to until you can explain how the relevant parts work today and
what the change would touch. **Finding facts is your job; decisions are theirs.** Never ask what
the code, docs or environment can answer. For a fact you need mid-conversation, dispatch an
Explore subagent; only the questions that depend on that fact wait for it.

Read `GLOSSARY.md` and ADRs in the area if they exist; use their terms and don't re-litigate
recorded decisions.

## Your first message

- **They already said what they want** (spec, plan, detailed request): ~200 words. Echo the
  request in your own words (what, for whom, why). Add what you found: how it works today, what
  the change touches. Name anything that would change the ask: a constraint, a conflict, a cheaper
  path. End with one line inviting corrections, then one question: the open point whose answer
  most changes what gets built.
- **They haven't:** one open question, in their terms, about the biggest unsettled thing, and why
  you ask. ("If it's mostly for people deciding whether to stop by, I'd lead with hours and today's
  case; taking orders is a different site. What do you want someone to do when they land on it?")
- If they did not ask for a design discussion, add one light line: "Or if you'd rather I just dive
  in, say so." If they take it, this skill is done: state any significant how-it-gets-made choice
  (platform, language) in one line and proceed through forge:ponytail.

## The conversation

**Ask every question interactively.** Use the AskUserQuestion tool for every question, never a
question in prose. Give each one 2-4 proposed options that are real, distinct answers, put your
recommendation first with "(Recommended)" in its label, and use the option description for the
trade-off. The user can always pick "Other" and write their own answer. Make each question
stand on its own: the dialog may hide your earlier text, so put the fact it depends on into the
question. Use `preview` when options are concrete artefacts to compare (mockups, code, configs).
Only fall back to a prose question when the tool is unavailable.

**One question per call** (grill mode: up to 4 per call). Plain language, their vocabulary, no
process jargon. Never quote this skill at them.

- **Get them describing.** Make the first options broad and different, so the answers themselves
  show you what they want, and read any "Other" text closely; their words carry intent your
  options can't. On "just guess" / "what do you think?", propose something concrete.
- **Ask Socratically.** Build each question on their last answer or on something you found, so it
  surfaces a consequence or case they missed ("Voting closes before the meeting, and two members
  joined this month. Does someone who joins mid-round get a vote?"). Say what the answer would
  change when that isn't obvious. A proposal they can correct, with your reason, often beats a
  question.
- **Walk the design tree.** Every decision branches into decisions that hang off it. Only ask
  questions whose prerequisites are settled; a question that depends on an open one waits.
- **How it gets made.** Find out early which choices (platform, language, libraries, medium) they
  want to make, which they hand to you, and what they already have. Build on what existing work
  uses. Any choice you make goes in the design as *your call*, never as something they agreed to.
- **Sharpen language.** When a term is vague or overloaded ("account": Customer or User?), propose
  a precise one. When they state how something works, check the code agrees and surface
  contradictions. Record resolved terms per forge:architecture (domain modeling).
- **Offer recon.** Once grounded, offer to look further (deeper code, their files, the web via
  forge:research). Say what you'd look for; they decide.

**Ground to cover** (territory, not a script - never read these out):
what kind of thing this is and what makes it special; why now and what success looks like; goals,
non-goals, anti-goals (what would make it a failure even if it technically works); prior art they
loved or hated; current state and what they've tried; the details they care about; constraints
only they know (business rules, compliance, SLAs, budgets - never infer these from code).

## Lay out the approaches

Once you understand *what*, and before writing anything up, put the *how* in a message of its own.
Generate several real alternatives, drop the weak ones (those that fight the why, or that existing
work rules out), and present the two or three left. Ground each in what the project does today and
name what it trades off. Prefer the approach that reuses what exists and adds the least (the
forge:ponytail ladder). Recommend one and say why, then ask which way they want to go. When there
is genuinely one sensible way, say so and why the others don't fit.

## Play it back

As soon as you understand one part (what it's for, how one piece behaves), describe it back in
~200-300 words, then return to questions on the next part. Only what they said goes in as theirs;
what you filled in goes in as your proposal with a reason. End each chunk asking what's wrong or
missing.

## Show, don't tell; spike to feel things out

When seeing beats reading (a screen, a layout, a flow, a diagram, options that look different),
offer once, in a message of its own: "This might be easier if I show you. Want a quick mockup?" If
yes, write a self-contained HTML file to the scratchpad or temp dir (not the repo) and give the
absolute path. Requirements, scope and trade-offs stay in text.

A quick throwaway build is often the cheapest way to learn what they want or whether something
works. Offer one when it would help, and use atelier:prototype. Spikes get no plan, minimal or no
tests, and stay labelled throwaway. Bring what the spike taught back into the conversation.

## Grill mode (user asks to stress-test their own plan)

When the user says "grill me" or brings a plan to stress-test, interview relentlessly in **rounds**:
ask the whole current frontier (every decision whose prerequisites are settled) through
AskUserQuestion, up to 4 questions per call, as many calls in a row as the frontier needs. Each
question has a short `header` (e.g. "Q3 Keys"), your recommended answer as the first option
labelled "(Recommended)", and 1-3 real alternatives. A one-line prose intro before the first call
may name the round's theme; the questions themselves live only in the tool.

Wait for answers, record what each settles, recompute the frontier, repeat. Done when every branch is visited and nothing is
silently assumed. Don't act until they confirm shared understanding.

For long sessions (recording decisions as they settle, pushing back on conflicts, amendments, gap analysis against a reference product, closing research pass, and turning the result into a spec and tickets), read [references/grill-playbook.md](references/grill-playbook.md).

## When they lose you, or you lose them

- **"Wait, what?" / they seem lost:** re-pitch your last message: a line of context, short plain
  sentences (Simplified Technical English), the project's glossary terms, no new information.
- **A decision needs someone else's knowledge:** offer a questionnaire. Ask only about the *send*
  (who receives it, what they know, what the user needs back), then write `questionnaire-<slug>.md`
  from the template in [references/grill-playbook.md](references/grill-playbook.md). Park the
  dependent branch until answers return.

## Size and write the design

Once they've picked an approach, say how big the work is in plain words; they can override.

- **Small change:** a short design - what you covered together, a line or two each for intent,
  goals/non-goals, constraints, the chosen approach and the alternatives rejected.
- **Project:** the full written design per forge:writing-specs, including its builder check, before
  you hand it over.

Both always include an **Approaches** part: the two or three options, trade-offs, which they
picked, and why.

<HARD-GATE>
Nothing gets built until the user approves the design (short or full). Building includes product
code, scaffolding, installing dependencies, creating projects, or invoking an implementation skill.
Reading and exploring are fine.

Exceptions: they opted out of questions (the skill and gate are done), or a spike they said yes to
(stays throwaway; keeping it is a new request that comes back through this gate).

After approval the next step is forge:writing-plans (or forge:writing-specs first, if a full spec
does not exist yet). Nothing else.
</HARD-GATE>

## Red flags

| Thought | Reality |
|---------|---------|
| "I'll offer a menu of what they might want" | Options steer. Get them describing first. |
| "I'll ask three things at once to save time" | One question per call (grill mode: up to 4 per call). |
| "I'll just write the question in my reply" | Every question goes through AskUserQuestion with proposed options. |
| "I'll fill in sensible defaults" | Fine - say them out loud. A silent default can't be rejected. |
| "I'll ask which file handles X" | That's a fact. Look it up. |
| "I've answered their questions, so I'll write the doc" | Lay out the approaches first, in their own message. |
| "They said 'sounds good' to the idea" | Approval covers what you showed. An unwritten design isn't approved. |
| "The spike works, I'll keep building on it" | Keeping it is a new request. Back through the gate. |
| "This is too simple to need a design" | Then Gate 0 says skip - but decide that honestly, not to save effort. |
