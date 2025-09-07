import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules', 'dist'],
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'scripts/',
        'index.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/*.setup.ts'
      ],
      thresholds: {
        global: {
          branches: 85,
          functions: 80,
          lines: 95,
          statements: 95
        }
      }
    },
    testTimeout: 10000,
  },
  esbuild: {
    target: 'node20'
  },
  resolve: {
    alias: {
      'n8n-workflow': path.resolve(__dirname, './vitest.setup.mjs'),
    },
  },
  define: {
    'import.meta.vitest': false,
  },
});