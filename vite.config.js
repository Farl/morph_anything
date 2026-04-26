import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  base: '/morph_anything/',
  resolve: {
    alias: {
      // The source files are pre-compiled websim output that explicitly import
      // jsxDEV, but React sets jsxDEV=undefined in production. Use a shim.
      'react/jsx-dev-runtime': fileURLToPath(
        new URL('./jsx-dev-runtime-shim.js', import.meta.url)
      ),
    },
  },
})
