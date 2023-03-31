(function(s,c){typeof exports=="object"&&typeof module!="undefined"?c(exports,require("./src/jsx-runtime/index.ts")):typeof define=="function"&&define.amd?define(["exports","./src/jsx-runtime/index.ts"],c):(s=typeof globalThis!="undefined"?globalThis:s||self,c(s.reactive={},s.index_ts))})(this,function(s,c){"use strict";var l=(e=>(e[e.CREATE=0]="CREATE",e[e.NEW=1]="NEW",e[e.UPDATE=2]="UPDATE",e[e.PREPEND=3]="PREPEND",e))(l||{});class S{constructor(t,r=0){this.TYPE_ACTION=r,this.store=[],this.data=t}set data(t){const r=this.data;this.TYPE_ACTION===1||this.TYPE_ACTION===0?this._current=t:this.TYPE_ACTION===2?this._current=t:this.TYPE_ACTION===3&&(this.rendering=t),this.TYPE_ACTION!==3&&(this.TYPE_ACTION===2?this.store.push([...r,...this._current]):this.store.push(this._current))}get data(){return this._current}get previousData(){return this.store.at(this.store.indexOf(this.data)-1)}toString(){var t,r;return(r=(t=this.data)==null?void 0:t.toString())!=null?r:""}}class f{constructor(t){this.store=new Map,this.currentStoreState=new S(t)}get parentNode(){return this.currentParentNode}set parentNode(t){this.currentParentNode=t,typeof this.currentStoreState.parentNode!="undefined"&&this.currentStoreState.parentNode!==t&&(this.currentStoreState=new S(this.currentStoreState.data)),this.currentStoreState.parentNode=t,this.store.set(t,this.currentStoreState)}get data(){return this.currentStoreState.data}set data(t){this.currentStoreState.data=t}addProxySelf(t){this.proxySelf=t}set(t){this.currentStoreState.TYPE_ACTION=1,this.currentStoreState.data=t,this.invokeNode()}append(t){this.currentStoreState.TYPE_ACTION=2,this.currentStoreState.data=t,this.invokeNode()}invokeNode(){this.store.forEach((t,r)=>{r.render(!0,t)})}$setReturnData(t){this.currentStoreState.TYPE_ACTION=3,this.currentStoreState.data=t}is(t){return this.currentStoreState.data===t}toString(){return this.currentStoreState.toString()}[Symbol.toPrimitive](){return this.toString()}*[Symbol.iterator](){for(const t of this.currentStoreState.data)yield t}}class y extends Text{constructor(t){super(t)}get text(){return this.data}set text(t){this.data=t}}const N={setText:function(e,t){e.textContent=t},createText:function(e){return new y(e)},createWidget:function(e){return document.createElement(e)},appendWidget:function(e,t){e.append(...Array.isArray(t)?t:[t])},setProperties:function(e,t){for(const r in t){const n=t[r];r.startsWith("on")?e.addEventListener(r.slice(2).toLowerCase(),n):e.setAttribute(r,String(n))}},querySelector(e){return document.querySelector(e)},updateWidget:function(e){var t;const r=e.node.childNodes,n=r.item(e.updateIndex),i=n==null?void 0:n.previousSibling;if(e.isStringable)return n.data=e.state;const o=Array.from(r).slice(e.updateIndex).slice(0,e.totalChilds),a=(t=o.at(-1))==null?void 0:t.nextSibling;if(e.typeAction===l.NEW){for(let u=0;u<o.length;u++)o[u].remove();if(r.length===0||!n&&!i&&!a)return e.node.append(...e.state);if(n.parentNode)return n.before(...e.state);if(a&&!n.parentNode)return a.before(...e.state);i.after(...e.state)}else e.typeAction===l.UPDATE&&e.node.append(...e.state)}};function T(e,t){return typeof e[t]=="function"?e[t].bind(e):e[t]}function g(e){const t=new Proxy(new f(e),{get(r,n){if(n in r)return T(r,n);if(n in r.data)return!Array.isArray(r.data)&&r.data instanceof Object&&!r.parentNode?r.data[n]:typeof r.data[n]=="function"?(...i)=>(r.$setReturnData(r.data[n].apply(r.data,i)),t):t;throw new Error("error proxy "+n)},set(r,n,i){if(n in r)r[n]=i;else if(n in r.data)r.data[n]=i;else return!1;return!0}});return t.addProxySelf(t),t}function E({state:e,callback:t,option:r},n){return t.call(this,{state:e,option:r},n)}let d;function A(e){return Array.isArray(e)?e:[e]}function P(e){d=e}class b{static Fragment(t){return t}static createElement(t,r,...n){const i={type:t,properties:r,getParentNode:v,render:x};if(o(n),typeof t=="string")i.node=d.createWidget(t),i.childs=n,d.setProperties(i.node,r);else if(typeof t=="function"){const a=t.name==="Fragment"?t(n):t.call(i,r,n);i.childs=a,o(Array.isArray(i.childs)?i.childs:[i.childs])}function o(a){a.forEach(u=>{typeof u=="object"&&(u.parentNode||(u.parentNode=i))})}return i}}function v(){return typeof this.node=="object"?this:p(this)}function m(e,t){return t.node=d.querySelector(e),t.render(),console.log(t),t}function _(e,t,r){var n;const i=r.store.get(e);Array.isArray(i.data)||Array.isArray(i.rendering)?((n=i.rendering)!=null?n:i.data).forEach(o=>{var a;d.appendWidget(t,(a=o==null?void 0:o.render())!=null?a:o)}):d.appendWidget(t,r)}function x(e,t){var r;if(e){const n=typeof this.type=="function"?p(this):this,i=A(n.childs),o=[];i.forEach((a,u)=>{(this===a||a instanceof f&&a.data===t.data)&&o.push(u)}),o.forEach(a=>{const u=i.at(a);w(u);const h={isStringable:!1,node:n.node,typeAction:t.TYPE_ACTION,updateIndex:a};u instanceof f?(h.isStringable=!0,h.state=t.data,h.totalChilds=i.length):typeof u.type=="function"&&(u.type(u.properties),h.state=t.rendering.map(O=>O.render()),h.totalChilds=t.previousData.length,setTimeout(()=>{t.rendering=void 0},0)),d.updateWidget(h)});return}return(Array.isArray(this.childs)?this.childs:[this.childs]).forEach(n=>{var i;const o=n instanceof f;if(typeof n=="object"&&!o){const{node:a}=p(n);typeof n.node=="object"&&d.appendWidget(a,n.node),n.render()}else{const a=(i=this.node)!=null?i:p(this).node;o?_(this,a,n):d.appendWidget(a,n)}}),(r=this.node)!=null?r:this}function p(e){let t=e.parentNode;if(typeof t=="undefined")return e;for(;typeof t.node!="object";)t=t.parentNode;return t}function w(e){if(e instanceof f){if(!C(e))throw new Error("the execution of a state without an executing function is only allowed if they are strings, numbers or boolean values")}else if(typeof e.type=="function"&&e.type.name!==E.name)throw new Error("is not a [function Execute] ")}function C(e){return Array.isArray(e.data)?e.data.some(t=>typeof t=="object")===!1:["string","number","boolean"].includes(typeof e.data)}s.Execute=E,s.Reactive=b,s.ReactiveText=y,s.State=f,s.StateAction=l,s.StoreState=S,s.addWidget=P,s.createWidget=N,s.render=m,s.useState=g,Object.keys(c).forEach(e=>{e!=="default"&&!s.hasOwnProperty(e)&&Object.defineProperty(s,e,{enumerable:!0,get:()=>c[e]})}),Object.defineProperty(s,Symbol.toStringTag,{value:"Module"})});