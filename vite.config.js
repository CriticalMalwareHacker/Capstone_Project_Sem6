import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills'


export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    'global': 'window',
  },
  resolve: {
    alias: {
      'process': 'process/browser',
      'buffer': 'buffer',
    }
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
});
