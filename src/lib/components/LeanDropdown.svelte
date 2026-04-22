<script lang="ts">
	import { slide } from 'svelte/transition';
	import { ChevronDown, Copy, Check } from 'lucide-svelte';
	import hljs from 'highlight.js';
	import lean4 from '$lib/utils/lean-highlight';

	hljs.registerLanguage('lean', lean4);

	let { code }: { code: string } = $props();
	let open = $state(false);
	let copied = $state(false);

	function highlight(src: string): string {
		return hljs.highlight(src, { language: 'lean' }).value;
	}

	async function copyCode() {
		await navigator.clipboard.writeText(code);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<div class="mt-3 rounded-lg bg-(--color-bg-tertiary) overflow-hidden">
	<button
		onclick={() => (open = !open)}
		class="flex w-full items-center justify-between px-4 py-2.5 text-xs font-medium text-(--color-text-secondary) transition-colors hover:text-(--color-text)"
	>
		<span class="flex items-center gap-2">
			<span class="font-mono text-[10px] text-(--color-text-muted)">Lean 4</span>
			Formalization
		</span>
		<ChevronDown
			size={14}
			class="transition-transform duration-200 {open ? 'rotate-180' : ''}"
		/>
	</button>

	{#if open}
		<div transition:slide={{ duration: 200 }}>
			<div class="border-t border-(--color-border) p-4 overflow-x-auto relative">
				<button
					onclick={copyCode}
					class="absolute top-3 right-3 rounded-md p-1.5 text-(--color-text-muted) transition-colors hover:text-(--color-text) hover:bg-(--color-bg-secondary)"
					aria-label="Copy code"
				>
					{#if copied}
						<Check size={14} />
					{:else}
						<Copy size={14} />
					{/if}
				</button>
				<pre class="text-xs leading-relaxed pr-10"><code class="font-mono">{@html highlight(code)}</code></pre>
			</div>
		</div>
	{/if}
</div>
