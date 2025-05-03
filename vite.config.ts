
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Make sure environment variables are exposed
  define: {
    'import.meta.env.VITE_FEROSHOP_API_URL': JSON.stringify(process.env.VITE_FEROSHOP_API_URL),
    'import.meta.env.VITE_FEROSHOP_ALLOWED_CATEGORIES': JSON.stringify(process.env.VITE_FEROSHOP_ALLOWED_CATEGORIES),
  }
}));
