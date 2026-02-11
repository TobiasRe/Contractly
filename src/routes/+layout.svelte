<script lang="ts">
	// External imports
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { Home, FileText, BarChart3, Settings, Search, Star, Plus } from 'lucide-svelte';

	// Local imports
	import '../app.css';
	import { page } from '$app/stores';
	import { initNotifications } from '$lib/stores/notifications';
	import { t, locale, setLocale } from '$lib/stores/i18n';
	import { globalSearchQuery } from '$lib/stores/search';

	// Reactive declarations
	function withBase(path: string): string {
		if (path === '/') return base || '/';
		return `${base}${path}`;
	}

	function stripBase(path: string): string {
		if (base && path.startsWith(base)) {
			return path.slice(base.length) || '/';
		}
		return path || '/';
	}

	$: navItems = [
		{ path: '/', href: withBase('/'), icon: Home, label: $t('nav.overview') },
		{
			path: '/contracts',
			href: withBase('/contracts'),
			icon: FileText,
			label: $t('nav.contracts')
		},
		{ path: '/stats', href: withBase('/stats'), icon: BarChart3, label: $t('nav.stats') },
		{ path: '/settings', href: withBase('/settings'), icon: Settings, label: $t('nav.settings') }
	];

	function isActive(path: string, currentPath: string): boolean {
		const normalizedPath = stripBase(currentPath);
		if (path === '/') {
			return normalizedPath === '/';
		}
		return normalizedPath.startsWith(path);
	}

	function handleTopSearchSubmit(event: SubmitEvent): void {
		event.preventDefault();
		if (stripBase($page.url.pathname) !== '/contracts') {
			goto(withBase('/contracts'));
		}
	}

	// Lifecycle
	onMount(() => {
		// Initialize notifications check
		initNotifications();
	});
</script>

<div class="app-frame">
	<div class="app-shell">
		<aside class="sidebar-panel hidden md:flex md:flex-col">
			<div class="brand-row">
				<Star size={16} class="text-accent" />
				<span class="font-semibold text-foreground">{$t('app.title')}</span>
			</div>

			<p class="menu-caption">MENU</p>
			<nav class="space-y-1.5">
				{#each navItems as item (item.path)}
					<a
						href={item.href}
						class="sidebar-link {isActive(item.path, $page.url.pathname) ? 'sidebar-link-active' : ''}"
					>
						<svelte:component this={item.icon} size={16} />
						<span>{item.label}</span>
					</a>
				{/each}
			</nav>
		</aside>

		<section class="workspace-panel">
			<header class="topbar-panel hidden md:flex">
				<form class="top-search" on:submit={handleTopSearchSubmit}>
					<Search size={16} class="text-muted" />
					<input
						type="text"
						bind:value={$globalSearchQuery}
						placeholder={$t('contract.searchPlaceholder')}
					/>
				</form>

				<div class="language-switch" role="group" aria-label="Language switcher">
					<button
						type="button"
						class:active={$locale === 'de'}
						on:click={() => setLocale('de')}
					>
						{$t('settings.german')}
					</button>
					<button
						type="button"
						class:active={$locale === 'en'}
						on:click={() => setLocale('en')}
					>
						{$t('settings.english')}
					</button>
				</div>
			</header>

			<div class="min-h-screen pb-20 md:pb-6 content-safe-bottom">
				<slot />
			</div>

			<a
				href={withBase('/contracts/new')}
				class="floating-add-btn mobile-fab-offset fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg transition-all active:scale-95 md:absolute md:bottom-6 md:right-6"
			>
				<Plus size={24} />
			</a>
		</section>
	</div>
</div>

<!-- Bottom Navigation -->
<nav class="fixed bottom-0 left-0 right-0 border-t border-slate-200/80 bg-white/95 shadow-subtle backdrop-blur safe-area-bottom md:hidden">
	<div class="mx-auto flex h-14 max-w-2xl items-center justify-around px-2">
		{#each navItems as item (item.path)}
			<a
				href={item.href}
				class="flex h-[46px] flex-1 items-center justify-center gap-2 rounded-xl px-2 text-sm font-medium transition-colors {isActive(
					item.path,
					$page.url.pathname
				)
					? 'bg-blue-50 text-accent'
					: 'text-muted hover:text-secondary'}"
			>
				<svelte:component this={item.icon} size={20} />
				<span class="text-xs">{item.label}</span>
			</a>
		{/each}
	</div>
</nav>

<style>
	.safe-area-bottom {
		padding-bottom: max(env(safe-area-inset-bottom), 0.5rem);
	}

	.content-safe-bottom {
		padding-bottom: calc(5rem + env(safe-area-inset-bottom));
	}

	.mobile-fab-offset {
		bottom: calc(5rem + env(safe-area-inset-bottom));
	}

	@media (min-width: 768px) {
		.content-safe-bottom {
			padding-bottom: 1.5rem;
		}

		.mobile-fab-offset {
			bottom: 1.5rem;
		}
	}
</style>
