import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.js'),
        name: 'Vexorion',
        fileName: (format) => `vexorion.${format}.js`,
        formats: ['es', 'umd']
      },
      rollupOptions: {
        external: [],
        output: {
          globals: {}
        }
      },
      sourcemap: true,
      minify: 'terser'
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
