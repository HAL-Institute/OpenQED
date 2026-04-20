import type { Problem, ProblemSummary } from './types';
import problemsData from '../../data/problems.json';

const problems = problemsData as Problem[];

export function getAllProblems(): ProblemSummary[] {
	return problems.map(({ id, title, shortDescription, category, tags, difficulty, status, subProblemCount }) => ({
		id,
		title,
		shortDescription,
		category,
		tags,
		difficulty,
		status,
		subProblemCount
	})) as ProblemSummary[];
}

export function getProblemById(id: string): Problem | undefined {
	return problems.find((p) => p.id === id) as Problem | undefined;
}

export function getAllCategories(): string[] {
	return [...new Set(problems.map((p) => p.category))].sort();
}

export function getAllDifficulties(): string[] {
	return [...new Set(problems.map((p) => p.difficulty))];
}
