import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    // 로컬 개발 시 프록시 설정 (프로덕션에서는 사용되지 않음)
    // 프로덕션에서는 VITE_API_BASE_URL 환경 변수를 통해 직접 백엔드 URL 사용
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  // 빌드 최적화
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  },
})
