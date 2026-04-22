import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import {
	generateSessionId,
	createSession,
	upsertUser,
	setSessionCookie
} from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const clientId = env.GITHUB_CLIENT_ID;
	const clientSecret = env.GITHUB_CLIENT_SECRET;

	if (!clientId || !clientSecret) {
		return redirect(302, '/login');
	}

	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('oauth_state');

	cookies.delete('oauth_state', { path: '/' });

	if (!code || !state || state !== storedState) {
		return redirect(302, '/login');
	}

	const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify({
			client_id: clientId,
			client_secret: clientSecret,
			code
		})
	});

	const tokenData = await tokenRes.json();
	if (!tokenData.access_token) {
		return redirect(302, '/login');
	}

	const userRes = await fetch('https://api.github.com/user', {
		headers: { Authorization: `Bearer ${tokenData.access_token}` }
	});

	if (!userRes.ok) {
		return redirect(302, '/login');
	}

	const githubUser = await userRes.json();

	const user = upsertUser({
		githubId: githubUser.id,
		username: githubUser.login,
		displayName: githubUser.name || githubUser.login,
		avatarUrl: githubUser.avatar_url
	});

	const sessionId = generateSessionId();
	createSession(sessionId, user.id);
	setSessionCookie(cookies, sessionId);

	return redirect(302, '/profile');
};
