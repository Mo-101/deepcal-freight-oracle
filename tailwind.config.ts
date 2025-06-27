
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./components/**/*.{ts,tsx}",
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
				// DeepCAL Core Theme Colors
				background: '#0B0E2D',
				surface: '#111743',
				deepPurple: '#281F58',
				
				// DeepCAL Accent Colors
				solarGold: '#FFB43A',
				emberOrange: '#FF6E3B',
				neonLime: '#C1FF57',
				deepAqua: '#00E0C6',
				
				// DeepCAL Typography
				textPrimary: '#E8EBF9',
				textSecondary: '#B5B8CC',
				textAccent: '#FCD265',
				textMuted: '#7C809F',
				
				// DeepCAL Card Surfaces
				cardStandard: '#1A1F45',
				cardActive: '#2F2B62',
				cardWarning: '#3A1C1C',
				cardSuccess: '#1C3A2E',
				
				// Legacy colors for compatibility
				border: '#334155',
				glass: 'rgba(255,255,255,0.07)',
				glassBorder: 'rgba(126,34,206,0.3)',
				cardShadow: 'rgba(126,34,206,0.2)',
				primary: {
					DEFAULT: '#FFB43A',
					dark: '#FF6E3B',
					foreground: '#E8EBF9'
				},
				accent: {
					DEFAULT: '#00E0C6',
					soft: '#60a5fa',
					subtle: '#dbeafe'
				},
				deepcal: {
					purple: '#281F58',
					light: '#6A5CFF',
					dark: '#0B0E2D',
					gold: '#FFB43A',
					orange: '#FF6E3B',
					lime: '#C1FF57',
					aqua: '#00E0C6',
					text: {
						primary: '#E8EBF9',
						secondary: '#B5B8CC',
						accent: '#FCD265',
						muted: '#7C809F'
					},
					card: {
						standard: '#1A1F45',
						active: '#2F2B62',
						success: '#1C3A2E',
						warning: '#3A1C1C'
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: '1.25rem',
				glass: '1.25rem'
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
				'elegant': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			boxShadow: {
				glass: '0 10px 25px -5px rgba(255, 180, 58, 0.2)',
				symbolic: '0 0 15px rgba(255, 180, 58, 0.3), inset 0 0 10px rgba(255, 180, 58, 0.1)',
				deepcal: '0 8px 32px rgba(255, 180, 58, 0.15)'
			},
			backgroundImage: {
				'glass-blur': 'linear-gradient(145deg, rgba(17, 23, 67, 0.8) 0%, rgba(11, 14, 45, 0.9) 100%)',
				'symbolic-gradient': 'linear-gradient(135deg, #0B0E2D 0%, #111743 100%)',
				'deepcal-gradient': 'linear-gradient(135deg, #6A5CFF 0%, #FF44D1 100%)',
				'insight-prism': 'linear-gradient(135deg, #6A5CFF 0%, #FF44D1 100%)',
				'sage-horizon': 'linear-gradient(135deg, #00E1AA 0%, #4D9AFF 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
