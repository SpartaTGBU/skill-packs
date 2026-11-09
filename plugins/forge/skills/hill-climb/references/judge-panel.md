# Judge panel (the "council")

Use a judge panel when no program can give the score: UI quality, design, "does this feel like
the original". It is noisy, but it works: three models from different providers each score the
output, and the climber iterates until all of them agree it is good.

## Panel

- **Three or more judges from different providers.** One model alone has its own blind spots and
  its own pet issues. Agreement across providers is the signal.
- Run judges with `scripts/judge`. It needs only the standard library, it can attach screenshots,
  and it needs no agent tool permissions. It has two backends:
  - **`copilot` (the default):** your own GitHub Copilot subscription. One subscription gives
    you three providers.
  - **`openai`:** any OpenAI-compatible API (OpenRouter, a local server). Set
    `JUDGE_API_BASE` and `JUDGE_API_KEY`.

  ```bash
  J=<this skill dir>/scripts/judge
  $J models                                                    # what the backend offers today
  $J ask -m claude-opus-5.5 -e medium -i new.png -i ref-a.png < brief.md   # Anthropic
  $J ask -m gpt-6-astra     -e low    -i new.png -i ref-a.png < brief.md   # OpenAI
  $J ask -m mai-code-2      -e low    -i new.png -i ref-a.png < brief.md   # Microsoft
  JUDGE_BACKEND=openai $J ask -m <id> < brief.md                          # any other API
  ```

  - **Copilot token:** read from `$COPILOT_GITHUB_TOKEN`, the output of `$COPILOT_TOKEN_CMD`, or
    `secret-tool lookup account github-copilot`. It is never printed.
  - **The Copilot backend is unofficial.** It uses Copilot's internal token exchange, the same
    way editor integrations do. It runs on your own subscription, at your own ToS risk.
  - **Model ids change.** Run `models` before a long climb. The ids above are examples from one
    subscription.
- Fallbacks if the sub is rate-limited: Opus via the Agent tool (`model: opus`), `codex exec`,
  `gemini -p`.
- Run the judges in parallel (one background `ask` per judge), each with the same brief and the
  same screenshots.
- **Control judge (optional).** Add a weaker model with the same brief. Ignore its score and
  don't tell it that it is a control. If it agrees with the real panel, the bar may be too easy.
  Log its blunders separately; don't let it block a round.

## Brief for each judge

Give every judge the same brief. Keep judges read-only.

```
You are reviewing the UI of <product>. Attached: screenshots of <product> (current build),
<product> (main, before changes), and reference apps <A>, <B>, all in the same states.
Score each app 1–10 (one decimal) in each category:
hierarchy, typography, color & contrast, spacing & density, iconography, consistency, readability.
For <product> current, list the 5 changes that would raise its lowest scores most, most impactful first.
Return a table: rows = apps, columns = categories, plus an overall column.
```

- **Never mention the target score or bar.** Judges that know the target drift toward it. Only
  the parent agent knows the bar.
- **Always include references** (the baseline, competitors, the original). Without them every
  score inflates: one build moved "6 → 9" scored alone, but "7.0 → 7.4" next to competitors.
- References get rescored every round as well. Their scores drift (identical screenshots went
  8.3 → 9.1 over a run). **Track the gap to the references**, not only the absolute score.

## Rounds

- One round is one full panel pass on one build. A fresh pass after fixes is a new round.
- Merge the judges' advice into one list: findings several judges agree on come first;
  disagreements get noted, not averaged away.
- Record each round in the ledger: one row per round, one column per judge (min category score).
  Ask for a per-round score table in the final PR description.
- **Stagger judges by cost and speed.** Gate with the cheapest, fastest judge until it passes the
  bar, then bring in the slower or scarcer ones. Never let a slow judge stall every round.
- **Done** = every non-control judge scores every category at or above the bar, and the product
  beats every reference in every category if that is part of the target, for two consecutive
  rounds.

## Making the comparison readable to the human

Late at night, before/after screenshots look alike. Have the climber produce annotated
comparisons: arrows pointing at each change, with one line on what changed and why (fallback
font, the label above the title made quieter, branch names truncated from the end that matters
less, card radius, inline code softened). The owner judges taste much faster from these.

## Taste steering

The panel finds what is wrong. It doesn't know what you like. When the result drifts somewhere
you don't want (too grey, too bright, copying the wrong reference), add one line of taste to the
goal ("the redesign got too grayscale; restore some colour") or swap the reference. Don't
micromanage the changes themselves.
