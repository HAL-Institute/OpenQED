import Fuse, { type IFuseOptions } from 'fuse.js';
import type { ProblemSummary } from './types';

const fuseOptions: IFuseOptions<ProblemSummary> = {
	keys: [
		{ name: 'title', weight: 0.4 },
		{ name: 'shortDescription', weight: 0.3 },
		{ name: 'tags', weight: 0.2 },
		{ name: 'category', weight: 0.1 }
	],
	threshold: 0.35,
	includeScore: true
};

export function createSearchIndex(problems: ProblemSummary[]): Fuse<ProblemSummary> {
	return new Fuse(problems, fuseOptions);
}

export function searchProblems(
	fuse: Fuse<ProblemSummary>,
	query: string,
	allProblems: ProblemSummary[]
): ProblemSummary[] {
	if (!query.trim()) return allProblems;
	return fuse.search(query).map((r) => r.item);
}

export function filterProblems(
	problems: ProblemSummary[],
	category: string,
	difficulty: string,
	status: string
): ProblemSummary[] {
	return problems.filter((p) => {
		if (category && p.category !== category) return false;
		if (difficulty && p.difficulty !== difficulty) return false;
		if (status && p.status !== status) return false;
		return true;
	});
}
