
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
				background: '#0f172a',
				surface: '#1e293b',
				border: '#334155',
				glass: 'rgba(255,255,255,0.07)',
				glassBorder: 'rgba(126,34,206,0.3)',
				cardShadow: 'rgba(126,34,206,0.2)',
				primary: {
					DEFAULT: '#a855f7',
					dark: '#581c87',
					foreground: '#f8fafc'
				},
				accent: {
					DEFAULT: '#3b82f6',
					soft: '#60a5fa',
					subtle: '#dbeafe'
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
				xl: '1rem',
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
				'space-grotesk': ['Space Grotesk', 'sans-serif'],
				'orbitron': ['Orbitron', 'sans-serif'],
				'elegant': ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			boxShadow: {
				glass: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
				symbolic: '0 0 15px rgba(126, 34, 206, 0.2), inset 0 0 10px rgba(126, 34, 206, 0.1)'
			},
			backgroundImage: {
				'glass-blur': 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
				'symbolic-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
				'deepcal-gradient': 'linear-gradient(135deg, #581c87 0%, #7e22ce 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
