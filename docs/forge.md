# forge

1. forge skills are on-demand: load one with `skl load forge:<name>` (several at once is fine) or `/forge:<name>`; find one with `skl search <words>` or `skl list forge`.
2. `forge:ponytail` (smallest complete change, surgical edits, verify before claiming done) is injected into every session and subagent automatically, except in plan mode and the planner/architect agents. Do not load it.
3. Planning and review are thorough; implementation is lean. Size the task first, then pick a route.
4. `forge:using-forge` is the router; load it when unsure which skill applies. User instructions override skills; skills override defaults.
5. Load the one or two skills the work needs, not the whole route. After compaction, re-load any you still need.

| Size | Signals | Route |
|------|---------|-------|
| Trivial | One obvious edit, a question, a lookup | Just do it, ponytail-style |
| Small | Clear goal, 1-2 files | ponytail, then verification |
| Medium | Several files or a real design choice | brainstorming (short), writing-plans, implement, code-review |
| Large / ambiguous | New feature, unclear requirements, architecture | brainstorming, writing-specs, writing-plans, executing-plans, code-review, verification, finishing-branch |

When unsure between two sizes, pick the larger for planning and the smaller for code.

## Walkthrough 1: add a feature to a Rust service (medium)

Prompt: "Add rate limiting to the ingest endpoint of our axum service."

1. `forge:brainstorming` - settle limits, per-key vs global, and what happens on rejection, one question at a time. Skip it if the request is already exact.
2. `forge:research` - check the repo and installed crates (is `tower` or a governor crate already in `Cargo.toml`?) before adding a dependency.
3. `forge:writing-plans` - split into verifiable tasks: config, middleware, wiring, tests.
4. `forge:rust` - idiomatic error handling, async and testing conventions while implementing; `forge:tdd` for the limiter logic itself.
5. If `cargo` fails to compile, dispatch `rust-build-resolver`.
6. `forge:code-review` - dispatch `rust-reviewer`, `code-reviewer`, `silent-failure-hunter` and `pr-test-analyzer` in parallel; `forge:security-review` because the change sits on a network boundary.
7. `forge:verification` - run `cargo clippy -- -D warnings` and `cargo test`, then `forge:finishing-branch` to pick merge or PR.

## Walkthrough 2: fix a flaky test (small, but root cause first)

Prompt: "test_sync_retries fails about 1 in 10 CI runs."

1. `forge:debugging` - build a tight reproduction (loop the test, fix the seed or clock), minimise it, rank hypotheses and test them. No fix before a cause.
2. `forge:tdd` - turn the reproduction into a deterministic regression test that fails (red) for the identified cause.
3. Fix once at the source (ponytail: grep every caller of the shared code, no `sleep` band-aids).
4. `forge:python` (or `rust`/`go`) only if language-specific concurrency rules matter.
5. `forge:verification` - run the test in a loop (for example 50 times), show the red-green evidence, then claim fixed.

## Skills

### Router and process

| Skill | What it does | When it earns its place | Example prompt |
|-------|--------------|-------------------------|----------------|
| `forge:using-forge` | Router: says which forge skill to load per phase and how to size the task | Start of a session, or when two skills seem to apply | "Which forge skill should I use to restructure this module?" |
| `forge:ponytail` | Implementation discipline: smallest complete change, reuse first, surgical edits, explicit assumptions; levels lite/full/ultra | Auto-injected; load only to change level or when it was dropped by compaction | "/forge:ponytail ultra" |
| `forge:output-completeness` | Forces complete, unabridged output with no placeholders or "rest is similar"; stops at a clean break if the token limit nears | Generating a full file or long migration where elisions would break it | "Write out the entire config, no placeholders, split across turns if needed." |

### Plan

| Skill | What it does | When it earns its place | Example prompt |
|-------|--------------|-------------------------|----------------|
| `forge:brainstorming` | Relentless one-at-a-time clarifying questions, alternatives with trade-offs, converges on a design | Vague "let's build X" requests before any code | "I want a plugin system for the CLI. Let's brainstorm it first." |
| `forge:brainstorm-technical-design` | Brainstorming plus architecture modeling (domain glossary, seams, ADRs) in one session | A feature that also reshapes module boundaries; its Hill track settles the verifier for a hill-climb | "Design session for splitting billing out of the monolith, record ADRs." |
| `forge:goal` | Turns a request into one checkable done-condition (≤500 chars, verifiable from the transcript) and sets it as a Claude Code `/goal`, asking you to pick the condition when it's vague | Multi-turn work with a verifiable end state | "Set a goal: every call site migrated and the tests green." |
| `forge:hill-climb` | Builds a verifier that prints a score, then loops change → score → keep or revert → raise the bar unattended; includes a judge panel (`scripts/judge`) for UI and visual quality | Ports against a reference, N× faster, eval or size targets, design polish | "Hill-climb the UI until every judge scores every category 9+ against Claude Code and Codex." |
| `forge:architecture` | Deep modules behind small interfaces, seams where things vary, shared glossary, ADRs, deleting complexity | Code is hard to change or test, unclear boundaries | "This service layer is a tangle; propose a simpler module structure." |
| `forge:writing-specs` | Turns an agreed design into a cold-readable spec: intent, scope, observable acceptance criteria | Handing a design to a builder or another agent | "Write a spec for the export feature we just agreed on." |
| `forge:writing-plans` | Turns a design or spec into bite-sized, independently verifiable tasks or tracer-bullet tickets | Medium and large work before touching code | "Write an implementation plan for the spec in docs/export.md." |
| `forge:research` | Gathers facts first: repo, stdlib, installed deps, current official docs, instead of memory | Before choosing a library or API, or when unsure something already exists | "Research how our repo already handles retries before I add a new helper." |
| `forge:codebase-onboarding` | Maps an unfamiliar codebase into a scannable guide: stack, entry points, request lifecycle, commands | First day on a repo, or documenting one for newcomers | "Onboard me to this repo and write ONBOARDING.md." |

### Implement

| Skill | What it does | When it earns its place | Example prompt |
|-------|--------------|-------------------------|----------------|
| `forge:tdd` | Red-green-refactor loop producing small tests worth keeping with minimum code to pass | Logic with branches, parsers, money, security; bug regression tests | "Use TDD to implement the duration parser." |
| `forge:debugging` | Root-cause loop: tight reproduction, minimise, ranked hypotheses, fix once at the source with a regression test | Any bug, failure or unexpected behavior | "Debug why checkout totals are off by one cent." |
| `forge:debugger-cli` | Drives real debuggers from the terminal: `node inspect`/CDP, Python pdb/breakpoint, post-mortem | Reading code has not explained it and you need to step through live state | "Attach a debugger to the failing Node script and inspect the request object." |
| `forge:executing-plans` | Executes a written plan inline or with a fresh implementer plus reviewer subagent per task | You have a plan or ticket set and want it carried through | "Execute docs/plan.md task by task with a reviewer per task." |
| `forge:parallel-agents` | Splits work into independent lanes run concurrently with the Agent tool, worktrees for parallel writes | Several unrelated failures or modules that do not share state | "Fix these four unrelated failing test files in parallel." |
| `forge:git-worktrees` | Sets up an isolated git workspace with dependencies installed and a verified clean baseline | Risky or parallel work that should not touch your main checkout | "Create a worktree for the auth refactor and verify tests pass there." |
| `forge:codex-delegate` | Hands repetitive or implementation-heavy work to the Codex CLI via an on-disk brief, then you review the diff | `codex` is installed and token cost outweighs judgment cost | "Delegate the batch rename across 40 files to codex." |
| `forge:antigravity-delegate` | Hands a bounded mechanical subtask to the Antigravity `agy` CLI via a brief; never for reviews or verdicts | `agy` is installed and the task is transcribe/reformat with a runnable check | "Delegate fixing the plot axis labels to agy." |
| `forge:lsp-rust-analyzer` | Installs and wires rust-analyzer for go-to-definition, references, diagnostics, rename | Large Rust repo where grep-based navigation is slow or unsafe for renames | "Set up rust-analyzer so you can safely rename this trait method." |
| `forge:lsp-gopls` | Installs and wires gopls for definitions, references, diagnostics and safe rename, plus CLI fallback | Go repo needing precise navigation or rename | "Wire up gopls for this module." |

### Review and finish

| Skill | What it does | When it earns its place | Example prompt |
|-------|--------------|-------------------------|----------------|
| `forge:code-review` | Multi-lens review of a diff, branch, PR or files: spec fit, correctness, tests, security, simplicity | Before merge or whenever asked to review | "Review my branch against main." |
| `forge:lean-review` | Single-pass, plain-English review of a change: correct, safe, holds under load, tested, fast, lean; numbered findings with a concrete case and the smallest fix, verdict Ship or fix N first | Quick self-review before a commit, or "is this over-engineered?" | "Lean-review my uncommitted changes." |
| `forge:audit` | Read-only audit of a whole repo or folder: bugs, security, scale under the expected load, untested risky code, slow paths, what to delete/merge/split; ends with a verdict and a lean -N lines estimate | Inheriting a codebase, or a periodic health check | "Audit services/billing and tell me what to fix first." |
| `forge:debt` | Collects every `shortcut:` comment into a ledger (ceiling, upgrade trigger) and flags markers with no trigger | Before a release or a load increase | "Show me the shortcut debt ledger." |
| `forge:pr-review` | Aspect-selectable PR review orchestrator dispatching the specialist forge agents | A PR where you want only certain lenses (tests, silent failures, types, comments) | "Run pr-review on #128, tests and error handling only." |
| `forge:receiving-code-review` | Acts on review feedback with rigor: verify each item against the code, no performative agreement | You got comments (human or bot) and some may be wrong | "Work through the review comments on my PR, push back where they are wrong." |
| `forge:security-review` | Security review of code, agent/tool runtimes, Claude Code and MCP config: injection, auth, secrets, SSRF, dependencies | Touching auth, uploads, webhooks, shell calls, dependencies, MCP config | "Security review the new upload endpoint." |
| `forge:security-hardening` | Defensive hardening of your own software: threat model, dependency/secrets scans, authn/authz and injection regression tests, container/CI/cloud checklists, evidence | Before deploying a service you own; after security-review findings | "Harden the payments service for release and add authz regression tests for every route." |
| `forge:verification` | Evidence before claims: run build, types, lint, tests, red-green regression, requirement checklist | Before saying done, fixed or passing | "Verify this is actually done before I merge." |
| `forge:finishing-branch` | Verifies the suite on the final tree, cleans commits to repo convention, lets you choose merge, PR, keep or discard | Work is complete and the branch needs landing | "Finish this branch and open a PR." |
| `forge:dogfood-qa` | Exploratory QA of a running web app: sitemap, browser exploration, evidence with screenshots and repro steps | A web app is up and you want bugs found before users do | "Dogfood the staging app and file a bug report with screenshots." |
| `forge:humanizer` | Edits prose to strip AI tells: inflated significance, filler, rule-of-three, em-dash overuse | Docs, READMEs or PR text that reads machine-written | "Humanize this README intro." |

### Stack references

| Skill | What it does | When it earns its place | Example prompt |
|-------|--------------|-------------------------|----------------|
| `forge:rust` | Idiomatic Rust: ownership, errors, enums, traits, concurrency, async, crate layout, testing | Writing or reviewing Rust | "Refactor this module to use thiserror and drop the unwraps." |
| `forge:go` | Idiomatic Go: errors, interfaces, concurrency, context, package layout, table-driven tests | Writing or reviewing Go | "Make this worker pool cancel cleanly with context." |
| `forge:python` | Idiomatic Python: type hints, errors, context managers, dataclasses, generators, concurrency, packaging, pytest | Writing or reviewing Python | "Add type hints and fix the mutable default args in this module." |
| `forge:docker` | Docker and Compose reference: multi-stage builds for Rust/Go/Python, caching, hardening, Compose dev, networking | Containerizing or slimming images, local dev stacks | "Shrink this image and run it non-root." |
| `forge:postgres` | PostgreSQL reference: schema and types, indexing, EXPLAIN tuning, pagination, upserts, locking | Slow queries, schema design, index choice | "This query does a seq scan on 20M rows; fix the indexing." |
| `forge:database-migrations` | Safe PostgreSQL migrations: forward-only, expand-contract renames, lock-safe columns, constraints | Any production schema change | "Rename users.email to users.login_email with zero downtime." |
| `forge:github` | GitHub via `gh`: auth, issues, PR lifecycle, CI watch, merge, issue-to-PR delivery | Anything involving issues, PRs or CI status | "Turn issue #77 into a PR and watch CI." |

### DevOps generators and validators

Generators scaffold from best-practice templates; validators lint, scan and explain findings. Use the pair: generate, then validate.

| Skill | What it does | When it earns its place | Example prompt |
|-------|--------------|-------------------------|----------------|
| `forge:ansible-generator` | Generates Ansible playbooks, roles, tasks, handlers, inventory, vars | Starting a new playbook or role | "Scaffold an Ansible role that installs and configures nginx." |
| `forge:ansible-validator` | Lints and audits Ansible playbooks, roles, inventories, FQCN, tasks | Before running a playbook against hosts | "Validate the playbooks in ./ansible and fix FQCN issues." |
| `forge:azure-pipelines-generator` | Generates azure-pipelines.yml, stages, jobs, steps, reusable templates | New Azure DevOps pipeline | "Create an Azure pipeline that builds, tests and deploys to staging." |
| `forge:azure-pipelines-validator` | Validates azure-pipelines.yml for syntax, security and best practices | Reviewing a pipeline change | "Review azure-pipelines.yml for security problems." |
| `forge:bash-script-generator` | Creates bash/shell scripts, automation and CLI tools | A new .sh that needs proper structure and safety | "Write a bash script that rotates and compresses logs." |
| `forge:bash-script-validator` | Lints and fixes shell scripts via ShellCheck | Any shell script before shipping | "Run shellcheck on scripts/ and fix everything." |
| `forge:dockerfile-generator` | Writes Dockerfiles and multi-stage images to containerize an app | New service needing a container | "Containerize this FastAPI app with a multi-stage Dockerfile." |
| `forge:dockerfile-validator` | Lints and scans a Dockerfile for security and best practices | Auditing an existing Dockerfile | "Audit this Dockerfile for security issues." |
| `forge:fluentbit-generator` | Generates Fluent Bit configs: INPUT, FILTER, OUTPUT, parsers, pipelines | Setting up log shipping | "Write a Fluent Bit config tailing /var/log/app and sending to Loki." |
| `forge:fluentbit-validator` | Validates Fluent Bit configs and tag routing | Logs not arriving or before rollout | "Check this fluent-bit.conf for routing mistakes." |
| `forge:github-actions-generator` | Creates GitHub Actions workflows, action.yml, CI/CD pipelines | New CI or release workflow | "Add a workflow that runs cargo test and clippy on PRs." |
| `forge:github-actions-validator` | Lints and fixes .github/workflows files | Workflow fails to parse or needs hardening | "Lint my workflows and pin actions to SHAs." |
| `forge:gitlab-ci-generator` | Creates .gitlab-ci.yml pipelines, stages and jobs | New GitLab CI pipeline | "Create a .gitlab-ci.yml with build, test and deploy stages." |
| `forge:gitlab-ci-validator` | Lints and fixes .gitlab-ci.yml | Pipeline errors or review | "Why is my .gitlab-ci.yml rejected? Validate and fix." |
| `forge:helm-generator` | Scaffolds Helm charts: Chart.yaml, values, templates, helpers | Packaging an app for Kubernetes | "Create a Helm chart for this service with configurable replicas and ingress." |
| `forge:helm-validator` | Lints and checks Helm charts, templates, values, CRDs, schemas | Before `helm install` or release | "Lint the chart in charts/api and fix template errors." |
| `forge:jenkinsfile-generator` | Generates declarative or scripted Jenkinsfiles and shared libraries | New Jenkins pipeline | "Write a declarative Jenkinsfile for build, test and docker push." |
| `forge:jenkinsfile-validator` | Validates Jenkinsfiles and shared libraries | Reviewing a pipeline change | "Check this Jenkinsfile for anti-patterns." |
| `forge:k8s-yaml-generator` | Generates Kubernetes manifests: Deployment, Service, ConfigMap, Ingress, RBAC, StatefulSet, CRDs | Writing manifests from scratch | "Generate a Deployment, Service and Ingress for this app." |
| `forge:k8s-yaml-validator` | Lints, audits and dry-runs Kubernetes manifests | Before `kubectl apply` | "Dry-run and lint k8s/ and report issues." |
| `forge:k8s-debug` | Diagnoses pods, CrashLoopBackOff, Pending, DNS, networking, storage and rollout failures with kubectl | A live workload is failing | "Pod api-7d9 is in CrashLoopBackOff; find out why." |
| `forge:logql-generator` | Generates LogQL queries, stream selectors, metric queries and alert rules for Loki | Querying or alerting on Loki logs | "Write a LogQL query for the 5xx rate per service over 5 minutes." |
| `forge:loki-config-generator` | Generates Loki server configs: ingester, querier, compactor, ruler, S3/GCS/Azure backends | Standing up or tuning Loki | "Create a Loki config with S3 storage and 30-day retention." |
| `forge:makefile-generator` | Creates Makefiles with .PHONY targets and build automation | A repo needing a standard task entry point | "Add a Makefile with build, test, lint and clean targets." |
| `forge:makefile-validator` | Lints and checks Makefiles and .mk files | Makefile misbehaves or review | "Validate the Makefile and fix tab/phony issues." |
| `forge:promql-generator` | Writes PromQL queries, alerting and recording rules, dashboard queries | Building Prometheus alerts or panels | "Write an alert for p99 latency above 500ms for 10 minutes." |
| `forge:promql-validator` | Validates PromQL and rules; detects anti-patterns | Slow or wrong queries, reviewing alert rules | "Check these alert rules for high-cardinality and rate() mistakes." |
| `forge:terraform-generator` | Generates Terraform HCL: resources, modules, providers, variables, outputs | New infrastructure code | "Write a Terraform module for a VPC with private subnets." |
| `forge:terraform-validator` | Validates, lints and security-scans Terraform with tflint, checkov and `terraform validate` | Before plan/apply | "Validate and security-scan the terraform/ directory." |
| `forge:terragrunt-generator` | Generates Terragrunt root.hcl, child modules, stacks, multi-env layouts | Multi-environment Terraform with DRY config | "Set up Terragrunt for dev, stage and prod with a shared root.hcl." |
| `forge:terragrunt-validator` | Validates Terragrunt configs, stacks, modules and compliance | Reviewing a Terragrunt tree | "Validate the live/ terragrunt configs." |

### Agents and MCP

| Skill | What it does | When it earns its place | Example prompt |
|-------|--------------|-------------------------|----------------|
| `forge:agent-harness` | Designing and tuning LLM agent harnesses: tool design, error recovery, context budgets, model routing, caching, measuring cost | Writing code that calls an LLM API in a loop, or cutting LLM spend | "Our agent loop burns tokens; improve cache hit rate and tool output format." |
| `forge:agent-md-improver` | Audits, scores and improves CLAUDE.md, AGENTS.md and similar instruction files | Agents ignore or misread your instruction file | "Audit and tighten my CLAUDE.md." |
| `forge:build-mcp-server` | Entry point for designing an MCP server: interrogates the use case, picks deployment model and tool design | Starting a new MCP server | "I want to expose our ticket system to Claude via MCP; design it." |
| `forge:mcp-server-patterns` | Building MCP servers: tools, resources, prompts, schemas, error results, stdio vs Streamable HTTP, security | Implementing the server you have designed | "Implement this MCP server with Streamable HTTP and proper error results." |
| `forge:build-mcp-app` | Adds interactive UI widgets (forms, pickers, dashboards, confirms) to an MCP server via ui:// resources | A tool needs user input or visual output inline in the host | "Add a confirm dialog widget to my MCP delete tool." |
| `forge:build-mcpb` | Packages a local MCP server and runtime as an .mcpb bundle with manifest and user_config | Distributing a local server so users install one file | "Package this MCP server as an .mcpb." |
| `forge:mcp-tunnels` | Stands up an Anthropic MCP tunnel locally with Docker Compose (mcp-proxy plus cloudflared) | Claude must reach a private MCP server | "Set up an MCP tunnel to my internal server." |
| `forge:writing-skills` | Writes and tests skills, subagent definitions and CLAUDE.md with a baseline-first loop | Authoring or fixing a skill or agent | "Write a skill for our release process and test it." |
| `forge:skill-creator` | Creates and improves skills with evals, baselines, benchmark variance, an HTML reviewer, blind A/B comparison | You want measured improvement of a skill, not just a draft | "Run evals on my deploy skill and compare against baseline." |
| `forge:skillopt-sleep` | Offline loop that mines past sessions, proposes bounded skill/memory edits, accepts only if a held-out gate improves | Consolidating repeated corrections into a skill | "Run a sleep cycle over last week's sessions and stage the proposed edits." |
| `forge:headroom` | Optional context-compression proxy for tool output, logs and history; how to run it and verify savings | Sessions dominated by large tool output, or cutting token spend | "Set up Headroom for Claude Code and show me the savings." |
| `forge:session-report` | Generates an explorable HTML report of tokens, cache hit rate, subagents, skills and expensive prompts from local session stores | "Where did my tokens go" questions | "Make a usage report for the last week of sessions." |

### Ops (user-initiated)

`handoff`, `triage` and `retro` are marked user-initiated: the agent should not start them on its own.

| Skill | What it does | When it earns its place | Example prompt |
|-------|--------------|-------------------------|----------------|
| `forge:handoff` | Compacts the session into a handoff document a fresh agent can pick up cold, optionally launching it | Context is full or work moves to another agent or person | "Write a handoff and continue in a new session." |
| `forge:triage` | Moves issues and external PRs through a triage state machine: categorise, dedupe, verify, clarify, brief or close | A backlog of issues or an inbound PR needs a decision | "Triage the open issues and tell me what needs attention." |
| `forge:retro` | Session retro proposing environment changes from what went wrong, or codebase retro producing an evidence-backed gap register | End of a session (the agent offers once), or auditing a module | "Retro: what went wrong this session and what should we change?" |

### Research and academic (moved to the scholar pack)

These skills now ship in the **scholar** pack (`/plugin install scholar@skill-packs`; router `scholar:using-scholar`). They form a research workflow built around `.research/`, `.paper/` and `.coord/` files; most pair with Zotero, Obsidian or NotebookLM.

| Skill | What it does | When it earns its place | Example prompt |
|-------|--------------|-------------------------|----------------|
| `scholar:research-lifecycle` | Router for the 8-stage research lifecycle (discover through submit) | Unsure which research skill fits the stage you are in | "Where am I in the research lifecycle and what skill is next?" |
| `scholar:research-workflow-orchestrator` | Resumable end-to-end research workflow, automates low-risk steps, pauses at human decision gates, records provenance | Driving a whole project with checkpoints | "Run the research workflow for this project and stop at decision gates." |
| `scholar:research-hub` | Literature discovery and source organization via the optional `research-hub` CLI (Zotero, Obsidian, NotebookLM) | Starting a literature search | "Find and organize the key papers on retrieval-augmented generation." |
| `scholar:research-hub-multi-ai` | Writes `.coord/multi_ai_plan.md` when one round needs two or more bounded delegates | Splitting a research round across codex/agy delegates | "Plan how to split this literature round across delegates." |
| `scholar:research-project-orienter` | Reads `.research/` manifests and writes one orientation memo: question, datasets, stage, entrypoints, evidence | Returning to a project cold | "Orient me on this research project." |
| `scholar:research-context-compressor` | Inspects a research repo and writes compact manifests (project_manifest, experiment_matrix, data_dictionary) | Future sessions waste time rediscovering the repo | "Compress this repo into .research manifests." |
| `scholar:research-design-helper` | Five Socratic segments (question, mechanism, identifiability, validation plan, risk register) producing a design doc | Turning an idea into a testable study design | "Help me design the study for this hypothesis." |
| `scholar:gap-to-topic` | Turns a research area into a go/no-go dossier for candidate topics with a three-gate verdict | Choosing a thesis or proposal topic | "Is this gap a viable thesis topic? Give me a go/no-go dossier." |
| `scholar:literature-triage-matrix` | Turns a known paper list into a comparison matrix at `.research/literature_matrix.md` | You have 30 papers and need to compare them | "Build a comparison matrix from my Zotero collection." |
| `scholar:paper-summarize` | Fills per-paper Key Findings, Methodology and Relevance from abstracts in Obsidian and Zotero notes | Ingested papers have empty summary sections | "Summarize the newly ingested papers in my vault." |
| `scholar:zotero-library-curator` | Read-only audit of a Zotero library: duplicate DOIs, missing tags, collection and tag hygiene | Library is messy and you want a report before changing anything | "Audit my Zotero library for duplicates and untagged items." |
| `scholar:zotero-skills` | Full CRUD on a Zotero library (needs pyzotero and API key): search, add, tag, trash, merge, attach | Making actual changes to Zotero | "Merge the duplicate items in my Zotero and tag them by topic." |
| `scholar:notebooklm-brief-verifier` | Compares a NotebookLM brief to the uploaded source bundle: missed sources, unsupported claims, contradictions | Before trusting a NotebookLM summary | "Verify this NotebookLM brief against my source bundle." |
| `scholar:academic-writing-skills` | Frames and outlines papers, plans and revises paragraphs, aligns claims with evidence across sections | Drafting or revising a manuscript | "Outline the paper and check the abstract claims against the results." |
| `scholar:paper-memory-builder` | Converts a draft, figures and bibliography into `.paper/claims.yml` and `.paper/figures.yml` | Writing, revision or audit passes need a claims index | "Build the paper memory files from my draft." |
| `scholar:paper-review` | Reviewer-style, evidence-safe review of manuscripts with method, domain and round overlays | Pre-submission or reviewing someone else's paper | "Review this manuscript like reviewer 2." |

## Agents

15 agents in `plugins/forge/agents`. Dispatch with the Agent tool; reviewers are read-only and usually run in parallel.

| Agent | Dispatch when |
|-------|---------------|
| `planner` | Task spans multiple files or steps and needs a concrete phased plan with file paths, risks and test strategy (read-only) |
| `architect` | Choosing between designs, changing module boundaries, data models or APIs; returns a short decision record (read-only) |
| `code-reviewer` | After writing code, after each plan task, before merge; general correctness, edge cases, tests, over-building |
| `security-reviewer` | Code handling user input, auth, uploads, payments, webhooks, shell, secrets; dependency changes; before releases |
| `silent-failure-hunter` | Change adds or touches error handling, retries, fallbacks, background jobs or network/DB calls |
| `pr-test-analyzer` | Any change that alters behavior or adds tests (or conspicuously adds none); finds tests that would pass if the change were reverted |
| `type-design-analyzer` | New or changed types, DTOs, enums or public interfaces; checks illegal states are unrepresentable |
| `comment-analyzer` | New or changed comments and docstrings; checks accuracy and comment rot (advisory) |
| `code-simplifier` | Polish pass after a feature is written and reviewed; simplifies while preserving behavior (can edit) |
| `rust-reviewer` | Change touches `.rs` or `Cargo.toml`; runs cargo check, clippy, test |
| `go-reviewer` | Change touches `.go` or `go.mod`; runs go build, vet, test -race |
| `python-reviewer` | Change touches `.py` or Python dependency config; runs ruff, mypy, pytest |
| `database-reviewer` | Change writes SQL or ORM queries, adds migrations, changes schemas, indexes or transactions (PostgreSQL-first) |
| `rust-build-resolver` | `cargo build`, check, clippy or test fails to compile; fixes with the smallest change (can edit) |
| `go-build-resolver` | `go build`, vet or test compilation fails, import cycles, go.mod problems; smallest fix (can edit) |
