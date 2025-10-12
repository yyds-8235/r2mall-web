import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {  // 配置别名
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          antd: ['antd'],
          echarts: ['echarts', 'echarts-for-react']
        }
      }
    }
  },
  server: {
    open: true,
    port: 5173,
    host: 'localhost',
    proxy: {
      '/api': {
        target: 'http://localhost:8082', // 后端服务实际地址
        changeOrigin: true
        // 不需要 rewrite，保留 /api 路径
      }
    }
  }
})
