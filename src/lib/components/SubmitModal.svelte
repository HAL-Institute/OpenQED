<script lang="ts">
	import { fade } from 'svelte/transition';
	import { X } from 'lucide-svelte';

	let {
		open = $bindable(false),
		mode,
		problemTitle
	}: {
		open: boolean;
		mode: 'close' | 'reduce';
		problemTitle: string;
	} = $props();

	let code = $state('');

	function handleSubmit() {
		if (!code.trim()) return;
		// TODO: GitHub OAuth + PR creation
		alert(`Lean code submitted for ${mode === 'close' ? 'closing' : 'reducing'} "${problemTitle}".\n\nThis will create a PR in the Lean repo once GitHub OAuth is configured.`);
		code = '';
		open = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') open = false;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
		onclick={() => (open = false)}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- Modal -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="mx-4 w-full max-w-lg rounded-xl border border-(--color-border) bg-(--color-bg) p-6 shadow-2xl"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-sm font-semibold text-(--color-text)">
					{mode === 'close' ? 'Submit Proof' : 'Submit Reduction'}
				</h2>
				<button
					onclick={() => (open = false)}
					class="rounded-lg p-1 text-(--color-text-muted) transition-colors hover:bg-(--color-bg-tertiary)"
				>
					<X size={16} />
				</button>
			</div>

			<p class="mb-3 text-xs text-(--color-text-secondary)">
				{mode === 'close'
					? `Submit Lean 4 code that proves "${problemTitle}". This will create a PR in the Lean repository.`
					: `Submit Lean 4 code that reduces "${problemTitle}" to simpler sub-problems. This will create a PR in the Lean repository.`}
			</p>

			<textarea
				bind:value={code}
				placeholder="-- Paste your Lean 4 code here..."
				class="h-48 w-full resize-none rounded-lg border border-(--color-border) bg-(--color-bg-tertiary) p-3 font-mono text-xs text-(--color-text) outline-none placeholder:text-(--color-text-muted) focus:border-(--color-accent) transition-colors"
			></textarea>

			<div class="mt-4 flex items-center justify-end gap-2">
				<button
					onclick={() => (open = false)}
					class="rounded-lg px-4 py-2 text-xs font-medium text-(--color-text-secondary) transition-colors hover:text-(--color-text)"
				>
					Cancel
				</button>
				<button
					onclick={handleSubmit}
					disabled={!code.trim()}
					class="rounded-lg bg-(--color-accent) px-4 py-2 text-xs font-medium text-black transition-colors hover:bg-(--color-accent-hover) disabled:opacity-40 disabled:cursor-not-allowed"
				>
					{mode === 'close' ? 'Submit Proof' : 'Submit Reduction'}
				</button>
			</div>
		</div>
	</div>
{/if}
