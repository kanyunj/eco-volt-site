<script lang="ts">
	import { magnetic, scrollMotion } from '$lib';
</script>

<svelte:head>
	<title>Eco Volt Dynamics | Solar & Backup Power Solutions</title>
	<meta
		name="description"
		content="Eco Volt Dynamics designs and installs reliable solar and backup power systems for homes, businesses, and institutions in Uganda."
	/>
</svelte:head>

<section class="border-b border-slate-100 bg-slate-900 text-white">
	<div class="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-16 md:flex-row md:py-24">
		<div class="flex-1 space-y-6">
			<p class="text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">Solar & Backup Power in Uganda</p>
			<h1 class="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">Reliable, smart energy for modern homes and businesses.</h1>
			<p class="max-w-xl text-slate-200 text-sm md:text-base">
				Eco Volt Dynamics designs and installs solar and backup power systems that just work, from your first site assessment to professional installation and ongoing
				support.
			</p>

			<div class="flex flex-wrap items-center gap-3">
				<a
					href="/contact"
					use:magnetic
					class="inline-flex items-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white magnetic-btn hover:bg-emerald-600 transition-colors"
				>
					Request a site assessment
				</a>
				<a
					href="/solutions"
					use:magnetic
					class="inline-flex items-center rounded-full border border-slate-600 px-5 py-2.5 text-sm font-medium text-slate-100 magnetic-btn hover:border-slate-300 transition-colors"
				>
					View our solutions
				</a>
			</div>

			<div class="mt-6 grid w-full max-w-xl grid-cols-1 gap-4 text-xs md:grid-cols-3">
				<div class="rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-3">
					<p class="font-semibold text-emerald-300">Engineered systems</p>
					<p class="mt-1 text-slate-300">Designed by qualified electrical and solar engineers.</p>
				</div>
				<div class="rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-3">
					<p class="font-semibold text-amber-300">Future-ready</p>
					<p class="mt-1 text-slate-300">Scalable inverters and batteries that can grow with your needs.</p>
				</div>
				<div class="rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-3">
					<p class="font-semibold text-sky-300">End-to-end support</p>
					<p class="mt-1 text-slate-300">Site survey, installation, and after-sales support.</p>
				</div>
			</div>
		</div>

		<div class="flex-1 w-full">
			<figure class="media-card mx-auto max-w-md aspect-[5/6]" use:scrollMotion={{ once: false, hideOnExit: true }}>
				<img src="/images/hero.png" alt="Eco Volt technician inspecting rooftop solar panels" loading="lazy" decoding="async" />
				<div class="media-overlay text-xs">
					<div class="flex items-center justify-between text-slate-200/80">
						<span class="inline-flex items-center gap-1">
							<span class="h-2 w-2 rounded-full bg-emerald-400"></span>
							System live
						</span>
						<span>Kampala | Home</span>
					</div>
					<div class="rounded-2xl bg-slate-900/70 p-3 backdrop-blur">
						<p class="text-slate-300">Today's solar production</p>
						<p class="text-2xl font-semibold text-white">5.8 kWh</p>
						<p class="text-slate-400">Battery reserve: <span class="text-emerald-300 font-semibold">67%</span></p>
					</div>
					<div class="rounded-2xl bg-slate-900/70 p-3 backdrop-blur">
						<p class="text-slate-300">Critical loads</p>
						<p class="text-slate-100">Lights • Fridge • Wi-Fi • TV</p>
					</div>
				</div>
			</figure>
		</div>
	</div>
</section>

<section class="mx-auto max-w-6xl px-4 py-12 md:py-16" use:scrollMotion={{ once: false, hideOnExit: true }}>
	<div class="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
		<div>
			<h2 class="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">Who we serve</h2>
			<p class="mt-2 max-w-xl text-sm text-slate-600">
				From homes and small businesses to schools and clinics, we design systems around real-world usage, not guesswork.
			</p>
		</div>
	</div>

	<div class="grid gap-6 md:grid-cols-3">
		<div class="surface-card p-5 shadow-sm">
			<p class="text-xs font-semibold uppercase tracking-wide text-emerald-600">Homes</p>
			<h3 class="mt-2 font-semibold text-slate-900">Residential solar and backup</h3>
			<p class="mt-2 text-sm text-slate-600">Keep your lights, fridge, Wi-Fi, and TV on through every outage with quiet, clean power.</p>
		</div>

		<div class="surface-card p-5 shadow-sm">
			<p class="text-xs font-semibold uppercase tracking-wide text-emerald-600">Businesses</p>
			<h3 class="mt-2 font-semibold text-slate-900">Offices, shops &amp; SMEs</h3>
			<p class="mt-2 text-sm text-slate-600">Reduce downtime and generator costs with right-sized solar and backup systems for your operations.</p>
		</div>

		<div class="surface-card p-5 shadow-sm">
			<p class="text-xs font-semibold uppercase tracking-wide text-emerald-600">Institutions</p>
			<h3 class="mt-2 font-semibold text-slate-900">Schools, labs &amp; clinics</h3>
			<p class="mt-2 text-sm text-slate-600">Stable power for computer labs, medical equipment, and critical learning spaces.</p>
		</div>
	</div>
</section>

<section class="mx-auto max-w-6xl px-4 py-12 md:py-16" use:scrollMotion={{ once: false, hideOnExit: true }}>
	<div class="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
		<div>
			<h2 class="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">Happy Experiences</h2>
			<p class="mt-2 max-w-2xl text-sm text-slate-600">Solutions that result in happy clients. We're proud of our work and the difference it makes in people's lives.</p>
		</div>
	</div>

	<div class="grid gap-5 md:grid-cols-3">
		<figure class="media-card aspect-video">
			<img src="/images/home-owner-with-app.jpeg" alt="Homeowner checking the Eco Volt monitoring app" loading="lazy" decoding="async" />
			<figcaption class="media-caption">
				<p>Home experience</p>
				<strong>Clients monitor their systems from anywhere.</strong>
			</figcaption>
		</figure>
		<figure class="media-card aspect-square">
			<img src="/images/panels-installed-on-a-balcony.png" alt="Balcony-mounted solar panels on a modern building" loading="lazy" decoding="async" />
			<figcaption class="media-caption">
				<p>Precision installs</p>
				<strong>Custom mounting for apartments &amp; balconies.</strong>
			</figcaption>
		</figure>
		<figure class="media-card aspect-video md:col-span-1">
			<img src="/images/inverter-and-battery-clean-installation-indoor.jpeg" alt="Indoor inverter and battery setup with clean wiring" loading="lazy" decoding="async" />
			<figcaption class="media-caption">
				<p>Smart storage</p>
				<strong>Inverter + battery stacks for quiet backup.</strong>
			</figcaption>
		</figure>
	</div>
</section>

<section class="bg-slate-50 border-y border-slate-100" use:scrollMotion={{ once: false, hideOnExit: true }}>
	<div class="mx-auto max-w-6xl px-4 py-12 md:py-16">
		<div class="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
			<div>
				<h2 class="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">Core solutions</h2>
				<p class="mt-2 max-w-xl text-sm text-slate-600">Practical, engineered systems for everyday reliability, not just theoretical savings on paper.</p>
			</div>
			<a href="/solutions" class="text-sm font-medium text-emerald-700 hover:text-emerald-800">Explore all solutions &rarr;</a>
		</div>

		<div class="grid gap-6 md:grid-cols-3">
			<article class="surface-card p-5 shadow-sm">
				<h3 class="font-semibold text-slate-900">Solar + battery systems</h3>
				<p class="mt-2 text-sm text-slate-600">Grid-tied and hybrid systems sized to your real loads, from small homes to larger residences and offices.</p>
				<p class="mt-3 text-xs text-slate-500">Typical sizes: 3-15 kW+ depending on usage.</p>
			</article>

			<article class="surface-card p-5 shadow-sm">
				<h3 class="font-semibold text-slate-900">Backup power systems</h3>
				<p class="mt-2 text-sm text-slate-600">Inverters and batteries that keep essential circuits running quietly when power goes off.</p>
				<p class="mt-3 text-xs text-slate-500">Ideal for homes, clinics, offices and small shops.</p>
			</article>

			<article class="surface-card p-5 shadow-sm">
				<h3 class="font-semibold text-slate-900">Electrical design &amp; installations</h3>
				<p class="mt-2 text-sm text-slate-600">Clean, safe wiring and distribution for new builds and upgrades, done to professional standards.</p>
				<p class="mt-3 text-xs text-slate-500">Boards, protections, upgrades, and load optimization.</p>
			</article>
		</div>
	</div>
</section>

<section class="mx-auto max-w-6xl px-4 py-12 md:py-16" use:scrollMotion={{ once: false, hideOnExit: true }}>
	<div class="mb-8 max-w-xl">
		<h2 class="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">How we work</h2>
		<p class="mt-2 text-sm text-slate-600">A simple, transparent process so you know what is happening at every step.</p>
	</div>

	<ol class="grid gap-6 md:grid-cols-4 text-sm">
		<li class="relative surface-card p-5 shadow-sm">
			<div class="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white">1</div>
			<h3 class="font-semibold text-slate-900">Site assessment</h3>
			<p class="mt-2 text-slate-600">We review your current power usage, bills, and site layout (roof, space, wiring).</p>
		</li>
		<li class="relative surface-card p-5 shadow-sm">
			<div class="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white">2</div>
			<h3 class="font-semibold text-slate-900">System design</h3>
			<p class="mt-2 text-slate-600">We size panels, inverters, and batteries based on real loads and backup priorities.</p>
		</li>
		<li class="relative surface-card p-5 shadow-sm">
			<div class="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white">3</div>
			<h3 class="font-semibold text-slate-900">Professional installation</h3>
			<p class="mt-2 text-slate-600">Our team installs, configures, and commissions the system with proper protections.</p>
		</li>
		<li class="relative surface-card p-5 shadow-sm">
			<div class="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white">4</div>
			<h3 class="font-semibold text-slate-900">Support &amp; expansion</h3>
			<p class="mt-2 text-slate-600">We provide after-sales support and can expand the system as your needs grow.</p>
		</li>
	</ol>
</section>

<section class="bg-white border-y border-slate-100" use:scrollMotion={{ once: false, hideOnExit: true }}>
	<div class="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:py-16">
		<div class="flex-1">
			<p class="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Featured project</p>
			<h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Residential solar + backup, Kampala</h2>
			<p class="mt-3 text-sm text-slate-600">A large residence experiencing frequent outages needed a quiet, clean alternative to running a generator every evening.</p>

			<dl class="mt-5 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
				<div>
					<dt class="text-slate-500">System size</dt>
					<dd class="font-semibold text-slate-900">6 kW solar + 10 kWh battery</dd>
				</div>
				<div>
					<dt class="text-slate-500">Critical loads</dt>
					<dd class="font-semibold text-slate-900">Lights, fridge, freezer, Wi-Fi, TV, selected sockets</dd>
				</div>
				<div>
					<dt class="text-slate-500">Outcome</dt>
					<dd class="font-semibold text-slate-900">Generator runtime reduced by ~80% for typical weeks.</dd>
				</div>
			</dl>

			<a href="/projects" class="mt-6 inline-flex text-sm font-medium text-emerald-700 hover:text-emerald-800">View more projects &rarr;</a>
		</div>

		<div class="flex-1">
			<figure class="media-card h-full min-h-[280px] w-full">
				<img src="/images/residential-house-with-panels.png" alt="Kampala residence with rooftop solar array" loading="lazy" decoding="async" />
				<figcaption class="media-caption">
					<p>Residential build</p>
					<strong>Quiet evening power without the generator.</strong>
				</figcaption>
			</figure>
		</div>
	</div>
</section>

<section class="mx-auto max-w-6xl px-4 py-12 md:py-16" use:scrollMotion={{ once: false, hideOnExit: true }}>
	<div class="mb-6 max-w-xl">
		<h2 class="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">Common questions</h2>
		<p class="mt-2 text-sm text-slate-600">Straightforward answers to help you decide if solar and backup power are right for you.</p>
	</div>

	<div class="space-y-4 text-sm">
		<details class="group rounded-2xl border border-slate-100 bg-white p-4">
			<summary class="flex cursor-pointer list-none items-center justify-between gap-2">
				<span class="font-medium text-slate-900">Will my system work when UMEME/power is off?</span>
				<span class="text-xs text-slate-500 group-open:rotate-90 transition-transform">›</span>
			</summary>
			<p class="mt-3 text-slate-600">
				Yes. We design hybrid and backup systems specifically so that key circuits stay powered during outages. We agree with you in advance which loads are critical, and size the system to support them.
			</p>
		</details>

		<details class="group rounded-2xl border border-slate-100 bg-white p-4">
			<summary class="flex cursor-pointer list-none items-center justify-between gap-2">
				<span class="font-medium text-slate-900">How long will the batteries last during a blackout?</span>
				<span class="text-xs text-slate-500 group-open:rotate-90 transition-transform">›</span>
			</summary>
			<p class="mt-3 text-slate-600">
				It depends on the size of the battery bank and what you are running. As a rough guide, we target several hours for lights, internet, TV and a fridge. We will give you estimated backup time for your specific system.
			</p>
		</details>

		<details class="group rounded-2xl border border-slate-100 bg-white p-4">
			<summary class="flex cursor-pointer list-none items-center justify-between gap-2">
				<span class="font-medium text-slate-900">Do you provide maintenance and support?</span>
				<span class="text-xs text-slate-500 group-open:rotate-90 transition-transform">›</span>
			</summary>
			<p class="mt-3 text-slate-600">
				Yes. We offer after-sales support, periodic checks, and can help you expand or adjust your system as your needs change.
			</p>
		</details>
	</div>
</section>

<section class="border-t border-slate-800 bg-slate-900" use:scrollMotion={{ once: false, hideOnExit: true }}>
	<div class="mx-auto max-w-6xl px-4 py-12 md:py-14">
		<div class="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
			<div>
				<h2 class="text-2xl md:text-3xl font-semibold tracking-tight text-white">Ready to stop worrying about power cuts?</h2>
				<p class="mt-2 max-w-xl text-sm text-slate-300">
					Share a few details about your home, business, or institution and we'll propose a right-sized solution, not an oversized one.
				</p>
			</div>
			<div class="flex flex-col items-start gap-3">
				<a
					href="/contact"
					use:magnetic
					class="inline-flex items-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white magnetic-btn hover:bg-emerald-600 transition-colors"
				>
					Request a quote
				</a>
				<p class="text-xs text-slate-400">Prefer WhatsApp? Call or text us, we'll share the number here.</p>
			</div>
		</div>
	</div>
</section>
