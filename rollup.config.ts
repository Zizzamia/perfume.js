import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const createConfig = ({ output, min = false }) => {
  const minify =
    min &&
    terser({
      output: {
        comments(_, { text, type }) {
          if (type === 'comment2') {
            // multiline comment
            return /@preserve|@license|@cc_on/i.test(text);
          }
        },
      },
    });

  const plugins = [
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),
    // Resolve source maps to the original source
    sourceMaps(),
    minify,
  ];

  if (output.format !== 'esm') {
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    plugins.unshift(commonjs());
  }

  return {
    input: 'dist/es/perfume.js',
    output: {
      file: output.file,
      format: output.format,
      name: 'Perfume',
      sourcemap: true
    },
    watch: { include: 'dist/es/**' },
    plugins: plugins.filter(Boolean),
  };
};

export default [
  createConfig({
    output: { file: pkg.module, format: 'esm' }
  }),
  createConfig({
    output: { file: pkg.main, format: 'cjs' }
  }),
  createConfig({
    output: { file: 'dist/perfume.esm.min.js', format: 'esm' },
    min: true,
  }),
  createConfig({
    output: { file: 'dist/perfume.min.js', format: 'cjs' },
    min: true,
  }),
  createConfig({
    output: { file: pkg.iife, format: 'iife' },
  }),
  createConfig({
    output: { file: 'dist/perfume.iife.min.js', format: 'iife' },
    min: true,
  }),
  createConfig({
    output: { file: pkg.unpkg, format: 'umd' },
  }),
  createConfig({
    output: { file: 'dist/perfume.umd.min.js', format: 'umd' },
    min: true,
  }),
];
