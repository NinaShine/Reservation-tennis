import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // proxy = pour le DEV uniquement; en PROD on passera par VITE_API_URL
  server: {
    proxy: {
      '/api': { target: 'http://localhost:5174', changeOrigin: true }
    }
  }
})
