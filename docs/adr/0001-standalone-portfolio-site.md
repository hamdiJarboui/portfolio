# ADR-0001: Standalone Astro portfolio site, separate from NextGen_Platform

**Date**: 2026-09-18
**Status**: accepted
**Deciders**: Hamdi Jarboui

## Context

Hamdi needed a personal portfolio showcasing his resume and four flagship projects (AgileForge, opencode-autodev, ai-tools-library, Anvil). The only existing Astro site in `D:\ai-plugins` is NextGen_Platform, whose stated purpose is "Registry and install guide for Anvil skills/agents and ai-tools MCP servers" — a toolkit-registry/docs site with its own audience and content model (content collections synced from the tool repos, install docs, rule packs). A personal-brand portfolio is a different product with a different audience, release cadence, and design language.

## Decision

Build the portfolio as a new, standalone Astro static site at `D:\ai-plugins\portfolio`, reusing Astro (NextGen_Platform's proven stack) for consistency and low risk, but with its own package, design system, and deploy target.

## Alternatives Considered

### Alternative 1: Add a `/portfolio` (or `/about`) route inside NextGen_Platform
- **Pros**: reuses existing layouts, deploy pipeline, and hosting; faster to ship.
- **Cons**: mixes a personal brand site into a repo whose `package.json` description and content-sync tooling are purpose-built for the toolkit registry; couples the portfolio's release cycle to the registry site's; NextGen_Platform's design system is built for docs/registry UI, not a personal case-study narrative.
- **Why not**: rejected by the user in favor of a clean separation of concerns — confirmed via direct question before implementation.

### Alternative 2: Different framework (e.g. Next.js) for the portfolio
- **Pros**: broader ecosystem for a highly interactive site.
- **Cons**: this portfolio is fully static content (no auth, no server data); Next.js would add build/runtime complexity with no functional benefit; Astro is already the team's proven, working stack.
- **Why not**: no requirement calls for React-style client interactivity beyond what Astro islands can provide if ever needed.

## Consequences

### Positive
- NextGen_Platform stays focused on its own registry purpose; no coupling between the two sites' content models or release cadence.
- The portfolio gets its own identity, domain, and design system tuned for a personal case-study narrative.
- Reusing Astro keeps the stack low-risk and familiar.

### Negative
- A second Node/Astro project to maintain (separate `package.json`, deploy target, dependency updates) instead of one.
- No shared component library between the two sites yet — some visual/token duplication is possible if both evolve independently.

### Risks
- **Drift between the two sites' visual language** — mitigated by treating NextGen_Platform's design tokens as a reference starting point, not a hard dependency.
- **Content going stale** (project details, resume facts) — mitigated by keeping all portfolio content in typed data files (`src/data/profile.ts`, `src/data/projects.ts`) sourced directly from the resume and the four projects' own READMEs, making future updates a single-file edit.
