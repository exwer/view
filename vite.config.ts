import { defineConfig } from 'vite'

export default defineConfig({
  build: {
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
