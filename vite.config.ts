
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Safely handle WS_TOKEN to prevent syntax errors
  const wsToken = process.env.WS_TOKEN || 'development-token';
  
  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        port: 8080,
        host: 'localhost'
      },
    },
    plugins: [
      react(),
      ...(mode === 'development' ? [componentTagger()] : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      global: 'globalThis',
      // Properly escape and define the WS_TOKEN
      __WS_TOKEN__: JSON.stringify(wsToken),
    },
    build: {
      sourcemap: false,
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-toast'],
          },
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
      exclude: ['@lovable-ui/toolkit'],
    },
  };
});
