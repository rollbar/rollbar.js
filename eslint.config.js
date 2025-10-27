import js from '@eslint/js';
import babelParser from '@babel/eslint-parser';
import prettierRecommende from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  js.configs.recommended,
  prettierRecommende,
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2021,
      },
    },
    rules: {
      strict: ['error', 'safe'],
      complexity: ['error', { max: 35 }],
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
      ecmaVersion: 2021,
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
