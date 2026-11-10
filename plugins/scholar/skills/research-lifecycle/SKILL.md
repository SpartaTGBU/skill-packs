---
disable-model-invocation: true  # skl: on-demand pack skill
name: research-lifecycle
description: Router for the 8-stage research lifecycle (discover, organise and compare, frame and plan, build, run and validate, visualise, draft, submit) that maps each stage to the right research skill and names the human gates between them. Use when starting or resuming a research project, when unsure which research skill applies, or when asked "what is the research workflow", "where am I in the pipeline", or "which skill next". Does the stage work via the skills it routes to.
---

# Research lifecycle router

Eight researcher-led stages. Each stage routes to a skill; the router never decides scientific questions for the human. A skill, a valid file or a successful command does not certify a scientific claim. Scale checks to the request: a quick lookup is not a whole-project audit.

```
1 Discover -> 2 Organise & compare -> 3a Frame -> 3b Plan -> 4 Build
   -> 5 Run & validate -> 6 Visualise -> 7 Draft -> 8 Submit & wrap up
```

Resumable multi-stage projects (3+ stages, audit trail needed) go through `scholar:research-workflow-orchestrator`, which keeps `.research/workflow_state.yml`. Its internal stage ids map as: orient = 3b/any, scope = 2-3a, discover = 1, synthesize = 2, design = 3a-4, execute = 4-6, write = 7, release = 8.

Optional tooling: the `research-hub` CLI, Zotero, Obsidian and NotebookLM are optional. Every stage works prompt-only from files and conversation; use a tool only if it is installed and the user authorized it. Never install, log in or fabricate tool output.

## Where to start

- Unknown project state: `scholar:research-project-orienter` (reads `.research/` manifests; if absent, `scholar:research-context-compressor` writes them).
- Otherwise pick the stage below. Skills that are the same across stages (context capture, delegation) are in "Cross-cutting".

## Stage map

| # | Stage | Skills | Output | Human gate |
|---|---|---|---|---|
| 1 | Discover literature ("what has been done?") | `scholar:research-hub` (native search plus reading protocol; CLI ingest optional), `scholar:paper-summarize` (optional), `scholar:zotero-skills` (optional, library writes) | Evidence handoff: needs-to-queries map, executed searches, source versions, actual reading levels, closest and contrary work, not-read items | `external_write` before any Zotero/vault/NotebookLM write. Researcher owns scope; a count is not coverage |
| 2 | Organise, compare, find the gap | `scholar:literature-triage-matrix`, `scholar:gap-to-topic`, `scholar:notebooklm-brief-verifier` (optional), `scholar:zotero-library-curator` then `scholar:zotero-skills` (optional) | `.research/literature_matrix.md`, `topic_dossier.md` + `.gaps.yml` | `scope_commitment`: researcher/advisor picks the topic. Missing literature does not prove novelty. Cleanup apply = `external_write` |
| 3a | Frame the problem | `scholar:research-design-helper` (reads gap dossier if present) | `.research/design_brief.md` (question, mechanism, identifiability, validation plan, risks) | `scope_commitment`: researcher approves the question. Placeholders cannot gate real research |
| 3b | Plan the project | `scholar:research-context-compressor`, `scholar:research-project-orienter` | `.research/project_manifest.yml`, `experiment_matrix.yml`, `data_dictionary.yml` | Researcher commits scope and resources. A manifest captures state; it authorizes nothing |
| 4 | Design and build the model | `scholar:research-design-helper` (re-read as intent), then ordinary engineering: `forge:tdd`, `forge:ponytail`, `forge:writing-plans`; mechanical scaffolding via `forge:codex-delegate` / `forge:antigravity-delegate` (optional) | Source-controlled implementation, assumptions, tests | Researcher approves consequential design changes. Delegate output always gets independent diff review |
| 5 | Run, calibrate, validate | `scholar:research-context-compressor`, `scholar:research-project-orienter`, `forge:verification`, `forge:debugging`; sweeps via the delegates (optional) | Reproducible commands, hashes/versions, seeds, run and failure logs, sensitivity, held-out checks | `experiment_authorization` for costly or non-reversible runs. Failed runs stay in the record; code tests do not establish empirical validity |
| 6 | Visualise and interpret | `forge:codex-delegate` / `forge:antigravity-delegate` for plotting scripts (optional) | Figures/tables with provenance, units, uncertainty; captions tied to plotted data | `semantic_revision`: interpretation and captions stay with the primary agent and researcher. A non-significant test must not become "no effect" |
| 7 | Draft and revise | `scholar:paper-memory-builder` then `scholar:academic-writing-skills`; `scholar:paper-review` for critique; `scholar:zotero-skills` for reference cleanup (optional) | `.paper/claims.yml`, `.paper/figures.yml`, evidence-aligned sections | `semantic_revision`: author approves scientific changes. Fluent prose does not fill missing evidence |
| 8 | Submit, respond, wrap up | `scholar:academic-writing-skills` (cross-file and release checks), `scholar:paper-review` (round-calibrated review, prior-comment regression), `scholar:research-context-compressor` (freeze final state), `forge:verification`, `forge:finishing-branch` | Exact-candidate checks, reviewer-response ledger, frozen project state | `release_authorization`: the author decides readiness and separately authorizes any submission, sharing or merge. No automatic submission |

## Cross-cutting

- `scholar:research-workflow-orchestrator`: resumable state machine and decision packets across stages.
- `scholar:research-hub-multi-ai`: when one round needs two or more delegates, write `.coord/multi_ai_plan.md` first. Single delegate: use its leaf directly. Generic parallel work: `forge:parallel-agents`.
- `forge:codex-delegate`, `forge:antigravity-delegate`: bounded mechanical work only; judgment, long-context, CJK and review work stay with the primary agent; both need their external CLI.
- `forge:research` for general fact-gathering outside the literature workflow.

## Gate protocol

Gates: `scope_commitment`, `external_write`, `experiment_authorization`, `semantic_revision`, `release_authorization`. Unknown risk is gated; tool availability never lowers a gate. At a gate present: decision in one sentence, why now with evidence and uncertainty, the exact proposed action and scope, a preview, whether it is reversible, and the options accept / decline / revise / cancel. Approval covers only the described action; a later, costlier, more public or semantically different action needs a new decision. A decline is recorded, not re-asked.

## Routing rules

1. Name the current stage and its entry artifact (for example `design_brief.md` for 3b). If it is missing, route to the stage that produces it rather than inventing it.
2. Hand off by file: each skill writes its `.research/` or `.paper/` artifact; the next reads it. Do not paraphrase artifacts from memory.
3. Do the safe automatic work (read-only search, local deterministic generation, validation); stop at the gate for everything else.
4. Never invent sources, DOIs, results, approvals or tool output. Report unknown and not-read items as such.
5. Return: current stage, skill invoked, artifacts produced, open gates, exact next action.
