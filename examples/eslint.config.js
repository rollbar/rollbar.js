import js from '@eslint/js';
import globals from 'globals';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

const protectedFiles = [
  'browser_extension_v2/background.js',
  'react-16/dist/index.html',
  'react-16/dist/main.js',
  'react-replay-webpack4/dist/index.html',
  'react-replay-webpack4/dist/main.js',
  'webpack/dist/bundle.js',
  'webpack/dist/bundle.js.map',
  'webpack4-replay/dist/bundle.js',
  'webpack4-replay/dist/bundle.js.map',
];

const ignoredPaths = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.next/**',
  '**/.nuxt/**',
  '**/.output/**',
  '**/.svelte-kit/**',
  '**/coverage/**',
  '**/.vercel/**',
  '**/.turbo/**',
  ...protectedFiles,
];

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierRecommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
      'no-alert': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: false,
      },
    },
  },
  {
    files: ['**/*.jsx', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
  {
    ignores: ignoredPaths,
  },
);
