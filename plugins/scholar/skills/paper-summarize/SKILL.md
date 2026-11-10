---
disable-model-invocation: true  # skl: on-demand pack skill
name: paper-summarize
description: "Fill per-paper Key Findings, Methodology and Relevance sections for ingested cited papers (Obsidian notes and Zotero child notes) from each abstract. Optional CLI step: with research-hub installed it can apply summaries; otherwise write them inline or save the prompt. Use when asked to fill TODO Key Findings blocks or \"summarize the papers in cluster X\". Own draft goes to scholar:paper-memory-builder; comparison tables to scholar:literature-triage-matrix."
---

# paper-summarize

> **Optional tooling.** This skill is prompt-first: the workflow works from files and conversation. Steps that call the external `research-hub` CLI (pip package `research-hub-pipeline`), its MCP/REST server, Zotero, Obsidian or NotebookLM apply only **if research-hub is installed / the service is configured and the user has authorized the write**. Check with `research-hub describe --json` (or `command -v research-hub`); if absent, skip those steps, say so, and use the manual or inline alternative. Never install packages, log in to services or fabricate CLI output. Part of the research pipeline: see `scholar:research-lifecycle`.

The `auto` pipeline ingests metadata + abstract only — Summary / Key Findings / Methodology / Relevance stay as `[TODO]` skeletons in both Obsidian and Zotero. Cluster-level summarization (NotebookLM brief, crystals) does NOT fill per-paper notes. So after `auto`, the user has nothing scannable per paper without opening the PDF.

This skill fills that gap. One LLM call per paper produces JSON-validated content for both destinations. These writes are not a distributed transaction: unconfirmed remote writes remain unknown, and local compensation is best-effort, never proof that the destinations are synchronized.

## When to use

Trigger phrases:

- "Summarize the papers in cluster X."
- "Fill the TODO Key Findings for X."
- "I just ran `auto X` and the notes are empty — give me real summaries."
- "Update Zotero notes for cluster X with what each paper actually says."

Not for:

- Generating a single CLUSTER-LEVEL summary — that's `research-hub notebooklm generate` (NotebookLM brief).
- Filling Q&A on the cluster — that's `research-hub crystal emit/apply`.
- Reading PDFs — abstract-only by design. PDF parsing is out of scope; the LLM is told to mark "[PDF needed]" if abstract is too thin.
- Verifying brief vs source — that's `scholar:notebooklm-brief-verifier`.

## Inputs

- Cluster slug (must already exist in the vault under `raw/<slug>/`)
- Optional LLM CLI override (`claude`, `codex`, `gemini`, `opencode`, `aichat`, `cursor`, or configured custom adapter)
- Optional `--apply` flag (default off, dry-run)

The skill reads each paper's frontmatter (DOI, year, zotero-key) + the `## Abstract` body block. Papers with empty abstract get a "PDF needed" marker rather than hallucinated findings.

## Outputs

For each paper, three sections are rewritten:

1. **Obsidian markdown** at `raw/<cluster>/<paper-slug>.md`:
   - `## Key Findings` callout block (3–5 bullets)
   - `## Methodology` callout block (one sentence)
   - `## Relevance` callout block (1–2 sentences linking to the cluster topic)
   - Anchor IDs (`^findings`, `^methodology`, `^relevance`) preserved.

2. **Zotero child note** for the paper's parent item (looked up via `zotero-key` frontmatter):
   - Only an explicitly owned Hub summary note is updated with `<h1>Summary` + Abstract + Key Findings `<ul>` + Methodology + Relevance. Unmarked notes are preserved.
   - If no owned summary exists, a tagged summary is created; ambiguous ownership is refused. See `docs/zotero-summary-note-ownership.md` (research-hub repo, not bundled) for preservation and unknown-outcome limits.

Both writes must be confirmed for a paper to count as "applied". If the remote outcome is unconfirmed, report it as unknown and do not retry automatically. Local compensation restores the original note only if its current text still matches this invocation's written text; a newer observed edit is preserved. Failed compensation is reported for reconciliation rather than hiding other papers' outcomes. This check does not exclude a concurrent writer racing after the check. Inspect both destinations before an explicit retry; success counters count confirmed applied papers, not proof that failed/unknown papers were untouched.

## Failure modes

- **No LLM CLI on PATH**: prompt is saved to `<vault>/.research_hub/artifacts/<cluster>/summarize-prompt.md`. The user pipes it through their LLM manually and re-runs with `--apply`, or calls the `apply_cluster_summaries` MCP tool with the parsed payload. Exit code 0; ok=True.
- **LLM returns malformed JSON**: report is `ok=False` with `error="LLM response had no parseable JSON object"`. No writes.
- **Paper slug in payload not in cluster**: that entry is skipped with reason logged; other entries still applied.
- **Empty key_findings / methodology / relevance**: entry skipped.
- **Zotero write is unconfirmed for one paper**: report unknown, do not retry automatically, and attempt guarded local compensation. A newer observed edit or compensation failure is preserved/reported; other papers retain their own outcomes.

## Verification

This skill's contract is exercised end-to-end by the test suite. The
suites stub the LLM CLI but execute real Obsidian markdown writes against
a fixture vault and real Zotero child-note writes against a mocked Zotero
adapter. Successful rollback, unavailable compensation, newer observed edits,
and unknown remote acknowledgement are distinct contracts; the bounded direct
fault script adds coverage without claiming live-provider acceptance.

```bash
# Run the full paper-summarize suite (23 tests)
python -m pytest -q \
  tests/test_v069_summarize.py \
  tests/test_v073_parallel_summarize.py \
  tests/test_v080_resummarize.py
```

Coverage breakdown:

| Test file | Count | What it covers |
|---|---|---|
| `tests/test_v069_summarize.py` | 17 | Prompt builder shape, validator (rejects unknown slugs / empty fields / wrong types), Obsidian + Zotero apply path, rollback when Zotero fails, no-LLM-on-PATH fallback |
| `tests/test_v073_parallel_summarize.py` | 3 | Parallel summarize across multiple clusters, ordering, error isolation |
| `tests/test_v080_resummarize.py` | 3 | Re-summarize behaviour: idempotent on same input, overwrite on different LLM output, --no-zotero path |

For a manual smoke check against a live vault:

```bash
# Dry-run (emit prompt + show LLM output, no writes)
research-hub summarize --cluster <slug>

# Live run (writes to Obsidian + Zotero)
research-hub summarize --cluster <slug> --apply

# Override LLM
research-hub summarize --cluster <slug> --llm-cli codex --apply

# Obsidian-only (skip Zotero — useful when Zotero is offline)
research-hub summarize --cluster <slug> --apply --no-zotero
```

After applying, scan `raw/<cluster>/*.md` — every paper's `## Key Findings` callout should have real bullets instead of `[TODO]`.

## Operating notes

- Findings-first: the prompt instructs the LLM to state the result, not "The paper shows that…".
- Anchored to the abstract: every Key Finding must trace to something the abstract claims. The LLM is told to mark uncertain claims with `[likely]`.
- Re-running may regenerate different content and overwrite the selected summary sections; this is not an idempotency or duplicate-prevention guarantee. `--no-zotero` and `--no-obsidian` disable only their named destination: they are not preview flags, and `--apply` still writes to the other enabled destination. Omit `--apply` to avoid summary destination writes; model invocation and local prompt artifacts may still occur.
- Each paper has separate destination outcomes with best-effort local compensation, not an atomic cross-system transaction. Preserve unknown outcomes and reconcile the exact intended write before any explicit retry.
