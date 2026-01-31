<script lang="ts">
	// External imports
	import { onMount } from 'svelte';
	import { Home, FileText, BarChart3, Settings } from 'lucide-svelte';

	// Local imports
	import '../app.css';
	import { page } from '$app/stores';
	import { initNotifications } from '$lib/stores/notifications';
	import { t } from '$lib/stores/i18n';

	// Reactive declarations
	$: navItems = [
		{ path: '/', icon: Home, label: $t('nav.overview') },
		{ path: '/contracts', icon: FileText, label: $t('nav.contracts') },
		{ path: '/stats', icon: BarChart3, label: $t('nav.stats') },
		{ path: '/settings', icon: Settings, label: $t('nav.settings') }
	];

	// Lifecycle
	onMount(() => {
		// Initialize notifications check
		initNotifications();
	});
</script>

<div class="min-h-screen pb-20">
	<slot />
</div>

<!-- Bottom Navigation -->
<nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-area-bottom">
	<div class="flex justify-around items-center h-14">
		{#each navItems as item (item.path)}
			<a
				href={item.path}
				class="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors {$page.url
					.pathname === item.path
					? 'text-accent'
					: 'text-muted hover:text-secondary'}"
			>
				<svelte:component this={item.icon} size={20} />
				<span class="text-xs font-medium">{item.label}</span>
			</a>
		{/each}
	</div>
</nav>

<style>
	.safe-area-bottom {
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
