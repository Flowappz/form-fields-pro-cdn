/**
 * The chunk manifest, embedded into core at build time.
 *
 * Not fetched. Core is built last, after every chunk has been hashed, so the
 * URLs and sha384 digests below are literals inside the bundle whose own sha384
 * Webflow pins in the registered script tag. That gives one unbroken chain of
 * trust with no extra round trip and nothing for a network attacker to swap:
 *
 *   Webflow's <script integrity> -> core bytes -> manifest literals -> chunk bytes
 *
 * `scripts/build.mjs` overwrites `manifest.generated.ts`. The checked-in version
 * is an empty stub so the package type-checks on a clean tree.
 */
export type ChunkEntry = {
    /** Absolute, content-addressed R2 URL. Never mutated once published. */
    url: string
    /** `sha384-<base64>`, in the format the integrity attribute expects. */
    integrity: string
    /** Shared chunks this one needs loaded first, by key. */
    deps?: string[]
    /** Uncompressed byte length, for the debug report and the budget gate. */
    bytes?: number
}

export type ChunkManifest = Record<string, ChunkEntry>
