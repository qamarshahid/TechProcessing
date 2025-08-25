import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  base: '/TechProcessing/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: 'src/main.tsx',
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});
