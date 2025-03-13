/**
 * FORM FIELDS PRO CDN SCRIPT - v5.0.1
 */

const EMAIL_PATTERN_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const URL_PATTERN_REGEX =
    /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/

/**
 * SELECT2 JQUERY LIBRARY SCRIPT
 */
/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */
!(function (n) {
    'function' == typeof define && define.amd
        ? define(['jquery'], n)
        : 'object' == typeof module && module.exports
          ? (module.exports = function (e, t) {
                return void 0 === t && (t = 'undefined' != typeof window ? require('jquery') : require('jquery')(e)), n(t), t
            })
          : n(jQuery)
})(function (t) {
    var e,
        n,
        s,
        p,
        r,
        o,
        h,
        f,
        g,
        m,
        y,
        v,
        i,
        a,
        _,
        s =
            (((u = t && t.fn && t.fn.select2 && t.fn.select2.amd ? t.fn.select2.amd : u) && u.requirejs) ||
                (u ? (n = u) : (u = {}),
                (g = {}),
                (m = {}),
                (y = {}),
                (v = {}),
                (i = Object.prototype.hasOwnProperty),
                (a = [].slice),
                (_ = /\.js$/),
                (h = function (e, t) {
                    var n,
                        s,
                        i = c(e),
                        r = i[0],
                        t = t[1]
                    return (
                        (e = i[1]),
                        r && (n = x((r = l(r, t)))),
                        r
                            ? (e =
                                  n && n.normalize
                                      ? n.normalize(
                                            e,
                                            ((s = t),
                                            function (e) {
                                                return l(e, s)
                                            }),
                                        )
                                      : l(e, t))
                            : ((r = (i = c((e = l(e, t))))[0]), (e = i[1]), r && (n = x(r))),
                        { f: r ? r + '!' + e : e, n: e, pr: r, p: n }
                    )
                }),
                (f = {
                    require: function (e) {
                        return w(e)
                    },
                    exports: function (e) {
                        var t = g[e]
                        return void 0 !== t ? t : (g[e] = {})
                    },
                    module: function (e) {
                        return {
                            id: e,
                            uri: '',
                            exports: g[e],
                            config:
                                ((t = e),
                                function () {
                                    return (y && y.config && y.config[t]) || {}
                                }),
                        }
                        var t
                    },
                }),
                (r = function (e, t, n, s) {
                    var i,
                        r,
                        o,
                        a,
                        l,
                        c = [],
                        u = typeof n,
                        d = A((s = s || e))
                    if ('undefined' == u || 'function' == u) {
                        for (t = !t.length && n.length ? ['require', 'exports', 'module'] : t, a = 0; a < t.length; a += 1)
                            if ('require' === (r = (o = h(t[a], d)).f)) c[a] = f.require(e)
                            else if ('exports' === r) (c[a] = f.exports(e)), (l = !0)
                            else if ('module' === r) i = c[a] = f.module(e)
                            else if (b(g, r) || b(m, r) || b(v, r)) c[a] = x(r)
                            else {
                                if (!o.p) throw new Error(e + ' missing ' + r)
                                o.p.load(
                                    o.n,
                                    w(s, !0),
                                    (function (t) {
                                        return function (e) {
                                            g[t] = e
                                        }
                                    })(r),
                                    {},
                                ),
                                    (c[a] = g[r])
                            }
                        ;(u = n ? n.apply(g[e], c) : void 0),
                            e && (i && i.exports !== p && i.exports !== g[e] ? (g[e] = i.exports) : (u === p && l) || (g[e] = u))
                    } else e && (g[e] = n)
                }),
                (e =
                    n =
                    o =
                        function (e, t, n, s, i) {
                            if ('string' == typeof e) return f[e] ? f[e](t) : x(h(e, A(t)).f)
                            if (!e.splice) {
                                if (((y = e).deps && o(y.deps, y.callback), !t)) return
                                t.splice ? ((e = t), (t = n), (n = null)) : (e = p)
                            }
                            return (
                                (t = t || function () {}),
                                'function' == typeof n && ((n = s), (s = i)),
                                s
                                    ? r(p, e, t, n)
                                    : setTimeout(function () {
                                          r(p, e, t, n)
                                      }, 4),
                                o
                            )
                        }),
                (o.config = function (e) {
                    return o(e)
                }),
                (e._defined = g),
                ((s = function (e, t, n) {
                    if ('string' != typeof e) throw new Error('See almond README: incorrect module build, no module name')
                    t.splice || ((n = t), (t = [])), b(g, e) || b(m, e) || (m[e] = [e, t, n])
                }).amd = { jQuery: !0 }),
                (u.requirejs = e),
                (u.require = n),
                (u.define = s)),
            u.define('almond', function () {}),
            u.define('jquery', [], function () {
                var e = t || $
                return (
                    null == e &&
                        console &&
                        console.error &&
                        console.error(
                            'Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page.',
                        ),
                    e
                )
            }),
            u.define('select2/utils', ['jquery'], function (r) {
                var s = {}
                function c(e) {
                    var t,
                        n = e.prototype,
                        s = []
                    for (t in n) 'function' == typeof n[t] && 'constructor' !== t && s.push(t)
                    return s
                }
                ;(s.Extend = function (e, t) {
                    var n,
                        s = {}.hasOwnProperty
                    function i() {
                        this.constructor = e
                    }
                    for (n in t) s.call(t, n) && (e[n] = t[n])
                    return (i.prototype = t.prototype), (e.prototype = new i()), (e.__super__ = t.prototype), e
                }),
                    (s.Decorate = function (s, i) {
                        var e = c(i),
                            t = c(s)
                        function r() {
                            var e = Array.prototype.unshift,
                                t = i.prototype.constructor.length,
                                n = s.prototype.constructor
                            0 < t && (e.call(arguments, s.prototype.constructor), (n = i.prototype.constructor)), n.apply(this, arguments)
                        }
                        ;(i.displayName = s.displayName),
                            (r.prototype = new (function () {
                                this.constructor = r
                            })())
                        for (var n = 0; n < t.length; n++) {
                            var o = t[n]
                            r.prototype[o] = s.prototype[o]
                        }
                        for (var a = 0; a < e.length; a++) {
                            var l = e[a]
                            r.prototype[l] = (function (e) {
                                var t = function () {}
                                e in r.prototype && (t = r.prototype[e])
                                var n = i.prototype[e]
                                return function () {
                                    return Array.prototype.unshift.call(arguments, t), n.apply(this, arguments)
                                }
                            })(l)
                        }
                        return r
                    })
                function e() {
                    this.listeners = {}
                }
                ;(e.prototype.on = function (e, t) {
                    ;(this.listeners = this.listeners || {}), e in this.listeners ? this.listeners[e].push(t) : (this.listeners[e] = [t])
                }),
                    (e.prototype.trigger = function (e) {
                        var t = Array.prototype.slice,
                            n = t.call(arguments, 1)
                        ;(this.listeners = this.listeners || {}),
                            0 === (n = null == n ? [] : n).length && n.push({}),
                            (n[0]._type = e) in this.listeners && this.invoke(this.listeners[e], t.call(arguments, 1)),
                            '*' in this.listeners && this.invoke(this.listeners['*'], arguments)
                    }),
                    (e.prototype.invoke = function (e, t) {
                        for (var n = 0, s = e.length; n < s; n++) e[n].apply(this, t)
                    }),
                    (s.Observable = e),
                    (s.generateChars = function (e) {
                        for (var t = '', n = 0; n < e; n++) t += Math.floor(36 * Math.random()).toString(36)
                        return t
                    }),
                    (s.bind = function (e, t) {
                        return function () {
                            e.apply(t, arguments)
                        }
                    }),
                    (s._convertData = function (e) {
                        for (var t in e) {
                            var n = t.split('-'),
                                s = e
                            if (1 !== n.length) {
                                for (var i = 0; i < n.length; i++) {
                                    var r = n[i]
                                    ;(r = r.substring(0, 1).toLowerCase() + r.substring(1)) in s || (s[r] = {}),
                                        i == n.length - 1 && (s[r] = e[t]),
                                        (s = s[r])
                                }
                                delete e[t]
                            }
                        }
                        return e
                    }),
                    (s.hasScroll = function (e, t) {
                        var n = r(t),
                            s = t.style.overflowX,
                            i = t.style.overflowY
                        return (
                            (s !== i || ('hidden' !== i && 'visible' !== i)) &&
                            ('scroll' === s || 'scroll' === i || n.innerHeight() < t.scrollHeight || n.innerWidth() < t.scrollWidth)
                        )
                    }),
                    (s.escapeMarkup = function (e) {
                        var t = {
                            '\\': '&#92;',
                            '&': '&amp;',
                            '<': '&lt;',
                            '>': '&gt;',
                            '"': '&quot;',
                            "'": '&#39;',
                            '/': '&#47;',
                        }
                        return 'string' != typeof e
                            ? e
                            : String(e).replace(/[&<>"'\/\\]/g, function (e) {
                                  return t[e]
                              })
                    }),
                    (s.__cache = {})
                var n = 0
                return (
                    (s.GetUniqueElementId = function (e) {
                        var t = e.getAttribute('data-select2-id')
                        return (
                            null != t ||
                                ((t = e.id ? 'select2-data-' + e.id : 'select2-data-' + (++n).toString() + '-' + s.generateChars(4)),
                                e.setAttribute('data-select2-id', t)),
                            t
                        )
                    }),
                    (s.StoreData = function (e, t, n) {
                        e = s.GetUniqueElementId(e)
                        s.__cache[e] || (s.__cache[e] = {}), (s.__cache[e][t] = n)
                    }),
                    (s.GetData = function (e, t) {
                        var n = s.GetUniqueElementId(e)
                        return t ? (s.__cache[n] && null != s.__cache[n][t] ? s.__cache[n][t] : r(e).data(t)) : s.__cache[n]
                    }),
                    (s.RemoveData = function (e) {
                        var t = s.GetUniqueElementId(e)
                        null != s.__cache[t] && delete s.__cache[t], e.removeAttribute('data-select2-id')
                    }),
                    (s.copyNonInternalCssClasses = function (e, t) {
                        var n = (n = e.getAttribute('class').trim().split(/\s+/)).filter(function (e) {
                                return 0 === e.indexOf('select2-')
                            }),
                            t = (t = t.getAttribute('class').trim().split(/\s+/)).filter(function (e) {
                                return 0 !== e.indexOf('select2-')
                            }),
                            t = n.concat(t)
                        e.setAttribute('class', t.join(' '))
                    }),
                    s
                )
            }),
            u.define('select2/results', ['jquery', './utils'], function (d, p) {
                function s(e, t, n) {
                    ;(this.$element = e), (this.data = n), (this.options = t), s.__super__.constructor.call(this)
                }
                return (
                    p.Extend(s, p.Observable),
                    (s.prototype.render = function () {
                        var e = d('<ul class="select2-results__options" role="listbox"></ul>')
                        return this.options.get('multiple') && e.attr('aria-multiselectable', 'true'), (this.$results = e)
                    }),
                    (s.prototype.clear = function () {
                        this.$results.empty()
                    }),
                    (s.prototype.displayMessage = function (e) {
                        var t = this.options.get('escapeMarkup')
                        this.clear(), this.hideLoading()
                        var n = d('<li role="alert" aria-live="assertive" class="select2-results__option"></li>'),
                            s = this.options.get('translations').get(e.message)
                        n.append(t(s(e.args))), (n[0].className += ' select2-results__message'), this.$results.append(n)
                    }),
                    (s.prototype.hideMessages = function () {
                        this.$results.find('.select2-results__message').remove()
                    }),
                    (s.prototype.append = function (e) {
                        this.hideLoading()
                        var t = []
                        if (null != e.results && 0 !== e.results.length) {
                            e.results = this.sort(e.results)
                            for (var n = 0; n < e.results.length; n++) {
                                var s = e.results[n],
                                    s = this.option(s)
                                t.push(s)
                            }
                            this.$results.append(t)
                        } else 0 === this.$results.children().length && this.trigger('results:message', { message: 'noResults' })
                    }),
                    (s.prototype.position = function (e, t) {
                        t.find('.select2-results').append(e)
                    }),
                    (s.prototype.sort = function (e) {
                        return this.options.get('sorter')(e)
                    }),
                    (s.prototype.highlightFirstItem = function () {
                        var e = this.$results.find('.select2-results__option--selectable'),
                            t = e.filter('.select2-results__option--selected')
                        ;(0 < t.length ? t : e).first().trigger('mouseenter'), this.ensureHighlightVisible()
                    }),
                    (s.prototype.setClasses = function () {
                        var t = this
                        this.data.current(function (e) {
                            var s = e.map(function (e) {
                                return e.id.toString()
                            })
                            t.$results.find('.select2-results__option--selectable').each(function () {
                                var e = d(this),
                                    t = p.GetData(this, 'data'),
                                    n = '' + t.id
                                ;(null != t.element && t.element.selected) || (null == t.element && -1 < s.indexOf(n))
                                    ? (this.classList.add('select2-results__option--selected'), e.attr('aria-selected', 'true'))
                                    : (this.classList.remove('select2-results__option--selected'), e.attr('aria-selected', 'false'))
                            })
                        })
                    }),
                    (s.prototype.showLoading = function (e) {
                        this.hideLoading()
                        ;(e = {
                            disabled: !0,
                            loading: !0,
                            text: this.options.get('translations').get('searching')(e),
                        }),
                            (e = this.option(e))
                        ;(e.className += ' loading-results'), this.$results.prepend(e)
                    }),
                    (s.prototype.hideLoading = function () {
                        this.$results.find('.loading-results').remove()
                    }),
                    (s.prototype.option = function (e) {
                        var t = document.createElement('li')
                        t.classList.add('select2-results__option'), t.classList.add('select2-results__option--selectable')
                        var n,
                            s = { role: 'option' },
                            i =
                                window.Element.prototype.matches ||
                                window.Element.prototype.msMatchesSelector ||
                                window.Element.prototype.webkitMatchesSelector
                        for (n in (((null != e.element && i.call(e.element, ':disabled')) || (null == e.element && e.disabled)) &&
                            ((s['aria-disabled'] = 'true'),
                            t.classList.remove('select2-results__option--selectable'),
                            t.classList.add('select2-results__option--disabled')),
                        null == e.id && t.classList.remove('select2-results__option--selectable'),
                        null != e._resultId && (t.id = e._resultId),
                        e.title && (t.title = e.title),
                        e.children &&
                            ((s.role = 'group'),
                            (s['aria-label'] = e.text),
                            t.classList.remove('select2-results__option--selectable'),
                            t.classList.add('select2-results__option--group')),
                        s)) {
                            var r = s[n]
                            t.setAttribute(n, r)
                        }
                        if (e.children) {
                            var o = d(t),
                                a = document.createElement('strong')
                            ;(a.className = 'select2-results__group'), this.template(e, a)
                            for (var l = [], c = 0; c < e.children.length; c++) {
                                var u = e.children[c],
                                    u = this.option(u)
                                l.push(u)
                            }
                            i = d('<ul></ul>', {
                                class: 'select2-results__options select2-results__options--nested',
                                role: 'none',
                            })
                            i.append(l), o.append(a), o.append(i)
                        } else this.template(e, t)
                        return p.StoreData(t, 'data', e), t
                    }),
                    (s.prototype.bind = function (t, e) {
                        var i = this,
                            n = t.id + '-results'
                        this.$results.attr('id', n),
                            t.on('results:all', function (e) {
                                i.clear(), i.append(e.data), t.isOpen() && (i.setClasses(), i.highlightFirstItem())
                            }),
                            t.on('results:append', function (e) {
                                i.append(e.data), t.isOpen() && i.setClasses()
                            }),
                            t.on('query', function (e) {
                                i.hideMessages(), i.showLoading(e)
                            }),
                            t.on('select', function () {
                                t.isOpen() && (i.setClasses(), i.options.get('scrollAfterSelect') && i.highlightFirstItem())
                            }),
                            t.on('unselect', function () {
                                t.isOpen() && (i.setClasses(), i.options.get('scrollAfterSelect') && i.highlightFirstItem())
                            }),
                            t.on('open', function () {
                                i.$results.attr('aria-expanded', 'true'),
                                    i.$results.attr('aria-hidden', 'false'),
                                    i.setClasses(),
                                    i.ensureHighlightVisible()
                            }),
                            t.on('close', function () {
                                i.$results.attr('aria-expanded', 'false'),
                                    i.$results.attr('aria-hidden', 'true'),
                                    i.$results.removeAttr('aria-activedescendant')
                            }),
                            t.on('results:toggle', function () {
                                var e = i.getHighlightedResults()
                                0 !== e.length && e.trigger('mouseup')
                            }),
                            t.on('results:select', function () {
                                var e,
                                    t = i.getHighlightedResults()
                                0 !== t.length &&
                                    ((e = p.GetData(t[0], 'data')),
                                    t.hasClass('select2-results__option--selected') ? i.trigger('close', {}) : i.trigger('select', { data: e }))
                            }),
                            t.on('results:previous', function () {
                                var e,
                                    t = i.getHighlightedResults(),
                                    n = i.$results.find('.select2-results__option--selectable'),
                                    s = n.index(t)
                                s <= 0 ||
                                    ((e = s - 1),
                                    0 === t.length && (e = 0),
                                    (s = n.eq(e)).trigger('mouseenter'),
                                    (t = i.$results.offset().top),
                                    (n = s.offset().top),
                                    (s = i.$results.scrollTop() + (n - t)),
                                    0 === e ? i.$results.scrollTop(0) : n - t < 0 && i.$results.scrollTop(s))
                            }),
                            t.on('results:next', function () {
                                var e,
                                    t = i.getHighlightedResults(),
                                    n = i.$results.find('.select2-results__option--selectable'),
                                    s = n.index(t) + 1
                                s >= n.length ||
                                    ((e = n.eq(s)).trigger('mouseenter'),
                                    (t = i.$results.offset().top + i.$results.outerHeight(!1)),
                                    (n = e.offset().top + e.outerHeight(!1)),
                                    (e = i.$results.scrollTop() + n - t),
                                    0 === s ? i.$results.scrollTop(0) : t < n && i.$results.scrollTop(e))
                            }),
                            t.on('results:focus', function (e) {
                                e.element[0].classList.add('select2-results__option--highlighted'), e.element[0].setAttribute('aria-selected', 'true')
                            }),
                            t.on('results:message', function (e) {
                                i.displayMessage(e)
                            }),
                            d.fn.mousewheel &&
                                this.$results.on('mousewheel', function (e) {
                                    var t = i.$results.scrollTop(),
                                        n = i.$results.get(0).scrollHeight - t + e.deltaY,
                                        t = 0 < e.deltaY && t - e.deltaY <= 0,
                                        n = e.deltaY < 0 && n <= i.$results.height()
                                    t
                                        ? (i.$results.scrollTop(0), e.preventDefault(), e.stopPropagation())
                                        : n &&
                                          (i.$results.scrollTop(i.$results.get(0).scrollHeight - i.$results.height()),
                                          e.preventDefault(),
                                          e.stopPropagation())
                                }),
                            this.$results.on('mouseup', '.select2-results__option--selectable', function (e) {
                                var t = d(this),
                                    n = p.GetData(this, 'data')
                                t.hasClass('select2-results__option--selected')
                                    ? i.options.get('multiple')
                                        ? i.trigger('unselect', { originalEvent: e, data: n })
                                        : i.trigger('close', {})
                                    : i.trigger('select', { originalEvent: e, data: n })
                            }),
                            this.$results.on('mouseenter', '.select2-results__option--selectable', function (e) {
                                var t = p.GetData(this, 'data')
                                i.getHighlightedResults().removeClass('select2-results__option--highlighted').attr('aria-selected', 'false'),
                                    i.trigger('results:focus', { data: t, element: d(this) })
                            })
                    }),
                    (s.prototype.getHighlightedResults = function () {
                        return this.$results.find('.select2-results__option--highlighted')
                    }),
                    (s.prototype.destroy = function () {
                        this.$results.remove()
                    }),
                    (s.prototype.ensureHighlightVisible = function () {
                        var e,
                            t,
                            n,
                            s,
                            i = this.getHighlightedResults()
                        0 !== i.length &&
                            ((e = this.$results.find('.select2-results__option--selectable').index(i)),
                            (s = this.$results.offset().top),
                            (t = i.offset().top),
                            (n = this.$results.scrollTop() + (t - s)),
                            (s = t - s),
                            (n -= 2 * i.outerHeight(!1)),
                            e <= 2 ? this.$results.scrollTop(0) : (s > this.$results.outerHeight() || s < 0) && this.$results.scrollTop(n))
                    }),
                    (s.prototype.template = function (e, t) {
                        var n = this.options.get('templateResult'),
                            s = this.options.get('escapeMarkup'),
                            e = n(e, t)
                        null == e ? (t.style.display = 'none') : 'string' == typeof e ? (t.innerHTML = s(e)) : d(t).append(e)
                    }),
                    s
                )
            }),
            u.define('select2/keys', [], function () {
                return {
                    BACKSPACE: 8,
                    TAB: 9,
                    ENTER: 13,
                    SHIFT: 16,
                    CTRL: 17,
                    ALT: 18,
                    ESC: 27,
                    SPACE: 32,
                    PAGE_UP: 33,
                    PAGE_DOWN: 34,
                    END: 35,
                    HOME: 36,
                    LEFT: 37,
                    UP: 38,
                    RIGHT: 39,
                    DOWN: 40,
                    DELETE: 46,
                }
            }),
            u.define('select2/selection/base', ['jquery', '../utils', '../keys'], function (n, s, i) {
                function r(e, t) {
                    ;(this.$element = e), (this.options = t), r.__super__.constructor.call(this)
                }
                return (
                    s.Extend(r, s.Observable),
                    (r.prototype.render = function () {
                        var e = n('<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>')
                        return (
                            (this._tabindex = 0),
                            null != s.GetData(this.$element[0], 'old-tabindex')
                                ? (this._tabindex = s.GetData(this.$element[0], 'old-tabindex'))
                                : null != this.$element.attr('tabindex') && (this._tabindex = this.$element.attr('tabindex')),
                            e.attr('title', this.$element.attr('title')),
                            e.attr('tabindex', this._tabindex),
                            e.attr('aria-disabled', 'false'),
                            (this.$selection = e)
                        )
                    }),
                    (r.prototype.bind = function (e, t) {
                        var n = this,
                            s = e.id + '-results'
                        ;(this.container = e),
                            this.$selection.on('focus', function (e) {
                                n.trigger('focus', e)
                            }),
                            this.$selection.on('blur', function (e) {
                                n._handleBlur(e)
                            }),
                            this.$selection.on('keydown', function (e) {
                                n.trigger('keypress', e), e.which === i.SPACE && e.preventDefault()
                            }),
                            e.on('results:focus', function (e) {
                                n.$selection.attr('aria-activedescendant', e.data._resultId)
                            }),
                            e.on('selection:update', function (e) {
                                n.update(e.data)
                            }),
                            e.on('open', function () {
                                n.$selection.attr('aria-expanded', 'true'), n.$selection.attr('aria-owns', s), n._attachCloseHandler(e)
                            }),
                            e.on('close', function () {
                                n.$selection.attr('aria-expanded', 'false'),
                                    n.$selection.removeAttr('aria-activedescendant'),
                                    n.$selection.removeAttr('aria-owns'),
                                    n.$selection.trigger('focus'),
                                    n._detachCloseHandler(e)
                            }),
                            e.on('enable', function () {
                                n.$selection.attr('tabindex', n._tabindex), n.$selection.attr('aria-disabled', 'false')
                            }),
                            e.on('disable', function () {
                                n.$selection.attr('tabindex', '-1'), n.$selection.attr('aria-disabled', 'true')
                            })
                    }),
                    (r.prototype._handleBlur = function (e) {
                        var t = this
                        window.setTimeout(function () {
                            document.activeElement == t.$selection[0] || n.contains(t.$selection[0], document.activeElement) || t.trigger('blur', e)
                        }, 1)
                    }),
                    (r.prototype._attachCloseHandler = function (e) {
                        n(document.body).on('mousedown.select2.' + e.id, function (e) {
                            var t = n(e.target).closest('.select2')
                            n('.select2.select2-container--open').each(function () {
                                this != t[0] && s.GetData(this, 'element').select2('close')
                            })
                        })
                    }),
                    (r.prototype._detachCloseHandler = function (e) {
                        n(document.body).off('mousedown.select2.' + e.id)
                    }),
                    (r.prototype.position = function (e, t) {
                        t.find('.selection').append(e)
                    }),
                    (r.prototype.destroy = function () {
                        this._detachCloseHandler(this.container)
                    }),
                    (r.prototype.update = function (e) {
                        throw new Error('The `update` method must be defined in child classes.')
                    }),
                    (r.prototype.isEnabled = function () {
                        return !this.isDisabled()
                    }),
                    (r.prototype.isDisabled = function () {
                        return this.options.get('disabled')
                    }),
                    r
                )
            }),
            u.define('select2/selection/single', ['jquery', './base', '../utils', '../keys'], function (e, t, n, s) {
                function i() {
                    i.__super__.constructor.apply(this, arguments)
                }
                return (
                    n.Extend(i, t),
                    (i.prototype.render = function () {
                        var e = i.__super__.render.call(this)
                        return (
                            e[0].classList.add('select2-selection--single'),
                            e.html(
                                '<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>',
                            ),
                            e
                        )
                    }),
                    (i.prototype.bind = function (t, e) {
                        var n = this
                        i.__super__.bind.apply(this, arguments)
                        var s = t.id + '-container'
                        this.$selection.find('.select2-selection__rendered').attr('id', s).attr('role', 'textbox').attr('aria-readonly', 'true'),
                            this.$selection.attr('aria-labelledby', s),
                            this.$selection.attr('aria-controls', s),
                            this.$selection.on('mousedown', function (e) {
                                1 === e.which && n.trigger('toggle', { originalEvent: e })
                            }),
                            this.$selection.on('focus', function (e) {}),
                            this.$selection.on('blur', function (e) {}),
                            t.on('focus', function (e) {
                                t.isOpen() || n.$selection.trigger('focus')
                            })
                    }),
                    (i.prototype.clear = function () {
                        var e = this.$selection.find('.select2-selection__rendered')
                        e.empty(), e.removeAttr('title')
                    }),
                    (i.prototype.display = function (e, t) {
                        var n = this.options.get('templateSelection')
                        return this.options.get('escapeMarkup')(n(e, t))
                    }),
                    (i.prototype.selectionContainer = function () {
                        return e('<span></span>')
                    }),
                    (i.prototype.update = function (e) {
                        var t, n
                        0 !== e.length
                            ? ((n = e[0]),
                              (t = this.$selection.find('.select2-selection__rendered')),
                              (e = this.display(n, t)),
                              t.empty().append(e),
                              (n = n.title || n.text) ? t.attr('title', n) : t.removeAttr('title'))
                            : this.clear()
                    }),
                    i
                )
            }),
            u.define('select2/selection/multiple', ['jquery', './base', '../utils'], function (i, e, c) {
                function r(e, t) {
                    r.__super__.constructor.apply(this, arguments)
                }
                return (
                    c.Extend(r, e),
                    (r.prototype.render = function () {
                        var e = r.__super__.render.call(this)
                        return e[0].classList.add('select2-selection--multiple'), e.html('<ul class="select2-selection__rendered"></ul>'), e
                    }),
                    (r.prototype.bind = function (e, t) {
                        var n = this
                        r.__super__.bind.apply(this, arguments)
                        var s = e.id + '-container'
                        this.$selection.find('.select2-selection__rendered').attr('id', s),
                            this.$selection.on('click', function (e) {
                                n.trigger('toggle', { originalEvent: e })
                            }),
                            this.$selection.on('click', '.select2-selection__choice__remove', function (e) {
                                var t
                                n.isDisabled() ||
                                    ((t = i(this).parent()), (t = c.GetData(t[0], 'data')), n.trigger('unselect', { originalEvent: e, data: t }))
                            }),
                            this.$selection.on('keydown', '.select2-selection__choice__remove', function (e) {
                                n.isDisabled() || e.stopPropagation()
                            })
                    }),
                    (r.prototype.clear = function () {
                        var e = this.$selection.find('.select2-selection__rendered')
                        e.empty(), e.removeAttr('title')
                    }),
                    (r.prototype.display = function (e, t) {
                        var n = this.options.get('templateSelection')
                        return this.options.get('escapeMarkup')(n(e, t))
                    }),
                    (r.prototype.selectionContainer = function () {
                        return i(
                            '<li class="select2-selection__choice"><button type="button" class="select2-selection__choice__remove" tabindex="-1"><span aria-hidden="true">&times;</span></button><span class="select2-selection__choice__display"></span></li>',
                        )
                    }),
                    (r.prototype.update = function (e) {
                        if ((this.clear(), 0 !== e.length)) {
                            for (
                                var t = [], n = this.$selection.find('.select2-selection__rendered').attr('id') + '-choice-', s = 0;
                                s < e.length;
                                s++
                            ) {
                                var i = e[s],
                                    r = this.selectionContainer(),
                                    o = this.display(i, r),
                                    a = n + c.generateChars(4) + '-'
                                i.id ? (a += i.id) : (a += c.generateChars(4)), r.find('.select2-selection__choice__display').append(o).attr('id', a)
                                var l = i.title || i.text
                                l && r.attr('title', l)
                                ;(o = this.options.get('translations').get('removeItem')), (l = r.find('.select2-selection__choice__remove'))
                                l.attr('title', o()),
                                    l.attr('aria-label', o()),
                                    l.attr('aria-describedby', a),
                                    c.StoreData(r[0], 'data', i),
                                    t.push(r)
                            }
                            this.$selection.find('.select2-selection__rendered').append(t)
                        }
                    }),
                    r
                )
            }),
            u.define('select2/selection/placeholder', [], function () {
                function e(e, t, n) {
                    ;(this.placeholder = this.normalizePlaceholder(n.get('placeholder'))), e.call(this, t, n)
                }
                return (
                    (e.prototype.normalizePlaceholder = function (e, t) {
                        return (t = 'string' == typeof t ? { id: '', text: t } : t)
                    }),
                    (e.prototype.createPlaceholder = function (e, t) {
                        var n = this.selectionContainer()
                        n.html(this.display(t)),
                            n[0].classList.add('select2-selection__placeholder'),
                            n[0].classList.remove('select2-selection__choice')
                        t = t.title || t.text || n.text()
                        return this.$selection.find('.select2-selection__rendered').attr('title', t), n
                    }),
                    (e.prototype.update = function (e, t) {
                        var n = 1 == t.length && t[0].id != this.placeholder.id
                        if (1 < t.length || n) return e.call(this, t)
                        this.clear()
                        t = this.createPlaceholder(this.placeholder)
                        this.$selection.find('.select2-selection__rendered').append(t)
                    }),
                    e
                )
            }),
            u.define('select2/selection/allowClear', ['jquery', '../keys', '../utils'], function (i, s, a) {
                function e() {}
                return (
                    (e.prototype.bind = function (e, t, n) {
                        var s = this
                        e.call(this, t, n),
                            null == this.placeholder &&
                                this.options.get('debug') &&
                                window.console &&
                                console.error &&
                                console.error('Select2: The `allowClear` option should be used in combination with the `placeholder` option.'),
                            this.$selection.on('mousedown', '.select2-selection__clear', function (e) {
                                s._handleClear(e)
                            }),
                            t.on('keypress', function (e) {
                                s._handleKeyboardClear(e, t)
                            })
                    }),
                    (e.prototype._handleClear = function (e, t) {
                        if (!this.isDisabled()) {
                            var n = this.$selection.find('.select2-selection__clear')
                            if (0 !== n.length) {
                                t.stopPropagation()
                                var s = a.GetData(n[0], 'data'),
                                    i = this.$element.val()
                                this.$element.val(this.placeholder.id)
                                var r = { data: s }
                                if ((this.trigger('clear', r), r.prevented)) this.$element.val(i)
                                else {
                                    for (var o = 0; o < s.length; o++)
                                        if (((r = { data: s[o] }), this.trigger('unselect', r), r.prevented)) return void this.$element.val(i)
                                    this.$element.trigger('input').trigger('change'), this.trigger('toggle', {})
                                }
                            }
                        }
                    }),
                    (e.prototype._handleKeyboardClear = function (e, t, n) {
                        n.isOpen() || (t.which != s.DELETE && t.which != s.BACKSPACE) || this._handleClear(t)
                    }),
                    (e.prototype.update = function (e, t) {
                        var n, s
                        e.call(this, t),
                            this.$selection.find('.select2-selection__clear').remove(),
                            this.$selection[0].classList.remove('select2-selection--clearable'),
                            0 < this.$selection.find('.select2-selection__placeholder').length ||
                                0 === t.length ||
                                ((n = this.$selection.find('.select2-selection__rendered').attr('id')),
                                (s = this.options.get('translations').get('removeAllItems')),
                                (e = i(
                                    '<button type="button" class="select2-selection__clear" tabindex="-1"><span aria-hidden="true">&times;</span></button>',
                                )).attr('title', s()),
                                e.attr('aria-label', s()),
                                e.attr('aria-describedby', n),
                                a.StoreData(e[0], 'data', t),
                                this.$selection.prepend(e),
                                this.$selection[0].classList.add('select2-selection--clearable'))
                    }),
                    e
                )
            }),
            u.define('select2/selection/search', ['jquery', '../utils', '../keys'], function (s, a, l) {
                function e(e, t, n) {
                    e.call(this, t, n)
                }
                return (
                    (e.prototype.render = function (e) {
                        var t = this.options.get('translations').get('search'),
                            n = s(
                                '<span class="select2-search select2-search--inline"><textarea class="select2-search__field" type="search" tabindex="-1" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" ></textarea></span>',
                            )
                        ;(this.$searchContainer = n),
                            (this.$search = n.find('textarea')),
                            this.$search.prop('autocomplete', this.options.get('autocomplete')),
                            this.$search.attr('aria-label', t())
                        e = e.call(this)
                        return this._transferTabIndex(), e.append(this.$searchContainer), e
                    }),
                    (e.prototype.bind = function (e, t, n) {
                        var s = this,
                            i = t.id + '-results',
                            r = t.id + '-container'
                        e.call(this, t, n),
                            s.$search.attr('aria-describedby', r),
                            t.on('open', function () {
                                s.$search.attr('aria-controls', i), s.$search.trigger('focus')
                            }),
                            t.on('close', function () {
                                s.$search.val(''),
                                    s.resizeSearch(),
                                    s.$search.removeAttr('aria-controls'),
                                    s.$search.removeAttr('aria-activedescendant'),
                                    s.$search.trigger('focus')
                            }),
                            t.on('enable', function () {
                                s.$search.prop('disabled', !1), s._transferTabIndex()
                            }),
                            t.on('disable', function () {
                                s.$search.prop('disabled', !0)
                            }),
                            t.on('focus', function (e) {
                                s.$search.trigger('focus')
                            }),
                            t.on('results:focus', function (e) {
                                e.data._resultId
                                    ? s.$search.attr('aria-activedescendant', e.data._resultId)
                                    : s.$search.removeAttr('aria-activedescendant')
                            }),
                            this.$selection.on('focusin', '.select2-search--inline', function (e) {
                                s.trigger('focus', e)
                            }),
                            this.$selection.on('focusout', '.select2-search--inline', function (e) {
                                s._handleBlur(e)
                            }),
                            this.$selection.on('keydown', '.select2-search--inline', function (e) {
                                var t
                                e.stopPropagation(),
                                    s.trigger('keypress', e),
                                    (s._keyUpPrevented = e.isDefaultPrevented()),
                                    e.which !== l.BACKSPACE ||
                                        '' !== s.$search.val() ||
                                        (0 < (t = s.$selection.find('.select2-selection__choice').last()).length &&
                                            ((t = a.GetData(t[0], 'data')), s.searchRemoveChoice(t), e.preventDefault()))
                            }),
                            this.$selection.on('click', '.select2-search--inline', function (e) {
                                s.$search.val() && e.stopPropagation()
                            })
                        var t = document.documentMode,
                            o = t && t <= 11
                        this.$selection.on('input.searchcheck', '.select2-search--inline', function (e) {
                            o ? s.$selection.off('input.search input.searchcheck') : s.$selection.off('keyup.search')
                        }),
                            this.$selection.on('keyup.search input.search', '.select2-search--inline', function (e) {
                                var t
                                o && 'input' === e.type
                                    ? s.$selection.off('input.search input.searchcheck')
                                    : (t = e.which) != l.SHIFT && t != l.CTRL && t != l.ALT && t != l.TAB && s.handleSearch(e)
                            })
                    }),
                    (e.prototype._transferTabIndex = function (e) {
                        this.$search.attr('tabindex', this.$selection.attr('tabindex')), this.$selection.attr('tabindex', '-1')
                    }),
                    (e.prototype.createPlaceholder = function (e, t) {
                        this.$search.attr('placeholder', t.text)
                    }),
                    (e.prototype.update = function (e, t) {
                        var n = this.$search[0] == document.activeElement
                        this.$search.attr('placeholder', ''), e.call(this, t), this.resizeSearch(), n && this.$search.trigger('focus')
                    }),
                    (e.prototype.handleSearch = function () {
                        var e
                        this.resizeSearch(),
                            this._keyUpPrevented || ((e = this.$search.val()), this.trigger('query', { term: e })),
                            (this._keyUpPrevented = !1)
                    }),
                    (e.prototype.searchRemoveChoice = function (e, t) {
                        this.trigger('unselect', { data: t }), this.$search.val(t.text), this.handleSearch()
                    }),
                    (e.prototype.resizeSearch = function () {
                        this.$search.css('width', '25px')
                        var e = '100%'
                        '' === this.$search.attr('placeholder') && (e = 0.75 * (this.$search.val().length + 1) + 'em'), this.$search.css('width', e)
                    }),
                    e
                )
            }),
            u.define('select2/selection/selectionCss', ['../utils'], function (n) {
                function e() {}
                return (
                    (e.prototype.render = function (e) {
                        var t = e.call(this),
                            e = this.options.get('selectionCssClass') || ''
                        return (
                            -1 !== e.indexOf(':all:') && ((e = e.replace(':all:', '')), n.copyNonInternalCssClasses(t[0], this.$element[0])),
                            t.addClass(e),
                            t
                        )
                    }),
                    e
                )
            }),
            u.define('select2/selection/eventRelay', ['jquery'], function (o) {
                function e() {}
                return (
                    (e.prototype.bind = function (e, t, n) {
                        var s = this,
                            i = ['open', 'opening', 'close', 'closing', 'select', 'selecting', 'unselect', 'unselecting', 'clear', 'clearing'],
                            r = ['opening', 'closing', 'selecting', 'unselecting', 'clearing']
                        e.call(this, t, n),
                            t.on('*', function (e, t) {
                                var n
                                ;-1 !== i.indexOf(e) &&
                                    ((t = t || {}),
                                    (n = o.Event('select2:' + e, { params: t })),
                                    s.$element.trigger(n),
                                    -1 !== r.indexOf(e) && (t.prevented = n.isDefaultPrevented()))
                            })
                    }),
                    e
                )
            }),
            u.define('select2/translation', ['jquery', 'require'], function (t, n) {
                function s(e) {
                    this.dict = e || {}
                }
                return (
                    (s.prototype.all = function () {
                        return this.dict
                    }),
                    (s.prototype.get = function (e) {
                        return this.dict[e]
                    }),
                    (s.prototype.extend = function (e) {
                        this.dict = t.extend({}, e.all(), this.dict)
                    }),
                    (s._cache = {}),
                    (s.loadPath = function (e) {
                        var t
                        return e in s._cache || ((t = n(e)), (s._cache[e] = t)), new s(s._cache[e])
                    }),
                    s
                )
            }),
            u.define('select2/diacritics', [], function () {
                return {
                    'Ⓐ': 'A',
                    Ａ: 'A',
                    À: 'A',
                    Á: 'A',
                    Â: 'A',
                    Ầ: 'A',
                    Ấ: 'A',
                    Ẫ: 'A',
                    Ẩ: 'A',
                    Ã: 'A',
                    Ā: 'A',
                    Ă: 'A',
                    Ằ: 'A',
                    Ắ: 'A',
                    Ẵ: 'A',
                    Ẳ: 'A',
                    Ȧ: 'A',
                    Ǡ: 'A',
                    Ä: 'A',
                    Ǟ: 'A',
                    Ả: 'A',
                    Å: 'A',
                    Ǻ: 'A',
                    Ǎ: 'A',
                    Ȁ: 'A',
                    Ȃ: 'A',
                    Ạ: 'A',
                    Ậ: 'A',
                    Ặ: 'A',
                    Ḁ: 'A',
                    Ą: 'A',
                    Ⱥ: 'A',
                    Ɐ: 'A',
                    Ꜳ: 'AA',
                    Æ: 'AE',
                    Ǽ: 'AE',
                    Ǣ: 'AE',
                    Ꜵ: 'AO',
                    Ꜷ: 'AU',
                    Ꜹ: 'AV',
                    Ꜻ: 'AV',
                    Ꜽ: 'AY',
                    'Ⓑ': 'B',
                    Ｂ: 'B',
                    Ḃ: 'B',
                    Ḅ: 'B',
                    Ḇ: 'B',
                    Ƀ: 'B',
                    Ƃ: 'B',
                    Ɓ: 'B',
                    'Ⓒ': 'C',
                    Ｃ: 'C',
                    Ć: 'C',
                    Ĉ: 'C',
                    Ċ: 'C',
                    Č: 'C',
                    Ç: 'C',
                    Ḉ: 'C',
                    Ƈ: 'C',
                    Ȼ: 'C',
                    Ꜿ: 'C',
                    'Ⓓ': 'D',
                    Ｄ: 'D',
                    Ḋ: 'D',
                    Ď: 'D',
                    Ḍ: 'D',
                    Ḑ: 'D',
                    Ḓ: 'D',
                    Ḏ: 'D',
                    Đ: 'D',
                    Ƌ: 'D',
                    Ɗ: 'D',
                    Ɖ: 'D',
                    Ꝺ: 'D',
                    Ǳ: 'DZ',
                    Ǆ: 'DZ',
                    ǲ: 'Dz',
                    ǅ: 'Dz',
                    'Ⓔ': 'E',
                    Ｅ: 'E',
                    È: 'E',
                    É: 'E',
                    Ê: 'E',
                    Ề: 'E',
                    Ế: 'E',
                    Ễ: 'E',
                    Ể: 'E',
                    Ẽ: 'E',
                    Ē: 'E',
                    Ḕ: 'E',
                    Ḗ: 'E',
                    Ĕ: 'E',
                    Ė: 'E',
                    Ë: 'E',
                    Ẻ: 'E',
                    Ě: 'E',
                    Ȅ: 'E',
                    Ȇ: 'E',
                    Ẹ: 'E',
                    Ệ: 'E',
                    Ȩ: 'E',
                    Ḝ: 'E',
                    Ę: 'E',
                    Ḙ: 'E',
                    Ḛ: 'E',
                    Ɛ: 'E',
                    Ǝ: 'E',
                    'Ⓕ': 'F',
                    Ｆ: 'F',
                    Ḟ: 'F',
                    Ƒ: 'F',
                    Ꝼ: 'F',
                    'Ⓖ': 'G',
                    Ｇ: 'G',
                    Ǵ: 'G',
                    Ĝ: 'G',
                    Ḡ: 'G',
                    Ğ: 'G',
                    Ġ: 'G',
                    Ǧ: 'G',
                    Ģ: 'G',
                    Ǥ: 'G',
                    Ɠ: 'G',
                    Ꞡ: 'G',
                    Ᵹ: 'G',
                    Ꝿ: 'G',
                    'Ⓗ': 'H',
                    Ｈ: 'H',
                    Ĥ: 'H',
                    Ḣ: 'H',
                    Ḧ: 'H',
                    Ȟ: 'H',
                    Ḥ: 'H',
                    Ḩ: 'H',
                    Ḫ: 'H',
                    Ħ: 'H',
                    Ⱨ: 'H',
                    Ⱶ: 'H',
                    Ɥ: 'H',
                    'Ⓘ': 'I',
                    Ｉ: 'I',
                    Ì: 'I',
                    Í: 'I',
                    Î: 'I',
                    Ĩ: 'I',
                    Ī: 'I',
                    Ĭ: 'I',
                    İ: 'I',
                    Ï: 'I',
                    Ḯ: 'I',
                    Ỉ: 'I',
                    Ǐ: 'I',
                    Ȉ: 'I',
                    Ȋ: 'I',
                    Ị: 'I',
                    Į: 'I',
                    Ḭ: 'I',
                    Ɨ: 'I',
                    'Ⓙ': 'J',
                    Ｊ: 'J',
                    Ĵ: 'J',
                    Ɉ: 'J',
                    'Ⓚ': 'K',
                    Ｋ: 'K',
                    Ḱ: 'K',
                    Ǩ: 'K',
                    Ḳ: 'K',
                    Ķ: 'K',
                    Ḵ: 'K',
                    Ƙ: 'K',
                    Ⱪ: 'K',
                    Ꝁ: 'K',
                    Ꝃ: 'K',
                    Ꝅ: 'K',
                    Ꞣ: 'K',
                    'Ⓛ': 'L',
                    Ｌ: 'L',
                    Ŀ: 'L',
                    Ĺ: 'L',
                    Ľ: 'L',
                    Ḷ: 'L',
                    Ḹ: 'L',
                    Ļ: 'L',
                    Ḽ: 'L',
                    Ḻ: 'L',
                    Ł: 'L',
                    Ƚ: 'L',
                    Ɫ: 'L',
                    Ⱡ: 'L',
                    Ꝉ: 'L',
                    Ꝇ: 'L',
                    Ꞁ: 'L',
                    Ǉ: 'LJ',
                    ǈ: 'Lj',
                    'Ⓜ': 'M',
                    Ｍ: 'M',
                    Ḿ: 'M',
                    Ṁ: 'M',
                    Ṃ: 'M',
                    Ɱ: 'M',
                    Ɯ: 'M',
                    'Ⓝ': 'N',
                    Ｎ: 'N',
                    Ǹ: 'N',
                    Ń: 'N',
                    Ñ: 'N',
                    Ṅ: 'N',
                    Ň: 'N',
                    Ṇ: 'N',
                    Ņ: 'N',
                    Ṋ: 'N',
                    Ṉ: 'N',
                    Ƞ: 'N',
                    Ɲ: 'N',
                    Ꞑ: 'N',
                    Ꞥ: 'N',
                    Ǌ: 'NJ',
                    ǋ: 'Nj',
                    'Ⓞ': 'O',
                    Ｏ: 'O',
                    Ò: 'O',
                    Ó: 'O',
                    Ô: 'O',
                    Ồ: 'O',
                    Ố: 'O',
                    Ỗ: 'O',
                    Ổ: 'O',
                    Õ: 'O',
                    Ṍ: 'O',
                    Ȭ: 'O',
                    Ṏ: 'O',
                    Ō: 'O',
                    Ṑ: 'O',
                    Ṓ: 'O',
                    Ŏ: 'O',
                    Ȯ: 'O',
                    Ȱ: 'O',
                    Ö: 'O',
                    Ȫ: 'O',
                    Ỏ: 'O',
                    Ő: 'O',
                    Ǒ: 'O',
                    Ȍ: 'O',
                    Ȏ: 'O',
                    Ơ: 'O',
                    Ờ: 'O',
                    Ớ: 'O',
                    Ỡ: 'O',
                    Ở: 'O',
                    Ợ: 'O',
                    Ọ: 'O',
                    Ộ: 'O',
                    Ǫ: 'O',
                    Ǭ: 'O',
                    Ø: 'O',
                    Ǿ: 'O',
                    Ɔ: 'O',
                    Ɵ: 'O',
                    Ꝋ: 'O',
                    Ꝍ: 'O',
                    Œ: 'OE',
                    Ƣ: 'OI',
                    Ꝏ: 'OO',
                    Ȣ: 'OU',
                    'Ⓟ': 'P',
                    Ｐ: 'P',
                    Ṕ: 'P',
                    Ṗ: 'P',
                    Ƥ: 'P',
                    Ᵽ: 'P',
                    Ꝑ: 'P',
                    Ꝓ: 'P',
                    Ꝕ: 'P',
                    'Ⓠ': 'Q',
                    Ｑ: 'Q',
                    Ꝗ: 'Q',
                    Ꝙ: 'Q',
                    Ɋ: 'Q',
                    'Ⓡ': 'R',
                    Ｒ: 'R',
                    Ŕ: 'R',
                    Ṙ: 'R',
                    Ř: 'R',
                    Ȑ: 'R',
                    Ȓ: 'R',
                    Ṛ: 'R',
                    Ṝ: 'R',
                    Ŗ: 'R',
                    Ṟ: 'R',
                    Ɍ: 'R',
                    Ɽ: 'R',
                    Ꝛ: 'R',
                    Ꞧ: 'R',
                    Ꞃ: 'R',
                    'Ⓢ': 'S',
                    Ｓ: 'S',
                    ẞ: 'S',
                    Ś: 'S',
                    Ṥ: 'S',
                    Ŝ: 'S',
                    Ṡ: 'S',
                    Š: 'S',
                    Ṧ: 'S',
                    Ṣ: 'S',
                    Ṩ: 'S',
                    Ș: 'S',
                    Ş: 'S',
                    Ȿ: 'S',
                    Ꞩ: 'S',
                    Ꞅ: 'S',
                    'Ⓣ': 'T',
                    Ｔ: 'T',
                    Ṫ: 'T',
                    Ť: 'T',
                    Ṭ: 'T',
                    Ț: 'T',
                    Ţ: 'T',
                    Ṱ: 'T',
                    Ṯ: 'T',
                    Ŧ: 'T',
                    Ƭ: 'T',
                    Ʈ: 'T',
                    Ⱦ: 'T',
                    Ꞇ: 'T',
                    Ꜩ: 'TZ',
                    'Ⓤ': 'U',
                    Ｕ: 'U',
                    Ù: 'U',
                    Ú: 'U',
                    Û: 'U',
                    Ũ: 'U',
                    Ṹ: 'U',
                    Ū: 'U',
                    Ṻ: 'U',
                    Ŭ: 'U',
                    Ü: 'U',
                    Ǜ: 'U',
                    Ǘ: 'U',
                    Ǖ: 'U',
                    Ǚ: 'U',
                    Ủ: 'U',
                    Ů: 'U',
                    Ű: 'U',
                    Ǔ: 'U',
                    Ȕ: 'U',
                    Ȗ: 'U',
                    Ư: 'U',
                    Ừ: 'U',
                    Ứ: 'U',
                    Ữ: 'U',
                    Ử: 'U',
                    Ự: 'U',
                    Ụ: 'U',
                    Ṳ: 'U',
                    Ų: 'U',
                    Ṷ: 'U',
                    Ṵ: 'U',
                    Ʉ: 'U',
                    'Ⓥ': 'V',
                    Ｖ: 'V',
                    Ṽ: 'V',
                    Ṿ: 'V',
                    Ʋ: 'V',
                    Ꝟ: 'V',
                    Ʌ: 'V',
                    Ꝡ: 'VY',
                    'Ⓦ': 'W',
                    Ｗ: 'W',
                    Ẁ: 'W',
                    Ẃ: 'W',
                    Ŵ: 'W',
                    Ẇ: 'W',
                    Ẅ: 'W',
                    Ẉ: 'W',
                    Ⱳ: 'W',
                    'Ⓧ': 'X',
                    Ｘ: 'X',
                    Ẋ: 'X',
                    Ẍ: 'X',
                    'Ⓨ': 'Y',
                    Ｙ: 'Y',
                    Ỳ: 'Y',
                    Ý: 'Y',
                    Ŷ: 'Y',
                    Ỹ: 'Y',
                    Ȳ: 'Y',
                    Ẏ: 'Y',
                    Ÿ: 'Y',
                    Ỷ: 'Y',
                    Ỵ: 'Y',
                    Ƴ: 'Y',
                    Ɏ: 'Y',
                    Ỿ: 'Y',
                    'Ⓩ': 'Z',
                    Ｚ: 'Z',
                    Ź: 'Z',
                    Ẑ: 'Z',
                    Ż: 'Z',
                    Ž: 'Z',
                    Ẓ: 'Z',
                    Ẕ: 'Z',
                    Ƶ: 'Z',
                    Ȥ: 'Z',
                    Ɀ: 'Z',
                    Ⱬ: 'Z',
                    Ꝣ: 'Z',
                    'ⓐ': 'a',
                    ａ: 'a',
                    ẚ: 'a',
                    à: 'a',
                    á: 'a',
                    â: 'a',
                    ầ: 'a',
                    ấ: 'a',
                    ẫ: 'a',
                    ẩ: 'a',
                    ã: 'a',
                    ā: 'a',
                    ă: 'a',
                    ằ: 'a',
                    ắ: 'a',
                    ẵ: 'a',
                    ẳ: 'a',
                    ȧ: 'a',
                    ǡ: 'a',
                    ä: 'a',
                    ǟ: 'a',
                    ả: 'a',
                    å: 'a',
                    ǻ: 'a',
                    ǎ: 'a',
                    ȁ: 'a',
                    ȃ: 'a',
                    ạ: 'a',
                    ậ: 'a',
                    ặ: 'a',
                    ḁ: 'a',
                    ą: 'a',
                    ⱥ: 'a',
                    ɐ: 'a',
                    ꜳ: 'aa',
                    æ: 'ae',
                    ǽ: 'ae',
                    ǣ: 'ae',
                    ꜵ: 'ao',
                    ꜷ: 'au',
                    ꜹ: 'av',
                    ꜻ: 'av',
                    ꜽ: 'ay',
                    'ⓑ': 'b',
                    ｂ: 'b',
                    ḃ: 'b',
                    ḅ: 'b',
                    ḇ: 'b',
                    ƀ: 'b',
                    ƃ: 'b',
                    ɓ: 'b',
                    'ⓒ': 'c',
                    ｃ: 'c',
                    ć: 'c',
                    ĉ: 'c',
                    ċ: 'c',
                    č: 'c',
                    ç: 'c',
                    ḉ: 'c',
                    ƈ: 'c',
                    ȼ: 'c',
                    ꜿ: 'c',
                    ↄ: 'c',
                    'ⓓ': 'd',
                    ｄ: 'd',
                    ḋ: 'd',
                    ď: 'd',
                    ḍ: 'd',
                    ḑ: 'd',
                    ḓ: 'd',
                    ḏ: 'd',
                    đ: 'd',
                    ƌ: 'd',
                    ɖ: 'd',
                    ɗ: 'd',
                    ꝺ: 'd',
                    ǳ: 'dz',
                    ǆ: 'dz',
                    'ⓔ': 'e',
                    ｅ: 'e',
                    è: 'e',
                    é: 'e',
                    ê: 'e',
                    ề: 'e',
                    ế: 'e',
                    ễ: 'e',
                    ể: 'e',
                    ẽ: 'e',
                    ē: 'e',
                    ḕ: 'e',
                    ḗ: 'e',
                    ĕ: 'e',
                    ė: 'e',
                    ë: 'e',
                    ẻ: 'e',
                    ě: 'e',
                    ȅ: 'e',
                    ȇ: 'e',
                    ẹ: 'e',
                    ệ: 'e',
                    ȩ: 'e',
                    ḝ: 'e',
                    ę: 'e',
                    ḙ: 'e',
                    ḛ: 'e',
                    ɇ: 'e',
                    ɛ: 'e',
                    ǝ: 'e',
                    'ⓕ': 'f',
                    ｆ: 'f',
                    ḟ: 'f',
                    ƒ: 'f',
                    ꝼ: 'f',
                    'ⓖ': 'g',
                    ｇ: 'g',
                    ǵ: 'g',
                    ĝ: 'g',
                    ḡ: 'g',
                    ğ: 'g',
                    ġ: 'g',
                    ǧ: 'g',
                    ģ: 'g',
                    ǥ: 'g',
                    ɠ: 'g',
                    ꞡ: 'g',
                    ᵹ: 'g',
                    ꝿ: 'g',
                    'ⓗ': 'h',
                    ｈ: 'h',
                    ĥ: 'h',
                    ḣ: 'h',
                    ḧ: 'h',
                    ȟ: 'h',
                    ḥ: 'h',
                    ḩ: 'h',
                    ḫ: 'h',
                    ẖ: 'h',
                    ħ: 'h',
                    ⱨ: 'h',
                    ⱶ: 'h',
                    ɥ: 'h',
                    ƕ: 'hv',
                    'ⓘ': 'i',
                    ｉ: 'i',
                    ì: 'i',
                    í: 'i',
                    î: 'i',
                    ĩ: 'i',
                    ī: 'i',
                    ĭ: 'i',
                    ï: 'i',
                    ḯ: 'i',
                    ỉ: 'i',
                    ǐ: 'i',
                    ȉ: 'i',
                    ȋ: 'i',
                    ị: 'i',
                    į: 'i',
                    ḭ: 'i',
                    ɨ: 'i',
                    ı: 'i',
                    'ⓙ': 'j',
                    ｊ: 'j',
                    ĵ: 'j',
                    ǰ: 'j',
                    ɉ: 'j',
                    'ⓚ': 'k',
                    ｋ: 'k',
                    ḱ: 'k',
                    ǩ: 'k',
                    ḳ: 'k',
                    ķ: 'k',
                    ḵ: 'k',
                    ƙ: 'k',
                    ⱪ: 'k',
                    ꝁ: 'k',
                    ꝃ: 'k',
                    ꝅ: 'k',
                    ꞣ: 'k',
                    'ⓛ': 'l',
                    ｌ: 'l',
                    ŀ: 'l',
                    ĺ: 'l',
                    ľ: 'l',
                    ḷ: 'l',
                    ḹ: 'l',
                    ļ: 'l',
                    ḽ: 'l',
                    ḻ: 'l',
                    ſ: 'l',
                    ł: 'l',
                    ƚ: 'l',
                    ɫ: 'l',
                    ⱡ: 'l',
                    ꝉ: 'l',
                    ꞁ: 'l',
                    ꝇ: 'l',
                    ǉ: 'lj',
                    'ⓜ': 'm',
                    ｍ: 'm',
                    ḿ: 'm',
                    ṁ: 'm',
                    ṃ: 'm',
                    ɱ: 'm',
                    ɯ: 'm',
                    'ⓝ': 'n',
                    ｎ: 'n',
                    ǹ: 'n',
                    ń: 'n',
                    ñ: 'n',
                    ṅ: 'n',
                    ň: 'n',
                    ṇ: 'n',
                    ņ: 'n',
                    ṋ: 'n',
                    ṉ: 'n',
                    ƞ: 'n',
                    ɲ: 'n',
                    ŉ: 'n',
                    ꞑ: 'n',
                    ꞥ: 'n',
                    ǌ: 'nj',
                    'ⓞ': 'o',
                    ｏ: 'o',
                    ò: 'o',
                    ó: 'o',
                    ô: 'o',
                    ồ: 'o',
                    ố: 'o',
                    ỗ: 'o',
                    ổ: 'o',
                    õ: 'o',
                    ṍ: 'o',
                    ȭ: 'o',
                    ṏ: 'o',
                    ō: 'o',
                    ṑ: 'o',
                    ṓ: 'o',
                    ŏ: 'o',
                    ȯ: 'o',
                    ȱ: 'o',
                    ö: 'o',
                    ȫ: 'o',
                    ỏ: 'o',
                    ő: 'o',
                    ǒ: 'o',
                    ȍ: 'o',
                    ȏ: 'o',
                    ơ: 'o',
                    ờ: 'o',
                    ớ: 'o',
                    ỡ: 'o',
                    ở: 'o',
                    ợ: 'o',
                    ọ: 'o',
                    ộ: 'o',
                    ǫ: 'o',
                    ǭ: 'o',
                    ø: 'o',
                    ǿ: 'o',
                    ɔ: 'o',
                    ꝋ: 'o',
                    ꝍ: 'o',
                    ɵ: 'o',
                    œ: 'oe',
                    ƣ: 'oi',
                    ȣ: 'ou',
                    ꝏ: 'oo',
                    'ⓟ': 'p',
                    ｐ: 'p',
                    ṕ: 'p',
                    ṗ: 'p',
                    ƥ: 'p',
                    ᵽ: 'p',
                    ꝑ: 'p',
                    ꝓ: 'p',
                    ꝕ: 'p',
                    'ⓠ': 'q',
                    ｑ: 'q',
                    ɋ: 'q',
                    ꝗ: 'q',
                    ꝙ: 'q',
                    'ⓡ': 'r',
                    ｒ: 'r',
                    ŕ: 'r',
                    ṙ: 'r',
                    ř: 'r',
                    ȑ: 'r',
                    ȓ: 'r',
                    ṛ: 'r',
                    ṝ: 'r',
                    ŗ: 'r',
                    ṟ: 'r',
                    ɍ: 'r',
                    ɽ: 'r',
                    ꝛ: 'r',
                    ꞧ: 'r',
                    ꞃ: 'r',
                    'ⓢ': 's',
                    ｓ: 's',
                    ß: 's',
                    ś: 's',
                    ṥ: 's',
                    ŝ: 's',
                    ṡ: 's',
                    š: 's',
                    ṧ: 's',
                    ṣ: 's',
                    ṩ: 's',
                    ș: 's',
                    ş: 's',
                    ȿ: 's',
                    ꞩ: 's',
                    ꞅ: 's',
                    ẛ: 's',
                    'ⓣ': 't',
                    ｔ: 't',
                    ṫ: 't',
                    ẗ: 't',
                    ť: 't',
                    ṭ: 't',
                    ț: 't',
                    ţ: 't',
                    ṱ: 't',
                    ṯ: 't',
                    ŧ: 't',
                    ƭ: 't',
                    ʈ: 't',
                    ⱦ: 't',
                    ꞇ: 't',
                    ꜩ: 'tz',
                    'ⓤ': 'u',
                    ｕ: 'u',
                    ù: 'u',
                    ú: 'u',
                    û: 'u',
                    ũ: 'u',
                    ṹ: 'u',
                    ū: 'u',
                    ṻ: 'u',
                    ŭ: 'u',
                    ü: 'u',
                    ǜ: 'u',
                    ǘ: 'u',
                    ǖ: 'u',
                    ǚ: 'u',
                    ủ: 'u',
                    ů: 'u',
                    ű: 'u',
                    ǔ: 'u',
                    ȕ: 'u',
                    ȗ: 'u',
                    ư: 'u',
                    ừ: 'u',
                    ứ: 'u',
                    ữ: 'u',
                    ử: 'u',
                    ự: 'u',
                    ụ: 'u',
                    ṳ: 'u',
                    ų: 'u',
                    ṷ: 'u',
                    ṵ: 'u',
                    ʉ: 'u',
                    'ⓥ': 'v',
                    ｖ: 'v',
                    ṽ: 'v',
                    ṿ: 'v',
                    ʋ: 'v',
                    ꝟ: 'v',
                    ʌ: 'v',
                    ꝡ: 'vy',
                    'ⓦ': 'w',
                    ｗ: 'w',
                    ẁ: 'w',
                    ẃ: 'w',
                    ŵ: 'w',
                    ẇ: 'w',
                    ẅ: 'w',
                    ẘ: 'w',
                    ẉ: 'w',
                    ⱳ: 'w',
                    'ⓧ': 'x',
                    ｘ: 'x',
                    ẋ: 'x',
                    ẍ: 'x',
                    'ⓨ': 'y',
                    ｙ: 'y',
                    ỳ: 'y',
                    ý: 'y',
                    ŷ: 'y',
                    ỹ: 'y',
                    ȳ: 'y',
                    ẏ: 'y',
                    ÿ: 'y',
                    ỷ: 'y',
                    ẙ: 'y',
                    ỵ: 'y',
                    ƴ: 'y',
                    ɏ: 'y',
                    ỿ: 'y',
                    'ⓩ': 'z',
                    ｚ: 'z',
                    ź: 'z',
                    ẑ: 'z',
                    ż: 'z',
                    ž: 'z',
                    ẓ: 'z',
                    ẕ: 'z',
                    ƶ: 'z',
                    ȥ: 'z',
                    ɀ: 'z',
                    ⱬ: 'z',
                    ꝣ: 'z',
                    Ά: 'Α',
                    Έ: 'Ε',
                    Ή: 'Η',
                    Ί: 'Ι',
                    Ϊ: 'Ι',
                    Ό: 'Ο',
                    Ύ: 'Υ',
                    Ϋ: 'Υ',
                    Ώ: 'Ω',
                    ά: 'α',
                    έ: 'ε',
                    ή: 'η',
                    ί: 'ι',
                    ϊ: 'ι',
                    ΐ: 'ι',
                    ό: 'ο',
                    ύ: 'υ',
                    ϋ: 'υ',
                    ΰ: 'υ',
                    ώ: 'ω',
                    ς: 'σ',
                    '’': "'",
                }
            }),
            u.define('select2/data/base', ['../utils'], function (n) {
                function s(e, t) {
                    s.__super__.constructor.call(this)
                }
                return (
                    n.Extend(s, n.Observable),
                    (s.prototype.current = function (e) {
                        throw new Error('The `current` method must be defined in child classes.')
                    }),
                    (s.prototype.query = function (e, t) {
                        throw new Error('The `query` method must be defined in child classes.')
                    }),
                    (s.prototype.bind = function (e, t) {}),
                    (s.prototype.destroy = function () {}),
                    (s.prototype.generateResultId = function (e, t) {
                        e = e.id + '-result-'
                        return (e += n.generateChars(4)), null != t.id ? (e += '-' + t.id.toString()) : (e += '-' + n.generateChars(4)), e
                    }),
                    s
                )
            }),
            u.define('select2/data/select', ['./base', '../utils', 'jquery'], function (e, a, l) {
                function n(e, t) {
                    ;(this.$element = e), (this.options = t), n.__super__.constructor.call(this)
                }
                return (
                    a.Extend(n, e),
                    (n.prototype.current = function (e) {
                        var t = this
                        e(
                            Array.prototype.map.call(this.$element[0].querySelectorAll(':checked'), function (e) {
                                return t.item(l(e))
                            }),
                        )
                    }),
                    (n.prototype.select = function (i) {
                        var e,
                            r = this
                        if (((i.selected = !0), null != i.element && 'option' === i.element.tagName.toLowerCase()))
                            return (i.element.selected = !0), void this.$element.trigger('input').trigger('change')
                        this.$element.prop('multiple')
                            ? this.current(function (e) {
                                  var t = []
                                  ;(i = [i]).push.apply(i, e)
                                  for (var n = 0; n < i.length; n++) {
                                      var s = i[n].id
                                      ;-1 === t.indexOf(s) && t.push(s)
                                  }
                                  r.$element.val(t), r.$element.trigger('input').trigger('change')
                              })
                            : ((e = i.id), this.$element.val(e), this.$element.trigger('input').trigger('change'))
                    }),
                    (n.prototype.unselect = function (i) {
                        var r = this
                        if (this.$element.prop('multiple')) {
                            if (((i.selected = !1), null != i.element && 'option' === i.element.tagName.toLowerCase()))
                                return (i.element.selected = !1), void this.$element.trigger('input').trigger('change')
                            this.current(function (e) {
                                for (var t = [], n = 0; n < e.length; n++) {
                                    var s = e[n].id
                                    s !== i.id && -1 === t.indexOf(s) && t.push(s)
                                }
                                r.$element.val(t), r.$element.trigger('input').trigger('change')
                            })
                        }
                    }),
                    (n.prototype.bind = function (e, t) {
                        var n = this
                        ;(this.container = e).on('select', function (e) {
                            n.select(e.data)
                        }),
                            e.on('unselect', function (e) {
                                n.unselect(e.data)
                            })
                    }),
                    (n.prototype.destroy = function () {
                        this.$element.find('*').each(function () {
                            a.RemoveData(this)
                        })
                    }),
                    (n.prototype.query = function (t, e) {
                        var n = [],
                            s = this
                        this.$element.children().each(function () {
                            var e
                            ;('option' !== this.tagName.toLowerCase() && 'optgroup' !== this.tagName.toLowerCase()) ||
                                ((e = l(this)), (e = s.item(e)), null !== (e = s.matches(t, e)) && n.push(e))
                        }),
                            e({ results: n })
                    }),
                    (n.prototype.addOptions = function (e) {
                        this.$element.append(e)
                    }),
                    (n.prototype.option = function (e) {
                        var t
                        e.children
                            ? ((t = document.createElement('optgroup')).label = e.text)
                            : void 0 !== (t = document.createElement('option')).textContent
                              ? (t.textContent = e.text)
                              : (t.innerText = e.text),
                            void 0 !== e.id && (t.value = e.id),
                            e.disabled && (t.disabled = !0),
                            e.selected && (t.selected = !0),
                            e.title && (t.title = e.title)
                        e = this._normalizeItem(e)
                        return (e.element = t), a.StoreData(t, 'data', e), l(t)
                    }),
                    (n.prototype.item = function (e) {
                        var t = {}
                        if (null != (t = a.GetData(e[0], 'data'))) return t
                        var n = e[0]
                        if ('option' === n.tagName.toLowerCase())
                            t = {
                                id: e.val(),
                                text: e.text(),
                                disabled: e.prop('disabled'),
                                selected: e.prop('selected'),
                                title: e.prop('title'),
                            }
                        else if ('optgroup' === n.tagName.toLowerCase()) {
                            t = {
                                text: e.prop('label'),
                                children: [],
                                title: e.prop('title'),
                            }
                            for (var s = e.children('option'), i = [], r = 0; r < s.length; r++) {
                                var o = l(s[r]),
                                    o = this.item(o)
                                i.push(o)
                            }
                            t.children = i
                        }
                        return ((t = this._normalizeItem(t)).element = e[0]), a.StoreData(e[0], 'data', t), t
                    }),
                    (n.prototype._normalizeItem = function (e) {
                        e !== Object(e) && (e = { id: e, text: e })
                        return (
                            null != (e = l.extend({}, { text: '' }, e)).id && (e.id = e.id.toString()),
                            null != e.text && (e.text = e.text.toString()),
                            null == e._resultId && e.id && null != this.container && (e._resultId = this.generateResultId(this.container, e)),
                            l.extend({}, { selected: !1, disabled: !1 }, e)
                        )
                    }),
                    (n.prototype.matches = function (e, t) {
                        return this.options.get('matcher')(e, t)
                    }),
                    n
                )
            }),
            u.define('select2/data/array', ['./select', '../utils', 'jquery'], function (e, t, c) {
                function s(e, t) {
                    ;(this._dataToConvert = t.get('data') || []), s.__super__.constructor.call(this, e, t)
                }
                return (
                    t.Extend(s, e),
                    (s.prototype.bind = function (e, t) {
                        s.__super__.bind.call(this, e, t), this.addOptions(this.convertToOptions(this._dataToConvert))
                    }),
                    (s.prototype.select = function (n) {
                        var e = this.$element.find('option').filter(function (e, t) {
                            return t.value == n.id.toString()
                        })
                        0 === e.length && ((e = this.option(n)), this.addOptions(e)), s.__super__.select.call(this, n)
                    }),
                    (s.prototype.convertToOptions = function (e) {
                        var t = this,
                            n = this.$element.find('option'),
                            s = n
                                .map(function () {
                                    return t.item(c(this)).id
                                })
                                .get(),
                            i = []
                        for (var r = 0; r < e.length; r++) {
                            var o,
                                a,
                                l = this._normalizeItem(e[r])
                            0 <= s.indexOf(l.id)
                                ? ((o = n.filter(
                                      (function (e) {
                                          return function () {
                                              return c(this).val() == e.id
                                          }
                                      })(l),
                                  )),
                                  (a = this.item(o)),
                                  (a = c.extend(!0, {}, l, a)),
                                  (a = this.option(a)),
                                  o.replaceWith(a))
                                : ((a = this.option(l)), l.children && ((l = this.convertToOptions(l.children)), a.append(l)), i.push(a))
                        }
                        return i
                    }),
                    s
                )
            }),
            u.define('select2/data/ajax', ['./array', '../utils', 'jquery'], function (e, t, r) {
                function n(e, t) {
                    ;(this.ajaxOptions = this._applyDefaults(t.get('ajax'))),
                        null != this.ajaxOptions.processResults && (this.processResults = this.ajaxOptions.processResults),
                        n.__super__.constructor.call(this, e, t)
                }
                return (
                    t.Extend(n, e),
                    (n.prototype._applyDefaults = function (e) {
                        var t = {
                            data: function (e) {
                                return r.extend({}, e, { q: e.term })
                            },
                            transport: function (e, t, n) {
                                e = r.ajax(e)
                                return e.then(t), e.fail(n), e
                            },
                        }
                        return r.extend({}, t, e, !0)
                    }),
                    (n.prototype.processResults = function (e) {
                        return e
                    }),
                    (n.prototype.query = function (t, n) {
                        var s = this
                        null != this._request && ('function' == typeof this._request.abort && this._request.abort(), (this._request = null))
                        var i = r.extend({ type: 'GET' }, this.ajaxOptions)
                        function e() {
                            var e = i.transport(
                                i,
                                function (e) {
                                    e = s.processResults(e, t)
                                    s.options.get('debug') &&
                                        window.console &&
                                        console.error &&
                                        ((e && e.results && Array.isArray(e.results)) ||
                                            console.error('Select2: The AJAX results did not return an array in the `results` key of the response.')),
                                        n(e)
                                },
                                function () {
                                    ;('status' in e && (0 === e.status || '0' === e.status)) ||
                                        s.trigger('results:message', { message: 'errorLoading' })
                                },
                            )
                            s._request = e
                        }
                        'function' == typeof i.url && (i.url = i.url.call(this.$element, t)),
                            'function' == typeof i.data && (i.data = i.data.call(this.$element, t)),
                            this.ajaxOptions.delay && null != t.term
                                ? (this._queryTimeout && window.clearTimeout(this._queryTimeout),
                                  (this._queryTimeout = window.setTimeout(e, this.ajaxOptions.delay)))
                                : e()
                    }),
                    n
                )
            }),
            u.define('select2/data/tags', ['jquery'], function (t) {
                function e(e, t, n) {
                    var s = n.get('tags'),
                        i = n.get('createTag')
                    void 0 !== i && (this.createTag = i)
                    i = n.get('insertTag')
                    if ((void 0 !== i && (this.insertTag = i), e.call(this, t, n), Array.isArray(s)))
                        for (var r = 0; r < s.length; r++) {
                            var o = s[r],
                                o = this._normalizeItem(o),
                                o = this.option(o)
                            this.$element.append(o)
                        }
                }
                return (
                    (e.prototype.query = function (e, c, u) {
                        var d = this
                        this._removeOldTags(),
                            null != c.term && null == c.page
                                ? e.call(this, c, function e(t, n) {
                                      for (var s = t.results, i = 0; i < s.length; i++) {
                                          var r = s[i],
                                              o = null != r.children && !e({ results: r.children }, !0)
                                          if ((r.text || '').toUpperCase() === (c.term || '').toUpperCase() || o)
                                              return !n && ((t.data = s), void u(t))
                                      }
                                      if (n) return !0
                                      var a,
                                          l = d.createTag(c)
                                      null != l && ((a = d.option(l)).attr('data-select2-tag', 'true'), d.addOptions([a]), d.insertTag(s, l)),
                                          (t.results = s),
                                          u(t)
                                  })
                                : e.call(this, c, u)
                    }),
                    (e.prototype.createTag = function (e, t) {
                        if (null == t.term) return null
                        t = t.term.trim()
                        return '' === t ? null : { id: t, text: t }
                    }),
                    (e.prototype.insertTag = function (e, t, n) {
                        t.unshift(n)
                    }),
                    (e.prototype._removeOldTags = function (e) {
                        this.$element.find('option[data-select2-tag]').each(function () {
                            this.selected || t(this).remove()
                        })
                    }),
                    e
                )
            }),
            u.define('select2/data/tokenizer', ['jquery'], function (c) {
                function e(e, t, n) {
                    var s = n.get('tokenizer')
                    void 0 !== s && (this.tokenizer = s), e.call(this, t, n)
                }
                return (
                    (e.prototype.bind = function (e, t, n) {
                        e.call(this, t, n), (this.$search = t.dropdown.$search || t.selection.$search || n.find('.select2-search__field'))
                    }),
                    (e.prototype.query = function (e, t, n) {
                        var s = this
                        t.term = t.term || ''
                        var i = this.tokenizer(t, this.options, function (e) {
                            var t,
                                n = s._normalizeItem(e)
                            s.$element.find('option').filter(function () {
                                return c(this).val() === n.id
                            }).length || ((t = s.option(n)).attr('data-select2-tag', !0), s._removeOldTags(), s.addOptions([t])),
                                (t = n),
                                s.trigger('select', { data: t })
                        })
                        i.term !== t.term && (this.$search.length && (this.$search.val(i.term), this.$search.trigger('focus')), (t.term = i.term)),
                            e.call(this, t, n)
                    }),
                    (e.prototype.tokenizer = function (e, t, n, s) {
                        for (
                            var i = n.get('tokenSeparators') || [],
                                r = t.term,
                                o = 0,
                                a =
                                    this.createTag ||
                                    function (e) {
                                        return { id: e.term, text: e.term }
                                    };
                            o < r.length;

                        ) {
                            var l = r[o]
                            ;-1 !== i.indexOf(l)
                                ? ((l = r.substr(0, o)),
                                  null != (l = a(c.extend({}, t, { term: l }))) ? (s(l), (r = r.substr(o + 1) || ''), (o = 0)) : o++)
                                : o++
                        }
                        return { term: r }
                    }),
                    e
                )
            }),
            u.define('select2/data/minimumInputLength', [], function () {
                function e(e, t, n) {
                    ;(this.minimumInputLength = n.get('minimumInputLength')), e.call(this, t, n)
                }
                return (
                    (e.prototype.query = function (e, t, n) {
                        ;(t.term = t.term || ''),
                            t.term.length < this.minimumInputLength
                                ? this.trigger('results:message', {
                                      message: 'inputTooShort',
                                      args: {
                                          minimum: this.minimumInputLength,
                                          input: t.term,
                                          params: t,
                                      },
                                  })
                                : e.call(this, t, n)
                    }),
                    e
                )
            }),
            u.define('select2/data/maximumInputLength', [], function () {
                function e(e, t, n) {
                    ;(this.maximumInputLength = n.get('maximumInputLength')), e.call(this, t, n)
                }
                return (
                    (e.prototype.query = function (e, t, n) {
                        ;(t.term = t.term || ''),
                            0 < this.maximumInputLength && t.term.length > this.maximumInputLength
                                ? this.trigger('results:message', {
                                      message: 'inputTooLong',
                                      args: {
                                          maximum: this.maximumInputLength,
                                          input: t.term,
                                          params: t,
                                      },
                                  })
                                : e.call(this, t, n)
                    }),
                    e
                )
            }),
            u.define('select2/data/maximumSelectionLength', [], function () {
                function e(e, t, n) {
                    ;(this.maximumSelectionLength = n.get('maximumSelectionLength')), e.call(this, t, n)
                }
                return (
                    (e.prototype.bind = function (e, t, n) {
                        var s = this
                        e.call(this, t, n),
                            t.on('select', function () {
                                s._checkIfMaximumSelected()
                            })
                    }),
                    (e.prototype.query = function (e, t, n) {
                        var s = this
                        this._checkIfMaximumSelected(function () {
                            e.call(s, t, n)
                        })
                    }),
                    (e.prototype._checkIfMaximumSelected = function (e, t) {
                        var n = this
                        this.current(function (e) {
                            e = null != e ? e.length : 0
                            0 < n.maximumSelectionLength && e >= n.maximumSelectionLength
                                ? n.trigger('results:message', {
                                      message: 'maximumSelected',
                                      args: { maximum: n.maximumSelectionLength },
                                  })
                                : t && t()
                        })
                    }),
                    e
                )
            }),
            u.define('select2/dropdown', ['jquery', './utils'], function (t, e) {
                function n(e, t) {
                    ;(this.$element = e), (this.options = t), n.__super__.constructor.call(this)
                }
                return (
                    e.Extend(n, e.Observable),
                    (n.prototype.render = function () {
                        var e = t('<span class="select2-dropdown"><span class="select2-results"></span></span>')
                        return e.attr('dir', this.options.get('dir')), (this.$dropdown = e)
                    }),
                    (n.prototype.bind = function () {}),
                    (n.prototype.position = function (e, t) {}),
                    (n.prototype.destroy = function () {
                        this.$dropdown.remove()
                    }),
                    n
                )
            }),
            u.define('select2/dropdown/search', ['jquery'], function (r) {
                function e() {}
                return (
                    (e.prototype.render = function (e) {
                        var t = e.call(this),
                            n = this.options.get('translations').get('search'),
                            e = r(
                                '<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" /></span>',
                            )
                        return (
                            (this.$searchContainer = e),
                            (this.$search = e.find('input')),
                            this.$search.prop('autocomplete', this.options.get('autocomplete')),
                            this.$search.attr('aria-label', n()),
                            t.prepend(e),
                            t
                        )
                    }),
                    (e.prototype.bind = function (e, t, n) {
                        var s = this,
                            i = t.id + '-results'
                        e.call(this, t, n),
                            this.$search.on('keydown', function (e) {
                                s.trigger('keypress', e), (s._keyUpPrevented = e.isDefaultPrevented())
                            }),
                            this.$search.on('input', function (e) {
                                r(this).off('keyup')
                            }),
                            this.$search.on('keyup input', function (e) {
                                s.handleSearch(e)
                            }),
                            t.on('open', function () {
                                s.$search.attr('tabindex', 0),
                                    s.$search.attr('aria-controls', i),
                                    s.$search.trigger('focus'),
                                    window.setTimeout(function () {
                                        s.$search.trigger('focus')
                                    }, 0)
                            }),
                            t.on('close', function () {
                                s.$search.attr('tabindex', -1),
                                    s.$search.removeAttr('aria-controls'),
                                    s.$search.removeAttr('aria-activedescendant'),
                                    s.$search.val(''),
                                    s.$search.trigger('blur')
                            }),
                            t.on('focus', function () {
                                t.isOpen() || s.$search.trigger('focus')
                            }),
                            t.on('results:all', function (e) {
                                ;(null != e.query.term && '' !== e.query.term) ||
                                    (s.showSearch(e)
                                        ? s.$searchContainer[0].classList.remove('select2-search--hide')
                                        : s.$searchContainer[0].classList.add('select2-search--hide'))
                            }),
                            t.on('results:focus', function (e) {
                                e.data._resultId
                                    ? s.$search.attr('aria-activedescendant', e.data._resultId)
                                    : s.$search.removeAttr('aria-activedescendant')
                            })
                    }),
                    (e.prototype.handleSearch = function (e) {
                        var t
                        this._keyUpPrevented || ((t = this.$search.val()), this.trigger('query', { term: t })), (this._keyUpPrevented = !1)
                    }),
                    (e.prototype.showSearch = function (e, t) {
                        return !0
                    }),
                    e
                )
            }),
            u.define('select2/dropdown/hidePlaceholder', [], function () {
                function e(e, t, n, s) {
                    ;(this.placeholder = this.normalizePlaceholder(n.get('placeholder'))), e.call(this, t, n, s)
                }
                return (
                    (e.prototype.append = function (e, t) {
                        ;(t.results = this.removePlaceholder(t.results)), e.call(this, t)
                    }),
                    (e.prototype.normalizePlaceholder = function (e, t) {
                        return (t = 'string' == typeof t ? { id: '', text: t } : t)
                    }),
                    (e.prototype.removePlaceholder = function (e, t) {
                        for (var n = t.slice(0), s = t.length - 1; 0 <= s; s--) {
                            var i = t[s]
                            this.placeholder.id === i.id && n.splice(s, 1)
                        }
                        return n
                    }),
                    e
                )
            }),
            u.define('select2/dropdown/infiniteScroll', ['jquery'], function (n) {
                function e(e, t, n, s) {
                    ;(this.lastParams = {}), e.call(this, t, n, s), (this.$loadingMore = this.createLoadingMore()), (this.loading = !1)
                }
                return (
                    (e.prototype.append = function (e, t) {
                        this.$loadingMore.remove(),
                            (this.loading = !1),
                            e.call(this, t),
                            this.showLoadingMore(t) && (this.$results.append(this.$loadingMore), this.loadMoreIfNeeded())
                    }),
                    (e.prototype.bind = function (e, t, n) {
                        var s = this
                        e.call(this, t, n),
                            t.on('query', function (e) {
                                ;(s.lastParams = e), (s.loading = !0)
                            }),
                            t.on('query:append', function (e) {
                                ;(s.lastParams = e), (s.loading = !0)
                            }),
                            this.$results.on('scroll', this.loadMoreIfNeeded.bind(this))
                    }),
                    (e.prototype.loadMoreIfNeeded = function () {
                        var e = n.contains(document.documentElement, this.$loadingMore[0])
                        !this.loading &&
                            e &&
                            ((e = this.$results.offset().top + this.$results.outerHeight(!1)),
                            this.$loadingMore.offset().top + this.$loadingMore.outerHeight(!1) <= e + 50 && this.loadMore())
                    }),
                    (e.prototype.loadMore = function () {
                        this.loading = !0
                        var e = n.extend({}, { page: 1 }, this.lastParams)
                        e.page++, this.trigger('query:append', e)
                    }),
                    (e.prototype.showLoadingMore = function (e, t) {
                        return t.pagination && t.pagination.more
                    }),
                    (e.prototype.createLoadingMore = function () {
                        var e = n('<li class="select2-results__option select2-results__option--load-more"role="option" aria-disabled="true"></li>'),
                            t = this.options.get('translations').get('loadingMore')
                        return e.html(t(this.lastParams)), e
                    }),
                    e
                )
            }),
            u.define('select2/dropdown/attachBody', ['jquery', '../utils'], function (u, o) {
                function e(e, t, n) {
                    ;(this.$dropdownParent = u(n.get('dropdownParent') || document.body)), e.call(this, t, n)
                }
                return (
                    (e.prototype.bind = function (e, t, n) {
                        var s = this
                        e.call(this, t, n),
                            t.on('open', function () {
                                s._showDropdown(), s._attachPositioningHandler(t), s._bindContainerResultHandlers(t)
                            }),
                            t.on('close', function () {
                                s._hideDropdown(), s._detachPositioningHandler(t)
                            }),
                            this.$dropdownContainer.on('mousedown', function (e) {
                                e.stopPropagation()
                            })
                    }),
                    (e.prototype.destroy = function (e) {
                        e.call(this), this.$dropdownContainer.remove()
                    }),
                    (e.prototype.position = function (e, t, n) {
                        t.attr('class', n.attr('class')),
                            t[0].classList.remove('select2'),
                            t[0].classList.add('select2-container--open'),
                            t.css({ position: 'absolute', top: -999999 }),
                            (this.$container = n)
                    }),
                    (e.prototype.render = function (e) {
                        var t = u('<span></span>'),
                            e = e.call(this)
                        return t.append(e), (this.$dropdownContainer = t)
                    }),
                    (e.prototype._hideDropdown = function (e) {
                        this.$dropdownContainer.detach()
                    }),
                    (e.prototype._bindContainerResultHandlers = function (e, t) {
                        var n
                        this._containerResultsHandlersBound ||
                            ((n = this),
                            t.on('results:all', function () {
                                n._positionDropdown(), n._resizeDropdown()
                            }),
                            t.on('results:append', function () {
                                n._positionDropdown(), n._resizeDropdown()
                            }),
                            t.on('results:message', function () {
                                n._positionDropdown(), n._resizeDropdown()
                            }),
                            t.on('select', function () {
                                n._positionDropdown(), n._resizeDropdown()
                            }),
                            t.on('unselect', function () {
                                n._positionDropdown(), n._resizeDropdown()
                            }),
                            (this._containerResultsHandlersBound = !0))
                    }),
                    (e.prototype._attachPositioningHandler = function (e, t) {
                        var n = this,
                            s = 'scroll.select2.' + t.id,
                            i = 'resize.select2.' + t.id,
                            r = 'orientationchange.select2.' + t.id,
                            t = this.$container.parents().filter(o.hasScroll)
                        t.each(function () {
                            o.StoreData(this, 'select2-scroll-position', {
                                x: u(this).scrollLeft(),
                                y: u(this).scrollTop(),
                            })
                        }),
                            t.on(s, function (e) {
                                var t = o.GetData(this, 'select2-scroll-position')
                                u(this).scrollTop(t.y)
                            }),
                            u(window).on(s + ' ' + i + ' ' + r, function (e) {
                                n._positionDropdown(), n._resizeDropdown()
                            })
                    }),
                    (e.prototype._detachPositioningHandler = function (e, t) {
                        var n = 'scroll.select2.' + t.id,
                            s = 'resize.select2.' + t.id,
                            t = 'orientationchange.select2.' + t.id
                        this.$container.parents().filter(o.hasScroll).off(n), u(window).off(n + ' ' + s + ' ' + t)
                    }),
                    (e.prototype._positionDropdown = function () {
                        var e = u(window),
                            t = this.$dropdown[0].classList.contains('select2-dropdown--above'),
                            n = this.$dropdown[0].classList.contains('select2-dropdown--below'),
                            s = null,
                            i = this.$container.offset()
                        i.bottom = i.top + this.$container.outerHeight(!1)
                        var r = { height: this.$container.outerHeight(!1) }
                        ;(r.top = i.top), (r.bottom = i.top + r.height)
                        var o = this.$dropdown.outerHeight(!1),
                            a = e.scrollTop(),
                            l = e.scrollTop() + e.height(),
                            c = a < i.top - o,
                            e = l > i.bottom + o,
                            a = { left: i.left, top: r.bottom },
                            l = this.$dropdownParent
                        'static' === l.css('position') && (l = l.offsetParent())
                        i = { top: 0, left: 0 }
                        ;(u.contains(document.body, l[0]) || l[0].isConnected) && (i = l.offset()),
                            (a.top -= i.top),
                            (a.left -= i.left),
                            t || n || (s = 'below'),
                            e || !c || t ? !c && e && t && (s = 'below') : (s = 'above'),
                            ('above' == s || (t && 'below' !== s)) && (a.top = r.top - i.top - o),
                            null != s &&
                                (this.$dropdown[0].classList.remove('select2-dropdown--below'),
                                this.$dropdown[0].classList.remove('select2-dropdown--above'),
                                this.$dropdown[0].classList.add('select2-dropdown--' + s),
                                this.$container[0].classList.remove('select2-container--below'),
                                this.$container[0].classList.remove('select2-container--above'),
                                this.$container[0].classList.add('select2-container--' + s)),
                            this.$dropdownContainer.css(a)
                    }),
                    (e.prototype._resizeDropdown = function () {
                        var e = { width: this.$container.outerWidth(!1) + 'px' }
                        this.options.get('dropdownAutoWidth') && ((e.minWidth = e.width), (e.position = 'relative'), (e.width = 'auto')),
                            this.$dropdown.css(e)
                    }),
                    (e.prototype._showDropdown = function (e) {
                        this.$dropdownContainer.appendTo(this.$dropdownParent), this._positionDropdown(), this._resizeDropdown()
                    }),
                    e
                )
            }),
            u.define('select2/dropdown/minimumResultsForSearch', [], function () {
                function e(e, t, n, s) {
                    ;(this.minimumResultsForSearch = n.get('minimumResultsForSearch')),
                        this.minimumResultsForSearch < 0 && (this.minimumResultsForSearch = 1 / 0),
                        e.call(this, t, n, s)
                }
                return (
                    (e.prototype.showSearch = function (e, t) {
                        return (
                            !(
                                (function e(t) {
                                    for (var n = 0, s = 0; s < t.length; s++) {
                                        var i = t[s]
                                        i.children ? (n += e(i.children)) : n++
                                    }
                                    return n
                                })(t.data.results) < this.minimumResultsForSearch
                            ) && e.call(this, t)
                        )
                    }),
                    e
                )
            }),
            u.define('select2/dropdown/selectOnClose', ['../utils'], function (s) {
                function e() {}
                return (
                    (e.prototype.bind = function (e, t, n) {
                        var s = this
                        e.call(this, t, n),
                            t.on('close', function (e) {
                                s._handleSelectOnClose(e)
                            })
                    }),
                    (e.prototype._handleSelectOnClose = function (e, t) {
                        if (t && null != t.originalSelect2Event) {
                            var n = t.originalSelect2Event
                            if ('select' === n._type || 'unselect' === n._type) return
                        }
                        n = this.getHighlightedResults()
                        n.length < 1 ||
                            (null != (n = s.GetData(n[0], 'data')).element && n.element.selected) ||
                            (null == n.element && n.selected) ||
                            this.trigger('select', { data: n })
                    }),
                    e
                )
            }),
            u.define('select2/dropdown/closeOnSelect', [], function () {
                function e() {}
                return (
                    (e.prototype.bind = function (e, t, n) {
                        var s = this
                        e.call(this, t, n),
                            t.on('select', function (e) {
                                s._selectTriggered(e)
                            }),
                            t.on('unselect', function (e) {
                                s._selectTriggered(e)
                            })
                    }),
                    (e.prototype._selectTriggered = function (e, t) {
                        var n = t.originalEvent
                        ;(n && (n.ctrlKey || n.metaKey)) ||
                            this.trigger('close', {
                                originalEvent: n,
                                originalSelect2Event: t,
                            })
                    }),
                    e
                )
            }),
            u.define('select2/dropdown/dropdownCss', ['../utils'], function (n) {
                function e() {}
                return (
                    (e.prototype.render = function (e) {
                        var t = e.call(this),
                            e = this.options.get('dropdownCssClass') || ''
                        return (
                            -1 !== e.indexOf(':all:') && ((e = e.replace(':all:', '')), n.copyNonInternalCssClasses(t[0], this.$element[0])),
                            t.addClass(e),
                            t
                        )
                    }),
                    e
                )
            }),
            u.define('select2/dropdown/tagsSearchHighlight', ['../utils'], function (s) {
                function e() {}
                return (
                    (e.prototype.highlightFirstItem = function (e) {
                        var t = this.$results.find('.select2-results__option--selectable:not(.select2-results__option--selected)')
                        if (0 < t.length) {
                            var n = t.first(),
                                t = s.GetData(n[0], 'data').element
                            if (t && t.getAttribute && 'true' === t.getAttribute('data-select2-tag')) return void n.trigger('mouseenter')
                        }
                        e.call(this)
                    }),
                    e
                )
            }),
            u.define('select2/i18n/en', [], function () {
                return {
                    errorLoading: function () {
                        return 'The results could not be loaded.'
                    },
                    inputTooLong: function (e) {
                        var t = e.input.length - e.maximum,
                            e = 'Please delete ' + t + ' character'
                        return 1 != t && (e += 's'), e
                    },
                    inputTooShort: function (e) {
                        return 'Please enter ' + (e.minimum - e.input.length) + ' or more characters'
                    },
                    loadingMore: function () {
                        return 'Loading more results…'
                    },
                    maximumSelected: function (e) {
                        var t = 'You can only select ' + e.maximum + ' item'
                        return 1 != e.maximum && (t += 's'), t
                    },
                    noResults: function () {
                        return 'No results found'
                    },
                    searching: function () {
                        return 'Searching…'
                    },
                    removeAllItems: function () {
                        return 'Remove all items'
                    },
                    removeItem: function () {
                        return 'Remove item'
                    },
                    search: function () {
                        return 'Search'
                    },
                }
            }),
            u.define(
                'select2/defaults',
                [
                    'jquery',
                    './results',
                    './selection/single',
                    './selection/multiple',
                    './selection/placeholder',
                    './selection/allowClear',
                    './selection/search',
                    './selection/selectionCss',
                    './selection/eventRelay',
                    './utils',
                    './translation',
                    './diacritics',
                    './data/select',
                    './data/array',
                    './data/ajax',
                    './data/tags',
                    './data/tokenizer',
                    './data/minimumInputLength',
                    './data/maximumInputLength',
                    './data/maximumSelectionLength',
                    './dropdown',
                    './dropdown/search',
                    './dropdown/hidePlaceholder',
                    './dropdown/infiniteScroll',
                    './dropdown/attachBody',
                    './dropdown/minimumResultsForSearch',
                    './dropdown/selectOnClose',
                    './dropdown/closeOnSelect',
                    './dropdown/dropdownCss',
                    './dropdown/tagsSearchHighlight',
                    './i18n/en',
                ],
                function (l, r, o, a, c, u, d, p, h, f, g, t, m, y, v, _, b, $, w, x, A, D, S, E, O, C, L, T, q, I, e) {
                    function n() {
                        this.reset()
                    }
                    return (
                        (n.prototype.apply = function (e) {
                            var t
                            null == (e = l.extend(!0, {}, this.defaults, e)).dataAdapter &&
                                (null != e.ajax ? (e.dataAdapter = v) : null != e.data ? (e.dataAdapter = y) : (e.dataAdapter = m),
                                0 < e.minimumInputLength && (e.dataAdapter = f.Decorate(e.dataAdapter, $)),
                                0 < e.maximumInputLength && (e.dataAdapter = f.Decorate(e.dataAdapter, w)),
                                0 < e.maximumSelectionLength && (e.dataAdapter = f.Decorate(e.dataAdapter, x)),
                                e.tags && (e.dataAdapter = f.Decorate(e.dataAdapter, _)),
                                (null == e.tokenSeparators && null == e.tokenizer) || (e.dataAdapter = f.Decorate(e.dataAdapter, b))),
                                null == e.resultsAdapter &&
                                    ((e.resultsAdapter = r),
                                    null != e.ajax && (e.resultsAdapter = f.Decorate(e.resultsAdapter, E)),
                                    null != e.placeholder && (e.resultsAdapter = f.Decorate(e.resultsAdapter, S)),
                                    e.selectOnClose && (e.resultsAdapter = f.Decorate(e.resultsAdapter, L)),
                                    e.tags && (e.resultsAdapter = f.Decorate(e.resultsAdapter, I))),
                                null == e.dropdownAdapter &&
                                    (e.multiple ? (e.dropdownAdapter = A) : ((t = f.Decorate(A, D)), (e.dropdownAdapter = t)),
                                    0 !== e.minimumResultsForSearch && (e.dropdownAdapter = f.Decorate(e.dropdownAdapter, C)),
                                    e.closeOnSelect && (e.dropdownAdapter = f.Decorate(e.dropdownAdapter, T)),
                                    null != e.dropdownCssClass && (e.dropdownAdapter = f.Decorate(e.dropdownAdapter, q)),
                                    (e.dropdownAdapter = f.Decorate(e.dropdownAdapter, O))),
                                null == e.selectionAdapter &&
                                    (e.multiple ? (e.selectionAdapter = a) : (e.selectionAdapter = o),
                                    null != e.placeholder && (e.selectionAdapter = f.Decorate(e.selectionAdapter, c)),
                                    e.allowClear && (e.selectionAdapter = f.Decorate(e.selectionAdapter, u)),
                                    e.multiple && (e.selectionAdapter = f.Decorate(e.selectionAdapter, d)),
                                    null != e.selectionCssClass && (e.selectionAdapter = f.Decorate(e.selectionAdapter, p)),
                                    (e.selectionAdapter = f.Decorate(e.selectionAdapter, h))),
                                (e.language = this._resolveLanguage(e.language)),
                                e.language.push('en')
                            for (var n = [], s = 0; s < e.language.length; s++) {
                                var i = e.language[s]
                                ;-1 === n.indexOf(i) && n.push(i)
                            }
                            return (e.language = n), (e.translations = this._processTranslations(e.language, e.debug)), e
                        }),
                        (n.prototype.reset = function () {
                            function a(e) {
                                return e.replace(/[^\u0000-\u007E]/g, function (e) {
                                    return t[e] || e
                                })
                            }
                            this.defaults = {
                                amdLanguageBase: './i18n/',
                                autocomplete: 'off',
                                closeOnSelect: !0,
                                debug: !1,
                                dropdownAutoWidth: !1,
                                escapeMarkup: f.escapeMarkup,
                                language: {},
                                matcher: function e(t, n) {
                                    if (null == t.term || '' === t.term.trim()) return n
                                    if (n.children && 0 < n.children.length) {
                                        for (var s = l.extend(!0, {}, n), i = n.children.length - 1; 0 <= i; i--)
                                            null == e(t, n.children[i]) && s.children.splice(i, 1)
                                        return 0 < s.children.length ? s : e(t, s)
                                    }
                                    var r = a(n.text).toUpperCase(),
                                        o = a(t.term).toUpperCase()
                                    return -1 < r.indexOf(o) ? n : null
                                },
                                minimumInputLength: 0,
                                maximumInputLength: 0,
                                maximumSelectionLength: 0,
                                minimumResultsForSearch: 0,
                                selectOnClose: !1,
                                scrollAfterSelect: !1,
                                sorter: function (e) {
                                    return e
                                },
                                templateResult: function (e) {
                                    return e.text
                                },
                                templateSelection: function (e) {
                                    return e.text
                                },
                                theme: 'default',
                                width: 'resolve',
                            }
                        }),
                        (n.prototype.applyFromElement = function (e, t) {
                            var n = e.language,
                                s = this.defaults.language,
                                i = t.prop('lang'),
                                t = t.closest('[lang]').prop('lang'),
                                t = Array.prototype.concat.call(
                                    this._resolveLanguage(i),
                                    this._resolveLanguage(n),
                                    this._resolveLanguage(s),
                                    this._resolveLanguage(t),
                                )
                            return (e.language = t), e
                        }),
                        (n.prototype._resolveLanguage = function (e) {
                            if (!e) return []
                            if (l.isEmptyObject(e)) return []
                            if (l.isPlainObject(e)) return [e]
                            for (var t, n = Array.isArray(e) ? e : [e], s = [], i = 0; i < n.length; i++)
                                s.push(n[i]), 'string' == typeof n[i] && 0 < n[i].indexOf('-') && ((t = n[i].split('-')[0]), s.push(t))
                            return s
                        }),
                        (n.prototype._processTranslations = function (e, t) {
                            for (var n = new g(), s = 0; s < e.length; s++) {
                                var i = new g(),
                                    r = e[s]
                                if ('string' == typeof r)
                                    try {
                                        i = g.loadPath(r)
                                    } catch (e) {
                                        try {
                                            ;(r = this.defaults.amdLanguageBase + r), (i = g.loadPath(r))
                                        } catch (e) {
                                            t &&
                                                window.console &&
                                                console.warn &&
                                                console.warn(
                                                    'Select2: The language file for "' +
                                                        r +
                                                        '" could not be automatically loaded. A fallback will be used instead.',
                                                )
                                        }
                                    }
                                else i = l.isPlainObject(r) ? new g(r) : r
                                n.extend(i)
                            }
                            return n
                        }),
                        (n.prototype.set = function (e, t) {
                            var n = {}
                            n[l.camelCase(e)] = t
                            n = f._convertData(n)
                            l.extend(!0, this.defaults, n)
                        }),
                        new n()
                    )
                },
            ),
            u.define('select2/options', ['jquery', './defaults', './utils'], function (c, n, u) {
                function e(e, t) {
                    ;(this.options = e),
                        null != t && this.fromElement(t),
                        null != t && (this.options = n.applyFromElement(this.options, t)),
                        (this.options = n.apply(this.options))
                }
                return (
                    (e.prototype.fromElement = function (e) {
                        var t = ['select2']
                        null == this.options.multiple && (this.options.multiple = e.prop('multiple')),
                            null == this.options.disabled && (this.options.disabled = e.prop('disabled')),
                            null == this.options.autocomplete && e.prop('autocomplete') && (this.options.autocomplete = e.prop('autocomplete')),
                            null == this.options.dir &&
                                (e.prop('dir')
                                    ? (this.options.dir = e.prop('dir'))
                                    : e.closest('[dir]').prop('dir')
                                      ? (this.options.dir = e.closest('[dir]').prop('dir'))
                                      : (this.options.dir = 'ltr')),
                            e.prop('disabled', this.options.disabled),
                            e.prop('multiple', this.options.multiple),
                            u.GetData(e[0], 'select2Tags') &&
                                (this.options.debug &&
                                    window.console &&
                                    console.warn &&
                                    console.warn(
                                        'Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.',
                                    ),
                                u.StoreData(e[0], 'data', u.GetData(e[0], 'select2Tags')),
                                u.StoreData(e[0], 'tags', !0)),
                            u.GetData(e[0], 'ajaxUrl') &&
                                (this.options.debug &&
                                    window.console &&
                                    console.warn &&
                                    console.warn(
                                        'Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2.',
                                    ),
                                e.attr('ajax--url', u.GetData(e[0], 'ajaxUrl')),
                                u.StoreData(e[0], 'ajax-Url', u.GetData(e[0], 'ajaxUrl')))
                        var n = {}
                        function s(e, t) {
                            return t.toUpperCase()
                        }
                        for (var i = 0; i < e[0].attributes.length; i++) {
                            var r = e[0].attributes[i].name,
                                o = 'data-'
                            r.substr(0, o.length) == o && ((r = r.substring(o.length)), (o = u.GetData(e[0], r)), (n[r.replace(/-([a-z])/g, s)] = o))
                        }
                        c.fn.jquery && '1.' == c.fn.jquery.substr(0, 2) && e[0].dataset && (n = c.extend(!0, {}, e[0].dataset, n))
                        var a,
                            l = c.extend(!0, {}, u.GetData(e[0]), n)
                        for (a in (l = u._convertData(l)))
                            -1 < t.indexOf(a) || (c.isPlainObject(this.options[a]) ? c.extend(this.options[a], l[a]) : (this.options[a] = l[a]))
                        return this
                    }),
                    (e.prototype.get = function (e) {
                        return this.options[e]
                    }),
                    (e.prototype.set = function (e, t) {
                        this.options[e] = t
                    }),
                    e
                )
            }),
            u.define('select2/core', ['jquery', './options', './utils', './keys'], function (t, i, r, s) {
                var o = function (e, t) {
                    null != r.GetData(e[0], 'select2') && r.GetData(e[0], 'select2').destroy(),
                        (this.$element = e),
                        (this.id = this._generateId(e)),
                        (t = t || {}),
                        (this.options = new i(t, e)),
                        o.__super__.constructor.call(this)
                    var n = e.attr('tabindex') || 0
                    r.StoreData(e[0], 'old-tabindex', n), e.attr('tabindex', '-1')
                    t = this.options.get('dataAdapter')
                    this.dataAdapter = new t(e, this.options)
                    n = this.render()
                    this._placeContainer(n)
                    t = this.options.get('selectionAdapter')
                    ;(this.selection = new t(e, this.options)),
                        (this.$selection = this.selection.render()),
                        this.selection.position(this.$selection, n)
                    t = this.options.get('dropdownAdapter')
                    ;(this.dropdown = new t(e, this.options)), (this.$dropdown = this.dropdown.render()), this.dropdown.position(this.$dropdown, n)
                    n = this.options.get('resultsAdapter')
                    ;(this.results = new n(e, this.options, this.dataAdapter)),
                        (this.$results = this.results.render()),
                        this.results.position(this.$results, this.$dropdown)
                    var s = this
                    this._bindAdapters(),
                        this._registerDomEvents(),
                        this._registerDataEvents(),
                        this._registerSelectionEvents(),
                        this._registerDropdownEvents(),
                        this._registerResultsEvents(),
                        this._registerEvents(),
                        this.dataAdapter.current(function (e) {
                            s.trigger('selection:update', { data: e })
                        }),
                        e[0].classList.add('select2-hidden-accessible'),
                        e.attr('aria-hidden', 'true'),
                        this._syncAttributes(),
                        r.StoreData(e[0], 'select2', this),
                        e.data('select2', this)
                }
                return (
                    r.Extend(o, r.Observable),
                    (o.prototype._generateId = function (e) {
                        return (
                            'select2-' +
                            (null != e.attr('id')
                                ? e.attr('id')
                                : null != e.attr('name')
                                  ? e.attr('name') + '-' + r.generateChars(2)
                                  : r.generateChars(4)
                            ).replace(/(:|\.|\[|\]|,)/g, '')
                        )
                    }),
                    (o.prototype._placeContainer = function (e) {
                        e.insertAfter(this.$element)
                        var t = this._resolveWidth(this.$element, this.options.get('width'))
                        null != t && e.css('width', t)
                    }),
                    (o.prototype._resolveWidth = function (e, t) {
                        var n = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i
                        if ('resolve' == t) {
                            var s = this._resolveWidth(e, 'style')
                            return null != s ? s : this._resolveWidth(e, 'element')
                        }
                        if ('element' == t) {
                            s = e.outerWidth(!1)
                            return s <= 0 ? 'auto' : s + 'px'
                        }
                        if ('style' != t) return 'computedstyle' != t ? t : window.getComputedStyle(e[0]).width
                        e = e.attr('style')
                        if ('string' != typeof e) return null
                        for (var i = e.split(';'), r = 0, o = i.length; r < o; r += 1) {
                            var a = i[r].replace(/\s/g, '').match(n)
                            if (null !== a && 1 <= a.length) return a[1]
                        }
                        return null
                    }),
                    (o.prototype._bindAdapters = function () {
                        this.dataAdapter.bind(this, this.$container),
                            this.selection.bind(this, this.$container),
                            this.dropdown.bind(this, this.$container),
                            this.results.bind(this, this.$container)
                    }),
                    (o.prototype._registerDomEvents = function () {
                        var t = this
                        this.$element.on('change.select2', function () {
                            t.dataAdapter.current(function (e) {
                                t.trigger('selection:update', { data: e })
                            })
                        }),
                            this.$element.on('focus.select2', function (e) {
                                t.trigger('focus', e)
                            }),
                            (this._syncA = r.bind(this._syncAttributes, this)),
                            (this._syncS = r.bind(this._syncSubtree, this)),
                            (this._observer = new window.MutationObserver(function (e) {
                                t._syncA(), t._syncS(e)
                            })),
                            this._observer.observe(this.$element[0], {
                                attributes: !0,
                                childList: !0,
                                subtree: !1,
                            })
                    }),
                    (o.prototype._registerDataEvents = function () {
                        var n = this
                        this.dataAdapter.on('*', function (e, t) {
                            n.trigger(e, t)
                        })
                    }),
                    (o.prototype._registerSelectionEvents = function () {
                        var n = this,
                            s = ['toggle', 'focus']
                        this.selection.on('toggle', function () {
                            n.toggleDropdown()
                        }),
                            this.selection.on('focus', function (e) {
                                n.focus(e)
                            }),
                            this.selection.on('*', function (e, t) {
                                ;-1 === s.indexOf(e) && n.trigger(e, t)
                            })
                    }),
                    (o.prototype._registerDropdownEvents = function () {
                        var n = this
                        this.dropdown.on('*', function (e, t) {
                            n.trigger(e, t)
                        })
                    }),
                    (o.prototype._registerResultsEvents = function () {
                        var n = this
                        this.results.on('*', function (e, t) {
                            n.trigger(e, t)
                        })
                    }),
                    (o.prototype._registerEvents = function () {
                        var n = this
                        this.on('open', function () {
                            n.$container[0].classList.add('select2-container--open')
                        }),
                            this.on('close', function () {
                                n.$container[0].classList.remove('select2-container--open')
                            }),
                            this.on('enable', function () {
                                n.$container[0].classList.remove('select2-container--disabled')
                            }),
                            this.on('disable', function () {
                                n.$container[0].classList.add('select2-container--disabled')
                            }),
                            this.on('blur', function () {
                                n.$container[0].classList.remove('select2-container--focus')
                            }),
                            this.on('query', function (t) {
                                n.isOpen() || n.trigger('open', {}),
                                    this.dataAdapter.query(t, function (e) {
                                        n.trigger('results:all', { data: e, query: t })
                                    })
                            }),
                            this.on('query:append', function (t) {
                                this.dataAdapter.query(t, function (e) {
                                    n.trigger('results:append', { data: e, query: t })
                                })
                            }),
                            this.on('keypress', function (e) {
                                var t = e.which
                                n.isOpen()
                                    ? t === s.ESC || (t === s.UP && e.altKey)
                                        ? (n.close(e), e.preventDefault())
                                        : t === s.ENTER || t === s.TAB
                                          ? (n.trigger('results:select', {}), e.preventDefault())
                                          : t === s.SPACE && e.ctrlKey
                                            ? (n.trigger('results:toggle', {}), e.preventDefault())
                                            : t === s.UP
                                              ? (n.trigger('results:previous', {}), e.preventDefault())
                                              : t === s.DOWN && (n.trigger('results:next', {}), e.preventDefault())
                                    : (t === s.ENTER || t === s.SPACE || (t === s.DOWN && e.altKey)) && (n.open(), e.preventDefault())
                            })
                    }),
                    (o.prototype._syncAttributes = function () {
                        this.options.set('disabled', this.$element.prop('disabled')),
                            this.isDisabled() ? (this.isOpen() && this.close(), this.trigger('disable', {})) : this.trigger('enable', {})
                    }),
                    (o.prototype._isChangeMutation = function (e) {
                        var t = this
                        if (e.addedNodes && 0 < e.addedNodes.length) {
                            for (var n = 0; n < e.addedNodes.length; n++) if (e.addedNodes[n].selected) return !0
                        } else {
                            if (e.removedNodes && 0 < e.removedNodes.length) return !0
                            if (Array.isArray(e))
                                return e.some(function (e) {
                                    return t._isChangeMutation(e)
                                })
                        }
                        return !1
                    }),
                    (o.prototype._syncSubtree = function (e) {
                        var e = this._isChangeMutation(e),
                            t = this
                        e &&
                            this.dataAdapter.current(function (e) {
                                t.trigger('selection:update', { data: e })
                            })
                    }),
                    (o.prototype.trigger = function (e, t) {
                        var n = o.__super__.trigger,
                            s = {
                                open: 'opening',
                                close: 'closing',
                                select: 'selecting',
                                unselect: 'unselecting',
                                clear: 'clearing',
                            }
                        if ((void 0 === t && (t = {}), e in s)) {
                            var i = s[e],
                                s = { prevented: !1, name: e, args: t }
                            if ((n.call(this, i, s), s.prevented)) return void (t.prevented = !0)
                        }
                        n.call(this, e, t)
                    }),
                    (o.prototype.toggleDropdown = function () {
                        this.isDisabled() || (this.isOpen() ? this.close() : this.open())
                    }),
                    (o.prototype.open = function () {
                        this.isOpen() || this.isDisabled() || this.trigger('query', {})
                    }),
                    (o.prototype.close = function (e) {
                        this.isOpen() && this.trigger('close', { originalEvent: e })
                    }),
                    (o.prototype.isEnabled = function () {
                        return !this.isDisabled()
                    }),
                    (o.prototype.isDisabled = function () {
                        return this.options.get('disabled')
                    }),
                    (o.prototype.isOpen = function () {
                        return this.$container[0].classList.contains('select2-container--open')
                    }),
                    (o.prototype.hasFocus = function () {
                        return this.$container[0].classList.contains('select2-container--focus')
                    }),
                    (o.prototype.focus = function (e) {
                        this.hasFocus() || (this.$container[0].classList.add('select2-container--focus'), this.trigger('focus', {}))
                    }),
                    (o.prototype.enable = function (e) {
                        this.options.get('debug') &&
                            window.console &&
                            console.warn &&
                            console.warn(
                                'Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.',
                            )
                        e = !(e = null == e || 0 === e.length ? [!0] : e)[0]
                        this.$element.prop('disabled', e)
                    }),
                    (o.prototype.data = function () {
                        this.options.get('debug') &&
                            0 < arguments.length &&
                            window.console &&
                            console.warn &&
                            console.warn(
                                'Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.',
                            )
                        var t = []
                        return (
                            this.dataAdapter.current(function (e) {
                                t = e
                            }),
                            t
                        )
                    }),
                    (o.prototype.val = function (e) {
                        if (
                            (this.options.get('debug') &&
                                window.console &&
                                console.warn &&
                                console.warn(
                                    'Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.',
                                ),
                            null == e || 0 === e.length)
                        )
                            return this.$element.val()
                        e = e[0]
                        Array.isArray(e) &&
                            (e = e.map(function (e) {
                                return e.toString()
                            })),
                            this.$element.val(e).trigger('input').trigger('change')
                    }),
                    (o.prototype.destroy = function () {
                        r.RemoveData(this.$container[0]),
                            this.$container.remove(),
                            this._observer.disconnect(),
                            (this._observer = null),
                            (this._syncA = null),
                            (this._syncS = null),
                            this.$element.off('.select2'),
                            this.$element.attr('tabindex', r.GetData(this.$element[0], 'old-tabindex')),
                            this.$element[0].classList.remove('select2-hidden-accessible'),
                            this.$element.attr('aria-hidden', 'false'),
                            r.RemoveData(this.$element[0]),
                            this.$element.removeData('select2'),
                            this.dataAdapter.destroy(),
                            this.selection.destroy(),
                            this.dropdown.destroy(),
                            this.results.destroy(),
                            (this.dataAdapter = null),
                            (this.selection = null),
                            (this.dropdown = null),
                            (this.results = null)
                    }),
                    (o.prototype.render = function () {
                        var e = t(
                            '<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>',
                        )
                        return (
                            e.attr('dir', this.options.get('dir')),
                            (this.$container = e),
                            this.$container[0].classList.add('select2-container--' + this.options.get('theme')),
                            r.StoreData(e[0], 'element', this.$element),
                            e
                        )
                    }),
                    o
                )
            }),
            u.define('jquery-mousewheel', ['jquery'], function (e) {
                return e
            }),
            u.define(
                'jquery.select2',
                ['jquery', 'jquery-mousewheel', './select2/core', './select2/defaults', './select2/utils'],
                function (i, e, r, t, o) {
                    var a
                    return (
                        null == i.fn.select2 &&
                            ((a = ['open', 'close', 'destroy']),
                            (i.fn.select2 = function (t) {
                                if ('object' == typeof (t = t || {}))
                                    return (
                                        this.each(function () {
                                            var e = i.extend(!0, {}, t)
                                            new r(i(this), e)
                                        }),
                                        this
                                    )
                                if ('string' != typeof t) throw new Error('Invalid arguments for Select2: ' + t)
                                var n,
                                    s = Array.prototype.slice.call(arguments, 1)
                                return (
                                    this.each(function () {
                                        var e = o.GetData(this, 'select2')
                                        null == e &&
                                            window.console &&
                                            console.error &&
                                            console.error("The select2('" + t + "') method was called on an element that is not using Select2."),
                                            (n = e[t].apply(e, s))
                                    }),
                                    -1 < a.indexOf(t) ? this : n
                                )
                            })),
                        null == i.fn.select2.defaults && (i.fn.select2.defaults = t),
                        r
                    )
                },
            ),
            { define: u.define, require: u.require })
    function b(e, t) {
        return i.call(e, t)
    }
    function l(e, t) {
        var n,
            s,
            i,
            r,
            o,
            a,
            l,
            c,
            u,
            d,
            p = t && t.split('/'),
            h = y.map,
            f = (h && h['*']) || {}
        if (e) {
            for (
                t = (e = e.split('/')).length - 1,
                    y.nodeIdCompat && _.test(e[t]) && (e[t] = e[t].replace(_, '')),
                    '.' === e[0].charAt(0) && p && (e = p.slice(0, p.length - 1).concat(e)),
                    c = 0;
                c < e.length;
                c++
            )
                '.' === (d = e[c])
                    ? (e.splice(c, 1), --c)
                    : '..' === d && (0 === c || (1 === c && '..' === e[2]) || '..' === e[c - 1] || (0 < c && (e.splice(c - 1, 2), (c -= 2))))
            e = e.join('/')
        }
        if ((p || f) && h) {
            for (c = (n = e.split('/')).length; 0 < c; --c) {
                if (((s = n.slice(0, c).join('/')), p))
                    for (u = p.length; 0 < u; --u)
                        if (((i = h[p.slice(0, u).join('/')]), (i = i && i[s]))) {
                            ;(r = i), (o = c)
                            break
                        }
                if (r) break
                !a && f && f[s] && ((a = f[s]), (l = c))
            }
            !r && a && ((r = a), (o = l)), r && (n.splice(0, o, r), (e = n.join('/')))
        }
        return e
    }
    function w(t, n) {
        return function () {
            var e = a.call(arguments, 0)
            return 'string' != typeof e[0] && 1 === e.length && e.push(null), o.apply(p, e.concat([t, n]))
        }
    }
    function x(e) {
        var t
        if ((b(m, e) && ((t = m[e]), delete m[e], (v[e] = !0), r.apply(p, t)), !b(g, e) && !b(v, e))) throw new Error('No ' + e)
        return g[e]
    }
    function c(e) {
        var t,
            n = e ? e.indexOf('!') : -1
        return -1 < n && ((t = e.substring(0, n)), (e = e.substring(n + 1, e.length))), [t, e]
    }
    function A(e) {
        return e ? c(e) : []
    }
    var u = s.require('jquery.select2')
    return (t.fn.select2.amd = s), u
})

/**
 * RANGE SLIDER SCRIPT
 */
!(function (t, e) {
    'object' == typeof exports && 'undefined' != typeof module
        ? e(exports)
        : 'function' == typeof define && define.amd
          ? define(['exports'], e)
          : e(((t = 'undefined' != typeof globalThis ? globalThis : t || self).noUiSlider = {}))
})(this, function (ot) {
    'use strict'
    function n(t) {
        return 'object' == typeof t && 'function' == typeof t.to
    }
    function st(t) {
        t.parentElement.removeChild(t)
    }
    function at(t) {
        return null != t
    }
    function lt(t) {
        t.preventDefault()
    }
    function i(t) {
        return 'number' == typeof t && !isNaN(t) && isFinite(t)
    }
    function ut(t, e, r) {
        0 < r &&
            (ft(t, e),
            setTimeout(function () {
                dt(t, e)
            }, r))
    }
    function ct(t) {
        return Math.max(Math.min(t, 100), 0)
    }
    function pt(t) {
        return Array.isArray(t) ? t : [t]
    }
    function e(t) {
        t = (t = String(t)).split('.')
        return 1 < t.length ? t[1].length : 0
    }
    function ft(t, e) {
        t.classList && !/\s/.test(e) ? t.classList.add(e) : (t.className += ' ' + e)
    }
    function dt(t, e) {
        t.classList && !/\s/.test(e)
            ? t.classList.remove(e)
            : (t.className = t.className.replace(new RegExp('(^|\\b)' + e.split(' ').join('|') + '(\\b|$)', 'gi'), ' '))
    }
    function ht(t) {
        var e = void 0 !== window.pageXOffset,
            r = 'CSS1Compat' === (t.compatMode || '')
        return {
            x: e ? window.pageXOffset : (r ? t.documentElement : t.body).scrollLeft,
            y: e ? window.pageYOffset : (r ? t.documentElement : t.body).scrollTop,
        }
    }
    function s(t, e) {
        return 100 / (e - t)
    }
    function a(t, e, r) {
        return (100 * e) / (t[r + 1] - t[r])
    }
    function l(t, e) {
        for (var r = 1; t >= e[r]; ) r += 1
        return r
    }
    function r(t, e, r) {
        if (r >= t.slice(-1)[0]) return 100
        var n = l(r, t),
            i = t[n - 1],
            o = t[n],
            t = e[n - 1],
            n = e[n]
        return t + ((r = r), a((o = [i, o]), o[0] < 0 ? r + Math.abs(o[0]) : r - o[0], 0) / s(t, n))
    }
    function o(t, e, r, n) {
        if (100 === n) return n
        var i = l(n, t),
            o = t[i - 1],
            s = t[i]
        return r ? ((s - o) / 2 < n - o ? s : o) : e[i - 1] ? t[i - 1] + ((t = n - t[i - 1]), (i = e[i - 1]), Math.round(t / i) * i) : n
    }
    ;(ot.PipsMode = void 0),
        ((H = ot.PipsMode || (ot.PipsMode = {})).Range = 'range'),
        (H.Steps = 'steps'),
        (H.Positions = 'positions'),
        (H.Count = 'count'),
        (H.Values = 'values'),
        (ot.PipsType = void 0),
        ((H = ot.PipsType || (ot.PipsType = {}))[(H.None = -1)] = 'None'),
        (H[(H.NoValue = 0)] = 'NoValue'),
        (H[(H.LargeValue = 1)] = 'LargeValue'),
        (H[(H.SmallValue = 2)] = 'SmallValue')
    var u =
        ((t.prototype.getDistance = function (t) {
            for (var e = [], r = 0; r < this.xNumSteps.length - 1; r++) e[r] = a(this.xVal, t, r)
            return e
        }),
        (t.prototype.getAbsoluteDistance = function (t, e, r) {
            var n = 0
            if (t < this.xPct[this.xPct.length - 1]) for (; t > this.xPct[n + 1]; ) n++
            else t === this.xPct[this.xPct.length - 1] && (n = this.xPct.length - 2)
            r || t !== this.xPct[n + 1] || n++
            for (
                var i,
                    o = 1,
                    s = (e = null === e ? [] : e)[n],
                    a = 0,
                    l = 0,
                    u = 0,
                    c = r ? (t - this.xPct[n]) / (this.xPct[n + 1] - this.xPct[n]) : (this.xPct[n + 1] - t) / (this.xPct[n + 1] - this.xPct[n]);
                0 < s;

            )
                (i = this.xPct[n + 1 + u] - this.xPct[n + u]),
                    100 < e[n + u] * o + 100 - 100 * c
                        ? ((a = i * c), (o = (s - 100 * c) / e[n + u]), (c = 1))
                        : ((a = ((e[n + u] * i) / 100) * o), (o = 0)),
                    r ? ((l -= a), 1 <= this.xPct.length + u && u--) : ((l += a), 1 <= this.xPct.length - u && u++),
                    (s = e[n + u] * o)
            return t + l
        }),
        (t.prototype.toStepping = function (t) {
            return (t = r(this.xVal, this.xPct, t))
        }),
        (t.prototype.fromStepping = function (t) {
            return (function (t, e, r) {
                if (100 <= r) return t.slice(-1)[0]
                var n = l(r, e),
                    i = t[n - 1],
                    o = t[n],
                    t = e[n - 1],
                    n = e[n]
                return ((r - t) * s(t, n) * ((o = [i, o])[1] - o[0])) / 100 + o[0]
            })(this.xVal, this.xPct, t)
        }),
        (t.prototype.getStep = function (t) {
            return (t = o(this.xPct, this.xSteps, this.snap, t))
        }),
        (t.prototype.getDefaultStep = function (t, e, r) {
            var n = l(t, this.xPct)
            return (100 === t || (e && t === this.xPct[n - 1])) && (n = Math.max(n - 1, 1)), (this.xVal[n] - this.xVal[n - 1]) / r
        }),
        (t.prototype.getNearbySteps = function (t) {
            t = l(t, this.xPct)
            return {
                stepBefore: {
                    startValue: this.xVal[t - 2],
                    step: this.xNumSteps[t - 2],
                    highestStep: this.xHighestCompleteStep[t - 2],
                },
                thisStep: {
                    startValue: this.xVal[t - 1],
                    step: this.xNumSteps[t - 1],
                    highestStep: this.xHighestCompleteStep[t - 1],
                },
                stepAfter: {
                    startValue: this.xVal[t],
                    step: this.xNumSteps[t],
                    highestStep: this.xHighestCompleteStep[t],
                },
            }
        }),
        (t.prototype.countStepDecimals = function () {
            var t = this.xNumSteps.map(e)
            return Math.max.apply(null, t)
        }),
        (t.prototype.hasNoSize = function () {
            return this.xVal[0] === this.xVal[this.xVal.length - 1]
        }),
        (t.prototype.convert = function (t) {
            return this.getStep(this.toStepping(t))
        }),
        (t.prototype.handleEntryPoint = function (t, e) {
            t = 'min' === t ? 0 : 'max' === t ? 100 : parseFloat(t)
            if (!i(t) || !i(e[0])) throw new Error("noUiSlider: 'range' value isn't numeric.")
            this.xPct.push(t), this.xVal.push(e[0])
            e = Number(e[1])
            t ? this.xSteps.push(!isNaN(e) && e) : isNaN(e) || (this.xSteps[0] = e), this.xHighestCompleteStep.push(0)
        }),
        (t.prototype.handleStepPoint = function (t, e) {
            e &&
                (this.xVal[t] !== this.xVal[t + 1]
                    ? ((this.xSteps[t] = a([this.xVal[t], this.xVal[t + 1]], e, 0) / s(this.xPct[t], this.xPct[t + 1])),
                      (e = (this.xVal[t + 1] - this.xVal[t]) / this.xNumSteps[t]),
                      (e = Math.ceil(Number(e.toFixed(3)) - 1)),
                      (e = this.xVal[t] + this.xNumSteps[t] * e),
                      (this.xHighestCompleteStep[t] = e))
                    : (this.xSteps[t] = this.xHighestCompleteStep[t] = this.xVal[t]))
        }),
        t)
    function t(e, t, r) {
        var n
        ;(this.xPct = []),
            (this.xVal = []),
            (this.xSteps = []),
            (this.xNumSteps = []),
            (this.xHighestCompleteStep = []),
            (this.xSteps = [r || !1]),
            (this.xNumSteps = [!1]),
            (this.snap = t)
        var i = []
        for (
            Object.keys(e).forEach(function (t) {
                i.push([pt(e[t]), t])
            }),
                i.sort(function (t, e) {
                    return t[0][0] - e[0][0]
                }),
                n = 0;
            n < i.length;
            n++
        )
            this.handleEntryPoint(i[n][1], i[n][0])
        for (this.xNumSteps = this.xSteps.slice(0), n = 0; n < this.xNumSteps.length; n++) this.handleStepPoint(n, this.xNumSteps[n])
    }
    var c = {
            to: function (t) {
                return void 0 === t ? '' : t.toFixed(2)
            },
            from: Number,
        },
        p = {
            target: 'target',
            base: 'base',
            origin: 'origin',
            handle: 'handle',
            handleLower: 'handle-lower',
            handleUpper: 'handle-upper',
            touchArea: 'touch-area',
            horizontal: 'horizontal',
            vertical: 'vertical',
            background: 'background',
            connect: 'connect',
            connects: 'connects',
            ltr: 'ltr',
            rtl: 'rtl',
            textDirectionLtr: 'txt-dir-ltr',
            textDirectionRtl: 'txt-dir-rtl',
            draggable: 'draggable',
            drag: 'state-drag',
            tap: 'state-tap',
            active: 'active',
            tooltip: 'tooltip',
            pips: 'pips',
            pipsHorizontal: 'pips-horizontal',
            pipsVertical: 'pips-vertical',
            marker: 'marker',
            markerHorizontal: 'marker-horizontal',
            markerVertical: 'marker-vertical',
            markerNormal: 'marker-normal',
            markerLarge: 'marker-large',
            markerSub: 'marker-sub',
            value: 'value',
            valueHorizontal: 'value-horizontal',
            valueVertical: 'value-vertical',
            valueNormal: 'value-normal',
            valueLarge: 'value-large',
            valueSub: 'value-sub',
        },
        mt = { tooltips: '.__tooltips', aria: '.__aria' }
    function f(t, e) {
        if (!i(e)) throw new Error("noUiSlider: 'step' is not numeric.")
        t.singleStep = e
    }
    function d(t, e) {
        if (!i(e)) throw new Error("noUiSlider: 'keyboardPageMultiplier' is not numeric.")
        t.keyboardPageMultiplier = e
    }
    function h(t, e) {
        if (!i(e)) throw new Error("noUiSlider: 'keyboardMultiplier' is not numeric.")
        t.keyboardMultiplier = e
    }
    function m(t, e) {
        if (!i(e)) throw new Error("noUiSlider: 'keyboardDefaultStep' is not numeric.")
        t.keyboardDefaultStep = e
    }
    function g(t, e) {
        if ('object' != typeof e || Array.isArray(e)) throw new Error("noUiSlider: 'range' is not an object.")
        if (void 0 === e.min || void 0 === e.max) throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.")
        t.spectrum = new u(e, t.snap || !1, t.singleStep)
    }
    function v(t, e) {
        if (((e = pt(e)), !Array.isArray(e) || !e.length)) throw new Error("noUiSlider: 'start' option is incorrect.")
        ;(t.handles = e.length), (t.start = e)
    }
    function b(t, e) {
        if ('boolean' != typeof e) throw new Error("noUiSlider: 'snap' option must be a boolean.")
        t.snap = e
    }
    function S(t, e) {
        if ('boolean' != typeof e) throw new Error("noUiSlider: 'animate' option must be a boolean.")
        t.animate = e
    }
    function x(t, e) {
        if ('number' != typeof e) throw new Error("noUiSlider: 'animationDuration' option must be a number.")
        t.animationDuration = e
    }
    function y(t, e) {
        var r,
            n = [!1]
        if (('lower' === e ? (e = [!0, !1]) : 'upper' === e && (e = [!1, !0]), !0 === e || !1 === e)) {
            for (r = 1; r < t.handles; r++) n.push(e)
            n.push(!1)
        } else {
            if (!Array.isArray(e) || !e.length || e.length !== t.handles + 1)
                throw new Error("noUiSlider: 'connect' option doesn't match handle count.")
            n = e
        }
        t.connect = n
    }
    function w(t, e) {
        switch (e) {
            case 'horizontal':
                t.ort = 0
                break
            case 'vertical':
                t.ort = 1
                break
            default:
                throw new Error("noUiSlider: 'orientation' option is invalid.")
        }
    }
    function E(t, e) {
        if (!i(e)) throw new Error("noUiSlider: 'margin' option must be numeric.")
        0 !== e && (t.margin = t.spectrum.getDistance(e))
    }
    function P(t, e) {
        if (!i(e)) throw new Error("noUiSlider: 'limit' option must be numeric.")
        if (((t.limit = t.spectrum.getDistance(e)), !t.limit || t.handles < 2))
            throw new Error("noUiSlider: 'limit' option is only supported on linear sliders with 2 or more handles.")
    }
    function C(t, e) {
        var r
        if (!i(e) && !Array.isArray(e)) throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.")
        if (Array.isArray(e) && 2 !== e.length && !i(e[0]) && !i(e[1]))
            throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.")
        if (0 !== e) {
            for (
                Array.isArray(e) || (e = [e, e]), t.padding = [t.spectrum.getDistance(e[0]), t.spectrum.getDistance(e[1])], r = 0;
                r < t.spectrum.xNumSteps.length - 1;
                r++
            )
                if (t.padding[0][r] < 0 || t.padding[1][r] < 0) throw new Error("noUiSlider: 'padding' option must be a positive number(s).")
            var n = e[0] + e[1],
                e = t.spectrum.xVal[0]
            if (1 < n / (t.spectrum.xVal[t.spectrum.xVal.length - 1] - e))
                throw new Error("noUiSlider: 'padding' option must not exceed 100% of the range.")
        }
    }
    function N(t, e) {
        switch (e) {
            case 'ltr':
                t.dir = 0
                break
            case 'rtl':
                t.dir = 1
                break
            default:
                throw new Error("noUiSlider: 'direction' option was not recognized.")
        }
    }
    function V(t, e) {
        if ('string' != typeof e) throw new Error("noUiSlider: 'behaviour' must be a string containing options.")
        var r = 0 <= e.indexOf('tap'),
            n = 0 <= e.indexOf('drag'),
            i = 0 <= e.indexOf('fixed'),
            o = 0 <= e.indexOf('snap'),
            s = 0 <= e.indexOf('hover'),
            a = 0 <= e.indexOf('unconstrained'),
            l = 0 <= e.indexOf('drag-all'),
            e = 0 <= e.indexOf('smooth-steps')
        if (i) {
            if (2 !== t.handles) throw new Error("noUiSlider: 'fixed' behaviour must be used with 2 handles")
            E(t, t.start[1] - t.start[0])
        }
        if (a && (t.margin || t.limit)) throw new Error("noUiSlider: 'unconstrained' behaviour cannot be used with margin or limit")
        t.events = {
            tap: r || o,
            drag: n,
            dragAll: l,
            smoothSteps: e,
            fixed: i,
            snap: o,
            hover: s,
            unconstrained: a,
        }
    }
    function A(t, e) {
        if (!1 !== e)
            if (!0 === e || n(e)) {
                t.tooltips = []
                for (var r = 0; r < t.handles; r++) t.tooltips.push(e)
            } else {
                if ((e = pt(e)).length !== t.handles) throw new Error('noUiSlider: must pass a formatter for all handles.')
                e.forEach(function (t) {
                    if ('boolean' != typeof t && !n(t)) throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.")
                }),
                    (t.tooltips = e)
            }
    }
    function k(t, e) {
        if (e.length !== t.handles) throw new Error('noUiSlider: must pass a attributes for all handles.')
        t.handleAttributes = e
    }
    function M(t, e) {
        if (!n(e)) throw new Error("noUiSlider: 'ariaFormat' requires 'to' method.")
        t.ariaFormat = e
    }
    function U(t, e) {
        if (!n((r = e)) || 'function' != typeof r.from) throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.")
        var r
        t.format = e
    }
    function D(t, e) {
        if ('boolean' != typeof e) throw new Error("noUiSlider: 'keyboardSupport' option must be a boolean.")
        t.keyboardSupport = e
    }
    function O(t, e) {
        t.documentElement = e
    }
    function L(t, e) {
        if ('string' != typeof e && !1 !== e) throw new Error("noUiSlider: 'cssPrefix' must be a string or `false`.")
        t.cssPrefix = e
    }
    function T(e, r) {
        if ('object' != typeof r) throw new Error("noUiSlider: 'cssClasses' must be an object.")
        'string' == typeof e.cssPrefix
            ? ((e.cssClasses = {}),
              Object.keys(r).forEach(function (t) {
                  e.cssClasses[t] = e.cssPrefix + r[t]
              }))
            : (e.cssClasses = r)
    }
    function gt(e) {
        var r = {
                margin: null,
                limit: null,
                padding: null,
                animate: !0,
                animationDuration: 300,
                ariaFormat: c,
                format: c,
            },
            n = {
                step: { r: !1, t: f },
                keyboardPageMultiplier: { r: !1, t: d },
                keyboardMultiplier: { r: !1, t: h },
                keyboardDefaultStep: { r: !1, t: m },
                start: { r: !0, t: v },
                connect: { r: !0, t: y },
                direction: { r: !0, t: N },
                snap: { r: !1, t: b },
                animate: { r: !1, t: S },
                animationDuration: { r: !1, t: x },
                range: { r: !0, t: g },
                orientation: { r: !1, t: w },
                margin: { r: !1, t: E },
                limit: { r: !1, t: P },
                padding: { r: !1, t: C },
                behaviour: { r: !0, t: V },
                ariaFormat: { r: !1, t: M },
                format: { r: !1, t: U },
                tooltips: { r: !1, t: A },
                keyboardSupport: { r: !0, t: D },
                documentElement: { r: !1, t: O },
                cssPrefix: { r: !0, t: L },
                cssClasses: { r: !0, t: T },
                handleAttributes: { r: !1, t: k },
            },
            i = {
                connect: !1,
                direction: 'ltr',
                behaviour: 'tap',
                orientation: 'horizontal',
                keyboardSupport: !0,
                cssPrefix: 'noUi-',
                cssClasses: p,
                keyboardPageMultiplier: 5,
                keyboardMultiplier: 1,
                keyboardDefaultStep: 10,
            }
        e.format && !e.ariaFormat && (e.ariaFormat = e.format),
            Object.keys(n).forEach(function (t) {
                if (at(e[t]) || void 0 !== i[t]) n[t].t(r, (at(e[t]) ? e : i)[t])
                else if (n[t].r) throw new Error("noUiSlider: '" + t + "' is required.")
            }),
            (r.pips = e.pips)
        var t = document.createElement('div'),
            o = void 0 !== t.style.msTransform,
            t = void 0 !== t.style.transform
        r.transformRule = t ? 'transform' : o ? 'msTransform' : 'webkitTransform'
        return (
            (r.style = [
                ['left', 'top'],
                ['right', 'bottom'],
            ][r.dir][r.ort]),
            r
        )
    }
    function j(t, f, o) {
        var i,
            l,
            a,
            n,
            s,
            u,
            c = window.navigator.pointerEnabled
                ? { start: 'pointerdown', move: 'pointermove', end: 'pointerup' }
                : window.navigator.msPointerEnabled
                  ? { start: 'MSPointerDown', move: 'MSPointerMove', end: 'MSPointerUp' }
                  : {
                        start: 'mousedown touchstart',
                        move: 'mousemove touchmove',
                        end: 'mouseup touchend',
                    },
            p =
                window.CSS &&
                CSS.supports &&
                CSS.supports('touch-action', 'none') &&
                (function () {
                    var t = !1
                    try {
                        var e = Object.defineProperty({}, 'passive', {
                            get: function () {
                                t = !0
                            },
                        })
                        window.addEventListener('test', null, e)
                    } catch (t) {}
                    return t
                })(),
            d = t,
            S = f.spectrum,
            h = [],
            m = [],
            g = [],
            v = 0,
            b = {},
            x = t.ownerDocument,
            y = f.documentElement || x.documentElement,
            w = x.body,
            E = 'rtl' === x.dir || 1 === f.ort ? 0 : 100
        function P(t, e) {
            var r = x.createElement('div')
            return e && ft(r, e), t.appendChild(r), r
        }
        function C(t, e) {
            var r,
                t = P(t, f.cssClasses.origin),
                n = P(t, f.cssClasses.handle)
            return (
                P(n, f.cssClasses.touchArea),
                n.setAttribute('data-handle', String(e)),
                f.keyboardSupport &&
                    (n.setAttribute('tabindex', '0'),
                    n.addEventListener('keydown', function (t) {
                        return (function (t, e) {
                            if (V() || A(e)) return !1
                            var r = ['Left', 'Right'],
                                n = ['Down', 'Up'],
                                i = ['PageDown', 'PageUp'],
                                o = ['Home', 'End']
                            f.dir && !f.ort ? r.reverse() : f.ort && !f.dir && (n.reverse(), i.reverse())
                            var s = t.key.replace('Arrow', ''),
                                a = s === i[0],
                                l = s === i[1],
                                i = s === n[0] || s === r[0] || a,
                                n = s === n[1] || s === r[1] || l,
                                r = s === o[0],
                                o = s === o[1]
                            if (!(i || n || r || o)) return !0
                            if ((t.preventDefault(), n || i)) {
                                var u = i ? 0 : 1,
                                    u = nt(e)[u]
                                if (null === u) return !1
                                !1 === u && (u = S.getDefaultStep(m[e], i, f.keyboardDefaultStep)),
                                    (u *= l || a ? f.keyboardPageMultiplier : f.keyboardMultiplier),
                                    (u = Math.max(u, 1e-7)),
                                    (u *= i ? -1 : 1),
                                    (u = h[e] + u)
                            } else u = o ? f.spectrum.xVal[f.spectrum.xVal.length - 1] : f.spectrum.xVal[0]
                            return Q(e, S.toStepping(u), !0, !0), I('slide', e), I('update', e), I('change', e), I('set', e), !1
                        })(t, e)
                    })),
                void 0 !== f.handleAttributes &&
                    ((r = f.handleAttributes[e]),
                    Object.keys(r).forEach(function (t) {
                        n.setAttribute(t, r[t])
                    })),
                n.setAttribute('role', 'slider'),
                n.setAttribute('aria-orientation', f.ort ? 'vertical' : 'horizontal'),
                0 === e ? ft(n, f.cssClasses.handleLower) : e === f.handles - 1 && ft(n, f.cssClasses.handleUpper),
                (t.handle = n),
                t
            )
        }
        function N(t, e) {
            return !!e && P(t, f.cssClasses.connect)
        }
        function e(t, e) {
            return !(!f.tooltips || !f.tooltips[e]) && P(t.firstChild, f.cssClasses.tooltip)
        }
        function V() {
            return d.hasAttribute('disabled')
        }
        function A(t) {
            return l[t].hasAttribute('disabled')
        }
        function k() {
            s &&
                (Y('update' + mt.tooltips),
                s.forEach(function (t) {
                    t && st(t)
                }),
                (s = null))
        }
        function M() {
            k(),
                (s = l.map(e)),
                X('update' + mt.tooltips, function (t, e, r) {
                    s && f.tooltips && !1 !== s[e] && ((t = t[e]), !0 !== f.tooltips[e] && (t = f.tooltips[e].to(r[e])), (s[e].innerHTML = t))
                })
        }
        function U(t, e) {
            return t.map(function (t) {
                return S.fromStepping(e ? S.getStep(t) : t)
            })
        }
        function D(d) {
            var h = (function (t) {
                    if (t.mode === ot.PipsMode.Range || t.mode === ot.PipsMode.Steps) return S.xVal
                    if (t.mode !== ot.PipsMode.Count)
                        return t.mode === ot.PipsMode.Positions
                            ? U(t.values, t.stepped)
                            : t.mode === ot.PipsMode.Values
                              ? t.stepped
                                  ? t.values.map(function (t) {
                                        return S.fromStepping(S.getStep(S.toStepping(t)))
                                    })
                                  : t.values
                              : []
                    if (t.values < 2) throw new Error("noUiSlider: 'values' (>= 2) required for mode 'count'.")
                    for (var e = t.values - 1, r = 100 / e, n = []; e--; ) n[e] = e * r
                    return n.push(100), U(n, t.stepped)
                })(d),
                m = {},
                t = S.xVal[0],
                e = S.xVal[S.xVal.length - 1],
                g = !1,
                v = !1,
                b = 0
            return (
                (h = h
                    .slice()
                    .sort(function (t, e) {
                        return t - e
                    })
                    .filter(function (t) {
                        return !this[t] && (this[t] = !0)
                    }, {}))[0] !== t && (h.unshift(t), (g = !0)),
                h[h.length - 1] !== e && (h.push(e), (v = !0)),
                h.forEach(function (t, e) {
                    var r,
                        n,
                        i,
                        o,
                        s,
                        a,
                        l,
                        u,
                        t = t,
                        c = h[e + 1],
                        p = d.mode === ot.PipsMode.Steps,
                        f = (f = p ? S.xNumSteps[e] : f) || c - t
                    for (void 0 === c && (c = t), f = Math.max(f, 1e-7), r = t; r <= c; r = Number((r + f).toFixed(7))) {
                        for (a = (o = (i = S.toStepping(r)) - b) / (d.density || 1), u = o / (l = Math.round(a)), n = 1; n <= l; n += 1)
                            m[(s = b + n * u).toFixed(5)] = [S.fromStepping(s), 0]
                        ;(a = -1 < h.indexOf(r) ? ot.PipsType.LargeValue : p ? ot.PipsType.SmallValue : ot.PipsType.NoValue),
                            !e && g && r !== c && (a = 0),
                            (r === c && v) || (m[i.toFixed(5)] = [r, a]),
                            (b = i)
                    }
                }),
                m
            )
        }
        function O(i, o, s) {
            var t,
                a = x.createElement('div'),
                n =
                    (((t = {})[ot.PipsType.None] = ''),
                    (t[ot.PipsType.NoValue] = f.cssClasses.valueNormal),
                    (t[ot.PipsType.LargeValue] = f.cssClasses.valueLarge),
                    (t[ot.PipsType.SmallValue] = f.cssClasses.valueSub),
                    t),
                l =
                    (((t = {})[ot.PipsType.None] = ''),
                    (t[ot.PipsType.NoValue] = f.cssClasses.markerNormal),
                    (t[ot.PipsType.LargeValue] = f.cssClasses.markerLarge),
                    (t[ot.PipsType.SmallValue] = f.cssClasses.markerSub),
                    t),
                u = [f.cssClasses.valueHorizontal, f.cssClasses.valueVertical],
                c = [f.cssClasses.markerHorizontal, f.cssClasses.markerVertical]
            function p(t, e) {
                var r = e === f.cssClasses.value
                return e + ' ' + (r ? u : c)[f.ort] + ' ' + (r ? n : l)[t]
            }
            return (
                ft(a, f.cssClasses.pips),
                ft(a, 0 === f.ort ? f.cssClasses.pipsHorizontal : f.cssClasses.pipsVertical),
                Object.keys(i).forEach(function (t) {
                    var e, r, n
                    ;(r = i[(e = t)][0]),
                        (n = i[t][1]),
                        (n = o ? o(r, n) : n) !== ot.PipsType.None &&
                            (((t = P(a, !1)).className = p(n, f.cssClasses.marker)),
                            (t.style[f.style] = e + '%'),
                            n > ot.PipsType.NoValue &&
                                (((t = P(a, !1)).className = p(n, f.cssClasses.value)),
                                t.setAttribute('data-value', String(r)),
                                (t.style[f.style] = e + '%'),
                                (t.innerHTML = String(s.to(r)))))
                }),
                a
            )
        }
        function L() {
            n && (st(n), (n = null))
        }
        function T(t) {
            L()
            var e = D(t),
                r = t.filter,
                t = t.format || {
                    to: function (t) {
                        return String(Math.round(t))
                    },
                }
            return (n = d.appendChild(O(e, r, t)))
        }
        function j() {
            var t = i.getBoundingClientRect(),
                e = 'offset' + ['Width', 'Height'][f.ort]
            return 0 === f.ort ? t.width || i[e] : t.height || i[e]
        }
        function z(n, i, o, s) {
            function e(t) {
                var e,
                    r = (function (e, t, r) {
                        var n = 0 === e.type.indexOf('touch'),
                            i = 0 === e.type.indexOf('mouse'),
                            o = 0 === e.type.indexOf('pointer'),
                            s = 0,
                            a = 0
                        0 === e.type.indexOf('MSPointer') && (o = !0)
                        if ('mousedown' === e.type && !e.buttons && !e.touches) return !1
                        if (n) {
                            var l = function (t) {
                                t = t.target
                                return t === r || r.contains(t) || (e.composed && e.composedPath().shift() === r)
                            }
                            if ('touchstart' === e.type) {
                                n = Array.prototype.filter.call(e.touches, l)
                                if (1 < n.length) return !1
                                ;(s = n[0].pageX), (a = n[0].pageY)
                            } else {
                                l = Array.prototype.find.call(e.changedTouches, l)
                                if (!l) return !1
                                ;(s = l.pageX), (a = l.pageY)
                            }
                        }
                        ;(t = t || ht(x)), (i || o) && ((s = e.clientX + t.x), (a = e.clientY + t.y))
                        return (e.pageOffset = t), (e.points = [s, a]), (e.cursor = i || o), e
                    })(t, s.pageOffset, s.target || i)
                return (
                    !!r &&
                    !(V() && !s.doNotReject) &&
                    ((e = d),
                    (t = f.cssClasses.tap),
                    !((e.classList ? e.classList.contains(t) : new RegExp('\\b' + t + '\\b').test(e.className)) && !s.doNotReject) &&
                        !(n === c.start && void 0 !== r.buttons && 1 < r.buttons) &&
                        (!s.hover || !r.buttons) &&
                        (p || r.preventDefault(), (r.calcPoint = r.points[f.ort]), void o(r, s)))
                )
            }
            var r = []
            return (
                n.split(' ').forEach(function (t) {
                    i.addEventListener(t, e, !!p && { passive: !0 }), r.push([t, e])
                }),
                r
            )
        }
        function H(t) {
            var e,
                r,
                n = ct(
                    (n =
                        (100 *
                            (t -
                                ((n = i),
                                (e = f.ort),
                                (r = n.getBoundingClientRect()),
                                (n = (t = n.ownerDocument).documentElement),
                                (t = ht(t)),
                                /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) && (t.x = 0),
                                e ? r.top + t.y - n.clientTop : r.left + t.x - n.clientLeft))) /
                        j()),
                )
            return f.dir ? 100 - n : n
        }
        function F(t, e) {
            'mouseout' === t.type && 'HTML' === t.target.nodeName && null === t.relatedTarget && _(t, e)
        }
        function R(t, e) {
            if (-1 === navigator.appVersion.indexOf('MSIE 9') && 0 === t.buttons && 0 !== e.buttonsProperty) return _(t, e)
            t = (f.dir ? -1 : 1) * (t.calcPoint - e.startCalcPoint)
            G(0 < t, (100 * t) / e.baseSize, e.locations, e.handleNumbers, e.connect)
        }
        function _(t, e) {
            e.handle && (dt(e.handle, f.cssClasses.active), --v),
                e.listeners.forEach(function (t) {
                    y.removeEventListener(t[0], t[1])
                }),
                0 === v && (dt(d, f.cssClasses.drag), K(), t.cursor && ((w.style.cursor = ''), w.removeEventListener('selectstart', lt))),
                f.events.smoothSteps &&
                    (e.handleNumbers.forEach(function (t) {
                        Q(t, m[t], !0, !0, !1, !1)
                    }),
                    e.handleNumbers.forEach(function (t) {
                        I('update', t)
                    })),
                e.handleNumbers.forEach(function (t) {
                    I('change', t), I('set', t), I('end', t)
                })
        }
        function B(t, e) {
            var r, n, i, o
            e.handleNumbers.some(A) ||
                (1 === e.handleNumbers.length && ((o = l[e.handleNumbers[0]].children[0]), (v += 1), ft(o, f.cssClasses.active)),
                t.stopPropagation(),
                (n = z(c.move, y, R, {
                    target: t.target,
                    handle: o,
                    connect: e.connect,
                    listeners: (r = []),
                    startCalcPoint: t.calcPoint,
                    baseSize: j(),
                    pageOffset: t.pageOffset,
                    handleNumbers: e.handleNumbers,
                    buttonsProperty: t.buttons,
                    locations: m.slice(),
                })),
                (i = z(c.end, y, _, {
                    target: t.target,
                    handle: o,
                    listeners: r,
                    doNotReject: !0,
                    handleNumbers: e.handleNumbers,
                })),
                (o = z('mouseout', y, F, {
                    target: t.target,
                    handle: o,
                    listeners: r,
                    doNotReject: !0,
                    handleNumbers: e.handleNumbers,
                })),
                r.push.apply(r, n.concat(i, o)),
                t.cursor &&
                    ((w.style.cursor = getComputedStyle(t.target).cursor),
                    1 < l.length && ft(d, f.cssClasses.drag),
                    w.addEventListener('selectstart', lt, !1)),
                e.handleNumbers.forEach(function (t) {
                    I('start', t)
                }))
        }
        function r(t) {
            t.stopPropagation()
            var i,
                o,
                s,
                e = H(t.calcPoint),
                r =
                    ((i = e),
                    (s = !(o = 100)),
                    l.forEach(function (t, e) {
                        var r, n
                        A(e) || ((r = m[e]), ((n = Math.abs(r - i)) < o || (n <= o && r < i) || (100 === n && 100 === o)) && ((s = e), (o = n)))
                    }),
                    s)
            !1 !== r &&
                (f.events.snap || ut(d, f.cssClasses.tap, f.animationDuration),
                Q(r, e, !0, !0),
                K(),
                I('slide', r, !0),
                I('update', r, !0),
                f.events.snap ? B(t, { handleNumbers: [r] }) : (I('change', r, !0), I('set', r, !0)))
        }
        function q(t) {
            var t = H(t.calcPoint),
                t = S.getStep(t),
                e = S.fromStepping(t)
            Object.keys(b).forEach(function (t) {
                'hover' === t.split('.')[0] &&
                    b[t].forEach(function (t) {
                        t.call(it, e)
                    })
            })
        }
        function X(t, e) {
            ;(b[t] = b[t] || []),
                b[t].push(e),
                'update' === t.split('.')[0] &&
                    l.forEach(function (t, e) {
                        I('update', e)
                    })
        }
        function Y(t) {
            var n = t && t.split('.')[0],
                i = n ? t.substring(n.length) : t
            Object.keys(b).forEach(function (t) {
                var e = t.split('.')[0],
                    r = t.substring(e.length)
                ;(n && n !== e) || (i && i !== r) || ((((e = r) !== mt.aria && e !== mt.tooltips) || i === r) && delete b[t])
            })
        }
        function I(r, n, i) {
            Object.keys(b).forEach(function (t) {
                var e = t.split('.')[0]
                r === e &&
                    b[t].forEach(function (t) {
                        t.call(it, h.map(f.format.to), n, h.slice(), i || !1, m.slice(), it)
                    })
            })
        }
        function W(t, e, r, n, i, o, s) {
            var a
            return (
                1 < l.length &&
                    !f.events.unconstrained &&
                    (n && 0 < e && ((a = S.getAbsoluteDistance(t[e - 1], f.margin, !1)), (r = Math.max(r, a))),
                    i && e < l.length - 1 && ((a = S.getAbsoluteDistance(t[e + 1], f.margin, !0)), (r = Math.min(r, a)))),
                1 < l.length &&
                    f.limit &&
                    (n && 0 < e && ((a = S.getAbsoluteDistance(t[e - 1], f.limit, !1)), (r = Math.min(r, a))),
                    i && e < l.length - 1 && ((a = S.getAbsoluteDistance(t[e + 1], f.limit, !0)), (r = Math.max(r, a)))),
                f.padding &&
                    (0 === e && ((a = S.getAbsoluteDistance(0, f.padding[0], !1)), (r = Math.max(r, a))),
                    e === l.length - 1 && ((a = S.getAbsoluteDistance(100, f.padding[1], !0)), (r = Math.min(r, a)))),
                !((r = ct((r = !s ? S.getStep(r) : r))) === t[e] && !o) && r
            )
        }
        function $(t, e) {
            var r = f.ort
            return (r ? e : t) + ', ' + (r ? t : e)
        }
        function G(t, r, n, e, i) {
            var o = n.slice(),
                s = e[0],
                a = f.events.smoothSteps,
                l = [!t, t],
                u = [t, !t]
            ;(e = e.slice()),
                t && e.reverse(),
                1 < e.length
                    ? e.forEach(function (t, e) {
                          e = W(o, t, o[t] + r, l[e], u[e], !1, a)
                          !1 === e ? (r = 0) : ((r = e - o[t]), (o[t] = e))
                      })
                    : (l = u = [!0])
            var c = !1
            e.forEach(function (t, e) {
                c = Q(t, n[t] + r, l[e], u[e], !1, a) || c
            }),
                c &&
                    (e.forEach(function (t) {
                        I('update', t), I('slide', t)
                    }),
                    null != i && I('drag', s))
        }
        function J(t, e) {
            return f.dir ? 100 - t - e : t
        }
        function K() {
            g.forEach(function (t) {
                var e = 50 < m[t] ? -1 : 1,
                    e = 3 + (l.length + e * t)
                l[t].style.zIndex = String(e)
            })
        }
        function Q(t, e, r, n, i, o) {
            return (
                !1 !== (e = i ? e : W(m, t, e, r, n, !1, o)) &&
                ((e = e),
                (m[(t = t)] = e),
                (h[t] = S.fromStepping(e)),
                (e = 'translate(' + $(J(e, 0) - E + '%', '0') + ')'),
                (l[t].style[f.transformRule] = e),
                Z(t),
                Z(t + 1),
                !0)
            )
        }
        function Z(t) {
            var e, r
            a[t] &&
                ((r = 100),
                (e = 'translate(' + $(J((e = (e = 0) !== t ? m[t - 1] : e), (r = (r = t !== a.length - 1 ? m[t] : r) - e)) + '%', '0') + ')'),
                (r = 'scale(' + $(r / 100, '1') + ')'),
                (a[t].style[f.transformRule] = e + ' ' + r))
        }
        function tt(t, e) {
            return null === t || !1 === t || void 0 === t
                ? m[e]
                : ('number' == typeof t && (t = String(t)), !1 === (t = !1 !== (t = f.format.from(t)) ? S.toStepping(t) : t) || isNaN(t) ? m[e] : t)
        }
        function et(t, e, r) {
            var n = pt(t),
                t = void 0 === m[0]
            ;(e = void 0 === e || e),
                f.animate && !t && ut(d, f.cssClasses.tap, f.animationDuration),
                g.forEach(function (t) {
                    Q(t, tt(n[t], t), !0, !1, r)
                })
            var i,
                o = 1 === g.length ? 0 : 1
            for (
                t &&
                S.hasNoSize() &&
                ((r = !0),
                (m[0] = 0),
                1 < g.length &&
                    ((i = 100 / (g.length - 1)),
                    g.forEach(function (t) {
                        m[t] = t * i
                    })));
                o < g.length;
                ++o
            )
                g.forEach(function (t) {
                    Q(t, m[t], !0, !0, r)
                })
            K(),
                g.forEach(function (t) {
                    I('update', t), null !== n[t] && e && I('set', t)
                })
        }
        function rt(t) {
            if ((t = void 0 === t ? !1 : t)) return 1 === h.length ? h[0] : h.slice(0)
            t = h.map(f.format.to)
            return 1 === t.length ? t[0] : t
        }
        function nt(t) {
            var e = m[t],
                r = S.getNearbySteps(e),
                n = h[t],
                i = r.thisStep.step,
                t = null
            if (f.snap) return [n - r.stepBefore.startValue || null, r.stepAfter.startValue - n || null]
            !1 !== i && n + i > r.stepAfter.startValue && (i = r.stepAfter.startValue - n),
                (t = n > r.thisStep.startValue ? r.thisStep.step : !1 !== r.stepBefore.step && n - r.stepBefore.highestStep),
                100 === e ? (i = null) : 0 === e && (t = null)
            e = S.countStepDecimals()
            return null !== i && !1 !== i && (i = Number(i.toFixed(e))), [(t = null !== t && !1 !== t ? Number(t.toFixed(e)) : t), i]
        }
        ft((t = d), f.cssClasses.target),
            0 === f.dir ? ft(t, f.cssClasses.ltr) : ft(t, f.cssClasses.rtl),
            0 === f.ort ? ft(t, f.cssClasses.horizontal) : ft(t, f.cssClasses.vertical),
            ft(t, 'rtl' === getComputedStyle(t).direction ? f.cssClasses.textDirectionRtl : f.cssClasses.textDirectionLtr),
            (i = P(t, f.cssClasses.base)),
            (function (t, e) {
                var r = P(e, f.cssClasses.connects)
                ;(l = []), (a = []).push(N(r, t[0]))
                for (var n = 0; n < f.handles; n++) l.push(C(e, n)), (g[n] = n), a.push(N(r, t[n + 1]))
            })(f.connect, i),
            (u = f.events).fixed ||
                l.forEach(function (t, e) {
                    z(c.start, t.children[0], B, { handleNumbers: [e] })
                }),
            u.tap && z(c.start, i, r, {}),
            u.hover && z(c.move, i, q, { hover: !0 }),
            u.drag &&
                a.forEach(function (e, t) {
                    var r, n, i, o, s
                    !1 !== e &&
                        0 !== t &&
                        t !== a.length - 1 &&
                        ((r = l[t - 1]),
                        (n = l[t]),
                        (i = [e]),
                        (o = [r, n]),
                        (s = [t - 1, t]),
                        ft(e, f.cssClasses.draggable),
                        u.fixed && (i.push(r.children[0]), i.push(n.children[0])),
                        u.dragAll && ((o = l), (s = g)),
                        i.forEach(function (t) {
                            z(c.start, t, B, { handles: o, handleNumbers: s, connect: e })
                        }))
                }),
            et(f.start),
            f.pips && T(f.pips),
            f.tooltips && M(),
            Y('update' + mt.aria),
            X('update' + mt.aria, function (t, e, o, r, s) {
                g.forEach(function (t) {
                    var e = l[t],
                        r = W(m, t, 0, !0, !0, !0),
                        n = W(m, t, 100, !0, !0, !0),
                        i = s[t],
                        t = String(f.ariaFormat.to(o[t])),
                        r = S.fromStepping(r).toFixed(1),
                        n = S.fromStepping(n).toFixed(1),
                        i = S.fromStepping(i).toFixed(1)
                    e.children[0].setAttribute('aria-valuemin', r),
                        e.children[0].setAttribute('aria-valuemax', n),
                        e.children[0].setAttribute('aria-valuenow', i),
                        e.children[0].setAttribute('aria-valuetext', t)
                })
            })
        var it = {
            destroy: function () {
                for (
                    Y(mt.aria),
                        Y(mt.tooltips),
                        Object.keys(f.cssClasses).forEach(function (t) {
                            dt(d, f.cssClasses[t])
                        });
                    d.firstChild;

                )
                    d.removeChild(d.firstChild)
                delete d.noUiSlider
            },
            steps: function () {
                return g.map(nt)
            },
            on: X,
            off: Y,
            get: rt,
            set: et,
            setHandle: function (t, e, r, n) {
                if (!(0 <= (t = Number(t)) && t < g.length)) throw new Error('noUiSlider: invalid handle number, got: ' + t)
                Q(t, tt(e, t), !0, !0, n), I('update', t), r && I('set', t)
            },
            reset: function (t) {
                et(f.start, t)
            },
            disable: function (t) {
                null != t
                    ? (l[t].setAttribute('disabled', ''), l[t].handle.removeAttribute('tabindex'))
                    : (d.setAttribute('disabled', ''),
                      l.forEach(function (t) {
                          t.handle.removeAttribute('tabindex')
                      }))
            },
            enable: function (t) {
                null != t
                    ? (l[t].removeAttribute('disabled'), l[t].handle.setAttribute('tabindex', '0'))
                    : (d.removeAttribute('disabled'),
                      l.forEach(function (t) {
                          t.removeAttribute('disabled'), t.handle.setAttribute('tabindex', '0')
                      }))
            },
            __moveHandles: function (t, e, r) {
                G(t, e, m, r)
            },
            options: o,
            updateOptions: function (e, t) {
                var r = rt(),
                    n = ['margin', 'limit', 'padding', 'range', 'animate', 'snap', 'step', 'format', 'pips', 'tooltips']
                n.forEach(function (t) {
                    void 0 !== e[t] && (o[t] = e[t])
                })
                var i = gt(o)
                n.forEach(function (t) {
                    void 0 !== e[t] && (f[t] = i[t])
                }),
                    (S = i.spectrum),
                    (f.margin = i.margin),
                    (f.limit = i.limit),
                    (f.padding = i.padding),
                    f.pips ? T(f.pips) : L(),
                    (f.tooltips ? M : k)(),
                    (m = []),
                    et(at(e.start) ? e.start : r, t)
            },
            target: d,
            removePips: L,
            removeTooltips: k,
            getPositions: function () {
                return m.slice()
            },
            getTooltips: function () {
                return s
            },
            getOrigins: function () {
                return l
            },
            pips: T,
        }
        return it
    }
    function z(t, e) {
        if (!t || !t.nodeName) throw new Error('noUiSlider: create requires a single element, got: ' + t)
        if (t.noUiSlider) throw new Error('noUiSlider: Slider was already initialized.')
        e = j(t, gt(e), e)
        return (t.noUiSlider = e)
    }
    var H = { __spectrum: u, cssClasses: p, create: z }
    ;(ot.create = z), (ot.cssClasses = p), (ot.default = H), Object.defineProperty(ot, '__esModule', { value: !0 })
})

/**
 * DATE PICKER LIBRARY SCRIPT
 */
//! moment.js
//! version : 2.18.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
!(function (a, b) {
    'object' == typeof exports && 'undefined' != typeof module
        ? (module.exports = b())
        : 'function' == typeof define && define.amd
          ? define(b)
          : (a.moment = b())
})(this, function () {
    'use strict'
    function a() {
        return sd.apply(null, arguments)
    }
    function b(a) {
        sd = a
    }
    function c(a) {
        return a instanceof Array || '[object Array]' === Object.prototype.toString.call(a)
    }
    function d(a) {
        return null != a && '[object Object]' === Object.prototype.toString.call(a)
    }
    function e(a) {
        var b
        for (b in a) return !1
        return !0
    }
    function f(a) {
        return void 0 === a
    }
    function g(a) {
        return 'number' == typeof a || '[object Number]' === Object.prototype.toString.call(a)
    }
    function h(a) {
        return a instanceof Date || '[object Date]' === Object.prototype.toString.call(a)
    }
    function i(a, b) {
        var c,
            d = []
        for (c = 0; c < a.length; ++c) d.push(b(a[c], c))
        return d
    }
    function j(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b)
    }
    function k(a, b) {
        for (var c in b) j(b, c) && (a[c] = b[c])
        return j(b, 'toString') && (a.toString = b.toString), j(b, 'valueOf') && (a.valueOf = b.valueOf), a
    }
    function l(a, b, c, d) {
        return sb(a, b, c, d, !0).utc()
    }
    function m() {
        return {
            empty: !1,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: !1,
            invalidMonth: null,
            invalidFormat: !1,
            userInvalidated: !1,
            iso: !1,
            parsedDateParts: [],
            meridiem: null,
            rfc2822: !1,
            weekdayMismatch: !1,
        }
    }
    function n(a) {
        return null == a._pf && (a._pf = m()), a._pf
    }
    function o(a) {
        if (null == a._isValid) {
            var b = n(a),
                c = ud.call(b.parsedDateParts, function (a) {
                    return null != a
                }),
                d =
                    !isNaN(a._d.getTime()) &&
                    b.overflow < 0 &&
                    !b.empty &&
                    !b.invalidMonth &&
                    !b.invalidWeekday &&
                    !b.nullInput &&
                    !b.invalidFormat &&
                    !b.userInvalidated &&
                    (!b.meridiem || (b.meridiem && c))
            if (
                (a._strict && (d = d && 0 === b.charsLeftOver && 0 === b.unusedTokens.length && void 0 === b.bigHour),
                null != Object.isFrozen && Object.isFrozen(a))
            )
                return d
            a._isValid = d
        }
        return a._isValid
    }
    function p(a) {
        var b = l(NaN)
        return null != a ? k(n(b), a) : (n(b).userInvalidated = !0), b
    }
    function q(a, b) {
        var c, d, e
        if (
            (f(b._isAMomentObject) || (a._isAMomentObject = b._isAMomentObject),
            f(b._i) || (a._i = b._i),
            f(b._f) || (a._f = b._f),
            f(b._l) || (a._l = b._l),
            f(b._strict) || (a._strict = b._strict),
            f(b._tzm) || (a._tzm = b._tzm),
            f(b._isUTC) || (a._isUTC = b._isUTC),
            f(b._offset) || (a._offset = b._offset),
            f(b._pf) || (a._pf = n(b)),
            f(b._locale) || (a._locale = b._locale),
            vd.length > 0)
        )
            for (c = 0; c < vd.length; c++) (d = vd[c]), (e = b[d]), f(e) || (a[d] = e)
        return a
    }
    function r(b) {
        q(this, b),
            (this._d = new Date(null != b._d ? b._d.getTime() : NaN)),
            this.isValid() || (this._d = new Date(NaN)),
            wd === !1 && ((wd = !0), a.updateOffset(this), (wd = !1))
    }
    function s(a) {
        return a instanceof r || (null != a && null != a._isAMomentObject)
    }
    function t(a) {
        return a < 0 ? Math.ceil(a) || 0 : Math.floor(a)
    }
    function u(a) {
        var b = +a,
            c = 0
        return 0 !== b && isFinite(b) && (c = t(b)), c
    }
    function v(a, b, c) {
        var d,
            e = Math.min(a.length, b.length),
            f = Math.abs(a.length - b.length),
            g = 0
        for (d = 0; d < e; d++) ((c && a[d] !== b[d]) || (!c && u(a[d]) !== u(b[d]))) && g++
        return g + f
    }
    function w(b) {
        a.suppressDeprecationWarnings === !1 && 'undefined' != typeof console && console.warn && console.warn('Deprecation warning: ' + b)
    }
    function x(b, c) {
        var d = !0
        return k(function () {
            if ((null != a.deprecationHandler && a.deprecationHandler(null, b), d)) {
                for (var e, f = [], g = 0; g < arguments.length; g++) {
                    if (((e = ''), 'object' == typeof arguments[g])) {
                        e += '\n[' + g + '] '
                        for (var h in arguments[0]) e += h + ': ' + arguments[0][h] + ', '
                        e = e.slice(0, -2)
                    } else e = arguments[g]
                    f.push(e)
                }
                w(b + '\nArguments: ' + Array.prototype.slice.call(f).join('') + '\n' + new Error().stack), (d = !1)
            }
            return c.apply(this, arguments)
        }, c)
    }
    function y(b, c) {
        null != a.deprecationHandler && a.deprecationHandler(b, c), xd[b] || (w(c), (xd[b] = !0))
    }
    function z(a) {
        return a instanceof Function || '[object Function]' === Object.prototype.toString.call(a)
    }
    function A(a) {
        var b, c
        for (c in a) (b = a[c]), z(b) ? (this[c] = b) : (this['_' + c] = b)
        ;(this._config = a),
            (this._dayOfMonthOrdinalParseLenient = new RegExp(
                (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + '|' + /\d{1,2}/.source,
            ))
    }
    function B(a, b) {
        var c,
            e = k({}, a)
        for (c in b) j(b, c) && (d(a[c]) && d(b[c]) ? ((e[c] = {}), k(e[c], a[c]), k(e[c], b[c])) : null != b[c] ? (e[c] = b[c]) : delete e[c])
        for (c in a) j(a, c) && !j(b, c) && d(a[c]) && (e[c] = k({}, e[c]))
        return e
    }
    function C(a) {
        null != a && this.set(a)
    }
    function D(a, b, c) {
        var d = this._calendar[a] || this._calendar.sameElse
        return z(d) ? d.call(b, c) : d
    }
    function E(a) {
        var b = this._longDateFormat[a],
            c = this._longDateFormat[a.toUpperCase()]
        return b || !c
            ? b
            : ((this._longDateFormat[a] = c.replace(/MMMM|MM|DD|dddd/g, function (a) {
                  return a.slice(1)
              })),
              this._longDateFormat[a])
    }
    function F() {
        return this._invalidDate
    }
    function G(a) {
        return this._ordinal.replace('%d', a)
    }
    function H(a, b, c, d) {
        var e = this._relativeTime[c]
        return z(e) ? e(a, b, c, d) : e.replace(/%d/i, a)
    }
    function I(a, b) {
        var c = this._relativeTime[a > 0 ? 'future' : 'past']
        return z(c) ? c(b) : c.replace(/%s/i, b)
    }
    function J(a, b) {
        var c = a.toLowerCase()
        Hd[c] = Hd[c + 's'] = Hd[b] = a
    }
    function K(a) {
        return 'string' == typeof a ? Hd[a] || Hd[a.toLowerCase()] : void 0
    }
    function L(a) {
        var b,
            c,
            d = {}
        for (c in a) j(a, c) && ((b = K(c)), b && (d[b] = a[c]))
        return d
    }
    function M(a, b) {
        Id[a] = b
    }
    function N(a) {
        var b = []
        for (var c in a) b.push({ unit: c, priority: Id[c] })
        return (
            b.sort(function (a, b) {
                return a.priority - b.priority
            }),
            b
        )
    }
    function O(b, c) {
        return function (d) {
            return null != d ? (Q(this, b, d), a.updateOffset(this, c), this) : P(this, b)
        }
    }
    function P(a, b) {
        return a.isValid() ? a._d['get' + (a._isUTC ? 'UTC' : '') + b]() : NaN
    }
    function Q(a, b, c) {
        a.isValid() && a._d['set' + (a._isUTC ? 'UTC' : '') + b](c)
    }
    function R(a) {
        return (a = K(a)), z(this[a]) ? this[a]() : this
    }
    function S(a, b) {
        if ('object' == typeof a) {
            a = L(a)
            for (var c = N(a), d = 0; d < c.length; d++) this[c[d].unit](a[c[d].unit])
        } else if (((a = K(a)), z(this[a]))) return this[a](b)
        return this
    }
    function T(a, b, c) {
        var d = '' + Math.abs(a),
            e = b - d.length,
            f = a >= 0
        return (f ? (c ? '+' : '') : '-') + Math.pow(10, Math.max(0, e)).toString().substr(1) + d
    }
    function U(a, b, c, d) {
        var e = d
        'string' == typeof d &&
            (e = function () {
                return this[d]()
            }),
            a && (Md[a] = e),
            b &&
                (Md[b[0]] = function () {
                    return T(e.apply(this, arguments), b[1], b[2])
                }),
            c &&
                (Md[c] = function () {
                    return this.localeData().ordinal(e.apply(this, arguments), a)
                })
    }
    function V(a) {
        return a.match(/\[[\s\S]/) ? a.replace(/^\[|\]$/g, '') : a.replace(/\\/g, '')
    }
    function W(a) {
        var b,
            c,
            d = a.match(Jd)
        for (b = 0, c = d.length; b < c; b++) Md[d[b]] ? (d[b] = Md[d[b]]) : (d[b] = V(d[b]))
        return function (b) {
            var e,
                f = ''
            for (e = 0; e < c; e++) f += z(d[e]) ? d[e].call(b, a) : d[e]
            return f
        }
    }
    function X(a, b) {
        return a.isValid() ? ((b = Y(b, a.localeData())), (Ld[b] = Ld[b] || W(b)), Ld[b](a)) : a.localeData().invalidDate()
    }
    function Y(a, b) {
        function c(a) {
            return b.longDateFormat(a) || a
        }
        var d = 5
        for (Kd.lastIndex = 0; d >= 0 && Kd.test(a); ) (a = a.replace(Kd, c)), (Kd.lastIndex = 0), (d -= 1)
        return a
    }
    function Z(a, b, c) {
        ce[a] = z(b)
            ? b
            : function (a, d) {
                  return a && c ? c : b
              }
    }
    function $(a, b) {
        return j(ce, a) ? ce[a](b._strict, b._locale) : new RegExp(_(a))
    }
    function _(a) {
        return aa(
            a.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (a, b, c, d, e) {
                return b || c || d || e
            }),
        )
    }
    function aa(a) {
        return a.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    }
    function ba(a, b) {
        var c,
            d = b
        for (
            'string' == typeof a && (a = [a]),
                g(b) &&
                    (d = function (a, c) {
                        c[b] = u(a)
                    }),
                c = 0;
            c < a.length;
            c++
        )
            de[a[c]] = d
    }
    function ca(a, b) {
        ba(a, function (a, c, d, e) {
            ;(d._w = d._w || {}), b(a, d._w, d, e)
        })
    }
    function da(a, b, c) {
        null != b && j(de, a) && de[a](b, c._a, c, a)
    }
    function ea(a, b) {
        return new Date(Date.UTC(a, b + 1, 0)).getUTCDate()
    }
    function fa(a, b) {
        return a
            ? c(this._months)
                ? this._months[a.month()]
                : this._months[(this._months.isFormat || oe).test(b) ? 'format' : 'standalone'][a.month()]
            : c(this._months)
              ? this._months
              : this._months.standalone
    }
    function ga(a, b) {
        return a
            ? c(this._monthsShort)
                ? this._monthsShort[a.month()]
                : this._monthsShort[oe.test(b) ? 'format' : 'standalone'][a.month()]
            : c(this._monthsShort)
              ? this._monthsShort
              : this._monthsShort.standalone
    }
    function ha(a, b, c) {
        var d,
            e,
            f,
            g = a.toLocaleLowerCase()
        if (!this._monthsParse)
            for (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = [], d = 0; d < 12; ++d)
                (f = l([2e3, d])),
                    (this._shortMonthsParse[d] = this.monthsShort(f, '').toLocaleLowerCase()),
                    (this._longMonthsParse[d] = this.months(f, '').toLocaleLowerCase())
        return c
            ? 'MMM' === b
                ? ((e = ne.call(this._shortMonthsParse, g)), e !== -1 ? e : null)
                : ((e = ne.call(this._longMonthsParse, g)), e !== -1 ? e : null)
            : 'MMM' === b
              ? ((e = ne.call(this._shortMonthsParse, g)), e !== -1 ? e : ((e = ne.call(this._longMonthsParse, g)), e !== -1 ? e : null))
              : ((e = ne.call(this._longMonthsParse, g)), e !== -1 ? e : ((e = ne.call(this._shortMonthsParse, g)), e !== -1 ? e : null))
    }
    function ia(a, b, c) {
        var d, e, f
        if (this._monthsParseExact) return ha.call(this, a, b, c)
        for (this._monthsParse || ((this._monthsParse = []), (this._longMonthsParse = []), (this._shortMonthsParse = [])), d = 0; d < 12; d++) {
            if (
                ((e = l([2e3, d])),
                c &&
                    !this._longMonthsParse[d] &&
                    ((this._longMonthsParse[d] = new RegExp('^' + this.months(e, '').replace('.', '') + '$', 'i')),
                    (this._shortMonthsParse[d] = new RegExp('^' + this.monthsShort(e, '').replace('.', '') + '$', 'i'))),
                c ||
                    this._monthsParse[d] ||
                    ((f = '^' + this.months(e, '') + '|^' + this.monthsShort(e, '')), (this._monthsParse[d] = new RegExp(f.replace('.', ''), 'i'))),
                c && 'MMMM' === b && this._longMonthsParse[d].test(a))
            )
                return d
            if (c && 'MMM' === b && this._shortMonthsParse[d].test(a)) return d
            if (!c && this._monthsParse[d].test(a)) return d
        }
    }
    function ja(a, b) {
        var c
        if (!a.isValid()) return a
        if ('string' == typeof b)
            if (/^\d+$/.test(b)) b = u(b)
            else if (((b = a.localeData().monthsParse(b)), !g(b))) return a
        return (c = Math.min(a.date(), ea(a.year(), b))), a._d['set' + (a._isUTC ? 'UTC' : '') + 'Month'](b, c), a
    }
    function ka(b) {
        return null != b ? (ja(this, b), a.updateOffset(this, !0), this) : P(this, 'Month')
    }
    function la() {
        return ea(this.year(), this.month())
    }
    function ma(a) {
        return this._monthsParseExact
            ? (j(this, '_monthsRegex') || oa.call(this), a ? this._monthsShortStrictRegex : this._monthsShortRegex)
            : (j(this, '_monthsShortRegex') || (this._monthsShortRegex = re),
              this._monthsShortStrictRegex && a ? this._monthsShortStrictRegex : this._monthsShortRegex)
    }
    function na(a) {
        return this._monthsParseExact
            ? (j(this, '_monthsRegex') || oa.call(this), a ? this._monthsStrictRegex : this._monthsRegex)
            : (j(this, '_monthsRegex') || (this._monthsRegex = se), this._monthsStrictRegex && a ? this._monthsStrictRegex : this._monthsRegex)
    }
    function oa() {
        function a(a, b) {
            return b.length - a.length
        }
        var b,
            c,
            d = [],
            e = [],
            f = []
        for (b = 0; b < 12; b++)
            (c = l([2e3, b])),
                d.push(this.monthsShort(c, '')),
                e.push(this.months(c, '')),
                f.push(this.months(c, '')),
                f.push(this.monthsShort(c, ''))
        for (d.sort(a), e.sort(a), f.sort(a), b = 0; b < 12; b++) (d[b] = aa(d[b])), (e[b] = aa(e[b]))
        for (b = 0; b < 24; b++) f[b] = aa(f[b])
        ;(this._monthsRegex = new RegExp('^(' + f.join('|') + ')', 'i')),
            (this._monthsShortRegex = this._monthsRegex),
            (this._monthsStrictRegex = new RegExp('^(' + e.join('|') + ')', 'i')),
            (this._monthsShortStrictRegex = new RegExp('^(' + d.join('|') + ')', 'i'))
    }
    function pa(a) {
        return qa(a) ? 366 : 365
    }
    function qa(a) {
        return (a % 4 === 0 && a % 100 !== 0) || a % 400 === 0
    }
    function ra() {
        return qa(this.year())
    }
    function sa(a, b, c, d, e, f, g) {
        var h = new Date(a, b, c, d, e, f, g)
        return a < 100 && a >= 0 && isFinite(h.getFullYear()) && h.setFullYear(a), h
    }
    function ta(a) {
        var b = new Date(Date.UTC.apply(null, arguments))
        return a < 100 && a >= 0 && isFinite(b.getUTCFullYear()) && b.setUTCFullYear(a), b
    }
    function ua(a, b, c) {
        var d = 7 + b - c,
            e = (7 + ta(a, 0, d).getUTCDay() - b) % 7
        return -e + d - 1
    }
    function va(a, b, c, d, e) {
        var f,
            g,
            h = (7 + c - d) % 7,
            i = ua(a, d, e),
            j = 1 + 7 * (b - 1) + h + i
        return j <= 0 ? ((f = a - 1), (g = pa(f) + j)) : j > pa(a) ? ((f = a + 1), (g = j - pa(a))) : ((f = a), (g = j)), { year: f, dayOfYear: g }
    }
    function wa(a, b, c) {
        var d,
            e,
            f = ua(a.year(), b, c),
            g = Math.floor((a.dayOfYear() - f - 1) / 7) + 1
        return (
            g < 1
                ? ((e = a.year() - 1), (d = g + xa(e, b, c)))
                : g > xa(a.year(), b, c)
                  ? ((d = g - xa(a.year(), b, c)), (e = a.year() + 1))
                  : ((e = a.year()), (d = g)),
            { week: d, year: e }
        )
    }
    function xa(a, b, c) {
        var d = ua(a, b, c),
            e = ua(a + 1, b, c)
        return (pa(a) - d + e) / 7
    }
    function ya(a) {
        return wa(a, this._week.dow, this._week.doy).week
    }
    function za() {
        return this._week.dow
    }
    function Aa() {
        return this._week.doy
    }
    function Ba(a) {
        var b = this.localeData().week(this)
        return null == a ? b : this.add(7 * (a - b), 'd')
    }
    function Ca(a) {
        var b = wa(this, 1, 4).week
        return null == a ? b : this.add(7 * (a - b), 'd')
    }
    function Da(a, b) {
        return 'string' != typeof a ? a : isNaN(a) ? ((a = b.weekdaysParse(a)), 'number' == typeof a ? a : null) : parseInt(a, 10)
    }
    function Ea(a, b) {
        return 'string' == typeof a ? b.weekdaysParse(a) % 7 || 7 : isNaN(a) ? null : a
    }
    function Fa(a, b) {
        return a
            ? c(this._weekdays)
                ? this._weekdays[a.day()]
                : this._weekdays[this._weekdays.isFormat.test(b) ? 'format' : 'standalone'][a.day()]
            : c(this._weekdays)
              ? this._weekdays
              : this._weekdays.standalone
    }
    function Ga(a) {
        return a ? this._weekdaysShort[a.day()] : this._weekdaysShort
    }
    function Ha(a) {
        return a ? this._weekdaysMin[a.day()] : this._weekdaysMin
    }
    function Ia(a, b, c) {
        var d,
            e,
            f,
            g = a.toLocaleLowerCase()
        if (!this._weekdaysParse)
            for (this._weekdaysParse = [], this._shortWeekdaysParse = [], this._minWeekdaysParse = [], d = 0; d < 7; ++d)
                (f = l([2e3, 1]).day(d)),
                    (this._minWeekdaysParse[d] = this.weekdaysMin(f, '').toLocaleLowerCase()),
                    (this._shortWeekdaysParse[d] = this.weekdaysShort(f, '').toLocaleLowerCase()),
                    (this._weekdaysParse[d] = this.weekdays(f, '').toLocaleLowerCase())
        return c
            ? 'dddd' === b
                ? ((e = ne.call(this._weekdaysParse, g)), e !== -1 ? e : null)
                : 'ddd' === b
                  ? ((e = ne.call(this._shortWeekdaysParse, g)), e !== -1 ? e : null)
                  : ((e = ne.call(this._minWeekdaysParse, g)), e !== -1 ? e : null)
            : 'dddd' === b
              ? ((e = ne.call(this._weekdaysParse, g)),
                e !== -1
                    ? e
                    : ((e = ne.call(this._shortWeekdaysParse, g)), e !== -1 ? e : ((e = ne.call(this._minWeekdaysParse, g)), e !== -1 ? e : null)))
              : 'ddd' === b
                ? ((e = ne.call(this._shortWeekdaysParse, g)),
                  e !== -1
                      ? e
                      : ((e = ne.call(this._weekdaysParse, g)), e !== -1 ? e : ((e = ne.call(this._minWeekdaysParse, g)), e !== -1 ? e : null)))
                : ((e = ne.call(this._minWeekdaysParse, g)),
                  e !== -1
                      ? e
                      : ((e = ne.call(this._weekdaysParse, g)), e !== -1 ? e : ((e = ne.call(this._shortWeekdaysParse, g)), e !== -1 ? e : null)))
    }
    function Ja(a, b, c) {
        var d, e, f
        if (this._weekdaysParseExact) return Ia.call(this, a, b, c)
        for (
            this._weekdaysParse ||
                ((this._weekdaysParse = []), (this._minWeekdaysParse = []), (this._shortWeekdaysParse = []), (this._fullWeekdaysParse = [])),
                d = 0;
            d < 7;
            d++
        ) {
            if (
                ((e = l([2e3, 1]).day(d)),
                c &&
                    !this._fullWeekdaysParse[d] &&
                    ((this._fullWeekdaysParse[d] = new RegExp('^' + this.weekdays(e, '').replace('.', '.?') + '$', 'i')),
                    (this._shortWeekdaysParse[d] = new RegExp('^' + this.weekdaysShort(e, '').replace('.', '.?') + '$', 'i')),
                    (this._minWeekdaysParse[d] = new RegExp('^' + this.weekdaysMin(e, '').replace('.', '.?') + '$', 'i'))),
                this._weekdaysParse[d] ||
                    ((f = '^' + this.weekdays(e, '') + '|^' + this.weekdaysShort(e, '') + '|^' + this.weekdaysMin(e, '')),
                    (this._weekdaysParse[d] = new RegExp(f.replace('.', ''), 'i'))),
                c && 'dddd' === b && this._fullWeekdaysParse[d].test(a))
            )
                return d
            if (c && 'ddd' === b && this._shortWeekdaysParse[d].test(a)) return d
            if (c && 'dd' === b && this._minWeekdaysParse[d].test(a)) return d
            if (!c && this._weekdaysParse[d].test(a)) return d
        }
    }
    function Ka(a) {
        if (!this.isValid()) return null != a ? this : NaN
        var b = this._isUTC ? this._d.getUTCDay() : this._d.getDay()
        return null != a ? ((a = Da(a, this.localeData())), this.add(a - b, 'd')) : b
    }
    function La(a) {
        if (!this.isValid()) return null != a ? this : NaN
        var b = (this.day() + 7 - this.localeData()._week.dow) % 7
        return null == a ? b : this.add(a - b, 'd')
    }
    function Ma(a) {
        if (!this.isValid()) return null != a ? this : NaN
        if (null != a) {
            var b = Ea(a, this.localeData())
            return this.day(this.day() % 7 ? b : b - 7)
        }
        return this.day() || 7
    }
    function Na(a) {
        return this._weekdaysParseExact
            ? (j(this, '_weekdaysRegex') || Qa.call(this), a ? this._weekdaysStrictRegex : this._weekdaysRegex)
            : (j(this, '_weekdaysRegex') || (this._weekdaysRegex = ye),
              this._weekdaysStrictRegex && a ? this._weekdaysStrictRegex : this._weekdaysRegex)
    }
    function Oa(a) {
        return this._weekdaysParseExact
            ? (j(this, '_weekdaysRegex') || Qa.call(this), a ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex)
            : (j(this, '_weekdaysShortRegex') || (this._weekdaysShortRegex = ze),
              this._weekdaysShortStrictRegex && a ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex)
    }
    function Pa(a) {
        return this._weekdaysParseExact
            ? (j(this, '_weekdaysRegex') || Qa.call(this), a ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex)
            : (j(this, '_weekdaysMinRegex') || (this._weekdaysMinRegex = Ae),
              this._weekdaysMinStrictRegex && a ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex)
    }
    function Qa() {
        function a(a, b) {
            return b.length - a.length
        }
        var b,
            c,
            d,
            e,
            f,
            g = [],
            h = [],
            i = [],
            j = []
        for (b = 0; b < 7; b++)
            (c = l([2e3, 1]).day(b)),
                (d = this.weekdaysMin(c, '')),
                (e = this.weekdaysShort(c, '')),
                (f = this.weekdays(c, '')),
                g.push(d),
                h.push(e),
                i.push(f),
                j.push(d),
                j.push(e),
                j.push(f)
        for (g.sort(a), h.sort(a), i.sort(a), j.sort(a), b = 0; b < 7; b++) (h[b] = aa(h[b])), (i[b] = aa(i[b])), (j[b] = aa(j[b]))
        ;(this._weekdaysRegex = new RegExp('^(' + j.join('|') + ')', 'i')),
            (this._weekdaysShortRegex = this._weekdaysRegex),
            (this._weekdaysMinRegex = this._weekdaysRegex),
            (this._weekdaysStrictRegex = new RegExp('^(' + i.join('|') + ')', 'i')),
            (this._weekdaysShortStrictRegex = new RegExp('^(' + h.join('|') + ')', 'i')),
            (this._weekdaysMinStrictRegex = new RegExp('^(' + g.join('|') + ')', 'i'))
    }
    function Ra() {
        return this.hours() % 12 || 12
    }
    function Sa() {
        return this.hours() || 24
    }
    function Ta(a, b) {
        U(a, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), b)
        })
    }
    function Ua(a, b) {
        return b._meridiemParse
    }
    function Va(a) {
        return 'p' === (a + '').toLowerCase().charAt(0)
    }
    function Wa(a, b, c) {
        return a > 11 ? (c ? 'pm' : 'PM') : c ? 'am' : 'AM'
    }
    function Xa(a) {
        return a ? a.toLowerCase().replace('_', '-') : a
    }
    function Ya(a) {
        for (var b, c, d, e, f = 0; f < a.length; ) {
            for (e = Xa(a[f]).split('-'), b = e.length, c = Xa(a[f + 1]), c = c ? c.split('-') : null; b > 0; ) {
                if ((d = Za(e.slice(0, b).join('-')))) return d
                if (c && c.length >= b && v(e, c, !0) >= b - 1) break
                b--
            }
            f++
        }
        return null
    }
    function Za(a) {
        var b = null
        if (!Fe[a] && 'undefined' != typeof module && module && module.exports)
            try {
                ;(b = Be._abbr), require('./locale/' + a), $a(b)
            } catch (a) {}
        return Fe[a]
    }
    function $a(a, b) {
        var c
        return a && ((c = f(b) ? bb(a) : _a(a, b)), c && (Be = c)), Be._abbr
    }
    function _a(a, b) {
        if (null !== b) {
            var c = Ee
            if (((b.abbr = a), null != Fe[a]))
                y(
                    'defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info.',
                ),
                    (c = Fe[a]._config)
            else if (null != b.parentLocale) {
                if (null == Fe[b.parentLocale])
                    return Ge[b.parentLocale] || (Ge[b.parentLocale] = []), Ge[b.parentLocale].push({ name: a, config: b }), null
                c = Fe[b.parentLocale]._config
            }
            return (
                (Fe[a] = new C(B(c, b))),
                Ge[a] &&
                    Ge[a].forEach(function (a) {
                        _a(a.name, a.config)
                    }),
                $a(a),
                Fe[a]
            )
        }
        return delete Fe[a], null
    }
    function ab(a, b) {
        if (null != b) {
            var c,
                d = Ee
            null != Fe[a] && (d = Fe[a]._config), (b = B(d, b)), (c = new C(b)), (c.parentLocale = Fe[a]), (Fe[a] = c), $a(a)
        } else null != Fe[a] && (null != Fe[a].parentLocale ? (Fe[a] = Fe[a].parentLocale) : null != Fe[a] && delete Fe[a])
        return Fe[a]
    }
    function bb(a) {
        var b
        if ((a && a._locale && a._locale._abbr && (a = a._locale._abbr), !a)) return Be
        if (!c(a)) {
            if ((b = Za(a))) return b
            a = [a]
        }
        return Ya(a)
    }
    function cb() {
        return Ad(Fe)
    }
    function db(a) {
        var b,
            c = a._a
        return (
            c &&
                n(a).overflow === -2 &&
                ((b =
                    c[fe] < 0 || c[fe] > 11
                        ? fe
                        : c[ge] < 1 || c[ge] > ea(c[ee], c[fe])
                          ? ge
                          : c[he] < 0 || c[he] > 24 || (24 === c[he] && (0 !== c[ie] || 0 !== c[je] || 0 !== c[ke]))
                            ? he
                            : c[ie] < 0 || c[ie] > 59
                              ? ie
                              : c[je] < 0 || c[je] > 59
                                ? je
                                : c[ke] < 0 || c[ke] > 999
                                  ? ke
                                  : -1),
                n(a)._overflowDayOfYear && (b < ee || b > ge) && (b = ge),
                n(a)._overflowWeeks && b === -1 && (b = le),
                n(a)._overflowWeekday && b === -1 && (b = me),
                (n(a).overflow = b)),
            a
        )
    }
    function eb(a) {
        var b,
            c,
            d,
            e,
            f,
            g,
            h = a._i,
            i = He.exec(h) || Ie.exec(h)
        if (i) {
            for (n(a).iso = !0, b = 0, c = Ke.length; b < c; b++)
                if (Ke[b][1].exec(i[1])) {
                    ;(e = Ke[b][0]), (d = Ke[b][2] !== !1)
                    break
                }
            if (null == e) return void (a._isValid = !1)
            if (i[3]) {
                for (b = 0, c = Le.length; b < c; b++)
                    if (Le[b][1].exec(i[3])) {
                        f = (i[2] || ' ') + Le[b][0]
                        break
                    }
                if (null == f) return void (a._isValid = !1)
            }
            if (!d && null != f) return void (a._isValid = !1)
            if (i[4]) {
                if (!Je.exec(i[4])) return void (a._isValid = !1)
                g = 'Z'
            }
            ;(a._f = e + (f || '') + (g || '')), lb(a)
        } else a._isValid = !1
    }
    function fb(a) {
        var b,
            c,
            d,
            e,
            f,
            g,
            h,
            i,
            j = {
                ' GMT': ' +0000',
                ' EDT': ' -0400',
                ' EST': ' -0500',
                ' CDT': ' -0500',
                ' CST': ' -0600',
                ' MDT': ' -0600',
                ' MST': ' -0700',
                ' PDT': ' -0700',
                ' PST': ' -0800',
            },
            k = 'YXWVUTSRQPONZABCDEFGHIKLM'
        if (
            ((b = a._i
                .replace(/\([^\)]*\)|[\n\t]/g, ' ')
                .replace(/(\s\s+)/g, ' ')
                .replace(/^\s|\s$/g, '')),
            (c = Ne.exec(b)))
        ) {
            if (
                ((d = c[1] ? 'ddd' + (5 === c[1].length ? ', ' : ' ') : ''),
                (e = 'D MMM ' + (c[2].length > 10 ? 'YYYY ' : 'YY ')),
                (f = 'HH:mm' + (c[4] ? ':ss' : '')),
                c[1])
            ) {
                var l = new Date(c[2]),
                    m = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][l.getDay()]
                if (c[1].substr(0, 3) !== m) return (n(a).weekdayMismatch = !0), void (a._isValid = !1)
            }
            switch (c[5].length) {
                case 2:
                    0 === i
                        ? (h = ' +0000')
                        : ((i = k.indexOf(c[5][1].toUpperCase()) - 12),
                          (h = (i < 0 ? ' -' : ' +') + ('' + i).replace(/^-?/, '0').match(/..$/)[0] + '00'))
                    break
                case 4:
                    h = j[c[5]]
                    break
                default:
                    h = j[' GMT']
            }
            ;(c[5] = h), (a._i = c.splice(1).join('')), (g = ' ZZ'), (a._f = d + e + f + g), lb(a), (n(a).rfc2822 = !0)
        } else a._isValid = !1
    }
    function gb(b) {
        var c = Me.exec(b._i)
        return null !== c
            ? void (b._d = new Date(+c[1]))
            : (eb(b), void (b._isValid === !1 && (delete b._isValid, fb(b), b._isValid === !1 && (delete b._isValid, a.createFromInputFallback(b)))))
    }
    function hb(a, b, c) {
        return null != a ? a : null != b ? b : c
    }
    function ib(b) {
        var c = new Date(a.now())
        return b._useUTC ? [c.getUTCFullYear(), c.getUTCMonth(), c.getUTCDate()] : [c.getFullYear(), c.getMonth(), c.getDate()]
    }
    function jb(a) {
        var b,
            c,
            d,
            e,
            f = []
        if (!a._d) {
            for (
                d = ib(a),
                    a._w && null == a._a[ge] && null == a._a[fe] && kb(a),
                    null != a._dayOfYear &&
                        ((e = hb(a._a[ee], d[ee])),
                        (a._dayOfYear > pa(e) || 0 === a._dayOfYear) && (n(a)._overflowDayOfYear = !0),
                        (c = ta(e, 0, a._dayOfYear)),
                        (a._a[fe] = c.getUTCMonth()),
                        (a._a[ge] = c.getUTCDate())),
                    b = 0;
                b < 3 && null == a._a[b];
                ++b
            )
                a._a[b] = f[b] = d[b]
            for (; b < 7; b++) a._a[b] = f[b] = null == a._a[b] ? (2 === b ? 1 : 0) : a._a[b]
            24 === a._a[he] && 0 === a._a[ie] && 0 === a._a[je] && 0 === a._a[ke] && ((a._nextDay = !0), (a._a[he] = 0)),
                (a._d = (a._useUTC ? ta : sa).apply(null, f)),
                null != a._tzm && a._d.setUTCMinutes(a._d.getUTCMinutes() - a._tzm),
                a._nextDay && (a._a[he] = 24)
        }
    }
    function kb(a) {
        var b, c, d, e, f, g, h, i
        if (((b = a._w), null != b.GG || null != b.W || null != b.E))
            (f = 1), (g = 4), (c = hb(b.GG, a._a[ee], wa(tb(), 1, 4).year)), (d = hb(b.W, 1)), (e = hb(b.E, 1)), (e < 1 || e > 7) && (i = !0)
        else {
            ;(f = a._locale._week.dow), (g = a._locale._week.doy)
            var j = wa(tb(), f, g)
            ;(c = hb(b.gg, a._a[ee], j.year)),
                (d = hb(b.w, j.week)),
                null != b.d ? ((e = b.d), (e < 0 || e > 6) && (i = !0)) : null != b.e ? ((e = b.e + f), (b.e < 0 || b.e > 6) && (i = !0)) : (e = f)
        }
        d < 1 || d > xa(c, f, g)
            ? (n(a)._overflowWeeks = !0)
            : null != i
              ? (n(a)._overflowWeekday = !0)
              : ((h = va(c, d, e, f, g)), (a._a[ee] = h.year), (a._dayOfYear = h.dayOfYear))
    }
    function lb(b) {
        if (b._f === a.ISO_8601) return void eb(b)
        if (b._f === a.RFC_2822) return void fb(b)
        ;(b._a = []), (n(b).empty = !0)
        var c,
            d,
            e,
            f,
            g,
            h = '' + b._i,
            i = h.length,
            j = 0
        for (e = Y(b._f, b._locale).match(Jd) || [], c = 0; c < e.length; c++)
            (f = e[c]),
                (d = (h.match($(f, b)) || [])[0]),
                d &&
                    ((g = h.substr(0, h.indexOf(d))),
                    g.length > 0 && n(b).unusedInput.push(g),
                    (h = h.slice(h.indexOf(d) + d.length)),
                    (j += d.length)),
                Md[f] ? (d ? (n(b).empty = !1) : n(b).unusedTokens.push(f), da(f, d, b)) : b._strict && !d && n(b).unusedTokens.push(f)
        ;(n(b).charsLeftOver = i - j),
            h.length > 0 && n(b).unusedInput.push(h),
            b._a[he] <= 12 && n(b).bigHour === !0 && b._a[he] > 0 && (n(b).bigHour = void 0),
            (n(b).parsedDateParts = b._a.slice(0)),
            (n(b).meridiem = b._meridiem),
            (b._a[he] = mb(b._locale, b._a[he], b._meridiem)),
            jb(b),
            db(b)
    }
    function mb(a, b, c) {
        var d
        return null == c
            ? b
            : null != a.meridiemHour
              ? a.meridiemHour(b, c)
              : null != a.isPM
                ? ((d = a.isPM(c)), d && b < 12 && (b += 12), d || 12 !== b || (b = 0), b)
                : b
    }
    function nb(a) {
        var b, c, d, e, f
        if (0 === a._f.length) return (n(a).invalidFormat = !0), void (a._d = new Date(NaN))
        for (e = 0; e < a._f.length; e++)
            (f = 0),
                (b = q({}, a)),
                null != a._useUTC && (b._useUTC = a._useUTC),
                (b._f = a._f[e]),
                lb(b),
                o(b) &&
                    ((f += n(b).charsLeftOver), (f += 10 * n(b).unusedTokens.length), (n(b).score = f), (null == d || f < d) && ((d = f), (c = b)))
        k(a, c || b)
    }
    function ob(a) {
        if (!a._d) {
            var b = L(a._i)
            ;(a._a = i([b.year, b.month, b.day || b.date, b.hour, b.minute, b.second, b.millisecond], function (a) {
                return a && parseInt(a, 10)
            })),
                jb(a)
        }
    }
    function pb(a) {
        var b = new r(db(qb(a)))
        return b._nextDay && (b.add(1, 'd'), (b._nextDay = void 0)), b
    }
    function qb(a) {
        var b = a._i,
            d = a._f
        return (
            (a._locale = a._locale || bb(a._l)),
            null === b || (void 0 === d && '' === b)
                ? p({ nullInput: !0 })
                : ('string' == typeof b && (a._i = b = a._locale.preparse(b)),
                  s(b) ? new r(db(b)) : (h(b) ? (a._d = b) : c(d) ? nb(a) : d ? lb(a) : rb(a), o(a) || (a._d = null), a))
        )
    }
    function rb(b) {
        var e = b._i
        f(e)
            ? (b._d = new Date(a.now()))
            : h(e)
              ? (b._d = new Date(e.valueOf()))
              : 'string' == typeof e
                ? gb(b)
                : c(e)
                  ? ((b._a = i(e.slice(0), function (a) {
                        return parseInt(a, 10)
                    })),
                    jb(b))
                  : d(e)
                    ? ob(b)
                    : g(e)
                      ? (b._d = new Date(e))
                      : a.createFromInputFallback(b)
    }
    function sb(a, b, f, g, h) {
        var i = {}
        return (
            (f !== !0 && f !== !1) || ((g = f), (f = void 0)),
            ((d(a) && e(a)) || (c(a) && 0 === a.length)) && (a = void 0),
            (i._isAMomentObject = !0),
            (i._useUTC = i._isUTC = h),
            (i._l = f),
            (i._i = a),
            (i._f = b),
            (i._strict = g),
            pb(i)
        )
    }
    function tb(a, b, c, d) {
        return sb(a, b, c, d, !1)
    }
    function ub(a, b) {
        var d, e
        if ((1 === b.length && c(b[0]) && (b = b[0]), !b.length)) return tb()
        for (d = b[0], e = 1; e < b.length; ++e) (b[e].isValid() && !b[e][a](d)) || (d = b[e])
        return d
    }
    function vb() {
        var a = [].slice.call(arguments, 0)
        return ub('isBefore', a)
    }
    function wb() {
        var a = [].slice.call(arguments, 0)
        return ub('isAfter', a)
    }
    function xb(a) {
        for (var b in a) if (Re.indexOf(b) === -1 || (null != a[b] && isNaN(a[b]))) return !1
        for (var c = !1, d = 0; d < Re.length; ++d)
            if (a[Re[d]]) {
                if (c) return !1
                parseFloat(a[Re[d]]) !== u(a[Re[d]]) && (c = !0)
            }
        return !0
    }
    function yb() {
        return this._isValid
    }
    function zb() {
        return Sb(NaN)
    }
    function Ab(a) {
        var b = L(a),
            c = b.year || 0,
            d = b.quarter || 0,
            e = b.month || 0,
            f = b.week || 0,
            g = b.day || 0,
            h = b.hour || 0,
            i = b.minute || 0,
            j = b.second || 0,
            k = b.millisecond || 0
        ;(this._isValid = xb(b)),
            (this._milliseconds = +k + 1e3 * j + 6e4 * i + 1e3 * h * 60 * 60),
            (this._days = +g + 7 * f),
            (this._months = +e + 3 * d + 12 * c),
            (this._data = {}),
            (this._locale = bb()),
            this._bubble()
    }
    function Bb(a) {
        return a instanceof Ab
    }
    function Cb(a) {
        return a < 0 ? Math.round(-1 * a) * -1 : Math.round(a)
    }
    function Db(a, b) {
        U(a, 0, 0, function () {
            var a = this.utcOffset(),
                c = '+'
            return a < 0 && ((a = -a), (c = '-')), c + T(~~(a / 60), 2) + b + T(~~a % 60, 2)
        })
    }
    function Eb(a, b) {
        var c = (b || '').match(a)
        if (null === c) return null
        var d = c[c.length - 1] || [],
            e = (d + '').match(Se) || ['-', 0, 0],
            f = +(60 * e[1]) + u(e[2])
        return 0 === f ? 0 : '+' === e[0] ? f : -f
    }
    function Fb(b, c) {
        var d, e
        return c._isUTC
            ? ((d = c.clone()),
              (e = (s(b) || h(b) ? b.valueOf() : tb(b).valueOf()) - d.valueOf()),
              d._d.setTime(d._d.valueOf() + e),
              a.updateOffset(d, !1),
              d)
            : tb(b).local()
    }
    function Gb(a) {
        return 15 * -Math.round(a._d.getTimezoneOffset() / 15)
    }
    function Hb(b, c, d) {
        var e,
            f = this._offset || 0
        if (!this.isValid()) return null != b ? this : NaN
        if (null != b) {
            if ('string' == typeof b) {
                if (((b = Eb(_d, b)), null === b)) return this
            } else Math.abs(b) < 16 && !d && (b = 60 * b)
            return (
                !this._isUTC && c && (e = Gb(this)),
                (this._offset = b),
                (this._isUTC = !0),
                null != e && this.add(e, 'm'),
                f !== b &&
                    (!c || this._changeInProgress
                        ? Xb(this, Sb(b - f, 'm'), 1, !1)
                        : this._changeInProgress || ((this._changeInProgress = !0), a.updateOffset(this, !0), (this._changeInProgress = null))),
                this
            )
        }
        return this._isUTC ? f : Gb(this)
    }
    function Ib(a, b) {
        return null != a ? ('string' != typeof a && (a = -a), this.utcOffset(a, b), this) : -this.utcOffset()
    }
    function Jb(a) {
        return this.utcOffset(0, a)
    }
    function Kb(a) {
        return this._isUTC && (this.utcOffset(0, a), (this._isUTC = !1), a && this.subtract(Gb(this), 'm')), this
    }
    function Lb() {
        if (null != this._tzm) this.utcOffset(this._tzm, !1, !0)
        else if ('string' == typeof this._i) {
            var a = Eb($d, this._i)
            null != a ? this.utcOffset(a) : this.utcOffset(0, !0)
        }
        return this
    }
    function Mb(a) {
        return !!this.isValid() && ((a = a ? tb(a).utcOffset() : 0), (this.utcOffset() - a) % 60 === 0)
    }
    function Nb() {
        return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset()
    }
    function Ob() {
        if (!f(this._isDSTShifted)) return this._isDSTShifted
        var a = {}
        if ((q(a, this), (a = qb(a)), a._a)) {
            var b = a._isUTC ? l(a._a) : tb(a._a)
            this._isDSTShifted = this.isValid() && v(a._a, b.toArray()) > 0
        } else this._isDSTShifted = !1
        return this._isDSTShifted
    }
    function Pb() {
        return !!this.isValid() && !this._isUTC
    }
    function Qb() {
        return !!this.isValid() && this._isUTC
    }
    function Rb() {
        return !!this.isValid() && this._isUTC && 0 === this._offset
    }
    function Sb(a, b) {
        var c,
            d,
            e,
            f = a,
            h = null
        return (
            Bb(a)
                ? (f = { ms: a._milliseconds, d: a._days, M: a._months })
                : g(a)
                  ? ((f = {}), b ? (f[b] = a) : (f.milliseconds = a))
                  : (h = Te.exec(a))
                    ? ((c = '-' === h[1] ? -1 : 1),
                      (f = {
                          y: 0,
                          d: u(h[ge]) * c,
                          h: u(h[he]) * c,
                          m: u(h[ie]) * c,
                          s: u(h[je]) * c,
                          ms: u(Cb(1e3 * h[ke])) * c,
                      }))
                    : (h = Ue.exec(a))
                      ? ((c = '-' === h[1] ? -1 : 1),
                        (f = {
                            y: Tb(h[2], c),
                            M: Tb(h[3], c),
                            w: Tb(h[4], c),
                            d: Tb(h[5], c),
                            h: Tb(h[6], c),
                            m: Tb(h[7], c),
                            s: Tb(h[8], c),
                        }))
                      : null == f
                        ? (f = {})
                        : 'object' == typeof f &&
                          ('from' in f || 'to' in f) &&
                          ((e = Vb(tb(f.from), tb(f.to))), (f = {}), (f.ms = e.milliseconds), (f.M = e.months)),
            (d = new Ab(f)),
            Bb(a) && j(a, '_locale') && (d._locale = a._locale),
            d
        )
    }
    function Tb(a, b) {
        var c = a && parseFloat(a.replace(',', '.'))
        return (isNaN(c) ? 0 : c) * b
    }
    function Ub(a, b) {
        var c = { milliseconds: 0, months: 0 }
        return (
            (c.months = b.month() - a.month() + 12 * (b.year() - a.year())),
            a.clone().add(c.months, 'M').isAfter(b) && --c.months,
            (c.milliseconds = +b - +a.clone().add(c.months, 'M')),
            c
        )
    }
    function Vb(a, b) {
        var c
        return a.isValid() && b.isValid()
            ? ((b = Fb(b, a)), a.isBefore(b) ? (c = Ub(a, b)) : ((c = Ub(b, a)), (c.milliseconds = -c.milliseconds), (c.months = -c.months)), c)
            : { milliseconds: 0, months: 0 }
    }
    function Wb(a, b) {
        return function (c, d) {
            var e, f
            return (
                null === d ||
                    isNaN(+d) ||
                    (y(
                        b,
                        'moment().' +
                            b +
                            '(period, number) is deprecated. Please use moment().' +
                            b +
                            '(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.',
                    ),
                    (f = c),
                    (c = d),
                    (d = f)),
                (c = 'string' == typeof c ? +c : c),
                (e = Sb(c, d)),
                Xb(this, e, a),
                this
            )
        }
    }
    function Xb(b, c, d, e) {
        var f = c._milliseconds,
            g = Cb(c._days),
            h = Cb(c._months)
        b.isValid() &&
            ((e = null == e || e),
            f && b._d.setTime(b._d.valueOf() + f * d),
            g && Q(b, 'Date', P(b, 'Date') + g * d),
            h && ja(b, P(b, 'Month') + h * d),
            e && a.updateOffset(b, g || h))
    }
    function Yb(a, b) {
        var c = a.diff(b, 'days', !0)
        return c < -6 ? 'sameElse' : c < -1 ? 'lastWeek' : c < 0 ? 'lastDay' : c < 1 ? 'sameDay' : c < 2 ? 'nextDay' : c < 7 ? 'nextWeek' : 'sameElse'
    }
    function Zb(b, c) {
        var d = b || tb(),
            e = Fb(d, this).startOf('day'),
            f = a.calendarFormat(this, e) || 'sameElse',
            g = c && (z(c[f]) ? c[f].call(this, d) : c[f])
        return this.format(g || this.localeData().calendar(f, this, tb(d)))
    }
    function $b() {
        return new r(this)
    }
    function _b(a, b) {
        var c = s(a) ? a : tb(a)
        return (
            !(!this.isValid() || !c.isValid()) &&
            ((b = K(f(b) ? 'millisecond' : b)), 'millisecond' === b ? this.valueOf() > c.valueOf() : c.valueOf() < this.clone().startOf(b).valueOf())
        )
    }
    function ac(a, b) {
        var c = s(a) ? a : tb(a)
        return (
            !(!this.isValid() || !c.isValid()) &&
            ((b = K(f(b) ? 'millisecond' : b)), 'millisecond' === b ? this.valueOf() < c.valueOf() : this.clone().endOf(b).valueOf() < c.valueOf())
        )
    }
    function bc(a, b, c, d) {
        return (
            (d = d || '()'), ('(' === d[0] ? this.isAfter(a, c) : !this.isBefore(a, c)) && (')' === d[1] ? this.isBefore(b, c) : !this.isAfter(b, c))
        )
    }
    function cc(a, b) {
        var c,
            d = s(a) ? a : tb(a)
        return (
            !(!this.isValid() || !d.isValid()) &&
            ((b = K(b || 'millisecond')),
            'millisecond' === b
                ? this.valueOf() === d.valueOf()
                : ((c = d.valueOf()), this.clone().startOf(b).valueOf() <= c && c <= this.clone().endOf(b).valueOf()))
        )
    }
    function dc(a, b) {
        return this.isSame(a, b) || this.isAfter(a, b)
    }
    function ec(a, b) {
        return this.isSame(a, b) || this.isBefore(a, b)
    }
    function fc(a, b, c) {
        var d, e, f, g
        return this.isValid()
            ? ((d = Fb(a, this)),
              d.isValid()
                  ? ((e = 6e4 * (d.utcOffset() - this.utcOffset())),
                    (b = K(b)),
                    'year' === b || 'month' === b || 'quarter' === b
                        ? ((g = gc(this, d)), 'quarter' === b ? (g /= 3) : 'year' === b && (g /= 12))
                        : ((f = this - d),
                          (g =
                              'second' === b
                                  ? f / 1e3
                                  : 'minute' === b
                                    ? f / 6e4
                                    : 'hour' === b
                                      ? f / 36e5
                                      : 'day' === b
                                        ? (f - e) / 864e5
                                        : 'week' === b
                                          ? (f - e) / 6048e5
                                          : f)),
                    c ? g : t(g))
                  : NaN)
            : NaN
    }
    function gc(a, b) {
        var c,
            d,
            e = 12 * (b.year() - a.year()) + (b.month() - a.month()),
            f = a.clone().add(e, 'months')
        return (
            b - f < 0
                ? ((c = a.clone().add(e - 1, 'months')), (d = (b - f) / (f - c)))
                : ((c = a.clone().add(e + 1, 'months')), (d = (b - f) / (c - f))),
            -(e + d) || 0
        )
    }
    function hc() {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ')
    }
    function ic() {
        if (!this.isValid()) return null
        var a = this.clone().utc()
        return a.year() < 0 || a.year() > 9999
            ? X(a, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]')
            : z(Date.prototype.toISOString)
              ? this.toDate().toISOString()
              : X(a, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')
    }
    function jc() {
        if (!this.isValid()) return 'moment.invalid(/* ' + this._i + ' */)'
        var a = 'moment',
            b = ''
        this.isLocal() || ((a = 0 === this.utcOffset() ? 'moment.utc' : 'moment.parseZone'), (b = 'Z'))
        var c = '[' + a + '("]',
            d = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY',
            e = '-MM-DD[T]HH:mm:ss.SSS',
            f = b + '[")]'
        return this.format(c + d + e + f)
    }
    function kc(b) {
        b || (b = this.isUtc() ? a.defaultFormatUtc : a.defaultFormat)
        var c = X(this, b)
        return this.localeData().postformat(c)
    }
    function lc(a, b) {
        return this.isValid() && ((s(a) && a.isValid()) || tb(a).isValid())
            ? Sb({ to: this, from: a }).locale(this.locale()).humanize(!b)
            : this.localeData().invalidDate()
    }
    function mc(a) {
        return this.from(tb(), a)
    }
    function nc(a, b) {
        return this.isValid() && ((s(a) && a.isValid()) || tb(a).isValid())
            ? Sb({ from: this, to: a }).locale(this.locale()).humanize(!b)
            : this.localeData().invalidDate()
    }
    function oc(a) {
        return this.to(tb(), a)
    }
    function pc(a) {
        var b
        return void 0 === a ? this._locale._abbr : ((b = bb(a)), null != b && (this._locale = b), this)
    }
    function qc() {
        return this._locale
    }
    function rc(a) {
        switch ((a = K(a))) {
            case 'year':
                this.month(0)
            case 'quarter':
            case 'month':
                this.date(1)
            case 'week':
            case 'isoWeek':
            case 'day':
            case 'date':
                this.hours(0)
            case 'hour':
                this.minutes(0)
            case 'minute':
                this.seconds(0)
            case 'second':
                this.milliseconds(0)
        }
        return (
            'week' === a && this.weekday(0),
            'isoWeek' === a && this.isoWeekday(1),
            'quarter' === a && this.month(3 * Math.floor(this.month() / 3)),
            this
        )
    }
    function sc(a) {
        return (
            (a = K(a)),
            void 0 === a || 'millisecond' === a
                ? this
                : ('date' === a && (a = 'day'),
                  this.startOf(a)
                      .add(1, 'isoWeek' === a ? 'week' : a)
                      .subtract(1, 'ms'))
        )
    }
    function tc() {
        return this._d.valueOf() - 6e4 * (this._offset || 0)
    }
    function uc() {
        return Math.floor(this.valueOf() / 1e3)
    }
    function vc() {
        return new Date(this.valueOf())
    }
    function wc() {
        var a = this
        return [a.year(), a.month(), a.date(), a.hour(), a.minute(), a.second(), a.millisecond()]
    }
    function xc() {
        var a = this
        return {
            years: a.year(),
            months: a.month(),
            date: a.date(),
            hours: a.hours(),
            minutes: a.minutes(),
            seconds: a.seconds(),
            milliseconds: a.milliseconds(),
        }
    }
    function yc() {
        return this.isValid() ? this.toISOString() : null
    }
    function zc() {
        return o(this)
    }
    function Ac() {
        return k({}, n(this))
    }
    function Bc() {
        return n(this).overflow
    }
    function Cc() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict,
        }
    }
    function Dc(a, b) {
        U(0, [a, a.length], 0, b)
    }
    function Ec(a) {
        return Ic.call(this, a, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy)
    }
    function Fc(a) {
        return Ic.call(this, a, this.isoWeek(), this.isoWeekday(), 1, 4)
    }
    function Gc() {
        return xa(this.year(), 1, 4)
    }
    function Hc() {
        var a = this.localeData()._week
        return xa(this.year(), a.dow, a.doy)
    }
    function Ic(a, b, c, d, e) {
        var f
        return null == a ? wa(this, d, e).year : ((f = xa(a, d, e)), b > f && (b = f), Jc.call(this, a, b, c, d, e))
    }
    function Jc(a, b, c, d, e) {
        var f = va(a, b, c, d, e),
            g = ta(f.year, 0, f.dayOfYear)
        return this.year(g.getUTCFullYear()), this.month(g.getUTCMonth()), this.date(g.getUTCDate()), this
    }
    function Kc(a) {
        return null == a ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (a - 1) + (this.month() % 3))
    }
    function Lc(a) {
        var b = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1
        return null == a ? b : this.add(a - b, 'd')
    }
    function Mc(a, b) {
        b[ke] = u(1e3 * ('0.' + a))
    }
    function Nc() {
        return this._isUTC ? 'UTC' : ''
    }
    function Oc() {
        return this._isUTC ? 'Coordinated Universal Time' : ''
    }
    function Pc(a) {
        return tb(1e3 * a)
    }
    function Qc() {
        return tb.apply(null, arguments).parseZone()
    }
    function Rc(a) {
        return a
    }
    function Sc(a, b, c, d) {
        var e = bb(),
            f = l().set(d, b)
        return e[c](f, a)
    }
    function Tc(a, b, c) {
        if ((g(a) && ((b = a), (a = void 0)), (a = a || ''), null != b)) return Sc(a, b, c, 'month')
        var d,
            e = []
        for (d = 0; d < 12; d++) e[d] = Sc(a, d, c, 'month')
        return e
    }
    function Uc(a, b, c, d) {
        'boolean' == typeof a
            ? (g(b) && ((c = b), (b = void 0)), (b = b || ''))
            : ((b = a), (c = b), (a = !1), g(b) && ((c = b), (b = void 0)), (b = b || ''))
        var e = bb(),
            f = a ? e._week.dow : 0
        if (null != c) return Sc(b, (c + f) % 7, d, 'day')
        var h,
            i = []
        for (h = 0; h < 7; h++) i[h] = Sc(b, (h + f) % 7, d, 'day')
        return i
    }
    function Vc(a, b) {
        return Tc(a, b, 'months')
    }
    function Wc(a, b) {
        return Tc(a, b, 'monthsShort')
    }
    function Xc(a, b, c) {
        return Uc(a, b, c, 'weekdays')
    }
    function Yc(a, b, c) {
        return Uc(a, b, c, 'weekdaysShort')
    }
    function Zc(a, b, c) {
        return Uc(a, b, c, 'weekdaysMin')
    }
    function $c() {
        var a = this._data
        return (
            (this._milliseconds = df(this._milliseconds)),
            (this._days = df(this._days)),
            (this._months = df(this._months)),
            (a.milliseconds = df(a.milliseconds)),
            (a.seconds = df(a.seconds)),
            (a.minutes = df(a.minutes)),
            (a.hours = df(a.hours)),
            (a.months = df(a.months)),
            (a.years = df(a.years)),
            this
        )
    }
    function _c(a, b, c, d) {
        var e = Sb(b, c)
        return (a._milliseconds += d * e._milliseconds), (a._days += d * e._days), (a._months += d * e._months), a._bubble()
    }
    function ad(a, b) {
        return _c(this, a, b, 1)
    }
    function bd(a, b) {
        return _c(this, a, b, -1)
    }
    function cd(a) {
        return a < 0 ? Math.floor(a) : Math.ceil(a)
    }
    function dd() {
        var a,
            b,
            c,
            d,
            e,
            f = this._milliseconds,
            g = this._days,
            h = this._months,
            i = this._data
        return (
            (f >= 0 && g >= 0 && h >= 0) || (f <= 0 && g <= 0 && h <= 0) || ((f += 864e5 * cd(fd(h) + g)), (g = 0), (h = 0)),
            (i.milliseconds = f % 1e3),
            (a = t(f / 1e3)),
            (i.seconds = a % 60),
            (b = t(a / 60)),
            (i.minutes = b % 60),
            (c = t(b / 60)),
            (i.hours = c % 24),
            (g += t(c / 24)),
            (e = t(ed(g))),
            (h += e),
            (g -= cd(fd(e))),
            (d = t(h / 12)),
            (h %= 12),
            (i.days = g),
            (i.months = h),
            (i.years = d),
            this
        )
    }
    function ed(a) {
        return (4800 * a) / 146097
    }
    function fd(a) {
        return (146097 * a) / 4800
    }
    function gd(a) {
        if (!this.isValid()) return NaN
        var b,
            c,
            d = this._milliseconds
        if (((a = K(a)), 'month' === a || 'year' === a)) return (b = this._days + d / 864e5), (c = this._months + ed(b)), 'month' === a ? c : c / 12
        switch (((b = this._days + Math.round(fd(this._months))), a)) {
            case 'week':
                return b / 7 + d / 6048e5
            case 'day':
                return b + d / 864e5
            case 'hour':
                return 24 * b + d / 36e5
            case 'minute':
                return 1440 * b + d / 6e4
            case 'second':
                return 86400 * b + d / 1e3
            case 'millisecond':
                return Math.floor(864e5 * b) + d
            default:
                throw new Error('Unknown unit ' + a)
        }
    }
    function hd() {
        return this.isValid() ? this._milliseconds + 864e5 * this._days + (this._months % 12) * 2592e6 + 31536e6 * u(this._months / 12) : NaN
    }
    function id(a) {
        return function () {
            return this.as(a)
        }
    }
    function jd(a) {
        return (a = K(a)), this.isValid() ? this[a + 's']() : NaN
    }
    function kd(a) {
        return function () {
            return this.isValid() ? this._data[a] : NaN
        }
    }
    function ld() {
        return t(this.days() / 7)
    }
    function md(a, b, c, d, e) {
        return e.relativeTime(b || 1, !!c, a, d)
    }
    function nd(a, b, c) {
        var d = Sb(a).abs(),
            e = uf(d.as('s')),
            f = uf(d.as('m')),
            g = uf(d.as('h')),
            h = uf(d.as('d')),
            i = uf(d.as('M')),
            j = uf(d.as('y')),
            k = (e <= vf.ss && ['s', e]) ||
                (e < vf.s && ['ss', e]) ||
                (f <= 1 && ['m']) ||
                (f < vf.m && ['mm', f]) ||
                (g <= 1 && ['h']) ||
                (g < vf.h && ['hh', g]) ||
                (h <= 1 && ['d']) ||
                (h < vf.d && ['dd', h]) ||
                (i <= 1 && ['M']) ||
                (i < vf.M && ['MM', i]) ||
                (j <= 1 && ['y']) || ['yy', j]
        return (k[2] = b), (k[3] = +a > 0), (k[4] = c), md.apply(null, k)
    }
    function od(a) {
        return void 0 === a ? uf : 'function' == typeof a && ((uf = a), !0)
    }
    function pd(a, b) {
        return void 0 !== vf[a] && (void 0 === b ? vf[a] : ((vf[a] = b), 's' === a && (vf.ss = b - 1), !0))
    }
    function qd(a) {
        if (!this.isValid()) return this.localeData().invalidDate()
        var b = this.localeData(),
            c = nd(this, !a, b)
        return a && (c = b.pastFuture(+this, c)), b.postformat(c)
    }
    function rd() {
        if (!this.isValid()) return this.localeData().invalidDate()
        var a,
            b,
            c,
            d = wf(this._milliseconds) / 1e3,
            e = wf(this._days),
            f = wf(this._months)
        ;(a = t(d / 60)), (b = t(a / 60)), (d %= 60), (a %= 60), (c = t(f / 12)), (f %= 12)
        var g = c,
            h = f,
            i = e,
            j = b,
            k = a,
            l = d,
            m = this.asSeconds()
        return m
            ? (m < 0 ? '-' : '') +
                  'P' +
                  (g ? g + 'Y' : '') +
                  (h ? h + 'M' : '') +
                  (i ? i + 'D' : '') +
                  (j || k || l ? 'T' : '') +
                  (j ? j + 'H' : '') +
                  (k ? k + 'M' : '') +
                  (l ? l + 'S' : '')
            : 'P0D'
    }
    var sd, td
    td = Array.prototype.some
        ? Array.prototype.some
        : function (a) {
              for (var b = Object(this), c = b.length >>> 0, d = 0; d < c; d++) if (d in b && a.call(this, b[d], d, b)) return !0
              return !1
          }
    var ud = td,
        vd = (a.momentProperties = []),
        wd = !1,
        xd = {}
    ;(a.suppressDeprecationWarnings = !1), (a.deprecationHandler = null)
    var yd
    yd = Object.keys
        ? Object.keys
        : function (a) {
              var b,
                  c = []
              for (b in a) j(a, b) && c.push(b)
              return c
          }
    var zd,
        Ad = yd,
        Bd = {
            sameDay: '[Today at] LT',
            nextDay: '[Tomorrow at] LT',
            nextWeek: 'dddd [at] LT',
            lastDay: '[Yesterday at] LT',
            lastWeek: '[Last] dddd [at] LT',
            sameElse: 'L',
        },
        Cd = {
            LTS: 'h:mm:ss A',
            LT: 'h:mm A',
            L: 'MM/DD/YYYY',
            LL: 'MMMM D, YYYY',
            LLL: 'MMMM D, YYYY h:mm A',
            LLLL: 'dddd, MMMM D, YYYY h:mm A',
        },
        Dd = 'Invalid date',
        Ed = '%d',
        Fd = /\d{1,2}/,
        Gd = {
            future: 'in %s',
            past: '%s ago',
            s: 'a few seconds',
            ss: '%d seconds',
            m: 'a minute',
            mm: '%d minutes',
            h: 'an hour',
            hh: '%d hours',
            d: 'a day',
            dd: '%d days',
            M: 'a month',
            MM: '%d months',
            y: 'a year',
            yy: '%d years',
        },
        Hd = {},
        Id = {},
        Jd =
            /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
        Kd = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
        Ld = {},
        Md = {},
        Nd = /\d/,
        Od = /\d\d/,
        Pd = /\d{3}/,
        Qd = /\d{4}/,
        Rd = /[+-]?\d{6}/,
        Sd = /\d\d?/,
        Td = /\d\d\d\d?/,
        Ud = /\d\d\d\d\d\d?/,
        Vd = /\d{1,3}/,
        Wd = /\d{1,4}/,
        Xd = /[+-]?\d{1,6}/,
        Yd = /\d+/,
        Zd = /[+-]?\d+/,
        $d = /Z|[+-]\d\d:?\d\d/gi,
        _d = /Z|[+-]\d\d(?::?\d\d)?/gi,
        ae = /[+-]?\d+(\.\d{1,3})?/,
        be = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,
        ce = {},
        de = {},
        ee = 0,
        fe = 1,
        ge = 2,
        he = 3,
        ie = 4,
        je = 5,
        ke = 6,
        le = 7,
        me = 8
    zd = Array.prototype.indexOf
        ? Array.prototype.indexOf
        : function (a) {
              var b
              for (b = 0; b < this.length; ++b) if (this[b] === a) return b
              return -1
          }
    var ne = zd
    U('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1
    }),
        U('MMM', 0, 0, function (a) {
            return this.localeData().monthsShort(this, a)
        }),
        U('MMMM', 0, 0, function (a) {
            return this.localeData().months(this, a)
        }),
        J('month', 'M'),
        M('month', 8),
        Z('M', Sd),
        Z('MM', Sd, Od),
        Z('MMM', function (a, b) {
            return b.monthsShortRegex(a)
        }),
        Z('MMMM', function (a, b) {
            return b.monthsRegex(a)
        }),
        ba(['M', 'MM'], function (a, b) {
            b[fe] = u(a) - 1
        }),
        ba(['MMM', 'MMMM'], function (a, b, c, d) {
            var e = c._locale.monthsParse(a, d, c._strict)
            null != e ? (b[fe] = e) : (n(c).invalidMonth = a)
        })
    var oe = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
        pe = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        qe = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        re = be,
        se = be
    U('Y', 0, 0, function () {
        var a = this.year()
        return a <= 9999 ? '' + a : '+' + a
    }),
        U(0, ['YY', 2], 0, function () {
            return this.year() % 100
        }),
        U(0, ['YYYY', 4], 0, 'year'),
        U(0, ['YYYYY', 5], 0, 'year'),
        U(0, ['YYYYYY', 6, !0], 0, 'year'),
        J('year', 'y'),
        M('year', 1),
        Z('Y', Zd),
        Z('YY', Sd, Od),
        Z('YYYY', Wd, Qd),
        Z('YYYYY', Xd, Rd),
        Z('YYYYYY', Xd, Rd),
        ba(['YYYYY', 'YYYYYY'], ee),
        ba('YYYY', function (b, c) {
            c[ee] = 2 === b.length ? a.parseTwoDigitYear(b) : u(b)
        }),
        ba('YY', function (b, c) {
            c[ee] = a.parseTwoDigitYear(b)
        }),
        ba('Y', function (a, b) {
            b[ee] = parseInt(a, 10)
        }),
        (a.parseTwoDigitYear = function (a) {
            return u(a) + (u(a) > 68 ? 1900 : 2e3)
        })
    var te = O('FullYear', !0)
    U('w', ['ww', 2], 'wo', 'week'),
        U('W', ['WW', 2], 'Wo', 'isoWeek'),
        J('week', 'w'),
        J('isoWeek', 'W'),
        M('week', 5),
        M('isoWeek', 5),
        Z('w', Sd),
        Z('ww', Sd, Od),
        Z('W', Sd),
        Z('WW', Sd, Od),
        ca(['w', 'ww', 'W', 'WW'], function (a, b, c, d) {
            b[d.substr(0, 1)] = u(a)
        })
    var ue = { dow: 0, doy: 6 }
    U('d', 0, 'do', 'day'),
        U('dd', 0, 0, function (a) {
            return this.localeData().weekdaysMin(this, a)
        }),
        U('ddd', 0, 0, function (a) {
            return this.localeData().weekdaysShort(this, a)
        }),
        U('dddd', 0, 0, function (a) {
            return this.localeData().weekdays(this, a)
        }),
        U('e', 0, 0, 'weekday'),
        U('E', 0, 0, 'isoWeekday'),
        J('day', 'd'),
        J('weekday', 'e'),
        J('isoWeekday', 'E'),
        M('day', 11),
        M('weekday', 11),
        M('isoWeekday', 11),
        Z('d', Sd),
        Z('e', Sd),
        Z('E', Sd),
        Z('dd', function (a, b) {
            return b.weekdaysMinRegex(a)
        }),
        Z('ddd', function (a, b) {
            return b.weekdaysShortRegex(a)
        }),
        Z('dddd', function (a, b) {
            return b.weekdaysRegex(a)
        }),
        ca(['dd', 'ddd', 'dddd'], function (a, b, c, d) {
            var e = c._locale.weekdaysParse(a, d, c._strict)
            null != e ? (b.d = e) : (n(c).invalidWeekday = a)
        }),
        ca(['d', 'e', 'E'], function (a, b, c, d) {
            b[d] = u(a)
        })
    var ve = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        we = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        xe = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        ye = be,
        ze = be,
        Ae = be
    U('H', ['HH', 2], 0, 'hour'),
        U('h', ['hh', 2], 0, Ra),
        U('k', ['kk', 2], 0, Sa),
        U('hmm', 0, 0, function () {
            return '' + Ra.apply(this) + T(this.minutes(), 2)
        }),
        U('hmmss', 0, 0, function () {
            return '' + Ra.apply(this) + T(this.minutes(), 2) + T(this.seconds(), 2)
        }),
        U('Hmm', 0, 0, function () {
            return '' + this.hours() + T(this.minutes(), 2)
        }),
        U('Hmmss', 0, 0, function () {
            return '' + this.hours() + T(this.minutes(), 2) + T(this.seconds(), 2)
        }),
        Ta('a', !0),
        Ta('A', !1),
        J('hour', 'h'),
        M('hour', 13),
        Z('a', Ua),
        Z('A', Ua),
        Z('H', Sd),
        Z('h', Sd),
        Z('k', Sd),
        Z('HH', Sd, Od),
        Z('hh', Sd, Od),
        Z('kk', Sd, Od),
        Z('hmm', Td),
        Z('hmmss', Ud),
        Z('Hmm', Td),
        Z('Hmmss', Ud),
        ba(['H', 'HH'], he),
        ba(['k', 'kk'], function (a, b, c) {
            var d = u(a)
            b[he] = 24 === d ? 0 : d
        }),
        ba(['a', 'A'], function (a, b, c) {
            ;(c._isPm = c._locale.isPM(a)), (c._meridiem = a)
        }),
        ba(['h', 'hh'], function (a, b, c) {
            ;(b[he] = u(a)), (n(c).bigHour = !0)
        }),
        ba('hmm', function (a, b, c) {
            var d = a.length - 2
            ;(b[he] = u(a.substr(0, d))), (b[ie] = u(a.substr(d))), (n(c).bigHour = !0)
        }),
        ba('hmmss', function (a, b, c) {
            var d = a.length - 4,
                e = a.length - 2
            ;(b[he] = u(a.substr(0, d))), (b[ie] = u(a.substr(d, 2))), (b[je] = u(a.substr(e))), (n(c).bigHour = !0)
        }),
        ba('Hmm', function (a, b, c) {
            var d = a.length - 2
            ;(b[he] = u(a.substr(0, d))), (b[ie] = u(a.substr(d)))
        }),
        ba('Hmmss', function (a, b, c) {
            var d = a.length - 4,
                e = a.length - 2
            ;(b[he] = u(a.substr(0, d))), (b[ie] = u(a.substr(d, 2))), (b[je] = u(a.substr(e)))
        })
    var Be,
        Ce = /[ap]\.?m?\.?/i,
        De = O('Hours', !0),
        Ee = {
            calendar: Bd,
            longDateFormat: Cd,
            invalidDate: Dd,
            ordinal: Ed,
            dayOfMonthOrdinalParse: Fd,
            relativeTime: Gd,
            months: pe,
            monthsShort: qe,
            week: ue,
            weekdays: ve,
            weekdaysMin: xe,
            weekdaysShort: we,
            meridiemParse: Ce,
        },
        Fe = {},
        Ge = {},
        He =
            /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        Ie =
            /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        Je = /Z|[+-]\d\d(?::?\d\d)?/,
        Ke = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
            ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
            ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d\d/, !1],
            ['YYYY-DDD', /\d{4}-\d{3}/],
            ['YYYY-MM', /\d{4}-\d\d/, !1],
            ['YYYYYYMMDD', /[+-]\d{10}/],
            ['YYYYMMDD', /\d{8}/],
            ['GGGG[W]WWE', /\d{4}W\d{3}/],
            ['GGGG[W]WW', /\d{4}W\d{2}/, !1],
            ['YYYYDDD', /\d{7}/],
        ],
        Le = [
            ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
            ['HH:mm:ss', /\d\d:\d\d:\d\d/],
            ['HH:mm', /\d\d:\d\d/],
            ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
            ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
            ['HHmmss', /\d\d\d\d\d\d/],
            ['HHmm', /\d\d\d\d/],
            ['HH', /\d\d/],
        ],
        Me = /^\/?Date\((\-?\d+)/i,
        Ne =
            /^((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d?\d\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(?:\d\d)?\d\d\s)(\d\d:\d\d)(\:\d\d)?(\s(?:UT|GMT|[ECMP][SD]T|[A-IK-Za-ik-z]|[+-]\d{4}))$/
    ;(a.createFromInputFallback = x(
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (a) {
            a._d = new Date(a._i + (a._useUTC ? ' UTC' : ''))
        },
    )),
        (a.ISO_8601 = function () {}),
        (a.RFC_2822 = function () {})
    var Oe = x('moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/', function () {
            var a = tb.apply(null, arguments)
            return this.isValid() && a.isValid() ? (a < this ? this : a) : p()
        }),
        Pe = x('moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/', function () {
            var a = tb.apply(null, arguments)
            return this.isValid() && a.isValid() ? (a > this ? this : a) : p()
        }),
        Qe = function () {
            return Date.now ? Date.now() : +new Date()
        },
        Re = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond']
    Db('Z', ':'),
        Db('ZZ', ''),
        Z('Z', _d),
        Z('ZZ', _d),
        ba(['Z', 'ZZ'], function (a, b, c) {
            ;(c._useUTC = !0), (c._tzm = Eb(_d, a))
        })
    var Se = /([\+\-]|\d\d)/gi
    a.updateOffset = function () {}
    var Te = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/,
        Ue =
            /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/
    ;(Sb.fn = Ab.prototype), (Sb.invalid = zb)
    var Ve = Wb(1, 'add'),
        We = Wb(-1, 'subtract')
    ;(a.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ'), (a.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]')
    var Xe = x(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (a) {
            return void 0 === a ? this.localeData() : this.locale(a)
        },
    )
    U(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100
    }),
        U(0, ['GG', 2], 0, function () {
            return this.isoWeekYear() % 100
        }),
        Dc('gggg', 'weekYear'),
        Dc('ggggg', 'weekYear'),
        Dc('GGGG', 'isoWeekYear'),
        Dc('GGGGG', 'isoWeekYear'),
        J('weekYear', 'gg'),
        J('isoWeekYear', 'GG'),
        M('weekYear', 1),
        M('isoWeekYear', 1),
        Z('G', Zd),
        Z('g', Zd),
        Z('GG', Sd, Od),
        Z('gg', Sd, Od),
        Z('GGGG', Wd, Qd),
        Z('gggg', Wd, Qd),
        Z('GGGGG', Xd, Rd),
        Z('ggggg', Xd, Rd),
        ca(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (a, b, c, d) {
            b[d.substr(0, 2)] = u(a)
        }),
        ca(['gg', 'GG'], function (b, c, d, e) {
            c[e] = a.parseTwoDigitYear(b)
        }),
        U('Q', 0, 'Qo', 'quarter'),
        J('quarter', 'Q'),
        M('quarter', 7),
        Z('Q', Nd),
        ba('Q', function (a, b) {
            b[fe] = 3 * (u(a) - 1)
        }),
        U('D', ['DD', 2], 'Do', 'date'),
        J('date', 'D'),
        M('date', 9),
        Z('D', Sd),
        Z('DD', Sd, Od),
        Z('Do', function (a, b) {
            return a ? b._dayOfMonthOrdinalParse || b._ordinalParse : b._dayOfMonthOrdinalParseLenient
        }),
        ba(['D', 'DD'], ge),
        ba('Do', function (a, b) {
            b[ge] = u(a.match(Sd)[0], 10)
        })
    var Ye = O('Date', !0)
    U('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear'),
        J('dayOfYear', 'DDD'),
        M('dayOfYear', 4),
        Z('DDD', Vd),
        Z('DDDD', Pd),
        ba(['DDD', 'DDDD'], function (a, b, c) {
            c._dayOfYear = u(a)
        }),
        U('m', ['mm', 2], 0, 'minute'),
        J('minute', 'm'),
        M('minute', 14),
        Z('m', Sd),
        Z('mm', Sd, Od),
        ba(['m', 'mm'], ie)
    var Ze = O('Minutes', !1)
    U('s', ['ss', 2], 0, 'second'), J('second', 's'), M('second', 15), Z('s', Sd), Z('ss', Sd, Od), ba(['s', 'ss'], je)
    var $e = O('Seconds', !1)
    U('S', 0, 0, function () {
        return ~~(this.millisecond() / 100)
    }),
        U(0, ['SS', 2], 0, function () {
            return ~~(this.millisecond() / 10)
        }),
        U(0, ['SSS', 3], 0, 'millisecond'),
        U(0, ['SSSS', 4], 0, function () {
            return 10 * this.millisecond()
        }),
        U(0, ['SSSSS', 5], 0, function () {
            return 100 * this.millisecond()
        }),
        U(0, ['SSSSSS', 6], 0, function () {
            return 1e3 * this.millisecond()
        }),
        U(0, ['SSSSSSS', 7], 0, function () {
            return 1e4 * this.millisecond()
        }),
        U(0, ['SSSSSSSS', 8], 0, function () {
            return 1e5 * this.millisecond()
        }),
        U(0, ['SSSSSSSSS', 9], 0, function () {
            return 1e6 * this.millisecond()
        }),
        J('millisecond', 'ms'),
        M('millisecond', 16),
        Z('S', Vd, Nd),
        Z('SS', Vd, Od),
        Z('SSS', Vd, Pd)
    var _e
    for (_e = 'SSSS'; _e.length <= 9; _e += 'S') Z(_e, Yd)
    for (_e = 'S'; _e.length <= 9; _e += 'S') ba(_e, Mc)
    var af = O('Milliseconds', !1)
    U('z', 0, 0, 'zoneAbbr'), U('zz', 0, 0, 'zoneName')
    var bf = r.prototype
    ;(bf.add = Ve),
        (bf.calendar = Zb),
        (bf.clone = $b),
        (bf.diff = fc),
        (bf.endOf = sc),
        (bf.format = kc),
        (bf.from = lc),
        (bf.fromNow = mc),
        (bf.to = nc),
        (bf.toNow = oc),
        (bf.get = R),
        (bf.invalidAt = Bc),
        (bf.isAfter = _b),
        (bf.isBefore = ac),
        (bf.isBetween = bc),
        (bf.isSame = cc),
        (bf.isSameOrAfter = dc),
        (bf.isSameOrBefore = ec),
        (bf.isValid = zc),
        (bf.lang = Xe),
        (bf.locale = pc),
        (bf.localeData = qc),
        (bf.max = Pe),
        (bf.min = Oe),
        (bf.parsingFlags = Ac),
        (bf.set = S),
        (bf.startOf = rc),
        (bf.subtract = We),
        (bf.toArray = wc),
        (bf.toObject = xc),
        (bf.toDate = vc),
        (bf.toISOString = ic),
        (bf.inspect = jc),
        (bf.toJSON = yc),
        (bf.toString = hc),
        (bf.unix = uc),
        (bf.valueOf = tc),
        (bf.creationData = Cc),
        (bf.year = te),
        (bf.isLeapYear = ra),
        (bf.weekYear = Ec),
        (bf.isoWeekYear = Fc),
        (bf.quarter = bf.quarters = Kc),
        (bf.month = ka),
        (bf.daysInMonth = la),
        (bf.week = bf.weeks = Ba),
        (bf.isoWeek = bf.isoWeeks = Ca),
        (bf.weeksInYear = Hc),
        (bf.isoWeeksInYear = Gc),
        (bf.date = Ye),
        (bf.day = bf.days = Ka),
        (bf.weekday = La),
        (bf.isoWeekday = Ma),
        (bf.dayOfYear = Lc),
        (bf.hour = bf.hours = De),
        (bf.minute = bf.minutes = Ze),
        (bf.second = bf.seconds = $e),
        (bf.millisecond = bf.milliseconds = af),
        (bf.utcOffset = Hb),
        (bf.utc = Jb),
        (bf.local = Kb),
        (bf.parseZone = Lb),
        (bf.hasAlignedHourOffset = Mb),
        (bf.isDST = Nb),
        (bf.isLocal = Pb),
        (bf.isUtcOffset = Qb),
        (bf.isUtc = Rb),
        (bf.isUTC = Rb),
        (bf.zoneAbbr = Nc),
        (bf.zoneName = Oc),
        (bf.dates = x('dates accessor is deprecated. Use date instead.', Ye)),
        (bf.months = x('months accessor is deprecated. Use month instead', ka)),
        (bf.years = x('years accessor is deprecated. Use year instead', te)),
        (bf.zone = x('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', Ib)),
        (bf.isDSTShifted = x('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', Ob))
    var cf = C.prototype
    ;(cf.calendar = D),
        (cf.longDateFormat = E),
        (cf.invalidDate = F),
        (cf.ordinal = G),
        (cf.preparse = Rc),
        (cf.postformat = Rc),
        (cf.relativeTime = H),
        (cf.pastFuture = I),
        (cf.set = A),
        (cf.months = fa),
        (cf.monthsShort = ga),
        (cf.monthsParse = ia),
        (cf.monthsRegex = na),
        (cf.monthsShortRegex = ma),
        (cf.week = ya),
        (cf.firstDayOfYear = Aa),
        (cf.firstDayOfWeek = za),
        (cf.weekdays = Fa),
        (cf.weekdaysMin = Ha),
        (cf.weekdaysShort = Ga),
        (cf.weekdaysParse = Ja),
        (cf.weekdaysRegex = Na),
        (cf.weekdaysShortRegex = Oa),
        (cf.weekdaysMinRegex = Pa),
        (cf.isPM = Va),
        (cf.meridiem = Wa),
        $a('en', {
            dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
            ordinal: function (a) {
                var b = a % 10,
                    c = 1 === u((a % 100) / 10) ? 'th' : 1 === b ? 'st' : 2 === b ? 'nd' : 3 === b ? 'rd' : 'th'
                return a + c
            },
        }),
        (a.lang = x('moment.lang is deprecated. Use moment.locale instead.', $a)),
        (a.langData = x('moment.langData is deprecated. Use moment.localeData instead.', bb))
    var df = Math.abs,
        ef = id('ms'),
        ff = id('s'),
        gf = id('m'),
        hf = id('h'),
        jf = id('d'),
        kf = id('w'),
        lf = id('M'),
        mf = id('y'),
        nf = kd('milliseconds'),
        of = kd('seconds'),
        pf = kd('minutes'),
        qf = kd('hours'),
        rf = kd('days'),
        sf = kd('months'),
        tf = kd('years'),
        uf = Math.round,
        vf = { ss: 44, s: 45, m: 45, h: 22, d: 26, M: 11 },
        wf = Math.abs,
        xf = Ab.prototype
    return (
        (xf.isValid = yb),
        (xf.abs = $c),
        (xf.add = ad),
        (xf.subtract = bd),
        (xf.as = gd),
        (xf.asMilliseconds = ef),
        (xf.asSeconds = ff),
        (xf.asMinutes = gf),
        (xf.asHours = hf),
        (xf.asDays = jf),
        (xf.asWeeks = kf),
        (xf.asMonths = lf),
        (xf.asYears = mf),
        (xf.valueOf = hd),
        (xf._bubble = dd),
        (xf.get = jd),
        (xf.milliseconds = nf),
        (xf.seconds = of),
        (xf.minutes = pf),
        (xf.hours = qf),
        (xf.days = rf),
        (xf.weeks = ld),
        (xf.months = sf),
        (xf.years = tf),
        (xf.humanize = qd),
        (xf.toISOString = rd),
        (xf.toString = rd),
        (xf.toJSON = rd),
        (xf.locale = pc),
        (xf.localeData = qc),
        (xf.toIsoString = x('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', rd)),
        (xf.lang = Xe),
        U('X', 0, 0, 'unix'),
        U('x', 0, 0, 'valueOf'),
        Z('x', Zd),
        Z('X', ae),
        ba('X', function (a, b, c) {
            c._d = new Date(1e3 * parseFloat(a, 10))
        }),
        ba('x', function (a, b, c) {
            c._d = new Date(u(a))
        }),
        (a.version = '2.18.1'),
        b(tb),
        (a.fn = bf),
        (a.min = vb),
        (a.max = wb),
        (a.now = Qe),
        (a.utc = l),
        (a.unix = Pc),
        (a.months = Vc),
        (a.isDate = h),
        (a.locale = $a),
        (a.invalid = p),
        (a.duration = Sb),
        (a.isMoment = s),
        (a.weekdays = Xc),
        (a.parseZone = Qc),
        (a.localeData = bb),
        (a.isDuration = Bb),
        (a.monthsShort = Wc),
        (a.weekdaysMin = Zc),
        (a.defineLocale = _a),
        (a.updateLocale = ab),
        (a.locales = cb),
        (a.weekdaysShort = Yc),
        (a.normalizeUnits = K),
        (a.relativeTimeRounding = od),
        (a.relativeTimeThreshold = pd),
        (a.calendarFormat = Yb),
        (a.prototype = bf),
        a
    )
})
/**
 * Minified by jsDelivr using Terser v3.14.1.
 * Original file: /npm/daterangepicker@3.1.0/daterangepicker.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!(function (t, e) {
    if ('function' == typeof define && define.amd)
        define(['moment', 'jquery'], function (t, a) {
            return a.fn || (a.fn = {}), 'function' != typeof t && t.hasOwnProperty('default') && (t = t.default), e(t, a)
        })
    else if ('object' == typeof module && module.exports) {
        var a = 'undefined' != typeof window ? window.jQuery : void 0
        a || (a = require('jquery')).fn || (a.fn = {})
        var i = 'undefined' != typeof window && void 0 !== window.moment ? window.moment : require('moment')
        module.exports = e(i, a)
    } else t.daterangepicker = e(t.moment, t.jQuery)
})(this, function (t, e) {
    var a = function (a, i, s) {
        if (
            ((this.parentEl = 'body'),
            (this.element = e(a)),
            (this.startDate = t().startOf('day')),
            (this.endDate = t().endOf('day')),
            (this.minDate = !1),
            (this.maxDate = !1),
            (this.maxSpan = !1),
            (this.autoApply = !1),
            (this.singleDatePicker = !1),
            (this.showDropdowns = !1),
            (this.minYear = t().subtract(100, 'year').format('YYYY')),
            (this.maxYear = t().add(100, 'year').format('YYYY')),
            (this.showWeekNumbers = !1),
            (this.showISOWeekNumbers = !1),
            (this.showCustomRangeLabel = !0),
            (this.timePicker = !1),
            (this.timePicker24Hour = !1),
            (this.timePickerIncrement = 1),
            (this.timePickerSeconds = !1),
            (this.linkedCalendars = !0),
            (this.autoUpdateInput = !0),
            (this.alwaysShowCalendars = !1),
            (this.ranges = {}),
            (this.opens = 'right'),
            this.element.hasClass('pull-right') && (this.opens = 'left'),
            (this.drops = 'down'),
            this.element.hasClass('dropup') && (this.drops = 'up'),
            (this.buttonClasses = 'btn btn-sm'),
            (this.applyButtonClasses = 'btn-primary'),
            (this.cancelButtonClasses = 'btn-default'),
            (this.locale = {
                direction: 'ltr',
                format: t.localeData().longDateFormat('L'),
                separator: ' - ',
                applyLabel: 'Apply',
                cancelLabel: 'Cancel',
                weekLabel: 'W',
                customRangeLabel: 'Custom Range',
                daysOfWeek: t.weekdaysMin(),
                monthNames: t.monthsShort(),
                firstDay: t.localeData().firstDayOfWeek(),
            }),
            (this.callback = function () {}),
            (this.isShowing = !1),
            (this.leftCalendar = {}),
            (this.rightCalendar = {}),
            ('object' == typeof i && null !== i) || (i = {}),
            'string' == typeof (i = e.extend(this.element.data(), i)).template ||
                i.template instanceof e ||
                (i.template =
                    '<div class="daterangepicker"><div class="ranges"></div><div class="drp-calendar left"><div class="calendar-table"></div><div class="calendar-time"></div></div><div class="drp-calendar right"><div class="calendar-table"></div><div class="calendar-time"></div></div><div class="drp-buttons"><span class="drp-selected"></span><button class="cancelBtn" type="button"></button><button class="applyBtn" disabled="disabled" type="button"></button> </div></div>'),
            (this.parentEl = i.parentEl && e(i.parentEl).length ? e(i.parentEl) : e(this.parentEl)),
            (this.container = e(i.template).appendTo(this.parentEl)),
            'object' == typeof i.locale &&
                ('string' == typeof i.locale.direction && (this.locale.direction = i.locale.direction),
                'string' == typeof i.locale.format && (this.locale.format = i.locale.format),
                'string' == typeof i.locale.separator && (this.locale.separator = i.locale.separator),
                'object' == typeof i.locale.daysOfWeek && (this.locale.daysOfWeek = i.locale.daysOfWeek.slice()),
                'object' == typeof i.locale.monthNames && (this.locale.monthNames = i.locale.monthNames.slice()),
                'number' == typeof i.locale.firstDay && (this.locale.firstDay = i.locale.firstDay),
                'string' == typeof i.locale.applyLabel && (this.locale.applyLabel = i.locale.applyLabel),
                'string' == typeof i.locale.cancelLabel && (this.locale.cancelLabel = i.locale.cancelLabel),
                'string' == typeof i.locale.weekLabel && (this.locale.weekLabel = i.locale.weekLabel),
                'string' == typeof i.locale.customRangeLabel))
        ) {
            ;(p = document.createElement('textarea')).innerHTML = i.locale.customRangeLabel
            var n = p.value
            this.locale.customRangeLabel = n
        }
        if (
            (this.container.addClass(this.locale.direction),
            'string' == typeof i.startDate && (this.startDate = t(i.startDate, this.locale.format)),
            'string' == typeof i.endDate && (this.endDate = t(i.endDate, this.locale.format)),
            'string' == typeof i.minDate && (this.minDate = t(i.minDate, this.locale.format)),
            'string' == typeof i.maxDate && (this.maxDate = t(i.maxDate, this.locale.format)),
            'object' == typeof i.startDate && (this.startDate = t(i.startDate)),
            'object' == typeof i.endDate && (this.endDate = t(i.endDate)),
            'object' == typeof i.minDate && (this.minDate = t(i.minDate)),
            'object' == typeof i.maxDate && (this.maxDate = t(i.maxDate)),
            this.minDate && this.startDate.isBefore(this.minDate) && (this.startDate = this.minDate.clone()),
            this.maxDate && this.endDate.isAfter(this.maxDate) && (this.endDate = this.maxDate.clone()),
            'string' == typeof i.applyButtonClasses && (this.applyButtonClasses = i.applyButtonClasses),
            'string' == typeof i.applyClass && (this.applyButtonClasses = i.applyClass),
            'string' == typeof i.cancelButtonClasses && (this.cancelButtonClasses = i.cancelButtonClasses),
            'string' == typeof i.cancelClass && (this.cancelButtonClasses = i.cancelClass),
            'object' == typeof i.maxSpan && (this.maxSpan = i.maxSpan),
            'object' == typeof i.dateLimit && (this.maxSpan = i.dateLimit),
            'string' == typeof i.opens && (this.opens = i.opens),
            'string' == typeof i.drops && (this.drops = i.drops),
            'boolean' == typeof i.showWeekNumbers && (this.showWeekNumbers = i.showWeekNumbers),
            'boolean' == typeof i.showISOWeekNumbers && (this.showISOWeekNumbers = i.showISOWeekNumbers),
            'string' == typeof i.buttonClasses && (this.buttonClasses = i.buttonClasses),
            'object' == typeof i.buttonClasses && (this.buttonClasses = i.buttonClasses.join(' ')),
            'boolean' == typeof i.showDropdowns && (this.showDropdowns = i.showDropdowns),
            'number' == typeof i.minYear && (this.minYear = i.minYear),
            'number' == typeof i.maxYear && (this.maxYear = i.maxYear),
            'boolean' == typeof i.showCustomRangeLabel && (this.showCustomRangeLabel = i.showCustomRangeLabel),
            'boolean' == typeof i.singleDatePicker &&
                ((this.singleDatePicker = i.singleDatePicker), this.singleDatePicker && (this.endDate = this.startDate.clone())),
            'boolean' == typeof i.timePicker && (this.timePicker = i.timePicker),
            'boolean' == typeof i.timePickerSeconds && (this.timePickerSeconds = i.timePickerSeconds),
            'number' == typeof i.timePickerIncrement && (this.timePickerIncrement = i.timePickerIncrement),
            'boolean' == typeof i.timePicker24Hour && (this.timePicker24Hour = i.timePicker24Hour),
            'boolean' == typeof i.autoApply && (this.autoApply = i.autoApply),
            'boolean' == typeof i.autoUpdateInput && (this.autoUpdateInput = i.autoUpdateInput),
            'boolean' == typeof i.linkedCalendars && (this.linkedCalendars = i.linkedCalendars),
            'function' == typeof i.isInvalidDate && (this.isInvalidDate = i.isInvalidDate),
            'function' == typeof i.isCustomDate && (this.isCustomDate = i.isCustomDate),
            'boolean' == typeof i.alwaysShowCalendars && (this.alwaysShowCalendars = i.alwaysShowCalendars),
            0 != this.locale.firstDay)
        )
            for (var r = this.locale.firstDay; r > 0; ) this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift()), r--
        var o, h, l
        if (void 0 === i.startDate && void 0 === i.endDate && e(this.element).is(':text')) {
            var c = e(this.element).val(),
                d = c.split(this.locale.separator)
            ;(o = h = null),
                2 == d.length
                    ? ((o = t(d[0], this.locale.format)), (h = t(d[1], this.locale.format)))
                    : this.singleDatePicker && '' !== c && ((o = t(c, this.locale.format)), (h = t(c, this.locale.format))),
                null !== o && null !== h && (this.setStartDate(o), this.setEndDate(h))
        }
        if ('object' == typeof i.ranges) {
            for (l in i.ranges) {
                ;(o = 'string' == typeof i.ranges[l][0] ? t(i.ranges[l][0], this.locale.format) : t(i.ranges[l][0])),
                    (h = 'string' == typeof i.ranges[l][1] ? t(i.ranges[l][1], this.locale.format) : t(i.ranges[l][1])),
                    this.minDate && o.isBefore(this.minDate) && (o = this.minDate.clone())
                var m = this.maxDate
                if (
                    (this.maxSpan && m && o.clone().add(this.maxSpan).isAfter(m) && (m = o.clone().add(this.maxSpan)),
                    m && h.isAfter(m) && (h = m.clone()),
                    !(
                        (this.minDate && h.isBefore(this.minDate, this.timepicker ? 'minute' : 'day')) ||
                        (m && o.isAfter(m, this.timepicker ? 'minute' : 'day'))
                    ))
                ) {
                    var p
                    ;(p = document.createElement('textarea')).innerHTML = l
                    n = p.value
                    this.ranges[n] = [o, h]
                }
            }
            var f = '<ul>'
            for (l in this.ranges) f += '<li data-range-key="' + l + '">' + l + '</li>'
            this.showCustomRangeLabel && (f += '<li data-range-key="' + this.locale.customRangeLabel + '">' + this.locale.customRangeLabel + '</li>'),
                (f += '</ul>'),
                this.container.find('.ranges').prepend(f)
        }
        'function' == typeof s && (this.callback = s),
            this.timePicker ||
                ((this.startDate = this.startDate.startOf('day')),
                (this.endDate = this.endDate.endOf('day')),
                this.container.find('.calendar-time').hide()),
            this.timePicker && this.autoApply && (this.autoApply = !1),
            this.autoApply && this.container.addClass('auto-apply'),
            'object' == typeof i.ranges && this.container.addClass('show-ranges'),
            this.singleDatePicker &&
                (this.container.addClass('single'),
                this.container.find('.drp-calendar.left').addClass('single'),
                this.container.find('.drp-calendar.left').show(),
                this.container.find('.drp-calendar.right').hide(),
                !this.timePicker && this.autoApply && this.container.addClass('auto-apply')),
            ((void 0 === i.ranges && !this.singleDatePicker) || this.alwaysShowCalendars) && this.container.addClass('show-calendar'),
            this.container.addClass('opens' + this.opens),
            this.container.find('.applyBtn, .cancelBtn').addClass(this.buttonClasses),
            this.applyButtonClasses.length && this.container.find('.applyBtn').addClass(this.applyButtonClasses),
            this.cancelButtonClasses.length && this.container.find('.cancelBtn').addClass(this.cancelButtonClasses),
            this.container.find('.applyBtn').html(this.locale.applyLabel),
            this.container.find('.cancelBtn').html(this.locale.cancelLabel),
            this.container
                .find('.drp-calendar')
                .on('click.daterangepicker', '.prev', e.proxy(this.clickPrev, this))
                .on('click.daterangepicker', '.next', e.proxy(this.clickNext, this))
                .on('mousedown.daterangepicker', 'td.available', e.proxy(this.clickDate, this))
                .on('mouseenter.daterangepicker', 'td.available', e.proxy(this.hoverDate, this))
                .on('change.daterangepicker', 'select.yearselect', e.proxy(this.monthOrYearChanged, this))
                .on('change.daterangepicker', 'select.monthselect', e.proxy(this.monthOrYearChanged, this))
                .on(
                    'change.daterangepicker',
                    'select.hourselect,select.minuteselect,select.secondselect,select.ampmselect',
                    e.proxy(this.timeChanged, this),
                ),
            this.container.find('.ranges').on('click.daterangepicker', 'li', e.proxy(this.clickRange, this)),
            this.container
                .find('.drp-buttons')
                .on('click.daterangepicker', 'button.applyBtn', e.proxy(this.clickApply, this))
                .on('click.daterangepicker', 'button.cancelBtn', e.proxy(this.clickCancel, this)),
            this.element.is('input') || this.element.is('button')
                ? this.element.on({
                      'click.daterangepicker': e.proxy(this.show, this),
                      'focus.daterangepicker': e.proxy(this.show, this),
                      'keyup.daterangepicker': e.proxy(this.elementChanged, this),
                      'keydown.daterangepicker': e.proxy(this.keydown, this),
                  })
                : (this.element.on('click.daterangepicker', e.proxy(this.toggle, this)),
                  this.element.on('keydown.daterangepicker', e.proxy(this.toggle, this))),
            this.updateElement()
    }
    return (
        (a.prototype = {
            constructor: a,
            setStartDate: function (e) {
                'string' == typeof e && (this.startDate = t(e, this.locale.format)),
                    'object' == typeof e && (this.startDate = t(e)),
                    this.timePicker || (this.startDate = this.startDate.startOf('day')),
                    this.timePicker &&
                        this.timePickerIncrement &&
                        this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement),
                    this.minDate &&
                        this.startDate.isBefore(this.minDate) &&
                        ((this.startDate = this.minDate.clone()),
                        this.timePicker &&
                            this.timePickerIncrement &&
                            this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement)),
                    this.maxDate &&
                        this.startDate.isAfter(this.maxDate) &&
                        ((this.startDate = this.maxDate.clone()),
                        this.timePicker &&
                            this.timePickerIncrement &&
                            this.startDate.minute(Math.floor(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement)),
                    this.isShowing || this.updateElement(),
                    this.updateMonthsInView()
            },
            setEndDate: function (e) {
                'string' == typeof e && (this.endDate = t(e, this.locale.format)),
                    'object' == typeof e && (this.endDate = t(e)),
                    this.timePicker || (this.endDate = this.endDate.endOf('day')),
                    this.timePicker &&
                        this.timePickerIncrement &&
                        this.endDate.minute(Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement),
                    this.endDate.isBefore(this.startDate) && (this.endDate = this.startDate.clone()),
                    this.maxDate && this.endDate.isAfter(this.maxDate) && (this.endDate = this.maxDate.clone()),
                    this.maxSpan &&
                        this.startDate.clone().add(this.maxSpan).isBefore(this.endDate) &&
                        (this.endDate = this.startDate.clone().add(this.maxSpan)),
                    (this.previousRightTime = this.endDate.clone()),
                    this.container
                        .find('.drp-selected')
                        .html(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format)),
                    this.isShowing || this.updateElement(),
                    this.updateMonthsInView()
            },
            isInvalidDate: function () {
                return !1
            },
            isCustomDate: function () {
                return !1
            },
            updateView: function () {
                this.timePicker &&
                    (this.renderTimePicker('left'),
                    this.renderTimePicker('right'),
                    this.endDate
                        ? this.container.find('.right .calendar-time select').prop('disabled', !1).removeClass('disabled')
                        : this.container.find('.right .calendar-time select').prop('disabled', !0).addClass('disabled')),
                    this.endDate &&
                        this.container
                            .find('.drp-selected')
                            .html(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format)),
                    this.updateMonthsInView(),
                    this.updateCalendars(),
                    this.updateFormInputs()
            },
            updateMonthsInView: function () {
                if (this.endDate) {
                    if (
                        !this.singleDatePicker &&
                        this.leftCalendar.month &&
                        this.rightCalendar.month &&
                        (this.startDate.format('YYYY-MM') == this.leftCalendar.month.format('YYYY-MM') ||
                            this.startDate.format('YYYY-MM') == this.rightCalendar.month.format('YYYY-MM')) &&
                        (this.endDate.format('YYYY-MM') == this.leftCalendar.month.format('YYYY-MM') ||
                            this.endDate.format('YYYY-MM') == this.rightCalendar.month.format('YYYY-MM'))
                    )
                        return
                    ;(this.leftCalendar.month = this.startDate.clone().date(2)),
                        this.linkedCalendars || (this.endDate.month() == this.startDate.month() && this.endDate.year() == this.startDate.year())
                            ? (this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month'))
                            : (this.rightCalendar.month = this.endDate.clone().date(2))
                } else
                    this.leftCalendar.month.format('YYYY-MM') != this.startDate.format('YYYY-MM') &&
                        this.rightCalendar.month.format('YYYY-MM') != this.startDate.format('YYYY-MM') &&
                        ((this.leftCalendar.month = this.startDate.clone().date(2)),
                        (this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month')))
                this.maxDate &&
                    this.linkedCalendars &&
                    !this.singleDatePicker &&
                    this.rightCalendar.month > this.maxDate &&
                    ((this.rightCalendar.month = this.maxDate.clone().date(2)),
                    (this.leftCalendar.month = this.maxDate.clone().date(2).subtract(1, 'month')))
            },
            updateCalendars: function () {
                if (this.timePicker) {
                    var t, e, a, i
                    if (this.endDate) {
                        if (
                            ((t = parseInt(this.container.find('.left .hourselect').val(), 10)),
                            (e = parseInt(this.container.find('.left .minuteselect').val(), 10)),
                            isNaN(e) && (e = parseInt(this.container.find('.left .minuteselect option:last').val(), 10)),
                            (a = this.timePickerSeconds ? parseInt(this.container.find('.left .secondselect').val(), 10) : 0),
                            !this.timePicker24Hour)
                        )
                            'PM' === (i = this.container.find('.left .ampmselect').val()) && t < 12 && (t += 12), 'AM' === i && 12 === t && (t = 0)
                    } else if (
                        ((t = parseInt(this.container.find('.right .hourselect').val(), 10)),
                        (e = parseInt(this.container.find('.right .minuteselect').val(), 10)),
                        isNaN(e) && (e = parseInt(this.container.find('.right .minuteselect option:last').val(), 10)),
                        (a = this.timePickerSeconds ? parseInt(this.container.find('.right .secondselect').val(), 10) : 0),
                        !this.timePicker24Hour)
                    )
                        'PM' === (i = this.container.find('.right .ampmselect').val()) && t < 12 && (t += 12), 'AM' === i && 12 === t && (t = 0)
                    this.leftCalendar.month.hour(t).minute(e).second(a), this.rightCalendar.month.hour(t).minute(e).second(a)
                }
                this.renderCalendar('left'),
                    this.renderCalendar('right'),
                    this.container.find('.ranges li').removeClass('active'),
                    null != this.endDate && this.calculateChosenLabel()
            },
            renderCalendar: function (a) {
                var i,
                    s = (i = 'left' == a ? this.leftCalendar : this.rightCalendar).month.month(),
                    n = i.month.year(),
                    r = i.month.hour(),
                    o = i.month.minute(),
                    h = i.month.second(),
                    l = t([n, s]).daysInMonth(),
                    c = t([n, s, 1]),
                    d = t([n, s, l]),
                    m = t(c).subtract(1, 'month').month(),
                    p = t(c).subtract(1, 'month').year(),
                    f = t([p, m]).daysInMonth(),
                    u = c.day()
                ;((i = []).firstDay = c), (i.lastDay = d)
                for (var D = 0; D < 6; D++) i[D] = []
                var g = f - u + this.locale.firstDay + 1
                g > f && (g -= 7), u == this.locale.firstDay && (g = f - 6)
                for (var y = t([p, m, g, 12, o, h]), k = ((D = 0), 0), b = 0; D < 42; D++, k++, y = t(y).add(24, 'hour'))
                    D > 0 && k % 7 == 0 && ((k = 0), b++),
                        (i[b][k] = y.clone().hour(r).minute(o).second(h)),
                        y.hour(12),
                        this.minDate &&
                            i[b][k].format('YYYY-MM-DD') == this.minDate.format('YYYY-MM-DD') &&
                            i[b][k].isBefore(this.minDate) &&
                            'left' == a &&
                            (i[b][k] = this.minDate.clone()),
                        this.maxDate &&
                            i[b][k].format('YYYY-MM-DD') == this.maxDate.format('YYYY-MM-DD') &&
                            i[b][k].isAfter(this.maxDate) &&
                            'right' == a &&
                            (i[b][k] = this.maxDate.clone())
                'left' == a ? (this.leftCalendar.calendar = i) : (this.rightCalendar.calendar = i)
                var v = 'left' == a ? this.minDate : this.startDate,
                    C = this.maxDate,
                    Y = ('left' == a ? this.startDate : this.endDate, this.locale.direction, '<table class="table-condensed">')
                ;(Y += '<thead>'),
                    (Y += '<tr>'),
                    (this.showWeekNumbers || this.showISOWeekNumbers) && (Y += '<th></th>'),
                    (v && !v.isBefore(i.firstDay)) || (this.linkedCalendars && 'left' != a)
                        ? (Y += '<th></th>')
                        : (Y += '<th class="prev available"><span></span></th>')
                var w = this.locale.monthNames[i[1][1].month()] + i[1][1].format(' YYYY')
                if (this.showDropdowns) {
                    for (
                        var P = i[1][1].month(),
                            x = i[1][1].year(),
                            M = (C && C.year()) || this.maxYear,
                            I = (v && v.year()) || this.minYear,
                            S = x == I,
                            B = x == M,
                            A = '<select class="monthselect">',
                            L = 0;
                        L < 12;
                        L++
                    )
                        (!S || (v && L >= v.month())) && (!B || (C && L <= C.month()))
                            ? (A +=
                                  "<option value='" +
                                  L +
                                  "'" +
                                  (L === P ? " selected='selected'" : '') +
                                  '>' +
                                  this.locale.monthNames[L] +
                                  '</option>')
                            : (A +=
                                  "<option value='" +
                                  L +
                                  "'" +
                                  (L === P ? " selected='selected'" : '') +
                                  " disabled='disabled'>" +
                                  this.locale.monthNames[L] +
                                  '</option>')
                    A += '</select>'
                    for (var N = '<select class="yearselect">', E = I; E <= M; E++)
                        N += '<option value="' + E + '"' + (E === x ? ' selected="selected"' : '') + '>' + E + '</option>'
                    w = A + (N += '</select>')
                }
                if (
                    ((Y += '<th colspan="5" class="month">' + w + '</th>'),
                    (C && !C.isAfter(i.lastDay)) || (this.linkedCalendars && 'right' != a && !this.singleDatePicker)
                        ? (Y += '<th></th>')
                        : (Y += '<th class="next available"><span></span></th>'),
                    (Y += '</tr>'),
                    (Y += '<tr>'),
                    (this.showWeekNumbers || this.showISOWeekNumbers) && (Y += '<th class="week">' + this.locale.weekLabel + '</th>'),
                    e.each(this.locale.daysOfWeek, function (t, e) {
                        Y += '<th>' + e + '</th>'
                    }),
                    (Y += '</tr>'),
                    (Y += '</thead>'),
                    (Y += '<tbody>'),
                    null == this.endDate && this.maxSpan)
                ) {
                    var O = this.startDate.clone().add(this.maxSpan).endOf('day')
                    ;(C && !O.isBefore(C)) || (C = O)
                }
                for (b = 0; b < 6; b++) {
                    ;(Y += '<tr>'),
                        this.showWeekNumbers
                            ? (Y += '<td class="week">' + i[b][0].week() + '</td>')
                            : this.showISOWeekNumbers && (Y += '<td class="week">' + i[b][0].isoWeek() + '</td>')
                    for (k = 0; k < 7; k++) {
                        var W = []
                        i[b][k].isSame(new Date(), 'day') && W.push('today'),
                            i[b][k].isoWeekday() > 5 && W.push('weekend'),
                            i[b][k].month() != i[1][1].month() && W.push('off', 'ends'),
                            this.minDate && i[b][k].isBefore(this.minDate, 'day') && W.push('off', 'disabled'),
                            C && i[b][k].isAfter(C, 'day') && W.push('off', 'disabled'),
                            this.isInvalidDate(i[b][k]) && W.push('off', 'disabled'),
                            i[b][k].format('YYYY-MM-DD') == this.startDate.format('YYYY-MM-DD') && W.push('active', 'start-date'),
                            null != this.endDate && i[b][k].format('YYYY-MM-DD') == this.endDate.format('YYYY-MM-DD') && W.push('active', 'end-date'),
                            null != this.endDate && i[b][k] > this.startDate && i[b][k] < this.endDate && W.push('in-range')
                        var H = this.isCustomDate(i[b][k])
                        !1 !== H && ('string' == typeof H ? W.push(H) : Array.prototype.push.apply(W, H))
                        var j = '',
                            R = !1
                        for (D = 0; D < W.length; D++) (j += W[D] + ' '), 'disabled' == W[D] && (R = !0)
                        R || (j += 'available'),
                            (Y += '<td class="' + j.replace(/^\s+|\s+$/g, '') + '" data-title="r' + b + 'c' + k + '">' + i[b][k].date() + '</td>')
                    }
                    Y += '</tr>'
                }
                ;(Y += '</tbody>'), (Y += '</table>'), this.container.find('.drp-calendar.' + a + ' .calendar-table').html(Y)
            },
            renderTimePicker: function (t) {
                if ('right' != t || this.endDate) {
                    var e,
                        a,
                        i,
                        s = this.maxDate
                    if (
                        (!this.maxSpan ||
                            (this.maxDate && !this.startDate.clone().add(this.maxSpan).isBefore(this.maxDate)) ||
                            (s = this.startDate.clone().add(this.maxSpan)),
                        'left' == t)
                    )
                        (a = this.startDate.clone()), (i = this.minDate)
                    else if ('right' == t) {
                        ;(a = this.endDate.clone()), (i = this.startDate)
                        var n = this.container.find('.drp-calendar.right .calendar-time')
                        if (
                            '' != n.html() &&
                            (a.hour(isNaN(a.hour()) ? n.find('.hourselect option:selected').val() : a.hour()),
                            a.minute(isNaN(a.minute()) ? n.find('.minuteselect option:selected').val() : a.minute()),
                            a.second(isNaN(a.second()) ? n.find('.secondselect option:selected').val() : a.second()),
                            !this.timePicker24Hour)
                        ) {
                            var r = n.find('.ampmselect option:selected').val()
                            'PM' === r && a.hour() < 12 && a.hour(a.hour() + 12), 'AM' === r && 12 === a.hour() && a.hour(0)
                        }
                        a.isBefore(this.startDate) && (a = this.startDate.clone()), s && a.isAfter(s) && (a = s.clone())
                    }
                    e = '<select class="hourselect">'
                    for (var o = this.timePicker24Hour ? 0 : 1, h = this.timePicker24Hour ? 23 : 12, l = o; l <= h; l++) {
                        var c = l
                        this.timePicker24Hour || (c = a.hour() >= 12 ? (12 == l ? 12 : l + 12) : 12 == l ? 0 : l)
                        var d = a.clone().hour(c),
                            m = !1
                        i && d.minute(59).isBefore(i) && (m = !0),
                            s && d.minute(0).isAfter(s) && (m = !0),
                            c != a.hour() || m
                                ? (e += m
                                      ? '<option value="' + l + '" disabled="disabled" class="disabled">' + l + '</option>'
                                      : '<option value="' + l + '">' + l + '</option>')
                                : (e += '<option value="' + l + '" selected="selected">' + l + '</option>')
                    }
                    ;(e += '</select> '), (e += ': <select class="minuteselect">')
                    for (l = 0; l < 60; l += this.timePickerIncrement) {
                        var p = l < 10 ? '0' + l : l
                        ;(d = a.clone().minute(l)), (m = !1)
                        i && d.second(59).isBefore(i) && (m = !0),
                            s && d.second(0).isAfter(s) && (m = !0),
                            a.minute() != l || m
                                ? (e += m
                                      ? '<option value="' + l + '" disabled="disabled" class="disabled">' + p + '</option>'
                                      : '<option value="' + l + '">' + p + '</option>')
                                : (e += '<option value="' + l + '" selected="selected">' + p + '</option>')
                    }
                    if (((e += '</select> '), this.timePickerSeconds)) {
                        e += ': <select class="secondselect">'
                        for (l = 0; l < 60; l++) {
                            ;(p = l < 10 ? '0' + l : l), (d = a.clone().second(l)), (m = !1)
                            i && d.isBefore(i) && (m = !0),
                                s && d.isAfter(s) && (m = !0),
                                a.second() != l || m
                                    ? (e += m
                                          ? '<option value="' + l + '" disabled="disabled" class="disabled">' + p + '</option>'
                                          : '<option value="' + l + '">' + p + '</option>')
                                    : (e += '<option value="' + l + '" selected="selected">' + p + '</option>')
                        }
                        e += '</select> '
                    }
                    if (!this.timePicker24Hour) {
                        e += '<select class="ampmselect">'
                        var f = '',
                            u = ''
                        i && a.clone().hour(12).minute(0).second(0).isBefore(i) && (f = ' disabled="disabled" class="disabled"'),
                            s && a.clone().hour(0).minute(0).second(0).isAfter(s) && (u = ' disabled="disabled" class="disabled"'),
                            a.hour() >= 12
                                ? (e += '<option value="AM"' + f + '>AM</option><option value="PM" selected="selected"' + u + '>PM</option>')
                                : (e += '<option value="AM" selected="selected"' + f + '>AM</option><option value="PM"' + u + '>PM</option>'),
                            (e += '</select>')
                    }
                    this.container.find('.drp-calendar.' + t + ' .calendar-time').html(e)
                }
            },
            updateFormInputs: function () {
                this.singleDatePicker || (this.endDate && (this.startDate.isBefore(this.endDate) || this.startDate.isSame(this.endDate)))
                    ? this.container.find('button.applyBtn').prop('disabled', !1)
                    : this.container.find('button.applyBtn').prop('disabled', !0)
            },
            move: function () {
                var t,
                    a = { top: 0, left: 0 },
                    i = this.drops,
                    s = e(window).width()
                switch (
                    (this.parentEl.is('body') ||
                        ((a = {
                            top: this.parentEl.offset().top - this.parentEl.scrollTop(),
                            left: this.parentEl.offset().left - this.parentEl.scrollLeft(),
                        }),
                        (s = this.parentEl[0].clientWidth + this.parentEl.offset().left)),
                    i)
                ) {
                    case 'auto':
                        ;(t = this.element.offset().top + this.element.outerHeight() - a.top) + this.container.outerHeight() >=
                            this.parentEl[0].scrollHeight && ((t = this.element.offset().top - this.container.outerHeight() - a.top), (i = 'up'))
                        break
                    case 'up':
                        t = this.element.offset().top - this.container.outerHeight() - a.top
                        break
                    default:
                        t = this.element.offset().top + this.element.outerHeight() - a.top
                }
                this.container.css({ top: 0, left: 0, right: 'auto' })
                var n = this.container.outerWidth()
                if ((this.container.toggleClass('drop-up', 'up' == i), 'left' == this.opens)) {
                    var r = s - this.element.offset().left - this.element.outerWidth()
                    n + r > e(window).width()
                        ? this.container.css({ top: t, right: 'auto', left: 9 })
                        : this.container.css({ top: t, right: r, left: 'auto' })
                } else if ('center' == this.opens) {
                    ;(o = this.element.offset().left - a.left + this.element.outerWidth() / 2 - n / 2) < 0
                        ? this.container.css({ top: t, right: 'auto', left: 9 })
                        : o + n > e(window).width()
                          ? this.container.css({ top: t, left: 'auto', right: 0 })
                          : this.container.css({ top: t, left: o, right: 'auto' })
                } else {
                    var o
                    ;(o = this.element.offset().left - a.left) + n > e(window).width()
                        ? this.container.css({ top: t, left: 'auto', right: 0 })
                        : this.container.css({ top: t, left: o, right: 'auto' })
                }
            },
            show: function (t) {
                this.isShowing ||
                    ((this._outsideClickProxy = e.proxy(function (t) {
                        this.outsideClick(t)
                    }, this)),
                    e(document)
                        .on('mousedown.daterangepicker', this._outsideClickProxy)
                        .on('touchend.daterangepicker', this._outsideClickProxy)
                        .on('click.daterangepicker', '[data-toggle=dropdown]', this._outsideClickProxy)
                        .on('focusin.daterangepicker', this._outsideClickProxy),
                    e(window).on(
                        'resize.daterangepicker',
                        e.proxy(function (t) {
                            this.move(t)
                        }, this),
                    ),
                    (this.oldStartDate = this.startDate.clone()),
                    (this.oldEndDate = this.endDate.clone()),
                    (this.previousRightTime = this.endDate.clone()),
                    this.updateView(),
                    this.container.show(),
                    this.move(),
                    this.element.trigger('show.daterangepicker', this),
                    (this.isShowing = !0))
            },
            hide: function (t) {
                this.isShowing &&
                    (this.endDate || ((this.startDate = this.oldStartDate.clone()), (this.endDate = this.oldEndDate.clone())),
                    (this.startDate.isSame(this.oldStartDate) && this.endDate.isSame(this.oldEndDate)) ||
                        this.callback(this.startDate.clone(), this.endDate.clone(), this.chosenLabel),
                    this.updateElement(),
                    e(document).off('.daterangepicker'),
                    e(window).off('.daterangepicker'),
                    this.container.hide(),
                    this.element.trigger('hide.daterangepicker', this),
                    (this.isShowing = !1))
            },
            toggle: function (t) {
                this.isShowing ? this.hide() : this.show()
            },
            outsideClick: function (t) {
                var a = e(t.target)
                'focusin' == t.type ||
                    a.closest(this.element).length ||
                    a.closest(this.container).length ||
                    a.closest('.calendar-table').length ||
                    (this.hide(), this.element.trigger('outsideClick.daterangepicker', this))
            },
            showCalendars: function () {
                this.container.addClass('show-calendar'), this.move(), this.element.trigger('showCalendar.daterangepicker', this)
            },
            hideCalendars: function () {
                this.container.removeClass('show-calendar'), this.element.trigger('hideCalendar.daterangepicker', this)
            },
            clickRange: function (t) {
                var e = t.target.getAttribute('data-range-key')
                if (((this.chosenLabel = e), e == this.locale.customRangeLabel)) this.showCalendars()
                else {
                    var a = this.ranges[e]
                    ;(this.startDate = a[0]),
                        (this.endDate = a[1]),
                        this.timePicker || (this.startDate.startOf('day'), this.endDate.endOf('day')),
                        this.alwaysShowCalendars || this.hideCalendars(),
                        this.clickApply()
                }
            },
            clickPrev: function (t) {
                e(t.target).parents('.drp-calendar').hasClass('left')
                    ? (this.leftCalendar.month.subtract(1, 'month'), this.linkedCalendars && this.rightCalendar.month.subtract(1, 'month'))
                    : this.rightCalendar.month.subtract(1, 'month'),
                    this.updateCalendars()
            },
            clickNext: function (t) {
                e(t.target).parents('.drp-calendar').hasClass('left')
                    ? this.leftCalendar.month.add(1, 'month')
                    : (this.rightCalendar.month.add(1, 'month'), this.linkedCalendars && this.leftCalendar.month.add(1, 'month')),
                    this.updateCalendars()
            },
            hoverDate: function (t) {
                if (e(t.target).hasClass('available')) {
                    var a = e(t.target).attr('data-title'),
                        i = a.substr(1, 1),
                        s = a.substr(3, 1),
                        n = e(t.target).parents('.drp-calendar').hasClass('left')
                            ? this.leftCalendar.calendar[i][s]
                            : this.rightCalendar.calendar[i][s],
                        r = this.leftCalendar,
                        o = this.rightCalendar,
                        h = this.startDate
                    this.endDate ||
                        this.container.find('.drp-calendar tbody td').each(function (t, a) {
                            if (!e(a).hasClass('week')) {
                                var i = e(a).attr('data-title'),
                                    s = i.substr(1, 1),
                                    l = i.substr(3, 1),
                                    c = e(a).parents('.drp-calendar').hasClass('left') ? r.calendar[s][l] : o.calendar[s][l]
                                ;(c.isAfter(h) && c.isBefore(n)) || c.isSame(n, 'day') ? e(a).addClass('in-range') : e(a).removeClass('in-range')
                            }
                        })
                }
            },
            clickDate: function (t) {
                if (e(t.target).hasClass('available')) {
                    var a = e(t.target).attr('data-title'),
                        i = a.substr(1, 1),
                        s = a.substr(3, 1),
                        n = e(t.target).parents('.drp-calendar').hasClass('left')
                            ? this.leftCalendar.calendar[i][s]
                            : this.rightCalendar.calendar[i][s]
                    if (this.endDate || n.isBefore(this.startDate, 'day')) {
                        if (this.timePicker) {
                            var r = parseInt(this.container.find('.left .hourselect').val(), 10)
                            if (!this.timePicker24Hour)
                                'PM' === (l = this.container.find('.left .ampmselect').val()) && r < 12 && (r += 12),
                                    'AM' === l && 12 === r && (r = 0)
                            var o = parseInt(this.container.find('.left .minuteselect').val(), 10)
                            isNaN(o) && (o = parseInt(this.container.find('.left .minuteselect option:last').val(), 10))
                            var h = this.timePickerSeconds ? parseInt(this.container.find('.left .secondselect').val(), 10) : 0
                            n = n.clone().hour(r).minute(o).second(h)
                        }
                        ;(this.endDate = null), this.setStartDate(n.clone())
                    } else if (!this.endDate && n.isBefore(this.startDate)) this.setEndDate(this.startDate.clone())
                    else {
                        if (this.timePicker) {
                            var l
                            r = parseInt(this.container.find('.right .hourselect').val(), 10)
                            if (!this.timePicker24Hour)
                                'PM' === (l = this.container.find('.right .ampmselect').val()) && r < 12 && (r += 12),
                                    'AM' === l && 12 === r && (r = 0)
                            o = parseInt(this.container.find('.right .minuteselect').val(), 10)
                            isNaN(o) && (o = parseInt(this.container.find('.right .minuteselect option:last').val(), 10))
                            h = this.timePickerSeconds ? parseInt(this.container.find('.right .secondselect').val(), 10) : 0
                            n = n.clone().hour(r).minute(o).second(h)
                        }
                        this.setEndDate(n.clone()), this.autoApply && (this.calculateChosenLabel(), this.clickApply())
                    }
                    this.singleDatePicker && (this.setEndDate(this.startDate), !this.timePicker && this.autoApply && this.clickApply()),
                        this.updateView(),
                        t.stopPropagation()
                }
            },
            calculateChosenLabel: function () {
                var t = !0,
                    e = 0
                for (var a in this.ranges) {
                    if (this.timePicker) {
                        var i = this.timePickerSeconds ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm'
                        if (this.startDate.format(i) == this.ranges[a][0].format(i) && this.endDate.format(i) == this.ranges[a][1].format(i)) {
                            ;(t = !1),
                                (this.chosenLabel = this.container
                                    .find('.ranges li:eq(' + e + ')')
                                    .addClass('active')
                                    .attr('data-range-key'))
                            break
                        }
                    } else if (
                        this.startDate.format('YYYY-MM-DD') == this.ranges[a][0].format('YYYY-MM-DD') &&
                        this.endDate.format('YYYY-MM-DD') == this.ranges[a][1].format('YYYY-MM-DD')
                    ) {
                        ;(t = !1),
                            (this.chosenLabel = this.container
                                .find('.ranges li:eq(' + e + ')')
                                .addClass('active')
                                .attr('data-range-key'))
                        break
                    }
                    e++
                }
                t &&
                    (this.showCustomRangeLabel
                        ? (this.chosenLabel = this.container.find('.ranges li:last').addClass('active').attr('data-range-key'))
                        : (this.chosenLabel = null),
                    this.showCalendars())
            },
            clickApply: function (t) {
                this.hide(), this.element.trigger('apply.daterangepicker', this)
            },
            clickCancel: function (t) {
                ;(this.startDate = this.oldStartDate),
                    (this.endDate = this.oldEndDate),
                    this.hide(),
                    this.element.trigger('cancel.daterangepicker', this)
            },
            monthOrYearChanged: function (t) {
                var a = e(t.target).closest('.drp-calendar').hasClass('left'),
                    i = a ? 'left' : 'right',
                    s = this.container.find('.drp-calendar.' + i),
                    n = parseInt(s.find('.monthselect').val(), 10),
                    r = s.find('.yearselect').val()
                a ||
                    ((r < this.startDate.year() || (r == this.startDate.year() && n < this.startDate.month())) &&
                        ((n = this.startDate.month()), (r = this.startDate.year()))),
                    this.minDate &&
                        (r < this.minDate.year() || (r == this.minDate.year() && n < this.minDate.month())) &&
                        ((n = this.minDate.month()), (r = this.minDate.year())),
                    this.maxDate &&
                        (r > this.maxDate.year() || (r == this.maxDate.year() && n > this.maxDate.month())) &&
                        ((n = this.maxDate.month()), (r = this.maxDate.year())),
                    a
                        ? (this.leftCalendar.month.month(n).year(r),
                          this.linkedCalendars && (this.rightCalendar.month = this.leftCalendar.month.clone().add(1, 'month')))
                        : (this.rightCalendar.month.month(n).year(r),
                          this.linkedCalendars && (this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, 'month'))),
                    this.updateCalendars()
            },
            timeChanged: function (t) {
                var a = e(t.target).closest('.drp-calendar'),
                    i = a.hasClass('left'),
                    s = parseInt(a.find('.hourselect').val(), 10),
                    n = parseInt(a.find('.minuteselect').val(), 10)
                isNaN(n) && (n = parseInt(a.find('.minuteselect option:last').val(), 10))
                var r = this.timePickerSeconds ? parseInt(a.find('.secondselect').val(), 10) : 0
                if (!this.timePicker24Hour) {
                    var o = a.find('.ampmselect').val()
                    'PM' === o && s < 12 && (s += 12), 'AM' === o && 12 === s && (s = 0)
                }
                if (i) {
                    var h = this.startDate.clone()
                    h.hour(s),
                        h.minute(n),
                        h.second(r),
                        this.setStartDate(h),
                        this.singleDatePicker
                            ? (this.endDate = this.startDate.clone())
                            : this.endDate &&
                              this.endDate.format('YYYY-MM-DD') == h.format('YYYY-MM-DD') &&
                              this.endDate.isBefore(h) &&
                              this.setEndDate(h.clone())
                } else if (this.endDate) {
                    var l = this.endDate.clone()
                    l.hour(s), l.minute(n), l.second(r), this.setEndDate(l)
                }
                this.updateCalendars(), this.updateFormInputs(), this.renderTimePicker('left'), this.renderTimePicker('right')
            },
            elementChanged: function () {
                if (this.element.is('input') && this.element.val().length) {
                    var e = this.element.val().split(this.locale.separator),
                        a = null,
                        i = null
                    2 === e.length && ((a = t(e[0], this.locale.format)), (i = t(e[1], this.locale.format))),
                        (this.singleDatePicker || null === a || null === i) && (i = a = t(this.element.val(), this.locale.format)),
                        a.isValid() && i.isValid() && (this.setStartDate(a), this.setEndDate(i), this.updateView())
                }
            },
            keydown: function (t) {
                ;(9 !== t.keyCode && 13 !== t.keyCode) || this.hide(), 27 === t.keyCode && (t.preventDefault(), t.stopPropagation(), this.hide())
            },
            updateElement: function () {
                if (this.element.is('input') && this.autoUpdateInput) {
                    var t = this.startDate.format(this.locale.format)
                    this.singleDatePicker || (t += this.locale.separator + this.endDate.format(this.locale.format)),
                        t !== this.element.val() && this.element.val(t).trigger('change')
                }
            },
            remove: function () {
                this.container.remove(), this.element.off('.daterangepicker'), this.element.removeData()
            },
        }),
        (e.fn.daterangepicker = function (t, i) {
            var s = e.extend(!0, {}, e.fn.daterangepicker.defaultOptions, t)
            return (
                this.each(function () {
                    var t = e(this)
                    t.data('daterangepicker') && t.data('daterangepicker').remove(), t.data('daterangepicker', new a(t, s, i))
                }),
                this
            )
        }),
        a
    )
})
//# sourceMappingURL=/sm/f07d8d7b2652873f485707eab4f3d300bf1f6f3b42912e189c8933b1b9b3dfde.map

const sleep = () =>
    new Promise((resolve) => {
        setTimeout(() => resolve(true), 5)
    })

/**
 * INITIALIZE DATE PICKERS
 */
const formFieldsDateInput = async () => {
    let datePickerPackageCss = ''

    const selectors = {
        DATE_PICKER: '[form-fields-pro-date-picker]',
        DATE_RANGE_PICKER: '[form-fields-pro-date-range-picker]',
    }

    const datePickerState = {}

    /**
     *
     * @param {Element} element
     */
    const getCommonConfig = (element) => {
        const grid = Number(element.getAttribute('data-columns'))
        const calendars = Number(element.getAttribute('data-months'))
        const firstDay = Number(element.getAttribute('data-firstDay'))
        const format = element.getAttribute('data-format')
        const lang = element.getAttribute('data-language')
        const zIndex = element.getAttribute('data-zIndex')

        return {
            element,
            // css: ["https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css"],
            grid,
            calendars,
            firstDay,
            format,
            lang,
            zIndex,
            readonly: false,
        }
    }

    /**
     *
     * @param {Element} element
     */
    const getCustomCSS = (element) => {
        const { backgroundColor: parentBackgroundColor, color: parentTextColor } = getComputedStyle(element.parentElement)

        const lightTheme = {
            selectedDateTextColor: element.getAttribute('data-light-theme-selected-date-text-color') || parentTextColor,
            selectedDateBackgroundColor: element.getAttribute('data-light-theme-selected-date-background-color') || parentBackgroundColor,
            todayColor: element.getAttribute('data-light-theme-today-color') || parentTextColor,
        }

        const darkTheme = {
            selectedDateTextColor: element.getAttribute('data-dark-theme-selected-date-text-color') || parentTextColor,
            selectedDateBackgroundColor: element.getAttribute('data-dark-theme-selected-date-background-color') || parentBackgroundColor,
            todayColor: element.getAttribute('data-dark-theme-today-color') || parentTextColor,
        }

        // const sheet = new CSSStyleSheet();
        // sheet.replaceSync(`
        const sheet = `
      .container {
        font-family: inherit;
      }
  
      .calendar>.days-grid>.day.today {
        color: ${lightTheme.todayColor}
      }
  
      .calendar>.days-grid>.day.selected, 
      .container.range-plugin .calendar>.days-grid>.day.end, 
      .container.range-plugin .calendar>.days-grid>.day.start {
        color: ${lightTheme.selectedDateTextColor};
        background-color: ${lightTheme.selectedDateBackgroundColor};
      }
  
      .container.range-plugin .calendar>.days-grid>.day.start:after {
        border-left-color: ${lightTheme.selectedDateBackgroundColor}; 
      }
  
      .container.range-plugin .calendar>.days-grid>.day.end:after {
        border-right-color: ${lightTheme.selectedDateBackgroundColor}; 
      }
  
      .calendar>.days-grid>.day:hover {
        border-color: ${lightTheme.selectedDateBackgroundColor}
      }
  
      .container.range-plugin .calendar>.days-grid>.day.in-range {
        color: ${lightTheme.selectedDateTextColor};
        background-color: ${lightTheme.selectedDateBackgroundColor.replace('rgb', 'rgba').replace(')', ', 0.65)')}; 
      }
  
  
  
      @media (prefers-color-scheme: dark) {
        .calendar>.days-grid>.day.today {
          color: ${darkTheme.todayColor}
        }
  
        .calendar>.days-grid>.day.selected,
        .container.range-plugin .calendar>.days-grid>.day.end, 
        .container.range-plugin .calendar>.days-grid>.day.start {
          color: ${darkTheme.selectedDateTextColor};
          background-color: ${darkTheme.selectedDateBackgroundColor};
        }
  
        .calendar>.days-grid>.day:hover {
          border-color: ${darkTheme.selectedDateBackgroundColor}
        }
  
        .container.range-plugin .calendar>.days-grid>.day.start:after {
          border-left-color: ${darkTheme.selectedDateBackgroundColor}; 
        }
  
        .container.range-plugin .calendar>.days-grid>.day.end:after {
          border-right-color: ${darkTheme.selectedDateBackgroundColor}; 
        }
  
        .container.range-plugin .calendar>.days-grid>.day.in-range {
          color: ${darkTheme.selectedDateTextColor};
          background-color: ${darkTheme.selectedDateBackgroundColor.replace('rgb', 'rgba').replace(')', ', 0.65)')}; 
        }
      }`
        // `);
        // datePicker.shadowRoot.adoptedStyleSheets = [sheet];

        return `
      ${datePickerPackageCss}
  
      ${sheet}
      `
    }

    /**
     *
     * @param {Element} element
     */
    const overrideCss = (element) => {
        const inputName = element.getAttribute('name')

        const formFieldsId = `${inputName}-${Date.now()}`
        element.setAttribute('form-fields-id', formFieldsId)

        const { backgroundColor: parentBackgroundColor, color: parentTextColor } = getComputedStyle(element.parentElement)

        const lightTheme = {
            selectedDateTextColor: element.getAttribute('data-light-theme-selected-date-text-color') || parentTextColor,
            selectedDateBackgroundColor: element.getAttribute('data-light-theme-selected-date-background-color') || parentBackgroundColor,
            todayColor: element.getAttribute('data-light-theme-today-color') || parentTextColor,
        }

        const darkTheme = {
            selectedDateTextColor: element.getAttribute('data-dark-theme-selected-date-text-color') || parentTextColor,
            selectedDateBackgroundColor: element.getAttribute('data-dark-theme-selected-date-background-color') || parentBackgroundColor,
            todayColor: element.getAttribute('data-dark-theme-today-color') || parentTextColor,
        }

        const sheet = new CSSStyleSheet()
        sheet.replaceSync(`
    [form-fields-id="${formFieldsId}"]  + div + div .daterangepicker td.available:hover {
      color: ${lightTheme.selectedDateTextColor};
      background-color: ${lightTheme.selectedDateBackgroundColor.replace('rgb', 'rgba').replace(')', ', 0.65)')}; 
    }

    [form-fields-id="${formFieldsId}"]  + div + div .daterangepicker td.in-range {
      color: ${lightTheme.selectedDateTextColor};
      background-color: ${lightTheme.selectedDateBackgroundColor.replace('rgb', 'rgba').replace(')', ', 0.45)')};
    }

    [form-fields-id="${formFieldsId}"]  + div + div .daterangepicker td.active, 
    [form-fields-id="${formFieldsId}"]  + div + div .daterangepicker td.active:hover {
      color: ${lightTheme.selectedDateTextColor};
      background-color: ${lightTheme.selectedDateBackgroundColor};
    }
  
    @media (prefers-color-scheme: dark) {
      [form-fields-id="${formFieldsId}"]  + div + div .daterangepicker td.available:hover {
        color: ${darkTheme.selectedDateTextColor};
        background-color: ${darkTheme.selectedDateBackgroundColor.replace('rgb', 'rgba').replace(')', ', 0.65)')}; 
      }

      [form-fields-id="${formFieldsId}"]  + div + div .daterangepicker td.in-range {
        color: ${darkTheme.selectedDateTextColor};
        background-color: ${darkTheme.selectedDateBackgroundColor.replace('rgb', 'rgba').replace(')', ', 0.45)')};
      }

      [form-fields-id="${formFieldsId}"]  + div + div .daterangepicker td.active, 
      [form-fields-id="${formFieldsId}"]  + div + div .daterangepicker td.active:hover {
        color: ${darkTheme.selectedDateTextColor};
        background-color: ${darkTheme.selectedDateBackgroundColor};
      }
    }
    `)

        const sheets = document.adoptedStyleSheets || []
        document.adoptedStyleSheets = [...sheets, sheet]
    }

    /**
     *
     * @param {HTMLInputElement} datePickerInput
     */
    const showDatePickerOnIconClick = (datePickerInput) => {
        const name = datePickerInput.getAttribute('name')
        const icon = document.querySelector(`[name="${name}"] + .date-input-icon`)

        if (icon) icon.style.cursor = 'pointer'

        icon?.addEventListener('click', () => {
            datePickerInput.click()
        })
    }

    const createPickerDropdownWrapperElement = () => {
        const div = document.createElement('div')
        div.style.position = 'absolute'
        div.style.left = '0'
        div.style.width = '100%'

        return div
    }

    /**
     *
     * @param {HTMLInputElement} inputElement
     */
    const preventFormSubmitOnFirstEnterToHideDatePicker = (inputElement) => {
        const inputName = inputElement.getAttribute('name')

        $(inputElement).on('show.daterangepicker', () => {
            datePickerState[inputName] = true
        })

        $(inputElement).on('hide.daterangepicker', (e) => {
            datePickerState[inputName] = false
        })

        inputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !datePickerState[inputName]) {
                e.preventDefault()
                datePickerState[inputName] = true
            }
        })
    }

    const initializeDatePickers = () => {
        const datePickerInputs = document.querySelectorAll(selectors.DATE_PICKER)

        for (let inputElement of datePickerInputs) {
            const pickerDropdownWrapperEl = createPickerDropdownWrapperElement()
            inputElement.parentElement.appendChild(pickerDropdownWrapperEl)

            $(inputElement).daterangepicker({
                singleDatePicker: true,
                showDropdowns: true,
                startDate: new Date(),
                parentEl: pickerDropdownWrapperEl,
            })
            overrideCss(inputElement)
            showDatePickerOnIconClick(inputElement)
            preventFormSubmitOnFirstEnterToHideDatePicker(inputElement)
        }
    }

    const initializeDateRangePickers = () => {
        const datePickerInputs = document.querySelectorAll(selectors.DATE_RANGE_PICKER)

        for (let inputElement of datePickerInputs) {
            const pickerDropdownWrapperEl = createPickerDropdownWrapperElement()
            inputElement.parentElement.appendChild(pickerDropdownWrapperEl)

            $(inputElement).daterangepicker({
                startDate: new Date(),
                endDate: new Date(),
                showDropdowns: true,
                parentEl: pickerDropdownWrapperEl,
            })
            overrideCss(inputElement)
            showDatePickerOnIconClick(inputElement)
            preventFormSubmitOnFirstEnterToHideDatePicker(inputElement)
        }
    }

    const loadDatePickerPackageCSS = async () => {
        const additionalCss = `
    .daterangepicker {
      font-family: inherit;
      border-radius: 0;
    }

    .daterangepicker select.yearselect,
    .daterangepicker select.monthselect {
      border-radius: 0;
      border-color: #ccc;
    }

    input.form-fields-dropdown-wrapper:focus-visible {
      outline: 0;
      border-color: #3898ec;
    }

    .cancelBtn, .applyBtn {
      width: fit-content;
      background: rgb(239, 239, 239);
      border-color: rgb(239, 239, 239);
      padding: 8px 12px !important;
    }

    .applyBtn {
      background: black;
      color: white;
      border-color: black;
    }

    @media (max-width: 485px) {
      .daterangepicker .drp-selected {
        width: 100%;
        margin-bottom: 8px;
      }
    }
    `
        const res = await fetch('https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css')
        if (res.ok) {
            // datePickerPackageCss = await res.text();
            const cssString = await res.text()
            const style = document.createElement('style')
            style.innerHTML = `${cssString} ${additionalCss}`

            document.getElementsByTagName('head')[0].appendChild(style)
        }
    }

    await loadDatePickerPackageCSS()
    initializeDatePickers()
    initializeDateRangePickers()
}

/**
 * INITIALIZE USER IP INPUTS
 */

const formFieldsUserIp = async () => {
    const hideAdminAlert = () => {
        /**
         * @type {HTMLElement[]}
         */
        const alertElements = document.querySelectorAll('[form-fields-pro-user-ip-admin-alert]')

        for (let element of alertElements) element.style.display = 'none'
    }

    const getUserIp = async () => {
        const BASE_URL = 'https://flowapps-data-client-individualformdatabase.up.railway.app'
        const res = await fetch(`${BASE_URL}/api/user-ip`)

        if (res.ok) {
            const { ip } = await res.json()
            return ip
        } else return ''
    }

    const collectUserIp = async () => {
        const ip = await getUserIp()

        /**
         * @type {HTMLInputElement[]}
         */
        const inputElements = document.querySelectorAll('[form-fields-pro-user-ip-input]')

        for (let input of inputElements) {
            input.value = ip
        }
    }

    hideAdminAlert()
    collectUserIp()
}

/**
 * INITIALIZE RANGE SLIDERS
 */
const formFieldsNumberSlider = async () => {
    const additionalCss = `
    .noUi-horizontal {
      height: 12px;
    }
    
    .noUi-target {
      border: 1px solid #ededed;
      border-radius: 11.5px;
      box-shadow: none;
    }

    .noUi-horizontal .noUi-handle {
      width: 22px;
      height: 22px;
      right: -17px;
      top: -6px;
      border-radius: 50%;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
    }

    .noUi-handle:after, .noUi-handle:before {
      display: none;
    }

    .noUi-tooltip {
      border: none;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
    }
    `

    const addNumberSliderCss = async () => {
        const res = await fetch(`https://cdn.jsdelivr.net/gh/leongersen/noUiSlider@15.7.1/dist/nouislider.min.css`)

        if (res.ok) {
            const cssString = await res.text()
            const style = document.createElement('style')
            style.innerHTML = `${cssString} ${additionalCss}`

            document.getElementsByTagName('head')[0].appendChild(style)
        }
    }

    /**
     *
     * @param {Element} element
     */
    const overrideCss = (element) => {
        const inputName = element.getAttribute('name')

        const formFieldsId = `${inputName}-${Date.now()}`
        element.setAttribute('form-fields-id', formFieldsId)

        const { backgroundColor: parentBackgroundColor, color: parentTextColor } = getComputedStyle(element.parentElement)

        const lightTheme = {
            maxMinValueTextColor: element.getAttribute('data-light-theme-max-min-text-color') || parentTextColor,
            tooltipTextColor: element.getAttribute('data-light-theme-tooltip-text-color') || parentTextColor,
            sliderColor: element.getAttribute('data-light-theme-slider-color') || parentBackgroundColor,
        }

        const darkTheme = {
            maxMinValueTextColor: element.getAttribute('data-dark-theme-max-min-text-color') || parentTextColor,
            tooltipTextColor: element.getAttribute('data-dark-theme-tooltip-text-color') || parentTextColor,
            sliderColor: element.getAttribute('data-dark-theme-slider-color') || parentBackgroundColor,
        }

        const sheet = new CSSStyleSheet()
        sheet.replaceSync(`
      [form-fields-id="${formFieldsId}"] ~ .noUi-target .noUi-connect {
        background: ${lightTheme.sliderColor}
      }
      [form-fields-id="${formFieldsId}"] ~ .noUi-horizontal .noUi-tooltip {
        color: ${lightTheme.tooltipTextColor};
        background: ${lightTheme.sliderColor};
      }
  
      [form-fields-id="${formFieldsId}"] ~ .rs-container .rs-scale span ins {
        color: ${lightTheme.maxMinValueTextColor};
      }
  
      @media (prefers-color-scheme: dark) {
        [form-fields-id="${formFieldsId}"] ~ .noUi-target .noUi-connect {
          background: ${darkTheme.sliderColor}
        }
        [form-fields-id="${formFieldsId}"] ~ .noUi-horizontal .noUi-tooltip {
          color: ${darkTheme.tooltipTextColor};
          background: ${darkTheme.sliderColor};
        }
  
        [form-fields-id="${formFieldsId}"] ~ .rs-container .rs-scale span ins {
          color: ${darkTheme.maxMinValueTextColor}
        }
      }
      `)

        const sheets = document.adoptedStyleSheets || []
        document.adoptedStyleSheets = [...sheets, sheet]
    }

    /**
     *
     * @param {Element} sliderInput
     */
    const initializeRegularSlider = (sliderInput) => {
        const min = Number(sliderInput.getAttribute('data-min'))
        const max = Number(sliderInput.getAttribute('data-max'))
        const defaultValue = Number(sliderInput.getAttribute('data-default'))

        const container = document.createElement('div')
        sliderInput.parentElement.appendChild(container)

        const slider = noUiSlider.create(container, {
            start: defaultValue,
            step: 1,
            connect: 'lower',
            tooltips: { to: (val) => Math.round(val) },
            range: {
                min,
                max,
            },
        })

        slider.on('update', (values) => {
            values = values.map((v) => Math.round(v)).join(',')
            sliderInput.value = values
        })
    }

    /**
     *
     * @param {Element} sliderInput
     */
    const initializeRangeSlider = (sliderInput) => {
        const min = Number(sliderInput.getAttribute('data-min'))
        const max = Number(sliderInput.getAttribute('data-max'))
        const defaultmin = Number(sliderInput.getAttribute('data-min-default'))
        const defaultmax = Number(sliderInput.getAttribute('data-max-default'))

        const container = document.createElement('div')
        sliderInput.parentElement.appendChild(container)

        const slider = noUiSlider.create(container, {
            start: [defaultmin, defaultmax],
            step: 1,
            connect: [false, true, false],
            tooltips: { to: (val) => Math.round(val) },
            range: {
                min,
                max,
            },
        })

        slider.on('update', (values) => {
            values = values.map((v) => Math.round(v)).join(',')
            sliderInput.value = values
        })
    }

    const initializeTheSliders = async () => {
        const sliders = document.querySelectorAll(`[form-fields-pro-number-slider]`)

        for (let slider of sliders) {
            const rangeSlider = slider.getAttribute('allow-range')
            if (rangeSlider) initializeRangeSlider(slider)
            else initializeRegularSlider(slider)

            overrideCss(slider)
            await sleep()
        }
    }

    await addNumberSliderCss()

    initializeTheSliders()
}

/**
 * INITIALIZE SELECT INPUTS
 */
const formFieldsSelect = async () => {
    const additionalCss = `
  .select2-container {
    height: 38px;
  }

  .selection {
    height: 100%;
    display: block;
  }

  .select2-container--default .select2-selection--single {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
  }

  .select2-container .select2-selection--single .select2-selection__rendered {
    padding: 0;
  }

  .select2-container--default .select2-selection--single .select2-selection__arrow {
    position: relative;
    top: 0;
    right: 0;
  }

  .select2-container--default .select2-selection--single .select2-selection__arrow b,
  .select2-container--default.select2-container--open .select2-selection--single .select2-selection__arrow b {
    border-color: transparent;
    border-width: 0;
    margin-top: -3px;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDE0IDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNyA3TDEzIDEiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=);
    height: 10px;
    width: 20px;
    background-repeat: no-repeat;
  }

  .select2-container--default .select2-selection--single {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 0;
  }

  .select2-dropdown {
    border: 1px solid #ccc;
    border-radius: 0;
  }
 
  .select2-results__option--selectable {
    padding: 8px 12px;
    height: 38px;
  }

  .select2-search--dropdown .select2-search__field {
    padding: 8px 8px;
  }

  .select2-container--default .select2-selection--single:focus-visible,
  .select2-container--default .select2-search--dropdown .select2-search__field:focus-visible {
    outline: 0;
    border-color: #3898ec;
  }
  `

    const addSelect2Css = async () => {
        const res = await fetch(`https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css`)

        if (res.ok) {
            const cssString = await res.text()
            const style = document.createElement('style')
            style.innerHTML = `${cssString} ${additionalCss}`

            document.getElementsByTagName('head')[0].appendChild(style)
        }
    }

    /**
     *
     * @param {Element} element select list element
     */
    const overrideCss = (element) => {
        const inputName = element.getAttribute('name')
        element.id = `${inputName.replace(' ', '')}-${Date.now()}`

        const lightTheme = {
            hoverTextColor: element.getAttribute('data-light-theme-hover-text-color'),
            hoverBackground: element.getAttribute('data-light-theme-hover-background-color'),
        }

        const darkTheme = {
            hoverTextColor: element.getAttribute('data-dark-theme-hover-text-color'),
            hoverBackground: element.getAttribute('data-dark-theme-hover-background-color'),
        }

        const sheet = new CSSStyleSheet()
        sheet.replaceSync(`
        #select2-${element.id}-results li.select2-results__option--highlighted {
          color: ${lightTheme.hoverTextColor};
          background: ${lightTheme.hoverBackground}
        }
    
        @media (prefers-color-scheme: dark) {
          #select2-${element.id}-results li.select2-results__option--highlighted {
            color: ${darkTheme.hoverTextColor};
            background: ${darkTheme.hoverBackground}
          }
        }
        `)

        const sheets = document.adoptedStyleSheets || []
        document.adoptedStyleSheets = [...sheets, sheet]
    }

    await addSelect2Css()

    const selectInputs = document.querySelectorAll(`[form-fields-type="select"]`)
    for (let select of selectInputs) {
        overrideCss(select)
        const isSearchable = select.getAttribute('data-searchable')
        $(select).select2({
            minimumResultsForSearch: isSearchable ? 0 : Infinity,
        })
    }
}

/**
 * INITIALIZE PHONE NUMBER INPUTS
 */
//All script -> created by sakil ahmed

// Number input field with country code
// 253 countries
const countries = [
    { name: 'Afghanistan', code: 'AF', phone: 93 },
    { name: 'Aland Islands', code: 'AX', phone: 358 },
    { name: 'Albania', code: 'AL', phone: 355 },
    { name: 'Algeria', code: 'DZ', phone: 213 },
    { name: 'American Samoa', code: 'AS', phone: 1684 },
    { name: 'Andorra', code: 'AD', phone: 376 },
    { name: 'Angola', code: 'AO', phone: 244 },
    { name: 'Anguilla', code: 'AI', phone: 1264 },
    { name: 'Antarctica', code: 'AQ', phone: 672 },
    { name: 'Antigua and Barbuda', code: 'AG', phone: 1268 },
    { name: 'Argentina', code: 'AR', phone: 54 },
    { name: 'Armenia', code: 'AM', phone: 374 },
    { name: 'Aruba', code: 'AW', phone: 297 },
    { name: 'Australia', code: 'AU', phone: 61 },
    { name: 'Austria', code: 'AT', phone: 43 },
    { name: 'Azerbaijan', code: 'AZ', phone: 994 },
    { name: 'Bahamas', code: 'BS', phone: 1242 },
    { name: 'Bahrain', code: 'BH', phone: 973 },
    { name: 'Bangladesh', code: 'BD', phone: 880 },
    { name: 'Barbados', code: 'BB', phone: 1246 },
    { name: 'Belarus', code: 'BY', phone: 375 },
    { name: 'Belgium', code: 'BE', phone: 32 },
    { name: 'Belize', code: 'BZ', phone: 501 },
    { name: 'Benin', code: 'BJ', phone: 229 },
    { name: 'Bermuda', code: 'BM', phone: 1441 },
    { name: 'Bhutan', code: 'BT', phone: 975 },
    { name: 'Bolivia', code: 'BO', phone: 591 },
    { name: 'Bonaire, Sint Eustatius and Saba', code: 'BQ', phone: 599 },
    { name: 'Bosnia and Herzegovina', code: 'BA', phone: 387 },
    { name: 'Botswana', code: 'BW', phone: 267 },
    { name: 'Bouvet Island', code: 'BV', phone: 55 },
    { name: 'Brazil', code: 'BR', phone: 55 },
    { name: 'British Indian Ocean Territory', code: 'IO', phone: 246 },
    { name: 'Brunei Darussalam', code: 'BN', phone: 673 },
    { name: 'Bulgaria', code: 'BG', phone: 359 },
    { name: 'Burkina Faso', code: 'BF', phone: 226 },
    { name: 'Burundi', code: 'BI', phone: 257 },
    { name: 'Cambodia', code: 'KH', phone: 855 },
    { name: 'Cameroon', code: 'CM', phone: 237 },
    { name: 'Canada', code: 'CA', phone: 1 },
    { name: 'Cape Verde', code: 'CV', phone: 238 },
    { name: 'Cayman Islands', code: 'KY', phone: 1345 },
    { name: 'Central African Republic', code: 'CF', phone: 236 },
    { name: 'Chad', code: 'TD', phone: 235 },
    { name: 'Chile', code: 'CL', phone: 56 },
    { name: 'China', code: 'CN', phone: 86 },
    { name: 'Christmas Island', code: 'CX', phone: 61 },
    { name: 'Cocos (Keeling) Islands', code: 'CC', phone: 672 },
    { name: 'Colombia', code: 'CO', phone: 57 },
    { name: 'Comoros', code: 'KM', phone: 269 },
    { name: 'Congo', code: 'CG', phone: 242 },
    { name: 'Congo, Democratic Republic of the Congo', code: 'CD', phone: 242 },
    { name: 'Cook Islands', code: 'CK', phone: 682 },
    { name: 'Costa Rica', code: 'CR', phone: 506 },
    { name: "Cote D'Ivoire", code: 'CI', phone: 225 },
    { name: 'Croatia', code: 'HR', phone: 385 },
    { name: 'Cuba', code: 'CU', phone: 53 },
    { name: 'Curacao', code: 'CW', phone: 599 },
    { name: 'Cyprus', code: 'CY', phone: 357 },
    { name: 'Czech Republic', code: 'CZ', phone: 420 },
    { name: 'Denmark', code: 'DK', phone: 45 },
    { name: 'Djibouti', code: 'DJ', phone: 253 },
    { name: 'Dominica', code: 'DM', phone: 1767 },
    { name: 'Dominican Republic', code: 'DO', phone: 1809 },
    { name: 'Ecuador', code: 'EC', phone: 593 },
    { name: 'Egypt', code: 'EG', phone: 20 },
    { name: 'El Salvador', code: 'SV', phone: 503 },
    { name: 'Equatorial Guinea', code: 'GQ', phone: 240 },
    { name: 'Eritrea', code: 'ER', phone: 291 },
    { name: 'Estonia', code: 'EE', phone: 372 },
    { name: 'Ethiopia', code: 'ET', phone: 251 },
    { name: 'Falkland Islands (Malvinas)', code: 'FK', phone: 500 },
    { name: 'Faroe Islands', code: 'FO', phone: 298 },
    { name: 'Fiji', code: 'FJ', phone: 679 },
    { name: 'Finland', code: 'FI', phone: 358 },
    { name: 'France', code: 'FR', phone: 33 },
    { name: 'French Guiana', code: 'GF', phone: 594 },
    { name: 'French Polynesia', code: 'PF', phone: 689 },
    { name: 'French Southern Territories', code: 'TF', phone: 262 },
    { name: 'Gabon', code: 'GA', phone: 241 },
    { name: 'Gambia', code: 'GM', phone: 220 },
    { name: 'Georgia', code: 'GE', phone: 995 },
    { name: 'Germany', code: 'DE', phone: 49 },
    { name: 'Ghana', code: 'GH', phone: 233 },
    { name: 'Gibraltar', code: 'GI', phone: 350 },
    { name: 'Greece', code: 'GR', phone: 30 },
    { name: 'Greenland', code: 'GL', phone: 299 },
    { name: 'Grenada', code: 'GD', phone: 1473 },
    { name: 'Guadeloupe', code: 'GP', phone: 590 },
    { name: 'Guam', code: 'GU', phone: 1671 },
    { name: 'Guatemala', code: 'GT', phone: 502 },
    { name: 'Guernsey', code: 'GG', phone: 44 },
    { name: 'Guinea', code: 'GN', phone: 224 },
    { name: 'Guinea-Bissau', code: 'GW', phone: 245 },
    { name: 'Guyana', code: 'GY', phone: 592 },
    { name: 'Haiti', code: 'HT', phone: 509 },
    { name: 'Heard Island and McDonald Islands', code: 'HM', phone: 0 },
    { name: 'Holy See (Vatican City State)', code: 'VA', phone: 39 },
    { name: 'Honduras', code: 'HN', phone: 504 },
    { name: 'Hong Kong', code: 'HK', phone: 852 },
    { name: 'Hungary', code: 'HU', phone: 36 },
    { name: 'Iceland', code: 'IS', phone: 354 },
    { name: 'India', code: 'IN', phone: 91 },
    { name: 'Indonesia', code: 'ID', phone: 62 },
    { name: 'Iran, Islamic Republic of', code: 'IR', phone: 98 },
    { name: 'Iraq', code: 'IQ', phone: 964 },
    { name: 'Ireland', code: 'IE', phone: 353 },
    { name: 'Isle of Man', code: 'IM', phone: 44 },
    { name: 'Israel', code: 'IL', phone: 972 },
    { name: 'Italy', code: 'IT', phone: 39 },
    { name: 'Jamaica', code: 'JM', phone: 1876 },
    { name: 'Japan', code: 'JP', phone: 81 },
    { name: 'Jersey', code: 'JE', phone: 44 },
    { name: 'Jordan', code: 'JO', phone: 962 },
    { name: 'Kazakhstan', code: 'KZ', phone: 7 },
    { name: 'Kenya', code: 'KE', phone: 254 },
    { name: 'Kiribati', code: 'KI', phone: 686 },
    { name: "Korea, Democratic People's Republic of", code: 'KP', phone: 850 },
    { name: 'Korea, Republic of', code: 'KR', phone: 82 },
    { name: 'Kosovo', code: 'XK', phone: 383 },
    { name: 'Kuwait', code: 'KW', phone: 965 },
    { name: 'Kyrgyzstan', code: 'KG', phone: 996 },
    { name: "Lao People's Democratic Republic", code: 'LA', phone: 856 },
    { name: 'Latvia', code: 'LV', phone: 371 },
    { name: 'Lebanon', code: 'LB', phone: 961 },
    { name: 'Lesotho', code: 'LS', phone: 266 },
    { name: 'Liberia', code: 'LR', phone: 231 },
    { name: 'Libyan Arab Jamahiriya', code: 'LY', phone: 218 },
    { name: 'Liechtenstein', code: 'LI', phone: 423 },
    { name: 'Lithuania', code: 'LT', phone: 370 },
    { name: 'Luxembourg', code: 'LU', phone: 352 },
    { name: 'Macao', code: 'MO', phone: 853 },
    {
        name: 'Macedonia, the Former Yugoslav Republic of',
        code: 'MK',
        phone: 389,
    },
    { name: 'Madagascar', code: 'MG', phone: 261 },
    { name: 'Malawi', code: 'MW', phone: 265 },
    { name: 'Malaysia', code: 'MY', phone: 60 },
    { name: 'Maldives', code: 'MV', phone: 960 },
    { name: 'Mali', code: 'ML', phone: 223 },
    { name: 'Malta', code: 'MT', phone: 356 },
    { name: 'Marshall Islands', code: 'MH', phone: 692 },
    { name: 'Martinique', code: 'MQ', phone: 596 },
    { name: 'Mauritania', code: 'MR', phone: 222 },
    { name: 'Mauritius', code: 'MU', phone: 230 },
    { name: 'Mayotte', code: 'YT', phone: 262 },
    { name: 'Mexico', code: 'MX', phone: 52 },
    { name: 'Micronesia, Federated States of', code: 'FM', phone: 691 },
    { name: 'Moldova, Republic of', code: 'MD', phone: 373 },
    { name: 'Monaco', code: 'MC', phone: 377 },
    { name: 'Mongolia', code: 'MN', phone: 976 },
    { name: 'Montenegro', code: 'ME', phone: 382 },
    { name: 'Montserrat', code: 'MS', phone: 1664 },
    { name: 'Morocco', code: 'MA', phone: 212 },
    { name: 'Mozambique', code: 'MZ', phone: 258 },
    { name: 'Myanmar', code: 'MM', phone: 95 },
    { name: 'Namibia', code: 'NA', phone: 264 },
    { name: 'Nauru', code: 'NR', phone: 674 },
    { name: 'Nepal', code: 'NP', phone: 977 },
    { name: 'Netherlands', code: 'NL', phone: 31 },
    { name: 'Netherlands Antilles', code: 'AN', phone: 599 },
    { name: 'New Caledonia', code: 'NC', phone: 687 },
    { name: 'New Zealand', code: 'NZ', phone: 64 },
    { name: 'Nicaragua', code: 'NI', phone: 505 },
    { name: 'Niger', code: 'NE', phone: 227 },
    { name: 'Nigeria', code: 'NG', phone: 234 },
    { name: 'Niue', code: 'NU', phone: 683 },
    { name: 'Norfolk Island', code: 'NF', phone: 672 },
    { name: 'Northern Mariana Islands', code: 'MP', phone: 1670 },
    { name: 'Norway', code: 'NO', phone: 47 },
    { name: 'Oman', code: 'OM', phone: 968 },
    { name: 'Pakistan', code: 'PK', phone: 92 },
    { name: 'Palau', code: 'PW', phone: 680 },
    { name: 'Palestinian Territory, Occupied', code: 'PS', phone: 970 },
    { name: 'Panama', code: 'PA', phone: 507 },
    { name: 'Papua New Guinea', code: 'PG', phone: 675 },
    { name: 'Paraguay', code: 'PY', phone: 595 },
    { name: 'Peru', code: 'PE', phone: 51 },
    { name: 'Philippines', code: 'PH', phone: 63 },
    { name: 'Pitcairn', code: 'PN', phone: 64 },
    { name: 'Poland', code: 'PL', phone: 48 },
    { name: 'Portugal', code: 'PT', phone: 351 },
    { name: 'Puerto Rico', code: 'PR', phone: 1787 },
    { name: 'Qatar', code: 'QA', phone: 974 },
    { name: 'Reunion', code: 'RE', phone: 262 },
    { name: 'Romania', code: 'RO', phone: 40 },
    { name: 'Russian Federation', code: 'RU', phone: 7 },
    { name: 'Rwanda', code: 'RW', phone: 250 },
    { name: 'Saint Barthelemy', code: 'BL', phone: 590 },
    { name: 'Saint Helena', code: 'SH', phone: 290 },
    { name: 'Saint Kitts and Nevis', code: 'KN', phone: 1869 },
    { name: 'Saint Lucia', code: 'LC', phone: 1758 },
    { name: 'Saint Martin', code: 'MF', phone: 590 },
    { name: 'Saint Pierre and Miquelon', code: 'PM', phone: 508 },
    { name: 'Saint Vincent and the Grenadines', code: 'VC', phone: 1784 },
    { name: 'Samoa', code: 'WS', phone: 684 },
    { name: 'San Marino', code: 'SM', phone: 378 },
    { name: 'Sao Tome and Principe', code: 'ST', phone: 239 },
    { name: 'Saudi Arabia', code: 'SA', phone: 966 },
    { name: 'Senegal', code: 'SN', phone: 221 },
    { name: 'Serbia', code: 'RS', phone: 381 },
    { name: 'Serbia and Montenegro', code: 'CS', phone: 381 },
    { name: 'Seychelles', code: 'SC', phone: 248 },
    { name: 'Sierra Leone', code: 'SL', phone: 232 },
    { name: 'Singapore', code: 'SG', phone: 65 },
    { name: 'St Martin', code: 'SX', phone: 721 },
    { name: 'Slovakia', code: 'SK', phone: 421 },
    { name: 'Slovenia', code: 'SI', phone: 386 },
    { name: 'Solomon Islands', code: 'SB', phone: 677 },
    { name: 'Somalia', code: 'SO', phone: 252 },
    { name: 'South Africa', code: 'ZA', phone: 27 },
    {
        name: 'South Georgia and the South Sandwich Islands',
        code: 'GS',
        phone: 500,
    },
    { name: 'South Sudan', code: 'SS', phone: 211 },
    { name: 'Spain', code: 'ES', phone: 34 },
    { name: 'Sri Lanka', code: 'LK', phone: 94 },
    { name: 'Sudan', code: 'SD', phone: 249 },
    { name: 'Suriname', code: 'SR', phone: 597 },
    { name: 'Svalbard and Jan Mayen', code: 'SJ', phone: 47 },
    { name: 'Swaziland', code: 'SZ', phone: 268 },
    { name: 'Sweden', code: 'SE', phone: 46 },
    { name: 'Switzerland', code: 'CH', phone: 41 },
    { name: 'Syrian Arab Republic', code: 'SY', phone: 963 },
    { name: 'Taiwan, Province of China', code: 'TW', phone: 886 },
    { name: 'Tajikistan', code: 'TJ', phone: 992 },
    { name: 'Tanzania, United Republic of', code: 'TZ', phone: 255 },
    { name: 'Thailand', code: 'TH', phone: 66 },
    { name: 'Timor-Leste', code: 'TL', phone: 670 },
    { name: 'Togo', code: 'TG', phone: 228 },
    { name: 'Tokelau', code: 'TK', phone: 690 },
    { name: 'Tonga', code: 'TO', phone: 676 },
    { name: 'Trinidad and Tobago', code: 'TT', phone: 1868 },
    { name: 'Tunisia', code: 'TN', phone: 216 },
    { name: 'Turkey', code: 'TR', phone: 90 },
    { name: 'Turkmenistan', code: 'TM', phone: 7370 },
    { name: 'Turks and Caicos Islands', code: 'TC', phone: 1649 },
    { name: 'Tuvalu', code: 'TV', phone: 688 },
    { name: 'Uganda', code: 'UG', phone: 256 },
    { name: 'Ukraine', code: 'UA', phone: 380 },
    { name: 'United Arab Emirates', code: 'AE', phone: 971 },
    { name: 'United Kingdom', code: 'GB', phone: 44 },
    { name: 'United States', code: 'US', phone: 1 },
    { name: 'United States Minor Outlying Islands', code: 'UM', phone: 1 },
    { name: 'Uruguay', code: 'UY', phone: 598 },
    { name: 'Uzbekistan', code: 'UZ', phone: 998 },
    { name: 'Vanuatu', code: 'VU', phone: 678 },
    { name: 'Venezuela', code: 'VE', phone: 58 },
    { name: 'Viet Nam', code: 'VN', phone: 84 },
    { name: 'Virgin Islands, British', code: 'VG', phone: 1284 },
    { name: 'Virgin Islands, U.s.', code: 'VI', phone: 1340 },
    { name: 'Wallis and Futuna', code: 'WF', phone: 681 },
    { name: 'Western Sahara', code: 'EH', phone: 212 },
    { name: 'Yemen', code: 'YE', phone: 967 },
    { name: 'Zambia', code: 'ZM', phone: 260 },
    { name: 'Zimbabwe', code: 'ZW', phone: 263 },
]

async function formFieldsPhoneNumberInput() {
    const wrapperDiv = $('[data-form-field-pro="number-input-with-country-code"]')

    const lightTheme = {
        lightThemeHoverTextColor: wrapperDiv.attr('data-light-theme-number-input-text-color'),
        lightThemeHoverBackgroundColor: wrapperDiv.attr('data-light-theme-number-input-background-color'),
    }

    const darkTheme = {
        darkThemeHoverTextColor: wrapperDiv.attr('data-dark-theme-number-input-text-color'),
        darkThemeHoverBackgroundColor: wrapperDiv.attr('data-dark-theme-number-input-background-color'),
    }

    const script = document.createElement('script')
    script.src = 'https://code.iconify.design/3/3.1.0/iconify.min.js'

    document.head.appendChild(script)

    const additionalStyle = `


.number-input-dropdown ol::-webkit-scrollbar {
    width: 0.6rem;
}

.number-input-dropdown ol::-webkit-scrollbar-thumb {
    width: 0.4rem;
    height: 3rem;
    background-color: #ccc;
    border-radius: .4rem;
}

.number-input-dropdown ol li {
    padding: 8px;
    display: flex;
    font-size: 14px;
    justify-content: space-between;
    cursor: pointer;
}

.number-input-dropdown ol li.hide {
    display: none;
}

.number-input-dropdown ol li:not(:last-child) {
    border-bottom: .1rem solid #eee;
}

.number-input-dropdown ol li:hover {
    background-color:${lightTheme.lightThemeHoverBackgroundColor || '#000000'};
    color:${lightTheme.lightThemeHoverTextColor || '#ffffff'};
}

.number-input-dropdown ol li .country-name {
    margin-left: .4rem;
}

  @media (prefers-color-scheme: dark){
          .number-input-dropdown ol li:hover {
                background-color: ${darkTheme.darkThemeHoverBackgroundColor || '#000000'};
                color: ${darkTheme.darkThemeHoverTextColor || '#ffffff'};
            }
        }

    `

    const style = document.createElement('style')
    style.innerHTML = additionalStyle

    document.getElementsByTagName('head')[0].appendChild(style)

    const selectBox = $('.number-input-dropdown'),
        downArrow = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`

    let searchBox = $('.number-input-search-field')
    let inputBox = $('.number-input-field')
    let selectedOption = $('.number-input-icon-wrapper')

    let options = null

    const flagIcon = document.createElement('span')
    flagIcon.setAttribute('class', 'iconify')
    flagIcon.setAttribute('data-icon', 'flag:gb-4x3')
    $('.number-input-icon-wrapper').prepend(flagIcon)

    $.each(countries, function (index, country) {
        const option = `<li class="option"><div><span class="iconify" data-icon="flag:${country.code.toLowerCase()}-4x3"></span><span class="country-name">${
            country.name
        }</span></div><span class='country-code'>+${country.phone}</span></li>`
        selectBox.find('ol').append(option)
        options = $('.option')
    })

    inputBox.val(parseInt('+' + countries[0].phone + ' '))

    function selectOption() {
        const icon = $(this).find('.iconify').clone(),
            phoneCode = $(this).find('.country-code').clone().text()

        selectedOption.html('').append(icon, downArrow)
        inputBox.val(parseInt(phoneCode + ' ')).focus()
        selectBox.hide()
        searchBox.val('')
        selectBox.find('.hide').removeClass('hide')
    }

    function searchCountry() {
        const searchQuery = searchBox.val().toLowerCase()

        options.each(function () {
            const isMatched = $(this).find('.country-name').text().toLowerCase().includes(searchQuery)
            $(this).toggleClass('hide', !isMatched)
        })
    }

    selectedOption.on('click', function (e) {
        inputBox = $(this).siblings().eq(0)
        selectedOption = $(this)
        searchBox = $(this).siblings().eq(1).find('.number-input-search-field')

        $('.number-input-dropdown').not($(this).siblings().eq(1)).hide()

        $(this).siblings().eq(1).toggle()
    })

    $(document).on('click', function (e) {
        if (!(e.target.getAttribute('class') === searchBox.attr('class'))) {
            if ($(e.target).closest(selectedOption).length === 0) {
                selectBox.hide()
                selectBox.attr('input-number-dropdown', 'hide')
            }
        }
    })

    options.on('click', selectOption)
    searchBox.on('input', searchCountry)

    await addThirdPartyScriptForPhoneNumberInput()
}

async function addThirdPartyScriptForPhoneNumberInput() {
    const addPhoneNumberInputScript = async () => {
        const res = await fetch(`https://cdn.jsdelivr.net/npm/intl-tel-input@21.2.7/build/js/intlTelInput.min.js`)

        if (res.ok) {
            const scriptString = await res.text()
            const colorPickerScript = document.createElement('script')
            colorPickerScript.innerHTML = scriptString

            document.getElementsByTagName('head')[0].appendChild(colorPickerScript)
        }
    }

    await addPhoneNumberInputScript()

    const addPhoneNumberInputCss = async () => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://cdn.jsdelivr.net/npm/intl-tel-input@21.2.7/build/css/intlTelInput.css'

        document.getElementsByTagName('head')[0].appendChild(link)
    }

    await addPhoneNumberInputCss()

    const input = document.querySelector('#phone')

    let iti = window.intlTelInput(input, {
        countrySearch: false,
        utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
    })

    $.get(
        'https://ipinfo.io',
        function (response) {
            let countryCode = response.country
            iti.setCountry(countryCode)
        },
        'jsonp',
    )

    input.addEventListener('change', formatPhoneNumber)
    input.addEventListener('keyup', formatPhoneNumber)

    function formatPhoneNumber() {
        input.value = iti.getNumber(window.intlTelInputUtils.numberFormat.INTERNATIONAL)
    }

    $('.itl').css('display', 'block')
}

/**
 * INITIALIZE COLOR PICKER INPUTS
 */
async function formFieldsColorPickerInput() {
    // https://cdn.jsdelivr.net/npm/spectrum-colorpicker2/dist/spectrum.min.js
    // add color picker library script

    const addColorPickerScript = async () => {
        const res = await fetch(`https://cdn.jsdelivr.net/npm/spectrum-colorpicker2/dist/spectrum.min.js`)

        if (res.ok) {
            const scriptString = await res.text()
            const colorPickerScript = document.createElement('script')
            colorPickerScript.innerHTML = scriptString

            document.getElementsByTagName('head')[0].appendChild(colorPickerScript)
        }
    }

    await addColorPickerScript()

    const customStyle = `  .sp-choose {
            background-color: #111111 !important;
        }
        .sp-dd {
            display: none;
        }
        .sp-replacer {
            width: 30px;
            height: 30px;
        }
`
    const addColorPickerCss = async () => {
        const res = await fetch(`https://cdn.jsdelivr.net/npm/spectrum-colorpicker2/dist/spectrum.min.css`)

        if (res.ok) {
            const cssString = await res.text()
            const style = document.createElement('style')
            style.innerHTML = `${cssString} ${customStyle}`

            document.getElementsByTagName('head')[0].appendChild(style)
        }
    }

    await addColorPickerCss()

    $('.color-input').spectrum({
        type: 'color',
        showPalette: false,
        showInput: true,
        allowEmpty: false,
    })
    let selectedInput

    $('.sp-replacer').on('click', function (e) {
        selectedInput = $(this)
    })

    $('.sp-choose').on('click', function () {
        const color = selectedInput.find('.sp-preview-inner').css('background-color')

        selectedInput.siblings().attr('value', color)
    })
}

/**
 * INITIALIZE FILE UPLOADER INPUTS
 */
async function formFieldsFileUploadInput() {
    const customStyle = `
  .dropzone{
  background-color:transparent !important;
  }
  .dropzone .dz-message{
          margin: 0;
      }
      .dz-message-content{
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
      }
      .dz-message-link{
          text-decoration: underline;
      }
      
         .dropzone .dz-preview.dz-image-preview{
          background-color: transparent;
      }

      .dropzone .dz-preview .dz-remove{
          color: #000000;
          text-decoration: none;
      }
      
  `

    const addDropzoneCss = async () => {
        const res = await fetch(`https://unpkg.com/dropzone@5.9.3/dist/min/dropzone.min.css`)

        if (res.ok) {
            const cssString = await res.text()
            const style = document.createElement('style')
            style.innerHTML = `${cssString} ${customStyle}`

            document.getElementsByTagName('head')[0].appendChild(style)
        }
    }

    await addDropzoneCss()

    const addDropzoneScript = async () => {
        const res = await fetch(`https://unpkg.com/dropzone@5/dist/min/dropzone.min.js`)
        if (res.ok) {
            const dzScript = await res.text()
            const script = document.createElement('script')
            script.innerHTML = dzScript

            document.getElementsByTagName('head')[0].appendChild(script)
        }
    }

    await addDropzoneScript()

    Dropzone.autoDiscover = false

    const dropzoneList = $('.dropzone')

    const dropzoneIds = Object.values(dropzoneList).map((value) => value.id)

    dropzoneIds.map(async function (i) {
        if (i !== undefined) {
            const element = document.getElementById(i)
            const $element = $(`#${i}`)

            const attrs = element.getAttributeNames().reduce((acc, name) => {
                return {
                    ...acc,
                    [name.replace(/-/g, '_')]: element.getAttribute(name),
                }
            }, {})

            const dropzone = new Dropzone(`#${i}`, {
                url: '#',
                method: 'post',
                paramName: 'file',
                autoProcessQueue: true,
                addRemoveLinks: true,
                maxFiles: parseInt(attrs.data_max_files),
                maxFilesize: parseInt(attrs.data_max_file_size),
                acceptedFiles: attrs.data_accepted_files,
            })

            dropzone.on('addedfile', function (file) {})
            dropzone.on('success', function (file) {
                const borderRadius = $element.css('border-radius')
                $element.find('.dz-image').css('border-radius', borderRadius || 0)
            })
            dropzone.on('removedfile', function (file) {})

            await $('.dz-message').each(function () {
                $(this).html(
                    `<p class="dz-message-content"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M518.3 459a8 8 0 0 0-12.6 0l-112 141.7a7.98 7.98 0 0 0 6.3 12.9h73.9V856c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V613.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 459z"></path><path d="M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7-23.5-24.2-36-56.8-34.9-90.6.9-26.4 9.9-51.2 26.2-72.1 16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4a245.6 245.6 0 0 1 52.4-49.9c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10C846.1 454.5 884 503.8 884 560c0 33.1-12.9 64.3-36.3 87.7a123.07 123.07 0 0 1-87.6 36.3H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h40.1C870.5 760 960 670.5 960 560c0-92.7-63.1-170.7-148.6-193.3z"></path></svg>  Drag and Drop or <span class="dz-message-link">Browse file</span> </p>`,
                )
            })

            $element.find('.dz-message-content svg, .dz-message-link').css('color', attrs.data_default_color)
        }
    })
}

/**
 * INITIALIZE NET PROMOTER INPUTS
 */
async function formFieldsNetPromoterScoreInput() {
    const netPromoterElement = $('[data-field-name="net-promoter-score"]')

    let lightTheme = {}
    let darkTheme = {}

    function getAttributes($element) {
        let attributes = {}
        $.each($element[0].attributes, function (index, attr) {
            attributes[attr.name.replace(/-/g, '_')] = attr.value
        })
        return attributes
    }

    netPromoterElement.each(function () {
        const element = $(this)
        const elementAttributes = getAttributes(element)

        lightTheme = {
            lightThemeHoverTextColor: element.attr('data-light-theme-score-text-color'),
            lightThemeHoverBackgroundColor: element.attr('data-light-theme-score-background-color'),
        }

        darkTheme = {
            darkThemeHoverTextColor: element.attr('data-dark-theme-score-text-color'),
            darkThemeHoverBackgroundColor: element.attr('data-dark-theme-score-background-color'),
        }

        const inputElement = element.find('[data-input="net-promoter-score"]')
        const extraFeedbackCollection = element.find('[data-field="extra-feedback-collection"]')

        if (!elementAttributes.data_extra_feedback_collection.includes('always')) {
            extraFeedbackCollection.hide()
        }

        $(this)
            .find('[data-name="net-promoter-score-value"]')
            .on('click', function () {
                const value = $(this).text()
                inputElement.val(value)

                if (value === inputElement.val()) {
                    element.find('[data-name="net-promoter-score-value"]').removeClass('net-promoter-active')
                    $(this).addClass('net-promoter-active')

                    const extraFeedback = elementAttributes.data_extra_feedback_collection || ''
                    if (!extraFeedback.includes('always')) {
                        if (!extraFeedback.includes('never') || !extraFeedback.includes('always')) {
                            if (parseInt(value) < parseInt(extraFeedback)) {
                                extraFeedbackCollection.show()
                            } else {
                                extraFeedbackCollection.hide()
                            }
                        } else {
                            extraFeedbackCollection.show()
                        }
                    }
                }
            })
    })

    const customStyle = `
          .net-promoter-active {
            background-color: ${lightTheme.lightThemeHoverBackgroundColor};
            color: ${lightTheme.lightThemeHoverTextColor};
        }
        
        @media (prefers-color-scheme: dark){
              .net-promoter-active {
                background-color: ${darkTheme.darkThemeHoverBackgroundColor};
                color: ${darkTheme.darkThemeHoverTextColor};
            }
        }
    
    `
    const style = document.createElement('style')
    style.innerHTML = customStyle

    document.getElementsByTagName('head')[0].appendChild(style)
}

/**
 * INITIALIZE LIKERT SCALE INPUTS
 */
async function formFieldsLikertScaleInput() {
    const customStyle = `
  [data-field="likert-scale-field-radio"] {
   opacity: 0;
   visibility: hidden;
   height: 0 !important;
   margin: 0;
   width: 0 !important;
}

[data-field="likert-scale-field-radio"]:checked,
[data-field="likert-scale-field-radio"]:not(:checked) + label{
  width: 20px;
   height: 20px;
   display: inline-block;
   border: 1px solid #000;
   border-radius: 50%;
   margin-bottom:0 !important;
}

[data-field="likert-scale-field-radio"]:checked + label{
   width: 20px;
   height: 20px;
   display: inline-block;
   border: 1px solid #000;
   border-radius: 50%;
   background-image: url('data:image/svg+xml,<svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.3333 1L4.54167 8.79167L1 5.25" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
   background-repeat:no-repeat;
   background-position: center;
   margin-bottom:0 !important;
}

`
    const style = document.createElement('style')
    style.innerHTML = customStyle

    document.getElementsByTagName('head')[0].appendChild(style)
}

// Validate field
function validateFieldData(field, pattern, errorMessage) {
    const formFieldsWrapper = getParentFormFieldsWrapperDiv(field)
    const validationMessageNode = formFieldsWrapper?.querySelector('.form-fields-data-validation-message')

    field.addEventListener('input', (e) => {
        validationMessageNode.innerHTML = pattern.test(e.target.value) ? '' : errorMessage
    })
}

/**
 * ----
 * PREVENT DEFAULT FORM SUBMISSION
 * ----
 */
function preventWebflowDefaultFormSubmission() {
    const forms = $('form')

    for (let form of forms) {
        $(form).submit(() => {
            return false
        })
    }
}

/**
 * Custom form submisson handler
 */
function addCustomFormSubmissionLogic() {
    const forms = document.querySelectorAll('form')

    for (let form of forms) {
        form.setAttribute('novalidate', true)
        addValidationMessageNodes(form)

        form.addEventListener('submit', (e) => {
            e.preventDefault()

            if (validateData(form)) handleFormSubmit(form)
        })
    }
}

function addDefaultStylesForValidationMessageNodes() {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(`
    .form-fields-data-validation-message {
      color: #FF2626;
      font-size: 11px;
    }
  `)
    const sheets = document.adoptedStyleSheets || []
    document.adoptedStyleSheets = [...sheets, sheet]
}

/**
 *
 * @param {HTMLFormElement} form
 */
function addValidationMessageNodes(form) {
    addDefaultStylesForValidationMessageNodes()

    const formFieldsInputWrappers = form.querySelectorAll('.form-fields-wrapper')

    for (let wrapperDiv of formFieldsInputWrappers) {
        const node = document.createElement('span')
        node.innerText = ''
        node.classList.add('form-fields-data-validation-message')

        wrapperDiv.appendChild(node)
    }
}

/**
 *
 * @param {HTMLElement} element
 */
function getParentFormFieldsWrapperDiv(element) {
    const parent = element.parentElement
    if (!parent) return null

    if (parent.classList.contains('form-fields-wrapper')) return parent
    else return getParentFormFieldsWrapperDiv(parent)
}

/**
 *
 * @param {HTMLFormElement} form
 */
function validateData(form) {
    const requiredFormFieldsInputFields = form.querySelectorAll(`.form-fields-wrapper [required]`)

    let allChecksPassed = validateAllFields()

    for (let input of requiredFormFieldsInputFields) {
        const formFieldsWrapper = getParentFormFieldsWrapperDiv(input)
        const validationMessageNode = formFieldsWrapper?.querySelector('.form-fields-data-validation-message')

        if (!input.value) {
            allChecksPassed = false
            validationMessageNode.innerText = 'This field is required'
        } else if (!allChecksPassed) {
            validateAllFields()
        } else validationMessageNode.innerText = ''
    }

    return allChecksPassed
}

/**
 *
 * @param {HTMLFormElement} form
 */
async function handleFormSubmit(form) {
    const BASE_URL = 'https://flowapps-data-client-individualformdatabase.up.railway.app'
    const submitButton = document.querySelector(`input[type=submit]`)
    const submitButtonOriginalLabel = submitButton.value
    const submitButtonLoadingLabel = submitButton.getAttribute('data-wait')

    const formElementId = form.getAttribute('data-wf-element-id')

    submitButton.value = submitButtonLoadingLabel

    const metaData = getFormMetaData(form)
    const webflowInputs = getWebflowInputFieldsData(form)
    const formFieldsInputs = getFormFieldsInputData(form)

    const payload = new URLSearchParams({
        ...metaData,
        ...webflowInputs,
        ...formFieldsInputs,
    })

    const siteId = document.querySelector('html').getAttribute('data-wf-site')
    const formSubmissionPayload = new URLSearchParams({
        ...webflowInputs,
        ...formFieldsInputs,
    })

    const parsedFormData = {}
    formSubmissionPayload.forEach((value, key) => {
        const formattedKey = key.replace(/^fields\[(.*)\]$/, '$1')
        parsedFormData[formattedKey] = value
    })

    try {
        const formSubmissionResponse = await fetch(`${BASE_URL}/api/sites/handleFormSubmission`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                siteId: siteId,
                formId: formElementId,
                formData: parsedFormData,
                webflowPayload: payload.toString(),
            }),
        })

        submitButton.value = submitButtonOriginalLabel
        const formId = form.id

        const redirectUrl = form.getAttribute('redirect')
        if (redirectUrl) {
            window.location.href = redirectUrl
        } else if (formSubmissionResponse.ok) {
            document.querySelector(`#${formId} ~ .w-form-done`).style.display = 'block'
            form.style.display = 'none'
        } else {
            document.querySelector(`#${formId} ~ .w-form-fail`).style.display = 'block'
            form.style.display = 'none'
        }
    } catch (error) {
        console.error('Error during form submission:', error)
        submitButton.value = submitButtonOriginalLabel
    }
}

/**
 *
 * @param {HTMLFormElement} form
 */
function getFormMetaData(form) {
    return {
        name: form.getAttribute('data-name'),
        pageId: form.getAttribute('data-wf-page-id'),
        elementId: form.getAttribute('data-wf-element-id'),
        source: window.location.href,

        test: false,
        dolphin: false,
    }
}

/**
 *
 * @param {HTMLFormElement} form
 */
function getWebflowInputFieldsData(form) {
    const webflowInputElements = form.querySelectorAll(`input.w-input`)

    const data = {}
    for (let input of webflowInputElements) {
        const name = input.getAttribute('data-name')
        const value = input.value

        data[`fields[${name}]`] = value
    }

    return data
}

/**
 *
 * @param {HTMLFormElement} form
 */
function getFormFieldsInputData(form) {
    const webflowInputElements = form.querySelectorAll(`[form-fields-data-input]`)

    const data = {}
    for (let input of webflowInputElements) {
        const name = input.getAttribute('name')
        const value = input.value

        data[`fields[${name}]`] = value
    }

    return data
}

// Validate field
function validateFieldData(field, value, pattern, errorMessage) {
    const formFieldsWrapper = getParentFormFieldsWrapperDiv(field)
    const validationMessageNode = formFieldsWrapper?.querySelector('.form-fields-data-validation-message')

    if (!pattern.test(value) && value.length > 0) {
        validationMessageNode.innerHTML = errorMessage
        return false
    }

    validationMessageNode.innerHTML = ''
    return true
}

// URL validation

const urlFields = document.querySelectorAll('.form-fields-wrapper input[type="url"]')
urlFields.forEach((field) => {
    field.addEventListener('input', (e) => {
        validateFieldData(field, e.target.value, URL_PATTERN_REGEX, 'Enter a valid URL')
    })
})

// Email validation
const emailFields = document.querySelectorAll('.form-fields-wrapper input[type="email"]')
emailFields.forEach((field) => {
    const message = field ? field.getAttribute('data-invalid-error-msg') : ''
    field.addEventListener('input', (e) => {
        validateFieldData(field, e.target.value, EMAIL_PATTERN_REGEX, message)
    })
})

function validateAllFields() {
    const urlFields = document.querySelectorAll('.form-fields-wrapper input[type="url"]')
    const emailFields = document.querySelectorAll('.form-fields-wrapper input[type="email"]')
    const phoneNumberFields = document.querySelectorAll('.form-fields-wrapper input[type="number"]')

    for (let f of urlFields) {
        const valid = validateFieldData(f, f.value, URL_PATTERN_REGEX, 'Please enter a valid url')
        if (!valid) return false
    }

    for (let f of emailFields) {
        const message = f.getAttribute('data-invalid-error-msg') || 'Please enter a valid email'
        const valid = validateFieldData(f, f.value, EMAIL_PATTERN_REGEX, message)
        if (!valid) return false
    }

    for (let f of phoneNumberFields) {
        if (f.required && f.value.length < 6) {
            const formFieldsWrapper = getParentFormFieldsWrapperDiv(f)
            const validationMessageNode = formFieldsWrapper?.querySelector('.form-fields-data-validation-message')
            validationMessageNode.innerText = 'Invalid phone number'
            return false
        }
    }

    return true
}

/**
 * ----
 * CONDITIONAL LOGIC - START
 * ----
 */

/** */
const FORM_STATE = {}
const conditionalLogicFields = document.querySelectorAll('[conditional-logic]')

function initializeConditionalLogic() {
    conditionalLogicFields.forEach((field) => toggleDisplay(field))

    observeInputChangesAndFireConditionalLogic()
}

/**
 *
 * @param {HTMLElement} element
 * @param {boolean} show
 */
function toggleDisplay(element, show = false) {
    if (show) element.style.display = 'initial'
    else element.style.display = 'none'
}

async function observeInputChangesAndFireConditionalLogic() {
    syncFormState()

    conditionalLogicFields.forEach((field) => reactToCurrentFormStateBasedOnConditionalLogic(field))

    await sleep(450)
    return observeInputChangesAndFireConditionalLogic()
}

function syncFormState() {
    const allInputFields = [...document.querySelectorAll(`input.w-input`), ...document.querySelectorAll('[form-fields-data-input]')]

    allInputFields.forEach((input) => {
        const name = input.getAttribute('name')
        const value = input.value

        FORM_STATE[name] = value
    })
}

/**
 *
 * @param {HTMLElement} element
 */
function reactToCurrentFormStateBasedOnConditionalLogic(element) {
    /** @type {TRuleset[][]} */
    const ruleGroups = JSON.parse(element.getAttribute('conditional-logic'))

    const result = ruleGroups.some((ruleGroup) => ruleGroup.every((rule) => resolveConditionalLogicRuleset(rule)))

    toggleDisplay(element, result)
}

/**
 * @typedef {object} TRuleset
 *
 * @property {string} inputName
 * @property {"HAS_ANY_VALUE" | "HAS_NO_VALUE" | "IS_EQUAL" | "NOT_EQUAL" | "CONTAINS" | "IS_GREATER_THAN" | "IS_LESS_THAN"} compareLogic
 * @property {string} compareValue
 */

/**
 *
 * @param {TRuleset} ruleset
 * @returns {boolean}
 */
function resolveConditionalLogicRuleset(ruleset) {
    const { inputName, compareLogic, compareValue } = ruleset
    const inputValue = FORM_STATE[inputName] || ''

    switch (compareLogic) {
        case 'HAS_ANY_VALUE':
            return inputValue.length > 0
        case 'HAS_NO_VALUE':
            return inputValue.length === 0
        case 'CONTAINS':
            return inputValue.toLowerCase().includes(compareValue.toLowerCase())
        case 'IS_EQUAL':
            return inputValue == compareValue
        case 'NOT_EQUAL':
            return inputValue != compareValue
        case 'IS_GREATER_THAN':
            return inputValue > compareValue
        case 'IS_LESS_THAN':
            return inputValue < compareValue
        default:
            return false
    }
}
/**
 * ----
 * CONDITIONAL LOGIC - END
 * ----
 */

async function initializeFormFieldsPro() {
    const siteId = document.querySelector('html').getAttribute('data-wf-site')
    const url = window.location.href
    if (isUsingWebflowDomain(url) || (await hasValidLicenseKey(siteId))) {
        makeTheFormInteractive()
    }
}

function isUsingWebflowDomain(url) {
    return /.*\.webflow\..*/gim.test(url)
}

async function hasValidLicenseKey(siteId) {
    const res = await fetch(`https://cache-service-staging.up.railway.app/api/license?siteId=${siteId}&appName=form-fields-pro`)
    if (res.ok) {
        data = await res.json()

        return data.active
    }
    return false
}

async function makeTheFormInteractive() {
    formFieldsDateInput()
    formFieldsUserIp()
    formFieldsNumberSlider()
    formFieldsSelect()
    formFieldsPhoneNumberInput()
    formFieldsColorPickerInput()
    formFieldsFileUploadInput()
    formFieldsNetPromoterScoreInput()
    formFieldsLikertScaleInput()

    preventWebflowDefaultFormSubmission()
    addCustomFormSubmissionLogic()
    initializeConditionalLogic()
}

initializeFormFieldsPro()
