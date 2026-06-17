import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import cesium from 'vite-plugin-cesium'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vueDevTools({
      launchEditor: 'cursor',
      componentInspector: {
        // devtools 默认会关掉快捷键和按钮，这里显式打开
        toggleComboKey: 'control-shift',
        toggleButtonVisibility: 'active',
        launchEditor: 'cursor',
      },
    }),
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router', 'pinia'],
      dts: false,
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: false,
    }),
    cesium(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as *;`,
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/cesium')) {
            return 'vendor-cesium'
          }
          if (id.includes('node_modules/three')) {
            return 'vendor-three'
          }
          if (id.includes('node_modules/echarts')) {
            return 'vendor-echarts'
          }
          if (id.includes('node_modules/@antv/x6')) {
            return 'vendor-x6'
          }
          if (id.includes('node_modules/xlsx')) {
            return 'vendor-xlsx'
          }
        },
      },
    },
  },
})
