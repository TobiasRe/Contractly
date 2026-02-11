<script lang="ts">
	import type { ContractStatus } from '$lib/db';
	import { t } from '$lib/stores/i18n';

	export let status: ContractStatus;
	export let size: 'sm' | 'md' = 'md';

	const statusConfig: Record<ContractStatus, { color: string; bgColor: string; borderColor: string }> = {
		aktiv: {
			color: 'text-success',
			bgColor: 'bg-green-100/35',
			borderColor: 'border-green-100/60'
		},
		gekündigt: {
			color: 'text-warning',
			bgColor: 'bg-amber-100/35',
			borderColor: 'border-amber-100/60'
		},
		beendet: {
			color: 'text-muted',
			bgColor: 'bg-white/40',
			borderColor: 'border-white/60'
		}
	};

	const statusLabels: Record<ContractStatus, string> = {
		aktiv: 'contract.statusAktiv',
		gekündigt: 'contract.statusGekündigt',
		beendet: 'contract.statusBeendet'
	};

	$: config = statusConfig[status];
	$: label = statusLabels[status];
	$: sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
</script>

<span
	class="inline-flex items-center rounded-full border font-medium backdrop-blur-md {config.color} {config.bgColor} {config.borderColor} {sizeClasses}"
>
	{$t(label)}
</span>
