/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				foreground: '#1e293b',
				secondary: '#475569',
				muted: '#94a3b8',
				faint: '#e2e8f0',
				accent: '#2563eb',
				success: '#16a34a',
				warning: '#d97706',
				error: '#dc2626'
			},
			spacing: {
				'13': '3.25rem',
				'15': '3.75rem'
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif']
			},
			boxShadow: {
				'subtle': '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
				'card': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)'
			}
		}
	},
	plugins: []
};
