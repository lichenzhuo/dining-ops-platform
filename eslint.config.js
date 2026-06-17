import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import globals from 'globals'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
]
