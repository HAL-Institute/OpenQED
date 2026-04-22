<script lang="ts">
	import Markdown from '$lib/components/Markdown.svelte';

	const content = `
## What is OpenQED?

OpenQED is a collaborative platform for formalizing and solving open mathematical problems using [Lean 4](https://lean-lang.org). Problems are structured as a directed acyclic graph (DAG), where each node represents either the original problem or a sub-problem obtained through reduction.

The data backing this platform lives in the [HAL-Institute/OpenQED-Data](https://github.com/HAL-Institute/OpenQED-Data) repository — a Lean 4 Lake project that serves as the canonical repository for open problems and their formalizations. OpenQED is a frontend that makes this collaboration accessible to everyone.

## Problem structure

Each problem has:

- **Problem statement** — the formal mathematical claim, written in both natural language and Lean 4.
- **Overview** — context, history, and significance.
- **Preliminaries** — notation and background needed to understand the formalization.
- **Lean formalization** — the executable Lean 4 code defining the problem.
- **Sub-problems** — reductions that decompose the problem into smaller pieces.

## The DAG

The dependency graph on the right side of each problem page shows how problems relate to their sub-problems. The center node is the main problem; child nodes are reductions. Clicking a node highlights it and shows its details in the left panel.

When a reduction is accepted, a new child node appears in the DAG. When all children of a node are proved, the parent can be closed transitively.

## Contributing

### Closing a problem (submitting a proof)

To close a problem, submit a Lean 4 file that proves the claim. **Any signed-in user** can submit proofs — no verification required.

The server will:

1. **Compile** the file using Lean 4 (60-second timeout).
2. **Verify** that the file contains **zero** \`sorry\` statements.
3. On success, a bot **merges** the proof directly into the data repository.

### Reducing a problem

To reduce a problem into a sub-problem, submit a Lean 4 file that decomposes the claim. **Verification is required** to submit reductions.

The server will:

1. **Compile** the file using Lean 4.
2. **Verify** that the file contains **exactly one** \`sorry\` in an isolated result.
3. On success, a bot **opens a PR** on the data repository for maintainer review.

### Why the asymmetry?

Proofs are mechanically verifiable — if the Lean compiler accepts it with zero \`sorry\`, it is correct by construction. Reductions, on the other hand, introduce new structure to the problem graph. A maintainer reviews whether the decomposition is mathematically meaningful and non-trivial. Verification ensures that only established contributors can propose structural changes.

### Why exactly one sorry?

The single \`sorry\` marks the isolated sub-goal — the new problem that others can work on. If you need to submit multiple sub-goals, form their conjunction and use a single \`sorry\` on the conjunction. This keeps each reduction step clean and reviewable.

## Validation rules

| Submission type | Sorry count | Requires verification | On success |
|---|---|---|---|
| Proof (close) | 0 | No | Auto-merged |
| Reduction | Exactly 1 | Yes | PR for review |

## Rate limiting

To maintain quality and prevent abuse, submissions are rate-limited to **5 per hour** per user. This applies to both proofs and reductions.

## Verification

Verification is required only for reductions, not for proofs. Three methods are available, modeled after [OpenReview](https://openreview.net):

**ORCID** — Link your ORCID account to verify your academic identity. *(Coming soon.)*

**University email** — Verify with a \`.edu\` or institutional email address. *(Coming soon.)*

**Wait period** — Accounts are automatically verified 30 days after creation. No action required — the system checks on each login.

Visit your [profile](/profile) to see your verification status and available options.

## Code requirements

- Maximum file size: 100 KB.
- The file must compile successfully with Lean 4.
- \`sorry\` statements inside comments or string literals are not counted.
- The Lean 4 toolchain must be available on the server.

## Data repository

All problems, proofs, and reductions are stored in [HAL-Institute/OpenQED-Data](https://github.com/HAL-Institute/OpenQED-Data). Accepted proofs are committed to \`proofs/{problemId}/\` and accepted reductions to \`reductions/{problemId}/\`.

## Open source

OpenQED is open source. See the [GitHub repository](https://github.com/HAL-Institute/OpenQED) for the source code, architecture documentation, and deployment instructions.
`;
</script>

<svelte:head>
	<title>Documentation - OpenQED</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-6 py-12">
	<h1 class="text-xl font-semibold text-(--color-text) mb-8">Documentation</h1>
	<Markdown {content} />
</div>
