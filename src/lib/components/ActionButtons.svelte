<script lang="ts">
	import { page } from '$app/stores';
	import { CheckCircle, GitBranch } from 'lucide-svelte';

	let {
		onclose,
		onreduce
	}: {
		onclose: () => void;
		onreduce: () => void;
	} = $props();

	const user = $derived($page.data.user);
</script>

<div class="flex items-center gap-3 pt-6 mt-6 border-t border-(--color-border)">
	{#if user}
		<button
			onclick={onclose}
			class="flex items-center gap-2 rounded-lg bg-(--color-text) px-4 py-2 text-xs font-medium text-(--color-bg) transition-opacity hover:opacity-90"
		>
			<CheckCircle size={14} />
			Close
		</button>
		{#if user.verified}
			<button
				onclick={onreduce}
				class="flex items-center gap-2 rounded-lg bg-(--color-bg-tertiary) px-4 py-2 text-xs font-medium text-(--color-text-secondary) transition-colors hover:text-(--color-text)"
			>
				<GitBranch size={14} />
				Reduce
			</button>
		{:else}
			<span class="text-[10px] text-(--color-text-muted)">
				Verify your account to submit reductions
			</span>
		{/if}
	{:else}
		<a
			href="/login"
			class="text-xs text-(--color-text-muted) underline underline-offset-2 transition-colors hover:text-(--color-text)"
		>
			Sign in to contribute
		</a>
	{/if}
</div>
