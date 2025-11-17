import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import dotenv from 'dotenv';
import { join } from 'path';

// Load .env file in development (Vite might not automatically load it for server-side code)
if (process.env.NODE_ENV !== 'production') {
	// Try multiple paths to find .env file
	const paths = [
		join(process.cwd(), '.env'),
		join(process.cwd(), '..', '.env'),
		'.env'
	];
	
	let loaded = false;
	for (const envPath of paths) {
		const result = dotenv.config({ path: envPath, override: false });
		if (!result.error && result.parsed && Object.keys(result.parsed).length > 0) {
			console.log('Loaded .env file from:', envPath);
			console.log('Variables loaded:', Object.keys(result.parsed));
			loaded = true;
			break;
		}
	}
	
	if (!loaded) {
		console.warn('Failed to load .env file from any path');
		console.warn('Checked paths:', paths);
		console.warn('Current working directory:', process.cwd());
		// Try loading without explicit path (uses default)
		const defaultResult = dotenv.config();
		if (defaultResult.parsed && Object.keys(defaultResult.parsed).length > 0) {
			console.log('Loaded .env from default location:', Object.keys(defaultResult.parsed));
		}
	}
}

const PAGE_SIZE = 20;

export const load: PageServerLoad = async ({ platform, url, cookies }) => {
	const platformEnv = platform?.env as { DB?: D1Database; ADMIN_PASSWORD?: string } | undefined;
	const authed = cookies.get('admin_session') === 'ok';
	const page = Number(url.searchParams.get('page') ?? '1');
	const offset = (page - 1) * PAGE_SIZE;

	let rows: Array<Record<string, unknown>> = [];
	let total = 0;

	if (authed && platformEnv?.DB) {
		try {
			const count = await platformEnv.DB.prepare('SELECT COUNT(*) as c FROM submissions').first<{ c: number }>();
			total = Number(count?.c ?? 0);
			const data = await platformEnv.DB.prepare(
				'SELECT id, created_at, name, email, phone, project_type, message FROM submissions ORDER BY created_at DESC LIMIT ? OFFSET ?'
			)
				.bind(PAGE_SIZE, offset)
				.all();
			rows = data.results as Array<Record<string, unknown>>;
		} catch {
			// ignore
		}
	}

	return { authed, rows, total, page, pageSize: PAGE_SIZE };
};

export const actions: Actions = {
	login: async ({ request, platform, cookies }) => {
		// Check Cloudflare platform env first, fallback to $env/dynamic/private or process.env for local dev
		const platformEnv = platform?.env as { ADMIN_PASSWORD?: string } | undefined;
		const adminPassword = platformEnv?.ADMIN_PASSWORD || env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
		
		// Debug: log if password is missing (only in dev)
		if (!adminPassword && process.env.NODE_ENV !== 'production') {
			console.warn('ADMIN_PASSWORD not found. Checked:', {
				platform: !!platformEnv?.ADMIN_PASSWORD,
				envDynamic: !!env.ADMIN_PASSWORD,
				processEnv: !!process.env.ADMIN_PASSWORD
			});
		}
		
		const data = await request.formData();
		const password = data.get('password')?.toString() ?? '';
		
		if (!adminPassword) {
			return { success: false, error: 'Server configuration error: Admin password not set' };
		}
		
		if (password === adminPassword) {
			cookies.set('admin_session', 'ok', { path: '/admin', httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 });
			return { success: true };
		}
		return { success: false, error: 'Invalid password' };
	},
	logout: async ({ cookies }) => {
		cookies.delete('admin_session', { path: '/admin' });
		return { success: true };
	}
};



