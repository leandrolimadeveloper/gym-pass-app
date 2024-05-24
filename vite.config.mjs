import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        environmentMatchGlobs: [['./src/http/controllers/**', './src/vitest-environments/prisma.ts']],
        dir: 'src'
    }
})
