<script lang="ts">
	import { magnetic, scrollMotion } from '$lib';

	const projects = [
		{
			category: 'Residential',
			title: 'Lake View Residence, Kampala',
			summary: '6 kW solar array with 10 kWh lithium storage supporting critical evening loads and pool equipment.',
			outcome: 'Generator runtime reduced by 80% and quieter evenings for the family.',
			image: '/images/residential-house-with-panels.png',
			photoIdea: 'Wide shot of a modern Kampala home with panels integrated into the roofline'
		},
		{
			category: 'Education',
			title: 'Community School ICT Lab',
			summary: 'Hybrid inverter system powering 30 computers, networking gear, and lighting with remote monitoring.',
			outcome: 'Zero class disruptions during UMEME outages and predictable monthly energy costs.',
			image: '/images/installation-at-school.jpeg',
			photoIdea: 'Students using computers in a lab with visible solar equipment outside'
		}
	];
</script>

<svelte:head>
	<title>Projects | Eco Volt Dynamics</title>
</svelte:head>

<section class="mx-auto max-w-5xl px-4 py-12 md:py-16 space-y-8" use:scrollMotion>
	<div class="space-y-4">
		<p class="text-xs uppercase tracking-[0.3em] text-emerald-600 font-semibold">Recent work</p>
		<h1 class="text-3xl font-semibold tracking-tight text-slate-900">Case studies and installations.</h1>
		<p class="text-sm text-slate-600 max-w-3xl">
			We document each project so you know how we size systems, coordinate installation, and support clients afterward. Here are a few representative examples.
		</p>
	</div>

	<div class="space-y-6">
		{#each projects as project}
			<article class="surface-card rounded-3xl p-6 shadow-sm space-y-4">
				<div class="overflow-hidden rounded-2xl border border-slate-100">
					<img src={project.image} alt={project.photoIdea} loading="lazy" decoding="async" class="h-56 w-full object-cover" />
				</div>
				<p class="text-xs font-semibold uppercase tracking-wide text-emerald-600">{project.category}</p>
				<h2 class="mt-2 text-xl font-semibold text-slate-900">{project.title}</h2>
				<p class="mt-3 text-sm text-slate-600">{project.summary}</p>
				<div class="mt-4 rounded-2xl bg-slate-50 p-4 text-sm">
					<p class="text-slate-500">Result</p>
					<p class="font-medium text-slate-900">{project.outcome}</p>
				</div>
			</article>
		{/each}
	</div>

	<div class="rounded-3xl border border-dashed border-slate-200 p-8 text-center">
		<p class="text-sm text-slate-600">Want to feature your project once live? We can share performance snapshots, photos, and lessons learned.</p>
		<a
			href="/contact"
			use:magnetic
			class="mt-4 inline-flex items-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium text-white magnetic-btn hover:bg-emerald-600"
		>
			Start a project &rarr;
		</a>
	</div>
</section>

