import type { Cookies } from '@sveltejs/kit';
import db from './db';

export interface User {
	id: string;
	github_id: number;
	username: string;
	display_name: string;
	avatar_url: string;
	verified: number;
	verification_method: string | null;
	created_at: string;
	contributions: number;
	proofs: number;
	reductions: number;
}

// --- Sessions ---

export function generateSessionId(): string {
	return crypto.randomUUID();
}

export function createSession(sessionId: string, userId: string) {
	db.prepare('INSERT INTO sessions (id, user_id) VALUES (?, ?)').run(sessionId, userId);
}

export function getSession(sessionId: string): User | null {
	return (
		db
			.prepare(
				`SELECT u.* FROM users u JOIN sessions s ON s.user_id = u.id WHERE s.id = ?`
			)
			.get(sessionId) as User | undefined
	) ?? null;
}

export function deleteSession(sessionId: string) {
	db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
}

// --- Users ---

export function upsertUser(data: {
	githubId: number;
	username: string;
	displayName: string;
	avatarUrl: string;
}): User {
	const existing = db
		.prepare('SELECT * FROM users WHERE github_id = ?')
		.get(data.githubId) as User | undefined;

	if (existing) {
		db.prepare(
			'UPDATE users SET username = ?, display_name = ?, avatar_url = ? WHERE id = ?'
		).run(data.username, data.displayName, data.avatarUrl, existing.id);

		const created = new Date(existing.created_at).getTime();
		const daysSince = (Date.now() - created) / (1000 * 60 * 60 * 24);
		if (!existing.verified && daysSince >= 30) {
			db.prepare(
				'UPDATE users SET verified = 1, verification_method = ? WHERE id = ?'
			).run('time', existing.id);
		}

		return db.prepare('SELECT * FROM users WHERE id = ?').get(existing.id) as User;
	}

	const id = crypto.randomUUID();
	db.prepare(
		`INSERT INTO users (id, github_id, username, display_name, avatar_url)
		 VALUES (?, ?, ?, ?, ?)`
	).run(id, data.githubId, data.username, data.displayName, data.avatarUrl);

	return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User;
}

export function getUserById(id: string): User | null {
	return (db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined) ?? null;
}

export function getAllUsers(): User[] {
	return db
		.prepare('SELECT * FROM users ORDER BY (proofs + reductions) DESC')
		.all() as User[];
}

export function serializeUser(user: User): UserSession {
	return {
		id: user.id,
		username: user.username,
		displayName: user.display_name,
		avatarUrl: user.avatar_url,
		verified: !!user.verified,
		verificationMethod: user.verification_method as UserSession['verificationMethod'],
		createdAt: user.created_at,
		contributions: user.contributions,
		proofs: user.proofs,
		reductions: user.reductions
	};
}

export function setSessionCookie(cookies: Cookies, sessionId: string) {
	cookies.set('session', sessionId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 30,
		secure: false
	});
}

export function clearSessionCookie(cookies: Cookies) {
	cookies.delete('session', { path: '/' });
}
