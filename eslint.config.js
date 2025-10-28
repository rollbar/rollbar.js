import babelParser from '@babel/eslint-parser';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import unusedImports from 'eslint-plugin-unused-imports';

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
    },
  },

  {
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      sourceType: 'module',
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2021,
      },
    },
    rules: {
      strict: ['error', 'safe'],
      'no-prototype-builtins': 'off',
      'no-redeclare': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-useless-escape': 'off',
    },
  },

  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
    },
    rules: {
      strict: 'off',
      'no-undef': 'off',
    },
  },
  {
    ignores: ['dist', 'examples', 'node_modules', 'vendor', 'coverage'],
  },
]);
