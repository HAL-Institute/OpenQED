import { redirect } from '@sveltejs/kit';
import { deleteSession, clearSessionCookie } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ cookies }) => {
	const sessionId = cookies.get('session');
	if (sessionId) {
		deleteSession(sessionId);
		clearSessionCookie(cookies);
	}
	return redirect(302, '/');
};
