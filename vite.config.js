import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  assetsInclude: ['**/*.wasm', '**/*.fs'],
  plugins: [react()],
optimizeDeps: {
    exclude: ['@electric-sql/pglite'],
  },
});
