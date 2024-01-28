var reactive=function(u){"use strict";const N=new Map,l={createStore(t){N.has(t)||(N.set(t,new Map),Object.defineProperty(l,t,{get(){return N.get(t)}}))}};l.createStore("tickets");function C(t){const e=t.queue.at(t.ticket);return t.ticket+=1,t.queue.length===t.ticket&&(t.ticket=0),e}function W(t){l.tickets.has(t.type)||l.tickets.set(t.type,{reInvoke:!1,ticket:0,queue:[]});const e=l.tickets.get(t.type);return t.isReInvoke&&(e.reInvoke=!0),e}l.createStore("states");function R(t){const e=W(t);return e.reInvoke?C(e):e}class I{constructor(e,n,r){this.type=e,this.target=n,this.data=r,this.timeStamp=Date.now()}}class A extends I{constructor(){super(...arguments),this.$queue=[]}addListener(e){return this.$queue.push(e),this}_invoke(){for(const e of this.$queue)e(new I(this.type,this.target,this.data))}}class z extends Set{_invokeAll(e){for(const n of Array.from(this))n._invoke()}_findIn(e,n){return Array.from(this).find(r=>r[e]===n)}}function G(t,e=()=>{},n){for(const r of t);}function J(t,e){G(e,n=>{U.call(t,n.currentStoreState)})}function p(t){return Array.isArray(t)?t:[t]}function H(t){return typeof t.type=="string"?p(t.node):t.childs.map(S).flat()}function S(t){return t.node?t.node:K(t).flat()}function K(t){const e=[];for(const n of t.childs){let r=n;n instanceof v&&(r=S(n)),e.push(r)}return e}function L(t){let e=t;for(;e&&typeof e.node!="object";)e=e.parentNode;return e}function P(t=!1){const e={};t&&(e.children=this.originalChilds);for(const n in this.properties)t&&n==="shareContext"?e.sharedContext=this.properties[n]:e[n==="className"?"class":n]=this.properties[n];return e}function Q(t,e,n){var r=null,o=null,i=function(){r&&(clearTimeout(r),o=null,r=null)},s=function(){var a=o;i(),a&&a()},c=function(){if(!e)return t.apply(this,arguments);var a=this,d=arguments,Y=n&&!r;if(i(),o=function(){t.apply(a,d)},r=setTimeout(function(){if(r=null,!Y){var pe=o;return o=null,pe()}},e),Y)return o()};return c.cancel=i,c.flush=s,c}function X(t){const e=new Map;return(n,r)=>{if(r&&r.superCtx&&!e.has(n))e.set(n,new z([new A("changeState",n,r).addListener(t)]));else if(r)e.has(n)&&r.superCtx&&e.get(n).add(new A("changeState",n,r).addListener(t));else return e.get(n)}}const y=X(t=>{t.target.$update(t.data)}),Z=(()=>{let t;const e=Q(()=>{const n=t;t=null,n&&n._invoke()},10);return(n,r)=>{t=n._findIn("data",r),e()}})();function ee(t,e,n){return typeof t[e]=="function"?t[e].bind(t):t[e]}function m(t,e=!1){const n=g.component,r=R(n);if(r instanceof f)return r;const o=new Proxy(new f(t,e),{get(i,s){if(s in i)return s==="set"&&n?c=>(i.set(c),Z(y(n),o)):ee(i,s);if(typeof i.value[s]!="undefined")return!Array.isArray(i.value)&&i.value instanceof Object?i.value[s]:typeof i.value[s]=="function"?(...c)=>{if(typeof i.value[s].apply(i.value,c)!="undefined")return new h(i.value[s].apply(i.value,c),o)}:o;throw new Error("error proxy "+s)},set(i,s,c){if(s in i)i[s]=c;else if(s in i.data)i.data[s]=c;else return!1;return!0}});return typeof r=="object"&&r.queue.push(o),y(n,o),o}function te(t){const e={},n=i=>s=>{e[i].set(s)},r=i=>{let s;return()=>(s||(s=m(t[i])),s)};for(let i in t){const s=typeof t[i]=="function"?{value:t[i].bind(e)}:{get:r(i),set:n(i)};Object.defineProperty(e,i,s)}let o;return()=>o!=null?o:o=m(e)}var q=(t=>(t[t.CREATE=0]="CREATE",t[t.NEW=1]="NEW",t[t.UPDATE=2]="UPDATE",t[t.DELETE=3]="DELETE",t))(q||{});class h{constructor(e,n){this.state=n,this._parentNode=null,this.node=null,this.node=e.map(r=>r.render())}set parentNode(e){this._parentNode=e,y(this.state,e)}get parentNode(){return this._parentNode}}class D{constructor(e,n,r=0){this.superCtx=n,this.TYPE_ACTION=r,this.store=[],this.data=e}set data(e){var n;Array.isArray(e)&&(this.TYPE_ACTION=e.length>((n=this.previousData)==null?void 0:n.length)?2:3),this.store.push(e)}get data(){return this.store.at(-1)}get previousData(){return this.store.at(-2)}toString(){var e,n;return(n=(e=this.data)==null?void 0:e.toString())!=null?n:""}}class f{constructor(e,n){this._store=new Map,this.currentStoreState=new D(e,n)}get parentNode(){return this.currentParentNode}get superCtx(){return this.currentStoreState.superCtx}get previousData(){return this.currentStoreState.previousData}set parentNode(e){}get value(){return this.currentStoreState.data}set value(e){this.currentStoreState.data=e}addProxySelf(e){return this.proxySelf=e,this}set(e){this.value=e}is(e){return this.value===e}toString(){return this.currentStoreState.toString()}[Symbol.toPrimitive](){return this.toString()}*[Symbol.iterator](){for(const e of this.value)yield e}}var ne=(t,e,n)=>{if(!e.has(t))throw TypeError("Cannot "+n)},w=(t,e,n)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,n)},re=(t,e,n)=>(ne(t,e,"access private method"),n),O,M,E,j,x,$;function U(t){this.isReInvoke=!0,g.component=this;const e=this.parentNode,n=typeof this.type=="function"?L(this):this,r=this.childs,o={findIndex:[],oldChilds:[]},i=t.superCtx?o:this.childs.reduce((c,a,d)=>((a instanceof f&&a.currentStoreState===t||a instanceof h&&a.state.currentStoreState===t)&&(c.findIndex.push(d),c.oldChilds.push(a instanceof f?a.toString():a.node)),c),o),s=typeof this.type=="function"?this.type.call(this,P.call(this,!0)):!1;s!==!1&&(s.parentNode=this,this.childs=p(s)),s instanceof v&&(s.isReInvoke=!0,s.render());for(let c=0;c<i.findIndex.length;c++){const a=i.findIndex[c],d=i.oldChilds[c];this.widgedHelper.updateWidget(new class{getNodeParent(){return n.node}getParent(){return e}get index(){return a}get newChilds(){return s instanceof h?s.node:s instanceof v?p(s):d}get oldChilds(){return d}})}i.findIndex.length===0&&this.widgedHelper.updateWidget(new class{getNodeParent(){return n.node}getParent(){return e}get index(){return-1}get newChilds(){return s instanceof h?s.node:s instanceof v?p(s):s}get oldChilds(){return r}})}const g={pos:0,current:0,component:null},T=class b{constructor(e,n,r,o){this.type=e,this.properties=n,this.widgedHelper=r,this.originalChilds=o,w(this,O),w(this,M),w(this,E),w(this,x),w(this,$),this.isReInvoke=!1,this.node=void 0,this.parentNode=void 0,this.childs=void 0,this._id=g.pos,this._ns=!1,this._fnparent=void 0,this._listenerOnCreate=()=>{},typeof this.type=="string"&&this.type==="svg"&&(this._ns=!0),n&&n.onCreate&&(this._listenerOnCreate=n.onCreate,delete this.properties.onCreate);for(let i of o)this._ns&&i instanceof b&&(i._ns=!0),typeof this.type=="function"&&i instanceof b&&(i._fnparent=this);g.pos++}createNodeAndChilds(){typeof this.type=="string"&&(this.node=this.widgedHelper.createWidget(this.type,this._ns),this.childs=p(this.originalChilds))}render(){if(g.component=this,this.node&&(this.widgedHelper.setProperties(this.node,P.call(this)),this.isReInvoke&&this.widgedHelper.resetWidgets&&this.widgedHelper.resetWidgets(H(this))),typeof this.type=="function"&&!this.childs){const e=P.call(this,!0),n=this.type.name==="Fragment"?this.type(e):this.type.call(this,e);this.childs=p(n)}return re(this,E,j).call(this),this._listenerOnCreate(this.node),this}getNodeWidget(){return typeof this.node=="object"?this:L(this)}$update(e){U.call(this,e.currentStoreState)}};O=new WeakSet,M=new WeakSet,E=new WeakSet,j=function(){this.getNodeWidget();for(let t of this.childs)(t instanceof T||t instanceof f||t instanceof h)&&(t.parentNode=this),t instanceof T?(typeof this.type=="function"?t._fnparent=this.type.name!=="Fragment"?this:this._fnparent:typeof this.type=="string"&&this._fnparent&&(t._fnparent=this._fnparent),typeof t.type=="string"&&this._ns&&(t._ns=!0,t.createNodeAndChilds()),this.isReInvoke&&(t.createNodeAndChilds(),t.isReInvoke=!0),t.render(),this.widgedHelper.appendWidget(this,t)):t instanceof h?this.widgedHelper.appendWidget(this,t):this.widgedHelper.appendWidget(this,t instanceof f?(y(t,this),t.toString()):t)},x=new WeakSet,$=new WeakSet;let v=T;function F(t){const e=W(g.component);return e.reInvoke?C(e):(e.queue.push(t),t)}l.createStore("memo");function B(t){const e=F(t);return l.memo.has(e)||l.memo.set(e,!1),(...n)=>(l.memo.get(e)===!1&&l.memo.set(e,e(...n)),l.memo.get(e))}let _;const V=t=>t.find(e=>ie(e.properties));function ie({path:t}){const e=location.hash.length&&location.hash.startsWith("#")?location.hash.slice(1):"/",r=new globalThis.URLPattern(t,location.origin).exec(e,location.origin);return _=r?{path:r.input,params:r.groups}:null,_!==null}function se({children:t,notFount:e}){var n;const r=m(!1),o=m(r.value?null:(n=V(t))!=null?n:e,!0);return B(()=>{window.addEventListener("hashchange",()=>{var i;r.value===!1&&r.set(!0),o.set((i=V(t))!=null?i:e)})})(),o.value.parentNode||(o.value.parentNode=this),o.value}function oe(t){return t.render.parentNode=this,t.render}function ae(){return _.params}function ue(){return _.path}let k;function ce(t){k=t}class le{static Fragment({children:e}){return e}static createElement(e,n,...r){const o=Object.seal(new v(e,n||{},k,r));return o.createNodeAndChilds(),o}}function de(t,e){return e.node=k.querySelector(t),e.render(),e}const he=typeof window!="undefined";class fe{constructor(){this.resetWidgets=e=>{for(const n of e)n.innerHTML=""}}createWidget(e,n){return n?document.createElementNS("http://www.w3.org/2000/svg",e):document.createElement(e)}appendWidget(e,n){if(he){if(typeof n.type=="function")return;const r=e.getNodeWidget(),o=n instanceof v?H(n):n instanceof h?n.node.map(S):n;Array.isArray(o)?r.node.append(...o):r.node.append(o)}}setProperties(e,n){for(const r in n){const o=n[r];r.startsWith("on")?e.addEventListener(r.slice(2).toLowerCase(),o):e.setAttribute(r==="className"?"class":r,String(o))}}querySelector(e){return document.querySelector(e)}updateWidget(e){var n;const r=e.getNodeParent();let{index:o,oldChilds:i,newChilds:s}=e;if(typeof s=="string")r.childNodes.item(o).data=s;else{s=s.map(a=>S(a)).flat(),i=i.map(a=>S(a)).flat();const c=s.length>i.length;for(let a=0;a<s.length;a++){const d=s[a];i[a]?i[a].replaceWith(d):r.insertBefore(d,(n=s[a-1])==null?void 0:n.nextSibling)}!c&&s.length!==i.length&&i.slice(s.length).forEach(a=>{a.remove()})}}}return u.HookStore=l,u.NativeRender=fe,u.Reactive=le,u.Route=oe,u.Routes=se,u.State=f,u.StateAction=q,u.StateRender=h,u.StoreState=D,u.addWidgetHelper=ce,u.createState=te,u.createTicket=W,u.exec=B,u.flattenState=R,u.implementStates=J,u.listener=y,u.nextTicket=C,u.render=de,u.useCallback=F,u.useParams=ae,u.usePath=ue,u.useState=m,Object.defineProperty(u,Symbol.toStringTag,{value:"Module"}),u}({});
