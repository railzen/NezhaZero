var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _t2, _e2, _a;
const ur = "5";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(ur);
const cr = 2, dr = "[", fr = "]", lt = {}, W = Symbol(), di = false, te = 2, _i = 4, Mt = 8, ri = 16, ye = 32, We = 64, St = 128, Q = 256, At = 512, G = 1024, _e = 2048, je = 4096, Ft = 8192, Pt = 16384, xr = 32768, hr = 65536, pr = 1 << 19, Ei = 1 << 20, Et = Symbol("$state"), br = Symbol("legacy props"), vr = Symbol("");
var Ci = Array.isArray, wr = Array.prototype.indexOf, mr = Array.from, Rt = Object.keys, Nt = Object.defineProperty, Ve = Object.getOwnPropertyDescriptor, gr = Object.getOwnPropertyDescriptors, yr = Object.prototype, _r = Array.prototype, ki = Object.getPrototypeOf;
function Di(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
let ct = [], Xt = [];
function Si() {
  var e = ct;
  ct = [], Di(e);
}
function Er() {
  var e = Xt;
  Xt = [], Di(e);
}
function ni(e) {
  ct.length === 0 && queueMicrotask(Si), ct.push(e);
}
function fi() {
  ct.length > 0 && Si(), Xt.length > 0 && Er();
}
function Ai(e) {
  return e === this.v;
}
function Cr(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function kr(e) {
  return !Cr(e, this.v);
}
function Dr(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function Sr() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Ar(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function Fr() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Rr() {
  throw new Error("https://svelte.dev/e/hydration_failed");
}
function Nr() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Br() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function Lr() {
  throw new Error("https://svelte.dev/e/state_unsafe_local_read");
}
function $r() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
let Tr = false;
function re(e, t) {
  var i = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: Ai,
    rv: 0,
    wv: 0
  };
  return i;
}
function Wt(e) {
  return /* @__PURE__ */ Kr(re(e));
}
// @__NO_SIDE_EFFECTS__
function Fi(e, t = false) {
  const i = re(e);
  return t || (i.equals = kr), i;
}
// @__NO_SIDE_EFFECTS__
function Kr(e) {
  return R !== null && !ee && (R.f & te) !== 0 && (ne === null ? Ur([e]) : ne.push(e)), e;
}
function Y(e, t) {
  return R !== null && !ee && Zi() && (R.f & (te | ri)) !== 0 && // If the source was created locally within the current derived, then
  // we allow the mutation.
  (ne === null || !ne.includes(e)) && $r(), Or(e, t);
}
function Or(e, t) {
  return e.equals(t) || (e.v, e.v = t, e.wv = Ii(), Ri(e, _e), N !== null && (N.f & G) !== 0 && (N.f & (ye | We)) === 0 && (le === null ? zr([e]) : le.push(e))), t;
}
function Ri(e, t) {
  var i = e.reactions;
  if (i !== null)
    for (var r = i.length, n = 0; n < r; n++) {
      var s = i[n], d = s.f;
      (d & _e) === 0 && (ue(s, t), (d & (G | Q)) !== 0 && ((d & te) !== 0 ? Ri(
        /** @type {Derived} */
        s,
        je
      ) : li(
        /** @type {Effect} */
        s
      )));
    }
}
// @__NO_SIDE_EFFECTS__
function Ni(e) {
  var t = te | _e, i = R !== null && (R.f & te) !== 0 ? (
    /** @type {Derived} */
    R
  ) : null;
  return N === null || i !== null && (i.f & Q) !== 0 ? t |= Q : N.f |= Ei, {
    ctx: U,
    deps: null,
    effects: null,
    equals: Ai,
    f: t,
    fn: e,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      null
    ),
    wv: 0,
    parent: i ?? N
  };
}
function Bi(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var i = 0; i < t.length; i += 1)
      ge(
        /** @type {Effect} */
        t[i]
      );
  }
}
function Mr(e) {
  for (var t = e.parent; t !== null; ) {
    if ((t.f & te) === 0)
      return (
        /** @type {Effect} */
        t
      );
    t = t.parent;
  }
  return null;
}
function Pr(e) {
  var t, i = N;
  me(Mr(e));
  try {
    Bi(e), t = zi(e);
  } finally {
    me(i);
  }
  return t;
}
function Li(e) {
  var t = Pr(e), i = (ve || (e.f & Q) !== 0) && e.deps !== null ? je : G;
  ue(e, i), e.equals(t) || (e.v = t, e.wv = Ii());
}
function oi(e) {
  console.warn("https://svelte.dev/e/hydration_mismatch");
}
let ie = false;
function gt(e) {
  ie = e;
}
let q;
function Bt(e) {
  if (e === null)
    throw oi(), lt;
  return q = e;
}
function $i() {
  return Bt(
    /** @type {TemplateNode} */
    /* @__PURE__ */ It(q)
  );
}
function jt(e) {
  if (ie) {
    if (/* @__PURE__ */ It(q) !== null)
      throw oi(), lt;
    q = e;
  }
}
function Ae(e, t = null, i) {
  if (typeof e != "object" || e === null || Et in e)
    return e;
  const r = ki(e);
  if (r !== yr && r !== _r)
    return e;
  var n = /* @__PURE__ */ new Map(), s = Ci(e), d = re(0);
  s && n.set("length", re(
    /** @type {any[]} */
    e.length
  ));
  var b;
  return new Proxy(
    /** @type {any} */
    e,
    {
      defineProperty(p, h, v) {
        (!("value" in v) || v.configurable === false || v.enumerable === false || v.writable === false) && Nr();
        var x = n.get(h);
        return x === void 0 ? (x = re(v.value), n.set(h, x)) : Y(x, Ae(v.value, b)), true;
      },
      deleteProperty(p, h) {
        var v = n.get(h);
        if (v === void 0)
          h in p && n.set(h, re(W));
        else {
          if (s && typeof h == "string") {
            var x = (
              /** @type {Source<number>} */
              n.get("length")
            ), o = Number(h);
            Number.isInteger(o) && o < x.v && Y(x, o);
          }
          Y(v, W), xi(d);
        }
        return true;
      },
      get(p, h, v) {
        var _a2;
        if (h === Et)
          return e;
        var x = n.get(h), o = h in p;
        if (x === void 0 && (!o || ((_a2 = Ve(p, h)) == null ? void 0 : _a2.writable)) && (x = re(Ae(o ? p[h] : W, b)), n.set(h, x)), x !== void 0) {
          var l = I(x);
          return l === W ? void 0 : l;
        }
        return Reflect.get(p, h, v);
      },
      getOwnPropertyDescriptor(p, h) {
        var v = Reflect.getOwnPropertyDescriptor(p, h);
        if (v && "value" in v) {
          var x = n.get(h);
          x && (v.value = I(x));
        } else if (v === void 0) {
          var o = n.get(h), l = o == null ? void 0 : o.v;
          if (o !== void 0 && l !== W)
            return {
              enumerable: true,
              configurable: true,
              value: l,
              writable: true
            };
        }
        return v;
      },
      has(p, h) {
        var _a2;
        if (h === Et)
          return true;
        var v = n.get(h), x = v !== void 0 && v.v !== W || Reflect.has(p, h);
        if (v !== void 0 || N !== null && (!x || ((_a2 = Ve(p, h)) == null ? void 0 : _a2.writable))) {
          v === void 0 && (v = re(x ? Ae(p[h], b) : W), n.set(h, v));
          var o = I(v);
          if (o === W)
            return false;
        }
        return x;
      },
      set(p, h, v, x) {
        var _a2;
        var o = n.get(h), l = h in p;
        if (s && h === "length")
          for (var a = v; a < /** @type {Source<number>} */
          o.v; a += 1) {
            var u = n.get(a + "");
            u !== void 0 ? Y(u, W) : a in p && (u = re(W), n.set(a + "", u));
          }
        o === void 0 ? (!l || ((_a2 = Ve(p, h)) == null ? void 0 : _a2.writable)) && (o = re(void 0), Y(o, Ae(v, b)), n.set(h, o)) : (l = o.v !== W, Y(o, Ae(v, b)));
        var f = Reflect.getOwnPropertyDescriptor(p, h);
        if ((f == null ? void 0 : f.set) && f.set.call(x, v), !l) {
          if (s && typeof h == "string") {
            var B = (
              /** @type {Source<number>} */
              n.get("length")
            ), T = Number(h);
            Number.isInteger(T) && T >= B.v && Y(B, T + 1);
          }
          xi(d);
        }
        return true;
      },
      ownKeys(p) {
        I(d);
        var h = Reflect.ownKeys(p).filter((o) => {
          var l = n.get(o);
          return l === void 0 || l.v !== W;
        });
        for (var [v, x] of n)
          x.v !== W && !(v in p) && h.push(v);
        return h;
      },
      setPrototypeOf() {
        Br();
      }
    }
  );
}
function xi(e, t = 1) {
  Y(e, e.v + t);
}
var hi, Ti, Ki, Oi;
function Qt() {
  if (hi === void 0) {
    hi = window, Ti = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, t = Node.prototype;
    Ki = Ve(t, "firstChild").get, Oi = Ve(t, "nextSibling").get, e.__click = void 0, e.__className = void 0, e.__attributes = null, e.__styles = null, e.__e = void 0, Text.prototype.__t = void 0;
  }
}
function Mi(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function Lt(e) {
  return Ki.call(e);
}
// @__NO_SIDE_EFFECTS__
function It(e) {
  return Oi.call(e);
}
function Yt(e, t) {
  if (!ie)
    return /* @__PURE__ */ Lt(e);
  var i = (
    /** @type {TemplateNode} */
    /* @__PURE__ */ Lt(q)
  );
  return i === null && (i = q.appendChild(Mi())), Bt(i), i;
}
function Ir(e) {
  e.textContent = "";
}
let Ct = false, $t = false, Tt = null, kt = false, si = false;
function pi(e) {
  si = e;
}
let ut = [];
let R = null, ee = false;
function we(e) {
  R = e;
}
let N = null;
function me(e) {
  N = e;
}
let ne = null;
function Ur(e) {
  ne = e;
}
let P = null, j = 0, le = null;
function zr(e) {
  le = e;
}
let Pi = 1, Kt = 0, ve = false;
function Ii() {
  return ++Pi;
}
function Ut(e) {
  var _a2;
  var t = e.f;
  if ((t & _e) !== 0)
    return true;
  if ((t & je) !== 0) {
    var i = e.deps, r = (t & Q) !== 0;
    if (i !== null) {
      var n, s, d = (t & At) !== 0, b = r && N !== null && !ve, p = i.length;
      if (d || b) {
        var h = (
          /** @type {Derived} */
          e
        ), v = h.parent;
        for (n = 0; n < p; n++)
          s = i[n], (d || !((_a2 = s == null ? void 0 : s.reactions) == null ? void 0 : _a2.includes(h))) && (s.reactions ?? (s.reactions = [])).push(h);
        d && (h.f ^= At), b && v !== null && (v.f & Q) === 0 && (h.f ^= Q);
      }
      for (n = 0; n < p; n++)
        if (s = i[n], Ut(
          /** @type {Derived} */
          s
        ) && Li(
          /** @type {Derived} */
          s
        ), s.wv > e.wv)
          return true;
    }
    (!r || N !== null && !ve) && ue(e, G);
  }
  return false;
}
function qr(e, t) {
  for (var i = t; i !== null; ) {
    if ((i.f & St) !== 0)
      try {
        i.fn(e);
        return;
      } catch {
        i.f ^= St;
      }
    i = i.parent;
  }
  throw Ct = false, e;
}
function Hr(e) {
  return (e.f & Pt) === 0 && (e.parent === null || (e.parent.f & St) === 0);
}
function zt(e, t, i, r) {
  if (Ct) {
    if (i === null && (Ct = false), Hr(t))
      throw e;
    return;
  }
  i !== null && (Ct = true);
  {
    qr(e, t);
    return;
  }
}
function Ui(e, t, i = true) {
  var r = e.reactions;
  if (r !== null)
    for (var n = 0; n < r.length; n++) {
      var s = r[n];
      (s.f & te) !== 0 ? Ui(
        /** @type {Derived} */
        s,
        t,
        false
      ) : t === s && (i ? ue(s, _e) : (s.f & G) !== 0 && ue(s, je), li(
        /** @type {Effect} */
        s
      ));
    }
}
function zi(e) {
  var _a2;
  var t = P, i = j, r = le, n = R, s = ve, d = ne, b = U, p = ee, h = e.f;
  P = /** @type {null | Value[]} */
  null, j = 0, le = null, ve = (h & Q) !== 0 && (ee || !kt || R === null), R = (h & (ye | We)) === 0 ? e : null, ne = null, bi(e.ctx), ee = false, Kt++;
  try {
    var v = (
      /** @type {Function} */
      (0, e.fn)()
    ), x = e.deps;
    if (P !== null) {
      var o;
      if (Ot(e, j), x !== null && j > 0)
        for (x.length = j + P.length, o = 0; o < P.length; o++)
          x[j + o] = P[o];
      else
        e.deps = x = P;
      if (!ve)
        for (o = j; o < x.length; o++)
          ((_a2 = x[o]).reactions ?? (_a2.reactions = [])).push(e);
    } else x !== null && j < x.length && (Ot(e, j), x.length = j);
    if (Zi() && le !== null && !ee && x !== null && (e.f & (te | je | _e)) === 0)
      for (o = 0; o < /** @type {Source[]} */
      le.length; o++)
        Ui(
          le[o],
          /** @type {Effect} */
          e
        );
    return n !== null && Kt++, v;
  } finally {
    P = t, j = i, le = r, R = n, ve = s, ne = d, bi(b), ee = p;
  }
}
function Vr(e, t) {
  let i = t.reactions;
  if (i !== null) {
    var r = wr.call(i, e);
    if (r !== -1) {
      var n = i.length - 1;
      n === 0 ? i = t.reactions = null : (i[r] = i[n], i.pop());
    }
  }
  i === null && (t.f & te) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (P === null || !P.includes(t)) && (ue(t, je), (t.f & (Q | At)) === 0 && (t.f ^= At), Bi(
    /** @type {Derived} **/
    t
  ), Ot(
    /** @type {Derived} **/
    t,
    0
  ));
}
function Ot(e, t) {
  var i = e.deps;
  if (i !== null)
    for (var r = t; r < i.length; r++)
      Vr(e, i[r]);
}
function ai(e) {
  var t = e.f;
  if ((t & Pt) === 0) {
    ue(e, G);
    var i = N, r = U, n = kt;
    N = e, kt = true;
    try {
      (t & ri) !== 0 ? o0(e) : Wi(e), Vi(e);
      var s = zi(e);
      e.teardown = typeof s == "function" ? s : null, e.wv = Pi;
      var d = e.deps, b;
      di && Tr && e.f & _e;
    } catch (p) {
      zt(p, e, i, r || e.ctx);
    } finally {
      kt = n, N = i;
    }
  }
}
function Wr() {
  try {
    Fr();
  } catch (e) {
    if (Tt !== null)
      zt(e, Tt, null);
    else
      throw e;
  }
}
function qi() {
  try {
    for (var e = 0; ut.length > 0; ) {
      e++ > 1e3 && Wr();
      var t = ut, i = t.length;
      ut = [];
      for (var r = 0; r < i; r++) {
        var n = t[r];
        (n.f & G) === 0 && (n.f ^= G);
        var s = Yr(n);
        jr(s);
      }
    }
  } finally {
    $t = false, Tt = null;
  }
}
function jr(e) {
  var t = e.length;
  if (t !== 0)
    for (var i = 0; i < t; i++) {
      var r = e[i];
      if ((r.f & (Pt | Ft)) === 0)
        try {
          Ut(r) && (ai(r), r.deps === null && r.first === null && r.nodes_start === null && (r.teardown === null ? ji(r) : r.fn = null));
        } catch (n) {
          zt(n, r, null, r.ctx);
        }
    }
}
function li(e) {
  $t || ($t = true, queueMicrotask(qi));
  for (var t = Tt = e; t.parent !== null; ) {
    t = t.parent;
    var i = t.f;
    if ((i & (We | ye)) !== 0) {
      if ((i & G) === 0) return;
      t.f ^= G;
    }
  }
  ut.push(t);
}
function Yr(e) {
  for (var t = [], i = e.first; i !== null; ) {
    var r = i.f, n = (r & ye) !== 0, s = n && (r & G) !== 0;
    if (!s && (r & Ft) === 0) {
      if ((r & _i) !== 0)
        t.push(i);
      else if (n)
        i.f ^= G;
      else {
        var d = R;
        try {
          R = i, Ut(i) && ai(i);
        } catch (h) {
          zt(h, i, null, i.ctx);
        } finally {
          R = d;
        }
      }
      var b = i.first;
      if (b !== null) {
        i = b;
        continue;
      }
    }
    var p = i.parent;
    for (i = i.next; i === null && p !== null; )
      i = p.next, p = p.parent;
  }
  return t;
}
function nt(e) {
  var t;
  for (fi(); ut.length > 0; )
    $t = true, qi(), fi();
  return (
    /** @type {T} */
    t
  );
}
function I(e) {
  var t = e.f, i = (t & te) !== 0;
  if (R !== null && !ee) {
    ne !== null && ne.includes(e) && Lr();
    var r = R.deps;
    e.rv < Kt && (e.rv = Kt, P === null && r !== null && r[j] === e ? j++ : P === null ? P = [e] : (!ve || !P.includes(e)) && P.push(e));
  } else if (i && /** @type {Derived} */
  e.deps === null && /** @type {Derived} */
  e.effects === null) {
    var n = (
      /** @type {Derived} */
      e
    ), s = n.parent;
    s !== null && (s.f & Q) === 0 && (n.f ^= Q);
  }
  return i && (n = /** @type {Derived} */
  e, Ut(n) && Li(n)), e.v;
}
function qt(e) {
  var t = ee;
  try {
    return ee = true, e();
  } finally {
    ee = t;
  }
}
const Gr = -7169;
function ue(e, t) {
  e.f = e.f & Gr | t;
}
function Xr(e) {
  N === null && R === null && Ar(), R !== null && (R.f & Q) !== 0 && N === null && Sr(), si && Dr();
}
function Qr(e, t) {
  var i = t.last;
  i === null ? t.last = t.first = e : (i.next = e, e.prev = i, t.last = e);
}
function Re(e, t, i, r = true) {
  var n = (e & We) !== 0, s = N, d = {
    ctx: U,
    deps: null,
    nodes_start: null,
    nodes_end: null,
    f: e | _e,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: n ? null : s,
    prev: null,
    teardown: null,
    transitions: null,
    wv: 0
  };
  if (i)
    try {
      ai(d), d.f |= xr;
    } catch (h) {
      throw ge(d), h;
    }
  else t !== null && li(d);
  var b = i && d.deps === null && d.first === null && d.nodes_start === null && d.teardown === null && (d.f & (Ei | St)) === 0;
  if (!b && !n && r && (s !== null && Qr(d, s), R !== null && (R.f & te) !== 0)) {
    var p = (
      /** @type {Derived} */
      R
    );
    (p.effects ?? (p.effects = [])).push(d);
  }
  return d;
}
function Zr(e) {
  const t = Re(Mt, null, false);
  return ue(t, G), t.teardown = e, t;
}
function Jr(e) {
  Xr();
  var t = N !== null && (N.f & ye) !== 0 && U !== null && !U.m;
  if (t) {
    var i = (
      /** @type {ComponentContext} */
      U
    );
    (i.e ?? (i.e = [])).push({
      fn: e,
      effect: N,
      reaction: R
    });
  } else {
    var r = ui(e);
    return r;
  }
}
function e0(e) {
  const t = Re(We, e, true);
  return () => {
    ge(t);
  };
}
function t0(e) {
  const t = Re(We, e, true);
  return (i = {}) => new Promise((r) => {
    i.outro ? s0(t, () => {
      ge(t), r(void 0);
    }) : (ge(t), r(void 0));
  });
}
function ui(e) {
  return Re(_i, e, false);
}
function Hi(e) {
  return Re(Mt, e, true);
}
function i0(e, t = [], i = Ni) {
  const r = t.map(i);
  return r0(() => e(...r.map(I)));
}
function r0(e, t = 0) {
  return Re(Mt | ri | t, e, true);
}
function n0(e, t = true) {
  return Re(Mt | ye, e, true, t);
}
function Vi(e) {
  var t = e.teardown;
  if (t !== null) {
    const i = si, r = R;
    pi(true), we(null);
    try {
      t.call(null);
    } finally {
      pi(i), we(r);
    }
  }
}
function Wi(e, t = false) {
  var i = e.first;
  for (e.first = e.last = null; i !== null; ) {
    var r = i.next;
    ge(i, t), i = r;
  }
}
function o0(e) {
  for (var t = e.first; t !== null; ) {
    var i = t.next;
    (t.f & ye) === 0 && ge(t), t = i;
  }
}
function ge(e, t = true) {
  var i = false;
  if ((t || (e.f & pr) !== 0) && e.nodes_start !== null) {
    for (var r = e.nodes_start, n = e.nodes_end; r !== null; ) {
      var s = r === n ? null : (
        /** @type {TemplateNode} */
        /* @__PURE__ */ It(r)
      );
      r.remove(), r = s;
    }
    i = true;
  }
  Wi(e, t && !i), Ot(e, 0), ue(e, Pt);
  var d = e.transitions;
  if (d !== null)
    for (const p of d)
      p.stop();
  Vi(e);
  var b = e.parent;
  b !== null && b.first !== null && ji(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes_start = e.nodes_end = null;
}
function ji(e) {
  var t = e.parent, i = e.prev, r = e.next;
  i !== null && (i.next = r), r !== null && (r.prev = i), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = i));
}
function s0(e, t) {
  var i = [];
  Yi(e, i, true), a0(i, () => {
    ge(e), t && t();
  });
}
function a0(e, t) {
  var i = e.length;
  if (i > 0) {
    var r = () => --i || t();
    for (var n of e)
      n.out(r);
  } else
    t();
}
function Yi(e, t, i) {
  if ((e.f & Ft) === 0) {
    if (e.f ^= Ft, e.transitions !== null)
      for (const d of e.transitions)
        (d.is_global || i) && t.push(d);
    for (var r = e.first; r !== null; ) {
      var n = r.next, s = (r.f & hr) !== 0 || (r.f & ye) !== 0;
      Yi(r, t, s ? i : false), r = n;
    }
  }
}
function Gi(e) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
let U = null;
function bi(e) {
  U = e;
}
function Xi(e, t = false, i) {
  U = {
    p: U,
    c: null,
    e: null,
    m: false,
    s: e,
    x: null,
    l: null
  };
}
function Qi(e) {
  const t = U;
  if (t !== null) {
    e !== void 0 && (t.x = e);
    const d = t.e;
    if (d !== null) {
      var i = N, r = R;
      t.e = null;
      try {
        for (var n = 0; n < d.length; n++) {
          var s = d[n];
          me(s.effect), we(s.reaction), ui(s.fn);
        }
      } finally {
        me(i), we(r);
      }
    }
    U = t.p, t.m = true;
  }
  return e || /** @type {T} */
  {};
}
function Zi() {
  return true;
}
const l0 = ["touchstart", "touchmove"];
function u0(e) {
  return l0.includes(e);
}
function c0(e) {
  var t = R, i = N;
  we(null), me(null);
  try {
    return e();
  } finally {
    we(t), me(i);
  }
}
const Ji = /* @__PURE__ */ new Set(), Zt = /* @__PURE__ */ new Set();
function d0(e, t, i, r = {}) {
  function n(s) {
    if (r.capture || ot.call(t, s), !s.cancelBubble)
      return c0(() => i == null ? void 0 : i.call(this, s));
  }
  return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? ni(() => {
    t.addEventListener(e, n, r);
  }) : t.addEventListener(e, n, r), n;
}
function it(e, t, i, r, n) {
  var s = { capture: r, passive: n }, d = d0(e, t, i, s);
  (t === document.body || t === window || t === document) && Zr(() => {
    t.removeEventListener(e, d, s);
  });
}
function f0(e) {
  for (var t = 0; t < e.length; t++)
    Ji.add(e[t]);
  for (var i of Zt)
    i(e);
}
function ot(e) {
  var _a2;
  var t = this, i = (
    /** @type {Node} */
    t.ownerDocument
  ), r = e.type, n = ((_a2 = e.composedPath) == null ? void 0 : _a2.call(e)) || [], s = (
    /** @type {null | Element} */
    n[0] || e.target
  ), d = 0, b = e.__root;
  if (b) {
    var p = n.indexOf(b);
    if (p !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e.__root = t;
      return;
    }
    var h = n.indexOf(t);
    if (h === -1)
      return;
    p <= h && (d = p);
  }
  if (s = /** @type {Element} */
  n[d] || e.target, s !== t) {
    Nt(e, "currentTarget", {
      configurable: true,
      get() {
        return s || i;
      }
    });
    var v = R, x = N;
    we(null), me(null);
    try {
      for (var o, l = []; s !== null; ) {
        var a = s.assignedSlot || s.parentNode || /** @type {any} */
        s.host || null;
        try {
          var u = s["__" + r];
          if (u !== void 0 && (!/** @type {any} */
          s.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === s))
            if (Ci(u)) {
              var [f, ...B] = u;
              f.apply(s, [e, ...B]);
            } else
              u.call(s, e);
        } catch (T) {
          o ? l.push(T) : o = T;
        }
        if (e.cancelBubble || a === t || a === null)
          break;
        s = a;
      }
      if (o) {
        for (let T of l)
          queueMicrotask(() => {
            throw T;
          });
        throw o;
      }
    } finally {
      e.__root = t, delete e.currentTarget, we(v), me(x);
    }
  }
}
function x0(e) {
  var t = document.createElement("template");
  return t.innerHTML = e, t.content;
}
function Jt(e, t) {
  var i = (
    /** @type {Effect} */
    N
  );
  i.nodes_start === null && (i.nodes_start = e, i.nodes_end = t);
}
// @__NO_SIDE_EFFECTS__
function h0(e, t) {
  var i = (t & cr) !== 0, r, n = !e.startsWith("<!>");
  return () => {
    if (ie)
      return Jt(q, null), q;
    r === void 0 && (r = x0(n ? e : "<!>" + e), r = /** @type {Node} */
    /* @__PURE__ */ Lt(r));
    var s = (
      /** @type {TemplateNode} */
      i || Ti ? document.importNode(r, true) : r.cloneNode(true)
    );
    return Jt(s, s), s;
  };
}
function er(e, t) {
  if (ie) {
    N.nodes_end = q, $i();
    return;
  }
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
function tr(e, t) {
  return ir(e, t);
}
function p0(e, t) {
  Qt(), t.intro = t.intro ?? false;
  const i = t.target, r = ie, n = q;
  try {
    for (var s = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ Lt(i)
    ); s && (s.nodeType !== 8 || /** @type {Comment} */
    s.data !== dr); )
      s = /** @type {TemplateNode} */
      /* @__PURE__ */ It(s);
    if (!s)
      throw lt;
    gt(true), Bt(
      /** @type {Comment} */
      s
    ), $i();
    const d = ir(e, { ...t, anchor: s });
    if (q === null || q.nodeType !== 8 || /** @type {Comment} */
    q.data !== fr)
      throw oi(), lt;
    return gt(false), /**  @type {Exports} */
    d;
  } catch (d) {
    if (d === lt)
      return t.recover === false && Rr(), Qt(), Ir(i), gt(false), tr(e, t);
    throw d;
  } finally {
    gt(r), Bt(n);
  }
}
const ze = /* @__PURE__ */ new Map();
function ir(e, { target: t, anchor: i, props: r = {}, events: n, context: s, intro: d = true }) {
  Qt();
  var b = /* @__PURE__ */ new Set(), p = (x) => {
    for (var o = 0; o < x.length; o++) {
      var l = x[o];
      if (!b.has(l)) {
        b.add(l);
        var a = u0(l);
        t.addEventListener(l, ot, { passive: a });
        var u = ze.get(l);
        u === void 0 ? (document.addEventListener(l, ot, { passive: a }), ze.set(l, 1)) : ze.set(l, u + 1);
      }
    }
  };
  p(mr(Ji)), Zt.add(p);
  var h = void 0, v = t0(() => {
    var x = i ?? t.appendChild(Mi());
    return n0(() => {
      if (s) {
        Xi({});
        var o = (
          /** @type {ComponentContext} */
          U
        );
        o.c = s;
      }
      n && (r.$$events = n), ie && Jt(
        /** @type {TemplateNode} */
        x,
        null
      ), h = e(x, r) || {}, ie && (N.nodes_end = q), s && Qi();
    }), () => {
      var _a2;
      for (var o of b) {
        t.removeEventListener(o, ot);
        var l = (
          /** @type {number} */
          ze.get(o)
        );
        --l === 0 ? (document.removeEventListener(o, ot), ze.delete(o)) : ze.set(o, l);
      }
      Zt.delete(p), x !== i && ((_a2 = x.parentNode) == null ? void 0 : _a2.removeChild(x));
    };
  });
  return ei.set(h, v), h;
}
let ei = /* @__PURE__ */ new WeakMap();
function b0(e, t) {
  const i = ei.get(e);
  return i ? (ei.delete(e), i(t)) : Promise.resolve();
}
function v0(e, t) {
  ni(() => {
    var i = e.getRootNode(), r = (
      /** @type {ShadowRoot} */
      i.host ? (
        /** @type {ShadowRoot} */
        i
      ) : (
        /** @type {Document} */
        i.head ?? /** @type {Document} */
        i.ownerDocument.head
      )
    );
    if (!r.querySelector("#" + t.hash)) {
      const n = document.createElement("style");
      n.id = t.hash, n.textContent = t.code, r.appendChild(n);
    }
  });
}
const vi = [...` 	
\r\f\xA0\v\uFEFF`];
function w0(e, t, i) {
  var r = e == null ? "" : "" + e;
  if (r = r ? r + " " + t : t, i) {
    for (var n in i)
      if (i[n])
        r = r ? r + " " + n : n;
      else if (r.length)
        for (var s = n.length, d = 0; (d = r.indexOf(n, d)) >= 0; ) {
          var b = d + s;
          (d === 0 || vi.includes(r[d - 1])) && (b === r.length || vi.includes(r[b])) ? r = (d === 0 ? "" : r.substring(0, d)) + r.substring(b + 1) : d = b;
        }
  }
  return r === "" ? null : r;
}
function m0(e, t, i, r, n, s) {
  var d = e.__className;
  if (ie || d !== i) {
    var b = w0(i, r, s);
    (!ie || b !== e.getAttribute("class")) && (b == null ? e.removeAttribute("class") : e.className = b), e.__className = i;
  } else if (s)
    for (var p in s) {
      var h = !!s[p];
      (n == null || h !== !!n[p]) && e.classList.toggle(p, h);
    }
  return s;
}
function Gt(e, t, i, r) {
  var n = e.__attributes ?? (e.__attributes = {});
  ie && (n[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === "LINK") || n[t] !== (n[t] = i) && (t === "style" && "__styles" in e && (e.__styles = {}), t === "loading" && (e[vr] = i), i == null ? e.removeAttribute(t) : typeof i != "string" && g0(e).includes(t) ? e[t] = i : e.setAttribute(t, i));
}
var wi = /* @__PURE__ */ new Map();
function g0(e) {
  var t = wi.get(e.nodeName);
  if (t) return t;
  wi.set(e.nodeName, t = []);
  for (var i, r = e, n = Element.prototype; n !== r; ) {
    i = gr(r);
    for (var s in i)
      i[s].set && t.push(s);
    r = ki(r);
  }
  return t;
}
function mi(e, t) {
  return e === t || (e == null ? void 0 : e[Et]) === t;
}
function yt(e = {}, t, i, r) {
  return ui(() => {
    var n, s;
    return Hi(() => {
      n = s, s = [], qt(() => {
        e !== i(...s) && (t(e, ...s), n && mi(i(...n), e) && t(null, ...n));
      });
    }), () => {
      ni(() => {
        s && mi(i(...s), e) && t(null, ...s);
      });
    };
  }), e;
}
function rr(e) {
  U === null && Gi(), Jr(() => {
    const t = qt(e);
    if (typeof t == "function") return (
      /** @type {() => void} */
      t
    );
  });
}
function y0(e) {
  U === null && Gi(), rr(() => () => qt(e));
}
function _t(e, t, i, r) {
  var n;
  n = /** @type {V} */
  e[t];
  var s = (
    /** @type {V} */
    r
  ), d = true, b = false, p = () => (b = true, d && (d = false, s = /** @type {V} */
  r), s), h;
  h = () => {
    var l = (
      /** @type {V} */
      e[t]
    );
    return l === void 0 ? p() : (d = true, b = false, l);
  };
  var v = false, x = /* @__PURE__ */ Fi(n), o = /* @__PURE__ */ Ni(() => {
    var l = h(), a = I(x);
    return v ? (v = false, a) : x.v = l;
  });
  return function(l, a) {
    if (arguments.length > 0) {
      const u = a ? I(o) : l;
      return o.equals(u) || (v = true, Y(x, u), b && s !== void 0 && (s = u), qt(() => I(o))), l;
    }
    return I(o);
  };
}
function _0(e) {
  return new E0(e);
}
class E0 {
  /**
   * @param {ComponentConstructorOptions & {
   *  component: any;
   * }} options
   */
  constructor(t) {
    /** @type {any} */
    __privateAdd(this, _t2);
    /** @type {Record<string, any>} */
    __privateAdd(this, _e2);
    var _a2;
    var i = /* @__PURE__ */ new Map(), r = (s, d) => {
      var b = /* @__PURE__ */ Fi(d);
      return i.set(s, b), b;
    };
    const n = new Proxy(
      { ...t.props || {}, $$events: {} },
      {
        get(s, d) {
          return I(i.get(d) ?? r(d, Reflect.get(s, d)));
        },
        has(s, d) {
          return d === br ? true : (I(i.get(d) ?? r(d, Reflect.get(s, d))), Reflect.has(s, d));
        },
        set(s, d, b) {
          return Y(i.get(d) ?? r(d, b), b), Reflect.set(s, d, b);
        }
      }
    );
    __privateSet(this, _e2, (t.hydrate ? p0 : tr)(t.component, {
      target: t.target,
      anchor: t.anchor,
      props: n,
      context: t.context,
      intro: t.intro ?? false,
      recover: t.recover
    })), (!((_a2 = t == null ? void 0 : t.props) == null ? void 0 : _a2.$$host) || t.sync === false) && nt(), __privateSet(this, _t2, n.$$events);
    for (const s of Object.keys(__privateGet(this, _e2)))
      s === "$set" || s === "$destroy" || s === "$on" || Nt(this, s, {
        get() {
          return __privateGet(this, _e2)[s];
        },
        /** @param {any} value */
        set(d) {
          __privateGet(this, _e2)[s] = d;
        },
        enumerable: true
      });
    __privateGet(this, _e2).$set = /** @param {Record<string, any>} next */
    (s) => {
      Object.assign(n, s);
    }, __privateGet(this, _e2).$destroy = () => {
      b0(__privateGet(this, _e2));
    };
  }
  /** @param {Record<string, any>} props */
  $set(t) {
    __privateGet(this, _e2).$set(t);
  }
  /**
   * @param {string} event
   * @param {(...args: any[]) => any} callback
   * @returns {any}
   */
  $on(t, i) {
    __privateGet(this, _t2)[t] = __privateGet(this, _t2)[t] || [];
    const r = (...n) => i.call(this, ...n);
    return __privateGet(this, _t2)[t].push(r), () => {
      __privateGet(this, _t2)[t] = __privateGet(this, _t2)[t].filter(
        /** @param {any} fn */
        (n) => n !== r
      );
    };
  }
  $destroy() {
    __privateGet(this, _e2).$destroy();
  }
}
_t2 = new WeakMap();
_e2 = new WeakMap();
let nr;
typeof HTMLElement == "function" && (nr = class extends HTMLElement {
  /**
   * @param {*} $$componentCtor
   * @param {*} $$slots
   * @param {*} use_shadow_dom
   */
  constructor(e, t, i) {
    super();
    /** The Svelte component constructor */
    __publicField(this, "$$ctor");
    /** Slots */
    __publicField(this, "$$s");
    /** @type {any} The Svelte component instance */
    __publicField(this, "$$c");
    /** Whether or not the custom element is connected */
    __publicField(this, "$$cn", false);
    /** @type {Record<string, any>} Component props data */
    __publicField(this, "$$d", {});
    /** `true` if currently in the process of reflecting component props back to attributes */
    __publicField(this, "$$r", false);
    /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
    __publicField(this, "$$p_d", {});
    /** @type {Record<string, EventListenerOrEventListenerObject[]>} Event listeners */
    __publicField(this, "$$l", {});
    /** @type {Map<EventListenerOrEventListenerObject, Function>} Event listener unsubscribe functions */
    __publicField(this, "$$l_u", /* @__PURE__ */ new Map());
    /** @type {any} The managed render effect for reflecting attributes */
    __publicField(this, "$$me");
    this.$$ctor = e, this.$$s = t, i && this.attachShadow({ mode: "open" });
  }
  /**
   * @param {string} type
   * @param {EventListenerOrEventListenerObject} listener
   * @param {boolean | AddEventListenerOptions} [options]
   */
  addEventListener(e, t, i) {
    if (this.$$l[e] = this.$$l[e] || [], this.$$l[e].push(t), this.$$c) {
      const r = this.$$c.$on(e, t);
      this.$$l_u.set(t, r);
    }
    super.addEventListener(e, t, i);
  }
  /**
   * @param {string} type
   * @param {EventListenerOrEventListenerObject} listener
   * @param {boolean | AddEventListenerOptions} [options]
   */
  removeEventListener(e, t, i) {
    if (super.removeEventListener(e, t, i), this.$$c) {
      const r = this.$$l_u.get(t);
      r && (r(), this.$$l_u.delete(t));
    }
  }
  async connectedCallback() {
    if (this.$$cn = true, !this.$$c) {
      let e = function(r) {
        return (n) => {
          const s = document.createElement("slot");
          r !== "default" && (s.name = r), er(n, s);
        };
      };
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const t = {}, i = C0(this);
      for (const r of this.$$s)
        r in i && (r === "default" && !this.$$d.children ? (this.$$d.children = e(r), t.default = true) : t[r] = e(r));
      for (const r of this.attributes) {
        const n = this.$$g_p(r.name);
        n in this.$$d || (this.$$d[n] = Dt(n, r.value, this.$$p_d, "toProp"));
      }
      for (const r in this.$$p_d)
        !(r in this.$$d) && this[r] !== void 0 && (this.$$d[r] = this[r], delete this[r]);
      this.$$c = _0({
        component: this.$$ctor,
        target: this.shadowRoot || this,
        props: {
          ...this.$$d,
          $$slots: t,
          $$host: this
        }
      }), this.$$me = e0(() => {
        Hi(() => {
          var _a2;
          this.$$r = true;
          for (const r of Rt(this.$$c)) {
            if (!((_a2 = this.$$p_d[r]) == null ? void 0 : _a2.reflect)) continue;
            this.$$d[r] = this.$$c[r];
            const n = Dt(
              r,
              this.$$d[r],
              this.$$p_d,
              "toAttribute"
            );
            n == null ? this.removeAttribute(this.$$p_d[r].attribute || r) : this.setAttribute(this.$$p_d[r].attribute || r, n);
          }
          this.$$r = false;
        });
      });
      for (const r in this.$$l)
        for (const n of this.$$l[r]) {
          const s = this.$$c.$on(r, n);
          this.$$l_u.set(n, s);
        }
      this.$$l = {};
    }
  }
  // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
  // and setting attributes through setAttribute etc, this is helpful
  /**
   * @param {string} attr
   * @param {string} _oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(e, t, i) {
    var _a2;
    this.$$r || (e = this.$$g_p(e), this.$$d[e] = Dt(e, i, this.$$p_d, "toProp"), (_a2 = this.$$c) == null ? void 0 : _a2.$set({ [e]: this.$$d[e] }));
  }
  disconnectedCallback() {
    this.$$cn = false, Promise.resolve().then(() => {
      !this.$$cn && this.$$c && (this.$$c.$destroy(), this.$$me(), this.$$c = void 0);
    });
  }
  /**
   * @param {string} attribute_name
   */
  $$g_p(e) {
    return Rt(this.$$p_d).find(
      (t) => this.$$p_d[t].attribute === e || !this.$$p_d[t].attribute && t.toLowerCase() === e
    ) || e;
  }
});
function Dt(e, t, i, r) {
  var _a2;
  const n = (_a2 = i[e]) == null ? void 0 : _a2.type;
  if (t = n === "Boolean" && typeof t != "boolean" ? t != null : t, !r || !i[e])
    return t;
  if (r === "toAttribute")
    switch (n) {
      case "Object":
      case "Array":
        return t == null ? null : JSON.stringify(t);
      case "Boolean":
        return t ? "" : null;
      case "Number":
        return t ?? null;
      default:
        return t;
    }
  else
    switch (n) {
      case "Object":
      case "Array":
        return t && JSON.parse(t);
      case "Boolean":
        return t;
      // conversion already handled above
      case "Number":
        return t != null ? +t : t;
      default:
        return t;
    }
}
function C0(e) {
  const t = {};
  return e.childNodes.forEach((i) => {
    t[
      /** @type {Element} node */
      i.slot || "default"
    ] = true;
  }), t;
}
function k0(e, t, i, r, n, s) {
  let d = class extends nr {
    constructor() {
      super(e, i, n), this.$$p_d = t;
    }
    static get observedAttributes() {
      return Rt(t).map(
        (b) => (t[b].attribute || b).toLowerCase()
      );
    }
  };
  return Rt(t).forEach((b) => {
    Nt(d.prototype, b, {
      get() {
        return this.$$c && b in this.$$c ? this.$$c[b] : this.$$d[b];
      },
      set(p) {
        var _a2;
        p = Dt(b, p, t), this.$$d[b] = p;
        var h = this.$$c;
        if (h) {
          var v = (_a2 = Ve(h, b)) == null ? void 0 : _a2.get;
          v ? h[b] = p : h.$set({ [b]: p });
        }
      }
    });
  }), r.forEach((b) => {
    Nt(d.prototype, b, {
      get() {
        var _a2;
        return (_a2 = this.$$c) == null ? void 0 : _a2[b];
      }
    });
  }), s && (d = s(d)), e.element = /** @type {any} */
  d, d;
}
class D0 {
  constructor() {
    __publicField(this, "verbose", false);
  }
  info(t) {
    this.verbose && console.log(t);
  }
  error(t, i) {
    this.verbose && console.error(t, i);
  }
}
const O = new D0();
function S0(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var st = { exports: {} }, A0 = st.exports, gi;
function F0() {
  return gi || (gi = 1, function(e, t) {
    (function(i, r) {
      var n = "1.0.40", s = "", d = "?", b = "function", p = "undefined", h = "object", v = "string", x = "major", o = "model", l = "name", a = "type", u = "vendor", f = "version", B = "architecture", T = "console", g = "mobile", _ = "tablet", K = "smarttv", H = "wearable", Ee = "embedded", Ne = 500, ce = "Amazon", Ce = "Apple", ft = "ASUS", xt = "BlackBerry", oe = "Browser", de = "Chrome", Ye = "Edge", Z = "Firefox", fe = "Google", ht = "Huawei", Ge = "LG", Xe = "Microsoft", pt = "Motorola", ke = "Opera", xe = "Samsung", bt = "Sharp", Be = "Sony", Le = "Xiaomi", Qe = "Zebra", vt = "Facebook", Ze = "Chromium OS", Je = "Mac OS", wt = " Browser", Ht = function(k, S) {
        var y = {};
        for (var F in k)
          S[F] && S[F].length % 2 === 0 ? y[F] = S[F].concat(k[F]) : y[F] = k[F];
        return y;
      }, $e = function(k) {
        for (var S = {}, y = 0; y < k.length; y++)
          S[k[y].toUpperCase()] = k[y];
        return S;
      }, et = function(k, S) {
        return typeof k === v ? J(S).indexOf(J(k)) !== -1 : false;
      }, J = function(k) {
        return k.toLowerCase();
      }, De = function(k) {
        return typeof k === v ? k.replace(/[^\d\.]/g, s).split(".")[0] : r;
      }, Te = function(k, S) {
        if (typeof k === v)
          return k = k.replace(/^\s\s*/, s), typeof S === p ? k : k.substring(0, Ne);
      }, Se = function(k, S) {
        for (var y = 0, F, X, z, A, m, M; y < S.length && !m; ) {
          var se = S[y], tt = S[y + 1];
          for (F = X = 0; F < se.length && !m && se[F]; )
            if (m = se[F++].exec(k), m)
              for (z = 0; z < tt.length; z++)
                M = m[++X], A = tt[z], typeof A === h && A.length > 0 ? A.length === 2 ? typeof A[1] == b ? this[A[0]] = A[1].call(this, M) : this[A[0]] = A[1] : A.length === 3 ? typeof A[1] === b && !(A[1].exec && A[1].test) ? this[A[0]] = M ? A[1].call(this, M, A[2]) : r : this[A[0]] = M ? M.replace(A[1], A[2]) : r : A.length === 4 && (this[A[0]] = M ? A[3].call(this, M.replace(A[1], A[2])) : r) : this[A] = M || r;
          y += 2;
        }
      }, Ke = function(k, S) {
        for (var y in S)
          if (typeof S[y] === h && S[y].length > 0) {
            for (var F = 0; F < S[y].length; F++)
              if (et(S[y][F], k))
                return y === d ? r : y;
          } else if (et(S[y], k))
            return y === d ? r : y;
        return S.hasOwnProperty("*") ? S["*"] : k;
      }, Vt = {
        "1.0": "/8",
        "1.2": "/1",
        "1.3": "/3",
        "2.0": "/412",
        "2.0.2": "/416",
        "2.0.3": "/417",
        "2.0.4": "/419",
        "?": "/"
      }, he = {
        ME: "4.90",
        "NT 3.11": "NT3.51",
        "NT 4.0": "NT4.0",
        2e3: "NT 5.0",
        XP: ["NT 5.1", "NT 5.2"],
        Vista: "NT 6.0",
        7: "NT 6.1",
        8: "NT 6.2",
        "8.1": "NT 6.3",
        10: ["NT 6.4", "NT 10.0"],
        RT: "ARM"
      }, mt = {
        browser: [
          [
            /\b(?:crmo|crios)\/([\w\.]+)/i
            // Chrome for Android/iOS
          ],
          [f, [l, "Chrome"]],
          [
            /edg(?:e|ios|a)?\/([\w\.]+)/i
            // Microsoft Edge
          ],
          [f, [l, "Edge"]],
          [
            // Presto based
            /(opera mini)\/([-\w\.]+)/i,
            // Opera Mini
            /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
            // Opera Mobi/Tablet
            /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i
            // Opera
          ],
          [l, f],
          [
            /opios[\/ ]+([\w\.]+)/i
            // Opera mini on iphone >= 8.0
          ],
          [f, [l, ke + " Mini"]],
          [
            /\bop(?:rg)?x\/([\w\.]+)/i
            // Opera GX
          ],
          [f, [l, ke + " GX"]],
          [
            /\bopr\/([\w\.]+)/i
            // Opera Webkit
          ],
          [f, [l, ke]],
          [
            // Mixed
            /\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i
            // Baidu
          ],
          [f, [l, "Baidu"]],
          [
            /\b(?:mxbrowser|mxios|myie2)\/?([-\w\.]*)\b/i
            // Maxthon
          ],
          [f, [l, "Maxthon"]],
          [
            /(kindle)\/([\w\.]+)/i,
            // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer|sleipnir)[\/ ]?([\w\.]*)/i,
            // Lunascape/Maxthon/Netfront/Jasmine/Blazer/Sleipnir
            // Trident based
            /(avant|iemobile|slim(?:browser|boat|jet))[\/ ]?([\d\.]*)/i,
            // Avant/IEMobile/SlimBrowser/SlimBoat/Slimjet
            /(?:ms|\()(ie) ([\w\.]+)/i,
            // Internet Explorer
            // Blink/Webkit/KHTML based                                         // Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
            /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|duckduckgo|klar|helio|(?=comodo_)?dragon)\/([-\w\.]+)/i,
            // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ//Vivaldi/DuckDuckGo/Klar/Helio/Dragon
            /(heytap|ovi|115)browser\/([\d\.]+)/i,
            // HeyTap/Ovi/115
            /(weibo)__([\d\.]+)/i
            // Weibo
          ],
          [l, f],
          [
            /quark(?:pc)?\/([-\w\.]+)/i
            // Quark
          ],
          [f, [l, "Quark"]],
          [
            /\bddg\/([\w\.]+)/i
            // DuckDuckGo
          ],
          [f, [l, "DuckDuckGo"]],
          [
            /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i
            // UCBrowser
          ],
          [f, [l, "UC" + oe]],
          [
            /microm.+\bqbcore\/([\w\.]+)/i,
            // WeChat Desktop for Windows Built-in Browser
            /\bqbcore\/([\w\.]+).+microm/i,
            /micromessenger\/([\w\.]+)/i
            // WeChat
          ],
          [f, [l, "WeChat"]],
          [
            /konqueror\/([\w\.]+)/i
            // Konqueror
          ],
          [f, [l, "Konqueror"]],
          [
            /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i
            // IE11
          ],
          [f, [l, "IE"]],
          [
            /ya(?:search)?browser\/([\w\.]+)/i
            // Yandex
          ],
          [f, [l, "Yandex"]],
          [
            /slbrowser\/([\w\.]+)/i
            // Smart Lenovo Browser
          ],
          [f, [l, "Smart Lenovo " + oe]],
          [
            /(avast|avg)\/([\w\.]+)/i
            // Avast/AVG Secure Browser
          ],
          [[l, /(.+)/, "$1 Secure " + oe], f],
          [
            /\bfocus\/([\w\.]+)/i
            // Firefox Focus
          ],
          [f, [l, Z + " Focus"]],
          [
            /\bopt\/([\w\.]+)/i
            // Opera Touch
          ],
          [f, [l, ke + " Touch"]],
          [
            /coc_coc\w+\/([\w\.]+)/i
            // Coc Coc Browser
          ],
          [f, [l, "Coc Coc"]],
          [
            /dolfin\/([\w\.]+)/i
            // Dolphin
          ],
          [f, [l, "Dolphin"]],
          [
            /coast\/([\w\.]+)/i
            // Opera Coast
          ],
          [f, [l, ke + " Coast"]],
          [
            /miuibrowser\/([\w\.]+)/i
            // MIUI Browser
          ],
          [f, [l, "MIUI" + wt]],
          [
            /fxios\/([\w\.-]+)/i
            // Firefox for iOS
          ],
          [f, [l, Z]],
          [
            /\bqihoobrowser\/?([\w\.]*)/i
            // 360
          ],
          [f, [l, "360"]],
          [
            /\b(qq)\/([\w\.]+)/i
            // QQ
          ],
          [[l, /(.+)/, "$1Browser"], f],
          [
            /(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i
          ],
          [[l, /(.+)/, "$1" + wt], f],
          [
            // Oculus/Sailfish/HuaweiBrowser/VivoBrowser/PicoBrowser
            /samsungbrowser\/([\w\.]+)/i
            // Samsung Internet
          ],
          [f, [l, xe + " Internet"]],
          [
            /metasr[\/ ]?([\d\.]+)/i
            // Sogou Explorer
          ],
          [f, [l, "Sogou Explorer"]],
          [
            /(sogou)mo\w+\/([\d\.]+)/i
            // Sogou Mobile
          ],
          [[l, "Sogou Mobile"], f],
          [
            /(electron)\/([\w\.]+) safari/i,
            // Electron-based App
            /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
            // Tesla
            /m?(qqbrowser|2345(?=browser|chrome|explorer))\w*[\/ ]?v?([\w\.]+)/i
            // QQ/2345
          ],
          [l, f],
          [
            /(lbbrowser|rekonq)/i,
            // LieBao Browser/Rekonq
            /\[(linkedin)app\]/i
            // LinkedIn App for iOS & Android
          ],
          [l],
          [
            /ome\/([\w\.]+) \w* ?(iron) saf/i,
            // Iron
            /ome\/([\w\.]+).+qihu (360)[es]e/i
            // 360
          ],
          [f, l],
          [
            // WebView
            /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i
            // Facebook App for iOS & Android
          ],
          [[l, vt], f],
          [
            /(Klarna)\/([\w\.]+)/i,
            // Klarna Shopping Browser for iOS & Android
            /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,
            // Kakao App
            /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,
            // Naver InApp
            /safari (line)\/([\w\.]+)/i,
            // Line App for iOS
            /\b(line)\/([\w\.]+)\/iab/i,
            // Line App for Android
            /(alipay)client\/([\w\.]+)/i,
            // Alipay
            /(twitter)(?:and| f.+e\/([\w\.]+))/i,
            // Twitter
            /(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i
            // Chromium/Instagram/Snapchat
          ],
          [l, f],
          [
            /\bgsa\/([\w\.]+) .*safari\//i
            // Google Search Appliance on iOS
          ],
          [f, [l, "GSA"]],
          [
            /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i
            // TikTok
          ],
          [f, [l, "TikTok"]],
          [
            /headlesschrome(?:\/([\w\.]+)| )/i
            // Chrome Headless
          ],
          [f, [l, de + " Headless"]],
          [
            / wv\).+(chrome)\/([\w\.]+)/i
            // Chrome WebView
          ],
          [[l, de + " WebView"], f],
          [
            /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
            // Android Browser
          ],
          [f, [l, "Android " + oe]],
          [
            /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i
            // Chrome/OmniWeb/Arora/Tizen/Nokia
          ],
          [l, f],
          [
            /version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i
            // Mobile Safari
          ],
          [f, [l, "Mobile Safari"]],
          [
            /version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i
            // Safari & Safari Mobile
          ],
          [f, l],
          [
            /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i
            // Safari < 3.0
          ],
          [l, [f, Ke, Vt]],
          [
            /(webkit|khtml)\/([\w\.]+)/i
          ],
          [l, f],
          [
            // Gecko based
            /(navigator|netscape\d?)\/([-\w\.]+)/i
            // Netscape
          ],
          [[l, "Netscape"], f],
          [
            /(wolvic|librewolf)\/([\w\.]+)/i
            // Wolvic/LibreWolf
          ],
          [l, f],
          [
            /mobile vr; rv:([\w\.]+)\).+firefox/i
            // Firefox Reality
          ],
          [f, [l, Z + " Reality"]],
          [
            /ekiohf.+(flow)\/([\w\.]+)/i,
            // Flow
            /(swiftfox)/i,
            // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror)[\/ ]?([\w\.\+]+)/i,
            // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
            /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
            // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(firefox)\/([\w\.]+)/i,
            // Other Firefox-based
            /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,
            // Mozilla
            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
            // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Obigo/Mosaic/Go/ICE/UP.Browser
            /(links) \(([\w\.]+)/i
            // Links
          ],
          [l, [f, /_/g, "."]],
          [
            /(cobalt)\/([\w\.]+)/i
            // Cobalt
          ],
          [l, [f, /master.|lts./, ""]]
        ],
        cpu: [
          [
            /(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i
            // AMD64 (x64)
          ],
          [[B, "amd64"]],
          [
            /(ia32(?=;))/i
            // IA32 (quicktime)
          ],
          [[B, J]],
          [
            /((?:i[346]|x)86)[;\)]/i
            // IA32 (x86)
          ],
          [[B, "ia32"]],
          [
            /\b(aarch64|arm(v?8e?l?|_?64))\b/i
            // ARM64
          ],
          [[B, "arm64"]],
          [
            /\b(arm(?:v[67])?ht?n?[fl]p?)\b/i
            // ARMHF
          ],
          [[B, "armhf"]],
          [
            // PocketPC mistakenly identified as PowerPC
            /windows (ce|mobile); ppc;/i
          ],
          [[B, "arm"]],
          [
            /((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i
            // PowerPC
          ],
          [[B, /ower/, s, J]],
          [
            /(sun4\w)[;\)]/i
            // SPARC
          ],
          [[B, "sparc"]],
          [
            /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i
            // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
          ],
          [[B, J]]
        ],
        device: [
          [
            //////////////////////////
            // MOBILES & TABLETS
            /////////////////////////
            // Samsung
            /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
          ],
          [o, [u, xe], [a, _]],
          [
            /\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
            /samsung[- ]((?!sm-[lr])[-\w]+)/i,
            /sec-(sgh\w+)/i
          ],
          [o, [u, xe], [a, g]],
          [
            // Apple
            /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i
            // iPod/iPhone
          ],
          [o, [u, Ce], [a, g]],
          [
            /\((ipad);[-\w\),; ]+apple/i,
            // iPad
            /applecoremedia\/[\w\.]+ \((ipad)/i,
            /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
          ],
          [o, [u, Ce], [a, _]],
          [
            /(macintosh);/i
          ],
          [o, [u, Ce]],
          [
            // Sharp
            /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
          ],
          [o, [u, bt], [a, g]],
          [
            // Honor
            /(?:honor)([-\w ]+)[;\)]/i
          ],
          [o, [u, "Honor"], [a, g]],
          [
            // Huawei
            /\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i
          ],
          [o, [u, ht], [a, _]],
          [
            /(?:huawei)([-\w ]+)[;\)]/i,
            /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
          ],
          [o, [u, ht], [a, g]],
          [
            // Xiaomi
            /\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,
            // Xiaomi POCO
            /\b; (\w+) build\/hm\1/i,
            // Xiaomi Hongmi 'numeric' models
            /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,
            // Xiaomi Hongmi
            /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,
            // Xiaomi Redmi
            /oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,
            // Xiaomi Redmi 'numeric' models
            /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite|pro)?)(?: bui|\))/i
            // Xiaomi Mi
          ],
          [[o, /_/g, " "], [u, Le], [a, g]],
          [
            /oid[^\)]+; (2\d{4}(283|rpbf)[cgl])( bui|\))/i,
            // Redmi Pad
            /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i
            // Mi Pad tablets
          ],
          [[o, /_/g, " "], [u, Le], [a, _]],
          [
            // OPPO
            /; (\w+) bui.+ oppo/i,
            /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
          ],
          [o, [u, "OPPO"], [a, g]],
          [
            /\b(opd2\d{3}a?) bui/i
          ],
          [o, [u, "OPPO"], [a, _]],
          [
            // Vivo
            /vivo (\w+)(?: bui|\))/i,
            /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
          ],
          [o, [u, "Vivo"], [a, g]],
          [
            // Realme
            /\b(rmx[1-3]\d{3})(?: bui|;|\))/i
          ],
          [o, [u, "Realme"], [a, g]],
          [
            // Motorola
            /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
            /\bmot(?:orola)?[- ](\w*)/i,
            /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
          ],
          [o, [u, pt], [a, g]],
          [
            /\b(mz60\d|xoom[2 ]{0,2}) build\//i
          ],
          [o, [u, pt], [a, _]],
          [
            // LG
            /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
          ],
          [o, [u, Ge], [a, _]],
          [
            /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
            /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
            /\blg-?([\d\w]+) bui/i
          ],
          [o, [u, Ge], [a, g]],
          [
            // Lenovo
            /(ideatab[-\w ]+)/i,
            /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i
          ],
          [o, [u, "Lenovo"], [a, _]],
          [
            // Nokia
            /(?:maemo|nokia).*(n900|lumia \d+)/i,
            /nokia[-_ ]?([-\w\.]*)/i
          ],
          [[o, /_/g, " "], [u, "Nokia"], [a, g]],
          [
            // Google
            /(pixel c)\b/i
            // Google Pixel C
          ],
          [o, [u, fe], [a, _]],
          [
            /droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i
            // Google Pixel
          ],
          [o, [u, fe], [a, g]],
          [
            // Sony
            /droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
          ],
          [o, [u, Be], [a, g]],
          [
            /sony tablet [ps]/i,
            /\b(?:sony)?sgp\w+(?: bui|\))/i
          ],
          [[o, "Xperia Tablet"], [u, Be], [a, _]],
          [
            // OnePlus
            / (kb2005|in20[12]5|be20[12][59])\b/i,
            /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
          ],
          [o, [u, "OnePlus"], [a, g]],
          [
            // Amazon
            /(alexa)webm/i,
            /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,
            // Kindle Fire without Silk / Echo Show
            /(kf[a-z]+)( bui|\)).+silk\//i
            // Kindle Fire HD
          ],
          [o, [u, ce], [a, _]],
          [
            /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
            // Fire Phone
          ],
          [[o, /(.+)/g, "Fire Phone $1"], [u, ce], [a, g]],
          [
            // BlackBerry
            /(playbook);[-\w\),; ]+(rim)/i
            // BlackBerry PlayBook
          ],
          [o, u, [a, _]],
          [
            /\b((?:bb[a-f]|st[hv])100-\d)/i,
            /\(bb10; (\w+)/i
            // BlackBerry 10
          ],
          [o, [u, xt], [a, g]],
          [
            // Asus
            /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
          ],
          [o, [u, ft], [a, _]],
          [
            / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
          ],
          [o, [u, ft], [a, g]],
          [
            // HTC
            /(nexus 9)/i
            // HTC Nexus 9
          ],
          [o, [u, "HTC"], [a, _]],
          [
            /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
            // HTC
            // ZTE
            /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
            /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i
            // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
          ],
          [u, [o, /_/g, " "], [a, g]],
          [
            // TCL
            /droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])\w*(\)| bui)/i
          ],
          [o, [u, "TCL"], [a, _]],
          [
            // itel
            /(itel) ((\w+))/i
          ],
          [[u, J], o, [a, Ke, { tablet: ["p10001l", "w7001"], "*": "mobile" }]],
          [
            // Acer
            /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
          ],
          [o, [u, "Acer"], [a, _]],
          [
            // Meizu
            /droid.+; (m[1-5] note) bui/i,
            /\bmz-([-\w]{2,})/i
          ],
          [o, [u, "Meizu"], [a, g]],
          [
            // Ulefone
            /; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i
          ],
          [o, [u, "Ulefone"], [a, g]],
          [
            // Energizer
            /; (energy ?\w+)(?: bui|\))/i,
            /; energizer ([\w ]+)(?: bui|\))/i
          ],
          [o, [u, "Energizer"], [a, g]],
          [
            // Cat
            /; cat (b35);/i,
            /; (b15q?|s22 flip|s48c|s62 pro)(?: bui|\))/i
          ],
          [o, [u, "Cat"], [a, g]],
          [
            // Smartfren
            /((?:new )?andromax[\w- ]+)(?: bui|\))/i
          ],
          [o, [u, "Smartfren"], [a, g]],
          [
            // Nothing
            /droid.+; (a(?:015|06[35]|142p?))/i
          ],
          [o, [u, "Nothing"], [a, g]],
          [
            // MIXED
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron|infinix|tecno|micromax|advan)[-_ ]?([-\w]*)/i,
            // BlackBerry/BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron/Infinix/Tecno/Micromax/Advan
            /; (imo) ((?!tab)[\w ]+?)(?: bui|\))/i,
            // IMO
            /(hp) ([\w ]+\w)/i,
            // HP iPAQ
            /(asus)-?(\w+)/i,
            // Asus
            /(microsoft); (lumia[\w ]+)/i,
            // Microsoft Lumia
            /(lenovo)[-_ ]?([-\w]+)/i,
            // Lenovo
            /(jolla)/i,
            // Jolla
            /(oppo) ?([\w ]+) bui/i
            // OPPO
          ],
          [u, o, [a, g]],
          [
            /(imo) (tab \w+)/i,
            // IMO
            /(kobo)\s(ereader|touch)/i,
            // Kobo
            /(archos) (gamepad2?)/i,
            // Archos
            /(hp).+(touchpad(?!.+tablet)|tablet)/i,
            // HP TouchPad
            /(kindle)\/([\w\.]+)/i,
            // Kindle
            /(nook)[\w ]+build\/(\w+)/i,
            // Nook
            /(dell) (strea[kpr\d ]*[\dko])/i,
            // Dell Streak
            /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,
            // Le Pan Tablets
            /(trinity)[- ]*(t\d{3}) bui/i,
            // Trinity Tablets
            /(gigaset)[- ]+(q\w{1,9}) bui/i,
            // Gigaset Tablets
            /(vodafone) ([\w ]+)(?:\)| bui)/i
            // Vodafone
          ],
          [u, o, [a, _]],
          [
            /(surface duo)/i
            // Surface Duo
          ],
          [o, [u, Xe], [a, _]],
          [
            /droid [\d\.]+; (fp\du?)(?: b|\))/i
            // Fairphone
          ],
          [o, [u, "Fairphone"], [a, g]],
          [
            /(u304aa)/i
            // AT&T
          ],
          [o, [u, "AT&T"], [a, g]],
          [
            /\bsie-(\w*)/i
            // Siemens
          ],
          [o, [u, "Siemens"], [a, g]],
          [
            /\b(rct\w+) b/i
            // RCA Tablets
          ],
          [o, [u, "RCA"], [a, _]],
          [
            /\b(venue[\d ]{2,7}) b/i
            // Dell Venue Tablets
          ],
          [o, [u, "Dell"], [a, _]],
          [
            /\b(q(?:mv|ta)\w+) b/i
            // Verizon Tablet
          ],
          [o, [u, "Verizon"], [a, _]],
          [
            /\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i
            // Barnes & Noble Tablet
          ],
          [o, [u, "Barnes & Noble"], [a, _]],
          [
            /\b(tm\d{3}\w+) b/i
          ],
          [o, [u, "NuVision"], [a, _]],
          [
            /\b(k88) b/i
            // ZTE K Series Tablet
          ],
          [o, [u, "ZTE"], [a, _]],
          [
            /\b(nx\d{3}j) b/i
            // ZTE Nubia
          ],
          [o, [u, "ZTE"], [a, g]],
          [
            /\b(gen\d{3}) b.+49h/i
            // Swiss GEN Mobile
          ],
          [o, [u, "Swiss"], [a, g]],
          [
            /\b(zur\d{3}) b/i
            // Swiss ZUR Tablet
          ],
          [o, [u, "Swiss"], [a, _]],
          [
            /\b((zeki)?tb.*\b) b/i
            // Zeki Tablets
          ],
          [o, [u, "Zeki"], [a, _]],
          [
            /\b([yr]\d{2}) b/i,
            /\b(dragon[- ]+touch |dt)(\w{5}) b/i
            // Dragon Touch Tablet
          ],
          [[u, "Dragon Touch"], o, [a, _]],
          [
            /\b(ns-?\w{0,9}) b/i
            // Insignia Tablets
          ],
          [o, [u, "Insignia"], [a, _]],
          [
            /\b((nxa|next)-?\w{0,9}) b/i
            // NextBook Tablets
          ],
          [o, [u, "NextBook"], [a, _]],
          [
            /\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i
            // Voice Xtreme Phones
          ],
          [[u, "Voice"], o, [a, g]],
          [
            /\b(lvtel\-)?(v1[12]) b/i
            // LvTel Phones
          ],
          [[u, "LvTel"], o, [a, g]],
          [
            /\b(ph-1) /i
            // Essential PH-1
          ],
          [o, [u, "Essential"], [a, g]],
          [
            /\b(v(100md|700na|7011|917g).*\b) b/i
            // Envizen Tablets
          ],
          [o, [u, "Envizen"], [a, _]],
          [
            /\b(trio[-\w\. ]+) b/i
            // MachSpeed Tablets
          ],
          [o, [u, "MachSpeed"], [a, _]],
          [
            /\btu_(1491) b/i
            // Rotor Tablets
          ],
          [o, [u, "Rotor"], [a, _]],
          [
            /(shield[\w ]+) b/i
            // Nvidia Shield Tablets
          ],
          [o, [u, "Nvidia"], [a, _]],
          [
            /(sprint) (\w+)/i
            // Sprint Phones
          ],
          [u, o, [a, g]],
          [
            /(kin\.[onetw]{3})/i
            // Microsoft Kin
          ],
          [[o, /\./g, " "], [u, Xe], [a, g]],
          [
            /droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
            // Zebra
          ],
          [o, [u, Qe], [a, _]],
          [
            /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
          ],
          [o, [u, Qe], [a, g]],
          [
            ///////////////////
            // SMARTTVS
            ///////////////////
            /smart-tv.+(samsung)/i
            // Samsung
          ],
          [u, [a, K]],
          [
            /hbbtv.+maple;(\d+)/i
          ],
          [[o, /^/, "SmartTV"], [u, xe], [a, K]],
          [
            /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i
            // LG SmartTV
          ],
          [[u, Ge], [a, K]],
          [
            /(apple) ?tv/i
            // Apple TV
          ],
          [u, [o, Ce + " TV"], [a, K]],
          [
            /crkey/i
            // Google Chromecast
          ],
          [[o, de + "cast"], [u, fe], [a, K]],
          [
            /droid.+aft(\w+)( bui|\))/i
            // Fire TV
          ],
          [o, [u, ce], [a, K]],
          [
            /\(dtv[\);].+(aquos)/i,
            /(aquos-tv[\w ]+)\)/i
            // Sharp
          ],
          [o, [u, bt], [a, K]],
          [
            /(bravia[\w ]+)( bui|\))/i
            // Sony
          ],
          [o, [u, Be], [a, K]],
          [
            /(mitv-\w{5}) bui/i
            // Xiaomi
          ],
          [o, [u, Le], [a, K]],
          [
            /Hbbtv.*(technisat) (.*);/i
            // TechniSAT
          ],
          [u, o, [a, K]],
          [
            /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
            // Roku
            /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i
            // HbbTV devices
          ],
          [[u, Te], [o, Te], [a, K]],
          [
            /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i
            // SmartTV from Unidentified Vendors
          ],
          [[a, K]],
          [
            ///////////////////
            // CONSOLES
            ///////////////////
            /(ouya)/i,
            // Ouya
            /(nintendo) ([wids3utch]+)/i
            // Nintendo
          ],
          [u, o, [a, T]],
          [
            /droid.+; (shield) bui/i
            // Nvidia
          ],
          [o, [u, "Nvidia"], [a, T]],
          [
            /(playstation [345portablevi]+)/i
            // Playstation
          ],
          [o, [u, Be], [a, T]],
          [
            /\b(xbox(?: one)?(?!; xbox))[\); ]/i
            // Microsoft Xbox
          ],
          [o, [u, Xe], [a, T]],
          [
            ///////////////////
            // WEARABLES
            ///////////////////
            /\b(sm-[lr]\d\d[05][fnuw]?s?)\b/i
            // Samsung Galaxy Watch
          ],
          [o, [u, xe], [a, H]],
          [
            /((pebble))app/i
            // Pebble
          ],
          [u, o, [a, H]],
          [
            /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i
            // Apple Watch
          ],
          [o, [u, Ce], [a, H]],
          [
            /droid.+; (glass) \d/i
            // Google Glass
          ],
          [o, [u, fe], [a, H]],
          [
            /droid.+; (wt63?0{2,3})\)/i
          ],
          [o, [u, Qe], [a, H]],
          [
            ///////////////////
            // XR
            ///////////////////
            /droid.+; (glass) \d/i
            // Google Glass
          ],
          [o, [u, fe], [a, H]],
          [
            /(pico) (4|neo3(?: link|pro)?)/i
            // Pico
          ],
          [u, o, [a, H]],
          [
            /; (quest( \d| pro)?)/i
            // Oculus Quest
          ],
          [o, [u, vt], [a, H]],
          [
            ///////////////////
            // EMBEDDED
            ///////////////////
            /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i
            // Tesla
          ],
          [u, [a, Ee]],
          [
            /(aeobc)\b/i
            // Echo Dot
          ],
          [o, [u, ce], [a, Ee]],
          [
            ////////////////////
            // MIXED (GENERIC)
            ///////////////////
            /droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+? mobile safari/i
            // Android Phones from Unidentified Vendors
          ],
          [o, [a, g]],
          [
            /droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i
            // Android Tablets from Unidentified Vendors
          ],
          [o, [a, _]],
          [
            /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i
            // Unidentifiable Tablet
          ],
          [[a, _]],
          [
            /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i
            // Unidentifiable Mobile
          ],
          [[a, g]],
          [
            /(android[-\w\. ]{0,9});.+buil/i
            // Generic Android Device
          ],
          [o, [u, "Generic"]]
        ],
        engine: [
          [
            /windows.+ edge\/([\w\.]+)/i
            // EdgeHTML
          ],
          [f, [l, Ye + "HTML"]],
          [
            /(arkweb)\/([\w\.]+)/i
            // ArkWeb
          ],
          [l, f],
          [
            /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i
            // Blink
          ],
          [f, [l, "Blink"]],
          [
            /(presto)\/([\w\.]+)/i,
            // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna|servo)\/([\w\.]+)/i,
            // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna/Servo
            /ekioh(flow)\/([\w\.]+)/i,
            // Flow
            /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,
            // KHTML/Tasman/Links
            /(icab)[\/ ]([23]\.[\d\.]+)/i,
            // iCab
            /\b(libweb)/i
          ],
          [l, f],
          [
            /rv\:([\w\.]{1,9})\b.+(gecko)/i
            // Gecko
          ],
          [f, l]
        ],
        os: [
          [
            // Windows
            /microsoft (windows) (vista|xp)/i
            // Windows (iTunes)
          ],
          [l, f],
          [
            /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i
            // Windows Phone
          ],
          [l, [f, Ke, he]],
          [
            /windows nt 6\.2; (arm)/i,
            // Windows RT
            /windows[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i,
            /(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i
          ],
          [[f, Ke, he], [l, "Windows"]],
          [
            // iOS/macOS
            /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,
            // iOS
            /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
            /cfnetwork\/.+darwin/i
          ],
          [[f, /_/g, "."], [l, "iOS"]],
          [
            /(mac os x) ?([\w\. ]*)/i,
            /(macintosh|mac_powerpc\b)(?!.+haiku)/i
            // Mac OS
          ],
          [[l, Je], [f, /_/g, "."]],
          [
            // Mobile OSes
            /droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i
            // Android-x86/HarmonyOS
          ],
          [f, l],
          [
            // Android/WebOS/QNX/Bada/RIM/Maemo/MeeGo/Sailfish OS/OpenHarmony
            /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish|openharmony)[-\/ ]?([\w\.]*)/i,
            /(blackberry)\w*\/([\w\.]*)/i,
            // Blackberry
            /(tizen|kaios)[\/ ]([\w\.]+)/i,
            // Tizen/KaiOS
            /\((series40);/i
            // Series 40
          ],
          [l, f],
          [
            /\(bb(10);/i
            // BlackBerry 10
          ],
          [f, [l, xt]],
          [
            /(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i
            // Symbian
          ],
          [f, [l, "Symbian"]],
          [
            /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
            // Firefox OS
          ],
          [f, [l, Z + " OS"]],
          [
            /web0s;.+rt(tv)/i,
            /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i
            // WebOS
          ],
          [f, [l, "webOS"]],
          [
            /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i
            // watchOS
          ],
          [f, [l, "watchOS"]],
          [
            // Google Chromecast
            /crkey\/([\d\.]+)/i
            // Google Chromecast
          ],
          [f, [l, de + "cast"]],
          [
            /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i
            // Chromium OS
          ],
          [[l, Ze], f],
          [
            // Smart TVs
            /panasonic;(viera)/i,
            // Panasonic Viera
            /(netrange)mmh/i,
            // Netrange
            /(nettv)\/(\d+\.[\w\.]+)/i,
            // NetTV
            // Console
            /(nintendo|playstation) ([wids345portablevuch]+)/i,
            // Nintendo/Playstation
            /(xbox); +xbox ([^\);]+)/i,
            // Microsoft Xbox (360, One, X, S, Series X, Series S)
            // Other
            /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,
            // Joli/Palm
            /(mint)[\/\(\) ]?(\w*)/i,
            // Mint
            /(mageia|vectorlinux)[; ]/i,
            // Mageia/VectorLinux
            /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
            // Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware/Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus/Raspbian/Plan9/Minix/RISCOS/Contiki/Deepin/Manjaro/elementary/Sabayon/Linspire
            /(hurd|linux) ?([\w\.]*)/i,
            // Hurd/Linux
            /(gnu) ?([\w\.]*)/i,
            // GNU
            /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,
            // FreeBSD/NetBSD/OpenBSD/PC-BSD/GhostBSD/DragonFly
            /(haiku) (\w+)/i
            // Haiku
          ],
          [l, f],
          [
            /(sunos) ?([\w\.\d]*)/i
            // Solaris
          ],
          [[l, "Solaris"], f],
          [
            /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,
            // Solaris
            /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,
            // AIX
            /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i,
            // BeOS/OS2/AmigaOS/MorphOS/OpenVMS/Fuchsia/HP-UX/SerenityOS
            /(unix) ?([\w\.]*)/i
            // UNIX
          ],
          [l, f]
        ]
      }, V = function(k, S) {
        if (typeof k === h && (S = k, k = r), !(this instanceof V))
          return new V(k, S).getResult();
        var y = typeof i !== p && i.navigator ? i.navigator : r, F = k || (y && y.userAgent ? y.userAgent : s), X = y && y.userAgentData ? y.userAgentData : r, z = S ? Ht(mt, S) : mt, A = y && y.userAgent == F;
        return this.getBrowser = function() {
          var m = {};
          return m[l] = r, m[f] = r, Se.call(m, F, z.browser), m[x] = De(m[f]), A && y && y.brave && typeof y.brave.isBrave == b && (m[l] = "Brave"), m;
        }, this.getCPU = function() {
          var m = {};
          return m[B] = r, Se.call(m, F, z.cpu), m;
        }, this.getDevice = function() {
          var m = {};
          return m[u] = r, m[o] = r, m[a] = r, Se.call(m, F, z.device), A && !m[a] && X && X.mobile && (m[a] = g), A && m[o] == "Macintosh" && y && typeof y.standalone !== p && y.maxTouchPoints && y.maxTouchPoints > 2 && (m[o] = "iPad", m[a] = _), m;
        }, this.getEngine = function() {
          var m = {};
          return m[l] = r, m[f] = r, Se.call(m, F, z.engine), m;
        }, this.getOS = function() {
          var m = {};
          return m[l] = r, m[f] = r, Se.call(m, F, z.os), A && !m[l] && X && X.platform && X.platform != "Unknown" && (m[l] = X.platform.replace(/chrome os/i, Ze).replace(/macos/i, Je)), m;
        }, this.getResult = function() {
          return {
            ua: this.getUA(),
            browser: this.getBrowser(),
            engine: this.getEngine(),
            os: this.getOS(),
            device: this.getDevice(),
            cpu: this.getCPU()
          };
        }, this.getUA = function() {
          return F;
        }, this.setUA = function(m) {
          return F = typeof m === v && m.length > Ne ? Te(m, Ne) : m, this;
        }, this.setUA(F), this;
      };
      V.VERSION = n, V.BROWSER = $e([l, f, x]), V.CPU = $e([B]), V.DEVICE = $e([o, u, a, T, g, K, _, H, Ee]), V.ENGINE = V.OS = $e([l, f]), e.exports && (t = e.exports = V), t.UAParser = V;
      var pe = typeof i !== p && (i.jQuery || i.Zepto);
      if (pe && !pe.ua) {
        var Oe = new V();
        pe.ua = Oe.getResult(), pe.ua.get = function() {
          return Oe.getUA();
        }, pe.ua.set = function(k) {
          Oe.setUA(k);
          var S = Oe.getResult();
          for (var y in S)
            pe.ua[y] = S[y];
        };
      }
    })(typeof window == "object" ? window : A0);
  }(st, st.exports)), st.exports;
}
var R0 = F0();
const N0 = /* @__PURE__ */ S0(R0), rt = {
  windows: {
    blink: {
      "0x0001": "Escape",
      "0x0002": "Digit1",
      "0x0003": "Digit2",
      "0x0004": "Digit3",
      "0x0005": "Digit4",
      "0x0006": "Digit5",
      "0x0007": "Digit6",
      "0x0008": "Digit7",
      "0x0009": "Digit8",
      "0x000A": "Digit9",
      "0x000B": "Digit0",
      "0x000C": "Minus",
      "0x000D": "Equal",
      "0x000E": "Backspace",
      "0x000F": "Tab",
      "0x0010": "KeyQ",
      "0x0011": "KeyW",
      "0x0012": "KeyE",
      "0x0013": "KeyR",
      "0x0014": "KeyT",
      "0x0015": "KeyY",
      "0x0016": "KeyU",
      "0x0017": "KeyI",
      "0x0018": "KeyO",
      "0x0019": "KeyP",
      "0x001A": "BracketLeft",
      "0x001B": "BracketRight",
      "0x001C": "Enter",
      "0x001D": "ControlLeft",
      "0x001E": "KeyA",
      "0x001F": "KeyS",
      "0x0020": "KeyD",
      "0x0021": "KeyF",
      "0x0022": "KeyG",
      "0x0023": "KeyH",
      "0x0024": "KeyJ",
      "0x0025": "KeyK",
      "0x0026": "KeyL",
      "0x0027": "Semicolon",
      "0x0028": "Quote",
      "0x0029": "Backquote",
      "0x002A": "ShiftLeft",
      "0x002B": "Backslash",
      "0x002C": "KeyZ",
      "0x002D": "KeyX",
      "0x002E": "KeyC",
      "0x002F": "KeyV",
      "0x0030": "KeyB",
      "0x0031": "KeyN",
      "0x0032": "KeyM",
      "0x0033": "Comma",
      "0x0034": "Period",
      "0x0035": "Slash",
      "0x0036": "ShiftRight",
      "0x0037": "NumpadMultiply",
      "0x0038": "AltLeft",
      "0x0039": "Space",
      "0x003A": "CapsLock",
      "0x003B": "F1",
      "0x003C": "F2",
      "0x003D": "F3",
      "0x003E": "F4",
      "0x003F": "F5",
      "0x0040": "F6",
      "0x0041": "F7",
      "0x0042": "F8",
      "0x0043": "F9",
      "0x0044": "F10",
      "0x0045": "Pause",
      "0x0046": "ScrollLock",
      "0x0047": "Numpad7",
      "0x0048": "Numpad8",
      "0x0049": "Numpad9",
      "0x004A": "NumpadSubtract",
      "0x004B": "Numpad4",
      "0x004C": "Numpad5",
      "0x004D": "Numpad6",
      "0x004E": "NumpadAdd",
      "0x004F": "Numpad1",
      "0x0050": "Numpad2",
      "0x0051": "Numpad3",
      "0x0052": "Numpad0",
      "0x0053": "NumpadDecimal",
      "0x0056": "IntlBackslash",
      "0x0057": "F11",
      "0x0058": "F12",
      "0x0059": "NumpadEqual",
      "0x0064": "F13",
      "0x0065": "F14",
      "0x0066": "F15",
      "0x0067": "F16",
      "0x0068": "F17",
      "0x0069": "F18",
      "0x006A": "F19",
      "0x006B": "F20",
      "0x006C": "F21",
      "0x006D": "F22",
      "0x006E": "F23",
      "0x0070": "KanaMode",
      "0x0071": "Lang2",
      "0x0072": "Lang1",
      "0x0073": "IntlRo",
      "0x0076": "F24",
      "0x0077": "Lang4",
      "0x0078": "Lang3",
      "0x0079": "Convert",
      "0x007B": "NonConvert",
      "0x007D": "IntlYen",
      "0x007E": "NumpadComma",
      "0xE008": "Undo",
      "0xE00A": "Paste",
      "0xE010": "MediaTrackPrevious",
      "0xE017": "Cut",
      "0xE018": "Copy",
      "0xE019": "MediaTrackNext",
      "0xE01C": "NumpadEnter",
      "0xE01D": "ControlRight",
      "0xE020": "AudioVolumeMute",
      "0xE021": "LaunchApp2",
      "0xE022": "MediaPlayPause",
      "0xE024": "MediaStop",
      "0xE02C": "Eject",
      "0xE02E": "AudioVolumeDown",
      "0xE030": "AudioVolumeUp",
      "0xE032": "BrowserHome",
      "0xE035": "NumpadDivide",
      "0xE037": "PrintScreen",
      "0xE038": "AltRight",
      "0xE03B": "Help",
      "0xE045": "NumLock",
      "0xE046": "Pause",
      "0xE047": "Home",
      "0xE048": "ArrowUp",
      "0xE049": "PageUp",
      "0xE04B": "ArrowLeft",
      "0xE04D": "ArrowRight",
      "0xE04F": "End",
      "0xE050": "ArrowDown",
      "0xE051": "PageDown",
      "0xE052": "Insert",
      "0xE053": "Delete",
      "0xE05B": "MetaLeft",
      "0xE05C": "MetaRight",
      "0xE05D": "ContextMenu",
      "0xE05E": "Power",
      "0xE05F": "Sleep",
      "0xE063": "WakeUp",
      "0xE065": "BrowserSearch",
      "0xE066": "BrowserFavorites",
      "0xE067": "BrowserRefresh",
      "0xE068": "BrowserStop",
      "0xE069": "BrowserForward",
      "0xE06A": "BrowserBack",
      "0xE06B": "LaunchApp1",
      "0xE06C": "LaunchMail",
      "0xE06D": "MediaSelect"
    },
    gecko: {
      "0x0001": "Escape",
      "0x0002": "Digit1",
      "0x0003": "Digit2",
      "0x0004": "Digit3",
      "0x0005": "Digit4",
      "0x0006": "Digit5",
      "0x0007": "Digit6",
      "0x0008": "Digit7",
      "0x0009": "Digit8",
      "0x000A": "Digit9",
      "0x000B": "Digit0",
      "0x000C": "Minus",
      "0x000D": "Equal",
      "0x000E": "Backspace",
      "0x000F": "Tab",
      "0x0010": "KeyQ",
      "0x0011": "KeyW",
      "0x0012": "KeyE",
      "0x0013": "KeyR",
      "0x0014": "KeyT",
      "0x0015": "KeyY",
      "0x0016": "KeyU",
      "0x0017": "KeyI",
      "0x0018": "KeyO",
      "0x0019": "KeyP",
      "0x001A": "BracketLeft",
      "0x001B": "BracketRight",
      "0x001C": "Enter",
      "0x001D": "ControlLeft",
      "0x001E": "KeyA",
      "0x001F": "KeyS",
      "0x0020": "KeyD",
      "0x0021": "KeyF",
      "0x0022": "KeyG",
      "0x0023": "KeyH",
      "0x0024": "KeyJ",
      "0x0025": "KeyK",
      "0x0026": "KeyL",
      "0x0027": "Semicolon",
      "0x0028": "Quote",
      "0x0029": "Backquote",
      "0x002A": "ShiftLeft",
      "0x002B": "Backslash",
      "0x002C": "KeyZ",
      "0x002D": "KeyX",
      "0x002E": "KeyC",
      "0x002F": "KeyV",
      "0x0030": "KeyB",
      "0x0031": "KeyN",
      "0x0032": "KeyM",
      "0x0033": "Comma",
      "0x0034": "Period",
      "0x0035": "Slash",
      "0x0036": "ShiftRight",
      "0x0037": "NumpadMultiply",
      "0x0038": "AltLeft",
      "0x0039": "Space",
      "0x003A": "CapsLock",
      "0x003B": "F1",
      "0x003C": "F2",
      "0x003D": "F3",
      "0x003E": "F4",
      "0x003F": "F5",
      "0x0040": "F6",
      "0x0041": "F7",
      "0x0042": "F8",
      "0x0043": "F9",
      "0x0044": "F10",
      "0x0045": "Pause",
      "0x0046": "ScrollLock",
      "0x0047": "Numpad7",
      "0x0048": "Numpad8",
      "0x0049": "Numpad9",
      "0x004A": "NumpadSubtract",
      "0x004B": "Numpad4",
      "0x004C": "Numpad5",
      "0x004D": "Numpad6",
      "0x004E": "NumpadAdd",
      "0x004F": "Numpad1",
      "0x0050": "Numpad2",
      "0x0051": "Numpad3",
      "0x0052": "Numpad0",
      "0x0053": "NumpadDecimal",
      "0x0054": "PrintScreen",
      "0x0056": "IntlBackslash",
      "0x0057": "F11",
      "0x0058": "F12",
      "0x0059": "NumpadEqual",
      "0x0064": "F13",
      "0x0065": "F14",
      "0x0066": "F15",
      "0x0067": "F16",
      "0x0068": "F17",
      "0x0069": "F18",
      "0x006A": "F19",
      "0x006B": "F20",
      "0x006C": "F21",
      "0x006D": "F22",
      "0x006E": "F23",
      "0x0070": "KanaMode",
      "0x0071": "Lang2",
      "0x0072": "Lang1",
      "0x0073": "IntlRo",
      "0x0076": "F24",
      "0x0079": "Convert",
      "0x007B": "NonConvert",
      "0x007D": "IntlYen",
      "0x007E": "NumpadComma",
      "0xE010": "MediaTrackPrevious",
      "0xE019": "MediaTrackNext",
      "0xE01C": "NumpadEnter",
      "0xE01D": "ControlRight",
      "0xE020": "AudioVolumeMute",
      "0xE021": "LaunchApp2",
      "0xE022": "MediaPlayPause",
      "0xE024": "MediaStop",
      "0xE02E": "VolumeDown",
      "0xE030": "VolumeUp",
      "0xE032": "BrowserHome",
      "0xE035": "NumpadDivide",
      "0xE037": "PrintScreen",
      "0xE038": "AltRight",
      "0xE045": "NumLock",
      "0xE046": "Pause",
      "0xE047": "Home",
      "0xE048": "ArrowUp",
      "0xE049": "PageUp",
      "0xE04B": "ArrowLeft",
      "0xE04D": "ArrowRight",
      "0xE04F": "End",
      "0xE050": "ArrowDown",
      "0xE051": "PageDown",
      "0xE052": "Insert",
      "0xE053": "Delete",
      "0xE05B": "OSLeft",
      "0xE05C": "OSRight",
      "0xE05D": "ContextMenu",
      "0xE05E": "Power",
      "0xE065": "BrowserSearch",
      "0xE066": "BrowserFavorites",
      "0xE067": "BrowserRefresh",
      "0xE068": "BrowserStop",
      "0xE069": "BrowserForward",
      "0xE06A": "BrowserBack",
      "0xE06B": "LaunchApp1",
      "0xE06C": "LaunchMail",
      "0xE06D": "MediaSelect",
      "0xE0F1": "Lang2",
      "0xE0F2": "Lang1"
    }
  },
  linux: {
    gecko: {
      "0x0009": "Escape",
      "0x000A": "Digit1",
      "0x000B": "Digit2",
      "0x000C": "Digit3",
      "0x000D": "Digit4",
      "0x000E": "Digit5",
      "0x000F": "Digit6",
      "0x0010": "Digit7",
      "0x0011": "Digit8",
      "0x0012": "Digit9",
      "0x0013": "Digit0",
      "0x0014": "Minus",
      "0x0015": "Equal",
      "0x0016": "Backspace",
      "0x0017": "Tab",
      "0x0018": "KeyQ",
      "0x0019": "KeyW",
      "0x001A": "KeyE",
      "0x001B": "KeyR",
      "0x001C": "KeyT",
      "0x001D": "KeyY",
      "0x001E": "KeyU",
      "0x001F": "KeyI",
      "0x0020": "KeyO",
      "0x0021": "KeyP",
      "0x0022": "BracketLeft",
      "0x0023": "BracketRight",
      "0x0024": "Enter",
      "0x0025": "ControlLeft",
      "0x0026": "KeyA",
      "0x0027": "KeyS",
      "0x0028": "KeyD",
      "0x0029": "KeyF",
      "0x002A": "KeyG",
      "0x002B": "KeyH",
      "0x002C": "KeyJ",
      "0x002D": "KeyK",
      "0x002E": "KeyL",
      "0x002F": "Semicolon",
      "0x0030": "Quote",
      "0x0031": "Backquote",
      "0x0032": "ShiftLeft",
      "0x0033": "Backslash",
      "0x0034": "KeyZ",
      "0x0035": "KeyX",
      "0x0036": "KeyC",
      "0x0037": "KeyV",
      "0x0038": "KeyB",
      "0x0039": "KeyN",
      "0x003A": "KeyM",
      "0x003B": "Comma",
      "0x003C": "Period",
      "0x003D": "Slash",
      "0x003E": "ShiftRight",
      "0x003F": "NumpadMultiply",
      "0x0040": "AltLeft",
      "0x0041": "Space",
      "0x0042": "CapsLock",
      "0x0043": "F1",
      "0x0044": "F2",
      "0x0045": "F3",
      "0x0046": "F4",
      "0x0047": "F5",
      "0x0048": "F6",
      "0x0049": "F7",
      "0x004A": "F8",
      "0x004B": "F9",
      "0x004C": "F10",
      "0x004D": "NumLock",
      "0x004E": "ScrollLock",
      "0x004F": "Numpad7",
      "0x0050": "Numpad8",
      "0x0051": "Numpad9",
      "0x0052": "NumpadSubtract",
      "0x0053": "Numpad4",
      "0x0054": "Numpad5",
      "0x0055": "Numpad6",
      "0x0056": "NumpadAdd",
      "0x0057": "Numpad1",
      "0x0058": "Numpad2",
      "0x0059": "Numpad3",
      "0x005A": "Numpad0",
      "0x005B": "NumpadDecimal",
      "0x005E": "IntlBackslash",
      "0x005F": "F11",
      "0x0060": "F12",
      "0x0061": "IntlRo",
      "0x0064": "Convert",
      "0x0065": "KanaMode",
      "0x0066": "NonConvert",
      "0x0068": "NumpadEnter",
      "0x0069": "ControlRight",
      "0x006A": "NumpadDivide",
      "0x006B": "PrintScreen",
      "0x006C": "AltRight",
      "0x006E": "Home",
      "0x006F": "ArrowUp",
      "0x0070": "PageUp",
      "0x0071": "ArrowLeft",
      "0x0072": "ArrowRight",
      "0x0073": "End",
      "0x0074": "ArrowDown",
      "0x0075": "PageDown",
      "0x0076": "Insert",
      "0x0077": "Delete",
      "0x0079": "VolumeMute",
      "0x007A": "VolumeDown",
      "0x007B": "VolumeUp",
      "0x007D": "NumpadEqual",
      "0x007F": "Pause",
      "0x0081": "NumpadComma",
      "0x0082": "Lang1",
      "0x0083": "Lang2",
      "0x0084": "IntlYen",
      "0x0085": "OSLeft",
      "0x0086": "OSRight",
      "0x0087": "ContextMenu",
      "0x0088": "BrowserStop",
      "0x0089": "Again",
      "0x008A": "Props",
      "0x008B": "Undo",
      "0x008C": "Select",
      "0x008D": "Copy",
      "0x008E": "Open",
      "0x008F": "Paste",
      "0x0090": "Find",
      "0x0091": "Cut",
      "0x0092": "Help",
      "0x0094": "LaunchApp2",
      "0x0097": "WakeUp",
      "0x0098": "LaunchApp1",
      "0x00A3": "LaunchMail",
      "0x00A4": "BrowserFavorites",
      "0x00A5": "Unidentified",
      "0x00A6": "BrowserBack",
      "0x00A7": "BrowserForward",
      "0x00A9": "Eject",
      "0x00AB": "MediaTrackNext",
      "0x00AC": "MediaPlayPause",
      "0x00AD": "MediaTrackPrevious",
      "0x00AE": "MediaStop",
      "0x00B3": "MediaSelect",
      "0x00B4": "BrowserHome",
      "0x00B5": "BrowserRefresh",
      "0x00BF": "F13",
      "0x00C0": "F14",
      "0x00C1": "F15",
      "0x00C2": "F16",
      "0x00C3": "F17",
      "0x00C4": "F18",
      "0x00C5": "F19",
      "0x00C6": "F20",
      "0x00C7": "F21",
      "0x00C8": "F22",
      "0x00C9": "F23",
      "0x00CA": "F24",
      "0x00E1": "BrowserSearch"
    },
    blink: {
      "0x0009": "Escape",
      "0x000A": "Digit1",
      "0x000B": "Digit2",
      "0x000C": "Digit3",
      "0x000D": "Digit4",
      "0x000E": "Digit5",
      "0x000F": "Digit6",
      "0x0010": "Digit7",
      "0x0011": "Digit8",
      "0x0012": "Digit9",
      "0x0013": "Digit0",
      "0x0014": "Minus",
      "0x0015": "Equal",
      "0x0016": "Backspace",
      "0x0017": "Tab",
      "0x0018": "KeyQ",
      "0x0019": "KeyW",
      "0x001A": "KeyE",
      "0x001B": "KeyR",
      "0x001C": "KeyT",
      "0x001D": "KeyY",
      "0x001E": "KeyU",
      "0x001F": "KeyI",
      "0x0020": "KeyO",
      "0x0021": "KeyP",
      "0x0022": "BracketLeft",
      "0x0023": "BracketRight",
      "0x0024": "Enter",
      "0x0025": "ControlLeft",
      "0x0026": "KeyA",
      "0x0027": "KeyS",
      "0x0028": "KeyD",
      "0x0029": "KeyF",
      "0x002A": "KeyG",
      "0x002B": "KeyH",
      "0x002C": "KeyJ",
      "0x002D": "KeyK",
      "0x002E": "KeyL",
      "0x002F": "Semicolon",
      "0x0030": "Quote",
      "0x0031": "Backquote",
      "0x0032": "ShiftLeft",
      "0x0033": "Backslash",
      "0x0034": "KeyZ",
      "0x0035": "KeyX",
      "0x0036": "KeyC",
      "0x0037": "KeyV",
      "0x0038": "KeyB",
      "0x0039": "KeyN",
      "0x003A": "KeyM",
      "0x003B": "Comma",
      "0x003C": "Period",
      "0x003D": "Slash",
      "0x003E": "ShiftRight",
      "0x003F": "NumpadMultiply",
      "0x0040": "AltLeft",
      "0x0041": "Space",
      "0x0042": "CapsLock",
      "0x0043": "F1",
      "0x0044": "F2",
      "0x0045": "F3",
      "0x0046": "F4",
      "0x0047": "F5",
      "0x0048": "F6",
      "0x0049": "F7",
      "0x004A": "F8",
      "0x004B": "F9",
      "0x004C": "F10",
      "0x004D": "NumLock",
      "0x004E": "ScrollLock",
      "0x004F": "Numpad7",
      "0x0050": "Numpad8",
      "0x0051": "Numpad9",
      "0x0052": "NumpadSubtract",
      "0x0053": "Numpad4",
      "0x0054": "Numpad5",
      "0x0055": "Numpad6",
      "0x0056": "NumpadAdd",
      "0x0057": "Numpad1",
      "0x0058": "Numpad2",
      "0x0059": "Numpad3",
      "0x005A": "Numpad0",
      "0x005B": "NumpadDecimal",
      "0x005D": "Lang5",
      "0x005E": "IntlBackslash",
      "0x005F": "F11",
      "0x0060": "F12",
      "0x0061": "IntlRo",
      "0x0062": "Lang3",
      "0x0063": "Lang4",
      "0x0064": "Convert",
      "0x0065": "KanaMode",
      "0x0066": "NonConvert",
      "0x0068": "NumpadEnter",
      "0x0069": "ControlRight",
      "0x006A": "NumpadDivide",
      "0x006B": "PrintScreen",
      "0x006C": "AltRight",
      "0x006E": "Home",
      "0x006F": "ArrowUp",
      "0x0070": "PageUp",
      "0x0071": "ArrowLeft",
      "0x0072": "ArrowRight",
      "0x0073": "End",
      "0x0074": "ArrowDown",
      "0x0075": "PageDown",
      "0x0076": "Insert",
      "0x0077": "Delete",
      "0x0079": "AudioVolumeMute",
      "0x007A": "AudioVolumeDown",
      "0x007B": "AudioVolumeUp",
      "0x007C": "Power",
      "0x007D": "NumpadEqual",
      "0x007F": "Pause",
      "0x0081": "NumpadComma",
      "0x0082": "Lang1",
      "0x0083": "Lang2",
      "0x0084": "IntlYen",
      "0x0085": "MetaLeft",
      "0x0086": "MetaRight",
      "0x0087": "ContextMenu",
      "0x0088": "BrowserStop",
      "0x0089": "Again",
      "0x008B": "Undo",
      "0x008C": "Select",
      "0x008D": "Copy",
      "0x008E": "Open",
      "0x008F": "Paste",
      "0x0090": "Find",
      "0x0091": "Cut",
      "0x0092": "Help",
      "0x0094": "LaunchApp2",
      "0x0096": "Sleep",
      "0x0097": "WakeUp",
      "0x0098": "LaunchApp1",
      "0x00A3": "LaunchMail",
      "0x00A4": "BrowserFavorites",
      "0x00A6": "BrowserBack",
      "0x00A7": "BrowserForward",
      "0x00A9": "Eject",
      "0x00AB": "MediaTrackNext",
      "0x00AC": "MediaPlayPause",
      "0x00AD": "MediaTrackPrevious",
      "0x00AE": "MediaStop",
      "0x00B3": "MediaSelect",
      "0x00B4": "BrowserHome",
      "0x00B5": "BrowserRefresh",
      "0x00BB": "NumpadParenLeft",
      "0x00BC": "NumpadParenRight",
      "0x00BF": "F13",
      "0x00C0": "F14",
      "0x00C1": "F15",
      "0x00C2": "F16",
      "0x00C3": "F17",
      "0x00C4": "F18",
      "0x00C5": "F19",
      "0x00C6": "F20",
      "0x00C7": "F21",
      "0x00C8": "F22",
      "0x00C9": "F23",
      "0x00CA": "F24",
      "0x00E1": "BrowserSearch"
    }
  },
  android: {
    gecko: {
      "0x0001": "Escape",
      "0x0002": "Digit1",
      "0x0003": "Digit2",
      "0x0004": "Digit3",
      "0x0005": "Digit4",
      "0x0006": "Digit5",
      "0x0007": "Digit6",
      "0x0008": "Digit7",
      "0x0009": "Digit8",
      "0x000A": "Digit9",
      "0x000B": "Digit0",
      "0x000C": "Minus",
      "0x000D": "Equal",
      "0x000E": "Backspace",
      "0x000F": "Tab",
      "0x0010": "KeyQ",
      "0x0011": "KeyW",
      "0x0012": "KeyE",
      "0x0013": "KeyR",
      "0x0014": "KeyT",
      "0x0015": "KeyY",
      "0x0016": "KeyU",
      "0x0017": "KeyI",
      "0x0018": "KeyO",
      "0x0019": "KeyP",
      "0x001A": "BracketLeft",
      "0x001B": "BracketRight",
      "0x001C": "Enter",
      "0x001D": "ControlLeft",
      "0x001E": "KeyA",
      "0x001F": "KeyS",
      "0x0020": "KeyD",
      "0x0021": "KeyF",
      "0x0022": "KeyG",
      "0x0023": "KeyH",
      "0x0024": "KeyJ",
      "0x0025": "KeyK",
      "0x0026": "KeyL",
      "0x0027": "Semicolon",
      "0x0028": "Quote",
      "0x0029": "Backquote",
      "0x002A": "ShiftLeft",
      "0x002B": "Backslash",
      "0x002C": "KeyZ",
      "0x002D": "KeyX",
      "0x002E": "KeyC",
      "0x002F": "KeyV",
      "0x0030": "KeyB",
      "0x0031": "KeyN",
      "0x0032": "KeyM",
      "0x0033": "Comma",
      "0x0034": "Period",
      "0x0035": "Slash",
      "0x0036": "ShiftRight",
      "0x0037": "NumpadMultiply",
      "0x0038": "AltLeft",
      "0x0039": "Space",
      "0x003A": "CapsLock",
      "0x003B": "F1",
      "0x003C": "F2",
      "0x003D": "F3",
      "0x003E": "F4",
      "0x003F": "F5",
      "0x0040": "F6",
      "0x0041": "F7",
      "0x0042": "F8",
      "0x0043": "F9",
      "0x0044": "F10",
      "0x0045": "NumLock",
      "0x0046": "ScrollLock",
      "0x0047": "Numpad7",
      "0x0048": "Numpad8",
      "0x0049": "Numpad9",
      "0x004A": "NumpadSubtract",
      "0x004B": "Numpad4",
      "0x004C": "Numpad5",
      "0x004D": "Numpad6",
      "0x004E": "NumpadAdd",
      "0x004F": "Numpad1",
      "0x0050": "Numpad2",
      "0x0051": "Numpad3",
      "0x0052": "Numpad0",
      "0x0053": "NumpadDecimal",
      "0x0056": "IntlBackslash",
      "0x0057": "F11",
      "0x0058": "F12",
      "0x0059": "IntlRo",
      "0x005C": "Convert",
      "0x005D": "KanaMode",
      "0x005E": "NonConvert",
      "0x0060": "NumpadEnter",
      "0x0061": "ControlRight",
      "0x0062": "NumpadDivide",
      "0x0063": "PrintScreen",
      "0x0064": "AltRight",
      "0x0066": "Home",
      "0x0067": "ArrowUp",
      "0x0068": "PageUp",
      "0x0069": "ArrowLeft",
      "0x006A": "ArrowRight",
      "0x006B": "End",
      "0x006C": "ArrowDown",
      "0x006D": "PageDown",
      "0x006E": "Insert",
      "0x006F": "Delete",
      "0x0071": "VolumeMute",
      "0x0072": "VolumeDown",
      "0x0073": "VolumeUp",
      "0x0074": "Power",
      "0x0075": "NumpadEqual",
      "0x0077": "Pause",
      "0x0079": "NumpadComma",
      "0x007A": "Lang1",
      "0x007B": "Lang2",
      "0x007C": "IntlYen",
      "0x007D": "OSLeft",
      "0x007E": "OSRight",
      "0x007F": "ContextMenu",
      "0x0080": "BrowserStop",
      "0x0081": "Again",
      "0x0082": "Props",
      "0x0083": "Undo",
      "0x0084": "Select",
      "0x0085": "Copy",
      "0x0086": "Open",
      "0x0087": "Paste",
      "0x0088": "Find",
      "0x0089": "Cut",
      "0x008A": "Help",
      "0x008E": "Sleep",
      "0x008F": "WakeUp",
      "0x0090": "LaunchApp1",
      "0x009C": "BrowserFavorites",
      "0x009E": "BrowserBack",
      "0x009F": "BrowserForward",
      "0x00A1": "Eject",
      "0x00A3": "MediaTrackNext",
      "0x00A4": "MediaPlayPause",
      "0x00A5": "MediaTrackPrevious",
      "0x00A6": "MediaStop",
      "0x00AD": "BrowserRefresh",
      "0x00B7": "F13",
      "0x00B8": "F14",
      "0x00B9": "F15",
      "0x00BA": "F16",
      "0x00BB": "F17",
      "0x00BC": "F18",
      "0x00BD": "F19",
      "0x00BE": "F20",
      "0x00BF": "F21",
      "0x00C0": "F22",
      "0x00C1": "F23",
      "0x00C2": "F24",
      "0x00D9": "BrowserSearch",
      "0x01D0": "Fn"
    }
  }
}, Fe = {
  windows: {
    blink: {},
    gecko: {}
  },
  linux: {
    gecko: {},
    blink: {}
  },
  android: {
    gecko: {},
    blink: null
  }
}, B0 = [
  [rt.windows.blink, Fe.windows.blink],
  [rt.windows.gecko, Fe.windows.gecko],
  [rt.linux.blink, Fe.linux.blink],
  [rt.linux.gecko, Fe.linux.gecko],
  [rt.android.gecko, Fe.android.gecko]
];
B0.forEach((e) => {
  for (const t in e[0])
    Object.prototype.hasOwnProperty.call(e[0], t) && (e[1][e[0][t]] = t);
});
const L0 = new N0(), $0 = L0.getResult(), T0 = (_a = $0.engine.name) == null ? void 0 : _a.toLowerCase(), yi = function(e, t) {
  const i = Fe[t][T0] || Fe.linux.gecko;
  return parseInt(i[e], 16);
};
var ti = /* @__PURE__ */ ((e) => (e.WINDOWS = "windows", e.LINUX = "linux", e.ANDROID = "android", e))(ti || {}), ii = /* @__PURE__ */ ((e) => (e.CTRL_LEFT = "ControlLeft", e.SHIFT_LEFT = "ShiftLeft", e.SHIFT_RIGHT = "ShiftRight", e.ALT_LEFT = "AltLeft", e.CTRL_RIGHT = "ControlRight", e.ALT_RIGHT = "AltRight", e.ControlLeft = "ControlLeft", e.ShiftLeft = "ShiftLeft", e.ShiftRight = "ShiftRight", e.AltLeft = "AltLeft", e.ControlRight = "ControlRight", e.AltRight = "AltRight", e))(ii || {}), He = /* @__PURE__ */ ((e) => (e.CAPS_LOCK = "CapsLock", e.NUM_LOCK = "NumLock", e.SCROLL_LOCK = "ScrollLock", e.KANA_MODE = "KanaMode", e.CapsLock = "CapsLock", e.ScrollLock = "ScrollLock", e.NumLock = "NumLock", e.KanaMode = "KanaMode", e))(He || {}), at = /* @__PURE__ */ ((e) => (e[e.STARTED = 0] = "STARTED", e[e.TERMINATED = 1] = "TERMINATED", e[e.ERROR = 2] = "ERROR", e))(at || {}), dt = /* @__PURE__ */ ((e) => (e[e.CTRL_ALT_DEL = 0] = "CTRL_ALT_DEL", e[e.META = 1] = "META", e))(dt || {}), be = /* @__PURE__ */ ((e) => (e[e.Fit = 1] = "Fit", e[e.Full = 2] = "Full", e[e.Real = 3] = "Real", e))(be || {});
class K0 {
  constructor(t, i, r) {
    __publicField(this, "username");
    __publicField(this, "password");
    __publicField(this, "destination");
    __publicField(this, "proxyAddress");
    __publicField(this, "serverDomain");
    __publicField(this, "authToken");
    __publicField(this, "desktopSize");
    __publicField(this, "extensions");
    this.username = t.username, this.password = t.password, this.proxyAddress = i.address, this.authToken = i.authToken, this.destination = r.destination, this.serverDomain = r.serverDomain, this.extensions = r.extensions, this.desktopSize = r.desktopSize;
  }
}
class O0 {
  /**
   * Creates a new ConfigBuilder instance.
   */
  constructor() {
    __publicField(this, "username", "");
    __publicField(this, "password", "");
    __publicField(this, "destination", "");
    __publicField(this, "proxyAddress", "");
    __publicField(this, "serverDomain", "");
    __publicField(this, "authToken", "");
    __publicField(this, "desktopSize");
    __publicField(this, "extensions", []);
  }
  /**
   * Optional parameter
   *
   * @param username - The username to use for authentication
   * @returns The builder instance for method chaining
   */
  withUsername(t) {
    return this.username = t, this;
  }
  /**
   * Optional parameter
   *
   * @param password - The password for authentication
   * @returns The builder instance for method chaining
   */
  withPassword(t) {
    return this.password = t, this;
  }
  /**
   * Required parameter
   *
   * @param destination - The destination address to connect to
   * @returns The builder instance for method chaining
   */
  withDestination(t) {
    return this.destination = t, this;
  }
  /**
   * Required parameter
   *
   * @param proxyAddress - The address of the proxy server
   * @returns The builder instance for method chaining
   */
  withProxyAddress(t) {
    return this.proxyAddress = t, this;
  }
  /**
   * Optional parameter
   *
   * @param serverDomain - The server domain to connect to
   * @returns The builder instance for method chaining
   */
  withServerDomain(t) {
    return this.serverDomain = t, this;
  }
  /**
   * Required parameter
   *
   * @param authToken - JWT token to connect to the proxy
   * @returns The builder instance for method chaining
   */
  withAuthToken(t) {
    return this.authToken = t, this;
  }
  /**
   * Optional parameter
   *
   * @param ext - The extension
   * @returns The builder instance for method chaining
   */
  withExtension(t) {
    return this.extensions.push(t), this;
  }
  /**
   * Optional
   *
   * @param desktopSize - The desktop size configuration object
   * @returns The builder instance for method chaining
   */
  withDesktopSize(t) {
    return this.desktopSize = t, this;
  }
  /**
   * Builds a new Config instance.
   *
   * @throws {Error} If required parameters (destination, proxyAddress, authToken) are not set
   * @returns A new Config instance with the configured values
   */
  build() {
    if (this.destination === "")
      throw new Error("destination has to be specified");
    if (this.proxyAddress === "")
      throw new Error("proxy address has to be specified");
    if (this.authToken === "")
      throw new Error("authentication token has to be specified");
    const t = { username: this.username, password: this.password }, i = { address: this.proxyAddress, authToken: this.authToken }, r = {
      destination: this.destination,
      serverDomain: this.serverDomain,
      extensions: this.extensions,
      desktopSize: this.desktopSize
    };
    return new K0(t, i, r);
  }
}
class qe {
  constructor() {
    __publicField(this, "subscribers");
    this.subscribers = [];
  }
  subscribe(t) {
    this.subscribers.push(t);
  }
  publish(t) {
    for (const i of this.subscribers)
      i(t);
  }
}
class M0 {
  constructor(t) {
    __publicField(this, "module");
    __publicField(this, "canvas");
    __publicField(this, "keyboardUnicodeMode", false);
    __publicField(this, "backendSupportsUnicodeKeyboardShortcuts");
    __publicField(this, "onRemoteClipboardChanged");
    __publicField(this, "onRemoteReceivedFormatList");
    __publicField(this, "onForceClipboardUpdate");
    __publicField(this, "onCanvasResized");
    __publicField(this, "cursorHasOverride", false);
    __publicField(this, "lastCursorStyle", "default");
    __publicField(this, "enableClipboard", true);
    __publicField(this, "resizeObservable", new qe());
    __publicField(this, "session");
    __publicField(this, "modifierKeyPressed", []);
    __publicField(this, "mousePositionObservable", new qe());
    __publicField(this, "changeVisibilityObservable", new qe());
    __publicField(this, "sessionEventObservable", new qe());
    __publicField(this, "scaleObservable", new qe());
    __publicField(this, "dynamicResizeObservable", new qe());
    this.module = t, O.info("Web bridge initialized.");
  }
  // If set to false, the clipboard will not be enabled and the callbacks will not be registered to the Rust side
  setEnableClipboard(t) {
    this.enableClipboard = t;
  }
  /// Callback to set the local clipboard content to data received from the remote.
  setOnRemoteClipboardChanged(t) {
    this.onRemoteClipboardChanged = t;
  }
  /// Callback which is called when the remote sends a list of supported clipboard formats.
  setOnRemoteReceivedFormatList(t) {
    this.onRemoteReceivedFormatList = t;
  }
  /// Callback which is called when the remote requests a forced clipboard update (e.g. on
  /// clipboard initialization sequence)
  setOnForceClipboardUpdate(t) {
    this.onForceClipboardUpdate = t;
  }
  /// Callback which is called when the canvas is resized.
  setOnCanvasResized(t) {
    this.onCanvasResized = t;
  }
  mouseIn(t) {
    this.syncModifier(t);
  }
  mouseOut(t) {
    this.releaseAllInputs();
  }
  sendKeyboardEvent(t) {
    this.sendKeyboard(t);
  }
  shutdown() {
    var _a2;
    (_a2 = this.session) == null ? void 0 : _a2.shutdown();
  }
  mouseButtonState(t, i, r) {
    r && t.preventDefault();
    const n = i ? this.module.DeviceEvent.mouseButtonPressed : this.module.DeviceEvent.mouseButtonReleased;
    this.doTransactionFromDeviceEvents([n(t.button)]);
  }
  updateMousePosition(t) {
    this.doTransactionFromDeviceEvents([this.module.DeviceEvent.mouseMove(t.x, t.y)]), this.mousePositionObservable.publish(t);
  }
  configBuilder() {
    return new O0();
  }
  async connect(t) {
    const i = new this.module.SessionBuilder();
    i.proxyAddress(t.proxyAddress), i.destination(t.destination), i.serverDomain(t.serverDomain), i.password(t.password), i.authToken(t.authToken), i.username(t.username), i.renderCanvas(this.canvas), i.setCursorStyleCallbackContext(this), i.setCursorStyleCallback(this.setCursorStyleCallback), t.extensions.forEach((n) => {
      i.extension(n);
    }), this.onRemoteClipboardChanged != null && this.enableClipboard && i.remoteClipboardChangedCallback(this.onRemoteClipboardChanged), this.onRemoteReceivedFormatList != null && this.enableClipboard && i.remoteReceivedFormatListCallback(this.onRemoteReceivedFormatList), this.onForceClipboardUpdate != null && this.enableClipboard && i.forceClipboardUpdateCallback(this.onForceClipboardUpdate), this.onCanvasResized != null && i.canvasResizedCallback(this.onCanvasResized), t.desktopSize != null && i.desktopSize(
      new this.module.DesktopSize(t.desktopSize.width, t.desktopSize.height)
    );
    const r = await i.connect().catch((n) => {
      throw this.raiseSessionEvent({
        type: at.ERROR,
        data: {
          backtrace: () => n.backtrace(),
          kind: () => n.kind()
        }
      }), new Error("could not connect to the session");
    });
    return this.run(r), O.info("Session started."), this.session = r, this.resizeObservable.publish({
      desktopSize: r.desktopSize(),
      sessionId: 0
    }), this.raiseSessionEvent({
      type: at.STARTED,
      data: "Session started"
    }), {
      sessionId: 0,
      initialDesktopSize: r.desktopSize(),
      websocketPort: 0
    };
  }
  run(t) {
    t.run().then((i) => {
      this.setVisibility(false), this.raiseSessionEvent({
        type: at.TERMINATED,
        data: "Session was terminated: " + i.reason() + "."
      });
    }).catch((i) => {
      this.setVisibility(false), this.raiseSessionEvent({
        type: at.TERMINATED,
        data: "Session was terminated with an error: " + i.backtrace() + "."
      });
    });
  }
  sendSpecialCombination(t) {
    switch (t) {
      case dt.CTRL_ALT_DEL:
        this.ctrlAltDel();
        break;
      case dt.META:
        this.sendMeta();
        break;
    }
  }
  mouseWheel(t) {
    const i = t.deltaY !== 0, r = i ? t.deltaY : t.deltaX;
    this.doTransactionFromDeviceEvents([this.module.DeviceEvent.wheelRotations(i, -r)]);
  }
  setVisibility(t) {
    this.changeVisibilityObservable.publish(t);
  }
  setScale(t) {
    this.scaleObservable.publish(t);
  }
  setCanvas(t) {
    this.canvas = t;
  }
  resizeDynamic(t, i, r) {
    var _a2;
    this.dynamicResizeObservable.publish({ width: t, height: i }), (_a2 = this.session) == null ? void 0 : _a2.resize(t, i, r);
  }
  /// Triggered by the browser when local clipboard is updated. Clipboard backend should
  /// cache the content and send it to the server when it is requested.
  onClipboardChanged(t) {
    return (async () => {
      var _a2;
      await ((_a2 = this.session) == null ? void 0 : _a2.onClipboardPaste(t));
    })();
  }
  sendClipboardText(t) {
    const i = new this.module.ClipboardData();
    return i.addText("text/plain", t), this.onClipboardChanged(i);
  }
  setOnRemoteClipboardText(t) {
    queueMicrotask(() => {
      this.setOnRemoteClipboardChanged((i) => {
        for (const r of i.items()) {
          if (!r.mimeType().startsWith("text/"))
            continue;
          const n = r.value();
          if (typeof n == "string") {
            t(n);
            return;
          }
        }
      }), this.setOnForceClipboardUpdate(() => this.onClipboardChangedEmpty());
    });
  }
  onClipboardChangedEmpty() {
    return (async () => {
      var _a2;
      await ((_a2 = this.session) == null ? void 0 : _a2.onClipboardPaste(new this.module.ClipboardData()));
    })();
  }
  setKeyboardUnicodeMode(t) {
    this.keyboardUnicodeMode = t;
  }
  setCursorStyleOverride(t) {
    t == null ? (this.canvas.style.cursor = this.lastCursorStyle, this.cursorHasOverride = false) : (this.canvas.style.cursor = t, this.cursorHasOverride = true);
  }
  invokeExtension(t) {
    var _a2;
    (_a2 = this.session) == null ? void 0 : _a2.invokeExtension(t);
  }
  releaseAllInputs() {
    var _a2;
    (_a2 = this.session) == null ? void 0 : _a2.releaseAllInputs();
  }
  supportsUnicodeKeyboardShortcuts() {
    var _a2, _b;
    return this.backendSupportsUnicodeKeyboardShortcuts !== void 0 ? this.backendSupportsUnicodeKeyboardShortcuts : ((_a2 = this.session) == null ? void 0 : _a2.supportsUnicodeKeyboardShortcuts) ? (this.backendSupportsUnicodeKeyboardShortcuts = (_b = this.session) == null ? void 0 : _b.supportsUnicodeKeyboardShortcuts(), this.backendSupportsUnicodeKeyboardShortcuts) : true;
  }
  sendKeyboard(t) {
    t.preventDefault();
    let i, r;
    t.type === "keydown" ? (i = this.module.DeviceEvent.keyPressed, r = this.module.DeviceEvent.unicodePressed) : t.type === "keyup" && (i = this.module.DeviceEvent.keyReleased, r = this.module.DeviceEvent.unicodeReleased);
    let n = true;
    if (!this.supportsUnicodeKeyboardShortcuts()) {
      for (const b of ["Alt", "Control", "Meta", "AltGraph", "OS"])
        if (t.getModifierState(b)) {
          n = false;
          break;
        }
    }
    const s = t.code in ii, d = t.code in He;
    if (s && this.updateModifierKeyState(t), d && this.syncModifier(t), !t.repeat || !s && !d) {
      const b = yi(t.code, ti.WINDOWS), p = Number.isNaN(b);
      if (!this.keyboardUnicodeMode && i && !p) {
        this.doTransactionFromDeviceEvents([i(b)]);
        return;
      }
      if (this.keyboardUnicodeMode && r && i) {
        if (["Dead", "Unidentified"].indexOf(t.key) != -1)
          return;
        const h = yi(t.key, ti.WINDOWS);
        Number.isNaN(h) && t.key.length === 1 && n ? this.doTransactionFromDeviceEvents([r(t.key)]) : p || this.doTransactionFromDeviceEvents([i(b)]);
        return;
      }
    }
  }
  setCursorStyleCallback(t, i, r, n) {
    let s;
    switch (t) {
      case "hidden": {
        s = "none";
        break;
      }
      case "default": {
        s = "default";
        break;
      }
      case "url": {
        if (i == null || r == null || n == null) {
          console.error("Invalid custom cursor parameters.");
          return;
        }
        const d = new Image();
        d.src = i;
        const b = Math.round(r), p = Math.round(n);
        s = `url(${i}) ${b} ${p}, default`;
        break;
      }
      default: {
        console.error(`Unsupported cursor style: ${t}.`);
        return;
      }
    }
    this.lastCursorStyle = s, this.cursorHasOverride || (this.canvas.style.cursor = s);
  }
  syncModifier(t) {
    var _a2;
    const i = t.getModifierState(He.CAPS_LOCK), r = t.getModifierState(He.NUM_LOCK), n = t.getModifierState(He.SCROLL_LOCK), s = t.getModifierState(He.KANA_MODE);
    (_a2 = this.session) == null ? void 0 : _a2.synchronizeLockKeys(
      n,
      r,
      i,
      s
    );
  }
  raiseSessionEvent(t) {
    this.sessionEventObservable.publish(t);
  }
  updateModifierKeyState(t) {
    const i = ii[t.code];
    this.modifierKeyPressed.indexOf(i) === -1 ? this.modifierKeyPressed.push(i) : t.type === "keyup" && this.modifierKeyPressed.splice(this.modifierKeyPressed.indexOf(i), 1);
  }
  doTransactionFromDeviceEvents(t) {
    var _a2;
    const i = new this.module.InputTransaction();
    t.forEach((r) => i.addEvent(r)), (_a2 = this.session) == null ? void 0 : _a2.applyInputs(i);
  }
  ctrlAltDel() {
    const t = parseInt("0x001D", 16), i = parseInt("0x0038", 16), r = parseInt("0xE053", 16);
    this.doTransactionFromDeviceEvents([
      this.module.DeviceEvent.keyPressed(t),
      this.module.DeviceEvent.keyPressed(i),
      this.module.DeviceEvent.keyPressed(r),
      this.module.DeviceEvent.keyReleased(t),
      this.module.DeviceEvent.keyReleased(i),
      this.module.DeviceEvent.keyReleased(r)
    ]);
  }
  sendMeta() {
    const t = parseInt("0xE05B", 16);
    this.doTransactionFromDeviceEvents([
      this.module.DeviceEvent.keyPressed(t),
      this.module.DeviceEvent.keyReleased(t)
    ]);
  }
}
class P0 {
  constructor(t) {
    __publicField(this, "remoteDesktopService");
    this.remoteDesktopService = t;
  }
  configBuilder() {
    return this.remoteDesktopService.configBuilder();
  }
  connect(t) {
    return O.info("Initializing connection."), this.remoteDesktopService.connect(t);
  }
  ctrlAltDel() {
    this.remoteDesktopService.sendSpecialCombination(dt.CTRL_ALT_DEL);
  }
  metaKey() {
    this.remoteDesktopService.sendSpecialCombination(dt.META);
  }
  setVisibility(t) {
    O.info(`Change component visibility to: ${t}`), this.remoteDesktopService.setVisibility(t);
  }
  setScale(t) {
    this.remoteDesktopService.setScale(t);
  }
  shutdown() {
    this.remoteDesktopService.shutdown();
  }
  setKeyboardUnicodeMode(t) {
    this.remoteDesktopService.setKeyboardUnicodeMode(t);
  }
  setCursorStyleOverride(t) {
    this.remoteDesktopService.setCursorStyleOverride(t);
  }
  resize(t, i, r) {
    this.remoteDesktopService.resizeDynamic(t, i, r);
  }
  setEnableClipboard(t) {
    this.remoteDesktopService.setEnableClipboard(t);
  }
  sendClipboardText(t) {
    return this.remoteDesktopService.sendClipboardText(t);
  }
  onRemoteClipboardText(t) {
    this.remoteDesktopService.setOnRemoteClipboardText(t);
  }
  invokeExtension(t) {
    this.remoteDesktopService.invokeExtension(t);
  }
  getExposedFunctions() {
    return {
      setVisibility: this.setVisibility.bind(this),
      configBuilder: this.configBuilder.bind(this),
      connect: this.connect.bind(this),
      setScale: this.setScale.bind(this),
      onSessionEvent: (t) => {
        this.remoteDesktopService.sessionEventObservable.subscribe(t);
      },
      ctrlAltDel: this.ctrlAltDel.bind(this),
      metaKey: this.metaKey.bind(this),
      shutdown: this.shutdown.bind(this),
      setKeyboardUnicodeMode: this.setKeyboardUnicodeMode.bind(this),
      setCursorStyleOverride: this.setCursorStyleOverride.bind(this),
      resize: this.resize.bind(this),
      setEnableClipboard: this.setEnableClipboard.bind(this),
      sendClipboardText: this.sendClipboardText.bind(this),
      onRemoteClipboardText: this.onRemoteClipboardText.bind(this),
      invokeExtension: this.invokeExtension.bind(this)
    };
  }
}
var I0 = (e, t) => t(e, true), U0 = (e, t) => t(e, false), z0 = (e) => e.preventDefault(), q0 = /* @__PURE__ */ h0('<div class="svelte-1103xra"><div><div class="screen-viewer svelte-1103xra"><canvas id="renderer" tabindex="0" class="svelte-1103xra"></canvas></div></div></div>');
const H0 = {
  hash: "svelte-1103xra",
  code: ".screen-wrapper.svelte-1103xra {position:relative;}.capturing-inputs.svelte-1103xra {outline:1px solid rgba(0, 97, 166, 0.7);outline-offset:-1px;}canvas.svelte-1103xra {width:100%;height:100%;}.svelte-1103xra::selection {background-color:transparent;}.screen-wrapper.hidden.svelte-1103xra {pointer-events:none !important;position:absolute !important;visibility:hidden;height:100%;width:100%;transform:translate(-100%, -100%);}"
};
function or(e, t) {
  Xi(t, true), v0(e, H0);
  let i = _t(t, "scale"), r = _t(t, "verbose"), n = _t(t, "flexcenter"), s = _t(t, "module"), d = Wt(false), b = () => {
    var _a2, _b;
    return O.info(`
            capturingInputs: ${document.activeElement === x}
            current active element: ${document.activeElement}
        `), ((_b = (_a2 = document.activeElement) == null ? void 0 : _a2.shadowRoot) == null ? void 0 : _b.firstElementChild) === p;
  }, p, h, v, x, o = Wt(""), l = Wt(""), a = new M0(s()), u = new P0(a), f = be.Fit, B = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  const T = 100;
  let g = false, _ = {}, K = {}, H = null, Ee = null, Ne = false, ce = [];
  const Ce = 100, ft = 30, xt = 1e3;
  let oe = null, de = 0, Ye = false, Z = [], fe = false;
  function ht() {
    !B && navigator.clipboard != null && navigator.clipboard.read != null && navigator.clipboard.write != null && (g = true), B ? (a.setOnRemoteClipboardChanged(vt), a.setOnRemoteReceivedFormatList(Qe), a.setOnForceClipboardUpdate(xe)) : g && (a.setOnRemoteClipboardChanged(Be), a.setOnForceClipboardUpdate(xe), setTimeout(Le, T));
  }
  function Ge(c) {
    return c.ctrlKey && c.code === "KeyC" || c.ctrlKey && c.code === "KeyX" || c.code == "Copy" || c.code == "Cut";
  }
  function Xe(c) {
    return c.ctrlKey && c.code === "KeyV" || c.code == "Paste";
  }
  function pt(c) {
    let w = {};
    for (const C of c.items()) {
      let D = C.mimeType(), E = new Blob([C.value()], { type: D });
      w[D] = E;
    }
    return w;
  }
  function ke(c) {
    let w = {};
    for (const C of c.items()) {
      let D = C.mimeType();
      w[D] = C.value();
    }
    return w;
  }
  function xe() {
    try {
      H ? a.onClipboardChanged(H) : a.onClipboardChangedEmpty();
    } catch (c) {
      console.error("Failed to send initial clipboard state: " + c);
    }
  }
  function bt(c) {
    document.hasFocus() ? c() : ce.push(c);
  }
  function Be(c) {
    try {
      const w = pt(c), C = new ClipboardItem(w);
      bt(() => {
        K = ke(c), navigator.clipboard.write([C]);
      });
    } catch (w) {
      console.error("Failed to set client clipboard: " + w);
    }
  }
  async function Le() {
    try {
      if (!document.hasFocus())
        return;
      var c = await navigator.clipboard.read();
      if (c.length == 0)
        return;
      var w = c[0];
      if (!w.types.some((E) => E.startsWith("text/") || E.startsWith("image/png")))
        return;
      var C = {}, D = true;
      for (const E of w.types) {
        const L = E.startsWith("text/"), $ = await w.getType(E), Pe = L ? await $.text() : new Uint8Array(await $.arrayBuffer()), ci = L ? function(Ie, Ue) {
          return Ie === Ue;
        } : function(Ie, Ue) {
          return !(Ie instanceof Uint8Array) || !(Ue instanceof Uint8Array) ? false : Ie != null && Ue != null && Ie.length === Ue.length && Ie.every((ar, lr) => ar === Ue[lr]);
        }, sr = _[E];
        ci(sr, Pe) || (ci(K[E], Pe) ? _[E] = K[E] : D = false), C[E] = Pe;
      }
      if (!D) {
        _ = C;
        let E = new (s()).ClipboardData();
        Object.entries(C).forEach(([L, $]) => {
          $ == null || $ == null || (L.startsWith("text/") && typeof $ == "string" ? E.addText(L, $) : L.startsWith("image/") && $ instanceof Uint8Array && E.addBinary(L, $));
        }), E.isEmpty() || (H = E, await a.onClipboardChanged(E));
      }
    } catch (E) {
      E instanceof Error && ((Ee === null || Ee.toString() !== E.toString()) && console.error("Clipboard monitoring error: " + E), Ee = E);
    } finally {
      Ne || setTimeout(Le, T);
    }
  }
  function Qe() {
    try {
      Je();
    } catch (c) {
      console.error("Failed to send delayed keyboard events: " + c);
    }
  }
  function vt(c) {
    oe = c;
  }
  function Ze() {
    if (oe)
      try {
        let c = oe;
        oe = null;
        for (const w of c.items())
          if (w.mimeType() === "text/plain") {
            const C = w.value();
            typeof C == "string" ? navigator.clipboard.writeText(C) : O.error("Unexpected value for text/plain clipboard item");
            break;
          }
      } catch (c) {
        console.error("Failed to set client clipboard: " + c);
      }
    else de > 0 && (de--, setTimeout(Ze, Ce));
  }
  function Je() {
    if (Z.length > 0) {
      for (const c of Z)
        X(c);
      Z = [];
    }
    Ye = false;
  }
  function wt(c) {
    if (c.preventDefault(), !!B)
      try {
        let C = new (s()).ClipboardData();
        if (c.clipboardData == null)
          return;
        for (var w of c.clipboardData.items) {
          let D = w.type;
          if (D.startsWith("text/")) {
            w.getAsString((E) => {
              C.addText(D, E), C.isEmpty() || a.onClipboardChanged(C);
            });
            break;
          }
          if (D.startsWith("image/")) {
            let E = w.getAsFile();
            if (E == null)
              continue;
            E.arrayBuffer().then((L) => {
              const $ = new Uint8Array(L);
              C.addBinary(D, $), C.isEmpty() || a.onClipboardChanged(C);
            });
            break;
          }
        }
      } catch (C) {
        console.error("Failed to update remote clipboard: " + C);
      }
  }
  function Ht() {
    Se(), Ke();
    function c(w) {
      if (b()) {
        if (Ye) {
          w.preventDefault(), Z.push(w);
          return;
        }
        if (B && Xe(w)) {
          Ye = true, Z = [], Z.push(w), setTimeout(Je, xt);
          return;
        }
        X(w);
      }
    }
    window.addEventListener("keydown", c, false), window.addEventListener("keyup", c, false), window.addEventListener("focus", m);
  }
  function $e() {
    n() === "true" && (p.style.flexGrow = "", p.style.display = "", p.style.justifyContent = "", p.style.alignItems = "");
  }
  function et(c) {
    n() === "true" && (p.style.flexGrow = "1", p.style.display = "flex", p.style.justifyContent = "center", p.style.alignItems = "center");
  }
  function J(c, w, C) {
    let D = `height: ${c}; width: ${w}`;
    D = `${D}; max-height: ${c}; max-width: ${w}; min-height: ${c}; min-width: ${w}`, Y(o, Ae(D));
  }
  function De(c, w, C) {
    Y(l, `height: ${c}; width: ${w}; overflow: ${C}`);
  }
  const Te = (c) => {
    he(i());
  };
  function Se() {
    a.resizeObservable.subscribe((c) => {
      O.info(`Resize canvas to: ${c.desktopSize.width}x${c.desktopSize.height}`), x.width = c.desktopSize.width, x.height = c.desktopSize.height, he(i());
    });
  }
  function Ke() {
    window.addEventListener("resize", Te), a.scaleObservable.subscribe((c) => {
      O.info("Change scale!"), he(c);
    }), a.dynamicResizeObservable.subscribe((c) => {
      O.info(`Dynamic resize!, width: ${c.width}, height: ${c.height}`), J(c.height.toString() + "px", c.width.toString() + "px");
    }), a.changeVisibilityObservable.subscribe((c) => {
      Y(d, Ae(c)), c && (De("100%", "100%", "hidden"), setTimeout(() => he(i()), 150));
    });
  }
  function Vt() {
    he(f);
  }
  function he(c) {
    if ($e(), I(d))
      switch (c) {
        case "fit":
        case be.Fit:
          O.info("Size to fit"), f = be.Fit, i("fit"), V();
          break;
        case "full":
        case be.Full:
          O.info("Size to full"), f = be.Full, mt(), i("full");
          break;
        case "real":
        case be.Real:
          O.info("Size to real"), f = be.Real, pe(), i("real");
          break;
      }
  }
  function mt() {
    const c = z(), w = c.x, C = c.y;
    let D = x.width, E = x.height;
    const L = Math.min(w / x.width, C / x.height);
    D = D * L, E = E * L, De(`${C}px`, `${w}px`, "hidden"), D = D > 0 ? D : 0, E = E > 0 ? E : 0, J(`${E}px`, `${D}px`);
  }
  function V(c = false) {
    const w = z(), C = h.getBoundingClientRect(), D = w.x - C.x, E = w.y - C.y;
    let L = x.width, $ = x.height;
    if (!c || D < x.width || E < x.height) {
      const Pe = Math.min(D / x.width, E / x.height);
      L = L * Pe, $ = $ * Pe;
    }
    L = L > 0 ? L : 0, $ = $ > 0 ? $ : 0, De("initial", "initial", "hidden"), J(`${$}px`, `${L}px`), et();
  }
  function pe() {
    const c = z(), w = h.getBoundingClientRect(), C = c.x - w.x, D = c.y - w.y;
    C < x.width || D < x.height ? De(`${Math.min(D, x.height)}px`, `${Math.min(C, x.width)}px`, "auto") : De("initial", "initial", "initial"), J(`${x.height}px`, `${x.width}px`), et();
  }
  function Oe(c) {
    const w = x == null ? void 0 : x.getBoundingClientRect(), C = (x == null ? void 0 : x.width) / w.width, D = (x == null ? void 0 : x.height) / w.height, E = {
      x: Math.round((c.clientX - w.left) * C),
      y: Math.round((c.clientY - w.top) * D)
    };
    a.updateMousePosition(E);
  }
  function k(c, w) {
    B && (w && c.button == 0 && !fe ? (x.focus(), fe = true) : v.blur()), a.mouseButtonState(c, w, true);
  }
  function S(c) {
    a.mouseWheel(c);
  }
  function y(c) {
    x.focus({ preventScroll: true }), a.mouseIn(c);
  }
  function F(c) {
    a.mouseOut(c);
  }
  function X(c) {
    const w = navigator.clipboard != null && navigator.clipboard.writeText != null;
    return B && w && Ge(c) && (de = ft, Ze()), a.sendKeyboardEvent(c), true;
  }
  function z() {
    const c = window, w = document, C = w.documentElement, D = w.getElementsByTagName("body")[0], E = c.innerWidth ?? C.clientWidth ?? D.clientWidth, L = c.innerHeight ?? C.clientHeight ?? D.clientHeight;
    return { x: E, y: L };
  }
  async function A() {
    O.info("Start canvas initialization..."), x.width = 800, x.height = 600, a.setCanvas(x), a.setOnCanvasResized(Vt), Ht();
    let c = {
      irgUserInteraction: u.getExposedFunctions()
    };
    O.info("Component ready"), O.info("Dispatching ready event"), p.dispatchEvent(new CustomEvent("ready", {
      detail: c,
      bubbles: true,
      composed: true
    }));
  }
  function m() {
    var _a2;
    for (; ce.length > 0; )
      (_a2 = ce.shift()) == null ? void 0 : _a2();
  }
  rr(async () => {
    O.verbose = r() === "true", O.info("Dom ready"), await A(), ht();
  }), y0(() => {
    window.removeEventListener("resize", Te), window.removeEventListener("focus", m), Ne = true;
  });
  var M = q0(), se = Yt(M);
  let tt;
  var Me = Yt(se);
  Gt(Me, "contenteditable", B);
  var ae = Yt(Me);
  return ae.__mousemove = Oe, ae.__mousedown = [I0, k], ae.__mouseup = [U0, k], ae.__contextmenu = [z0], yt(ae, (c) => x = c, () => x), jt(Me), yt(Me, (c) => v = c, () => v), jt(se), yt(se, (c) => h = c, () => h), jt(M), yt(M, (c) => p = c, () => p), i0(() => {
    tt = m0(se, 1, `screen-wrapper scale-${i() ?? ""}`, "svelte-1103xra", tt, {
      hidden: !I(d),
      "capturing-inputs": b
    }), Gt(se, "style", I(l)), Gt(Me, "style", I(o));
  }), it("paste", Me, wt), it("mouseleave", ae, (c) => {
    k(c, false), F(c);
  }), it("mouseenter", ae, (c) => {
    y(c);
  }), it("wheel", ae, S), it("selectstart", ae, (c) => {
    c.preventDefault();
  }), er(e, M), Qi({
    get scale() {
      return i();
    },
    set scale(c) {
      i(c), nt();
    },
    get verbose() {
      return r();
    },
    set verbose(c) {
      r(c), nt();
    },
    get flexcenter() {
      return n();
    },
    set flexcenter(c) {
      n(c), nt();
    },
    get module() {
      return s();
    },
    set module(c) {
      s(c), nt();
    }
  });
}
f0([
  "mousemove",
  "mousedown",
  "mouseup",
  "contextmenu"
]);
customElements.define("iron-remote-desktop", k0(
  or,
  {
    scale: {},
    verbose: {},
    flexcenter: {},
    module: {}
  },
  [],
  [],
  false,
  (e) => class extends e {
    constructor() {
      super(), this.attachShadow({ mode: "open", delegatesFocus: true });
    }
  }
));
const V0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: or
}, Symbol.toStringTag, { value: "Module" }));
export {
  V0 as default
};
