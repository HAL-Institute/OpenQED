import type { Handle } from '@sveltejs/kit';
import { getSession, serializeUser } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session');
	if (sessionId) {
		const user = getSession(sessionId);
		event.locals.user = user ? serializeUser(user) : null;
	} else {
		event.locals.user = null;
	}
	return resolve(event);
};
