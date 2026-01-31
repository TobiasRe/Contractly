import Dexie, { type Table } from 'dexie';

export type ContractStatus = 'aktiv' | 'gekündigt' | 'beendet';

export type BillingPeriod = 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';

export interface Contract {
	id?: string;
	name: string;
	category: CategoryType;
	subcategory?: string;
	provider: string;
	contractNumber?: string;
	monthlyCost: number;
	billingCost: number;
	billingPeriod: BillingPeriod;
	startDate: Date;
	endDate?: Date;
	cancellationPeriod: number;
	cancellationDate?: Date;
	renewalPeriod?: number;
	reminderDays: number;
	status: ContractStatus;
	paymentMethod?: 'sepa' | 'rechnung' | 'kreditkarte' | 'bar' | 'other';
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
}

export type CategoryType =
	// Telekommunikation
	| 'mobilfunk'
	| 'festnetz'
	| 'internet'
	| 'kombi-tarif'
	// Versicherungen
	| 'krankenversicherung'
	| 'haftpflicht'
	| 'hausrat'
	| 'kfz-versicherung'
	| 'rechtsschutz'
	| 'berufsunfaehigkeit'
	| 'lebensversicherung'
	| 'zahnzusatz'
	| 'unfallversicherung'
	| 'tierversicherung'
	// Energie & Versorgung
	| 'strom'
	| 'gas'
	| 'fernwaerme'
	| 'wasser'
	// Wohnen
	| 'miete'
	| 'nebenkosten'
	| 'hausmeister'
	| 'parkplatz'
	// Medien & Abonnements
	| 'streaming-video'
	| 'streaming-musik'
	| 'streaming-gaming'
	| 'zeitschrift'
	| 'zeitung'
	| 'hoerbuch'
	// Software & Cloud
	| 'software-abo'
	| 'cloud-speicher'
	| 'domain-hosting'
	// Fitness & Gesundheit
	| 'fitnessstudio'
	| 'yoga-studio'
	| 'schwimmbad'
	| 'physiotherapie'
	// Mobilität
	| 'bahncard'
	| 'oepnv-abo'
	| 'carsharing'
	| 'kfz-leasing'
	| 'fahrrad-leasing'
	| 'parkhaus-abo'
	| 'tankstelle-karte'
	// Finanzprodukte
	| 'girokonto'
	| 'kreditkarte'
	| 'depot'
	| 'bausparvertrag'
	| 'kredit'
	// Öffentliche Beiträge
	| 'rundfunkbeitrag'
	| 'muellabfuhr'
	| 'schornsteinfeger'
	// Mitgliedschaften
	| 'verein'
	| 'gewerkschaft'
	| 'automobilclub'
	| 'berufsverband'
	// Sonstiges
	| 'telematik'
	| 'security-dienst'
	| 'reinigung'
	| 'lieferservice-abo'
	| 'custom';

export class ContractDatabase extends Dexie {
	contracts!: Table<Contract>;

	constructor() {
		super('ContractManager');
		this.version(1).stores({
			contracts: '++id, category, provider, cancellationDate, createdAt'
		});
		
		// Version 2: Add status field
		this.version(2).stores({
			contracts: '++id, category, provider, cancellationDate, createdAt, status'
		}).upgrade(tx => {
			// Set default status for existing contracts
			return tx.table('contracts').toCollection().modify(contract => {
				if (!contract.status) {
					contract.status = 'aktiv';
				}
			});
		});

		// Version 3: Add billingCost and billingPeriod fields
		this.version(3).stores({
			contracts: '++id, category, provider, cancellationDate, createdAt, status'
		}).upgrade(tx => {
			return tx.table('contracts').toCollection().modify(contract => {
				if (!contract.billingPeriod) {
					contract.billingPeriod = 'monthly';
				}
				if (contract.billingCost === undefined) {
					contract.billingCost = contract.monthlyCost || 0;
				}
			});
		});
	}
}

export const db = new ContractDatabase();

/**
 * Calculate cancellation date based on end date and cancellation period
 * @param endDate - Contract end date
 * @param cancellationPeriod - Cancellation period in days
 * @returns Cancellation date or undefined if endDate is not provided
 */
export function calculateCancellationDate(
	endDate: Date | undefined,
	cancellationPeriod: number
): Date | undefined {
	if (!endDate) return undefined;
	
	const end = new Date(endDate);
	const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
	const cancelDate = new Date(end.getTime() - cancellationPeriod * MILLISECONDS_PER_DAY);
	return cancelDate;
}

/**
 * Calculate monthly cost from billing cost and period
 */
function calculateMonthlyCost(
	billingCost: number | undefined,
	billingPeriod: BillingPeriod | undefined,
	existingMonthlyCost: number
): number {
	if (billingCost === undefined || !billingPeriod) {
		return existingMonthlyCost;
	}

	const PERIOD_MONTHS: Record<BillingPeriod, number> = {
		monthly: 1,
		quarterly: 3,
		'half-yearly': 6,
		yearly: 12
	};

	return billingCost / PERIOD_MONTHS[billingPeriod];
}

/**
 * Convert contract ID to numeric ID for Dexie
 */
function toNumericId(id: string | number | undefined): number | null {
	if (!id) return null;
	
	const numericId = typeof id === 'string' ? Number(id) : id;
	return isNaN(numericId) ? null : numericId;
}

/**
 * Add or update contract with auto-calculated fields
 * @param contract - Partial contract data
 * @returns Contract ID as string
 */
export async function saveContract(contract: Partial<Contract>): Promise<string> {
	const now = new Date();
	
	const monthlyCost = calculateMonthlyCost(
		contract.billingCost,
		contract.billingPeriod,
		contract.monthlyCost || 0
	);

	const data: Contract = {
		...contract,
		monthlyCost,
		cancellationDate: calculateCancellationDate(contract.endDate, contract.cancellationPeriod || 0),
		updatedAt: now,
		createdAt: contract.createdAt || now,
		status: contract.status || 'aktiv'
	} as Contract;

	const numericId = toNumericId(contract.id);
	if (numericId !== null) {
		await db.contracts.update(numericId, data);
		return String(contract.id);
	}
	
	const id = await db.contracts.add(data);
	return String(id);
}
