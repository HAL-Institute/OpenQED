import { Octokit } from 'octokit';
import { env } from '$env/dynamic/private';

function getOctokit() {
	return new Octokit({ auth: env.GITHUB_BOT_TOKEN });
}

function getOwner() {
	return env.OPENQED_DATA_OWNER || 'HAL-Institute';
}

function getRepo() {
	return env.OPENQED_DATA_REPO || 'OpenQED-Data';
}

export async function mergeProof(params: {
	problemId: string;
	code: string;
	username: string;
}): Promise<{ success: boolean; url: string; error?: string }> {
	try {
		const octokit = getOctokit();
		const owner = getOwner();
		const repo = getRepo();
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

export async function openReductionPR(params: {
	problemId: string;
	code: string;
	username: string;
}): Promise<{ success: boolean; url: string; error?: string }> {
	try {
		const octokit = getOctokit();
		const owner = getOwner();
		const repo = getRepo();

		const { data: refData } = await octokit.rest.git.getRef({
			owner,
			repo,
			ref: 'heads/main'
		});
		const baseSha = refData.object.sha;

		const branchName = `reduce/${params.problemId}/${params.username}-${Date.now()}`;
		await octokit.rest.git.createRef({
			owner,
			repo,
			ref: `refs/heads/${branchName}`,
			sha: baseSha
		});

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
