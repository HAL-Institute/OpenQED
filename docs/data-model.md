# Data model

## Problems

Problems are stored in `src/data/problems.json` and loaded at build time. Each problem has the following structure:

```typescript
interface Problem {
    id: string                  // URL-safe identifier (e.g. "riemann-hypothesis")
    title: string               // Human-readable title
    shortDescription: string    // One-line summary
    category: ProblemCategory   // Mathematical domain
    tags: string[]              // Searchable tags
    difficulty: Difficulty       // Estimated difficulty level
    status: 'open' | 'closed'  // Resolution status
    subProblemCount: number     // Number of sub-problems
    overview: string            // Markdown: context and significance
    preliminaries: string       // Markdown: notation and background
    problemStatement: string    // Markdown: the formal claim
    leanFormalization: string   // Lean 4 source code
    references: Reference[]     // Academic citations
    subProblems: SubProblem[]   // Reductions
}
```

### Categories

`number-theory` | `analysis` | `algebra` | `combinatorics` | `geometry` | `topology` | `logic` | `probability` | `mathematical-physics`

### Difficulty levels

`undergraduate` | `graduate` | `research` | `millennium`

## Sub-problems

Each sub-problem represents a reduction — a decomposition of the parent problem into a simpler claim.

```typescript
interface SubProblem {
    id: string              // Unique identifier
    name: string            // Short name
    reduction: string       // Markdown: how the reduction works
    reducedProblem: string  // Markdown: the new claim to prove
    leanFormalization: string
    parentId: string        // ID of the parent problem
}
```

## The DAG

Problems and their sub-problems form a directed acyclic graph. The root node is the original problem. Each edge represents a reduction (the parent is provable if the child is provable). The graph is rendered with D3-force on the problem detail page.

When a user submits a valid reduction, a new child node is added to the DAG (after maintainer review). When a user submits a valid proof for a leaf node, that node is marked as closed, and if all children of a parent are closed, the parent can be closed transitively.

## Data repository

The canonical source of truth is [HAL-Institute/OpenQED-Data](https://github.com/HAL-Institute/OpenQED-Data), a Lean 4 Lake project. OpenQED reads problem data from a local JSON export. Submissions (proofs and reductions) are written back to the data repository via the GitHub API.

### Repository structure (data repo)

```
proofs/{problemId}/          # Accepted proofs
reductions/{problemId}/      # Accepted reductions
```
