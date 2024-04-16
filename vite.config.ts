import * as fs from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

const { dependencies, peerDependencies } = JSON.parse(fs.readFileSync(`./package.json`, 'utf8'));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      afterBuild: () => {
        fs.copyFileSync('dist/index.d.ts', 'dist/index.d.cts');
      }
    })
  ],
  build: {
    target: 'es2017',
    lib: {
      fileName: 'index',
      formats: ['cjs', 'es'],
      entry: 'src/App.tsx'
    },
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    rollupOptions: {
      external: [
        ...Object.keys(dependencies || {}),
        ...Object.keys(peerDependencies || {}),
        'react/jsx-runtime'
      ]
    }
  }
});
