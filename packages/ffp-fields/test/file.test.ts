import type { FfpFieldConfigV2 } from '@flowappz/ffp-config'
import type { ChunkApi } from '@flowappz/ffp-core/src/chunk-api'
import type { FieldDefinition, FieldInstance } from '@flowappz/ffp-core/src/registry'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fakeApi, fire, resetDom } from './setup'

type Registered = (api: ChunkApi) => void

/**
 * linkedom has no `File`, `FileReader` or object URLs. These stand in for the
 * three the field actually touches, so the contract under test - what ends up
 * in the hidden input - is the real code path.
 */
function file(name: string, type = 'image/png', size = 1024): File {
    return { name, type, size } as unknown as File
}

function installFileStubs(): void {
    const g = globalThis as unknown as Record<string, unknown>
    g.URL = { createObjectURL: (f: File) => `blob:${f.name}`, revokeObjectURL: () => {} }
    g.FileReader = class {
        result: string | null = null
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        readAsDataURL(f: File) {
            this.result = `data:${f.type};base64,${f.name}`
            setTimeout(() => this.onload && this.onload(), 0)
        }
    }
}

async function loadChunk(): Promise<FieldDefinition<FfpFieldConfigV2>> {
    const registered: Record<string, Registered> = {}
    const w = globalThis.window as unknown as { __ffpDefine?: (k: string, f: Registered) => void }
    w.__ffpDefine = (key, factory) => {
        registered[key] = factory
    }
    vi.resetModules()
    await import('../src/file/index')

    let definition: FieldDefinition<FfpFieldConfigV2> | null = null
    const api = fakeApi()
    api.defineField = (d) => {
        definition = d as FieldDefinition<FfpFieldConfigV2>
    }
    registered.file(api)
    if (!definition) throw new Error('file chunk registered no field')
    return definition
}

const MARKUP = (attrs = '') => `<body><form><div form-fields-wrapper="true">
  <div class="dropzone" id="upload-1" name="Attachment" ${attrs}></div>
</div></form></body>`

let mounted: FieldInstance | null = null

async function mount(html: string): Promise<HTMLElement> {
    resetDom(html)
    installFileStubs()
    const definition = await loadChunk()
    const zone = document.querySelector('.dropzone') as HTMLElement
    mounted = definition.mount(zone, definition.parse!(zone), { form: null, version: 'test' })
    return zone
}

const hidden = () => document.querySelector('input[data-ffp-upload-for]') as HTMLInputElement
const picker = () => document.querySelector('.ffp-dz-input') as HTMLInputElement

function choose(files: File[]): void {
    Object.defineProperty(picker(), 'files', { value: files, configurable: true })
    fire(picker(), 'change')
}

/** Wait for the serialised encode chain the field exposes to core. */
async function settle(zone: HTMLElement): Promise<void> {
    await (zone as HTMLElement & { _ffpAwaitUploads?: () => Promise<void> })._ffpAwaitUploads!()
}

afterEach(() => {
    if (mounted) mounted.destroy()
    mounted = null
})

describe('the hidden input', () => {
    it('is created with the exact shape core reads', async () => {
        // `getFormFieldsInputData` finds it by `form-fields-data-input`, and the
        // payload key comes from `name`. Both are contracts, not details.
        await mount(MARKUP())
        const input = hidden()
        expect(input.type).toBe('hidden')
        expect(input.getAttribute('name')).toBe('Attachment')
        expect(input.getAttribute('form-fields-data-input')).toBe('true')
        expect(input.getAttribute('data-ffp-upload-for')).toBe('upload-1')
    })

    it('falls back through name, data-name, then id', async () => {
        resetDom(`<body><form><div class="dropzone" id="upload-2" data-name="CV"></div></form></body>`)
        installFileStubs()
        let definition = await loadChunk()
        let zone = document.querySelector('.dropzone') as HTMLElement
        let instance = definition.mount(zone, definition.parse!(zone), { form: null, version: 'test' })
        expect(hidden().getAttribute('name')).toBe('CV')
        instance.destroy()

        resetDom(`<body><form><div class="dropzone" id="upload-3"></div></form></body>`)
        installFileStubs()
        definition = await loadChunk()
        zone = document.querySelector('.dropzone') as HTMLElement
        instance = definition.mount(zone, definition.parse!(zone), { form: null, version: 'test' })
        expect(hidden().getAttribute('name')).toBe('upload-3')
        instance.destroy()
    })

    it('works for a dropzone with no id at all', async () => {
        // 5.1.5 mapped over element ids and skipped `undefined`, so this field
        // silently never uploaded anything.
        resetDom(`<body><form><div class="dropzone" name="Attachment"></div></form></body>`)
        installFileStubs()
        const definition = await loadChunk()
        const zone = document.querySelector('.dropzone') as HTMLElement
        const instance = definition.mount(zone, definition.parse!(zone), { form: null, version: 'test' })
        expect(hidden()).not.toBeNull()
        expect(zone.id).toBeTruthy()
        instance.destroy()
    })

    it('moves required off the dropzone and onto the value it can check', async () => {
        // `validateRequiredFields` cannot check a div. Leaving `required` where
        // it was would block every submission of a form with a file field.
        const zone = await mount(MARKUP('required'))
        expect(zone.hasAttribute('required')).toBe(false)
        expect(hidden().getAttribute('required')).toBe('required')
    })

    it('reuses an existing hidden input rather than adding a second', async () => {
        const zone = await mount(MARKUP())
        const definition = await loadChunk()
        const second = definition.mount(zone, definition.parse!(zone), { form: null, version: 'test' })
        expect(document.querySelectorAll('input[data-ffp-upload-for]').length).toBe(1)
        second.destroy()
    })
})

describe('encoding', () => {
    it('writes the exact JSON shape 5.1.5 wrote', async () => {
        const zone = await mount(MARKUP())
        choose([file('a.png')])
        await settle(zone)

        expect(JSON.parse(hidden().value)).toEqual([
            { name: 'a.png', type: 'image/png', size: 1024, dataUrl: 'data:image/png;base64,a.png' },
        ])
    })

    it('is empty, not "[]", when every file is gone', async () => {
        // `validateRequiredFields` treats '', '[]' and 'null' as empty; the
        // payload should not carry an empty array for a field nobody filled in.
        const zone = await mount(MARKUP())
        choose([file('a.png')])
        await settle(zone)
        ;(document.querySelector('.dz-remove') as HTMLElement).click()
        await settle(zone)

        expect(hidden().value).toBe('')
    })

    it('announces the value, so conditional logic sees it', async () => {
        const zone = await mount(MARKUP())
        const onChange = vi.fn()
        hidden().addEventListener('change', onChange)
        choose([file('a.png')])
        await settle(zone)
        expect(onChange).toHaveBeenCalled()
    })

    it('serialises overlapping syncs so the last write is the current list', async () => {
        const zone = await mount(MARKUP('data-max-files="3"'))
        choose([file('a.png')])
        choose([file('b.png')])
        await settle(zone)
        expect(JSON.parse(hidden().value).map((f: { name: string }) => f.name)).toEqual(['a.png', 'b.png'])
    })

    it('keeps files under the data-URL cap and rejects the rest', async () => {
        // 5.1.5 capped the raw file at min(limit, 5) MB before FileReader,
        // because a data URL is ~33% larger than the file it encodes.
        const zone = await mount(MARKUP('data-max-file-size="10"'))
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        choose([file('big.png', 'image/png', 6 * 1024 * 1024)])
        await settle(zone)
        expect(hidden().value).toBe('')
        expect(warn).toHaveBeenCalled()
        warn.mockRestore()
    })
})

describe('the await contract', () => {
    it('exposes _ffpAwaitUploads under the name core waits on', async () => {
        // `waitForPendingFileUploads` in core looks for exactly this. The moment
        // it stops being here, forms submit with an empty attachment field.
        const zone = await mount(MARKUP()) as HTMLElement & { _ffpAwaitUploads?: () => Promise<void> }
        expect(typeof zone._ffpAwaitUploads).toBe('function')
    })

    it('does not resolve before the encode has landed', async () => {
        const zone = await mount(MARKUP()) as HTMLElement & { _ffpAwaitUploads?: () => Promise<void> }
        choose([file('a.png')])
        expect(hidden().value).toBe('')
        await zone._ffpAwaitUploads!()
        expect(hidden().value).not.toBe('')
    })

    it('is removed on destroy', async () => {
        const zone = (await mount(MARKUP())) as HTMLElement & { _ffpAwaitUploads?: () => Promise<void> }
        mounted!.destroy()
        mounted = null
        expect(zone._ffpAwaitUploads).toBeUndefined()
    })
})

describe('options', () => {
    it('defaults to one file and 5 MB', async () => {
        await mount(MARKUP())
        expect(picker().multiple).toBe(false)
    })

    it('passes the accepted types to the picker', async () => {
        await mount(MARKUP('data-accepted-files=".pdf,.png"'))
        expect(picker().accept).toBe('.pdf,.png')
    })
})
