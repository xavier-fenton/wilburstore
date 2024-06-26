const t = 'liquid-ajax-cart',
  e = 'data-ajax-cart',
  n = 'ajax-cart',
  o = 'js-ajax-cart',
  i = `${t}:init`,
  r = 'add',
  a = 'change',
  s = 'update',
  u = 'clear',
  c = 'get',
  l = `${t}:queue-start`,
  d = `${t}:queue-start-internal`,
  h = `${t}:queue-empty-internal`,
  f = `${t}:queue-end-internal`,
  p = `${t}:queue-end`,
  m = `${t}:request-start-internal`,
  y = `${t}:request-start`,
  v = `${t}:request-end-internal`,
  b = `${t}:request-end`,
  q = []
let g = !1
function $(t) {
  var e
  ;(null === (e = t.options) || void 0 === e ? void 0 : e.important) &&
  0 !== q.length
    ? q[0].push(t)
    : 1 === q.push([t]) && (A(!0), w())
}
function w() {
  if (1 === q.length && 0 === q[0].length) {
    const t = new CustomEvent(h)
    document.dispatchEvent(t)
  }
  if (0 === q.length) return void A(!1)
  if (0 === q[0].length) return q.shift(), void w()
  const { requestType: t, body: e, options: n } = q[0][0]
  !(function (t, e, n, o) {
    const i = k(t)
    let a
    t !== c && (a = e || {})
    const s = t === c ? 'GET' : 'POST',
      u = n.info || {},
      l = { requestType: t, endpoint: i, requestBody: a, info: u },
      d = [],
      h = new CustomEvent(m, {
        detail: {
          requestState: {
            requestType: t,
            endpoint: i,
            info: u,
            requestBody: a,
          },
        },
      })
    document.dispatchEvent(h)
    const f = new CustomEvent(y, {
      detail: {
        requestState: { requestType: t, endpoint: i, info: u, requestBody: a },
      },
    })
    if ((document.dispatchEvent(f), u.cancel))
      return (l.responseData = null), void E(n, o, l)
    if (void 0 !== a) {
      let e
      if (
        (a instanceof FormData || a instanceof URLSearchParams
          ? a.has('sections') && (e = a.get('sections').toString())
          : (e = a.sections),
        'string' == typeof e || e instanceof String || Array.isArray(e))
      ) {
        const n = []
        if (
          (Array.isArray(e) ? n.push(...e) : n.push(...e.split(',')),
          r === t && d.push(...n.slice(0, 5)),
          n.length > 5)
        ) {
          d.push(...n.slice(5))
          const t = n.slice(0, 5).join(',')
          a instanceof FormData || a instanceof URLSearchParams
            ? a.set('sections', t)
            : (a.sections = t)
        }
      } else
        null != e &&
          console.error(
            `Liquid Ajax Cart: "sections" parameter in a Cart Ajax API request must be a string or an array. Now it is ${e}`
          )
    }
    const p = { method: s }
    t !== c &&
      (a instanceof FormData || a instanceof URLSearchParams
        ? ((p.body = a), (p.headers = { 'x-requested-with': 'XMLHttpRequest' }))
        : ((p.body = JSON.stringify(a)),
          (p.headers = { 'Content-Type': 'application/json' }))),
      fetch(i, p)
        .then((t) =>
          t.json().then((e) => ({ ok: t.ok, status: t.status, body: e }))
        )
        .then(
          (t) => (
            (l.responseData = t),
            !l.responseData.ok || (l.responseData.body.token && 0 === d.length)
              ? l
              : L(d).then((t) => ((l.extraResponseData = t), l))
          )
        )
        .catch((t) => {
          console.error(
            'Liquid Ajax Cart: Error while performing cart Ajax request'
          ),
            console.error(t),
            (l.responseData = null),
            (l.fetchError = t)
        })
        .finally(() => {
          E(n, o, l)
        })
  })(t, e, n, () => {
    q[0].shift(), w()
  })
}
function A(t) {
  g = t
  const e = new CustomEvent(g ? d : f)
  document.dispatchEvent(e)
  const n = new CustomEvent(g ? l : p)
  document.dispatchEvent(n)
}
function E(t, e, n) {
  if ('firstCallback' in t)
    try {
      t.firstCallback(n)
    } catch (t) {
      console.error(
        'Liquid Ajax Cart: Error in request "firstCallback" function'
      ),
        console.error(t)
    }
  const o = { requestState: n },
    i = new CustomEvent(v, { detail: o })
  document.dispatchEvent(i)
  const r = new CustomEvent(b, { detail: o })
  if ((document.dispatchEvent(r), 'lastCallback' in t))
    try {
      t.lastCallback(n)
    } catch (t) {
      console.error(
        'Liquid Ajax Cart: Error in request "lastCallback" function'
      ),
        console.error(t)
    }
  e()
}
function L(t = []) {
  const e = {}
  return (
    t.length > 0 && (e.sections = t.slice(0, 5).join(',')),
    fetch(k(s), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(e),
    }).then((e) =>
      e.json().then((n) => {
        const o = { ok: e.ok, status: e.status, body: n }
        return t.length < 6
          ? o
          : L(t.slice(5)).then((t) => {
              var e
              return (
                t.ok &&
                  (null === (e = t.body) || void 0 === e
                    ? void 0
                    : e.sections) &&
                  'object' == typeof t.body.sections &&
                  ('sections' in o.body || (o.body.sections = {}),
                  (o.body.sections = Object.assign(
                    Object.assign({}, o.body.sections),
                    t.body.sections
                  ))),
                o
              )
            })
      })
    )
  )
}
function S(t = {}) {
  $({ requestType: c, body: void 0, options: t })
}
function j(t = {}, e = {}) {
  $({ requestType: r, body: t, options: e })
}
function C(t = {}, e = {}) {
  $({ requestType: a, body: t, options: e })
}
function x(t = {}, e = {}) {
  $({ requestType: s, body: t, options: e })
}
function T(t = {}, e = {}) {
  $({ requestType: u, body: t, options: e })
}
function k(t) {
  var e, n, o, i, l, d, h, f, p, m
  switch (t) {
    case r:
      return `${
        (null ===
          (n =
            null === (e = window.Shopify) || void 0 === e
              ? void 0
              : e.routes) || void 0 === n
          ? void 0
          : n.root) || '/'
      }cart/add.js`
    case a:
      return `${
        (null ===
          (i =
            null === (o = window.Shopify) || void 0 === o
              ? void 0
              : o.routes) || void 0 === i
          ? void 0
          : i.root) || '/'
      }cart/change.js`
    case c:
      return `${
        (null ===
          (d =
            null === (l = window.Shopify) || void 0 === l
              ? void 0
              : l.routes) || void 0 === d
          ? void 0
          : d.root) || '/'
      }cart.js`
    case u:
      return `${
        (null ===
          (f =
            null === (h = window.Shopify) || void 0 === h
              ? void 0
              : h.routes) || void 0 === f
          ? void 0
          : f.root) || '/'
      }cart/clear.js`
    case s:
      return `${
        (null ===
          (m =
            null === (p = window.Shopify) || void 0 === p
              ? void 0
              : p.routes) || void 0 === m
          ? void 0
          : m.root) || '/'
      }cart/update.js`
    default:
      return
  }
}
function D() {
  return g
}
const _ = `${e}-initial-state`
let N,
  O = null
function B() {
  return { cart: O, previousCart: N }
}
const M = `${e}-bind`
function R() {
  B().cart &&
    document.querySelectorAll(`[${M}]`).forEach((t) => {
      const e = t.getAttribute(M)
      t.textContent = (function (t) {
        const { binderFormatters: e } = Z,
          [n, ...o] = t.split('|')
        let i = F(n, B().cart)
        return (
          o.forEach((t) => {
            const n = t.trim()
            '' !== n &&
              ('object' == typeof e && n in e
                ? (i = e[n](i))
                : n in H
                ? (i = H[n](i))
                : console.warn(
                    `Liquid Ajax Cart: the "${n}" formatter is not found`
                  ))
          }),
          'string' == typeof i ||
          i instanceof String ||
          'number' == typeof i ||
          i instanceof Number
            ? i.toString()
            : (console.error(
                `Liquid Ajax Cart: the calculated value for the ${M}="${t}" element must be string or number. But the value is`,
                i
              ),
              '')
        )
      })(e)
    })
}
function F(t, e) {
  const n = t.split('.'),
    o = n.shift().trim()
  return '' !== o && o in e && n.length > 0 ? F(n.join('.'), e[o]) : e[o]
}
const H = {
  money_with_currency: (t) => {
    var e
    const n = B()
    if ('number' != typeof t && !(t instanceof Number))
      return (
        console.error(
          "Liquid Ajax Cart: the 'money_with_currency' formatter is not applied because the value is not a number. The value is ",
          t
        ),
        t
      )
    const o = t / 100
    return 'Intl' in window &&
      (null === (e = window.Shopify) || void 0 === e ? void 0 : e.locale)
      ? Intl.NumberFormat(window.Shopify.locale, {
          style: 'currency',
          currency: n.cart.currency,
        }).format(o)
      : `${o.toFixed(2)} ${n.cart.currency}`
  },
}
let U,
  P = !1
function I() {
  const { mutations: t } = Z
  Array.isArray(t) ||
    console.error(
      'Liquid Ajax Cart: the "mutations" settings parameter must be an array'
    ),
    0 !== t.length && ((P = !1), (U = -1), J())
}
function J() {
  const { mutations: t } = Z
  if ((U++, U >= t.length)) return
  let e = []
  try {
    const n = t[U]()
    n && (e = (null == n ? void 0 : n.requests) || [])
  } catch (t) {
    console.error(
      `Liquid Ajax Cart: Error in the "mutation" function with index ${U}`
    ),
      console.error(t)
  }
  Array.isArray(e) ? V(e) : J()
}
function V(t) {
  const e = t.shift()
  if (e) {
    if (e.type && [r, a, s, u, c].includes(e.type))
      return void $({
        requestType: e.type,
        body: e.body,
        options: {
          info: { initiator: 'mutation' },
          important: !0,
          lastCallback: (e) => {
            V(t)
          },
        },
      })
    console.error(
      `Liquid Ajax Cart: wrong request type in the mutation with index ${U}`
    )
  }
  t.length > 0 ? V(t) : J()
}
const Z = {
    binderFormatters: {},
    requestErrorText:
      'There was an error while updating your cart. Please try again.',
    updateOnWindowFocus: !0,
    quantityTagAllowZero: !1,
    quantityTagDebounce: 300,
    mutations: [],
  },
  W = `${e}-section`,
  z = `${e}-static-element`,
  G = `${e}-section-scroll`,
  K = 'shopify-section-',
  X = `${n}-product-form`,
  Q = 'processing'
class Y extends HTMLElement {
  connectedCallback() {
    var t, e
    const n = this,
      o = this.querySelectorAll('form')
    if (1 !== o.length)
      return void console.error(
        `Liquid Ajax Cart: "${X}" element must have one "form" element as a child, ${o.length} found`,
        n
      )
    const i = o[0]
    new URL(i.action).pathname ===
    `${
      (null ===
        (e =
          null === (t = window.Shopify) || void 0 === t ? void 0 : t.routes) ||
      void 0 === e
        ? void 0
        : e.root) || '/'
    }cart/add`
      ? i.addEventListener('submit', (t) => {
          if (!n.hasAttribute(Q)) {
            const t = new FormData(i)
            n.setAttribute(Q, ''),
              j(t, {
                lastCallback: () => {
                  n.removeAttribute(Q)
                },
                info: { initiator: n },
              })
          }
          t.preventDefault()
        })
      : console.error(
          `Liquid Ajax Cart: "${X}" element's form "action" attribute value isn't a product form action URL`,
          i,
          n
        )
  }
}
var tt, et, nt, ot, it, rt, at, st
const ut = `${
    (null ===
      (et =
        null === (tt = window.Shopify) || void 0 === tt ? void 0 : tt.routes) ||
    void 0 === et
      ? void 0
      : et.root) || '/'
  }cart/change`,
  ct = `${
    (null ===
      (ot =
        null === (nt = window.Shopify) || void 0 === nt ? void 0 : nt.routes) ||
    void 0 === ot
      ? void 0
      : ot.root) || '/'
  }cart/add`,
  lt = `${
    (null ===
      (rt =
        null === (it = window.Shopify) || void 0 === it ? void 0 : it.routes) ||
    void 0 === rt
      ? void 0
      : rt.root) || '/'
  }cart/clear`,
  dt = `${
    (null ===
      (st =
        null === (at = window.Shopify) || void 0 === at ? void 0 : at.routes) ||
    void 0 === st
      ? void 0
      : st.root) || '/'
  }cart/update`,
  ht = `${e}-request-button`
function ft(t, e) {
  let n
  const o = [ut, ct, lt, dt]
  if (!t.hasAttribute(ht)) return
  const i = t.getAttribute(ht)
  if (i) {
    let t
    try {
      if (((t = new URL(i, window.location.origin)), !o.includes(t.pathname)))
        throw `URL should be one of the following: ${ut}, ${ct}, ${dt}, ${lt}`
      n = t
    } catch (t) {
      console.error(
        `Liquid Ajax Cart: ${ht} contains an invalid URL as a parameter.`,
        t
      )
    }
  } else if (t instanceof HTMLAnchorElement && t.hasAttribute('href')) {
    const e = new URL(t.href)
    o.includes(e.pathname)
      ? (n = e)
      : t.hasAttribute(ht) &&
        console.error(
          `Liquid Ajax Cart: a link with the ${ht} contains an invalid href URL.`,
          `URL should be one of the following: ${ut}, ${ct}, ${dt}, ${lt}`
        )
  }
  if (void 0 === n)
    return void console.error(
      `Liquid Ajax Cart: a ${ht} element doesn't have a valid URL`
    )
  if ((e && e.preventDefault(), D())) return
  const r = new FormData()
  switch (
    (n.searchParams.forEach((t, e) => {
      r.append(e, t)
    }),
    n.pathname)
  ) {
    case ct:
      j(r, { info: { initiator: t } })
      break
    case ut:
      C(r, { info: { initiator: t } })
      break
    case dt:
      x(r, { info: { initiator: t } })
      break
    case lt:
      T({}, { info: { initiator: t } })
  }
}
function pt(t, e) {
  let n, o
  return (
    t.length > 3
      ? ((n = e.cart.items.find((e) => e.key === t)), (o = 'id'))
      : ((n = e.cart.items[Number(t) - 1]), (o = 'line')),
    void 0 === n &&
      ((n = null),
      console.error(`Liquid Ajax Cart: line item with ${o}="${t}" not found`)),
    [n, o]
  )
}
const mt = `${e}-quantity-input`
function yt(t) {
  return (
    !!t.hasAttribute(mt) &&
    ((t instanceof HTMLInputElement &&
      ('text' === t.type || 'number' === t.type)) ||
      (console.error(
        `Liquid Ajax Cart: the ${mt} attribute supports "input" elements only with the "text" and the "number" types`
      ),
      !1))
  )
}
function vt() {
  document.querySelectorAll(`input[${mt}]`).forEach((t) => {
    if (!yt(t)) return
    if (D()) return void (t.disabled = !0)
    const e = B(),
      n = t.getAttribute(mt).trim(),
      [o] = pt(n, e)
    o ? (t.value = o.quantity.toString()) : null === o && (t.value = '0'),
      (t.disabled = !1)
  })
}
function bt(t, e) {
  if (!yt(t)) return
  if ((e && e.preventDefault(), D())) return
  let n = Number(t.value.trim())
  const o = t.getAttribute(mt).trim()
  if (isNaN(n))
    return void console.error(
      `Liquid Ajax Cart: input value of a ${mt} must be an Integer number`
    )
  if ((n < 1 && (n = 0), !o))
    return void console.error(
      `Liquid Ajax Cart: attribute value of a ${mt} must be an item key or an item index`
    )
  const i = o.length > 3 ? 'id' : 'line',
    r = new FormData()
  r.set(i, o),
    r.set('quantity', n.toString()),
    C(r, { info: { initiator: t } }),
    t.blur()
}
const qt = `${e}-property-input`
function gt(t) {
  const e = t.getAttribute(qt),
    n = t.getAttribute('name')
  console.error(
    `Liquid Ajax Cart: the element [${qt}="${e}"]${
      n ? `[name="${n}"]` : ''
    } has wrong attributes.`
  )
}
function $t(t) {
  return (
    !!t.hasAttribute(qt) &&
    !!(
      (t instanceof HTMLInputElement && 'hidden' !== t.type) ||
      t instanceof HTMLTextAreaElement ||
      t instanceof HTMLSelectElement
    )
  )
}
function wt(t) {
  const e = { objectCode: void 0, propertyName: void 0, attributeValue: void 0 }
  if (!t.hasAttribute(qt)) return e
  let n = t.getAttribute(qt).trim()
  if (!n) {
    const e = t.getAttribute('name').trim()
    e && (n = e)
  }
  if (!n) return gt(t), e
  if (((e.attributeValue = n), 'note' === n)) return (e.objectCode = 'note'), e
  let [o, ...i] = n.trim().split('[')
  return !i ||
    1 !== i.length ||
    i[0].length < 2 ||
    i[0].indexOf(']') !== i[0].length - 1
    ? (gt(t), e)
    : ((e.objectCode = o), (e.propertyName = i[0].replace(']', '')), e)
}
function At() {
  document.querySelectorAll(`[${qt}]`).forEach((t) => {
    if (!$t(t)) return
    if (D()) return void (t.disabled = !0)
    const { objectCode: e, propertyName: n, attributeValue: o } = wt(t)
    if (!e) return
    const i = B()
    let r,
      a = !1
    if ('note' === e) r = i.cart.note
    else if ('attributes' === e) r = i.cart.attributes[n]
    else {
      const [t, s] = pt(e, i)
      t && (r = t.properties[n]),
        null === t &&
          (console.error(
            `Liquid Ajax Cart: line item with ${s}="${e}" was not found when the [${qt}] element with "${o}" value tried to get updated from the State`
          ),
          (a = !0))
    }
    t instanceof HTMLInputElement &&
    ('checkbox' === t.type || 'radio' === t.type)
      ? (t.checked = t.value === r)
      : ('string' == typeof r ||
          r instanceof String ||
          'number' == typeof r ||
          r instanceof Number ||
          (Array.isArray(r) || r instanceof Object
            ? ((r = JSON.stringify(r)),
              console.warn(
                `Liquid Ajax Cart: the ${qt} with the "${o}" value is bound to the ${n} ${
                  'attributes' === e ? 'attribute' : 'property'
                } that is not string or number: ${r}`
              ))
            : (r = '')),
        (t.value = r)),
      a || (t.disabled = !1)
  })
}
function Et(t, e) {
  if (!$t(t)) return
  e && e.preventDefault(), t.blur()
  const n = B()
  if (D()) return
  const { objectCode: o, propertyName: i, attributeValue: r } = wt(t)
  if (!o) return
  let a = t.value
  if (t instanceof HTMLInputElement && 'checkbox' === t.type && !t.checked) {
    let t = document.querySelector(`input[type="hidden"][${qt}="${r}"]`)
    t ||
      ('note' !== o && 'attributes' !== o) ||
      (t = document.querySelector(`input[type="hidden"][${qt}][name="${r}"]`)),
      (a = t ? t.value : '')
  }
  if ('note' === o) {
    const e = new FormData()
    e.set('note', a), x(e, { info: { initiator: t } })
  } else if ('attributes' === o) {
    const e = new FormData()
    e.set(`attributes[${i}]`, a), x(e, { info: { initiator: t } })
  } else {
    const [e, s] = pt(o, n)
    if (
      (null === e &&
        console.error(
          `Liquid Ajax Cart: line item with ${s}="${o}" was not found when the [${qt}] element with "${r}" value tried to update the cart`
        ),
      !e)
    )
      return
    const u = Object.assign({}, e.properties)
    u[i] = a
    const c = new FormData()
    let l = c
    c.set(s, o), c.set('quantity', e.quantity.toString())
    for (let t in u) {
      const n = u[t]
      'string' == typeof n || n instanceof String
        ? c.set(`properties[${t}]`, u[t])
        : (l = { [s]: o, quantity: e.quantity, properties: u })
    }
    C(l, { info: { initiator: t } })
  }
}
const Lt = `${n}-quantity`,
  St = `${e}-quantity-plus`,
  jt = `${e}-quantity-minus`
function Ct() {
  customElements.define(X, Y),
    document.addEventListener(
      'click',
      function (t) {
        for (
          let e = t.target;
          e && e != document.documentElement;
          e = e.parentElement
        )
          ft(e, t)
      },
      !1
    ),
    document.addEventListener(
      'change',
      function (t) {
        Et(t.target, t)
      },
      !1
    ),
    document.addEventListener(
      'keydown',
      function (t) {
        const e = t.target
        'Enter' === t.key &&
          ((e instanceof HTMLTextAreaElement && !t.ctrlKey) || Et(e, t)),
          'Escape' === t.key &&
            (function (t) {
              if (!$t(t)) return
              if (
                !(
                  t instanceof HTMLInputElement ||
                  t instanceof HTMLTextAreaElement
                )
              )
                return
              if (
                t instanceof HTMLInputElement &&
                ('checkbox' === t.type || 'radio' === t.type)
              )
                return
              const e = B(),
                { objectCode: n, propertyName: o } = wt(t)
              if (!n) return
              let i
              if ('note' === n) i = e.cart.note
              else if ('attributes' === n) i = e.cart.attributes[o]
              else {
                const [t] = pt(n, e)
                t && (i = t.properties[o])
              }
              void 0 !== i &&
                (i || 'string' == typeof i || i instanceof String || (i = ''),
                (t.value = String(i))),
                t.blur()
            })(e)
      },
      !1
    ),
    document.addEventListener(d, At),
    document.addEventListener(v, At),
    document.addEventListener(f, At),
    At(),
    document.addEventListener(
      'change',
      function (t) {
        bt(t.target, t)
      },
      !1
    ),
    document.addEventListener(
      'keydown',
      function (t) {
        'Enter' === t.key && bt(t.target, t),
          'Escape' === t.key &&
            (function (t) {
              if (!yt(t)) return
              const e = t.getAttribute(mt).trim()
              let n
              const o = B()
              if (e.length > 3) n = o.cart.items.find((t) => t.key === e)
              else {
                const t = Number(e) - 1
                n = o.cart.items[t]
              }
              n && (t.value = n.quantity.toString()), t.blur()
            })(t.target)
      },
      !1
    ),
    document.addEventListener(d, vt),
    document.addEventListener(v, vt),
    document.addEventListener(f, vt),
    vt(),
    customElements.define(
      Lt,
      class extends HTMLElement {
        constructor() {
          super(...arguments), (this._timer = void 0)
        }
        connectedCallback() {
          const t = this.querySelectorAll('input')
          1 === t.length
            ? ((this._$input = t[0]),
              this._$input.hasAttribute(mt)
                ? ((this._$buttons = Array.from(
                    this.querySelectorAll(`[${jt}], [${St}]`)
                  )),
                  this._$input.addEventListener(
                    'change',
                    this._updateDOM.bind(this)
                  ),
                  document.addEventListener(d, this._updateDOM.bind(this)),
                  document.addEventListener(v, this._updateDOM.bind(this)),
                  document.addEventListener(f, this._updateDOM.bind(this)),
                  this._updateDOM(),
                  this._$buttons.forEach((t) => {
                    t.addEventListener('click', (e) => {
                      const { quantityTagAllowZero: n } = Z,
                        o = !0 === n ? 0 : 1
                      if (!D()) {
                        const e = Number(this._$input.value)
                        if (isNaN(e))
                          return void console.error(
                            `Liquid Ajax Cart: "${Lt}" element's input value isn't a number`,
                            this._$input,
                            this
                          )
                        let n = e
                        ;(n = t.hasAttribute(St) ? n + 1 : n - 1),
                          n < o && (n = o),
                          n !== e &&
                            ((this._$input.value = n.toString()),
                            this._runAwaiting(),
                            this._updateDOM())
                      }
                      e.preventDefault()
                    }),
                      t.addEventListener('focusout', (e) => {
                        ;(e.relatedTarget && t.contains(e.relatedTarget)) ||
                          (void 0 !== this._timer && this._runRequest())
                      })
                  }))
                : console.error(
                    `Liquid Ajax Cart: "${Lt}" element's input must have the "${mt}" attribute`,
                    this._$input,
                    this
                  ))
            : console.error(
                `Liquid Ajax Cart: "${Lt}" element must have one "input" element as a child, ${t.length} found`,
                this
              )
        }
        _runAwaiting() {
          const { quantityTagDebounce: t } = Z
          void 0 !== this._timer && clearTimeout(this._timer),
            t > 0
              ? (this._timer = setTimeout(() => {
                  this._runRequest()
                }, Number(t)))
              : this._runRequest()
        }
        _runRequest() {
          void 0 !== this._timer && clearTimeout(this._timer),
            (this._timer = void 0),
            D() ||
              this._$input.dispatchEvent(new Event('change', { bubbles: !0 }))
        }
        _updateDOM() {
          this._$buttons.forEach((t) => {
            const e =
              D() ||
              (t.hasAttribute(jt) &&
                !Z.quantityTagAllowZero &&
                '1' === this._$input.value)
            e
              ? t.setAttribute('aria-disabled', 'true')
              : t.removeAttribute('aria-disabled'),
              t instanceof HTMLButtonElement && t.toggleAttribute('disabled', e)
          })
        }
      }
    )
}
const xt = `${e}-errors`,
  Tt = `${o}-init`,
  kt = `${o}-processing`,
  Dt = `${o}-empty`,
  _t = `${o}-not-empty`
function Nt() {
  const t = document.querySelector('html'),
    e = B()
  t.classList.toggle(Tt, null !== e.cart),
    t.classList.toggle(kt, D()),
    t.classList.toggle(Dt, 0 === e.cart.item_count),
    t.classList.toggle(_t, e.cart.item_count > 0)
}
let Ot = !1
if (!('liquidAjaxCart' in window)) {
  function Bt(t, e) {
    Object.defineProperty(window.liquidAjaxCart, t, {
      get: e,
      set: () => {
        throw new Error(`Liquid Ajax Cart: the "${t}" is a read-only property`)
      },
      enumerable: !0,
    })
  }
  ;(window.liquidAjaxCart = {
    conf: function (t, e) {
      t in Z
        ? ((Z[t] = e),
          window.liquidAjaxCart.init &&
            ('binderFormatters' === t && R(), 'mutations' === t && I()))
        : console.error(
            `Liquid Ajax Cart: unknown configuration parameter "${t}"`
          )
    },
  }),
    Bt('init', () => Ot),
    document.addEventListener(m, (t) => {
      const { requestState: e } = t.detail
      if (void 0 !== e.requestBody) {
        const t = []
        if (
          (document.querySelectorAll(`[${W}]`).forEach((e) => {
            const n = e.closest(`[id^="${K}"]`)
            if (n) {
              const e = n.id.replace(K, '')
              ;-1 === t.indexOf(e) && t.push(e)
            } else
              console.error(
                `Liquid Ajax Cart: there is a ${W} element that is not inside a Shopify section. All the ${W} elements must be inside Shopify sections.`
              )
          }),
          t.length)
        ) {
          let n,
            o = t.join(',')
          e.requestBody instanceof FormData ||
          e.requestBody instanceof URLSearchParams
            ? e.requestBody.has('sections') &&
              (n = e.requestBody.get('sections').toString())
            : (n = e.requestBody.sections),
            ((('string' == typeof n || n instanceof String) && '' !== n) ||
              (n && Array.isArray(n) && n.length > 0)) &&
              (o = `${n.toString()},${o}`),
            e.requestBody instanceof FormData ||
            e.requestBody instanceof URLSearchParams
              ? e.requestBody.set('sections', o)
              : (e.requestBody.sections = o)
        }
      }
    }),
    document.addEventListener(v, (t) => {
      var e, n, o
      t.detail.sections = []
      const { requestState: i } = t.detail,
        a = new DOMParser(),
        s = []
      if (
        (null === (e = i.responseData) || void 0 === e ? void 0 : e.ok) &&
        'sections' in i.responseData.body
      ) {
        let t = i.responseData.body.sections
        ;(null ===
          (o =
            null === (n = i.extraResponseData) || void 0 === n
              ? void 0
              : n.body) || void 0 === o
          ? void 0
          : o.sections) &&
          (t = Object.assign(
            Object.assign({}, t),
            i.extraResponseData.body.sections
          ))
        for (let e in t)
          t[e]
            ? document
                .querySelectorAll(`#shopify-section-${e}`)
                .forEach((n) => {
                  let o = []
                  const u = '__noId__',
                    c = {}
                  n.querySelectorAll(` [${G}] `).forEach((t) => {
                    let e = t.getAttribute(G).toString().trim()
                    '' === e && (e = u),
                      e in c || (c[e] = []),
                      c[e].push({ scroll: t.scrollTop, height: t.scrollHeight })
                  })
                  const l = {},
                    d = n.querySelectorAll(`[${z}]`)
                  d &&
                    d.forEach((t) => {
                      let e = t.getAttribute(z).toString().trim()
                      '' === e && (e = u), e in l || (l[e] = []), l[e].push(t)
                    })
                  const h = n.querySelectorAll(`[${W}]`)
                  if (h) {
                    const i = a.parseFromString(t[e], 'text/html')
                    i.querySelectorAll('img[loading="lazy"]').forEach((t) => {
                      t.removeAttribute('loading')
                    })
                    for (let t in l)
                      i.querySelectorAll(
                        ` [${z}="${t.replace(u, '')}"] `
                      ).forEach((e, n) => {
                        n + 1 <= l[t].length &&
                          (e.before(l[t][n]), e.parentElement.removeChild(e))
                      })
                    const r = i.querySelectorAll(`[${W}]`)
                    if (h.length !== r.length) {
                      console.error(
                        `Liquid Ajax Cart: the received HTML for the "${e}" section has a different quantity of the "${W}" containers. The section will be updated completely.`
                      )
                      const t = i.querySelector(`#${K}${e}`)
                      if (t) {
                        for (n.innerHTML = ''; t.childNodes.length; )
                          n.appendChild(t.firstChild)
                        o.push(n)
                      }
                    } else
                      h.forEach((t, e) => {
                        t.before(r[e]),
                          t.parentElement.removeChild(t),
                          o.push(r[e])
                      })
                  }
                  for (let t in c)
                    n.querySelectorAll(
                      ` [${G}="${t.replace(u, '')}"] `
                    ).forEach((e, n) => {
                      n + 1 <= c[t].length &&
                        (i.requestType !== r ||
                          c[t][n].height >= e.scrollHeight) &&
                        (e.scrollTop = c[t][n].scroll)
                    })
                  o.length > 0 && s.push({ id: e, elements: o })
                })
            : console.error(
                `Liquid Ajax Cart: the HTML for the "${e}" section was requested but the response is ${t[e]}`
              )
      }
      s.length > 0 && (t.detail.sections = s)
    }),
    (() => {
      let t
      document.addEventListener(m, (e) => {
        const { requestState: n } = e.detail
        ;(t = void 0),
          n.requestType === r
            ? (t = ((t) => {
                var e
                let n
                const o =
                  null === (e = t.info) || void 0 === e ? void 0 : e.initiator
                return (
                  o instanceof Y && (n = o.querySelectorAll(`[${xt}="form"]`)),
                  n
                )
              })(n))
            : n.requestType === a &&
              (t = ((t) => {
                var e
                let n
                const o = B()
                let i, r
                if (
                  (t.requestBody instanceof FormData ||
                  t.requestBody instanceof URLSearchParams
                    ? (t.requestBody.has('line') &&
                        (r = t.requestBody.get('line').toString()),
                      t.requestBody.has('id') &&
                        (i = t.requestBody.get('id').toString()))
                    : ('line' in t.requestBody &&
                        (r = String(t.requestBody.line)),
                      'id' in t.requestBody && (i = String(t.requestBody.id))),
                  r)
                ) {
                  const t = Number(r)
                  if (t > 0) {
                    const n = t - 1
                    i =
                      null === (e = o.cart.items[n]) || void 0 === e
                        ? void 0
                        : e.key
                  }
                }
                return (
                  i &&
                    (n =
                      i.indexOf(':') > -1
                        ? document.querySelectorAll(`[${xt}="${i}"]`)
                        : document.querySelectorAll(
                            o.cart.items
                              .reduce(
                                (t, e) => (
                                  (e.key !== i && e.id !== Number(i)) ||
                                    t.push(`[${xt}="${e.key}"]`),
                                  t
                                ),
                                []
                              )
                              .join(',')
                          )),
                  n
                )
              })(n)),
          t &&
            t.length > 0 &&
            t.forEach((t) => {
              t.textContent = ''
            })
      }),
        document.addEventListener(v, (e) => {
          const { requestState: n } = e.detail
          if (n.info.cancel) return
          if (!t || 0 === t.length) return
          const o = (function (t) {
            var e, n, o, i, r
            const { requestErrorText: a } = Z
            return (
              null === (e = t.responseData) || void 0 === e ? void 0 : e.ok
            )
              ? ''
              : (null ===
                  (o =
                    null === (n = t.responseData) || void 0 === n
                      ? void 0
                      : n.body) || void 0 === o
                  ? void 0
                  : o.description) ||
                  (null ===
                    (r =
                      null === (i = t.responseData) || void 0 === i
                        ? void 0
                        : i.body) || void 0 === r
                    ? void 0
                    : r.message) ||
                  a
          })(n)
          o &&
            t.forEach((t) => {
              t.textContent = o
            })
        })
    })(),
    document.addEventListener(i, I),
    document.addEventListener(h, () => {
      P && I()
    }),
    document.addEventListener(m, (t) => {
      const { requestState: e } = t.detail
      'mutation' !== e.info.initiator && (P = !0)
    }),
    (function () {
      document.addEventListener(v, (t) => {
        var e, n
        const { requestState: o } = t.detail
        let i
        ;(null === (e = o.extraResponseData) || void 0 === e ? void 0 : e.ok) &&
        o.extraResponseData.body.token
          ? (i = o.extraResponseData.body)
          : (null === (n = o.responseData) || void 0 === n ? void 0 : n.ok) &&
            o.responseData.body.token &&
            (i = o.responseData.body),
          i &&
            ((N = O), (O = i), (t.detail.previousCart = N), (t.detail.cart = O))
      })
      const t = document.querySelector(`[${_}]`)
      if (t)
        try {
          O = JSON.parse(t.textContent)
        } catch (t) {
          console.error(
            `Liquid Ajax Cart: can't parse cart JSON from the "${_}" script`
          ),
            console.error(t)
        }
      return new Promise((t, e) => {
        var n, o
        O
          ? t()
          : fetch(
              `${
                (null ===
                  (o =
                    null === (n = window.Shopify) || void 0 === n
                      ? void 0
                      : n.routes) || void 0 === o
                  ? void 0
                  : o.root) || '/'
              }cart.js`,
              { headers: { 'Content-Type': 'application/json' } }
            )
              .then((t) => t.json())
              .then((e) => {
                ;(O = e), t()
              })
              .catch((t) => {
                console.error(t),
                  e('Can\'t load the cart state from the "/cart.js" endpoint')
              })
      })
    })().then(() => {
      document.addEventListener(v, R),
        R(),
        Ct(),
        document.addEventListener(d, Nt),
        document.addEventListener(v, Nt),
        document.addEventListener(f, Nt),
        Nt(),
        (window.liquidAjaxCart.get = S),
        (window.liquidAjaxCart.add = j),
        (window.liquidAjaxCart.change = C),
        (window.liquidAjaxCart.update = x),
        (window.liquidAjaxCart.clear = T),
        Bt('cart', () => B().cart),
        Bt('processing', D),
        window.addEventListener('focus', () => {
          Z.updateOnWindowFocus && x({}, {})
        }),
        window.addEventListener('pageshow', (t) => {
          ;(t.persisted ||
            'back_forward' ===
              performance.getEntriesByType('navigation')[0].type) &&
            window.liquidAjaxCart.update({}, {})
        }),
        (Ot = !0)
      const t = new CustomEvent(i)
      document.dispatchEvent(t)
    })
}
