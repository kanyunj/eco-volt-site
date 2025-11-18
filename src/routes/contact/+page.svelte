<script lang="ts">
	import { magnetic, scrollMotion } from '$lib';
	import { onMount, tick } from 'svelte';

	let status: 'idle' | 'submitting' | 'submitted' | 'error' = 'idle';
	let errorMessage = '';
	let ts = Date.now();
	let turnstileWidgetId: string | null = null;
	let turnstileReady = false;
	let turnstileContainer: HTMLDivElement | null = null;

	const projectTypes = ['Residential solar + backup', 'Commercial / institutional', 'Backup power only', 'Electrical design & installations', 'Other / not sure'];

	const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITEKEY || '';

	onMount(async () => {
		ts = Date.now();
		
		// Debug: Log if site key is available
		if (typeof window !== 'undefined') {
			if (!turnstileSiteKey) {
				console.warn('VITE_TURNSTILE_SITEKEY is not set. Turnstile widget will not render.');
			} else {
				console.log('Turnstile site key found, initializing widget...');
			}
		}
		
		// Initialize Turnstile widget if site key is available
		if (turnstileSiteKey && typeof window !== 'undefined') {
			await tick(); // Wait for DOM to be ready
			
			let retryCount = 0;
			const maxRetries = 50; // 5 seconds max wait time
			
			const initTurnstile = () => {
				if ((window as any).turnstile && turnstileContainer) {
					try {
						turnstileWidgetId = (window as any).turnstile.render(turnstileContainer, {
							sitekey: turnstileSiteKey,
							callback: (token: string) => {
								turnstileReady = true;
								console.log('Turnstile widget ready');
							},
							'error-callback': () => {
								turnstileReady = false;
								console.error('Turnstile error');
							}
						});
						console.log('Turnstile widget rendered successfully');
					} catch (error) {
						console.error('Failed to render Turnstile:', error);
					}
				} else if (retryCount < maxRetries) {
					retryCount++;
					if (!(window as any).turnstile) {
						// Script not loaded yet, retry
						setTimeout(initTurnstile, 100);
					} else if (!turnstileContainer) {
						// Container not ready yet, retry
						setTimeout(initTurnstile, 100);
					}
				} else {
					console.error('Failed to initialize Turnstile widget after max retries');
				}
			};
			
			// Start initialization
			initTurnstile();
		}
	});

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		
		// Check if Turnstile is required but not ready
		if (turnstileSiteKey && !turnstileReady) {
			status = 'error';
			errorMessage = 'Please complete the captcha verification';
			setTimeout(() => {
				status = 'idle';
				errorMessage = '';
			}, 3000);
			return;
		}
		
		status = 'submitting';
		errorMessage = '';
		
		const form = event.target as HTMLFormElement;
		const body = new FormData(form);
		
		// Get Turnstile token if widget is present
		if (turnstileSiteKey && typeof window !== 'undefined' && (window as any).turnstile) {
			const turnstileInput = form.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement;
			if (turnstileInput && turnstileInput.value) {
				body.append('cf-turnstile-response', turnstileInput.value);
			} else if (turnstileWidgetId) {
				// Try to get token from widget
				const token = (window as any).turnstile.getResponse(turnstileWidgetId);
				if (token) {
					body.append('cf-turnstile-response', token);
				}
			}
		}

		try {
			const res = await fetch('/contact', { method: 'POST', body });
			
			if (res.ok) {
				form.reset();
				// Reset Turnstile widget if present
				if (turnstileSiteKey && turnstileWidgetId && typeof window !== 'undefined' && (window as any).turnstile) {
					(window as any).turnstile.reset(turnstileWidgetId);
					turnstileReady = false;
				}
				status = 'submitted';
				setTimeout(() => (status = 'idle'), 4000);
			} else {
				const text = await res.text();
				status = 'error';
				errorMessage = text || `Error ${res.status}: ${res.statusText}`;
				// Reset Turnstile on error
				if (turnstileSiteKey && turnstileWidgetId && typeof window !== 'undefined' && (window as any).turnstile) {
					(window as any).turnstile.reset(turnstileWidgetId);
					turnstileReady = false;
				}
				setTimeout(() => {
					status = 'idle';
					errorMessage = '';
				}, 5000);
			}
		} catch (err) {
			status = 'error';
			errorMessage = 'Failed to submit. Please try again or contact us directly.';
			console.error('Form submission error:', err);
			// Reset Turnstile on error
			if (turnstileSiteKey && turnstileWidgetId && typeof window !== 'undefined' && (window as any).turnstile) {
				(window as any).turnstile.reset(turnstileWidgetId);
				turnstileReady = false;
			}
			setTimeout(() => {
				status = 'idle';
				errorMessage = '';
			}, 5000);
		}
	}
</script>

<svelte:head>
	<title>Contact | Eco Volt Dynamics</title>
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</svelte:head>

<section class="mx-auto max-w-5xl px-4 py-12 md:py-16 space-y-10" use:scrollMotion>
	<div class="space-y-3">
		<p class="text-xs uppercase tracking-[0.3em] text-emerald-600 font-semibold">Let's talk</p>
		<h1 class="text-3xl font-semibold tracking-tight text-slate-900">Share your project or power challenge.</h1>
		<p class="text-sm text-slate-600">
			Tell us about your home, business, or institution and we'll line up the right assessment. Prefer WhatsApp or phone? We've got you covered.
		</p>
	</div>

	<div class="grid gap-8 lg:grid-cols-[1fr,1.2fr]">
		<div class="space-y-6">
			<div class="surface-card rounded-3xl p-6 shadow-sm">
				<h2 class="text-lg font-semibold text-slate-900">Quick details</h2>
				<ul class="mt-4 space-y-3 text-sm text-slate-600">
					<li class="flex flex-col">
						<span class="font-medium text-slate-900">Phone</span>
						<a href="tel:+256781894352" class="text-slate-700">+256 781 894 352</a>
					</li>
					<li class="flex flex-col">
						<span class="font-medium text-slate-900">Email</span>
						<a href="mailto:hello@ecovoltdynamics.com" class="text-emerald-600 hover:text-emerald-800">hello@ecovoltdynamics.com</a>
					</li>
					<li class="flex flex-col">
						<span class="font-medium text-slate-900">WhatsApp</span>
						<a href="https://wa.me/256781894352" target="_blank" rel="noreferrer" class="text-emerald-600 hover:text-emerald-800">
							Message us on WhatsApp
						</a>
					</li>
				</ul>
			</div>

			<div class="surface-card surface-card--emerald rounded-3xl p-6 text-sm text-emerald-900 space-y-3">
				<p class="font-semibold">What to include</p>
				<ul class="space-y-2">
					<li>Location (district, neighborhood, or GPS pin)</li>
					<li>What loads must stay on during outages</li>
					<li>Current backup setup (if any) and goals</li>
				</ul>
			</div>
		</div>

		<form class="surface-card rounded-3xl p-6 shadow-sm" method="POST" on:submit|preventDefault={handleSubmit}>
			<!-- Honeypot field (hidden visually) -->
			<label class="sr-only" aria-hidden="true" tabindex="-1">
				<input name="company" autocomplete="off" tabindex="-1" style="position:absolute;left:-9999px;opacity:0" />
			</label>

			<!-- Timing field -->
			<input type="hidden" name="ts" value={ts} />
			
			<!-- Cloudflare Turnstile widget (only if site key is available) -->
			{#if turnstileSiteKey}
				<div bind:this={turnstileContainer} class="mb-5"></div>
			{/if}
			
			<h2 class="text-lg font-semibold text-slate-900 mb-5">About you</h2>
			
			<div class="space-y-5">
			
				<div class="grid gap-4 md:grid-cols-2">
					<label class="text-sm font-medium text-slate-900">
						<span class="mb-1 block">Full name</span>
						<input class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-emerald-500 focus:outline-none" name="name" required />
					</label>
					<label class="text-sm font-medium text-slate-900">
						<span class="mb-1 block">Organization (optional)</span>
						<input class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-emerald-500 focus:outline-none" name="organization" />
					</label>
				</div>

				<div class="grid gap-4 md:grid-cols-2">
					<label class="text-sm font-medium text-slate-900">
						<span class="mb-1 block">Email</span>
						<input type="email" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-emerald-500 focus:outline-none" name="email" required />
					</label>
					<label class="text-sm font-medium text-slate-900">
						<span class="mb-1 block">Phone / WhatsApp</span>
						<input class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-emerald-500 focus:outline-none" name="phone" required />
					</label>
				</div>

				<label class="text-sm font-medium text-slate-900">
					<span class="mb-1 block">Project type</span>
					<select class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-emerald-500 focus:outline-none" name="projectType" required>
						<option value="" disabled selected>Select an option</option>
						{#each projectTypes as type}
							<option value={type}>{type}</option>
						{/each}
					</select>
				</label>

				<label class="text-sm font-medium text-slate-900">
					<span class="mb-1 block">Tell us about your site</span>
					<textarea
						class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-emerald-500 focus:outline-none"
						name="message"
						rows="5"
						placeholder="Loads, outage pattern, goals..."
						required
					></textarea>
				</label>

				<button
					type="submit"
					use:magnetic
					disabled={status === 'submitting'}
					class="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white magnetic-btn hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{status === 'submitting' ? 'Sending...' : 'Send details'}
				</button>
			</div>

			{#if status === 'submitted'}
				<p class="text-center text-sm text-emerald-600 font-medium" aria-live="polite">Thanks! We'll review and get in touch shortly.</p>
			{:else if status === 'error'}
				<p class="text-center text-sm text-red-600 font-medium" aria-live="polite">{errorMessage || 'Something went wrong. Please try again.'}</p>
			{/if}
		</form>
	</div>
</section>

