import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const base = isProduction ? '/TechProcessing/' : '/';

  return {
    plugins: [react()],
    base,
    server: {
      hmr: {
        overlay: false
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'esbuild',
      assetsInlineLimit: 0,
      rollupOptions: {
        input: './index.html',
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  };
});
