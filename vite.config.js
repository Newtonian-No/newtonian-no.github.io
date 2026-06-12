import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  build: {
    rollupOptions: {
      treeshake: {
        moduleSideEffects: (id) => {
          // GSAP 内部依赖副作用（如注册插件到全局），tree-shaking 会破坏其功能
          if (id.includes('gsap')) return 'no-treeshake';
        },
      },
    },
  },
})
