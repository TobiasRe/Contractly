import type { CategoryType } from '$lib/db';

export const providersByCategory: Record<string, string[]> = {
	// Telekommunikation
	mobilfunk: ['Telekom', 'Vodafone', 'O2', '1&1', 'Freenet', 'Mobilcom-Debitel', 'Congstar', 'Aldi Talk'],
	festnetz: ['Telekom', 'Vodafone', '1&1', 'O2'],
	internet: ['Telekom', 'Vodafone', '1&1', 'O2', 'Pyur', 'Unitymedia', 'Kabel Deutschland'],
	'kombi-tarif': ['Telekom', 'Vodafone', '1&1', 'O2'],

	// Versicherungen
	krankenversicherung: ['TK', 'AOK', 'Barmer', 'DAK', 'IKK', 'Allianz', 'Debeka', 'HUK-Coburg'],
	haftpflicht: ['Allianz', 'HUK24', 'CosmosDirekt', 'DEVK', 'Ergo', 'AXA', 'Generali'],
	hausrat: ['Allianz', 'DEVK', 'GDV', 'HUK-Coburg', 'Ergo', 'AXA'],
	'kfz-versicherung': ['HUK-Coburg', 'Allianz', 'DEVK', 'CosmosDirekt', 'HUK24', 'Ergo', 'AXA'],
	rechtsschutz: ['ARAG', 'Roland', 'Advocard', 'Allianz', 'Ergo'],
	berufsunfaehigkeit: ['Allianz', 'Continentale', 'Swiss Life', 'Alte Leipziger', 'Stuttgarter'],
	lebensversicherung: ['Allianz', 'Generali', 'Ergo', 'AXA', 'Zurich'],
	zahnzusatz: ['Ergo', 'DKV', 'Signal Iduna', 'Allianz', 'HUK-Coburg'],
	unfallversicherung: ['Allianz', 'Ergo', 'HUK-Coburg', 'Generali'],
	tierversicherung: ['Allianz', 'Agila', 'Uelzener', 'Helvetia', 'Barmenia'],

	// Energie
	strom: ['Stadtwerke', 'E.ON', 'Vattenfall', 'EnBW', 'RWE', 'Yello', 'Check24 Strom', 'Verivox'],
	gas: ['Stadtwerke', 'E.ON', 'Vattenfall', 'EnBW', 'RWE', 'Yello', 'Check24 Gas'],
	fernwaerme: ['Stadtwerke', 'Vattenfall', 'EnBW'],
	wasser: ['Stadtwerke'],

	// Wohnen
	miete: [],
	nebenkosten: [],
	hausmeister: [],
	parkplatz: [],

	// Medien
	'streaming-video': ['Netflix', 'Disney+', 'Amazon Prime Video', 'Sky', 'DAZN', 'Apple TV+', 'Paramount+', 'WOW'],
	'streaming-musik': ['Spotify', 'Apple Music', 'Deezer', 'YouTube Music', 'Amazon Music', 'Tidal'],
	'streaming-gaming': ['PlayStation Plus', 'Xbox Game Pass', 'Nintendo Switch Online', 'GeForce Now'],
	zeitschrift: ['Spiegel', 'Stern', 'Zeit', 'Focus', 'GEO', 'Schöner Wohnen'],
	zeitung: ['FAZ', 'Süddeutsche Zeitung', 'Bild', 'Die Welt', 'Frankfurter Rundschau'],
	hoerbuch: ['Audible', 'BookBeat', 'Spotify', 'Apple Books'],

	// Software
	'software-abo': ['Microsoft 365', 'Adobe Creative Cloud', 'Canva Pro', 'Dropbox', 'Google Workspace'],
	'cloud-speicher': ['Dropbox', 'Google One', 'iCloud+', 'OneDrive', 'pCloud'],
	'domain-hosting': ['Strato', '1&1', 'Netcup', 'Hetzner', 'IONOS', 'All-Inkl'],

	// Fitness
	fitnessstudio: ['McFit', 'FitX', 'Clever Fit', 'John Reed', 'Holmes Place', 'FitOne', 'Mrs.Sporty'],
	'yoga-studio': [],
	schwimmbad: [],
	physiotherapie: [],

	// Mobilität
	bahncard: ['Deutsche Bahn'],
	'oepnv-abo': [],
	carsharing: ['ShareNow', 'Miles', 'Sixt Share', 'We Share', 'Cambio'],
	'kfz-leasing': [],
	'fahrrad-leasing': ['JobRad', 'Lease a Bike', 'BusinessBike', 'Deutsche Dienstrad'],
	'parkhaus-abo': [],
	'tankstelle-karte': ['Shell', 'Aral', 'Total', 'Esso'],

	// Finanzprodukte
	girokonto: ['Sparkasse', 'Volksbank', 'Deutsche Bank', 'Commerzbank', 'ING', 'DKB', 'Comdirect', 'N26', 'Revolut'],
	kreditkarte: ['Visa', 'Mastercard', 'American Express', 'DKB', 'ING', 'Barclays', 'Hanseatic Bank'],
	depot: ['Trade Republic', 'Scalable Capital', 'ING', 'Comdirect', 'Consorsbank', 'Flatex'],
	bausparvertrag: ['Schwäbisch Hall', 'LBS', 'Wüstenrot', 'BHW'],
	kredit: ['Sparkasse', 'Volksbank', 'Deutsche Bank', 'Commerzbank', 'ING', 'Santander'],

	// Öffentlich
	rundfunkbeitrag: ['ARD ZDF Deutschlandradio Beitragsservice'],
	muellabfuhr: [],
	schornsteinfeger: [],

	// Mitgliedschaften
	verein: [],
	gewerkschaft: ['ver.di', 'IG Metall', 'GEW', 'IG BCE', 'NGG'],
	automobilclub: ['ADAC', 'AvD', 'ACE', 'Mobil in Deutschland'],
	berufsverband: [],

	// Sonstiges
	telematik: [],
	'security-dienst': [],
	reinigung: [],
	'lieferservice-abo': ['HelloFresh', 'Marley Spoon', 'Dinnerly'],
	custom: []
};

export function getProvidersForCategory(category: CategoryType): string[] {
	return providersByCategory[category] || [];
}
