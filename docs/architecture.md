# Architecture

OpenQED is a SvelteKit application that serves as a frontend for the [HAL-Institute/OpenQED-Data](https://github.com/HAL-Institute/OpenQED-Data) Lean 4 Lake project. It provides an accessible interface for browsing, proving, and decomposing open mathematical problems.

## Stack

| Layer | Technology |
|---|---|
| Framework | SvelteKit 2 with Svelte 5 (runes mode) |
| Runtime | Bun (dev), Node.js (SSR via Vite) |
| Styling | Tailwind CSS 4 |
| Database | SQLite via better-sqlite3 |
| Auth | GitHub OAuth 2.0 |
| Graph | D3-force |
| Math | KaTeX |
| Markdown | marked + highlight.js |
| Search | Fuse.js |
| GitHub API | Octokit |

## Directory structure

```
src/
├── app.css                    # Global theme (CSS variables, light/dark)
├── app.d.ts                   # Global TypeScript declarations
├── app.html                   # HTML shell with dark mode init
├── hooks.server.ts            # Auth middleware (session → locals)
├── data/
│   └── problems.json          # Problem data (generated)
├── lib/
│   ├── components/            # Svelte components
│   │   ├── ActionButtons      # Close / Reduce / Sign in
│   │   ├── ForceGraph         # D3 force-directed DAG
│   │   ├── Header             # Top nav with auth state
│   │   ├── LeanDropdown       # Collapsible Lean code with copy
│   │   ├── Markdown           # KaTeX + highlight.js renderer
│   │   ├── ProblemCard        # Problem list item
│   │   ├── ProblemList        # Problem list container
│   │   ├── SearchBar          # Search + category/difficulty filters
│   │   ├── SubmitModal        # Proof/reduction submission dialog
│   │   └── ThemeToggle        # Light/dark switch
│   ├── server/
│   │   ├── auth.ts            # User & session management
│   │   ├── db.ts              # SQLite init + schema
│   │   ├── github-bot.ts      # Merge proofs, open reduction PRs
│   │   └── lean.ts            # Lean 4 compilation & sorry analysis
│   ├── stores/
│   │   └── theme.ts           # Dark/light mode persistence
│   └── utils/
│       ├── data.ts            # Problem data access
│       ├── graph.ts           # D3 simulation setup
│       ├── lean-highlight.ts  # Lean 4 highlight.js grammar
│       ├── search.ts          # Fuse.js search index
│       └── types.ts           # TypeScript interfaces
└── routes/
    ├── +layout.svelte         # Root layout (header, fonts)
    ├── +layout.server.ts      # Pass session to all pages
    ├── +page.svelte           # Landing: search + problem list
    ├── docs/+page.svelte      # Documentation
    ├── login/+page.svelte     # Auth method selection
    ├── profile/               # User profile + verification
    ├── leaderboard/           # Ranked contributors
    ├── problem/[id]/          # Problem detail (split pane)
    └── api/
        ├── submit/            # POST: proof/reduction submission
        └── auth/              # GitHub OAuth flow
```

## Data flow

### Problem browsing

1. `problems.json` is loaded at build time by `data.ts`.
2. The landing page creates a Fuse.js index and filters results client-side.
3. Problem detail pages load a single problem by ID via `+page.ts`.

### Authentication

1. User clicks "Sign in" → navigates to `/login`.
2. `/login` shows "Continue with GitHub" → redirects to `/api/auth/github`.
3. GitHub OAuth redirect sets a CSRF `state` cookie, redirects to GitHub.
4. GitHub calls back to `/api/auth/callback` with a code.
5. Server exchanges code for token, fetches GitHub profile, upserts user in SQLite.
6. Session ID is stored in an httpOnly cookie; user data is set on `event.locals`.
7. `+layout.server.ts` passes the serialized user to all pages via `PageData`.

### Submission

1. Authenticated user clicks "Close" or "Reduce" on a problem.
2. `SubmitModal` posts Lean code to `/api/submit`.
3. Server compiles the file, counts `sorry` occurrences:
   - **Close (proof)**: must compile with 0 sorry → bot merges into data repo.
   - **Reduce**: must compile with exactly 1 sorry → bot opens PR for review.
4. User stats are incremented in SQLite.

## Database schema

```sql
CREATE TABLE users (
    id                  TEXT PRIMARY KEY,
    github_id           INTEGER UNIQUE NOT NULL,
    username            TEXT NOT NULL,
    display_name        TEXT NOT NULL,
    avatar_url          TEXT NOT NULL,
    verified            INTEGER NOT NULL DEFAULT 0,
    verification_method TEXT,
    created_at          TEXT NOT NULL DEFAULT (datetime('now')),
    contributions       INTEGER NOT NULL DEFAULT 0,
    proofs              INTEGER NOT NULL DEFAULT 0,
    reductions          INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE sessions (
    id         TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## Theme system

Colors are defined as CSS custom properties in `app.css` with a `@theme` block for light mode and a `.dark` override. The light mode uses warm cream tones (`#faf7f2` base), and dark mode uses neutral grays (`#141414` base). The design is fully monochromatic — no accent colors.

Fonts: IBM Plex Sans (body) and IBM Plex Mono (code), loaded from Google Fonts.
