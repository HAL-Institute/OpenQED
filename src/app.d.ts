// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

declare global {
	interface UserSession {
		id: string;
		username: string;
		displayName: string;
		avatarUrl: string;
		verified: boolean;
		verificationMethod?: 'orcid' | 'university' | 'time';
		createdAt: string;
		contributions: number;
		proofs: number;
		reductions: number;
	}

	namespace App {
		// interface Error {}
		interface Locals {
			user: UserSession | null;
		}
		interface PageData {
			user: UserSession | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
