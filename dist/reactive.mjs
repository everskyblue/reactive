export * from "./src/jsx-runtime/index.ts";
var h = /* @__PURE__ */ ((e) => (e[e.CREATE = 0] = "CREATE", e[e.NEW = 1] = "NEW", e[e.UPDATE = 2] = "UPDATE", e[e.PREPEND = 3] = "PREPEND", e))(h || {});
class l {
  constructor(t, r = 0) {
    this.TYPE_ACTION = r, this.store = [], this.data = t;
  }
  set data(t) {
    const r = this.data;
    this.TYPE_ACTION === 1 || this.TYPE_ACTION === 0 ? this._current = t : this.TYPE_ACTION === 2 ? this._current = t : this.TYPE_ACTION === 3 && (this.rendering = t), this.TYPE_ACTION !== 3 && (this.TYPE_ACTION === 2 ? this.store.push([...r, ...this._current]) : this.store.push(this._current));
  }
  get data() {
    return this._current;
  }
  get previousData() {
    return this.store.at(this.store.indexOf(this.data) - 1);
  }
  toString() {
    var t, r;
    return (r = (t = this.data) == null ? void 0 : t.toString()) != null ? r : "";
  }
}
class c {
  constructor(t) {
    this.store = /* @__PURE__ */ new Map(), this.currentStoreState = new l(t);
  }
  get parentNode() {
    return this.currentParentNode;
  }
  set parentNode(t) {
    this.currentParentNode = t, typeof this.currentStoreState.parentNode != "undefined" && this.currentStoreState.parentNode !== t && (this.currentStoreState = new l(
      this.currentStoreState.data
    )), this.currentStoreState.parentNode = t, this.store.set(t, this.currentStoreState);
  }
  get data() {
    return this.currentStoreState.data;
  }
  set data(t) {
    this.currentStoreState.data = t;
  }
  addProxySelf(t) {
    this.proxySelf = t;
  }
  set(t) {
    this.currentStoreState.TYPE_ACTION = 1, this.currentStoreState.data = t, this.invokeNode();
  }
  append(t) {
    this.currentStoreState.TYPE_ACTION = 2, this.currentStoreState.data = t, this.invokeNode();
  }
  invokeNode() {
    this.store.forEach((t, r) => {
      r.render(!0, t);
    });
  }
  $setReturnData(t) {
    this.currentStoreState.TYPE_ACTION = 3, this.currentStoreState.data = t;
  }
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
class S extends Text {
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
const b = {
  setText: function(e, t) {
    e.textContent = t;
  },
  createText: function(e) {
    return new S(e);
  },
  createWidget: function(e) {
    return document.createElement(e);
  },
  appendWidget: function(e, t) {
    e.append(
      ...Array.isArray(t) ? t : [t]
    );
  },
  setProperties: function(e, t) {
    for (const r in t) {
      const n = t[r];
      r.startsWith("on") ? e.addEventListener(r.slice(2).toLowerCase(), n) : e.setAttribute(r, String(n));
    }
  },
  querySelector(e) {
    return document.querySelector(e);
  },
  updateWidget: function(e) {
    var t;
    const r = e.node.childNodes, n = r.item(e.updateIndex), i = n == null ? void 0 : n.previousSibling;
    if (e.isStringable)
      return n.data = e.state;
    const s = Array.from(r).slice(e.updateIndex).slice(0, e.totalChilds), a = (t = s.at(-1)) == null ? void 0 : t.nextSibling;
    if (e.typeAction === h.NEW) {
      for (let o = 0; o < s.length; o++)
        s[o].remove();
      if (r.length === 0 || !n && !i && !a)
        return e.node.append(...e.state);
      if (n.parentNode)
        return n.before(...e.state);
      if (a && !n.parentNode)
        return a.before(...e.state);
      i.after(...e.state);
    } else
      e.typeAction === h.UPDATE && e.node.append(...e.state);
  }
};
function y(e, t) {
  return typeof e[t] == "function" ? e[t].bind(e) : e[t];
}
function v(e) {
  const t = new Proxy(new c(e), {
    get(r, n) {
      if (n in r)
        return y(r, n);
      if (n in r.data)
        return !Array.isArray(r.data) && r.data instanceof Object && !r.parentNode ? r.data[n] : typeof r.data[n] == "function" ? (...i) => (r.$setReturnData(
          r.data[n].apply(r.data, i)
        ), t) : t;
      throw new Error("error proxy " + n);
    },
    set(r, n, i) {
      if (n in r)
        r[n] = i;
      else if (n in r.data)
        r.data[n] = i;
      else
        return !1;
      return !0;
    }
  });
  return t.addProxySelf(t), t;
}
function E({ state: e, callback: t, option: r }, n) {
  return t.call(this, { state: e, option: r }, n);
}
let u;
function N(e) {
  return Array.isArray(e) ? e : [e];
}
function _(e) {
  u = e;
}
class m {
  static Fragment(t) {
    return t;
  }
  static createElement(t, r, ...n) {
    const i = {
      type: t,
      properties: r,
      getParentNode: A,
      render: g
    };
    if (s(n), typeof t == "string")
      i.node = u.createWidget(t), i.childs = n, u.setProperties(i.node, r);
    else if (typeof t == "function") {
      const a = t.name === "Fragment" ? t(n) : t.call(i, r, n);
      i.childs = a, s(Array.isArray(i.childs) ? i.childs : [i.childs]);
    }
    function s(a) {
      a.forEach((o) => {
        typeof o == "object" && (o.parentNode || (o.parentNode = i));
      });
    }
    return i;
  }
}
function A() {
  return typeof this.node == "object" ? this : f(this);
}
function C(e, t) {
  return t.node = u.querySelector(e), t.render(), console.log(t), t;
}
function T(e, t, r) {
  var n;
  const i = r.store.get(e);
  Array.isArray(i.data) || Array.isArray(i.rendering) ? ((n = i.rendering) != null ? n : i.data).forEach(
    (s) => {
      var a;
      u.appendWidget(t, (a = s == null ? void 0 : s.render()) != null ? a : s);
    }
  ) : u.appendWidget(t, r);
}
function g(e, t) {
  var r;
  if (e) {
    const n = typeof this.type == "function" ? f(this) : this, i = N(n.childs), s = [];
    i.forEach((a, o) => {
      (this === a || a instanceof c && a.data === t.data) && s.push(o);
    }), s.forEach((a) => {
      const o = i.at(a);
      P(o);
      const d = {
        isStringable: !1,
        node: n.node,
        typeAction: t.TYPE_ACTION,
        updateIndex: a
      };
      o instanceof c ? (d.isStringable = !0, d.state = t.data, d.totalChilds = i.length) : typeof o.type == "function" && (o.type(o.properties), d.state = t.rendering.map(
        (p) => p.render()
      ), d.totalChilds = t.previousData.length, setTimeout(() => {
        t.rendering = void 0;
      }, 0)), u.updateWidget(d);
    });
    return;
  }
  return (Array.isArray(this.childs) ? this.childs : [this.childs]).forEach(
    (n) => {
      var i;
      const s = n instanceof c;
      if (typeof n == "object" && !s) {
        const { node: a } = f(n);
        typeof n.node == "object" && u.appendWidget(a, n.node), n.render();
      } else {
        const a = (i = this.node) != null ? i : f(this).node;
        s ? T(this, a, n) : u.appendWidget(a, n);
      }
    }
  ), (r = this.node) != null ? r : this;
}
function f(e) {
  let t = e.parentNode;
  if (typeof t == "undefined")
    return e;
  for (; typeof t.node != "object"; )
    t = t.parentNode;
  return t;
}
function P(e) {
  if (e instanceof c) {
    if (!x(e))
      throw new Error(
        "the execution of a state without an executing function is only allowed if they are strings, numbers or boolean values"
      );
  } else if (typeof e.type == "function" && e.type.name !== E.name)
    throw new Error("is not a [function Execute] ");
}
function x(e) {
  return Array.isArray(e.data) ? e.data.some((t) => typeof t == "object") === !1 : ["string", "number", "boolean"].includes(typeof e.data);
}
export {
  E as Execute,
  m as Reactive,
  S as ReactiveText,
  c as State,
  h as StateAction,
  l as StoreState,
  _ as addWidget,
  b as createWidget,
  C as render,
  v as useState
};
