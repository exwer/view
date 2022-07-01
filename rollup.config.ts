import typescript from '@rollup/plugin-typescript'
export default {
  input: './src/index.ts',
  output: [
    {
      format: 'cjs',
      file: 'lib/view.cjs.js',
    },
    {
      format: 'es',
      file: 'lib/view.esm.js',
    },
  ],
  plugins: [
    typescript(),
  ],
}
