<script lang="ts">
	import { Shield, Clock, ExternalLink, LogOut } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(iso: string): string {
		return new Date(iso).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function daysUntilVerification(createdAt: string): number {
		const created = new Date(createdAt).getTime();
		const now = Date.now();
		const daysPassed = Math.floor((now - created) / (1000 * 60 * 60 * 24));
		return Math.max(0, 30 - daysPassed);
	}
</script>

<svelte:head>
	<title>Profile - OpenQED</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-6 py-12">
	{#if data.user}
		<div class="flex items-start gap-5">
			<img
				src={data.user.avatarUrl}
				alt={data.user.displayName}
				class="h-16 w-16 rounded-full"
			/>
			<div class="flex-1">
				<h1 class="text-xl font-semibold text-(--color-text)">{data.user.displayName}</h1>
				<p class="text-sm text-(--color-text-muted)">@{data.user.username}</p>
				<div class="mt-2 flex items-center gap-3">
					{#if data.user.verified}
						<span class="inline-flex items-center gap-1 text-xs text-(--color-text)">
							<Shield size={12} />
							Verified{data.user.verificationMethod ? ` via ${data.user.verificationMethod}` : ''}
						</span>
					{:else}
						<span class="text-xs text-(--color-text-muted)">Unverified</span>
					{/if}
					<span class="text-xs text-(--color-text-muted)">Joined {formatDate(data.user.createdAt)}</span>
				</div>
			</div>
			<a
				href="/api/auth/logout"
				class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-(--color-text-muted) transition-colors hover:text-(--color-text) hover:bg-(--color-bg-tertiary)"
			>
				<LogOut size={14} />
				Sign out
			</a>
		</div>

		<div class="mt-8 grid grid-cols-3 gap-3">
			<div class="rounded-xl bg-(--color-bg-tertiary) p-4 text-center">
				<p class="text-2xl font-semibold text-(--color-text)">{data.user.contributions}</p>
				<p class="text-xs text-(--color-text-muted) mt-1">Contributions</p>
			</div>
			<div class="rounded-xl bg-(--color-bg-tertiary) p-4 text-center">
				<p class="text-2xl font-semibold text-(--color-text)">{data.user.proofs}</p>
				<p class="text-xs text-(--color-text-muted) mt-1">Proofs</p>
			</div>
			<div class="rounded-xl bg-(--color-bg-tertiary) p-4 text-center">
				<p class="text-2xl font-semibold text-(--color-text)">{data.user.reductions}</p>
				<p class="text-xs text-(--color-text-muted) mt-1">Reductions</p>
			</div>
		</div>

		{#if !data.user.verified}
			<div class="mt-8">
				<h2 class="text-sm font-medium text-(--color-text) mb-1">Verify your identity</h2>
				<p class="text-xs text-(--color-text-muted) mb-4">
					Verified users can submit proofs and reductions. Choose a verification method:
				</p>

				<div class="flex flex-col gap-2">
					<button class="flex items-center gap-4 rounded-xl bg-(--color-bg-tertiary) p-4 text-left transition-colors hover:bg-(--color-bg-secondary)">
						<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-(--color-bg-secondary)">
							<ExternalLink size={16} class="text-(--color-text-secondary)" />
						</div>
						<div>
							<p class="text-sm font-medium text-(--color-text)">ORCID</p>
							<p class="text-xs text-(--color-text-muted)">Verify with your ORCID account</p>
						</div>
					</button>

					<button class="flex items-center gap-4 rounded-xl bg-(--color-bg-tertiary) p-4 text-left transition-colors hover:bg-(--color-bg-secondary)">
						<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-(--color-bg-secondary)">
							<Shield size={16} class="text-(--color-text-secondary)" />
						</div>
						<div>
							<p class="text-sm font-medium text-(--color-text)">University Email</p>
							<p class="text-xs text-(--color-text-muted)">Verify with a .edu or institutional email</p>
						</div>
					</button>

					<div class="flex items-center gap-4 rounded-xl bg-(--color-bg-tertiary) p-4">
						<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-(--color-bg-secondary)">
							<Clock size={16} class="text-(--color-text-muted)" />
						</div>
						<div>
							<p class="text-sm font-medium text-(--color-text)">Wait period</p>
							{#if daysUntilVerification(data.user.createdAt) > 0}
								<p class="text-xs text-(--color-text-muted)">
									Auto-verifies in {daysUntilVerification(data.user.createdAt)} day{daysUntilVerification(data.user.createdAt) !== 1 ? 's' : ''}
								</p>
							{:else}
								<p class="text-xs text-(--color-text-muted)">Ready for auto-verification</p>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}
	{:else}
		<div class="text-center py-20">
			<p class="text-sm text-(--color-text-muted) mb-4">Sign in to view your profile.</p>
			<a
				href="/login"
				class="inline-block text-sm text-(--color-text) underline underline-offset-2"
			>
				Sign in
			</a>
		</div>
	{/if}
</div>
