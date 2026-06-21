module.exports = {
  env: {
    browser: true,
    es2021: true,
    "react-native/react-native": true,
    jest: true,
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
  plugins: [
    'react',
    'react-native'
  ],
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': 'warn',
    'react-native/no-unused-styles': 2,
    'react-native/split-platform-components': 2,
    'react-native/no-inline-styles': 0, // Ignored for prototype
    'react-native/no-color-literals': 0,
    'react-native/no-raw-text': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
