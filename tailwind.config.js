/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				foreground: '#1f2140',
				secondary: '#4d547f',
				muted: '#7d84b0',
				faint: '#d9def4',
				accent: '#7282ff',
				success: '#16a34a',
				warning: '#d18635',
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
				'subtle': '0 10px 20px -16px rgba(72, 86, 196, 0.42), 0 2px 5px rgba(43, 56, 155, 0.12)',
				'card': '0 18px 28px -22px rgba(72, 86, 196, 0.52), 0 4px 9px rgba(43, 56, 155, 0.12)'
			}
		}
	},
	plugins: []
};
