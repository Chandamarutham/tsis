import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
  ],
  base: '/', // The GitHub repo name
  optimizeDeps: {
    include: [
      "@aws-crypto/sha256-browser",
      "@aws-sdk/signature-v4"
    ]
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@typedef': path.resolve(__dirname, 'src/typedef'),
      '@blocks': path.resolve(__dirname, 'src/blocks')
    }
  }
})
