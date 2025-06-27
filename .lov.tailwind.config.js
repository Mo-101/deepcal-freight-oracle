import { createRequire } from "module"; const require = createRequire(import.meta.url);
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/tailwindcss/lib/util/createPlugin.js
var require_createPlugin = __commonJS({
  "node_modules/tailwindcss/lib/util/createPlugin.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "default", {
      enumerable: true,
      get: function() {
        return _default;
      }
    });
    function createPlugin(plugin, config) {
      return {
        handler: plugin,
        config
      };
    }
    createPlugin.withOptions = function(pluginFunction, configFunction = () => ({})) {
      const optionsFunction = function(options) {
        return {
          __options: options,
          handler: pluginFunction(options),
          config: configFunction(options)
        };
      };
      optionsFunction.__isOptionsFunction = true;
      optionsFunction.__pluginFunction = pluginFunction;
      optionsFunction.__configFunction = configFunction;
      return optionsFunction;
    };
    var _default = createPlugin;
  }
});

// node_modules/tailwindcss/lib/public/create-plugin.js
var require_create_plugin = __commonJS({
  "node_modules/tailwindcss/lib/public/create-plugin.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "default", {
      enumerable: true,
      get: function() {
        return _default;
      }
    });
    var _createPlugin = /* @__PURE__ */ _interop_require_default(require_createPlugin());
    function _interop_require_default(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var _default = _createPlugin.default;
  }
});

// node_modules/tailwindcss/plugin.js
var require_plugin = __commonJS({
  "node_modules/tailwindcss/plugin.js"(exports, module) {
    var createPlugin = require_create_plugin();
    module.exports = (createPlugin.__esModule ? createPlugin : { default: createPlugin }).default;
  }
});

// node_modules/tailwindcss-animate/index.js
var require_tailwindcss_animate = __commonJS({
  "node_modules/tailwindcss-animate/index.js"(exports, module) {
    var plugin = require_plugin();
    function filterDefault(values) {
      return Object.fromEntries(
        Object.entries(values).filter(([key]) => key !== "DEFAULT")
      );
    }
    module.exports = plugin(
      ({ addUtilities, matchUtilities, theme }) => {
        addUtilities({
          "@keyframes enter": theme("keyframes.enter"),
          "@keyframes exit": theme("keyframes.exit"),
          ".animate-in": {
            animationName: "enter",
            animationDuration: theme("animationDuration.DEFAULT"),
            "--tw-enter-opacity": "initial",
            "--tw-enter-scale": "initial",
            "--tw-enter-rotate": "initial",
            "--tw-enter-translate-x": "initial",
            "--tw-enter-translate-y": "initial"
          },
          ".animate-out": {
            animationName: "exit",
            animationDuration: theme("animationDuration.DEFAULT"),
            "--tw-exit-opacity": "initial",
            "--tw-exit-scale": "initial",
            "--tw-exit-rotate": "initial",
            "--tw-exit-translate-x": "initial",
            "--tw-exit-translate-y": "initial"
          }
        });
        matchUtilities(
          {
            "fade-in": (value) => ({ "--tw-enter-opacity": value }),
            "fade-out": (value) => ({ "--tw-exit-opacity": value })
          },
          { values: theme("animationOpacity") }
        );
        matchUtilities(
          {
            "zoom-in": (value) => ({ "--tw-enter-scale": value }),
            "zoom-out": (value) => ({ "--tw-exit-scale": value })
          },
          { values: theme("animationScale") }
        );
        matchUtilities(
          {
            "spin-in": (value) => ({ "--tw-enter-rotate": value }),
            "spin-out": (value) => ({ "--tw-exit-rotate": value })
          },
          { values: theme("animationRotate") }
        );
        matchUtilities(
          {
            "slide-in-from-top": (value) => ({
              "--tw-enter-translate-y": `-${value}`
            }),
            "slide-in-from-bottom": (value) => ({
              "--tw-enter-translate-y": value
            }),
            "slide-in-from-left": (value) => ({
              "--tw-enter-translate-x": `-${value}`
            }),
            "slide-in-from-right": (value) => ({
              "--tw-enter-translate-x": value
            }),
            "slide-out-to-top": (value) => ({
              "--tw-exit-translate-y": `-${value}`
            }),
            "slide-out-to-bottom": (value) => ({
              "--tw-exit-translate-y": value
            }),
            "slide-out-to-left": (value) => ({
              "--tw-exit-translate-x": `-${value}`
            }),
            "slide-out-to-right": (value) => ({
              "--tw-exit-translate-x": value
            })
          },
          { values: theme("animationTranslate") }
        );
        matchUtilities(
          { duration: (value) => ({ animationDuration: value }) },
          { values: filterDefault(theme("animationDuration")) }
        );
        matchUtilities(
          { delay: (value) => ({ animationDelay: value }) },
          { values: theme("animationDelay") }
        );
        matchUtilities(
          { ease: (value) => ({ animationTimingFunction: value }) },
          { values: filterDefault(theme("animationTimingFunction")) }
        );
        addUtilities({
          ".running": { animationPlayState: "running" },
          ".paused": { animationPlayState: "paused" }
        });
        matchUtilities(
          { "fill-mode": (value) => ({ animationFillMode: value }) },
          { values: theme("animationFillMode") }
        );
        matchUtilities(
          { direction: (value) => ({ animationDirection: value }) },
          { values: theme("animationDirection") }
        );
        matchUtilities(
          { repeat: (value) => ({ animationIterationCount: value }) },
          { values: theme("animationRepeat") }
        );
      },
      {
        theme: {
          extend: {
            animationDelay: ({ theme }) => ({
              ...theme("transitionDelay")
            }),
            animationDuration: ({ theme }) => ({
              0: "0ms",
              ...theme("transitionDuration")
            }),
            animationTimingFunction: ({ theme }) => ({
              ...theme("transitionTimingFunction")
            }),
            animationFillMode: {
              none: "none",
              forwards: "forwards",
              backwards: "backwards",
              both: "both"
            },
            animationDirection: {
              normal: "normal",
              reverse: "reverse",
              alternate: "alternate",
              "alternate-reverse": "alternate-reverse"
            },
            animationOpacity: ({ theme }) => ({
              DEFAULT: 0,
              ...theme("opacity")
            }),
            animationTranslate: ({ theme }) => ({
              DEFAULT: "100%",
              ...theme("translate")
            }),
            animationScale: ({ theme }) => ({
              DEFAULT: 0,
              ...theme("scale")
            }),
            animationRotate: ({ theme }) => ({
              DEFAULT: "30deg",
              ...theme("rotate")
            }),
            animationRepeat: {
              0: "0",
              1: "1",
              infinite: "infinite"
            },
            keyframes: {
              enter: {
                from: {
                  opacity: "var(--tw-enter-opacity, 1)",
                  transform: "translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0))"
                }
              },
              exit: {
                to: {
                  opacity: "var(--tw-exit-opacity, 1)",
                  transform: "translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1)) rotate(var(--tw-exit-rotate, 0))"
                }
              }
            }
          }
        }
      }
    );
  }
});

// tailwind.config.ts
var tailwind_config_default = {
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
					dark: '#581c87',
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

export {
  tailwind_config_default as default
};
