import path from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import libInjectCss from './scripts/libInjectCss'

const name = 'index'

export default defineConfig({
  plugins: [
    vue(),
    libInjectCss(),
  ],
  publicDir: false,
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
        'swiper/vue',
        'swiper/css',
        'vue-virtual-scroll-grid',
      ],
      output: {
        globals: {
          'vue': 'Vue',
          '@vueuse/core': 'VueUse',
          'is-what': 'IsWhat',
          'scroll-into-view': 'ScrollIntoView',
          'swiper': 'Swiper',
          'swiper/vue': 'SwiperVue',
          'swiper/css': 'SwiperCss',
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
