<script lang="ts">
	import { slide } from 'svelte/transition';
	import { ChevronDown } from 'lucide-svelte';
	import hljs from 'highlight.js';

	let { code }: { code: string } = $props();
	let open = $state(false);

	function highlight(src: string): string {
		// highlight.js doesn't have a lean4 grammar, so we use a basic approach
		return hljs.highlightAuto(src, ['haskell', 'scala']).value;
	}
</script>

<div class="mt-3 rounded-lg border border-(--color-border) overflow-hidden">
	<button
		onclick={() => (open = !open)}
		class="flex w-full items-center justify-between px-4 py-2.5 text-xs font-medium text-(--color-text-secondary) transition-colors hover:bg-(--color-bg-tertiary)"
	>
		<span class="flex items-center gap-2">
			<span class="font-mono text-[10px] rounded bg-(--color-accent)/15 px-1.5 py-0.5 text-(--color-accent)">Lean 4</span>
			Formalization
		</span>
		<ChevronDown
			size={14}
			class="transition-transform duration-200 {open ? 'rotate-180' : ''}"
		/>
	</button>

	{#if open}
		<div transition:slide={{ duration: 200 }}>
			<div class="border-t border-(--color-border) bg-(--color-bg-tertiary) p-4 overflow-x-auto">
				<pre class="text-xs leading-relaxed"><code class="font-mono">{@html highlight(code)}</code></pre>
			</div>
		</div>
	{/if}
</div>
