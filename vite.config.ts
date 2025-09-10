import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  // Use root path for custom domain, /TechProcessing/ for GitHub Pages
  const base = isProduction ? '/' : '/';

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
