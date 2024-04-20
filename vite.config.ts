import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import libCss from 'vite-plugin-libcss';

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
    cssCodeSplit: false,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime'
        }
      },
      plugins: [
        // postcss({ extract: 'styles.css' })
        // add other Rollup plugins here if needed
      ]
    }
  },
  plugins: [
    react(),
    libCss(),
    libInjectCss(),
    dts({
      include: ['lib/**/*.tsx', 'lib/**/*.ts'],
      rollupTypes: true
    })
  ]
});
