const m = /* @__PURE__ */ new Map(), d = {
  createStore(e) {
    m.has(e) || (m.set(e, /* @__PURE__ */ new Map()), Object.defineProperty(d, e, {
      get() {
        return m.get(e);
      }
    }));
  }
};
d.createStore("tickets");
function I(e) {
  const t = e.queue.at(e.ticket);
  return e.ticket += 1, e.queue.length === e.ticket && (e.ticket = 0), t;
}
function b(e) {
  d.tickets.has(e) || d.tickets.set(e, {
    reInvoke: !1,
    ticket: 0,
    queue: []
  });
  const t = d.tickets.get(e);
  return e.isReInvoke && (t.reInvoke = !0), t;
}
d.createStore("callbacks");
function V(e, t) {
  const n = b(t);
  return n.reInvoke ? I(n) : (n.queue.push(e), e);
}
d.createStore("memo");
function k(e, t) {
  const n = V(e, t);
  return d.memo.has(n) || d.memo.set(n, !1), (...r) => (d.memo.get(n) === !1 && d.memo.set(n, n(...r)), d.memo.get(n));
}
d.createStore("states");
function A(e) {
  const t = b(e);
  return t.reInvoke ? I(t) : t;
}
var B = /* @__PURE__ */ ((e) => (e[e.CREATE = 0] = "CREATE", e[e.NEW = 1] = "NEW", e[e.UPDATE = 2] = "UPDATE", e[e.PREPEND = 3] = "PREPEND", e))(B || {});
class u {
  constructor(t, n) {
    this.state = n, this._parentNode = null, this.node = null, this.node = t.map((r) => r.render());
  }
  set parentNode(t) {
    this._parentNode = t, t.implementStates(this.state);
  }
  get parentNode() {
    return this._parentNode;
  }
}
class F {
  /**
   *
   * @param superCtx context superiority
   * @param data create data
   * @param TYPE_ACTION default action create
   */
  constructor(t, n, r = 0) {
    this.superCtx = t, this.TYPE_ACTION = r, this.store = [], this.data = n;
  }
  /**
   * add new data and store
   */
  set data(t) {
    if (this.TYPE_ACTION === 3 && (this.rendering = t), this.TYPE_ACTION !== 3) {
      if (this.store.includes(t))
        return;
      this.store.push(t);
    }
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
    var t, n;
    return (n = (t = this.data) == null ? void 0 : t.toString()) != null ? n : "";
  }
}
function z(e, t, n) {
  t.TYPE_ACTION = n, t.data = e;
}
class c {
  /* public set data(v: any) {
      this.store.forEach((storeState, ctx) => {
          storeState.data = v;
      });
      //this.currentStoreState.data = v;
  } */
  constructor(t, n) {
    this.store = /* @__PURE__ */ new Map(), this.currentStoreState = new F(n, t);
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
  set parentNode(t) {
  }
  get data() {
    return this.currentStoreState.data;
  }
  /**
   *
   * @param proxy store proxy
   */
  addProxySelf(t) {
    return this.proxySelf = t, this;
  }
  /**
   * nuevo estado
   *
   * new state
   */
  set(t) {
    z(
      t,
      this.currentStoreState,
      1
      /* NEW */
    );
  }
  /**
   * si hay nuevos datos invoca la funcion envolvente que retorna los nuevos valores
   *
   * if there is new data, call the enclosing function that returns the new values
   */
  /*invokeNode() {
      if (this.store.size > 1) {
          throw new Error("error");
      }
      for (const [ctx, storeState] of this.store.entries()) {
          console.log("RENDER STATE", ctx, storeState);
          ctx.render(true, storeState);
      }
  }*/
  /**
   * is more for true and false values (value === data)
   *
   * @returns
   */
  is(t) {
    return this.currentStoreState.data === t;
  }
  toString() {
    return this.currentStoreState.toString();
  }
  [Symbol.toPrimitive]() {
    return this.toString();
  }
  *[Symbol.iterator]() {
    for (const t of this.currentStoreState.data)
      yield t;
  }
}
function G(e, t) {
  return typeof e[t] == "function" ? e[t].bind(e) : e[t];
}
function E(e, t) {
  const n = t ? A(t) : void 0;
  if (n instanceof c)
    return n;
  const r = new Proxy(new c(e, t), {
    get(i, s) {
      if (s === "flatten")
        return n;
      if (s in i)
        return G(i, s);
      if (typeof i.data[s] != "undefined")
        return !Array.isArray(i.data) && i.data instanceof Object ? i.data[s] : typeof i.data[s] == "function" ? (...a) => {
          if (typeof i.data[s].apply(i.data, a) != "undefined")
            return new u(
              i.data[s].apply(i.data, a),
              r
            );
        } : r;
      throw new Error("error proxy " + s);
    },
    set(i, s, a) {
      if (s in i)
        i[s] = a;
      else if (s in i.data)
        i.data[s] = a;
      else
        return !1;
      return !0;
    }
  });
  return typeof n == "object" && n.queue.push(r), r;
}
function $(e, t) {
  const { state: n, callback: r, option: i } = e != null ? e : {};
  return r ? r.call(this, { state: n, option: i, children: t }) : t;
}
let S;
const T = (e) => e.find((t) => J(t.properties));
function J({ path: e }) {
  const t = location.hash.length && location.hash.startsWith("#") ? location.hash.slice(1) : "/", r = new globalThis.URLPattern(e, location.origin).exec(t, location.origin);
  return S = r ? { path: r.input, params: r.groups } : null, S !== null;
}
function ee({
  children: e,
  notFount: t
}) {
  const n = E(!1, this), r = E(n.data ? t : T(e), this);
  return k(() => {
    this.implementStates(r), window.addEventListener("hashchange", () => {
      var i;
      n.data === !1 && n.set(!0), r.set((i = T(e)) != null ? i : t);
    });
  }, this)(), r.data.parentNode || (r.data.parentNode = this), r.data;
}
function te(e) {
  return e.render.parentNode = this, e.render;
}
function ne() {
  return S.params;
}
function re() {
  return S.path;
}
function K(e) {
  let t = e.flatten;
  e.currentStoreState.superCtx && !t && (t = A(
    e.currentStoreState.superCtx
  )), t && !(t instanceof c) && (t.reInvoke = !0);
}
function H(e, t = () => {
}) {
  for (const n of e) {
    const r = n.set.bind(n);
    n.set = (i) => {
      K(n), r(i), t(n);
    };
  }
}
function ie(e, t) {
  k(() => {
    H(t, (n) => {
      v.call(e, n.currentStoreState);
    });
  }, e)();
}
function y(e) {
  return Array.isArray(e) ? e : [e];
}
function O(e) {
  return typeof e.type == "string" ? y(e.node) : e.childs.map(p).flat();
}
function p(e) {
  return e.node ? e.node : Q(e).flat();
}
function Q(e) {
  const t = [];
  for (const n of e.childs) {
    let r = n;
    n instanceof h && (r = p(n)), t.push(r);
  }
  return t;
}
function D(e) {
  let t = e;
  for (; t && typeof t.node != "object"; )
    t = t.parentNode;
  return t;
}
function w(e = !1) {
  const t = {};
  e && (t.children = this.originalChilds);
  for (const n in this.properties)
    e && n === "shareContext" ? t.sharedContext = this.properties[n] : t[n === "className" ? "class" : n] = this.properties[n];
  return t;
}
var X = (e, t, n) => {
  if (!t.has(e))
    throw TypeError("Cannot " + n);
}, l = (e, t, n) => {
  if (t.has(e))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(e) : t.set(e, n);
}, R = (e, t, n) => (X(e, t, "access private method"), n), q, L, N, M, j, _, U;
function v(e) {
  this.isReInvoke = !0;
  const t = this.parentNode, n = typeof this.type == "function" ? D(this) : this, r = this.childs;
  let i = r.findIndex((g) => g instanceof h || g instanceof c || g instanceof u && g.state.currentStoreState === e);
  const s = r[i], a = s instanceof h ? [s] : s instanceof u ? s.node : s.toString();
  typeof this.type == "function" && (r[i] = this.type.call(this, w.call(this, !0)));
  const o = r[i], f = o instanceof h;
  f && (o.parentNode = this);
  const Y = f ? [o.render()] : o instanceof c ? o.toString() : o.node;
  this.widgedHelper.updateWidget(new class {
    getNodeParent() {
      return n.node;
    }
    getParent() {
      return t;
    }
    get index() {
      return i;
    }
    get newChilds() {
      return Y;
    }
    get oldChilds() {
      return a;
    }
  }());
}
const x = {
  pos: 0,
  current: 0
}, C = class W {
  constructor(t, n, r, i) {
    this.type = t, this.properties = n, this.widgedHelper = r, this.originalChilds = i, l(this, q), l(this, L), l(this, N), l(this, j), l(this, _), this.isReInvoke = !1, this.node = void 0, this.parentNode = void 0, this.childs = void 0, this._id = x.pos, this._ns = !1, this._fnparent = void 0, this._listenerOnCreate = () => {
    }, typeof this.type == "string" && this.type === "svg" && (this._ns = !0), n && n.onCreate && (this._listenerOnCreate = n.onCreate, delete this.properties.onCreate);
    for (let s of i)
      this._ns && s instanceof W && (s._ns = !0), typeof this.type == "function" && s instanceof W && (s._fnparent = this);
    x.pos++;
  }
  createNodeAndChilds() {
    typeof this.type == "string" && (this.node = this.widgedHelper.createWidget(this.type, this._ns), this.childs = y(this.originalChilds));
  }
  render() {
    if (this.node && (this.widgedHelper.setProperties(
      this.node,
      w.call(this)
    ), this.isReInvoke && this.widgedHelper.resetWidgets && this.widgedHelper.resetWidgets(O(this))), typeof this.type == "function" && !this.childs) {
      const t = w.call(this, !0), n = this.type.name === "Fragment" ? this.type(t) : this.type.call(this, t);
      this.childs = y(n);
    }
    return R(this, N, M).call(this), this._listenerOnCreate(this.node), this;
  }
  /**
   * el nodo es un objeto que representa la vista
   * si no hay significa que es una funcion
   * buscara el objecto de que representa la vista
   */
  getNodeWidget() {
    return typeof this.node == "object" ? this : D(this);
  }
  implementStates(...t) {
    H(t, (n) => {
      R(this, _, U).call(this, n.currentStoreState);
    });
  }
};
q = /* @__PURE__ */ new WeakSet();
L = /* @__PURE__ */ new WeakSet();
N = /* @__PURE__ */ new WeakSet();
M = function() {
  this.getNodeWidget();
  for (let e of this.childs)
    (e instanceof C || e instanceof c || e instanceof u) && (e.parentNode = this), e instanceof C ? (typeof this.type == "function" ? e._fnparent = this.type.name !== "Fragment" ? this : this._fnparent : typeof this.type == "string" && this._fnparent && (e._fnparent = this._fnparent), typeof e.type == "string" && this._ns && (e._ns = !0, e.createNodeAndChilds()), this.isReInvoke && (e.createNodeAndChilds(), e.isReInvoke = !0), e.render(), this.widgedHelper.appendWidget(this, e)) : e instanceof u ? this.widgedHelper.appendWidget(this, e) : this.widgedHelper.appendWidget(this, e instanceof c ? (this.implementStates(e), e.toString()) : e);
};
j = /* @__PURE__ */ new WeakSet();
_ = /* @__PURE__ */ new WeakSet();
U = function(e) {
  return e.superCtx ? v.call(e.superCtx, e) : v.call(this, e);
};
let h = C, P;
function se(e) {
  P = e;
}
class oe {
  /**
   *
   * @param elements tree childs
   * @returns
   */
  static Fragment({
    children: t
  }) {
    return t;
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
  static createElement(t, n, ...r) {
    const i = Object.seal(
      new h(t, n || {}, P, r)
    );
    return i.createNodeAndChilds(), i;
  }
}
function ae(e, t) {
  return t.node = P.querySelector(e), t.render(), t;
}
const Z = typeof window != "undefined";
class de {
  constructor() {
    this.resetWidgets = (t) => {
      for (const n of t)
        n.innerHTML = "";
    };
  }
  createWidget(t, n) {
    return n ? document.createElementNS("http://www.w3.org/2000/svg", t) : document.createElement(t);
  }
  appendWidget(t, n) {
    if (Z) {
      if (typeof n.type == "function")
        return;
      const r = t.getNodeWidget(), i = n instanceof h ? O(n) : n instanceof u ? n.node.map(p) : n;
      Array.isArray(i) ? r.node.append(...i) : r.node.append(i);
    }
  }
  setProperties(t, n) {
    for (const r in n) {
      const i = n[r];
      r.startsWith("on") ? t.addEventListener(r.slice(2).toLowerCase(), i) : t.setAttribute(
        r === "className" ? "class" : r,
        String(i)
      );
    }
  }
  querySelector(t) {
    return document.querySelector(t);
  }
  updateWidget(t) {
    var n;
    const r = t.getNodeParent();
    let { index: i, oldChilds: s, newChilds: a } = t;
    if (typeof a == "string")
      r.childNodes.item(i).data = a;
    else {
      a = a.map((o) => p(o)), s = s.map((o) => p(o)), a.length > s.length;
      for (let o = 0; o < a.length; o++) {
        const f = a[o];
        s[o] ? s[o].replaceWith(f) : r.insertBefore(f, (n = a[o - 1]) == null ? void 0 : n.nextSibling);
      }
    }
  }
}
export {
  $ as Execute,
  d as HookStore,
  de as NativeRender,
  oe as Reactive,
  te as Route,
  ee as Routes,
  c as State,
  B as StateAction,
  u as StateRender,
  F as StoreState,
  se as addWidgetHelper,
  b as createTicket,
  k as exec,
  A as flattenState,
  ie as implementStates,
  I as nextTicket,
  ae as render,
  V as useCallback,
  ne as useParams,
  re as usePath,
  E as useState
};
