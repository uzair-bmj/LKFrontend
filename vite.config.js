import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'https://lk-1-pabn.onrender.com'
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
