import type { RequestHandler } from '@sveltejs/kit';

const MIN_SUBMIT_MS = 3000;
const MINUTE = 60;
const DAY = 24 * 60 * 60;

type Env = {
	TURNSTILE_SECRET?: string;
	MAIL_FROM?: string;
	MAIL_TO?: string;
	RATE_LIMIT?: KVNamespace;
	DB?: D1Database;
};

async function verifyTurnstile(secret: string, token: string, ip: string) {
	const body = new URLSearchParams({ secret, response: token, remoteip: ip });
	const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		body
	});
	return res.json();
}

async function rateLimit(env: Env, ip: string) {
	const kv = env.RATE_LIMIT;
	if (!kv) return { ok: true };
	const now = Date.now();
	const minuteKey = `min:${ip}:${Math.floor(now / (60 * 1000))}`;
	const dayKey = `day:${ip}:${Math.floor(now / (24 * 60 * 60 * 1000))}`;

	const inc = async (key: string, ttl: number) => {
		const current = (await kv.get(key)) ?? '0';
		const next = (parseInt(current) || 0) + 1;
		await kv.put(key, String(next), { expirationTtl: ttl });
		return next;
	};

	const perMinute = await inc(minuteKey, MINUTE);
	if (perMinute > 3) return { ok: false, status: 429, reason: 'Rate limit (minute)' };

	const perDay = await inc(dayKey, DAY);
	if (perDay > 20) return { ok: false, status: 429, reason: 'Rate limit (day)' };

	return { ok: true };
}

async function sendEmail(env: Env, subject: string, text: string, html: string) {
	if (!env.MAIL_FROM || !env.MAIL_TO) return { ok: false, reason: 'Email not configured' };
	const payload = {
		personalizations: [{ to: [{ email: env.MAIL_TO }] }],
		from: { email: env.MAIL_FROM, name: 'Eco Volt Website' },
		subject,
		content: [
			{ type: 'text/plain', value: text },
			{ type: 'text/html', value: html }
		]
	};
	const res = await fetch('https://api.mailchannels.net/tx/v1/send', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload)
	});
	return { ok: res.ok };
}

export const POST: RequestHandler = async ({ request, getClientAddress, platform }) => {
	const env = (platform?.env ?? {}) as unknown as Env;
	const ip = getClientAddress();
	const ua = request.headers.get('user-agent') ?? '';

	const form = await request.formData();

	// Honeypot
	const company = (form.get('company') || '').toString().trim();
	if (company) return new Response('OK', { status: 200 });

	// Timing
	const tsStr = form.get('ts')?.toString();
	const ts = tsStr ? Number(tsStr) : 0;
	if (!ts || Date.now() - ts < MIN_SUBMIT_MS) {
		return new Response('Too fast', { status: 400 });
	}

	// Turnstile (skip in dev if not configured)
	const token = form.get('cf-turnstile-response')?.toString();
	if (env.TURNSTILE_SECRET) {
		// Production: Turnstile is required
		if (!token) return new Response('Captcha missing', { status: 400 });
		const verify = await verifyTurnstile(env.TURNSTILE_SECRET, token, ip);
		if (!verify?.success) {
			return new Response('Captcha failed', { status: 403 });
		}
	} else if (token) {
		// Dev mode: if token is present, verify it if possible
		// (but don't fail if it's missing in dev)
		// For now, we'll just skip verification in dev
	}

	// Rate limit (skip in dev if KV is not available)
	const rl = await rateLimit(env, ip);
	if (!rl.ok) return new Response(rl.reason ?? 'Too many requests', { status: rl.status ?? 429 });

	// Extract fields
	const name = form.get('name')?.toString().trim() || '';
	const email = form.get('email')?.toString().trim() || '';
	const phone = form.get('phone')?.toString().trim() || '';
	const projectType = form.get('projectType')?.toString().trim() || '';
	const message = form.get('message')?.toString().trim() || '';

	if (!name || !email || !message) {
		return new Response('Invalid input', { status: 400 });
	}

	// Persist to D1 if available
	try {
		if (env.DB) {
			await env.DB.prepare(
				`CREATE TABLE IF NOT EXISTS submissions (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					created_at TEXT NOT NULL,
					name TEXT NOT NULL,
					email TEXT NOT NULL,
					phone TEXT,
					project_type TEXT,
					message TEXT NOT NULL,
					ip TEXT,
					user_agent TEXT
				);`
			).run();
			await env.DB.prepare(
				`INSERT INTO submissions (created_at, name, email, phone, project_type, message, ip, user_agent)
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
			)
				.bind(new Date().toISOString(), name, email, phone, projectType, message, ip, ua)
				.run();
		}
	} catch {
		// swallow storage errors for now
	}

	// Email action
	const subject = `New contact submission — ${name}`;
	const text = `Name: ${name}
Email: ${email}
Phone: ${phone}
Project: ${projectType}
IP: ${ip}
UA: ${ua}

Message:
${message}`;
	const html = `<p><strong>Name:</strong> ${name}<br/>
<strong>Email:</strong> ${email}<br/>
<strong>Phone:</strong> ${phone}<br/>
<strong>Project:</strong> ${projectType}</p>
<p><strong>Message</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
<hr/><p style="color:#64748b;font-size:12px">IP: ${ip}<br/>UA: ${ua}</p>`;

	await sendEmail(env, subject, text, html);

	return new Response('OK', { status: 200 });
};



