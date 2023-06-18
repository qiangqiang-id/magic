import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    open: true,
    port: 14000,
    host: '0.0.0.0',
  },
  esbuild: {
    drop: mode === 'prod' ? ['console', 'debugger'] : [],
  },
}));
