import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import uglify from 'rollup-plugin-uglify';
import pkg from './package.json';

const ensureArray = maybeArr =>
  Array.isArray(maybeArr) ? maybeArr : [maybeArr];

const createConfig = ({ output, includeExternals = false, min = false }) => {
  const minify =
    min &&
    uglify({
      output: {
        comments(node, { text, type }) {
          if (type === 'comment2') {
            // multiline comment
            return /@preserve|@license|@cc_on/i.test(text);
          }
        },
      },
    });

  return {
    input: 'dist/es/perfume.js',
    output: ensureArray(output).map(format => ({
      ...format,
      name: 'Perfume',
      sourcemap: true,
    })),
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: includeExternals
      ? []
      : [
          ...Object.keys(pkg.dependencies || {}),
          ...Object.keys(pkg.peerDependencies || {}),
        ],
    watch: { include: 'dist/es/**' },
    plugins: [
      // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
      commonjs(),
      // https://github.com/rollup/rollup-plugin-node-resolve#usage
      resolve(),
      // Resolve source maps to the original source
      sourceMaps(),
      minify,
    ].filter(Boolean),
  };
};

export default [
  createConfig({
    output: [
      { file: pkg.module, format: 'es' },
      { file: pkg.main, format: 'cjs' },
    ],
  }),
  createConfig({
    output: { file: 'dist/perfume.es5.min.js', format: 'es' },
    min: true,
  }),
  createConfig({
    output: { file: 'dist/perfume.min.js', format: 'cjs' },
    min: true,
  }),
  createConfig({
    output: { file: pkg.iife, format: 'iife' },
    includeExternals: true,
  }),
  createConfig({
    output: { file: 'dist/perfume.iife.min.js', format: 'iife' },
    includeExternals: true,
    min: true,
  }),
  createConfig({
    output: { file: pkg.unpkg, format: 'umd' },
    includeExternals: true,
  }),
  createConfig({
    output: { file: 'dist/perfume.umd.min.js', format: 'umd' },
    includeExternals: true,
    min: true,
  }),
];
