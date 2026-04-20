<script lang="ts">
	import type { SubProblem } from '$lib/utils/types';
	import Markdown from './Markdown.svelte';
	import LeanDropdown from './LeanDropdown.svelte';
	import ActionButtons from './ActionButtons.svelte';
	import SubmitModal from './SubmitModal.svelte';
	import { Pencil } from 'lucide-svelte';

	let { subProblem }: { subProblem: SubProblem } = $props();

	let modalOpen = $state(false);
	let modalMode = $state<'close' | 'reduce'>('close');

	function openModal(mode: 'close' | 'reduce') {
		modalMode = mode;
		modalOpen = true;
	}
</script>

<div class="p-6 max-w-3xl">
	<!-- Name -->
	<h1 class="text-xl font-bold text-(--color-text) mb-4">{subProblem.name}</h1>

	<!-- Reduction -->
	<div class="relative group/section">
		<div class="flex items-center gap-2 mb-2">
			<h2 class="text-sm font-semibold text-(--color-text)">Reduction</h2>
			<button class="opacity-0 group-hover/section:opacity-100 transition-opacity rounded p-0.5 text-(--color-text-muted) hover:text-(--color-accent)" aria-label="Propose edit">
				<Pencil size={12} />
			</button>
		</div>
		<Markdown content={subProblem.reduction} />
	</div>

	<!-- Reduced Problem -->
	<div class="relative group/section mt-6">
		<div class="flex items-center gap-2 mb-2">
			<h2 class="text-sm font-semibold text-(--color-text)">Reduced Problem</h2>
			<button class="opacity-0 group-hover/section:opacity-100 transition-opacity rounded p-0.5 text-(--color-text-muted) hover:text-(--color-accent)" aria-label="Propose edit">
				<Pencil size={12} />
			</button>
		</div>
		<Markdown content={subProblem.reducedProblem} />
		<LeanDropdown code={subProblem.leanFormalization} />
	</div>

	<!-- Action buttons -->
	<ActionButtons
		onclose={() => openModal('close')}
		onreduce={() => openModal('reduce')}
	/>
</div>

<SubmitModal
	bind:open={modalOpen}
	mode={modalMode}
	problemTitle={subProblem.name}
/>
