import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://13.201.75.180:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  envPrefix: 'REACT_APP_',
})
