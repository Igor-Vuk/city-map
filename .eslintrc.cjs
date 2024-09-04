module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@react-three/recommended",
    "plugin:tailwindcss/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json", "./tsconfig.node.json"],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: ["@stylistic"],
  rules: {
    "react/react-in-jsx-scope": 0,
    "react/no-unknown-property": ["off", { ignore: ["JSX"] }], // remove this rule when the bug in eslint is fixed
    "@stylistic/spaced-comment": "error",
    "@typescript-eslint/no-namespace": ["error", { allowDeclarations: true }],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { ignoreRestSiblings: true },
    ],
  },
  /* override rule for shadcn component eslint errors */
  overrides: [
    {
      files: ["**/components/ui/*.tsx", "**/components/hooks/*.tsx"],
      rules: {
        "react/prop-types": [
          2,
          {
            ignore: [
              "className",
              "variant",
              "size",
              "asChild",
              "inset",
              "children",
              "sideOffset",
              "checked",
            ],
          },
        ],
        "react-refresh/only-export-components": "off",
        "tailwindcss/enforces-shorthand": "off",
      },
    },
  ],
}
