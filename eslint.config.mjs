import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import { fixupConfigRules } from '@eslint/compat';

const eslintConfig = defineConfig([
  ...fixupConfigRules(nextVitals),
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;