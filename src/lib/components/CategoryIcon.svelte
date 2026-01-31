<script lang="ts">
	// External imports
	import * as Icons from 'lucide-svelte';

	// Local imports
	import { getCategoryConfig } from '$lib/data/categories';

	// Types
	import type { CategoryType } from '$lib/db';

	// Props
	export let category: CategoryType;
	export let size: 'sm' | 'md' | 'lg' = 'md';

	// Reactive declarations
	$: config = getCategoryConfig(category);
	$: iconComponent = config && config.icon in Icons
		? (Icons[config.icon as keyof typeof Icons])
		: Icons.Tag;

	const sizeClasses = {
		sm: 'w-8 h-8',
		md: 'w-10 h-10',
		lg: 'w-12 h-12'
	};

	const iconSizes = {
		sm: 16,
		md: 20,
		lg: 24
	};
</script>

{#if config}
	<div
		class="rounded-lg flex items-center justify-center {sizeClasses[size]}"
		style="background-color: rgb(var(--color-{config.color}) / 0.1); color: rgb(var(--color-{config.color}))"
	>
		<svelte:component this={iconComponent} size={iconSizes[size]} />
	</div>
{:else}
	<div
		class="rounded-lg flex items-center justify-center bg-slate-100 text-muted {sizeClasses[
			size
		]}"
	>
		<Icons.Tag size={iconSizes[size]} />
	</div>
{/if}
