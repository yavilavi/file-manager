import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host: '0.0.0.0',
    strictPort: true,
    port: 3001,
    cors: true,
    allowedHosts: ['.app.local', '.docma.yilmer.com'],
  },
  preview: {
    host: '0.0.0.0',
    strictPort: true,
    port: 3001,
    cors: true,
    allowedHosts: ['.app.local', '.docma.yilmer.com'],
  }
})
