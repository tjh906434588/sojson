import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { rmSync } from 'node:fs'

// public/scripts 下的构建期脚本会被 vite 原样拷贝到 dist，产物中不需要这些源码文件，构建完成后清理
function removeBuildScriptsFromDist(): Plugin {
  return {
    name: 'remove-build-scripts-from-dist',
    closeBundle() {
      rmSync(fileURLToPath(new URL('./dist/scripts', import.meta.url)), { recursive: true, force: true })
    }
  }
}

export default defineConfig({
  plugins: [vue(), removeBuildScriptsFromDist()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    host: true
  }
})
