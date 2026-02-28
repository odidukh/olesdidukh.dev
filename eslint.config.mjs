// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      '.next/*',
      'node_modules/*',
      'public/sw.js',
      'playwright-report/**',
      'test-results/**',
      '.velite/**',
      '.vercel/**',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...storybook.configs['flat/recommended'],
  {
    // Enforce path aliases instead of relative imports
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*'],
              message: 'Use path aliases (@/) instead of relative imports.',
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
