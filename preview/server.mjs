/**
 * Local preview of the real built bundle.
 *
 * Serves `build/<version>/` under the exact key layout R2 uses -
 * `/{APP_SLUG}/{NODE_ENV}/{version}/chunks/<file>` - so core's baked-in chunk
 * URLs resolve without patching anything after the build. The bytes served are
 * the bytes that would be uploaded, SRI hashes included, which is the point: a
 * preview that rewrites the bundle proves nothing about the bundle.
 *
 * What this canNOT stand in for: Webflow's own markup, its jQuery, its
 * `.w-form-done` machinery and the registered-script injection path. Those need
 * a published site. See packages/README.md.
 */
import { createReadStream, existsSync, readdirSync, statSync } from 'fs'
import { createServer } from 'http'
import { dirname, extname, join, resolve } from 'path'
import { fileURLToPath } from 'url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = Number(process.env.PREVIEW_PORT || 4599)

function latestBuild() {
    const dir = resolve(ROOT, 'build')
    if (!existsSync(dir)) return null
    const dirs = readdirSync(dir, { withFileTypes: true })
        .filter((d) => d.isDirectory() && existsSync(resolve(dir, d.name, 'build-manifest.json')))
        .map((d) => resolve(dir, d.name))
        .sort((a, b) => statSync(a).mtimeMs - statSync(b).mtimeMs)
    return dirs[dirs.length - 1] || null
}

const buildDir = latestBuild()
if (!buildDir) {
    console.error('✗ No build/. Run: NODE_ENV=staging APP_SLUG=form-fields-pro R2_PUBLIC_URL=http://localhost:' + PORT + ' pnpm build')
    process.exit(1)
}

const TYPES = { '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.json': 'application/json' }

createServer((req, res) => {
    const path = decodeURIComponent((req.url || '/').split('?')[0])

    // Anything ending in /chunks/<file> or the core script maps into the build.
    const chunk = path.match(/\/chunks\/([^/]+)$/)
    const core = path.match(/\/([^/]*form-fields-pro-cdn[^/]*\.js)$/)
    let file = null
    if (chunk) file = join(buildDir, 'chunks', chunk[1])
    else if (core) file = join(buildDir, core[1])
    else file = join(ROOT, 'preview', path === '/' ? 'index.html' : path.replace(/^\//, ''))

    if (!existsSync(file) || statSync(file).isDirectory()) {
        res.writeHead(404, { 'content-type': 'text/plain' })
        res.end('not found: ' + path)
        return
    }

    res.writeHead(200, {
        'content-type': TYPES[extname(file)] || 'application/octet-stream',
        // R2 serves this, and `crossorigin="anonymous"` on the chunk tags means
        // the integrity check needs it.
        'access-control-allow-origin': '*',
        'cache-control': 'no-store',
    })
    createReadStream(file).pipe(res)
}).listen(PORT, () => {
    console.log(`preview: http://localhost:${PORT}/  (serving ${buildDir})`)
})
