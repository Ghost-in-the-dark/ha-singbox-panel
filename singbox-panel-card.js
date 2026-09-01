var M=globalThis,O=M.ShadowRoot&&(M.ShadyCSS===void 0||M.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,z=Symbol(),tt=new WeakMap,S=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==z)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(O&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=tt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&tt.set(e,t))}return t}toString(){return this.cssText}},et=n=>new S(typeof n=="string"?n:n+"",void 0,z),B=(n,...t)=>{let e=n.length===1?n[0]:t.reduce((s,i,o)=>s+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[o+1],n[0]);return new S(e,n,z)},st=(n,t)=>{if(O)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=M.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,n.appendChild(s)}},L=O?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return et(e)})(n):n;var{is:bt,defineProperty:xt,getOwnPropertyDescriptor:At,getOwnPropertyNames:wt,getOwnPropertySymbols:St,getPrototypeOf:Et}=Object,H=globalThis,it=H.trustedTypes,Ct=it?it.emptyScript:"",kt=H.reactiveElementPolyfillSupport,E=(n,t)=>n,I={toAttribute(n,t){switch(t){case Boolean:n=n?Ct:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},ot=(n,t)=>!bt(n,t),nt={attribute:!0,type:String,converter:I,reflect:!1,useDefault:!1,hasChanged:ot};Symbol.metadata??=Symbol("metadata"),H.litPropertyMetadata??=new WeakMap;var g=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=nt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&xt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:o}=At(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:i,set(r){let l=i?.call(this);o?.call(this,r),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??nt}static _$Ei(){if(this.hasOwnProperty(E("elementProperties")))return;let t=Et(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(E("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(E("properties"))){let e=this.properties,s=[...wt(e),...St(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(L(i))}else t!==void 0&&e.push(L(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return st(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:I).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let o=s.getPropertyOptions(i),r=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:I;this._$Em=i;let l=r.fromAttribute(e,o.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(t!==void 0){let r=this.constructor;if(i===!1&&(o=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??ot)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),o!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,o]of s){let{wrapped:r}=o,l=this[i];r!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,o,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};g.elementStyles=[],g.shadowRootOptions={mode:"open"},g[E("elementProperties")]=new Map,g[E("finalized")]=new Map,kt?.({ReactiveElement:g}),(H.reactiveElementVersions??=[]).push("2.1.2");var G=globalThis,rt=n=>n,R=G.trustedTypes,at=R?R.createPolicy("lit-html",{createHTML:n=>n}):void 0,ut="$lit$",m=`lit$${Math.random().toFixed(9).slice(2)}$`,_t="?"+m,Pt=`<${_t}>`,b=document,k=()=>b.createComment(""),P=n=>n===null||typeof n!="object"&&typeof n!="function",K=Array.isArray,Nt=n=>K(n)||typeof n?.[Symbol.iterator]=="function",D=`[ 	
\f\r]`,C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,lt=/-->/g,ct=/>/g,v=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),dt=/'/g,ht=/"/g,gt=/^(?:script|style|textarea|title)$/i,J=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),u=J(1),Lt=J(2),It=J(3),x=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),pt=new WeakMap,y=b.createTreeWalker(b,129);function ft(n,t){if(!K(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return at!==void 0?at.createHTML(t):t}var Ut=(n,t)=>{let e=n.length-1,s=[],i,o=t===2?"<svg>":t===3?"<math>":"",r=C;for(let l=0;l<e;l++){let a=n[l],d,c,h=-1,_=0;for(;_<a.length&&(r.lastIndex=_,c=r.exec(a),c!==null);)_=r.lastIndex,r===C?c[1]==="!--"?r=lt:c[1]!==void 0?r=ct:c[2]!==void 0?(gt.test(c[2])&&(i=RegExp("</"+c[2],"g")),r=v):c[3]!==void 0&&(r=v):r===v?c[0]===">"?(r=i??C,h=-1):c[1]===void 0?h=-2:(h=r.lastIndex-c[2].length,d=c[1],r=c[3]===void 0?v:c[3]==='"'?ht:dt):r===ht||r===dt?r=v:r===lt||r===ct?r=C:(r=v,i=void 0);let f=r===v&&n[l+1].startsWith("/>")?" ":"";o+=r===C?a+Pt:h>=0?(s.push(d),a.slice(0,h)+ut+a.slice(h)+m+f):a+m+(h===-2?l:f)}return[ft(n,o+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},N=class n{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,r=0,l=t.length-1,a=this.parts,[d,c]=Ut(t,e);if(this.el=n.createElement(d,s),y.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=y.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(ut)){let _=c[r++],f=i.getAttribute(h).split(m),T=/([.?@])?(.*)/.exec(_);a.push({type:1,index:o,name:T[2],strings:f,ctor:T[1]==="."?j:T[1]==="?"?V:T[1]==="@"?W:w}),i.removeAttribute(h)}else h.startsWith(m)&&(a.push({type:6,index:o}),i.removeAttribute(h));if(gt.test(i.tagName)){let h=i.textContent.split(m),_=h.length-1;if(_>0){i.textContent=R?R.emptyScript:"";for(let f=0;f<_;f++)i.append(h[f],k()),y.nextNode(),a.push({type:2,index:++o});i.append(h[_],k())}}}else if(i.nodeType===8)if(i.data===_t)a.push({type:2,index:o});else{let h=-1;for(;(h=i.data.indexOf(m,h+1))!==-1;)a.push({type:7,index:o}),h+=m.length-1}o++}}static createElement(t,e){let s=b.createElement("template");return s.innerHTML=t,s}};function A(n,t,e=n,s){if(t===x)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,o=P(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(n),i._$AT(n,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=A(n,i._$AS(n,t.values),i,s)),t}var q=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??b).importNode(e,!0);y.currentNode=i;let o=y.nextNode(),r=0,l=0,a=s[0];for(;a!==void 0;){if(r===a.index){let d;a.type===2?d=new U(o,o.nextSibling,this,t):a.type===1?d=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(d=new F(o,this,t)),this._$AV.push(d),a=s[++l]}r!==a?.index&&(o=y.nextNode(),r++)}return y.currentNode=b,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},U=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=A(this,t,e),P(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==x&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Nt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(b.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=N.createElement(ft(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let o=new q(i,this),r=o.u(this.options);o.p(e),this.T(r),this._$AH=o}}_$AC(t){let e=pt.get(t.strings);return e===void 0&&pt.set(t.strings,e=new N(t)),e}k(t){K(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let o of t)i===e.length?e.push(s=new n(this.O(k()),this.O(k()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=rt(t).nextSibling;rt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},w=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(t,e=this,s,i){let o=this.strings,r=!1;if(o===void 0)t=A(this,t,e,0),r=!P(t)||t!==this._$AH&&t!==x,r&&(this._$AH=t);else{let l=t,a,d;for(t=o[0],a=0;a<o.length-1;a++)d=A(this,l[s+a],e,a),d===x&&(d=this._$AH[a]),r||=!P(d)||d!==this._$AH[a],d===p?t=p:t!==p&&(t+=(d??"")+o[a+1]),this._$AH[a]=d}r&&!i&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},j=class extends w{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},V=class extends w{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},W=class extends w{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=A(this,t,e,0)??p)===x)return;let s=this._$AH,i=t===p&&s!==p||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==p&&(s===p||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},F=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){A(this,t)}};var Tt=G.litHtmlPolyfillSupport;Tt?.(N,U),(G.litHtmlVersions??=[]).push("3.3.3");var mt=(n,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let o=e?.renderBefore??null;s._$litPart$=i=new U(t.insertBefore(k(),o),o,void 0,e??{})}return i._$AI(n),i};var X=globalThis,$=class extends g{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=mt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return x}};$._$litElement$=!0,$.finalized=!0,X.litElementHydrateSupport?.({LitElement:$});var Mt=X.litElementPolyfillSupport;Mt?.({LitElement:$});(X.litElementVersions??=[]).push("4.2.2");var $t=B`
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
`;var Ot="0.1.1",Z="_group_",Q="_ping_",vt="_clash_mode",yt="Sing-box",Y=class extends ${static properties={_state:{state:!0},_message:{state:!0},_model:{state:!0},_testing:{state:!0}};static styles=$t;constructor(){super(),this._hass=null,this._config={},this._discovered=!1,this._state="loading",this._message="",this._model=null,this._testing={}}static getStubConfig(){return{title:yt}}setConfig(t){if(!t||typeof t!="object")throw new Error("Invalid configuration");this._config={title:yt,...t}}getCardSize(){return 4}set hass(t){this._hass=t,t&&!this._discovered&&(this._discovered=!0,this._discover())}async _discover(){this._state="loading";try{let e=(await this._hass.callWS({type:"config_entries/get"})).filter(l=>l.domain==="singbox");if(e.length===0){this._state="error",this._message="\u0418\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u044F sing-box \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430. \u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0435 \u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u0442\u0435 ha-singbox.";return}let s=await this._hass.callWS({type:"config/entity_registry/list"}),i=e.map(l=>l.entry_id);if(this._config.entity){let l=s.find(a=>a.entity_id===this._config.entity);l&&l.config_entry_id&&(i=[l.config_entry_id])}let o=new Set(i),r=s.filter(l=>l.config_entry_id&&o.has(l.config_entry_id));if(this._model=this._buildModel(r),this._model.groups.length===0){let l=r.filter(c=>c.domain==="select"),a=r.filter(c=>c.domain==="sensor"),d=l.slice(0,5).map(c=>`${c.entity_id} [${c.unique_id}]`).join(", ");this._state="error",this._message=l.length===0?`\u0413\u0440\u0443\u043F\u043F\u044B \u043F\u0440\u043E\u043A\u0441\u0438 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B: \u0443 \u0437\u0430\u043F\u0438\u0441\u0438 sing-box \u043D\u0435\u0442 select-\u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0435\u0439 (sensor: ${a.length}). \u041F\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u044E \u0432 HACS \u0438 \u043F\u0435\u0440\u0435\u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 HA.`:`\u0413\u0440\u0443\u043F\u043F\u044B \u043F\u0440\u043E\u043A\u0441\u0438 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B: ${l.length} select-\u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0435\u0439 \u0441 \u043D\u0435\u043E\u0436\u0438\u0434\u0430\u043D\u043D\u044B\u043C \u0444\u043E\u0440\u043C\u0430\u0442\u043E\u043C unique_id (${d}). \u041E\u0431\u043D\u043E\u0432\u0438\u0442\u0435 ha-singbox \u0438 \u043F\u0435\u0440\u0435\u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 HA.`;return}this._state="ready"}catch(t){this._state="error",this._message=`\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435: ${t&&t.message?t.message:t}`}}_buildModel(t){let e={};for(let a of t)if(a.domain==="sensor"&&a.unique_id&&a.unique_id.includes(Q)){let d=a.unique_id.slice(a.unique_id.lastIndexOf(Q)+Q.length);e[d]=a.entity_id}let s=[],i=new Set;for(let a of t){if(a.domain!=="select"||!a.unique_id||!a.unique_id.includes(Z)||a.unique_id.endsWith(vt))continue;let d=a.unique_id.slice(a.unique_id.lastIndexOf(Z)+Z.length),c=this._hass.states[a.entity_id],h=c&&c.attributes&&Array.isArray(c.attributes.options)?c.attributes.options:[];h.forEach(_=>i.add(_)),s.push({tag:d,entityId:a.entity_id,options:h.map(_=>({tag:_,pingEntity:e[_]||null}))})}let o=Object.keys(e).filter(a=>!i.has(a)).sort().map(a=>({tag:a,pingEntity:e[a]})),r=a=>{let d=t.find(c=>c.domain==="sensor"&&c.unique_id&&c.unique_id.endsWith(a));return d?d.entity_id:null},l=t.find(a=>a.domain==="select"&&a.unique_id&&a.unique_id.endsWith(vt));return{version:r("_version"),uplink:r("_uplink"),downlink:r("_downlink"),uplinkTotal:r("_uplink_total"),downlinkTotal:r("_downlink_total"),memory:r("_memory"),connectionsIn:r("_connections_in"),clashMode:l?l.entity_id:null,groups:s,standalone:o}}_entity(t){return t?this._hass.states[t]:void 0}_stateValue(t){let e=this._entity(t);return e?e.state==="unavailable"?null:e.state:null}_formatSpeed(t){let e=this._entity(t);if(!e||e.state==="unavailable"||e.state==="unknown")return{value:"\u2014",unit:""};let s=Number(e.state);return Number.isFinite(s)?{value:s.toLocaleString(void 0,{maximumFractionDigits:1}),unit:e.attributes&&e.attributes.unit_of_measurement?e.attributes.unit_of_measurement:""}:{value:"\u2014",unit:""}}_formatBytes(t){let e=this._entity(t);if(!e||e.state==="unavailable"||e.state==="unknown")return"\u2014";let s=Number(e.state);if(!Number.isFinite(s))return"\u2014";let i=["B","KiB","MiB","GiB","TiB"],o=s,r=0;for(;o>=1024&&r<i.length-1;)o/=1024,r+=1;let l=r?1:0;return`${o.toLocaleString(void 0,{maximumFractionDigits:l})} ${i[r]}`}_ping(t){let e=this._entity(t.pingEntity);if(!e||e.state==="unavailable"||e.state==="unknown")return null;let s=Number(e.state);return Number.isFinite(s)?s:null}_pingClass(t){return t===null?"none":t<=100?"good":t<=300?"warn":"bad"}_pingText(t){return t===null?"\u2014":`${t} ms`}async _selectNode(t,e){if(this._hass)try{await this._hass.callService("singbox","select_outbound",{group_tag:t,outbound_tag:e})}catch(s){console.error("singbox-panel: select_outbound failed",s)}}async _testGroup(t){if(!(!this._hass||this._testing[t])){this._testing={...this._testing,[t]:!0};try{await this._hass.callService("singbox","url_test",{outbound_tag:t})}catch(e){console.error("singbox-panel: url_test failed",e)}finally{setTimeout(()=>{this._testing={...this._testing,[t]:!1}},4e3)}}}async _pingNode(t){if(!(!this._hass||this._testing[t])){this._testing={...this._testing,[t]:!0};try{await this._hass.callService("singbox","url_test",{outbound_tag:t})}catch(e){console.error("singbox-panel: url_test failed",e)}finally{setTimeout(()=>{this._testing={...this._testing,[t]:!1}},4e3)}}}render(){if(this._state==="error")return u`
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
            `;let t=this._model,e=this._stateValue(t.version),s=this._stateValue(t.clashMode);return u`
            <div class="card">
                <div class="header">
                    <h2>${this._config.title}</h2>
                    <div class="meta">
                        ${e?u`<span>${e}</span>`:""}
                        ${s?u`<span> · ${s}</span>`:""}
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

                ${t.groups.map(i=>this._renderGroup(i))}
                ${t.standalone.length?this._renderStandalone(t.standalone):""}

                <div class="footer">sing-box panel · v${Ot}</div>
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
        `}_renderStandaloneNode(t){let e=this._ping(t),s=!!this._testing[t.tag];return u`
            <div class="node">
                <span class="node-name standalone">${t.tag}</span>
                ${e!==null?u`<span class="ping ${this._pingClass(e)}">${this._pingText(e)}</span>`:""}
                <button
                    class="node-ping"
                    title="Проверить пинг ${t.tag}"
                    ?disabled=${s}
                    @click=${()=>this._pingNode(t.tag)}
                >
                    <ha-icon icon="mdi:radar"></ha-icon>
                </button>
            </div>
        `}_speedTile(t,e,s,i){let{value:o,unit:r}=this._formatSpeed(i);return u`
            <div class="tile ${t}">
                <ha-icon icon=${e}></ha-icon>
                <div class="tile-body">
                    <div class="tile-label">${s}</div>
                    <div class="tile-value">${o}<span class="unit">${r}</span></div>
                </div>
            </div>
        `}_totalChip(t,e){return u`
            <span class="chip-stat">
                <ha-icon icon=${t}></ha-icon>
                <b>${e}</b>
            </span>
        `}_renderGroup(t){let e=this._entity(t.entityId),s=e&&e.state!=="unavailable"?e.state:null,i=!!this._testing[t.tag];return u`
            <div class="group">
                <div class="group-head">
                    <span class="group-name">${t.tag}</span>
                    <span class="group-current">
                        ${s?u`→ <b>${s}</b>`:""}
                    </span>
                    <button
                        class="test-btn"
                        ?disabled=${i}
                        @click=${()=>this._testGroup(t.tag)}
                    >
                        <ha-icon icon="mdi:flash-outline"></ha-icon>
                        ${i?"\u0422\u0435\u0441\u0442\u2026":"\u0422\u0435\u0441\u0442"}
                    </button>
                </div>
                <div class="nodes">
                    ${t.options.map(o=>this._renderNode(t,o,s))}
                </div>
            </div>
        `}_renderNode(t,e,s){let i=this._ping(e),o=e.tag===s,r=!!this._testing[e.tag];return u`
            <div class="node ${o?"active":""}">
                <button
                    class="node-select"
                    title="Выбрать ${e.tag}"
                    @click=${()=>this._selectNode(t.tag,e.tag)}
                >
                    <span class="node-name">${e.tag}</span>
                    ${i!==null?u`<span class="ping ${this._pingClass(i)}">${this._pingText(i)}</span>`:""}
                </button>
                <button
                    class="node-ping"
                    title="Проверить пинг ${e.tag}"
                    ?disabled=${r}
                    @click=${()=>this._pingNode(e.tag)}
                >
                    <ha-icon icon="mdi:radar"></ha-icon>
                </button>
            </div>
        `}};customElements.define("singbox-panel-card",Y);window.customCards=window.customCards||[];window.customCards.push({type:"singbox-panel-card",name:"Sing-box Panel",description:"\u041F\u0430\u043D\u0435\u043B\u044C \u043C\u043E\u043D\u0438\u0442\u043E\u0440\u0438\u043D\u0433\u0430 \u0438 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u043F\u0440\u043E\u043A\u0441\u0438 sing-box",preview:!1});
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
