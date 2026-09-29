import { harness, type Harness, type HarnessLayer } from './harness';

export interface Stat {
  value: string;
  label: string;
}

export interface HeadlinePoint {
  headline: string;
  body: string;
}

export interface FlowStep {
  title: string;
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
  harnessLayer?: HarnessLayer;
  flow?: FlowStep[];
  flowHeading?: { label: string; title: string };
  /** Where the code lives; no href when the repository is private. */
  source: { label: string; href?: string };
  /** Show the scripted squad-channel replay on this project's page. */
  squadReplay?: boolean;
}

export const projects: Project[] = [
  {
    slug: 'hcode',
    source: { label: 'Private repository · code not public' },
    name: 'HCode',
    tagline: 'An AI pair programmer that plans before it edits, checks its own work, keeps going when an LLM provider goes down, and remembers your project between sessions. Available in the terminal, as a desktop app and inside VS Code.',
    summary: "HCode is the agent-runtime layer of the AI harness: an autonomous AI coding agent that runs in the terminal, built from the ground up rather than wrapped around an existing one. It reads and edits code, runs shell commands, works with git, searches the web and edits Jupyter notebooks, and it pushes every non-trivial task through a Plan → Execute → Verify workflow: the planning phase writes a task list and an implementation plan, the execution phase makes the changes, and the verification phase runs the checks and writes a walkthrough of what changed. It talks to Anthropic Claude and OpenAI (plus any OpenAI-compatible endpoint) through a resilient provider layer that fails over between them behind per-provider circuit breakers, remembers context across sessions through file, session and semantic memory, and wraps every task in a transaction so a failed run can be rolled back. The Python core is about 44,000 lines across 142 modules, covered by 827 test functions; the unit suite runs 496 passing tests in about 30 seconds.",
    role: "I started HCode and wrote its core: the first commit is mine (November 2025), and I built the agent loop, the Plan/Execute/Verify phases, fast mode, the reasoning and thinking display, the provider layer, the tool system and the terminal UI. Two collaborators joined later: Abdelkrim Jribi added MCP client support and repaired the test suite, and Mohamed Jarboui built the Tauri desktop app and the VS Code extension on top of the agent.",
    ownership: 'AI Harness · Layer 1 · creator & core author',
    stack: [
      'Python 3.10+ (asyncio, Pydantic v2, Click)',
      'Anthropic + OpenAI SDKs, any OpenAI-compatible endpoint',
      'Rich + prompt-toolkit terminal UI',
      'Model Context Protocol client (stdio + HTTP/SSE transports)',
      'SQLite + local embeddings for semantic memory',
      'tiktoken context budgeting',
      'GitPython, nbformat, BeautifulSoup/html2text tool backends',
      'Tauri (Rust) desktop app + VS Code extension (TypeScript, React webview)',
      'pytest + pytest-asyncio, ruff, black, mypy',
      'GitHub Actions release pipeline (PyInstaller builds for Linux, macOS x64/arm64, Windows)',
    ],
    stats: [
      { value: '3', label: 'places to use it: CLI, desktop, VS Code' },
      { value: '2', label: 'LLM providers, automatic failover' },
      { value: '827', label: 'test functions' },
    ],
    valueProps: [
      { headline: 'Changes you can review before they happen', body: "HCode doesn't jump straight into your files. For any real task it first writes a task list and an implementation plan you can read, then makes the changes, then runs the checks and hands back a walkthrough of what it changed and why. You get a reviewable plan up front and an explanation at the end, instead of a surprise diff." },
      { headline: 'Fast and cheap by default', body: "A task classifier answers trivial requests directly, skipping the planning cycle, and a fast mode trades planning for speed on demand. A loop detector breaks out when the agent repeats itself, iterations are capped, and oversized tool output is trimmed before it floods the context window. You pay for a full plan only when the task deserves one, and never for an agent going in circles." },
      { headline: 'Work keeps going when a provider fails', body: 'HCode runs on Anthropic Claude and OpenAI (or any OpenAI-compatible endpoint). If one provider rate-limits or errors out, a circuit breaker switches the session to the other one automatically, so a provider outage costs you a failover notice, not your progress. Cost, latency and success rate are tracked for each provider.' },
      { headline: 'No re-explaining your project every morning', body: 'Project instructions, conversation history and a semantic memory of facts and code patterns carry over between sessions. Long conversations are compacted automatically instead of hitting the context limit, so the agent stays useful on long-running work.' },
      { headline: 'You stay in control of what it runs', body: 'Every tool call goes through a permission prompt, and you can approve a safe action once for the whole session instead of on every call. Each task runs inside a transaction: if it fails, the files it created are removed and the run is marked rolled back.' },
      { headline: 'Meets developers where they already work', body: 'The same agent drives a rich terminal interface, a desktop app and a VS Code sidebar, and it can be extended with new skills, markdown workflows and external MCP tool servers without touching its code.' },
    ],
    highlights: [
      { headline: 'Built from the ground up, not a wrapper', body: 'The agent loop, phase handlers, tool executor, response parser, provider adapters and terminal UI are all HCode\'s own code: about 44,000 lines of Python across 142 modules, with the central HcodeAgent at roughly 1,900 lines coordinating providers, tools and workflow state.' },
      { headline: 'A full developer toolset', body: 'File tools (read, write, edit, multi-edit, fuzzy edit, glob, grep, diff preview with apply/reject), persistent Bash sessions with background output and kill, a full set of git tools, web fetch/search/scrape, Jupyter notebook read/edit, a live todo list, sub-agent tasks and user questions.' },
      { headline: 'Extensible without code changes', body: 'Folder-based skills (a SKILL.md plus optional scripts and resources, with {skill_dir} resolved at runtime) and markdown workflows add new capabilities on the fly, and the MCP client connects external tool servers over stdio or HTTP/SSE.' },
      { headline: 'Reasoning you can watch', body: 'The model\'s <thinking> blocks are parsed out and shown live, next to a persistent todo bar that updates as steps complete, themed panels and syntax-highlighted diffs, so the user sees what the agent intends before it acts.' },
      { headline: 'Global session permissions', body: 'Tool calls go through an interactive permission prompt, and a user can grant a permission once for the whole session rather than approving the same safe action on every call.' },
      { headline: 'One agent, three front ends', body: 'The same Python agent drives the terminal CLI, a Tauri desktop app (a Rust daemon bridge in front of a React UI) and a VS Code extension with a webview sidebar, git integration and secrets kept in VS Code\'s secret storage.' },
    ],
    engineeringRigor: [
      '827 test functions across 47 test files, in unit, integration and sanity tiers. Re-running the unit tier on Python 3.11 gives 496 passed, 3 skipped and 5 failed; all 5 failures are in the workflow-tool tests and come from a "no current event loop" error in the test setup, not from agent behaviour.',
      'A dedicated cleanup pass replaced all 43 silent except/pass blocks with proper logging, and a test-suite repair brought 251 stale failing tests back to green, both tracked as GitHub issues and merged through pull requests.',
      'Formatting and linting with black and ruff, type-checking with mypy, and Google-style docstrings across the service layer, plus a dead-code analysis report checked into the repo.',
      'A tag-triggered GitHub Actions release workflow runs the tests, builds standalone PyInstaller executables for Linux, macOS (Intel and Apple Silicon) and Windows, smoke-tests each binary with --version, builds and twine-checks the wheel, and publishes to a GitHub Release, PyPI and GHCR. No version tag has been pushed yet, so this pipeline is ready but hasn\'t shipped a release.',
      'Configuration is data, not code: tool definitions, prompts and task-classification patterns live in YAML under config/, so behaviour can be tuned without touching the agent.',
    ],
    harnessLayer: { order: 1, label: 'Agent runtime', question: 'Who does the work?', role: 'Plans each task, makes the changes, checks its own work, and keeps running when a model provider fails.' },
    architecture: [
      'HcodeAgent sits at the centre and coordinates three things: an LLM provider, a tool executor and the workflow state. A phase manager hands each task to a handler (init, planning, execution, verification, or fast) behind shared protocols, so the phases are swappable and each one can be tested on its own. A task classifier driven by YAML patterns decides whether a request is trivial, read-only or an action task, and a structured reasoning module shapes how the model thinks through it.',
      'Below the agent, the provider layer exposes Anthropic and OpenAI through one interface. ResilientProvider keeps a circuit breaker and stats per provider, retries transient failures with backoff, and hot-swaps to the healthy provider when one opens, with callbacks so the UI can show the failover. The tool layer is grouped into files, terminal, git, web, notebook, todo and analysis, plus MCP tools bridged in from external servers.',
      'The execution layer guards the run: a state machine tracks the loop, a loop detector and loop controller stop runaway iterations, a circuit breaker isolates misbehaving tools, and the context budget manager counts tokens with tiktoken and trims output to stay inside the model\'s window. Around all of it, the SafetyGuard wraps each task in a transaction logged on disk and rolls it back on failure, and the memory manager merges file, session and semantic memory into the prompt.',
      'The same agent runs behind three surfaces: a Rich/prompt-toolkit terminal with autocomplete and slash commands, a Tauri desktop app whose Rust side supervises an HCode daemon and streams events to a React front end, and a VS Code extension that talks to the agent through a bridge and renders a webview sidebar.',
    ],
  },
  {
    slug: 'anvil',
    source: { label: 'Internal KPIT system · code not public' },
    name: 'Anvil',
    tagline: "The know-how layer of the company's AI harness: one package that gives every engineer the same 170 skills, 163 agents, 40 rules and 62 commands, in whichever of four AI coding hosts they use, wired into the tools the company actually runs.",
    summary: "Anvil is the middle layer of the AI harness: the shared skills and agents that every engineer's assistant works from. Instead of every team prompting a general-purpose assistant from scratch, Anvil ships a shared, versioned layer of company knowledge and workflow: 170 skills, 163 agents, 40 rules and 62 slash commands, covering code review, CI failure diagnosis, requirements traceability, test analysis, MISRA/ISO 26262/ASPICE compliance and automotive diagnostics. One canonical registry installs that layer into Claude Code, OpenCode, Beacon and GitHub Copilot, so a developer on any of the four hosts gets the same capabilities and the same guardrails. Through MCP servers, the agents read live evidence from GitLab, GitHub, Jenkins, Zuul, Jira, Confluence, Nexus, Artifactory, TestGuide, TRACE32, Grafana and Elastic, plus DLT traces, CAN logs and ARXML/A2L/ODX files, instead of guessing. Every push runs a three-stage GitLab CI pipeline (structural verification of every skill and agent, a 19-suite Node.js/Python test battery, tag-gated npm publishing), and the whole toolkit has zero npm runtime or dev dependencies.",
    role: "I'm the sole developer: every commit in the repo's history is mine. It was built at KPIT, lives on KPIT's internal GitLab, and grew from internal tooling into the shared AI layer described here. I designed and own the CLI, the host adapters, the CI/CD pipeline, the guardrail model and the component registry end to end, and I wrote the large majority of the 170 skills and 163 agents. 21 skills come from external skill packs; LICENSE-THIRD-PARTY.md tracks each one by exact origin commit and license status rather than passing them off as original work.",
    ownership: 'AI Harness · Layer 2 · solo author at KPIT',
    stack: [
      'Node.js 18+ (ESM-only, zero runtime/dev dependencies)',
      'Python 3.11 (stdlib-only shared libraries)',
      'Model Context Protocol (MCP): 29 servers, 639 live tools',
      '4 host adapters: Claude Code, OpenCode, Beacon, GitHub Copilot',
      'GitLab CI/CD (3-stage validate → test → publish pipeline)',
      'Claude Code plugin manifest format (.claude-plugin/)',
      'PreToolUse hooks + risk-tiered tool exposure (AI_TOOLS_MAX_RISK)',
      'Node.js built-in test runner (node --test) + Python unittest',
      'GitLab self-hosted npm Package Registry',
    ],
    stats: [
      { value: '435', label: 'skills, agents, rules & commands' },
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
      { headline: '435 components, one source of truth', body: '170 skills, 163 agents, 40 rules and 62 slash commands live in a single host-agnostic registry and are translated into each host\'s own format at install time by dedicated adapter modules (claude-code, opencode, beacon, copilot).' },
      { headline: 'Two orchestrators that route to the right specialist', body: 'sw-developer routes work to 15 language-specific orchestrators behind a bounded 2-iteration self-healing test loop. The read-only sw-reviewer fans a change out to up to 38 specialist review agents in parallel. Both are documented in full ADRs (Context / Decision / Alternatives Considered / Consequences).' },
      { headline: 'Every agent held to the same bar', body: 'scripts/verify.mjs structurally validates every skill and agent\'s frontmatter, requires an explicit "Autonomy level" and "## Hard limits" section on every agent, and checks that every MCP tool reference resolves to a declared server. An agent without written limits doesn\'t ship.' },
      { headline: 'Guardrails enforced where the host allows it, and gaps stated where it doesn\'t', body: "On Claude Code a PreToolUse hook blocks unregistered spawns; on OpenCode the same rule is compiled into its native permission.task map. Beacon and Copilot have no enforcement surface, and each adapter's header comments say so plainly instead of implying coverage that isn't there." },
      { headline: 'What you run locally is what gates CI', body: '19 Node.js test files plus a Python unittest suite run as the same command locally (npm test) and in CI, so there is no gap between what a developer checks and what blocks the pipeline.' },
      { headline: 'Upgrades and uninstalls you can trust', body: 'Every install writes a hash-verified receipt. Upgrades and uninstalls check the sha256 of each installed file against it, and --force backs up locally modified files before overwriting them. A release bump updates plugin.json and package.json atomically and rolls both back if the CHANGELOG write fails.' },
    ],
    engineeringRigor: [
      '3-stage GitLab CI pipeline (validate → test → publish) on every push: structural verification of all 333 skills and agents, documentation-drift checks and the full 19-file test suite must pass before anything ships.',
      'Publishing only fires on a git tag: the publish_package job triggers off $CI_COMMIT_TAG, re-checks that plugin.json, package.json and the tag agree, and authenticates to the self-hosted npm registry with the project-scoped CI_JOB_TOKEN, so no long-lived secret sits in CI variables.',
      'plugin.json and package.json disagreeing is a hard build failure: the version_consistency CI job catches it, and scripts/release.mjs enforces the same rule on every local bump.',
      "check-docs.mjs fails the build the moment README or docs component counts drift from the real registry. The commit history shows this was once caught and fixed by hand, which is why it's automated now.",
      'Real tagged releases (v2.13.0, v2.20.2, v2.21.6, current 2.22.0) show the pipeline has shipped actual versions to the company registry, not just sat in the YAML.',
      'A manual backfill publish path (scripts/publish-to-gitlab-registry.sh/.bat) extracts the exact tagged commit into a throwaway temp directory, supports --dry-run, and never touches the working branch.',
      'Third-party provenance is tracked in the open: LICENSE-THIRD-PARTY.md audits all 21 imported skills by exact origin commit and flags any missing an upstream license rather than quietly shipping them.',
    ],
    harnessLayer: { order: 2, label: 'Skills & agents', question: 'What does it know?', role: '170 skills, 163 agents, 40 rules and 62 commands carrying the company\'s workflows and standards, installed from one registry into four AI coding hosts.' },
    architecture: [
      "Anvil has three layers. At the top are the AI coding hosts engineers already use: Claude Code, OpenCode, Beacon and GitHub Copilot. In the middle is the harness itself: one canonical registry (.claude-plugin/components.json) describing 170 skills, 163 agents, 40 rules and 62 commands in a host-agnostic format, translated into each host's schema at install time by four adapter modules (adapters/claude-code.adapter.mjs, opencode.adapter.mjs, beacon.adapter.mjs, copilot.adapter.mjs). At the bottom are the company's own systems, reached through MCP servers from the ai-tools-library: 29 servers exposing 639 tools across source control, CI, artifacts, ALM, test execution, debug, observability and automotive file formats.",
      'The CLI (scripts/cli.mjs / scripts/install.mjs) resolves transitive requires-skills/requires-agents closures for selective, profile-based or full installs, and writes a hash-verified receipt so upgrades and uninstalls are mechanical rather than guesswork. That is what makes it practical to roll the harness out team by team instead of all at once.',
      "Two write-capable orchestrators sit on top of the registry: sw-developer routes to 15 language-specific orchestrators behind a bounded 2-iteration self-healing test loop, and the read-only sw-reviewer fans out to up to 38 review agents. Both are constrained by a PreToolUse hook (hooks/validate-agent-spawn.mjs) that blocks any spawn target missing from the registry, plus a risk-tiered tool-exposure model (AI_TOOLS_MAX_RISK) that caps which live tools an agent can see before it runs. The same restriction is compiled into OpenCode's permission.task allow/deny map; the Beacon and Copilot adapters state in their headers that those hosts have no enforcement surface.",
      'The toolkit runs on plain Node.js 18+ ESM and the Python 3.11 standard library, with no npm runtime or dev dependencies. Structural correctness is a CI-gated artifact: scripts/verify.mjs checks frontmatter, the Autonomy-level/Hard-limits sections and MCP reference resolution, and scripts/check-docs.mjs catches docs drift against the registry before it ships.',
    ],
    harness,
  },
  {
    slug: 'ai-tools-library',
    source: { label: 'Internal KPIT system · code not public' },
    name: 'ai-tools-library',
    tagline: '29 production MCP servers, 639 tools, built at KPIT and shipped through a 7-stage CI pipeline with tag-gated, dual-target publishing.',
    summary: "ai-tools-library is the tool layer of the AI harness, the part that lets agents reach real company systems. It is a monorepo of 29 independently installable MCP server packages — 639 tools spanning developer tooling, enterprise collaboration, observability, and automotive/embedded diagnostics — built on two shared foundation packages so every integration gets tool discovery, risk gating, retries, and a working MCP server with minimal added code. A 7-stage GitLab CI pipeline enforces lint, type, security, and per-package coverage gates before anything builds, and every release is tag-verified and published to both an external package index and a private package registry. Production concerns get the same engineering attention as the tools themselves: health/readiness endpoints, a gated compliance audit trail, risk-aware circuit breakers, and a real Docker Compose + Caddy deployment topology with per-service bearer tokens and rate limiting.",
    role: 'Built at KPIT, where I designed and own the system end to end — architecture, the CI/CD pipeline, and the deployment topology — with a teammate contributing to a handful of the integration packages.',
    ownership: 'AI Harness · Layer 3 · built at KPIT',
    stack: [
      'Python 3.11 / 3.12',
      'uv (astral-sh) monorepo workspace — single lockfile across 31 packages',
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
      { value: '639', label: 'tools' },
      { value: '29', label: 'MCP servers' },
      { value: '7', label: 'CI stages' },
    ],
    valueProps: [
      { headline: 'Install only what you need', body: 'Ships as a real, independently versioned product rather than one big bundle: 29 server packages published to both an external package index and a private package registry, so a team installs exactly the integrations it needs.' },
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
    harnessLayer: { order: 3, label: 'Tools & integrations', question: 'What can it reach?', role: '639 MCP tools across 29 MCP servers, connecting agents to CI, ALM, artifact stores, observability and automotive diagnostics, with risk gating.' },
    architecture: [
      'The system is a uv-managed monorepo of 31 published packages sharing a single lockfile: two foundation packages — ai-tools-base (framework-agnostic ToolDescription/schema primitives) and ai-tools-core (the tool contract, discovery registry, and MCP-adapter/server framework in registry.py, mcp_adapter.py, mcp_server.py, contracts.py) — plus 29 independently installable integration packages built on top of them. They cover enterprise DevOps and collaboration tooling (GitHub, GitLab, Jenkins, JFrog, Nexus, Confluence, Jira, Office365, Elastic, Kibana, Grafana, Zuul, among others), data access and desktop control (SQLite/PostgreSQL/MSSQL, governed Windows UI Automation), general log and packet analysis (plain-text/structured application logs, tshark packet captures), and automotive and embedded diagnostics (A2L calibration data, AUTOSAR ARXML, CAN/DBC, DLT, MDF4 measurement files, ODX/PDX, UDS-over-DoIP, TestGuide execution logs, and Lauterbach TRACE32 debugger control).',
      "A central registry auto-discovers every installed package's tools at runtime, isolates per-package discovery failures so one broken integration can't take down the other twenty-eight, and automatically disambiguates tool-name collisions — github and gitlab both define create_issue — by renaming to <package>_<tool>. Two chokepoints turned out to be the right leverage point for cross-cutting production features: mcp_adapter.py's call_tool and mcp_server.py's server construction. Risk-aware retry with per-integration circuit breakers, an opt-in compliance audit trail with credential redaction, centralized result-size limiting and pagination, and a bounded TTL response cache all land across every server through those two files, with zero changes to per-package code.",
      'Transport switches between stdio, for desktop MCP clients, and Streamable HTTP — a Starlette-based server exposing /healthz, /readyz, and an optional OpenTelemetry-backed /metrics. Configuration resolves through a three-tier precedence (env var, then config file, then default), which lets a fleet of deployed servers share one config file instead of duplicating settings per instance.',
      'In production this aggregate runs as Docker Compose services behind a custom xcaddy-built Caddy 2 reverse proxy — the caddy-ratelimit plugin plus a global HTTP concurrency cap — generated from a single SERVERS table via deploy/generate.py. Each service sits behind its own randomly generated bearer token and is gated by risk level (LOW/MEDIUM/HIGH) plus a double opt-in flag for the capabilities that are genuinely dangerous, like desktop control or live ECU writes.',
    ],
  },
  {
    slug: 'opencode-autodev',
    source: { label: 'Private repository · code not public' },
    name: 'opencode-autodev',
    tagline: 'An autonomous delivery team: it collects tickets and issues on its own, picks the right specialist agent for each one from the agents you configure (Anvil\'s or your own), lets that agent and a reviewer agent work it out with you in a shared squad channel, then waits for a human to approve the pull request before anything merges.',
    summary: "opencode-autodev turns a backlog into merged changes without anyone assigning the work. It watches GitLab, GitHub, Jira and Microsoft To Do, picks up eligible tickets and issues on a schedule, and claims each one with a SQLite lease so no two runs ever work the same ticket. For each ticket it picks a specialist developer agent from the agents configured in OpenCode (Anvil's or a team's own), first through a routing table and then through an LLM classifier limited to those agents, and runs it in an isolated git worktree. Many tickets progress in parallel. The developer agent, a reviewer agent and the human operator share a per-ticket squad channel where they @-mention each other and ask questions mid-run, coordinated by a deterministic facilitator with hard budgets. The plugin then opens the merge request and stops until a human approves it: auto-merge is off by default, and config validation refuses to turn it on without at least one required human approval and passing checks. A fail-closed four-way gate blocks anything with a missing signal, a bounded-state invariant guarantees no ticket sits in any state forever, and every log line and notification is scrubbed of secrets. 740 tests pass with 96% line coverage behind an enforced 85% floor, across a hardened prerelease line now at 0.1.0-dev.17.",
    role: "I designed, built, and hardened this alone — every commit in the repo's history is mine. It was built at KPIT as an internal tool and publishes to the company's GitLab package registry, so I'm the sole engineer on it but not the sole stakeholder in what it publishes to.",
    ownership: 'Solo-built at KPIT',
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
    squadReplay: true,
    flowHeading: { label: 'How a ticket moves', title: 'From backlog to merged change: agents do the work, a human approves it' },
    flow: [
      { title: 'Collect', body: 'New tickets and issues are picked up from GitLab, GitHub, Jira or Microsoft To Do, and each one is claimed with a lease.' },
      { title: 'Assemble', body: 'A specialist developer agent is picked for the ticket from the configured agents (Anvil\'s or a team\'s own) and paired with a reviewer agent.' },
      { title: 'Collaborate', body: 'Developer, reviewer and you share a squad channel: they @-mention each other, ask questions mid-run and hand findings back until the change is ready.' },
      { title: 'Approve', body: 'A merge request opens and waits for a human to review and approve it. Pipeline and security jobs must also be green.' },
      { title: 'Ship', body: 'Only after approval does the change merge, and the team is notified on Slack, Teams or a webhook, with every field scrubbed of secrets.' },
    ],
    stats: [
      { value: '4', label: 'ticket & code sources, collected automatically' },
      { value: '4-way', label: 'fail-closed merge gate' },
      { value: '740', label: 'tests, 96% line coverage' },
    ],
    valueProps: [
      { headline: 'The backlog feeds itself', body: 'Nobody assigns work. opencode-autodev watches GitLab, GitHub, Jira and Microsoft To Do, collects new tickets and issues as they appear, and claims each one with a lease so every ticket is worked exactly once, even with several runs going at the same time.' },
      { headline: 'The right specialist for every ticket', body: "The agents are configuration, not code. Autodev picks the developer agent for each ticket from whatever is configured in OpenCode, including Anvil's specialist agents: a deterministic routing table first, then an LLM classifier that may only answer with a configured agent's name, then a default. The choice is cached on the ticket, so rework goes back to the same specialist." },
      { headline: 'A squad that talks, not a script that runs', body: "The developer and reviewer agents don't just hand off at the end. They share a per-ticket channel with the human operator, post updates, @-mention each other and ask blocking questions mid-run with team_ask. A deterministic facilitator wakes whoever is addressed and holds the conversation inside hard limits: 120 messages per ticket, 4 wake-ups per member, redacted and size-capped messages. Larger squads staffed by a Scrum Master agent are designed next (ADR-015)." },
      { headline: 'Agents do the work, a human decides what ships', body: 'When the squad is done, the plugin opens the pull request and waits. Nothing merges until a person has reviewed and approved it. The four-way merge gate then checks reviewer verdict, approvals, pipeline status and required security jobs, and any missing signal blocks the merge. Nothing defaults to pass, and the approval is never skipped.' },
      { headline: 'It can never get stuck quietly', body: 'A bounded-state invariant puts a wall-clock ceiling on every non-terminal state, and a test enumerates every state to enforce it. "Works until it\'s done" never turns into "works forever": a ticket that stops making progress is surfaced instead of silently hanging.' },
      { headline: 'Every message leaves the process clean', body: "A three-pass redaction pipeline scrubs every log line, error and outbound Slack, Teams or webhook field of configured secrets, known vendor token shapes and generic key=value credentials, so an agent conversation or a notification can't leak a token." },
    ],
    highlights: [
      { headline: 'From ticket to approved merge in one loop', body: 'Intake, squad work, merge request, CI polling, waiting for human approval, merge and notification run as one loop. Each ticket moves through CLAIMED → IMPLEMENTING → VERIFYING → MR_OPEN → REVIEWING → IN_REVIEW → MERGED → DONE, driven by an I/O-free state machine that is tested on its own.' },
      { headline: '740 tests, four vendors, one contract', body: '740 tests across 48 files, about 16,200 lines of test code against 13,600 lines of source, all passing with 96.5% line coverage. They include a shared Tracker/Forge contract suite that every one of the four vendor adapters has to pass, and a dedicated suite for the squad channel.' },
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
      "The prerelease sequence isn't cosmetic version-bumping: dev.1 through dev.6 each shipped a root-caused fix for a specific production hang, and the line has kept hardening through 0.1.0-dev.17, with multi-source intake and the squad channel added along the way.",
    ],
    architecture: [
      'opencode-autodev is a TypeScript/Bun OpenCode plugin built around an I/O-free state machine (src/dispatch.ts) that drives each task through CLAIMED → IMPLEMENTING → VERIFYING → MR_OPEN → REVIEWING → IN_REVIEW → MERGED → DONE. State lives in a bun:sqlite task store — WAL mode, file permissions forced to 0600, leases acquired through a real BEGIN IMMEDIATE compare-and-set transaction, and a versioned v1 → v6 migration ladder underneath it.',
      "Work arrives on its own: tracker adapters poll the configured sources on a daily discovery job and a five-minute sweep, and each new ticket is claimed through the lease before anything else happens. Agent selection (src/agentSelect.ts) resolves a specialist from the configured OpenCode agents and caches it on the task. With the squad enabled, the developer, the reviewer and the human share a channel stored in SQLite (src/squadChannel.ts); agents talk through team_post, team_ask and team_inbox, and the facilitator (src/facilitator.ts), plain code with no LLM, admits every wake-up through a single compare-and-set so budgets hold across processes and no live run is ever double-prompted.",
      "Where work comes from and where it gets merged are deliberately two different interfaces (ADR-007): GitLab and GitHub implement both Tracker and Forge, while Jira and Microsoft To Do implement Tracker only. The TypeScript compiler itself blocks a tracker-only source from being asked to gate, report on, or merge a change, and all four adapters run through the same contract-test suite (test/contract/tracker.ts, forge.ts) so no vendor's behavior can quietly drift from the spec.",
      "A load-time capability probe (ADR-005, src/caps.ts) resolves the real OpenCode SDK surface once at startup and wraps every call except session.prompt and app.log in a tested fallback chain. A shared withTimeout helper then bounds every one of those plugin-to-SDK calls, including app.log itself, after three separate production hangs made it clear that an unbounded call to anything is a hang waiting to happen.",
      "A shared HTTP retry core (src/net/http.ts) parses Retry-After in both integer-seconds and HTTP-date form and clamps it to a 1–30s window sized to stay inside a task's lease, while also telling a terminal credential failure apart from a merely-missing environment variable. On top of that sits the safety envelope: a four-way fail-closed merge gate (src/gates.ts), the ADR-011 bounded-non-terminal-state invariant enforced by the test that enumerates every TaskState, and a three-pass secret redactor that strips configured env values, known vendor token shapes, and generic key=value secrets from every log line, error, and outbound Teams/Slack/webhook field before it leaves the process.",
    ],
  },
  {
    slug: 'testcase-generation-agents',
    source: { label: 'Private repository · code not public' },
    name: 'Automotive Test Case Generation Agents',
    tagline: 'AI agents that read automotive specifications and write the test cases for them: grounded in the specs through RAG and a knowledge graph, equipped with MCP tools, and fanned out across parallel GitLab CI workers so a whole specification is covered in one pipeline run.',
    summary: "Writing test cases from automotive specifications is slow, repetitive expert work: every requirement has to be read, its signals, conditions and dependencies understood, and a traceable test case written for it. This project turns that into a pipeline of AI agents. Specifications are ingested and indexed twice: as embeddings for retrieval-augmented generation (RAG), so an agent always works from the actual requirement text, and as a knowledge graph that links requirements to the functions, signals, interfaces and other requirements they depend on, so an agent sees the context around a requirement and not just the paragraph itself. Generation agents then use tools, exposed through MCP servers, to look up what they need while they write: related requirements, signal and interface definitions, and existing test cases. The work is split into independent batches and run as parallel GitLab CI jobs, so the whole specification is processed at once instead of one requirement at a time, and the results are merged back into a single test suite where every test case traces to the requirement it verifies.",
    role: 'I designed and built the generation pipeline: specification ingestion, the RAG index and knowledge graph, the agents and their MCP tools, and the parallel GitLab CI orchestration.',
    ownership: 'Automotive AI agents',
    stack: [
      'Python',
      'LLM agents with tool / function calling',
      'RAG: embeddings + vector retrieval over specifications',
      'Knowledge graph of requirements, signals and dependencies',
      'Model Context Protocol (MCP) servers as the agents\' tools',
      'GitLab CI parallel jobs as generation workers',
    ],
    flowHeading: { label: 'How a specification becomes a test suite', title: 'From requirement text to traceable test cases, in one parallel pipeline run' },
    flow: [
      { title: 'Ingest', body: 'Specifications are parsed and split into individual requirements, keeping their IDs so every generated test can trace back.' },
      { title: 'Ground', body: 'Each requirement is embedded for RAG and linked into a knowledge graph of the signals, functions and requirements it depends on.' },
      { title: 'Fan out', body: 'The requirements are split into batches and handed to parallel GitLab CI jobs, each running its own generation agents.' },
      { title: 'Generate', body: 'Agents write test cases from the retrieved text and graph context, calling MCP tools to look up definitions and existing tests.' },
      { title: 'Assemble', body: 'The CI jobs\' results are collected into one test suite, with every test case linked to the requirement it verifies.' },
    ],
    stats: [
      { value: 'RAG + KG', label: 'grounded in the real specification' },
      { value: 'MCP', label: 'tools the agents call while writing' },
      { value: 'Parallel', label: 'GitLab CI generation workers' },
    ],
    valueProps: [
      { headline: 'From specification to test cases, automatically', body: 'The slowest part of automotive validation is turning a specification into test cases by hand. The agents do the first draft for the whole specification, so test engineers review and refine instead of writing every case from a blank page.' },
      { headline: 'Grounded in the spec, not in the model\'s memory', body: 'Every test case is written from retrieved requirement text, never from what the model thinks a requirement probably says. That keeps expected values, conditions and wording tied to the actual specification.' },
      { headline: 'Context a single paragraph can\'t give', body: 'Requirements rarely stand alone. The knowledge graph gives an agent the neighbourhood of a requirement: the signals it reads, the functions it belongs to and the requirements it depends on, so the generated test covers the conditions that actually matter.' },
      { headline: 'Agents that look things up', body: 'Through MCP servers the agents can query what a test writer would check: related requirements, signal and interface definitions, and existing tests. The same MCP tool approach used across the company\'s AI harness.' },
      { headline: 'A whole specification in one pipeline run', body: 'Generation is fanned out over parallel GitLab CI jobs, so throughput scales with the number of workers instead of the size of the specification, on the CI infrastructure the team already runs.' },
      { headline: 'Traceable by construction', body: 'Requirement IDs travel with each batch from ingestion to output, so every test case links back to the requirement it verifies. That is what reviewers, coverage reports and automotive process audits ask for.' },
    ],
    highlights: [
      { headline: 'Two kinds of retrieval, used together', body: 'Vector search finds the requirement text that is semantically closest; the knowledge graph adds what is structurally connected to it. Together they give an agent both the words of a requirement and its context.' },
      { headline: 'CI as the worker pool', body: 'Instead of a separate job scheduler, the generation workers are GitLab CI parallel jobs: each takes its own batch of requirements, runs its agents independently, and hands back its results as pipeline artifacts.' },
      { headline: 'Tools, not guesses', body: 'When an agent needs a signal definition or wants to know whether a test already exists, it calls an MCP tool instead of inventing an answer.' },
      { headline: 'Built for the automotive domain', body: 'Specifications, signals and requirement traceability are first-class concepts in the pipeline, not generic document chunks.' },
    ],
    engineeringRigor: [
      'Generation runs inside GitLab CI, so every run is reproducible, logged and tied to a pipeline, with the specification version and the generated suite kept together.',
      'Work is split into independent batches so parallel jobs never depend on each other; a failed worker can be retried on its own without regenerating the rest of the specification.',
      'Requirement IDs are carried through every stage, from ingestion to the assembled suite, so traceability does not depend on the model remembering it.',
      'Agents reach external data only through MCP tools, which keeps what they can see and do explicit and reviewable.',
    ],
    architecture: [
      'The pipeline has three stages. Ingestion parses the specifications into individual requirements and builds two indexes over them: an embedding index for retrieval-augmented generation, and a knowledge graph that connects each requirement to the signals, functions, interfaces and other requirements it references.',
      'Generation runs as parallel GitLab CI jobs. Each job receives a batch of requirements, and for each one an agent retrieves the requirement text and its graph neighbourhood, calls MCP tools for anything else it needs (related requirements, signal and interface definitions, existing test cases), and writes structured test cases with the requirement ID attached.',
      'A final stage collects the jobs\' artifacts and assembles them into a single test suite, where every test case traces to the requirement it verifies, ready for engineers to review.',
    ],
  },
  {
    slug: 'mtf-assistant',
    source: { label: 'Internal KPIT system · code not public' },
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
