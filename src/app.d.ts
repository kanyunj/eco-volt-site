// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env?: {
				TURNSTILE_SECRET?: string;
				MAIL_FROM?: string;
				MAIL_TO?: string;
				RATE_LIMIT?: KVNamespace;
				DB?: D1Database;
			};
		}
	}
}

export {};
