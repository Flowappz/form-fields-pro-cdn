/**
 * File drop area. Replaces Dropzone 5.
 *
 * Dropzone was pinned for its CSS (5.9.3) and floating for its JS (`@5`) - two
 * different versions of the same library, one of which could move under us. It
 * also brought an upload pipeline we never used: `autoProcessQueue` was off and
 * `url` was `'#'`, because the files are read with `FileReader` and posted
 * inside the form payload. All that was ever consumed was the picker, the
 * previews and the remove links.
 *
 * Class names are kept exactly - `.dz-message`, `.dz-preview`, `.dz-image`,
 * `.dz-remove` - because customers have styled them in the Designer for years,
 * and 5.1.5 shipped a block of overrides against them.
 *
 * Thumbnails use `URL.createObjectURL` and are **revoked on remove**. 5.1.5
 * previewed with data URLs held by Dropzone, so every added file leaked its own
 * bytes for the lifetime of the page - on a 5 MB image that is 5 MB that never
 * comes back.
 */

export type DropzoneOptions = {
    element: HTMLElement
    maxFiles: number
    maxFileSizeMb: number
    /** Dropzone's `acceptedFiles`: `.png,.jpg,image/*`. Null accepts anything. */
    accept: string | null
    /** Colour for the message icon and link, from `data-default-color`. */
    messageColor?: string | null
    onChange(files: File[]): void
}

export type DropzoneHandle = {
    files(): File[]
    setFiles(files: File[]): void
    destroy(): void
}

export const DROPZONE_CSS = `
.dropzone{background-color:transparent!important;position:relative;cursor:pointer}
.dropzone.ffp-dz-over{outline:2px dashed var(--ffp-slider-color,#146ef5);outline-offset:-4px}
.dropzone .dz-message{margin:0}
.dz-message-content{margin:0;display:flex;align-items:center;justify-content:center;gap:5px}
.dz-message-link{text-decoration:underline}
.dropzone .dz-preview.dz-image-preview{background-color:transparent}
.dropzone .dz-preview{display:inline-flex;align-items:center;gap:8px;margin:8px 8px 0 0;font-size:12px;vertical-align:top}
.dropzone .dz-image{width:40px;height:40px;overflow:hidden;border-radius:6px;background:rgba(0,0,0,.06);flex:none}
.dropzone .dz-image img{width:100%;height:100%;object-fit:cover;display:block}
.dropzone .dz-details{min-width:0}
.dropzone .dz-filename{display:block;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dropzone .dz-size{opacity:.6}
.dropzone .dz-preview .dz-remove{color:#000;text-decoration:none;background:none;border:0;font:inherit;cursor:pointer;padding:0 4px}
.ffp-dz-input{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0}
`

/** The upload glyph 5.1.5 injected into `.dz-message`, unchanged. */
const UPLOAD_ICON =
    '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M518.3 459a8 8 0 0 0-12.6 0l-112 141.7a7.98 7.98 0 0 0 6.3 12.9h73.9V856c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V613.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 459z"></path><path d="M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7-23.5-24.2-36-56.8-34.9-90.6.9-26.4 9.9-51.2 26.2-72.1 16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4a245.6 245.6 0 0 1 52.4-49.9c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10C846.1 454.5 884 503.8 884 560c0 33.1-12.9 64.3-36.3 87.7a123.07 123.07 0 0 1-87.6 36.3H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h40.1C870.5 760 960 670.5 960 560c0-92.7-63.1-170.7-148.6-193.3z"></path></svg>'

/** Dropzone's `acceptedFiles` grammar: extensions and mime types, wildcards. */
export function matchesAccept(file: File, accept: string | null): boolean {
    if (!accept) return true
    const name = String(file.name || '').toLowerCase()
    const type = String(file.type || '').toLowerCase()
    return accept
        .split(',')
        .map((part) => part.trim().toLowerCase())
        .filter(Boolean)
        .some((rule) => {
            if (rule.charAt(0) === '.') return name.slice(-rule.length) === rule
            if (rule.slice(-2) === '/*') return type.indexOf(rule.slice(0, -1)) === 0
            return type === rule
        })
}

const IMAGE = /^image\//

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function createDropzone(options: DropzoneOptions): DropzoneHandle {
    const root = options.element
    const maxBytes = options.maxFileSizeMb * 1024 * 1024
    let files: File[] = []
    /** Object URLs handed out for previews, so they can be revoked. */
    const urls = new Map<File, string>()

    root.classList.add('dropzone')

    const message = document.createElement('div')
    message.className = 'dz-message'
    message.innerHTML = `<p class="dz-message-content">${UPLOAD_ICON}  Drag and Drop or <span class="dz-message-link">Browse file</span> </p>`
    if (options.messageColor) {
        const icon = message.querySelector('svg') as HTMLElement | null
        const link = message.querySelector('.dz-message-link') as HTMLElement | null
        if (icon) icon.style.color = options.messageColor
        if (link) link.style.color = options.messageColor
    }

    const previews = document.createElement('div')
    previews.className = 'ffp-dz-previews'

    const picker = document.createElement('input')
    picker.type = 'file'
    picker.className = 'ffp-dz-input'
    if (options.maxFiles > 1) picker.multiple = true
    if (options.accept) picker.accept = options.accept
    // Not `hidden` and not `display:none`: a file input the browser will not
    // render is one it will not open from a script click in Safari.
    picker.tabIndex = -1

    root.appendChild(message)
    root.appendChild(previews)
    root.appendChild(picker)

    function renderPreviews(): void {
        previews.textContent = ''
        for (const file of files) {
            const preview = document.createElement('div')
            preview.className = 'dz-preview dz-image-preview'

            const image = document.createElement('div')
            image.className = 'dz-image'
            if (IMAGE.test(file.type)) {
                const url = URL.createObjectURL(file)
                urls.set(file, url)
                const img = document.createElement('img')
                img.src = url
                img.alt = file.name
                image.appendChild(img)
            }

            const details = document.createElement('div')
            details.className = 'dz-details'
            const filename = document.createElement('span')
            filename.className = 'dz-filename'
            filename.textContent = file.name
            const size = document.createElement('span')
            size.className = 'dz-size'
            size.textContent = formatSize(file.size)
            details.appendChild(filename)
            details.appendChild(size)

            const remove = document.createElement('button')
            remove.type = 'button'
            remove.className = 'dz-remove'
            remove.textContent = 'Remove file'
            remove.addEventListener('click', (event) => {
                event.preventDefault()
                event.stopPropagation()
                drop(file)
            })

            preview.appendChild(image)
            preview.appendChild(details)
            preview.appendChild(remove)
            previews.appendChild(preview)
        }
        message.style.display = files.length >= options.maxFiles ? 'none' : ''
    }

    function release(file: File): void {
        const url = urls.get(file)
        if (!url) return
        URL.revokeObjectURL(url)
        urls.delete(file)
    }

    function drop(file: File): void {
        const index = files.indexOf(file)
        if (index === -1) return
        files.splice(index, 1)
        release(file)
        renderPreviews()
        options.onChange(files.slice())
    }

    function accept(incoming: FileList | File[] | null): void {
        if (!incoming) return
        let added = false
        for (const file of Array.from(incoming)) {
            if (files.length >= options.maxFiles) {
                console.warn(`Form Fields Pro: at most ${options.maxFiles} file(s) — "${file.name}" ignored.`)
                continue
            }
            if (!matchesAccept(file, options.accept)) {
                console.warn(`Form Fields Pro: "${file.name}" is not an accepted file type.`)
                continue
            }
            if (file.size > maxBytes) {
                console.warn(
                    `Form Fields Pro: File "${file.name}" exceeds size limit — removed before encoding.`,
                )
                continue
            }
            files.push(file)
            added = true
        }
        if (!added) return
        renderPreviews()
        options.onChange(files.slice())
    }

    const onPick = () => {
        accept(picker.files)
        // Reset, or picking the same file twice in a row fires nothing.
        picker.value = ''
    }
    const onClick = (event: Event) => {
        const target = event.target as HTMLElement | null
        if (target && target.closest && target.closest('.dz-remove')) return
        picker.click()
    }
    const onDragOver = (event: Event) => {
        event.preventDefault()
        root.classList.add('ffp-dz-over')
    }
    const onDragLeave = () => root.classList.remove('ffp-dz-over')
    const onDrop = (event: Event) => {
        event.preventDefault()
        root.classList.remove('ffp-dz-over')
        const transfer = (event as DragEvent).dataTransfer
        accept(transfer ? transfer.files : null)
    }

    picker.addEventListener('change', onPick)
    root.addEventListener('click', onClick)
    root.addEventListener('dragover', onDragOver)
    root.addEventListener('dragleave', onDragLeave)
    root.addEventListener('drop', onDrop)

    renderPreviews()

    return {
        files: () => files.slice(),
        setFiles(next) {
            for (const file of files) release(file)
            files = next.slice()
            renderPreviews()
            options.onChange(files.slice())
        },
        destroy() {
            for (const file of files) release(file)
            picker.removeEventListener('change', onPick)
            root.removeEventListener('click', onClick)
            root.removeEventListener('dragover', onDragOver)
            root.removeEventListener('dragleave', onDragLeave)
            root.removeEventListener('drop', onDrop)
            message.remove()
            previews.remove()
            picker.remove()
        },
    }
}
