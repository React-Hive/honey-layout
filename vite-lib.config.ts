import type { UserConfig } from 'vite';

import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import checker from 'vite-plugin-checker';

export default {
  plugins: [
    checker({
      typescript: true,
      enableBuild: true,
    }),
    react(),
    dts({
      tsconfigPath: './tsconfig.build.json',
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      formats: ['es'],
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react'],
    },
  },
} satisfies UserConfig;
