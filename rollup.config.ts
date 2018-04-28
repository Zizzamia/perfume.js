import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
//import uglify from 'rollup-plugin-uglify';
import pkg from './package.json';

const ensureArray = maybeArr => Array.isArray(maybeArr) ? maybeArr : [maybeArr]

const createConfig = ({ output, includeExternals = false } = {}) => ({
  input: `dist/es/perfume.js`,
  output: ensureArray(output).map(format => Object.assign(
    {},
    format,
    { sourcemap: true },
  )),
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: includeExternals
    ? []
    : [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  watch: {
    include: 'dist/es/**',
  },
  plugins: [
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
    //uglify({
    //  output: {
    //    comments: function(node, comment) {
    //      const text = comment.value;
    //      const type = comment.type;
    //      if (type == "comment2") {
    //        // multiline comment
    //        return /@preserve|@license|@cc_on/i.test(text);
    //      }
    //    }
    //  }
    //}),
  ],
})

export default [
  createConfig({
    output: [
      { file: pkg.module, format: 'es' },
      { file: pkg.main, format: 'cjs' }
    ],
  }),
  createConfig({
    output: { file: pkg.iife, name: 'perfume', format: 'iife' },
    includeExternals: true,
  }),
  createConfig({
    output: { file: pkg.unpkg, name: 'perfume.umd', format: 'umd' },
    includeExternals: true,
  }),
]
