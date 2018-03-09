import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import uglify from 'rollup-plugin-uglify';
import camelCase from 'lodash.camelcase';

const pkg = require('./package.json');

export default {
  input: `dist/es/perfume.js`,
  output: [
    { file: pkg.module, format: 'es' },
    { file: pkg.iife, name: 'perfume', format: 'iife' },
    { file: pkg.main, name: 'perfume.umd', format: 'umd' },
  ],
  sourcemap: true,
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
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
    uglify({
      output: {
        comments: function(node, comment) {
          const text = comment.value;
          const type = comment.type;
          if (type == "comment2") {
            // multiline comment
            return /@preserve|@license|@cc_on/i.test(text);
          }
        }
      }
    }),
  ],
}
