import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface Reference {
	key: string;
	citation: string;
	url?: string;
}

interface SubProblem {
	id: string;
	name: string;
	reduction: string;
	reducedProblem: string;
	leanFormalization: string;
	parentId: string;
}

interface Problem {
	id: string;
	title: string;
	shortDescription: string;
	category: string;
	tags: string[];
	difficulty: string;
	status: 'open' | 'closed';
	subProblemCount: number;
	overview: string;
	preliminaries: string;
	problemStatement: string;
	leanFormalization: string;
	references: Reference[];
	subProblems: SubProblem[];
}

const problems: Problem[] = [
	{
		id: 'riemann-hypothesis',
		title: 'The Riemann Hypothesis',
		shortDescription:
			'All non-trivial zeros of the Riemann zeta function have real part equal to 1/2.',
		category: 'number-theory',
		tags: ['zeta-function', 'prime-distribution', 'complex-analysis'],
		difficulty: 'millennium',
		status: 'open',
		subProblemCount: 3,
		overview:
			'The Riemann Hypothesis is one of the most important unsolved problems in mathematics, first proposed by Bernhard Riemann in 1859. It concerns the distribution of prime numbers and has deep connections to many areas of mathematics.\n\nThe hypothesis asserts that every non-trivial zero of the analytical continuation of the Riemann zeta function $\\zeta(s) = \\sum_{n=1}^{\\infty} n^{-s}$ has a real part equal to $\\frac{1}{2}$. The trivial zeros are the negative even integers $-2, -4, -6, \\ldots$.',
		preliminaries:
			'Let $s = \\sigma + it$ where $\\sigma, t \\in \\mathbb{R}$. The **Riemann zeta function** is defined for $\\Re(s) > 1$ by\n$$\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s} = \\prod_{p \\text{ prime}} \\frac{1}{1 - p^{-s}}.$$\nIt admits a meromorphic continuation to all of $\\mathbb{C}$ with a single simple pole at $s = 1$. The **critical strip** is the region $0 < \\Re(s) < 1$, and the **critical line** is $\\Re(s) = \\frac{1}{2}$.',
		problemStatement:
			'**Conjecture (Riemann, 1859).** If $\\zeta(s) = 0$ and $s$ is not a negative even integer, then $\\Re(s) = \\frac{1}{2}$.\n\nEquivalently, all non-trivial zeros of $\\zeta$ lie on the critical line.',
		leanFormalization: `import Mathlib.Analysis.SpecialFunctions.Integrals
import Mathlib.NumberTheory.ZetaFunction

/-- The Riemann Hypothesis: every non-trivial zero of the
    Riemann zeta function has real part equal to 1/2. -/
theorem riemann_hypothesis :
    ∀ s : ℂ, riemannZeta s = 0 →
    ¬ IsTrivialZero s →
    s.re = 1 / 2 := by
  sorry`,
		references: [
			{
				key: '[Riemann1859]',
				citation:
					'B. Riemann, "Ueber die Anzahl der Primzahlen unter einer gegebenen Grösse," *Monatsberichte der Berliner Akademie*, 1859.',
				url: 'https://doi.org/10.1007/978-3-663-12240-5'
			},
			{
				key: '[Conrey2003]',
				citation:
					'J. B. Conrey, "The Riemann Hypothesis," *Notices of the AMS*, 50(3), 341-353, 2003.',
				url: 'https://www.ams.org/notices/200303/fea-conrey-web.pdf'
			},
			{
				key: '[Titchmarsh1986]',
				citation:
					'E. C. Titchmarsh, *The Theory of the Riemann Zeta-Function*, 2nd ed., Oxford University Press, 1986.'
			}
		],
		subProblems: [
			{
				id: 'rh-density-hypothesis',
				name: 'Density Hypothesis',
				reduction:
					'The Density Hypothesis is a weaker form of the Riemann Hypothesis. It controls the number of zeros of $\\zeta(s)$ in the region $\\sigma > \\sigma_0$ for $\\sigma_0 > 1/2$, and implies many of the same consequences for prime distribution.',
				reducedProblem:
					'**Density Hypothesis.** Let $N(\\sigma, T)$ denote the number of zeros $\\rho = \\beta + i\\gamma$ of $\\zeta(s)$ with $\\beta \\geq \\sigma$ and $0 < \\gamma \\leq T$. Then for every $\\varepsilon > 0$,\n$$N(\\sigma, T) = O(T^{2(1-\\sigma)+\\varepsilon}).$$',
				leanFormalization: `theorem density_hypothesis (σ : ℝ) (hσ : 1/2 < σ) (ε : ℝ) (hε : 0 < ε) :
    ∃ C : ℝ, ∀ T : ℝ, T > 0 →
    zeroCount σ T ≤ C * T ^ (2 * (1 - σ) + ε) := by
  sorry`,
				parentId: 'riemann-hypothesis'
			},
			{
				id: 'rh-lindelof-hypothesis',
				name: 'Lindelöf Hypothesis',
				reduction:
					'The Lindelöf Hypothesis would follow from the Riemann Hypothesis. It bounds the growth of $\\zeta(1/2 + it)$ and is equivalent to a strong estimate on the moments of $\\zeta$ on the critical line.',
				reducedProblem:
					'**Lindelöf Hypothesis.** For every $\\varepsilon > 0$,\n$$\\zeta\\left(\\frac{1}{2} + it\\right) = O(t^\\varepsilon) \\quad \\text{as } t \\to \\infty.$$',
				leanFormalization: `theorem lindelof_hypothesis (ε : ℝ) (hε : 0 < ε) :
    ∃ C : ℝ, ∀ t : ℝ, t ≥ 1 →
    Complex.abs (riemannZeta (1/2 + t * Complex.I)) ≤ C * t ^ ε := by
  sorry`,
				parentId: 'riemann-hypothesis'
			},
			{
				id: 'rh-gue-conjecture',
				name: 'GUE Hypothesis',
				reduction:
					'The Montgomery-Odlyzko conjecture predicts that the spacing distribution of non-trivial zeros of $\\zeta$ matches the eigenvalue spacing of random matrices from the Gaussian Unitary Ensemble. This provides deep structural insight into the zeros.',
				reducedProblem:
					'**GUE Conjecture.** The pair correlation function of the normalized spacings between consecutive non-trivial zeros of $\\zeta(s)$ agrees with the pair correlation function of eigenvalues of large random Hermitian matrices from GUE.',
				leanFormalization: `-- The GUE conjecture is a statistical statement about zero spacing.
-- A full formalization requires a framework for random matrix theory.
theorem gue_conjecture :
    pairCorrelationZeros = gueCorrelation := by
  sorry`,
				parentId: 'riemann-hypothesis'
			}
		]
	},
	{
		id: 'collatz-conjecture',
		title: 'The Collatz Conjecture',
		shortDescription:
			'Every positive integer eventually reaches 1 under the 3n+1 map.',
		category: 'number-theory',
		tags: ['dynamical-systems', 'iteration', 'elementary'],
		difficulty: 'research',
		status: 'open',
		subProblemCount: 2,
		overview:
			'The Collatz conjecture, also known as the $3n+1$ problem, is one of the most famous unsolved problems in mathematics despite its elementary statement. Proposed by Lothar Collatz in 1937, it concerns the behavior of a simple iterative process on the positive integers.\n\nPaul Erdős famously remarked that "mathematics may not be ready for such problems."',
		preliminaries:
			'Define the **Collatz function** $T: \\mathbb{Z}^+ \\to \\mathbb{Z}^+$ by\n$$T(n) = \\begin{cases} n/2 & \\text{if } n \\equiv 0 \\pmod{2}, \\\\ 3n+1 & \\text{if } n \\equiv 1 \\pmod{2}. \\end{cases}$$\nThe **Collatz sequence** starting at $n$ is $n, T(n), T^2(n), \\ldots$ We write $T^k(n)$ for the $k$-th iterate of $T$ applied to $n$.',
		problemStatement:
			'**Conjecture (Collatz, 1937).** For every $n \\in \\mathbb{Z}^+$, there exists $k \\in \\mathbb{N}$ such that $T^k(n) = 1$.\n\nIn other words, the Collatz sequence of every positive integer eventually reaches 1.',
		leanFormalization: `def collatz : ℕ → ℕ
  | 0 => 0
  | n + 1 => if (n + 1) % 2 = 0 then (n + 1) / 2 else 3 * (n + 1) + 1

/-- The Collatz conjecture: iterating the Collatz function
    from any positive integer eventually reaches 1. -/
theorem collatz_conjecture (n : ℕ) (hn : 0 < n) :
    ∃ k : ℕ, Nat.iterate collatz k n = 1 := by
  sorry`,
		references: [
			{
				key: '[Lagarias1985]',
				citation:
					'J. C. Lagarias, "The 3x + 1 problem and its generalizations," *American Mathematical Monthly*, 92(1), 3-23, 1985.',
				url: 'https://doi.org/10.1080/00029890.1985.11971528'
			},
			{
				key: '[Tao2022]',
				citation:
					'T. Tao, "Almost all orbits of the Collatz map attain almost bounded values," *Forum of Mathematics, Pi*, 10, 2022.',
				url: 'https://doi.org/10.1017/fmp.2022.8'
			}
		],
		subProblems: [
			{
				id: 'collatz-density-one',
				name: 'Density One Convergence',
				reduction:
					'A weaker version of the Collatz conjecture asks whether almost all positive integers (in the sense of natural density) eventually reach 1. Tao (2022) proved that almost all orbits attain almost bounded values.',
				reducedProblem:
					'**Problem.** Show that the set $\\{n \\in \\mathbb{Z}^+ : \\exists k,\\ T^k(n) = 1\\}$ has natural density 1.',
				leanFormalization: `theorem collatz_density_one :
    Nat.density {n : ℕ | ∃ k, Nat.iterate collatz k n = 1} = 1 := by
  sorry`,
				parentId: 'collatz-conjecture'
			},
			{
				id: 'collatz-no-cycles',
				name: 'No Non-trivial Cycles',
				reduction:
					'The Collatz conjecture implies there are no cycles other than $1 \\to 4 \\to 2 \\to 1$. Proving the absence of non-trivial cycles is a necessary step.',
				reducedProblem:
					'**Problem.** The only cycle in the Collatz sequence is $1 \\to 4 \\to 2 \\to 1$. That is, if $T^k(n) = n$ for some $k > 0$ and $n > 0$, then $n \\in \\{1, 2, 4\\}$.',
				leanFormalization: `theorem collatz_no_nontrivial_cycles (n : ℕ) (hn : 0 < n) (k : ℕ) (hk : 0 < k)
    (hcycle : Nat.iterate collatz k n = n) :
    n ∈ ({1, 2, 4} : Set ℕ) := by
  sorry`,
				parentId: 'collatz-conjecture'
			}
		]
	},
	{
		id: 'p-vs-np',
		title: 'P vs NP',
		shortDescription:
			'Is every problem whose solution can be verified quickly also solvable quickly?',
		category: 'logic',
		tags: ['computational-complexity', 'algorithms', 'decision-problems'],
		difficulty: 'millennium',
		status: 'open',
		subProblemCount: 2,
		overview:
			'The P vs NP problem asks whether every problem whose solution can be quickly verified by a computer can also be quickly solved by a computer. It is one of the seven Millennium Prize Problems and is widely considered the most important open question in theoretical computer science.\n\nInformally, it asks: is creative problem-solving fundamentally harder than checking a given answer?',
		preliminaries:
			'A **decision problem** is a function $L : \\{0,1\\}^* \\to \\{0,1\\}$. The class $\\mathbf{P}$ consists of decision problems solvable by a deterministic Turing machine in polynomial time. The class $\\mathbf{NP}$ consists of decision problems for which a "yes" answer can be *verified* in polynomial time given a suitable certificate.\n\nFormally, $L \\in \\mathbf{NP}$ if there exists a polynomial-time verifier $V$ and a polynomial $p$ such that $L(x) = 1$ iff $\\exists w \\in \\{0,1\\}^{p(|x|)},\\ V(x, w) = 1$.',
		problemStatement:
			'**Problem (Cook, 1971; Levin, 1973).** Determine whether $\\mathbf{P} = \\mathbf{NP}$.\n\nIt is widely conjectured that $\\mathbf{P} \\neq \\mathbf{NP}$.',
		leanFormalization: `-- Formalization requires a model of computation (Turing machines).
-- We use an abstract formulation.

/-- P vs NP: determine whether P = NP. -/
theorem p_ne_np : P ≠ NP := by
  sorry`,
		references: [
			{
				key: '[Cook1971]',
				citation:
					'S. A. Cook, "The complexity of theorem-proving procedures," *Proceedings of the 3rd Annual ACM Symposium on Theory of Computing*, 151-158, 1971.',
				url: 'https://doi.org/10.1145/800157.805047'
			},
			{
				key: '[Arora2009]',
				citation:
					'S. Arora and B. Barak, *Computational Complexity: A Modern Approach*, Cambridge University Press, 2009.'
			}
		],
		subProblems: [
			{
				id: 'p-vs-np-circuit-lower-bounds',
				name: 'Circuit Lower Bounds',
				reduction:
					'Proving $\\mathbf{P} \\neq \\mathbf{NP}$ can be approached through circuit complexity. If one can show that an NP-complete problem requires super-polynomial circuit size, then $\\mathbf{P} \\neq \\mathbf{NP}$.',
				reducedProblem:
					'**Problem.** Show that SAT cannot be computed by Boolean circuits of polynomial size. That is, prove a super-polynomial lower bound on the circuit complexity of SAT.',
				leanFormalization: `theorem sat_circuit_lower_bound :
    ¬ ∃ (C : ℕ → Circuit), (∀ n, (C n).size ≤ n ^ C) ∧
    (∀ n φ, φ.vars ≤ n → (C n).eval φ = sat φ) := by
  sorry`,
				parentId: 'p-vs-np'
			},
			{
				id: 'p-vs-np-natural-proofs-barrier',
				name: 'Overcoming Natural Proofs Barrier',
				reduction:
					'Razborov and Rudich (1997) showed that "natural" proof techniques cannot separate P from NP under cryptographic assumptions. Any proof of $\\mathbf{P} \\neq \\mathbf{NP}$ must therefore use "unnatural" techniques.',
				reducedProblem:
					'**Problem.** Develop a proof technique for circuit lower bounds that is not "natural" in the sense of Razborov-Rudich, yet still applicable to NP-complete problems.',
				leanFormalization: `-- This is a meta-mathematical challenge about proof techniques.
-- A formalization would require encoding the notion of "natural proofs."
theorem overcome_natural_proofs_barrier :
    ∃ (technique : ProofTechnique), ¬ technique.isNatural ∧
    technique.proves (circuitLowerBound SAT) := by
  sorry`,
				parentId: 'p-vs-np'
			}
		]
	},
	{
		id: 'birch-swinnerton-dyer',
		title: 'Birch and Swinnerton-Dyer Conjecture',
		shortDescription:
			'The rank of an elliptic curve equals the order of vanishing of its L-function at s=1.',
		category: 'number-theory',
		tags: ['elliptic-curves', 'l-functions', 'algebraic-geometry'],
		difficulty: 'millennium',
		status: 'open',
		subProblemCount: 2,
		overview:
			'The Birch and Swinnerton-Dyer (BSD) conjecture relates the algebraic rank of an elliptic curve $E/\\mathbb{Q}$ to the analytic behavior of its $L$-function $L(E, s)$ at $s = 1$. It is one of the Millennium Prize Problems.\n\nThe conjecture was formulated in the 1960s based on extensive numerical computations by Bryan Birch and Peter Swinnerton-Dyer using early computers.',
		preliminaries:
			'An **elliptic curve** $E/\\mathbb{Q}$ is a smooth projective curve of genus 1 with a specified rational point. By Mordell\'s theorem, the group $E(\\mathbb{Q})$ of rational points is finitely generated:\n$$E(\\mathbb{Q}) \\cong \\mathbb{Z}^r \\oplus E(\\mathbb{Q})_{\\text{tors}}$$\nwhere $r = \\text{rank}(E/\\mathbb{Q})$ is the **algebraic rank**. The **$L$-function** of $E$ is defined by an Euler product $L(E, s) = \\prod_p L_p(E, s)$ converging for $\\Re(s) > 3/2$, and is known to have analytic continuation to all of $\\mathbb{C}$ by modularity.',
		problemStatement:
			'**Conjecture (Birch-Swinnerton-Dyer).** Let $E/\\mathbb{Q}$ be an elliptic curve. Then:\n1. $\\text{ord}_{s=1} L(E, s) = \\text{rank}(E/\\mathbb{Q})$.\n2. The leading coefficient of $L(E, s)$ at $s = 1$ is given by\n$$\\frac{L^{(r)}(E, 1)}{r!} = \\frac{\\Omega_E \\cdot \\text{Reg}(E) \\cdot |\\text{Sha}(E)| \\cdot \\prod_p c_p}{|E(\\mathbb{Q})_{\\text{tors}}|^2}.$$',
		leanFormalization: `import Mathlib.NumberTheory.EllipticCurve

/-- BSD Conjecture, Part 1: The analytic rank equals the algebraic rank. -/
theorem bsd_rank (E : EllipticCurve ℚ) :
    analyticRank (L E) = algebraicRank E := by
  sorry`,
		references: [
			{
				key: '[BSD1965]',
				citation:
					'B. Birch and H. P. F. Swinnerton-Dyer, "Notes on elliptic curves II," *J. Reine Angew. Math.*, 218, 79-108, 1965.',
				url: 'https://doi.org/10.1515/crll.1965.218.79'
			},
			{
				key: '[Wiles2006]',
				citation:
					'A. Wiles, "The Birch and Swinnerton-Dyer Conjecture," in *The Millennium Prize Problems*, AMS, 2006.'
			}
		],
		subProblems: [
			{
				id: 'bsd-rank-zero',
				name: 'BSD for Rank 0',
				reduction:
					'The rank 0 case of BSD states that if $L(E, 1) \\neq 0$ then $E(\\mathbb{Q})$ is finite. This was proved by Kolyvagin (1990) for certain curves, but remains open in general.',
				reducedProblem:
					'**Problem.** If $L(E, 1) \\neq 0$ for an elliptic curve $E/\\mathbb{Q}$, then $\\text{rank}(E/\\mathbb{Q}) = 0$.',
				leanFormalization: `theorem bsd_rank_zero (E : EllipticCurve ℚ) (hL : L E 1 ≠ 0) :
    algebraicRank E = 0 := by
  sorry`,
				parentId: 'birch-swinnerton-dyer'
			},
			{
				id: 'bsd-sha-finiteness',
				name: 'Finiteness of Sha',
				reduction:
					'BSD predicts that the Tate-Shafarevich group $\\text{Sha}(E/\\mathbb{Q})$ is always finite. This is a necessary ingredient for the full BSD formula.',
				reducedProblem:
					'**Problem.** For every elliptic curve $E/\\mathbb{Q}$, the Tate-Shafarevich group $\\text{Sha}(E/\\mathbb{Q})$ is finite.',
				leanFormalization: `theorem sha_finite (E : EllipticCurve ℚ) :
    Set.Finite (sha E ℚ) := by
  sorry`,
				parentId: 'birch-swinnerton-dyer'
			}
		]
	},
	{
		id: 'navier-stokes',
		title: 'Navier-Stokes Existence and Smoothness',
		shortDescription:
			'Do smooth solutions to the 3D Navier-Stokes equations always exist globally in time?',
		category: 'analysis',
		tags: ['pde', 'fluid-dynamics', 'regularity'],
		difficulty: 'millennium',
		status: 'open',
		subProblemCount: 2,
		overview:
			'The Navier-Stokes equations describe the motion of viscous fluid substances. The problem of whether smooth, globally defined solutions always exist in three dimensions is one of the Millennium Prize Problems.\n\nWhile the equations have been used successfully in engineering and physics for over a century, a rigorous mathematical understanding of their solutions in 3D remains elusive.',
		preliminaries:
			'The **incompressible Navier-Stokes equations** in $\\mathbb{R}^3$ are:\n$$\\frac{\\partial \\mathbf{u}}{\\partial t} + (\\mathbf{u} \\cdot \\nabla)\\mathbf{u} = -\\nabla p + \\nu \\Delta \\mathbf{u} + \\mathbf{f}, \\qquad \\nabla \\cdot \\mathbf{u} = 0,$$\nwhere $\\mathbf{u}(x, t)$ is the velocity field, $p(x, t)$ is the pressure, $\\nu > 0$ is the kinematic viscosity, and $\\mathbf{f}$ is an external forcing term.',
		problemStatement:
			'**Problem (Clay Mathematics Institute).** Let $\\nu > 0$ and let $\\mathbf{u}_0 \\in C^\\infty(\\mathbb{R}^3)$ be a divergence-free vector field with $|\\partial^\\alpha \\mathbf{u}_0(x)| \\leq C_{\\alpha K}(1 + |x|)^{-K}$ for all $\\alpha, K$. Prove that there exist smooth functions $\\mathbf{u}(x,t), p(x,t)$ on $\\mathbb{R}^3 \\times [0, \\infty)$ satisfying the Navier-Stokes equations with $\\mathbf{u}(x, 0) = \\mathbf{u}_0(x)$.',
		leanFormalization: `/-- Navier-Stokes global existence and smoothness in 3D. -/
theorem navier_stokes_global_existence
    (ν : ℝ) (hν : 0 < ν)
    (u₀ : ℝ × ℝ × ℝ → ℝ × ℝ × ℝ)
    (hu₀ : SmoothDivFree u₀) :
    ∃ u p, IsGlobalSmoothSolution ν u p u₀ := by
  sorry`,
		references: [
			{
				key: '[Fefferman2006]',
				citation:
					'C. L. Fefferman, "Existence and Smoothness of the Navier-Stokes Equation," in *The Millennium Prize Problems*, AMS, 2006.'
			},
			{
				key: '[Leray1934]',
				citation:
					'J. Leray, "Sur le mouvement d\'un liquide visqueux emplissant l\'espace," *Acta Math.*, 63, 193-248, 1934.',
				url: 'https://doi.org/10.1007/BF02547354'
			}
		],
		subProblems: [
			{
				id: 'ns-weak-strong-uniqueness',
				name: 'Weak-Strong Uniqueness',
				reduction:
					'If a smooth solution exists, it must agree with any Leray-Hopf weak solution sharing the same initial data. This reduces the problem to ruling out singularity formation.',
				reducedProblem:
					'**Problem.** Prove that if $\\mathbf{u}$ is a Leray-Hopf weak solution and $\\mathbf{v}$ is a smooth solution with the same initial data, then $\\mathbf{u} = \\mathbf{v}$ on the interval of existence of $\\mathbf{v}$.',
				leanFormalization: `theorem weak_strong_uniqueness (u v : Solution)
    (hu : IsLerayHopfWeak u) (hv : IsSmooth v)
    (heq : u.initialData = v.initialData) :
    u = v := by
  sorry`,
				parentId: 'navier-stokes'
			},
			{
				id: 'ns-regularity-criterion',
				name: 'Ladyzhenskaya-Prodi-Serrin Criterion',
				reduction:
					'By the Ladyzhenskaya-Prodi-Serrin regularity criterion, global regularity follows from suitable a priori bounds on the solution in $L^p_t L^q_x$ spaces.',
				reducedProblem:
					'**Problem.** Show that every Leray-Hopf weak solution $\\mathbf{u}$ satisfies $\\mathbf{u} \\in L^p(0, T; L^q(\\mathbb{R}^3))$ with $\\frac{2}{p} + \\frac{3}{q} \\leq 1$ and $q > 3$ for all $T > 0$.',
				leanFormalization: `theorem lps_regularity (u : Solution) (hu : IsLerayHopfWeak u)
    (p q : ℝ) (hp : 2 / p + 3 / q ≤ 1) (hq : 3 < q)
    (T : ℝ) (hT : 0 < T) :
    u ∈ LpLq p q 0 T := by
  sorry`,
				parentId: 'navier-stokes'
			}
		]
	},
	{
		id: 'twin-prime-conjecture',
		title: 'Twin Prime Conjecture',
		shortDescription: 'There are infinitely many pairs of primes differing by 2.',
		category: 'number-theory',
		tags: ['prime-gaps', 'sieve-methods', 'analytic-number-theory'],
		difficulty: 'research',
		status: 'open',
		subProblemCount: 2,
		overview:
			'The Twin Prime Conjecture asserts that there are infinitely many prime numbers $p$ such that $p + 2$ is also prime. Examples include $(3, 5)$, $(5, 7)$, $(11, 13)$, $(17, 19)$, and $(29, 31)$.\n\nYitang Zhang (2013) proved the breakthrough result that there are infinitely many pairs of primes with bounded gaps, and subsequent work by Maynard and the Polymath project reduced the bound to 246.',
		preliminaries:
			'A **twin prime pair** is a pair $(p, p+2)$ where both $p$ and $p + 2$ are prime. Let $\\pi_2(x) = |\\{p \\leq x : p \\text{ and } p+2 \\text{ are both prime}\\}|$. The **first Hardy-Littlewood conjecture** predicts\n$$\\pi_2(x) \\sim 2C_2 \\frac{x}{(\\log x)^2}$$\nwhere $C_2 = \\prod_{p \\geq 3} \\frac{p(p-2)}{(p-1)^2} \\approx 0.6601$ is the **twin prime constant**.',
		problemStatement:
			'**Conjecture.** There are infinitely many primes $p$ such that $p + 2$ is also prime. Equivalently, $\\pi_2(x) \\to \\infty$ as $x \\to \\infty$.',
		leanFormalization: `import Mathlib.NumberTheory.ArithmeticFunction

/-- Twin Prime Conjecture: there are infinitely many twin primes. -/
theorem twin_prime_conjecture :
    Set.Infinite {p : ℕ | Nat.Prime p ∧ Nat.Prime (p + 2)} := by
  sorry`,
		references: [
			{
				key: '[Zhang2014]',
				citation:
					'Y. Zhang, "Bounded gaps between primes," *Annals of Mathematics*, 179(3), 1121-1174, 2014.',
				url: 'https://doi.org/10.4007/annals.2014.179.3.7'
			},
			{
				key: '[Maynard2015]',
				citation:
					'J. Maynard, "Small gaps between primes," *Annals of Mathematics*, 181(1), 383-413, 2015.',
				url: 'https://doi.org/10.4007/annals.2015.181.1.7'
			}
		],
		subProblems: [
			{
				id: 'twin-prime-bounded-gaps',
				name: 'Bounded Prime Gaps (H = 2)',
				reduction:
					"Zhang proved $\\liminf_{n \\to \\infty} (p_{n+1} - p_n) < 7 \\times 10^7$. The Polymath project reduced this to 246. Reaching $H = 2$ would prove the twin prime conjecture.",
				reducedProblem:
					'**Problem.** Prove that $\\liminf_{n \\to \\infty} (p_{n+1} - p_n) = 2$ where $p_n$ denotes the $n$-th prime.',
				leanFormalization: `theorem bounded_prime_gaps :
    Filter.liminf (fun n => (nthPrime (n + 1) - nthPrime n)) Filter.atTop = 2 := by
  sorry`,
				parentId: 'twin-prime-conjecture'
			},
			{
				id: 'twin-prime-elliott-halberstam',
				name: 'Elliott-Halberstam Conjecture',
				reduction:
					'Goldston, Pintz, and Yıldırım showed that the Elliott-Halberstam conjecture (a strengthening of the Bombieri-Vinogradov theorem) would imply bounded prime gaps with $H \\leq 16$.',
				reducedProblem:
					'**Elliott-Halberstam Conjecture.** For every $\\varepsilon > 0$ and $A > 0$, we have\n$$\\sum_{q \\leq x^{1-\\varepsilon}} \\max_{(a,q)=1} \\left| \\pi(x; q, a) - \\frac{\\text{li}(x)}{\\varphi(q)} \\right| \\ll_A \\frac{x}{(\\log x)^A}.$$',
				leanFormalization: `theorem elliott_halberstam (ε A : ℝ) (hε : 0 < ε) (hA : 0 < A) :
    ∃ C, ∀ x : ℝ, x ≥ 2 →
    primeCountErrorSum x (x ^ (1 - ε)) ≤ C * x / (Real.log x) ^ A := by
  sorry`,
				parentId: 'twin-prime-conjecture'
			}
		]
	},
	{
		id: 'goldbach-conjecture',
		title: "Goldbach's Conjecture",
		shortDescription: 'Every even integer greater than 2 is the sum of two primes.',
		category: 'number-theory',
		tags: ['additive-number-theory', 'prime-numbers', 'elementary'],
		difficulty: 'research',
		status: 'open',
		subProblemCount: 2,
		overview:
			"Goldbach's conjecture is one of the oldest unsolved problems in number theory and mathematics. It was first proposed by Christian Goldbach in a letter to Leonhard Euler in 1742.\n\nThe conjecture has been verified computationally for all even numbers up to $4 \\times 10^{18}$. Helfgott (2013) proved the weak Goldbach conjecture (every odd number $> 5$ is a sum of three primes).",
		preliminaries:
			'Let $r_2(n) = |\\{(p, q) : p + q = n,\\ p, q \\text{ prime}\\}|$ denote the number of representations of $n$ as a sum of two primes. The **singular series** predicts\n$$r_2(2n) \\sim 2C_2 \\prod_{\\substack{p | n \\\\ p > 2}} \\frac{p - 1}{p - 2} \\cdot \\frac{2n}{(\\log 2n)^2}$$\nfor even $2n$, where $C_2$ is the twin prime constant.',
		problemStatement:
			"**Conjecture (Goldbach, 1742).** Every even integer $n \\geq 4$ can be expressed as the sum of two prime numbers.\n\nEquivalently, $r_2(n) \\geq 1$ for every even $n \\geq 4$.",
		leanFormalization: `import Mathlib.Data.Nat.Prime.Basic

/-- Goldbach's Conjecture: every even number ≥ 4 is a sum of two primes. -/
theorem goldbach_conjecture (n : ℕ) (hn : 4 ≤ n) (heven : Even n) :
    ∃ p q : ℕ, Nat.Prime p ∧ Nat.Prime q ∧ p + q = n := by
  sorry`,
		references: [
			{
				key: '[Goldbach1742]',
				citation:
					'C. Goldbach, Letter to L. Euler, June 7, 1742.'
			},
			{
				key: '[Helfgott2013]',
				citation:
					'H. A. Helfgott, "The ternary Goldbach conjecture is true," preprint, arXiv:1312.7748, 2013.',
				url: 'https://arxiv.org/abs/1312.7748'
			}
		],
		subProblems: [
			{
				id: 'goldbach-weak',
				name: 'Weak Goldbach (Proved)',
				reduction:
					'The weak Goldbach conjecture (every odd number $> 5$ is a sum of three primes) was proved by Helfgott in 2013 using the Hardy-Littlewood circle method.',
				reducedProblem:
					'**Theorem (Helfgott, 2013).** Every odd integer $n > 5$ can be written as the sum of three prime numbers.\n\n*This has been proved but the formalization is still open.*',
				leanFormalization: `theorem weak_goldbach (n : ℕ) (hn : 5 < n) (hodd : ¬ Even n) :
    ∃ p q r : ℕ, Nat.Prime p ∧ Nat.Prime q ∧ Nat.Prime r ∧ p + q + r = n := by
  sorry`,
				parentId: 'goldbach-conjecture'
			},
			{
				id: 'goldbach-chen',
				name: "Chen's Theorem Extension",
				reduction:
					"Chen Jingrun proved that every sufficiently large even number is the sum of a prime and a semiprime (product of at most two primes). Strengthening this to two primes would prove Goldbach's conjecture.",
				reducedProblem:
					"**Problem.** Improve Chen's theorem to show that every sufficiently large even number $n$ can be written as $n = p + q$ where both $p$ and $q$ are prime (removing the semiprime allowance).",
				leanFormalization: `theorem chen_extension (n : ℕ) (hn : n ≥ N₀) (heven : Even n) :
    ∃ p q : ℕ, Nat.Prime p ∧ Nat.Prime q ∧ p + q = n := by
  sorry`,
				parentId: 'goldbach-conjecture'
			}
		]
	},
	{
		id: 'hodge-conjecture',
		title: 'Hodge Conjecture',
		shortDescription:
			'Certain cohomology classes on algebraic varieties are combinations of algebraic subvarieties.',
		category: 'geometry',
		tags: ['algebraic-geometry', 'cohomology', 'complex-geometry'],
		difficulty: 'millennium',
		status: 'open',
		subProblemCount: 2,
		overview:
			'The Hodge conjecture is a major unsolved problem in algebraic geometry that bridges the gap between topology and algebraic geometry. It predicts that certain topologically defined objects on smooth complex projective varieties are in fact algebraic.\n\nThe conjecture was formulated by W. V. D. Hodge in 1950 and is one of the seven Millennium Prize Problems.',
		preliminaries:
			'Let $X$ be a smooth complex projective variety of dimension $n$. By Hodge theory, the cohomology $H^k(X, \\mathbb{C})$ decomposes as\n$$H^k(X, \\mathbb{C}) = \\bigoplus_{p+q=k} H^{p,q}(X)$$\nwhere $H^{p,q}(X)$ is the space of harmonic $(p,q)$-forms. A class $\\alpha \\in H^{2p}(X, \\mathbb{Q})$ is called a **Hodge class** if its image in $H^{2p}(X, \\mathbb{C})$ lies in $H^{p,p}(X)$.',
		problemStatement:
			'**Conjecture (Hodge, 1950).** Every Hodge class on a smooth complex projective variety is a rational linear combination of cohomology classes of algebraic subvarieties.\n\nThat is, every class in $H^{p,p}(X) \\cap H^{2p}(X, \\mathbb{Q})$ lies in the image of the cycle class map.',
		leanFormalization: `/-- The Hodge Conjecture. -/
theorem hodge_conjecture (X : ProjectiveVariety ℂ)
    (hX : X.IsSmooth) (p : ℕ) (α : HodgeClass X p) :
    ∃ (cycles : List (AlgebraicCycle X p)) (coeffs : List ℚ),
    α = linearCombination coeffs cycles := by
  sorry`,
		references: [
			{
				key: '[Hodge1950]',
				citation:
					'W. V. D. Hodge, "The topological invariants of algebraic varieties," *Proceedings of the ICM*, 1950.'
			},
			{
				key: '[Voisin2002]',
				citation:
					'C. Voisin, *Hodge Theory and Complex Algebraic Geometry I*, Cambridge University Press, 2002.'
			}
		],
		subProblems: [
			{
				id: 'hodge-divisors',
				name: 'Hodge for Divisors (Lefschetz 1,1)',
				reduction:
					'The Hodge conjecture for $p = 1$ (divisors) is known: the Lefschetz $(1,1)$ theorem states that every Hodge class in $H^{1,1}(X) \\cap H^2(X, \\mathbb{Z})$ is the class of a divisor.',
				reducedProblem:
					'**Theorem (Lefschetz).** Every integral $(1,1)$-class on a smooth projective variety is algebraic.\n\n*This is proved. The formalization is still open.*',
				leanFormalization: `theorem lefschetz_1_1 (X : ProjectiveVariety ℂ) (hX : X.IsSmooth)
    (α : H¹¹ X) (hint : α.isIntegral) :
    ∃ D : Divisor X, cycleClass D = α := by
  sorry`,
				parentId: 'hodge-conjecture'
			},
			{
				id: 'hodge-abelian',
				name: 'Hodge for Abelian Varieties',
				reduction:
					'The Hodge conjecture restricted to abelian varieties is already highly non-trivial and remains open for $p \\geq 2$. It is a natural testing ground.',
				reducedProblem:
					'**Problem.** Prove the Hodge conjecture for all abelian varieties: every Hodge class on an abelian variety is algebraic.',
				leanFormalization: `theorem hodge_abelian_varieties (A : AbelianVariety ℂ)
    (p : ℕ) (α : HodgeClass A p) :
    α.isAlgebraic := by
  sorry`,
				parentId: 'hodge-conjecture'
			}
		]
	},
	{
		id: 'yang-mills-mass-gap',
		title: 'Yang-Mills Existence and Mass Gap',
		shortDescription:
			'Prove that quantum Yang-Mills theory exists and has a positive mass gap.',
		category: 'mathematical-physics',
		tags: ['quantum-field-theory', 'gauge-theory', 'constructive-qft'],
		difficulty: 'millennium',
		status: 'open',
		subProblemCount: 2,
		overview:
			'The Yang-Mills existence and mass gap problem asks for a rigorous mathematical foundation for quantum Yang-Mills gauge theories, which form the basis of the Standard Model of particle physics.\n\nThe "mass gap" refers to the difference in energy between the vacuum state and the first excited state, which must be strictly positive for the theory to exhibit confinement.',
		preliminaries:
			'A **Yang-Mills theory** is a gauge theory with gauge group $G$ (a compact simple Lie group) on $\\mathbb{R}^4$. The classical Yang-Mills Lagrangian is\n$$\\mathcal{L} = -\\frac{1}{4} \\text{tr}(F_{\\mu\\nu} F^{\\mu\\nu})$$\nwhere $F_{\\mu\\nu} = \\partial_\\mu A_\\nu - \\partial_\\nu A_\\mu + g[A_\\mu, A_\\nu]$ is the field strength tensor. The **mass gap** $\\Delta > 0$ is the infimum of the spectrum of the Hamiltonian above the vacuum energy.',
		problemStatement:
			'**Problem (Clay Mathematics Institute).** For any compact simple gauge group $G$, prove that the quantum Yang-Mills theory on $\\mathbb{R}^4$ exists (satisfying the Wightman axioms or equivalent) and has a mass gap $\\Delta > 0$.',
		leanFormalization: `/-- Yang-Mills existence and mass gap. -/
theorem yang_mills_mass_gap (G : CompactSimpleLieGroup) :
    ∃ (QFT : WightmanQFT G),
    QFT.massGap > 0 := by
  sorry`,
		references: [
			{
				key: '[JaffeWitten2006]',
				citation:
					'A. Jaffe and E. Witten, "Quantum Yang-Mills Theory," in *The Millennium Prize Problems*, AMS, 2006.'
			},
			{
				key: '[YangMills1954]',
				citation:
					'C. N. Yang and R. L. Mills, "Conservation of Isotopic Spin and Isotopic Gauge Invariance," *Physical Review*, 96, 191-195, 1954.',
				url: 'https://doi.org/10.1103/PhysRev.96.191'
			}
		],
		subProblems: [
			{
				id: 'ym-lattice',
				name: 'Continuum Limit of Lattice Yang-Mills',
				reduction:
					'Lattice gauge theory provides a well-defined regularized version of Yang-Mills theory. The challenge is proving that the continuum limit exists and satisfies the Wightman axioms.',
				reducedProblem:
					'**Problem.** For the lattice Yang-Mills theory with gauge group $G$ on a hypercubic lattice with spacing $a$, prove that the continuum limit $a \\to 0$ exists in the sense of convergent correlation functions satisfying the Osterwalder-Schrader axioms.',
				leanFormalization: `theorem lattice_ym_continuum_limit (G : CompactSimpleLieGroup) :
    ∃ limit : ContinuumQFT G,
    latticeYM G ⟶ limit ∧ limit.satisfiesOS := by
  sorry`,
				parentId: 'yang-mills-mass-gap'
			},
			{
				id: 'ym-2d',
				name: 'Yang-Mills in 2D',
				reduction:
					'Yang-Mills theory in 2 dimensions is exactly solvable and serves as a simpler testing ground. A rigorous construction exists (Migdal, Witten), but formalizing it builds the tools needed for 4D.',
				reducedProblem:
					'**Problem.** Give a fully rigorous construction of 2D Yang-Mills theory satisfying the Wightman axioms, and compute its mass gap explicitly.',
				leanFormalization: `theorem yang_mills_2d (G : CompactSimpleLieGroup) :
    ∃ (QFT : WightmanQFT₂ G),
    QFT.massGap = yangMillsMassGap₂ G := by
  sorry`,
				parentId: 'yang-mills-mass-gap'
			}
		]
	},
	{
		id: 'abc-conjecture',
		title: 'The abc Conjecture',
		shortDescription:
			'For coprime a+b=c, the radical rad(abc) is usually not much smaller than c.',
		category: 'number-theory',
		tags: ['diophantine-equations', 'radical', 'mason-stothers'],
		difficulty: 'research',
		status: 'open',
		subProblemCount: 2,
		overview:
			'The abc conjecture, formulated independently by Oesterlé and Masser in 1985, is one of the most important conjectures in number theory. It encodes deep information about the multiplicative structure of integers and implies many other famous results and conjectures.\n\nMochizuki claimed a proof in 2012 via inter-universal Teichmüller theory, but the proof remains controversial and is not widely accepted.',
		preliminaries:
			'For a positive integer $n$, the **radical** $\\text{rad}(n)$ is the product of all distinct prime factors of $n$:\n$$\\text{rad}(n) = \\prod_{p | n} p.$$\nFor example, $\\text{rad}(360) = \\text{rad}(2^3 \\cdot 3^2 \\cdot 5) = 2 \\cdot 3 \\cdot 5 = 30$. An **abc triple** is a triple of positive coprime integers $(a, b, c)$ with $a + b = c$.',
		problemStatement:
			'**Conjecture (Oesterlé-Masser, 1985).** For every $\\varepsilon > 0$, there exist only finitely many abc triples $(a, b, c)$ with $a + b = c$, $\\gcd(a, b) = 1$, and\n$$c > \\text{rad}(abc)^{1 + \\varepsilon}.$$',
		leanFormalization: `import Mathlib.Data.Nat.GCD.Basic

def radical (n : ℕ) : ℕ := n.primeFactors.prod id

/-- The abc conjecture. -/
theorem abc_conjecture (ε : ℝ) (hε : 0 < ε) :
    Set.Finite {t : ℕ × ℕ × ℕ |
      let (a, b, c) := t
      0 < a ∧ 0 < b ∧ a + b = c ∧ Nat.Coprime a b ∧
      (c : ℝ) > (radical (a * b * c) : ℝ) ^ (1 + ε)} := by
  sorry`,
		references: [
			{
				key: '[Masser1985]',
				citation:
					'D. W. Masser, "Open problems," in *Proc. Symp. Analytic Number Theory*, London, 1985.'
			},
			{
				key: '[Granville2004]',
				citation:
					'A. Granville and T. J. Tucker, "It\'s as easy as abc," *Notices of the AMS*, 49(10), 1224-1231, 2002.'
			}
		],
		subProblems: [
			{
				id: 'abc-szpiro',
				name: "Szpiro's Conjecture (Equivalent)",
				reduction:
					"Szpiro's conjecture about the conductor and discriminant of elliptic curves is equivalent to the abc conjecture. Progress on either implies progress on the other.",
				reducedProblem:
					"**Szpiro's Conjecture.** For every $\\varepsilon > 0$, there exists $C_\\varepsilon > 0$ such that for every elliptic curve $E/\\mathbb{Q}$ with minimal discriminant $\\Delta_E$ and conductor $N_E$,\n$$|\\Delta_E| \\leq C_\\varepsilon \\cdot N_E^{6 + \\varepsilon}.$$",
				leanFormalization: `theorem szpiro_conjecture (ε : ℝ) (hε : 0 < ε) :
    ∃ C : ℝ, 0 < C ∧ ∀ E : EllipticCurve ℚ,
    |E.minimalDiscriminant| ≤ C * E.conductor ^ (6 + ε) := by
  sorry`,
				parentId: 'abc-conjecture'
			},
			{
				id: 'abc-polynomial',
				name: 'Mason-Stothers Theorem (Proved)',
				reduction:
					'The polynomial analogue of the abc conjecture is the Mason-Stothers theorem, which has been proved. It states an analogous bound for polynomials over a field.',
				reducedProblem:
					'**Theorem (Mason-Stothers).** Let $a(t), b(t), c(t) \\in k[t]$ be coprime polynomials with $a + b = c$, not all constant. Then\n$$\\max(\\deg a, \\deg b, \\deg c) \\leq \\deg(\\text{rad}(abc)) - 1.$$\n\n*This is proved. The formalization is still open.*',
				leanFormalization: `theorem mason_stothers {k : Type} [Field k] (a b c : k[X])
    (hcop : IsCoprime a b) (hsum : a + b = c) (hnc : ¬(a.degree = 0 ∧ b.degree = 0)) :
    max (a.degree) (max b.degree c.degree) ≤ (radical (a * b * c)).degree - 1 := by
  sorry`,
				parentId: 'abc-conjecture'
			}
		]
	},
	{
		id: 'invariant-subspace-problem',
		title: 'Invariant Subspace Problem',
		shortDescription:
			'Does every bounded operator on a separable Hilbert space have a non-trivial invariant subspace?',
		category: 'analysis',
		tags: ['functional-analysis', 'operator-theory', 'hilbert-spaces'],
		difficulty: 'research',
		status: 'open',
		subProblemCount: 2,
		overview:
			'The invariant subspace problem asks whether every bounded linear operator on a separable, infinite-dimensional Hilbert space has a non-trivial closed invariant subspace. It is one of the central open problems in functional analysis.\n\nFor Banach spaces, counterexamples exist (Enflo, 1987; Read, 1985), but the Hilbert space case remains open.',
		preliminaries:
			'Let $H$ be a separable, infinite-dimensional Hilbert space over $\\mathbb{C}$, and let $T : H \\to H$ be a bounded linear operator. A closed subspace $M \\subseteq H$ is **$T$-invariant** if $T(M) \\subseteq M$. The subspace is **non-trivial** if $M \\neq \\{0\\}$ and $M \\neq H$.',
		problemStatement:
			'**Problem.** Let $T$ be a bounded linear operator on a separable, infinite-dimensional, complex Hilbert space $H$. Does there always exist a non-trivial closed $T$-invariant subspace?',
		leanFormalization: `/-- The Invariant Subspace Problem for Hilbert spaces. -/
theorem invariant_subspace_problem
    (H : Type) [NormedAddCommGroup H] [InnerProductSpace ℂ H]
    [CompleteSpace H] [SeparableSpace H] [Infinite (Basis ℂ H)]
    (T : H →L[ℂ] H) :
    ∃ M : Submodule ℂ H, M.IsClosed ∧ M ≠ ⊥ ∧ M ≠ ⊤ ∧
    ∀ x ∈ M, T x ∈ M := by
  sorry`,
		references: [
			{
				key: '[Enflo1987]',
				citation:
					'P. Enflo, "On the invariant subspace problem for Banach spaces," *Acta Math.*, 158, 213-313, 1987.',
				url: 'https://doi.org/10.1007/BF02392260'
			},
			{
				key: '[Lomonosov1973]',
				citation:
					'V. I. Lomonosov, "Invariant subspaces for the family of operators which commute with a completely continuous operator," *Funktsional. Anal. i Prilozhen.*, 7(3), 55-56, 1973.'
			}
		],
		subProblems: [
			{
				id: 'isp-compact-perturbation',
				name: 'Compact Perturbations',
				reduction:
					'By Lomonosov\'s theorem (1973), every operator that commutes with a nonzero compact operator has a non-trivial invariant subspace. The question reduces to operators "far from compact."',
				reducedProblem:
					'**Problem.** Show that every bounded operator $T$ on a separable Hilbert space that does not commute with any nonzero compact operator still has a non-trivial invariant subspace.',
				leanFormalization: `theorem isp_no_compact_commutant (T : H →L[ℂ] H)
    (hT : ∀ K : H →L[ℂ] H, IsCompact K → K ≠ 0 → T * K ≠ K * T) :
    ∃ M : Submodule ℂ H, M.IsClosed ∧ M ≠ ⊥ ∧ M ≠ ⊤ ∧
    ∀ x ∈ M, T x ∈ M := by
  sorry`,
				parentId: 'invariant-subspace-problem'
			},
			{
				id: 'isp-weighted-shifts',
				name: 'Weighted Shifts',
				reduction:
					'Weighted shift operators form an important class for which the invariant subspace problem has been extensively studied. A complete characterization would be significant progress.',
				reducedProblem:
					'**Problem.** Classify all weighted shift operators on $\\ell^2$ that have a non-trivial invariant subspace, and determine whether all of them do.',
				leanFormalization: `theorem isp_weighted_shifts (w : ℕ → ℂ) (hw : ∀ n, w n ≠ 0) :
    let T := weightedShift w
    ∃ M : Submodule ℂ (ℓ² ℕ), M.IsClosed ∧ M ≠ ⊥ ∧ M ≠ ⊤ ∧
    ∀ x ∈ M, T x ∈ M := by
  sorry`,
				parentId: 'invariant-subspace-problem'
			}
		]
	},
	{
		id: 'four-color-formalization',
		title: 'Four Color Theorem Formalization',
		shortDescription:
			'Complete Lean 4 formalization of the four color theorem for planar graphs.',
		category: 'combinatorics',
		tags: ['graph-theory', 'planar-graphs', 'formalization'],
		difficulty: 'graduate',
		status: 'open',
		subProblemCount: 2,
		overview:
			'The Four Color Theorem states that every planar graph can be properly colored with at most four colors. It was proved by Appel and Haken in 1976 using a computer-assisted proof, and later verified in Coq by Gonthier (2005).\n\nA Lean 4 formalization with Mathlib remains an open project and would be a significant achievement for the Lean community.',
		preliminaries:
			'A **planar graph** is a graph that can be embedded in the plane without edge crossings. A **proper $k$-coloring** of a graph $G = (V, E)$ is a function $c : V \\to \\{1, \\ldots, k\\}$ such that $c(u) \\neq c(v)$ for every edge $\\{u, v\\} \\in E$. The **chromatic number** $\\chi(G)$ is the smallest $k$ for which a proper $k$-coloring exists.',
		problemStatement:
			'**Theorem (Appel-Haken, 1976).** Every planar graph is 4-colorable. That is, if $G$ is a planar graph, then $\\chi(G) \\leq 4$.\n\n*Formalize this theorem in Lean 4 with Mathlib.*',
		leanFormalization: `import Mathlib.Combinatorics.SimpleGraph.Coloring

/-- The Four Color Theorem: every planar graph is 4-colorable. -/
theorem four_color_theorem (G : SimpleGraph V) [Fintype V]
    (hplanar : G.IsPlanar) :
    G.chromaticNumber ≤ 4 := by
  sorry`,
		references: [
			{
				key: '[AppelHaken1976]',
				citation:
					'K. Appel and W. Haken, "Every planar map is four colorable," *Bulletin of the AMS*, 82(5), 711-712, 1976.',
				url: 'https://doi.org/10.1090/S0002-9904-1976-14122-5'
			},
			{
				key: '[Gonthier2008]',
				citation:
					'G. Gonthier, "Formal Proof — The Four-Color Theorem," *Notices of the AMS*, 55(11), 1382-1393, 2008.'
			}
		],
		subProblems: [
			{
				id: 'four-color-five-color',
				name: 'Five Color Theorem',
				reduction:
					'The five color theorem is a weaker result that every planar graph is 5-colorable. Its proof is simpler and serves as a foundation.',
				reducedProblem:
					'**Theorem.** Every planar graph is 5-colorable.\n\n*Formalize this in Lean 4.*',
				leanFormalization: `theorem five_color_theorem (G : SimpleGraph V) [Fintype V]
    (hplanar : G.IsPlanar) :
    G.chromaticNumber ≤ 5 := by
  sorry`,
				parentId: 'four-color-formalization'
			},
			{
				id: 'four-color-reducibility',
				name: 'Reducibility Checking',
				reduction:
					'The Appel-Haken proof relies on checking the reducibility of a large set of configurations. Formalizing the reducibility checker is a key component.',
				reducedProblem:
					'**Problem.** Formalize and verify a configuration reducibility checker in Lean 4 that can certify the 633 reducible configurations used in the proof.',
				leanFormalization: `def checkReducible (config : Configuration) : Bool := sorry

theorem reducibility_checker_correct (config : Configuration) :
    checkReducible config = true → config.IsReducible := by
  sorry`,
				parentId: 'four-color-formalization'
			}
		]
	},
	{
		id: 'erdos-straus-conjecture',
		title: 'Erdős-Straus Conjecture',
		shortDescription: 'For every n >= 2, 4/n can be written as a sum of three unit fractions.',
		category: 'number-theory',
		tags: ['egyptian-fractions', 'diophantine', 'elementary'],
		difficulty: 'undergraduate',
		status: 'open',
		subProblemCount: 1,
		overview:
			'The Erdős-Straus conjecture is a problem in number theory concerning the representation of fractions as sums of unit fractions (Egyptian fractions). Despite its elementary statement, it remains unproved.\n\nThe conjecture has been verified computationally for all $n \\leq 10^{17}$.',
		preliminaries:
			'A **unit fraction** is a fraction of the form $\\frac{1}{k}$ for a positive integer $k$. An **Egyptian fraction** representation expresses a fraction as a sum of distinct unit fractions. In this conjecture, the unit fractions need not be distinct.',
		problemStatement:
			'**Conjecture (Erdős-Straus, 1948).** For every integer $n \\geq 2$, the fraction $\\frac{4}{n}$ can be written as\n$$\\frac{4}{n} = \\frac{1}{x} + \\frac{1}{y} + \\frac{1}{z}$$\nfor some positive integers $x, y, z$.',
		leanFormalization: `/-- The Erdős-Straus conjecture. -/
theorem erdos_straus (n : ℕ) (hn : 2 ≤ n) :
    ∃ x y z : ℕ, 0 < x ∧ 0 < y ∧ 0 < z ∧
    (4 : ℚ) / n = 1 / x + 1 / y + 1 / z := by
  sorry`,
		references: [
			{
				key: '[Guy2004]',
				citation:
					'R. K. Guy, *Unsolved Problems in Number Theory*, 3rd ed., Springer, 2004, Problem D11.'
			}
		],
		subProblems: [
			{
				id: 'erdos-straus-prime',
				name: 'Erdős-Straus for Primes',
				reduction:
					'If the conjecture holds for all primes, it holds for all integers (since $4/(mn) = 4/n \\cdot 1/m$ can be decomposed from the prime case). So it suffices to prove it for primes.',
				reducedProblem:
					'**Problem.** For every prime $p \\geq 3$, there exist positive integers $x, y, z$ with $\\frac{4}{p} = \\frac{1}{x} + \\frac{1}{y} + \\frac{1}{z}$.',
				leanFormalization: `theorem erdos_straus_prime (p : ℕ) (hp : Nat.Prime p) (hp3 : 3 ≤ p) :
    ∃ x y z : ℕ, 0 < x ∧ 0 < y ∧ 0 < z ∧
    (4 : ℚ) / p = 1 / x + 1 / y + 1 / z := by
  sorry`,
				parentId: 'erdos-straus-conjecture'
			}
		]
	},
	{
		id: 'chromatic-number-plane',
		title: 'Chromatic Number of the Plane',
		shortDescription:
			'How many colors are needed to color the plane so no two points at distance 1 share a color?',
		category: 'combinatorics',
		tags: ['chromatic-number', 'hadwiger-nelson', 'unit-distance'],
		difficulty: 'research',
		status: 'open',
		subProblemCount: 1,
		overview:
			'The Hadwiger-Nelson problem asks for the minimum number of colors needed to color the Euclidean plane such that no two points at distance exactly 1 from each other have the same color. This is the chromatic number of the unit-distance graph of $\\mathbb{R}^2$.\n\nIt is known that $5 \\leq \\chi \\leq 7$. The lower bound of 5 was proved by Aubrey de Grey in 2018, improving the previous bound of 4 that had stood since 1961.',
		preliminaries:
			'The **unit-distance graph** $G$ of $\\mathbb{R}^2$ has vertex set $\\mathbb{R}^2$ and an edge between $x$ and $y$ iff $\\|x - y\\| = 1$. The **chromatic number of the plane** is $\\chi(\\mathbb{R}^2) = \\chi(G)$, the minimum number of colors in a proper coloring of $G$.',
		problemStatement:
			'**Problem (Hadwiger-Nelson).** Determine the chromatic number $\\chi(\\mathbb{R}^2)$ of the unit-distance graph of the Euclidean plane.\n\nCurrently known: $5 \\leq \\chi(\\mathbb{R}^2) \\leq 7$.',
		leanFormalization: `/-- The Hadwiger-Nelson problem. -/
theorem chromatic_number_plane :
    unitDistanceGraph.chromaticNumber = 7 -- or whatever the answer is
    := by
  sorry`,
		references: [
			{
				key: '[deGrey2018]',
				citation:
					'A. D. N. J. de Grey, "The chromatic number of the plane is at least 5," *Geombinatorics*, 28(1), 18-31, 2018.',
				url: 'https://arxiv.org/abs/1804.02385'
			}
		],
		subProblems: [
			{
				id: 'cnp-upper-bound-6',
				name: 'Upper Bound Improvement to 6',
				reduction:
					'The upper bound of 7 comes from a hexagonal tiling coloring. Improving it to 6 would narrow the gap significantly.',
				reducedProblem:
					'**Problem.** Show that $\\chi(\\mathbb{R}^2) \\leq 6$, i.e., the plane can be colored with 6 colors such that no two points at unit distance share a color.',
				leanFormalization: `theorem cnp_upper_6 :
    unitDistanceGraph.chromaticNumber ≤ 6 := by
  sorry`,
				parentId: 'chromatic-number-plane'
			}
		]
	}
];

// Generate additional problems to reach ~50
const additionalProblems: Problem[] = [
	{
		id: 'kakeya-conjecture',
		title: 'Kakeya Conjecture',
		shortDescription: 'A Besicovitch set in R^n has Hausdorff dimension n.',
		category: 'analysis',
		tags: ['harmonic-analysis', 'geometric-measure-theory', 'hausdorff-dimension'],
		difficulty: 'research',
		status: 'open',
		subProblemCount: 1,
		overview: 'The Kakeya conjecture states that every Besicovitch set (a set containing a unit line segment in every direction) in $\\mathbb{R}^n$ must have full Hausdorff dimension $n$. The conjecture is known for $n = 2$ but remains open for $n \\geq 3$.\n\nIt has deep connections to harmonic analysis, additive combinatorics, and PDE theory.',
		preliminaries: 'A **Besicovitch set** (or **Kakeya set**) in $\\mathbb{R}^n$ is a set $E$ that contains a unit line segment pointing in every direction. The **Hausdorff dimension** $\\dim_H(E)$ measures the "fractal dimension" of the set.',
		problemStatement: '**Conjecture.** Every Besicovitch set $E \\subseteq \\mathbb{R}^n$ satisfies $\\dim_H(E) = n$.',
		leanFormalization: `theorem kakeya_conjecture (n : ℕ) (hn : 2 ≤ n)
    (E : Set (Fin n → ℝ)) (hE : IsBesicovitchSet E) :
    hausdorffDim E = n := by
  sorry`,
		references: [
			{ key: '[Wolff1999]', citation: 'T. Wolff, "Recent work connected with the Kakeya problem," in *Prospects in Mathematics*, AMS, 1999.' }
		],
		subProblems: [
			{
				id: 'kakeya-minkowski',
				name: 'Kakeya Minkowski Dimension',
				reduction: 'The Minkowski dimension version of the Kakeya conjecture (that every Kakeya set has Minkowski dimension $n$) is weaker and may be more approachable.',
				reducedProblem: '**Problem.** Every Besicovitch set in $\\mathbb{R}^n$ has upper Minkowski dimension $n$.',
				leanFormalization: `theorem kakeya_minkowski (n : ℕ) (E : Set (Fin n → ℝ)) (hE : IsBesicovitchSet E) :
    minkowskiDim E = n := by
  sorry`,
				parentId: 'kakeya-conjecture'
			}
		]
	},
	{
		id: 'jacobian-conjecture',
		title: 'Jacobian Conjecture',
		shortDescription: 'A polynomial map with constant nonzero Jacobian determinant is invertible.',
		category: 'algebra',
		tags: ['polynomial-maps', 'algebraic-geometry', 'commutative-algebra'],
		difficulty: 'research',
		status: 'open',
		subProblemCount: 1,
		overview: 'The Jacobian conjecture, posed by Keller in 1939, asserts that a polynomial map $F : \\mathbb{C}^n \\to \\mathbb{C}^n$ with everywhere nonzero Jacobian determinant is a polynomial automorphism (i.e., has a polynomial inverse).\n\nDespite numerous claimed proofs and many partial results, the conjecture remains open even for $n = 2$.',
		preliminaries: 'Let $F = (F_1, \\ldots, F_n) : \\mathbb{C}^n \\to \\mathbb{C}^n$ be a polynomial map, where each $F_i \\in \\mathbb{C}[x_1, \\ldots, x_n]$. The **Jacobian matrix** is $JF = (\\partial F_i / \\partial x_j)_{i,j}$ and the **Jacobian determinant** is $\\det(JF)$. If $\\det(JF) \\in \\mathbb{C}^*$ (a nonzero constant), the map is called a **Keller map**.',
		problemStatement: '**Conjecture (Keller, 1939).** If $F : \\mathbb{C}^n \\to \\mathbb{C}^n$ is a polynomial map with $\\det(JF) \\in \\mathbb{C}^*$, then $F$ has a polynomial inverse.',
		leanFormalization: `theorem jacobian_conjecture (n : ℕ) (F : MvPolynomial (Fin n) ℂ → MvPolynomial (Fin n) ℂ)
    (hF : IsPolynomialMap F) (hJ : jacobianDet F ∈ (ℂ : Set (MvPolynomial (Fin n) ℂ))) :
    ∃ G, IsPolynomialMap G ∧ F ∘ G = id ∧ G ∘ F = id := by
  sorry`,
		references: [
			{ key: '[Essen2000]', citation: 'A. van den Essen, *Polynomial Automorphisms and the Jacobian Conjecture*, Birkhäuser, 2000.' }
		],
		subProblems: [
			{
				id: 'jacobian-degree-3',
				name: 'Jacobian for Cubic Maps',
				reduction: 'By a result of Bass, Connell, and Wright (1982), the Jacobian conjecture for all $n$ reduces to the case of cubic polynomial maps (degree $\\leq 3$).',
				reducedProblem: '**Problem.** Prove the Jacobian conjecture for polynomial maps $F : \\mathbb{C}^n \\to \\mathbb{C}^n$ where each component has degree $\\leq 3$.',
				leanFormalization: `theorem jacobian_cubic (n : ℕ) (F : CubicPolynomialMap n ℂ)
    (hJ : jacobianDet F ∈ ℂ) :
    ∃ G, IsPolynomialMap G ∧ F ∘ G = id ∧ G ∘ F = id := by
  sorry`,
				parentId: 'jacobian-conjecture'
			}
		]
	},
	{
		id: 'somos-sequences',
		title: 'Integrality of Somos Sequences',
		shortDescription: 'Somos-k sequences produce integers for k <= 7 despite division in the recurrence.',
		category: 'combinatorics',
		tags: ['recurrence-relations', 'integer-sequences', 'cluster-algebras'],
		difficulty: 'graduate',
		status: 'open',
		subProblemCount: 1,
		overview: 'Somos sequences are defined by bilinear recurrences that involve division, yet miraculously produce only integers. Michael Somos discovered these sequences in the 1980s. Integrality has been proved for Somos-4 through Somos-7 using the theory of elliptic curves and cluster algebras, but a unified understanding is still sought.',
		preliminaries: 'The **Somos-$k$ sequence** is defined by $a_n = 1$ for $0 \\leq n < k$ and\n$$a_n = \\frac{\\sum_{i=1}^{\\lfloor k/2 \\rfloor} a_{n-i} a_{n-k+i}}{a_{n-k}}$$\nfor $n \\geq k$.',
		problemStatement: '**Problem.** Give a unified proof that the Somos-$k$ sequence consists entirely of positive integers for $k \\leq 7$, and determine for which $k \\geq 8$ integrality holds.',
		leanFormalization: `def somos (k : ℕ) : ℕ → ℤ := sorry

theorem somos_integral (k : ℕ) (hk : k ≤ 7) (n : ℕ) :
    0 < somos k n := by
  sorry`,
		references: [
			{ key: '[Gale1991]', citation: 'D. Gale, "The strange and surprising saga of the Somos sequences," *Mathematical Intelligencer*, 13(1), 40-42, 1991.' }
		],
		subProblems: [
			{
				id: 'somos-8',
				name: 'Somos-8 Non-integrality',
				reduction: 'The Somos-8 sequence is known to fail integrality. Proving this rigorously and identifying the first non-integer term is a concrete sub-problem.',
				reducedProblem: '**Problem.** Prove that the Somos-8 sequence is not integral, and find the smallest $n$ for which $a_n \\notin \\mathbb{Z}$.',
				leanFormalization: `theorem somos_8_not_integral :
    ∃ n : ℕ, ¬ (somos 8 n).isInteger := by
  sorry`,
				parentId: 'somos-sequences'
			}
		]
	},
	{
		id: 'frankl-conjecture',
		title: "Frankl's Union-Closed Sets Conjecture",
		shortDescription: 'In any union-closed family, some element appears in at least half the sets.',
		category: 'combinatorics',
		tags: ['extremal-combinatorics', 'set-systems', 'lattice-theory'],
		difficulty: 'research',
		status: 'open',
		subProblemCount: 1,
		overview: "Frankl's conjecture, posed in 1979, states that for any finite family of finite sets closed under union, there is an element that belongs to at least half of the sets. Despite its simple statement, the conjecture remains open.\n\nIn 2022, Gilmer proved that there exists an element in at least a constant fraction (~1%) of the sets, a significant breakthrough.",
		preliminaries: 'A family $\\mathcal{F}$ of finite sets is **union-closed** if for all $A, B \\in \\mathcal{F}$, we have $A \\cup B \\in \\mathcal{F}$. The **abundance** of an element $x$ with respect to $\\mathcal{F}$ is $|\\{A \\in \\mathcal{F} : x \\in A\\}|$.',
		problemStatement: "**Conjecture (Frankl, 1979).** If $\\mathcal{F}$ is a finite, union-closed family of sets with $\\mathcal{F} \\neq \\{\\emptyset\\}$, then there exists an element $x$ that belongs to at least $|\\mathcal{F}|/2$ members of $\\mathcal{F}$.",
		leanFormalization: `theorem frankl_conjecture {α : Type} [DecidableEq α]
    (F : Finset (Finset α)) (hclosed : UnionClosed F) (hne : F ≠ {∅}) :
    ∃ x : α, 2 * (F.filter (· ∈ x)).card ≥ F.card := by
  sorry`,
		references: [
			{ key: '[Gilmer2022]', citation: 'J. Gilmer, "A constant lower bound for the union-closed sets conjecture," preprint, arXiv:2211.09055, 2022.', url: 'https://arxiv.org/abs/2211.09055' }
		],
		subProblems: [
			{
				id: 'frankl-lattice',
				name: 'Frankl for Lattice Families',
				reduction: 'Union-closed families correspond to lattices. Proving the conjecture for lattice-theoretic families is a natural restriction.',
				reducedProblem: "**Problem.** Prove Frankl's conjecture for families of sets that form a lattice under inclusion.",
				leanFormalization: `theorem frankl_lattice {α : Type} [DecidableEq α]
    (F : Finset (Finset α)) (hclosed : UnionClosed F) (hlat : IsLattice F) :
    ∃ x : α, 2 * (F.filter (· ∈ x)).card ≥ F.card := by
  sorry`,
				parentId: 'frankl-conjecture'
			}
		]
	},
	{
		id: 'hadamard-conjecture',
		title: 'Hadamard Conjecture',
		shortDescription: 'A Hadamard matrix of order n exists for every n divisible by 4.',
		category: 'algebra',
		tags: ['combinatorial-design', 'matrices', 'coding-theory'],
		difficulty: 'research',
		status: 'open',
		subProblemCount: 1,
		overview: 'The Hadamard conjecture asserts that a Hadamard matrix (a square matrix with entries $\\pm 1$ and mutually orthogonal rows) exists for every order that is a multiple of 4. As of 2024, the smallest unsettled case is order 668.',
		preliminaries: 'A **Hadamard matrix** of order $n$ is an $n \\times n$ matrix $H$ with entries in $\\{-1, +1\\}$ satisfying $HH^T = nI_n$. Hadamard matrices can only exist for $n = 1, 2$, or $n \\equiv 0 \\pmod{4}$.',
		problemStatement: '**Conjecture (Hadamard, 1893).** For every positive integer $k$, there exists a Hadamard matrix of order $4k$.',
		leanFormalization: `theorem hadamard_conjecture (k : ℕ) (hk : 0 < k) :
    ∃ H : Matrix (Fin (4 * k)) (Fin (4 * k)) ℤ,
    IsHadamard H := by
  sorry`,
		references: [
			{ key: '[Horadam2007]', citation: 'K. J. Horadam, *Hadamard Matrices and Their Applications*, Princeton University Press, 2007.' }
		],
		subProblems: [
			{
				id: 'hadamard-paley',
				name: 'Paley Construction Gaps',
				reduction: 'The Paley construction produces Hadamard matrices of order $p + 1$ for primes $p \\equiv 3 \\pmod{4}$. Filling in the gaps left by this construction is a key challenge.',
				reducedProblem: '**Problem.** Construct Hadamard matrices of order $4k$ for values of $k$ not covered by the Paley construction or known product constructions.',
				leanFormalization: `theorem hadamard_non_paley (k : ℕ) (hk : ¬ IsPaleyOrder (4 * k)) :
    ∃ H : Matrix (Fin (4 * k)) (Fin (4 * k)) ℤ,
    IsHadamard H := by
  sorry`,
				parentId: 'hadamard-conjecture'
			}
		]
	},
	{
		id: 'schanuel-conjecture',
		title: "Schanuel's Conjecture",
		shortDescription: 'A transcendence conjecture that would resolve many open problems in number theory.',
		category: 'number-theory',
		tags: ['transcendence', 'exponential-function', 'algebraic-independence'],
		difficulty: 'research',
		status: 'open',
		subProblemCount: 1,
		overview: "Schanuel's conjecture is a far-reaching conjecture in transcendental number theory. If true, it would imply the algebraic independence of $e$ and $\\pi$, settle the question of whether $e + \\pi$ and $e\\pi$ are transcendental, and resolve many other open problems.",
		preliminaries: 'A set of complex numbers $\\{\\alpha_1, \\ldots, \\alpha_n\\}$ is **algebraically independent** over $\\mathbb{Q}$ if there is no nonzero polynomial $P \\in \\mathbb{Q}[x_1, \\ldots, x_n]$ with $P(\\alpha_1, \\ldots, \\alpha_n) = 0$. The **transcendence degree** $\\text{tr.deg}_\\mathbb{Q}(S)$ is the maximum size of an algebraically independent subset of $S$.',
		problemStatement: "**Conjecture (Schanuel).** If $\\alpha_1, \\ldots, \\alpha_n \\in \\mathbb{C}$ are linearly independent over $\\mathbb{Q}$, then the transcendence degree of\n$$\\{\\alpha_1, \\ldots, \\alpha_n, e^{\\alpha_1}, \\ldots, e^{\\alpha_n}\\}$$\nover $\\mathbb{Q}$ is at least $n$.",
		leanFormalization: `theorem schanuel_conjecture (n : ℕ) (α : Fin n → ℂ)
    (hli : LinearIndependent ℚ α) :
    transcDeg ℚ (Set.range α ∪ Set.range (fun i => Complex.exp (α i))) ≥ n := by
  sorry`,
		references: [
			{ key: '[Lang1966]', citation: 'S. Lang, *Introduction to Transcendental Numbers*, Addison-Wesley, 1966.' }
		],
		subProblems: [
			{
				id: 'schanuel-e-pi',
				name: 'Algebraic Independence of e and pi',
				reduction: "Schanuel's conjecture with $\\alpha_1 = 1$ and $\\alpha_2 = \\pi i$ immediately implies that $e$ and $\\pi$ are algebraically independent.",
				reducedProblem: '**Problem.** Prove that $e$ and $\\pi$ are algebraically independent over $\\mathbb{Q}$. That is, there is no nonzero polynomial $P \\in \\mathbb{Q}[x, y]$ with $P(e, \\pi) = 0$.',
				leanFormalization: `theorem e_pi_algebraically_independent :
    AlgebraicIndependent ℚ ![Real.exp 1, Real.pi] := by
  sorry`,
				parentId: 'schanuel-conjecture'
			}
		]
	},
	{
		id: 'uniqueness-of-markov-numbers',
		title: 'Uniqueness of Markov Numbers',
		shortDescription: 'Each Markov number determines a unique Markov triple up to permutation.',
		category: 'number-theory',
		tags: ['markov-triples', 'diophantine', 'algebraic'],
		difficulty: 'graduate',
		status: 'open',
		subProblemCount: 1,
		overview: 'The Markov Uniqueness Conjecture states that each Markov number (a number appearing in a solution to $x^2 + y^2 + z^2 = 3xyz$) uniquely determines the Markov triple $(x, y, z)$ up to ordering. The conjecture has been verified for Markov numbers up to $10^{35}$.',
		preliminaries: 'A **Markov triple** is a triple $(x, y, z)$ of positive integers satisfying\n$$x^2 + y^2 + z^2 = 3xyz.$$\nA **Markov number** is any number appearing in a Markov triple. The Markov tree generates all triples starting from $(1, 1, 1)$ via the mutation $z \\mapsto 3xy - z$.',
		problemStatement: '**Conjecture (Frobenius, 1913).** The largest element of a Markov triple uniquely determines the triple. That is, if $(x_1, y_1, z)$ and $(x_2, y_2, z)$ are Markov triples with $z = \\max(x_1, y_1, z) = \\max(x_2, y_2, z)$, then $\\{x_1, y_1\\} = \\{x_2, y_2\\}$.',
		leanFormalization: `theorem markov_uniqueness (x₁ y₁ x₂ y₂ z : ℕ)
    (h₁ : x₁^2 + y₁^2 + z^2 = 3 * x₁ * y₁ * z)
    (h₂ : x₂^2 + y₂^2 + z^2 = 3 * x₂ * y₂ * z)
    (hmax₁ : x₁ ≤ z ∧ y₁ ≤ z) (hmax₂ : x₂ ≤ z ∧ y₂ ≤ z) :
    ({x₁, y₁} : Finset ℕ) = {x₂, y₂} := by
  sorry`,
		references: [
			{ key: '[Aigner2013]', citation: 'M. Aigner, *Markov\'s Theorem and 100 Years of the Uniqueness Conjecture*, Springer, 2013.' }
		],
		subProblems: [
			{
				id: 'markov-prime-powers',
				name: 'Uniqueness for Prime Powers',
				reduction: 'The conjecture has been proved for Markov numbers that are prime powers. Extending this to composite numbers with many prime factors is a natural next step.',
				reducedProblem: '**Problem.** Prove the Markov uniqueness conjecture for Markov numbers that are products of at most two distinct primes.',
				leanFormalization: `theorem markov_uniqueness_semiprime (z : ℕ) (hz : IsSemiprime z)
    (x₁ y₁ x₂ y₂ : ℕ)
    (h₁ : IsMarkovTriple x₁ y₁ z) (h₂ : IsMarkovTriple x₂ y₂ z) :
    ({x₁, y₁} : Finset ℕ) = {x₂, y₂} := by
  sorry`,
				parentId: 'uniqueness-of-markov-numbers'
			}
		]
	},
	{
		id: 'borsuk-conjecture',
		title: 'Borsuk Partition Problem',
		shortDescription: 'Can every bounded set in R^n be partitioned into n+1 sets of smaller diameter?',
		category: 'geometry',
		tags: ['convex-geometry', 'combinatorial-geometry', 'partition'],
		difficulty: 'research',
		status: 'open',
		subProblemCount: 1,
		overview: "Borsuk conjectured in 1933 that every bounded set in $\\mathbb{R}^n$ can be divided into $n + 1$ parts of strictly smaller diameter. The conjecture was disproved in high dimensions by Kahn and Kalai in 1993, but the exact threshold dimension where it first fails remains unknown.\n\nThe conjecture is true for $n \\leq 3$ and false for $n \\geq 64$ (and likely for much smaller $n$).",
		preliminaries: 'The **diameter** of a set $S \\subseteq \\mathbb{R}^n$ is $\\text{diam}(S) = \\sup_{x, y \\in S} \\|x - y\\|$. Borsuk\'s question asks for the minimum number $f(n)$ of parts of smaller diameter needed to cover any bounded set in $\\mathbb{R}^n$.',
		problemStatement: '**Problem.** Determine $f(n)$, the minimum number such that every bounded set in $\\mathbb{R}^n$ can be partitioned into $f(n)$ sets, each of strictly smaller diameter.\n\nBorsuk conjectured $f(n) = n + 1$. Known: $f(n) = n + 1$ for $n \\leq 3$; $f(n) > n + 1$ for $n \\geq 64$.',
		leanFormalization: `-- Determine the Borsuk partition number f(n).
theorem borsuk_partition (n : ℕ) (hn : n ≤ 3) (S : Set (Fin n → ℝ)) (hS : IsBounded S) :
    ∃ P : Fin (n + 1) → Set (Fin n → ℝ),
    (∀ i, diameter (P i) < diameter S) ∧ S ⊆ ⋃ i, P i := by
  sorry`,
		references: [
			{ key: '[KahnKalai1993]', citation: 'J. Kahn and G. Kalai, "A counterexample to Borsuk\'s conjecture," *Bulletin of the AMS*, 29(1), 60-62, 1993.', url: 'https://doi.org/10.1090/S0273-0979-1993-00398-7' }
		],
		subProblems: [
			{
				id: 'borsuk-threshold',
				name: 'Threshold Dimension',
				reduction: 'Determining the smallest $n$ for which $f(n) > n + 1$ is a major open question. The best known bound is $n \\geq 64$ (Bondarenko, 2013).',
				reducedProblem: '**Problem.** Find the smallest dimension $n$ for which there exists a bounded set in $\\mathbb{R}^n$ that cannot be partitioned into $n + 1$ sets of smaller diameter.',
				leanFormalization: `theorem borsuk_threshold :
    ∃ n₀, (∀ n < n₀, borsukNumber n = n + 1) ∧ borsukNumber n₀ > n₀ + 1 := by
  sorry`,
				parentId: 'borsuk-conjecture'
			}
		]
	},
	{
		id: 'erdos-falconer-distance',
		title: 'Falconer Distance Conjecture',
		shortDescription: 'A set in R^d with Hausdorff dimension > d/2 has a distance set of positive measure.',
		category: 'analysis',
		tags: ['geometric-measure-theory', 'distance-sets', 'fourier-analysis'],
		difficulty: 'research',
		status: 'open',
		subProblemCount: 1,
		overview: "The Falconer distance conjecture is the continuous analogue of the Erdős distinct distances problem. It asks about the size of the distance set $\\Delta(E) = \\{|x - y| : x, y \\in E\\}$ for compact sets $E \\subseteq \\mathbb{R}^d$ based on the Hausdorff dimension of $E$.",
		preliminaries: 'For a compact set $E \\subseteq \\mathbb{R}^d$, the **distance set** is $\\Delta(E) = \\{|x - y| : x, y \\in E\\} \\subseteq [0, \\infty)$. The conjecture relates $\\dim_H(E)$ to the Lebesgue measure of $\\Delta(E)$.',
		problemStatement: '**Conjecture (Falconer, 1985).** If $E \\subseteq \\mathbb{R}^d$ is a compact set with $\\dim_H(E) > d/2$, then the distance set $\\Delta(E)$ has positive Lebesgue measure.',
		leanFormalization: `theorem falconer_distance (d : ℕ) (hd : 2 ≤ d) (E : Set (Fin d → ℝ))
    (hE : IsCompact E) (hdim : hausdorffDim E > d / 2) :
    MeasureTheory.volume (distanceSet E) > 0 := by
  sorry`,
		references: [
			{ key: '[Falconer1985]', citation: 'K. J. Falconer, "On the Hausdorff dimensions of distance sets," *Mathematika*, 32, 206-212, 1985.' }
		],
		subProblems: [
			{
				id: 'falconer-plane',
				name: 'Falconer in the Plane',
				reduction: 'The $d = 2$ case asks: if $\\dim_H(E) > 1$ for $E \\subseteq \\mathbb{R}^2$, does $\\Delta(E)$ have positive Lebesgue measure? The best known threshold is $\\dim_H(E) > 5/4$ (Du, Guth, Ou, Wang, Wilson, Zhang, 2023).',
				reducedProblem: '**Problem.** For compact $E \\subseteq \\mathbb{R}^2$ with $\\dim_H(E) > 1$, show that $\\Delta(E)$ has positive Lebesgue measure.',
				leanFormalization: `theorem falconer_plane (E : Set (Fin 2 → ℝ))
    (hE : IsCompact E) (hdim : hausdorffDim E > 1) :
    MeasureTheory.volume (distanceSet E) > 0 := by
  sorry`,
				parentId: 'erdos-falconer-distance'
			}
		]
	},
	{
		id: 'perfect-cuboid',
		title: 'Perfect Cuboid Problem',
		shortDescription: 'Does there exist a rectangular box with integer edges, face diagonals, and space diagonal?',
		category: 'number-theory',
		tags: ['diophantine', 'geometry-of-numbers', 'pythagorean'],
		difficulty: 'undergraduate',
		status: 'open',
		subProblemCount: 1,
		overview: 'A perfect cuboid (or perfect box) would be a rectangular parallelepiped where all edges, face diagonals, and the space diagonal are integers. Despite extensive computer searches, no perfect cuboid has been found, nor has it been proved that none exists.',
		preliminaries: 'A **perfect cuboid** has integer edge lengths $a, b, c > 0$ such that the face diagonals $\\sqrt{a^2 + b^2}$, $\\sqrt{b^2 + c^2}$, $\\sqrt{a^2 + c^2}$ and the space diagonal $\\sqrt{a^2 + b^2 + c^2}$ are all integers.',
		problemStatement: '**Problem.** Determine whether there exist positive integers $a, b, c$ such that $a^2 + b^2$, $b^2 + c^2$, $a^2 + c^2$, and $a^2 + b^2 + c^2$ are all perfect squares.',
		leanFormalization: `theorem perfect_cuboid_nonexistence :
    ¬ ∃ a b c : ℕ, 0 < a ∧ 0 < b ∧ 0 < c ∧
    IsSquare (a^2 + b^2) ∧ IsSquare (b^2 + c^2) ∧
    IsSquare (a^2 + c^2) ∧ IsSquare (a^2 + b^2 + c^2) := by
  sorry`,
		references: [
			{ key: '[Guy2004pc]', citation: 'R. K. Guy, *Unsolved Problems in Number Theory*, 3rd ed., Springer, 2004, Problem D18.' }
		],
		subProblems: [
			{
				id: 'perfect-cuboid-mod',
				name: 'Modular Obstructions',
				reduction: 'A common approach is to find modular obstructions. If a perfect cuboid exists, the edges must satisfy many simultaneous congruence conditions.',
				reducedProblem: '**Problem.** Determine all residue classes modulo $N$ (for suitable $N$) that the edges of a hypothetical perfect cuboid must belong to, and check for contradictions.',
				leanFormalization: `theorem perfect_cuboid_mod_obstruction (N : ℕ) :
    ∀ a b c : ZMod N, satisfiesCuboidCongruences a b c → False := by
  sorry`,
				parentId: 'perfect-cuboid'
			}
		]
	},
	{
		id: 'moving-sofa-problem',
		title: 'Moving Sofa Problem',
		shortDescription: 'What is the largest area of a shape that can be moved around an L-shaped hallway?',
		category: 'geometry',
		tags: ['optimization', 'plane-geometry', 'shape'],
		difficulty: 'research',
		status: 'open',
		subProblemCount: 1,
		overview: "The moving sofa problem asks for the rigid two-dimensional shape of largest area that can be maneuvered through an L-shaped planar region. The hallway is 1 unit wide. Gerver's sofa (1992) has area $\\approx 2.2195$ and is conjectured to be optimal. Jineon Baek (2024) announced a proof of optimality.",
		preliminaries: 'Consider two unit-width corridors meeting at a right angle. The **sofa constant** $\\sigma$ is the supremum of areas of connected planar regions that can be continuously moved through this L-shaped hallway.',
		problemStatement: "**Problem (Hammersley, 1968).** Determine the sofa constant $\\sigma$.\n\nConjectured: $\\sigma = $ Gerver's sofa area $\\approx 2.2195\\ldots$",
		leanFormalization: `theorem moving_sofa_optimal :
    sofaConstant = gerverSofaArea := by
  sorry`,
		references: [
			{ key: '[Gerver1992]', citation: 'J. Gerver, "On moving a sofa around a corner," *Geometriae Dedicata*, 42, 267-283, 1992.' }
		],
		subProblems: [
			{
				id: 'sofa-upper-bound',
				name: 'Improved Upper Bound',
				reduction: 'The trivial upper bound is $2\\sqrt{2} \\approx 2.828$. Kallus and Romik (2018) improved it to $2.37$. Further tightening the upper bound toward $2.2195$ would help confirm optimality.',
				reducedProblem: '**Problem.** Prove that $\\sigma \\leq 2.22$, improving the known upper bound.',
				leanFormalization: `theorem sofa_upper_bound :
    sofaConstant ≤ 2.22 := by
  sorry`,
				parentId: 'moving-sofa-problem'
			}
		]
	}
];

const allProblems = [...problems, ...additionalProblems];

// Ensure subProblemCount is accurate
for (const p of allProblems) {
	p.subProblemCount = p.subProblems.length;
}

const outDir = join(import.meta.dir, '..', 'src', 'data');
mkdirSync(outDir, { recursive: true });

writeFileSync(join(outDir, 'problems.json'), JSON.stringify(allProblems, null, 2));

console.log(`Generated ${allProblems.length} problems with ${allProblems.reduce((s, p) => s + p.subProblems.length, 0)} sub-problems total.`);
console.log(`Written to ${join(outDir, 'problems.json')}`);
