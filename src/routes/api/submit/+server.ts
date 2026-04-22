import { json, error } from '@sveltejs/kit';
import { checkLeanFile, validateClose, validateReduce } from '$lib/server/lean';
import { mergeProof, openReductionPR } from '$lib/server/github-bot';
import db from '$lib/server/db';
import type { RequestHandler } from './$types';

// Rate limiting: max submissions per user per hour
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const recentSubmissions = new Map<string, number[]>();

function checkRateLimit(userId: string): boolean {
	const now = Date.now();
	const timestamps = recentSubmissions.get(userId) ?? [];
	const recent = timestamps.filter((t) => now - t < RATE_WINDOW_MS);
	recentSubmissions.set(userId, recent);
	return recent.length < RATE_LIMIT;
}

function recordSubmission(userId: string) {
	const timestamps = recentSubmissions.get(userId) ?? [];
	timestamps.push(Date.now());
	recentSubmissions.set(userId, timestamps);
}

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return error(401, 'Authentication required');
	}

	const { mode, problemId, code } = await request.json();

	if (!mode || !problemId || !code) {
		return error(400, 'Missing required fields: mode, problemId, code');
	}

	if (mode !== 'close' && mode !== 'reduce') {
		return error(400, 'Mode must be "close" or "reduce"');
	}

	// Reductions require verification; proofs are open to all authenticated users
	if (mode === 'reduce' && !locals.user.verified) {
		return error(403, 'Account must be verified to submit reductions');
	}

	if (typeof code !== 'string' || code.length > 100_000) {
		return error(400, 'Code must be a string under 100KB');
	}

	// Rate limit
	if (!checkRateLimit(locals.user.id)) {
		return error(429, `Rate limited: max ${RATE_LIMIT} submissions per hour`);
	}

	// Compile and check the Lean file
	const checkResult = await checkLeanFile(code);

	const validation =
		mode === 'close' ? validateClose(checkResult) : validateReduce(checkResult);

	if (!validation.valid) {
		return json({
			status: 'rejected',
			reason: validation.reason,
			errors: checkResult.errors
		});
	}

	// Record the submission for rate limiting
	recordSubmission(locals.user.id);

	// Submit to the data repository
	let result;
	if (mode === 'close') {
		result = await mergeProof({
			problemId,
			code,
			username: locals.user.username
		});
	} else {
		result = await openReductionPR({
			problemId,
			code,
			username: locals.user.username
		});
	}

	if (!result.success) {
		return json({
			status: 'error',
			reason: `GitHub submission failed: ${result.error}`
		});
	}

	// Update user stats
	if (mode === 'close') {
		db.prepare(
			'UPDATE users SET proofs = proofs + 1, contributions = contributions + 1 WHERE id = ?'
		).run(locals.user.id);
	} else {
		db.prepare(
			'UPDATE users SET reductions = reductions + 1, contributions = contributions + 1 WHERE id = ?'
		).run(locals.user.id);
	}

	return json({
		status: 'accepted',
		message:
			mode === 'close'
				? 'Proof verified and merged.'
				: 'Reduction verified. PR opened for maintainer review.',
		url: result.url
	});
};
