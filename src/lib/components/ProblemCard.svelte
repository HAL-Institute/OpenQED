<script lang="ts">
	import type { ProblemSummary } from '$lib/utils/types';
	import { ChevronRight } from 'lucide-svelte';

	let { problem }: { problem: ProblemSummary } = $props();

	function formatLabel(s: string): string {
		return s
			.split('-')
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(' ');
	}
</script>

<a
	href="/problem/{problem.id}"
	class="group flex items-center justify-between rounded-lg px-4 py-3.5 transition-colors hover:bg-(--color-bg-tertiary)"
>
	<div class="min-w-0 flex-1">
		<div class="flex items-center gap-2">
			<h3 class="truncate text-sm font-medium text-(--color-text)">
				{problem.title}
			</h3>
		</div>
		<p class="mt-1 truncate text-xs text-(--color-text-secondary)">
			{problem.shortDescription}
		</p>
		<div class="mt-2 flex items-center gap-3 text-[10px] text-(--color-text-muted)">
			<span>{formatLabel(problem.category)}</span>
			<span>{formatLabel(problem.difficulty)}</span>
			{#if problem.subProblemCount > 0}
				<span>{problem.subProblemCount} sub-problem{problem.subProblemCount !== 1 ? 's' : ''}</span>
			{/if}
		</div>
	</div>
	<ChevronRight size={14} class="ml-3 shrink-0 text-(--color-text-muted) opacity-0 transition-opacity group-hover:opacity-100" />
</a>
