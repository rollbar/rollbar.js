import babelParser from '@babel/eslint-parser';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2021,
      },
    },
    rules: {
      'comma-dangle': 'off',
      strict: 0,
      'no-underscore-dangle': 0,
      'no-useless-escape': 0,
      complexity: [2, { max: 35 }],
      'no-use-before-define': [0, { functions: false }],
      'no-prototype-builtins': 0,

      // Off until issues are fixed
      camelcase: 'off', //[2, {'properties': 'never'}],
      'no-unused-vars': 'off', //[2, { 'argsIgnorePattern': '^_' }],
      quotes: 'off', //[2, 'single', 'avoid-escape'],
    },
  },
  {
    ignores: ['dist', 'examples', 'node_modules', 'vendor'],
  },
]);
