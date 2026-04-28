import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2000,
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      routesDirectory: 'src/routes',
      autoCodeSplitting: false,
    }),
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      '@bindings': path.resolve(__dirname, 'bindings'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
