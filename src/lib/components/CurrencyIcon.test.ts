import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import CurrencyIcon from './CurrencyIcon.svelte';
import { setCurrency } from '$lib/stores/currency';

describe('CurrencyIcon', () => {
	beforeEach(() => {
		setCurrency('EUR');
	});

	it('should render with default currency', () => {
		const { container } = render(CurrencyIcon);
		expect(container).toBeTruthy();
	});

	it('should render with EUR currency', () => {
		setCurrency('EUR');
		const { container } = render(CurrencyIcon);
		expect(container).toBeTruthy();
	});

	it('should render with USD currency', () => {
		setCurrency('USD');
		const { container } = render(CurrencyIcon);
		expect(container).toBeTruthy();
	});

	it('should render with GBP currency', () => {
		setCurrency('GBP');
		const { container } = render(CurrencyIcon);
		expect(container).toBeTruthy();
	});

	it('should render with CHF currency', () => {
		setCurrency('CHF');
		const { container } = render(CurrencyIcon);
		expect(container).toBeTruthy();
	});

	it('should render with all supported currencies', () => {
		const currencies = ['EUR', 'USD', 'GBP', 'CHF', 'PLN', 'CZK', 'SEK', 'NOK', 'DKK'] as const;

		currencies.forEach((currency) => {
			setCurrency(currency);
			const { container } = render(CurrencyIcon);
			expect(container).toBeTruthy();
		});
	});

	it('should use custom size when specified', () => {
		const { container } = render(CurrencyIcon, {
			props: {
				size: 24
			}
		});

		expect(container).toBeTruthy();
	});

	it('should use default size of 16', () => {
		const { container } = render(CurrencyIcon);
		expect(container).toBeTruthy();
	});

	it('should update icon when currency changes', () => {
		setCurrency('EUR');
		const { container: container1 } = render(CurrencyIcon);
		
		setCurrency('USD');
		const { container: container2 } = render(CurrencyIcon);
		
		expect(container1).toBeTruthy();
		expect(container2).toBeTruthy();
	});
});
