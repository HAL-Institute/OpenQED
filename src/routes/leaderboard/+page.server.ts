import { getAllUsers, serializeUser } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const users = getAllUsers()
		.map(serializeUser)
		.sort((a, b) => b.proofs + b.reductions - (a.proofs + a.reductions));

	return { users };
};
