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

	const difficultyColor: Record<string, string> = {
		undergraduate: 'bg-green-500/15 text-green-400',
		graduate: 'bg-blue-500/15 text-blue-400',
		research: 'bg-amber-500/15 text-amber-400',
		millennium: 'bg-purple-500/15 text-purple-400'
	};
</script>

<a
	href="/problem/{problem.id}"
	class="group flex items-center justify-between rounded-lg border border-(--color-border) bg-(--color-surface) px-5 py-4 transition-all hover:border-(--color-accent)/40 hover:bg-(--color-bg-tertiary)"
>
	<div class="min-w-0 flex-1">
		<div class="flex items-center gap-2">
			<h3 class="truncate text-sm font-medium text-(--color-text) group-hover:text-(--color-accent) transition-colors">
				{problem.title}
			</h3>
			{#if problem.status === 'open'}
				<span class="shrink-0 rounded-full bg-(--color-accent)/15 px-2 py-0.5 text-[10px] font-medium text-(--color-accent)">
					Open
				</span>
			{:else}
				<span class="shrink-0 rounded-full bg-(--color-text-muted)/15 px-2 py-0.5 text-[10px] font-medium text-(--color-text-muted)">
					Closed
				</span>
			{/if}
		</div>
		<p class="mt-1 truncate text-xs text-(--color-text-secondary)">
			{problem.shortDescription}
		</p>
		<div class="mt-2 flex items-center gap-2">
			<span class="rounded-md bg-(--color-bg-tertiary) px-2 py-0.5 text-[10px] text-(--color-text-muted)">
				{formatLabel(problem.category)}
			</span>
			<span class="rounded-md px-2 py-0.5 text-[10px] {difficultyColor[problem.difficulty] ?? ''}">
				{formatLabel(problem.difficulty)}
			</span>
			{#if problem.subProblemCount > 0}
				<span class="text-[10px] text-(--color-text-muted)">
					{problem.subProblemCount} sub-problem{problem.subProblemCount !== 1 ? 's' : ''}
				</span>
			{/if}
		</div>
	</div>
	<ChevronRight size={16} class="ml-3 shrink-0 text-(--color-text-muted) opacity-0 transition-opacity group-hover:opacity-100" />
</a>
