import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/bikeapi': {
        target: 'http://localhost:5100/bikeapi',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/bikeapi/, '')
      }
    }
  }
});
