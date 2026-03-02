import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  server: {
    port: 5173, // Ép cứng luôn chạy ở cổng 5173
    strictPort: true, // Báo lỗi nếu cổng này đang bị chiếm, không cho tự nhảy cổng khác
  }
});
