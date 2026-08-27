/**
 * Attribute lookup that walks the element and then its ancestors.
 *
 * Runtime 5.1.5 reads config attributes off whichever node each field's author
 * happened to pick: date and slider read the input, NPS reads the field root,
 * phone and colour read an enclosing wrapper. Rather than reproduce four
 * different anchor rules, resolve self-then-ancestor everywhere.
 *
 * This is deliberately more permissive than any single 5.1.5 path. It can only
 * find a value where the old code found none, never the reverse, so the failure
 * mode is "an attribute the author set now takes effect" - which is what they
 * asked for. The golden corpus is what proves that in practice.
 */
export function attrFrom(el: Element, name: string): string | null {
    const own = el.getAttribute(name)
    if (own !== null) return own
    const owner = el.closest(`[${name}]`)
    return owner ? owner.getAttribute(name) : null
}

/** Bind `attrFrom` to one element so resolver chains read tersely. */
export function attrReader(el: Element): (name: string) => string | null {
    return (name) => attrFrom(el, name)
}
