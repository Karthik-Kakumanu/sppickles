import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "localhost",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes("node_modules") && !id.includes("frontend/src")) {
            return undefined;
          }

          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("scheduler") ||
              id.includes("react-router")
            ) {
              return "react-vendor";
            }

            if (id.includes("@tanstack/react-query")) {
              return "query-vendor";
            }

            if (id.includes("framer-motion") || id.includes("lucide-react")) {
              return "ui-vendor";
            }

            return undefined;
          }

          if (id.includes("frontend/src/pages/Admin")) {
            return "admin-pages";
          }

          if (id.includes("frontend/src/data/products") || id.includes("frontend/src/lib/pickleImages")) {
            return "catalog-data";
          }

          return undefined;
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend/src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
