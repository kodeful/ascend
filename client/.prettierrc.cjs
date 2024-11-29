{}
/** @typedef  {import("prettier").Config} PrettierConfig */
/** @typedef  {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig } */
module.exports = {
    plugins: ["@ianvs/prettier-plugin-sort-imports"],
    importOrder: [
      "^(react/(.*)$)|^(react$)$",
      "<THIRD_PARTY_MODULES>",
      "",
      "^(api/(.*)$|^components/(.*)$|^modules/(.*)$|^utils/(.*)$)",
      "",
      "^[../]",
      "^[./]",
    ],
    importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
    importOrderTypeScriptVersion: "4.9.5",
  };
  
