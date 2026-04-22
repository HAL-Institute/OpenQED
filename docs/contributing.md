# Contributing

OpenQED accepts two kinds of contributions to open mathematical problems: **proofs** (closing a problem) and **reductions** (decomposing into sub-problems).

## Prerequisites

- A GitHub account.
- For proofs: just sign in.
- For reductions: your account must be verified (see [Verification](#verification)).

## Submitting a proof

A proof closes a problem by providing a complete Lean 4 formalization with no gaps.

1. Navigate to a problem and click **Close**.
2. Paste your Lean 4 code.
3. Click **Submit Proof**.

The server will:

1. Compile the file with Lean 4 (60-second timeout).
2. Verify the file contains **zero** `sorry` statements.
3. If valid, a bot merges the proof into the [OpenQED-Data](https://github.com/HAL-Institute/OpenQED-Data) repository.

## Submitting a reduction

A reduction decomposes a problem into a simpler sub-problem. This creates a new child node in the problem's DAG.

1. Navigate to a problem and click **Reduce**.
2. Paste your Lean 4 code.
3. Click **Submit Reduction**.

The server will:

1. Compile the file with Lean 4.
2. Verify the file contains **exactly one** `sorry` in an isolated result.
3. If valid, a bot opens a pull request on the data repository for maintainer review.

### Why exactly one sorry?

The single `sorry` marks the isolated sub-goal — the new problem that others can work on. If you have multiple goals, combine them into a conjunction and use a single `sorry` on the conjunction.

### Why does a reduction need review?

Unlike proofs (which are mechanically verifiable), reductions introduce new structure to the problem graph. A maintainer reviews whether the decomposition is mathematically meaningful and non-trivial.

## Validation rules

| Type | Sorry count | Requires verification | On success |
|---|---|---|---|
| Proof (close) | 0 | No (sign in only) | Auto-merged |
| Reduction | Exactly 1 | Yes | PR opened |

## Rate limiting

To prevent spam and protect the system, submissions are rate-limited to **5 per hour** per user. This applies to both proofs and reductions.

## Verification

Verification is required only for reductions. Three methods are available:

### ORCID

Link your ORCID account to verify your academic identity. *(Coming soon.)*

### University email

Verify with a `.edu` or institutional email address. *(Coming soon.)*

### Wait period

Accounts are automatically verified 30 days after creation. No action needed — the system checks on each login.

## Code requirements

- Maximum file size: 100 KB.
- The file must compile successfully with Lean 4.
- `sorry` statements inside comments or string literals are not counted.
- The Lean compiler must be available on the server (`lean` in PATH).
