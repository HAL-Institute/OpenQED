<script lang="ts">
	import type { Problem } from '$lib/utils/types';
	import ForceGraph from './ForceGraph.svelte';
	import { openSubproblemTab } from '$lib/stores/tabs';

	let { problem }: { problem: Problem } = $props();

	function handleNodeClick(subProblemId: string, label: string) {
		openSubproblemTab(subProblemId, label);
	}
</script>

<div class="h-full min-h-[500px]">
	{#if problem.subProblems.length === 0}
		<div class="flex h-full items-center justify-center">
			<p class="text-sm text-(--color-text-muted)">No sub-problems or reductions yet.</p>
		</div>
	{:else}
		<ForceGraph {problem} onNodeClick={handleNodeClick} />
	{/if}
</div>
