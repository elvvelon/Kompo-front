import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The frontend runs on its own port (5173), separate from the Django API (8000).
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: 'localhost',
    port: 4173,
    strictPort: true,
  },
});
