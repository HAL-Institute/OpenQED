export interface LeanCheckResult {
	success: boolean;
	sorryCount: number;
	errors: string[];
	output: string;
}

/**
 * Compile a Lean 4 file and analyze it for sorry occurrences.
 * All Node.js APIs are dynamically imported so the module can be
 * bundled for Cloudflare Workers (calls will fail at runtime on
 * platforms without a filesystem, but the build won't break).
 */
export async function checkLeanFile(code: string): Promise<LeanCheckResult> {
	try {
		const { writeFileSync, mkdtempSync, rmSync } = await import('fs');
		const { join } = await import('path');
		const { tmpdir } = await import('os');
		const { execFile } = await import('child_process');

		const tmpDir = mkdtempSync(join(tmpdir(), 'openqed-lean-'));
		const filePath = join(tmpDir, 'Submission.lean');

		try {
			writeFileSync(filePath, code, 'utf-8');

			const output = await new Promise<string>((resolve, reject) => {
				execFile(
					'lean',
					[filePath],
					{ timeout: 60_000, maxBuffer: 1024 * 1024 },
					(error, stdout, stderr) => {
						if (error && !stderr) {
							reject(new Error(`Lean not found or crashed: ${error.message}`));
							return;
						}
						resolve(stderr || stdout);
					}
				);
			});

			const sorryCount = countSorries(code);
			const hasErrors = /error:/i.test(output) || /unknown identifier/i.test(output);

			return {
				success: !hasErrors,
				sorryCount,
				errors: hasErrors
					? output
							.split('\n')
							.filter((l) => /error:/i.test(l))
							.slice(0, 10)
					: [],
				output
			};
		} finally {
			rmSync(tmpDir, { recursive: true, force: true });
		}
	} catch (err) {
		return {
			success: false,
			sorryCount: 0,
			errors: [(err as Error).message],
			output: ''
		};
	}
}

/**
 * Count `sorry` occurrences in Lean source (excluding comments and strings).
 */
function countSorries(code: string): number {
	let stripped = code.replace(/--.*$/gm, '');
	stripped = stripped.replace(/\/-[\s\S]*?-\//g, '');
	stripped = stripped.replace(/"(?:[^"\\]|\\.)*"/g, '');
	const matches = stripped.match(/\bsorry\b/g);
	return matches ? matches.length : 0;
}

/**
 * Validate a submission for closing a problem (proof).
 */
export function validateClose(result: LeanCheckResult): { valid: boolean; reason: string } {
	if (!result.success) {
		return { valid: false, reason: 'Lean file does not compile.' };
	}
	if (result.sorryCount > 0) {
		return {
			valid: false,
			reason: `File contains ${result.sorryCount} sorry — a proof must have zero.`
		};
	}
	return { valid: true, reason: 'Proof verified successfully.' };
}

/**
 * Validate a submission for reducing a problem.
 */
export function validateReduce(result: LeanCheckResult): { valid: boolean; reason: string } {
	if (!result.success) {
		return { valid: false, reason: 'Lean file does not compile.' };
	}
	if (result.sorryCount === 0) {
		return {
			valid: false,
			reason: 'Reduction must contain exactly one sorry (this looks like a proof instead).'
		};
	}
	if (result.sorryCount > 1) {
		return {
			valid: false,
			reason: `File contains ${result.sorryCount} sorries — reductions must have exactly one. Combine goals into a conjunction if needed.`
		};
	}
	return { valid: true, reason: 'Reduction verified successfully.' };
}
