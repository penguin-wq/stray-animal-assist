import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const proxyTarget = process.env['VITE_PROXY_TARGET'] ?? 'http://localhost:8080';

export default defineConfig({
  plugins: [tailwindcss(), tanstackStart({ server: { entry: 'server' } }), viteReact()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
      },
    },
  },
});
