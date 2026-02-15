function t(t,e,i,s){var o,a=arguments.length,n=a<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,s);else for(var r=t.length-1;r>=0;r--)(o=t[r])&&(n=(a<3?o(n):a>3?o(e,i,n):o(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let a=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new a(i,t,s)},r=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,g=globalThis,$=g.trustedTypes,f=$?$.emptyScript:"",m=g.reactiveElementPolyfillSupport,v=(t,e)=>t,_={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!l(t,e),b={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const a=s?.call(this);o?.call(this,e),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...h(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:_).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._$Em=s;const a=o.fromAttribute(e,t.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const a=this.constructor;if(!1===s&&(o=this[t]),i??=a.getPropertyOptions(t),!((i.hasChanged??y)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},a){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),!0!==o||void 0!==a)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[v("elementProperties")]=new Map,x[v("finalized")]=new Map,m?.({ReactiveElement:x}),(g.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,k=t=>t,C=w.trustedTypes,S=C?C.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+E,z=`<${M}>`,F=document,H=()=>F.createComment(""),P=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,D="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,W=/>/g,O=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),U=/'/g,j=/"/g,I=/^(?:script|style|textarea|title)$/i,L=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),B=L(1),V=L(2),X=Symbol.for("lit-noChange"),Y=Symbol.for("lit-nothing"),q=new WeakMap,G=F.createTreeWalker(F,129);function Z(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,s=[];let o,a=2===e?"<svg>":3===e?"<math>":"",n=T;for(let e=0;e<i;e++){const i=t[e];let r,l,c=-1,d=0;for(;d<i.length&&(n.lastIndex=d,l=n.exec(i),null!==l);)d=n.lastIndex,n===T?"!--"===l[1]?n=R:void 0!==l[1]?n=W:void 0!==l[2]?(I.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=O):void 0!==l[3]&&(n=O):n===O?">"===l[0]?(n=o??T,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,r=l[1],n=void 0===l[3]?O:'"'===l[3]?j:U):n===j||n===U?n=O:n===R||n===W?n=T:(n=O,o=void 0);const h=n===O&&t[e+1].startsWith("/>")?" ":"";a+=n===T?i+z:c>=0?(s.push(r),i.slice(0,c)+A+i.slice(c)+E+h):i+E+(-2===c?e:h)}return[Z(t,a+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class K{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,a=0;const n=t.length-1,r=this.parts,[l,c]=J(t,e);if(this.el=K.createElement(l,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=G.nextNode())&&r.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(A)){const e=c[a++],i=s.getAttribute(t).split(E),n=/([.?@])?(.*)/.exec(e);r.push({type:1,index:o,name:n[2],strings:i,ctor:"."===n[1]?st:"?"===n[1]?ot:"@"===n[1]?at:it}),s.removeAttribute(t)}else t.startsWith(E)&&(r.push({type:6,index:o}),s.removeAttribute(t));if(I.test(s.tagName)){const t=s.textContent.split(E),e=t.length-1;if(e>0){s.textContent=C?C.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],H()),G.nextNode(),r.push({type:2,index:++o});s.append(t[e],H())}}}else if(8===s.nodeType)if(s.data===M)r.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(E,t+1));)r.push({type:7,index:o}),t+=E.length-1}o++}}static createElement(t,e){const i=F.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,s){if(e===X)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const a=P(e)?void 0:e._$litDirective$;return o?.constructor!==a&&(o?._$AO?.(!1),void 0===a?o=void 0:(o=new a(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=Q(t,o._$AS(t,e.values),o,s)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??F).importNode(e,!0);G.currentNode=s;let o=G.nextNode(),a=0,n=0,r=i[0];for(;void 0!==r;){if(a===r.index){let e;2===r.type?e=new et(o,o.nextSibling,this,t):1===r.type?e=new r.ctor(o,r.name,r.strings,this,t):6===r.type&&(e=new nt(o,this,t)),this._$AV.push(e),r=i[++n]}a!==r?.index&&(o=G.nextNode(),a++)}return G.currentNode=F,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=Y,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),P(t)?t===Y||null==t||""===t?(this._$AH!==Y&&this._$AR(),this._$AH=Y):t!==this._$AH&&t!==X&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==Y&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(F.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new tt(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new K(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new et(this.O(H()),this.O(H()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=Y,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Y}_$AI(t,e=this,i,s){const o=this.strings;let a=!1;if(void 0===o)t=Q(this,t,e,0),a=!P(t)||t!==this._$AH&&t!==X,a&&(this._$AH=t);else{const s=t;let n,r;for(t=o[0],n=0;n<o.length-1;n++)r=Q(this,s[i+n],e,n),r===X&&(r=this._$AH[n]),a||=!P(r)||r!==this._$AH[n],r===Y?t=Y:t!==Y&&(t+=(r??"")+o[n+1]),this._$AH[n]=r}a&&!s&&this.j(t)}j(t){t===Y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Y?void 0:t}}class ot extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Y)}}class at extends it{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??Y)===X)return;const i=this._$AH,s=t===Y&&i!==Y||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==Y&&(i===Y||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(K,et),(w.litHtmlVersions??=[]).push("3.3.2");const lt=globalThis;class ct extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new et(e.insertBefore(H(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return X}}ct._$litElement$=!0,ct.finalized=!0,lt.litElementHydrateSupport?.({LitElement:ct});const dt=lt.litElementPolyfillSupport;dt?.({LitElement:ct}),(lt.litElementVersions??=[]).push("4.2.2");const ht={attribute:!0,type:String,converter:_,reflect:!1,hasChanged:y},ut=(t=ht,e,i)=>{const{kind:s,metadata:o}=i;let a=globalThis.litPropertyMetadata.get(o);if(void 0===a&&globalThis.litPropertyMetadata.set(o,a=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),a.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,o,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];e.call(this,i),this.requestUpdate(s,o,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function pt(t){return(e,i)=>"object"==typeof i?ut(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function gt(t){return pt({...t,state:!0,attribute:!1})}const $t="linear-gauge-card",ft="linear-gauge-card-editor",mt={interval:10,size:12,width:2,color:"var(--primary-text-color)",labels:!0,labelFontSize:11,labelColor:"var(--primary-text-color)",labelSuffix:"",labelPosition:"outside"},vt={count:4,size:6,width:1,color:"var(--secondary-text-color)"},_t={major:{...mt},minor:{...vt}},yt={style:"bar-fill",color:"var(--primary-color)",size:4,showValue:!0,valueFontSize:14,valuePosition:"right",valueColor:"var(--primary-text-color)"},bt={enabled:!1,hours:24,mode:"minmax",dotColor:"var(--accent-color)",dotSize:3,minColor:"#2196F3",maxColor:"#F44336"},xt={backgroundColor:"none",trackColor:"var(--divider-color, rgba(127,127,127,0.3))",segmentFill:"solid",roundedEnds:!0,endRadius:4,borderRadius:4,padding:16},wt={min:0,max:100,show_name:!0,condensed:!1,orientation:"horizontal",ticks:{..._t},dial:{...yt},history:{...bt},display:{...xt},segments:[],warnings:[]},kt=["#4CAF50","#8BC34A","#FFEB3B","#FF9800","#F44336","#2196F3","#9C27B0","#00BCD4","#795548","#607D8B"];function Ct(t){const e={...xt,...t};if(!1===e.roundedEnds)return 0;const i=e.endRadius??e.borderRadius;return Number.isFinite(i)?Math.max(0,i):0}function St(t,e){const i=Math.max(0,Math.min(1,(t-e.min)/(e.max-e.min)));return"horizontal"===e.orientation?e.trackX+i*e.trackWidth:e.trackY+e.trackHeight-i*e.trackHeight}let At=null;const Et=[{value:"bar-fill",label:"Bar Fill"},{value:"needle",label:"Needle"},{value:"line",label:"Line"},{value:"triangle",label:"Triangle"},{value:"dot",label:"Dot"}],Mt=[{value:"above",label:"Above"},{value:"below",label:"Below"},{value:"right",label:"Right"},{value:"left",label:"Left"},{value:"inside",label:"Inside"}],zt=[{value:"fill",label:"Fill"},{value:"hatch",label:"Hatch"},{value:"border",label:"Border"}],Ft=[{value:"minmax",label:"Min/Max Markers"},{value:"dots",label:"History Dots"},{value:"both",label:"Both"}],Ht=[{value:"solid",label:"Solid"},{value:"gradient",label:"Gradient Blend"}],Pt=["sensor","input_number","number","counter"];class Nt extends ct{constructor(){super(...arguments),this._expandedSections=new Set(["general"]),this._entityInputMode="textfield"}connectedCallback(){super.connectedCallback(),this._detectEntityInputMode()}async _detectEntityInputMode(){const t=this._resolveEntityInputMode();if("textfield"===t){try{const t=await(window.loadCardHelpers?.());if(t){const e=await t.createCardElement({type:"entities",entities:["sun.sun"]});e&&(e.hass=this.hass)}}catch(t){}await Promise.race([this._waitForEntityInputDefinition(),new Promise(t=>{setTimeout(t,1500)})]),this._entityInputMode=this._resolveEntityInputMode()}else this._entityInputMode=t}_resolveEntityInputMode(){return customElements.get("ha-selector")?"selector":customElements.get("ha-entity-picker")?"entity-picker":"textfield"}_waitForEntityInputDefinition(){return new Promise(t=>{let e=!1;const i=()=>{e||(e=!0,t())};customElements.whenDefined("ha-selector").then(i),customElements.whenDefined("ha-entity-picker").then(i)})}setConfig(t){this._config={...t}}_dispatchConfigChanged(){const t=new CustomEvent("config-changed",{detail:{config:{...this._config}},bubbles:!0,composed:!0});this.dispatchEvent(t)}_updateConfig(t,e){this._config[t]=e,this._config={...this._config},this._dispatchConfigChanged()}_updateNestedConfig(t,e,i){const s=this._config[t]??{};this._config[t]={...s,[e]:i},this._config={...this._config},this._dispatchConfigChanged()}_updateDeepConfig(t,e,i,s){const o=this._config[t]??{},a=o[e]??{};this._config[t]={...o,[e]:{...a,[i]:s}},this._config={...this._config},this._dispatchConfigChanged()}_toggleSection(t){const e=new Set(this._expandedSections);e.has(t)?e.delete(t):e.add(t),this._expandedSections=e}render(){return this._config&&this.hass?B`
      <div class="editor">
        ${this._renderSection("general","General",this._renderGeneral())}
        ${this._renderSection("segments","Colored Segments",this._renderSegments())}
        ${this._renderSection("ticks","Ticks & Labels",this._renderTicks())}
        ${this._renderSection("dial","Dial / Indicator",this._renderDial())}
        ${this._renderSection("warnings","Warning Ranges",this._renderWarnings())}
        ${this._renderSection("history","History Markers",this._renderHistorySection())}
        ${this._renderSection("appearance","Appearance",this._renderAppearance())}
      </div>
    `:Y}_renderSection(t,e,i){const s=this._expandedSections.has(t);return B`
      <div class="section">
        <div class="section-header" @click="${()=>this._toggleSection(t)}">
          <ha-icon icon="${s?"mdi:chevron-down":"mdi:chevron-right"}"></ha-icon>
          <span>${e}</span>
        </div>
        ${s?B`<div class="section-content">${i}</div>`:""}
      </div>
    `}_renderGeneral(){const t=!1!==this._config.show_name,e=!0===this._config.condensed,i="selector"===this._entityInputMode?B`
            <ha-selector
              .hass="${this.hass}"
              .label="${"Entity"}"
              .selector="${{entity:{domain:Pt}}}"
              .value="${this._config.entity??""}"
              .required="${!0}"
              @value-changed="${t=>this._updateConfig("entity",t.detail.value)}"
            ></ha-selector>
          `:"entity-picker"===this._entityInputMode?B`
              <ha-entity-picker
                .hass="${this.hass}"
                .value="${this._config.entity??""}"
                .label="${"Entity"}"
                .includeDomains="${Pt}"
                .required="${!0}"
                @value-changed="${t=>this._updateConfig("entity",t.detail.value)}"
                allow-custom-entity
              ></ha-entity-picker>
            `:B`
              <ha-textfield
                .label="${"Entity"}"
                .value="${this._config.entity??""}"
                @input="${t=>this._updateConfig("entity",t.target.value)}"
              ></ha-textfield>
            `;return B`
      <div class="field">
        ${i}
      </div>

      <div class="field">
        <ha-textfield
          .label="${"Name (leave blank for entity name)"}"
          .value="${!1===this._config.name?"":this._config.name??""}"
          .disabled="${!t}"
          @input="${t=>{const e=t.target.value;this._updateConfig("name",""===e?void 0:e)}}"
        ></ha-textfield>
      </div>

      <div class="row">
        <div class="field half">
          <ha-formfield .label="${"Show Name"}">
            <ha-switch
              .checked="${t}"
              @change="${t=>this._updateConfig("show_name",t.target.checked)}"
            ></ha-switch>
          </ha-formfield>
        </div>
        <div class="field half">
          <ha-formfield .label="${"Condensed Mode"}">
            <ha-switch
              .checked="${e}"
              @change="${t=>this._updateConfig("condensed",t.target.checked)}"
            ></ha-switch>
          </ha-formfield>
        </div>
      </div>

      <div class="row">
        <div class="field half">
          <ha-textfield
            .label="${"Min"}"
            .value="${String(this._config.min??0)}"
            type="number"
            @input="${t=>this._updateConfig("min",parseFloat(t.target.value)||0)}"
          ></ha-textfield>
        </div>
        <div class="field half">
          <ha-textfield
            .label="${"Max"}"
            .value="${String(this._config.max??100)}"
            type="number"
            @input="${t=>this._updateConfig("max",parseFloat(t.target.value)||100)}"
          ></ha-textfield>
        </div>
      </div>

      <div class="row">
        <div class="field half">
          <ha-textfield
            .label="${"Unit (override)"}"
            .value="${this._config.unit??""}"
            @input="${t=>{const e=t.target.value;this._updateConfig("unit",e||void 0)}}"
          ></ha-textfield>
        </div>
        <div class="field half">
          <label class="toggle-label">
            Orientation
            <ha-select
              .value="${this._config.orientation??"horizontal"}"
              @selected="${t=>this._updateConfig("orientation",t.target.value)}"
              @closed="${t=>t.stopPropagation()}"
            >
              <mwc-list-item value="horizontal">Horizontal</mwc-list-item>
              <mwc-list-item value="vertical">Vertical</mwc-list-item>
            </ha-select>
          </label>
        </div>
      </div>
    `}_renderSegments(){const t=this._config.segments??[],e=this._config.display?.segmentFill??"solid";return B`
      <div class="field">
        <ha-select
          .label="${"Segment Fill"}"
          .value="${e}"
          @selected="${t=>this._updateNestedConfig("display","segmentFill",t.target.value)}"
          @closed="${t=>t.stopPropagation()}"
        >
          ${Ht.map(t=>B`<mwc-list-item value="${t.value}">${t.label}</mwc-list-item>`)}
        </ha-select>
      </div>

      <div class="list-section">
        ${t.map((t,e)=>B`
            <div class="list-item">
              <div class="list-item-header">
                <span class="color-swatch" style="background:${t.color}"></span>
                <span class="list-item-title">Segment ${e+1}</span>
                <ha-icon-button
                  .path="${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}"
                  @click="${()=>this._removeSegment(e)}"
                ></ha-icon-button>
              </div>
              <div class="row">
                <ha-textfield
                  class="third"
                  .label="${"From"}"
                  .value="${String(t.from)}"
                  type="number"
                  @input="${t=>this._updateSegmentField(e,"from",parseFloat(t.target.value))}"
                ></ha-textfield>
                <ha-textfield
                  class="third"
                  .label="${"To"}"
                  .value="${String(t.to)}"
                  type="number"
                  @input="${t=>this._updateSegmentField(e,"to",parseFloat(t.target.value))}"
                ></ha-textfield>
                <div class="third color-field">
                  <label>Color</label>
                  <input
                    type="color"
                    .value="${t.color}"
                    @input="${t=>this._updateSegmentField(e,"color",t.target.value)}"
                  />
                </div>
              </div>
            </div>
          `)}
        <ha-button @click="${this._addSegment}">
          <ha-icon icon="mdi:plus" slot="icon"></ha-icon>
          Add Segment
        </ha-button>
      </div>
    `}_addSegment(){const t=[...this._config.segments??[]],e=t.length>0?t[t.length-1].to:this._config.min??0,i=this._config.max??100,s=i-e,o=Math.min(i,e+s/2),a=t.length%kt.length;t.push({from:e,to:o,color:kt[a]}),this._updateConfig("segments",t)}_removeSegment(t){const e=[...this._config.segments??[]];e.splice(t,1),this._updateConfig("segments",e)}_updateSegmentField(t,e,i){const s=[...this._config.segments??[]];s[t]={...s[t],[e]:i},this._updateConfig("segments",s)}_renderTicks(){const t={...mt,...this._config.ticks?.major},e={...vt,...this._config.ticks?.minor};return B`
      <h4>Major Ticks</h4>
      <div class="row">
        <ha-textfield
          class="third"
          .label="${"Interval"}"
          .value="${String(t.interval)}"
          type="number"
          @input="${t=>this._updateDeepConfig("ticks","major","interval",parseFloat(t.target.value)||10)}"
        ></ha-textfield>
        <ha-textfield
          class="third"
          .label="${"Size (px)"}"
          .value="${String(t.size)}"
          type="number"
          @input="${t=>this._updateDeepConfig("ticks","major","size",parseFloat(t.target.value)||12)}"
        ></ha-textfield>
        <ha-textfield
          class="third"
          .label="${"Width (px)"}"
          .value="${String(t.width)}"
          type="number"
          @input="${t=>this._updateDeepConfig("ticks","major","width",parseFloat(t.target.value)||2)}"
        ></ha-textfield>
      </div>
      <div class="row">
        <div class="field half">
          <ha-formfield .label="${"Show Labels"}">
            <ha-switch
              .checked="${t.labels}"
              @change="${t=>this._updateDeepConfig("ticks","major","labels",t.target.checked)}"
            ></ha-switch>
          </ha-formfield>
        </div>
        <ha-textfield
          class="half"
          .label="${"Label Font Size"}"
          .value="${String(t.labelFontSize)}"
          type="number"
          @input="${t=>this._updateDeepConfig("ticks","major","labelFontSize",parseFloat(t.target.value)||11)}"
        ></ha-textfield>
      </div>
      <div class="row">
        <ha-textfield
          class="half"
          .label="${"Label Suffix"}"
          .value="${t.labelSuffix??""}"
          @input="${t=>this._updateDeepConfig("ticks","major","labelSuffix",t.target.value)}"
        ></ha-textfield>
        <div class="half color-field">
          <label>Tick Color</label>
          <input
            type="color"
            .value="${t.color?.startsWith("var(")?"#666666":t.color??"#666666"}"
            @input="${t=>this._updateDeepConfig("ticks","major","color",t.target.value)}"
          />
        </div>
      </div>

      <h4>Minor Ticks</h4>
      <div class="row">
        <ha-textfield
          class="third"
          .label="${"Count (between majors)"}"
          .value="${String(e.count)}"
          type="number"
          @input="${t=>this._updateDeepConfig("ticks","minor","count",parseInt(t.target.value)||0)}"
        ></ha-textfield>
        <ha-textfield
          class="third"
          .label="${"Size (px)"}"
          .value="${String(e.size)}"
          type="number"
          @input="${t=>this._updateDeepConfig("ticks","minor","size",parseFloat(t.target.value)||6)}"
        ></ha-textfield>
        <div class="third color-field">
          <label>Color</label>
          <input
            type="color"
            .value="${e.color?.startsWith("var(")?"#999999":e.color??"#999999"}"
            @input="${t=>this._updateDeepConfig("ticks","minor","color",t.target.value)}"
          />
        </div>
      </div>
    `}_renderDial(){const t={...yt,...this._config.dial};return B`
      <div class="field">
        <ha-select
          .label="${"Dial Style"}"
          .value="${t.style}"
          @selected="${t=>this._updateNestedConfig("dial","style",t.target.value)}"
          @closed="${t=>t.stopPropagation()}"
        >
          ${Et.map(t=>B`<mwc-list-item value="${t.value}">${t.label}</mwc-list-item>`)}
        </ha-select>
      </div>

      <div class="row">
        <div class="half color-field">
          <label>Dial Color (or pick 'segment' to inherit)</label>
          <div class="color-row">
            <input
              type="color"
              .value="${t.color?.startsWith("var(")||"segment"===t.color?"#1976D2":t.color??"#1976D2"}"
              @input="${t=>this._updateNestedConfig("dial","color",t.target.value)}"
            />
            <ha-button
              class="${"segment"===t.color?"active":""}"
              @click="${()=>this._updateNestedConfig("dial","color","segment")}"
            >
              Segment
            </ha-button>
          </div>
        </div>
        <ha-textfield
          class="half"
          .label="${"Size / Thickness"}"
          .value="${String(t.size)}"
          type="number"
          @input="${t=>this._updateNestedConfig("dial","size",parseFloat(t.target.value)||4)}"
        ></ha-textfield>
      </div>

      <h4>Value Display</h4>
      <div class="row">
        <div class="field half">
          <ha-formfield .label="${"Show Value"}">
            <ha-switch
              .checked="${t.showValue}"
              @change="${t=>this._updateNestedConfig("dial","showValue",t.target.checked)}"
            ></ha-switch>
          </ha-formfield>
        </div>
        <ha-select
          class="half"
          .label="${"Value Position"}"
          .value="${t.valuePosition}"
          @selected="${t=>this._updateNestedConfig("dial","valuePosition",t.target.value)}"
          @closed="${t=>t.stopPropagation()}"
        >
          ${Mt.map(t=>B`<mwc-list-item value="${t.value}">${t.label}</mwc-list-item>`)}
        </ha-select>
      </div>

      <div class="row">
        <ha-textfield
          class="half"
          .label="${"Value Font Size"}"
          .value="${String(t.valueFontSize)}"
          type="number"
          @input="${t=>this._updateNestedConfig("dial","valueFontSize",parseFloat(t.target.value)||14)}"
        ></ha-textfield>
        <div class="half color-field">
          <label>Value Color</label>
          <input
            type="color"
            .value="${t.valueColor?.startsWith("var(")?"#333333":t.valueColor??"#333333"}"
            @input="${t=>this._updateNestedConfig("dial","valueColor",t.target.value)}"
          />
        </div>
      </div>
    `}_renderWarnings(){const t=this._config.warnings??[];return B`
      <div class="list-section">
        ${t.map((t,e)=>B`
            <div class="list-item">
              <div class="list-item-header">
                <span class="color-swatch" style="background:${t.color}"></span>
                <span class="list-item-title">Warning ${e+1}</span>
                <ha-icon-button
                  .path="${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}"
                  @click="${()=>this._removeWarning(e)}"
                ></ha-icon-button>
              </div>
              <div class="row">
                <ha-textfield
                  class="quarter"
                  .label="${"From"}"
                  .value="${String(t.from)}"
                  type="number"
                  @input="${t=>this._updateWarningField(e,"from",parseFloat(t.target.value))}"
                ></ha-textfield>
                <ha-textfield
                  class="quarter"
                  .label="${"To"}"
                  .value="${String(t.to)}"
                  type="number"
                  @input="${t=>this._updateWarningField(e,"to",parseFloat(t.target.value))}"
                ></ha-textfield>
                <div class="quarter color-field">
                  <label>Color</label>
                  <input
                    type="color"
                    .value="${t.color}"
                    @input="${t=>this._updateWarningField(e,"color",t.target.value)}"
                  />
                </div>
                <ha-select
                  class="quarter"
                  .label="${"Style"}"
                  .value="${t.style??"fill"}"
                  @selected="${t=>this._updateWarningField(e,"style",t.target.value)}"
                  @closed="${t=>t.stopPropagation()}"
                >
                  ${zt.map(t=>B`<mwc-list-item value="${t.value}">${t.label}</mwc-list-item>`)}
                </ha-select>
              </div>
            </div>
          `)}
        <ha-button @click="${this._addWarning}">
          <ha-icon icon="mdi:plus" slot="icon"></ha-icon>
          Add Warning Range
        </ha-button>
      </div>
    `}_addWarning(){const t=[...this._config.warnings??[]],e=this._config.max??100;t.push({from:.8*e,to:e,color:"#F44336",style:"fill"}),this._updateConfig("warnings",t)}_removeWarning(t){const e=[...this._config.warnings??[]];e.splice(t,1),this._updateConfig("warnings",e)}_updateWarningField(t,e,i){const s=[...this._config.warnings??[]];s[t]={...s[t],[e]:i},this._updateConfig("warnings",s)}_renderHistorySection(){const t={...bt,...this._config.history};return B`
      <div class="row">
        <div class="field half">
          <ha-formfield .label="${"Enable History"}">
            <ha-switch
              .checked="${t.enabled}"
              @change="${t=>this._updateNestedConfig("history","enabled",t.target.checked)}"
            ></ha-switch>
          </ha-formfield>
        </div>
        <ha-textfield
          class="half"
          .label="${"Lookback Hours"}"
          .value="${String(t.hours)}"
          type="number"
          @input="${t=>this._updateNestedConfig("history","hours",parseFloat(t.target.value)||24)}"
        ></ha-textfield>
      </div>

      ${t.enabled?B`
            <div class="field">
              <ha-select
                .label="${"History Mode"}"
                .value="${t.mode}"
                @selected="${t=>this._updateNestedConfig("history","mode",t.target.value)}"
                @closed="${t=>t.stopPropagation()}"
              >
                ${Ft.map(t=>B`<mwc-list-item value="${t.value}">${t.label}</mwc-list-item>`)}
              </ha-select>
            </div>

            ${"minmax"===t.mode||"both"===t.mode?B`
                  <div class="row">
                    <div class="half color-field">
                      <label>Min Marker Color</label>
                      <input
                        type="color"
                        .value="${t.minColor??"#2196F3"}"
                        @input="${t=>this._updateNestedConfig("history","minColor",t.target.value)}"
                      />
                    </div>
                    <div class="half color-field">
                      <label>Max Marker Color</label>
                      <input
                        type="color"
                        .value="${t.maxColor??"#F44336"}"
                        @input="${t=>this._updateNestedConfig("history","maxColor",t.target.value)}"
                      />
                    </div>
                  </div>
                `:""}

            ${"dots"===t.mode||"both"===t.mode?B`
                  <div class="row">
                    <div class="half color-field">
                      <label>Dot Color</label>
                      <input
                        type="color"
                        .value="${t.dotColor?.startsWith("var(")?"#FF9800":t.dotColor??"#FF9800"}"
                        @input="${t=>this._updateNestedConfig("history","dotColor",t.target.value)}"
                      />
                    </div>
                    <ha-textfield
                      class="half"
                      .label="${"Dot Size"}"
                      .value="${String(t.dotSize)}"
                      type="number"
                      @input="${t=>this._updateNestedConfig("history","dotSize",parseFloat(t.target.value)||3)}"
                    ></ha-textfield>
                  </div>
                `:""}
          `:""}
    `}_getDisplayEndRadius(){const t={...xt,...this._config.display},e=t.endRadius??t.borderRadius??0;return Number.isFinite(e)?Math.max(0,e):0}_setDisplayRoundedEnds(t){const e={...this._config.display??{}};e.roundedEnds=t,this._updateConfig("display",e)}_setDisplayEndRadius(t){const e=parseFloat(t);if(!Number.isFinite(e))return;const i=Math.max(0,e),s={...this._config.display??{}};s.endRadius=i,s.borderRadius=i,this._updateConfig("display",s)}_renderAppearance(){const t={...xt,...this._config.display},e=!1!==t.roundedEnds,i=this._getDisplayEndRadius();return B`
      <div class="row">
        <div class="half color-field">
          <label>Track Color</label>
          <input
            type="color"
            .value="${t.trackColor?.startsWith("var(")?"#CCCCCC":t.trackColor??"#CCCCCC"}"
            @input="${t=>this._updateNestedConfig("display","trackColor",t.target.value)}"
          />
        </div>
        <div class="field half">
          <ha-formfield .label="${"Rounded Ends"}">
            <ha-switch
              .checked="${e}"
              @change="${t=>this._setDisplayRoundedEnds(t.target.checked)}"
            ></ha-switch>
          </ha-formfield>
        </div>
      </div>

      <div class="row">
        <ha-textfield
          class="half"
          .label="${"End Radius (px)"}"
          .value="${String(i)}"
          .disabled="${!e}"
          type="number"
          @input="${t=>this._setDisplayEndRadius(t.target.value)}"
        ></ha-textfield>
        <ha-textfield
          class="half"
          .label="${"Padding"}"
          .value="${String(t.padding)}"
          type="number"
          @input="${t=>this._updateNestedConfig("display","padding",parseFloat(t.target.value)||16)}"
        ></ha-textfield>
      </div>

      <div class="row">
        <div class="half color-field">
          <label>Background</label>
          <input
            type="color"
            .value="${t.backgroundColor?.startsWith("var(")||"none"===t.backgroundColor?"#000000":t.backgroundColor??"#000000"}"
            @input="${t=>this._updateNestedConfig("display","backgroundColor",t.target.value)}"
          />
        </div>
        <div class="half"></div>
      </div>
    `}static get styles(){return n`
      :host {
        display: block;
      }

      .editor {
        padding: 0;
      }

      .section {
        border-bottom: 1px solid var(--divider-color);
      }

      .section-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        cursor: pointer;
        font-weight: 500;
        user-select: none;
        color: var(--primary-text-color);
      }

      .section-header:hover {
        background: var(--secondary-background-color, rgba(127, 127, 127, 0.1));
      }

      .section-content {
        padding: 0 16px 16px;
      }

      .field {
        margin-bottom: 12px;
      }

      .row {
        display: flex;
        gap: 12px;
        margin-bottom: 12px;
        align-items: flex-end;
      }

      .half {
        flex: 1;
        min-width: 0;
      }

      .third {
        flex: 1;
        min-width: 0;
      }

      .quarter {
        flex: 1;
        min-width: 0;
      }

      ha-textfield,
      ha-select,
      ha-entity-picker,
      ha-selector {
        width: 100%;
      }

      h4 {
        margin: 16px 0 8px;
        font-size: 13px;
        font-weight: 500;
        color: var(--secondary-text-color);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      h4:first-child {
        margin-top: 0;
      }

      .color-field {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .color-field label {
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .color-field input[type='color'] {
        width: 100%;
        height: 40px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        cursor: pointer;
        background: none;
        padding: 2px;
      }

      .color-row {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .color-row input[type='color'] {
        width: 48px;
        height: 36px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        cursor: pointer;
        background: none;
        padding: 2px;
        flex-shrink: 0;
      }

      .color-row ha-button.active {
        --mdc-theme-primary: var(--primary-color);
        font-weight: 600;
      }

      .toggle-label {
        font-size: 12px;
        color: var(--secondary-text-color);
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      /* List items (segments, warnings) */

      .list-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .list-item {
        background: var(--card-background-color, var(--ha-card-background));
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 8px 12px;
      }

      .list-item-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }

      .list-item-title {
        flex: 1;
        font-weight: 500;
        font-size: 13px;
      }

      .color-swatch {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 1px solid var(--divider-color);
        flex-shrink: 0;
      }
    `}}t([pt({attribute:!1})],Nt.prototype,"hass",void 0),t([gt()],Nt.prototype,"_config",void 0),t([gt()],Nt.prototype,"_expandedSections",void 0),t([gt()],Nt.prototype,"_entityInputMode",void 0),customElements.define(ft,Nt);var Dt=Object.freeze({__proto__:null,LinearGaugeCardEditor:Nt});console.info("%c LINEAR-GAUGE-CARD %c v1.0.0 ","color: white; background: #555; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;","color: white; background: #1976D2; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;"),window.customCards=window.customCards||[],window.customCards.push({type:$t,name:"Linear Gauge Card",description:"A customizable linear gauge with segments, ticks, dial, and history markers",preview:!0,documentationURL:"https://github.com/your-user/linear-gauge-ha"});class Tt extends ct{constructor(){super(...arguments),this._historyData=null}static async getConfigElement(){return await Promise.resolve().then(function(){return Dt}),document.createElement(ft)}static getStubConfig(t){return{entity:Object.keys(t.states).filter(e=>{if(!e.startsWith("sensor."))return!1;const i=parseFloat(t.states[e].state);return!isNaN(i)&&isFinite(i)})[0]??"sensor.temperature",min:0,max:100}}setConfig(t){if(!t.entity)throw new Error("Please define an entity");this._config={...wt,...t,dial:{...yt,...t.dial},display:{...xt,...t.display},history:{...bt,...t.history}}}getCardSize(){return"vertical"===this._config?.orientation?6:this._config?.condensed?1:this._config?.height?Math.ceil(this._config.height/50):2}getGridOptions(){return"vertical"===this._config?.orientation?{rows:6,columns:3,min_rows:3,min_columns:3}:this._config?.condensed?{rows:1,columns:6,min_rows:1,min_columns:3}:{rows:2,columns:6,min_rows:1,min_columns:3}}updated(t){if(super.updated(t),t.has("hass")&&this._config){({...bt,...this._config.history}).enabled&&this._scheduleHistoryFetch()}}_scheduleHistoryFetch(){this._historyFetchTimer||(this._historyFetchTimer=setTimeout(async()=>{if(this._historyFetchTimer=void 0,!this.hass||!this._config)return;const t={...bt,...this._config.history},e=await async function(t,e,i){if(At&&At.entityId===e&&At.hours===i&&Date.now()-At.timestamp<3e5)return At.data;try{const s=new Date,o=`history/period/${new Date(s.getTime()-60*i*60*1e3).toISOString()}?filter_entity_id=${e}&end_time=${s.toISOString()}&minimal_response&no_attributes`,a=await t.callApi("GET",o);if(!a||0===a.length||0===a[0].length)return null;const n=a[0],r=[];let l=1/0,c=-1/0;for(const t of n){const e=parseFloat(t.state);!isNaN(e)&&isFinite(e)&&(r.push({time:new Date(t.last_changed).getTime(),value:e}),e<l&&(l=e),e>c&&(c=e))}if(0===r.length)return null;const d={min:l,max:c,values:r};return At={entityId:e,hours:i,timestamp:Date.now(),data:d},d}catch(t){return console.warn("Linear Gauge Card: Failed to fetch history",t),null}}(this.hass,this._config.entity,t.hours);e&&(this._historyData=e)},100))}disconnectedCallback(){super.disconnectedCallback(),this._historyFetchTimer&&clearTimeout(this._historyFetchTimer)}render(){if(!this._config||!this.hass)return Y;const t=this._config.entity,e=this.hass.states[t];if(!e)return B`
        <ha-card>
          <div class="warning">Entity not found: ${t}</div>
        </ha-card>
      `;const i=parseFloat(e.state),s=isNaN(i)?null:i,o=!1!==this._config.show_name&&!1!==this._config.name?this._config.name??e.attributes.friendly_name??t:null,a=this._config.unit??e.attributes.unit_of_measurement??"",n=function(t){const e=t.orientation??"horizontal",i=t.min??0,s=t.max??100,o={...mt,...t.ticks?.major},a=o.labels?o.labelFontSize+6:0,n=Math.max(o.size,t.ticks?.minor?{...vt,...t.ticks.minor}.size:0);if("horizontal"===e){const t=8,o=300,r=12,l=n+a+4;return{orientation:e,trackX:t,trackY:l,trackWidth:o-2*t,trackHeight:r,svgWidth:o,svgHeight:l+r+n+a+8,min:i,max:s}}{const t=8,o=300,r=12,l=12+a+n+4;return{orientation:e,trackX:l,trackY:t,trackWidth:r,trackHeight:o-2*t,svgWidth:l+r+n+a+16,svgHeight:o,min:i,max:s}}}(this._config),r={...yt,...this._config.dial},l=!0===this._config.condensed,c=null!==o||r.showValue&&"inside"!==r.valuePosition,d=["card-content","vertical"===this._config.orientation?"vertical":"horizontal",l?"condensed":"",null===o?"name-hidden":""].filter(Boolean).join(" "),h=null!==s?this._formatValue(s):e.state;return B`
      <ha-card @click="${this._handleAction}" @ha-click="${this._handleAction}">
        <div class="${d}">
          ${c?B`
                <div class="header-row">
                  ${null!==o?B`<div class="name">${o}</div>`:""}
                  ${r.showValue&&"inside"!==r.valuePosition?B`<div class="value-badge" style="font-size:${r.valueFontSize}px; color:${r.valueColor}">
                        ${h} ${a}
                      </div>`:""}
                </div>
              `:""}
          <div class="gauge-container">
            <svg
              viewBox="0 0 ${n.svgWidth} ${n.svgHeight}"
              preserveAspectRatio="${this._config.orientation,"xMidYMid meet"}"
              width="100%"
              class="gauge-svg"
            >
              ${function(t,e){const i={...xt,...e},s=Ct(i);return V`
    <rect
      x="${t.trackX}"
      y="${t.trackY}"
      width="${"horizontal"===t.orientation?t.trackWidth:t.trackHeight}"
      height="${"horizontal"===t.orientation?t.trackHeight:t.trackWidth}"
      rx="${s}"
      ry="${s}"
      fill="${i.trackColor}"
      class="gauge-track"
    />
  `}(n,this._config.display??{})}
              ${function(t,e,i){if(!t||0===t.length)return V``;const s={...xt,...i},o=Ct(s),a=`seg-clip-${Math.random().toString(36).slice(2,8)}`,n="gradient"===s.segmentFill,r=[],l=t.map((i,s)=>{const o=St(Math.max(i.from,e.min),e),a=St(Math.min(i.to,e.max),e),l=t[s+1]?.color??i.color;if("horizontal"===e.orientation){const t=Math.min(o,a),c=Math.abs(a-o);if(!n)return V`<rect x="${t}" y="${e.trackY}" width="${c}" height="${e.trackHeight}" fill="${i.color}" />`;const d=`seg-grad-h-${s}-${Math.random().toString(36).slice(2,8)}`;return r.push(V`
        <linearGradient id="${d}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${i.color}" />
          <stop offset="100%" stop-color="${l}" />
        </linearGradient>
      `),V`<rect x="${t}" y="${e.trackY}" width="${c}" height="${e.trackHeight}" fill="url(#${d})" />`}{const t=Math.min(o,a),c=Math.abs(a-o);if(!n)return V`<rect x="${e.trackX}" y="${t}" width="${e.trackWidth}" height="${c}" fill="${i.color}" />`;const d=`seg-grad-v-${s}-${Math.random().toString(36).slice(2,8)}`;return r.push(V`
        <linearGradient id="${d}" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="${i.color}" />
          <stop offset="100%" stop-color="${l}" />
        </linearGradient>
      `),V`<rect x="${e.trackX}" y="${t}" width="${e.trackWidth}" height="${c}" fill="url(#${d})" />`}});return V`
    <defs>
      ${r}
      <clipPath id="${a}">
        <rect
          x="${e.trackX}"
          y="${e.trackY}"
          width="${e.orientation,e.trackWidth}"
          height="${e.orientation,e.trackHeight}"
          rx="${o}"
          ry="${o}"
        />
      </clipPath>
    </defs>
    <g clip-path="url(#${a})">
      ${l}
    </g>
  `}(this._config.segments??[],n,this._config.display??{})}
              ${function(t,e,i){if(!t||0===t.length)return V``;const s=Ct({...xt,...i}),o=`warn-clip-${Math.random().toString(36).slice(2,8)}`,a=[],n=t.map((t,i)=>{const s=St(Math.max(t.from,e.min),e),o=St(Math.min(t.to,e.max),e),n=t.style??"fill",r=`hatch-${i}-${Math.random().toString(36).slice(2,8)}`;let l=t.color,c="none",d=0,h=.3;if("hatch"===n?(a.push(V`
        <pattern id="${r}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="${t.color}" stroke-width="2" />
        </pattern>
      `),l=`url(#${r})`,h=1):"border"===n&&(l="none",c=t.color,d=1.5,h=1),"horizontal"===e.orientation){const t=Math.min(s,o),i=Math.abs(o-s);return V`<rect x="${t}" y="${e.trackY}" width="${i}" height="${e.trackHeight}"
        fill="${l}" fill-opacity="${h}" stroke="${c}" stroke-width="${d}" />`}{const t=Math.min(s,o),i=Math.abs(o-s);return V`<rect x="${e.trackX}" y="${t}" width="${e.trackWidth}" height="${i}"
        fill="${l}" fill-opacity="${h}" stroke="${c}" stroke-width="${d}" />`}});return V`
    <defs>
      ${a}
      <clipPath id="${o}">
        <rect
          x="${e.trackX}" y="${e.trackY}"
          width="${e.orientation,e.trackWidth}"
          height="${e.orientation,e.trackHeight}"
          rx="${s}" ry="${s}"
        />
      </clipPath>
    </defs>
    <g clip-path="url(#${o})">
      ${n}
    </g>
  `}(this._config.warnings??[],n,this._config.display??{})}
              ${null!==s?function(t,e,i){const s={...yt,...e.dial},o=Ct({...xt,...e.display}),a=St(t,i);let n=s.color;"segment"===n&&e.segments&&e.segments.length>0&&(n=function(t,e,i){for(const i of e)if(t>=i.from&&t<=i.to)return i.color;return i}(t,e.segments,"var(--primary-color)"));const r=`dial-clip-${Math.random().toString(36).slice(2,8)}`;if("horizontal"===i.orientation)switch(s.style){case"bar-fill":{const t=a-i.trackX;return V`
          <defs>
            <clipPath id="${r}">
              <rect x="${i.trackX}" y="${i.trackY}" width="${i.trackWidth}" height="${i.trackHeight}"
                rx="${o}" ry="${o}" />
            </clipPath>
          </defs>
          <rect x="${i.trackX}" y="${i.trackY}" width="${Math.max(0,t)}" height="${i.trackHeight}"
            fill="${n}" clip-path="url(#${r})" class="gauge-dial-bar" />
        `}case"needle":{const t=s.size??3,e=i.trackY-4,o=i.trackY+i.trackHeight+4;return V`
          <line x1="${a}" y1="${e}" x2="${a}" y2="${o}"
            stroke="${n}" stroke-width="${t}" stroke-linecap="round" class="gauge-dial-needle" />
          <polygon points="${a-4},${e-2} ${a+4},${e-2} ${a},${e+3}"
            fill="${n}" />
        `}case"triangle":{const t=s.size??6,e=i.trackY+i.trackHeight+2;return V`
          <polygon points="${a-t},${e+1.5*t} ${a+t},${e+1.5*t} ${a},${e}"
            fill="${n}" class="gauge-dial-triangle" />
        `}case"dot":{const t=s.size??5,e=i.trackY+i.trackHeight/2;return V`
          <circle cx="${a}" cy="${e}" r="${t}" fill="${n}" class="gauge-dial-dot" />
        `}case"line":{const t=s.size??3;return V`
          <line x1="${a}" y1="${i.trackY}" x2="${a}" y2="${i.trackY+i.trackHeight}"
            stroke="${n}" stroke-width="${t}" stroke-linecap="round" class="gauge-dial-line" />
        `}default:return V``}else switch(s.style){case"bar-fill":{const t=i.trackY+i.trackHeight-a;return V`
          <defs>
            <clipPath id="${r}">
              <rect x="${i.trackX}" y="${i.trackY}" width="${i.trackWidth}" height="${i.trackHeight}"
                rx="${o}" ry="${o}" />
            </clipPath>
          </defs>
          <rect x="${i.trackX}" y="${a}" width="${i.trackWidth}" height="${Math.max(0,t)}"
            fill="${n}" clip-path="url(#${r})" class="gauge-dial-bar" />
        `}case"needle":{const t=s.size??3,e=i.trackX-4,o=i.trackX+i.trackWidth+4;return V`
          <line x1="${e}" y1="${a}" x2="${o}" y2="${a}"
            stroke="${n}" stroke-width="${t}" stroke-linecap="round" class="gauge-dial-needle" />
          <polygon points="${e-2},${a-4} ${e-2},${a+4} ${e+3},${a}"
            fill="${n}" />
        `}case"triangle":{const t=s.size??6,e=i.trackX+i.trackWidth+2;return V`
          <polygon points="${e+1.5*t},${a-t} ${e+1.5*t},${a+t} ${e},${a}"
            fill="${n}" class="gauge-dial-triangle" />
        `}case"dot":{const t=s.size??5,e=i.trackX+i.trackWidth/2;return V`
          <circle cx="${e}" cy="${a}" r="${t}" fill="${n}" class="gauge-dial-dot" />
        `}case"line":{const t=s.size??3;return V`
          <line x1="${i.trackX}" y1="${a}" x2="${i.trackX+i.trackWidth}" y2="${a}"
            stroke="${n}" stroke-width="${t}" stroke-linecap="round" class="gauge-dial-line" />
        `}default:return V``}}(s,this._config,n):""}
              ${function(t,e,i){if(!t)return V``;const s={...bt,...e.history},o=[],a="minmax"===s.mode||"both"===s.mode,n="dots"===s.mode||"both"===s.mode;if(a){const e=St(t.min,i),a=St(t.max,i);if("horizontal"===i.orientation){const t=i.trackY-2,n=3;o.push(V`
        <polygon points="${e-n},${t-1.8*n} ${e+n},${t-1.8*n} ${e},${t}"
          fill="${s.minColor}" class="history-min" />
      `),o.push(V`
        <polygon points="${a-n},${t-1.8*n} ${a+n},${t-1.8*n} ${a},${t}"
          fill="${s.maxColor}" class="history-max" />
      `)}else{const t=i.trackX+i.trackWidth+2,n=3;o.push(V`
        <polygon points="${t},${e} ${t+1.8*n},${e-n} ${t+1.8*n},${e+n}"
          fill="${s.minColor}" class="history-min" />
      `),o.push(V`
        <polygon points="${t},${a} ${t+1.8*n},${a-n} ${t+1.8*n},${a+n}"
          fill="${s.maxColor}" class="history-max" />
      `)}}if(n&&t.values.length>0){const e=50,a=Math.max(1,Math.floor(t.values.length/e)),n=t.values.filter((t,e)=>e%a===0);for(const t of n){const e=St(t.value,i);"horizontal"===i.orientation?o.push(V`
          <circle cx="${e}" cy="${i.trackY+i.trackHeight/2}" r="${s.dotSize}"
            fill="${s.dotColor}" opacity="0.6" class="history-dot" />
        `):o.push(V`
          <circle cx="${i.trackX+i.trackWidth/2}" cy="${e}" r="${s.dotSize}"
            fill="${s.dotColor}" opacity="0.6" class="history-dot" />
        `)}}return V`<g class="history-markers">${o}</g>`}(this._historyData,this._config,n)}
              ${function(t,e){const i={...mt,...t.ticks?.major};if(i.interval<=0)return V``;const s=[],{min:o,max:a}=e;for(let t=o;t<=a+1e-4;t+=i.interval){const o=St(t,e);if("horizontal"===e.orientation){const a=e.trackY+e.trackHeight+2,n=a+i.size;if(s.push(V`
        <line x1="${o}" y1="${a}" x2="${o}" y2="${n}"
          stroke="${i.color}" stroke-width="${i.width}" />
      `),i.labels){const e=Number.isInteger(t)?t.toString():t.toFixed(1);s.push(V`
          <text x="${o}" y="${n+i.labelFontSize}" text-anchor="middle"
            font-size="${i.labelFontSize}" fill="${i.labelColor}" class="tick-label">
            ${e}${i.labelSuffix}
          </text>
        `)}}else{const a=e.trackX-2,n=a-i.size;if(s.push(V`
        <line x1="${a}" y1="${o}" x2="${n}" y2="${o}"
          stroke="${i.color}" stroke-width="${i.width}" />
      `),i.labels){const e=Number.isInteger(t)?t.toString():t.toFixed(1);s.push(V`
          <text x="${n-3}" y="${o+i.labelFontSize/3}" text-anchor="end"
            font-size="${i.labelFontSize}" fill="${i.labelColor}" class="tick-label">
            ${e}${i.labelSuffix}
          </text>
        `)}}}return V`<g class="major-ticks">${s}</g>`}(this._config,n)}
              ${function(t,e){const i={...mt,...t.ticks?.major},s={...vt,...t.ticks?.minor};if(s.count<=0||i.interval<=0)return V``;const o=[],{min:a,max:n}=e,r=i.interval/(s.count+1);for(let t=a;t<n+1e-4;t+=i.interval)for(let i=1;i<=s.count;i++){const a=t+r*i;if(a>n+1e-4)break;const l=St(a,e);if("horizontal"===e.orientation){const t=e.trackY+e.trackHeight+2,i=t+s.size;o.push(V`
          <line x1="${l}" y1="${t}" x2="${l}" y2="${i}"
            stroke="${s.color}" stroke-width="${s.width}" />
        `)}else{const t=e.trackX-2,i=t-s.size;o.push(V`
          <line x1="${t}" y1="${l}" x2="${i}" y2="${l}"
            stroke="${s.color}" stroke-width="${s.width}" />
        `)}}return V`<g class="minor-ticks">${o}</g>`}(this._config,n)}
            </svg>
          </div>
        </div>
      </ha-card>
    `}_formatValue(t){return Number.isInteger(t)?t.toString():Math.abs(t)>=100||Math.abs(t)>=10?t.toFixed(1):t.toFixed(2)}_handleAction(){if(this._config.tap_action)this._fireAction(this._config.tap_action);else{const t=new CustomEvent("hass-more-info",{composed:!0,bubbles:!0,detail:{entityId:this._config.entity}});this.dispatchEvent(t)}}_fireAction(t){switch(t.action){case"more-info":{const t=new CustomEvent("hass-more-info",{composed:!0,bubbles:!0,detail:{entityId:this._config.entity}});this.dispatchEvent(t);break}case"navigate":if(t.navigation_path){window.history.pushState(null,"",t.navigation_path);const e=new Event("location-changed",{composed:!0,bubbles:!0});window.dispatchEvent(e)}break;case"url":t.url_path&&window.open(t.url_path);break;case"call-service":if(t.service){const[e,i]=t.service.split(".");this.hass.callApi("POST",`services/${e}/${i}`,t.service_data??{})}}}static get styles(){return n`
      :host {
        display: block;
      }

      ha-card {
        cursor: pointer;
        overflow: hidden;
      }

      .card-content {
        padding: 12px 16px;
      }

      .card-content.condensed {
        padding: 8px 12px;
      }

      .card-content.vertical {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        gap: 12px;
      }

      .card-content.vertical.condensed {
        gap: 8px;
      }

      .card-content.vertical .header-row {
        writing-mode: vertical-lr;
        text-orientation: mixed;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }

      .header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        gap: 8px;
      }

      .card-content.condensed .header-row {
        margin-bottom: 2px;
        gap: 6px;
      }

      .card-content.condensed.name-hidden .header-row {
        margin-bottom: 0;
      }

      .name {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        min-width: 0;
      }

      .card-content.condensed .name {
        font-size: 13px;
        line-height: 1.1;
      }

      .value-badge {
        font-weight: 600;
        white-space: nowrap;
        padding: 4px 10px;
        border-radius: 12px;
        background: var(--card-background-color, var(--ha-card-background, rgba(127,127,127,0.1)));
        border: 1px solid var(--divider-color, rgba(127,127,127,0.2));
        flex-shrink: 0;
      }

      .card-content.condensed .value-badge {
        padding: 2px 8px;
        border-radius: 10px;
        line-height: 1.1;
      }

      .gauge-container {
        width: 100%;
        line-height: 0;
      }

      .card-content.vertical .gauge-container {
        flex: 1;
        height: 250px;
      }

      .gauge-svg {
        overflow: visible;
      }

      .gauge-svg .tick-label {
        font-family: var(--ha-card-header-font-family, inherit);
        user-select: none;
      }

      .warning {
        padding: 16px;
        color: var(--error-color, #db4437);
        font-weight: 500;
      }
    `}}t([pt({attribute:!1})],Tt.prototype,"hass",void 0),t([gt()],Tt.prototype,"_config",void 0),t([gt()],Tt.prototype,"_historyData",void 0),customElements.define($t,Tt);export{Tt as LinearGaugeCard,Nt as LinearGaugeCardEditor};
