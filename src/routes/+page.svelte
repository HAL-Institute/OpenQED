<script lang="ts">
	import { getAllProblems, getAllCategories, getAllDifficulties } from '$lib/utils/data';
	import { createSearchIndex, searchProblems, filterProblems } from '$lib/utils/search';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import ProblemList from '$lib/components/ProblemList.svelte';

	const allProblems = getAllProblems();
	const categories = getAllCategories();
	const difficulties = getAllDifficulties();
	const fuse = createSearchIndex(allProblems);

	let query = $state('');
	let category = $state('');
	let difficulty = $state('');

	const filteredProblems = $derived.by(() => {
		const searched = searchProblems(fuse, query, allProblems);
		return filterProblems(searched, category, difficulty, '');
	});
</script>

<div class="mx-auto max-w-2xl px-6 pt-16 pb-8">
	<div class="text-center mb-10">
		<h1 class="text-3xl font-semibold tracking-tight text-(--color-text)">Open Problems</h1>
		<p class="mt-2 text-sm text-(--color-text-muted)">
			Browse and contribute to open mathematical problems with Lean 4 formalizations
		</p>
	</div>

	<SearchBar
		bind:query
		bind:category
		bind:difficulty
		{categories}
		{difficulties}
	/>

	<div class="mt-8">
		<ProblemList problems={filteredProblems} />
	</div>
</div>
