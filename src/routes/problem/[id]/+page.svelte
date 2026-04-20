<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import TabContainer from '$lib/components/TabContainer.svelte';
	import TabDescription from '$lib/components/TabDescription.svelte';
	import TabGraph from '$lib/components/TabGraph.svelte';
	import TabSubproblem from '$lib/components/TabSubproblem.svelte';
	import { tabs, activeTabId, activeTab, resetTabs } from '$lib/stores/tabs';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const problem = $derived(data.problem);

	onMount(() => {
		resetTabs();
	});

	function getSubProblem(id: string) {
		return data.problem.subProblems.find((sp) => sp.id === id);
	}
</script>

<svelte:head>
	<title>{problem.title} - OpenQED</title>
</svelte:head>

<div class="flex flex-col h-[calc(100vh-3.5rem)]">
	<!-- Back link -->
	<div class="flex items-center gap-2 border-b border-(--color-border) px-6 py-2">
		<a
			href="/"
			class="flex items-center gap-1 text-xs text-(--color-text-muted) transition-colors hover:text-(--color-text)"
		>
			<ArrowLeft size={14} />
			Back to problems
		</a>
	</div>

	<!-- Tab system -->
	<TabContainer>
		{#if $activeTab?.type === 'description'}
			<TabDescription {problem} />
		{:else if $activeTab?.type === 'graph'}
			<TabGraph {problem} />
		{:else if $activeTab?.type === 'subproblem' && $activeTab?.subProblemId}
			{@const sub = getSubProblem($activeTab.subProblemId)}
			{#if sub}
				<TabSubproblem subProblem={sub} />
			{/if}
		{/if}
	</TabContainer>
</div>
