import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 与 webReact 的 5173 错开，两个项目可以同时跑
  server: {
    port: 5174,
  },
})
