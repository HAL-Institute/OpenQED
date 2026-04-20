import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'dark' | 'light';

const stored = browser ? (localStorage.getItem('theme') as Theme | null) : null;
const initial: Theme = stored ?? 'dark';

export const theme = writable<Theme>(initial);

if (browser) {
	document.documentElement.classList.toggle('dark', initial === 'dark');

	theme.subscribe((value) => {
		document.documentElement.classList.toggle('dark', value === 'dark');
		localStorage.setItem('theme', value);
	});
}

export function toggleTheme() {
	theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
}
