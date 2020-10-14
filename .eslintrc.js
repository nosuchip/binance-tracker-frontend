module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/essential',
        'eslint:recommended',
        '@vue/typescript/recommended',
        '@vue/prettier',
        '@vue/prettier/@typescript-eslint',
        'plugin:@intlify/vue-i18n/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

        // '@intlify/vue-i18n/no-dynamic-keys': 'error',
        '@intlify/vue-i18n/no-raw-text': false,
        '@intlify/vue-i18n/no-unused-keys': [
          'error',
          {
            extensions: ['.js', '.vue']
          }
        ]
    },
};
