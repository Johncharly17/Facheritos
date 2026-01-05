import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// En proyectos con "type": "module", __dirname no existe. 
// Usamos process.cwd() que apunta a la raíz del proyecto.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Esto permite que las importaciones con '@/' apunten a tu carpeta 'src'
      '@': path.resolve(process.cwd(), './src'),
    },
  },
  // Si vas a usar variables de entorno para la IA de Google más adelante,
  // puedes volver a añadir la sección 'define' aquí.
});
