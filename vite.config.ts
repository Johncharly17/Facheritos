import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Definimos la ruta manualmente para evitar el error de Node.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Esto conecta el alias '@' con tu carpeta src
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist', // Carpeta de salida para Cloudflare
  }
});
