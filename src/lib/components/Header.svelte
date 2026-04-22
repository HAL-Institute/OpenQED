<script lang="ts">
	import { page } from '$app/stores';
	import ThemeToggle from './ThemeToggle.svelte';

	const user = $derived($page.data.user);
</script>

<header class="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-(--color-border) bg-(--color-bg)/95 px-6 backdrop-blur-md">
	<div class="flex items-center gap-6">
		<a href="/" class="flex items-center gap-0.5 text-base tracking-tight">
			<span class="font-semibold text-(--color-text)">Open</span><span class="font-light text-(--color-text-secondary)">QED</span>
		</a>
		<nav class="hidden sm:flex items-center gap-4">
			<a href="/docs" class="text-xs text-(--color-text-muted) transition-colors hover:text-(--color-text)">
				Docs
			</a>
			<a href="/leaderboard" class="text-xs text-(--color-text-muted) transition-colors hover:text-(--color-text)">
				Leaderboard
			</a>
		</nav>
	</div>

	<div class="flex items-center gap-1">
		<ThemeToggle />
		{#if user}
			<a href="/profile" class="ml-1">
				<img
					src={user.avatarUrl}
					alt={user.displayName}
					class="h-7 w-7 rounded-full transition-opacity hover:opacity-80"
				/>
			</a>
		{:else}
			<a
				href="/login"
				class="ml-2 text-xs text-(--color-text-muted) transition-colors hover:text-(--color-text)"
			>
				Sign in
			</a>
		{/if}
	</div>
</header>
