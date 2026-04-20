<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { buildGraphData, createSimulation } from '$lib/utils/graph';
	import type { Problem, GraphNode, GraphEdge } from '$lib/utils/types';

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
	let animFrame: number | null = null;

	// Drag state
	let dragging = $state<string | null>(null);

	const centerRadius = 28;
	const nodeRadius = 18;

	onMount(() => {
		if (!container) return;

		const rect = container.getBoundingClientRect();
		width = rect.width;
		height = Math.max(rect.height, 400);

		const resizeObs = new ResizeObserver((entries) => {
			for (const entry of entries) {
				width = entry.contentRect.width;
				height = Math.max(entry.contentRect.height, 400);
			}
		});
		resizeObs.observe(container);

		const graph = buildGraphData(problem);
		nodes = graph.nodes;
		edges = graph.edges;

		simulation = createSimulation(nodes, edges, width, height);
		simulation.on('tick', () => {
			// Trigger reactivity by reassigning
			nodes = [...nodes];
			edges = [...edges];
		});

		return () => {
			resizeObs.disconnect();
			simulation?.stop();
			if (animFrame) cancelAnimationFrame(animFrame);
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
		const svgRect = container.querySelector('svg')?.getBoundingClientRect();
		if (!svgRect) return;
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
		if (!node.isCenter) {
			onNodeClick(node.id, node.label);
		}
	}

	function getSourceCoords(edge: GraphEdge): { x: number; y: number } {
		const src = typeof edge.source === 'string' ? nodes.find((n) => n.id === edge.source) : (edge.source as GraphNode);
		return { x: src?.x ?? 0, y: src?.y ?? 0 };
	}

	function getTargetCoords(edge: GraphEdge): { x: number; y: number } {
		const tgt = typeof edge.target === 'string' ? nodes.find((n) => n.id === edge.target) : (edge.target as GraphNode);
		return { x: tgt?.x ?? 0, y: tgt?.y ?? 0 };
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
		<!-- Arrow marker -->
		<defs>
			<marker
				id="arrowhead"
				viewBox="0 0 10 7"
				refX="10"
				refY="3.5"
				markerWidth="8"
				markerHeight="6"
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
				stroke-width="1.5"
				marker-end="url(#arrowhead)"
			/>
		{/each}

		<!-- Nodes -->
		{#each nodes as node}
			{@const r = node.isCenter ? centerRadius : nodeRadius}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<g
				class="cursor-pointer"
				onpointerdown={(e) => handlePointerDown(e, node)}
				onclick={() => handleNodeClick(node)}
				onkeydown={(e) => { if (e.key === 'Enter') handleNodeClick(node); }}
				role="button"
				tabindex="0"
				aria-label={node.label}
			>
				<!-- Node circle -->
				<circle
					cx={node.x ?? 0}
					cy={node.y ?? 0}
					{r}
					fill={node.isCenter ? 'var(--color-accent)' : 'var(--color-surface)'}
					stroke={node.isCenter ? 'var(--color-accent)' : 'var(--color-border)'}
					stroke-width={node.isCenter ? 2 : 1.5}
					class="transition-all duration-100 {!node.isCenter ? 'hover:stroke-[var(--color-accent)] hover:fill-[var(--color-bg-tertiary)]' : ''}"
				/>
				<!-- Label -->
				<text
					x={node.x ?? 0}
					y={(node.y ?? 0) + r + 16}
					text-anchor="middle"
					fill="var(--color-text-secondary)"
					font-size="10"
					class="pointer-events-none select-none"
				>
					{node.label.length > 25 ? node.label.slice(0, 22) + '...' : node.label}
				</text>
				<!-- Center icon -->
				{#if node.isCenter}
					<text
						x={node.x ?? 0}
						y={(node.y ?? 0) + 4}
						text-anchor="middle"
						fill="var(--color-bg)"
						font-size="14"
						font-weight="bold"
						class="pointer-events-none select-none"
					>Q</text>
				{/if}
			</g>
		{/each}
	</svg>
</div>
