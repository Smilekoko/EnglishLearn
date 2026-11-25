import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 部署到 https://域名/admin/ 时构建用：VITE_BASE=/admin/ npm run build
  base: process.env.VITE_BASE ?? '/',
  // 与 webReact 的 5173 错开，两个项目可以同时跑
  server: {
    port: 5174,
    // 同源访问后端，会话 Cookie 不需要跨域
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
