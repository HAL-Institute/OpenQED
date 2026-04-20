<script lang="ts">
	import type { Problem } from '$lib/utils/types';
	import Markdown from './Markdown.svelte';
	import LeanDropdown from './LeanDropdown.svelte';
	import ActionButtons from './ActionButtons.svelte';
	import SubmitModal from './SubmitModal.svelte';
	import { Pencil } from 'lucide-svelte';

	let { problem }: { problem: Problem } = $props();

	let modalOpen = $state(false);
	let modalMode = $state<'close' | 'reduce'>('close');

	function openModal(mode: 'close' | 'reduce') {
		modalMode = mode;
		modalOpen = true;
	}

	// Format references as markdown
	const referencesMarkdown = $derived(
		problem.references
			.map((r) => {
				const link = r.url ? ` [link](${r.url})` : '';
				return `- **${r.key}** ${r.citation}${link}`;
			})
			.join('\n')
	);
</script>

<div class="p-6 max-w-3xl">
	<!-- Title -->
	<h1 class="text-xl font-bold text-(--color-text) mb-1">{problem.title}</h1>
	<p class="text-xs text-(--color-text-muted) mb-6">{problem.shortDescription}</p>

	<!-- Overview -->
	<div class="relative group/section">
		<div class="flex items-center gap-2 mb-2">
			<h2 class="text-sm font-semibold text-(--color-text)">Overview</h2>
			<button class="opacity-0 group-hover/section:opacity-100 transition-opacity rounded p-0.5 text-(--color-text-muted) hover:text-(--color-accent)" aria-label="Propose edit">
				<Pencil size={12} />
			</button>
		</div>
		<Markdown content={problem.overview} />
	</div>

	<!-- Preliminaries & Notation -->
	<div class="relative group/section mt-6">
		<div class="flex items-center gap-2 mb-2">
			<h2 class="text-sm font-semibold text-(--color-text)">Preliminaries & Notation</h2>
			<button class="opacity-0 group-hover/section:opacity-100 transition-opacity rounded p-0.5 text-(--color-text-muted) hover:text-(--color-accent)" aria-label="Propose edit">
				<Pencil size={12} />
			</button>
		</div>
		<Markdown content={problem.preliminaries} />
	</div>

	<!-- Problem Statement -->
	<div class="relative group/section mt-6">
		<div class="flex items-center gap-2 mb-2">
			<h2 class="text-sm font-semibold text-(--color-text)">Problem</h2>
			<button class="opacity-0 group-hover/section:opacity-100 transition-opacity rounded p-0.5 text-(--color-text-muted) hover:text-(--color-accent)" aria-label="Propose edit">
				<Pencil size={12} />
			</button>
		</div>
		<Markdown content={problem.problemStatement} />
		<LeanDropdown code={problem.leanFormalization} />
	</div>

	<!-- References -->
	{#if problem.references.length > 0}
		<div class="relative group/section mt-6">
			<div class="flex items-center gap-2 mb-2">
				<h2 class="text-sm font-semibold text-(--color-text)">References</h2>
				<button class="opacity-0 group-hover/section:opacity-100 transition-opacity rounded p-0.5 text-(--color-text-muted) hover:text-(--color-accent)" aria-label="Propose edit">
					<Pencil size={12} />
				</button>
			</div>
			<Markdown content={referencesMarkdown} />
		</div>
	{/if}

	<!-- Action buttons -->
	<ActionButtons
		onclose={() => openModal('close')}
		onreduce={() => openModal('reduce')}
	/>
</div>

<SubmitModal
	bind:open={modalOpen}
	mode={modalMode}
	problemTitle={problem.title}
/>
