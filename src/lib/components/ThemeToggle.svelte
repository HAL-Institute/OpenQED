<script lang="ts">
	import { Sun, Moon } from 'lucide-svelte';
	import { theme, toggleTheme } from '$lib/stores/theme';
</script>

<button
	onclick={toggleTheme}
	class="rounded-lg p-2 transition-colors hover:bg-(--color-bg-tertiary)"
	aria-label="Toggle theme"
>
	{#if $theme === 'dark'}
		<Sun size={18} class="text-(--color-text-secondary)" />
	{:else}
		<Moon size={18} class="text-(--color-text-secondary)" />
	{/if}
</button>
