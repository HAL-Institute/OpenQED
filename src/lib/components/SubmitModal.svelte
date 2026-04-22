<script lang="ts">
	import { fade } from 'svelte/transition';
	import { X, Loader2, CheckCircle, XCircle } from 'lucide-svelte';

	let {
		open = $bindable(false),
		mode,
		problemId,
		problemTitle
	}: {
		open: boolean;
		mode: 'close' | 'reduce';
		problemId: string;
		problemTitle: string;
	} = $props();

	let code = $state('');
	let submitting = $state(false);
	let result = $state<{ status: string; reason?: string; message?: string; url?: string; errors?: string[] } | null>(null);

	async function handleSubmit() {
		if (!code.trim() || submitting) return;
		submitting = true;
		result = null;

		try {
			const res = await fetch('/api/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ mode, problemId, code })
			});

			if (res.status === 401) {
				result = { status: 'error', reason: 'You must be signed in.' };
			} else if (res.status === 403) {
				result = { status: 'error', reason: 'Your account must be verified to submit.' };
			} else if (res.status === 429) {
				result = { status: 'error', reason: 'Rate limited. Try again later.' };
			} else {
				result = await res.json();
			}
		} catch {
			result = { status: 'error', reason: 'Network error. Please try again.' };
		} finally {
			submitting = false;
		}
	}

	function handleClose() {
		open = false;
		result = null;
		code = '';
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') handleClose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
		onclick={handleClose}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="mx-4 w-full max-w-lg rounded-2xl bg-(--color-bg) p-6 shadow-2xl"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-sm font-semibold text-(--color-text)">
					{mode === 'close' ? 'Submit Proof' : 'Submit Reduction'}
				</h2>
				<button
					onclick={handleClose}
					class="rounded-lg p-1 text-(--color-text-muted) transition-colors hover:text-(--color-text)"
				>
					<X size={16} />
				</button>
			</div>

			{#if mode === 'close'}
				<p class="mb-2 text-xs text-(--color-text-secondary)">
					Submit a Lean 4 file that proves "{problemTitle}". The file will be compiled on the server.
				</p>
				<p class="mb-3 text-[10px] text-(--color-text-muted)">
					Requirements: compiles successfully, zero <code class="font-mono">sorry</code>.
					On success, a bot merges it into the data repository.
				</p>
			{:else}
				<p class="mb-2 text-xs text-(--color-text-secondary)">
					Submit a Lean 4 file that reduces "{problemTitle}" into a sub-problem.
				</p>
				<p class="mb-3 text-[10px] text-(--color-text-muted)">
					Requirements: compiles successfully, exactly one <code class="font-mono">sorry</code> in an isolated result.
					A bot will open a PR for maintainer review. Combine multiple goals into a conjunction if needed.
				</p>
			{/if}

			<textarea
				bind:value={code}
				placeholder="-- Paste your Lean 4 code here..."
				class="h-48 w-full resize-none rounded-xl bg-(--color-bg-tertiary) p-4 font-mono text-xs text-(--color-text) outline-none placeholder:text-(--color-text-muted) transition-shadow focus:ring-1 focus:ring-(--color-border)"
				disabled={submitting}
			></textarea>

			{#if result}
				<div class="mt-3 rounded-lg bg-(--color-bg-tertiary) p-3">
					{#if result.status === 'accepted'}
						<div class="flex items-start gap-2">
							<CheckCircle size={14} class="mt-0.5 shrink-0 text-(--color-text)" />
							<div>
								<p class="text-xs font-medium text-(--color-text)">{result.message}</p>
								{#if result.url}
									<a
										href={result.url}
										target="_blank"
										rel="noopener noreferrer"
										class="text-[10px] text-(--color-text-secondary) underline underline-offset-2"
									>
										View on GitHub
									</a>
								{/if}
							</div>
						</div>
					{:else}
						<div class="flex items-start gap-2">
							<XCircle size={14} class="mt-0.5 shrink-0 text-(--color-text-muted)" />
							<div>
								<p class="text-xs text-(--color-text-secondary)">{result.reason}</p>
								{#if result.errors && result.errors.length > 0}
									<pre class="mt-2 text-[10px] text-(--color-text-muted) overflow-x-auto">{result.errors.join('\n')}</pre>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			{/if}

			<div class="mt-4 flex items-center justify-between">
				<p class="text-[10px] text-(--color-text-muted)">Max 5 submissions per hour</p>
				<div class="flex items-center gap-2">
					<button
						onclick={handleClose}
						class="rounded-lg px-4 py-2 text-xs font-medium text-(--color-text-secondary) transition-colors hover:text-(--color-text)"
					>
						Cancel
					</button>
					<button
						onclick={handleSubmit}
						disabled={!code.trim() || submitting}
						class="flex items-center gap-2 rounded-lg bg-(--color-text) px-4 py-2 text-xs font-medium text-(--color-bg) transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
					>
						{#if submitting}
							<Loader2 size={14} class="animate-spin" />
							Compiling...
						{:else}
							{mode === 'close' ? 'Submit Proof' : 'Submit Reduction'}
						{/if}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
