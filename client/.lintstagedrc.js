module.exports = {
  "*.{js,jsx}": ["eslint . --fix", "npm run test:staged"],
  "*.{ts,tsx}": [() => "tsc", "eslint . --fix", "npm run test:staged"],
};
