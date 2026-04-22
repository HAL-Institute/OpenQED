import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url, cookies }) => {
	const clientId = env.GITHUB_CLIENT_ID;
	if (!clientId) {
		return redirect(302, '/login');
	}

	const state = crypto.randomUUID();
	cookies.set('oauth_state', state, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 600,
		secure: false
	});

	const redirectUri = `${url.origin}/api/auth/callback`;
	const params = new URLSearchParams({
		client_id: clientId,
		redirect_uri: redirectUri,
		scope: 'read:user',
		state
	});
	return redirect(302, `https://github.com/login/oauth/authorize?${params}`);
};
