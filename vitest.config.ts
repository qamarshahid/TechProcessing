import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
    include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
    exclude: [
      'backend/**/*',
      'src/e2e/**/*',
      'node_modules/**/*',
      'dist/**/*'
    ],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});
