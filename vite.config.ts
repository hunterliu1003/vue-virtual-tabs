import path from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import libInjectCss from './scripts/libInjectCss'

const name = 'index'

export default defineConfig({
  plugins: [vue(), dts(), libInjectCss()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name,
      fileName: format => `${name}.${format}.js`,
    },
    rollupOptions: {
      external: [
        'vue',
        '@vueuse/core',
        'is-what',
        'scroll-into-view',
        'swiper',
        'vue-virtual-scroll-grid',
      ],
      output: {
        globals: {
          'vue': 'Vue',
          '@vueuse/core': 'VueUse',
          'is-what': 'IsWhat',
          'scroll-into-view': 'ScrollIntoView',
          'swiper': 'Swiper',
          'vue-virtual-scroll-grid': 'VueVirtualScrollGrid',
        },
      },
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'happy-dom',
    deps: {
      inline: ['@vue', '@vueuse', 'vue-virtual-tabs'],
    },
  },
})
