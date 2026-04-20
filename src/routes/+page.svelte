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
	let status = $state('');

	const filteredProblems = $derived.by(() => {
		const searched = searchProblems(fuse, query, allProblems);
		return filterProblems(searched, category, difficulty, status);
	});
</script>

<div class="mx-auto max-w-3xl px-6 py-8">
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-(--color-text)">Open Problems</h1>
		<p class="mt-1 text-sm text-(--color-text-secondary)">
			Browse and contribute to open mathematical problems with Lean 4 formalizations.
		</p>
	</div>

	<div class="mb-6">
		<SearchBar
			bind:query
			bind:category
			bind:difficulty
			bind:status
			{categories}
			{difficulties}
		/>
	</div>

	<ProblemList problems={filteredProblems} />
</div>
