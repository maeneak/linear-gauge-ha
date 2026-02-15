import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

export default {
  input: 'src/linear-gauge-card.ts',
  output: {
    file: 'dist/linear-gauge-card.js',
    format: 'es',
    sourcemap: false,
  },
  plugins: [
    resolve(),
    typescript(),
    json(),
    terser({
      format: {
        comments: false,
      },
    }),
  ],
};
