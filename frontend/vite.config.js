import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // ✅ Proxy pour TOUS les appels API (pas seulement /api)
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/tables': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/plats': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/commandes': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      // Ou plus simplement : proxy global
      // '/': {
      //   target: 'http://localhost:8000',
      //   changeOrigin: true,
      //   rewrite: (path) => path,
      // }
    }
  }
})