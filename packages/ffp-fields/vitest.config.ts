import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        // Field chunks are DOM wiring. linkedom, like core and the primitives.
        setupFiles: ['./test/setup.ts'],
    },
})
