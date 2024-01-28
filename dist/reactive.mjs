const _ = /* @__PURE__ */ new Map(), d = {
  createStore(t) {
    _.has(t) || (_.set(t, /* @__PURE__ */ new Map()), Object.defineProperty(d, t, {
      get() {
        return _.get(t);
      }
    }));
  }
};
d.createStore("tickets");
function k(t) {
  const e = t.queue.at(t.ticket);
  return t.ticket += 1, t.queue.length === t.ticket && (t.ticket = 0), e;
}
function b(t) {
  d.tickets.has(t.type) || d.tickets.set(t.type, {
    reInvoke: !1,
    ticket: 0,
    queue: []
  });
  const e = d.tickets.get(t.type);
  return t.isReInvoke && (e.reInvoke = !0), e;
}
function M(t) {
  const e = b(t);
  return e.reInvoke ? k(e) : e;
}
class P {
  constructor(e, n, r) {
    this.type = e, this.target = n, this.data = r, this.timeStamp = Date.now();
  }
}
class T extends P {
  constructor() {
    super(...arguments), this.$queue = [];
  }
  addListener(e) {
    return this.$queue.push(e), this;
  }
  _invoke() {
    for (const e of this.$queue)
      e(new P(this.type, this.target, this.data));
  }
}
class j extends Set {
  _invokeAll(e) {
    for (const n of Array.from(this))
      n._invoke();
  }
  _findIn(e, n) {
    return Array.from(this).find((r) => r[e] === n);
  }
}
function h(t) {
  return Array.isArray(t) ? t : [t];
}
function A(t) {
  return typeof t.type == "string" ? h(t.node) : t.childs.map(y).flat();
}
function y(t) {
  return t.node ? t.node : $(t).flat();
}
function $(t) {
  const e = [];
  for (const n of t.childs) {
    let r = n;
    n instanceof p && (r = y(n)), e.push(r);
  }
  return e;
}
function R(t) {
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
function U(t, e) {
  let n, r;
  function o() {
    n && (clearTimeout(n), n = null);
  }
  return function() {
    n || (r = [this, arguments], n = setTimeout(function() {
      o();
      const [s, i] = r;
      t.apply(s, i);
    }, e));
  };
}
function B(t) {
  const e = /* @__PURE__ */ new Map();
  return (n, r) => {
    if (r && r.superCtx && !e.has(n))
      e.set(n, new j([new T("changeState", n, r).addListener(t)]));
    else if (r)
      e.has(n) && r.superCtx && e.get(n).add(new T("changeState", n, r).addListener(t));
    else
      return e.get(n);
  };
}
const m = B((t) => {
  t.target.$update(t.data);
}), F = (() => {
  let t;
  const e = U(() => {
    const n = t;
    t = null, n && n._invoke();
  }, 10);
  return (n, r) => {
    t = n._findIn("data", r), e();
  };
})();
function V(t, e, n) {
  return typeof t[e] == "function" ? t[e].bind(t) : t[e];
}
function S(t, e = !1) {
  const n = f.component, r = M(n);
  if (r instanceof g)
    return r;
  const o = new Proxy(new g(t, e), {
    get(s, i) {
      if (i in s)
        return i === "set" && n ? (u) => (s.set(u), F(m(n), o)) : V(s, i);
      if (typeof s.value[i] != "undefined")
        return !Array.isArray(s.value) && s.value instanceof Object ? s.value[i] : typeof s.value[i] == "function" ? (...u) => {
          if (typeof s.value[i].apply(s.value, u) != "undefined")
            return new l(
              s.value[i].apply(s.value, u),
              o
            );
        } : o;
      throw new Error("error proxy " + i);
    },
    set(s, i, u) {
      if (i in s)
        s[i] = u;
      else if (i in s.data)
        s.data[i] = u;
      else
        return !1;
      return !0;
    }
  });
  return typeof r == "object" && r.queue.push(o), m(n, o), o;
}
function te(t) {
  const e = {}, n = (s) => (i) => {
    e[s].set(i);
  }, r = (s) => {
    let i;
    return () => (i || (i = S(t[s])), i);
  };
  for (let s in t) {
    const i = typeof t[s] == "function" ? { value: t[s].bind(e) } : { get: r(s), set: n(s) };
    Object.defineProperty(e, s, i);
  }
  let o;
  return () => o != null ? o : o = S(e);
}
var Y = /* @__PURE__ */ ((t) => (t[t.CREATE = 0] = "CREATE", t[t.NEW = 1] = "NEW", t[t.UPDATE = 2] = "UPDATE", t[t.DELETE = 3] = "DELETE", t))(Y || {});
class l {
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
class z {
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
    this._store = /* @__PURE__ */ new Map(), this.currentStoreState = new z(e, n);
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
var G = (t, e, n) => {
  if (!e.has(t))
    throw TypeError("Cannot " + n);
}, v = (t, e, n) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, n);
}, J = (t, e, n) => (G(t, e, "access private method"), n), H, L, C, q, D, O;
function K(t) {
  this.isReInvoke = !0, f.component = this;
  const e = this.parentNode, n = typeof this.type == "function" ? R(this) : this, r = this.childs, o = { findIndex: [], oldChilds: [] }, s = t.superCtx ? o : this.childs.reduce((u, a, c) => (
    /*(child instanceof TreeNative && this === child) || */
    ((a instanceof g && a.currentStoreState === t || a instanceof l && a.state.currentStoreState === t) && (u.findIndex.push(c), u.oldChilds.push(a instanceof g ? a.toString() : a.node)), u)
  ), o), i = typeof this.type == "function" ? this.type.call(this, N.call(this, !0)) : !1;
  i !== !1 && (i.parentNode = this, this.childs = h(i)), i instanceof p && (i.isReInvoke = !0, i.render());
  for (let u = 0; u < s.findIndex.length; u++) {
    const a = s.findIndex[u], c = s.oldChilds[u];
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
        return i instanceof l ? i.node : i instanceof p ? h(i) : c;
      }
      get oldChilds() {
        return c;
      }
    }());
  }
  s.findIndex.length === 0 && this.widgedHelper.updateWidget(new class {
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
      return i instanceof l ? i.node : i instanceof p ? h(i) : i;
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
}, W = class E {
  constructor(e, n, r, o) {
    this.type = e, this.properties = n, this.widgedHelper = r, this.originalChilds = o, v(this, H), v(this, L), v(this, C), v(this, D), v(this, O), this.isReInvoke = !1, this.node = void 0, this.parentNode = void 0, this.childs = void 0, this._id = f.pos, this._ns = !1, this._fnparent = void 0, this._listenerOnCreate = () => {
    }, typeof this.type == "string" && this.type === "svg" && (this._ns = !0), n && n.onCreate && (this._listenerOnCreate = n.onCreate, delete this.properties.onCreate);
    for (let s of o)
      this._ns && s instanceof E && (s._ns = !0), typeof this.type == "function" && s instanceof E && (s._fnparent = this);
    f.pos++;
  }
  createNodeAndChilds() {
    typeof this.type == "string" && (this.node = this.widgedHelper.createWidget(this.type, this._ns), this.childs = h(this.originalChilds));
  }
  render() {
    if (f.component = this, this.node && (this.widgedHelper.setProperties(
      this.node,
      N.call(this)
    ), this.isReInvoke && this.widgedHelper.resetWidgets && this.widgedHelper.resetWidgets(A(this))), typeof this.type == "function" && !this.childs) {
      const e = N.call(this, !0), n = this.type.name === "Fragment" ? this.type(e) : this.type.call(this, e);
      this.childs = h(n);
    }
    return J(this, C, q).call(this), this._listenerOnCreate(this.node), this;
  }
  /**
   * el nodo es un objeto que representa la vista
   * si no hay significa que es una funcion
   * buscara el objecto de que representa la vista
   */
  getNodeWidget() {
    return typeof this.node == "object" ? this : R(this);
  }
  $update(e) {
    K.call(this, e.currentStoreState);
  }
};
H = /* @__PURE__ */ new WeakSet();
L = /* @__PURE__ */ new WeakSet();
C = /* @__PURE__ */ new WeakSet();
q = function() {
  this.getNodeWidget();
  for (let t of this.childs)
    (t instanceof W || t instanceof g || t instanceof l) && (t.parentNode = this), t instanceof W ? (typeof this.type == "function" ? t._fnparent = this.type.name !== "Fragment" ? this : this._fnparent : typeof this.type == "string" && this._fnparent && (t._fnparent = this._fnparent), typeof t.type == "string" && this._ns && (t._ns = !0, t.createNodeAndChilds()), this.isReInvoke && (t.createNodeAndChilds(), t.isReInvoke = !0), t.render(), this.widgedHelper.appendWidget(this, t)) : t instanceof l ? this.widgedHelper.appendWidget(this, t) : this.widgedHelper.appendWidget(this, t instanceof g ? (m(t, this), t.toString()) : t);
};
D = /* @__PURE__ */ new WeakSet();
O = /* @__PURE__ */ new WeakSet();
let p = W;
function Q(t) {
  const e = b(f.component);
  return e.reInvoke ? k(e) : (e.queue.push(t), t);
}
d.createStore("memo");
function X(t) {
  const e = Q(t);
  return d.memo.has(e) || d.memo.set(e, !1), (...n) => (d.memo.get(e) === !1 && d.memo.set(e, e(...n)), d.memo.get(e));
}
let w;
const I = (t) => t.find((e) => Z(e.properties));
function Z({ path: t }) {
  const e = location.hash.length && location.hash.startsWith("#") ? location.hash.slice(1) : "/", r = new globalThis.URLPattern(t, location.origin).exec(e, location.origin);
  return w = r ? { path: r.input, params: r.groups } : null, w !== null;
}
function ne({
  children: t,
  notFount: e
}) {
  var n;
  const r = S(!1), o = S(r.value ? null : (n = I(t)) != null ? n : e, !0);
  return X(() => {
    window.addEventListener("hashchange", () => {
      var s;
      r.value === !1 && r.set(!0), o.set((s = I(t)) != null ? s : e);
    });
  })(), o.value.parentNode || (o.value.parentNode = this), o.value;
}
function re(t) {
  return t.render.parentNode = this, t.render;
}
function ie() {
  return w.params;
}
function se() {
  return w.path;
}
let x;
function oe(t) {
  x = t;
}
class ae {
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
      new p(e, n || {}, x, r)
    );
    return o.createNodeAndChilds(), o;
  }
}
function ue(t, e) {
  return e.node = x.querySelector(t), e.render(), e;
}
const ee = typeof window != "undefined";
class de {
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
    if (ee) {
      if (typeof n.type == "function")
        return;
      const r = e.getNodeWidget(), o = n instanceof p ? A(n) : n instanceof l ? n.node.map(y) : n;
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
    let { index: o, oldChilds: s, newChilds: i } = e;
    if (typeof i == "string")
      r.childNodes.item(o).data = i;
    else {
      i = i.map((a) => y(a)).flat(), s = s.map((a) => y(a)).flat();
      const u = i.length > s.length;
      for (let a = 0; a < i.length; a++) {
        const c = i[a];
        s[a] ? s[a].replaceWith(c) : r.insertBefore(c, (n = i[a - 1]) == null ? void 0 : n.nextSibling);
      }
      !u && i.length !== s.length && s.slice(i.length).forEach((a) => {
        a.remove();
      });
    }
  }
}
export {
  d as HookStore,
  de as NativeRender,
  ae as Reactive,
  re as Route,
  ne as Routes,
  g as State,
  Y as StateAction,
  l as StateRender,
  z as StoreState,
  oe as addWidgetHelper,
  te as createState,
  b as createTicket,
  X as exec,
  M as flattenState,
  m as listener,
  k as nextTicket,
  ue as render,
  Q as useCallback,
  ie as useParams,
  se as usePath,
  S as useState
};
