import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174, // Ép cứng luôn chạy ở cổng 5174
    strictPort: true, // Báo lỗi nếu cổng này đang bị chiếm, không cho tự nhảy cổng khác
  }
})
