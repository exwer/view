import { defineConfig } from 'vite'

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
    },
  },
})
