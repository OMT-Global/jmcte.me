const nextPlugin = require('@next/eslint-plugin-next');

const baseConfig = nextPlugin.configs['core-web-vitals'];

module.exports = [
  {
    ...baseConfig,
    rules: {
      ...baseConfig.rules,
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
  {
    ignores: ['out/', '.next/'],
  },
];
