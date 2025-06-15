import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				background: '#181824',
				surface: '#23233a',
				border: '#2b2842',
				glass: 'rgba(255,255,255,0.07)',
				glassBorder: 'rgba(170,170,255,0.21)',
				cardShadow: 'rgba(110,0,240,0.10)',
				primary: {
					DEFAULT: '#9557FF',
					dark: '#441466',
					foreground: '#f9f9fc'
				},
				accent: {
					DEFAULT: '#3290f0',
					soft: '#78aaff',
					subtle: '#e6efff'
				},
				deepcal: {
					purple: '#7e22ce',
					light: '#a855f7',
					dark: '#581c87'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: '1.2rem',
				glass: '16px'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'scroll-appear': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-in-out',
				'scroll-appear': 'scroll-appear 1.2s ease-out'
			},
			fontFamily: {
				'orbitron': ['Orbitron', 'sans-serif'],
				'elegant': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			boxShadow: {
				glass: '0 8px 32px 0 rgba(48,68,187,0.22), 0 1.5px 7px 0 rgba(99,80,255,0.12)'
			},
			backgroundImage: {
				'glass-blur': 'linear-gradient(120deg, rgba(54, 54, 93, 0.92) 80%, rgba(69, 36, 106, 0.2))',
				'soft-gradient': 'linear-gradient(97deg, #23233a 0%, #441466 100%)',
				'card-gradient': 'linear-gradient(120deg, rgba(110,0,240,0.08), rgba(255,255,255,0.00))'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
