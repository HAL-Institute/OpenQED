export type ProblemCategory =
	| 'number-theory'
	| 'analysis'
	| 'algebra'
	| 'combinatorics'
	| 'geometry'
	| 'topology'
	| 'logic'
	| 'probability'
	| 'mathematical-physics';

export type Difficulty = 'undergraduate' | 'graduate' | 'research' | 'millennium';

export interface Reference {
	key: string;
	citation: string;
	url?: string;
}

export interface SubProblem {
	id: string;
	name: string;
	reduction: string;
	reducedProblem: string;
	leanFormalization: string;
	parentId: string;
}

export interface ProblemSummary {
	id: string;
	title: string;
	shortDescription: string;
	category: ProblemCategory;
	tags: string[];
	difficulty: Difficulty;
	status: 'open' | 'closed';
	subProblemCount: number;
}

export interface Problem extends ProblemSummary {
	overview: string;
	preliminaries: string;
	problemStatement: string;
	leanFormalization: string;
	references: Reference[];
	subProblems: SubProblem[];
}

export interface Tab {
	id: string;
	label: string;
	type: 'description' | 'graph' | 'subproblem';
	closable: boolean;
	subProblemId?: string;
}

export interface GraphNode {
	id: string;
	label: string;
	isCenter: boolean;
	x?: number;
	y?: number;
	vx?: number;
	vy?: number;
	fx?: number | null;
	fy?: number | null;
}

export interface GraphEdge {
	source: string | GraphNode;
	target: string | GraphNode;
}
