import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    global: 'globalThis',
  },
  plugins: [svelte()],
  server: {
    port: 5174,
    proxy: {
      '/v1': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true,
      },
      '/local-engine': {
        target: 'http://localhost:8095',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: ['ptcg-server'],
  },
});
