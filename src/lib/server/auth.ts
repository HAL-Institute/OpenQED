import type { Cookies } from '@sveltejs/kit';
import {
	dbCreateSession,
	dbGetSession,
	dbDeleteSession,
	dbUpsertUser,
	dbGetUserById,
	dbGetAllUsers
} from './db';

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

export function generateSessionId(): string {
	return crypto.randomUUID();
}

export function createSession(sessionId: string, userId: string) {
	dbCreateSession(sessionId, userId);
}

export function getSession(sessionId: string): User | null {
	return dbGetSession(sessionId);
}

export function deleteSession(sessionId: string) {
	dbDeleteSession(sessionId);
}

export function upsertUser(data: {
	githubId: number;
	username: string;
	displayName: string;
	avatarUrl: string;
}): User {
	return dbUpsertUser(data);
}

export function getUserById(id: string): User | null {
	return dbGetUserById(id);
}

export function getAllUsers(): User[] {
	return dbGetAllUsers();
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
