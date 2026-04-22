<script lang="ts">
	import { ArrowLeft, ChevronLeft } from 'lucide-svelte';
	import Markdown from '$lib/components/Markdown.svelte';
	import LeanDropdown from '$lib/components/LeanDropdown.svelte';
	import ActionButtons from '$lib/components/ActionButtons.svelte';
	import SubmitModal from '$lib/components/SubmitModal.svelte';
	import ForceGraph from '$lib/components/ForceGraph.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const problem = $derived(data.problem);

	let activeSubProblemId = $state<string | null>(null);
	let modalOpen = $state(false);
	let modalMode = $state<'close' | 'reduce'>('close');

	// Resizable split pane
	let splitPercent = $state(50);
	let draggingDivider = $state(false);
	let containerEl: HTMLDivElement | undefined = $state();

	const activeSubProblem = $derived(
		activeSubProblemId
			? problem.subProblems.find((sp) => sp.id === activeSubProblemId)
			: null
	);

	const referencesMarkdown = $derived(
		problem.references
			.map((r) => {
				const link = r.url ? ` [link](${r.url})` : '';
				return `- **${r.key}** ${r.citation}${link}`;
			})
			.join('\n')
	);

	function openModal(mode: 'close' | 'reduce') {
		modalMode = mode;
		modalOpen = true;
	}

	function handleNodeClick(subProblemId: string, _label: string) {
		activeSubProblemId = subProblemId;
	}

	function startDividerDrag(e: PointerEvent) {
		draggingDivider = true;
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onDividerMove(e: PointerEvent) {
		if (!draggingDivider || !containerEl) return;
		const rect = containerEl.getBoundingClientRect();
		const pct = ((e.clientX - rect.left) / rect.width) * 100;
		splitPercent = Math.max(25, Math.min(75, pct));
	}

	function endDividerDrag() {
		draggingDivider = false;
	}
</script>

<svelte:head>
	<title>{problem.title} - OpenQED</title>
</svelte:head>

<div
	bind:this={containerEl}
	class="flex h-[calc(100vh-3.5rem)]"
	class:select-none={draggingDivider}
	onpointermove={onDividerMove}
	onpointerup={endDividerDrag}
	role="none"
>
	<!-- Left: Content -->
	<div class="overflow-y-auto p-8" style="width: {splitPercent}%">
		<div class="max-w-2xl">
			{#if activeSubProblem}
				<button
					onclick={() => (activeSubProblemId = null)}
					class="flex items-center gap-1 text-xs text-(--color-text-muted) mb-6 transition-colors hover:text-(--color-text)"
				>
					<ChevronLeft size={14} />
					Back to {problem.title}
				</button>

				<h1 class="text-xl font-semibold text-(--color-text) mb-6">{activeSubProblem.name}</h1>

				<div class="mb-8">
					<h2 class="text-xs font-medium uppercase tracking-wide text-(--color-text-muted) mb-3">Reduction</h2>
					<Markdown content={activeSubProblem.reduction} />
				</div>

				<div class="mb-8">
					<h2 class="text-xs font-medium uppercase tracking-wide text-(--color-text-muted) mb-3">Reduced Problem</h2>
					<Markdown content={activeSubProblem.reducedProblem} />
					<LeanDropdown code={activeSubProblem.leanFormalization} />
				</div>
			{:else}
				<a
					href="/"
					class="flex items-center gap-1 text-xs text-(--color-text-muted) mb-6 transition-colors hover:text-(--color-text)"
				>
					<ArrowLeft size={14} />
					Back to problems
				</a>

				<h1 class="text-xl font-semibold text-(--color-text) mb-1">{problem.title}</h1>
				<p class="text-xs text-(--color-text-muted) mb-8">{problem.shortDescription}</p>

				<div class="mb-8">
					<h2 class="text-xs font-medium uppercase tracking-wide text-(--color-text-muted) mb-3">Problem</h2>
					<Markdown content={problem.problemStatement} />
					<LeanDropdown code={problem.leanFormalization} />
				</div>

				<div class="mb-8">
					<h2 class="text-xs font-medium uppercase tracking-wide text-(--color-text-muted) mb-3">Overview</h2>
					<Markdown content={problem.overview} />
				</div>

				<div class="mb-8">
					<h2 class="text-xs font-medium uppercase tracking-wide text-(--color-text-muted) mb-3">Preliminaries & Notation</h2>
					<Markdown content={problem.preliminaries} />
				</div>

				{#if problem.references.length > 0}
					<div class="mb-8">
						<h2 class="text-xs font-medium uppercase tracking-wide text-(--color-text-muted) mb-3">References</h2>
						<Markdown content={referencesMarkdown} />
					</div>
				{/if}
			{/if}

			<ActionButtons
				onclose={() => openModal('close')}
				onreduce={() => openModal('reduce')}
			/>
		</div>
	</div>

	<!-- Divider -->
	<div
		class="w-px shrink-0 bg-(--color-border) cursor-col-resize relative group"
		onpointerdown={startDividerDrag}
		role="separator"
		aria-orientation="vertical"
		tabindex="-1"
	>
		<div class="absolute inset-y-0 -left-1 -right-1 group-hover:bg-(--color-text-muted)/10 transition-colors {draggingDivider ? 'bg-(--color-text-muted)/10' : ''}"></div>
	</div>

	<!-- Right: Graph -->
	<div class="overflow-hidden bg-(--color-bg-secondary)" style="width: {100 - splitPercent}%">
		{#if problem.subProblems.length === 0}
			<div class="flex h-full items-center justify-center">
				<p class="text-xs text-(--color-text-muted)">No sub-problems yet</p>
			</div>
		{:else}
			<ForceGraph {problem} onNodeClick={handleNodeClick} />
		{/if}
	</div>
</div>

<SubmitModal
	bind:open={modalOpen}
	mode={modalMode}
	problemId={activeSubProblem?.id ?? problem.id}
	problemTitle={activeSubProblem?.name ?? problem.title}
/>
