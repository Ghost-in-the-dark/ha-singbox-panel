var T=globalThis,O=T.ShadowRoot&&(T.ShadyCSS===void 0||T.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,B=Symbol(),et=new WeakMap,S=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==B)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(O&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=et.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&et.set(e,t))}return t}toString(){return this.cssText}},it=r=>new S(typeof r=="string"?r:r+"",void 0,B),I=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((i,s,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1],r[0]);return new S(e,r,B)},st=(r,t)=>{if(O)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),s=T.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}},L=O?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return it(e)})(r):r;var{is:bt,defineProperty:xt,getOwnPropertyDescriptor:At,getOwnPropertyNames:wt,getOwnPropertySymbols:St,getPrototypeOf:Et}=Object,R=globalThis,nt=R.trustedTypes,Ct=nt?nt.emptyScript:"",kt=R.reactiveElementPolyfillSupport,E=(r,t)=>r,D={toAttribute(r,t){switch(t){case Boolean:r=r?Ct:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},rt=(r,t)=>!bt(r,t),ot={attribute:!0,type:String,converter:D,reflect:!1,useDefault:!1,hasChanged:rt};Symbol.metadata??=Symbol("metadata"),R.litPropertyMetadata??=new WeakMap;var f=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ot){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&xt(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){let{get:s,set:n}=At(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){let d=s?.call(this);n?.call(this,o),this.requestUpdate(t,d,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ot}static _$Ei(){if(this.hasOwnProperty(E("elementProperties")))return;let t=Et(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(E("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(E("properties"))){let e=this.properties,i=[...wt(e),...St(e)];for(let s of i)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let s of i)e.unshift(L(s))}else t!==void 0&&e.push(L(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return st(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){let n=(i.converter?.toAttribute!==void 0?i.converter:D).toAttribute(e,i.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){let i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let n=i.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:D;this._$Em=s;let d=o.fromAttribute(e,n.type);this[s]=d??this._$Ej?.get(s)??d,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(t!==void 0){let o=this.constructor;if(s===!1&&(n=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??rt)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,n]of i){let{wrapped:o}=n,d=this[s];o!==!0||this._$AL.has(s)||d===void 0||this.C(s,void 0,n,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};f.elementStyles=[],f.shadowRootOptions={mode:"open"},f[E("elementProperties")]=new Map,f[E("finalized")]=new Map,kt?.({ReactiveElement:f}),(R.reactiveElementVersions??=[]).push("2.1.2");var J=globalThis,at=r=>r,H=J.trustedTypes,lt=H?H.createPolicy("lit-html",{createHTML:r=>r}):void 0,_t="$lit$",m=`lit$${Math.random().toFixed(9).slice(2)}$`,gt="?"+m,Nt=`<${gt}>`,b=document,k=()=>b.createComment(""),N=r=>r===null||typeof r!="object"&&typeof r!="function",X=Array.isArray,Pt=r=>X(r)||typeof r?.[Symbol.iterator]=="function",j=`[ 	
\f\r]`,C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,dt=/-->/g,ct=/>/g,v=RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ht=/'/g,pt=/"/g,ft=/^(?:script|style|textarea|title)$/i,Z=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),_=Z(1),Bt=Z(2),It=Z(3),x=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),ut=new WeakMap,y=b.createTreeWalker(b,129);function mt(r,t){if(!X(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return lt!==void 0?lt.createHTML(t):t}var Ut=(r,t)=>{let e=r.length-1,i=[],s,n=t===2?"<svg>":t===3?"<math>":"",o=C;for(let d=0;d<e;d++){let a=r[d],c,p,h=-1,l=0;for(;l<a.length&&(o.lastIndex=l,p=o.exec(a),p!==null);)l=o.lastIndex,o===C?p[1]==="!--"?o=dt:p[1]!==void 0?o=ct:p[2]!==void 0?(ft.test(p[2])&&(s=RegExp("</"+p[2],"g")),o=v):p[3]!==void 0&&(o=v):o===v?p[0]===">"?(o=s??C,h=-1):p[1]===void 0?h=-2:(h=o.lastIndex-p[2].length,c=p[1],o=p[3]===void 0?v:p[3]==='"'?pt:ht):o===pt||o===ht?o=v:o===dt||o===ct?o=C:(o=v,s=void 0);let g=o===v&&r[d+1].startsWith("/>")?" ":"";n+=o===C?a+Nt:h>=0?(i.push(c),a.slice(0,h)+_t+a.slice(h)+m+g):a+m+(h===-2?d:g)}return[mt(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},P=class r{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0,d=t.length-1,a=this.parts,[c,p]=Ut(t,e);if(this.el=r.createElement(c,i),y.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=y.nextNode())!==null&&a.length<d;){if(s.nodeType===1){if(s.hasAttributes())for(let h of s.getAttributeNames())if(h.endsWith(_t)){let l=p[o++],g=s.getAttribute(h).split(m),M=/([.?@])?(.*)/.exec(l);a.push({type:1,index:n,name:M[2],strings:g,ctor:M[1]==="."?W:M[1]==="?"?G:M[1]==="@"?F:w}),s.removeAttribute(h)}else h.startsWith(m)&&(a.push({type:6,index:n}),s.removeAttribute(h));if(ft.test(s.tagName)){let h=s.textContent.split(m),l=h.length-1;if(l>0){s.textContent=H?H.emptyScript:"";for(let g=0;g<l;g++)s.append(h[g],k()),y.nextNode(),a.push({type:2,index:++n});s.append(h[l],k())}}}else if(s.nodeType===8)if(s.data===gt)a.push({type:2,index:n});else{let h=-1;for(;(h=s.data.indexOf(m,h+1))!==-1;)a.push({type:7,index:n}),h+=m.length-1}n++}}static createElement(t,e){let i=b.createElement("template");return i.innerHTML=t,i}};function A(r,t,e=r,i){if(t===x)return t;let s=i!==void 0?e._$Co?.[i]:e._$Cl,n=N(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(r),s._$AT(r,e,i)),i!==void 0?(e._$Co??=[])[i]=s:e._$Cl=s),s!==void 0&&(t=A(r,s._$AS(r,t.values),s,i)),t}var V=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??b).importNode(e,!0);y.currentNode=s;let n=y.nextNode(),o=0,d=0,a=i[0];for(;a!==void 0;){if(o===a.index){let c;a.type===2?c=new U(n,n.nextSibling,this,t):a.type===1?c=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(c=new K(n,this,t)),this._$AV.push(c),a=i[++d]}o!==a?.index&&(n=y.nextNode(),o++)}return y.currentNode=b,s}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},U=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=A(this,t,e),N(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==x&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Pt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==u&&N(this._$AH)?this._$AA.nextSibling.data=t:this.T(b.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=P.createElement(mt(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{let n=new V(s,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=ut.get(t.strings);return e===void 0&&ut.set(t.strings,e=new P(t)),e}k(t){X(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,s=0;for(let n of t)s===e.length?e.push(i=new r(this.O(k()),this.O(k()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=at(t).nextSibling;at(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},w=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=u}_$AI(t,e=this,i,s){let n=this.strings,o=!1;if(n===void 0)t=A(this,t,e,0),o=!N(t)||t!==this._$AH&&t!==x,o&&(this._$AH=t);else{let d=t,a,c;for(t=n[0],a=0;a<n.length-1;a++)c=A(this,d[i+a],e,a),c===x&&(c=this._$AH[a]),o||=!N(c)||c!==this._$AH[a],c===u?t=u:t!==u&&(t+=(c??"")+n[a+1]),this._$AH[a]=c}o&&!s&&this.j(t)}j(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},W=class extends w{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===u?void 0:t}},G=class extends w{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==u)}},F=class extends w{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=A(this,t,e,0)??u)===x)return;let i=this._$AH,s=t===u&&i!==u||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==u&&(i===u||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},K=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){A(this,t)}};var Mt=J.litHtmlPolyfillSupport;Mt?.(P,U),(J.litHtmlVersions??=[]).push("3.3.3");var $t=(r,t,e)=>{let i=e?.renderBefore??t,s=i._$litPart$;if(s===void 0){let n=e?.renderBefore??null;i._$litPart$=s=new U(t.insertBefore(k(),n),n,void 0,e??{})}return s._$AI(r),s};var Q=globalThis,$=class extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=$t(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return x}};$._$litElement$=!0,$.finalized=!0,Q.litElementHydrateSupport?.({LitElement:$});var Tt=Q.litElementPolyfillSupport;Tt?.({LitElement:$});(Q.litElementVersions??=[]).push("4.2.2");var vt=I`
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
`;var Ot="0.1.7",z="_group_",q="_ping_",Y="_clash_mode",yt="Sing-box",tt=class extends ${static properties={_state:{state:!0},_message:{state:!0},_model:{state:!0},_testing:{state:!0}};static styles=vt;constructor(){super(),this._hass=null,this._config={},this._discovered=!1,this._state="loading",this._message="",this._model=null,this._testing={},this._fallbackNote=null}static getStubConfig(){return{title:yt}}setConfig(t){if(!t||typeof t!="object")throw new Error("Invalid configuration");let e={title:yt,...t};(e.device_id!==this._config.device_id||e.entity!==this._config.entity)&&(this._discovered=!1),this._config=e}getCardSize(){return 4}set hass(t){this._hass=t,t&&!this._discovered&&(this._discovered=!0,this._discover())}async _discover(){this._state="loading",this._fallbackNote=null;try{let t=await this._hass.callWS({type:"config/entity_registry/list"});if(!Array.isArray(t))throw new Error("registry is unavailable");let e=n=>this._domain(n)==="select"&&n.unique_id&&n.unique_id.includes(z)&&!n.unique_id.endsWith(Y),i=n=>n.filter(e),s=t;if(this._config.device_id){let n=t.filter(o=>o.device_id===this._config.device_id);i(n).length>0?s=n:this._fallbackNote=`device_id \xAB${this._config.device_id}\xBB \u043D\u0435 \u0434\u0430\u043B \u0433\u0440\u0443\u043F\u043F (\u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u0440\u0435\u0435\u0441\u0442\u0440\u0430: ${n.length}) \u2014 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u044B \u0432\u0441\u0435 \u044D\u043A\u0437\u0435\u043C\u043F\u043B\u044F\u0440\u044B sing-box.`}else if(this._config.entity){let n=t.find(o=>o.entity_id===this._config.entity);if(!n)this._fallbackNote=`entity \xAB${this._config.entity}\xBB \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430 \u0432 \u0440\u0435\u0435\u0441\u0442\u0440\u0435 \u2014 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u044B \u0432\u0441\u0435 \u044D\u043A\u0437\u0435\u043C\u043F\u043B\u044F\u0440\u044B sing-box.`;else{let o=t.filter(d=>n.config_entry_id&&d.config_entry_id===n.config_entry_id||n.device_id&&d.device_id===n.device_id);i(o).length>0?s=o:this._fallbackNote=`entity \xAB${this._config.entity}\xBB \u043D\u0435 \u0434\u0430\u043B\u0430 \u0433\u0440\u0443\u043F\u043F \u2014 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u044B \u0432\u0441\u0435 \u044D\u043A\u0437\u0435\u043C\u043F\u043B\u044F\u0440\u044B sing-box.`}}if(this._model=this._buildModel(s),this._model.groups.length===0){let n=t.filter(l=>this._domain(l)==="select"),o=i(t),d=t.filter(l=>this._domain(l)==="sensor"&&l.unique_id&&l.unique_id.includes(q)),a=this._config.device_id?t.filter(l=>l.device_id===this._config.device_id).length:null,c=this._config.device_id?t.filter(l=>l.device_id===this._config.device_id):[],p=c.slice(0,5).map(l=>{let g=l.unique_id?l.unique_id.slice(0,40):"\u2014";return`${l.entity_id} (${this._domain(l)}) [${g}]`}).join(", ");c.length&&console.warn("singbox-panel: records matched by pin:",c.map(l=>`${l.entity_id} ${this._domain(l)} ${l.unique_id??""}`).join(`
`));let h=o.slice(0,5).map(l=>`${l.entity_id} [${l.unique_id}]`).join(", ");this._state="error",this._message=o.length===0?a!==null?`\u0413\u0440\u0443\u043F\u043F\u044B \u043F\u0440\u043E\u043A\u0441\u0438 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B: \u043F\u043E device_id \u043D\u0430\u0439\u0434\u0435\u043D\u043E \u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u0440\u0435\u0435\u0441\u0442\u0440\u0430: ${a}, \u043D\u043E \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0435\u0439 ha-singbox \u0441\u0440\u0435\u0434\u0438 \u043D\u0438\u0445 \u043D\u0435\u0442 (select \u0432\u043E \u0432\u0441\u0451\u043C \u0440\u0435\u0435\u0441\u0442\u0440\u0435: ${n.length}, ping-\u0441\u0435\u043D\u0441\u043E\u0440\u043E\u0432: ${d.length}). \u041F\u0440\u0438\u043C\u0435\u0440 \u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u043F\u043E device_id: ${p}. \u0423\u0431\u0435\u0434\u0438\u0442\u0435\u0441\u044C, \u0447\u0442\u043E \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430 \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u044F ha-singbox (Ghost-in-the-dark/ha-singbox) \u0438 \u043E\u043D\u0430 \u0441\u043E\u0437\u0434\u0430\u043B\u0430 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0438, \u0437\u0430\u0442\u0435\u043C \u043F\u0435\u0440\u0435\u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 HA.`:`\u0413\u0440\u0443\u043F\u043F\u044B \u043F\u0440\u043E\u043A\u0441\u0438 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B: \u0432 \u0440\u0435\u0435\u0441\u0442\u0440\u0435 \u043D\u0435\u0442 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0435\u0439 sing-box (\u0432\u0441\u0435\u0433\u043E select: ${n.length}, ping-\u0441\u0435\u043D\u0441\u043E\u0440\u043E\u0432: ${d.length}). \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435, \u0447\u0442\u043E ha-singbox \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430 \u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u0430, \u0437\u0430\u0442\u0435\u043C \u043F\u0435\u0440\u0435\u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 HA.`:`\u0413\u0440\u0443\u043F\u043F\u044B \u043F\u0440\u043E\u043A\u0441\u0438 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B: select-\u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0438 \u0435\u0441\u0442\u044C, \u043D\u043E \u0441 \u043D\u0435\u043E\u0436\u0438\u0434\u0430\u043D\u043D\u044B\u043C \u0444\u043E\u0440\u043C\u0430\u0442\u043E\u043C unique_id (${h}). \u041E\u0431\u043D\u043E\u0432\u0438\u0442\u0435 ha-singbox \u0438 \u043F\u0435\u0440\u0435\u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 HA.`;return}this._fallbackNote&&console.warn(`singbox-panel: ${this._fallbackNote}`),this._state="ready"}catch(t){this._state="error",this._message=`\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435: ${t&&t.message?t.message:t}`}}_buildModel(t){let e={};for(let a of t)if(this._domain(a)==="sensor"&&a.unique_id&&a.unique_id.includes(q)){let c=a.unique_id.slice(a.unique_id.lastIndexOf(q)+q.length);e[c]=a.entity_id}let i=[],s=new Set;for(let a of t){if(this._domain(a)!=="select"||!a.unique_id||!a.unique_id.includes(z)||a.unique_id.endsWith(Y))continue;let c=a.unique_id.slice(a.unique_id.lastIndexOf(z)+z.length),p=this._hass.states[a.entity_id],h=p&&p.attributes&&Array.isArray(p.attributes.options)?p.attributes.options:[];h.forEach(l=>s.add(l)),i.push({tag:c,entityId:a.entity_id,options:h.map(l=>({tag:l,pingEntity:e[l]||null}))})}let n=Object.keys(e).filter(a=>!s.has(a)).sort().map(a=>({tag:a,pingEntity:e[a]})),o=a=>{let c=t.find(p=>this._domain(p)==="sensor"&&p.unique_id&&p.unique_id.endsWith(a));return c?c.entity_id:null},d=t.find(a=>this._domain(a)==="select"&&a.unique_id&&a.unique_id.endsWith(Y));return{version:o("_version"),uplink:o("_uplink"),downlink:o("_downlink"),uplinkTotal:o("_uplink_total"),downlinkTotal:o("_downlink_total"),memory:o("_memory"),connectionsIn:o("_connections_in"),clashMode:d?d.entity_id:null,groups:i,standalone:n}}_entity(t){return t?this._hass.states[t]:void 0}_domain(t){return t.entity_id?t.entity_id.split(".")[0]:t.domain||""}_stateValue(t){let e=this._entity(t);return e?e.state==="unavailable"?null:e.state:null}_formatSpeed(t){let e=this._entity(t);if(!e||e.state==="unavailable"||e.state==="unknown")return{value:"\u2014",unit:""};let i=Number(e.state);return Number.isFinite(i)?{value:i.toLocaleString(void 0,{maximumFractionDigits:1}),unit:e.attributes&&e.attributes.unit_of_measurement?e.attributes.unit_of_measurement:""}:{value:"\u2014",unit:""}}_formatBytes(t){let e=this._entity(t);if(!e||e.state==="unavailable"||e.state==="unknown")return"\u2014";let i=Number(e.state);if(!Number.isFinite(i))return"\u2014";let s=["B","KiB","MiB","GiB","TiB"],n=i,o=0;for(;n>=1024&&o<s.length-1;)n/=1024,o+=1;let d=o?1:0;return`${n.toLocaleString(void 0,{maximumFractionDigits:d})} ${s[o]}`}_ping(t){let e=this._entity(t.pingEntity);if(!e||e.state==="unavailable"||e.state==="unknown")return null;let i=Number(e.state);return Number.isFinite(i)?i:null}_pingClass(t){return t===null?"none":t<=100?"good":t<=300?"warn":"bad"}_pingText(t){return t===null?"\u2014":`${t} ms`}async _selectNode(t,e,i){if(this._hass)try{await this._hass.callService("singbox","select_outbound",{group_tag:t,outbound_tag:e,entity_id:i})}catch(s){console.error("singbox-panel: select_outbound failed",s)}}async _testGroup(t,e){if(!(!this._hass||this._testing[t])){this._testing={...this._testing,[t]:!0};try{await this._hass.callService("singbox","url_test",{outbound_tag:t,entity_id:e})}catch(i){console.error("singbox-panel: url_test failed",i)}finally{setTimeout(()=>{this._testing={...this._testing,[t]:!1}},4e3)}}}async _pingNode(t,e){if(!(!this._hass||this._testing[t])){this._testing={...this._testing,[t]:!0};try{await this._hass.callService("singbox","url_test",{outbound_tag:t,entity_id:e})}catch(i){console.error("singbox-panel: url_test failed",i)}finally{setTimeout(()=>{this._testing={...this._testing,[t]:!1}},4e3)}}}render(){if(this._state==="error")return _`
                <div class="card">
                    <div class="state-msg">${this._message}</div>
                </div>
            `;if(this._state==="loading"||!this._model)return _`
                <div class="card">
                    <div class="state-msg">
                        <div class="spinner"></div>
                        <span>Загрузка данных sing-box…</span>
                    </div>
                </div>
            `;let t=this._model,e=this._stateValue(t.version),i=this._stateValue(t.clashMode);return _`
            <div class="card">
                <div class="header">
                    <h2>${this._config.title}</h2>
                    <div class="meta">
                        ${e?_`<span>${e}</span>`:""}
                        ${i?_`<span> · ${i}</span>`:""}
                    </div>
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

                ${t.groups.map(s=>this._renderGroup(s))}
                ${t.standalone.length?this._renderStandalone(t.standalone):""}

                ${this._fallbackNote?_`<div class="fallback-note">${this._fallbackNote}</div>`:""}
                <div class="footer">sing-box panel · v${Ot}</div>
            </div>
        `}_renderStandalone(t){return _`
            <div class="group">
                <div class="group-head">
                    <span class="group-name">Outbound</span>
                </div>
                <div class="nodes">
                    ${t.map(e=>this._renderStandaloneNode(e))}
                </div>
            </div>
        `}_renderStandaloneNode(t){let e=this._ping(t),i=!!this._testing[t.tag];return _`
            <div class="node">
                <span class="node-name standalone">${t.tag}</span>
                ${e!==null?_`<span class="ping ${this._pingClass(e)}">${this._pingText(e)}</span>`:""}
                <button
                    class="node-ping"
                    title="Проверить пинг ${t.tag}"
                    ?disabled=${i}
                    @click=${()=>this._pingNode(t.tag,t.pingEntity)}
                >
                    <ha-icon icon="mdi:radar"></ha-icon>
                </button>
            </div>
        `}_speedTile(t,e,i,s){let{value:n,unit:o}=this._formatSpeed(s);return _`
            <div class="tile ${t}">
                <ha-icon icon=${e}></ha-icon>
                <div class="tile-body">
                    <div class="tile-label">${i}</div>
                    <div class="tile-value">${n}<span class="unit">${o}</span></div>
                </div>
            </div>
        `}_totalChip(t,e){return _`
            <span class="chip-stat">
                <ha-icon icon=${t}></ha-icon>
                <b>${e}</b>
            </span>
        `}_renderGroup(t){let e=this._entity(t.entityId),i=e&&e.state!=="unavailable"?e.state:null,s=!!this._testing[t.tag];return _`
            <div class="group">
                <div class="group-head">
                    <span class="group-name">${t.tag}</span>
                    <span class="group-current">
                        ${i?_`→ <b>${i}</b>`:""}
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
        `}_renderNode(t,e,i){let s=this._ping(e),n=e.tag===i,o=!!this._testing[e.tag];return _`
            <div class="node ${n?"active":""}">
                <button
                    class="node-select"
                    title="Выбрать ${e.tag}"
                    @click=${()=>this._selectNode(t.tag,e.tag,t.entityId)}
                >
                    <span class="node-name">${e.tag}</span>
                    ${s!==null?_`<span class="ping ${this._pingClass(s)}">${this._pingText(s)}</span>`:""}
                </button>
                <button
                    class="node-ping"
                    title="Проверить пинг ${e.tag}"
                    ?disabled=${o}
                    @click=${()=>this._pingNode(e.tag,e.pingEntity||t.entityId)}
                >
                    <ha-icon icon="mdi:radar"></ha-icon>
                </button>
            </div>
        `}};customElements.define("singbox-panel-card",tt);window.customCards=window.customCards||[];window.customCards.push({type:"singbox-panel-card",name:"Sing-box Panel",description:"\u041F\u0430\u043D\u0435\u043B\u044C \u043C\u043E\u043D\u0438\u0442\u043E\u0440\u0438\u043D\u0433\u0430 \u0438 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u043F\u0440\u043E\u043A\u0441\u0438 sing-box",preview:!1});
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
