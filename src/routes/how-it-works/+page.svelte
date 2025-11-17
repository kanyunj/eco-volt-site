<script lang="ts">
	import { scrollMotion } from '$lib';

	const steps = [
		{
			title: 'Site assessment',
			description: 'We learn your load profile, outage pain points, and inspect available roof or ground space.'
		},
		{
			title: 'System design',
			description: 'Panels, inverters, batteries, protections, and monitoring are sized for resilience and growth.'
		},
		{
			title: 'Installation & commissioning',
			description: 'Our electricians handle mounting, wiring, testing, and client handover with clear documentation.'
		},
		{
			title: 'Support & optimization',
			description: 'We track system health, answer questions, and can add more capacity when your needs change.'
		}
	];
</script>

<svelte:head>
	<title>How It Works | Eco Volt Dynamics</title>
</svelte:head>

<section class="mx-auto max-w-4xl px-4 py-12 md:py-16 space-y-10" use:scrollMotion>
	<div class="space-y-4 text-center">
		<p class="text-xs uppercase tracking-[0.3em] text-emerald-600 font-semibold">Process</p>
		<h1 class="text-3xl font-semibold tracking-tight text-slate-900">A clear journey from assessment to support.</h1>
		<p class="text-sm text-slate-600">
			You always know the next step, who is responsible, and what information we need from you. This helps projects move quickly and avoids surprises.
		</p>
	</div>

	<ol class="grid gap-6 md:grid-cols-2">
		{#each steps as step, index}
			<li class="surface-card rounded-3xl p-6 shadow-sm">
				<div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-base font-semibold text-white">
					{index + 1}
				</div>
				<h2 class="text-lg font-semibold text-slate-900">{step.title}</h2>
				<p class="mt-2 text-sm text-slate-600">{step.description}</p>
			</li>
		{/each}
	</ol>

	<div class="rounded-3xl border border-slate-900 bg-slate-900 p-8 text-white">
		<h3 class="text-xl font-semibold">Timeline</h3>
		<p class="mt-3 text-sm text-slate-200">
			Small backup systems can be deployed in 1-2 weeks, while larger commercial installs typically range from 4-8 weeks depending on procurement and site readiness.
		</p>
	</div>
</section>

