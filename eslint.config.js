import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";

export default [
  {
    name: "app/files-to-lint",
    files: ["**/*.{js,mjs,jsx,vue}"],
  },

  {
    name: "app/files-to-ignore",
    ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"],
  },

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  js.configs.recommended,

  ...pluginVue.configs["flat/essential"],

  {
    rules: {
      ...pluginVue.configs["flat/essential"].rules,
      "no-unused-vars": "off",
      "vue/multi-word-component-names": "off", // Turn off multi-word component rule
    },
  },
];
