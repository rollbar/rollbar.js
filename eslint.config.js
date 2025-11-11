import babelParser from '@babel/eslint-parser';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import chaiFriendly from 'eslint-plugin-chai-friendly';
import importPlugin from 'eslint-plugin-import';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import ts from 'typescript-eslint';

const noUnusedVarsRule = [
  'error',
  {
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
    caughtErrorsIgnorePattern: '^_',
  },
];

export default defineConfig(
  js.configs.recommended,
  ts.configs.recommended,
  ts.configs.stylistic,
  prettierRecommended,
  chaiFriendly.configs.recommendedFlat,

  // all files
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
      'chai-friendly': chaiFriendly,
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
      'no-unused-vars': noUnusedVarsRule,
      '@typescript-eslint/no-unused-vars': noUnusedVarsRule,
      '@typescript-eslint/no-empty-function': [
        'error',
        {
          allow: ['arrowFunctions'],
        },
      ],

      // disabled for now
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/prefer-for-of': 'off',
      '@typescript-eslint/prefer-function-type': 'off',
      'chai-friendly/no-unused-expressions': 'off',
      'no-undef': 'off',
      'no-var': 'off',
    },
  },

  // globals
  {
    files: ['test/**/*.[tj]s'],
    languageOptions: { globals: { ...globals.mocha } },
  },
  {
    files: ['src/**/*.c?[tj]s', 'test/**/*.[tj]s'],
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    files: [
      'src/server/**/*.[tj]s',
      'src/react-native/**/*.[tj]s',
      'test/**/server.*.[tj]s',
      'scripts/**/*.[tj]s',
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
    rules: {
      strict: ['error', 'safe'],
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // ts
  {
    files: ['**/*.ts'],
    rules: {
      'no-unused-vars': 'off',
    },
  },

  // cjs
  {
    files: ['**/*.cjs'],
    languageOptions: { sourceType: 'commonjs' },
    rules: {
      strict: 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // scripts
  {
    files: ['scripts/**/*.{js,cjs}'],
    rules: { 'no-console': 'off' },
  },

  {
    ignores: ['dist', 'examples', 'node_modules', 'vendor', 'coverage'],
  },
);
