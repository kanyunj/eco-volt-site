const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Inter"', ...fontFamily.sans]
			},
			colors: {
				brand: {
					dark: '#0F172A',
					accent: '#F59E0B',
					green: '#10B981'
				}
			},
			boxShadow: {
				card: '0 10px 25px -15px rgba(15, 23, 42, 0.45)'
			}
		}
	},
	plugins: []
};

module.exports = config;

