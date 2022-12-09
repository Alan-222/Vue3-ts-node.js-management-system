import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
const baseURL = 'http://127.0.0.1:3007';
export default defineConfig({
  plugins: [
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    vue(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [resolve(process.cwd(), 'src/assets/svg')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]'
    })
  ],
  base: process.env.NODE_ENV === 'production' ? './' : '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src') // 路径别名
    },
    extensions: ['.js', '.json', '.ts', '.vue'] // 使用路径别名时想要省略的后缀名，可以自己 增减
  },
  server: {
    port: 8080,
    // host: '127.0.0.1:3007',
    open: true,
    proxy: {
      '/user': {
        target: 'http://127.0.0.1:3007',
        changeOrigin: true,
        rewrite: (path) => path.replace('//user$/', '')
      },
      '/dashboard': {
        target: 'http://127.0.0.1:3007',
        changeOrigin: true,
        rewrite: (path) => path.replace('//dashboard$/', '')
      },
      '/my': {
        target: 'http://127.0.0.1:3007',
        changeOrigin: true,
        rewrite: (path) => path.replace('//my$/', '')
      }
      // '/my/article': {
      //   target: 'http://127.0.0.1:3007',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace('//my/article$/', '')
      // }
    }
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  }
});
