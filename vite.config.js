import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { resolve } from 'path'
import fs from 'fs'

// Check if there's a main.ts file in the src directory root
const rootMainFile = fs.existsSync(resolve(__dirname, 'src/form-fields-pro-cdn.js')) ? { root: resolve(__dirname, 'src/form-fields-pro-cdn.js') } : {}

// Gather versioned folders in src directory
const versionFolders = fs
    .readdirSync(resolve(__dirname, 'src'), { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

export default defineConfig({
    plugins: [cssInjectedByJsPlugin()],
    build: {
        target: 'es2015',
        rollupOptions: {
            // Combine root main file (if it exists) with versioned folders as inputs
            input: {
                ...rootMainFile,
                ...Object.fromEntries(versionFolders.map((version) => [version, resolve(__dirname, `src/${version}/form-fields-pro-cdn.js`)])),
            },
            output: {
                entryFileNames: ({ name }) => (name === 'root' ? 'form-fields-pro-cdn.js' : `${name}/form-fields-pro-cdn.js`),
                manualChunks: undefined,
                dir: resolve(__dirname, 'dist'),
            },
        },
        sourcemap: false,
        minify: 'terser',
    },
})
