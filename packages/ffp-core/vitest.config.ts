import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        // linkedom rather than jsdom: core touches querySelector, closest,
        // attributes and one MutationObserver. A full browser environment adds
        // seconds per run and buys nothing these tests assert on.
        setupFiles: ['./test/setup.ts'],
    },
})
