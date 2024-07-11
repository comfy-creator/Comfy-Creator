import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dts from 'rollup-plugin-dts';

export default defineConfig({
   build: {
      lib: {
         entry: path.resolve(__dirname, 'lib/index.tsx'), // Adjust this to your entry file
         name: 'GraphEditor',
         fileName: (format) => `index.${format}.js`,
         formats: ['es', 'cjs']
      },
      rollupOptions: {
         external: ['react', 'react-dom'],
         output: {
            globals: {
               react: 'React',
               'react-dom': 'ReactDOM'
            }
         },
         plugins: [
            dts({
               tsconfig: path.resolve(__dirname, 'tsconfig-build.json')
            })
         ]
      },
      sourcemap: true // Enable source maps
   },
   plugins: [react()]
});
