import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'react-keep-alive': resolve(__dirname, 'react-keep-alive')
    },
  },
});
