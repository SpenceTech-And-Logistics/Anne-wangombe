import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import seoPlugin from './seo-plugin.js'

export default defineConfig({
  plugins: [react(), seoPlugin()],
})
