import ts from '@rollup/plugin-typescript'
export default {
  input: './src/index.ts',
  output: [
    {
      file: 'lib/view.esm.js',
      format: 'es'
    },
    {
      file: 'lib/view.cjs.js',
      format: 'cjs'
    }
  ],
  plugins: [ts()]
}
