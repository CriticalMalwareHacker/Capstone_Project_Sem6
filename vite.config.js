import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
  }
});
