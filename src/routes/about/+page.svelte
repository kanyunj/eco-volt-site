<script lang="ts">
	import { scrollMotion } from '$lib';

	const values = [
		{ title: 'Engineer first', copy: 'We design systems around measured loads and standards, not guesses or equipment promos.' },
		{ title: 'Transparent advice', copy: 'Clients see bills of materials, warranties, and realistic performance expectations.' },
		{ title: 'Local support', copy: 'Our Kampala-based team answers questions quickly and visits sites when needed.' }
	];
</script>

<svelte:head>
	<title>About | Eco Volt Dynamics</title>
</svelte:head>

<section class="mx-auto max-w-4xl px-4 py-12 md:py-16 space-y-12" use:scrollMotion>
	<div class="space-y-4">
		<p class="text-xs uppercase tracking-[0.3em] text-emerald-600 font-semibold">Our story</p>
		<h1 class="text-3xl font-semibold tracking-tight text-slate-900">Why Eco Volt Dynamics exists.</h1>
		<p class="text-sm text-slate-600">
			We are a solar and electrical engineering team based in Uganda. We believe reliable power should be predictable, safe, and future-ready for homes, businesses, and institutions.
		</p>
	</div>

	<figure class="media-card aspect-video">
		<img src="/images/installation-team.png" alt="Eco Volt installation team standing together after a project" loading="lazy" decoding="async" />
		<figcaption class="media-caption">
			<p>The team</p>
			<strong>Engineers, electricians, and project leads in Kampala.</strong>
		</figcaption>
	</figure>

	<div class="space-y-4 text-sm text-slate-600">
		<p>
			After a decade designing electrical systems for mixed-use developments, our founders saw how often backup solutions were pieced together with little documentation or thought for expansion.
			Eco Volt Dynamics set out to fix that with engineered solutions, clear communication, and long-term service.
		</p>
		<p>
			Today we combine solar, battery storage, and smart electrical design to keep critical loads online across Kampala and upcountry projects. We partner with trusted component suppliers and back every install with support.
		</p>
	</div>

	<div class="grid gap-6 md:grid-cols-3">
		{#each values as value}
			<div class="surface-card rounded-3xl p-5 shadow-sm">
				<h2 class="font-semibold text-slate-900">{value.title}</h2>
				<p class="mt-2 text-sm text-slate-600">{value.copy}</p>
			</div>
		{/each}
	</div>

	<div class="rounded-3xl border border-dashed border-slate-200 p-6 text-sm text-slate-600">
		<p>Want the full origin story or team bios? We'll keep building this page as we document more of the journey.</p>
	</div>
</section>

