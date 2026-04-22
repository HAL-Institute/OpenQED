import cloudflare from '@sveltejs/adapter-cloudflare';
import auto from '@sveltejs/adapter-auto';

const isCloudflare = process.env.CF_PAGES === '1';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: isCloudflare ? cloudflare() : auto()
	}
};

export default config;
