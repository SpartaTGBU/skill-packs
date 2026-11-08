---
disable-model-invocation: true  # skl: on-demand pack skill
name: security-hardening
description: Harden your OWN software before deployment - short threat model, dependency and supply-chain scan, secrets and config review, authn/authz and injection regression tests run against local/staging, container/CI/cloud checklists, logging and incident readiness, then evidence. Use when preparing a release, adding a service, or asked to "harden", "lock down" or "write security tests". Split with forge:security-review and the security-reviewer agent - they READ a diff and report findings; this skill CHANGES config and ADDS tests, then proves it. Run review first for a diff, hardening for a system.
---

# Security Hardening (defensive, own software only)

## 0. Authorization gate (do first, no exceptions)
Proceed only if the target is code/infra the user owns or has written scope for. Record in one line: target, environment (local/staging only), scope source. If the target is third-party, production-with-live-users, or scope is unclear: **stop and ask**. Never run tests against systems you were not told are yours. Out of scope always: exploit development, evasion, persistence, credential theft, attacking others. Tests assert that attacks are *rejected*; they are not weapons.

## 1. Threat-model the change (5 lines)
Assets (what is worth protecting) / entry points / trust boundaries / top 3 abuse cases (who, what, impact) / existing controls. Each abuse case maps to a test or a config fix below. Skip nothing silently: write "n/a, because ...".

## 2. Dependencies and supply chain
- Run the ecosystem's auditor: `npm audit --omit=dev`, `pip-audit -r requirements.txt`, `cargo audit` and `cargo deny check`, `govulncheck ./...`, or `osv-scanner scan source -r .` for mixed repos. Commit lockfiles; install from lockfile in CI (`npm ci`, `cargo build --locked`).
- For each finding: reachable? fixed version? Upgrade, else document the accepted risk with owner and review date.
- Check new deps for maintainer/age/install scripts; prefer fewer. Pin CI actions and base images by digest/commit.
- Generate an SBOM if the project ships artifacts (CycloneDX or SPDX).

## 3. Secrets and config
- Scan the tree and history with a secret scanner (`gitleaks detect --redact` for history, `gitleaks dir --redact .` for the tree; or trufflehog). Redact values in all output.
- Any real secret found: rotate first, then remove. Rewriting history is not rotation.
- Config: debug off, default credentials gone, CORS/allowed hosts explicit, cookies `Secure`/`HttpOnly`/`SameSite`, TLS on, security headers set, secrets from env/secret store, fail fast if missing.

## 4. Authn/authz as regression tests
Write tests in the project's framework against local/staging. Minimum matrix per protected route: no credentials -> 401; wrong role -> 403; other tenant's object id -> 403/404 (IDOR); expired/tampered token -> 401; mass-assignment of privileged fields ignored; rate limit/lockout on login. Parametrize over routes so new routes must be added to the table.

## 5. Input validation and injection tests (own app, local/staging)
Per input sink, a table of hostile-but-inert inputs with the expected *safe outcome*: SQL metacharacters stored/queried literally; HTML/script text escaped on output; path traversal strings rejected; oversized bodies/fields -> 413/400; wrong types and unicode edge cases -> 400; URL fetchers refuse internal/metadata addresses; deserializers reject unexpected types. Assert on response and on absence of side effects (no row written, no file read). Fix the sink (parameterize, encode, allowlist), not the test.

## 6. Container, CI, cloud checklists
- Container: pinned minimal base, non-root user, no secrets in layers, read-only FS where possible, dropped capabilities, no privileged/hostPath, healthcheck, image scanned.
- CI: least-privilege tokens, no secrets to fork PRs, pinned actions, protected branches, signed/provenance artifacts where supported, no `curl | sh`.
- Cloud/IaC: no public buckets/DBs/admin ports, least-privilege IAM (no `*`), encryption at rest/in transit, audit logging on, separate prod/staging credentials. Use the matching `forge:*-validator` skill when one exists.
- Benchmarks (CIS, OWASP ASVS/Cheat Sheets, NIST SSDF) are references; link, do not paste.

## 7. Logging and incident readiness
Log auth events, access denials, admin actions, input-validation rejects, with request id and actor; never log secrets, tokens or full PII. Alerts for repeated failures. Write a one-page runbook: who is paged, how to rotate each secret, how to disable an account/feature, how to roll back, where logs live. Check backups restore.

## 8. Verify with evidence
Use forge:verification. Report: gate record, threat-model lines, each scanner command + exit status + remaining findings, new tests (failing before the fix where one was needed, passing after), checklist items done / deferred with reason. No claim without command output. Unfixed items are listed with severity and owner, not hidden.
