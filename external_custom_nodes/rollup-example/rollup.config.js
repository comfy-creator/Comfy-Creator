export default {
  input: 'src/index.js',
  output: {
    file: 'out/bundle.js',
    format: 'cjs',
    exports: 'named',
  },
  externals: ['react', 'react-dom', '@xyflow/react'],
};
