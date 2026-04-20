<script lang="ts">
	import { X } from 'lucide-svelte';
	import { tabs, activeTabId, closeTab, setActiveTab } from '$lib/stores/tabs';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex flex-col h-full">
	<!-- Tab bar -->
	<div class="flex items-end gap-0 border-b border-(--color-border) overflow-x-auto scrollbar-none">
		{#each $tabs as tab (tab.id)}
			<div
				class="group flex shrink-0 items-center gap-1.5 border-b-2 -mb-px
					{$activeTabId === tab.id
						? 'border-(--color-accent)'
						: 'border-transparent hover:border-(--color-border)'}"
			>
				<button
					onclick={() => setActiveTab(tab.id)}
					class="px-4 py-2.5 text-xs font-medium transition-colors
						{$activeTabId === tab.id
							? 'text-(--color-text)'
							: 'text-(--color-text-muted) hover:text-(--color-text-secondary)'}"
				>
					<span class="truncate max-w-[150px]">{tab.label}</span>
				</button>
				{#if tab.closable}
					<button
						onclick={() => closeTab(tab.id)}
						class="mr-2 rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-(--color-bg-tertiary) text-(--color-text-muted)"
						aria-label="Close tab"
					>
						<X size={12} />
					</button>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Tab content -->
	<div class="flex-1 overflow-y-auto">
		{@render children()}
	</div>
</div>
