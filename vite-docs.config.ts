import type { UserConfig } from 'vite';

import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import checker from 'vite-plugin-checker';

export default {
  root: 'src/docs',
  plugins: [
    checker({
      typescript: true,
    }),
    react(),
    mdx(),
  ],
  server: {
    port: 9000,
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    rollupOptions: {
      input: resolve(__dirname, 'src/docs/index.html'),
    },
  },
} satisfies UserConfig;
