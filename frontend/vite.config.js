import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
  },
  // Specify the entry point for your application
  // Change 'src/index.js' to the path of your entry file
  root: 'src',
  base: '/',
  resolve: {
    alias: [
      // You can add alias for commonly used directories or modules here
    ],
  },
});
