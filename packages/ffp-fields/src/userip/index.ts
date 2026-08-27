/**
 * `userip` chunk - phase 5. The last 5.1.5 extract with a network call in it.
 *
 * No vendor was ever involved: the IP comes from our own data client. What
 * changes is shape. 5.1.5 ran one page-level function that hid every admin
 * alert and then filled every IP input from a single fetch. Here each element is
 * a mounted field, and the fetch is one shared promise however many inputs are
 * on the page - the same single request, without the page-level scan.
 *
 * The request is deliberately not awaited by anything: a form that submits
 * before it lands submits with an empty IP, exactly as before. Blocking a
 * submission on a diagnostic field would be the wrong trade.
 */
import type { ChunkApi, FieldInstance, MountContext } from '@flowappz/ffp-core'

const INPUT = '[form-fields-pro-user-ip-input]'

let pending: Promise<string> | null = null

function userIp(dataClientUrl: string): Promise<string> {
    if (pending) return pending
    pending = (async () => {
        try {
            const response = await fetch(`${dataClientUrl}/api/user-ip`)
            if (!response.ok) return ''
            const data = (await response.json()) as { ip?: string }
            return data && data.ip ? String(data.ip) : ''
        } catch (err) {
            console.warn('Form Fields Pro: Failed to collect user IP', err)
            return ''
        }
    })()
    return pending
}

function mountUserIp(el: Element, api: ChunkApi): FieldInstance {
    // The admin alert is the Designer's own "this only fills in on the published
    // site" note. It is hidden on the published site and nowhere else.
    if (!el.matches(INPUT)) {
        const alert = el as HTMLElement
        alert.style.display = 'none'
        return {
            destroy() {
                alert.style.display = ''
            },
        }
    }

    const input = el as HTMLInputElement
    let destroyed = false

    void userIp(api.config.dataClientUrl).then((ip) => {
        if (destroyed || !ip) return
        input.value = ip
        // 5.1.5 assigned and stopped. Conditional logic listens for events now.
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
    })

    return {
        destroy() {
            destroyed = true
        },
        value: () => input.value,
        setValue(next) {
            input.value = String(next)
        },
    }
}

/** Test seam - the shared request is cached for the page's lifetime. */
export function resetUserIp(): void {
    pending = null
}

const define = (window as unknown as { __ffpDefine?: (k: string, f: (api: ChunkApi) => void) => void })
    .__ffpDefine

if (define) {
    define('userip', (api: ChunkApi) => {
        api.defineField({
            name: 'userip',
            mount: (element: Element, _config: unknown, _ctx: MountContext) => mountUserIp(element, api),
        })
    })
} else {
    console.warn('Form Fields Pro: chunk userip loaded without core')
}
