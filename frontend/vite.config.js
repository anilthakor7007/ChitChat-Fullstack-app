import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],

  server: {
    port: 5174,
    proxy: {
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true, // Enable WebSocket support
        changeOrigin: true,
      },
    },
  },
})