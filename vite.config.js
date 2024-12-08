import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/bloom/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['chunk-DRWLMN53', 'chunk-G3PMV62Z']
  }
})