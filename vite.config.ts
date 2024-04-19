import * as fs from 'node:fs';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

const { peerDependencies } = JSON.parse(fs.readFileSync(`./package.json`, 'utf8'));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    build: {
      target: 'ESNext',
      lib: {
        entry: resolve(__dirname, 'lib/index.tsx'),
        name: 'GraphEditor',
        formats: ['es', 'umd']
      },
      emptyOutDir: true,
      sourcemap: true,
      minify: true,
      rollupOptions: {
        external: [
          // ...Object.keys(dependencies || {}),
          ...Object.keys(peerDependencies || {}),
          'react/jsx-runtime'
        ],
        // input: {
        //   ...Object.fromEntries(
        //     glob.sync('lib/**/*.{ts,tsx}').map((file) => [
        //       // The name of the entry point
        //       // lib/nested/foo.ts becomes nested/foo
        //       relative('lib', file.slice(0, file.length - extname(file).length)),
        //       // The absolute path to the entry file
        //       // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
        //       fileURLToPath(new URL(file, import.meta.url))
        //     ])
        //   ),
        // main: resolve(__dirname, 'index.html')
        // },
        output: {
          // Filenames outputted to dist
          assetFileNames: 'assets/[name][extname]',
          entryFileNames: '[name].js'
        }
      }
    },
    define: {
      'process.env': env
    },
    plugins: [
      react(),
      libInjectCss(),
      dts({
        include: ['lib/**/*.tsx', 'lib/**/*.ts'],
        rollupTypes: true
      })
    ]
  };
});
