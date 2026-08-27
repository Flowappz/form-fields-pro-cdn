import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        // Same choice as core: linkedom, not jsdom. These primitives are DOM
        // structure, event wiring and arithmetic - none of it needs a layout
        // engine, and `computePosition` is pure precisely so that stays true.
        setupFiles: ['./test/setup.ts'],
    },
})
