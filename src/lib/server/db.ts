import type { User } from './auth';

// In-memory stores — works on all platforms including Cloudflare Workers.
// Replace with D1, Turso, or another edge-compatible DB for production persistence.

const users = new Map<string, User>();
const sessions = new Map<string, string>(); // sessionId → userId

export function dbCreateSession(sessionId: string, userId: string) {
	sessions.set(sessionId, userId);
}

export function dbGetSession(sessionId: string): User | null {
	const userId = sessions.get(sessionId);
	if (!userId) return null;
	return users.get(userId) ?? null;
}

export function dbDeleteSession(sessionId: string) {
	sessions.delete(sessionId);
}

export function dbUpsertUser(data: {
	githubId: number;
	username: string;
	displayName: string;
	avatarUrl: string;
}): User {
	const existing = [...users.values()].find((u) => u.github_id === data.githubId);

	if (existing) {
		existing.username = data.username;
		existing.display_name = data.displayName;
		existing.avatar_url = data.avatarUrl;

		const created = new Date(existing.created_at).getTime();
		const daysSince = (Date.now() - created) / (1000 * 60 * 60 * 24);
		if (!existing.verified && daysSince >= 30) {
			existing.verified = 1;
			existing.verification_method = 'time';
		}
		return existing;
	}

	const user: User = {
		id: crypto.randomUUID(),
		github_id: data.githubId,
		username: data.username,
		display_name: data.displayName,
		avatar_url: data.avatarUrl,
		verified: 0,
		verification_method: null,
		created_at: new Date().toISOString(),
		contributions: 0,
		proofs: 0,
		reductions: 0
	};
	users.set(user.id, user);
	return user;
}

export function dbGetUserById(id: string): User | null {
	return users.get(id) ?? null;
}

export function dbGetAllUsers(): User[] {
	return [...users.values()].sort(
		(a, b) => b.proofs + b.reductions - (a.proofs + a.reductions)
	);
}

export function dbIncrementProofs(userId: string) {
	const user = users.get(userId);
	if (user) {
		user.proofs++;
		user.contributions++;
	}
}

export function dbIncrementReductions(userId: string) {
	const user = users.get(userId);
	if (user) {
		user.reductions++;
		user.contributions++;
	}
}
