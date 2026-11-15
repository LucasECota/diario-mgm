import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Em desenvolvimento, /api é encaminhado para a API (sem o prefixo /api).
// Em produção (Docker), o nginx faz o mesmo encaminhamento.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.API_URL ?? 'http://localhost:3000',
        rewrite: (caminho) => caminho.replace(/^\/api/, ''),
      },
    },
  },
});
