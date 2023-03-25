(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.reactive = {}));
})(this, function(exports2) {
  "use strict";
  class State {
    constructor(data) {
      this.data = data;
      this.oldData = void 0;
      this.nwdata = void 0;
      this.currentParentNode = void 0;
      this._listParentNode = /* @__PURE__ */ new Set();
      this._mapParentNode = /* @__PURE__ */ new Map();
      this.listeners = /* @__PURE__ */ new Map();
    }
    get mapParentNode() {
      return this._mapParentNode;
    }
    get parentNode() {
      return this.currentParentNode;
    }
    set parentNode(v) {
      this.currentParentNode = v;
      this.mapParentNode.set(v, Object.assign({}, this));
    }
    addListener(contextParent, fun) {
      this.listeners.set(contextParent, fun);
    }
    addProxySelf(proxy) {
      this.proxySelf = proxy;
    }
    set(newValue) {
      this.oldData = this.data;
      this.data = newValue;
      this.mapParentNode.forEach(
        (state, parent) => parent.render(true, state, this.oldData)
      );
    }
    $setReturnData(value) {
      this.nwdata = value;
    }
    toString() {
      var _a, _b;
      return (_b = (_a = this.getAndResetData()) == null ? void 0 : _a.toString()) != null ? _b : "";
    }
    getAndResetData() {
      var _a;
      const data = (_a = this.nwdata) != null ? _a : this.data;
      this.nwdata = void 0;
      return data;
    }
    [Symbol.toPrimitive]() {
      return this.toString();
    }
    *[Symbol.iterator]() {
      for (const iterator of this.data) {
        yield iterator;
      }
    }
  }
  function Execute({ state, callback }, childs) {
    return callback(state, childs);
  }
  let widgetCreate;
  function toArray(data) {
    return Array.isArray(data) ? data : [data];
  }
  function addWidget(widget) {
    widgetCreate = widget;
  }
  class Reactive {
    static Fragment(elements) {
      return elements;
    }
    static createElement(type, properties, ...childs) {
      const def = {
        type,
        properties,
        onUpdateState,
        render: renderView
      };
      if (typeof type === "string") {
        def.node = widgetCreate.createWidget(type);
        def.childs = childs;
        widgetCreate.setProperties(def.node, properties);
        def.childs.forEach((child) => {
          if (typeof child === "object") {
            setParent(child);
          }
        });
      } else if (typeof type === "function") {
        const child = type.name === "Fragment" ? type(childs) : type.call(def, properties, childs);
        if (Array.isArray(child))
          child.forEach(setParent);
        else
          setParent(child);
        def.childs = child;
      }
      function setParent(child) {
        child.parentNode = def;
      }
      return def;
    }
  }
  function onUpdateState(state) {
    return () => {
    };
  }
  function render(root, component) {
    console.log(component);
    component.node = widgetCreate.querySelector(root);
    component.render();
    return component;
  }
  function renderDataState(ctx, parent, state) {
    var _a;
    const cloneState = state.mapParentNode.get(ctx);
    if (Array.isArray(cloneState.nwdata) || Array.isArray(cloneState.data)) {
      ((_a = cloneState.nwdata) != null ? _a : cloneState.data).forEach(
        (def) => {
          var _a2;
          widgetCreate.appendWidget(parent, (_a2 = def == null ? void 0 : def.render()) != null ? _a2 : def);
        }
      );
    } else {
      widgetCreate.appendWidget(parent, state);
    }
  }
  function renderView(isUpdate, state, oldDataState) {
    var _a;
    if (isUpdate) {
      if (!state.parentNode) {
        state.parentNode = state.currentParentNode;
      }
      const p = typeof this.type === "function" ? getParent(this) : this;
      const childs = toArray(p.childs);
      const findAllIndex = [];
      childs.forEach((child, index) => {
        if (this === child || child instanceof State && child.oldData === oldDataState) {
          findAllIndex.push(index);
        }
      });
      findAllIndex.forEach((findIndex) => {
        var _a2;
        const def = childs.at(findIndex);
        throwerIfNotExecute(def);
        if (def instanceof State) {
          widgetCreate.updateWidget(
            true,
            p.node,
            state,
            findIndex,
            childs.length
          );
        } else if (typeof def.type == "function") {
          const mapState = def.type(def.properties);
          const mapDataState = (_a2 = mapState.nwdata) != null ? _a2 : mapState.data;
          widgetCreate.updateWidget(
            false,
            p.node,
            mapDataState.map((def2) => def2.render()),
            findIndex,
            oldDataState.length
          );
        }
      });
      return;
    }
    (Array.isArray(this.childs) ? this.childs : [this.childs]).forEach(
      (child) => {
        var _a2;
        const isState = child instanceof State;
        if (isState) {
          child.addListener(this, this.onUpdateState(state));
        }
        if (typeof child === "object" && !isState) {
          const { node } = getParent(child);
          if (typeof child.node === "object") {
            widgetCreate.appendWidget(node, child.node);
          }
          child.render();
        } else {
          const parent = (_a2 = this.node) != null ? _a2 : getParent(this).node;
          if (isState) {
            renderDataState(this, parent, child);
          } else {
            widgetCreate.appendWidget(parent, child);
          }
        }
      }
    );
    return (_a = this.node) != null ? _a : this;
  }
  function getParent(ctx) {
    let parent = ctx.parentNode;
    if (typeof parent === "undefined") {
      return ctx;
    }
    while (typeof parent.node !== "object") {
      parent = parent.parentNode;
    }
    return parent;
  }
  function throwerIfNotExecute(def) {
    if (def instanceof State) {
      if (!isStringableState(def)) {
        throw new Error(
          "the execution of a state without an executing function is only allowed if they are strings, numbers or boolean values"
        );
      }
    } else if (typeof def.type === "function" && def.type.name !== Execute.name) {
      throw new Error("is not a [function Execute] ");
    }
  }
  function isStringableState(def) {
    def.data;
    if (Array.isArray(def.data)) {
      return def.data.some((data2) => typeof data2 === "object") === false;
    }
    return ["string", "number", "boolean"].includes(typeof def.data);
  }
  exports2.Reactive = Reactive;
  exports2.addWidget = addWidget;
  exports2.render = render;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
