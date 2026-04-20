<script lang="ts">
	import { CheckCircle, GitBranch } from 'lucide-svelte';

	let {
		onclose,
		onreduce
	}: {
		onclose: () => void;
		onreduce: () => void;
	} = $props();
</script>

<div class="flex items-center gap-3 pt-6 border-t border-(--color-border) mt-6">
	<button
		onclick={onclose}
		class="flex items-center gap-2 rounded-lg bg-(--color-accent) px-4 py-2 text-xs font-medium text-black transition-colors hover:bg-(--color-accent-hover)"
	>
		<CheckCircle size={14} />
		Close
	</button>
	<button
		onclick={onreduce}
		class="flex items-center gap-2 rounded-lg border border-(--color-border) px-4 py-2 text-xs font-medium text-(--color-text-secondary) transition-colors hover:border-(--color-accent)/40 hover:text-(--color-text)"
	>
		<GitBranch size={14} />
		Reduce
	</button>
</div>
