import type { FfpFieldConfigV2, FieldType } from '@flowappz/ffp-config'
import type { FieldDefinition } from './registry'

/**
 * What core hands a chunk when it runs.
 *
 * Chunks never import core: that would bundle the registry, the loader and the
 * config reader into every chunk and defeat the whole split. They receive this
 * object instead, which is also the only channel for the release-time
 * placeholders - a chunk that read `__FFP_DATA_CLIENT_URL__` directly would
 * either ship the raw token or spread the submission secret across more
 * immutable public objects. `scripts/build.mjs` fails the build if one tries.
 */
export type ChunkApi = {
    version: string
    /** Substituted into core only, forwarded here. */
    config: {
        dataClientUrl: string
        licenseUrl: string
    }
    defineField<C = FfpFieldConfigV2>(definition: FieldDefinition<C>): void
    /** Normalized config for an element, so chunks need no parser of their own. */
    readFieldConfig(el: Element, type: FieldType): FfpFieldConfigV2
    /** Shared DOM and theming helpers, so chunks do not re-bundle them. */
    dom: {
        h: typeof import('./dom').h
        on: typeof import('./dom').on
        delegate: typeof import('./dom').delegate
        injectStyle: typeof import('./dom').injectStyle
    }
    /**
     * Hand core the ISO-to-dial-code map. Only the phone chunk calls this.
     *
     * Core validates and normalises phone values - both run on forms whose phone
     * widget may never have mounted - but the 252-country table it would need to
     * do that alone is 6 kB that would then ship to every visitor of every site.
     * The chunk that carries the table registers it instead.
     */
    registerDialCodes: typeof import('./phone-value').registerDialCodes
    theme: {
        applyTheme: typeof import('./theme').applyTheme
        schemeResolverCss: typeof import('./theme').schemeResolverCss
        tokenToVar: typeof import('./theme').tokenToVar
    }
}
