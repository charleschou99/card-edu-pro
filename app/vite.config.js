import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // relative paths so the build works from file:// inside Electron
  base: './',
  plugins: [react()],
});
