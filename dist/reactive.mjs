var m = /* @__PURE__ */ ((e) => (e[e.CREATE = 0] = "CREATE", e[e.NEW = 1] = "NEW", e[e.UPDATE = 2] = "UPDATE", e[e.PREPEND = 3] = "PREPEND", e))(m || {});
class b {
  /**
   *
   * @param superCtx context superiority
   * @param data create data
   * @param TYPE_ACTION default action create
   */
  constructor(t, r, n = 0) {
    this.superCtx = t, this.TYPE_ACTION = n, this.store = [], this.data = r;
  }
  /**
   * add new data and store
   */
  set data(t) {
    const r = this.data;
    if (this.TYPE_ACTION === 1 || this.TYPE_ACTION === 0 ? this._current = t : this.TYPE_ACTION === 2 ? this._current = t : this.TYPE_ACTION === 3 && (this.rendering = t), this.TYPE_ACTION !== 3) {
      if (this.store.includes(t))
        return;
      this.TYPE_ACTION === 2 ? this.store.push(
        this._current = [...r, ...this._current]
      ) : this.store.push(this._current);
    }
  }
  /**
   * current data
   */
  get data() {
    return this._current;
  }
  /**
   * obtener datos anterior. sirve para controlar la diferencia del dato actual y nuevo
   *
   * get previous data It is used to control the difference between current and new data.
   */
  get previousData() {
    return this.store.at(-1);
  }
  toString() {
    var t, r;
    return (r = (t = this.data) == null ? void 0 : t.toString()) != null ? r : "";
  }
}
function W(e, t, r) {
  t.TYPE_ACTION = r, t.data = e;
}
class d {
  /* public set data(v: any) {
      this.store.forEach((storeState, ctx) => {
          storeState.data = v;
      });
      //this.currentStoreState.data = v;
  } */
  constructor(t, r) {
    this.superCtx = r, this.store = /* @__PURE__ */ new Map(), this.currentStoreState = new b(r, t);
  }
  get parentNode() {
    return this.currentParentNode;
  }
  /**
   * actualiza el nodo en el que está el estado
   *
   * update the node the status is on
   */
  set parentNode(t) {
    this.currentParentNode = t, typeof this.currentStoreState.parentNode != "undefined" && this.currentStoreState.parentNode !== t && (this.currentStoreState = new b(
      this.superCtx,
      this.currentStoreState.data
    )), this.currentStoreState.parentNode = t, this.store.set(t, this.currentStoreState);
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
    W(
      t,
      this.currentStoreState,
      1
      /* NEW */
    );
  }
  /**
   * empuja nuevos datos al arreglo
   *
   * push new data to array
   */
  append(t) {
    W(
      t,
      this.proxySelf ? this.proxySelf.currentStoreState : this.currentStoreState,
      2
      /* UPDATE */
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
   * si el tipo de dato que a añadido en invoca una funcion retornando nuevos valores,
   * esta funcion añade esos nuevos datos.
   * sirve mas para un arreglo de elementos que devuelve una vista
   *
   * If the data type you added in invokes a function returning new values,
   * this function adds that new data.
   * it works better for an array of elements that returns a view
   *
   * @example
   * ```javascript
   *  state.map(value => (<p>{value}</p>));
   * ```
   */
  $setReturnData(t) {
    return this.currentStoreState.TYPE_ACTION = 3, this.currentStoreState.data = t, this;
  }
  $map(t) {
    if (Array.isArray(this.data))
      return this.currentStoreState.TYPE_ACTION = 3, this.currentStoreState.data = this.data.map(t);
    throw new Error("data is not array");
  }
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
class J extends Text {
  constructor(t) {
    super(t);
  }
  get text() {
    return this.data;
  }
  set text(t) {
    this.data = t;
  }
}
class nt {
  constructor() {
    this.resetWidgets = (t) => {
      for (const r of t)
        r.innerHTML = "";
    };
  }
  replaceChild(t, r, n) {
    if (r.length === n.length)
      n.forEach((i, s) => {
        i.replaceWith(r[s]);
      });
    else if (n.length === 1)
      n.at(0).replaceWith(...r);
    else {
      let i = n.at(-1).nextSibling;
      n.forEach((s) => s.remove()), r.forEach((s) => {
        t.insertBefore(s, i);
      });
    }
  }
  setText(t, r) {
    t.textContent = r;
  }
  createText(t) {
    return new J(t);
  }
  createWidget(t, r) {
    return r ? document.createElementNS("http://www.w3.org/2000/svg", t) : document.createElement(t);
  }
  appendWidget(t, r) {
    t.append(
      ...Array.isArray(r) ? r : [r]
    );
  }
  setProperties(t, r) {
    for (const n in r) {
      const i = r[n];
      n.startsWith("on") ? t.addEventListener(n.slice(2).toLowerCase(), i) : t.setAttribute(n === "className" ? "class" : n, String(i));
    }
  }
  querySelector(t) {
    return document.querySelector(t);
  }
  updateWidget(t) {
    var r;
    const n = t.node.childNodes, i = n.item(t.updateIndex), s = i == null ? void 0 : i.previousSibling;
    if (!t.state)
      return;
    if (t.isStringable)
      return i.data = t.state;
    const a = Array.from(n).slice(t.updateIndex).slice(0, t.totalChilds), c = (r = a.at(-1)) == null ? void 0 : r.nextSibling;
    if (t.typeAction === m.NEW) {
      for (let p = 0; p < a.length; p++)
        a[p].remove();
      if (n.length === 0 || !i && !s && !c)
        return t.node.append(...t.state);
      if (i.parentNode)
        return i.before(...t.state);
      if (c && !i.parentNode)
        return c.before(...t.state);
      s.after(...t.state);
    } else
      t.typeAction === m.UPDATE && t.node.append(...t.state);
  }
}
const _ = /* @__PURE__ */ new Map(), o = {
  createStore(e) {
    _.has(e) || (_.set(e, /* @__PURE__ */ new Map()), Object.defineProperty(o, e, {
      get() {
        return _.get(e);
      }
    }));
  }
};
o.createStore("tickets");
function k(e) {
  const t = e.queue.at(e.ticket);
  return e.ticket += 1, e.queue.length === e.ticket && (e.ticket = 0), t;
}
function D(e) {
  return o.tickets.has(e) || o.tickets.set(e, {
    reInvoke: !1,
    ticket: 0,
    queue: []
  }), o.tickets.get(e);
}
o.createStore("callbacks");
function K(e, t) {
  const r = D(t);
  return r.reInvoke ? k(r) : (r.queue.push(e), e);
}
o.createStore("memo");
function Y(e, t) {
  const r = K(e, t);
  return o.memo.has(r) || o.memo.set(r, !1), (...n) => (o.memo.get(r) === !1 && o.memo.set(r, r(...n)), o.memo.get(r));
}
o.createStore("states");
function q(e) {
  const t = D(e);
  return t.reInvoke ? k(t) : t;
}
function Q(e, t) {
  return typeof e[t] == "function" ? e[t].bind(e) : e[t];
}
function I(e, t) {
  const r = t ? q(t) : void 0;
  if (r instanceof d)
    return r;
  const n = new Proxy(new d(e, t), {
    get(i, s) {
      if (s === "flatten")
        return r;
      if (s in i)
        return Q(i, s);
      if (typeof i.data[s] != "undefined")
        return !Array.isArray(i.data) && i.data instanceof Object ? i.data[s] : typeof i.data[s] == "function" ? (...a) => {
          if (typeof i.data[s].apply(i.data, a) != "undefined")
            return i.$setReturnData(
              i.data[s].apply(i.data, a)
            );
        } : n;
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
  return typeof r == "object" && r.queue.push(n), n;
}
function it(e, t) {
  const { state: r, callback: n, option: i } = e != null ? e : {};
  return n ? n.call(this, { state: r, option: i, children: t }) : t;
}
let S;
const R = (e) => e.find((t) => X(t.properties));
function X({ path: e }) {
  const t = location.hash.length && location.hash.startsWith("#") ? location.hash.slice(1) : "/", n = new globalThis.URLPattern(e, location.origin).exec(t, location.origin);
  return S = n ? { path: n.input, params: n.groups } : null, S !== null;
}
function st({
  children: e,
  notFount: t
}) {
  const r = I(!1, this), n = I(r.data ? t : R(e), this);
  return Y(() => {
    this.implementStates(n), window.addEventListener("hashchange", () => {
      var i;
      r.data === !1 && r.set(!0), n.set((i = R(e)) != null ? i : t);
    });
  }, this)(), n.data.parentNode || (n.data.parentNode = this), n.data;
}
function at(e) {
  return e.render.parentNode = this, e.render;
}
function ot() {
  return S.params;
}
function ct() {
  return S.path;
}
function O(e) {
  let t = e.flatten;
  e.currentStoreState.superCtx && !t && (t = q(
    e.currentStoreState.superCtx
  )), t && !(t instanceof d) && (t.reInvoke = !0);
}
function Z(e, t = () => {
}) {
  for (const r of e) {
    const n = r.set.bind(r), i = r.append.bind(r);
    r.set = (s) => {
      O(r), n(s), t(r);
    }, r.append = (s) => {
      O(r), i(s), t(r);
    };
  }
}
function dt(...e) {
  var t;
  for (const r of e) {
    const [n, i] = Array.isArray(r) ? r : [r], s = (t = n.currentStoreState.superCtx) != null ? t : i;
    if (typeof s == "undefined")
      throw new Error("el estado no tiene el contexto del componente");
    Y(() => {
      i && (n.currentStoreState.superCtx = s), s.implementStates(n);
    }, s)();
  }
}
function g(e) {
  return Array.isArray(e) ? e : [e];
}
function l(e) {
  return typeof e.type == "string" ? g(e.node) : e.childs.map(U).flat();
}
function U(e) {
  return e.node ? e.node : tt(e).flat();
}
function tt(e) {
  const t = [];
  for (const r of e.childs) {
    let n = r;
    r instanceof G && (n = U(r)), t.push(n);
  }
  return t;
}
function j(e) {
  let t = e;
  for (; t && typeof t.node != "object"; )
    t = t.parentNode;
  return t;
}
function y(e = !1) {
  const t = {};
  e && (t.children = this.originalChilds);
  for (const r in this.properties)
    e && r === "shareContext" ? t.sharedContext = this.properties[r] : t[r === "className" ? "class" : r] = this.properties[r];
  return t;
}
var et = (e, t, r) => {
  if (!t.has(e))
    throw TypeError("Cannot " + r);
}, h = (e, t, r) => {
  if (t.has(e))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(e) : t.set(e, r);
}, u = (e, t, r) => (et(e, t, "access private method"), r), E, L, C, M, T, $, A, F, w, V, x, B, v, z;
const rt = ["string", "number", "boolean"], H = {
  pos: 0,
  current: 0
}, f = class N {
  constructor(t, r, n, i) {
    this.type = t, this.properties = r, this.widgedHelper = n, this.originalChilds = i, h(this, E), h(this, C), h(this, T), h(this, A), h(this, w), h(this, x), h(this, v), this.isReInvoke = !1, this.node = void 0, this.parentNode = void 0, this.childs = void 0, this._id = H.pos, this._ns = !1, this._fnparent = void 0, this._listenerOnCreate = () => {
    }, typeof this.type == "string" && this.type === "svg" && (this._ns = !0), r && r.onCreate && (this._listenerOnCreate = r.onCreate, delete this.properties.onCreate);
    for (let s of i)
      this._ns && s instanceof N && (s._ns = !0), typeof this.type == "function" && s instanceof N && (s._fnparent = this);
    H.pos++;
  }
  createNodeAndChilds() {
    typeof this.type == "string" && (this.node = this.widgedHelper.createWidget(this.type, this._ns), this.childs = g(this.originalChilds));
  }
  render() {
    if (this.node && (this.widgedHelper.setProperties(
      this.node,
      y.call(this)
    ), this.isReInvoke && this.widgedHelper.resetWidgets && this.widgedHelper.resetWidgets(l(this))), typeof this.type == "function" && !this.childs) {
      const t = y.call(this, !0), r = this.type.name === "Fragment" ? this.type(t) : this.type.call(this, t);
      this.childs = g(r);
    }
    return u(this, w, V).call(this), this._listenerOnCreate(this.node), this;
  }
  /**
   * el nodo es un objeto que representa la vista
   * si no hay significa que es una funcion
   * buscara el objecto de que representa la vista
   */
  getNodeWidget() {
    return typeof this.node == "object" ? this : j(this);
  }
  implementStates(...t) {
    Z(t, (r) => {
      u(this, v, z).call(this, r.currentStoreState);
    });
  }
};
E = /* @__PURE__ */ new WeakSet();
L = function(e) {
  if (e instanceof d && !u(this, C, M).call(this, e))
    throw new Error(
      "the execution of a state without an executing function is only allowed if they are strings, numbers or boolean values"
    );
};
C = /* @__PURE__ */ new WeakSet();
M = function(e) {
  return Array.isArray(e.data) ? e.data.some((t) => typeof t == "object") === !1 : rt.includes(typeof e.data);
};
T = /* @__PURE__ */ new WeakSet();
$ = function(e) {
  var t, r;
  const n = typeof this.type == "function" ? j(this) : this, i = n.childs;
  for (let s = 0, a; a = i[s]; s++) {
    if (this !== a || !(a instanceof d && a.data === e.data))
      continue;
    u(this, E, L).call(this, a);
    const c = {
      isStringable: !1,
      node: n.node,
      typeAction: e.TYPE_ACTION,
      updateIndex: s
    };
    a instanceof d && Object.assign(c, {
      isStringable: !0,
      state: e.data,
      totalChilds: i.length
    }), a instanceof f && typeof a.type == "function" && (a.type.call(
      this,
      y.call(this, !0)
    ), e.parentNode && (c.state = (r = (t = e.rendering) == null ? void 0 : t.map((p) => l(p.render())).flat()) != null ? r : l(e.data)), c.totalChilds = e.previousData.length), this.widgedHelper.updateWidget(c);
  }
};
A = /* @__PURE__ */ new WeakSet();
F = function(e) {
  e.isReInvoke = !0;
  const t = e.type.call(e, y.call(e, !0)), r = l(e);
  let n;
  if (t instanceof f)
    t.isReInvoke = !0, t.render(), n = l(t), t.parentNode = e;
  else if (Array.isArray(t))
    n = t.map(
      (i) => l(i.render()).at(0)
    );
  else
    throw new Error("could not resolve nodes");
  this.widgedHelper.replaceChild(
    this.getNodeWidget().node,
    n,
    r
  ), e.childs = g(t);
};
w = /* @__PURE__ */ new WeakSet();
V = function() {
  const e = this.getNodeWidget();
  for (let t of this.childs)
    (t instanceof f || t instanceof d) && (t.parentNode = this), t instanceof f ? (typeof this.type == "function" ? t._fnparent = this.type.name !== "Fragment" ? this : this._fnparent : typeof this.type == "string" && this._fnparent && (t._fnparent = this._fnparent), typeof t.type == "string" && this._ns && (t._ns = !0, t.createNodeAndChilds()), this.isReInvoke && (t.createNodeAndChilds(), t.isReInvoke = !0), e && typeof t.node == "object" && this.widgedHelper.appendWidget(e.node, t.node), t.render()) : t instanceof d ? (this.implementStates(t), e && u(this, x, B).call(this, this, e.node, t)) : e && this.widgedHelper.appendWidget(
      e.node,
      this.widgedHelper.createText(t)
    );
};
x = /* @__PURE__ */ new WeakSet();
B = function(e, t, r) {
  var n;
  const i = r.currentStoreState;
  Array.isArray(i.data) || Array.isArray(i.rendering) ? ((n = i.rendering) != null ? n : i.data).forEach(
    (s) => {
      this.widgedHelper.appendWidget(
        t,
        s instanceof f ? s.render().node : s
      );
    }
  ) : this.widgedHelper.appendWidget(t, r);
};
v = /* @__PURE__ */ new WeakSet();
z = function(e) {
  return e.superCtx ? u(this, A, F).call(this, e.superCtx) : u(this, T, $).call(this, e);
};
let G = f, P;
function ht(e) {
  P = e;
}
class ut {
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
  static createElement(t, r, ...n) {
    const i = Object.seal(
      new G(t, r || {}, P, n)
    );
    return i.createNodeAndChilds(), i;
  }
}
function lt(e, t) {
  return t.node = P.querySelector(e), t.render(), t;
}
export {
  it as Execute,
  o as HookStore,
  ut as Reactive,
  J as ReactiveText,
  at as Route,
  st as Routes,
  d as State,
  m as StateAction,
  b as StoreState,
  nt as WidgetHelper,
  ht as addWidgetHelper,
  D as createTicket,
  Y as exec,
  q as flattenState,
  dt as implementStates,
  k as nextTicket,
  lt as render,
  K as useCallback,
  ot as useParams,
  ct as usePath,
  I as useState
};
