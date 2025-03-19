// eslint.config.cjs
const js = require('@eslint/js');
const reactPlugin = require('eslint-plugin-react');
const prettierPlugin = require('eslint-plugin-prettier');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');
const nextPlugin = require('@next/eslint-plugin-next');
const unusedImportsPlugin = require('eslint-plugin-unused-imports');
const typescriptParser = require('@typescript-eslint/parser');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const importPlugin = require('eslint-plugin-import');
const globals = require('globals');

module.exports = [
  {
    ignores: [
      '.now/*', // Ignorar todo en la carpeta .now
      '*.css', // Ignorar todos los archivos CSS
      '.changeset', // Ignorar la carpeta .changeset
      'dist', // Ignorar la carpeta dist
      'esm/*', // Ignorar todo en la carpeta esm
      'public/*', // Ignorar todo en la carpeta public
      'tests/*', // Ignorar todo en la carpeta tests
      'scripts/*', // Ignorar todo en la carpeta scripts
      '*.config.js', // Ignorar todos los archivos de configuración JS
      '.DS_Store', // Ignorar archivos .DS_Store
      'node_modules', // Ignorar la carpeta node_modules
      'coverage', // Ignorar la carpeta coverage
      '.next', // Ignorar la carpeta .next
      'build', // Ignorar la carpeta build
      '!.commitlintrc.cjs', // Incluir este archivo específico
      '!.lintstagedrc.cjs', // Incluir este archivo específico
      '!jest.config.js', // Incluir este archivo específico
      '!plopfile.js', // Incluir este archivo específico
      '!react-shim.js', // Incluir este archivo específico
      '!tsup.config.ts', // Incluir este archivo específico
    ],
  },
  js.configs.recommended, // Configuración recomendada de ESLint
  {
    files: ['**/*.ts', '**/*.tsx'], // Aplicar solo a archivos TypeScript
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser, // Agrega globales de navegador
        ...globals.node, // Agrega globales de Node.js
        React: 'readonly', // Agrega React como variable global
        RequestInit: 'readonly', // Agrega RequestInit como variable global
      },
      parser: typescriptParser, // Usar el parser de TypeScript
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Habilitar JSX
        },
      },
    },
    plugins: {
      react: reactPlugin,
      prettier: prettierPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      '@next/next': nextPlugin,
      'unused-imports': unusedImportsPlugin,
      '@typescript-eslint': typescriptPlugin,
      import: importPlugin, // Registra el plugin de import
    },
    rules: {
      'no-console': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/interactive-supports-focus': 'warn',
      'prettier/prettier': 'warn',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_.*?$',
        },
      ],
      'import/order': [
        'warn',
        {
          groups: [
            'type',
            'builtin',
            'object',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          pathGroups: [
            {
              pattern: '~/**',
              group: 'external',
              position: 'after',
            },
          ],
          'newlines-between': 'always', // Cambia newlinesBetween a newlines-between
          distinctGroup: true,
          named: false,
          warnOnUnassignedImports: false,
        },
      ],
      'react/self-closing-comp': 'warn',
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          shorthandFirst: true,
          noSortAlphabetically: false,
          reservedFirst: true,
        },
      ],
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
      ],
    },
  },
];