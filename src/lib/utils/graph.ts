import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force';
import type { Problem, GraphNode, GraphEdge } from './types';
import type { Simulation, SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';

export function buildGraphData(problem: Problem): { nodes: GraphNode[]; edges: GraphEdge[] } {
	const centerNode: GraphNode = {
		id: problem.id,
		label: problem.title,
		isCenter: true
	};

	const subNodes: GraphNode[] = problem.subProblems.map((sp) => ({
		id: sp.id,
		label: sp.name,
		isCenter: false
	}));

	const edges: GraphEdge[] = problem.subProblems.map((sp) => ({
		source: problem.id,
		target: sp.id
	}));

	return { nodes: [centerNode, ...subNodes], edges };
}

export function createSimulation(
	nodes: GraphNode[],
	edges: GraphEdge[],
	width: number,
	height: number
): Simulation<GraphNode & SimulationNodeDatum, SimulationLinkDatum<GraphNode & SimulationNodeDatum>> {
	const sim = forceSimulation<GraphNode & SimulationNodeDatum>(nodes as (GraphNode & SimulationNodeDatum)[])
		.force(
			'link',
			forceLink<GraphNode & SimulationNodeDatum, SimulationLinkDatum<GraphNode & SimulationNodeDatum>>(
				edges as SimulationLinkDatum<GraphNode & SimulationNodeDatum>[]
			)
				.id((d: SimulationNodeDatum) => (d as GraphNode).id)
				.distance(140)
		)
		.force('charge', forceManyBody().strength(-400))
		.force('center', forceCenter(width / 2, height / 2))
		.force('collide', forceCollide().radius(40))
		.alphaDecay(0.02)
		.velocityDecay(0.3);

	return sim as unknown as Simulation<GraphNode & SimulationNodeDatum, SimulationLinkDatum<GraphNode & SimulationNodeDatum>>;
}
