<script lang="ts">
	import { Marked } from 'marked';
	import katex from 'katex';
	import hljs from 'highlight.js';
	import lean4 from '$lib/utils/lean-highlight';

	hljs.registerLanguage('lean', lean4);

	let { content }: { content: string } = $props();

	let html = $state('');

	function renderMath(src: string, displayMode: boolean): string {
		try {
			return katex.renderToString(src, { displayMode, throwOnError: false });
		} catch {
			return src;
		}
	}

	function renderMarkdown(md: string): string {
		let processed = md.replace(/\$\$([\s\S]*?)\$\$/g, (_match, tex) => {
			return renderMath(tex.trim(), true);
		});
		processed = processed.replace(/(?<!\$)\$(?!\$)((?:[^$\\]|\\.)+?)\$/g, (_match, tex) => {
			return renderMath(tex.trim(), false);
		});

		const marked = new Marked({
			renderer: {
				code({ text, lang }: { text: string; lang?: string | null }) {
					if (lang && hljs.getLanguage(lang)) {
						const highlighted = hljs.highlight(text, { language: lang }).value;
						return `<pre class="hljs"><code class="language-${lang}">${highlighted}</code></pre>`;
					}
					const highlighted = hljs.highlightAuto(text).value;
					return `<pre class="hljs"><code>${highlighted}</code></pre>`;
				}
			}
		});

		return marked.parse(processed) as string;
	}

	$effect(() => {
		html = renderMarkdown(content);
	});
</script>

<div class="markdown-content">
	{@html html}
</div>

<style>
	.markdown-content :global(h1) {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 0.75rem;
		color: var(--color-text);
	}
	.markdown-content :global(h2) {
		font-size: 1.125rem;
		font-weight: 600;
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
		color: var(--color-text);
	}
	.markdown-content :global(h3) {
		font-size: 1rem;
		font-weight: 600;
		margin-top: 1.25rem;
		margin-bottom: 0.5rem;
		color: var(--color-text);
	}
	.markdown-content :global(p) {
		margin-bottom: 0.75rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
		font-size: 0.875rem;
	}
	.markdown-content :global(strong) {
		color: var(--color-text);
		font-weight: 600;
	}
	.markdown-content :global(em) {
		font-style: italic;
	}
	.markdown-content :global(a) {
		color: var(--color-text);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.markdown-content :global(a:hover) {
		color: var(--color-text-secondary);
	}
	.markdown-content :global(ul),
	.markdown-content :global(ol) {
		margin-bottom: 0.75rem;
		padding-left: 1.5rem;
		color: var(--color-text-secondary);
		font-size: 0.875rem;
	}
	.markdown-content :global(li) {
		margin-bottom: 0.25rem;
		line-height: 1.7;
	}
	.markdown-content :global(pre) {
		margin-bottom: 0.75rem;
		border-radius: 0.5rem;
		padding: 1rem;
		overflow-x: auto;
		background-color: var(--color-bg-tertiary);
		font-size: 0.8rem;
		line-height: 1.6;
	}
	.markdown-content :global(code) {
		font-family: var(--font-mono);
	}
	.markdown-content :global(:not(pre) > code) {
		background-color: var(--color-bg-tertiary);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.8rem;
		color: var(--color-text);
	}
	.markdown-content :global(blockquote) {
		border-left: 3px solid var(--color-border);
		padding-left: 1rem;
		margin-bottom: 0.75rem;
		color: var(--color-text-muted);
	}
	.markdown-content :global(.katex-display) {
		margin: 1rem 0;
		overflow-x: auto;
	}
</style>
