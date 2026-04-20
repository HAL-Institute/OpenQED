<script lang="ts">
	import { Search, X } from 'lucide-svelte';

	let {
		query = $bindable(''),
		category = $bindable(''),
		difficulty = $bindable(''),
		status = $bindable(''),
		categories = [] as string[],
		difficulties = [] as string[]
	}: {
		query: string;
		category: string;
		difficulty: string;
		status: string;
		categories: string[];
		difficulties: string[];
	} = $props();

	function clearFilters() {
		query = '';
		category = '';
		difficulty = '';
		status = '';
	}

	function formatLabel(s: string): string {
		return s
			.split('-')
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(' ');
	}

	const hasFilters = $derived(query || category || difficulty || status);
</script>

<div class="flex flex-col gap-3">
	<div class="relative">
		<Search size={16} class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)" />
		<input
			type="text"
			bind:value={query}
			placeholder="Search problems..."
			class="h-10 w-full rounded-lg border border-(--color-border) bg-(--color-surface) pl-9 pr-4 text-sm text-(--color-text) outline-none placeholder:text-(--color-text-muted) focus:border-(--color-accent) transition-colors"
		/>
	</div>

	<div class="flex flex-wrap items-center gap-2">
		<select
			bind:value={category}
			class="h-8 rounded-md border border-(--color-border) bg-(--color-surface) px-2 text-xs text-(--color-text) outline-none focus:border-(--color-accent) transition-colors"
		>
			<option value="">All Categories</option>
			{#each categories as cat}
				<option value={cat}>{formatLabel(cat)}</option>
			{/each}
		</select>

		<select
			bind:value={difficulty}
			class="h-8 rounded-md border border-(--color-border) bg-(--color-surface) px-2 text-xs text-(--color-text) outline-none focus:border-(--color-accent) transition-colors"
		>
			<option value="">All Difficulties</option>
			{#each difficulties as diff}
				<option value={diff}>{formatLabel(diff)}</option>
			{/each}
		</select>

		<select
			bind:value={status}
			class="h-8 rounded-md border border-(--color-border) bg-(--color-surface) px-2 text-xs text-(--color-text) outline-none focus:border-(--color-accent) transition-colors"
		>
			<option value="">All Status</option>
			<option value="open">Open</option>
			<option value="closed">Closed</option>
		</select>

		{#if hasFilters}
			<button
				onclick={clearFilters}
				class="flex h-8 items-center gap-1 rounded-md px-2 text-xs text-(--color-text-muted) transition-colors hover:text-(--color-text)"
			>
				<X size={12} />
				Clear
			</button>
		{/if}
	</div>
</div>
