<script lang="ts">
	import type { ProblemSummary } from '$lib/utils/types';
	import ProblemCard from './ProblemCard.svelte';

	let { problems }: { problems: ProblemSummary[] } = $props();
</script>

{#if problems.length === 0}
	<div class="flex flex-col items-center justify-center py-20 text-center">
		<p class="text-sm text-(--color-text-muted)">No problems found.</p>
		<p class="mt-1 text-xs text-(--color-text-muted)">Try adjusting your search or filters.</p>
	</div>
{:else}
	<div class="flex flex-col gap-2">
		{#each problems as problem (problem.id)}
			<ProblemCard {problem} />
		{/each}
	</div>
	<p class="mt-4 text-center text-xs text-(--color-text-muted)">
		{problems.length} problem{problems.length !== 1 ? 's' : ''}
	</p>
{/if}
