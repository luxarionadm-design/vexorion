import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/vexorion.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs()
    ],
    external: []
  },
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
      terser()
    ],
    external: []
  },
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
      commonjs()
    ],
    external: []
  }
];
