import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 5174,
    proxy: {
      '/local-engine': {
        target: 'http://localhost:8095',
        changeOrigin: true,
      },
    },
  },
});
