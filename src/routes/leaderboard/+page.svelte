<script lang="ts">
	import { Shield } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Leaderboard - OpenQED</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-6 py-12">
	<h1 class="text-xl font-semibold text-(--color-text) mb-8">Leaderboard</h1>

	{#if data.users.length === 0}
		<div class="text-center py-16">
			<p class="text-sm text-(--color-text-muted)">No contributors yet.</p>
			<p class="mt-1 text-xs text-(--color-text-muted)">Be the first to submit a proof or reduction.</p>
		</div>
	{:else}
		<div class="flex flex-col">
			{#each data.users as user, i}
				<div class="flex items-center gap-4 py-3 {i > 0 ? 'border-t border-(--color-border)' : ''}">
					<span class="w-8 text-center text-sm font-medium text-(--color-text-muted)">
						{i + 1}
					</span>
					<img
						src={user.avatarUrl}
						alt={user.displayName}
						class="h-8 w-8 rounded-full"
					/>
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-1.5">
							<span class="text-sm font-medium text-(--color-text) truncate">
								{user.displayName}
							</span>
							{#if user.verified}
								<Shield size={12} class="text-(--color-text-muted) shrink-0" />
							{/if}
						</div>
						<span class="text-xs text-(--color-text-muted)">@{user.username}</span>
					</div>
					<div class="flex items-center gap-4 text-xs text-(--color-text-muted)">
						<span>{user.proofs} proof{user.proofs !== 1 ? 's' : ''}</span>
						<span>{user.reductions} reduction{user.reductions !== 1 ? 's' : ''}</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
