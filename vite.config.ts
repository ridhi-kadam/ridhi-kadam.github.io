import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // This user-site repository is published at the root of ridhi-kadam.github.io.
  base: '/',
})
