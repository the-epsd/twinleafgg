import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  // ptcg-server (and some transitive code) references Node's `global`; browsers only have globalThis.
  define: {
    global: 'globalThis',
  },
  plugins: [react()],
  server: {
    proxy: {
      '/v1': { target: 'http://localhost:8080', changeOrigin: true },
      '/socket.io': { target: 'http://localhost:8080', ws: true, changeOrigin: true },
    },
  },
  optimizeDeps: {
    include: ['ptcg-server'],
  },
});
