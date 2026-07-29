import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs.plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    hmr: process.env?.DISABLE_HMR !== 'true',
    watch: process.env?.DISABLE_HMR === 'true' ? null : {},
  },
});
