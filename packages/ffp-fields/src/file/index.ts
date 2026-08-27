/**
 * `file` chunk - phase 3. Dropzone is gone.
 *
 * Dropzone was loaded as CSS pinned to 5.9.3 and JS floating on `@5` - two
 * versions of one library, one of which could move under us - and none of its
 * upload pipeline was used: `autoProcessQueue` was off and `url` was `'#'`,
 * because files ride inside the form payload as data URLs.
 *
 * **Everything below the picker is byte-identical to 5.1.5 on purpose.** The
 * hidden input's name, its `form-fields-data-input` marker, the relocation of
 * `required` onto it, the exact JSON shape of the encoded array, the empty-value
 * spellings, and `_ffpAwaitUploads` are all contracts other code depends on:
 * `validateRequiredFields` reads the empty spellings, `getFormFieldsInputData`
 * reads the marker, and `waitForPendingFileUploads` awaits the promise. Change
 * one of them and a customer silently loses attachments with no error anywhere.
 *
 * Two deliberate differences:
 *
 * 1. A `.dropzone` **without an `id`** now works. 5.1.5 mapped over element ids
 *    and skipped `undefined`, so such a field silently never uploaded anything.
 * 2. An oversized file is rejected before it is added, rather than added and
 *    then removed on the next tick - same warning, no flash of a preview.
 */
import type { FfpFieldConfigV2 } from '@flowappz/ffp-config'
import type { ChunkApi, FieldInstance, MountContext } from '@flowappz/ffp-core'
import { createDropzone, DROPZONE_CSS, type DropzoneHandle } from '@flowappz/ffp-primitives/src/dropzone'

type FileOptions = {
    maxFiles: number
    maxFileSizeMb: number
    acceptedFiles: string | null
}

type EncodedFile = {
    name: string
    type?: string
    size?: number
    dataUrl?: string | ArrayBuffer | null
    error?: string
}

type AwaitingElement = HTMLElement & { _ffpAwaitUploads?: () => Promise<void> }

let seq = 0

function mountFile(el: Element, config: FfpFieldConfigV2, api: ChunkApi): FieldInstance {
    const root = el as AwaitingElement
    const parent = root.parentElement
    if (!parent) return { destroy() {} }

    api.dom.injectStyle('ffp-dropzone', DROPZONE_CSS)

    const options = config.options as unknown as FileOptions
    const maxFiles = options.maxFiles
    const maxFilesizeMb = options.maxFileSizeMb
    // Raw file cap before FileReader - data URLs are ~33% larger than the file.
    // 5.1.5 took the smaller of the author's limit and 5 MB; keeping that means
    // the size a visitor is allowed to attach does not change under them.
    const maxDataUrlSourceBytes = Math.min(maxFilesizeMb, 5) * 1024 * 1024

    if (!root.id) root.id = `ffp-dropzone-${++seq}`
    const id = root.id

    const fieldName = root.getAttribute('name') || root.getAttribute('data-name') || id
    let hidden = parent.querySelector(`input[data-ffp-upload-for="${id}"]`) as HTMLInputElement | null
    if (!hidden) {
        hidden = document.createElement('input')
        hidden.type = 'hidden'
        hidden.name = fieldName
        hidden.setAttribute('form-fields-data-input', 'true')
        hidden.setAttribute('data-ffp-upload-for', id)
        // Move `required` onto the value-bearing hidden input, so validation
        // checks the encoded files rather than a div that can never be "filled".
        if (root.hasAttribute('required')) {
            hidden.setAttribute('required', 'required')
            root.removeAttribute('required')
        }
        parent.appendChild(hidden)
    } else if (root.hasAttribute('required') && !hidden.hasAttribute('required')) {
        hidden.setAttribute('required', 'required')
        root.removeAttribute('required')
    }

    let pendingUploadSync: Promise<void> = Promise.resolve()
    let files: File[] = []

    const encode = (file: File): Promise<EncodedFile> =>
        new Promise((resolve) => {
            if (file.size > maxDataUrlSourceBytes) {
                console.warn(
                    `Form Fields Pro: File "${file.name}" exceeds ${maxDataUrlSourceBytes} bytes — skipped.`,
                )
                resolve({ name: file.name, error: 'file_too_large', size: file.size })
                return
            }
            const reader = new FileReader()
            reader.onload = () =>
                resolve({ name: file.name, type: file.type, size: file.size, dataUrl: reader.result })
            reader.onerror = () => resolve({ name: file.name, error: 'read_failed' })
            reader.readAsDataURL(file)
        })

    async function syncFilesToHidden(): Promise<void> {
        const input = hidden as HTMLInputElement
        if (!files.length) {
            setHidden(input, '')
            return
        }
        const encoded = await Promise.all(files.map(encode))
        let value = JSON.stringify(encoded.filter((item) => item && !item.error && item.dataUrl))
        // Both spellings collapse to empty, because `validateRequiredFields`
        // treats `''`, `'[]'` and `'null'` as empty and the payload should not
        // carry an empty array for a field nobody filled in.
        if (!value || value === '[]') value = ''
        setHidden(input, value)
    }

    function setHidden(input: HTMLInputElement, value: string): void {
        if (input.value === value) return
        input.value = value
        // 5.1.5 assigned and left it there for the 450 ms poll to notice.
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
    }

    function queueUploadSync(): Promise<void> {
        // Serialised, never parallel: two overlapping encodes could finish out
        // of order and write the older file list last.
        pendingUploadSync = pendingUploadSync.then(syncFilesToHidden, syncFilesToHidden)
        return pendingUploadSync
    }

    // The contract `waitForPendingFileUploads` in core awaits before it reads
    // the payload. Same name, same shape, deliberately.
    root._ffpAwaitUploads = () => pendingUploadSync

    const zone: DropzoneHandle = createDropzone({
        element: root,
        maxFiles,
        maxFileSizeMb: Math.min(maxFilesizeMb, 5),
        accept: options.acceptedFiles,
        messageColor: root.getAttribute('data-default-color'),
        onChange: (next) => {
            files = next
            void queueUploadSync()
        },
    })

    return {
        destroy() {
            zone.destroy()
            delete root._ffpAwaitUploads
        },
        value: () => (hidden ? hidden.value : ''),
        setValue() {
            // Deliberately inert: a file field's value is the files the visitor
            // chose, and there is no way to hand a `File` back from a string.
        },
    }
}

const define = (window as unknown as { __ffpDefine?: (k: string, f: (api: ChunkApi) => void) => void })
    .__ffpDefine

if (define) {
    define('file', (api: ChunkApi) => {
        api.defineField({
            name: 'file',
            parse: (element) => api.readFieldConfig(element, 'file'),
            mount: (element: Element, config: FfpFieldConfigV2, _ctx: MountContext) =>
                mountFile(element, config, api),
        })
    })
} else {
    console.warn('Form Fields Pro: chunk file loaded without core')
}
