import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' + HashRouter = works on GitHub Pages (or any static host) with no server config.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
