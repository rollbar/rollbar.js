import babelParser from '@babel/eslint-parser';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

export default defineConfig([
  js.configs.recommended,
  prettierRecommended,

  {
    languageOptions: {
      ecmaVersion: 2021,
    },
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      complexity: ['error', { max: 35 }],
      eqeqeq: ['error', 'smart'],
      'no-console': 'error',
      'no-implicit-coercion': 'error',
      'unused-imports/no-unused-imports': 'error',
      'import/order': [
        'warn',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
        },
      ],
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  // globals
  {
    files: ['test/**/*.js'],
    languageOptions: { globals: { ...globals.mocha } },
  },
  {
    files: ['src/**/*.{js,cjs}', 'test/**/*.js'],
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    files: [
      'src/server/**/*.js',
      'src/react-native/**/*.js',
      'test/**/server.*.js',
      'scripts/**/*.js',
    ],
    languageOptions: { globals: { ...globals.node } },
  },

  // js
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2021,
      },
    },
    rules: { strict: ['error', 'safe'] },
  },

  // cjs
  {
    files: ['**/*.cjs'],
    languageOptions: { sourceType: 'commonjs' },
    rules: { strict: 'off' },
  },

  // scripts
  {
    files: ['scripts/**/*.{js,cjs}'],
    rules: { 'no-console': 'off' },
  },

  {
    ignores: ['dist', 'examples', 'node_modules', 'vendor', 'coverage'],
  },
]);
