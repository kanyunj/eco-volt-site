<script lang="ts">
	import { enhance } from '$app/forms';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	export let data: {
		authed: boolean;
		rows: Array<{
			id: number;
			created_at: string;
			name: string;
			email: string;
			phone?: string;
			project_type?: string;
			message: string;
		}>;
		total: number;
		page: number;
		pageSize: number;
	};

	let error = '';
	let formElement: HTMLFormElement | undefined;
	let cleanup: (() => void) | undefined;

	onMount(() => {
		if (browser && formElement) {
			const action = enhance(async ({ update, result }) => {
				const outcome = await result;
				if (outcome.type === 'success' && outcome.data) {
					if ('success' in outcome.data && !outcome.data.success && 'error' in outcome.data) {
						error = outcome.data.error as string;
					} else {
						error = '';
						update();
					}
				} else {
					error = 'An error occurred. Please try again.';
				}
			});
			cleanup = action(formElement);
		}

		return () => {
			if (cleanup) cleanup();
		};
	});
</script>

<svelte:head>
	<title>Admin • Submissions</title>
</svelte:head>

{#if !data.authed}
	<section class="mx-auto mt-16 max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
		<h1 class="text-2xl font-semibold tracking-tight text-slate-900">Admin Login</h1>
		<p class="mt-2 text-sm text-slate-600">Enter the admin password to view submissions.</p>
		<form bind:this={formElement} method="POST" class="mt-6 space-y-4" action="?/login">
			<label class="text-sm font-medium text-slate-900">
				<span class="mb-1 block">Password</span>
				<input type="password" name="password" class="w-full rounded-2xl border border-slate-200 px-4 py-2" required />
			</label>
			<button type="submit" class="w-full rounded-full bg-emerald-500 py-2 text-sm font-semibold text-white hover:bg-emerald-600">Sign in</button>
			{#if error}
				<p class="text-center text-sm text-red-600">{error}</p>
			{/if}
		</form>
	</section>
{:else}
	<section class="mx-auto max-w-6xl px-4 py-12">
		<div class="mb-6 flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-semibold tracking-tight text-slate-900">Submissions</h1>
				<p class="text-sm text-slate-500">{data.total} total</p>
			</div>
			<form method="POST" action="?/logout">
				<button class="text-sm text-slate-500 hover:text-slate-700">Log out</button>
			</form>
		</div>

		<div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
			<table class="w-full text-sm">
				<thead class="bg-slate-50 text-slate-600">
					<tr>
						<th class="px-4 py-3 text-left">Date</th>
						<th class="px-4 py-3 text-left">Name</th>
						<th class="px-4 py-3 text-left">Email</th>
						<th class="px-4 py-3 text-left">Phone</th>
						<th class="px-4 py-3 text-left">Project</th>
						<th class="px-4 py-3 text-left">Message</th>
					</tr>
				</thead>
				<tbody>
					{#each data.rows || [] as r}
						<tr class="border-t border-slate-100">
							<td class="px-4 py-3 text-slate-600">
								{r.created_at ? new Date(r.created_at as string).toLocaleString() : '-'}
							</td>
							<td class="px-4 py-3 font-medium text-slate-900">{r.name || '-'}</td>
							<td class="px-4 py-3 text-emerald-700">{r.email || '-'}</td>
							<td class="px-4 py-3 text-slate-700">{r.phone || '-'}</td>
							<td class="px-4 py-3 text-slate-700">{r.project_type || '-'}</td>
							<td class="px-4 py-3 text-slate-700">{r.message || '-'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="mt-4 flex items-center justify-between">
			<a href="?page={Math.max(1, data.page - 1)}" class="text-sm text-emerald-700 hover:text-emerald-800">← Prev</a>
			<p class="text-xs text-slate-500">
				Page {data.page} • {data.pageSize > 0 ? Math.ceil(data.total / data.pageSize) : 0} total
			</p>
			<a href="?page={data.page + 1}" class="text-sm text-emerald-700 hover:text-emerald-800">Next →</a>
		</div>
	</section>
{/if}


