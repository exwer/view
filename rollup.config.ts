import ts from '@rollup/plugin-typescript'
export default {
  input: './src/index.ts',
  output: [
    {
      file: 'lib/index.mjs',
      format: 'es'
    },
    {
      file: 'lib/index.cjs',
      format: 'cjs'
    }
  ],
  plugins: [ts()]
}
