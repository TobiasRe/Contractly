<script lang="ts">
	import type { ContractStatus } from '$lib/db';
	import { t } from '$lib/stores/i18n';

	export let status: ContractStatus;
	export let size: 'sm' | 'md' = 'md';

	const statusConfig: Record<ContractStatus, { color: string; bgColor: string }> = {
		aktiv: {
			color: 'text-success',
			bgColor: 'bg-green-50'
		},
		gekündigt: {
			color: 'text-warning',
			bgColor: 'bg-amber-50'
		},
		beendet: {
			color: 'text-muted',
			bgColor: 'bg-slate-100'
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
	class="inline-flex items-center rounded-full font-medium {config.color} {config.bgColor} {sizeClasses}"
>
	{$t(label)}
</span>
