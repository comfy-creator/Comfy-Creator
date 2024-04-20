import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

// const { peerDependencies } = JSON.parse(fs.readFileSync(`./package.json`, 'utf8'));

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'ESNext',
    lib: {
      entry: resolve(__dirname, 'lib/index.tsx'),
      name: 'GraphEditor',
      fileName: 'index',
      formats: ['es', 'umd']
    },
    emptyOutDir: true,
    sourcemap: true,
    // minify: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime'
        }
      }
    }
  },
  plugins: [
    react(),
    libInjectCss(),
    dts({
      include: ['lib/**/*.tsx', 'lib/**/*.ts'],
      rollupTypes: true
    })
  ]
});
