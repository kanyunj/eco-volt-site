<script lang="ts">
	import { magnetic, scrollMotion } from '$lib';

	const solutions = [
		{
			title: 'Residential solar + backup',
			summary: 'Hybrid systems sized for homes and apartments that keep daily life running.',
			details: ['3-10 kW packages', 'Battery storage tailored to critical loads', 'Ongoing remote monitoring'],
			image: '/images/installation-in-progress-on-roof.png',
			photoIdea: 'Technicians installing rooftop solar for a home'
		},
		{
			title: 'Commercial & institutional systems',
			summary: 'Engineered capacity for schools, clinics, and SMEs that need predictable power.',
			details: ['Three-phase capable', 'Energy audits and reporting', 'Planned maintenance options'],
			image: '/images/panels-on-a-clinic.png',
			photoIdea: 'Clinic or school equipment room with labeled inverters and batteries'
		},
		{
			title: 'Backup power (inverters + batteries)',
			summary: 'Quiet alternatives to generators for essential circuits when the grid is down.',
			details: ['Single and split-phase', 'Wall-mounted lithium batteries', 'Automatic transfer switching'],
			image: '/images/battery.png',
			photoIdea: 'Close-up of wall-mounted inverter + battery stack in a tidy utility room'
		},
		{
			title: 'Electrical design & installations',
			summary: 'Professional wiring, distribution boards, and load optimization for new builds or upgrades.',
			details: ['As-built drawings', 'Protection coordination', 'Smart metering integrations'],
			image: '/images/electrical-drawings.jpeg',
			photoIdea: 'Engineer marking up distribution board plans or doing QA with tablet'
		}
	];
</script>

<svelte:head>
	<title>Solutions | Eco Volt Dynamics</title>
</svelte:head>

<section class="mx-auto max-w-5xl px-4 py-12 md:py-16 space-y-10" use:scrollMotion>
	<div class="space-y-4">
		<p class="text-xs uppercase tracking-[0.3em] text-emerald-600 font-semibold">What we deliver</p>
		<h1 class="text-3xl font-semibold tracking-tight text-slate-900">Solar, backup, and electrical systems built for Uganda.</h1>
		<p class="text-sm text-slate-600 max-w-3xl">
			Every engagement starts with a conversation about your loads, the outages you face, and the future capacity you might need. From there, we design and implement right-sized systems.
		</p>
	</div>

	<div class="grid gap-6 md:grid-cols-2">
		{#each solutions as solution}
			<article class="surface-card rounded-3xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-card transition-all">
				<div class="mb-4 overflow-hidden rounded-2xl border border-slate-100">
					<img src={solution.image} alt={solution.photoIdea} loading="lazy" decoding="async" class="h-48 w-full object-cover" />
				</div>
				<h2 class="text-xl font-semibold text-slate-900">{solution.title}</h2>
				<p class="mt-3 text-sm text-slate-600">{solution.summary}</p>
				<ul class="mt-4 space-y-2 text-sm text-slate-600">
					{#each solution.details as detail}
						<li class="flex gap-2">
							<span class="text-emerald-500">•</span>
							<span>{detail}</span>
						</li>
					{/each}
				</ul>
			</article>
		{/each}
	</div>

	<div class="rounded-3xl border border-emerald-100 bg-emerald-50 p-8">
		<h3 class="text-xl font-semibold text-emerald-900">Need something unique?</h3>
		<p class="mt-3 text-sm text-emerald-800">
			We frequently support mixed-use buildings, farms, telecom sites, and industrial clients. Share the scenario and we'll map out the electrical design, rollout plan, and support model.
		</p>
		<a
			href="/contact"
			use:magnetic
			class="mt-5 inline-flex items-center rounded-full border border-emerald-200 px-5 py-2 text-sm font-medium text-emerald-700 hover:text-emerald-900 magnetic-btn"
		>
			Talk to our team &rarr;
		</a>
	</div>
</section>

