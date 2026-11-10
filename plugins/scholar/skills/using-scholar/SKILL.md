---
name: using-scholar
description: >
  Router for the scholar research skill set: academic research from topic to submission - finding
  and scoring a research gap, literature discovery and triage, Zotero and NotebookLM, paper reviews
  and summaries, research design, repo orientation, academic writing. Says which scholar skill to
  load. Use at the start of any academic or thesis research task, or when unsure which applies.
---

# Using scholar

Scholar is the academic research skill set. Software fact-finding before coding is `forge:research`,
not this pack. Load a skill with `skl load scholar:<name>`; `skl search <words>` finds one.

Start with `scholar:research-lifecycle` when the stage is unclear: it maps the 8 stages (discover,
organise and compare, frame and plan, build, run and validate, visualise, draft, submit) to skills.

| Need | Skill |
|------|-------|
| Is this thesis/proposal topic worth it? go/no-go dossier | `scholar:gap-to-topic` |
| Find and organise sources (Zotero, Obsidian, NotebookLM) | `scholar:research-hub` |
| Compare a known set of papers in one matrix | `scholar:literature-triage-matrix` |
| Fill per-paper findings/method/relevance notes | `scholar:paper-summarize` |
| Check a NotebookLM brief against its sources | `scholar:notebooklm-brief-verifier` |
| Design the study (question, mechanism, identifiability, validation, risks) | `scholar:research-design-helper` |
| Make a research repo resumable (`.research/` manifests), then orient from them | `scholar:research-context-compressor`, `scholar:research-project-orienter` |
| Run the whole workflow with human gates and provenance | `scholar:research-workflow-orchestrator` |
| Two or more delegates (Codex, Antigravity) in one round | `scholar:research-hub-multi-ai` |
| Turn a draft into reusable claims/figures memory | `scholar:paper-memory-builder` |
| Outline, write and revise the paper | `scholar:academic-writing-skills` |
| Reviewer-style review of a manuscript | `scholar:paper-review` |
| Audit a Zotero library (read-only) / change it (needs API key) | `scholar:zotero-library-curator`, `scholar:zotero-skills` |

Prose de-AI pass on the result: `forge:humanizer`.
