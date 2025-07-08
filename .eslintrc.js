module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': 'warn', // Downgrade from error to warning
    'no-unused-vars': 'warn', // Downgrade from error to warning
    'react/no-unescaped-entities': 'warn', // Downgrade from error to warning
    'react/prop-types': 'warn', // Downgrade from error to warning
    // Disable the rule that's causing issues since we don't have eslint-plugin-import installed
    'import/no-anonymous-default-export': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
