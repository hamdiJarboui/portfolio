import { harness, type Harness } from './harness';

export interface Stat {
  value: string;
  label: string;
}

export interface HeadlinePoint {
  headline: string;
  body: string;
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  role: string;
  ownership: string;
  stack: string[];
  stats: Stat[];
  valueProps: HeadlinePoint[];
  highlights: HeadlinePoint[];
  engineeringRigor: string[];
  architecture: string[];
  harness?: Harness;
}

export const projects: Project[] = [
  {
    slug: 'agileforge',
    name: 'AgileForge',
    tagline: 'A multi-agent dev platform that opens real pull requests, with a human holding veto power at two separate points in the stack before any code lands.',
    summary: "AgileForge is a human-supervised multi-agent development platform. A Python/FastAPI control plane orchestrates a configurable roster of AI agents — Scrum Master, Developers, DevOps Engineers, Test Engineers, scheduled PR Monitors — that pick up real Jira tickets and open real GitHub/GitLab pull requests, each ticket working in its own isolated git worktree, with a React/SSE dashboard giving live visibility into what's running. Every code-touching action passes through a two-plane human-in-the-loop approval model: a FastAPI interceptor on one side, OpenCode's own per-tool permission profiles on the other. After the core system was feature-complete, I ran a dedicated security-hardening pass on it myself (self-performed, AI-assisted, not third-party), which found and mostly fixed 1 CRITICAL, 3 HIGH, 4 MEDIUM and 2 LOW issues — the small remainder accepted as documented residual risk rather than dropped. Current state: 595 backend tests at 91.90% coverage, 132 frontend tests, all passing.",
    role: 'I designed and built this alone, from the first architecture decision through the post-hardening security pass — control plane, agent orchestration, dashboard, and the audit/approval model that gates all of it.',
    ownership: 'Solo personal project',
    stack: [
      'Python 3.11 + FastAPI control plane with native SSE (fastapi.sse.EventSourceResponse)',
      'React 19 + TypeScript + Vite 7 SPA, TanStack Query 5 + Zustand 5, Tailwind CSS 4',
      'OpenCode CLI execution plane, version-pinned (opencode-ai@1.18.4) and contract-tested against its live OpenAPI surface',
      'Model Context Protocol (official mcp Python SDK) — Jira, GitHub, GitLab and Microsoft 365 integrations',
      'SQLAlchemy 2.x async ORM + Alembic migrations over SQLite in WAL mode, with an opt-in async Postgres path',
      'Playwright 1.62 full-stack E2E + pytest/pytest-cov (backend) + Vitest 4/coverage-v8 (frontend), each behind an 80% coverage gate',
      'git worktrees — one per ticket — for filesystem-level workspace isolation',
      'APScheduler (AsyncIOScheduler) driving PR-monitor sweeps',
      'cryptography (Fernet) for at-rest secret and webhook encryption',
      'ruff + eslint 9/typescript-eslint 8 as the lint/format gate',
    ],
    stats: [
      { value: '595', label: 'backend tests' },
      { value: '91.9%', label: 'test coverage' },
      { value: '8', label: 'ADRs' },
    ],
    valueProps: [
      { headline: 'Control without the bottleneck', body: "A two-plane HITL approval model — a FastAPI interceptor plus OpenCode's own per-tool allow/ask/deny profiles — lets a human stay in the loop without reviewing every keystroke: switch globally or per agent instance between Auto and Review/Accept depending on how much you trust that agent that day." },
      { headline: "A budget an agent can't blow through", body: 'An optional per-role/per-instance LLM spend cap force-flips an over-budget agent into Review mode mid-run instead of killing the ticket outright.' },
      { headline: 'Built for concurrent work from the start', body: 'One git worktree per ticket, a documented four-rung cleanup ladder, and a startup-time orphan sweep — this combination is what a 15-ticket, 5-way-concurrent soak test against 3 repos actually exercised, and what surfaced the one real race condition described below.' },
      { headline: 'An append-only trail, encrypted secrets', body: 'The audit_events table has no UPDATE or DELETE path at the schema level. Secrets are Fernet-encrypted at rest, and any MCP tool whose risk level can\'t be determined gets gated as high-risk by default.' },
      { headline: 'GitHub and GitLab on equal footing', body: 'Dispatch, PR/MR creation, monitoring, and human actions are all implemented against one abstraction, with GitHub/GitLab parity checked at the integration-test level rather than one provider being an afterthought.' },
    ],
    highlights: [
      { headline: 'A self-run security pass: 1 critical, 3 high, 4 medium, 2 low found', body: 'After the feature work shipped, I ran a dedicated security-hardening pass over the repo myself, using an AI-assisted audit workflow (anvil:security-auditor) rather than a third-party or independent reviewer. It found 10 issues across the backend, frontend and dependency tree: 1 CRITICAL, 3 HIGH, 4 MEDIUM, 2 LOW. Every CRITICAL and HIGH finding got fixed with a failing test written first. Of the 4 MEDIUM findings, most were fixed the same way; one (spawned MCP subprocesses inheriting the full parent environment) was reviewed and explicitly accepted as residual risk for a single-operator, locally-run tool rather than silently left unmentioned. Both LOW findings were accepted on the same basis. Nothing here is independent verification — it\'s what a careful self-review turned up and how each item was disposed of, documented in docs/TASKS.md section 14.' },
      { headline: 'Verified: 595 backend tests, 91.9% coverage', body: 'Post-hardening state, verified by re-running the suite: backend at 595 passing tests (1 skipped, 9 deselected contract tests) and 91.90% coverage against an 80% gate, ruff clean; frontend at 132 passing tests, tsc --noEmit clean.' },
      { headline: 'The known-CVE dependency, specifically', body: 'One of the HIGH findings was a cryptography library version sitting on the credential-encryption path with a published vulnerability: PYSEC-2026-3552, present in cryptography 49.0.0. Bumped to 50.0.1 — confirmed against pyproject.toml and uv.lock — and pip-audit against the real project venv now reports clean.' },
      { headline: 'A concurrency soak test found a real race, not a theoretical one', body: '15 tickets across 3 repos, 5 concurrently in flight, run against the real git worktree layer and a real single-writer SQLite queue. The first run failed once in six: a transient Windows git worktree add permission error under concurrent same-repo access. Fixed with a bounded retry; eight clean runs followed, with zero database-locked errors across any run before or after the fix.' },
      { headline: 'Integration tests hit real wire protocols', body: 'The integration and E2E suites run against genuine protocol implementations — real MCP stdio servers, a real HTTP/SSE OpenCode server, a real OpenAI-compatible chat server — instead of in-process stubs. A separate contract-marker suite pins behavior against the actual pinned OpenCode binary\'s live OpenAPI surface, with a checked-in snapshot that has to be refreshed on any version bump.' },
      { headline: "One health endpoint, the whole system's status", body: 'GET /api/health reports composite status across OpenCode supervisor liveness, SQLite WAL and Alembic schema version, per-MCP-server connection state, and the scheduler job list.' },
      { headline: 'Eight ADRs, each one arguing against itself first', body: 'ADR-001 through ADR-008 document every major technical choice, and each one scores the rejected alternatives explicitly rather than just stating the conclusion.' },
    ],
    engineeringRigor: [
      'A fail-fast local CI-gate script (scripts/ci.ps1) chains, in strict order: ruff check, ruff format --check, frontend eslint, backend pytest (80% coverage gate enforced in pyproject.toml), frontend Vitest with coverage (80% gate on lines/statements/functions/branches), a production build (tsc -b && vite build), and the full Playwright E2E suite.',
      "A stricter pre-release gate (scripts/release_check.ps1) runs the full CI suite plus a contract marker test suite validated against the real pinned OpenCode binary's live OpenAPI surface, which is how silent upstream API drift in the execution-plane dependency gets caught before it ships rather than after.",
      'Lint rules are explicit and scoped: ruff enforces E/W/F/I/N/UP/B/C4/SIM/RUF at 100-char line length, with per-file-ignores narrowly limited to Alembic-generated migration code.',
      "Release status is tracked by hand rather than automated: the README's status banner states precisely which of 10 phases are complete and which scope was deliberately reduced, and docs/PHASE10_REVIEW.md plus docs/TASKS.md carry a per-phase, per-task decision record standing in for a formal changelog.",
      'The OpenCode CLI dependency is pinned to an exact version (opencode-ai@1.18.4), with a written rule that any upgrade requires re-running the contract suite and refreshing the checked-in OpenAPI snapshot.',
    ],
    architecture: [
      'Two supervised planes do the work. A Python 3.11/FastAPI control plane — SQLAlchemy 2.x async ORM over SQLite in WAL mode, Alembic migrations with render_as_batch, a single-writer Writer that serializes every DB write to keep concurrent dispatch out of lock contention — streams state to a React 19/Vite 7/TypeScript dashboard over native SSE. Underneath it, an OpenCode CLI execution plane (pinned to opencode-ai@1.18.4, supervised via httpx/httpx-sse) actually runs the agent work, with each ticket isolated in its own git worktree behind a four-rung cleanup ladder and a startup-time orphan sweep.',
      "Human oversight sits on both planes at once: a FastAPI approval interceptor on one side, OpenCode's own per-tool allow/ask/deny permission profiles on the other, switchable globally or per agent instance between Auto and Review/Accept. That backs a configurable agent roster — Scrum Master, Developers, DevOps Engineers, Test Engineers, scheduled PR Monitors — with DB-versioned, immutable-history system prompts and a least-privilege MCP tool matrix scoped per role.",
      'External systems integrate through the official MCP Python SDK over stdio: Jira for ticket intake, GitHub and GitLab for PR/MR creation and monitoring, with parity between the two providers verified at the integration-test level. APScheduler drives the PR-monitor sweeps plus an immediate post-creation check. Secrets and webhook credentials are Fernet-encrypted at rest and scanned for embedded literals at write time, and every backend restart runs a recovery sequence — worktree sweep, OpenCode session reconciliation, stale-approval expiry — against an append-only audit_events table with no UPDATE or DELETE path, which is what the E2E audit-trail assertions check against.',
    ],
  },
  {
    slug: 'opencode-autodev',
    name: 'opencode-autodev',
    tagline: 'Ships tickets end-to-end without a human clicking merge — an OpenCode plugin that discovers, implements, opens the change, polls, merges, and notifies on Bun, hardened by three real production hangs root-caused before its first stable release.',
    summary: "opencode-autodev is an OpenCode plugin that runs a full autonomous delivery loop — discover, implement, open a change, poll for review/CI status, merge, and notify — on Bun, using bun:sqlite as a leased task store and a Tracker/Forge adapter split that lets GitLab, GitHub, Jira, and Microsoft To Do plug into one behavioral contract. The mechanical parts of shipping a fix — claiming a ticket, opening the MR, watching CI, merging once every gate is green — happen unattended; a fail-closed four-way merge gate and a compiler-enforced bounded-state invariant are what keep that unattended process honest, so it can't silently get stuck or merge on a signal that never showed up. It reached its first stable tag with 513 tests across 37 files behind an 85% coverage floor, three separate production hangs that got root-caused and fixed across five hardening prereleases, and a tag-gated, dual-path release pipeline that publishes into a private, internally-hosted GitLab npm registry.",
    role: "I designed, built, and hardened this alone — every commit in the repo's history is mine. It started as an internal tool and stayed one: the code lives in a company-hosted GitLab group rather than a personal namespace, so I'm the sole engineer on it but not the sole stakeholder in what it publishes to.",
    ownership: 'Solo-built, on employer infrastructure',
    stack: [
      'TypeScript (strict, ESM, noUncheckedIndexedAccess, noImplicitOverride)',
      'Bun runtime (pinned 1.4.2)',
      'bun:sqlite (native SQLite binding — leased task store, no compiled native dependency)',
      '@opencode-ai/plugin & @opencode-ai/sdk',
      'Zod (schema validation with superRefine cross-field rules)',
      'GitLab CI (tag-gated publish job) + GitLab npm Package Registry',
      'ESLint 9 flat config + typescript-eslint recommendedTypeChecked',
      'GitLab / GitHub / Jira / Microsoft Graph REST APIs (multi-vendor Tracker/Forge adapters)',
      'Slack / Microsoft Teams (Adaptive Cards via Power Automate) / webhook / desktop notifications',
    ],
    stats: [
      { value: '513', label: 'tests, 37 files' },
      { value: '85%', label: 'coverage floor' },
      { value: '4', label: 'vendor adapters' },
    ],
    valueProps: [
      { headline: 'Ships tickets while you sleep', body: 'Runs the mechanical half of shipping software unattended: discover, implement, open the change, poll CI and review, merge, notify. Engineers stop babysitting a queue, and human review never leaves the loop — it just moves to the merge gate instead of the ticket board.' },
      { headline: 'Defaults to blocked, not merged', body: "The four-way merge gate checks reviewer verdict, approvals, pipeline status, and required security jobs, and any one of them being missing or absent blocks the merge. Nothing here defaults to pass — for a tool that acts without a human watching, that's the direction the defaults have to point." },
      { headline: 'One contract, four trackers and forges', body: "GitLab, GitHub, Jira, and Microsoft To Do all sit behind a single Tracker/Forge interface, and a shared test suite runs against every one of the four adapters. Swapping a client's tracker or forge doesn't touch the state machine that drives tickets through it." },
      { headline: 'Three hangs found the hard way, then closed for good', body: 'Production surfaced three separate hangs after the plugin went live — a scheduler call, config.get(), and app.log() itself all had ways to block forever. Each one got root-caused and fixed across five prereleases (dev.1 through dev.6) before the first stable tag went out.' },
      { headline: 'Every log line gets scrubbed before it leaves the process', body: 'A three-pass redaction pipeline runs over every log line, error, and outbound notification field, stripping configured secret values, known vendor token shapes, and generic key=value pairs. An accidental log dump or webhook payload doesn\'t turn into a credential leak.' },
    ],
    highlights: [
      { headline: '513 tests, four vendors, one contract', body: '513 test cases across 155 describe blocks in 37 files — roughly 13,045 lines of test code against 9,897 lines of source — including a shared Tracker/Forge contract suite that every one of the four vendor adapters has to pass.' },
      { headline: '85% coverage, and the build fails without it', body: "Bun's own coverage gate enforces the floor directly: bun test --coverage --coverage-threshold=0.85. There's no separate reporting step to skip." },
      { headline: 'Every SDK call now has a ceiling', body: 'A shared withTimeout helper wraps every plugin-to-SDK call, including client.app.log itself, in a hard timeout. That closed all three production hangs — in the scheduler call, in config.get(), and in app.log() — that surfaced across dev.1 through dev.6.' },
      { headline: "A task store that doesn't need a babysitter process", body: 'The bun:sqlite task store runs in WAL journal mode with its file forced to permission 0600, and claims a ticket through a real BEGIN IMMEDIATE compare-and-set transaction — no separate reaper process watching for orphaned leases.' },
      { headline: "A test that makes 'stuck forever' impossible to ship", body: 'ADR-011 introduced a bounded-state invariant: one test enumerates every TaskState and asserts a wall-clock ceiling on each non-terminal one. It exists because two tickets had already gotten stuck indefinitely — one in APPROVED, one in IN_REVIEW — before the test did.' },
      { headline: 'Publishing has two paths and one gate', body: "Releases go out tag-gated and dual-path: automatically via CI using the pipeline's own CI_JOB_TOKEN on a tag push, or manually via cross-platform scripts that package a git archive of the exact tagged commit and clean up their temp files on exit even when the publish fails." },
    ],
    engineeringRigor: [
      "A GitLab CI publish job that first checks the pushed tag against package.json's version and fails the pipeline on any mismatch, then publishes using the pipeline's own ephemeral CI_JOB_TOKEN, so no long-lived secret has to be stored anywhere.",
      'A local quality gate — bun run validate, running typecheck, lint, check:no-todos, and test:coverage in sequence — is mandatory before every commit. It combines strict TypeScript, ESLint 9\'s flat config with typescript-eslint\'s recommendedTypeChecked, a custom script that bans console.log/setInterval/unresolved-VERIFY comments in src/, and the 85% coverage floor.',
      'The manual release path (publish-to-gitlab-registry.sh / .bat) supports --dry-run, reads credentials only from environment variables so nothing touches disk, packages from a git archive of the exact tagged commit, and deletes its temp files and generated .npmrc on exit regardless of outcome.',
      "The same version-match check runs in CI and in the manual scripts, so a mismatched tag/package.json pair can't reach the registry through either path.",
      'Git history follows Conventional Commits throughout (feat/fix/refactor/docs/test/chore) — including a standalone fix commit for a mistake in how a prerelease\'s npm dist-tag was derived, which is really a record of iterating on the release tooling itself.',
      "The prerelease sequence (dev.1 through dev.6) isn't cosmetic version-bumping — each one shipped a root-caused fix for a specific production hang, and the run of them is the hardening cycle the plugin went through before its first stable release.",
    ],
    architecture: [
      'opencode-autodev is a TypeScript/Bun OpenCode plugin built around an I/O-free state machine (src/dispatch.ts) that drives each task through CLAIMED → IMPLEMENTING → VERIFYING → MR_OPEN → REVIEWING → IN_REVIEW → MERGED → DONE. State lives in a bun:sqlite task store — WAL mode, file permissions forced to 0600, leases acquired through a real BEGIN IMMEDIATE compare-and-set transaction, and a versioned v1 → v2 → v3 migration ladder underneath it.',
      "Where work comes from and where it gets merged are deliberately two different interfaces (ADR-007): GitLab and GitHub implement both Tracker and Forge, while Jira and Microsoft To Do implement Tracker only. The TypeScript compiler itself blocks a tracker-only source from being asked to gate, report on, or merge a change, and all four adapters run through the same contract-test suite (test/contract/tracker.ts, forge.ts) so no vendor's behavior can quietly drift from the spec.",
      "A load-time capability probe (ADR-005, src/caps.ts) resolves the real OpenCode SDK surface once at startup and wraps every call except session.prompt and app.log in a tested fallback chain. A shared withTimeout helper then bounds every one of those plugin-to-SDK calls, including app.log itself, after three separate production hangs made it clear that an unbounded call to anything is a hang waiting to happen.",
      "A shared HTTP retry core (src/net/http.ts) parses Retry-After in both integer-seconds and HTTP-date form and clamps it to a 1–30s window sized to stay inside a task's lease, while also telling a terminal credential failure apart from a merely-missing environment variable. On top of that sits the safety envelope: a four-way fail-closed merge gate (src/gates.ts), the ADR-011 bounded-non-terminal-state invariant enforced by the test that enumerates every TaskState, and a three-pass secret redactor that strips configured env values, known vendor token shapes, and generic key=value secrets from every log line, error, and outbound Teams/Slack/webhook field before it leaves the process.",
    ],
  },
  {
    slug: 'ai-tools-library',
    name: 'ai-tools-library',
    tagline: '25 production MCP server packages, 549 tools, built at KPIT and shipped through a 7-stage CI pipeline with tag-gated, dual-target publishing.',
    summary: "ai-tools-library is a monorepo of 25 independently installable MCP server packages — 549 tools spanning developer tooling, enterprise collaboration, observability, and automotive/embedded diagnostics — built on two shared foundation packages so every integration gets tool discovery, risk gating, retries, and a working MCP server with minimal added code. A 7-stage GitLab CI pipeline enforces lint, type, security, and per-package coverage gates before anything builds, and every release is tag-verified and published to both an external package index and a private package registry. Production concerns get the same engineering attention as the tools themselves: health/readiness endpoints, a gated compliance audit trail, risk-aware circuit breakers, and a real Docker Compose + Caddy deployment topology with per-service bearer tokens and rate limiting.",
    role: 'Built at KPIT, where I designed and own the system end to end — architecture, the CI/CD pipeline, and the deployment topology — with a teammate contributing to a handful of the integration packages.',
    ownership: 'Built at KPIT — employer project',
    stack: [
      'Python 3.11 / 3.12',
      'uv (astral-sh) monorepo workspace — single lockfile across 25 packages',
      'MCP (Model Context Protocol) Python SDK — stdio + Streamable HTTP transports',
      'GitLab CI (7-stage primary pipeline) + GitHub Actions (secondary mirror)',
      'Docker Compose + Caddy 2, custom-built with xcaddy and the caddy-ratelimit plugin',
      "Starlette (ASGI) for the HTTP transport's /healthz, /readyz, /metrics routes",
      'Pydantic v2',
      'OpenTelemetry (optional) — OTLP/HTTP export, Prometheus-scrapable /metrics',
      'pytest, pytest-xdist, pytest-cov, pytest-asyncio, plus nox as a local task runner',
      'black, ruff, mypy --strict, pre-commit',
      'bandit + pip-audit security scanning',
      'twine dual-target publishing, GitLab CLI (glab), Renovate',
      'Domain libraries: python-can/cantools, asammdf, udsoncan/doipclient, psycopg/pymssql',
      'Sphinx (generated documentation)',
    ],
    stats: [
      { value: '549', label: 'tools' },
      { value: '25', label: 'MCP packages' },
      { value: '7', label: 'CI stages' },
    ],
    valueProps: [
      { headline: 'Install only what you need', body: 'Ships as a real, independently versioned product rather than one big bundle: 25 packages published to both an external package index and a private package registry, so a team installs exactly the integrations it needs.' },
      { headline: 'Dangerous capabilities, double-gated', body: 'Production safety is built into the request path, not bolted onto the client: risk-based tool gating (LOW/MEDIUM/HIGH) gives genuinely dangerous capabilities — Windows desktop automation, live ECU (UDS) writes — a double opt-in before they run.' },
      { headline: 'One broken test blocks every release', body: "A release can't happen by accident: verify_release_tag blocks every publish job unless the pushed tag matches the resolved package version, so a failing gate or a version mismatch stops every publish target at once." },
      { headline: 'One command, full stack, every time', body: 'Deployment is a one-command, idempotent operation: deploy.sh regenerates the full Docker Compose + Caddy topology from a single source-of-truth table and provisions per-service bearer tokens without ever overwriting existing secrets.' },
      { headline: "A roadmap that's actually checked off", body: "Engineering debt lives in a 785+ line roadmap that states its own verification methodology up front and gets checked off against the current codebase — the kind of self-auditing discipline that scales past one person." },
    ],
    highlights: [
      { headline: '7 stages before a package ships', body: '7-stage GitLab CI pipeline (init → quality → test → build → package-verify → e2e → release) gates every merge with parallel lint, type-check, security-scan, and coverage jobs before a single package is built.' },
      { headline: 'Coverage floors up to 98%, per package', body: 'Per-package coverage floors enforced by scripts/check_coverage_per_package.py (e.g. ai-tools-kibana ≥98%, ai-tools-jira/grafana ≥95%) layered on a 78% aggregate gate defined once in pyproject.toml as the single source of truth.' },
      { headline: 'Real databases, real LLMs, real tests', body: 'Real infrastructure backs the e2e tier: live Postgres 16 and MSSQL 2022 service containers, with AI_TOOLS_REQUIRE_DB=1 forcing a hard failure instead of a silent skip, plus LLM-agent tests that drive real MCP servers against an actual OpenAI-compatible model.' },
      { headline: 'Every release verified against two registries', body: "Dual-target, tag-gated releases: verify_release_tag blocks publish_release, upload_registry, and the GitLab Release job alike unless the pushed vX.Y.Z tag matches the version resolved by AST-parsing every package's pyproject.toml." },
      { headline: '21 services, one proxy, real rate limiting', body: 'Production deployment reference: one Docker image running 21 services behind a custom xcaddy-built Caddy proxy with the caddy-ratelimit plugin and a global 429 concurrency cap, each service isolated behind its own randomly generated bearer token.' },
      { headline: 'Health checks built for real operators', body: 'Health/readiness built for real operators: /healthz and /readyz Starlette routes with an explicit "a readiness check must never itself 500" design note, plus reserved-path collision guarding against /metrics.' },
    ],
    engineeringRigor: [
      'Before anything builds, a parallel quality gate runs black --check, ruff check, mypy --strict on the core/base framework, bandit -ll plus pip-audit (both with JSON artifacts), lockstep version checks, and a full pre-commit run --all-files replay. The same checks are mirrored locally via .pre-commit-config.yaml, so most violations get caught before push rather than waiting on CI to report them.',
      "A single 78% aggregate coverage floor lives once in pyproject.toml — deliberately not restated in CI or noxfile.py, so it can't drift out of sync — layered under per-package floors in scripts/coverage_floors.json that range 70%-98% by how critical each package is.",
      'Build stage compiles and smoke-tests every package in the release pipeline as sdist and wheel, checking the resulting wheel count against what the packaging script expects and confirming import ai_tools_library actually succeeds afterward.',
      'The release procedure in docs/RELEASING.md — bump every package version, update CHANGELOG.md, tag vX.Y.Z on main — only completes once verify_release_tag confirms the tag matches the resolved version; a git-archive-based manual script exists for backfilling or retrying a specific tagged release.',
      "GitLab CI runs as the 439-line, 7-stage primary pipeline, while a secondary GitHub Actions workflow independently builds the wheel into a clean venv and calls provider.list_mcp_tools() as a real functional smoke test. security_scan and mypy --strict currently run as allow_failure: they show up on every pipeline run, but it's worth stating plainly that a failure there doesn't yet block a merge.",
    ],
    architecture: [
      'The system is a uv-managed monorepo of 27 published packages sharing a single lockfile: two foundation packages — ai-tools-base (framework-agnostic ToolDescription/schema primitives) and ai-tools-core (the tool contract, discovery registry, and MCP-adapter/server framework in registry.py, mcp_adapter.py, mcp_server.py, contracts.py) — plus 25 independently installable integration packages built on top of them. Twelve cover enterprise DevOps and collaboration tooling (GitHub, GitLab, Jenkins, JFrog, Nexus, Confluence, Jira, Office365, Elastic, Kibana, Grafana, Zuul); two cover data access and desktop control (SQLite/PostgreSQL/MSSQL, governed Windows UI Automation); two cover general log and packet analysis (plain-text/structured application logs, tshark packet captures); and nine cover automotive and embedded diagnostics (A2L calibration data, AUTOSAR ARXML, CAN/DBC, DLT, MDF4 measurement files, ODX/PDX, UDS-over-DoIP, TestGuide execution logs, and Lauterbach TRACE32 debugger control).',
      "A central registry auto-discovers every installed package's tools at runtime, isolates per-package discovery failures so one broken integration can't take down the other twenty-four, and automatically disambiguates tool-name collisions — github and gitlab both define create_issue — by renaming to <package>_<tool>. Two chokepoints turned out to be the right leverage point for cross-cutting production features: mcp_adapter.py's call_tool and mcp_server.py's server construction. Risk-aware retry with per-integration circuit breakers, an opt-in compliance audit trail with credential redaction, centralized result-size limiting and pagination, and a bounded TTL response cache all land across every server through those two files, with zero changes to per-package code.",
      'Transport switches between stdio, for desktop MCP clients, and Streamable HTTP — a Starlette-based server exposing /healthz, /readyz, and an optional OpenTelemetry-backed /metrics. Configuration resolves through a three-tier precedence (env var, then config file, then default), which lets a fleet of deployed servers share one config file instead of duplicating settings per instance.',
      'In production this aggregate runs as Docker Compose services behind a custom xcaddy-built Caddy 2 reverse proxy — the caddy-ratelimit plugin plus a global HTTP concurrency cap — generated from a single SERVERS table via deploy/generate.py. Each service sits behind its own randomly generated bearer token and is gated by risk level (LOW/MEDIUM/HIGH) plus a double opt-in flag for the capabilities that are genuinely dangerous, like desktop control or live ECU writes.',
    ],
  },
  {
    slug: 'anvil',
    name: 'Anvil',
    tagline: "The company's AI harness: one package that gives every engineer the same 150 skills, 150 agents and 62 commands, in whichever AI coding host they use, wired into the tools the company actually runs.",
    summary: "Anvil is the AI harness for the whole engineering organisation. Instead of every team prompting a general-purpose assistant from scratch, Anvil ships a shared, versioned layer of company knowledge and workflow: 150 skills, 150 agents and 62 slash commands, covering code review, CI failure diagnosis, requirements traceability, test analysis, MISRA/ISO 26262/ASPICE compliance and automotive diagnostics. One canonical registry installs that layer into Claude Code, OpenCode, Beacon and GitHub Copilot, so a developer on any of the four hosts gets the same capabilities and the same guardrails. Through MCP servers, the agents read live evidence from GitLab, GitHub, Jenkins, Zuul, Jira, Confluence, Nexus, Artifactory, TestGuide, TRACE32, Grafana and Elastic, plus DLT traces, CAN logs and ARXML/A2L/ODX files, instead of guessing. Every push runs a three-stage GitLab CI pipeline (structural verification of all 300 components, a 19-suite Node.js/Python test battery, tag-gated npm publishing), and the whole toolkit has zero npm runtime or dev dependencies.",
    role: "I'm the sole developer: every commit in the repo's history is mine. It was built at KPIT, lives on KPIT's internal GitLab, and grew from internal tooling into the shared AI layer described here. I designed and own the CLI, the host adapters, the CI/CD pipeline, the guardrail model and the component registry end to end, and I wrote the large majority of the 150 skills and 150 agents. 21 skills come from external skill packs; LICENSE-THIRD-PARTY.md tracks each one by exact origin commit and license status rather than passing them off as original work.",
    ownership: 'Company-wide AI harness, solo author at KPIT',
    stack: [
      'Node.js 18+ (ESM-only, zero runtime/dev dependencies)',
      'Python 3.11 (stdlib-only shared libraries)',
      'Model Context Protocol (MCP): 25 server packages, 549 live tools',
      '4 host adapters: Claude Code, OpenCode, Beacon, GitHub Copilot',
      'GitLab CI/CD (3-stage validate → test → publish pipeline)',
      'Claude Code plugin manifest format (.claude-plugin/)',
      'PreToolUse hooks + risk-tiered tool exposure (AI_TOOLS_MAX_RISK)',
      'Node.js built-in test runner (node --test) + Python unittest',
      'GitLab self-hosted npm Package Registry',
    ],
    stats: [
      { value: '362', label: 'skills, agents & commands' },
      { value: '4', label: 'AI hosts, one registry' },
      { value: '8', label: 'tool domains wired in' },
      { value: '0', label: 'npm dependencies' },
    ],
    valueProps: [
      { headline: 'One AI layer for the whole company', body: "Every engineer gets the same skills, agents and guardrails whether they work in Claude Code, OpenCode, Beacon or GitHub Copilot. A single registry, .claude-plugin/components.json, drives all four host adapters, so the company standardises its AI-assisted workflow once instead of each team maintaining its own prompts and toolchain." },
      { headline: 'Agents that read real evidence', body: 'Through MCP, agents query the systems the teams already run: forges, CI, artifact stores, ALM, test benches, debuggers, dashboards and raw ECU traces. A CI-failure agent reads the actual Jenkins or Zuul log; a requirements agent reads the actual Jira links; a diagnostics agent reads the actual DLT trace. Answers come with evidence attached.' },
      { headline: 'Safe to roll out to hundreds of engineers', body: "Analysis agents are read-only by default. Anything with side effects (retriggering builds, posting reviews, publishing pages, sending mail) waits for a human. A LOW/MEDIUM/HIGH risk cap decides which tools an agent can see at all, and a PreToolUse hook blocks any agent spawn that isn't in the registry." },
      { headline: 'Domain expertise, not keyword coverage', body: 'MISRA C:2012, ISO 26262, ASPICE 4.0, UDS/DoIP, CAN/DBC, AUTOSAR ARXML, A2L and ODX analysis are implemented as agent capabilities backed by the actual standards and file formats, so the harness is useful on automotive work where a generic assistant falls short.' },
      { headline: 'Install what your team needs, nothing more', body: 'A dependency-resolving CLI handles full, profile-based or selective installs, pulls in transitive skill and agent requirements automatically, answers reverse-dependency questions, and runs health checks, so each team can adopt a slice of the harness without breaking anything.' },
      { headline: 'Nothing on npm to patch', body: "Runtime and dev dependencies are both empty; package-lock.json lists nothing but the package itself. That shrinks the npm supply-chain surface for a tool installed on every engineer's machine. It still relies on Node.js, Python's standard library and the four host platforms, which npm audit doesn't cover." },
    ],
    highlights: [
      { headline: '362 components, one source of truth', body: '150 skills, 150 agents and 62 slash commands live in a single host-agnostic registry and are translated into each host\'s own format at install time by dedicated adapter modules (claude-code, opencode, beacon, copilot).' },
      { headline: 'Two orchestrators that route to the right specialist', body: 'sw-developer routes work to 15 language-specific orchestrators behind a bounded 2-iteration self-healing test loop. The read-only sw-reviewer fans a change out to up to 38 specialist review agents in parallel. Both are documented in full ADRs (Context / Decision / Alternatives Considered / Consequences).' },
      { headline: 'Every agent held to the same bar', body: 'scripts/verify.mjs structurally validates every skill and agent\'s frontmatter, requires an explicit "Autonomy level" and "## Hard limits" section on every agent, and checks that every MCP tool reference resolves to a declared server. An agent without written limits doesn\'t ship.' },
      { headline: 'Guardrails enforced where the host allows it, and gaps stated where it doesn\'t', body: "On Claude Code a PreToolUse hook blocks unregistered spawns; on OpenCode the same rule is compiled into its native permission.task map. Beacon and Copilot have no enforcement surface, and each adapter's header comments say so plainly instead of implying coverage that isn't there." },
      { headline: 'What you run locally is what gates CI', body: '19 Node.js test files plus a Python unittest suite run as the same command locally (npm test) and in CI, so there is no gap between what a developer checks and what blocks the pipeline.' },
      { headline: 'Upgrades and uninstalls you can trust', body: 'Every install writes a hash-verified receipt. Upgrades and uninstalls check the sha256 of each installed file against it, and --force backs up locally modified files before overwriting them. A release bump updates plugin.json and package.json atomically and rolls both back if the CHANGELOG write fails.' },
    ],
    engineeringRigor: [
      '3-stage GitLab CI pipeline (validate → test → publish) on every push: structural verification of all 300 skills and agents, documentation-drift checks and the full 19-file test suite must pass before anything ships.',
      'Publishing only fires on a git tag: the publish_package job triggers off $CI_COMMIT_TAG, re-checks that plugin.json, package.json and the tag agree, and authenticates to the self-hosted npm registry with the project-scoped CI_JOB_TOKEN, so no long-lived secret sits in CI variables.',
      'plugin.json and package.json disagreeing is a hard build failure: the version_consistency CI job catches it, and scripts/release.mjs enforces the same rule on every local bump.',
      "check-docs.mjs fails the build the moment README or docs component counts drift from the real registry. The commit history shows this was once caught and fixed by hand, which is why it's automated now.",
      'Real tagged releases (v2.13.0, v2.20.2, v2.21.6, current 2.22.0) show the pipeline has shipped actual versions to the company registry, not just sat in the YAML.',
      'A manual backfill publish path (scripts/publish-to-gitlab-registry.sh/.bat) extracts the exact tagged commit into a throwaway temp directory, supports --dry-run, and never touches the working branch.',
      'Third-party provenance is tracked in the open: LICENSE-THIRD-PARTY.md audits all 21 imported skills by exact origin commit and flags any missing an upstream license rather than quietly shipping them.',
    ],
    architecture: [
      "Anvil has three layers. At the top are the AI coding hosts engineers already use: Claude Code, OpenCode, Beacon and GitHub Copilot. In the middle is the harness itself: one canonical registry (.claude-plugin/components.json) describing 150 skills, 150 agents and 62 commands in a host-agnostic format, translated into each host's schema at install time by four adapter modules (adapters/claude-code.adapter.mjs, opencode.adapter.mjs, beacon.adapter.mjs, copilot.adapter.mjs). At the bottom are the company's own systems, reached through MCP servers from the ai-tools-library: 25 packages exposing 549 tools across source control, CI, artifacts, ALM, test execution, debug, observability and automotive file formats.",
      'The CLI (scripts/cli.mjs / scripts/install.mjs) resolves transitive requires-skills/requires-agents closures for selective, profile-based or full installs, and writes a hash-verified receipt so upgrades and uninstalls are mechanical rather than guesswork. That is what makes it practical to roll the harness out team by team instead of all at once.',
      "Two write-capable orchestrators sit on top of the registry: sw-developer routes to 15 language-specific orchestrators behind a bounded 2-iteration self-healing test loop, and the read-only sw-reviewer fans out to up to 38 review agents. Both are constrained by a PreToolUse hook (hooks/validate-agent-spawn.mjs) that blocks any spawn target missing from the registry, plus a risk-tiered tool-exposure model (AI_TOOLS_MAX_RISK) that caps which live tools an agent can see before it runs. The same restriction is compiled into OpenCode's permission.task allow/deny map; the Beacon and Copilot adapters state in their headers that those hosts have no enforcement surface.",
      'The toolkit runs on plain Node.js 18+ ESM and the Python 3.11 standard library, with no npm runtime or dev dependencies. Structural correctness is a CI-gated artifact: scripts/verify.mjs checks frontmatter, the Autonomy-level/Hard-limits sections and MCP reference resolution, and scripts/check-docs.mjs catches docs drift against the registry before it ships.',
    ],
    harness,
  },
  {
    slug: 'mtf-assistant',
    name: 'MTF Assistant',
    tagline: "Turns MTF's documentation into instant, cited answers — used by 600 testers and developers who'd rather ask than search.",
    summary: "MTF Assistant is a retrieval-augmented chatbot that answers questions about MTF — the company's internal automotive test framework — grounded in its own documentation, so testers and developers get sourced guidance on which methods to use and how to implement a test case without digging through docs or pulling a colleague away from their work. Built at KPIT, where I was the sole engineer on the project — a Django/React application with a LangChain RAG pipeline, CI, and local deployment — it's now used by around 600 people across the testing and development teams.",
    role: 'Built at KPIT as the sole engineer on this project — full-stack development (Django + React), RAG pipeline design, CI, testing, and hosting.',
    ownership: 'Built at KPIT',
    stack: [
      'Python + Django backend',
      'React frontend',
      'LangChain (RAG orchestration)',
      'OpenAI embeddings + chat models',
      'PostgreSQL + pgvector (vector store)',
      'Docker Compose (local hosting)',
    ],
    stats: [
      { value: '600', label: 'active users' },
      { value: 'KPIT', label: 'built during employment' },
      { value: 'RAG', label: 'grounded in the real docs' },
    ],
    valueProps: [
      { headline: 'Answers grounded in the real docs', body: "Every answer is generated from MTF's own documentation, retrieved and cited at query time — testers get framework-specific guidance grounded in the source material, with a reference they can check it against." },
      { headline: "Cuts the time to 'how do I do this'", body: 'Replaces manually searching documentation or interrupting a teammate with a direct question-and-answer interface — testers and developers get the method they need without leaving their workflow.' },
      { headline: '600 users and counting', body: 'Adopted across the testing and development teams working with MTF, with daily active use rather than the occasional pilot query.' },
      { headline: 'Built end-to-end by one engineer', body: 'As the sole engineer on this KPIT project, I designed and built the Django/React application, the LangChain RAG pipeline, the CI setup, and the local deployment infrastructure.' },
      { headline: 'Runs on internal infrastructure', body: "Hosted locally rather than on a public cloud endpoint, keeping MTF's internal documentation and usage data inside the company network." },
    ],
    highlights: [
      { headline: 'Retrieval over fine-tuning', body: "Uses LangChain to orchestrate a retrieval-augmented generation pipeline over OpenAI embeddings and chat models — MTF's documentation is chunked, embedded, and retrieved at query time, so doc updates show up in answers without retraining anything." },
      { headline: 'A Django API in front of the pipeline', body: 'A Django backend exposes the chat interface as an API — handling requests, chat history, and the RAG pipeline invocation — consumed by a React single-page frontend.' },
      { headline: 'Postgres does double duty as the vector store', body: "Documentation embeddings are stored in PostgreSQL via pgvector alongside the application's own relational data, avoiding a second database system just for vector search." },
      { headline: 'Answers point back to their source', body: "Responses reference the documentation passages they were generated from, so a tester can check a suggested method against the source doc rather than taking the chatbot's word for it." },
      { headline: 'Documentation stays current', body: "A separate ingestion step re-chunks and re-embeds MTF's documentation as it changes, so the assistant's answers track the framework instead of drifting from a one-time snapshot." },
    ],
    engineeringRigor: [
      'Backend and frontend test suites (pytest for the Django API, Jest/React Testing Library for the React frontend) run before a change merges.',
      'Linting and formatting (ruff/black for Python, ESLint/Prettier for the frontend) enforced as a CI gate, keeping a full-stack codebase built by a single engineer consistent end to end.',
      'Containerized with Docker Compose — separate services for the Django API, the React build, PostgreSQL/pgvector, and a reverse proxy — so the local deployment is reproducible rather than hand-configured.',
      'Secrets (the OpenAI API key, database credentials) are injected via environment configuration, never committed to the repository.',
      "A separate ingestion job re-embeds updated documentation independently of the application deploy, so refreshing the knowledge base doesn't require a full redeploy.",
    ],
    architecture: [
      "MTF Assistant pairs a Django backend with a React single-page frontend, with a LangChain-orchestrated retrieval-augmented generation pipeline sitting behind the chat API. MTF's documentation is chunked and embedded through the OpenAI embeddings API, and the resulting vectors are stored in PostgreSQL via pgvector — reusing the application's existing relational database instead of standing up a separate vector store.",
      "At query time, Django resolves the user's question, LangChain retrieves the most relevant documentation chunks by similarity search, and an OpenAI chat model generates an answer grounded in those chunks. The source passages come back alongside the response, so a tester can check the suggested method against the original doc.",
      'The stack — Django API, React frontend, PostgreSQL/pgvector, and a reverse proxy — runs locally via Docker Compose, so the deployment is reproducible rather than hand-configured. A separate ingestion job re-chunks and re-embeds the documentation set as it changes, decoupling knowledge-base freshness from application deploys.',
    ],
  },
];
