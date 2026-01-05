import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Esta es la forma correcta de obtener la ruta en módulos ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Apunta correctamente a tu carpeta src
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Asegura que el output sea la carpeta dist
    outDir: 'dist',
  }
});
