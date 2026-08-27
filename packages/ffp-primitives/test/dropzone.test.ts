import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createDropzone, matchesAccept, type DropzoneHandle } from '../src/dropzone'
import { fire } from './setup'

let zone: DropzoneHandle | null = null
let revoked: string[] = []

/**
 * linkedom has neither `File` nor `URL.createObjectURL`. The shapes below are
 * the parts the dropzone touches - name, type, size - and the object-URL stubs
 * are what let the leak test observe a revoke.
 */
function file(name: string, type = 'image/png', size = 1024): File {
    return { name, type, size } as unknown as File
}

beforeEach(() => {
    revoked = []
    const g = globalThis as unknown as { URL: { createObjectURL: unknown; revokeObjectURL: unknown } }
    g.URL = {
        createObjectURL: (f: File) => `blob:${f.name}`,
        revokeObjectURL: (url: string) => revoked.push(url),
    } as never
})

function build(over: Partial<Parameters<typeof createDropzone>[0]> = {}) {
    const onChange = vi.fn()
    const element = document.createElement('div')
    element.id = 'dz'
    document.body.appendChild(element)
    zone = createDropzone({
        element,
        maxFiles: 3,
        maxFileSizeMb: 5,
        accept: null,
        onChange,
        ...over,
    })
    return { onChange, element }
}

const picker = () => document.querySelector('.ffp-dz-input') as HTMLInputElement
const previews = () => Array.from(document.querySelectorAll('.dz-preview'))
const filenames = () => Array.from(document.querySelectorAll('.dz-filename')).map((n) => n.textContent)
const message = () => document.querySelector('.dz-message') as HTMLElement

/** The picker's `files` is read-only in the platform; assign the shape. */
function choose(files: File[]): void {
    Object.defineProperty(picker(), 'files', { value: files, configurable: true })
    fire(picker(), 'change')
}

afterEach(() => {
    if (zone) zone.destroy()
    zone = null
    document.body.innerHTML = ''
})

describe('markup', () => {
    it('keeps the class names customers have styled for years', () => {
        const { element } = build()
        expect(element.classList.contains('dropzone')).toBe(true)
        expect(message()).not.toBeNull()
        expect(document.querySelector('.dz-message-content')).not.toBeNull()
        expect(document.querySelector('.dz-message-link')).not.toBeNull()
    })

    it('colours the message from data-default-color', () => {
        build({ messageColor: '#ff0000' })
        expect((document.querySelector('.dz-message-link') as HTMLElement).style.color).toBe('#ff0000')
    })

    it('offers multiple selection only when more than one file is allowed', () => {
        build({ maxFiles: 1 })
        expect(picker().multiple).toBe(false)
        zone!.destroy()
        document.body.innerHTML = ''
        build({ maxFiles: 3 })
        expect(picker().multiple).toBe(true)
    })
})

describe('accepting files', () => {
    it('adds files and previews them', () => {
        const { onChange } = build()
        choose([file('a.png'), file('b.png')])
        expect(filenames()).toEqual(['a.png', 'b.png'])
        expect(onChange).toHaveBeenLastCalledWith([expect.objectContaining({ name: 'a.png' }), expect.anything()])
    })

    it('stops at maxFiles', () => {
        build({ maxFiles: 1 })
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        choose([file('a.png'), file('b.png')])
        expect(filenames()).toEqual(['a.png'])
        expect(warn).toHaveBeenCalled()
        warn.mockRestore()
    })

    it('hides the prompt once it is full', () => {
        build({ maxFiles: 1 })
        choose([file('a.png')])
        expect(message().style.display).toBe('none')
    })

    it('rejects a file over the size limit before it is added', () => {
        // 5.1.5 added it and removed it on the next tick, so the visitor saw a
        // preview flash up and vanish.
        build({ maxFileSizeMb: 1 })
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        choose([file('big.png', 'image/png', 2 * 1024 * 1024)])
        expect(previews().length).toBe(0)
        expect(String(warn.mock.calls[0][0])).toContain('exceeds size limit')
        warn.mockRestore()
    })

    it('rejects a type the field does not accept', () => {
        build({ accept: '.png,image/gif' })
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        choose([file('doc.pdf', 'application/pdf')])
        expect(previews().length).toBe(0)
        warn.mockRestore()
    })

    it('takes files from a drop', () => {
        const { onChange } = build()
        const event = fire(document.querySelector('.dropzone')!, 'drop', {
            dataTransfer: { files: [file('dropped.png')] },
            preventDefault() {},
        })
        expect(filenames()).toEqual(['dropped.png'])
        expect(onChange).toHaveBeenCalled()
        expect(event).toBeDefined()
    })

    it('clears the picker so the same file can be chosen twice', () => {
        build()
        choose([file('a.png')])
        expect(picker().value).toBe('')
    })
})

describe('removing files', () => {
    it('removes one and reports the rest', () => {
        const { onChange } = build()
        choose([file('a.png'), file('b.png')])
        ;(document.querySelectorAll('.dz-remove')[0] as HTMLElement).click()
        expect(filenames()).toEqual(['b.png'])
        expect(onChange).toHaveBeenLastCalledWith([expect.objectContaining({ name: 'b.png' })])
    })

    it('revokes the object URL, so the bytes are not held for the page lifetime', () => {
        // 5.1.5 previewed with data URLs Dropzone kept: a 5 MB image leaked
        // 5 MB that never came back.
        build()
        choose([file('a.png')])
        ;(document.querySelector('.dz-remove') as HTMLElement).click()
        expect(revoked).toEqual(['blob:a.png'])
    })

    it('revokes everything on destroy', () => {
        build()
        choose([file('a.png'), file('b.png')])
        zone!.destroy()
        zone = null
        expect(revoked.sort()).toEqual(['blob:a.png', 'blob:b.png'])
    })

    it('does not open the picker when the remove link is clicked', () => {
        build()
        choose([file('a.png')])
        const opened = vi.fn()
        picker().click = opened
        ;(document.querySelector('.dz-remove') as HTMLElement).click()
        expect(opened).not.toHaveBeenCalled()
    })
})

describe('matchesAccept', () => {
    it('matches extensions, wildcards and exact types', () => {
        expect(matchesAccept(file('a.PNG', 'image/png'), '.png')).toBe(true)
        expect(matchesAccept(file('a.pdf', 'application/pdf'), '.png')).toBe(false)
        expect(matchesAccept(file('a.png', 'image/png'), 'image/*')).toBe(true)
        expect(matchesAccept(file('a.png', 'image/png'), 'application/pdf')).toBe(false)
        expect(matchesAccept(file('a.png', 'image/png'), 'application/pdf,.png')).toBe(true)
    })

    it('accepts anything with no rule', () => {
        expect(matchesAccept(file('a.exe', ''), null)).toBe(true)
        expect(matchesAccept(file('a.exe', ''), '')).toBe(true)
    })
})
