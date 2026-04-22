<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { buildGraphData, createSimulation } from '$lib/utils/graph';
	import type { Problem, GraphNode, GraphEdge } from '$lib/utils/types';
	import { forceCenter } from 'd3-force';

	let {
		problem,
		onNodeClick
	}: {
		problem: Problem;
		onNodeClick: (subProblemId: string, label: string) => void;
	} = $props();

	let container: HTMLDivElement;
	let width = $state(800);
	let height = $state(500);
	let nodes = $state<GraphNode[]>([]);
	let edges = $state<GraphEdge[]>([]);
	let simulation: ReturnType<typeof createSimulation> | null = null;
	let rafPending = false;

	let dragging = $state<string | null>(null);
	let selectedId = $state<string | null>(null);

	const centerRadius = 24;
	const nodeRadius = 16;

	onMount(() => {
		if (!container) return;

		const rect = container.getBoundingClientRect();
		width = rect.width;
		height = Math.max(rect.height, 400);

		const resizeObs = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const newW = entry.contentRect.width;
				const newH = Math.max(entry.contentRect.height, 400);
				width = newW;
				height = newH;
				if (simulation) {
					simulation.force('center', forceCenter(newW / 2, newH / 2));
					simulation.alpha(0.3).restart();
				}
			}
		});
		resizeObs.observe(container);

		const graph = buildGraphData(problem);
		nodes = graph.nodes;
		edges = graph.edges;

		simulation = createSimulation(nodes, edges, width, height);

		// Pre-run simulation so nodes appear settled immediately
		for (let i = 0; i < 300; i++) {
			simulation.tick();
		}
		nodes = [...nodes];
		edges = [...edges];

		// Continue listening for ticks (drag interactions will restart it)
		simulation.on('tick', () => {
			if (!rafPending) {
				rafPending = true;
				requestAnimationFrame(() => {
					nodes = [...nodes];
					edges = [...edges];
					rafPending = false;
				});
			}
		});

		return () => {
			resizeObs.disconnect();
			simulation?.stop();
		};
	});

	onDestroy(() => {
		simulation?.stop();
	});

	function handlePointerDown(e: PointerEvent, node: GraphNode) {
		e.preventDefault();
		dragging = node.id;
		node.fx = node.x;
		node.fy = node.y;
		simulation?.alphaTarget(0.3).restart();
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!dragging) return;
		const svgEl = container.querySelector('svg');
		if (!svgEl) return;
		const svgRect = svgEl.getBoundingClientRect();
		const x = e.clientX - svgRect.left;
		const y = e.clientY - svgRect.top;
		const node = nodes.find((n) => n.id === dragging);
		if (node) {
			node.fx = x;
			node.fy = y;
		}
	}

	function handlePointerUp() {
		if (!dragging) return;
		const node = nodes.find((n) => n.id === dragging);
		if (node) {
			node.fx = null;
			node.fy = null;
		}
		dragging = null;
		simulation?.alphaTarget(0);
	}

	function handleNodeClick(node: GraphNode) {
		if (node.isCenter) {
			// Clicking center clears selection
			selectedId = null;
		} else {
			selectedId = node.id;
			onNodeClick(node.id, node.label);
		}
	}

	function getSourceCoords(edge: GraphEdge): { x: number; y: number } {
		const src =
			typeof edge.source === 'string'
				? nodes.find((n) => n.id === edge.source)
				: (edge.source as GraphNode);
		return { x: src?.x ?? 0, y: src?.y ?? 0 };
	}

	function getTargetCoords(edge: GraphEdge): { x: number; y: number } {
		const tgt =
			typeof edge.target === 'string'
				? nodes.find((n) => n.id === edge.target)
				: (edge.target as GraphNode);
		return { x: tgt?.x ?? 0, y: tgt?.y ?? 0 };
	}

	function nodeFill(node: GraphNode): string {
		if (node.id === selectedId) return 'var(--color-text)';
		if (node.isCenter && !selectedId) return 'var(--color-text)';
		if (node.isCenter && selectedId) return 'var(--color-bg-tertiary)';
		return 'var(--color-bg-tertiary)';
	}
</script>

<div
	bind:this={container}
	class="w-full h-full min-h-[400px]"
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	role="img"
	aria-label="Problem dependency graph"
>
	<svg {width} {height} class="w-full h-full">
		<defs>
			<marker
				id="arrowhead"
				viewBox="0 0 10 7"
				refX="10"
				refY="3.5"
				markerWidth="7"
				markerHeight="5"
				orient="auto"
			>
				<polygon points="0 0, 10 3.5, 0 7" fill="var(--color-text-muted)" />
			</marker>
		</defs>

		<!-- Edges -->
		{#each edges as edge}
			{@const src = getSourceCoords(edge)}
			{@const tgt = getTargetCoords(edge)}
			{@const dx = tgt.x - src.x}
			{@const dy = tgt.y - src.y}
			{@const dist = Math.sqrt(dx * dx + dy * dy) || 1}
			{@const targetR = nodeRadius + 6}
			<line
				x1={src.x}
				y1={src.y}
				x2={tgt.x - (dx / dist) * targetR}
				y2={tgt.y - (dy / dist) * targetR}
				stroke="var(--color-border)"
				stroke-width="1"
				marker-end="url(#arrowhead)"
			/>
		{/each}

		<!-- Nodes -->
		{#each nodes as node}
			{@const r = node.isCenter ? centerRadius : nodeRadius}
			{@const isSelected = node.id === selectedId}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<g
				class="cursor-pointer"
				onpointerdown={(e) => handlePointerDown(e, node)}
				onclick={() => handleNodeClick(node)}
				onkeydown={(e) => {
					if (e.key === 'Enter') handleNodeClick(node);
				}}
				role="button"
				tabindex="0"
				aria-label={node.label}
			>
				<circle
					cx={node.x ?? 0}
					cy={node.y ?? 0}
					{r}
					fill={nodeFill(node)}
					stroke={node.isCenter && !selectedId ? 'none' : 'var(--color-border)'}
					stroke-width="1"
				/>
				<text
					x={node.x ?? 0}
					y={(node.y ?? 0) + r + 14}
					text-anchor="middle"
					fill={isSelected ? 'var(--color-text)' : 'var(--color-text-muted)'}
					font-size="10"
					font-weight={isSelected ? '600' : '400'}
					font-family="var(--font-sans)"
					class="pointer-events-none select-none"
				>
					{node.label.length > 20 ? node.label.slice(0, 18) + '...' : node.label}
				</text>
				{#if (node.isCenter && !selectedId) || isSelected}
					<text
						x={node.x ?? 0}
						y={(node.y ?? 0) + 4}
						text-anchor="middle"
						fill="var(--color-bg)"
						font-size="12"
						font-weight="600"
						font-family="var(--font-mono)"
						class="pointer-events-none select-none"
					>{node.isCenter ? 'Q' : '?'}</text>
				{/if}
			</g>
		{/each}
	</svg>
</div>
