import { error } from '@sveltejs/kit';
import { getProblemById } from '$lib/utils/data';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const problem = getProblemById(params.id);
	if (!problem) {
		throw error(404, 'Problem not found');
	}
	return { problem };
};
