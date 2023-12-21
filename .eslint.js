module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  overrides: [
    {
      files: ["*.spec.ts", "*.spec.tsx"],
      globals: {
        /**
         * These globals are all used by Jest and as such are restricted to test files
         */
        afterEach: "readonly",
        describe: "readonly",
        beforeEach: "readonly",
        expect: "readonly",
        it: "readonly",
        jest: "readonly"
      }
    },
    {
      files: ["*.types.ts"],
      rules: {
        "no-use-before-define": "off",
        "no-unused-vars": "off"
      }
    }
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest"
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    /**
     * JavaScript allows the omission of curly braces when a block contains
     * only one statement. However, it is considered by many to be best
     * practice to never omit curly braces around blocks, even when they
     * are optional, because it can lead to bugs and reduces code clarity.
     */
    curly: ["error", "all"],
    /**
     * Since we have node-resolve installed we do not need extensions listed.
     */
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
        tsx: "never"
      }
    ],
    /**
     * This slightly alters the allowed order of imports to allow us to put types clearly at the bottom.
     */
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "object",
          "type"
        ]
      }
    ],
    /**
     * This rule is disabled in functions since there is no problem using a
     * variable in a function before it is defined at the root. In that case
     * it is still defined before use and allows us to keep everything in
     * alphabetical order. In the case that the variable truly does not exist,
     * Typescript should let us know…
     *
     * example:
     *    const getCoordinates = (x) => retrieveCoorsJson()[x];
     *    const retrieveCoorsJson = () => fetch();
     */
    "no-use-before-define": [
      "error",
      {
        functions: false
      }
    ],
    /**
     * This rule allows else if returns. Since that is still wrapped in
     * logic, we need to be able to to choose to return or not
     */
    "no-else-return": [
      "error",
      {
        allowElseIf: true
      }
    ]
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true
      }
    }
  }
};
