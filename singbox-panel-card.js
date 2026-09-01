var U=globalThis,B=U.ShadowRoot&&(U.ShadyCSS===void 0||U.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,L=Symbol(),it=new WeakMap,E=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==L)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(B&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=it.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&it.set(e,t))}return t}toString(){return this.cssText}},st=o=>new E(typeof o=="string"?o:o+"",void 0,L),k=(o,...t)=>{let e=o.length===1?o[0]:t.reduce((i,s,n)=>i+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+o[n+1],o[0]);return new E(e,o,L)},nt=(o,t)=>{if(B)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),s=U.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,o.appendChild(i)}},I=B?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return st(e)})(o):o;var{is:xt,defineProperty:At,getOwnPropertyDescriptor:wt,getOwnPropertyNames:St,getOwnPropertySymbols:Et,getPrototypeOf:kt}=Object,H=globalThis,ot=H.trustedTypes,Ct=ot?ot.emptyScript:"",Nt=H.reactiveElementPolyfillSupport,C=(o,t)=>o,D={toAttribute(o,t){switch(t){case Boolean:o=o?Ct:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},at=(o,t)=>!xt(o,t),rt={attribute:!0,type:String,converter:D,reflect:!1,useDefault:!1,hasChanged:at};Symbol.metadata??=Symbol("metadata"),H.litPropertyMetadata??=new WeakMap;var v=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=rt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&At(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){let{get:s,set:n}=wt(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:s,set(r){let c=s?.call(this);n?.call(this,r),this.requestUpdate(t,c,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??rt}static _$Ei(){if(this.hasOwnProperty(C("elementProperties")))return;let t=kt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(C("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(C("properties"))){let e=this.properties,i=[...St(e),...Et(e)];for(let s of i)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let s of i)e.unshift(I(s))}else t!==void 0&&e.push(I(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return nt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){let n=(i.converter?.toAttribute!==void 0?i.converter:D).toAttribute(e,i.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){let i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let n=i.getPropertyOptions(s),r=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:D;this._$Em=s;let c=r.fromAttribute(e,n.type);this[s]=c??this._$Ej?.get(s)??c,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(t!==void 0){let r=this.constructor;if(s===!1&&(n=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??at)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),n!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,n]of i){let{wrapped:r}=n,c=this[s];r!==!0||this._$AL.has(s)||c===void 0||this.C(s,void 0,n,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[C("elementProperties")]=new Map,v[C("finalized")]=new Map,Nt?.({ReactiveElement:v}),(H.reactiveElementVersions??=[]).push("2.1.2");var J=globalThis,lt=o=>o,R=J.trustedTypes,ct=R?R.createPolicy("lit-html",{createHTML:o=>o}):void 0,gt="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,ft="?"+b,Tt=`<${ft}>`,x=document,T=()=>x.createComment(""),P=o=>o===null||typeof o!="object"&&typeof o!="function",X=Array.isArray,Pt=o=>X(o)||typeof o?.[Symbol.iterator]=="function",j=`[ 	
\f\r]`,N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,dt=/-->/g,ht=/>/g,$=RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),pt=/'/g,ut=/"/g,mt=/^(?:script|style|textarea|title)$/i,Y=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),u=Y(1),It=Y(2),Dt=Y(3),A=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),_t=new WeakMap,y=x.createTreeWalker(x,129);function vt(o,t){if(!X(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return ct!==void 0?ct.createHTML(t):t}var Mt=(o,t)=>{let e=o.length-1,i=[],s,n=t===2?"<svg>":t===3?"<math>":"",r=N;for(let c=0;c<e;c++){let l=o[c],a,p,d=-1,h=0;for(;h<l.length&&(r.lastIndex=h,p=r.exec(l),p!==null);)h=r.lastIndex,r===N?p[1]==="!--"?r=dt:p[1]!==void 0?r=ht:p[2]!==void 0?(mt.test(p[2])&&(s=RegExp("</"+p[2],"g")),r=$):p[3]!==void 0&&(r=$):r===$?p[0]===">"?(r=s??N,d=-1):p[1]===void 0?d=-2:(d=r.lastIndex-p[2].length,a=p[1],r=p[3]===void 0?$:p[3]==='"'?ut:pt):r===ut||r===pt?r=$:r===dt||r===ht?r=N:(r=$,s=void 0);let g=r===$&&o[c+1].startsWith("/>")?" ":"";n+=r===N?l+Tt:d>=0?(i.push(a),l.slice(0,d)+gt+l.slice(d)+b+g):l+b+(d===-2?c:g)}return[vt(o,n+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},M=class o{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0,c=t.length-1,l=this.parts,[a,p]=Mt(t,e);if(this.el=o.createElement(a,i),y.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=y.nextNode())!==null&&l.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(let d of s.getAttributeNames())if(d.endsWith(gt)){let h=p[r++],g=s.getAttribute(d).split(b),f=/([.?@])?(.*)/.exec(h);l.push({type:1,index:n,name:f[2],strings:g,ctor:f[1]==="."?V:f[1]==="?"?W:f[1]==="@"?F:S}),s.removeAttribute(d)}else d.startsWith(b)&&(l.push({type:6,index:n}),s.removeAttribute(d));if(mt.test(s.tagName)){let d=s.textContent.split(b),h=d.length-1;if(h>0){s.textContent=R?R.emptyScript:"";for(let g=0;g<h;g++)s.append(d[g],T()),y.nextNode(),l.push({type:2,index:++n});s.append(d[h],T())}}}else if(s.nodeType===8)if(s.data===ft)l.push({type:2,index:n});else{let d=-1;for(;(d=s.data.indexOf(b,d+1))!==-1;)l.push({type:7,index:n}),d+=b.length-1}n++}}static createElement(t,e){let i=x.createElement("template");return i.innerHTML=t,i}};function w(o,t,e=o,i){if(t===A)return t;let s=i!==void 0?e._$Co?.[i]:e._$Cl,n=P(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(o),s._$AT(o,e,i)),i!==void 0?(e._$Co??=[])[i]=s:e._$Cl=s),s!==void 0&&(t=w(o,s._$AS(o,t.values),s,i)),t}var G=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??x).importNode(e,!0);y.currentNode=s;let n=y.nextNode(),r=0,c=0,l=i[0];for(;l!==void 0;){if(r===l.index){let a;l.type===2?a=new O(n,n.nextSibling,this,t):l.type===1?a=new l.ctor(n,l.name,l.strings,this,t):l.type===6&&(a=new K(n,this,t)),this._$AV.push(a),l=i[++c]}r!==l?.index&&(n=y.nextNode(),r++)}return y.currentNode=x,s}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},O=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=w(this,t,e),P(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Pt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(x.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=M.createElement(vt(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{let n=new G(s,this),r=n.u(this.options);n.p(e),this.T(r),this._$AH=n}}_$AC(t){let e=_t.get(t.strings);return e===void 0&&_t.set(t.strings,e=new M(t)),e}k(t){X(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,s=0;for(let n of t)s===e.length?e.push(i=new o(this.O(T()),this.O(T()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=lt(t).nextSibling;lt(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},S=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=_}_$AI(t,e=this,i,s){let n=this.strings,r=!1;if(n===void 0)t=w(this,t,e,0),r=!P(t)||t!==this._$AH&&t!==A,r&&(this._$AH=t);else{let c=t,l,a;for(t=n[0],l=0;l<n.length-1;l++)a=w(this,c[i+l],e,l),a===A&&(a=this._$AH[l]),r||=!P(a)||a!==this._$AH[l],a===_?t=_:t!==_&&(t+=(a??"")+n[l+1]),this._$AH[l]=a}r&&!s&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},V=class extends S{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}},W=class extends S{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}},F=class extends S{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=w(this,t,e,0)??_)===A)return;let i=this._$AH,s=t===_&&i!==_||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==_&&(i===_||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},K=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){w(this,t)}};var Ot=J.litHtmlPolyfillSupport;Ot?.(M,O),(J.litHtmlVersions??=[]).push("3.3.3");var bt=(o,t,e)=>{let i=e?.renderBefore??t,s=i._$litPart$;if(s===void 0){let n=e?.renderBefore??null;i._$litPart$=s=new O(t.insertBefore(T(),n),n,void 0,e??{})}return s._$AI(o),s};var Z=globalThis,m=class extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=bt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};m._$litElement$=!0,m.finalized=!0,Z.litElementHydrateSupport?.({LitElement:m});var Ut=Z.litElementPolyfillSupport;Ut?.({LitElement:m});(Z.litElementVersions??=[]).push("4.2.2");var $t=k`
    :host {
        display: block;
        font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    }
    .card {
        background: var(--ha-card-background, var(--card-background-color));
        border-radius: var(--ha-card-border-radius, 12px);
        box-shadow: var(--ha-card-box-shadow, none);
        padding: 16px;
        color: var(--primary-text-color);
    }

    /* ---------- header ---------- */
    .header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 12px;
    }
    .header h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--primary-text-color);
    }
    .header .meta {
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        min-width: 0;
    }
    .header .test-all-btn {
        flex: none;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        border: none;
        border-radius: 8px;
        padding: 5px 10px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        color: var(--primary-text-color);
        background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
        transition: background 0.15s ease, opacity 0.15s ease;
    }
    .header .test-all-btn:hover {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
    }
    .header .test-all-btn[disabled] {
        opacity: 0.5;
        cursor: default;
        pointer-events: none;
    }
    .header .test-all-btn ha-icon {
        --mdc-icon-size: 14px;
    }

    /* ---------- speed tiles ---------- */
    .speeds {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-bottom: 14px;
    }
    .tile {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
        min-width: 0;
    }
    .tile ha-icon {
        --mdc-icon-size: 22px;
        flex: none;
    }
    .tile .tile-body {
        min-width: 0;
    }
    .tile .tile-label {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--secondary-text-color);
    }
    .tile .tile-value {
        font-size: 24px;
        font-weight: 600;
        line-height: 1.15;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .tile .tile-value .unit {
        font-size: 13px;
        font-weight: 500;
        color: var(--secondary-text-color);
        margin-left: 3px;
    }
    .tile.up ha-icon { color: #ff7043; }
    .tile.down ha-icon { color: var(--success-color, #2e7d32); }

    /* ---------- totals strip ---------- */
    .totals {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 16px;
        margin-bottom: 14px;
        font-size: 12px;
        color: var(--secondary-text-color);
    }
    .totals .chip-stat {
        display: inline-flex;
        align-items: center;
        gap: 4px;
    }
    .totals .chip-stat b {
        color: var(--primary-text-color);
        font-weight: 600;
        font-variant-numeric: tabular-nums;
    }

    /* ---------- groups ---------- */
    .group {
        margin-top: 14px;
        border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        padding-top: 12px;
    }
    .group-head {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
    }
    .group-head .group-name {
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-text-color);
    }
    .group-head .group-current {
        font-size: 12px;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .group-head .group-current b {
        color: var(--primary-color);
        font-weight: 600;
    }
    .group-head .test-btn {
        margin-left: auto;
        flex: none;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        border: none;
        border-radius: 8px;
        padding: 5px 10px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        color: var(--primary-text-color);
        background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
        transition: background 0.15s ease, opacity 0.15s ease;
    }
    .group-head .test-btn:hover {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
    }
    .group-head .test-btn[disabled] {
        opacity: 0.5;
        cursor: default;
        pointer-events: none;
    }
    .group-head .test-btn ha-icon {
        --mdc-icon-size: 14px;
    }

    .nodes {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
    .node {
        display: inline-flex;
        align-items: stretch;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        border-radius: 10px;
        overflow: hidden;
        background: transparent;
        transition: border-color 0.15s ease, background 0.15s ease;
    }
    .node:hover {
        border-color: var(--primary-color);
        background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
    }
    .node.active {
        border-color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 14%, transparent);
    }
    .node.active .node-name {
        font-weight: 600;
        color: var(--primary-color);
    }
    .node-select {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        border: none;
        background: transparent;
        padding: 6px 6px 6px 11px;
        font-size: 13px;
        cursor: pointer;
        color: var(--primary-text-color);
        font-family: inherit;
    }
    .node-name {
        max-width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .node-name.standalone {
        padding: 6px 0 6px 11px;
    }
    .node-ping {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-left: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        background: transparent;
        padding: 0 8px;
        cursor: pointer;
        color: var(--secondary-text-color);
        transition: color 0.15s ease, background 0.15s ease;
    }
    .node-ping:hover {
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    }
    .node-ping[disabled] {
        opacity: 0.5;
        cursor: default;
        pointer-events: none;
    }
    .node-ping ha-icon {
        --mdc-icon-size: 15px;
    }
    .ping {
        font-size: 12px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        border-radius: 6px;
        padding: 1px 6px;
        background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
    }
    .ping.good { color: var(--success-color, #2e7d32); }
    .ping.warn { color: #f9a825; }
    .ping.bad { color: var(--error-color, #c62828); }
    .ping.none { color: var(--disabled-text-color); }

    /* ---------- states ---------- */
    .state-msg {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 28px 12px;
        color: var(--secondary-text-color);
        font-size: 14px;
        text-align: center;
    }
    .spinner {
        width: 26px;
        height: 26px;
        border: 3px solid var(--divider-color, rgba(0, 0, 0, 0.2));
        border-top-color: var(--primary-color);
        border-radius: 50%;
        animation: singbox-spin 0.9s linear infinite;
    }
    @keyframes singbox-spin {
        to { transform: rotate(360deg); }
    }
    .footer {
        margin-top: 12px;
        font-size: 11px;
        color: var(--disabled-text-color);
        text-align: right;
    }
    .fallback-note {
        margin-top: 12px;
        padding: 8px 10px;
        border-radius: 8px;
        font-size: 12px;
        line-height: 1.4;
        color: #f9a825;
        background: color-mix(in srgb, #f9a825 12%, transparent);
    }
`;var Q=class extends m{static properties={hass:{},_config:{state:!0}};static styles=k`
        .row {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px 0;
        }
        .row ha-switch {
            flex: none;
        }
        .row .label {
            flex: 1;
            font-size: 13px;
        }
        ha-textfield {
            width: 100%;
        }
        .hint {
            font-size: 11px;
            color: var(--secondary-text-color);
            margin: 2px 0 8px;
        }
    `;setConfig(t){this._config={...t}}_update(t,e){this._config={...this._config,[t]:e},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_onText(t,e){this._update(e,t.target.value)}_onSwitch(t,e){this._update(e,t.target.checked)}render(){let t=this._config||{};return u`
            <ha-textfield
                label="Заголовок"
                value=${t.title||"Sing-box"}
                @change=${e=>this._onText(e,"title")}
            ></ha-textfield>

            <div class="row" style="margin-top: 12px">
                <span class="label">Кнопка «Проверить все»</span>
                <ha-switch
                    .checked=${t.show_test_all!==!1}
                    @change=${e=>this._onSwitch(e,"show_test_all")}
                ></ha-switch>
            </div>
            <div class="hint">
                Массовый url-test по всем группам и outbound в один клик.
            </div>

            <ha-textfield
                label="Исключить outbound (через запятую)"
                value=${(t.exclude_outbounds||[]).join(", ")}
                @change=${e=>this._update("exclude_outbounds",e.target.value.split(",").map(i=>i.trim()).filter(Boolean))}
            ></ha-textfield>
            <div class="hint">
                Эти теги будут скрыты из групп и блока Outbound. Например:
                telaga-urltest-out, main-out
            </div>

            <ha-textfield
                label="device_id (необязательно)"
                value=${t.device_id||""}
                @change=${e=>this._onText(e,"device_id")}
            ></ha-textfield>
            <div class="hint">
                Привязка к конкретному устройству sing-box, если их несколько.
            </div>

            <ha-textfield
                label="entity (необязательно)"
                value=${t.entity||""}
                @change=${e=>this._onText(e,"entity")}
            ></ha-textfield>
            <div class="hint">
                Альтернативная привязка через любую сущность ha-singbox.
            </div>
        `}};customElements.define("singbox-panel-card-editor",Q);var Bt="0.1.12",z="_group_",q="_ping_",tt="_clash_mode",Ht="GLOBAL",yt="Sing-box",et=class extends m{static properties={_hass:{state:!0},_state:{state:!0},_message:{state:!0},_model:{state:!0},_testing:{state:!0},_testingAll:{state:!0}};static styles=$t;constructor(){super(),this._hass=null,this._config={},this._discovered=!1,this._state="loading",this._message="",this._model=null,this._testing={},this._testingAll=!1,this._fallbackNote=null}static getStubConfig(){return{title:yt,show_test_all:!0,exclude_outbounds:[]}}static getConfigElement(){return document.createElement("singbox-panel-card-editor")}setConfig(t){if(!t||typeof t!="object")throw new Error("Invalid configuration");let e={title:yt,show_test_all:!0,exclude_outbounds:[],...t};e.exclude_outbounds=(Array.isArray(e.exclude_outbounds)?e.exclude_outbounds:String(e.exclude_outbounds??"").split(",")).map(i=>String(i).trim()).filter(Boolean),(e.device_id!==this._config.device_id||e.entity!==this._config.entity)&&(this._discovered=!1),this._config=e}getCardSize(){return 4}set hass(t){this._hass=t,t&&!this._discovered&&(this._discovered=!0,this._discover()),t&&this.requestUpdate()}async _discover(){this._state="loading",this._fallbackNote=null;try{let t=await this._hass.callWS({type:"config/entity_registry/list"});if(!Array.isArray(t))throw new Error("registry is unavailable");let e=n=>this._domain(n)==="select"&&n.unique_id&&n.unique_id.includes(z)&&!n.unique_id.endsWith(tt),i=n=>n.filter(e),s=t;if(this._config.device_id){let n=t.filter(r=>r.device_id===this._config.device_id);i(n).length>0?s=n:this._fallbackNote=`device_id \xAB${this._config.device_id}\xBB \u043D\u0435 \u0434\u0430\u043B \u0433\u0440\u0443\u043F\u043F (\u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u0440\u0435\u0435\u0441\u0442\u0440\u0430: ${n.length}) \u2014 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u044B \u0432\u0441\u0435 \u044D\u043A\u0437\u0435\u043C\u043F\u043B\u044F\u0440\u044B sing-box.`}else if(this._config.entity){let n=t.find(r=>r.entity_id===this._config.entity);if(!n)this._fallbackNote=`entity \xAB${this._config.entity}\xBB \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430 \u0432 \u0440\u0435\u0435\u0441\u0442\u0440\u0435 \u2014 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u044B \u0432\u0441\u0435 \u044D\u043A\u0437\u0435\u043C\u043F\u043B\u044F\u0440\u044B sing-box.`;else{let r=t.filter(c=>n.config_entry_id&&c.config_entry_id===n.config_entry_id||n.device_id&&c.device_id===n.device_id);i(r).length>0?s=r:this._fallbackNote=`entity \xAB${this._config.entity}\xBB \u043D\u0435 \u0434\u0430\u043B\u0430 \u0433\u0440\u0443\u043F\u043F \u2014 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u044B \u0432\u0441\u0435 \u044D\u043A\u0437\u0435\u043C\u043F\u043B\u044F\u0440\u044B sing-box.`}}if(this._model=this._buildModel(s),this._model.groups.length===0){let n=t.filter(h=>this._domain(h)==="select"),r=i(t),c=t.filter(h=>this._domain(h)==="sensor"&&h.unique_id&&h.unique_id.includes(q)),l=this._config.device_id?t.filter(h=>h.device_id===this._config.device_id).length:null,a=this._config.device_id?t.filter(h=>h.device_id===this._config.device_id):[],p=a.slice(0,5).map(h=>{let g=h.unique_id?h.unique_id.slice(0,40):"\u2014";return`${h.entity_id} (${this._domain(h)}) [${g}]`}).join(", ");a.length&&console.warn("singbox-panel: records matched by pin:",a.map(h=>`${h.entity_id} ${this._domain(h)} ${h.unique_id??""}`).join(`
`));let d=r.slice(0,5).map(h=>`${h.entity_id} [${h.unique_id}]`).join(", ");this._state="error",this._message=r.length===0?l!==null?`\u0413\u0440\u0443\u043F\u043F\u044B \u043F\u0440\u043E\u043A\u0441\u0438 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B: \u043F\u043E device_id \u043D\u0430\u0439\u0434\u0435\u043D\u043E \u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u0440\u0435\u0435\u0441\u0442\u0440\u0430: ${l}, \u043D\u043E \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0435\u0439 ha-singbox \u0441\u0440\u0435\u0434\u0438 \u043D\u0438\u0445 \u043D\u0435\u0442 (select \u0432\u043E \u0432\u0441\u0451\u043C \u0440\u0435\u0435\u0441\u0442\u0440\u0435: ${n.length}, ping-\u0441\u0435\u043D\u0441\u043E\u0440\u043E\u0432: ${c.length}). \u041F\u0440\u0438\u043C\u0435\u0440 \u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u043F\u043E device_id: ${p}. \u0423\u0431\u0435\u0434\u0438\u0442\u0435\u0441\u044C, \u0447\u0442\u043E \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430 \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u044F ha-singbox (Ghost-in-the-dark/ha-singbox) \u0438 \u043E\u043D\u0430 \u0441\u043E\u0437\u0434\u0430\u043B\u0430 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0438, \u0437\u0430\u0442\u0435\u043C \u043F\u0435\u0440\u0435\u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 HA.`:`\u0413\u0440\u0443\u043F\u043F\u044B \u043F\u0440\u043E\u043A\u0441\u0438 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B: \u0432 \u0440\u0435\u0435\u0441\u0442\u0440\u0435 \u043D\u0435\u0442 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0435\u0439 sing-box (\u0432\u0441\u0435\u0433\u043E select: ${n.length}, ping-\u0441\u0435\u043D\u0441\u043E\u0440\u043E\u0432: ${c.length}). \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435, \u0447\u0442\u043E ha-singbox \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430 \u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u0430, \u0437\u0430\u0442\u0435\u043C \u043F\u0435\u0440\u0435\u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 HA.`:`\u0413\u0440\u0443\u043F\u043F\u044B \u043F\u0440\u043E\u043A\u0441\u0438 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B: select-\u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0438 \u0435\u0441\u0442\u044C, \u043D\u043E \u0441 \u043D\u0435\u043E\u0436\u0438\u0434\u0430\u043D\u043D\u044B\u043C \u0444\u043E\u0440\u043C\u0430\u0442\u043E\u043C unique_id (${d}). \u041E\u0431\u043D\u043E\u0432\u0438\u0442\u0435 ha-singbox \u0438 \u043F\u0435\u0440\u0435\u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 HA.`;return}this._fallbackNote&&console.warn(`singbox-panel: ${this._fallbackNote}`),this._state="ready"}catch(t){this._state="error",this._message=`\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435: ${t&&t.message?t.message:t}`}}_buildModel(t){let e=new Set(this._config.exclude_outbounds||[]),i={};for(let a of t)if(this._domain(a)==="sensor"&&a.unique_id&&a.unique_id.includes(q)){let p=a.unique_id.slice(a.unique_id.lastIndexOf(q)+q.length);if(p===Ht)continue;i[p]=a.entity_id}let s=[],n=new Set;for(let a of t){if(this._domain(a)!=="select"||!a.unique_id||!a.unique_id.includes(z)||a.unique_id.endsWith(tt))continue;let p=a.unique_id.slice(a.unique_id.lastIndexOf(z)+z.length),d=this._hass.states[a.entity_id],h=d&&d.attributes&&Array.isArray(d.attributes.options)?d.attributes.options:[];h.forEach(f=>n.add(f));let g=h.filter(f=>!e.has(f)).map(f=>({tag:f,pingEntity:i[f]||null}));g.length!==0&&s.push({tag:p,entityId:a.entity_id,options:g})}let r=Object.keys(i).filter(a=>!n.has(a)&&!e.has(a)).sort().map(a=>({tag:a,pingEntity:i[a]})),c=a=>{let p=t.find(d=>this._domain(d)==="sensor"&&d.unique_id&&d.unique_id.endsWith(a));return p?p.entity_id:null},l=t.find(a=>this._domain(a)==="select"&&a.unique_id&&a.unique_id.endsWith(tt));return{version:c("_version"),uplink:c("_uplink"),downlink:c("_downlink"),uplinkTotal:c("_uplink_total"),downlinkTotal:c("_downlink_total"),memory:c("_memory"),connectionsIn:c("_connections_in"),clashMode:l?l.entity_id:null,groups:s,standalone:r}}_entity(t){return t?this._hass.states[t]:void 0}_domain(t){return t.entity_id?t.entity_id.split(".")[0]:t.domain||""}_stateValue(t){let e=this._entity(t);return e?e.state==="unavailable"?null:e.state:null}_formatSpeed(t){let e=this._entity(t);if(!e||e.state==="unavailable"||e.state==="unknown")return{value:"\u2014",unit:""};let i=Number(e.state);return Number.isFinite(i)?{value:i.toLocaleString(void 0,{maximumFractionDigits:1}),unit:e.attributes&&e.attributes.unit_of_measurement?e.attributes.unit_of_measurement:""}:{value:"\u2014",unit:""}}_formatBytes(t){let e=this._entity(t);if(!e||e.state==="unavailable"||e.state==="unknown")return"\u2014";let i=Number(e.state);if(!Number.isFinite(i))return"\u2014";let s=e.attributes&&e.attributes.unit_of_measurement||"B",n={B:1,kB:1e3,MB:1e6,GB:1e9,TB:1e12,KiB:1024,MiB:1024**2,GiB:1024**3,TiB:1024**4},r=i*(n[s]||1),c=["B","KiB","MiB","GiB","TiB"],l=r,a=0;for(;l>=1024&&a<c.length-1;)l/=1024,a+=1;let p=a?1:0;return`${l.toLocaleString(void 0,{maximumFractionDigits:p})} ${c[a]}`}_ping(t){let e=this._entity(t.pingEntity);if(!e||e.state==="unavailable"||e.state==="unknown")return null;let i=Number(e.state);return Number.isFinite(i)?i:null}_pingClass(t){return t===null?"none":t<=100?"good":t<=300?"warn":"bad"}_pingText(t){return t===null?"\u2014":`${t} ms`}async _callService(t,e,i,s){try{await this._hass.callService(t,e,s?{...i,entity_id:s}:i)}catch(n){let r=String(n&&n.message?n.message:n);if(s&&/extra keys not allowed/.test(r)){await this._hass.callService(t,e,i);return}throw n}}async _selectNode(t,e,i){if(this._hass)try{await this._callService("singbox","select_outbound",{group_tag:t,outbound_tag:e},i)}catch(s){console.error("singbox-panel: select_outbound failed",s)}}async _testGroup(t,e){if(!(!this._hass||this._testing[t])){this._testing={...this._testing,[t]:!0};try{await this._callService("singbox","url_test",{outbound_tag:t},e)}catch(i){console.error("singbox-panel: url_test failed",i)}finally{setTimeout(()=>{this._testing={...this._testing,[t]:!1}},4e3)}}}async _pingNode(t,e){if(!(!this._hass||this._testing[t])){this._testing={...this._testing,[t]:!0};try{await this._callService("singbox","url_test",{outbound_tag:t},e)}catch(i){console.error("singbox-panel: url_test failed",i)}finally{setTimeout(()=>{this._testing={...this._testing,[t]:!1}},4e3)}}}async _testAll(){if(!this._hass||!this._model||this._testingAll)return;this._testingAll=!0;let t=[...this._model.groups.map(e=>({tag:e.tag,target:e.entityId})),...this._model.standalone.map(e=>({tag:e.tag,target:e.pingEntity}))];try{await Promise.all(t.map(e=>this._callService("singbox","url_test",{outbound_tag:e.tag},e.target).catch(i=>{console.error(`singbox-panel: url_test failed for ${e.tag}`,i)})))}finally{setTimeout(()=>{this._testingAll=!1},4e3)}}render(){if(this._state==="error")return u`
                <div class="card">
                    <div class="state-msg">${this._message}</div>
                </div>
            `;if(this._state==="loading"||!this._model)return u`
                <div class="card">
                    <div class="state-msg">
                        <div class="spinner"></div>
                        <span>Загрузка данных sing-box…</span>
                    </div>
                </div>
            `;let t=this._model,e=this._stateValue(t.version),i=this._stateValue(t.clashMode),s=this._config.show_test_all!==!1&&(t.groups.length>0||t.standalone.length>0);return u`
            <div class="card">
                <div class="header">
                    <h2>${this._config.title}</h2>
                    <div class="meta">
                        ${e?u`<span>${e}</span>`:""}
                        ${i?u`<span> · ${i}</span>`:""}
                    </div>
                    ${s?u`
                              <button
                                  class="test-all-btn"
                                  ?disabled=${this._testingAll}
                                  @click=${()=>this._testAll()}
                              >
                                  <ha-icon icon="mdi:flash-outline"></ha-icon>
                                  ${this._testingAll?"\u0422\u0435\u0441\u0442\u2026":"\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0432\u0441\u0435"}
                              </button>
                          `:""}
                </div>

                <div class="speeds">
                    ${this._speedTile("up","mdi:arrow-up-bold","\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430",t.uplink)}
                    ${this._speedTile("down","mdi:arrow-down-bold","\u0421\u043A\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u0435",t.downlink)}
                </div>

                <div class="totals">
                    ${this._totalChip("mdi:arrow-up",this._formatBytes(t.uplinkTotal))}
                    ${this._totalChip("mdi:arrow-down",this._formatBytes(t.downlinkTotal))}
                    ${this._totalChip("mdi:memory",this._formatBytes(t.memory))}
                    ${this._totalChip("mdi:lan-connect",this._stateValue(t.connectionsIn))}
                </div>

                ${t.groups.map(n=>this._renderGroup(n))}
                ${t.standalone.length?this._renderStandalone(t.standalone):""}

                ${this._fallbackNote?u`<div class="fallback-note">${this._fallbackNote}</div>`:""}
                <div class="footer">sing-box panel · v${Bt}</div>
            </div>
        `}_renderStandalone(t){return u`
            <div class="group">
                <div class="group-head">
                    <span class="group-name">Outbound</span>
                </div>
                <div class="nodes">
                    ${t.map(e=>this._renderStandaloneNode(e))}
                </div>
            </div>
        `}_renderStandaloneNode(t){let e=this._ping(t),i=!!this._testing[t.tag];return u`
            <div class="node">
                <span class="node-name standalone">${t.tag}</span>
                ${e!==null?u`<span class="ping ${this._pingClass(e)}">${this._pingText(e)}</span>`:""}
                <button
                    class="node-ping"
                    title="Проверить пинг ${t.tag}"
                    ?disabled=${i}
                    @click=${()=>this._pingNode(t.tag,t.pingEntity)}
                >
                    <ha-icon icon="mdi:radar"></ha-icon>
                </button>
            </div>
        `}_speedTile(t,e,i,s){let{value:n,unit:r}=this._formatSpeed(s);return u`
            <div class="tile ${t}">
                <ha-icon icon=${e}></ha-icon>
                <div class="tile-body">
                    <div class="tile-label">${i}</div>
                    <div class="tile-value">${n}<span class="unit">${r}</span></div>
                </div>
            </div>
        `}_totalChip(t,e){return u`
            <span class="chip-stat">
                <ha-icon icon=${t}></ha-icon>
                <b>${e}</b>
            </span>
        `}_renderGroup(t){let e=this._entity(t.entityId),i=e&&e.state!=="unavailable"?e.state:null,s=!!this._testing[t.tag];return u`
            <div class="group">
                <div class="group-head">
                    <span class="group-name">${t.tag}</span>
                    <span class="group-current">
                        ${i?u`→ <b>${i}</b>`:""}
                    </span>
                    <button
                        class="test-btn"
                        ?disabled=${s}
                        @click=${()=>this._testGroup(t.tag,t.entityId)}
                    >
                        <ha-icon icon="mdi:flash-outline"></ha-icon>
                        ${s?"\u0422\u0435\u0441\u0442\u2026":"\u0422\u0435\u0441\u0442"}
                    </button>
                </div>
                <div class="nodes">
                    ${t.options.map(n=>this._renderNode(t,n,i))}
                </div>
            </div>
        `}_renderNode(t,e,i){let s=this._ping(e),n=e.tag===i,r=!!this._testing[e.tag];return u`
            <div class="node ${n?"active":""}">
                <button
                    class="node-select"
                    title="Выбрать ${e.tag}"
                    @click=${()=>this._selectNode(t.tag,e.tag,t.entityId)}
                >
                    <span class="node-name">${e.tag}</span>
                    ${s!==null?u`<span class="ping ${this._pingClass(s)}">${this._pingText(s)}</span>`:""}
                </button>
                <button
                    class="node-ping"
                    title="Проверить пинг ${e.tag}"
                    ?disabled=${r}
                    @click=${()=>this._pingNode(e.tag,e.pingEntity||t.entityId)}
                >
                    <ha-icon icon="mdi:radar"></ha-icon>
                </button>
            </div>
        `}};customElements.define("singbox-panel-card",et);window.customCards=window.customCards||[];window.customCards.push({type:"singbox-panel-card",name:"Sing-box Panel",description:"\u041F\u0430\u043D\u0435\u043B\u044C \u043C\u043E\u043D\u0438\u0442\u043E\u0440\u0438\u043D\u0433\u0430 \u0438 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u043F\u0440\u043E\u043A\u0441\u0438 sing-box",preview:!1});
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
