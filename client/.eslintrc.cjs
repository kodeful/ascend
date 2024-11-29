/** @typedef {import("eslint").Linter.Config} EslintConfig */

/** @type { EslintConfig } */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:testing-library/react",
    // "prettier",
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint", "import", "react-hooks"],
  rules: {
    // @typescript-eslint
    "@typescript-eslint/prefer-nullish-coalescing": "off", // FIXME: fix those slowly, we have too many errors to fix all at once, set as error at some point
    // "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/consistent-type-definitions": "off", // TODO change
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      { prefer: "type-imports", fixStyle: "separate-type-imports" },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "(^_|React)" }, // FIXME: remove React ignoring
    ],

    // FIXME: fix below, but it's too much to handle atm
    "@typescript-eslint/no-misused-promises": [
      "warn", // FIXME: by default it's an error, but it's too much to handle atm
      { checksVoidReturn: { attributes: false } },
    ],
    "no-case-declarations": "off", // TODO change
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off", // TODO change
    "@typescript-eslint/ban-types": "off", // TODO change

    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-unsafe-assignment": "off", // TODO change
    "@typescript-eslint/no-unsafe-call": "off", // TODO change
    "@typescript-eslint/no-unsafe-member-access": "off", // TODO change
    "@typescript-eslint/no-unsafe-argument": "off", // TODO change
    "@typescript-eslint/no-unsafe-return": "off", // TODO change
    "@typescript-eslint/no-explicit-any": "off", // TODO change
    "@typescript-eslint/unbound-method": "off", // FIXME:  doesn't work well with const { formatMessage } = useIntl();
    "@typescript-eslint/no-floating-promises": "off", // TODO change
    "@typescript-eslint/restrict-template-expressions": "off", // TODO change
    "@typescript-eslint/require-await": "off", // TODO change
    "@typescript-eslint/no-unsafe-enum-comparison": "off", // TODO change
    "@typescript-eslint/no-empty-function": "off", // TODO change
    "react/jsx-key": "off", // TODO change
    // FIXME: fix above errors and remove to allow default behaviour

    //react
    "react/prop-types": "off", // TODO change
    // testing-library
    "testing-library/prefer-screen-queries": "off", // TODO change
    // "testing-library/await-async-query": "warn",
    "testing-library/await-async-utils": "off", // TODO change
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {
        project: true,
      },
    },
  },
  env: {
    es2022: true,
    node: true,
  },
  ignorePatterns: [
    "node_modules/",
    "build/",
    "cypress/",
    "src/api/generated/",
    "public/",
    "package/",
    "package-lock.json",
    "*.config.*",
  ],
  reportUnusedDisableDirectives: true,
};
