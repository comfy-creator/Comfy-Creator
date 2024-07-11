import { extname, relative, resolve } from 'path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

// const { peerDependencies } = JSON.parse(fs.readFileSync(`./package.json`, 'utf8'));

// https://vitejs.dev/config/
export default defineConfig({
  // build: {
  //   target: 'ESNext',
  //   lib: {
  //     entry: resolve(__dirname, 'lib/index.tsx'),
  //     name: 'GraphEditor',
  //     fileName: 'index',
  //     formats: ['es']
  //   },
  //   emptyOutDir: true,
  //   // sourcemap: true,
  //   // minify: true,
  //   cssCodeSplit: false,
  //   rollupOptions: {
  //     external: ['react', 'react-dom', 'react/jsx-runtime'],
  //     input: Object.fromEntries(
  //       glob.sync('lib/**/*.{ts,tsx}').map((file) => [
  //         // The name of the entry point
  //         // lib/nested/foo.ts becomes nested/foo
  //         relative('lib', file.slice(0, file.length - extname(file).length)),
  //         // The absolute path to the entry file
  //         // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
  //         fileURLToPath(new URL(file, import.meta.url))
  //       ])
  //     ),
  //     output: {
  //       assetFileNames: 'assets/[name][extname]',
  //       entryFileNames: '[name].js',
  //       globals: {
  //         react: 'React',
  //         'react-dom': 'ReactDOM',
  //         'react/jsx-runtime': 'jsxRuntime'
  //       }
  //     }
  //   }
  // },
  plugins: [
    react(),
    // libInjectCss(),
    // dts({
    //   include: ['lib'],
    //   rollupTypes: true
    // })
  ]
});
