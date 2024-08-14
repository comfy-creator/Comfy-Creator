import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
   build: {
      target: 'ESNext',
      lib: {
         entry: resolve(__dirname, 'lib/index.tsx'),
         name: 'GraphEditor',
         fileName: 'index',
         formats: ['cjs']
      },
      rollupOptions: {
         external: ['react', 'react-dom', 'react/jsx-runtime'],
         output: [
            {
               assetFileNames: 'umd/assets/[name][extname]',
               entryFileNames: 'umd/[name].js',
               globals: {
                  react: 'React',
                  'react-dom': 'ReactDOM',
                  'react/jsx-runtime': 'jsxRuntime'
               },
               format: 'umd',
               name: 'GraphEditor'
            },
            {
               assetFileNames: 'esm/assets/[name][extname]',
               entryFileNames: 'esm/[name].js',
               globals: {
                  react: 'React',
                  'react-dom': 'ReactDOM',
                  'react/jsx-runtime': 'jsxRuntime'
               },
               format: 'esm'
            }
         ]
      }
   },
   plugins: [
      react(),
      dts({
         include: ['lib'],
         compilerOptions: {
            declarationMap: true,
         }
      })
   ]
});
