import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';

export default [
  // ESM Build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/vexorion.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env']
      })
    ],
    external: []
  },
  // Minified ESM Build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/vexorion.min.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env']
      }),
      terser()
    ],
    external: []
  },
  // UMD Build (for browser)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/vexorion.umd.js',
      format: 'umd',
      name: 'Vexorion',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env']
      })
    ],
    external: []
  }
];
