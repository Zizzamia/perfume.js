import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import uglify from "rollup-plugin-uglify";
import pkg from "./package.json";

const ensureArray = maybeArr =>
  Array.isArray(maybeArr) ? maybeArr : [maybeArr];

const createConfig = ({
  output,
  includeExternals = false,
  min = false
} = {}) => ({
  input: "dist/es/perfume.js",
  output: ensureArray(output).map(format =>
    Object.assign({}, format, { sourcemap: true })
  ),
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: includeExternals
    ? []
    : [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {})
      ],
  watch: {
    include: "dist/es/**"
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
    min &&
      uglify({
        output: {
          comments: function(node, comment) {
            const { text, type } = comment;
            if (type == "comment2") {
              // multiline comment
              return /@preserve|@license|@cc_on/i.test(text);
            }
          }
        }
      })
  ].filter(Boolean)
});

export default [
  createConfig({
    output: [
      { file: pkg.module, format: "es" },
      { file: pkg.main, format: "cjs" }
    ]
  }),
  createConfig({
    output: { file: "dist/perfume.es5.min.js", name: "perfume", format: "es" },
    min: true
  }),
  createConfig({
    output: { file: "dist/perfume.min.js", name: "perfume", format: "cjs" },
    min: true
  }),
  createConfig({
    output: { file: pkg.iife, name: "perfume", format: "iife" },
    includeExternals: true
  }),
  createConfig({
    output: { file: pkg.iife, name: "perfume", format: "iife" },
    includeExternals: true
  }),
  createConfig({
    output: { file: "dist/perfume.iife.min.js", name: "perfume", format: "iife" },
    includeExternals: true,
    min: true
  }),
  createConfig({
    output: { file: pkg.unpkg, name: "perfume.umd", format: "umd" },
    includeExternals: true,
  }),
  createConfig({
    output: { file: "dist/perfume.umd.min.js", name: "perfume.umd", format: "umd" },
    includeExternals: true,
    min: true
  })
];
