<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeft } from 'lucide-svelte';

	const user = $derived($page.data.user);
</script>

<svelte:head>
	<title>Sign in - OpenQED</title>
</svelte:head>

<div class="mx-auto max-w-sm px-6 pt-24 pb-8">
	{#if user}
		<div class="text-center">
			<p class="text-sm text-(--color-text-secondary)">You are already signed in.</p>
			<a href="/profile" class="mt-4 inline-block text-sm text-(--color-text) underline underline-offset-2">
				Go to profile
			</a>
		</div>
	{:else}
		<div class="text-center mb-10">
			<h1 class="text-xl font-semibold text-(--color-text)">Sign in to OpenQED</h1>
			<p class="mt-2 text-sm text-(--color-text-muted)">
				Choose an authentication method to continue.
			</p>
		</div>

		<div class="flex flex-col gap-3">
			<a
				href="/api/auth/github"
				class="flex items-center justify-center gap-3 rounded-xl bg-(--color-text) px-4 py-3 text-sm font-medium text-(--color-bg) transition-opacity hover:opacity-90"
			>
				<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
				</svg>
				Continue with GitHub
			</a>
		</div>

		<p class="mt-8 text-center text-xs text-(--color-text-muted)">
			After signing in, you can verify your identity via ORCID, university email, or a 30-day wait period to submit contributions.
		</p>

		<div class="mt-8 text-center">
			<a href="/" class="inline-flex items-center gap-1 text-xs text-(--color-text-muted) transition-colors hover:text-(--color-text)">
				<ArrowLeft size={12} />
				Back to problems
			</a>
		</div>
	{/if}
</div>
