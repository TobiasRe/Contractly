<script lang="ts">
	// External imports
	import * as Icons from 'lucide-svelte';

	// Local imports
	import { currency } from '$lib/stores/currency';

	// Types
	import type { Currency } from '$lib/stores/currency';

	// Props
	export let size: number = 16;

	// Computed values
	const currencyIconMap: Record<Currency, keyof typeof Icons> = {
		EUR: 'Euro',
		USD: 'DollarSign',
		GBP: 'PoundSterling',
		CHF: 'Coins', // Swiss Franc - no specific icon, use Coins
		PLN: 'Coins', // Polish Złoty - no specific icon, use Coins
		CZK: 'Coins', // Czech Koruna - no specific icon, use Coins
		SEK: 'Coins', // Swedish Krona - no specific icon, use Coins
		NOK: 'Coins', // Norwegian Krone - no specific icon, use Coins
		DKK: 'Coins' // Danish Krone - no specific icon, use Coins
	};

	// Reactive declarations
	$: currentCurrency = $currency;
	$: iconName = currencyIconMap[currentCurrency] || 'Coins';
	$: IconComponent = iconName in Icons
		? (Icons[iconName])
		: Icons.Coins;
</script>

<svelte:component this={IconComponent} {size} />
