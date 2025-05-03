import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Specific polyfills needed for react-pdf
      globals: {
        Buffer: true,
        process: true,
      },
    }),
  ],
  define: {
    // Global definitions needed for some dependencies
    'process.env': {},
    global: 'window',
  },
  resolve: {
    alias: {
      // Alias for buffer
      buffer: 'buffer/',
      // Add other aliases if needed
    },
  },
  optimizeDeps: {
    // Explicitly include buffer in optimization
    include: ['buffer'],
  },
  build: {
    // Common build configurations
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});