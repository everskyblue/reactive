const _ = /* @__PURE__ */ new Map(), c = {
  createStore(t) {
    _.has(t) || (_.set(t, /* @__PURE__ */ new Map()), Object.defineProperty(c, t, {
      get() {
        return _.get(t);
      }
    }));
  }
};
c.createStore("tickets");
function k(t) {
  const e = t.queue.at(t.ticket);
  return t.ticket += 1, t.queue.length === t.ticket && (t.ticket = 0), e;
}
function A(t) {
  c.tickets.has(t.type) || c.tickets.set(t.type, {
    reInvoke: !1,
    ticket: 0,
    queue: []
  });
  const e = c.tickets.get(t.type);
  return t.isReInvoke && (e.reInvoke = !0), e;
}
c.createStore("states");
function U(t) {
  const e = A(t);
  return e.reInvoke ? k(e) : e;
}
class T {
  constructor(e, n, r) {
    this.type = e, this.target = n, this.data = r, this.timeStamp = Date.now();
  }
}
class I extends T {
  constructor() {
    super(...arguments), this.$queue = [];
  }
  addListener(e) {
    return this.$queue.push(e), this;
  }
  _invoke() {
    for (const e of this.$queue)
      e(new T(this.type, this.target, this.data));
  }
}
class F extends Set {
  _invokeAll(e) {
    for (const n of Array.from(this))
      n._invoke();
  }
  _findIn(e, n) {
    return Array.from(this).find((r) => r[e] === n);
  }
}
function B(t, e = () => {
}, n) {
  for (const r of t)
    ;
}
function ie(t, e) {
  B(e, (n) => {
    j.call(t, n.currentStoreState);
  });
}
function h(t) {
  return Array.isArray(t) ? t : [t];
}
function R(t) {
  return typeof t.type == "string" ? h(t.node) : t.childs.map(y).flat();
}
function y(t) {
  return t.node ? t.node : V(t).flat();
}
function V(t) {
  const e = [];
  for (const n of t.childs) {
    let r = n;
    n instanceof p && (r = y(n)), e.push(r);
  }
  return e;
}
function H(t) {
  let e = t;
  for (; e && typeof e.node != "object"; )
    e = e.parentNode;
  return e;
}
function N(t = !1) {
  const e = {};
  t && (e.children = this.originalChilds);
  for (const n in this.properties)
    t && n === "shareContext" ? e.sharedContext = this.properties[n] : e[n === "className" ? "class" : n] = this.properties[n];
  return e;
}
function Y(t, e, n) {
  var r = null, o = null, i = function() {
    r && (clearTimeout(r), o = null, r = null);
  }, s = function() {
    var a = o;
    i(), a && a();
  }, u = function() {
    if (!e)
      return t.apply(this, arguments);
    var a = this, l = arguments, P = n && !r;
    if (i(), o = function() {
      t.apply(a, l);
    }, r = setTimeout(function() {
      if (r = null, !P) {
        var $ = o;
        return o = null, $();
      }
    }, e), P)
      return o();
  };
  return u.cancel = i, u.flush = s, u;
}
function z(t) {
  const e = /* @__PURE__ */ new Map();
  return (n, r) => {
    if (r && r.superCtx && !e.has(n))
      e.set(n, new F([new I("changeState", n, r).addListener(t)]));
    else if (r)
      e.has(n) && r.superCtx && e.get(n).add(new I("changeState", n, r).addListener(t));
    else
      return e.get(n);
  };
}
const m = z((t) => {
  t.target.$update(t.data);
}), G = (() => {
  let t;
  const e = Y(() => {
    const n = t;
    t = null, n && n._invoke();
  }, 10);
  return (n, r) => {
    t = n._findIn("data", r), e();
  };
})();
function J(t, e, n) {
  return typeof t[e] == "function" ? t[e].bind(t) : t[e];
}
function S(t, e = !1) {
  const n = f.component, r = U(n);
  if (r instanceof g)
    return r;
  const o = new Proxy(new g(t, e), {
    get(i, s) {
      if (s in i)
        return s === "set" && n ? (u) => (i.set(u), G(m(n), o)) : J(i, s);
      if (typeof i.value[s] != "undefined")
        return !Array.isArray(i.value) && i.value instanceof Object ? i.value[s] : typeof i.value[s] == "function" ? (...u) => {
          if (typeof i.value[s].apply(i.value, u) != "undefined")
            return new d(
              i.value[s].apply(i.value, u),
              o
            );
        } : o;
      throw new Error("error proxy " + s);
    },
    set(i, s, u) {
      if (s in i)
        i[s] = u;
      else if (s in i.data)
        i.data[s] = u;
      else
        return !1;
      return !0;
    }
  });
  return typeof r == "object" && r.queue.push(o), m(n, o), o;
}
function se(t) {
  const e = {}, n = (i) => (s) => {
    e[i].set(s);
  }, r = (i) => {
    let s;
    return () => (s || (s = S(t[i])), s);
  };
  for (let i in t) {
    const s = typeof t[i] == "function" ? { value: t[i].bind(e) } : { get: r(i), set: n(i) };
    Object.defineProperty(e, i, s);
  }
  let o;
  return () => o != null ? o : o = S(e);
}
var K = /* @__PURE__ */ ((t) => (t[t.CREATE = 0] = "CREATE", t[t.NEW = 1] = "NEW", t[t.UPDATE = 2] = "UPDATE", t[t.DELETE = 3] = "DELETE", t))(K || {});
class d {
  constructor(e, n) {
    this.state = n, this._parentNode = null, this.node = null, this.node = e.map((r) => r.render());
  }
  set parentNode(e) {
    this._parentNode = e, m(this.state, e);
  }
  get parentNode() {
    return this._parentNode;
  }
}
class Q {
  /**
   *
   * @param superCtx context superiority
   * @param data create data
   * @param TYPE_ACTION default action create
   */
  constructor(e, n, r = 0) {
    this.superCtx = n, this.TYPE_ACTION = r, this.store = [], this.data = e;
  }
  /**
   * add new data and store
   */
  set data(e) {
    var n;
    Array.isArray(e) && (this.TYPE_ACTION = e.length > ((n = this.previousData) == null ? void 0 : n.length) ? 2 : 3), this.store.push(e);
  }
  /**
   * current data
   */
  get data() {
    return this.store.at(-1);
  }
  /**
   * obtener datos anterior. sirve para controlar la diferencia del dato actual y nuevo
   *
   * get previous data It is used to control the difference between current and new data.
   */
  get previousData() {
    return this.store.at(-2);
  }
  toString() {
    var e, n;
    return (n = (e = this.data) == null ? void 0 : e.toString()) != null ? n : "";
  }
}
class g {
  constructor(e, n) {
    this._store = /* @__PURE__ */ new Map(), this.currentStoreState = new Q(e, n);
  }
  get parentNode() {
    return this.currentParentNode;
  }
  get superCtx() {
    return this.currentStoreState.superCtx;
  }
  get previousData() {
    return this.currentStoreState.previousData;
  }
  /**
   * actualiza el nodo en el que está el estado
   *
   * update the node the status is on
   */
  set parentNode(e) {
  }
  get value() {
    return this.currentStoreState.data;
  }
  set value(e) {
    this.currentStoreState.data = e;
  }
  /**
   *
   * @param proxy store proxy
   */
  addProxySelf(e) {
    return this.proxySelf = e, this;
  }
  /**
   * nuevo estado
   *
   * new state
   */
  set(e) {
    this.value = e;
  }
  /**
   * is more for true and false values (value === data)
   *
   * @returns
   */
  is(e) {
    return this.value === e;
  }
  toString() {
    return this.currentStoreState.toString();
  }
  [Symbol.toPrimitive]() {
    return this.toString();
  }
  *[Symbol.iterator]() {
    for (const e of this.value)
      yield e;
  }
}
var X = (t, e, n) => {
  if (!e.has(t))
    throw TypeError("Cannot " + n);
}, v = (t, e, n) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, n);
}, Z = (t, e, n) => (X(t, e, "access private method"), n), L, q, C, D, O, M;
function j(t) {
  this.isReInvoke = !0, f.component = this;
  const e = this.parentNode, n = typeof this.type == "function" ? H(this) : this, r = this.childs, o = { findIndex: [], oldChilds: [] }, i = t.superCtx ? o : this.childs.reduce((u, a, l) => (
    /*(child instanceof TreeWidget && this === child) || */
    ((a instanceof g && a.currentStoreState === t || a instanceof d && a.state.currentStoreState === t) && (u.findIndex.push(l), u.oldChilds.push(a instanceof g ? a.toString() : a.node)), u)
  ), o), s = typeof this.type == "function" ? this.type.call(this, N.call(this, !0)) : !1;
  s !== !1 && (s.parentNode = this, this.childs = h(s)), s instanceof p && (s.isReInvoke = !0, s.render());
  for (let u = 0; u < i.findIndex.length; u++) {
    const a = i.findIndex[u], l = i.oldChilds[u];
    this.widgedHelper.updateWidget(new class {
      getNodeParent() {
        return n.node;
      }
      getParent() {
        return e;
      }
      get index() {
        return a;
      }
      get newChilds() {
        return s instanceof d ? s.node : s instanceof p ? h(s) : l;
      }
      get oldChilds() {
        return l;
      }
    }());
  }
  i.findIndex.length === 0 && this.widgedHelper.updateWidget(new class {
    getNodeParent() {
      return n.node;
    }
    getParent() {
      return e;
    }
    get index() {
      return -1;
    }
    get newChilds() {
      return s instanceof d ? s.node : s instanceof p ? h(s) : s;
    }
    get oldChilds() {
      return r;
    }
  }());
}
const f = {
  pos: 0,
  current: 0,
  component: null
}, W = class x {
  constructor(e, n, r, o) {
    this.type = e, this.properties = n, this.widgedHelper = r, this.originalChilds = o, v(this, L), v(this, q), v(this, C), v(this, O), v(this, M), this.isReInvoke = !1, this.node = void 0, this.parentNode = void 0, this.childs = void 0, this._id = f.pos, this._ns = !1, this._fnparent = void 0, this._listenerOnCreate = () => {
    }, typeof this.type == "string" && this.type === "svg" && (this._ns = !0), n && n.onCreate && (this._listenerOnCreate = n.onCreate, delete this.properties.onCreate);
    for (let i of o)
      this._ns && i instanceof x && (i._ns = !0), typeof this.type == "function" && i instanceof x && (i._fnparent = this);
    f.pos++;
  }
  createNodeAndChilds() {
    typeof this.type == "string" && (this.node = this.widgedHelper.createWidget(this.type, this._ns), this.childs = h(this.originalChilds));
  }
  render() {
    if (f.component = this, this.node && (this.widgedHelper.setProperties(
      this.node,
      N.call(this)
    ), this.isReInvoke && this.widgedHelper.resetWidgets && this.widgedHelper.resetWidgets(R(this))), typeof this.type == "function" && !this.childs) {
      const e = N.call(this, !0), n = this.type.name === "Fragment" ? this.type(e) : this.type.call(this, e);
      this.childs = h(n);
    }
    return Z(this, C, D).call(this), this._listenerOnCreate(this.node), this;
  }
  /**
   * el nodo es un objeto que representa la vista
   * si no hay significa que es una funcion
   * buscara el objecto de que representa la vista
   */
  getNodeWidget() {
    return typeof this.node == "object" ? this : H(this);
  }
  $update(e) {
    j.call(this, e.currentStoreState);
  }
};
L = /* @__PURE__ */ new WeakSet();
q = /* @__PURE__ */ new WeakSet();
C = /* @__PURE__ */ new WeakSet();
D = function() {
  this.getNodeWidget();
  for (let t of this.childs)
    (t instanceof W || t instanceof g || t instanceof d) && (t.parentNode = this), t instanceof W ? (typeof this.type == "function" ? t._fnparent = this.type.name !== "Fragment" ? this : this._fnparent : typeof this.type == "string" && this._fnparent && (t._fnparent = this._fnparent), typeof t.type == "string" && this._ns && (t._ns = !0, t.createNodeAndChilds()), this.isReInvoke && (t.createNodeAndChilds(), t.isReInvoke = !0), t.render(), this.widgedHelper.appendWidget(this, t)) : t instanceof d ? this.widgedHelper.appendWidget(this, t) : this.widgedHelper.appendWidget(this, t instanceof g ? (m(t, this), t.toString()) : t);
};
O = /* @__PURE__ */ new WeakSet();
M = /* @__PURE__ */ new WeakSet();
let p = W;
function ee(t) {
  const e = A(f.component);
  return e.reInvoke ? k(e) : (e.queue.push(t), t);
}
c.createStore("memo");
function te(t) {
  const e = ee(t);
  return c.memo.has(e) || c.memo.set(e, !1), (...n) => (c.memo.get(e) === !1 && c.memo.set(e, e(...n)), c.memo.get(e));
}
let w;
const b = (t) => t.find((e) => ne(e.properties));
function ne({ path: t }) {
  const e = location.hash.length && location.hash.startsWith("#") ? location.hash.slice(1) : "/", r = new globalThis.URLPattern(t, location.origin).exec(e, location.origin);
  return w = r ? { path: r.input, params: r.groups } : null, w !== null;
}
function oe({
  children: t,
  notFount: e
}) {
  var n;
  const r = S(!1), o = S(r.value ? null : (n = b(t)) != null ? n : e, !0);
  return te(() => {
    window.addEventListener("hashchange", () => {
      var i;
      r.value === !1 && r.set(!0), o.set((i = b(t)) != null ? i : e);
    });
  })(), o.value.parentNode || (o.value.parentNode = this), o.value;
}
function ae(t) {
  return t.render.parentNode = this, t.render;
}
function ue() {
  return w.params;
}
function ce() {
  return w.path;
}
let E;
function le(t) {
  E = t;
}
class de {
  /**
   *
   * @param elements tree childs
   * @returns
   */
  static Fragment({
    children: e
  }) {
    return e;
  }
  /**
   * crear la interfaz del nodo
   *
   * create node interface
   *
   * @param type type element jsx
   * @param properties properties received jsx
   * @param childs tree childs
   * @returns
   */
  static createElement(e, n, ...r) {
    const o = Object.seal(
      new p(e, n || {}, E, r)
    );
    return o.createNodeAndChilds(), o;
  }
}
function he(t, e) {
  return e.node = E.querySelector(t), e.render(), e;
}
const re = typeof window != "undefined";
class fe {
  constructor() {
    this.resetWidgets = (e) => {
      for (const n of e)
        n.innerHTML = "";
    };
  }
  createWidget(e, n) {
    return n ? document.createElementNS("http://www.w3.org/2000/svg", e) : document.createElement(e);
  }
  appendWidget(e, n) {
    if (re) {
      if (typeof n.type == "function")
        return;
      const r = e.getNodeWidget(), o = n instanceof p ? R(n) : n instanceof d ? n.node.map(y) : n;
      Array.isArray(o) ? r.node.append(...o) : r.node.append(o);
    }
  }
  setProperties(e, n) {
    for (const r in n) {
      const o = n[r];
      r.startsWith("on") ? e.addEventListener(r.slice(2).toLowerCase(), o) : e.setAttribute(
        r === "className" ? "class" : r,
        String(o)
      );
    }
  }
  querySelector(e) {
    return document.querySelector(e);
  }
  updateWidget(e) {
    var n;
    const r = e.getNodeParent();
    let { index: o, oldChilds: i, newChilds: s } = e;
    if (typeof s == "string")
      r.childNodes.item(o).data = s;
    else {
      s = s.map((a) => y(a)).flat(), i = i.map((a) => y(a)).flat();
      const u = s.length > i.length;
      for (let a = 0; a < s.length; a++) {
        const l = s[a];
        i[a] ? i[a].replaceWith(l) : r.insertBefore(l, (n = s[a - 1]) == null ? void 0 : n.nextSibling);
      }
      !u && s.length !== i.length && i.slice(s.length).forEach((a) => {
        a.remove();
      });
    }
  }
}
export {
  c as HookStore,
  fe as NativeRender,
  de as Reactive,
  ae as Route,
  oe as Routes,
  g as State,
  K as StateAction,
  d as StateRender,
  Q as StoreState,
  le as addWidgetHelper,
  se as createState,
  A as createTicket,
  te as exec,
  U as flattenState,
  ie as implementStates,
  m as listener,
  k as nextTicket,
  he as render,
  ee as useCallback,
  ue as useParams,
  ce as usePath,
  S as useState
};
