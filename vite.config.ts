
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Use a completely safe default token to avoid any syntax errors
  const wsToken = process.env.WS_TOKEN || 'lovable-safe-default-token';
  // More aggressive sanitization - only allow alphanumeric characters and hyphens
  const sanitizedToken = wsToken.replace(/[^a-zA-Z0-9-]/g, '').substring(0, 32) || 'fallback-token';

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
      __WS_TOKEN__: JSON.stringify(sanitizedToken),
    },
  };
});
