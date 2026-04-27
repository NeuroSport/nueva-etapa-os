import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Forced redeploy: v2.3.1 - Fix mobile compatibility
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    minify: 'terser', // More robust minification
  }
})
