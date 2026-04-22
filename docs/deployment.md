# Deployment

## Requirements

- [Bun](https://bun.sh) (runtime and package manager)
- [Lean 4](https://lean-lang.org) (for compiling submissions)
- A GitHub OAuth App
- A GitHub personal access token (for the bot)

## Environment variables

Copy `.env.example` to `.env` and fill in the values:

```
GITHUB_CLIENT_ID=...          # GitHub OAuth App client ID
GITHUB_CLIENT_SECRET=...      # GitHub OAuth App client secret
GITHUB_BOT_TOKEN=...          # PAT with repo scope for HAL-Institute/OpenQED-Data
OPENQED_DATA_OWNER=HAL-Institute
OPENQED_DATA_REPO=OpenQED-Data
```

### Creating a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers).
2. Click **New OAuth App**.
3. Set the callback URL to `http://localhost:4000/api/auth/callback` (development) or your production URL.
4. Copy the Client ID and generate a Client Secret.

### Creating the bot token

1. Go to [GitHub Personal Access Tokens](https://github.com/settings/tokens).
2. Create a fine-grained token with **Contents** (read/write) and **Pull requests** (read/write) permissions on the `HAL-Institute/OpenQED-Data` repository.

## Development

```bash
bun install
bun run dev
```

The dev server starts on `http://localhost:5173` (or the next available port).

## Type checking

```bash
bun run check
```

## Building

```bash
bun run build
bun run preview
```

The default adapter is `adapter-auto`. For specific deployment targets, install the appropriate SvelteKit adapter:

- **Node.js**: `@sveltejs/adapter-node`
- **Vercel**: `@sveltejs/adapter-vercel`
- **Cloudflare**: `@sveltejs/adapter-cloudflare`

Note: `better-sqlite3` requires a Node.js-compatible runtime. Serverless platforms that don't support native modules will need an alternative database.

## Database

SQLite is used for user and session storage. The database file is created automatically at `data/openqed.db` on first run. The `data/` directory is gitignored.

To reset the database, delete `data/openqed.db` and restart the server.

## Nix

A `flake.nix` is provided for reproducible development:

```bash
nix develop
```

This gives you a shell with `bun` available.
