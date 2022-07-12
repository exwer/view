import { defineConfig } from 'vite'
import ts from 'rollup-plugin-typescript2'

export default defineConfig({
  build: {
    watch: {},
    lib: {
      entry: './src/index.ts',
      formats: [
        'cjs',
        'es',
      ],
    },
    rollupOptions: {
      output: {
        dir: './lib',
      },
      plugins: [
        ts({
          check: false,
          tsconfig: './tsconfig.json',
          tsconfigOverride: {
            compilerOptions: {
              target: 'es2015',
              declaration: true,
              declarationMap: true,
            },
          },
        }),
      ],
    },
  },
})
