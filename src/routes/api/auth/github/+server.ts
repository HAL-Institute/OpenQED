import { redirect } from '@sveltejs/kit';
import { GITHUB_CLIENT_ID } from '$env/static/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url, cookies }) => {
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
		client_id: GITHUB_CLIENT_ID,
		redirect_uri: redirectUri,
		scope: 'read:user',
		state
	});
	return redirect(302, `https://github.com/login/oauth/authorize?${params}`);
};
