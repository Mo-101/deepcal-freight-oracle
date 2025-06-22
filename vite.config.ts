
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Safely handle the WS_TOKEN to avoid syntax errors
  const wsToken = process.env.WS_TOKEN || 'lovable-default';
  const sanitizedToken = wsToken.replace(/[^a-zA-Z0-9-_]/g, '-');

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
