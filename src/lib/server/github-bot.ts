import { Octokit } from 'octokit';
import {
	GITHUB_BOT_TOKEN,
	OPENQED_DATA_OWNER,
	OPENQED_DATA_REPO
} from '$env/static/private';

const octokit = new Octokit({ auth: GITHUB_BOT_TOKEN });
const owner = OPENQED_DATA_OWNER || 'HAL-Institute';
const repo = OPENQED_DATA_REPO || 'OpenQED-Data';

/**
 * Merge a proof directly into the data repo's main branch.
 * Creates a new file with the proof and commits it.
 */
export async function mergeProof(params: {
	problemId: string;
	code: string;
	username: string;
}): Promise<{ success: boolean; url: string; error?: string }> {
	try {
		const path = `proofs/${params.problemId}/proof-${Date.now()}.lean`;
		const message = `Close ${params.problemId}: proof by @${params.username}`;

		const { data } = await octokit.rest.repos.createOrUpdateFileContents({
			owner,
			repo,
			path,
			message,
			content: Buffer.from(params.code).toString('base64'),
			committer: {
				name: 'OpenQED Bot',
				email: 'bot@openqed.org'
			}
		});

		return {
			success: true,
			url: data.commit.html_url ?? `https://github.com/${owner}/${repo}`
		};
	} catch (err) {
		return {
			success: false,
			url: '',
			error: (err as Error).message
		};
	}
}

/**
 * Open a PR for a reduction submission.
 * Creates a branch, adds the reduction file, and opens a PR for maintainer review.
 */
export async function openReductionPR(params: {
	problemId: string;
	code: string;
	username: string;
}): Promise<{ success: boolean; url: string; error?: string }> {
	try {
		// Get the default branch's latest SHA
		const { data: refData } = await octokit.rest.git.getRef({
			owner,
			repo,
			ref: 'heads/main'
		});
		const baseSha = refData.object.sha;

		// Create a new branch
		const branchName = `reduce/${params.problemId}/${params.username}-${Date.now()}`;
		await octokit.rest.git.createRef({
			owner,
			repo,
			ref: `refs/heads/${branchName}`,
			sha: baseSha
		});

		// Add the reduction file
		const path = `reductions/${params.problemId}/reduce-${params.username}-${Date.now()}.lean`;
		await octokit.rest.repos.createOrUpdateFileContents({
			owner,
			repo,
			path,
			message: `Reduce ${params.problemId}: reduction by @${params.username}`,
			content: Buffer.from(params.code).toString('base64'),
			branch: branchName,
			committer: {
				name: 'OpenQED Bot',
				email: 'bot@openqed.org'
			}
		});

		// Open a PR
		const { data: pr } = await octokit.rest.pulls.create({
			owner,
			repo,
			title: `Reduction: ${params.problemId} by @${params.username}`,
			head: branchName,
			base: 'main',
			body: [
				`## Reduction submission`,
				``,
				`**Problem:** ${params.problemId}`,
				`**Author:** @${params.username}`,
				``,
				`This reduction has been automatically verified:`,
				`- Lean compilation: passed`,
				`- Sorry count: exactly 1 (isolated goal)`,
				``,
				`Awaiting maintainer review.`
			].join('\n')
		});

		return { success: true, url: pr.html_url };
	} catch (err) {
		return {
			success: false,
			url: '',
			error: (err as Error).message
		};
	}
}
