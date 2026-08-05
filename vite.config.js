import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || 'http://localhost:3001'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // The real backend already serves everything under /api itself
        // (see GUIA-FRONTEND.md), so the prefix is kept as-is here.
        '/api': {
          target: apiUrl,
          changeOrigin: true,
        },
      },
    },
  }
})
