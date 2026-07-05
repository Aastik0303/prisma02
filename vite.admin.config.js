import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    {
      name: 'admin-root-entry',
      configureServer(server) {
        server.middlewares.use((request, _response, next) => {
          if (request.url === '/') {
            request.url = '/admin.html'
          }
          next()
        })
      }
    },
    react()
  ],
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: true,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      input: 'admin.html'
    }
  }
})
