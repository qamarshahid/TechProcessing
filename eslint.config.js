import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // Ignore build artifacts and reports
    ignores: [
      'node_modules',
      'dist',
      'coverage',
      'test-results',
      'backend/dist',
      'backend/coverage',
    ],
  },
  // Backend (NestJS) rules
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['backend/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
      parser: tseslint.parser,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  // Frontend (React) rules
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // React hooks
      ...reactHooks.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      // Fast refresh
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // TS relaxations
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // General JS relaxations
      'no-useless-catch': 'warn',
    },
  },
  // Test files (backend & frontend)
  {
    // Ensure TS parser is used for test files
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: [
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      'backend/test/**/*.{ts,tsx}',
      'src/**/*.test.{ts,tsx}',
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslint.parser,
      globals: {
        ...globals.jest,
        ...globals.vitest,
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  // Config files and scripts (Node)
  {
    files: [
      '**/*.config.{js,cjs,mjs,ts}',
      'scripts/**/*.{js,ts}',
      '*.config.*',
      'vite.config.*',
      'tailwind.config.*',
      'postcss.config.*',
      'babel.config.*',
      'playwright.config.*',
      'jest.config.*',
    ],
    languageOptions: {
      globals: globals.node,
    },
  }
);
