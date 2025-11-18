<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { magnetic } from '$lib';

	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/solutions', label: 'Solutions' },
		{ href: '/projects', label: 'Projects' },
		{ href: '/how-it-works', label: 'How It Works' },
		{ href: '/about', label: 'About' }
	] as const;

	let { children } = $props();
	
	let menuDetails: HTMLDetailsElement;
	
	function closeMenu() {
		if (menuDetails) {
			menuDetails.open = false;
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen flex flex-col bg-slate-50 text-slate-900">
	<header class="border-b border-slate-100 bg-white/80 backdrop-blur">
		<nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
			<a href="/" class="flex items-center gap-3">
				<div class="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold text-lg">
					EV
				</div>
				<div class="leading-tight">
					<p class="font-semibold tracking-tight">Eco Volt Dynamics</p>
					<p class="text-xs text-slate-500">Solar &amp; Power Solutions</p>
				</div>
			</a>

			<div class="hidden md:flex items-center gap-6 text-sm">
				{#each navLinks as link}
					<a href={link.href} class="text-slate-600 hover:text-slate-900 transition-colors">
						{link.label}
					</a>
				{/each}
				<a
					href="/contact"
					use:magnetic
					class="inline-flex items-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white magnetic-btn hover:bg-emerald-600 transition-colors"
				>
					Request a Quote
				</a>
			</div>

			<div class="flex items-center gap-2 md:hidden text-sm">
				<details bind:this={menuDetails} class="relative z-50">
					<summary class="cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-slate-700 hover:border-slate-400">
						Menu
					</summary>
					<div class="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-100 bg-white p-3 shadow-card z-50">
						<div class="flex flex-col gap-2">
							{#each navLinks as link}
								<a href={link.href} onclick={closeMenu} class="text-slate-600 hover:text-slate-900">
									{link.label}
								</a>
							{/each}
							<a href="/contact" onclick={closeMenu} class="text-emerald-600 font-medium hover:text-emerald-700">
								Request a Quote
							</a>
						</div>
					</div>
				</details>
			</div>
		</nav>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="border-t border-slate-100 bg-white mt-12">
		<div class="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
			<p>© {new Date().getFullYear()} Eco Volt Dynamics. All rights reserved.</p>
			<div class="flex gap-4">
				<a href="/contact" class="hover:text-slate-800">Contact</a>
				<a href="/projects" class="hover:text-slate-800">Projects</a>
			</div>
		</div>
	</footer>
</div>
