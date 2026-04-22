# OpenQED

A collaborative platform for formalizing and solving open mathematical problems using Lean 4.

OpenQED is the web frontend for [HAL-Institute/OpenQED-Data](https://github.com/HAL-Institute/OpenQED-Data), a Lean 4 Lake project that serves as the canonical repository for open problems and their formalizations. The platform lets anyone browse problems, submit machine-checked proofs, and decompose problems into smaller sub-goals — building a directed acyclic graph of mathematical progress.

## How it works

Each problem is a formal Lean 4 statement. Contributors interact with it in two ways:

**Close (proof)** — Submit a complete Lean 4 proof with zero `sorry`. The server compiles the file, verifies it, and a bot merges it directly into the data repository. Any signed-in user can submit proofs.

**Reduce** — Submit a Lean 4 file with exactly one `sorry` in an isolated result, decomposing the problem into a simpler sub-goal. The server verifies the file and a bot opens a pull request for maintainer review. Reductions require a verified account.

Proofs are mechanically verified; reductions are reviewed by maintainers to ensure mathematical substance.

## Features

- **Problem browser** with full-text search and category/difficulty filters
- **Split-pane problem view** with description on the left and an interactive dependency graph on the right
- **Lean 4 compilation** on the server with `sorry` analysis for submission validation
- **GitHub OAuth** authentication with automatic profile import
- **Tiered verification** — ORCID, university email, or a 30-day wait period (required only for reductions)
- **Contributor leaderboard** ranked by proofs and reductions
- **Rate limiting** (5 submissions/hour) to prevent spam
- **Dark/light mode** with warm cream light theme and neutral dark theme
- **Lean 4 syntax highlighting** with a custom highlight.js grammar
- **KaTeX** rendering for mathematical notation in problem descriptions

## Getting started

### Prerequisites

- [Bun](https://bun.sh)
- [Lean 4](https://lean-lang.org) (for compiling submissions)

### Setup

```bash
git clone https://github.com/HAL-Institute/OpenQED.git
cd OpenQED
bun install
cp .env.example .env
# Fill in your GitHub OAuth credentials in .env
bun run dev
```

### Environment variables

| Variable | Description |
|---|---|
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret |
| `GITHUB_BOT_TOKEN` | GitHub PAT with repo scope on the data repository |
| `OPENQED_DATA_OWNER` | Data repo owner (default: `HAL-Institute`) |
| `OPENQED_DATA_REPO` | Data repo name (default: `OpenQED-Data`) |

See [docs/deployment.md](docs/deployment.md) for full setup instructions including GitHub App creation.

## Project structure

```
src/
├── routes/
│   ├── +page.svelte              # Landing page (search + problem list)
│   ├── problem/[id]/             # Problem detail (split pane + DAG)
│   ├── docs/                     # Platform documentation
│   ├── login/                    # GitHub auth
│   ├── profile/                  # User profile + verification
│   ├── leaderboard/              # Ranked contributors
│   └── api/
│       ├── submit/               # Lean compilation + submission
│       └── auth/                 # OAuth flow (github, callback, logout)
├── lib/
│   ├── components/               # Svelte components
│   ├── server/                   # Auth, DB, Lean checker, GitHub bot
│   └── utils/                    # Types, search, graph, data access
└── data/
    └── problems.json             # Problem definitions
```

## Documentation

- [Architecture](docs/architecture.md) — stack, data flow, database schema, theme system
- [Contributing](docs/contributing.md) — how to submit proofs and reductions, validation rules, verification
- [Data model](docs/data-model.md) — problem structure, sub-problems, the DAG, data repository layout
- [Deployment](docs/deployment.md) — environment setup, building, database, Nix

## Tech stack

SvelteKit 2 + Svelte 5 (runes) / Tailwind CSS 4 / SQLite (better-sqlite3) / D3-force / KaTeX / Fuse.js / Octokit / Bun

## License

See [LICENSE](LICENSE) for details.
