module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    // You said you DO NOT want these:
    "no-unused-vars": "off",
    "sort-imports": "off",
    "import/order": "off",

    // Detect problems but do NOT auto-fix logic
    "no-undef": "error",
    "no-redeclare": "error",
    "no-dupe-keys": "error",
  },
};
