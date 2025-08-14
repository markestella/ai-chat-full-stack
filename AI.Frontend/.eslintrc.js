module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: "detect" },
  },
  plugins: [
    "react",
    "@typescript-eslint",
    "prettier",
    "react-refresh",
  ],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "prettier/prettier": "warn",
    overrides: [
      {
        files: ['src/contexts/**/*.ts?(x)'],
        rules: {
          'react-refresh/only-export-components': 'off',
        },
      },
    ],
  },
  ignorePatterns: [
    "node_modules",
    "dist",
    "build",
    "**/components/ui/*.tsx" 
  ],
}
