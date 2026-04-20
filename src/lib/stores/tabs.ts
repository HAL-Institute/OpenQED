import { writable, derived } from 'svelte/store';
import type { Tab } from '$lib/utils/types';

const defaultTabs: Tab[] = [
	{ id: 'description', label: 'Description', type: 'description', closable: false },
	{ id: 'graph', label: 'Graph', type: 'graph', closable: false }
];

export const tabs = writable<Tab[]>([...defaultTabs]);
export const activeTabId = writable<string>('description');

export const activeTab = derived([tabs, activeTabId], ([$tabs, $activeTabId]) =>
	$tabs.find((t) => t.id === $activeTabId)
);

export function resetTabs() {
	tabs.set([...defaultTabs]);
	activeTabId.set('description');
}

export function openSubproblemTab(subProblemId: string, label: string) {
	tabs.update(($tabs) => {
		const existing = $tabs.find((t) => t.subProblemId === subProblemId);
		if (existing) {
			activeTabId.set(existing.id);
			return $tabs;
		}
		const newTab: Tab = {
			id: `sub-${subProblemId}`,
			label,
			type: 'subproblem',
			closable: true,
			subProblemId
		};
		activeTabId.set(newTab.id);
		return [...$tabs, newTab];
	});
}

export function closeTab(tabId: string) {
	tabs.update(($tabs) => {
		const idx = $tabs.findIndex((t) => t.id === tabId);
		if (idx === -1 || !$tabs[idx].closable) return $tabs;

		const newTabs = $tabs.filter((t) => t.id !== tabId);

		activeTabId.update(($active) => {
			if ($active === tabId) {
				// Switch to the tab before the closed one, or description
				const newIdx = Math.min(idx, newTabs.length - 1);
				return newTabs[newIdx]?.id ?? 'description';
			}
			return $active;
		});

		return newTabs;
	});
}

export function setActiveTab(tabId: string) {
	activeTabId.set(tabId);
}
