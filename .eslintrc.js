module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ['plugin:react/recommended', 'standard'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 11,
    sourceType: 'module'
  },
  plugins: ['react'],
  rules: {
    semi: [
      2,
      'never',
      {
        beforeStatementContinuationChars: 'never'
      }
    ],
    'react/display-name': 'off',
    'prefer-promise-reject-errors': 'off',
    'import/no-extraneous-dependencies': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'jsx-quotes': 'off',
    'comma-dangle': 'off',
    'no-console': 'off',
    'import/prefer-default-export': 'off',
    'react/prop-types': 'off',
    'import/no-unresolved': 'off',
    quotes: 'off',
    'arrow-body-style': 'off',
    'no-extra-boolean-cast': 'off',
    'react/no-array-index-key': 'off',
    'no-unused-expressions': 'off',
    'react/jsx-props-no-spreading': 'off',
    'max-len': [
      2,
      {
        code: 700,
        tabWidth: 2,
        comments: 700
      }
    ],
    'object-curly-newline': 'off',
    'jsx-a11y/tabindex-no-positive': 'off',
    'no-return-assign': 'off',
    'arrow-parens': 'off',
    'no-restricted-syntax': 'off',
    'lines-between-class-members': 'off',
    'no-useless-constructor': 'off',
    'react/no-unused-state': 'off',
    'space-before-function-paren': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'max-lines': [
      2,
      {
        max: 700,
        skipComments: true
      }
    ],
    'no-underscore-dangle': 0,
    'no-shadow': 0,
    'operator-linebreak': 0,
    indent: 'off',
    'implicit-arrow-linebreak': 'off',
    'react/destructuring-assignment': 0,
    'template-curly-spacing': 'off'
  }
}
