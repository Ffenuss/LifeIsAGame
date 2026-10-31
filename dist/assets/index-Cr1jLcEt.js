(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const lu="modulepreload",cu=function(n,e){return new URL(n,e).href},El={},qa=function(e,t,i){let s=Promise.resolve();if(t&&t.length>0){let c=function(h){return Promise.all(h.map(d=>Promise.resolve(d).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};const a=document.getElementsByTagName("link"),o=document.querySelector("meta[property=csp-nonce]"),l=o?.nonce||o?.getAttribute("nonce");s=c(t.map(h=>{if(h=cu(h,i),h in El)return;El[h]=!0;const d=h.endsWith(".css"),u=d?'[rel="stylesheet"]':"";if(i)for(let g=a.length-1;g>=0;g--){const b=a[g];if(b.href===h&&(!d||b.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${u}`))return;const f=document.createElement("link");if(f.rel=d?"stylesheet":lu,d||(f.as="script"),f.crossOrigin="",f.href=h,l&&f.setAttribute("nonce",l),document.head.appendChild(f),d)return new Promise((g,b)=>{f.addEventListener("load",g),f.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${h}`)))})}))}function r(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return s.then(a=>{for(const o of a||[])o.status==="rejected"&&r(o.reason);return e().catch(r)})};var hs;(function(n){n.Unimplemented="UNIMPLEMENTED",n.Unavailable="UNAVAILABLE"})(hs||(hs={}));class aa extends Error{constructor(e,t,i){super(e),this.message=e,this.code=t,this.data=i}}const hu=n=>{var e,t;return n?.androidBridge?"android":!((t=(e=n?.webkit)===null||e===void 0?void 0:e.messageHandlers)===null||t===void 0)&&t.bridge?"ios":"web"},uu=n=>{const e=n.CapacitorCustomPlatform||null,t=n.Capacitor||{},i=t.Plugins=t.Plugins||{},s=()=>e!==null?e.name:hu(n),r=()=>s()!=="web",a=d=>{const u=c.get(d);return!!(u?.platforms.has(s())||o(d))},o=d=>{var u;return(u=t.PluginHeaders)===null||u===void 0?void 0:u.find(f=>f.name===d)},l=d=>n.console.error(d),c=new Map,h=(d,u={})=>{const f=c.get(d);if(f)return console.warn(`Capacitor plugin "${d}" already registered. Cannot register plugins twice.`),f.proxy;const g=s(),b=o(d);let m;const p=async()=>(!m&&g in u?m=typeof u[g]=="function"?m=await u[g]():m=u[g]:e!==null&&!m&&"web"in u&&(m=typeof u.web=="function"?m=await u.web():m=u.web),m),v=(y,C)=>{var A,D;if(b){const O=b?.methods.find(X=>C===X.name);if(O)return O.rtype==="promise"?X=>t.nativePromise(d,C.toString(),X):(X,L)=>t.nativeCallback(d,C.toString(),X,L);if(y)return(A=y[C])===null||A===void 0?void 0:A.bind(y)}else{if(y)return(D=y[C])===null||D===void 0?void 0:D.bind(y);throw new aa(`"${d}" plugin is not implemented on ${g}`,hs.Unimplemented)}},E=y=>{let C;const A=(...D)=>{const O=p().then(X=>{const L=v(X,y);if(L){const $=L(...D);return C=$?.remove,$}else throw new aa(`"${d}.${y}()" is not implemented on ${g}`,hs.Unimplemented)});return y==="addListener"&&(O.remove=async()=>C()),O};return A.toString=()=>`${y.toString()}() { [capacitor code] }`,Object.defineProperty(A,"name",{value:y,writable:!1,configurable:!1}),A},S=E("addListener"),R=E("removeListener"),T=(y,C)=>{const A=S({eventName:y},C),D=async()=>{const X=await A;R({eventName:y,callbackId:X},C)},O=new Promise(X=>A.then(()=>X({remove:D})));return O.remove=async()=>{console.warn("Using addListener() without 'await' is deprecated."),await D()},O},_=new Proxy({},{get(y,C){switch(C){case"$$typeof":return;case"toJSON":return()=>({});case"addListener":return b?T:S;case"removeListener":return R;default:return E(C)}}});return i[d]=_,c.set(d,{name:d,proxy:_,platforms:new Set([...Object.keys(u),...b?[g]:[]])}),_};return t.convertFileSrc||(t.convertFileSrc=d=>d),t.getPlatform=s,t.handleError=l,t.isNativePlatform=r,t.isPluginAvailable=a,t.registerPlugin=h,t.Exception=aa,t.DEBUG=!!t.DEBUG,t.isLoggingEnabled=!!t.isLoggingEnabled,t},du=n=>n.Capacitor=uu(n),Bs=du(typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{}),Xo=Bs.registerPlugin;class $o{constructor(){this.listeners={},this.retainedEventArguments={},this.windowListeners={}}addListener(e,t){let i=!1;this.listeners[e]||(this.listeners[e]=[],i=!0),this.listeners[e].push(t);const r=this.windowListeners[e];r&&!r.registered&&this.addWindowListener(r),i&&this.sendRetainedArgumentsForEvent(e);const a=async()=>this.removeListener(e,t);return Promise.resolve({remove:a})}async removeAllListeners(){this.listeners={};for(const e in this.windowListeners)this.removeWindowListener(this.windowListeners[e]);this.windowListeners={}}notifyListeners(e,t,i){const s=this.listeners[e];if(!s){if(i){let r=this.retainedEventArguments[e];r||(r=[]),r.push(t),this.retainedEventArguments[e]=r}return}s.forEach(r=>r(t))}hasListeners(e){var t;return!!(!((t=this.listeners[e])===null||t===void 0)&&t.length)}registerWindowListener(e,t){this.windowListeners[t]={registered:!1,windowEventName:e,pluginEventName:t,handler:i=>{this.notifyListeners(t,i)}}}unimplemented(e="not implemented"){return new Bs.Exception(e,hs.Unimplemented)}unavailable(e="not available"){return new Bs.Exception(e,hs.Unavailable)}async removeListener(e,t){const i=this.listeners[e];if(!i)return;const s=i.indexOf(t);s!==-1&&this.listeners[e].splice(s,1),this.listeners[e].length||this.removeWindowListener(this.windowListeners[e])}addWindowListener(e){window.addEventListener(e.windowEventName,e.handler),e.registered=!0}removeWindowListener(e){e&&(window.removeEventListener(e.windowEventName,e.handler),e.registered=!1)}sendRetainedArgumentsForEvent(e){const t=this.retainedEventArguments[e];t&&(delete this.retainedEventArguments[e],t.forEach(i=>{this.notifyListeners(e,i)}))}}const Tl=n=>encodeURIComponent(n).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),wl=n=>n.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent);class fu extends $o{async getCookies(){const e=document.cookie,t={};return e.split(";").forEach(i=>{if(i.length<=0)return;let[s,r]=i.replace(/=/,"CAP_COOKIE").split("CAP_COOKIE");s=wl(s).trim(),r=wl(r).trim(),t[s]=r}),t}async setCookie(e){try{const t=Tl(e.key),i=Tl(e.value),s=e.expires?`; expires=${e.expires.replace("expires=","")}`:"",r=(e.path||"/").replace("path=",""),a=e.url!=null&&e.url.length>0?`domain=${e.url}`:"";document.cookie=`${t}=${i||""}${s}; path=${r}; ${a};`}catch(t){return Promise.reject(t)}}async deleteCookie(e){try{document.cookie=`${e.key}=; Max-Age=0`}catch(t){return Promise.reject(t)}}async clearCookies(){try{const e=document.cookie.split(";")||[];for(const t of e)document.cookie=t.replace(/^ +/,"").replace(/=.*/,`=;expires=${new Date().toUTCString()};path=/`)}catch(e){return Promise.reject(e)}}async clearAllCookies(){try{await this.clearCookies()}catch(e){return Promise.reject(e)}}}Xo("CapacitorCookies",{web:()=>new fu});const pu=async n=>new Promise((e,t)=>{const i=new FileReader;i.onload=()=>{const s=i.result;e(s.indexOf(",")>=0?s.split(",")[1]:s)},i.onerror=s=>t(s),i.readAsDataURL(n)}),mu=(n={})=>{const e=Object.keys(n);return Object.keys(n).map(s=>s.toLocaleLowerCase()).reduce((s,r,a)=>(s[r]=n[e[a]],s),{})},gu=(n,e=!0)=>n?Object.entries(n).reduce((i,s)=>{const[r,a]=s;let o,l;return Array.isArray(a)?(l="",a.forEach(c=>{o=e?encodeURIComponent(c):c,l+=`${r}=${o}&`}),l.slice(0,-1)):(o=e?encodeURIComponent(a):a,l=`${r}=${o}`),`${i}&${l}`},"").substr(1):null,_u=(n,e={})=>{const t=Object.assign({method:n.method||"GET",headers:n.headers},e),s=mu(n.headers)["content-type"]||"";if(typeof n.data=="string")t.body=n.data;else if(s.includes("application/x-www-form-urlencoded")){const r=new URLSearchParams;for(const[a,o]of Object.entries(n.data||{}))r.set(a,o);t.body=r.toString()}else if(s.includes("multipart/form-data")||n.data instanceof FormData){const r=new FormData;if(n.data instanceof FormData)n.data.forEach((o,l)=>{r.append(l,o)});else for(const o of Object.keys(n.data))r.append(o,n.data[o]);t.body=r;const a=new Headers(t.headers);a.delete("content-type"),t.headers=a}else(s.includes("application/json")||typeof n.data=="object")&&(t.body=JSON.stringify(n.data));return t};class vu extends $o{async request(e){const t=_u(e,e.webFetchExtra),i=gu(e.params,e.shouldEncodeUrlParams),s=i?`${e.url}?${i}`:e.url,r=await fetch(s,t),a=r.headers.get("content-type")||"";let{responseType:o="text"}=r.ok?e:{};a.includes("application/json")&&(o="json");let l,c;switch(o){case"arraybuffer":case"blob":c=await r.blob(),l=await pu(c);break;case"json":l=await r.json();break;default:l=await r.text()}const h={};return r.headers.forEach((d,u)=>{h[u]=d}),{data:l,headers:h,status:r.status,url:r.url}}async get(e){return this.request(Object.assign(Object.assign({},e),{method:"GET"}))}async post(e){return this.request(Object.assign(Object.assign({},e),{method:"POST"}))}async put(e){return this.request(Object.assign(Object.assign({},e),{method:"PUT"}))}async patch(e){return this.request(Object.assign(Object.assign({},e),{method:"PATCH"}))}async delete(e){return this.request(Object.assign(Object.assign({},e),{method:"DELETE"}))}}Xo("CapacitorHttp",{web:()=>new vu});var Al;(function(n){n.Dark="DARK",n.Light="LIGHT",n.Default="DEFAULT"})(Al||(Al={}));var Rl;(function(n){n.StatusBar="StatusBar",n.NavigationBar="NavigationBar"})(Rl||(Rl={}));class Mu extends $o{async setStyle(){this.unavailable("not available for web")}async setAnimation(){this.unavailable("not available for web")}async show(){this.unavailable("not available for web")}async hide(){this.unavailable("not available for web")}}Xo("SystemBars",{web:()=>new Mu});const Yn={startingCash:1500,baseSalary:350,startingHappiness:50,laps:3,retirementBonus:200,goalBonus:300,upgradeCosts:[.5,.8],groupRentMultiplier:2,maxKids:3},Ps={childhood:{name:"Childhood",color:"#59C08A",dark:"#237B51",soft:"#DDF6E9"},career:{name:"Career",color:"#5B8DEF",dark:"#2C56A8",soft:"#E0EAFF"},family:{name:"Family",color:"#F08BAD",dark:"#A93B62",soft:"#FFE3EC"},adventure:{name:"Adventure",color:"#A57BE0",dark:"#6842A8",soft:"#F0E5FF"},corner:{name:"Milestone",color:"#F3B944",dark:"#8A5A00",soft:"#FFF1C9"}},xi=[{color:"#FF7A6B",dark:"#B8382D",light:"#FFD9D3",name:"Coral"},{color:"#35C4B5",dark:"#0B7E74",light:"#D2F7F3",name:"Teal"},{color:"#FFC44D",dark:"#9A6700",light:"#FFF0C7",name:"Gold"},{color:"#9C7BF3",dark:"#5A38B5",light:"#E9DFFF",name:"Violet"}],jt=(n,e,t,i,s,r)=>({id:n,name:e,district:t,icon:i,type:"property",price:s,rent:r,blurb:"Own it and collect rent. Upgrade it to build your little empire."}),bi=[{id:0,name:"Fresh Start",type:"start",district:"corner",icon:"sun",blurb:"A new chapter begins. Pass by to collect your salary."},jt(1,"Lemonade Stand","childhood","cup",100,[12,30,55]),{id:2,name:"Playground",type:"rest",district:"childhood",icon:"balloon",blurb:"Take a breath, swing high, and enjoy the afternoon.",happiness:5},jt(3,"School Fair","childhood","balloon",120,[15,35,65]),{id:4,name:"The Library",type:"choice",district:"childhood",icon:"book",choiceId:"library",blurb:"A quiet afternoon and a world of books."},jt(5,"Little League","childhood","ball",140,[18,40,75]),{id:6,name:"Birthday Party",type:"bonus",district:"childhood",icon:"gift",cash:120,happiness:6,blurb:"Cake, friends, and a little envelope of birthday money."},jt(7,"Toy Shop","childhood","blocks",160,[20,45,85]),{id:8,name:"Graduation",type:"choice",district:"corner",icon:"cap",choiceId:"graduation",blurb:"The world opens up. Which road will you take?"},jt(9,"First Job","career","briefcase",200,[25,55,100]),jt(10,"Side Hustle","career","laptop",180,[22,50,90]),jt(11,"Coffee Shop","career","coffee",220,[28,60,110]),{id:12,name:"Promotion",type:"bonus",district:"career",icon:"medal",cash:150,salary:60,happiness:4,blurb:"The boss noticed. A raise and a slightly nicer chair."},jt(13,"Startup","career","rocket",380,[45,100,185]),{id:14,name:"Night School",type:"choice",district:"career",icon:"moon",choiceId:"nightSchool",blurb:"Trade a few evenings for a bigger tomorrow."},jt(15,"Freelance Gig","career","laptop",240,[30,65,120]),{id:16,name:"Midlife Crossroads",type:"choice",district:"corner",icon:"compass",choiceId:"midlife",blurb:"Halfway there. Time to decide what the rest is for."},{id:17,name:"First Date",type:"event",district:"family",icon:"heart",blurb:"Your heart does a little somersault."},{id:18,name:"Wedding",type:"choice",district:"family",icon:"rings",choiceId:"wedding",blurb:"Say yes to someone, or say yes to yourself."},jt(19,"Starter Home","family","home",300,[35,80,145]),{id:20,name:"Nursery",type:"choice",district:"family",icon:"crib",choiceId:"nursery",blurb:"The spare room could become something more."},jt(21,"Family Trip","family","plane",200,[25,55,100]),jt(22,"Garden","family","flower",180,[22,50,90]),jt(23,"Family Business","family","shop",320,[40,90,160]),{id:24,name:"Empty Nest",type:"emptyNest",district:"corner",icon:"nest",blurb:"The house is quiet. The fridge is finally full."},jt(25,"World Trip","adventure","globe",260,[32,70,130]),jt(26,"Beach House","adventure","umbrella",360,[44,95,175]),jt(27,"Mountain Cabin","adventure","mountain",280,[34,75,140]),jt(28,"Art Studio","adventure","palette",240,[30,65,120]),{id:29,name:"Stock Market",type:"choice",district:"adventure",icon:"chart",choiceId:"stocks",blurb:"A little risk, a little reward, a lot of caffeine."},{id:30,name:"Charity Gala",type:"choice",district:"adventure",icon:"heart",choiceId:"charity",blurb:"A night of fancy clothes and bigger hearts."},jt(31,"Dream Garage","adventure","car",400,[48,105,195])];bi.filter(n=>n.type==="property");const Yt=Object.fromEntries(bi.map(n=>[n.id,n])),zr=bi.reduce((n,e)=>(e.type!=="property"||(n[e.district]||=[]).push(e.id),n),{}),xu={library:{id:"library",title:"The Library",icon:"book",prompt:"You have a free afternoon and a library card. What do you do?",options:[{id:"read",label:"Read for the joy of it",detail:"+8 happiness",effects:{happiness:8},ai:2},{id:"study",label:"Study for a certificate",detail:"−$80 · +$25 salary · +3 happiness",cost:80,effects:{cash:-80,salary:25,happiness:3},ai:3}]},graduation:{id:"graduation",title:"Graduation Day",icon:"cap",prompt:"The cap is in the air. What comes next?",options:[{id:"college",label:"Go to college",detail:"−$400 · +$120 salary · +6 happiness",cost:400,effects:{cash:-400,salary:120,happiness:6,flags:["scholar"]},ai:4},{id:"trade",label:"Trade school",detail:"−$150 · +$70 salary · +2 happiness",cost:150,effects:{cash:-150,salary:70,happiness:2},ai:3},{id:"work",label:"Start working right away",detail:"+$200 · +$25 salary",effects:{cash:200,salary:25},ai:2}]},nightSchool:{id:"nightSchool",title:"Night School",icon:"moon",prompt:"A course could change your career. It also costs money and sleep.",options:[{id:"enroll",label:"Enroll in the course",detail:"−$250 · +$90 salary · +4 happiness",cost:250,effects:{cash:-250,salary:90,happiness:4,flags:["scholar"]},ai:4},{id:"skip",label:"Keep your evenings",detail:"+2 happiness",effects:{happiness:2},ai:1}]},midlife:{id:"midlife",title:"Midlife Crossroads",icon:"compass",prompt:"You have built a life. Now what is it for?",options:[{id:"dream",label:"Chase the dream",detail:"−$150 · −$40 salary · +20 happiness",cost:150,effects:{cash:-150,salary:-40,happiness:20,flags:["dreamer"]},ai:3},{id:"career",label:"Double down on your career",detail:"+$90 salary · −6 happiness",effects:{salary:90,happiness:-6},ai:4},{id:"investSelf",label:"Invest in yourself",detail:"−$200 · +$40 salary · +10 happiness",cost:200,effects:{cash:-200,salary:40,happiness:10},ai:3}]},wedding:{id:"wedding",title:"Wedding Bells",icon:"rings",prompt:"Someone wonderful is standing in front of you. What do you say?",options:[{id:"marry",label:"Say “I do”",detail:"−$300 · +15 happiness · +$40 salary",cost:300,effects:{cash:-300,happiness:15,salary:40,partner:!0},ai:4},{id:"later",label:"Not yet",detail:"+2 happiness",effects:{happiness:2},ai:1}]},nursery:{id:"nursery",title:"The Nursery",icon:"crib",prompt:"The spare room is quiet and full of possibility.",options:[{id:"baby",label:"Start a family",detail:"−$200 · +12 happiness · +1 kid",cost:200,effects:{cash:-200,happiness:12,kids:1,salary:-20},ai:4},{id:"later",label:"Not right now",detail:"+2 happiness",effects:{happiness:2},ai:1}]},stocks:{id:"stocks",title:"Stock Market",icon:"chart",prompt:"A hot tip, a shaky chart, and a decision to make.",options:[{id:"invest",label:"Invest $200",detail:"55% chance: +$600 · 45% chance: lose it",cost:200,effects:{cash:-200},gamble:{chance:.55,win:600,winText:"The stock soared!",loseText:"The stock tanked."},ai:3},{id:"safe",label:"Play it safe",detail:"+4 happiness",effects:{happiness:4},ai:1}]},charity:{id:"charity",title:"Charity Gala",icon:"heart",prompt:"A beautiful evening for a good cause. Your wallet is listening.",options:[{id:"donate",label:"Make a generous donation",detail:"−$200 · +20 happiness · Big Heart",cost:200,effects:{cash:-200,happiness:20,flags:["philanthropist"]},ai:3},{id:"keep",label:"Just enjoy the canapés",detail:"−3 happiness",effects:{happiness:-3},ai:1}]}},Jr=[{id:"sidewalk",title:"Lucky Find",icon:"coin",tone:"good",text:"You find $50 folded into an old coat pocket.",cash:50},{id:"medical",title:"Surprise Bill",icon:"heart",tone:"bad",text:"A trip to the dentist costs more than expected.",cash:-150},{id:"sideproject",title:"Side Project Soars",icon:"rocket",tone:"good",text:"Your weekend project finds its first 1,000 customers.",cash:300},{id:"car",title:"Car Trouble",icon:"car",tone:"bad",text:"The mechanic makes a sympathetic face. That is never good.",cash:-120},{id:"loan",title:"Old Favour Repaid",icon:"coin",tone:"good",text:"A friend finally pays back that loan from years ago.",cash:100},{id:"puppy",title:"A Very Good Dog",icon:"heart",tone:"good",text:"You adopt a puppy. Your budget and your heart disagree.",cash:-80,happiness:10},{id:"promo",title:"Quiet Promotion",icon:"medal",tone:"good",text:"Your work speaks for itself. A raise arrives.",cash:120,salary:50},{id:"refund",title:"Tax Refund",icon:"coin",tone:"good",text:"The government sends a small, beautiful surprise.",cash:180},{id:"vacation",title:"Dream Vacation",icon:"plane",tone:"good",text:"You book the trip. The photos are worth every penny.",cash:-200,happiness:15},{id:"inheritance",title:"A Distant Relative",icon:"gift",tone:"good",text:"A generous inheritance arrives out of the blue.",cash:400},{id:"repair",title:"Home Repair",icon:"home",tone:"bad",text:"The roof has opinions about the weather.",cash:-100},{id:"raffle",title:"Raffle Winner",icon:"star",tone:"good",text:"You win the school raffle. The kids are thrilled.",cash:250},{id:"burnout",title:"Burnout",icon:"moon",tone:"bad",text:"You take an unpaid week to recharge. It helps.",cash:-50,happiness:-10},{id:"mentor",title:"Pay It Forward",icon:"book",tone:"good",text:"You mentor a student. They send you a thank-you note.",cash:50,happiness:8},{id:"dividend",title:"Dividend Day",icon:"chart",tone:"good",text:"Your investments quietly pay you for existing.",cash:120},{id:"market",title:"Market Wobble",icon:"chart",tone:"bad",text:"The market sneezes. Your portfolio catches a cold.",cash:-90}],th=[{id:"tycoon",name:"Tycoon",icon:"briefcase",desc:"Own 4 or more assets when the game ends.",check:(n,e)=>Hr(n,e.id)>=4},{id:"globetrotter",name:"Globetrotter",icon:"globe",desc:"Own 2 adventure properties when the game ends.",check:(n,e)=>Hr(n,e.id,t=>t.district==="adventure")>=2},{id:"family",name:"Family First",icon:"heart",desc:"Find a partner and raise 2 children.",check:(n,e)=>e.partner&&e.kids>=2},{id:"scholar",name:"Scholar",icon:"cap",desc:"Complete college or night school.",check:(n,e)=>!!e.flags.scholar},{id:"philanthropist",name:"Big Heart",icon:"heart",desc:"Make a generous donation at the Charity Gala.",check:(n,e)=>!!e.flags.philanthropist},{id:"homeowner",name:"Dream Home",icon:"home",desc:"Fully upgrade any property to level 3.",check:(n,e)=>nh(n,e.id)},{id:"socialite",name:"Joy Seeker",icon:"star",desc:"Reach 80 happiness when the game ends.",check:(n,e)=>e.happiness>=80},{id:"investor",name:"Nest Egg",icon:"coin",desc:"Finish with at least $2,000 in cash.",check:(n,e)=>e.cash>=2e3}],Gr=Object.fromEntries(th.map(n=>[n.id,n]));function Hr(n,e,t=()=>!0){return Object.entries(n.owners).filter(([i,s])=>s.owner===e&&t(Yt[Number(i)])).length}function nh(n,e){return Object.values(n.owners).some(t=>t.owner===e&&t.level>=3)}function Su(n,e,t){const i=zr[t]||[];return i.length>0&&i.every(s=>n.owners[s]?.owner===e)}function yu(n,e){const t=Yt[e],i=n.owners[e];if(!t||!i)return 0;const s=t.rent[i.level-1]||t.rent[0];return Su(n,i.owner,t.district)?s*Yn.groupRentMultiplier:s}function qo(n,e){return Math.round(n.price*Yn.upgradeCosts[e-1]/10)*10}function bu(n,e){return Math.round(n.price*[0,.7,.85,1][e])}const Eu=[{icon:"star",title:"Build a life",text:"Travel the board through Childhood, Career, Family and Adventure. Pass Fresh Start to collect your salary and begin a new chapter."},{icon:"home",title:"Own your story",text:"Land on an unowned property to buy it. Land on your own property to upgrade it. Land on someone else’s to pay rent — owning a full colour group doubles it."},{icon:"compass",title:"Make choices",text:"Milestones like Graduation, Wedding and Midlife ask you to choose. There is no single right answer — every path has a price and a payoff."},{icon:"heart",title:"Win at life",text:"After the final chapter, your score combines cash, assets, happiness, family, your secret life goal and retirement. Money alone rarely wins."}];function Yo(n){n.rng=n.rng+1831565813>>>0;let e=n.rng;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Tu(n,e,t){return e+Math.floor(Yo(n)*(t-e+1))}function Ya(n,e){const t=[...e];for(let i=t.length-1;i>0;i--){const s=Math.floor(Yo(n)*(i+1));[t[i],t[s]]=[t[s],t[i]]}return t}function wu(n,e,t){return Math.max(e,Math.min(t,n))}const Za=bi.length,Au=Object.fromEntries(Jr.map(n=>[n.id,n]));function Bt(n){return n.players[n.current]}function Ru({players:n,laps:e=Yn.laps,seed:t=Math.floor(Math.random()*1e9)}={}){const i=(n&&n.length?n:[{name:"You",isAI:!1}]).slice(0,4),s={version:1,seed:t,rng:t>>>0,laps:Math.max(1,Math.min(5,e)),players:i.map((a,o)=>({id:o,name:a.name||`Player ${o+1}`,color:a.color||xi[o%xi.length].color,colorDark:a.colorDark||xi[o%xi.length].dark,isAI:!!a.isAI,cash:Yn.startingCash,salary:Yn.baseSalary,happiness:Yn.startingHappiness,position:0,laps:0,partner:!1,kids:0,retired:!1,bankrupt:!1,goal:null,flags:{},stats:{assetsBought:0,rentPaid:0,rentEarned:0,events:0,donated:0}})),owners:{},deck:[],deckIndex:0,current:0,phase:"roll",turn:1,lastRoll:null,pending:null,log:[],winner:null,results:null,startedAt:Date.now()},r=Ya(s,th.map(a=>a.id));return s.players.forEach((a,o)=>{a.goal=r[o%r.length]}),s.deck=Ya(s,Jr.map(a=>a.id)),Tt(s,`${s.players[0].name} begins a brand new life.`,"start"),Tt(s,"Roll the die to take your first steps.","info"),s}function Cu(n){if(n.phase!=="roll")throw new Error(`Cannot roll during phase ${n.phase}`);const e=Bt(n);if(e.retired||e.bankrupt)throw new Error("Player is not active");const t=Tu(n,1,6),i=e.position,s=[];for(let r=1;r<=t;r++)s.push((i+r)%Za);return n.lastRoll=t,n.phase="moving",{roll:t,from:i,path:s,to:s[s.length-1]}}function Pu(n){if(n.phase!=="moving")throw new Error(`Cannot complete move during phase ${n.phase}`);const e=Bt(n),t=[],i=e.position,s=n.lastRoll,r=(i+s)%Za,a=i+s>=Za;e.position=r,a&&(e.laps+=1,e.cash+=e.salary,t.push({type:"salary",playerId:e.id,amount:e.salary}),Tt(n,`${e.name} passes Fresh Start and collects $${e.salary} salary.`,"money"),Tt(n,`Chapter ${Math.min(e.laps+1,n.laps)} begins.`,"info"));const o=Lu(n,e,r,t);return o&&t.push(o),n.pending?n.phase="action":(e.bankrupt,n.phase="end"),{events:t,from:i,to:r,passedStart:a,roll:s}}function Lu(n,e,t,i){const s=Yt[t];switch(i.push({type:"land",playerId:e.id,tileId:t}),s.type){case"property":{const r=n.owners[t];if(!r)return n.pending={type:"buy",tileId:t,playerId:e.id},i.push({type:"offer",kind:"buy",tileId:t}),Tt(n,`${e.name} arrives at ${s.name}. It is for sale for $${s.price}.`,"info"),null;if(r.owner===e.id){if(r.level<3){const c=qo(s,r.level);n.pending={type:"upgrade",tileId:t,cost:c,playerId:e.id},i.push({type:"offer",kind:"upgrade",tileId:t,cost:c}),Tt(n,`${e.name} visits their own ${s.name}. Upgrade available for $${c}.`,"info")}else _i(n,e,2,i),Tt(n,`${e.name} enjoys their fully upgraded ${s.name}. +2 happiness.`,"happy");return null}const a=n.players[r.owner],o=yu(n,t),l=Nu(n,e,a,o,`rent at ${s.name}`);return e.stats.rentPaid+=l,a.stats.rentEarned+=l,Tt(n,`${e.name} pays $${l} rent to ${a.name} at ${s.name}${o>s.rent[r.level-1]?" (full group bonus!)":""}.`,"money"),i.push({type:"rent",fromId:e.id,toId:a.id,amount:l,tileId:t}),e.bankrupt&&i.push({type:"bankrupt",playerId:e.id}),null}case"event":return Fu(n,e,i);case"bonus":return s.cash&&ws(n,e,s.cash,i),s.salary&&(e.salary=Math.max(100,e.salary+s.salary),i.push({type:"salaryUp",playerId:e.id,amount:s.salary})),s.happiness&&_i(n,e,s.happiness,i),Tt(n,`${s.name}: +$${s.cash||0}${s.salary?`, salary +$${s.salary}`:""}${s.happiness?`, +${s.happiness} happiness`:""}.`,"good"),null;case"rest":return _i(n,e,s.happiness||4,i),Tt(n,`${e.name} takes a moment at the ${s.name}. +${s.happiness||4} happiness.`,"happy"),null;case"start":return ws(n,e,100,i),_i(n,e,3,i),Tt(n,`${e.name} lands on Fresh Start. A little bonus for new beginnings: +$100.`,"good"),null;case"emptyNest":{if(e.kids>0){const r=120*e.kids;ws(n,e,r,i),_i(n,e,8,i),Tt(n,`${e.name} watches the kids fly the nest. +$${r}, +8 happiness.`,"happy")}else ws(n,e,80,i),_i(n,e,4,i),Tt(n,`${e.name} enjoys a quiet, wonderfully cheap house. +$80.`,"good");return null}case"choice":{const r=Qr(n,s.choiceId,e);return n.pending={type:"choice",choiceId:r.id,tileId:t,playerId:e.id},i.push({type:"choice",choiceId:r.id,tileId:t}),Tt(n,`${e.name} faces a milestone: ${r.title}.`,"choice"),null}default:return null}}function Qr(n,e,t){const i=xu[e];if(!i)throw new Error(`Unknown choice ${e}`);return e==="wedding"&&t.partner?{...i,title:"Anniversary",prompt:"A familiar face, a shared history, and one more year together.",options:[{id:"renew",label:"Renew your vows",detail:"−$100 · +8 happiness",cost:100,effects:{cash:-100,happiness:8},ai:3},{id:"skip",label:"A quiet night in",detail:"+2 happiness",effects:{happiness:2},ai:1}]}:e==="nursery"&&t.kids>=Yn.maxKids?{...i,title:"Full House",prompt:"The house is loud, joyful, and completely out of bedrooms.",options:[{id:"full",label:"Enjoy the chaos",detail:"+6 happiness",effects:{happiness:6},ai:2}]}:i}function Cl(n){jr(n,"buy");const e=Bt(n),t=Yt[n.pending.tileId];if(e.cash<t.price)throw new Error("Not enough cash");const i=[];return e.cash-=t.price,e.stats.assetsBought+=1,n.owners[t.id]={owner:e.id,level:1},Tt(n,`${e.name} buys ${t.name} for $${t.price}.`,"buy"),i.push({type:"buy",playerId:e.id,tileId:t.id,amount:t.price}),Zs(n,i),{events:i}}function Pl(n){jr(n,"buy");const e=Bt(n),t=Yt[n.pending.tileId];return Tt(n,`${e.name} passes on ${t.name}.`,"info"),Zs(n,[{type:"pass",playerId:e.id,tileId:t.id}]),{events:[{type:"pass",playerId:e.id,tileId:t.id}]}}function Ll(n){jr(n,"upgrade");const e=Bt(n),t=Yt[n.pending.tileId],i=n.owners[t.id];if(!i||i.owner!==e.id)throw new Error("You do not own this property");if(i.level>=3)throw new Error("Already fully upgraded");const s=qo(t,i.level);if(e.cash<s)throw new Error("Not enough cash");e.cash-=s,i.level+=1,Tt(n,`${e.name} upgrades ${t.name} to level ${i.level} for $${s}.`,"buy");const r=[{type:"upgrade",playerId:e.id,tileId:t.id,level:i.level,amount:s}];return Zs(n,r),{events:r}}function Dl(n){jr(n,"upgrade");const e=Bt(n),t=Yt[n.pending.tileId];return Tt(n,`${e.name} decides ${t.name} is fine as it is.`,"info"),Zs(n,[{type:"pass",playerId:e.id,tileId:t.id}]),{events:[{type:"pass",playerId:e.id,tileId:t.id}]}}function Il(n){if(!n.pending||n.pending.type!=="card")throw new Error("No card to acknowledge");return n.pending=null,n.phase="end",{events:[]}}function Fl(n,e){if(!n.pending||n.pending.type!=="choice")throw new Error("No choice to resolve");const t=Bt(n),s=Qr(n,n.pending.choiceId,t).options.find(a=>a.id===e);if(!s)throw new Error(`Unknown option ${e}`);if(s.cost&&t.cash<s.cost)throw new Error("Not enough cash for that choice");const r=[];if(Du(n,t,s.effects||{},r),s.gamble){const a=Yo(n)<s.gamble.chance;a?(t.cash+=s.gamble.win,r.push({type:"money",playerId:t.id,amount:s.gamble.win,reason:"investment"}),Tt(n,`${s.gamble.winText} +$${s.gamble.win}.`,"good")):Tt(n,`${s.gamble.loseText} −$${s.cost}.`,"bad"),r.push({type:"gamble",playerId:t.id,win:a})}return Tt(n,`${t.name} chose “${s.label}”.`,"choice"),Zs(n,r),{events:r,option:s}}function Du(n,e,t,i){t.cash&&ws(n,e,t.cash,i),t.salary&&(e.salary=Math.max(100,e.salary+t.salary),i.push({type:"salaryUp",playerId:e.id,amount:t.salary})),t.happiness&&_i(n,e,t.happiness,i),t.partner&&(e.partner=!0,i.push({type:"family",playerId:e.id,partner:!0})),t.kids&&(e.kids+=t.kids,i.push({type:"family",playerId:e.id,kids:e.kids}));for(const s of t.flags||[])e.flags[s]=!0}function Zs(n,e){return n.pending=null,n.phase="end",e}function Iu(n){if(n.phase!=="end"&&n.phase!=="action")throw new Error(`Cannot end turn during phase ${n.phase}`);const e=[],t=Bt(n);if(!t.retired&&!t.bankrupt&&t.laps>=n.laps&&(t.retired=!0,t.cash+=Yn.retirementBonus,Tt(n,`${t.name} retires after chapter ${n.laps}. A $${Yn.retirementBonus} retirement bonus.`,"retire"),e.push({type:"retire",playerId:t.id})),n.players.filter(r=>!r.retired&&!r.bankrupt).length===0)return Ou(n,e),{events:e,ended:!0};let s=n.current;for(let r=0;r<n.players.length&&(s=(s+1)%n.players.length,!(!n.players[s].retired&&!n.players[s].bankrupt));r++);return n.current=s,n.phase="roll",n.lastRoll=null,n.pending=null,n.turn+=1,Tt(n,`${n.players[s].name}'s turn.`,"turn"),{events:e,ended:!1}}function Fu(n,e,t){n.deckIndex>=n.deck.length&&(n.deck=Ya(n,Jr.map(s=>s.id)),n.deckIndex=0,Tt(n,"The deck is reshuffled.","info"));const i=Au[n.deck[n.deckIndex++]];if(e.stats.events+=1,i.cash){const s=e.cash;e.cash=Math.max(0,e.cash+i.cash),t.push({type:"money",playerId:e.id,amount:e.cash-s,reason:i.title})}return i.salary&&(e.salary=Math.max(100,e.salary+i.salary),t.push({type:"salaryUp",playerId:e.id,amount:i.salary})),i.happiness&&_i(n,e,i.happiness,t),n.pending={type:"card",cardId:i.id,playerId:e.id},Tt(n,`Life event — ${i.title}: ${i.text}`,i.tone),{type:"card",card:i,playerId:e.id}}function ws(n,e,t,i){e.cash=Math.max(0,e.cash+t),i.push({type:"money",playerId:e.id,amount:t,reason:"life"})}function _i(n,e,t,i){const s=e.happiness;e.happiness=wu(e.happiness+t,0,100);const r=e.happiness-s;r&&i.push({type:"happiness",playerId:e.id,amount:r})}function Nu(n,e,t,i,s){const r=Math.min(e.cash,i);return e.cash-=r,t&&(t.cash+=r),r<i&&Uu(n,e,t),r}function Uu(n,e,t){e.bankrupt=!0,e.retired=!0,e.happiness=0,n.pending=null;const i=[];for(const[s,r]of Object.entries(n.owners))r.owner===e.id&&(t?(r.owner=t.id,i.push(Number(s))):delete n.owners[s]);Tt(n,`${e.name} goes bankrupt and leaves the board.`,"bad"),i.length&&Tt(n,`${t.name} takes over their properties.`,"bad")}function ih(n,e){const i=Object.entries(n.owners).filter(([,d])=>d.owner===e.id).reduce((d,[u,f])=>d+bu(Yt[Number(u)],f.level),0),s=Gr[e.goal],r=!e.bankrupt&&s?!!s.check(n,e):!1,a=(e.partner?150:0)+e.kids*120,o=e.happiness*8,l=e.retired&&!e.bankrupt?200:0,c=r?Yn.goalBonus:0,h=Math.round(e.cash+i+o+a+c+l);return{playerId:e.id,cash:e.cash,assets:i,happiness:o,family:a,goal:c,goalMet:r,retirement:l,total:h}}function Ou(n,e){const t=n.players.map(s=>ih(n,s)).sort((s,r)=>r.total-s.total||r.cash-s.cash);n.phase="ended",n.results=t,n.winner=t[0]?.playerId??null,n.pending=null;const i=n.players[n.winner];Tt(n,`${i?.name} wins with a life score of ${t[0]?.total}.`,"retire"),e.push({type:"gameover",winner:n.winner,results:t})}function jr(n,e){if(!n.pending||n.pending.type!==e)throw new Error(`Expected pending ${e}`)}function Tt(n,e,t="info"){n.log.push({id:n.log.length+1,turn:n.turn,text:e,kind:t}),n.log.length>80&&n.log.shift()}function Nl(n,e){const t=Gr[e.goal];if(!t)return{text:"",met:!1};switch(t.id){case"tycoon":return{text:`${Math.min(4,Hr(n,e.id))}/4 assets`,met:t.check(n,e)};case"globetrotter":return{text:`${Math.min(2,Hr(n,e.id,i=>i.district==="adventure"))}/2 adventure assets`,met:t.check(n,e)};case"family":return{text:`${e.partner?"Partner ✓":"No partner"} · ${Math.min(2,e.kids)}/2 kids`,met:t.check(n,e)};case"scholar":return{text:e.flags.scholar?"Graduated ✓":"Not yet",met:t.check(n,e)};case"philanthropist":return{text:e.flags.philanthropist?"Donated ✓":"Not yet",met:t.check(n,e)};case"homeowner":return{text:nh(n,e.id)?"Level 3 ✓":"No level 3 asset",met:t.check(n,e)};case"socialite":return{text:`${e.happiness}/80 happiness`,met:t.check(n,e)};case"investor":return{text:`$${e.cash}/$2,000`,met:t.check(n,e)};default:return{text:"",met:!1}}}function Bu(n){return JSON.stringify(n)}function ku(n){if(!n)return null;try{const e=typeof n=="string"?JSON.parse(n):n;return!e||e.version!==1||!Array.isArray(e.players)||!e.players.length||!Yt[e.players[e.current]?.position??-1]||!["roll","moving","action","end","ended"].includes(e.phase)?null:e}catch{return null}}function zu(n){const e=n.pending;if(!e)return null;const t=Bt(n);if(e.type==="buy"){const i=Yt[e.tileId],r=(zr[i.district]||[]).filter(o=>o!==i.id).every(o=>n.owners[o]?.owner===t.id)?60:220;return{type:t.cash-i.price>=r||i.price<=180&&t.cash-i.price>=100?"buy":"pass"}}if(e.type==="upgrade"){const i=Yt[e.tileId],s=qo(i,n.owners[i.id].level),r=(zr[i.district]||[]).every(o=>n.owners[o]?.owner===t.id);return{type:t.cash-s>=(r?180:380)?"upgrade":"skipUpgrade"}}if(e.type==="card")return{type:"card"};if(e.type==="choice"){const i=Qr(n,e.choiceId,t),s=i.options.filter(l=>!l.cost||t.cash>=l.cost),r=s.length?s:[i.options[0]];let a=r[0],o=-1/0;for(const l of r){let c=l.ai??1;if(l.cost){const h=t.cash-l.cost;h<150?c-=3:h<350&&(c-=1)}l.gamble&&t.cash<600&&(c-=2),l.id==="baby"&&t.kids>=2&&(c-=2),c>o&&(o=c,a=l)}return{type:"choice",optionId:a.id}}return null}const Zo="187",os={ROTATE:0,DOLLY:1,PAN:2},ss={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Gu=0,Ul=1,Hu=2,Ls=1,Vu=2,As=3,Oi=0,_n=1,Bn=2,ls=0,Ds=1,Ol=2,Bl=3,kl=4,Wu=5,ns=100,Xu=101,$u=102,qu=103,Yu=104,Zu=200,Ku=201,Ju=202,Qu=203,sh=204,rh=205,ju=206,ed=207,td=208,nd=209,id=210,sd=211,rd=212,ad=213,od=214,Ka=0,Ja=1,Qa=2,ks=3,ja=4,eo=5,to=6,no=7,ah=0,ld=1,cd=2,ci=0,oh=1,lh=2,ch=3,Ko=4,hh=5,uh=6,dh=7,fh=300,us=301,zs=302,oa=303,la=304,io=1e3,li=1001,so=1002,an=1003,hd=1004,ar=1005,En=1006,ca=1007,Si=1008,Rn=1009,ph=1010,mh=1011,Gs=1012,Jo=1013,Qn=1014,Zn=1015,jn=1016,Qo=1017,jo=1018,ds=1020,gh=35902,_h=35899,vh=1021,Mh=1022,Kn=1023,Ei=1026,yi=1027,xh=1028,el=1029,Bi=1030,tl=1031,nl=1033,Ir=33776,Fr=33777,Nr=33778,Ur=33779,ro=35840,ao=35841,oo=35842,lo=35843,co=36196,ho=37492,uo=37496,fo=37488,po=37489,Vr=37490,mo=37491,go=37808,_o=37809,vo=37810,Mo=37811,xo=37812,So=37813,yo=37814,bo=37815,Eo=37816,To=37817,wo=37818,Ao=37819,Ro=37820,Co=37821,Po=36492,Lo=36494,Do=36495,Io=36283,Fo=36284,Wr=36285,No=36286,ud=3200,Uo=0,dd=1,Mi="",rn="srgb",Xr="srgb-linear",$r="linear",bt="srgb",ha=7680,fd=519,pd=512,md=513,gd=514,Sh=515,_d=516,vd=517,yh=518,bh=519,Md=35044,zl="300 es",zn=2e3,Hs=2001;function xd(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function qr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Sd(){const n=qr("canvas");return n.style.display="block",n}const Gl={};function Hl(...n){const e="THREE."+n.shift();console.log(e,...n)}function Eh(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Je(...n){n=Eh(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function mt(...n){n=Eh(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function Or(...n){const e=n.join(" ");e in Gl||(Gl[e]=!0,Je(...n))}function yd(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const bd={[Ka]:Ka,[Qa]:to,[ja]:ja,[ks]:eo,[Ja]:Ja,[to]:Qa,[no]:no,[eo]:ks};class wi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const hn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Vl=1234567;const Is=Math.PI/180,Vs=180/Math.PI;function zi(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(hn[n&255]+hn[n>>8&255]+hn[n>>16&255]+hn[n>>24&255]+"-"+hn[e&255]+hn[e>>8&255]+"-"+hn[e>>16&15|64]+hn[e>>24&255]+"-"+hn[t&63|128]+hn[t>>8&255]+"-"+hn[t>>16&255]+hn[t>>24&255]+hn[i&255]+hn[i>>8&255]+hn[i>>16&255]+hn[i>>24&255]).toLowerCase()}function ot(n,e,t){return Math.max(e,Math.min(t,n))}function il(n,e){return(n%e+e)%e}function Ed(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function Td(n,e,t){return n!==e?(t-n)/(e-n):0}function Fs(n,e,t){return(1-t)*n+t*e}function wd(n,e,t,i){return Fs(n,e,1-Math.exp(-t*i))}function Ad(n,e=1){return e-Math.abs(il(n,e*2)-e)}function Rd(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Cd(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Pd(n,e){return n+Math.floor(Math.random()*(e-n+1))}function Ld(n,e){return n+Math.random()*(e-n)}function Dd(n){return n*(.5-Math.random())}function Id(n){n!==void 0&&(Vl=n);let e=Vl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Fd(n){return n*Is}function Nd(n){return n*Vs}function Ud(n){return n>0&&Number.isInteger(n)&&2**Math.round(Math.log2(n))===n}function Od(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Th(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Bd(n,e,t,i,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+i)/2),h=a((e+i)/2),d=r((e-i)/2),u=a((e-i)/2),f=r((i-e)/2),g=a((i-e)/2);switch(s){case"XYX":n.set(o*h,l*d,l*u,o*c);break;case"YZY":n.set(l*u,o*h,l*d,o*c);break;case"ZXZ":n.set(l*d,l*u,o*h,o*c);break;case"XZX":n.set(o*h,l*g,l*f,o*c);break;case"YXY":n.set(l*f,o*h,l*g,o*c);break;case"ZYZ":n.set(l*g,l*f,o*h,o*c);break;default:Je("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function sl(n){switch(n.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function wh(n,e){if(e.constructor===Float32Array)return n;const t=sl(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(n/t,-1)}function Ah(n,e){if(e.constructor===Float32Array)return n;const t=sl(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(n*t)}const Xn={DEG2RAD:Is,RAD2DEG:Vs,generateUUID:zi,clamp:ot,euclideanModulo:il,mapLinear:Ed,inverseLerp:Td,lerp:Fs,damp:wd,pingpong:Ad,smoothstep:Rd,smootherstep:Cd,randInt:Pd,randFloat:Ld,randFloatSpread:Dd,seededRandom:Id,degToRad:Fd,radToDeg:Nd,isPowerOfTwo:Ud,ceilPowerOfTwo:Od,floorPowerOfTwo:Th,setQuaternionFromProperEuler:Bd,normalize:Ah,denormalize:wh},Ml=class Ml{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ot(this.x,e.x,t.x),this.y=ot(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ot(this.x,e,t),this.y=ot(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ot(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ot(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Ml.prototype.isVector2=!0;let ve=Ml;class sn{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],h=i[s+2],d=i[s+3],u=r[a+0],f=r[a+1],g=r[a+2],b=r[a+3];if(d!==b||l!==u||c!==f||h!==g){let m=l*u+c*f+h*g+d*b;m<0&&(u=-u,f=-f,g=-g,b=-b,m=-m);let p=1-o;if(m<.9995){const v=Math.acos(m),E=Math.sin(v);p=Math.sin(p*v)/E,o=Math.sin(o*v)/E,l=l*p+u*o,c=c*p+f*o,h=h*p+g*o,d=d*p+b*o}else{l=l*p+u*o,c=c*p+f*o,h=h*p+g*o,d=d*p+b*o;const v=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=v,c*=v,h*=v,d*=v}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],h=i[s+3],d=r[a],u=r[a+1],f=r[a+2],g=r[a+3];return e[t]=o*g+h*d+l*f-c*u,e[t+1]=l*g+h*u+c*d-o*f,e[t+2]=c*g+h*f+o*u-l*d,e[t+3]=h*g-o*d-l*u-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(s/2),d=o(r/2),u=l(i/2),f=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"YZX":this._x=u*h*d+c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d-u*f*g;break;case"XZY":this._x=u*h*d-c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d+u*f*g;break;default:Je("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],d=t[10],u=i+o+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(i>o&&i>d){const f=2*Math.sqrt(1+i-o-d);this._w=(h-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>d){const f=2*Math.sqrt(1+o-i-d);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+d-i-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ot(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-i*c,this._z=r*h+a*c+i*l-s*o,this._w=a*h-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const xl=class xl{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Wl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Wl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),h=2*(o*t-r*s),d=2*(r*i-a*t);return this.x=t+l*c+a*d-o*h,this.y=i+l*h+o*c-r*d,this.z=s+l*d+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ot(this.x,e.x,t.x),this.y=ot(this.y,e.y,t.y),this.z=ot(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ot(this.x,e,t),this.y=ot(this.y,e,t),this.z=ot(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ot(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ua.copy(this).projectOnVector(e),this.sub(ua)}reflect(e){return this.sub(ua.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ot(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};xl.prototype.isVector3=!0;let F=xl;const ua=new F,Wl=new sn,Sl=class Sl{constructor(e,t,i,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],d=i[7],u=i[2],f=i[5],g=i[8],b=s[0],m=s[3],p=s[6],v=s[1],E=s[4],S=s[7],R=s[2],T=s[5],_=s[8];return r[0]=a*b+o*v+l*R,r[3]=a*m+o*E+l*T,r[6]=a*p+o*S+l*_,r[1]=c*b+h*v+d*R,r[4]=c*m+h*E+d*T,r[7]=c*p+h*S+d*_,r[2]=u*b+f*v+g*R,r[5]=u*m+f*E+g*T,r[8]=u*p+f*S+g*_,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-i*r*h+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=h*a-o*c,u=o*l-h*r,f=c*r-a*l,g=t*d+i*u+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const b=1/g;return e[0]=d*b,e[1]=(s*c-h*i)*b,e[2]=(o*i-s*a)*b,e[3]=u*b,e[4]=(h*t-s*l)*b,e[5]=(s*r-o*t)*b,e[6]=f*b,e[7]=(i*l-c*t)*b,e[8]=(a*t-i*r)*b,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Or("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(da.makeScale(e,t)),this}rotate(e){return Or("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(da.makeRotation(-e)),this}translate(e,t){return Or("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(da.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Sl.prototype.isMatrix3=!0;let je=Sl;const da=new je,Xl=new je().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),$l=new je().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function kd(){const n={enabled:!0,workingColorSpace:Xr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===bt&&(s.r=hi(s.r),s.g=hi(s.g),s.b=hi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===bt&&(s.r=cs(s.r),s.g=cs(s.g),s.b=cs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Mi?$r:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Xr]:{primaries:e,whitePoint:i,transfer:$r,toXYZ:Xl,fromXYZ:$l,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:rn},outputColorSpaceConfig:{drawingBufferColorSpace:rn}},[rn]:{primaries:e,whitePoint:i,transfer:bt,toXYZ:Xl,fromXYZ:$l,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:rn}}}),n}const dt=kd();function hi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function cs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Hi;class zd{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Hi===void 0&&(Hi=qr("canvas")),Hi.width=e.width,Hi.height=e.height;const s=Hi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Hi}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=qr("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=hi(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(hi(t[i]/255)*255):t[i]=hi(t[i]);return{data:t,width:e.width,height:e.height}}else return Je("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Gd=0;class rl{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Gd++}),this.uuid=zi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(fa(s[a].image)):r.push(fa(s[a]))}else r=fa(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function fa(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?zd.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Je("Texture: Unable to serialize Texture."),{})}let Hd=0;const pa=new F;class dn extends wi{constructor(e=dn.DEFAULT_IMAGE,t=dn.DEFAULT_MAPPING,i=li,s=li,r=En,a=Si,o=Kn,l=Rn,c=dn.DEFAULT_ANISOTROPY,h=Mi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Hd++}),this.uuid=zi(),this.name="",this.source=new rl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ve(0,0),this.repeat=new ve(1,1),this.center=new ve(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new je,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(pa).x}get height(){return this.source.getSize(pa).y}get depth(){return this.source.getSize(pa).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Je(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Je(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==fh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case io:e.x=e.x-Math.floor(e.x);break;case li:e.x=e.x<0?0:1;break;case so:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case io:e.y=e.y-Math.floor(e.y);break;case li:e.y=e.y<0?0:1;break;case so:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}dn.DEFAULT_IMAGE=null;dn.DEFAULT_MAPPING=fh;dn.DEFAULT_ANISOTROPY=1;const yl=class yl{constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],g=l[9],b=l[2],m=l[6],p=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-b)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+b)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const E=(c+1)/2,S=(f+1)/2,R=(p+1)/2,T=(h+u)/4,_=(d+b)/4,y=(g+m)/4;return E>S&&E>R?E<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(E),s=T/i,r=_/i):S>R?S<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),i=T/s,r=y/s):R<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),i=_/r,s=y/r),this.set(i,s,r,t),this}let v=Math.sqrt((m-g)*(m-g)+(d-b)*(d-b)+(u-h)*(u-h));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(d-b)/v,this.z=(u-h)/v,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ot(this.x,e.x,t.x),this.y=ot(this.y,e.y,t.y),this.z=ot(this.z,e.z,t.z),this.w=ot(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ot(this.x,e,t),this.y=ot(this.y,e,t),this.z=ot(this.z,e,t),this.w=ot(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ot(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};yl.prototype.isVector4=!0;let kt=yl;class Vd extends wi{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:En,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new kt(0,0,e,t),this.scissorTest=!1,this.viewport=new kt(0,0,e,t),this.textures=[];const s=i.count;for(let r=0;r<s;r++)this.textures[r]=new dn({width:e,height:t,depth:i.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:En,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new rl(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Jn extends Vd{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Rh extends dn{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=an,this.minFilter=an,this.wrapR=li,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Wd extends dn{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=an,this.minFilter=an,this.wrapR=li,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const Kr=class Kr{constructor(e,t,i,s,r,a,o,l,c,h,d,u,f,g,b,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,h,d,u,f,g,b,m)}set(e,t,i,s,r,a,o,l,c,h,d,u,f,g,b,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=g,p[11]=b,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Kr().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,s=1/Vi.setFromMatrixColumn(e,0).length(),r=1/Vi.setFromMatrixColumn(e,1).length(),a=1/Vi.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const u=a*h,f=a*d,g=o*h,b=o*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=f+g*c,t[5]=u-b*c,t[9]=-o*l,t[2]=b-u*c,t[6]=g+f*c,t[10]=a*l}else if(e.order==="YXZ"){const u=l*h,f=l*d,g=c*h,b=c*d;t[0]=u+b*o,t[4]=g*o-f,t[8]=a*c,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=f*o-g,t[6]=b+u*o,t[10]=a*l}else if(e.order==="ZXY"){const u=l*h,f=l*d,g=c*h,b=c*d;t[0]=u-b*o,t[4]=-a*d,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*h,t[9]=b-u*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const u=a*h,f=a*d,g=o*h,b=o*d;t[0]=l*h,t[4]=g*c-f,t[8]=u*c+b,t[1]=l*d,t[5]=b*c+u,t[9]=f*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const u=a*l,f=a*c,g=o*l,b=o*c;t[0]=l*h,t[4]=b-u*d,t[8]=g*d+f,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*d+g,t[10]=u-b*d}else if(e.order==="XZY"){const u=a*l,f=a*c,g=o*l,b=o*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=u*d+b,t[5]=a*h,t[9]=f*d-g,t[2]=g*d-f,t[6]=o*h,t[10]=b*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Xd,e,$d)}lookAt(e,t,i){const s=this.elements;return Tn.subVectors(e,t),Tn.lengthSq()===0&&(Tn.z=1),Tn.normalize(),di.crossVectors(i,Tn),di.lengthSq()===0&&(Math.abs(i.z)===1?Tn.x+=1e-4:Tn.z+=1e-4,Tn.normalize(),di.crossVectors(i,Tn)),di.normalize(),or.crossVectors(Tn,di),s[0]=di.x,s[4]=or.x,s[8]=Tn.x,s[1]=di.y,s[5]=or.y,s[9]=Tn.y,s[2]=di.z,s[6]=or.z,s[10]=Tn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],d=i[5],u=i[9],f=i[13],g=i[2],b=i[6],m=i[10],p=i[14],v=i[3],E=i[7],S=i[11],R=i[15],T=s[0],_=s[4],y=s[8],C=s[12],A=s[1],D=s[5],O=s[9],X=s[13],L=s[2],$=s[6],J=s[10],G=s[14],he=s[3],Z=s[7],ae=s[11],le=s[15];return r[0]=a*T+o*A+l*L+c*he,r[4]=a*_+o*D+l*$+c*Z,r[8]=a*y+o*O+l*J+c*ae,r[12]=a*C+o*X+l*G+c*le,r[1]=h*T+d*A+u*L+f*he,r[5]=h*_+d*D+u*$+f*Z,r[9]=h*y+d*O+u*J+f*ae,r[13]=h*C+d*X+u*G+f*le,r[2]=g*T+b*A+m*L+p*he,r[6]=g*_+b*D+m*$+p*Z,r[10]=g*y+b*O+m*J+p*ae,r[14]=g*C+b*X+m*G+p*le,r[3]=v*T+E*A+S*L+R*he,r[7]=v*_+E*D+S*$+R*Z,r[11]=v*y+E*O+S*J+R*ae,r[15]=v*C+E*X+S*G+R*le,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],d=e[6],u=e[10],f=e[14],g=e[3],b=e[7],m=e[11],p=e[15],v=l*f-c*u,E=o*f-c*d,S=o*u-l*d,R=a*f-c*h,T=a*u-l*h,_=a*d-o*h;return t*(b*v-m*E+p*S)-i*(g*v-m*R+p*T)+s*(g*E-b*R+p*_)-r*(g*S-b*T+m*_)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-i*(r*h-o*l)+s*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=e[9],u=e[10],f=e[11],g=e[12],b=e[13],m=e[14],p=e[15],v=t*o-i*a,E=t*l-s*a,S=t*c-r*a,R=i*l-s*o,T=i*c-r*o,_=s*c-r*l,y=h*b-d*g,C=h*m-u*g,A=h*p-f*g,D=d*m-u*b,O=d*p-f*b,X=u*p-f*m,L=v*X-E*O+S*D+R*A-T*C+_*y;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const $=1/L;return e[0]=(o*X-l*O+c*D)*$,e[1]=(s*O-i*X-r*D)*$,e[2]=(b*_-m*T+p*R)*$,e[3]=(u*T-d*_-f*R)*$,e[4]=(l*A-a*X-c*C)*$,e[5]=(t*X-s*A+r*C)*$,e[6]=(m*S-g*_-p*E)*$,e[7]=(h*_-u*S+f*E)*$,e[8]=(a*O-o*A+c*y)*$,e[9]=(i*A-t*O-r*y)*$,e[10]=(g*T-b*S+p*v)*$,e[11]=(d*S-h*T-f*v)*$,e[12]=(o*C-a*D-l*y)*$,e[13]=(t*D-i*C+s*y)*$,e[14]=(b*E-g*R-m*v)*$,e[15]=(h*R-d*E+u*v)*$,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+i,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,d=o+o,u=r*c,f=r*h,g=r*d,b=a*h,m=a*d,p=o*d,v=l*c,E=l*h,S=l*d,R=i.x,T=i.y,_=i.z;return s[0]=(1-(b+p))*R,s[1]=(f+S)*R,s[2]=(g-E)*R,s[3]=0,s[4]=(f-S)*T,s[5]=(1-(u+p))*T,s[6]=(m+v)*T,s[7]=0,s[8]=(g+E)*_,s[9]=(m-v)*_,s[10]=(1-(u+b))*_,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let a=Vi.set(s[0],s[1],s[2]).length();const o=Vi.set(s[4],s[5],s[6]).length(),l=Vi.set(s[8],s[9],s[10]).length();r<0&&(a=-a),In.copy(this);const c=1/a,h=1/o,d=1/l;return In.elements[0]*=c,In.elements[1]*=c,In.elements[2]*=c,In.elements[4]*=h,In.elements[5]*=h,In.elements[6]*=h,In.elements[8]*=d,In.elements[9]*=d,In.elements[10]*=d,t.setFromRotationMatrix(In),i.x=a,i.y=o,i.z=l,this}makePerspective(e,t,i,s,r,a,o=zn,l=!1){const c=this.elements,h=2*r/(t-e),d=2*r/(i-s),u=(t+e)/(t-e),f=(i+s)/(i-s);let g,b;if(l)g=r/(a-r),b=a*r/(a-r);else if(o===zn)g=-(a+r)/(a-r),b=-2*a*r/(a-r);else if(o===Hs)g=-a/(a-r),b=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=b,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=zn,l=!1){const c=this.elements,h=2/(t-e),d=2/(i-s),u=-(t+e)/(t-e),f=-(i+s)/(i-s);let g,b;if(l)g=1/(a-r),b=a/(a-r);else if(o===zn)g=-2/(a-r),b=-(a+r)/(a-r);else if(o===Hs)g=-1/(a-r),b=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=b,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};Kr.prototype.isMatrix4=!0;let It=Kr;const Vi=new F,In=new It,Xd=new F(0,0,0),$d=new F(1,1,1),di=new F,or=new F,Tn=new F,ql=new It,Yl=new sn;class bn{constructor(e=0,t=0,i=0,s=bn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(ot(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ot(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(ot(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ot(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ot(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-ot(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Je("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return ql.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ql,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Yl.setFromEuler(this),this.setFromQuaternion(Yl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}bn.DEFAULT_ORDER="XYZ";class al{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let qd=0;const Zl=new F,Wi=new sn,ni=new It,lr=new F,vs=new F,Yd=new F,Zd=new sn,Kl=new F(1,0,0),Jl=new F(0,1,0),Ql=new F(0,0,1),jl={type:"added"},Kd={type:"removed"},Xi={type:"childadded",child:null},ma={type:"childremoved",child:null};class on extends wi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qd++}),this.uuid=zi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=on.DEFAULT_UP.clone();const e=new F,t=new bn,i=new sn,s=new F(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new It},normalMatrix:{value:new je}}),this.matrix=new It,this.matrixWorld=new It,this.matrixAutoUpdate=on.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=on.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new al,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Wi.setFromAxisAngle(e,t),this.quaternion.multiply(Wi),this}rotateOnWorldAxis(e,t){return Wi.setFromAxisAngle(e,t),this.quaternion.premultiply(Wi),this}rotateX(e){return this.rotateOnAxis(Kl,e)}rotateY(e){return this.rotateOnAxis(Jl,e)}rotateZ(e){return this.rotateOnAxis(Ql,e)}translateOnAxis(e,t){return Zl.copy(e).applyQuaternion(this.quaternion),this.position.add(Zl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Kl,e)}translateY(e){return this.translateOnAxis(Jl,e)}translateZ(e){return this.translateOnAxis(Ql,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ni.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?lr.copy(e):lr.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),vs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ni.lookAt(vs,lr,this.up):ni.lookAt(lr,vs,this.up),this.quaternion.setFromRotationMatrix(ni),s&&(ni.extractRotation(s.matrixWorld),Wi.setFromRotationMatrix(ni),this.quaternion.premultiply(Wi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(mt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(jl),Xi.child=e,this.dispatchEvent(Xi),Xi.child=null):mt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Kd),ma.child=e,this.dispatchEvent(ma),ma.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ni.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ni.multiply(e.parent.matrixWorld)),e.applyMatrix4(ni),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(jl),Xi.child=e,this.dispatchEvent(Xi),Xi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vs,e,Yd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vs,Zd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),d=a(e.shapes),u=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),d.length>0&&(i.shapes=d),u.length>0&&(i.skeletons=u),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}on.DEFAULT_UP=new F(0,1,0);on.DEFAULT_MATRIX_AUTO_UPDATE=!0;on.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Gt extends on{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Jd={type:"move"};class ga{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Gt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Gt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new F,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new F),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Gt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new F,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new F,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const b of e.hand.values()){const m=t.getJointPose(b,i),p=this._getHandJoint(c,b);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.quaternion,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&u>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Jd)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Gt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const Ch={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},fi={h:0,s:0,l:0},cr={h:0,s:0,l:0};function _a(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class ct{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=rn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,dt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=dt.workingColorSpace){return this.r=e,this.g=t,this.b=i,dt.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=dt.workingColorSpace){if(e=il(e,1),t=ot(t,0,1),i=ot(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=_a(a,r,e+1/3),this.g=_a(a,r,e),this.b=_a(a,r,e-1/3)}return dt.colorSpaceToWorking(this,s),this}setStyle(e,t=rn){function i(r){r!==void 0&&parseFloat(r)<1&&Je("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,t);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Je("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Je("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=rn){const i=Ch[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Je("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=hi(e.r),this.g=hi(e.g),this.b=hi(e.b),this}copyLinearToSRGB(e){return this.r=cs(e.r),this.g=cs(e.g),this.b=cs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=rn){return dt.workingToColorSpace(un.copy(this),e),Math.round(ot(un.r*255,0,255))*65536+Math.round(ot(un.g*255,0,255))*256+Math.round(ot(un.b*255,0,255))}getHexString(e=rn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=dt.workingColorSpace){dt.workingToColorSpace(un.copy(this),t);const i=un.r,s=un.g,r=un.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case i:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-i)/d+2;break;case r:l=(i-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=dt.workingColorSpace){return dt.workingToColorSpace(un.copy(this),t),e.r=un.r,e.g=un.g,e.b=un.b,e}getStyle(e=rn){dt.workingToColorSpace(un.copy(this),e);const t=un.r,i=un.g,s=un.b;return e!==rn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(fi),this.setHSL(fi.h+e,fi.s+t,fi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(fi),e.getHSL(cr);const i=Fs(fi.h,cr.h,t),s=Fs(fi.s,cr.s,t),r=Fs(fi.l,cr.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const un=new ct;ct.NAMES=Ch;class ol{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new ct(e),this.near=t,this.far=i}clone(){return new ol(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Qd extends on{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new bn,this.environmentIntensity=1,this.environmentRotation=new bn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Fn=new F,ii=new F,va=new F,si=new F,$i=new F,qi=new F,ec=new F,Ma=new F,xa=new F,Sa=new F,ya=new kt,ba=new kt,Ea=new kt;class kn{constructor(e=new F,t=new F,i=new F){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Fn.subVectors(e,t),s.cross(Fn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){Fn.subVectors(s,t),ii.subVectors(i,t),va.subVectors(e,t);const a=Fn.dot(Fn),o=Fn.dot(ii),l=Fn.dot(va),c=ii.dot(ii),h=ii.dot(va),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;const u=1/d,f=(c*l-o*h)*u,g=(a*h-o*l)*u;return r.set(1-f-g,g,f)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,si)===null?!1:si.x>=0&&si.y>=0&&si.x+si.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,si)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,si.x),l.addScaledVector(a,si.y),l.addScaledVector(o,si.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return ya.setScalar(0),ba.setScalar(0),Ea.setScalar(0),ya.fromBufferAttribute(e,t),ba.fromBufferAttribute(e,i),Ea.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(ya,r.x),a.addScaledVector(ba,r.y),a.addScaledVector(Ea,r.z),a}static isFrontFacing(e,t,i,s){return Fn.subVectors(i,t),ii.subVectors(e,t),Fn.cross(ii).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Fn.subVectors(this.c,this.b),ii.subVectors(this.a,this.b),Fn.cross(ii).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return kn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return kn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return kn.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return kn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return kn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;$i.subVectors(s,i),qi.subVectors(r,i),Ma.subVectors(e,i);const l=$i.dot(Ma),c=qi.dot(Ma);if(l<=0&&c<=0)return t.copy(i);xa.subVectors(e,s);const h=$i.dot(xa),d=qi.dot(xa);if(h>=0&&d<=h)return t.copy(s);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0&&l-h>0)return a=l/(l-h),t.copy(i).addScaledVector($i,a);Sa.subVectors(e,r);const f=$i.dot(Sa),g=qi.dot(Sa);if(g>=0&&f<=g)return t.copy(r);const b=f*c-l*g;if(b<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(i).addScaledVector(qi,o);const m=h*g-f*d;if(m<=0&&d-h>=0&&f-g>=0)return ec.subVectors(r,s),o=(d-h)/(d-h+(f-g)),t.copy(s).addScaledVector(ec,o);const p=1/(m+b+u);return a=b*p,o=u*p,t.copy(i).addScaledVector($i,a).addScaledVector(qi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Ks{constructor(e=new F(1/0,1/0,1/0),t=new F(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Nn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Nn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Nn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Nn):Nn.fromBufferAttribute(r,a),Nn.applyMatrix4(e.matrixWorld),this.expandByPoint(Nn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),hr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),hr.copy(i.boundingBox)),hr.applyMatrix4(e.matrixWorld),this.union(hr)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Nn),Nn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ms),ur.subVectors(this.max,Ms),Yi.subVectors(e.a,Ms),Zi.subVectors(e.b,Ms),Ki.subVectors(e.c,Ms),pi.subVectors(Zi,Yi),mi.subVectors(Ki,Zi),Ci.subVectors(Yi,Ki);let t=[0,-pi.z,pi.y,0,-mi.z,mi.y,0,-Ci.z,Ci.y,pi.z,0,-pi.x,mi.z,0,-mi.x,Ci.z,0,-Ci.x,-pi.y,pi.x,0,-mi.y,mi.x,0,-Ci.y,Ci.x,0];return!Ta(t,Yi,Zi,Ki,ur)||(t=[1,0,0,0,1,0,0,0,1],!Ta(t,Yi,Zi,Ki,ur))?!1:(dr.crossVectors(pi,mi),t=[dr.x,dr.y,dr.z],Ta(t,Yi,Zi,Ki,ur))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Nn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Nn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ri[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ri[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ri[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ri[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ri[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ri[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ri[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ri[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ri),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const ri=[new F,new F,new F,new F,new F,new F,new F,new F],Nn=new F,hr=new Ks,Yi=new F,Zi=new F,Ki=new F,pi=new F,mi=new F,Ci=new F,Ms=new F,ur=new F,dr=new F,Pi=new F;function Ta(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){Pi.fromArray(n,r);const o=s.x*Math.abs(Pi.x)+s.y*Math.abs(Pi.y)+s.z*Math.abs(Pi.z),l=e.dot(Pi),c=t.dot(Pi),h=i.dot(Pi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Xt=new F,fr=new ve;let jd=0;class Ni extends wi{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:jd++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Md,this.updateRanges=[],this.gpuType=Zn,this.version=0,this._normalizationScale=e!==void 0?sl(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)fr.fromBufferAttribute(this,t),fr.applyMatrix3(e),this.setXY(t,fr.x,fr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Xt.fromBufferAttribute(this,t),Xt.applyMatrix3(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Xt.fromBufferAttribute(this,t),Xt.applyMatrix4(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Xt.fromBufferAttribute(this,t),Xt.applyNormalMatrix(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Xt.fromBufferAttribute(this,t),Xt.transformDirection(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){const t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):wh(e,this.array)}_normalize(e){const t=this._normalizationScale;return t!==void 0?Math.round(e*t):Ah(e,this.array)}}class Ph extends Ni{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Lh extends Ni{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class _t extends Ni{constructor(e,t,i){super(new Float32Array(e),t,i)}}const ef=new Ks,xs=new F,wa=new F;class ll{constructor(e=new F,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):ef.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;xs.subVectors(e,this.center);const t=xs.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(xs,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(wa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(xs.copy(e.center).add(wa)),this.expandByPoint(xs.copy(e.center).sub(wa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let tf=0;const Cn=new It,Aa=new on,Ji=new F,wn=new Ks,Ss=new Ks,en=new F;class vn extends wi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:tf++}),this.uuid=zi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(xd(e)?Lh:Ph)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new je().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Cn.makeRotationFromQuaternion(e),this.applyMatrix4(Cn),this}rotateX(e){return Cn.makeRotationX(e),this.applyMatrix4(Cn),this}rotateY(e){return Cn.makeRotationY(e),this.applyMatrix4(Cn),this}rotateZ(e){return Cn.makeRotationZ(e),this.applyMatrix4(Cn),this}translate(e,t,i){return Cn.makeTranslation(e,t,i),this.applyMatrix4(Cn),this}scale(e,t,i){return Cn.makeScale(e,t,i),this.applyMatrix4(Cn),this}lookAt(e){return Aa.lookAt(e),Aa.updateMatrix(),this.applyMatrix4(Aa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ji).negate(),this.translate(Ji.x,Ji.y,Ji.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new _t(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Je("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ks);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){mt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new F(-1/0,-1/0,-1/0),new F(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];wn.setFromBufferAttribute(r),this.morphTargetsRelative?(en.addVectors(this.boundingBox.min,wn.min),this.boundingBox.expandByPoint(en),en.addVectors(this.boundingBox.max,wn.max),this.boundingBox.expandByPoint(en)):(this.boundingBox.expandByPoint(wn.min),this.boundingBox.expandByPoint(wn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&mt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ll);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){mt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new F,1/0);return}if(e){const i=this.boundingSphere.center;if(wn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Ss.setFromBufferAttribute(o),this.morphTargetsRelative?(en.addVectors(wn.min,Ss.min),wn.expandByPoint(en),en.addVectors(wn.max,Ss.max),wn.expandByPoint(en)):(wn.expandByPoint(Ss.min),wn.expandByPoint(Ss.max))}wn.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)en.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(en));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)en.fromBufferAttribute(o,c),l&&(Ji.fromBufferAttribute(e,c),en.add(Ji)),s=Math.max(s,i.distanceToSquared(en))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&mt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){mt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new Ni(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],l=[],c=new Uint8Array(i.count);for(let C=0;C<i.count;C++)o[C]=new F,l[C]=new F;const h=new F,d=new F,u=new F,f=new ve,g=new ve,b=new ve,m=new F,p=new F;function v(C,A,D){c[C]=c[A]=c[D]=1,h.fromBufferAttribute(i,C),d.fromBufferAttribute(i,A),u.fromBufferAttribute(i,D),f.fromBufferAttribute(r,C),g.fromBufferAttribute(r,A),b.fromBufferAttribute(r,D),d.sub(h),u.sub(h),g.sub(f),b.sub(f);const O=1/(g.x*b.y-b.x*g.y);isFinite(O)&&(m.copy(d).multiplyScalar(b.y).addScaledVector(u,-g.y).multiplyScalar(O),p.copy(u).multiplyScalar(g.x).addScaledVector(d,-b.x).multiplyScalar(O),o[C].add(m),o[A].add(m),o[D].add(m),l[C].add(p),l[A].add(p),l[D].add(p))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let C=0,A=E.length;C<A;++C){const D=E[C],O=D.start,X=D.count;for(let L=O,$=O+X;L<$;L+=3)v(e.getX(L+0),e.getX(L+1),e.getX(L+2))}const S=new F,R=new F,T=new F,_=new F;function y(C){T.fromBufferAttribute(s,C),_.copy(T);const A=o[C];S.copy(A),S.sub(T.multiplyScalar(T.dot(A))).normalize(),R.crossVectors(_,A);const O=R.dot(l[C])<0?-1:1;a.setXYZW(C,S.x,S.y,S.z,O)}for(let C=0,A=i.count;C<A;++C)c[C]&&y(C);this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new Ni(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let u=0,f=i.count;u<f;u++)i.setXYZ(u,0,0,0);const s=new F,r=new F,a=new F,o=new F,l=new F,c=new F,h=new F,d=new F;if(e)for(let u=0,f=e.count;u<f;u+=3){const g=e.getX(u+0),b=e.getX(u+1),m=e.getX(u+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,b),a.fromBufferAttribute(t,m),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,b),c.fromBufferAttribute(i,m),o.add(h),l.add(h),c.add(h),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(b,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,f=t.count;u<f;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)en.fromBufferAttribute(e,t),en.normalize(),e.setXYZ(t,en.x,en.y,en.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h);let f=0,g=0;for(let b=0,m=l.length;b<m;b++){o.isInterleavedBufferAttribute?f=l[b]*o.data.stride+o.offset:f=l[b]*h;for(let p=0;p<h;p++)u[g++]=c[f++]}return new Ni(u,h,d)}if(this.index===null)return Je("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new vn,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){const u=c[h],f=e(u,i);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const f=c[d];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ra=new F,nf=new F,sf=new je;class oi{constructor(e=new F(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Ra.subVectors(i,t).cross(nf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const s=e.delta(Ra),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||sf.getNormalMatrix(e),s=this.coplanarPoint(Ra).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let rf=0;class Js extends wi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:rf++}),this.uuid=zi(),this.name="",this.type="Material",this.blending=Ds,this.side=Oi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=sh,this.blendDst=rh,this.blendEquation=ns,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ct(0,0,0),this.blendAlpha=0,this.depthFunc=ks,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=fd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ha,this.stencilZFail=ha,this.stencilZPass=ha,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Je(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Je(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(i.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(i.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(i.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(i.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new ct().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new oi().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new ve().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ve().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const ai=new F,Ca=new F,pr=new F,mr=new F;class cl{constructor(e=new F,t=new F(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ai)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ai.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ai.copy(this.origin).addScaledVector(this.direction,t),ai.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Ca.copy(e).add(t).multiplyScalar(.5),pr.copy(t).sub(e).normalize(),mr.copy(this.origin).sub(Ca);const r=e.distanceTo(t)*.5,a=-this.direction.dot(pr),o=mr.dot(this.direction),l=-mr.dot(pr),c=mr.lengthSq(),h=Math.abs(1-a*a);let d,u,f,g;if(h>0)if(d=a*l-o,u=a*o-l,g=r*h,d>=0)if(u>=-g)if(u<=g){const b=1/h;d*=b,u*=b,f=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Ca).addScaledVector(pr,u),f}intersectSphere(e,t){if(e.radius<0)return null;ai.subVectors(e.center,this.origin);const i=ai.dot(this.direction),s=ai.dot(ai)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(i=(e.min.x-u.x)*c,s=(e.max.x-u.x)*c):(i=(e.max.x-u.x)*c,s=(e.min.x-u.x)*c),h>=0?(r=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(e.min.z-u.z)*d,l=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,l=(e.min.z-u.z)*d),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,ai)!==null}intersectTriangle(e,t,i,s,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,d=e.x-a.x,u=e.y-a.y,f=e.z-a.z,g=t.x-a.x,b=t.y-a.y,m=t.z-a.z,p=i.x-a.x,v=i.y-a.y,E=i.z-a.z,S=Math.abs(l),R=Math.abs(c),T=Math.abs(h);let _,y,C,A,D,O,X,L,$,J,G,he;if(S>=R&&S>=T?(C=l,O=d,$=g,he=p,l>=0?(_=c,y=h,A=u,D=f,X=b,L=m,J=v,G=E):(_=h,y=c,A=f,D=u,X=m,L=b,J=E,G=v)):R>=T?(C=c,O=u,$=b,he=v,c>=0?(_=h,y=l,A=f,D=d,X=m,L=g,J=E,G=p):(_=l,y=h,A=d,D=f,X=g,L=m,J=p,G=E)):(C=h,O=f,$=m,he=E,h>=0?(_=l,y=c,A=d,D=u,X=g,L=b,J=p,G=v):(_=c,y=l,A=u,D=d,X=b,L=g,J=v,G=p)),C===0)return null;const Z=_/C,ae=y/C,le=1/C,Ue=A-Z*O,qe=D-ae*O,ne=X-Z*$,fe=L-ae*$,Ne=J-Z*he,We=G-ae*he,Ce=Ne*fe-We*ne,Xe=Ue*We-qe*Ne,yt=ne*qe-fe*Ue;if(s){if(Ce<0||Xe<0||yt<0)return null}else if((Ce<0||Xe<0||yt<0)&&(Ce>0||Xe>0||yt>0))return null;const U=Ce+Xe+yt;if(U===0)return null;const k=le*(Ce*O+Xe*$+yt*he);return(U>0?k<0:k>0)?null:this.at(k/U,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class is extends Js{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ct(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.combine=ah,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const tc=new It,Li=new cl,gr=new ll,nc=new F,_r=new F,vr=new F,Mr=new F,Pa=new F,xr=new F,ic=new F,Sr=new F;class qt extends on{constructor(e=new vn,t=new is){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){xr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],d=r[l];h!==0&&(Pa.fromBufferAttribute(d,e),a?xr.addScaledVector(Pa,h):xr.addScaledVector(Pa.sub(t),h))}t.add(xr)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),gr.copy(i.boundingSphere),gr.applyMatrix4(r),Li.copy(e.ray).recast(e.near),!(gr.containsPoint(Li.origin)===!1&&(Li.intersectSphere(gr,nc)===null||Li.origin.distanceToSquared(nc)>(e.far-e.near)**2))&&(tc.copy(r).invert(),Li.copy(e.ray).applyMatrix4(tc),!(i.boundingBox!==null&&Li.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Li)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,b=u.length;g<b;g++){const m=u[g],p=a[m.materialIndex],v=Math.max(m.start,f.start),E=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let S=v,R=E;S<R;S+=3){const T=o.getX(S),_=o.getX(S+1),y=o.getX(S+2);s=yr(this,p,e,i,c,h,d,T,_,y),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),b=Math.min(o.count,f.start+f.count);for(let m=g,p=b;m<p;m+=3){const v=o.getX(m),E=o.getX(m+1),S=o.getX(m+2);s=yr(this,a,e,i,c,h,d,v,E,S),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,b=u.length;g<b;g++){const m=u[g],p=a[m.materialIndex],v=Math.max(m.start,f.start),E=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let S=v,R=E;S<R;S+=3){const T=S,_=S+1,y=S+2;s=yr(this,p,e,i,c,h,d,T,_,y),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),b=Math.min(l.count,f.start+f.count);for(let m=g,p=b;m<p;m+=3){const v=m,E=m+1,S=m+2;s=yr(this,a,e,i,c,h,d,v,E,S),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function af(n,e,t,i,s,r,a,o){let l;if(e.side===_n?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===Oi,o),l===null)return null;Sr.copy(o),Sr.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Sr);return c<t.near||c>t.far?null:{distance:c,point:Sr.clone(),object:n}}function yr(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,_r),n.getVertexPosition(l,vr),n.getVertexPosition(c,Mr);const h=af(n,e,t,i,_r,vr,Mr,ic);if(h){const d=new F;kn.getBarycoord(ic,_r,vr,Mr,d),s&&(h.uv=kn.getInterpolatedAttribute(s,o,l,c,d,new ve)),r&&(h.uv1=kn.getInterpolatedAttribute(r,o,l,c,d,new ve)),a&&(h.normal=kn.getInterpolatedAttribute(a,o,l,c,d,new F),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new F,materialIndex:0};kn.getNormal(_r,vr,Mr,u.normal),h.face=u,h.barycoord=d}return h}class of extends dn{constructor(e=null,t=1,i=1,s,r,a,o,l,c=an,h=an,d,u){super(null,a,o,l,c,h,s,r,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Di=new ll,lf=new ve(.5,.5),br=new F;class Ws{constructor(e=new oi,t=new oi,i=new oi,s=new oi,r=new oi,a=new oi){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=zn,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],f=r[7],g=r[8],b=r[9],m=r[10],p=r[11],v=r[12],E=r[13],S=r[14],R=r[15];if(s[0].setComponents(c-a,f-h,p-g,R-v).normalize(),s[1].setComponents(c+a,f+h,p+g,R+v).normalize(),s[2].setComponents(c+o,f+d,p+b,R+E).normalize(),s[3].setComponents(c-o,f-d,p-b,R-E).normalize(),i)s[4].setComponents(l,u,m,S).normalize(),s[5].setComponents(c-l,f-u,p-m,R-S).normalize();else if(s[4].setComponents(c-l,f-u,p-m,R-S).normalize(),t===zn)s[5].setComponents(c+l,f+u,p+m,R+S).normalize();else if(t===Hs)s[5].setComponents(l,u,m,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Di.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Di.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Di)}intersectsSprite(e){Di.center.set(0,0,0);const t=lf.distanceTo(e.center);return Di.radius=.7071067811865476+t,Di.applyMatrix4(e.matrixWorld),this.intersectsSphere(Di)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(br.x=s.normal.x>0?e.max.x:e.min.x,br.y=s.normal.y>0?e.max.y:e.min.y,br.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(br)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const sc=new It;class hl{constructor(){this.coordinateSystem=zn,this._frustums=[],this._count=0}setFromArrayCamera(e){const t=e.cameras,i=this._frustums;for(let s=0;s<t.length;s++){const r=t[s];sc.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),i[s]===void 0&&(i[s]=new Ws),i[s].setFromProjectionMatrix(sc,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsObject(e))return!0;return!1}intersectsSprite(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSprite(e))return!0;return!1}intersectsSphere(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSphere(e))return!0;return!1}intersectsBox(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsBox(e))return!0;return!1}containsPoint(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;const t=this._frustums,i=e._frustums;for(let s=0;s<e._count;s++)t[s]===void 0&&(t[s]=new Ws),t[s].copy(i[s]);return this._count=e._count,this}clone(){return new hl().copy(this)}}class Dh extends dn{constructor(e=[],t=us,i,s,r,a,o,l,c,h){super(e,t,i,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ea extends dn{constructor(e,t,i,s,r,a,o,l,c){super(e,t,i,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class fs extends dn{constructor(e,t,i=Qn,s,r,a,o=an,l=an,c,h=Ei,d=1){if(h!==Ei&&h!==yi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:d};super(u,s,r,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new rl(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class Ih extends fs{constructor(e,t=Qn,i=us,s,r,a=an,o=an,l,c=Ei){const h={width:e,height:e,depth:1},d=[h,h,h,h,h,h];super(e,e,t,i,s,r,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Fh extends dn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Gi extends vn{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],d=[];let u=0,f=0;g("z","y","x",-1,-1,i,t,e,a,r,0),g("z","y","x",1,-1,i,t,-e,a,r,1),g("x","z","y",1,1,e,i,t,s,a,2),g("x","z","y",1,-1,e,i,-t,s,a,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new _t(c,3)),this.setAttribute("normal",new _t(h,3)),this.setAttribute("uv",new _t(d,2));function g(b,m,p,v,E,S,R,T,_,y,C){const A=S/_,D=R/y,O=S/2,X=R/2,L=T/2,$=_+1,J=y+1;let G=0,he=0;const Z=new F;for(let ae=0;ae<J;ae++){const le=ae*D-X;for(let Ue=0;Ue<$;Ue++){const qe=Ue*A-O;Z[b]=qe*v,Z[m]=le*E,Z[p]=L,c.push(Z.x,Z.y,Z.z),Z[b]=0,Z[m]=0,Z[p]=T>0?1:-1,h.push(Z.x,Z.y,Z.z),d.push(Ue/_),d.push(1-ae/y),G+=1}}for(let ae=0;ae<y;ae++)for(let le=0;le<_;le++){const Ue=u+le+$*ae,qe=u+le+$*(ae+1),ne=u+(le+1)+$*(ae+1),fe=u+(le+1)+$*ae;l.push(Ue,qe,fe),l.push(qe,ne,fe),he+=6}o.addGroup(f,he,C),f+=he,u+=G}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class ta extends vn{constructor(e=1,t=1,i=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:i,radialSegments:s,heightSegments:r},t=Math.max(0,t),i=Math.max(1,Math.floor(i)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));const a=[],o=[],l=[],c=[],h=t/2,d=Math.PI/2*e,u=t,f=2*d+u,g=i*2+r,b=s+1,m=new F,p=new F;for(let v=0;v<=g;v++){let E=0,S=0,R=0,T=0;if(v<=i){const C=v/i,A=C*Math.PI/2;S=-h-e*Math.cos(A),R=e*Math.sin(A),T=-e*Math.cos(A),E=C*d}else if(v<=i+r){const C=(v-i)/r;S=-h+C*t,R=e,T=0,E=d+C*u}else{const C=(v-i-r)/i,A=C*Math.PI/2;S=h+e*Math.sin(A),R=e*Math.cos(A),T=e*Math.sin(A),E=d+u+C*d}const _=Math.max(0,Math.min(1,E/f));let y=0;v===0?y=.5/s:v===g&&(y=-.5/s);for(let C=0;C<=s;C++){const A=C/s,D=A*Math.PI*2,O=Math.sin(D),X=Math.cos(D);p.x=-R*X,p.y=S,p.z=R*O,o.push(p.x,p.y,p.z),m.set(-R*X,T,R*O),m.normalize(),l.push(m.x,m.y,m.z),c.push(A+y,_)}if(v>0){const C=(v-1)*b;for(let A=0;A<s;A++){const D=C+A,O=C+A+1,X=v*b+A,L=v*b+A+1;a.push(D,O,X),a.push(O,L,X)}}}this.setIndex(a),this.setAttribute("position",new _t(o,3)),this.setAttribute("normal",new _t(l,3)),this.setAttribute("uv",new _t(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ta(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class rs extends vn{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],l=[],c=new F,h=new ve;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,u=3;d<=t;d++,u+=3){const f=i+d/t*s;c.x=e*Math.cos(f),c.y=e*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[u]/e+1)/2,h.y=(a[u+1]/e+1)/2,l.push(h.x,h.y)}for(let d=1;d<=t;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new _t(a,3)),this.setAttribute("normal",new _t(o,3)),this.setAttribute("uv",new _t(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new rs(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class An extends vn{constructor(e=1,t=1,i=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],d=[],u=[],f=[];let g=0;const b=[],m=i/2;let p=0;v(),a===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new _t(d,3)),this.setAttribute("normal",new _t(u,3)),this.setAttribute("uv",new _t(f,2));function v(){const S=new F,R=new F;let T=0;const _=(t-e)/i;for(let y=0;y<=r;y++){const C=[],A=y/r,D=A*(t-e)+e;for(let O=0;O<=s;O++){const X=O/s,L=X*l+o,$=Math.sin(L),J=Math.cos(L);R.x=D*$,R.y=-A*i+m,R.z=D*J,d.push(R.x,R.y,R.z),S.set($,_,J).normalize(),u.push(S.x,S.y,S.z),f.push(X,1-A),C.push(g++)}b.push(C)}for(let y=0;y<s;y++)for(let C=0;C<r;C++){const A=b[C][y],D=b[C+1][y],O=b[C+1][y+1],X=b[C][y+1];(e>0||C!==0)&&(h.push(A,D,X),T+=3),(t>0||C!==r-1)&&(h.push(D,O,X),T+=3)}c.addGroup(p,T,0),p+=T}function E(S){const R=g,T=new ve,_=new F;let y=0;const C=S===!0?e:t,A=S===!0?1:-1;for(let O=1;O<=s;O++)d.push(0,m*A,0),u.push(0,A,0),f.push(.5,.5),g++;const D=g;for(let O=0;O<=s;O++){const L=O/s*l+o,$=Math.cos(L),J=Math.sin(L);_.x=C*J,_.y=m*A,_.z=C*$,d.push(_.x,_.y,_.z),u.push(0,A,0),T.x=$*.5+.5,T.y=J*.5*A+.5,f.push(T.x,T.y),g++}for(let O=0;O<s;O++){const X=R+O,L=D+O;S===!0?h.push(L,L+1,X):h.push(L+1,L,X),y+=3}c.addGroup(p,y,S===!0?1:2),p+=y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new An(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class gn extends An{constructor(e=1,t=1,i=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,i,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new gn(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ul extends vn{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};const r=[],a=[];o(s),c(i),h(),this.setAttribute("position",new _t(r,3)),this.setAttribute("normal",new _t(r.slice(),3)),this.setAttribute("uv",new _t(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const E=new F,S=new F,R=new F;for(let T=0;T<t.length;T+=3)f(t[T+0],E),f(t[T+1],S),f(t[T+2],R),l(E,S,R,v)}function l(v,E,S,R){const T=R+1,_=[];for(let y=0;y<=T;y++){_[y]=[];const C=v.clone().lerp(S,y/T),A=E.clone().lerp(S,y/T),D=T-y;for(let O=0;O<=D;O++)O===0&&y===T?_[y][O]=C:_[y][O]=C.clone().lerp(A,O/D)}for(let y=0;y<T;y++)for(let C=0;C<2*(T-y)-1;C++){const A=Math.floor(C/2);C%2===0?(u(_[y][A+1]),u(_[y+1][A]),u(_[y][A])):(u(_[y][A+1]),u(_[y+1][A+1]),u(_[y+1][A]))}}function c(v){const E=new F;for(let S=0;S<r.length;S+=3)E.x=r[S+0],E.y=r[S+1],E.z=r[S+2],E.normalize().multiplyScalar(v),r[S+0]=E.x,r[S+1]=E.y,r[S+2]=E.z}function h(){const v=new F;for(let E=0;E<r.length;E+=3){v.x=r[E+0],v.y=r[E+1],v.z=r[E+2];const S=m(v)/2/Math.PI+.5,R=p(v)/Math.PI+.5;a.push(S,1-R)}g(),d()}function d(){for(let v=0;v<a.length;v+=6){const E=a[v+0],S=a[v+2],R=a[v+4],T=Math.max(E,S,R),_=Math.min(E,S,R);T>.9&&_<.1&&(E<.2&&(a[v+0]+=1),S<.2&&(a[v+2]+=1),R<.2&&(a[v+4]+=1))}}function u(v){r.push(v.x,v.y,v.z)}function f(v,E){const S=v*3;E.x=e[S+0],E.y=e[S+1],E.z=e[S+2]}function g(){const v=new F,E=new F,S=new F,R=new F,T=new ve,_=new ve,y=new ve;for(let C=0,A=0;C<r.length;C+=9,A+=6){v.set(r[C+0],r[C+1],r[C+2]),E.set(r[C+3],r[C+4],r[C+5]),S.set(r[C+6],r[C+7],r[C+8]),T.set(a[A+0],a[A+1]),_.set(a[A+2],a[A+3]),y.set(a[A+4],a[A+5]),R.copy(v).add(E).add(S).divideScalar(3);const D=m(R);b(T,A+0,v,D),b(_,A+2,E,D),b(y,A+4,S,D)}}function b(v,E,S,R){R<0&&v.x===1&&(a[E]=v.x-1),S.x===0&&S.z===0&&(a[E]=R/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function p(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ul(e.vertices,e.indices,e.radius,e.detail)}}class ei{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Je("Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let s=0;const r=i.length;let a;t?a=t:a=e*i[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=i[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===a)return s/(r-1);const h=i[s],u=i[s+1]-h,f=(a-h)/u;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new ve:new F);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new F,s=[],r=[],a=[],o=new F,l=new It;for(let f=0;f<=e;f++){const g=f/e;s[f]=this.getTangentAt(g,new F)}r[0]=new F,a[0]=new F;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),d=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=c&&(c=h,i.set(1,0,0)),d<=c&&(c=d,i.set(0,1,0)),u<=c&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(ot(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,g))}a[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(ot(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],f*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}}class dl extends ei{constructor(e=0,t=0,i=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new ve){const i=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,f=c-this.aY;l=u*h-f*d+this.aX,c=u*d+f*h+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class cf extends dl{constructor(e,t,i,s,r,a){super(e,t,i,i,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function fl(){let n=0,e=0,t=0,i=0;function s(r,a,o,l){n=r,e=o,t=-3*r+3*a-2*o-l,i=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,d){let u=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+d)+(l-o)/d;u*=h,f*=h,s(a,o,u,f)},calc:function(r){const a=r*r,o=a*r;return n+e*r+t*a+i*o}}}const rc=new F,ac=new F,La=new fl,Da=new fl,Ia=new fl;class hf extends ei{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new F){const i=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(ac.subVectors(s[0],s[1]).add(s[0]),c=ac);const d=s[o%r],u=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(rc.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=rc),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(d),f),b=Math.pow(d.distanceToSquared(u),f),m=Math.pow(u.distanceToSquared(h),f);b<1e-4&&(b=1),g<1e-4&&(g=b),m<1e-4&&(m=b),La.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,g,b,m),Da.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,g,b,m),Ia.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,g,b,m)}else this.curveType==="catmullrom"&&(La.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),Da.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),Ia.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return i.set(La.calc(l),Da.calc(l),Ia.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new F().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function oc(n,e,t,i,s){const r=(i-e)*.5,a=(s-t)*.5,o=n*n,l=n*o;return(2*t-2*i+r+a)*l+(-3*t+3*i-2*r-a)*o+r*n+t}function uf(n,e){const t=1-n;return t*t*e}function df(n,e){return 2*(1-n)*n*e}function ff(n,e){return n*n*e}function Ns(n,e,t,i){return uf(n,e)+df(n,t)+ff(n,i)}function pf(n,e){const t=1-n;return t*t*t*e}function mf(n,e){const t=1-n;return 3*t*t*n*e}function gf(n,e){return 3*(1-n)*n*n*e}function _f(n,e){return n*n*n*e}function Us(n,e,t,i,s){return pf(n,e)+mf(n,t)+gf(n,i)+_f(n,s)}class Nh extends ei{constructor(e=new ve,t=new ve,i=new ve,s=new ve){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new ve){const i=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(Us(e,s.x,r.x,a.x,o.x),Us(e,s.y,r.y,a.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class vf extends ei{constructor(e=new F,t=new F,i=new F,s=new F){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new F){const i=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(Us(e,s.x,r.x,a.x,o.x),Us(e,s.y,r.y,a.y,o.y),Us(e,s.z,r.z,a.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Uh extends ei{constructor(e=new ve,t=new ve){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ve){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ve){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Mf extends ei{constructor(e=new F,t=new F){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new F){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new F){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Oh extends ei{constructor(e=new ve,t=new ve,i=new ve){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new ve){const i=t,s=this.v0,r=this.v1,a=this.v2;return i.set(Ns(e,s.x,r.x,a.x),Ns(e,s.y,r.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class xf extends ei{constructor(e=new F,t=new F,i=new F){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new F){const i=t,s=this.v0,r=this.v1,a=this.v2;return i.set(Ns(e,s.x,r.x,a.x),Ns(e,s.y,r.y,a.y),Ns(e,s.z,r.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Bh extends ei{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ve){const i=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],d=s[a>s.length-3?s.length-1:a+2];return i.set(oc(o,l.x,c.x,h.x,d.x),oc(o,l.y,c.y,h.y,d.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new ve().fromArray(s))}return this}}var Oo=Object.freeze({__proto__:null,ArcCurve:cf,CatmullRomCurve3:hf,CubicBezierCurve:Nh,CubicBezierCurve3:vf,EllipseCurve:dl,LineCurve:Uh,LineCurve3:Mf,QuadraticBezierCurve:Oh,QuadraticBezierCurve3:xf,SplineCurve:Bh});class Sf extends ei{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1,this.cacheLengths=null}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Oo[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=i){const a=s[r]-i,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(t.push(h),i=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this.cacheLengths=null,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(new Oo[s.type]().fromJSON(s))}return this.cacheLengths=null,this}}class lc extends Sf{constructor(e){super(),this.type="Path",this.currentPoint=new ve,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new Uh(this.currentPoint.clone(),new ve(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){const r=new Oh(this.currentPoint.clone(),new ve(e,t),new ve(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,r,a){const o=new Nh(this.currentPoint.clone(),new ve(e,t),new ve(i,s),new ve(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new Bh(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,i,s,r,a),this}absarc(e,t,i,s,r,a){return this.absellipse(e,t,i,i,s,r,a),this}ellipse(e,t,i,s,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,i,s,r,a,o,l),this}absellipse(e,t,i,s,r,a,o,l){const c=new dl(e,t,i,s,r,a,o,l);if(this.curves.length>0){const d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Bo extends lc{constructor(e){super(e),this.uuid=zi(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,s=this.holes.length;i<s;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(new lc().fromJSON(s))}return this}}function yf(n,e,t=2){const i=e&&e.length,s=i?e[0]*t:n.length;let r=kh(n,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(i&&(r=Af(n,e,r,t)),n.length>80*t){o=n[0],l=n[1];let h=o,d=l;for(let u=t;u<s;u+=t){const f=n[u],g=n[u+1];f<o&&(o=f),g<l&&(l=g),f>h&&(h=f),g>d&&(d=g)}c=Math.max(h-o,d-l),c=c!==0?32767/c:0}return Xs(r,a,t,o,l,c,0),a}function kh(n,e,t,i,s){let r;if(s===Bf(n,e,t,i)>0)for(let a=e;a<t;a+=i)r=cc(a/i|0,n[a],n[a+1],r);else for(let a=t-i;a>=e;a-=i)r=cc(a/i|0,n[a],n[a+1],r);return r&&ps(r,r.next)&&(qs(r),r=r.next),r}function ki(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(ps(t,t.next)||zt(t.prev,t,t.next)===0)){if(qs(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Xs(n,e,t,i,s,r,a){if(!n)return;!a&&r&&Df(n,i,s,r);let o=n;for(;n.prev!==n.next;){const l=n.prev,c=n.next;if(r?Ef(n,i,s,r):bf(n)){e.push(l.i,n.i,c.i),qs(n),n=c.next,o=c.next;continue}if(n=c,n===o){a?a===1?(n=Tf(ki(n),e),Xs(n,e,t,i,s,r,2)):a===2&&wf(n,e,t,i,s,r):Xs(ki(n),e,t,i,s,r,1);break}}}function bf(n){const e=n.prev,t=n,i=n.next;if(zt(e,t,i)>=0)return!1;const s=e.x,r=t.x,a=i.x,o=e.y,l=t.y,c=i.y,h=Math.min(s,r,a),d=Math.min(o,l,c),u=Math.max(s,r,a),f=Math.max(o,l,c);let g=i.next;for(;g!==e;){if(g.x>=h&&g.x<=u&&g.y>=d&&g.y<=f&&Rs(s,o,r,l,a,c,g.x,g.y)&&zt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Ef(n,e,t,i){const s=n.prev,r=n,a=n.next;if(zt(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,h=s.y,d=r.y,u=a.y,f=Math.min(o,l,c),g=Math.min(h,d,u),b=Math.max(o,l,c),m=Math.max(h,d,u),p=ko(f,g,e,t,i),v=ko(b,m,e,t,i);let E=n.prevZ,S=n.nextZ;for(;E&&E.z>=p&&S&&S.z<=v;){if(E.x>=f&&E.x<=b&&E.y>=g&&E.y<=m&&E!==s&&E!==a&&Rs(o,h,l,d,c,u,E.x,E.y)&&zt(E.prev,E,E.next)>=0||(E=E.prevZ,S.x>=f&&S.x<=b&&S.y>=g&&S.y<=m&&S!==s&&S!==a&&Rs(o,h,l,d,c,u,S.x,S.y)&&zt(S.prev,S,S.next)>=0))return!1;S=S.nextZ}for(;E&&E.z>=p;){if(E.x>=f&&E.x<=b&&E.y>=g&&E.y<=m&&E!==s&&E!==a&&Rs(o,h,l,d,c,u,E.x,E.y)&&zt(E.prev,E,E.next)>=0)return!1;E=E.prevZ}for(;S&&S.z<=v;){if(S.x>=f&&S.x<=b&&S.y>=g&&S.y<=m&&S!==s&&S!==a&&Rs(o,h,l,d,c,u,S.x,S.y)&&zt(S.prev,S,S.next)>=0)return!1;S=S.nextZ}return!0}function Tf(n,e){let t=n;do{const i=t.prev,s=t.next.next;!ps(i,s)&&Gh(i,t,t.next,s)&&$s(i,s)&&$s(s,i)&&(e.push(i.i,t.i,s.i),qs(t),qs(t.next),t=n=s),t=t.next}while(t!==n);return ki(t)}function wf(n,e,t,i,s,r){let a=n;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Nf(a,o)){let l=Hh(a,o);a=ki(a,a.next),l=ki(l,l.next),Xs(a,e,t,i,s,r,0),Xs(l,e,t,i,s,r,0);return}o=o.next}a=a.next}while(a!==n)}function Af(n,e,t,i){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*i,l=r<a-1?e[r+1]*i:n.length,c=kh(n,o,l,i,!1);c===c.next&&(c.steiner=!0),s.push(Ff(c))}s.sort(Rf);for(let r=0;r<s.length;r++)t=Cf(s[r],t);return t}function Rf(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function Cf(n,e){const t=Pf(n,e);if(!t)return e;const i=Hh(t,n);return ki(i,i.next),ki(t,t.next)}function Pf(n,e){let t=e;const i=n.x,s=n.y;let r=-1/0,a;if(ps(n,t))return t;do{if(ps(n,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const d=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=i&&d>r&&(r=d,a=t.x<t.next.x?t:t.next,d===i))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;t=a;do{if(i>=t.x&&t.x>=l&&i!==t.x&&zh(s<c?i:r,s,l,c,s<c?r:i,s,t.x,t.y)){const d=Math.abs(s-t.y)/(i-t.x);$s(t,n)&&(d<h||d===h&&(t.x>a.x||t.x===a.x&&Lf(a,t)))&&(a=t,h=d)}t=t.next}while(t!==o);return a}function Lf(n,e){return zt(n.prev,n,e.prev)<0&&zt(e.next,n,n.next)<0}function Df(n,e,t,i){let s=n;do s.z===0&&(s.z=ko(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,If(s)}function If(n){let e,t=1;do{let i=n,s;n=null;let r=null;for(e=0;i;){e++;let a=i,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||i.z<=a.z)?(s=i,i=i.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;i=a}r.nextZ=null,t*=2}while(e>1);return n}function ko(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function Ff(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function zh(n,e,t,i,s,r,a,o){return(s-a)*(e-o)>=(n-a)*(r-o)&&(n-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(i-o)}function Rs(n,e,t,i,s,r,a,o){return!(n===a&&e===o)&&zh(n,e,t,i,s,r,a,o)}function Nf(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!Uf(n,e)&&($s(n,e)&&$s(e,n)&&Of(n,e)&&(zt(n.prev,n,e.prev)||zt(n,e.prev,e))||ps(n,e)&&zt(n.prev,n,n.next)>0&&zt(e.prev,e,e.next)>0)}function zt(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function ps(n,e){return n.x===e.x&&n.y===e.y}function Gh(n,e,t,i){const s=Tr(zt(n,e,t)),r=Tr(zt(n,e,i)),a=Tr(zt(t,i,n)),o=Tr(zt(t,i,e));return!!(s!==r&&a!==o||s===0&&Er(n,t,e)||r===0&&Er(n,i,e)||a===0&&Er(t,n,i)||o===0&&Er(t,e,i))}function Er(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function Tr(n){return n>0?1:n<0?-1:0}function Uf(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&Gh(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function $s(n,e){return zt(n.prev,n,n.next)<0?zt(n,e,n.next)>=0&&zt(n,n.prev,e)>=0:zt(n,e,n.prev)<0||zt(n,n.next,e)<0}function Of(n,e){let t=n,i=!1;const s=(n.x+e.x)/2,r=(n.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function Hh(n,e){const t=zo(n.i,n.x,n.y),i=zo(e.i,e.x,e.y),s=n.next,r=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,r.next=i,i.prev=r,i}function cc(n,e,t,i){const s=zo(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function qs(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function zo(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Bf(n,e,t,i){let s=0;for(let r=e,a=t-i;r<t;r+=i)s+=(n[a]-n[r])*(n[r+1]+n[a+1]),a=r;return s}class kf{static triangulate(e,t,i=2){return yf(e,t,i)}}class as{static area(e){const t=e.length;let i=0;for(let s=t-1,r=0;r<t;s=r++)i+=e[s].x*e[r].y-e[r].x*e[s].y;return i*.5}static isClockWise(e){return as.area(e)<0}static triangulateShape(e,t){const i=[],s=[],r=[];hc(e),uc(i,e);let a=e.length;t.forEach(hc);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,uc(i,t[l]);const o=kf.triangulate(i,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function hc(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function uc(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class Yr extends vn{constructor(e=new Bo([new ve(.5,.5),new ve(-.5,.5),new ve(-.5,-.5),new ve(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const i=this,s=[],r=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];a(c)}this.setAttribute("position",new _t(s,3)),this.setAttribute("uv",new _t(r,2)),this.computeVertexNormals();function a(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,d=t.depth!==void 0?t.depth:1;let u=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,b=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const p=t.extrudePath,v=t.UVGenerator!==void 0?t.UVGenerator:zf;let E,S=!1,R,T,_,y;if(p){E=p.getSpacedPoints(h),S=!0,u=!1;const B=p.isCatmullRomCurve3?p.closed:!1;R=p.computeFrenetFrames(h,B),T=new F,_=new F,y=new F}u||(m=0,f=0,g=0,b=0);const C=o.extractPoints(c);let A=C.shape;const D=C.holes;if(!as.isClockWise(A)){A=A.reverse();for(let B=0,te=D.length;B<te;B++){const ce=D[B];as.isClockWise(ce)&&(D[B]=ce.reverse())}}function X(B){const ce=10000000000000001e-36;let pe=B[0];for(let de=1;de<=B.length;de++){const Ge=de%B.length,Oe=B[Ge],it=Oe.x-pe.x,rt=Oe.y-pe.y,lt=it*it+rt*rt,N=Math.max(Math.abs(Oe.x),Math.abs(Oe.y),Math.abs(pe.x),Math.abs(pe.y)),Rt=ce*N*N;if(lt<=Rt){B.splice(Ge,1),de--;continue}pe=Oe}}X(A),D.forEach(X);const L=D.length,$=A;for(let B=0;B<L;B++){const te=D[B];A=A.concat(te)}function J(B,te,ce){return te||mt("ExtrudeGeometry: vec does not exist"),B.clone().addScaledVector(te,ce)}const G=A.length;function he(B,te,ce){let pe,de,Ge;const Oe=B.x-te.x,it=B.y-te.y,rt=ce.x-B.x,lt=ce.y-B.y,N=Oe*Oe+it*it,Rt=Oe*lt-it*rt;if(Math.abs(Rt)>Number.EPSILON){const et=Math.sqrt(N),St=Math.sqrt(rt*rt+lt*lt),Ae=te.x-it/et,Lt=te.y+Oe/et,$e=ce.x-lt/St,Ke=ce.y+rt/St,w=(($e-Ae)*lt-(Ke-Lt)*rt)/(Oe*lt-it*rt);pe=Ae+Oe*w-B.x,de=Lt+it*w-B.y;const M=pe*pe+de*de;if(M<=2)return new ve(pe,de);Ge=Math.sqrt(M/2)}else{let et=!1;Oe>Number.EPSILON?rt>Number.EPSILON&&(et=!0):Oe<-Number.EPSILON?rt<-Number.EPSILON&&(et=!0):Math.sign(it)===Math.sign(lt)&&(et=!0),et?(pe=-it,de=Oe,Ge=Math.sqrt(N)):(pe=Oe,de=it,Ge=Math.sqrt(N/2))}return new ve(pe/Ge,de/Ge)}const Z=[];for(let B=0,te=$.length,ce=te-1,pe=B+1;B<te;B++,ce++,pe++)ce===te&&(ce=0),pe===te&&(pe=0),Z[B]=he($[B],$[ce],$[pe]);const ae=[];let le,Ue=Z.concat();for(let B=0,te=L;B<te;B++){const ce=D[B];le=[];for(let pe=0,de=ce.length,Ge=de-1,Oe=pe+1;pe<de;pe++,Ge++,Oe++)Ge===de&&(Ge=0),Oe===de&&(Oe=0),le[pe]=he(ce[pe],ce[Ge],ce[Oe]);ae.push(le),Ue=Ue.concat(le)}let qe;if(m===0)qe=as.triangulateShape($,D);else{const B=[],te=[];for(let ce=0;ce<m;ce++){const pe=ce/m,de=f*Math.cos(pe*Math.PI/2),Ge=g*Math.sin(pe*Math.PI/2)+b;for(let Oe=0,it=$.length;Oe<it;Oe++){const rt=J($[Oe],Z[Oe],Ge);Xe(rt.x,rt.y,-de),pe===0&&B.push(rt)}for(let Oe=0,it=L;Oe<it;Oe++){const rt=D[Oe];le=ae[Oe];const lt=[];for(let N=0,Rt=rt.length;N<Rt;N++){const et=J(rt[N],le[N],Ge);Xe(et.x,et.y,-de),pe===0&&lt.push(et)}pe===0&&te.push(lt)}}qe=as.triangulateShape(B,te)}const ne=qe.length,fe=g+b;for(let B=0;B<G;B++){const te=u?J(A[B],Ue[B],fe):A[B];S?(_.copy(R.normals[0]).multiplyScalar(te.x),T.copy(R.binormals[0]).multiplyScalar(te.y),y.copy(E[0]).add(_).add(T),Xe(y.x,y.y,y.z)):Xe(te.x,te.y,0)}for(let B=1;B<=h;B++)for(let te=0;te<G;te++){const ce=u?J(A[te],Ue[te],fe):A[te];S?(_.copy(R.normals[B]).multiplyScalar(ce.x),T.copy(R.binormals[B]).multiplyScalar(ce.y),y.copy(E[B]).add(_).add(T),Xe(y.x,y.y,y.z)):Xe(ce.x,ce.y,d/h*B)}for(let B=m-1;B>=0;B--){const te=B/m,ce=f*Math.cos(te*Math.PI/2),pe=g*Math.sin(te*Math.PI/2)+b;for(let de=0,Ge=$.length;de<Ge;de++){const Oe=J($[de],Z[de],pe);Xe(Oe.x,Oe.y,d+ce)}for(let de=0,Ge=D.length;de<Ge;de++){const Oe=D[de];le=ae[de];for(let it=0,rt=Oe.length;it<rt;it++){const lt=J(Oe[it],le[it],pe);S?Xe(lt.x,lt.y+E[h-1].y,E[h-1].x+ce):Xe(lt.x,lt.y,d+ce)}}}Ne(),We();function Ne(){const B=s.length/3;if(u){let te=0,ce=G*te;for(let pe=0;pe<ne;pe++){const de=qe[pe];yt(de[2]+ce,de[1]+ce,de[0]+ce)}te=h+m*2,ce=G*te;for(let pe=0;pe<ne;pe++){const de=qe[pe];yt(de[0]+ce,de[1]+ce,de[2]+ce)}}else{for(let te=0;te<ne;te++){const ce=qe[te];yt(ce[2],ce[1],ce[0])}for(let te=0;te<ne;te++){const ce=qe[te];yt(ce[0]+G*h,ce[1]+G*h,ce[2]+G*h)}}i.addGroup(B,s.length/3-B,0)}function We(){const B=s.length/3;let te=0;Ce($,te),te+=$.length;for(let ce=0,pe=D.length;ce<pe;ce++){const de=D[ce];Ce(de,te),te+=de.length}i.addGroup(B,s.length/3-B,1)}function Ce(B,te){let ce=B.length;for(;--ce>=0;){const pe=ce;let de=ce-1;de<0&&(de=B.length-1);for(let Ge=0,Oe=h+m*2;Ge<Oe;Ge++){const it=G*Ge,rt=G*(Ge+1),lt=te+pe+it,N=te+de+it,Rt=te+de+rt,et=te+pe+rt;U(lt,N,Rt,et)}}}function Xe(B,te,ce){l.push(B),l.push(te),l.push(ce)}function yt(B,te,ce){k(B),k(te),k(ce);const pe=s.length/3,de=v.generateTopUV(i,s,pe-3,pe-2,pe-1);j(de[0]),j(de[1]),j(de[2])}function U(B,te,ce,pe){k(B),k(te),k(pe),k(te),k(ce),k(pe);const de=s.length/3,Ge=v.generateSideWallUV(i,s,de-6,de-3,de-2,de-1);j(Ge[0]),j(Ge[1]),j(Ge[3]),j(Ge[1]),j(Ge[2]),j(Ge[3])}function k(B){s.push(l[B*3+0]),s.push(l[B*3+1]),s.push(l[B*3+2])}function j(B){r.push(B.x),r.push(B.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return Gf(t,i,e)}static fromJSON(e,t){const i=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];i.push(o)}const s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Oo[s.type]().fromJSON(s)),new Yr(i,e.options)}}const zf={generateTopUV:function(n,e,t,i,s){const r=e[t*3],a=e[t*3+1],o=e[i*3],l=e[i*3+1],c=e[s*3],h=e[s*3+1];return[new ve(r,a),new ve(o,l),new ve(c,h)]},generateSideWallUV:function(n,e,t,i,s,r){const a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[i*3],h=e[i*3+1],d=e[i*3+2],u=e[s*3],f=e[s*3+1],g=e[s*3+2],b=e[r*3],m=e[r*3+1],p=e[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new ve(a,1-l),new ve(c,1-d),new ve(u,1-g),new ve(b,1-p)]:[new ve(o,1-l),new ve(h,1-d),new ve(f,1-g),new ve(m,1-p)]}};function Gf(n,e,t){if(t.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){const r=n[i];t.shapes.push(r.uuid)}else t.shapes.push(n.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class na extends ul{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new na(e.radius,e.detail)}}class Ui extends vn{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,h=l+1,d=e/o,u=t/l,f=[],g=[],b=[],m=[];for(let p=0;p<h;p++){const v=p*u-a;for(let E=0;E<c;E++){const S=E*d-r;g.push(S,-v,0),b.push(0,0,1),m.push(E/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let v=0;v<o;v++){const E=v+c*p,S=v+c*(p+1),R=v+1+c*(p+1),T=v+1+c*p;f.push(E,S,T),f.push(S,R,T)}this.setIndex(f),this.setAttribute("position",new _t(g,3)),this.setAttribute("normal",new _t(b,3)),this.setAttribute("uv",new _t(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ui(e.width,e.height,e.widthSegments,e.heightSegments)}}class pl extends vn{constructor(e=.5,t=1,i=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:a},i=Math.max(3,i),s=Math.max(1,s);const o=[],l=[],c=[],h=[];let d=e;const u=(t-e)/s,f=new F,g=new ve;for(let b=0;b<=s;b++){for(let m=0;m<=i;m++){const p=r+m/i*a;f.x=d*Math.cos(p),f.y=d*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),g.x=(f.x/t+1)/2,g.y=(f.y/t+1)/2,h.push(g.x,g.y)}d+=u}for(let b=0;b<s;b++){const m=b*(i+1);for(let p=0;p<i;p++){const v=p+m,E=v,S=v+i+1,R=v+i+2,T=v+1;o.push(E,S,T),o.push(S,R,T)}}this.setIndex(o),this.setAttribute("position",new _t(l,3)),this.setAttribute("normal",new _t(c,3)),this.setAttribute("uv",new _t(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new pl(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Fi extends vn{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const h=[],d=new F,u=new F,f=[],g=[],b=[],m=[];for(let p=0;p<=i;p++){const v=[],E=p/i,S=a+E*o,R=e*Math.cos(S),T=Math.sqrt(e*e-R*R);let _=0;p===0&&a===0?_=.5/t:p===i&&l===Math.PI&&(_=-.5/t);for(let y=0;y<=t;y++){const C=y/t,A=s+C*r;d.x=-T*Math.cos(A),d.y=R,d.z=T*Math.sin(A),g.push(d.x,d.y,d.z),u.copy(d).normalize(),b.push(u.x,u.y,u.z),m.push(C+_,1-E),v.push(c++)}h.push(v)}for(let p=0;p<i;p++)for(let v=0;v<t;v++){const E=h[p][v+1],S=h[p][v],R=h[p+1][v],T=h[p+1][v+1];(p!==0||a>0)&&f.push(E,S,T),(p!==i-1||l<Math.PI)&&f.push(S,R,T)}this.setIndex(f),this.setAttribute("position",new _t(g,3)),this.setAttribute("normal",new _t(b,3)),this.setAttribute("uv",new _t(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fi(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class yn extends vn{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},i=Math.floor(i),s=Math.floor(s);const l=[],c=[],h=[],d=[],u=new F,f=new F,g=new F;for(let b=0;b<=i;b++){const m=a+b/i*o;for(let p=0;p<=s;p++){const v=p/s*r;f.x=(e+t*Math.cos(m))*Math.cos(v),f.y=(e+t*Math.cos(m))*Math.sin(v),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),u.x=e*Math.cos(v),u.y=e*Math.sin(v),g.subVectors(f,u).normalize(),h.push(g.x,g.y,g.z),d.push(p/s),d.push(b/i)}}for(let b=1;b<=i;b++)for(let m=1;m<=s;m++){const p=(s+1)*b+m-1,v=(s+1)*(b-1)+m-1,E=(s+1)*(b-1)+m,S=(s+1)*b+m;l.push(p,v,S),l.push(v,E,S)}this.setIndex(l),this.setAttribute("position",new _t(c,3)),this.setAttribute("normal",new _t(h,3)),this.setAttribute("uv",new _t(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new yn(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}}function ms(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];if(dc(s))s.isRenderTargetTexture?(Je("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(dc(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][i]=r}else e[t][i]=s.slice();else e[t][i]=s}}return e}function mn(n){const e={};for(let t=0;t<n.length;t++){const i=ms(n[t]);for(const s in i)e[s]=i[s]}return e}function dc(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function Hf(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Vh(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:dt.workingColorSpace}const Vf={clone:ms,merge:mn};var Wf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Xf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ti extends Js{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Wf,this.fragmentShader=Xf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ms(e.uniforms),this.uniformsGroups=Hf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=t[s.value]||null;break;case"c":this.uniforms[i].value=new ct().setHex(s.value);break;case"v2":this.uniforms[i].value=new ve().fromArray(s.value);break;case"v3":this.uniforms[i].value=new F().fromArray(s.value);break;case"v4":this.uniforms[i].value=new kt().fromArray(s.value);break;case"m3":this.uniforms[i].value=new je().fromArray(s.value);break;case"m4":this.uniforms[i].value=new It().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class $f extends Ti{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Br extends Js{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ct(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ct(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Uo,this.normalScale=new ve(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class qf extends Js{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ud,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Yf extends Js{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class ml extends on{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ct(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class Zf extends ml{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(on.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ct(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Fa=new It,fc=new F,pc=new F;class Wh{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ve(512,512),this.mapType=Rn,this.map=null,this.mapPass=null,this.matrix=new It,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ws,this._frameExtents=new ve(1,1),this._viewportCount=1,this._viewports=[new kt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;fc.setFromMatrixPosition(e.matrixWorld),t.position.copy(fc),pc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(pc),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,i,s){Fa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(Fa,e.coordinateSystem,e.reversedDepth);const r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===Hs||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Fa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const wr=new F,Ar=new sn,Vn=new F;class Xh extends on{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new It,this.projectionMatrix=new It,this.projectionMatrixInverse=new It,this.coordinateSystem=zn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(wr,Ar,Vn),Vn.x===1&&Vn.y===1&&Vn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(wr,Ar,Vn.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(wr,Ar,Vn),Vn.x===1&&Vn.y===1&&Vn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(wr,Ar,Vn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const gi=new F,mc=new ve,gc=new ve;class Ln extends Xh{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Vs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Is*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Vs*2*Math.atan(Math.tan(Is*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){gi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(gi.x,gi.y).multiplyScalar(-e/gi.z),gi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(gi.x,gi.y).multiplyScalar(-e/gi.z)}getViewSize(e,t){return this.getViewBounds(e,mc,gc),t.subVectors(gc,mc)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Is*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Kf extends Wh{constructor(){super(new Ln(90,1,.5,500)),this.isPointLightShadow=!0}}class $h extends ml{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Kf}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class qh extends Xh{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Jf extends Wh{constructor(){super(new qh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class _c extends ml{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(on.DEFAULT_UP),this.updateMatrix(),this.target=new on,this.shadow=new Jf}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}const Qi=-90,ji=1;class Go extends on{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ln(Qi,ji,e,t);s.layers=this.layers,this.add(s);const r=new Ln(Qi,ji,e,t);r.layers=this.layers,this.add(r);const a=new Ln(Qi,ji,e,t);a.layers=this.layers,this.add(a);const o=new Ln(Qi,ji,e,t);o.layers=this.layers,this.add(o);const l=new Ln(Qi,ji,e,t);l.layers=this.layers,this.add(l);const c=new Ln(Qi,ji,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===zn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Hs)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const b=i.texture.mipmapsAutoUpdate;i.texture.mipmapsAutoUpdate=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.mipmapsAutoUpdate=b,e.setRenderTarget(i,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(d,u,f),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Qf extends Ln{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}}const vc=new It;class jf{constructor(e,t,i=0,s=1/0){this.ray=new cl(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new al,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):mt("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return vc.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(vc),this}intersectObject(e,t=!0,i=[]){return Ho(e,this,i,t),i.sort(Mc),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)Ho(e[s],this,i,t);return i.sort(Mc),i}}function Mc(n,e){return n.distance-e.distance}function Ho(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){const r=n.children;for(let a=0,o=r.length;a<o;a++)Ho(r[a],e,t,!0)}}class xc{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=ot(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(ot(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class ep extends wi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Sc(n,e,t,i){const s=tp(i);switch(t){case vh:return n*e;case xh:return n*e/s.components*s.byteLength;case el:return n*e/s.components*s.byteLength;case Bi:return n*e*2/s.components*s.byteLength;case tl:return n*e*2/s.components*s.byteLength;case Mh:return n*e*3/s.components*s.byteLength;case Kn:return n*e*4/s.components*s.byteLength;case nl:return n*e*4/s.components*s.byteLength;case Ir:case Fr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Nr:case Ur:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ao:case lo:return Math.max(n,16)*Math.max(e,8)/4;case ro:case oo:return Math.max(n,8)*Math.max(e,8)/2;case co:case ho:case fo:case po:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case uo:case Vr:case mo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case go:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case _o:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case vo:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Mo:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case xo:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case So:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case yo:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case bo:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Eo:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case To:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case wo:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Ao:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Ro:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Co:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Po:case Lo:case Do:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Io:case Fo:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Wr:case No:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function tp(n){switch(n){case Rn:case ph:return{byteLength:1,components:1};case Gs:case mh:case jn:return{byteLength:2,components:1};case Qo:case jo:return{byteLength:2,components:4};case Qn:case Jo:case Zn:return{byteLength:4,components:1};case gh:case _h:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Zo}}));typeof window<"u"&&(window.__THREE__?Je("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Zo);function Yh(){let n=null,e=!1,t=null,i=null;function s(r,a){i=n.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function np(n){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,d=c.byteLength,u=n.createBuffer();n.bindBuffer(l,u),n.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function i(o,l,c){const h=l.array,d=l.updateRanges;if(n.bindBuffer(c,o),d.length===0)n.bufferSubData(c,0,h);else{d.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<d.length;f++){const g=d[u],b=d[f];b.start<=g.start+g.count+1?g.count=Math.max(g.count,b.start+b.count-g.start):(++u,d[u]=b)}d.length=u+1;for(let f=0,g=d.length;f<g;f++){const b=d[f];n.bufferSubData(c,b.start*h.BYTES_PER_ELEMENT,h,b.start,b.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var ip=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,sp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,rp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ap=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,op=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,lp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,cp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,hp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,up=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,dp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,fp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,pp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,mp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,gp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,_p=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,vp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Mp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,xp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Sp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,yp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,bp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Ep=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Tp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,wp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Ap=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Rp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Cp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Pp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Lp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Dp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ip=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Fp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Np=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Up=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Op=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Bp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,kp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,zp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Gp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Hp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Vp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Wp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Xp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,$p=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,qp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Yp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Zp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Kp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Jp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Qp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,jp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,em=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,tm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,nm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,im=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,sm=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,rm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,am=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,om=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,lm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,cm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,hm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,um=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,dm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,pm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,mm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,gm=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,_m=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Mm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,xm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Sm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,ym=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Em=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Tm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,wm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Am=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Rm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Cm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Pm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Lm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Dm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Im=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Fm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Nm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Um=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Om=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Bm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,km=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,zm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Gm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Hm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Vm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Wm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Xm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,$m=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,qm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ym=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Zm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Km=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Jm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Qm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,jm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,e0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,t0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const n0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,i0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,s0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,r0=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,a0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,o0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,l0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,c0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,h0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,u0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,d0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,f0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,p0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,m0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,g0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,_0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,v0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,M0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,x0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,S0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,y0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,b0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,E0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,T0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,w0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,A0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,R0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,C0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,P0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,L0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,D0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,I0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,F0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,N0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,at={alphahash_fragment:ip,alphahash_pars_fragment:sp,alphamap_fragment:rp,alphamap_pars_fragment:ap,alphatest_fragment:op,alphatest_pars_fragment:lp,aomap_fragment:cp,aomap_pars_fragment:hp,batching_pars_vertex:up,batching_vertex:dp,begin_vertex:fp,beginnormal_vertex:pp,bsdfs:mp,iridescence_fragment:gp,bumpmap_pars_fragment:_p,clipping_planes_fragment:vp,clipping_planes_pars_fragment:Mp,clipping_planes_pars_vertex:xp,clipping_planes_vertex:Sp,color_fragment:yp,color_pars_fragment:bp,color_pars_vertex:Ep,color_vertex:Tp,common:wp,defaultnormal_vertex:Ap,displacementmap_pars_vertex:Rp,displacementmap_vertex:Cp,emissivemap_fragment:Pp,emissivemap_pars_fragment:Lp,colorspace_fragment:Dp,colorspace_pars_fragment:Ip,envmap_fragment:Fp,envmap_common_pars_fragment:Np,envmap_pars_fragment:Up,envmap_pars_vertex:Op,envmap_physical_pars_fragment:Yp,envmap_vertex:Bp,fog_vertex:kp,fog_pars_vertex:zp,fog_fragment:Gp,fog_pars_fragment:Hp,gradientmap_pars_fragment:Vp,lightmap_pars_fragment:Wp,lights_lambert_fragment:Xp,lights_lambert_pars_fragment:$p,lights_pars_begin:qp,lights_toon_fragment:Zp,lights_toon_pars_fragment:Kp,lights_phong_fragment:Jp,lights_phong_pars_fragment:Qp,lights_physical_fragment:jp,lights_physical_pars_fragment:em,lights_fragment_begin:tm,lights_fragment_maps:nm,lights_fragment_end:im,lightprobes_pars_fragment:sm,logdepthbuf_fragment:rm,logdepthbuf_pars_fragment:am,logdepthbuf_pars_vertex:om,logdepthbuf_vertex:lm,map_fragment:cm,map_pars_fragment:hm,map_particle_fragment:um,map_particle_pars_fragment:dm,metalnessmap_fragment:fm,metalnessmap_pars_fragment:pm,morphinstance_vertex:mm,morphcolor_vertex:gm,morphnormal_vertex:_m,morphtarget_pars_vertex:vm,morphtarget_vertex:Mm,normal_fragment_begin:xm,normal_fragment_maps:Sm,normal_pars_fragment:ym,normal_pars_vertex:bm,normal_vertex:Em,normalmap_pars_fragment:Tm,clearcoat_normal_fragment_begin:wm,clearcoat_normal_fragment_maps:Am,clearcoat_pars_fragment:Rm,iridescence_pars_fragment:Cm,opaque_fragment:Pm,packing:Lm,premultiplied_alpha_fragment:Dm,project_vertex:Im,dithering_fragment:Fm,dithering_pars_fragment:Nm,roughnessmap_fragment:Um,roughnessmap_pars_fragment:Om,shadowmap_pars_fragment:Bm,shadowmap_pars_vertex:km,shadowmap_vertex:zm,shadowmask_pars_fragment:Gm,skinbase_vertex:Hm,skinning_pars_vertex:Vm,skinning_vertex:Wm,skinnormal_vertex:Xm,specularmap_fragment:$m,specularmap_pars_fragment:qm,tonemapping_fragment:Ym,tonemapping_pars_fragment:Zm,transmission_fragment:Km,transmission_pars_fragment:Jm,uv_pars_fragment:Qm,uv_pars_vertex:jm,uv_vertex:e0,worldpos_vertex:t0,background_vert:n0,background_frag:i0,backgroundCube_vert:s0,backgroundCube_frag:r0,cube_vert:a0,cube_frag:o0,depth_vert:l0,depth_frag:c0,distance_vert:h0,distance_frag:u0,equirect_vert:d0,equirect_frag:f0,linedashed_vert:p0,linedashed_frag:m0,meshbasic_vert:g0,meshbasic_frag:_0,meshlambert_vert:v0,meshlambert_frag:M0,meshmatcap_vert:x0,meshmatcap_frag:S0,meshnormal_vert:y0,meshnormal_frag:b0,meshphong_vert:E0,meshphong_frag:T0,meshphysical_vert:w0,meshphysical_frag:A0,meshtoon_vert:R0,meshtoon_frag:C0,points_vert:P0,points_frag:L0,shadow_vert:D0,shadow_frag:I0,sprite_vert:F0,sprite_frag:N0},Le={common:{diffuse:{value:new ct(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new je}},envmap:{envMap:{value:null},envMapRotation:{value:new je},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new je},normalScale:{value:new ve(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ct(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new ct(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0},uvTransform:{value:new je}},sprite:{diffuse:{value:new ct(16777215)},opacity:{value:1},center:{value:new ve(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}}},qn={basic:{uniforms:mn([Le.common,Le.specularmap,Le.envmap,Le.aomap,Le.lightmap,Le.fog]),vertexShader:at.meshbasic_vert,fragmentShader:at.meshbasic_frag},lambert:{uniforms:mn([Le.common,Le.specularmap,Le.envmap,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.fog,Le.lights,{emissive:{value:new ct(0)},envMapIntensity:{value:1}}]),vertexShader:at.meshlambert_vert,fragmentShader:at.meshlambert_frag},phong:{uniforms:mn([Le.common,Le.specularmap,Le.envmap,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.fog,Le.lights,{emissive:{value:new ct(0)},specular:{value:new ct(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:at.meshphong_vert,fragmentShader:at.meshphong_frag},standard:{uniforms:mn([Le.common,Le.envmap,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.roughnessmap,Le.metalnessmap,Le.fog,Le.lights,{emissive:{value:new ct(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:at.meshphysical_vert,fragmentShader:at.meshphysical_frag},toon:{uniforms:mn([Le.common,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.gradientmap,Le.fog,Le.lights,{emissive:{value:new ct(0)}}]),vertexShader:at.meshtoon_vert,fragmentShader:at.meshtoon_frag},matcap:{uniforms:mn([Le.common,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.fog,{matcap:{value:null}}]),vertexShader:at.meshmatcap_vert,fragmentShader:at.meshmatcap_frag},points:{uniforms:mn([Le.points,Le.fog]),vertexShader:at.points_vert,fragmentShader:at.points_frag},dashed:{uniforms:mn([Le.common,Le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:at.linedashed_vert,fragmentShader:at.linedashed_frag},depth:{uniforms:mn([Le.common,Le.displacementmap]),vertexShader:at.depth_vert,fragmentShader:at.depth_frag},normal:{uniforms:mn([Le.common,Le.bumpmap,Le.normalmap,Le.displacementmap,{opacity:{value:1}}]),vertexShader:at.meshnormal_vert,fragmentShader:at.meshnormal_frag},sprite:{uniforms:mn([Le.sprite,Le.fog]),vertexShader:at.sprite_vert,fragmentShader:at.sprite_frag},background:{uniforms:{uvTransform:{value:new je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:at.background_vert,fragmentShader:at.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new je}},vertexShader:at.backgroundCube_vert,fragmentShader:at.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:at.cube_vert,fragmentShader:at.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:at.equirect_vert,fragmentShader:at.equirect_frag},distance:{uniforms:mn([Le.common,Le.displacementmap,{referencePosition:{value:new F},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:at.distance_vert,fragmentShader:at.distance_frag},shadow:{uniforms:mn([Le.lights,Le.fog,{color:{value:new ct(0)},opacity:{value:1}}]),vertexShader:at.shadow_vert,fragmentShader:at.shadow_frag}};qn.physical={uniforms:mn([qn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new je},clearcoatNormalScale:{value:new ve(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new je},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new je},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new je},sheen:{value:0},sheenColor:{value:new ct(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new je},transmissionSamplerSize:{value:new ve},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new je},attenuationDistance:{value:0},attenuationColor:{value:new ct(0)},specularColor:{value:new ct(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new je},anisotropyVector:{value:new ve},anisotropyMap:{value:null},anisotropyMapTransform:{value:new je}}]),vertexShader:at.meshphysical_vert,fragmentShader:at.meshphysical_frag};const Rr={r:0,b:0,g:0},U0=new It,Zh=new je;Zh.set(-1,0,0,0,1,0,0,0,1);function O0(n,e,t,i,s,r){const a=new ct(0);let o=s===!0?0:1,l,c,h=null,d=0,u=null;function f(v){let E=v.isScene===!0?v.background:null;if(E&&E.isTexture){const S=v.backgroundBlurriness>0;E=e.get(E,S)}return E}function g(v){let E=!1;const S=f(v);S===null?m(a,o):S&&S.isColor&&(m(S,1),E=!0);const R=n.xr.getEnvironmentBlendMode();R==="additive"?t.buffers.color.setClear(0,0,0,1,r):R==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||E)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function b(v,E){const S=f(E);S&&S.isCubeTexture?(c===void 0&&(c=new qt(new Gi(1,1,1),new Ti({name:"BackgroundCubeMaterial",uniforms:ms(qn.backgroundCube.uniforms),vertexShader:qn.backgroundCube.vertexShader,fragmentShader:qn.backgroundCube.fragmentShader,side:_n,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(R,T,_){this.matrixWorld.copyPosition(_.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=S,c.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(U0.makeRotationFromEuler(E.backgroundRotation)).transpose(),S.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Zh),c.material.toneMapped=dt.getTransfer(S.colorSpace)!==bt,(h!==S||d!==S.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,h=S,d=S.version,u=n.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null)):S&&S.isTexture&&(l===void 0&&(l=new qt(new Ui(2,2),new Ti({name:"BackgroundMaterial",uniforms:ms(qn.background.uniforms),vertexShader:qn.background.vertexShader,fragmentShader:qn.background.fragmentShader,side:Oi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=S,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.toneMapped=dt.getTransfer(S.colorSpace)!==bt,S.matrixAutoUpdate===!0&&S.updateMatrix(),l.material.uniforms.uvTransform.value.copy(S.matrix),(h!==S||d!==S.version||u!==n.toneMapping)&&(l.material.needsUpdate=!0,h=S,d=S.version,u=n.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function m(v,E){v.getRGB(Rr,Vh(n)),t.buffers.color.setClear(Rr.r,Rr.g,Rr.b,E,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,E=1){a.set(v),o=E,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(v){o=v,m(a,o)},render:g,addToRenderList:b,dispose:p}}function B0(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=u(null);let r=s,a=!1;function o(D,O,X,L,$){let J=!1;const G=d(D,L,X,O);r!==G&&(r=G,c(r.object)),J=f(D,L,X,$),J&&g(D,L,X,$),$!==null&&e.update($,n.ELEMENT_ARRAY_BUFFER),(J||a)&&(a=!1,S(D,O,X,L),$!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get($).buffer))}function l(){return n.createVertexArray()}function c(D){return n.bindVertexArray(D)}function h(D){return n.deleteVertexArray(D)}function d(D,O,X,L){const $=L.wireframe===!0;let J=i[O.id];J===void 0&&(J={},i[O.id]=J);const G=D.isInstancedMesh===!0?D.id:0;let he=J[G];he===void 0&&(he={},J[G]=he);let Z=he[X.id];Z===void 0&&(Z={},he[X.id]=Z);let ae=Z[$];return ae===void 0&&(ae=u(l()),Z[$]=ae),ae}function u(D){const O=[],X=[],L=[];for(let $=0;$<t;$++)O[$]=0,X[$]=0,L[$]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:X,attributeDivisors:L,object:D,attributes:{},index:null}}function f(D,O,X,L){const $=r.attributes,J=O.attributes;let G=0;const he=X.getAttributes();for(const Z in he)if(he[Z].location>=0){const le=$[Z];let Ue=J[Z];if(Ue===void 0&&(Z==="instanceMatrix"&&D.instanceMatrix&&(Ue=D.instanceMatrix),Z==="instanceColor"&&D.instanceColor&&(Ue=D.instanceColor)),le===void 0||le.attribute!==Ue||Ue&&le.data!==Ue.data)return!0;G++}return r.attributesNum!==G||r.index!==L}function g(D,O,X,L){const $={},J=O.attributes;let G=0;const he=X.getAttributes();for(const Z in he)if(he[Z].location>=0){let le=J[Z];le===void 0&&(Z==="instanceMatrix"&&D.instanceMatrix&&(le=D.instanceMatrix),Z==="instanceColor"&&D.instanceColor&&(le=D.instanceColor));const Ue={};Ue.attribute=le,le&&le.data&&(Ue.data=le.data),$[Z]=Ue,G++}r.attributes=$,r.attributesNum=G,r.index=L}function b(){const D=r.newAttributes;for(let O=0,X=D.length;O<X;O++)D[O]=0}function m(D){p(D,0)}function p(D,O){const X=r.newAttributes,L=r.enabledAttributes,$=r.attributeDivisors;X[D]=1,L[D]===0&&(n.enableVertexAttribArray(D),L[D]=1),$[D]!==O&&(n.vertexAttribDivisor(D,O),$[D]=O)}function v(){const D=r.newAttributes,O=r.enabledAttributes;for(let X=0,L=O.length;X<L;X++)O[X]!==D[X]&&(n.disableVertexAttribArray(X),O[X]=0)}function E(D,O,X,L,$,J,G){G===!0?n.vertexAttribIPointer(D,O,X,$,J):n.vertexAttribPointer(D,O,X,L,$,J)}function S(D,O,X,L){b();const $=L.attributes,J=X.getAttributes(),G=O.defaultAttributeValues;for(const he in J){const Z=J[he];if(Z.location>=0){let ae=$[he];if(ae===void 0&&(he==="instanceMatrix"&&D.instanceMatrix&&(ae=D.instanceMatrix),he==="instanceColor"&&D.instanceColor&&(ae=D.instanceColor)),ae!==void 0){const le=ae.normalized,Ue=ae.itemSize,qe=e.get(ae);if(qe===void 0)continue;const ne=qe.buffer,fe=qe.type,Ne=qe.bytesPerElement,We=fe===n.INT||fe===n.UNSIGNED_INT||ae.gpuType===Jo;if(ae.isInterleavedBufferAttribute){const Ce=ae.data,Xe=Ce.isInterleavedBuffer===!0?Ce.stride:Ce.itemSize,yt=ae.offset;if(Ce.isInstancedInterleavedBuffer||Ce.isInstancedBufferAttribute){for(let U=0;U<Z.locationSize;U++)p(Z.location+U,Ce.meshPerAttribute);D.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=Ce.meshPerAttribute*Ce.count)}else for(let U=0;U<Z.locationSize;U++)m(Z.location+U);n.bindBuffer(n.ARRAY_BUFFER,ne);for(let U=0;U<Z.locationSize;U++)E(Z.location+U,Ue/Z.locationSize,fe,le,Xe*Ne,(yt+Ue/Z.locationSize*U)*Ne,We)}else{if(ae.isInstancedBufferAttribute){for(let Ce=0;Ce<Z.locationSize;Ce++)p(Z.location+Ce,ae.meshPerAttribute);D.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let Ce=0;Ce<Z.locationSize;Ce++)m(Z.location+Ce);n.bindBuffer(n.ARRAY_BUFFER,ne);for(let Ce=0;Ce<Z.locationSize;Ce++)E(Z.location+Ce,Ue/Z.locationSize,fe,le,Ue*Ne,Ue/Z.locationSize*Ce*Ne,We)}}else if(G!==void 0){const le=G[he];if(le!==void 0)switch(le.length){case 2:n.vertexAttrib2fv(Z.location,le);break;case 3:n.vertexAttrib3fv(Z.location,le);break;case 4:n.vertexAttrib4fv(Z.location,le);break;default:n.vertexAttrib1fv(Z.location,le)}}}}v()}function R(){C();for(const D in i){const O=i[D];for(const X in O){const L=O[X];for(const $ in L){const J=L[$];for(const G in J)h(J[G].object),delete J[G];delete L[$]}}delete i[D]}}function T(D){if(i[D.id]===void 0)return;const O=i[D.id];for(const X in O){const L=O[X];for(const $ in L){const J=L[$];for(const G in J)h(J[G].object),delete J[G];delete L[$]}}delete i[D.id]}function _(D){for(const O in i){const X=i[O];for(const L in X){const $=X[L];if($[D.id]===void 0)continue;const J=$[D.id];for(const G in J)h(J[G].object),delete J[G];delete $[D.id]}}}function y(D){for(const O in i){const X=i[O],L=D.isInstancedMesh===!0?D.id:0,$=X[L];if($!==void 0){for(const J in $){const G=$[J];for(const he in G)h(G[he].object),delete G[he];delete $[J]}delete X[L],Object.keys(X).length===0&&delete i[O]}}}function C(){A(),a=!0,r!==s&&(r=s,c(r.object))}function A(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:C,resetDefaultState:A,dispose:R,releaseStatesOfGeometry:T,releaseStatesOfObject:y,releaseStatesOfProgram:_,initAttributes:b,enableAttribute:m,disableUnusedAttributes:v}}function k0(n,e,t){let i;function s(l){i=l}function r(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function a(l,c,h){h!==0&&(n.drawArraysInstanced(i,l,c,h),t.update(c,i,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let u=0;for(let f=0;f<h;f++)u+=c[f];t.update(u,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function z0(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const _=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(_){return!(_!==Kn&&i.convert(_)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(_){const y=_===jn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(_!==Rn&&_!==Zn&&!y&&i.convert(_)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function l(_){if(_==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";_="mediump"}return _==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Je("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),u=t.logarithmicDepthBuffer===!0&&d===!1;t.reversedDepthBuffer===!0&&d===!1&&Je("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&d===!0&&Je("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),b=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),v=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),E=n.getParameter(n.MAX_VARYING_VECTORS),S=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),R=n.getParameter(n.MAX_SAMPLES),T=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:b,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:v,maxVaryings:E,maxFragmentUniforms:S,maxSamples:R,samples:T}}function G0(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new oi,o=new je,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||i!==0||s;return s=u,i=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,f){const g=d.clippingPlanes,b=d.clipIntersection,m=d.clipShadows,p=n.get(d);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{const v=r?0:i,E=v*4;let S=p.clippingState||null;l.value=S,S=h(g,u,E,f);for(let R=0;R!==E;++R)S[R]=t[R];p.clippingState=S,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(d,u,f,g){const b=d!==null?d.length:0;let m=null;if(b!==0){if(m=l.value,g!==!0||m===null){const p=f+b*4,v=u.matrixWorldInverse;o.getNormalMatrix(v),(m===null||m.length<p)&&(m=new Float32Array(p));for(let E=0,S=f;E!==b;++E,S+=4)a.copy(d[E]).applyMatrix4(v,o),a.normal.toArray(m,S),m[S+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=b,e.numIntersection=0,m}}class gl extends Jn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Dh(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Gi(5,5,5),r=new Ti({name:"CubemapFromEquirect",uniforms:ms(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:_n,blending:ls});r.uniforms.tEquirect.value=t;const a=new qt(s,r),o=t.minFilter;return t.minFilter===Si&&(t.minFilter=En),new Go(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}const yc=256,H0=3,V0=20,Kh=256,Jh=16,W0=3,X0=new F,$0=new ct;class Zr{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Go(1,10,null),this._boxMesh=new qt(new Gi(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=X0}=r,l=this._renderer;this._setSize(a);const c=this._allocateTarget(),h=this._getSourceTarget(!0);t>0&&(h.texture.mipmapsAutoUpdate=!1);const d=l.autoClear,u=l.autoClearColor,f=l.autoClearDepth,g=l.autoClearStencil,b=e.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,b===null&&(e.background=l.getClearColor($0));const m=new Go(i,s,h);return m.position.copy(o),m.update(l,e),l.autoClear=d,l.autoClearColor=u,l.autoClearDepth=f,l.autoClearStencil=g,e.background=b,t>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Tc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ec(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(yc,Th(e))}_fromTexture(e,t){e.mapping===us||e.mapping===zs?this._setSize(e.image.length===0?yc:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);const i=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(i),i}_allocateTarget(){const e=this._cubeSize,t=bc(e,!1,!1),i=Math.log2(e)-H0;for(let s=0;s<=i;s++)t.texture.mipmaps.push({width:e>>s,height:e>>s});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){const t=this._cubeSize,i=this._sourceTarget;return(i===null||i.width!==t||e&&i.depthBuffer===!1)&&(i!==null&&i.dispose(),this._sourceTarget=bc(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,i){const s=this._boxMesh,r=this._cubeCamera;s.material=i,r.renderTarget=e,r.activeMipmapLevel=t;const a=e.width>>t;e.viewport.set(0,0,a,a),r.update(this._renderer,s),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===us||e.mapping===zs?(this._cubemapMaterial===null&&(this._cubemapMaterial=Tc()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Ec()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=q0(),this._integrationMaterial=Y0());const t=this._cubeSize,i=e.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;const r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/Jh);for(let a=0;a<=i;a++){const o=Zr.lodToRoughness(a,i);if(a>i-W0)r.roughness.value=o,this._renderCube(e,a,this._integrationMaterial);else{const l=o>0?Math.log2(t)+.5*Math.log2(6/(Kh*Math.pow(o,4)))+.5:0;s.roughness.value=o,s.lodBias.value=l,this._renderCube(e,a,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=Z0());const i=this._blurMaterial,s=i.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(e,0,i),s.envMap.value=e.texture,this._renderCube(r,0,i)}}function bc(n,e,t){return new gl(n,{minFilter:Si,generateMipmaps:e,type:jn,colorSpace:Xr,depthBuffer:t})}function Qs(n,e,t){return new Ti({name:n,uniforms:e,vertexShader:at.cube_vert,fragmentShader:t,side:_n,blending:ls,depthTest:!1,depthWrite:!1})}function q0(){return Qs("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Kh}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Y0(){return Qs("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Jh}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Z0(){return Qs("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${V0}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function Ec(){return Qs("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function Tc(){return Qs("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function K0(n){let e=new WeakMap,t=new WeakMap,i=null;function s(u,f=!1){return u==null?null:f?a(u):r(u)}function r(u){if(u&&u.isTexture){const f=u.mapping;if(f===oa||f===la)if(e.has(u)){const g=e.get(u).texture;return o(g,u.mapping)}else{const g=u.image;if(g&&g.height>0){const b=new gl(g.height);return b.fromEquirectangularTexture(n,u),e.set(u,b),u.addEventListener("dispose",c),o(b.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture&&u.isPMREMTexture!==!0){const f=u.mapping,g=f===oa||f===la,b=f===us||f===zs;if(g||b){let m=t.get(u);const p=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return i===null&&(i=new Zr(n)),m=g?i.fromEquirectangular(u,m):i.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),m.texture;if(m!==void 0)return m.texture;{const v=u.image;return g&&v&&v.height>0||b&&v&&l(v)?(i===null&&(i=new Zr(n)),m=g?i.fromEquirectangular(u):i.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function o(u,f){return f===oa?u.mapping=us:f===la&&(u.mapping=zs),u}function l(u){let f=0;const g=6;for(let b=0;b<g;b++)u[b]!==void 0&&f++;return f===g}function c(u){const f=u.target;f.removeEventListener("dispose",c);const g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function h(u){const f=u.target;f.removeEventListener("dispose",h);const g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function d(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:d}}function J0(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Or("WebGLRenderer: "+i+" extension not supported."),s}}}function Q0(n,e,t,i){const s={},r=new WeakMap,a=new FinalizationRegistry(g=>delete s[g]);function o(g){l(g.target)}function l(g){g.index!==null&&e.remove(g.index);for(const m in g.attributes)e.remove(g.attributes[m]);g.removeEventListener("dispose",o),delete s[g.id],a.unregister(g);const b=r.get(g);b&&(e.remove(b),r.delete(g)),i.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,t.memory.geometries--}function c(g,b){return s[b.id]!==void 0||(b.addEventListener("dispose",o),s[b.id]=new WeakRef(b),a.register(b,b.id,b),t.memory.geometries++),b}function h(g){const b=g.attributes;for(const m in b)e.update(b[m],n.ARRAY_BUFFER)}function d(g){const b=g.index,m=g.attributes.position;let p=0;if(m===void 0)return;const v=b!==null?b.array.length:m.array.length/3-1,E=m.count>=65535?Lh:Ph,S=new E(Math.ceil(v/3)*6,1),R=S.array;if(b!==null){const _=b.array;p=b.version;for(let y=0,C=0;y<v;y+=3){const A=_[y+0],D=_[y+1],O=_[y+2];R[C++]=A,R[C++]=D,R[C++]=D,R[C++]=O,R[C++]=O,R[C++]=A}}else{p=m.version;for(let _=0,y=0;_<v;_+=3){const C=_+0,A=_+1,D=_+2;R[y++]=C,R[y++]=A,R[y++]=A,R[y++]=D,R[y++]=D,R[y++]=C}}S.version=p;const T=r.get(g);T&&e.remove(T),r.set(g,S)}function u(g){const b=r.get(g);if(b){const m=g.index;m!==null&&b.version<m.version&&d(g)}else d(g);return r.get(g)}function f(){for(const g in s){const b=s[g].deref();b!==void 0&&l(b)}}return{get:c,update:h,getWireframeAttribute:u,dispose:f}}function j0(n,e,t){let i;function s(d){i=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,u){n.drawElements(i,u,r,d*a),t.update(u,i,1)}function c(d,u,f){f!==0&&(n.drawElementsInstanced(i,u,r,d*a,f),t.update(u,i,f))}function h(d,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,r,d,0,f);let b=0;for(let m=0;m<f;m++)b+=u[m];t.update(b,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function eg(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:mt("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function tg(n,e,t){const i=new WeakMap,s=new kt;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=i.get(o);if(u===void 0||u.count!==d){let C=function(){_.dispose(),i.delete(o),o.removeEventListener("dispose",C)};u!==void 0&&u.texture.dispose();const f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,b=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let E=0;f===!0&&(E=1),g===!0&&(E=2),b===!0&&(E=3);let S=o.attributes.position.count*E,R=1;S>e.maxTextureSize&&(R=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);const T=new Float32Array(S*R*4*d),_=new Rh(T,S,R,d);_.type=Zn,_.needsUpdate=!0;const y=E*4;for(let A=0;A<d;A++){const D=m[A],O=p[A],X=v[A],L=S*R*4*A;for(let $=0;$<D.count;$++){const J=$*y;f===!0&&(s.fromBufferAttribute(D,$),T[L+J+0]=s.x,T[L+J+1]=s.y,T[L+J+2]=s.z,T[L+J+3]=0),g===!0&&(s.fromBufferAttribute(O,$),T[L+J+4]=s.x,T[L+J+5]=s.y,T[L+J+6]=s.z,T[L+J+7]=0),b===!0&&(s.fromBufferAttribute(X,$),T[L+J+8]=s.x,T[L+J+9]=s.y,T[L+J+10]=s.z,T[L+J+11]=X.itemSize===4?s.w:1)}}u={count:d,texture:_,size:new ve(S,R)},i.set(o,u),o.addEventListener("dispose",C)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let f=0;for(let b=0;b<c.length;b++)f+=c[b];const g=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(n,"morphTargetBaseInfluence",g),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",u.size)}return{update:r}}function ng(n,e,t,i,s){let r=new WeakMap;function a(c){const h=s.render.frame,d=c.geometry,u=e.get(c,d);if(r.get(u)!==h&&(e.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const ig={[oh]:"LINEAR_TONE_MAPPING",[lh]:"REINHARD_TONE_MAPPING",[ch]:"CINEON_TONE_MAPPING",[Ko]:"ACES_FILMIC_TONE_MAPPING",[uh]:"AGX_TONE_MAPPING",[dh]:"NEUTRAL_TONE_MAPPING",[hh]:"CUSTOM_TONE_MAPPING"};function sg(n,e,t,i,s,r){const a=new Jn(e,t,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null,c=null;const h=new vn;h.setAttribute("position",new _t([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new _t([0,2,0,0,2,0],2));const d=new $f({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new qt(h,d),f=new qh(-1,1,1,-1,0,1);let g=null,b=null,m=!1,p,v=null,E=[],S=!1;this.setSize=function(R,T){a.setSize(R,T),o!==null&&o.setSize(R,T),l!==null&&l.setSize(R,T);for(let _=0;_<E.length;_++){const y=E[_];y.setSize&&y.setSize(R,T)}},this.setEffects=function(R){E=R,S=E.length>0&&E[0].isRenderPass===!0;const T=a.width,_=a.height;E.length>0&&o===null&&(o=new Jn(T,_,{type:jn,depthBuffer:!1,stencilBuffer:!1}),l=new Jn(T,_,{type:jn,depthBuffer:!1,stencilBuffer:!1}));const y=s===!0&&E.some(C=>C.needsDepthTexture===!0);y!==(a.depthTexture!==null)&&(y===!0&&c===null&&(c=new fs(T,_),r===!0&&(c.format=yi,c.type=ds)),a.dispose(),a.depthTexture=y?c:null,a.resolveDepthBuffer=y,a.storeMultisampledDepthBuffer=y);for(let C=0;C<E.length;C++){const A=E[C];A.setSize&&A.setSize(T,_),y&&A.needsDepthTexture===!0&&A.setDepthTexture&&A.setDepthTexture(c)}},this.begin=function(R,T){if(m||R.toneMapping===ci&&E.length===0)return!1;if(v=T,T!==null){const _=T.width,y=T.height;(a.width!==_||a.height!==y)&&this.setSize(_,y)}return S===!1&&R.setRenderTarget(a),p=R.toneMapping,R.toneMapping=ci,!0},this.hasRenderPass=function(){return S},this.end=function(R,T){R.toneMapping=p,m=!0;let _=a,y=o;for(let C=0;C<E.length;C++){const A=E[C];A.enabled!==!1&&(A.render(R,y,_,T),A.needsSwap!==!1&&(_=y,y=y===o?l:o))}if(g!==R.outputColorSpace||b!==R.toneMapping){g=R.outputColorSpace,b=R.toneMapping,d.defines={},dt.getTransfer(g)===bt&&(d.defines.SRGB_TRANSFER="");const C=ig[b];C&&(d.defines[C]=""),d.needsUpdate=!0}d.uniforms.tDiffuse.value=_.texture,R.setRenderTarget(v),R.render(u,f),v=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),h.dispose(),d.dispose()}}const Qh=new dn,jh=new fs(1,1),eu=new Ih(1),tu=new Rh,nu=new Wd,iu=new Dh,wc=[],Ac=[],Rc=new Float32Array(16),Cc=new Float32Array(9),Pc=new Float32Array(4);function gs(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=wc[s];if(r===void 0&&(r=new Float32Array(s),wc[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function Kt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Jt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function ia(n,e){let t=Ac[e];t===void 0&&(t=new Int32Array(e),Ac[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function rg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function ag(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Kt(t,e))return;n.uniform2fv(this.addr,e),Jt(t,e)}}function og(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Kt(t,e))return;n.uniform3fv(this.addr,e),Jt(t,e)}}function lg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Kt(t,e))return;n.uniform4fv(this.addr,e),Jt(t,e)}}function cg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Kt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Jt(t,e)}else{if(Kt(t,i))return;Pc.set(i),n.uniformMatrix2fv(this.addr,!1,Pc),Jt(t,i)}}function hg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Kt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Jt(t,e)}else{if(Kt(t,i))return;Cc.set(i),n.uniformMatrix3fv(this.addr,!1,Cc),Jt(t,i)}}function ug(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Kt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Jt(t,e)}else{if(Kt(t,i))return;Rc.set(i),n.uniformMatrix4fv(this.addr,!1,Rc),Jt(t,i)}}function dg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function fg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Kt(t,e))return;n.uniform2iv(this.addr,e),Jt(t,e)}}function pg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Kt(t,e))return;n.uniform3iv(this.addr,e),Jt(t,e)}}function mg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Kt(t,e))return;n.uniform4iv(this.addr,e),Jt(t,e)}}function gg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function _g(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Kt(t,e))return;n.uniform2uiv(this.addr,e),Jt(t,e)}}function vg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Kt(t,e))return;n.uniform3uiv(this.addr,e),Jt(t,e)}}function Mg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Kt(t,e))return;n.uniform4uiv(this.addr,e),Jt(t,e)}}function sa(n){return n.version===0&&(n.compareFunction=bh,n.needsUpdate=!0),n}function xg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?r=sa(jh):r=Qh,t.setTexture2D(e||r,s)}function Sg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||nu,s)}function yg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_CUBE_SHADOW?r=sa(eu):r=iu,t.setTextureCube(e||r,s)}function bg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||tu,s)}function Eg(n){switch(n){case 5126:return rg;case 35664:return ag;case 35665:return og;case 35666:return lg;case 35674:return cg;case 35675:return hg;case 35676:return ug;case 5124:case 35670:return dg;case 35667:case 35671:return fg;case 35668:case 35672:return pg;case 35669:case 35673:return mg;case 5125:return gg;case 36294:return _g;case 36295:return vg;case 36296:return Mg;case 35678:case 36198:case 36298:case 36306:case 35682:return xg;case 35679:case 36299:case 36307:return Sg;case 35680:case 36300:case 36308:case 36293:return yg;case 36289:case 36303:case 36311:case 36292:return bg}}function Tg(n,e){n.uniform1fv(this.addr,e)}function wg(n,e){const t=gs(e,this.size,2);n.uniform2fv(this.addr,t)}function Ag(n,e){const t=gs(e,this.size,3);n.uniform3fv(this.addr,t)}function Rg(n,e){const t=gs(e,this.size,4);n.uniform4fv(this.addr,t)}function Cg(n,e){const t=gs(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Pg(n,e){const t=gs(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Lg(n,e){const t=gs(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Dg(n,e){n.uniform1iv(this.addr,e)}function Ig(n,e){n.uniform2iv(this.addr,e)}function Fg(n,e){n.uniform3iv(this.addr,e)}function Ng(n,e){n.uniform4iv(this.addr,e)}function Ug(n,e){n.uniform1uiv(this.addr,e)}function Og(n,e){n.uniform2uiv(this.addr,e)}function Bg(n,e){n.uniform3uiv(this.addr,e)}function kg(n,e){n.uniform4uiv(this.addr,e)}function zg(n,e,t){const i=this.cache,s=e.length,r=ia(t,s);Kt(i,r)||(n.uniform1iv(this.addr,r),Jt(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=sa(jh):a=Qh;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function Gg(n,e,t){const i=this.cache,s=e.length,r=ia(t,s);Kt(i,r)||(n.uniform1iv(this.addr,r),Jt(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||nu,r[a])}function Hg(n,e,t){const i=this.cache,s=e.length,r=ia(t,s);Kt(i,r)||(n.uniform1iv(this.addr,r),Jt(i,r));let a;this.type===n.SAMPLER_CUBE_SHADOW?a=sa(eu):a=iu;for(let o=0;o!==s;++o)t.setTextureCube(e[o]||a,r[o])}function Vg(n,e,t){const i=this.cache,s=e.length,r=ia(t,s);Kt(i,r)||(n.uniform1iv(this.addr,r),Jt(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||tu,r[a])}function Wg(n){switch(n){case 5126:return Tg;case 35664:return wg;case 35665:return Ag;case 35666:return Rg;case 35674:return Cg;case 35675:return Pg;case 35676:return Lg;case 5124:case 35670:return Dg;case 35667:case 35671:return Ig;case 35668:case 35672:return Fg;case 35669:case 35673:return Ng;case 5125:return Ug;case 36294:return Og;case 36295:return Bg;case 36296:return kg;case 35678:case 36198:case 36298:case 36306:case 35682:return zg;case 35679:case 36299:case 36307:return Gg;case 35680:case 36300:case 36308:case 36293:return Hg;case 36289:case 36303:case 36311:case 36292:return Vg}}class Xg{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Eg(t.type)}}class $g{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Wg(t.type)}}class qg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const Na=/(\w+)(\])?(\[|\.)?/g;function Lc(n,e){n.seq.push(e),n.map[e.id]=e}function Yg(n,e,t){const i=n.name,s=i.length;for(Na.lastIndex=0;;){const r=Na.exec(i),a=Na.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Lc(t,c===void 0?new Xg(o,n,e):new $g(o,n,e));break}else{let d=t.map[o];d===void 0&&(d=new qg(o),Lc(t,d)),t=d}}}class kr{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);Yg(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function Dc(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Zg=37297;let Kg=0;function Jg(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const Ic=new je;function Qg(n){dt._getMatrix(Ic,dt.workingColorSpace,n);const e=`mat3( ${Ic.elements.map(t=>t.toFixed(4))} )`;switch(dt.getTransfer(n)){case $r:return[e,"LinearTransferOETF"];case bt:return[e,"sRGBTransferOETF"];default:return Je("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Fc(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Jg(n.getShaderSource(e),o)}else return r}function jg(n,e){const t=Qg(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const e_={[oh]:"Linear",[lh]:"Reinhard",[ch]:"Cineon",[Ko]:"ACESFilmic",[uh]:"AgX",[dh]:"Neutral",[hh]:"Custom"};function t_(n,e){const t=e_[e];return t===void 0?(Je("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Cr=new F;function n_(){dt.getLuminanceCoefficients(Cr);const n=Cr.x.toFixed(4),e=Cr.y.toFixed(4),t=Cr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function i_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Cs).join(`
`)}function s_(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function r_(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Cs(n){return n!==""}function Nc(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function Uc(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const a_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Vo(n){return n.replace(a_,o_)}function o_(n,e){const t=at[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return Vo(t)}const l_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Oc(n){return n.replace(l_,c_)}function c_(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Bc(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const h_={[Ls]:"SHADOWMAP_TYPE_PCF",[As]:"SHADOWMAP_TYPE_VSM"};function u_(n){return h_[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const d_={[zs]:"ENVMAP_MODE_REFRACTION"};function f_(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":d_[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const p_={[ah]:"ENVMAP_BLENDING_MULTIPLY",[ld]:"ENVMAP_BLENDING_MIX",[cd]:"ENVMAP_BLENDING_ADD"};function m_(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":p_[n.combine]||"ENVMAP_BLENDING_NONE"}function g_(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=u_(t),c=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=f_(t),d=m_(t),u=i_(t),f=s_(r),g=s.createProgram();let b,m,p=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(b=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f].filter(Cs).join(`
`),b.length>0&&(b+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f].filter(Cs).join(`
`),m.length>0&&(m+=`
`)):(b=[Bc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Cs).join(`
`),m=[Bc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ci?"#define TONE_MAPPING":"",t.toneMapping!==ci?at.tonemapping_pars_fragment:"",t.toneMapping!==ci?t_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",at.colorspace_pars_fragment,jg("linearToOutputTexel",t.outputColorSpace),n_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Cs).join(`
`)),a=Vo(a),a=Nc(a,t),a=Uc(a,t),o=Vo(o),o=Nc(o,t),o=Uc(o,t),a=Oc(a),o=Oc(o),t.isRawShaderMaterial!==!0&&(p=`#version 300 es
`,b=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+b,m=["#define varying in",t.glslVersion===zl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===zl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const v=p+b+a,E=p+m+o,S=Dc(s,s.VERTEX_SHADER,v),R=Dc(s,s.FRAGMENT_SHADER,E);s.attachShader(g,S),s.attachShader(g,R),t.index0AttributeName!==void 0?s.bindAttribLocation(g,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function T(A){if(n.debug.checkShaderErrors){const D=s.getProgramInfoLog(g)||"",O=s.getShaderInfoLog(S)||"",X=s.getShaderInfoLog(R)||"",L=D.trim(),$=O.trim(),J=X.trim();let G=!0,he=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(G=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,g,S,R);else{const Z=Fc(s,S,"vertex"),ae=Fc(s,R,"fragment");mt("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+L+`
`+Z+`
`+ae)}else L!==""?Je("WebGLProgram: Program Info Log:",L):($===""||J==="")&&(he=!1);he&&(A.diagnostics={runnable:G,programLog:L,vertexShader:{log:$,prefix:b},fragmentShader:{log:J,prefix:m}})}s.deleteShader(S),s.deleteShader(R),_=new kr(s,g),y=r_(s,g)}let _;this.getUniforms=function(){return _===void 0&&T(this),_};let y;this.getAttributes=function(){return y===void 0&&T(this),y};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=s.getProgramParameter(g,Zg)),C},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Kg++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=S,this.fragmentShader=R,this}let __=0;class v_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new M_(e),t.set(e,i)),i}}class M_{constructor(e){this.id=__++,this.code=e,this.usedTimes=0}}function x_(n){return n===Bi||n===Vr||n===Wr}function S_(n,e,t,i,s,r){const a=new al,o=new v_,l=new Set,c=[],h=new Map,d=i.logarithmicDepthBuffer,u={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function f(_){return l.add(_),_===0?"uv":`uv${_}`}function g(_,y,C,A,D,O){const X=A.fog,L=D.geometry,$=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?A.environment:null,J=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,G=e.get(_.envMap||$,J),he=u[_.type];let Z=i.precision;_.precision!==null&&(Z=i.getMaxPrecision(_.precision),Z!==_.precision&&Je("WebGLProgram.getParameters:",_.precision,"not supported, using",Z,"instead."));const ae=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,le=ae!==void 0?ae.length:0;let Ue=0;L.morphAttributes.position!==void 0&&(Ue=1),L.morphAttributes.normal!==void 0&&(Ue=2),L.morphAttributes.color!==void 0&&(Ue=3);let qe,ne,fe,Ne;if(he){const Pe=qn[he];qe=Pe.vertexShader,ne=Pe.fragmentShader}else{qe=_.vertexShader,ne=_.fragmentShader;const Pe=o.getVertexShaderStage(_),vt=o.getFragmentShaderStage(_);o.update(_,Pe,vt),fe=Pe.id,Ne=vt.id}const We=n.getRenderTarget(),Ce=n.state.buffers.depth.getReversed(),Xe=D.isInstancedMesh===!0,yt=D.isBatchedMesh===!0,U=!!_.map,k=!!_.matcap,j=!!G,B=j&&G.isPMREMTexture===!0,te=!!_.aoMap,ce=!!_.lightMap,pe=!!_.bumpMap&&_.wireframe===!1,de=!!_.normalMap,Ge=!!_.displacementMap,Oe=!!_.emissiveMap,it=!!_.metalnessMap,rt=!!_.roughnessMap,lt=_.anisotropy>0,N=_.clearcoat>0,Rt=_.diffuseRoughness>0,et=_.dispersion>0,St=_.retroreflectivity>0,Ae=_.iridescence>0,Lt=_.sheen>0,$e=_.transmission>0,Ke=lt&&!!_.anisotropyMap,w=N&&!!_.clearcoatMap,M=N&&!!_.clearcoatNormalMap,H=N&&!!_.clearcoatRoughnessMap,ue=Rt&&!!_.diffuseRoughnessMap,re=Ae&&!!_.iridescenceMap,Ee=Ae&&!!_.iridescenceThicknessMap,Se=Lt&&!!_.sheenColorMap,Q=Lt&&!!_.sheenRoughnessMap,se=!!_.specularMap,ge=!!_.specularColorMap,P=!!_.specularIntensityMap,ie=$e&&!!_.transmissionMap,ee=$e&&!!_.thicknessMap,ye=!!_.gradientMap,xe=!!_.alphaMap,be=_.alphaTest>0,He=!!_.alphaHash,tt=!!_.extensions;let me=ci;_.toneMapped&&(We===null||We.isXRRenderTarget===!0)&&(me=n.toneMapping);const Ye=B?G.isCompressedCubeTexture?G.image[0].mipmaps:G.mipmaps:null,st={shaderID:he,shaderType:_.type,shaderName:_.name,vertexShader:qe,fragmentShader:ne,defines:_.defines,customVertexShaderID:fe,customFragmentShaderID:Ne,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:Z,batching:yt,batchingColor:yt&&D._colorsTexture!==null,instancing:Xe,instancingColor:Xe&&D.instanceColor!==null,instancingMorph:Xe&&D.morphTexture!==null,outputColorSpace:We===null?n.outputColorSpace:We.isXRRenderTarget===!0?We.texture.colorSpace:dt.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:U,matcap:k,envMap:j,envMapMode:j&&G.mapping,envMapPMREM:B,envMapMaxLod:B?Ye.length-1:null,envMapSize:B?Ye[0].width:null,aoMap:te,lightMap:ce,bumpMap:pe,normalMap:de,displacementMap:Ge,emissiveMap:Oe,normalMapObjectSpace:de&&_.normalMapType===dd,normalMapTangentSpace:de&&_.normalMapType===Uo,packedNormalMap:de&&_.normalMapType===Uo&&x_(_.normalMap.format),metalnessMap:it,roughnessMap:rt,anisotropy:lt,anisotropyMap:Ke,clearcoat:N,clearcoatMap:w,clearcoatNormalMap:M,clearcoatRoughnessMap:H,diffuseRoughness:Rt,diffuseRoughnessMap:ue,dispersion:et,retroreflection:St,iridescence:Ae,iridescenceMap:re,iridescenceThicknessMap:Ee,sheen:Lt,sheenColorMap:Se,sheenRoughnessMap:Q,specularMap:se,specularColorMap:ge,specularIntensityMap:P,transmission:$e,transmissionMap:ie,thicknessMap:ee,gradientMap:ye,opaque:_.transparent===!1&&_.blending===Ds&&_.alphaToCoverage===!1,alphaMap:xe,alphaTest:be,alphaHash:He,combine:_.combine,mapUv:U&&f(_.map.channel),aoMapUv:te&&f(_.aoMap.channel),lightMapUv:ce&&f(_.lightMap.channel),bumpMapUv:pe&&f(_.bumpMap.channel),normalMapUv:de&&f(_.normalMap.channel),displacementMapUv:Ge&&f(_.displacementMap.channel),emissiveMapUv:Oe&&f(_.emissiveMap.channel),metalnessMapUv:it&&f(_.metalnessMap.channel),roughnessMapUv:rt&&f(_.roughnessMap.channel),anisotropyMapUv:Ke&&f(_.anisotropyMap.channel),clearcoatMapUv:w&&f(_.clearcoatMap.channel),clearcoatNormalMapUv:M&&f(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:H&&f(_.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:ue&&f(_.diffuseRoughnessMap.channel),iridescenceMapUv:re&&f(_.iridescenceMap.channel),iridescenceThicknessMapUv:Ee&&f(_.iridescenceThicknessMap.channel),sheenColorMapUv:Se&&f(_.sheenColorMap.channel),sheenRoughnessMapUv:Q&&f(_.sheenRoughnessMap.channel),specularMapUv:se&&f(_.specularMap.channel),specularColorMapUv:ge&&f(_.specularColorMap.channel),specularIntensityMapUv:P&&f(_.specularIntensityMap.channel),transmissionMapUv:ie&&f(_.transmissionMap.channel),thicknessMapUv:ee&&f(_.thicknessMap.channel),alphaMapUv:xe&&f(_.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(de||lt),vertexNormals:!!L.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!L.attributes.uv&&(U||xe),fog:!!X,useFog:_.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||L.attributes.normal===void 0&&de===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Ce,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:L.attributes.position!==void 0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:le,morphTextureStride:Ue,numSunLights:y.sun.length,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numSunLightShadows:y.sunShadowMap.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numLightProbeGrids:O.filter(Pe=>Pe.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:n.shadowMap.enabled&&C.length>0,shadowMapType:n.shadowMap.type,toneMapping:me,decodeVideoTexture:U&&_.map.isVideoTexture===!0&&dt.getTransfer(_.map.colorSpace)===bt,decodeVideoTextureEmissive:Oe&&_.emissiveMap.isVideoTexture===!0&&dt.getTransfer(_.emissiveMap.colorSpace)===bt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Bn,flipSided:_.side===_n,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:tt&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(tt&&_.extensions.multiDraw===!0||yt)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return st.vertexUv1s=l.has(1),st.vertexUv2s=l.has(2),st.vertexUv3s=l.has(3),l.clear(),st}function b(_){const y=[];if(_.shaderID?y.push(_.shaderID):(y.push(_.customVertexShaderID),y.push(_.customFragmentShaderID)),_.defines!==void 0)for(const C in _.defines)y.push(C),y.push(_.defines[C]);return _.isRawShaderMaterial===!1&&(m(y,_),p(y,_),y.push(n.outputColorSpace)),y.push(_.customProgramCacheKey),y.join()}function m(_,y){_.push(y.precision),_.push(y.outputColorSpace),_.push(y.envMapMode),_.push(y.envMapPMREM),_.push(y.envMapMaxLod),_.push(y.envMapSize),_.push(y.mapUv),_.push(y.alphaMapUv),_.push(y.lightMapUv),_.push(y.aoMapUv),_.push(y.bumpMapUv),_.push(y.normalMapUv),_.push(y.displacementMapUv),_.push(y.emissiveMapUv),_.push(y.metalnessMapUv),_.push(y.roughnessMapUv),_.push(y.anisotropyMapUv),_.push(y.clearcoatMapUv),_.push(y.clearcoatNormalMapUv),_.push(y.clearcoatRoughnessMapUv),_.push(y.diffuseRoughnessMapUv),_.push(y.iridescenceMapUv),_.push(y.iridescenceThicknessMapUv),_.push(y.sheenColorMapUv),_.push(y.sheenRoughnessMapUv),_.push(y.specularMapUv),_.push(y.specularColorMapUv),_.push(y.specularIntensityMapUv),_.push(y.transmissionMapUv),_.push(y.thicknessMapUv),_.push(y.combine),_.push(y.fogExp2),_.push(y.sizeAttenuation),_.push(y.morphTargetsCount),_.push(y.numSunLights),_.push(y.numDirLights),_.push(y.numPointLights),_.push(y.numSpotLights),_.push(y.numSpotLightMaps),_.push(y.numHemiLights),_.push(y.numRectAreaLights),_.push(y.numSunLightShadows),_.push(y.numDirLightShadows),_.push(y.numPointLightShadows),_.push(y.numSpotLightShadows),_.push(y.numSpotLightShadowsWithMaps),_.push(y.numLightProbes),_.push(y.numLightProbeGrids),_.push(y.shadowMapType),_.push(y.toneMapping),_.push(y.numClippingPlanes),_.push(y.numClipIntersection),_.push(y.depthPacking)}function p(_,y){a.disableAll(),y.instancing&&a.enable(0),y.instancingColor&&a.enable(1),y.instancingMorph&&a.enable(2),y.matcap&&a.enable(3),y.envMap&&a.enable(4),y.normalMapObjectSpace&&a.enable(5),y.normalMapTangentSpace&&a.enable(6),y.clearcoat&&a.enable(7),y.iridescence&&a.enable(8),y.alphaTest&&a.enable(9),y.vertexColors&&a.enable(10),y.vertexAlphas&&a.enable(11),y.vertexUv1s&&a.enable(12),y.vertexUv2s&&a.enable(13),y.vertexUv3s&&a.enable(14),y.vertexTangents&&a.enable(15),y.anisotropy&&a.enable(16),y.alphaHash&&a.enable(17),y.batching&&a.enable(18),y.dispersion&&a.enable(19),y.retroreflection&&a.enable(24),y.diffuseRoughness&&a.enable(25),y.batchingColor&&a.enable(20),y.gradientMap&&a.enable(21),y.packedNormalMap&&a.enable(22),y.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reversedDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),y.numLightProbeGrids>0&&a.enable(22),y.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function v(_){const y=u[_.type];let C;if(y){const A=qn[y];C=Vf.clone(A.uniforms)}else C=_.uniforms;return C}function E(_,y){let C=h.get(y);return C!==void 0?++C.usedTimes:(C=new g_(n,y,_,s),c.push(C),h.set(y,C)),C}function S(_){if(--_.usedTimes===0){const y=c.indexOf(_);c[y]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function R(_){o.remove(_)}function T(){o.dispose()}return{getParameters:g,getProgramCacheKey:b,getUniforms:v,acquireProgram:E,releaseProgram:S,releaseShaderCache:R,programs:c,dispose:T}}function y_(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function b_(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function kc(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function zc(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function o(u,f,g,b,m,p){let v=n[e];return v===void 0?(v={id:u.id,object:u,geometry:f,material:g,materialVariant:a(u),groupOrder:b,renderOrder:u.renderOrder,z:m,group:p},n[e]=v):(v.id=u.id,v.object=u,v.geometry=f,v.material=g,v.materialVariant=a(u),v.groupOrder=b,v.renderOrder=u.renderOrder,v.z=m,v.group=p),e++,v}function l(u,f,g,b,m,p,v){v.reversedDepth===!0&&(m=-m);const E=o(u,f,g,b,m,p);g.transmission>0?i.push(E):g.transparent===!0?s.push(E):t.push(E)}function c(u,f,g,b,m,p){const v=o(u,f,g,b,m,p);g.transmission>0?i.unshift(v):g.transparent===!0?s.unshift(v):t.unshift(v)}function h(u,f){t.length>1&&t.sort(u||b_),i.length>1&&i.sort(f||kc),s.length>1&&s.sort(f||kc)}function d(){for(let u=e,f=n.length;u<f;u++){const g=n[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function E_(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new zc,n.set(i,[a])):s>=r.length?(a=new zc,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function T_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new F,color:new ct};break;case"SpotLight":t={position:new F,direction:new F,color:new ct,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new F,color:new ct,distance:0,decay:0};break;case"HemisphereLight":t={direction:new F,skyColor:new ct,groundColor:new ct};break;case"RectAreaLight":t={color:new ct,position:new F,halfWidth:new F,halfHeight:new F};break}return n[e.id]=t,t}}}function w_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ve};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ve};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ve,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let A_=0;function R_(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function C_(n){const e=new T_,t=w_(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new F);const s=new F,r=new It,a=new It;function o(c){let h=0,d=0,u=0;for(let O=0;O<9;O++)i.probe[O].set(0,0,0);let f=0,g=0,b=0,m=0,p=0,v=0,E=0,S=0,R=0,T=0,_=0,y=0,C=0,A=0;c.sort(R_);for(let O=0,X=c.length;O<X;O++){const L=c[O],$=L.color,J=L.intensity,G=L.distance;let he=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===Bi?he=L.shadow.map.texture:he=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)h+=$.r*J,d+=$.g*J,u+=$.b*J;else if(L.isLightProbe){for(let Z=0;Z<9;Z++)i.probe[Z].addScaledVector(L.sh.coefficients[Z],J);A++}else if(L.isSunLight){const Z=e.get(L);if(Z.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const ae=L.shadow,le=t.get(L);le.shadowIntensity=ae.intensity,le.shadowBias=ae.bias,le.shadowNormalBias=ae.normalBias,le.shadowRadius=ae.radius,le.shadowMapSize.copy(ae.mapSize).multiply(ae.getFrameExtents()),i.sunShadow[g]=le,i.sunShadowMap[g]=he;const Ue=ae.getViewportCount();for(let qe=0;qe<Ue;qe++)i.sunShadowMatrix[b+qe]=ae.getMatrix(qe),i.sunShadowCascade[b+qe]=ae._cascadeData[qe];b+=Ue,g++}i.sun[f]=Z,f++}else if(L.isDirectionalLight){const Z=e.get(L);if(Z.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const ae=L.shadow,le=t.get(L);le.shadowIntensity=ae.intensity,le.shadowBias=ae.bias,le.shadowNormalBias=ae.normalBias,le.shadowRadius=ae.radius,le.shadowMapSize=ae.mapSize,i.directionalShadow[m]=le,i.directionalShadowMap[m]=he,i.directionalShadowMatrix[m]=L.shadow.matrix,R++}i.directional[m]=Z,m++}else if(L.isSpotLight){const Z=e.get(L);Z.position.setFromMatrixPosition(L.matrixWorld),Z.color.copy($).multiplyScalar(J),Z.distance=G,Z.coneCos=Math.cos(L.angle),Z.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),Z.decay=L.decay,i.spot[v]=Z;const ae=L.shadow;if(L.map&&(i.spotLightMap[y]=L.map,y++,ae.updateMatrices(L),L.castShadow&&C++),i.spotLightMatrix[v]=ae.matrix,L.castShadow){const le=t.get(L);le.shadowIntensity=ae.intensity,le.shadowBias=ae.bias,le.shadowNormalBias=ae.normalBias,le.shadowRadius=ae.radius,le.shadowMapSize=ae.mapSize,i.spotShadow[v]=le,i.spotShadowMap[v]=he,_++}v++}else if(L.isRectAreaLight){const Z=e.get(L);Z.color.copy($).multiplyScalar(J),Z.halfWidth.set(L.width*.5,0,0),Z.halfHeight.set(0,L.height*.5,0),i.rectArea[E]=Z,E++}else if(L.isPointLight){const Z=e.get(L);if(Z.color.copy(L.color).multiplyScalar(L.intensity),Z.distance=L.distance,Z.decay=L.decay,L.castShadow){const ae=L.shadow,le=t.get(L);le.shadowIntensity=ae.intensity,le.shadowBias=ae.bias,le.shadowNormalBias=ae.normalBias,le.shadowRadius=ae.radius,le.shadowMapSize=ae.mapSize,le.shadowCameraNear=ae.camera.near,le.shadowCameraFar=ae.camera.far,i.pointShadow[p]=le,i.pointShadowMap[p]=he,i.pointShadowMatrix[p]=L.shadow.matrix,T++}i.point[p]=Z,p++}else if(L.isHemisphereLight){const Z=e.get(L);Z.skyColor.copy(L.color).multiplyScalar(J),Z.groundColor.copy(L.groundColor).multiplyScalar(J),i.hemi[S]=Z,S++}}E>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Le.LTC_FLOAT_1,i.rectAreaLTC2=Le.LTC_FLOAT_2):(i.rectAreaLTC1=Le.LTC_HALF_1,i.rectAreaLTC2=Le.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=d,i.ambient[2]=u;const D=i.hash;(D.sunLength!==f||D.directionalLength!==m||D.pointLength!==p||D.spotLength!==v||D.rectAreaLength!==E||D.hemiLength!==S||D.numSunShadows!==g||D.numDirectionalShadows!==R||D.numPointShadows!==T||D.numSpotShadows!==_||D.numSpotMaps!==y||D.numLightProbes!==A)&&(i.sun.length=f,i.directional.length=m,i.spot.length=v,i.rectArea.length=E,i.point.length=p,i.hemi.length=S,i.sunShadow.length=g,i.sunShadowMap.length=g,i.sunShadowMatrix.length=b,i.sunShadowCascade.length=b,i.directionalShadow.length=R,i.directionalShadowMap.length=R,i.directionalShadowMatrix.length=R,i.pointShadow.length=T,i.pointShadowMap.length=T,i.pointShadowMatrix.length=T,i.spotShadow.length=_,i.spotShadowMap.length=_,i.spotLightMatrix.length=_+y-C,i.spotLightMap.length=y,i.numSpotLightShadowsWithMaps=C,i.numLightProbes=A,D.sunLength=f,D.directionalLength=m,D.pointLength=p,D.spotLength=v,D.rectAreaLength=E,D.hemiLength=S,D.numSunShadows=g,D.numDirectionalShadows=R,D.numPointShadows=T,D.numSpotShadows=_,D.numSpotMaps=y,D.numLightProbes=A,i.version=A_++)}function l(c,h){let d=0,u=0,f=0,g=0,b=0,m=0;const p=h.matrixWorldInverse;for(let v=0,E=c.length;v<E;v++){const S=c[v];if(S.isSunLight){const R=i.sun[d];R.direction.setFromMatrixPosition(S.matrixWorld),R.direction.transformDirection(p),d++}else if(S.isDirectionalLight){const R=i.directional[u];R.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),R.direction.sub(s),R.direction.transformDirection(p),u++}else if(S.isSpotLight){const R=i.spot[g];R.position.setFromMatrixPosition(S.matrixWorld),R.position.applyMatrix4(p),R.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),R.direction.sub(s),R.direction.transformDirection(p),g++}else if(S.isRectAreaLight){const R=i.rectArea[b];R.position.setFromMatrixPosition(S.matrixWorld),R.position.applyMatrix4(p),a.identity(),r.copy(S.matrixWorld),r.premultiply(p),a.extractRotation(r),R.halfWidth.set(S.width*.5,0,0),R.halfHeight.set(0,S.height*.5,0),R.halfWidth.applyMatrix4(a),R.halfHeight.applyMatrix4(a),b++}else if(S.isPointLight){const R=i.point[f];R.position.setFromMatrixPosition(S.matrixWorld),R.position.applyMatrix4(p),f++}else if(S.isHemisphereLight){const R=i.hemi[m];R.direction.setFromMatrixPosition(S.matrixWorld),R.direction.transformDirection(p),m++}}}return{setup:o,setupView:l,state:i}}function Gc(n){const e=new C_(n),t=[],i=[],s=[];function r(d){h.camera=d,t.length=0,i.length=0,s.length=0}function a(d){d.isLightProbeGrid?s.push(d):t.push(d)}function o(d){i.push(d)}function l(){e.setup(t),s.sort((d,u)=>d.priority-u.priority||d.id-u.id)}function c(d){e.setupView(t,d)}const h={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function P_(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Gc(n),e.set(s,[o])):r>=a.length?(o=new Gc(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const L_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,D_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,I_=[new F(1,0,0),new F(-1,0,0),new F(0,1,0),new F(0,-1,0),new F(0,0,1),new F(0,0,-1)],F_=[new F(0,-1,0),new F(0,-1,0),new F(0,0,1),new F(0,0,-1),new F(0,-1,0),new F(0,-1,0)],Hc=new It,ys=new F,Ua=new F;function N_(n,e,t){let i=new Ws;const s=new ve,r=new ve,a=new kt,o=new qf,l=new Yf,c={},h=t.maxTextureSize,d={[Oi]:_n,[_n]:Oi,[Bn]:Bn},u=new Ti({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ve},radius:{value:4}},vertexShader:L_,fragmentShader:D_}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const g=new vn;g.setAttribute("position",new Ni(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const b=new qt(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ls;let p=this.type;this.render=function(T,_,y){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;this.type===Vu&&(Je("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Ls);const C=n.getRenderTarget(),A=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),O=n.state;O.setBlending(ls),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const X=p!==this.type;X&&_.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach($=>$.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,$=T.length;L<$;L++){const J=T[L],G=J.shadow;if(G===void 0){Je("WebGLShadowMap:",J,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);const he=G.getFrameExtents();s.multiply(he),r.copy(G.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/he.x),s.x=r.x*he.x,G.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/he.y),s.y=r.y*he.y,G.mapSize.y=r.y));const Z=n.state.buffers.depth.getReversed();if(G.camera._reversedDepth=Z,G.map===null||X===!0){if(G.map!==null&&(G.map.depthTexture!==null&&(G.map.depthTexture.dispose(),G.map.depthTexture=null),G.map.dispose()),this.type===As){if(J.isPointLight){Je("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}G.map=new Jn(s.x,s.y,{format:Bi,type:jn,minFilter:En,magFilter:En,generateMipmaps:!1}),G.map.texture.name=J.name+".shadowMap",G.map.depthTexture=new fs(s.x,s.y,Zn),G.map.depthTexture.name=J.name+".shadowMapDepth",G.map.depthTexture.format=Ei,G.map.depthTexture.compareFunction=null,G.map.depthTexture.minFilter=an,G.map.depthTexture.magFilter=an}else J.isPointLight?(G.map=new gl(s.x),G.map.depthTexture=new Ih(s.x,Qn)):(G.map=new Jn(s.x,s.y),G.map.depthTexture=new fs(s.x,s.y,Qn)),G.map.depthTexture.name=J.name+".shadowMap",G.map.depthTexture.format=Ei,this.type===Ls?(G.map.depthTexture.compareFunction=Z?yh:Sh,G.map.depthTexture.minFilter=En,G.map.depthTexture.magFilter=En):(G.map.depthTexture.compareFunction=null,G.map.depthTexture.minFilter=an,G.map.depthTexture.magFilter=an);G.camera.updateProjectionMatrix()}G.map.isWebGLCubeRenderTarget!==!0&&(G.map.width!==s.x||G.map.height!==s.y)&&G.map.setSize(s.x,s.y);const ae=G.map.isWebGLCubeRenderTarget?6:G.getViewportCount();J.isPointLight!==!0&&G.updateMatrices(J,y);const le=(G.camera.layers.mask&4294967294)!==0?G.camera.layers:y.layers;for(let Ue=0;Ue<ae;Ue++){const qe=G.getCamera(Ue);if(J.isPointLight){const ne=G.camera,fe=G.matrix,Ne=J.distance||ne.far;Ne!==ne.far&&(ne.far=Ne,ne.updateProjectionMatrix()),ys.setFromMatrixPosition(J.matrixWorld),ne.position.copy(ys),Ua.copy(ne.position),Ua.add(I_[Ue]),ne.up.copy(F_[Ue]),ne.lookAt(Ua),ne.updateMatrixWorld(),fe.makeTranslation(-ys.x,-ys.y,-ys.z),Hc.multiplyMatrices(ne.projectionMatrix,ne.matrixWorldInverse),G._frustum.setFromProjectionMatrix(Hc,ne.coordinateSystem,ne.reversedDepth)}if(G.map.isWebGLCubeRenderTarget)n.setRenderTarget(G.map,Ue),n.clear();else{Ue===0&&(n.setRenderTarget(G.map),n.clear());const ne=G.getViewport(Ue);a.set(r.x*ne.x,r.y*ne.y,r.x*ne.z,r.y*ne.w),O.viewport(a)}i=G.getFrustum(Ue),S(_,y,qe,J,le,this.type)}G.isPointLightShadow!==!0&&this.type===As&&v(G,y),G.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(C,A,D)};function v(T,_){const y=e.update(b);u.defines.VSM_SAMPLES!==T.blurSamples&&(u.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null?T.mapPass=new Jn(s.x,s.y,{format:Bi,type:jn}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),u.uniforms.shadow_pass.value=T.map.depthTexture,u.uniforms.resolution.value.set(T.map.width,T.map.height),u.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(_,null,y,u,b,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value.set(T.map.width,T.map.height),f.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(_,null,y,f,b,null)}function E(T,_,y,C){let A=null;const D=y.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(D!==void 0)A=D;else if(A=y.isPointLight===!0?l:o,n.localClippingEnabled&&_.clipShadows===!0&&Array.isArray(_.clippingPlanes)&&_.clippingPlanes.length!==0||_.displacementMap&&_.displacementScale!==0||_.alphaMap&&_.alphaTest>0||_.map&&_.alphaTest>0||_.alphaToCoverage===!0){const O=A.uuid,X=_.uuid;let L=c[O];L===void 0&&(L={},c[O]=L);let $=L[X];$===void 0&&($=A.clone(),L[X]=$,_.addEventListener("dispose",R)),A=$}if(A.visible=_.visible,A.wireframe=_.wireframe,C===As?A.side=_.shadowSide!==null?_.shadowSide:_.side:A.side=_.shadowSide!==null?_.shadowSide:d[_.side],A.alphaMap=_.alphaMap,A.alphaTest=_.alphaToCoverage===!0?.5:_.alphaTest,A.map=_.map,A.clipShadows=_.clipShadows,A.clippingPlanes=_.clippingPlanes,A.clipIntersection=_.clipIntersection,A.displacementMap=_.displacementMap,A.displacementScale=_.displacementScale,A.displacementBias=_.displacementBias,A.wireframeLinewidth=_.wireframeLinewidth,A.linewidth=_.linewidth,y.isPointLight===!0&&A.isMeshDistanceMaterial===!0){const O=n.properties.get(A);O.light=y}return A}function S(T,_,y,C,A,D){if(T.visible===!1)return;if(T.layers.test(A)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&D===As)&&(!T.frustumCulled||T.intersectsFrustum(i))){T.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,T.matrixWorld);const L=e.update(T),$=T.material;if(Array.isArray($)){const J=L.groups;for(let G=0,he=J.length;G<he;G++){const Z=J[G],ae=$[Z.materialIndex];if(ae&&ae.visible){const le=E(T,ae,C,D);T.onBeforeShadow(n,T,_,y,L,le,Z),n.renderBufferDirect(y,null,L,le,T,Z),T.onAfterShadow(n,T,_,y,L,le,Z)}}}else if($.visible){const J=E(T,$,C,D);T.onBeforeShadow(n,T,_,y,L,J,null),n.renderBufferDirect(y,null,L,J,T,null),T.onAfterShadow(n,T,_,y,L,J,null)}}const X=T.children;for(let L=0,$=X.length;L<$;L++)S(X[L],_,y,C,A,D)}function R(T){T.target.removeEventListener("dispose",R);for(const y in c){const C=c[y],A=T.target.uuid;A in C&&(C[A].dispose(),delete C[A])}}}function U_(n,e){function t(){let P=!1;const ie=new kt;let ee=null;const ye=new kt(0,0,0,0);return{setMask:function(xe){ee!==xe&&!P&&(n.colorMask(xe,xe,xe,xe),ee=xe)},setLocked:function(xe){P=xe},setClear:function(xe,be,He,tt,me){me===!0&&(xe*=tt,be*=tt,He*=tt),ie.set(xe,be,He,tt),ye.equals(ie)===!1&&(n.clearColor(xe,be,He,tt),ye.copy(ie))},reset:function(){P=!1,ee=null,ye.set(-1,0,0,0)}}}function i(){let P=!1,ie=!1,ee=null,ye=null,xe=null;return{setReversed:function(be){if(ie!==be){const He=e.get("EXT_clip_control");be?He.clipControlEXT(He.LOWER_LEFT_EXT,He.ZERO_TO_ONE_EXT):He.clipControlEXT(He.LOWER_LEFT_EXT,He.NEGATIVE_ONE_TO_ONE_EXT),ie=be;const tt=xe;xe=null,this.setClear(tt)}},getReversed:function(){return ie},setTest:function(be){be?Ce(n.DEPTH_TEST):Xe(n.DEPTH_TEST)},setMask:function(be){ee!==be&&!P&&(n.depthMask(be),ee=be)},setFunc:function(be){if(ie&&(be=bd[be]),ye!==be){switch(be){case Ka:n.depthFunc(n.NEVER);break;case Ja:n.depthFunc(n.ALWAYS);break;case Qa:n.depthFunc(n.LESS);break;case ks:n.depthFunc(n.LEQUAL);break;case ja:n.depthFunc(n.EQUAL);break;case eo:n.depthFunc(n.GEQUAL);break;case to:n.depthFunc(n.GREATER);break;case no:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ye=be}},setLocked:function(be){P=be},setClear:function(be){xe!==be&&(xe=be,ie&&(be=1-be),n.clearDepth(be))},reset:function(){P=!1,ee=null,ye=null,xe=null,ie=!1}}}function s(){let P=!1,ie=null,ee=null,ye=null,xe=null,be=null,He=null,tt=null,me=null;return{setTest:function(Ye){P||(Ye?Ce(n.STENCIL_TEST):Xe(n.STENCIL_TEST))},setMask:function(Ye){ie!==Ye&&!P&&(n.stencilMask(Ye),ie=Ye)},setFunc:function(Ye,st,Pe){(ee!==Ye||ye!==st||xe!==Pe)&&(n.stencilFunc(Ye,st,Pe),ee=Ye,ye=st,xe=Pe)},setOp:function(Ye,st,Pe){(be!==Ye||He!==st||tt!==Pe)&&(n.stencilOp(Ye,st,Pe),be=Ye,He=st,tt=Pe)},setLocked:function(Ye){P=Ye},setClear:function(Ye){me!==Ye&&(n.clearStencil(Ye),me=Ye)},reset:function(){P=!1,ie=null,ee=null,ye=null,xe=null,be=null,He=null,tt=null,me=null}}}const r=new t,a=new i,o=new s;let l={};const c=new WeakMap;let h={},d={},u={},f=new WeakMap,g=[],b=null,m=!1,p=null,v=null,E=null,S=null,R=null,T=null,_=null,y=new ct(0,0,0),C=0,A=!1,D=null,O=null,X=null,L=null,$=null;const J=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,he=0;const Z=n.getParameter(n.VERSION);Z.indexOf("WebGL")!==-1?(he=parseFloat(/^WebGL (\d)/.exec(Z)[1]),G=he>=1):Z.indexOf("OpenGL ES")!==-1&&(he=parseFloat(/^OpenGL ES (\d)/.exec(Z)[1]),G=he>=2);let ae=null,le={};const Ue=n.getParameter(n.SCISSOR_BOX),qe=n.getParameter(n.VIEWPORT),ne=new kt().fromArray(Ue),fe=new kt().fromArray(qe);function Ne(P,ie,ee,ye){const xe=new Uint8Array(4),be=n.createTexture();n.bindTexture(P,be),n.texParameteri(P,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(P,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let He=0;He<ee;He++)P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY?n.texImage3D(ie,0,n.RGBA,1,1,ye,0,n.RGBA,n.UNSIGNED_BYTE,xe):n.texImage2D(ie+He,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,xe);return be}const We={};We[n.TEXTURE_2D]=Ne(n.TEXTURE_2D,n.TEXTURE_2D,1),We[n.TEXTURE_CUBE_MAP]=Ne(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),We[n.TEXTURE_2D_ARRAY]=Ne(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),We[n.TEXTURE_3D]=Ne(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Ce(n.DEPTH_TEST),a.setFunc(ks),pe(!1),de(Ul),Ce(n.CULL_FACE),te(ls);function Ce(P){h[P]!==!0&&(n.enable(P),h[P]=!0)}function Xe(P){h[P]!==!1&&(n.disable(P),h[P]=!1)}function yt(P,ie){return u[P]!==ie?(n.bindFramebuffer(P,ie),u[P]=ie,P===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=ie),P===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=ie),!0):!1}function U(P,ie){let ee=g,ye=!1;if(P){ee=f.get(ie),ee===void 0&&(ee=[],f.set(ie,ee));const xe=P.textures;if(ee.length!==xe.length||ee[0]!==n.COLOR_ATTACHMENT0){for(let be=0,He=xe.length;be<He;be++)ee[be]=n.COLOR_ATTACHMENT0+be;ee.length=xe.length,ye=!0}}else ee[0]!==n.BACK&&(ee[0]=n.BACK,ye=!0);ye&&n.drawBuffers(ee)}function k(P){return b!==P?(n.useProgram(P),b=P,!0):!1}const j={[ns]:n.FUNC_ADD,[Xu]:n.FUNC_SUBTRACT,[$u]:n.FUNC_REVERSE_SUBTRACT};j[qu]=n.MIN,j[Yu]=n.MAX;const B={[Zu]:n.ZERO,[Ku]:n.ONE,[Ju]:n.SRC_COLOR,[sh]:n.SRC_ALPHA,[id]:n.SRC_ALPHA_SATURATE,[td]:n.DST_COLOR,[ju]:n.DST_ALPHA,[Qu]:n.ONE_MINUS_SRC_COLOR,[rh]:n.ONE_MINUS_SRC_ALPHA,[nd]:n.ONE_MINUS_DST_COLOR,[ed]:n.ONE_MINUS_DST_ALPHA,[sd]:n.CONSTANT_COLOR,[rd]:n.ONE_MINUS_CONSTANT_COLOR,[ad]:n.CONSTANT_ALPHA,[od]:n.ONE_MINUS_CONSTANT_ALPHA};function te(P,ie,ee,ye,xe,be,He,tt,me,Ye){if(P===ls){m===!0&&(Xe(n.BLEND),m=!1);return}if(m===!1&&(Ce(n.BLEND),m=!0),P!==Wu){if(P!==p||Ye!==A){if((v!==ns||R!==ns)&&(n.blendEquation(n.FUNC_ADD),v=ns,R=ns),Ye)switch(P){case Ds:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ol:n.blendFunc(n.ONE,n.ONE);break;case Bl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case kl:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:mt("WebGLState: Invalid blending: ",P);break}else switch(P){case Ds:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ol:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Bl:mt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case kl:mt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:mt("WebGLState: Invalid blending: ",P);break}E=null,S=null,T=null,_=null,y.set(0,0,0),C=0,p=P,A=Ye}return}xe=xe||ie,be=be||ee,He=He||ye,(ie!==v||xe!==R)&&(n.blendEquationSeparate(j[ie],j[xe]),v=ie,R=xe),(ee!==E||ye!==S||be!==T||He!==_)&&(n.blendFuncSeparate(B[ee],B[ye],B[be],B[He]),E=ee,S=ye,T=be,_=He),(tt.equals(y)===!1||me!==C)&&(n.blendColor(tt.r,tt.g,tt.b,me),y.copy(tt),C=me),p=P,A=!1}function ce(P,ie){P.side===Bn?Xe(n.CULL_FACE):Ce(n.CULL_FACE);let ee=P.side===_n;ie&&(ee=!ee),pe(ee),P.blending===Ds&&P.transparent===!1?te(ls):te(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),a.setFunc(P.depthFunc),a.setTest(P.depthTest),a.setMask(P.depthWrite),r.setMask(P.colorWrite);const ye=P.stencilWrite;o.setTest(ye),ye&&(o.setMask(P.stencilWriteMask),o.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),o.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),Oe(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?Ce(n.SAMPLE_ALPHA_TO_COVERAGE):Xe(n.SAMPLE_ALPHA_TO_COVERAGE)}function pe(P){D!==P&&(P?n.frontFace(n.CW):n.frontFace(n.CCW),D=P)}function de(P){P!==Gu?(Ce(n.CULL_FACE),P!==O&&(P===Ul?n.cullFace(n.BACK):P===Hu?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Xe(n.CULL_FACE),O=P}function Ge(P){P!==X&&(G&&n.lineWidth(P),X=P)}function Oe(P,ie,ee){P?(Ce(n.POLYGON_OFFSET_FILL),(L!==ie||$!==ee)&&(L=ie,$=ee,a.getReversed()&&(ie=-ie,ee=-ee),n.polygonOffset(ie,ee))):Xe(n.POLYGON_OFFSET_FILL)}function it(P){P?Ce(n.SCISSOR_TEST):Xe(n.SCISSOR_TEST)}function rt(P){P===void 0&&(P=n.TEXTURE0+J-1),ae!==P&&(n.activeTexture(P),ae=P)}function lt(P,ie,ee){ee===void 0&&(ae===null?ee=n.TEXTURE0+J-1:ee=ae);let ye=le[ee];ye===void 0&&(ye={type:void 0,texture:void 0},le[ee]=ye),(ye.type!==P||ye.texture!==ie)&&(ae!==ee&&(n.activeTexture(ee),ae=ee),n.bindTexture(P,ie||We[P]),ye.type=P,ye.texture=ie)}function N(){const P=le[ae];P!==void 0&&P.type!==void 0&&(n.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function Rt(){try{n.compressedTexImage2D(...arguments)}catch(P){mt("WebGLState:",P)}}function et(){try{n.compressedTexImage3D(...arguments)}catch(P){mt("WebGLState:",P)}}function St(){try{n.texSubImage2D(...arguments)}catch(P){mt("WebGLState:",P)}}function Ae(){try{n.texSubImage3D(...arguments)}catch(P){mt("WebGLState:",P)}}function Lt(){try{n.compressedTexSubImage2D(...arguments)}catch(P){mt("WebGLState:",P)}}function $e(){try{n.compressedTexSubImage3D(...arguments)}catch(P){mt("WebGLState:",P)}}function Ke(){try{n.texStorage2D(...arguments)}catch(P){mt("WebGLState:",P)}}function w(){try{n.texStorage3D(...arguments)}catch(P){mt("WebGLState:",P)}}function M(){try{n.texImage2D(...arguments)}catch(P){mt("WebGLState:",P)}}function H(){try{n.texImage3D(...arguments)}catch(P){mt("WebGLState:",P)}}function ue(P){return d[P]!==void 0?d[P]:n.getParameter(P)}function re(P,ie){d[P]!==ie&&(n.pixelStorei(P,ie),d[P]=ie)}function Ee(P){ne.equals(P)===!1&&(n.scissor(P.x,P.y,P.z,P.w),ne.copy(P))}function Se(P){fe.equals(P)===!1&&(n.viewport(P.x,P.y,P.z,P.w),fe.copy(P))}function Q(P,ie){let ee=c.get(ie);ee===void 0&&(ee=new WeakMap,c.set(ie,ee));let ye=ee.get(P);ye===void 0&&(ye=n.getUniformBlockIndex(ie,P.name),n.uniformBlockBinding(ie,ye,ye),ee.set(P,ye))}function se(P,ie,ee){const xe=c.get(ie).get(P);l[xe]!==ee&&(n.bindBufferBase(n.UNIFORM_BUFFER,xe,ee),l[xe]=ee)}function ge(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),h={},d={},ae=null,le={},u={},l={},f=new WeakMap,g=[],b=null,m=!1,p=null,v=null,E=null,S=null,R=null,T=null,_=null,y=new ct(0,0,0),C=0,A=!1,D=null,O=null,X=null,L=null,$=null,ne.set(0,0,n.canvas.width,n.canvas.height),fe.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:Ce,disable:Xe,bindFramebuffer:yt,drawBuffers:U,useProgram:k,setBlending:te,setMaterial:ce,setFlipSided:pe,setCullFace:de,setLineWidth:Ge,setPolygonOffset:Oe,setScissorTest:it,activeTexture:rt,bindTexture:lt,unbindTexture:N,compressedTexImage2D:Rt,compressedTexImage3D:et,texImage2D:M,texImage3D:H,pixelStorei:re,getParameter:ue,updateUBOMapping:Q,uniformBlockBinding:se,texStorage2D:Ke,texStorage3D:w,texSubImage2D:St,texSubImage3D:Ae,compressedTexSubImage2D:Lt,compressedTexSubImage3D:$e,scissor:Ee,viewport:Se,reset:ge}}function O_(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ve,h=new WeakMap,d=new Set;let u;const f=new WeakMap,g=new Set,b=new FinalizationRegistry(w=>g.delete(w));let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(w,M){return m?new OffscreenCanvas(w,M):qr("canvas")}function v(w,M,H){let ue=1;const re=Ke(w);if((re.width>H||re.height>H)&&(ue=H/Math.max(re.width,re.height)),ue<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const Ee=Math.floor(ue*re.width),Se=Math.floor(ue*re.height);u===void 0&&(u=p(Ee,Se));const Q=M?p(Ee,Se):u;return Q.width=Ee,Q.height=Se,Q.getContext("2d").drawImage(w,0,0,Ee,Se),Je("WebGLRenderer: Texture has been resized from ("+re.width+"x"+re.height+") to ("+Ee+"x"+Se+")."),Q}else return"data"in w&&Je("WebGLRenderer: Image in DataTexture is too big ("+re.width+"x"+re.height+")."),w;return w}function E(w){return w.generateMipmaps}function S(w){n.generateMipmap(w)}function R(w){return w.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?n.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function T(w,M,H,ue,re,Ee=!1){if(w!==null){if(n[w]!==void 0)return n[w];Je("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let Se;ue&&(Se=e.get("EXT_texture_norm16"),Se||Je("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Q=M;if(M===n.RED&&(H===n.FLOAT&&(Q=n.R32F),H===n.HALF_FLOAT&&(Q=n.R16F),H===n.UNSIGNED_BYTE&&(Q=n.R8),H===n.UNSIGNED_SHORT&&Se&&(Q=Se.R16_EXT),H===n.SHORT&&Se&&(Q=Se.R16_SNORM_EXT)),M===n.RED_INTEGER&&(H===n.UNSIGNED_BYTE&&(Q=n.R8UI),H===n.UNSIGNED_SHORT&&(Q=n.R16UI),H===n.UNSIGNED_INT&&(Q=n.R32UI),H===n.BYTE&&(Q=n.R8I),H===n.SHORT&&(Q=n.R16I),H===n.INT&&(Q=n.R32I)),M===n.RG&&(H===n.FLOAT&&(Q=n.RG32F),H===n.HALF_FLOAT&&(Q=n.RG16F),H===n.UNSIGNED_BYTE&&(Q=n.RG8),H===n.UNSIGNED_SHORT&&Se&&(Q=Se.RG16_EXT),H===n.SHORT&&Se&&(Q=Se.RG16_SNORM_EXT)),M===n.RG_INTEGER&&(H===n.UNSIGNED_BYTE&&(Q=n.RG8UI),H===n.UNSIGNED_SHORT&&(Q=n.RG16UI),H===n.UNSIGNED_INT&&(Q=n.RG32UI),H===n.BYTE&&(Q=n.RG8I),H===n.SHORT&&(Q=n.RG16I),H===n.INT&&(Q=n.RG32I)),M===n.RGB_INTEGER&&(H===n.UNSIGNED_BYTE&&(Q=n.RGB8UI),H===n.UNSIGNED_SHORT&&(Q=n.RGB16UI),H===n.UNSIGNED_INT&&(Q=n.RGB32UI),H===n.BYTE&&(Q=n.RGB8I),H===n.SHORT&&(Q=n.RGB16I),H===n.INT&&(Q=n.RGB32I)),M===n.RGBA_INTEGER&&(H===n.UNSIGNED_BYTE&&(Q=n.RGBA8UI),H===n.UNSIGNED_SHORT&&(Q=n.RGBA16UI),H===n.UNSIGNED_INT&&(Q=n.RGBA32UI),H===n.BYTE&&(Q=n.RGBA8I),H===n.SHORT&&(Q=n.RGBA16I),H===n.INT&&(Q=n.RGBA32I)),M===n.RGB&&(H===n.UNSIGNED_SHORT&&Se&&(Q=Se.RGB16_EXT),H===n.SHORT&&Se&&(Q=Se.RGB16_SNORM_EXT),H===n.UNSIGNED_INT_5_9_9_9_REV&&(Q=n.RGB9_E5),H===n.UNSIGNED_INT_10F_11F_11F_REV&&(Q=n.R11F_G11F_B10F)),M===n.RGBA){const se=Ee?$r:dt.getTransfer(re);H===n.FLOAT&&(Q=n.RGBA32F),H===n.HALF_FLOAT&&(Q=n.RGBA16F),H===n.UNSIGNED_BYTE&&(Q=se===bt?n.SRGB8_ALPHA8:n.RGBA8),H===n.UNSIGNED_SHORT&&Se&&(Q=Se.RGBA16_EXT),H===n.SHORT&&Se&&(Q=Se.RGBA16_SNORM_EXT),H===n.UNSIGNED_SHORT_4_4_4_4&&(Q=n.RGBA4),H===n.UNSIGNED_SHORT_5_5_5_1&&(Q=n.RGB5_A1)}return(Q===n.R16F||Q===n.R32F||Q===n.RG16F||Q===n.RG32F||Q===n.RGBA16F||Q===n.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function _(w,M){let H;return w?M===null||M===Qn||M===ds?H=n.DEPTH24_STENCIL8:M===Zn?H=n.DEPTH32F_STENCIL8:M===Gs&&(H=n.DEPTH24_STENCIL8,Je("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Qn||M===ds?H=n.DEPTH_COMPONENT24:M===Zn?H=n.DEPTH_COMPONENT32F:M===Gs&&(H=n.DEPTH_COMPONENT16),H}function y(w,M){return E(w)===!0||w.isFramebufferTexture&&w.minFilter!==an&&w.minFilter!==En?Math.log2(Math.max(M.width,M.height))+1:w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?M.mipmaps.length:1}function C(w){const M=new WeakRef(w);i.get(w).__ref=M,g.add(M),b.register(w,M,M)}function A(w){const M=i.get(w).__ref;M!==void 0&&(g.delete(M),b.unregister(M))}function D(w){X(w.target)}function O(w){L(w.target)}function X(w){w.removeEventListener("dispose",D),A(w),J(w),w.isVideoTexture&&h.delete(w),w.isHTMLTexture&&d.delete(w)}function L(w){w.removeEventListener("dispose",O),A(w),he(w)}function $(){for(const w of g){const M=w.deref();M!==void 0&&(M.isRenderTarget===!0?L(M):X(M))}g.clear(),d.clear()}function J(w){const M=i.get(w);if(M.__webglInit===void 0)return;const H=w.source,ue=f.get(H);if(ue){const re=ue[M.__cacheKey];re.usedTimes--,re.usedTimes===0&&G(w),Object.keys(ue).length===0&&f.delete(H)}i.remove(w)}function G(w){const M=i.get(w);n.deleteTexture(M.__webglTexture);const H=w.source,ue=f.get(H);delete ue[M.__cacheKey],a.memory.textures--}function he(w){const M=i.get(w);M.__depthDisposeCallback&&M.__depthDisposeCallback();const H=w.depthTexture;if(H&&H.renderTarget===w&&X(H),w.isWebGLCubeRenderTarget)for(let re=0;re<6;re++){if(Array.isArray(M.__webglFramebuffer[re]))for(let Ee=0;Ee<M.__webglFramebuffer[re].length;Ee++)n.deleteFramebuffer(M.__webglFramebuffer[re][Ee]);else n.deleteFramebuffer(M.__webglFramebuffer[re]);M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer[re])}else{if(Array.isArray(M.__webglFramebuffer))for(let re=0;re<M.__webglFramebuffer.length;re++)n.deleteFramebuffer(M.__webglFramebuffer[re]);else n.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&n.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let re=0;re<M.__webglColorRenderbuffer.length;re++)M.__webglColorRenderbuffer[re]&&n.deleteRenderbuffer(M.__webglColorRenderbuffer[re]);M.__webglDepthRenderbuffer&&n.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const ue=w.textures;for(let re=0,Ee=ue.length;re<Ee;re++){const Se=i.get(ue[re]);Se.__webglTexture&&(n.deleteTexture(Se.__webglTexture),a.memory.textures--),i.remove(ue[re])}i.remove(w)}let Z=0;function ae(){Z=0}function le(){return Z}function Ue(w){Z=w}function qe(){const w=Z;return w>=s.maxTextures&&Je("WebGLTextures: Trying to use "+(w+1)+" texture units while this GPU supports only "+s.maxTextures),Z+=1,w}function ne(w){const M=[];return M.push(w.wrapS),M.push(w.wrapT),M.push(w.wrapR||0),M.push(w.magFilter),M.push(w.minFilter),M.push(w.anisotropy),M.push(w.internalFormat),M.push(w.format),M.push(w.type),M.push(w.generateMipmaps),M.push(w.mipmapsAutoUpdate),M.push(w.premultiplyAlpha),M.push(w.flipY),M.push(w.unpackAlignment),M.push(w.colorSpace),M.join()}function fe(w,M){const H=i.get(w);if(w.isVideoTexture&&Lt(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&H.__version!==w.version){const ue=w.image;if(ue===null)Je("WebGLRenderer: Texture marked for update but no image data found.");else if(ue.complete===!1)Je("WebGLRenderer: Texture marked for update but image is incomplete");else{ce(H,w,M);return}}else w.isExternalTexture&&(H.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,H.__webglTexture,n.TEXTURE0+M)}function Ne(w,M){const H=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&H.__version!==w.version){ce(H,w,M);return}else w.isExternalTexture&&(H.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,H.__webglTexture,n.TEXTURE0+M)}function We(w,M){const H=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&H.__version!==w.version){ce(H,w,M);return}t.bindTexture(n.TEXTURE_3D,H.__webglTexture,n.TEXTURE0+M)}function Ce(w,M){const H=i.get(w);if(w.version>0&&H.__version!==w.version){pe(H,w,M);return}t.bindTexture(n.TEXTURE_CUBE_MAP,H.__webglTexture,n.TEXTURE0+M)}const Xe={[io]:n.REPEAT,[li]:n.CLAMP_TO_EDGE,[so]:n.MIRRORED_REPEAT},yt={[an]:n.NEAREST,[hd]:n.NEAREST_MIPMAP_NEAREST,[ar]:n.NEAREST_MIPMAP_LINEAR,[En]:n.LINEAR,[ca]:n.LINEAR_MIPMAP_NEAREST,[Si]:n.LINEAR_MIPMAP_LINEAR},U={[pd]:n.NEVER,[bh]:n.ALWAYS,[md]:n.LESS,[Sh]:n.LEQUAL,[gd]:n.EQUAL,[yh]:n.GEQUAL,[_d]:n.GREATER,[vd]:n.NOTEQUAL};function k(w,M){if(M.type===Zn&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===En||M.magFilter===ca||M.magFilter===ar||M.magFilter===Si||M.minFilter===En||M.minFilter===ca||M.minFilter===ar||M.minFilter===Si)&&Je("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(w,n.TEXTURE_WRAP_S,Xe[M.wrapS]),n.texParameteri(w,n.TEXTURE_WRAP_T,Xe[M.wrapT]),(w===n.TEXTURE_3D||w===n.TEXTURE_2D_ARRAY)&&n.texParameteri(w,n.TEXTURE_WRAP_R,Xe[M.wrapR]),n.texParameteri(w,n.TEXTURE_MAG_FILTER,yt[M.magFilter]),n.texParameteri(w,n.TEXTURE_MIN_FILTER,yt[M.minFilter]),M.compareFunction&&(n.texParameteri(w,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(w,n.TEXTURE_COMPARE_FUNC,U[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===an||M.minFilter!==ar&&M.minFilter!==Si||M.type===Zn&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){const H=e.get("EXT_texture_filter_anisotropic");n.texParameterf(w,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function j(w,M){let H=!1;w.__webglInit===void 0&&(w.__webglInit=!0,M.addEventListener("dispose",D),C(M));const ue=M.source;let re=f.get(ue);re===void 0&&(re={},f.set(ue,re));const Ee=ne(M);if(Ee!==w.__cacheKey){re[Ee]===void 0&&(re[Ee]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,H=!0),re[Ee].usedTimes++;const Se=re[w.__cacheKey];Se!==void 0&&(re[w.__cacheKey].usedTimes--,Se.usedTimes===0&&G(M)),w.__cacheKey=Ee,w.__webglTexture=re[Ee].texture}return H}function B(w,M,H){return Math.floor(Math.floor(w/H)/M)}function te(w,M,H,ue){const Ee=w.updateRanges;if(Ee.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,M.width,M.height,H,ue,M.data);else{Ee.sort((P,ie)=>P.start-ie.start);let Se=0;for(let P=1;P<Ee.length;P++){const ie=Ee[Se],ee=Ee[P],ye=ie.start+ie.count,xe=B(ee.start,M.width,4),be=B(ie.start,M.width,4);ee.start<=ye+1&&xe===be&&B(ee.start+ee.count-1,M.width,4)===xe?ie.count=Math.max(ie.count,ee.start+ee.count-ie.start):(++Se,Ee[Se]=ee)}Ee.length=Se+1;const Q=t.getParameter(n.UNPACK_ROW_LENGTH),se=t.getParameter(n.UNPACK_SKIP_PIXELS),ge=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,M.width);for(let P=0,ie=Ee.length;P<ie;P++){const ee=Ee[P],ye=Math.floor(ee.start/4),xe=Math.ceil(ee.count/4),be=ye%M.width,He=Math.floor(ye/M.width),tt=xe,me=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,be),t.pixelStorei(n.UNPACK_SKIP_ROWS,He),t.texSubImage2D(n.TEXTURE_2D,0,be,He,tt,me,H,ue,M.data)}w.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,Q),t.pixelStorei(n.UNPACK_SKIP_PIXELS,se),t.pixelStorei(n.UNPACK_SKIP_ROWS,ge)}}function ce(w,M,H){let ue=n.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(ue=n.TEXTURE_2D_ARRAY),M.isData3DTexture&&(ue=n.TEXTURE_3D);const re=j(w,M),Ee=M.source;t.bindTexture(ue,w.__webglTexture,n.TEXTURE0+H);const Se=i.get(Ee);if(Ee.version!==Se.__version||re===!0){if(t.activeTexture(n.TEXTURE0+H),(typeof ImageBitmap<"u"&&M.image instanceof ImageBitmap)===!1){const me=dt.getPrimaries(dt.workingColorSpace),Ye=M.colorSpace===Mi?null:dt.getPrimaries(M.colorSpace),st=M.colorSpace===Mi||me===Ye?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,st)}t.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment);let se=v(M.image,!1,s.maxTextureSize);se=$e(M,se);const ge=r.convert(M.format,M.colorSpace),P=r.convert(M.type);let ie=T(M.internalFormat,ge,P,M.normalized,M.colorSpace,M.isVideoTexture);k(ue,M);let ee;const ye=M.mipmaps,xe=M.isVideoTexture!==!0,be=Se.__version===void 0||re===!0,He=Ee.dataReady,tt=y(M,se);if(M.isDepthTexture)ie=_(M.format===yi,M.type),be&&(xe?t.texStorage2D(n.TEXTURE_2D,1,ie,se.width,se.height):t.texImage2D(n.TEXTURE_2D,0,ie,se.width,se.height,0,ge,P,null));else if(M.isDataTexture)if(ye.length>0){xe&&be&&t.texStorage2D(n.TEXTURE_2D,tt,ie,ye[0].width,ye[0].height);for(let me=0,Ye=ye.length;me<Ye;me++)ee=ye[me],xe?He&&t.texSubImage2D(n.TEXTURE_2D,me,0,0,ee.width,ee.height,ge,P,ee.data):t.texImage2D(n.TEXTURE_2D,me,ie,ee.width,ee.height,0,ge,P,ee.data);M.generateMipmaps=!1}else xe?(be&&t.texStorage2D(n.TEXTURE_2D,tt,ie,se.width,se.height),He&&te(M,se,ge,P)):t.texImage2D(n.TEXTURE_2D,0,ie,se.width,se.height,0,ge,P,se.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){xe&&be&&t.texStorage3D(n.TEXTURE_2D_ARRAY,tt,ie,ye[0].width,ye[0].height,se.depth);for(let me=0,Ye=ye.length;me<Ye;me++)if(ee=ye[me],M.format!==Kn)if(ge!==null)if(xe){if(He)if(M.layerUpdates.size>0){const st=Sc(ee.width,ee.height,M.format,M.type);for(const Pe of M.layerUpdates){const vt=ee.data.subarray(Pe*st/ee.data.BYTES_PER_ELEMENT,(Pe+1)*st/ee.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,me,0,0,Pe,ee.width,ee.height,1,ge,vt)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,me,0,0,0,ee.width,ee.height,se.depth,ge,ee.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,me,ie,ee.width,ee.height,se.depth,0,ee.data,0,0);else Je("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else xe?He&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,me,0,0,0,ee.width,ee.height,se.depth,ge,P,ee.data):t.texImage3D(n.TEXTURE_2D_ARRAY,me,ie,ee.width,ee.height,se.depth,0,ge,P,ee.data);M.layerUpdates.size>0&&M.clearLayerUpdates()}else{xe&&be&&t.texStorage2D(n.TEXTURE_2D,tt,ie,ye[0].width,ye[0].height);for(let me=0,Ye=ye.length;me<Ye;me++)ee=ye[me],M.format!==Kn?ge!==null?xe?He&&t.compressedTexSubImage2D(n.TEXTURE_2D,me,0,0,ee.width,ee.height,ge,ee.data):t.compressedTexImage2D(n.TEXTURE_2D,me,ie,ee.width,ee.height,0,ee.data):Je("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):xe?He&&t.texSubImage2D(n.TEXTURE_2D,me,0,0,ee.width,ee.height,ge,P,ee.data):t.texImage2D(n.TEXTURE_2D,me,ie,ee.width,ee.height,0,ge,P,ee.data)}else if(M.isDataArrayTexture)if(xe){if(be&&t.texStorage3D(n.TEXTURE_2D_ARRAY,tt,ie,se.width,se.height,se.depth),He)if(M.layerUpdates.size>0){const me=Sc(se.width,se.height,M.format,M.type);for(const Ye of M.layerUpdates){const st=se.data.subarray(Ye*me/se.data.BYTES_PER_ELEMENT,(Ye+1)*me/se.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Ye,se.width,se.height,1,ge,P,st)}M.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,se.width,se.height,se.depth,ge,P,se.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,ie,se.width,se.height,se.depth,0,ge,P,se.data);else if(M.isData3DTexture)xe?(be&&t.texStorage3D(n.TEXTURE_3D,tt,ie,se.width,se.height,se.depth),He&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,se.width,se.height,se.depth,ge,P,se.data)):t.texImage3D(n.TEXTURE_3D,0,ie,se.width,se.height,se.depth,0,ge,P,se.data);else if(M.isFramebufferTexture){if(be)if(xe)t.texStorage2D(n.TEXTURE_2D,tt,ie,se.width,se.height);else{let me=se.width,Ye=se.height;for(let st=0;st<tt;st++)t.texImage2D(n.TEXTURE_2D,st,ie,me,Ye,0,ge,P,null),me>>=1,Ye>>=1}}else if(M.isHTMLTexture){if("texElementImage2D"in n){const me=n.canvas;if(me.hasAttribute("layoutsubtree")||me.setAttribute("layoutsubtree","true"),se.parentNode!==me){me.appendChild(se),d.add(M),me.onpaint=Ye=>{const st=Ye.changedElements;for(const Pe of d)st.includes(Pe.image)&&(Pe.needsUpdate=!0)},me.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,se);else{const st=n.RGBA,Pe=n.RGBA,vt=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,st,Pe,vt,se)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(ye.length>0){if(xe&&be){const me=Ke(ye[0]);t.texStorage2D(n.TEXTURE_2D,tt,ie,me.width,me.height)}for(let me=0,Ye=ye.length;me<Ye;me++)ee=ye[me],xe?He&&t.texSubImage2D(n.TEXTURE_2D,me,0,0,ge,P,ee):t.texImage2D(n.TEXTURE_2D,me,ie,ge,P,ee);M.generateMipmaps=!1}else if(xe){if(be){const me=Ke(se);t.texStorage2D(n.TEXTURE_2D,tt,ie,me.width,me.height)}He&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ge,P,se)}else t.texImage2D(n.TEXTURE_2D,0,ie,ge,P,se);E(M)&&M.mipmapsAutoUpdate===!0&&S(ue),Se.__version=Ee.version,M.onUpdate&&M.onUpdate(M)}w.__version=M.version}function pe(w,M,H){if(M.image.length!==6)return;const ue=j(w,M),re=M.source;t.bindTexture(n.TEXTURE_CUBE_MAP,w.__webglTexture,n.TEXTURE0+H);const Ee=i.get(re);if(re.version!==Ee.__version||ue===!0){t.activeTexture(n.TEXTURE0+H);const Se=dt.getPrimaries(dt.workingColorSpace),Q=M.colorSpace===Mi?null:dt.getPrimaries(M.colorSpace),se=M.colorSpace===Mi||Se===Q?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,se);const ge=M.isCompressedTexture||M.image[0].isCompressedTexture,P=M.image[0]&&M.image[0].isDataTexture,ie=[];for(let Pe=0;Pe<6;Pe++)!ge&&!P?ie[Pe]=v(M.image[Pe],!0,s.maxCubemapSize):ie[Pe]=P?M.image[Pe].image:M.image[Pe],ie[Pe]=$e(M,ie[Pe]);const ee=ie[0],ye=r.convert(M.format,M.colorSpace),xe=r.convert(M.type);let be=T(M.internalFormat,ye,xe,M.normalized,M.colorSpace);const He=M.isVideoTexture!==!0,tt=Ee.__version===void 0||ue===!0,me=re.dataReady;let Ye=y(M,ee);k(n.TEXTURE_CUBE_MAP,M);let st;if(M.isDepthTexture){if(be=_(M.format===yi,M.type),tt)if(He)t.texStorage2D(n.TEXTURE_CUBE_MAP,1,be,ee.width,ee.height);else for(let Pe=0;Pe<6;Pe++)t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,0,be,ee.width,ee.height,0,ye,xe,null)}else if(ge){He&&tt&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Ye,be,ee.width,ee.height);for(let Pe=0;Pe<6;Pe++){st=ie[Pe].mipmaps;for(let vt=0;vt<st.length;vt++){const Ht=st[vt];M.format!==Kn?ye!==null?He?me&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,vt,0,0,Ht.width,Ht.height,ye,Ht.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,vt,be,Ht.width,Ht.height,0,Ht.data):Je("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):He?me&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,vt,0,0,Ht.width,Ht.height,ye,xe,Ht.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,vt,be,Ht.width,Ht.height,0,ye,xe,Ht.data)}}}else{if(st=M.mipmaps,He&&tt){st.length>0&&Ye++;const Pe=Ke(ie[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Ye,be,Pe.width,Pe.height)}for(let Pe=0;Pe<6;Pe++)if(P){He?me&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,0,0,0,ie[Pe].width,ie[Pe].height,ye,xe,ie[Pe].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,0,be,ie[Pe].width,ie[Pe].height,0,ye,xe,ie[Pe].data);for(let vt=0;vt<st.length;vt++){const Gn=st[vt].image[Pe].image;He?me&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,vt+1,0,0,Gn.width,Gn.height,ye,xe,Gn.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,vt+1,be,Gn.width,Gn.height,0,ye,xe,Gn.data)}}else{He?me&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,0,0,0,ye,xe,ie[Pe]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,0,be,ye,xe,ie[Pe]);for(let vt=0;vt<st.length;vt++){const Ht=st[vt];He?me&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,vt+1,0,0,ye,xe,Ht.image[Pe]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,vt+1,be,ye,xe,Ht.image[Pe])}}}E(M)&&M.mipmapsAutoUpdate===!0&&S(n.TEXTURE_CUBE_MAP),Ee.__version=re.version,M.onUpdate&&M.onUpdate(M)}w.__version=M.version}function de(w,M,H,ue,re,Ee){const Se=r.convert(H.format,H.colorSpace),Q=r.convert(H.type),se=T(H.internalFormat,Se,Q,H.normalized,H.colorSpace),ge=i.get(M),P=i.get(H);if(P.__renderTarget=M,!ge.__hasExternalTextures){const ie=Math.max(1,M.width>>Ee),ee=Math.max(1,M.height>>Ee);re===n.TEXTURE_3D||re===n.TEXTURE_2D_ARRAY?t.texImage3D(re,Ee,se,ie,ee,M.depth,0,Se,Q,null):t.texImage2D(re,Ee,se,ie,ee,0,Se,Q,null)}t.bindFramebuffer(n.FRAMEBUFFER,w),Ae(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ue,re,P.__webglTexture,0,St(M)):(re===n.TEXTURE_2D||re>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&re<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ue,re,P.__webglTexture,Ee),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ge(w,M,H){if(n.bindRenderbuffer(n.RENDERBUFFER,w),M.depthBuffer){const ue=M.depthTexture,re=ue&&ue.isDepthTexture?ue.type:null,Ee=_(M.stencilBuffer,re),Se=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;Ae(M)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,St(M),Ee,M.width,M.height):H?n.renderbufferStorageMultisample(n.RENDERBUFFER,St(M),Ee,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,Ee,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Se,n.RENDERBUFFER,w)}else{const ue=M.textures;for(let re=0;re<ue.length;re++){const Ee=ue[re],Se=r.convert(Ee.format,Ee.colorSpace),Q=r.convert(Ee.type),se=T(Ee.internalFormat,Se,Q,Ee.normalized,Ee.colorSpace);Ae(M)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,St(M),se,M.width,M.height):H?n.renderbufferStorageMultisample(n.RENDERBUFFER,St(M),se,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,se,M.width,M.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Oe(w,M,H){const ue=M.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,w),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const re=i.get(M.depthTexture);re.__renderTarget=M;const Ee=ue?M.depthTexture.image[0]:M.depthTexture.image;(!re.__webglTexture||Ee.width!==M.width||Ee.height!==M.height)&&(Ee.width=M.width,Ee.height=M.height,M.depthTexture.needsUpdate=!0),ue?Ce(M.depthTexture,0):fe(M.depthTexture,0);const Se=re.__webglTexture,Q=St(M),se=ue?n.TEXTURE_CUBE_MAP_POSITIVE_X+H:n.TEXTURE_2D,ge=M.depthTexture.format===yi?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(M.depthTexture.format===Ei)Ae(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ge,se,Se,0,Q):n.framebufferTexture2D(n.FRAMEBUFFER,ge,se,Se,0);else if(M.depthTexture.format===yi)Ae(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ge,se,Se,0,Q):n.framebufferTexture2D(n.FRAMEBUFFER,ge,se,Se,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function it(w){const M=i.get(w),H=w.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==w.depthTexture){const ue=w.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),ue){const re=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,ue.removeEventListener("dispose",re)};ue.addEventListener("dispose",re),M.__depthDisposeCallback=re}M.__boundDepthTexture=ue}if(w.depthTexture&&!M.__autoAllocateDepthBuffer)if(H)for(let ue=0;ue<6;ue++)Oe(M.__webglFramebuffer[ue],w,ue);else w.texture.mipmaps.length>0?Oe(M.__webglFramebuffer[0],w,0):Oe(M.__webglFramebuffer,w,0);else if(H){M.__webglDepthbuffer=[];for(let ue=0;ue<6;ue++)if(t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[ue]),M.__webglDepthbuffer[ue]===void 0)M.__webglDepthbuffer[ue]=n.createRenderbuffer(),Ge(M.__webglDepthbuffer[ue],w,!1);else{const re=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ee=M.__webglDepthbuffer[ue];n.bindRenderbuffer(n.RENDERBUFFER,Ee),n.framebufferRenderbuffer(n.FRAMEBUFFER,re,n.RENDERBUFFER,Ee)}}else if(w.texture.mipmaps.length>0?t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=n.createRenderbuffer(),Ge(M.__webglDepthbuffer,w,!1);else{const re=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ee=M.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,Ee),n.framebufferRenderbuffer(n.FRAMEBUFFER,re,n.RENDERBUFFER,Ee)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function rt(w,M,H){const ue=i.get(w);M!==void 0&&de(ue.__webglFramebuffer,w,w.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),H!==void 0&&it(w)}function lt(w){const M=w.texture,H=i.get(w),ue=i.get(M);w.addEventListener("dispose",O),C(w);const re=w.textures,Ee=w.isWebGLCubeRenderTarget===!0,Se=re.length>1;if(Se||(ue.__webglTexture===void 0&&(ue.__webglTexture=n.createTexture()),ue.__version=M.version,a.memory.textures++),Ee){H.__webglFramebuffer=[];for(let Q=0;Q<6;Q++)if(M.mipmaps.length>0){H.__webglFramebuffer[Q]=[];for(let se=0;se<M.mipmaps.length;se++)H.__webglFramebuffer[Q][se]=n.createFramebuffer()}else H.__webglFramebuffer[Q]=n.createFramebuffer()}else{if(M.mipmaps.length>0){H.__webglFramebuffer=[];for(let Q=0;Q<M.mipmaps.length;Q++)H.__webglFramebuffer[Q]=n.createFramebuffer()}else H.__webglFramebuffer=n.createFramebuffer();if(Se)for(let Q=0,se=re.length;Q<se;Q++){const ge=i.get(re[Q]);ge.__webglTexture===void 0&&(ge.__webglTexture=n.createTexture(),a.memory.textures++)}if(w.samples>0&&Ae(w)===!1){H.__webglMultisampledFramebuffer=n.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let Q=0;Q<re.length;Q++){const se=re[Q];H.__webglColorRenderbuffer[Q]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,H.__webglColorRenderbuffer[Q]);const ge=r.convert(se.format,se.colorSpace),P=r.convert(se.type),ie=T(se.internalFormat,ge,P,se.normalized,se.colorSpace,w.isXRRenderTarget===!0),ee=St(w);n.renderbufferStorageMultisample(n.RENDERBUFFER,ee,ie,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Q,n.RENDERBUFFER,H.__webglColorRenderbuffer[Q])}n.bindRenderbuffer(n.RENDERBUFFER,null),w.depthBuffer&&(H.__webglDepthRenderbuffer=n.createRenderbuffer(),Ge(H.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(Ee){t.bindTexture(n.TEXTURE_CUBE_MAP,ue.__webglTexture),k(n.TEXTURE_CUBE_MAP,M);for(let Q=0;Q<6;Q++)if(M.mipmaps.length>0)for(let se=0;se<M.mipmaps.length;se++)de(H.__webglFramebuffer[Q][se],w,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,se);else de(H.__webglFramebuffer[Q],w,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0);E(M)?S(n.TEXTURE_CUBE_MAP):M.mipmaps.length>0&&n.texParameteri(n.TEXTURE_CUBE_MAP,n.TEXTURE_MAX_LEVEL,M.mipmaps.length-1),t.unbindTexture()}else if(Se){for(let Q=0,se=re.length;Q<se;Q++){const ge=re[Q],P=i.get(ge);let ie=n.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ie=w.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ie,P.__webglTexture),k(ie,ge),de(H.__webglFramebuffer,w,ge,n.COLOR_ATTACHMENT0+Q,ie,0),E(ge)&&S(ie)}t.unbindTexture()}else{let Q=n.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(Q=w.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Q,ue.__webglTexture),k(Q,M),M.mipmaps.length>0)for(let se=0;se<M.mipmaps.length;se++)de(H.__webglFramebuffer[se],w,M,n.COLOR_ATTACHMENT0,Q,se);else de(H.__webglFramebuffer,w,M,n.COLOR_ATTACHMENT0,Q,0);E(M)?S(Q):M.mipmaps.length>0&&n.texParameteri(Q,n.TEXTURE_MAX_LEVEL,M.mipmaps.length-1),t.unbindTexture()}w.depthBuffer&&it(w)}function N(w){const M=w.textures;for(let H=0,ue=M.length;H<ue;H++){const re=M[H];if(E(re)&&re.mipmapsAutoUpdate===!0){const Ee=R(w),Se=i.get(re).__webglTexture;t.bindTexture(Ee,Se),S(Ee),t.unbindTexture()}}}const Rt=[];function et(w){if(w.samples>0){if(Ae(w)===!1){const M=w.textures,H=w.width,ue=w.height;let re=n.COLOR_BUFFER_BIT;const Ee=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Se=i.get(w),Q=M.length>1;if(Q)for(let ge=0;ge<M.length;ge++)t.bindFramebuffer(n.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Se.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Se.__webglMultisampledFramebuffer),w.texture.mipmaps.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Se.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Se.__webglFramebuffer);for(let ge=0;ge<M.length;ge++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(re|=n.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(re|=n.STENCIL_BUFFER_BIT)),Q){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Se.__webglColorRenderbuffer[ge]);const P=i.get(M[ge]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,P,0)}n.blitFramebuffer(0,0,H,ue,0,0,H,ue,re,n.NEAREST),l===!0&&(Rt.length=0,Rt.push(n.COLOR_ATTACHMENT0+ge),w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&Rt.push(Ee),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Rt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Q)for(let ge=0;ge<M.length;ge++){t.bindFramebuffer(n.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.RENDERBUFFER,Se.__webglColorRenderbuffer[ge]);const P=i.get(M[ge]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Se.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.TEXTURE_2D,P,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Se.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&l){const M=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[M])}}}function St(w){return Math.min(s.maxSamples,w.samples)}function Ae(w){const M=i.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function Lt(w){const M=a.render.frame;h.get(w)!==M&&(h.set(w,M),w.update())}function $e(w,M){const H=w.colorSpace,ue=w.format,re=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||H!==Xr&&H!==Mi&&(dt.getTransfer(H)===bt?(ue!==Kn||re!==Rn)&&Je("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):mt("WebGLTextures: Unsupported texture color space:",H)),M}function Ke(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=qe,this.resetTextureUnits=ae,this.getTextureUnits=le,this.setTextureUnits=Ue,this.setTexture2D=fe,this.setTexture2DArray=Ne,this.setTexture3D=We,this.setTextureCube=Ce,this.rebindTextures=rt,this.setupRenderTarget=lt,this.updateRenderTargetMipmap=N,this.updateMultisampleRenderTarget=et,this.setupDepthRenderbuffer=it,this.setupFrameBufferTexture=de,this.useMultisampledRTT=Ae,this.dispose=$}function B_(n,e){function t(i,s=Mi){let r;const a=dt.getTransfer(s);if(i===Rn)return n.UNSIGNED_BYTE;if(i===Qo)return n.UNSIGNED_SHORT_4_4_4_4;if(i===jo)return n.UNSIGNED_SHORT_5_5_5_1;if(i===gh)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===_h)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===ph)return n.BYTE;if(i===mh)return n.SHORT;if(i===Gs)return n.UNSIGNED_SHORT;if(i===Jo)return n.INT;if(i===Qn)return n.UNSIGNED_INT;if(i===Zn)return n.FLOAT;if(i===jn)return n.HALF_FLOAT;if(i===vh)return n.ALPHA;if(i===Mh)return n.RGB;if(i===Kn)return n.RGBA;if(i===Ei)return n.DEPTH_COMPONENT;if(i===yi)return n.DEPTH_STENCIL;if(i===xh)return n.RED;if(i===el)return n.RED_INTEGER;if(i===Bi)return n.RG;if(i===tl)return n.RG_INTEGER;if(i===nl)return n.RGBA_INTEGER;if(i===Ir||i===Fr||i===Nr||i===Ur)if(a===bt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Ir)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Fr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Nr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ur)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Ir)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Fr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Nr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ur)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===ro||i===ao||i===oo||i===lo)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===ro)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===ao)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===oo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===lo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===co||i===ho||i===uo||i===fo||i===po||i===Vr||i===mo)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===co||i===ho)return a===bt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===uo)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===fo)return r.COMPRESSED_R11_EAC;if(i===po)return r.COMPRESSED_SIGNED_R11_EAC;if(i===Vr)return r.COMPRESSED_RG11_EAC;if(i===mo)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===go||i===_o||i===vo||i===Mo||i===xo||i===So||i===yo||i===bo||i===Eo||i===To||i===wo||i===Ao||i===Ro||i===Co)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===go)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===_o)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===vo)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Mo)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===xo)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===So)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===yo)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===bo)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Eo)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===To)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===wo)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ao)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ro)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Co)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Po||i===Lo||i===Do)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Po)return a===bt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Lo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Do)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Io||i===Fo||i===Wr||i===No)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Io)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Fo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Wr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===No)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ds?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const k_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,z_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class G_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Fh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Ti({vertexShader:k_,fragmentShader:z_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new qt(new Ui(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class H_ extends wi{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,g=null;const b=typeof XRWebGLBinding<"u",m=new G_,p={},v=t.getContextAttributes();let E=null,S=null;const R=[],T=[],_=new ve;let y=null,C=null;const A=new Ln;A.viewport=new kt;const D=new Ln;D.viewport=new kt;const O=[A,D],X=new Qf;let L=null,$=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ne){let fe=R[ne];return fe===void 0&&(fe=new ga,R[ne]=fe),fe.getTargetRaySpace()},this.getControllerGrip=function(ne){let fe=R[ne];return fe===void 0&&(fe=new ga,R[ne]=fe),fe.getGripSpace()},this.getHand=function(ne){let fe=R[ne];return fe===void 0&&(fe=new ga,R[ne]=fe),fe.getHandSpace()};function J(ne){const fe=T.indexOf(ne.inputSource);if(fe===-1)return;const Ne=R[fe];Ne!==void 0&&(Ne.update(ne.inputSource,ne.frame,c||a),Ne.dispatchEvent({type:ne.type,data:ne.inputSource}))}function G(){s.removeEventListener("select",J),s.removeEventListener("selectstart",J),s.removeEventListener("selectend",J),s.removeEventListener("squeeze",J),s.removeEventListener("squeezestart",J),s.removeEventListener("squeezeend",J),s.removeEventListener("end",G),s.removeEventListener("inputsourceschange",he);for(let ne=0;ne<R.length;ne++){const fe=T[ne];fe!==null&&(T[ne]=null,R[ne].disconnect(fe))}L=null,$=null,m.reset();for(const ne in p)delete p[ne];if(e.setRenderTarget(E),f=null,u=null,d=null,s=null,S=null,qe.stop(),i.isPresenting=!1,e.setPixelRatio(y),e.setSize(_.width,_.height,!1),C!==null){const ne=C.camera;ne.fov=C.fov,ne.zoom=C.zoom,ne.updateProjectionMatrix(),C=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ne){r=ne,i.isPresenting===!0&&Je("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ne){o=ne,i.isPresenting===!0&&Je("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(ne){c=ne},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&b&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(ne){if(s=ne,s!==null){if(E=e.getRenderTarget(),s.addEventListener("select",J),s.addEventListener("selectstart",J),s.addEventListener("selectend",J),s.addEventListener("squeeze",J),s.addEventListener("squeezestart",J),s.addEventListener("squeezeend",J),s.addEventListener("end",G),s.addEventListener("inputsourceschange",he),v.xrCompatible!==!0&&await t.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(_),b&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ne=null,We=null,Ce=null;v.depth&&(Ce=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ne=v.stencil?yi:Ei,We=v.stencil?ds:Qn);const Xe={colorFormat:t.RGBA8,depthFormat:Ce,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(Xe),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),S=new Jn(u.textureWidth,u.textureHeight,{format:Kn,type:Rn,depthTexture:new fs(u.textureWidth,u.textureHeight,We,void 0,void 0,void 0,void 0,void 0,void 0,Ne),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{const Ne={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,Ne),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),S=new Jn(f.framebufferWidth,f.framebufferHeight,{format:Kn,type:Rn,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),qe.setContext(s),qe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function he(ne){for(let fe=0;fe<ne.removed.length;fe++){const Ne=ne.removed[fe],We=T.indexOf(Ne);We>=0&&(T[We]=null,R[We].disconnect(Ne))}for(let fe=0;fe<ne.added.length;fe++){const Ne=ne.added[fe];let We=T.indexOf(Ne);if(We===-1){for(let Xe=0;Xe<R.length;Xe++)if(Xe>=T.length){T.push(Ne),We=Xe;break}else if(T[Xe]===null){T[Xe]=Ne,We=Xe;break}if(We===-1)break}const Ce=R[We];Ce&&Ce.connect(Ne)}}function Z(ne,fe){fe===null?ne.matrixWorld.copy(ne.matrix):ne.matrixWorld.multiplyMatrices(fe.matrixWorld,ne.matrix),ne.matrixWorldInverse.copy(ne.matrixWorld).invert()}this.updateCamera=function(ne){if(s===null)return;let fe=ne.near,Ne=ne.far;m.texture!==null&&(m.depthNear>0&&(fe=m.depthNear),m.depthFar>0&&(Ne=m.depthFar)),X.near=D.near=A.near=fe,X.far=D.far=A.far=Ne,(L!==X.near||$!==X.far)&&(s.updateRenderState({depthNear:X.near,depthFar:X.far}),L=X.near,$=X.far),X.layers.mask=ne.layers.mask|6,A.layers.mask=X.layers.mask&-5,D.layers.mask=X.layers.mask&-3;const We=ne.parent,Ce=X.cameras;Z(X,We);for(let Xe=0;Xe<Ce.length;Xe++)Z(Ce[Xe],We);X.projectionMatrix.copy(A.projectionMatrix),X.projectionMatrixInverse.copy(A.projectionMatrixInverse),C===null&&ne.isPerspectiveCamera&&(C={camera:ne,fov:ne.fov,zoom:ne.zoom}),ae(ne,X,We)};function ae(ne,fe,Ne){Ne===null?ne.matrix.copy(fe.matrixWorld):(ne.matrix.copy(Ne.matrixWorld),ne.matrix.invert(),ne.matrix.multiply(fe.matrixWorld)),ne.matrix.decompose(ne.position,ne.quaternion,ne.scale),ne.updateMatrixWorld(!0),ne.projectionMatrix.copy(fe.projectionMatrix),ne.projectionMatrixInverse.copy(fe.projectionMatrixInverse),ne.isPerspectiveCamera&&(ne.fov=Vs*2*Math.atan(1/ne.projectionMatrix.elements[5]),ne.zoom=1)}this.getCamera=function(){return X},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(ne){l=ne,u!==null&&(u.fixedFoveation=ne),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=ne)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(X)},this.getCameraTexture=function(ne){return p[ne]};let le=null;function Ue(ne,fe){if(h=fe.getViewerPose(c||a),g=fe,h!==null){const Ne=h.views;f!==null&&(e.setRenderTargetFramebuffer(S,f.framebuffer),e.setRenderTarget(S));let We=!1;Ne.length!==X.cameras.length&&(X.cameras.length=0,We=!0);for(let U=0;U<Ne.length;U++){const k=Ne[U];let j=null;if(f!==null)j=f.getViewport(k);else{const te=d.getViewSubImage(u,k);j=te.viewport,U===0&&(e.setRenderTargetTextures(S,te.colorTexture,te.depthStencilTexture),e.setRenderTarget(S))}let B=O[U];B===void 0&&(B=new Ln,B.layers.enable(U),B.viewport=new kt,O[U]=B),B.matrix.fromArray(k.transform.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale),B.projectionMatrix.fromArray(k.projectionMatrix),B.projectionMatrixInverse.copy(B.projectionMatrix).invert(),B.viewport.set(j.x,j.y,j.width,j.height),U===0&&(X.matrix.copy(B.matrix),X.matrix.decompose(X.position,X.quaternion,X.scale)),We===!0&&X.cameras.push(B)}const Ce=s.enabledFeatures;if(Ce&&Ce.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&b){d=i.getBinding();const U=d.getDepthInformation(Ne[0]);U&&U.isValid&&U.texture&&m.init(U,s.renderState)}if(Ce&&Ce.includes("camera-access")&&b){e.state.unbindTexture(),d=i.getBinding();for(let U=0;U<Ne.length;U++){const k=Ne[U].camera;if(k){let j=p[k];j||(j=new Fh,p[k]=j);const B=d.getCameraImage(k);j.sourceTexture=B}}}}for(let Ne=0;Ne<R.length;Ne++){const We=T[Ne],Ce=R[Ne];We!==null&&Ce!==void 0&&Ce.update(We,fe,c||a)}le&&le(ne,fe),fe.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:fe}),g=null}const qe=new Yh;qe.setAnimationLoop(Ue),this.setAnimationLoop=function(ne){le=ne},this.dispose=function(){}}}const V_=new It,su=new je;su.set(-1,0,0,0,1,0,0,0,1);function W_(n,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Vh(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,v,E,S){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),d(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),u(m,p),p.isMeshPhysicalMaterial&&f(m,p,S)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),b(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,v,E):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===_n&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===_n&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const v=e.get(p),E=v.envMap,S=v.envMapRotation;E&&(m.envMap.value=E,m.envMapRotation.value.setFromMatrix4(V_.makeRotationFromEuler(S)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(su),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,v,E){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*v,m.scale.value=E*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,v){m.ior.value=p.ior,p.diffuseRoughness>0&&(m.diffuseRoughness.value=p.diffuseRoughness,p.diffuseRoughnessMap&&(m.diffuseRoughnessMap.value=p.diffuseRoughnessMap,t(p.diffuseRoughnessMap,m.diffuseRoughnessMapTransform))),p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===_n&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.retroreflectivity>0&&(m.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessMinimum,m.iridescenceThicknessMaximum.value=p.iridescenceThicknessMaximum,p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function b(m,p){const v=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function X_(n,e,t,i){let s={},r={};function a(v,E){const S=E.program;i.uniformBlockBinding(v,S,s[v.id])}function o(v,E){let S=s[v.id];S===void 0&&(g(v),S=l(v),s[v.id]=S,v.addEventListener("dispose",m));const R=E.program;i.updateUBOMapping(v,R);const T=e.render.frame;r[v.id]!==T&&(c(v),r[v.id]=T)}function l(v){const E=n.createBuffer(),S=v.__size,R=v.usage;return n.bindBuffer(n.UNIFORM_BUFFER,E),n.bufferData(n.UNIFORM_BUFFER,S,R),n.bindBuffer(n.UNIFORM_BUFFER,null),E}function c(v){const E=s[v.id],S=v.uniforms,R=v.__cache;n.bindBuffer(n.UNIFORM_BUFFER,E);for(let T=0,_=S.length;T<_;T++){const y=S[T];if(Array.isArray(y))for(let C=0,A=y.length;C<A;C++)h(y[C],T,C,R);else h(y,T,0,R)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function h(v,E,S,R){if(u(v,E,S,R)===!0){const T=v.__offset,_=v.value;if(Array.isArray(_)){let y=0;for(let C=0;C<_.length;C++){const A=_[C],D=b(A,!0);d(A,v.__data,y),y+=D.storage/Float32Array.BYTES_PER_ELEMENT}}else d(_,v.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,T,v.__data)}}function d(v,E,S){typeof v=="number"||typeof v=="boolean"?E[S]=v:v.isMatrix3?(E[S]=v.elements[0],E[S+1]=v.elements[1],E[S+2]=v.elements[2],E[S+3]=0,E[S+4]=v.elements[3],E[S+5]=v.elements[4],E[S+6]=v.elements[5],E[S+7]=0,E[S+8]=v.elements[6],E[S+9]=v.elements[7],E[S+10]=v.elements[8],E[S+11]=0):ArrayBuffer.isView(v)?E.set(v.subarray(0,E.length-S),S):v.toArray(E,S)}function u(v,E,S,R){const T=v.value,_=E+"_"+S;if(Array.isArray(T)){R[_]===void 0&&(R[_]=[]);const y=R[_];let C=!1;for(let A=0;A<T.length;A++)f(T[A],y,A)===!0&&(C=!0);return C}return f(T,R,_)}function f(v,E,S){if(E[S]===void 0)return typeof v=="number"||typeof v=="boolean"?E[S]=v:ArrayBuffer.isView(v)?E[S]=v.slice():E[S]=v.clone(),!0;{const R=E[S];if(typeof v=="number"||typeof v=="boolean"){if(R!==v)return E[S]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(R.equals(v)===!1)return R.copy(v),!0}}return!1}function g(v){const E=v.uniforms;let S=0;const R=16;for(let _=0,y=E.length;_<y;_++){const C=Array.isArray(E[_])?E[_]:[E[_]];for(let A=0,D=C.length;A<D;A++){const O=C[A],X=Array.isArray(O.value)?O.value:[O.value],L=Array.isArray(E[_])||Array.isArray(O.value);let $=S;for(let G=0,he=X.length;G<he;G++){const Z=X[G],ae=b(Z,L),le=S%R,Ue=le%ae.boundary,qe=le+Ue;S+=Ue,qe!==0&&R-qe<ae.storage&&(S+=R-qe),G===0&&($=S),S+=ae.storage}const J=O.type==="int"?Int32Array:O.type==="uint"?Uint32Array:Float32Array;O.__data=new J((S-$)/Float32Array.BYTES_PER_ELEMENT),O.__offset=$}}const T=S%R;return T>0&&(S+=R-T),v.__size=S,v.__cache={},this}function b(v,E){const S={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(S.boundary=4,S.storage=4):v.isVector2?(S.boundary=8,S.storage=8):v.isVector3||v.isColor?(S.boundary=16,S.storage=12):v.isVector4?(S.boundary=16,S.storage=16):v.isMatrix3?(S.boundary=16,S.storage=48):v.isMatrix4?(S.boundary=16,S.storage=64):v.isTexture?Je("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(S.boundary=16,S.storage=v.byteLength):Je("WebGLRenderer: Unsupported uniform value type.",v),E===!0&&(S.boundary=16,S.storage=Math.ceil(S.storage/16)*16),S}function m(v){const E=v.target;E.removeEventListener("dispose",m),n.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function p(){for(const v in s)n.deleteBuffer(s[v]);s={},r={}}return{bind:a,update:o,dispose:p}}const $_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Wn=null;function q_(){return Wn===null&&(Wn=new of($_,16,16,Bi,jn),Wn.name="DFG_LUT",Wn.minFilter=En,Wn.magFilter=En,Wn.wrapS=li,Wn.wrapT=li,Wn.generateMipmaps=!1,Wn.needsUpdate=!0),Wn}class Y_{constructor(e={}){const{canvas:t=Sd(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=Rn}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=a;const b=f,m=new Set([nl,tl,el]),p=new Set([Rn,Qn,Gs,ds,Qo,jo]),v=new Uint32Array(4),E=new Int32Array(4),S={textures:[],min:[],max:[],resolution:[]};let R=null,T=null;const _=[],y=[];let C=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ci,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const A=this;let D=!1,O=null,X=null,L=null,$=null;this._outputColorSpace=rn;let J=0,G=0,he=null,Z=-1,ae=null;const le=new kt,Ue=new kt;let qe=null;const ne=new ct(0);let fe=0,Ne=t.width,We=t.height,Ce=1,Xe=null,yt=null;const U=new kt(0,0,Ne,We),k=new kt(0,0,Ne,We);let j=!1;const B=new Ws,te=new hl;let ce=!1,pe=!1;const de=new It,Ge=new F,Oe=new kt,it={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let rt=!1;function lt(){return he===null?Ce:1}let N=i;function Rt(x,I){return t.getContext(x,I)}let et,St,Ae,Lt,$e,Ke,w,M,H,ue,re,Ee,Se,Q,se,ge,P,ie,ee,ye,xe,be,He;try{const x={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Zo}`),t.addEventListener("webglcontextlost",Ye,!1),t.addEventListener("webglcontextrestored",st,!1),t.addEventListener("webglcontextcreationerror",Pe,!1),N===null){const I="webgl2";if(N=Rt(I,x),N===null)throw Rt(I)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}tt()}catch(x){throw t.removeEventListener("webglcontextlost",Ye,!1),t.removeEventListener("webglcontextrestored",st,!1),t.removeEventListener("webglcontextcreationerror",Pe,!1),mt("WebGLRenderer: "+x.message),x}function tt(){et=new J0(N),et.init(),xe=new B_(N,et),St=new z0(N,et,e,xe),Ae=new U_(N,et),St.reversedDepthBuffer&&u&&Ae.buffers.depth.setReversed(!0),X=N.createFramebuffer(),L=N.createFramebuffer(),$=N.createFramebuffer(),Lt=new eg(N),$e=new y_,Ke=new O_(N,et,Ae,$e,St,xe,Lt),w=new K0(A),M=new np(N),be=new B0(N,M),H=new Q0(N,M,Lt,be),ue=new ng(N,H,M,be,Lt),ie=new tg(N,St,Ke),se=new G0($e),re=new S_(A,w,et,St,be,se),Ee=new W_(A,$e),Se=new E_,Q=new P_(et),P=new O0(A,w,Ae,ue,g,l),ge=new N_(A,ue,St),He=new X_(N,Lt,St,Ae),ee=new k0(N,et,Lt),ye=new j0(N,et,Lt),Lt.programs=re.programs,A.capabilities=St,A.extensions=et,A.properties=$e,A.renderLists=Se,A.shadowMap=ge,A.state=Ae,A.info=Lt}b!==Rn&&(C=new sg(b,t.width,t.height,o,s,r));const me=new H_(A,N);this.xr=me,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const x=et.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){const x=et.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return Ce},this.setPixelRatio=function(x){x!==void 0&&(Ce=x,this.setSize(Ne,We,!1))},this.getSize=function(x){return x.set(Ne,We)},this.setSize=function(x,I,q=!0){if(me.isPresenting){Je("WebGLRenderer: Can't change size while VR device is presenting.");return}Ne=x,We=I,t.width=Math.floor(x*Ce),t.height=Math.floor(I*Ce),q===!0&&(t.style.width=x+"px",t.style.height=I+"px"),C!==null&&C.setSize(t.width,t.height),this.setViewport(0,0,x,I)},this.getDrawingBufferSize=function(x){return x.set(Ne*Ce,We*Ce).floor()},this.setDrawingBufferSize=function(x,I,q){Ne=x,We=I,Ce=q,t.width=Math.floor(x*q),t.height=Math.floor(I*q),this.setViewport(0,0,x,I)},this.setEffects=function(x){if(b===Rn){mt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(x){for(let I=0;I<x.length;I++)if(x[I].isOutputPass===!0){Je("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}C.setEffects(x||[])},this.getCurrentViewport=function(x){return x.copy(le)},this.getViewport=function(x){return x.copy(U)},this.setViewport=function(x,I,q,z){x.isVector4?U.set(x.x,x.y,x.z,x.w):U.set(x,I,q,z),Ae.viewport(le.copy(U).multiplyScalar(lt()).round())},this.getScissor=function(x){return x.copy(k)},this.setScissor=function(x,I,q,z){x.isVector4?k.set(x.x,x.y,x.z,x.w):k.set(x,I,q,z),Ae.scissor(Ue.copy(k).multiplyScalar(lt()).round())},this.getScissorTest=function(){return j},this.setScissorTest=function(x){Ae.setScissorTest(j=x)},this.setOpaqueSort=function(x){Xe=x},this.setTransparentSort=function(x){yt=x},this.getClearColor=function(x){return x.copy(P.getClearColor())},this.setClearColor=function(){P.setClearColor(...arguments)},this.getClearAlpha=function(){return P.getClearAlpha()},this.setClearAlpha=function(){P.setClearAlpha(...arguments)},this.clear=function(x=!0,I=!0,q=!0){let z=0;if(x){let V=!1;if(he!==null){const we=he.texture.format;V=m.has(we)}if(V){const we=he.texture.type,Be=p.has(we),Re=P.getClearColor(),Fe=P.getClearAlpha(),Ve=Re.r,nt=Re.g,ht=Re.b;Be?(v[0]=Ve,v[1]=nt,v[2]=ht,v[3]=Fe,N.clearBufferuiv(N.COLOR,0,v)):(E[0]=Ve,E[1]=nt,E[2]=ht,E[3]=Fe,N.clearBufferiv(N.COLOR,0,E))}else z|=N.COLOR_BUFFER_BIT}I&&(z|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),q&&(z|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z!==0&&N.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(x){x.setRenderer(this),O=x},this.dispose=function(){t.removeEventListener("webglcontextlost",Ye,!1),t.removeEventListener("webglcontextrestored",st,!1),t.removeEventListener("webglcontextcreationerror",Pe,!1),P.dispose(),Se.dispose(),Q.dispose(),Ke.dispose(),$e.dispose(),w.dispose(),ue.dispose(),H.dispose(),be.dispose(),He.dispose(),re.dispose(),me.dispose(),me.removeEventListener("sessionstart",tr),me.removeEventListener("sessionend",nr),Hn.stop()};function Ye(x){x.preventDefault(),Hl("WebGLRenderer: Context Lost."),D=!0}function st(){Hl("WebGLRenderer: Context Restored."),D=!1;const x=Lt.autoReset,I=ge.enabled,q=ge.autoUpdate,z=ge.needsUpdate,V=ge.type;tt(),Lt.autoReset=x,ge.enabled=I,ge.autoUpdate=q,ge.needsUpdate=z,ge.type=V}function Pe(x){mt("WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function vt(x){const I=x.target;I.removeEventListener("dispose",vt),Ht(I)}function Ht(x){Gn(x),$e.remove(x)}function Gn(x){const I=$e.get(x).programs;I!==void 0&&(I.forEach(function(q){re.releaseProgram(q)}),x.isShaderMaterial&&re.releaseShaderCache(x))}this.renderBufferDirect=function(x,I,q,z,V,we){I===null&&(I=it);const Be=V.isMesh&&V.matrixWorld.determinantAffine()<0,Re=Qe(x,I,q,z,V);Ae.setMaterial(z,Be);let Fe=q.index,Ve=1;if(z.wireframe===!0){if(Fe=H.getWireframeAttribute(q),Fe===void 0)return;Ve=2}const nt=q.drawRange,ht=q.attributes.position;let ke=nt.start*Ve,ut=(nt.start+nt.count)*Ve;we!==null&&(ke=Math.max(ke,we.start*Ve),ut=Math.min(ut,(we.start+we.count)*Ve)),Fe!==null?(ke=Math.max(ke,0),ut=Math.min(ut,Fe.count)):ht!=null&&(ke=Math.max(ke,0),ut=Math.min(ut,ht.count));const Wt=ut-ke;if(Wt<0||Wt===1/0)return;be.setup(V,z,Re,q,Fe);let Ct,At=ee;if(Fe!==null&&(Ct=M.get(Fe),At=ye,At.setIndex(Ct)),V.isMesh)z.wireframe===!0?(Ae.setLineWidth(z.wireframeLinewidth*lt()),At.setMode(N.LINES)):At.setMode(N.TRIANGLES);else if(V.isLine){let ln=z.linewidth;ln===void 0&&(ln=1),Ae.setLineWidth(ln*lt()),V.isLineSegments?At.setMode(N.LINES):V.isLineLoop?At.setMode(N.LINE_LOOP):At.setMode(N.LINE_STRIP)}else V.isPoints?At.setMode(N.POINTS):V.isSprite&&At.setMode(N.TRIANGLES);if(V.isBatchedMesh)if(et.get("WEBGL_multi_draw"))At.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const ln=V._multiDrawStarts,ze=V._multiDrawCounts,fn=V._multiDrawCount,Mt=Fe?M.get(Fe).bytesPerElement:1,Ai=$e.get(z).currentProgram.getUniforms();for(let cn=0;cn<fn;cn++)Ai.setValue(N,"_gl_DrawID",cn),At.render(ln[cn]/Mt,ze[cn])}else if(V.isInstancedMesh)At.renderInstances(ke,Wt,V.count);else if(q.isInstancedBufferGeometry){const ln=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,ze=Math.min(q.instanceCount,ln);At.renderInstances(ke,Wt,ze)}else At.render(ke,Wt)};function er(x,I,q,z){O!==null&&x.isNodeMaterial&&O.setObject(z,x),ce===!0&&se.setState(x,q,!1),x.transparent===!0&&x.side===Bn&&x.forceSinglePass===!1?(x.side=_n,x.needsUpdate=!0,Me(x,I,z),x.side=Oi,x.needsUpdate=!0,Me(x,I,z),x.side=Bn):Me(x,I,z)}this.compile=function(x,I,q=null){q===null&&(q=x),O!==null&&O.renderStart(x,I,q),T=Q.get(q),T.init(I),y.push(T),q.traverseVisible(function(V){V.isLight&&V.layers.test(I.layers)&&(T.pushLight(V),V.castShadow&&T.pushShadow(V))}),x!==q&&x.traverseVisible(function(V){V.isLight&&V.layers.test(I.layers)&&(T.pushLight(V),V.castShadow&&T.pushShadow(V))}),T.setupLights(),O!==null&&O.updateLights(T.state.lightsArray),pe=this.localClippingEnabled,ce=se.init(this.clippingPlanes,pe),ce===!0&&se.setGlobalState(this.clippingPlanes,I),O!==null&&ge.render(T.state.shadowsArray,q,I);const z=new Set;return x.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const we=V.material;if(we)if(Array.isArray(we))for(let Be=0;Be<we.length;Be++){const Re=we[Be];er(Re,q,I,V),z.add(Re)}else er(we,q,I,V),z.add(we)}),T=y.pop(),O!==null&&O.renderEnd(),z},this.compileAsync=function(x,I,q=null){const z=this.compile(x,I,q);return new Promise(V=>{function we(){if(z.forEach(function(Be){const Fe=$e.get(Be).currentProgram;(Fe===void 0||Fe.isReady())&&z.delete(Be)}),z.size===0){V(x);return}setTimeout(we,10)}et.get("KHR_parallel_shader_compile")!==null?we():setTimeout(we,10)})};let _s=null;function ra(x){_s&&_s(x)}function tr(){Hn.stop()}function nr(){Hn.start()}const Hn=new Yh;Hn.setAnimationLoop(ra),typeof self<"u"&&Hn.setContext(self),this.setAnimationLoop=function(x){_s=x,me.setAnimationLoop(x),x===null?Hn.stop():Hn.start()},me.addEventListener("sessionstart",tr),me.addEventListener("sessionend",nr),this.render=function(x,I){if(I!==void 0&&I.isCamera!==!0){mt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;O!==null&&O.renderStart(x,I);const q=me.enabled===!0&&me.isPresenting===!0,z=C!==null&&(he===null||q)&&C.begin(A,he);if(x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),me.enabled===!0&&me.isPresenting===!0&&(C===null||C.isCompositing()===!1)&&(me.cameraAutoUpdate===!0&&me.updateCamera(I),I=me.getCamera()),x.isScene===!0&&x.onBeforeRender(A,x,I,he),T=Q.get(x,y.length),T.init(I),T.state.textureUnits=Ke.getTextureUnits(),y.push(T),de.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),I.isArrayCamera?te.setFromArrayCamera(I):B.setFromProjectionMatrix(de,zn,I.reversedDepth),pe=this.localClippingEnabled,ce=se.init(this.clippingPlanes,pe),R=Se.get(x,_.length),R.init(),_.push(R),this.info.render.frame++,me.enabled===!0&&me.isPresenting===!0){const Be=A.xr.getDepthSensingMesh();Be!==null&&Mn(Be,I,-1/0,A.sortObjects)}Mn(x,I,0,A.sortObjects),R.finish(),O!==null&&O.updateLights(T.state.lightsArray),A.sortObjects===!0&&R.sort(Xe,yt),rt=me.enabled===!1||me.isPresenting===!1||me.hasDepthSensing()===!1,rt&&P.addToRenderList(R,x),this.info.autoReset===!0&&this.info.reset(),ce===!0&&se.beginShadows();const V=T.state.shadowsArray;if(ge.render(V,x,I),ce===!0&&se.endShadows(),(z&&C.hasRenderPass())===!1){const Be=R.opaque,Re=R.transmissive;if(T.setupLights(),I.isArrayCamera){const Fe=I.cameras;if(Re.length>0)for(let Ve=0,nt=Fe.length;Ve<nt;Ve++){const ht=Fe[Ve];sr(Be,Re,x,ht)}rt&&P.render(x);for(let Ve=0,nt=Fe.length;Ve<nt;Ve++){const ht=Fe[Ve];ir(R,x,ht,ht.viewport)}}else Re.length>0&&sr(Be,Re,x,I),rt&&P.render(x),ir(R,x,I)}he!==null&&G===0&&(Ke.updateMultisampleRenderTarget(he),Ke.updateRenderTargetMipmap(he)),z&&C.end(A),x.isScene===!0&&x.onAfterRender(A,x,I),be.resetDefaultState(),Z=-1,ae=null,y.pop(),y.length>0?(T=y[y.length-1],Ke.setTextureUnits(T.state.textureUnits),ce===!0&&se.setGlobalState(A.clippingPlanes,T.state.camera)):T=null,_.pop(),_.length>0?R=_[_.length-1]:R=null,O!==null&&O.renderEnd()};function Mn(x,I,q,z){if(x.visible===!1)return;if(x.layers.test(I.layers)){if(x.isGroup)q=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(I);else if(x.isLight)T.pushLight(x),x.castShadow&&T.pushShadow(x);else if(x.isSprite){const Be=I.isArrayCamera?te:B;if(!x.frustumCulled||x.intersectsFrustum(Be)){z&&Oe.setFromMatrixPosition(x.matrixWorld).applyMatrix4(de);const Re=ue.update(x),Fe=x.material;Fe.visible&&R.push(x,Re,Fe,q,Oe.z,null,I)}}else if(x.isMesh||x.isLine||x.isPoints){const Be=I.isArrayCamera?te:B;if(!x.frustumCulled||x.intersectsFrustum(Be)){const Re=ue.update(x),Fe=x.material;if(z&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),Oe.copy(x.boundingSphere.center)):(Re.boundingSphere===null&&Re.computeBoundingSphere(),Oe.copy(Re.boundingSphere.center)),Oe.applyMatrix4(x.matrixWorld).applyMatrix4(de)),Array.isArray(Fe)){const Ve=Re.groups;for(let nt=0,ht=Ve.length;nt<ht;nt++){const ke=Ve[nt],ut=Fe[ke.materialIndex];ut&&ut.visible&&R.push(x,Re,ut,q,Oe.z,ke,I)}}else Fe.visible&&R.push(x,Re,Fe,q,Oe.z,null,I)}}}const we=x.children;for(let Be=0,Re=we.length;Be<Re;Be++)Mn(we[Be],I,q,z)}function ir(x,I,q,z){const{opaque:V,transmissive:we,transparent:Be}=x;T.setupLightsView(q),ce===!0&&se.setGlobalState(A.clippingPlanes,q),z&&Ae.viewport(le.copy(z)),V.length>0&&W(V,I,q),we.length>0&&W(we,I,q),Be.length>0&&W(Be,I,q),Ae.buffers.depth.setTest(!0),Ae.buffers.depth.setMask(!0),Ae.buffers.color.setMask(!0),Ae.setPolygonOffset(!1)}function sr(x,I,q,z){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[z.id]===void 0){const ke=et.has("EXT_color_buffer_half_float")||et.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[z.id]=new Jn(1,1,{generateMipmaps:!0,type:ke?jn:Rn,minFilter:Si,samples:Math.max(4,St.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:dt.workingColorSpace})}const we=T.state.transmissionRenderTarget[z.id],Be=z.viewport||le;we.setSize(Be.z*A.transmissionResolutionScale,Be.w*A.transmissionResolutionScale);const Re=A.getRenderTarget(),Fe=A.getActiveCubeFace(),Ve=A.getActiveMipmapLevel();A.setRenderTarget(we),A.getClearColor(ne),fe=A.getClearAlpha(),fe<1&&A.setClearColor(16777215,.5),A.clear(),rt&&P.render(q);const nt=A.toneMapping;A.toneMapping=ci;const ht=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),T.setupLightsView(z),ce===!0&&se.setGlobalState(A.clippingPlanes,z),W(x,q,z),Ke.updateMultisampleRenderTarget(we),Ke.updateRenderTargetMipmap(we),et.has("WEBGL_multisampled_render_to_texture")===!1){let ke=!1;for(let ut=0,Wt=I.length;ut<Wt;ut++){const Ct=I[ut],{object:At,geometry:ln,material:ze,group:fn}=Ct;if(ze.side===Bn&&At.layers.test(z.layers)){const Mt=ze.side;ze.side=_n,ze.needsUpdate=!0,oe(At,q,z,ln,ze,fn),ze.side=Mt,ze.needsUpdate=!0,ke=!0}}ke===!0&&(Ke.updateMultisampleRenderTarget(we),Ke.updateRenderTargetMipmap(we))}A.setRenderTarget(Re,Fe,Ve),A.setClearColor(ne,fe),ht!==void 0&&(z.viewport=ht),A.toneMapping=nt}function W(x,I,q){const z=I.isScene===!0?I.overrideMaterial:null;for(let V=0,we=x.length;V<we;V++){const Be=x[V],{object:Re,geometry:Fe,group:Ve}=Be;let nt=Be.material;nt.allowOverride===!0&&z!==null&&(nt=z),Re.layers.test(q.layers)&&oe(Re,I,q,Fe,nt,Ve)}}function oe(x,I,q,z,V,we){O!==null&&V.isNodeMaterial&&O.setObject(x,V),x.onBeforeRender(A,I,q,z,V,we),x.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),V.onBeforeRender(A,I,q,z,x,we),V.transparent===!0&&V.side===Bn&&V.forceSinglePass===!1?(V.side=_n,V.needsUpdate=!0,A.renderBufferDirect(q,I,z,V,x,we),V.side=Oi,V.needsUpdate=!0,A.renderBufferDirect(q,I,z,V,x,we),V.side=Bn):A.renderBufferDirect(q,I,z,V,x,we),x.onAfterRender(A,I,q,z,V,we)}function _e(x){let I=0;for(const q of x)q.texture!==null&&I++;return I}function Me(x,I,q){I.isScene!==!0&&(I=it);const z=$e.get(x),V=T.state.lights,we=T.state.shadowsArray,Be=V.state.version,Re=re.getParameters(x,V.state,we,I,q,T.state.lightProbeGridArray),Fe=re.getProgramCacheKey(Re);let Ve=z.programs;z.environment=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?I.environment:null,z.fog=I.fog;const nt=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap;z.envMap=w.get(x.envMap||z.environment,nt),z.envMapRotation=z.environment!==null&&x.envMap===null?I.environmentRotation:x.envMapRotation,Ve===void 0&&(x.addEventListener("dispose",vt),Ve=new Map,z.programs=Ve,z.programVariants=new Map);let ht=Ve.get(Fe);if(ht!==void 0){if(z.currentProgram===ht&&z.lightsStateVersion===Be)return Te(x,Re),ht}else Re.uniforms=re.getUniforms(x),O!==null&&x.isNodeMaterial&&O.build(x,q,Re),x.onBeforeCompile(Re,A),ht=re.acquireProgram(Re,Fe),Ve.set(Fe,ht),z.uniforms=Re.uniforms;const ke=z.uniforms;return(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(ke.clippingPlanes=se.uniform),Te(x,Re),z.needsLights=Dt(x),z.lightsStateVersion=Be,z.needsLights&&(ke.ambientLightColor.value=V.state.ambient,ke.lightProbe.value=V.state.probe,ke.sunLights.value=V.state.sun,ke.sunLightShadows.value=V.state.sunShadow,ke.directionalLights.value=V.state.directional,ke.directionalLightShadows.value=V.state.directionalShadow,ke.spotLights.value=V.state.spot,ke.spotLightShadows.value=V.state.spotShadow,ke.rectAreaLights.value=V.state.rectArea,ke.ltc_1.value=V.state.rectAreaLTC1,ke.ltc_2.value=V.state.rectAreaLTC2,ke.pointLights.value=V.state.point,ke.pointLightShadows.value=V.state.pointShadow,ke.hemisphereLights.value=V.state.hemi,ke.sunShadowMatrix.value=V.state.sunShadowMatrix,ke.sunShadowCascade.value=V.state.sunShadowCascade,ke.directionalShadowMatrix.value=V.state.directionalShadowMatrix,ke.spotLightMatrix.value=V.state.spotLightMatrix,ke.spotLightMap.value=V.state.spotLightMap,ke.pointShadowMatrix.value=V.state.pointShadowMatrix),z.numLightProbeGrids=_e(T.state.lightProbeGridArray),z.currentProgram=ht,z.uniformsList=null,ht}function De(x,I,q,z,V){const we=$e.get(x),Be=we.currentProgram.id+","+z+","+V;let Re=we.programVariants.get(Be);return Re===void 0?(Re=Me(x,I,q),we.programVariants.set(Be,Re)):(we.currentProgram=Re,we.uniformsList=null,we.outputColorSpace=z,we.toneMapping=V),Re}function Ie(x){if(x.uniformsList===null){const I=x.currentProgram.getUniforms();x.uniformsList=kr.seqWithValue(I.seq,x.uniforms)}return x.uniformsList}function Te(x,I){const q=$e.get(x);q.outputColorSpace=I.outputColorSpace,q.batching=I.batching,q.batchingColor=I.batchingColor,q.instancing=I.instancing,q.instancingColor=I.instancingColor,q.instancingMorph=I.instancingMorph,q.skinning=I.skinning,q.morphTargets=I.morphTargets,q.morphNormals=I.morphNormals,q.morphColors=I.morphColors,q.morphTargetsCount=I.morphTargetsCount,q.numClippingPlanes=I.numClippingPlanes,q.numIntersection=I.numClipIntersection,q.vertexAlphas=I.vertexAlphas,q.vertexTangents=I.vertexTangents,q.toneMapping=I.toneMapping}function Qe(x,I,q,z,V){I.isScene!==!0&&(I=it),Ke.resetTextureUnits();const we=I.fog,Be=z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial?I.environment:null,Re=he===null?A.outputColorSpace:he.isXRRenderTarget===!0?he.texture.colorSpace:dt.workingColorSpace,Fe=z.isMeshStandardMaterial||z.isMeshLambertMaterial&&!z.envMap||z.isMeshPhongMaterial&&!z.envMap,Ve=w.get(z.envMap||Be,Fe),nt=z.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,ht=!!q.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),ke=!!q.morphAttributes.position,ut=!!q.morphAttributes.normal,Wt=!!q.morphAttributes.color;let Ct=ci;z.toneMapped&&(he===null||he.isXRRenderTarget===!0)&&(Ct=A.toneMapping);const At=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,ln=At!==void 0?At.length:0,ze=$e.get(z),fn=T.state.lights;if(ce===!0&&(pe===!0||x!==ae)){const Ut=x===ae&&z.id===Z;se.setState(z,x,Ut)}let Mt=!1,Ai=!1;z.version===ze.__version?ze.needsLights&&ze.lightsStateVersion!==fn.state.version||V.isBatchedMesh&&ze.batching===!1||!V.isBatchedMesh&&ze.batching===!0||V.isBatchedMesh&&ze.batchingColor===!0&&V._colorsTexture===null||V.isBatchedMesh&&ze.batchingColor===!1&&V._colorsTexture!==null||V.isInstancedMesh&&ze.instancing===!1||!V.isInstancedMesh&&ze.instancing===!0||V.isSkinnedMesh&&ze.skinning===!1||!V.isSkinnedMesh&&ze.skinning===!0||V.isInstancedMesh&&ze.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&ze.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&ze.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&ze.instancingMorph===!1&&V.morphTexture!==null||ze.envMap!==Ve||z.fog===!0&&ze.fog!==we||ze.numClippingPlanes!==void 0&&(ze.numClippingPlanes!==se.numPlanes||ze.numIntersection!==se.numIntersection)||ze.vertexAlphas!==nt||ze.vertexTangents!==ht||ze.morphTargets!==ke||ze.morphNormals!==ut||ze.morphColors!==Wt||ze.morphTargetsCount!==ln||ze.numLightProbeGrids!==_e(T.state.lightProbeGridArray)?Mt=!0:(ze.outputColorSpace!==Re||ze.toneMapping!==Ct)&&(Ai=!0):(Mt=!0,ze.__version=z.version);let cn=ze.currentProgram;(Mt===!0||Ai===!0)&&(cn=Ai===!0?De(z,I,V,Re,Ct):Me(z,I,V),O&&z.isNodeMaterial&&O.onUpdateProgram(z,cn,ze));let rr=!1,ui=!1,Ri=!1;const pt=cn.getUniforms(),tn=ze.uniforms;if(Ae.useProgram(cn.program)&&(rr=!0,ui=!0,Ri=!0),z.id!==Z&&(Z=z.id,ui=!0),rr||ae!==x){Ae.buffers.depth.getReversed()&&x.reversedDepth!==!0&&(x._reversedDepth=!0,x.updateProjectionMatrix()),pt.setValue(N,"projectionMatrix",x.projectionMatrix),pt.setValue(N,"viewMatrix",x.matrixWorldInverse);const Qt=pt.map.cameraPosition;Qt!==void 0&&Qt.setValue(N,Ge.setFromMatrixPosition(x.matrixWorld)),St.logarithmicDepthBuffer&&pt.setValue(N,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&pt.setValue(N,"isOrthographic",x.isOrthographicCamera===!0),ae!==x&&(ae=x,ui=!0,Ri=!0)}if(ze.needsLights&&(fn.state.sunShadowMap.length>0&&pt.setValue(N,"sunShadowMap",fn.state.sunShadowMap,Ke),fn.state.directionalShadowMap.length>0&&pt.setValue(N,"directionalShadowMap",fn.state.directionalShadowMap,Ke),fn.state.spotShadowMap.length>0&&pt.setValue(N,"spotShadowMap",fn.state.spotShadowMap,Ke),fn.state.pointShadowMap.length>0&&pt.setValue(N,"pointShadowMap",fn.state.pointShadowMap,Ke)),V.isSkinnedMesh){pt.setOptional(N,V,"bindMatrix"),pt.setOptional(N,V,"bindMatrixInverse");const Ut=V.skeleton;Ut&&(Ut.boneTexture===null&&Ut.computeBoneTexture(),pt.setValue(N,"boneTexture",Ut.boneTexture,Ke))}V.isBatchedMesh&&(pt.setOptional(N,V,"batchingTexture"),pt.setValue(N,"batchingTexture",V._matricesTexture,Ke),pt.setOptional(N,V,"batchingIdTexture"),pt.setValue(N,"batchingIdTexture",V._indirectTexture,Ke),pt.setOptional(N,V,"batchingColorTexture"),V._colorsTexture!==null&&pt.setValue(N,"batchingColorTexture",V._colorsTexture,Ke));const Dn=q.morphAttributes;if((Dn.position!==void 0||Dn.normal!==void 0||Dn.color!==void 0)&&ie.update(V,q,cn),(ui||ze.receiveShadow!==V.receiveShadow)&&(ze.receiveShadow=V.receiveShadow,pt.setValue(N,"receiveShadow",V.receiveShadow)),(z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial)&&z.envMap===null&&I.environment!==null&&(tn.envMapIntensity.value=I.environmentIntensity),tn.dfgLUT!==void 0&&(tn.dfgLUT.value=q_()),ui){if(pt.setValue(N,"toneMappingExposure",A.toneMappingExposure),ze.needsLights&&wt(tn,Ri),we&&z.fog===!0&&Ee.refreshFogUniforms(tn,we),Ee.refreshMaterialUniforms(tn,z,Ce,We,T.state.transmissionRenderTarget[x.id]),ze.needsLights&&ze.numLightProbeGrids>0){const Ut=S;let Qt=0;for(const ti of T.state.lightProbeGridArray)ti.texture!==null&&(Ut.textures[Qt]=ti.texture,Ut.min[Qt]=ti.boundingBox.min,Ut.max[Qt]=ti.boundingBox.max,Ut.resolution[Qt]=ti.resolution,Qt++);for(const ti in Ut)Ut[ti].length=Qt;tn.probesSH.value=Ut.textures,tn.probesMin.value=Ut.min,tn.probesMax.value=Ut.max,tn.probesResolution.value=Ut.resolution}kr.upload(N,Ie(ze),tn,Ke)}if(z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(kr.upload(N,Ie(ze),tn,Ke),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&pt.setValue(N,"center",V.center),pt.setValue(N,"modelViewMatrix",V.modelViewMatrix),pt.setValue(N,"normalMatrix",V.normalMatrix),pt.setValue(N,"modelMatrix",V.matrixWorld),z.uniformsGroups!==void 0){const Ut=z.uniformsGroups;for(let Qt=0,ti=Ut.length;Qt<ti;Qt++){const bl=Ut[Qt];He.update(bl,cn),He.bind(bl,cn)}}return cn}function wt(x,I){x.ambientLightColor.needsUpdate=I,x.lightProbe.needsUpdate=I,x.sunLights.needsUpdate=I,x.sunLightShadows.needsUpdate=I,x.directionalLights.needsUpdate=I,x.directionalLightShadows.needsUpdate=I,x.pointLights.needsUpdate=I,x.pointLightShadows.needsUpdate=I,x.spotLights.needsUpdate=I,x.spotLightShadows.needsUpdate=I,x.rectAreaLights.needsUpdate=I,x.hemisphereLights.needsUpdate=I}function Dt(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return J},this.getActiveMipmapLevel=function(){return G},this.getRenderTarget=function(){return he},this.setRenderTargetTextures=function(x,I,q){const z=$e.get(x);z.__autoAllocateDepthBuffer=x.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),$e.get(x.texture).__webglTexture=I,$e.get(x.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:q,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(x,I){const q=$e.get(x);q.__webglFramebuffer=I,q.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(x,I=0,q=0){he=x,J=I,G=q;let z=null,V=!1,we=!1;if(x){const Re=$e.get(x);if(Re.__useDefaultFramebuffer!==void 0){Ae.bindFramebuffer(N.FRAMEBUFFER,Re.__webglFramebuffer),le.copy(x.viewport),Ue.copy(x.scissor),qe=x.scissorTest,Ae.viewport(le),Ae.scissor(Ue),Ae.setScissorTest(qe),Z=-1;return}else if(Re.__webglFramebuffer===void 0)Ke.setupRenderTarget(x);else if(Re.__hasExternalTextures)Ke.rebindTextures(x,$e.get(x.texture).__webglTexture,$e.get(x.depthTexture).__webglTexture);else if(x.depthBuffer){const nt=x.depthTexture;if(Re.__boundDepthTexture!==nt){if(nt!==null&&$e.has(nt)&&(x.width!==nt.image.width||x.height!==nt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Ke.setupDepthRenderbuffer(x)}}const Fe=x.texture;(Fe.isData3DTexture||Fe.isDataArrayTexture||Fe.isCompressedArrayTexture)&&(we=!0);const Ve=$e.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(Ve[I])?z=Ve[I][q]:z=Ve[I],V=!0):x.samples>0&&Ke.useMultisampledRTT(x)===!1?z=$e.get(x).__webglMultisampledFramebuffer:Array.isArray(Ve)?z=Ve[q]:z=Ve,le.copy(x.viewport),Ue.copy(x.scissor),qe=x.scissorTest}else le.copy(U).multiplyScalar(Ce).floor(),Ue.copy(k).multiplyScalar(Ce).floor(),qe=j;if(q!==0&&(z=X),Ae.bindFramebuffer(N.FRAMEBUFFER,z)&&Ae.drawBuffers(x,z),Ae.viewport(le),Ae.scissor(Ue),Ae.setScissorTest(qe),V){const Re=$e.get(x.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+I,Re.__webglTexture,q)}else if(we){const Re=I;for(let Fe=0;Fe<x.textures.length;Fe++){const Ve=$e.get(x.textures[Fe]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Fe,Ve.__webglTexture,q,Re)}}else if(x!==null&&q!==0){const Re=$e.get(x.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Re.__webglTexture,q)}Z=-1};function Vt(x){const I=$e.get(x);return(I.__readFormat!==x.format||I.__readType!==x.type)&&(I.__readFormat=x.format,I.__readType=x.type,I.__formatReadable=St.textureFormatReadable(x.format),I.__typeReadable=St.textureTypeReadable(x.type)),I}this.readRenderTargetPixels=function(x,I,q,z,V,we,Be,Re=0){if(!(x&&x.isWebGLRenderTarget)){mt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Fe=$e.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&Be!==void 0&&(Fe=Fe[Be],Array.isArray(Fe)&&(Fe=Fe[0])),Fe){Ae.bindFramebuffer(N.FRAMEBUFFER,Fe);try{const Ve=x.textures[Re],nt=Ve.format,ht=Ve.type;x.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Re);const ke=Vt(Ve);if(ke.__formatReadable===!1){mt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(ke.__typeReadable===!1){mt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=x.width-z&&q>=0&&q<=x.height-V&&N.readPixels(I,q,z,V,xe.convert(nt),xe.convert(ht),we)}finally{const Ve=he!==null?$e.get(he).__webglFramebuffer:null;Ae.bindFramebuffer(N.FRAMEBUFFER,Ve)}}},this.readRenderTargetPixelsAsync=async function(x,I,q,z,V,we,Be,Re=0){if(!(x&&x.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Fe=$e.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&Be!==void 0&&(Fe=Fe[Be],Array.isArray(Fe)&&(Fe=Fe[0])),Fe)if(I>=0&&I<=x.width-z&&q>=0&&q<=x.height-V){Ae.bindFramebuffer(N.FRAMEBUFFER,Fe);const Ve=x.textures[Re],nt=Ve.format,ht=Ve.type;x.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Re);const ke=Vt(Ve);if(ke.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(ke.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ut=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,ut),N.bufferData(N.PIXEL_PACK_BUFFER,we.byteLength,N.STREAM_READ),N.readPixels(I,q,z,V,xe.convert(nt),xe.convert(ht),0),N.bindBuffer(N.PIXEL_PACK_BUFFER,null);const Wt=he!==null?$e.get(he).__webglFramebuffer:null;Ae.bindFramebuffer(N.FRAMEBUFFER,Wt);const Ct=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await yd(N,Ct,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,ut),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,we),N.bindBuffer(N.PIXEL_PACK_BUFFER,null),N.deleteBuffer(ut),N.deleteSync(Ct),we}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(x,I=null,q=0){const z=Math.pow(2,-q),V=Math.floor(x.image.width*z),we=Math.floor(x.image.height*z),Be=I!==null?I.x:0,Re=I!==null?I.y:0;Ke.setTexture2D(x,0),N.copyTexSubImage2D(N.TEXTURE_2D,q,0,0,Be,Re,V,we),Ae.unbindTexture()},this.copyTextureToTexture=function(x,I,q=null,z=null,V=0,we=0){let Be,Re,Fe,Ve,nt,ht,ke,ut,Wt;const Ct=x.isCompressedTexture?x.mipmaps[we]:x.image;if(q!==null)Be=q.max.x-q.min.x,Re=q.max.y-q.min.y,Fe=q.isBox3?q.max.z-q.min.z:1,Ve=q.min.x,nt=q.min.y,ht=q.isBox3?q.min.z:0;else{const pt=Math.pow(2,-V);Be=Math.floor(Ct.width*pt),Re=Math.floor(Ct.height*pt),x.isDataArrayTexture?Fe=Ct.depth:x.isData3DTexture?Fe=Math.floor(Ct.depth*pt):Fe=1,Ve=0,nt=0,ht=0}z!==null?(ke=z.x,ut=z.y,Wt=z.z):(ke=0,ut=0,Wt=0);const At=xe.convert(I.format),ln=xe.convert(I.type);let ze;I.isData3DTexture?(Ke.setTexture3D(I,0),ze=N.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(Ke.setTexture2DArray(I,0),ze=N.TEXTURE_2D_ARRAY):(Ke.setTexture2D(I,0),ze=N.TEXTURE_2D),Ae.activeTexture(N.TEXTURE0),Ae.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,I.flipY),Ae.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),Ae.pixelStorei(N.UNPACK_ALIGNMENT,I.unpackAlignment);const fn=Ae.getParameter(N.UNPACK_ROW_LENGTH),Mt=Ae.getParameter(N.UNPACK_IMAGE_HEIGHT),Ai=Ae.getParameter(N.UNPACK_SKIP_PIXELS),cn=Ae.getParameter(N.UNPACK_SKIP_ROWS),rr=Ae.getParameter(N.UNPACK_SKIP_IMAGES);Ae.pixelStorei(N.UNPACK_ROW_LENGTH,Ct.width),Ae.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Ct.height),Ae.pixelStorei(N.UNPACK_SKIP_PIXELS,Ve),Ae.pixelStorei(N.UNPACK_SKIP_ROWS,nt),Ae.pixelStorei(N.UNPACK_SKIP_IMAGES,ht);const ui=x.isDataArrayTexture||x.isData3DTexture,Ri=I.isDataArrayTexture||I.isData3DTexture;if(x.isDepthTexture){const pt=$e.get(x),tn=$e.get(I),Dn=$e.get(pt.__renderTarget),Ut=$e.get(tn.__renderTarget);Ae.bindFramebuffer(N.READ_FRAMEBUFFER,Dn.__webglFramebuffer),Ae.bindFramebuffer(N.DRAW_FRAMEBUFFER,Ut.__webglFramebuffer);for(let Qt=0;Qt<Fe;Qt++)ui&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,$e.get(x).__webglTexture,V,ht+Qt),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,$e.get(I).__webglTexture,we,Wt+Qt)),N.blitFramebuffer(Ve,nt,Ve+Be,nt+Re,ke,ut,ke+Be,ut+Re,N.DEPTH_BUFFER_BIT,N.NEAREST);Ae.bindFramebuffer(N.READ_FRAMEBUFFER,null),Ae.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(V!==0||x.isRenderTargetTexture||$e.has(x)){const pt=$e.get(x),tn=$e.get(I);Ae.bindFramebuffer(N.READ_FRAMEBUFFER,L),Ae.bindFramebuffer(N.DRAW_FRAMEBUFFER,$);for(let Dn=0;Dn<Fe;Dn++)ui?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,pt.__webglTexture,V,ht+Dn):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,pt.__webglTexture,V),Ri?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,tn.__webglTexture,we,Wt+Dn):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,tn.__webglTexture,we),V!==0?N.blitFramebuffer(Ve,nt,Ve+Be,nt+Re,ke,ut,ke+Be,ut+Re,N.COLOR_BUFFER_BIT,N.NEAREST):Ri?N.copyTexSubImage3D(ze,we,ke,ut,Wt+Dn,Ve,nt,Be,Re):N.copyTexSubImage2D(ze,we,ke,ut,Ve,nt,Be,Re);Ae.bindFramebuffer(N.READ_FRAMEBUFFER,null),Ae.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else Ri?x.isDataTexture||x.isData3DTexture?N.texSubImage3D(ze,we,ke,ut,Wt,Be,Re,Fe,At,ln,Ct.data):I.isCompressedArrayTexture?N.compressedTexSubImage3D(ze,we,ke,ut,Wt,Be,Re,Fe,At,Ct.data):N.texSubImage3D(ze,we,ke,ut,Wt,Be,Re,Fe,At,ln,Ct):x.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,we,ke,ut,Be,Re,At,ln,Ct.data):x.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,we,ke,ut,Ct.width,Ct.height,At,Ct.data):N.texSubImage2D(N.TEXTURE_2D,we,ke,ut,Be,Re,At,ln,Ct);Ae.pixelStorei(N.UNPACK_ROW_LENGTH,fn),Ae.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Mt),Ae.pixelStorei(N.UNPACK_SKIP_PIXELS,Ai),Ae.pixelStorei(N.UNPACK_SKIP_ROWS,cn),Ae.pixelStorei(N.UNPACK_SKIP_IMAGES,rr),we===0&&I.generateMipmaps===!0&&I.mipmapsAutoUpdate===!0&&N.generateMipmap(ze),Ae.unbindTexture()},this.initRenderTarget=function(x){$e.get(x).__webglFramebuffer===void 0&&Ke.setupRenderTarget(x)},this.initTexture=function(x){x.isCubeTexture?Ke.setTextureCube(x,0):x.isData3DTexture?Ke.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?Ke.setTexture2DArray(x,0):Ke.setTexture2D(x,0),Ae.unbindTexture()},this.resetState=function(){J=0,G=0,he=null,Ae.reset(),be.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=dt._getDrawingBufferColorSpace(e),t.unpackColorSpace=dt._getUnpackColorSpace()}}const Vc={type:"change"},_l={type:"start"},ru={type:"end"},Pr=new cl,Wc=new oi,Z_=Math.cos(70*Xn.DEG2RAD),Zt=new F,xn=2*Math.PI,xt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Oa=1e-6;class K_ extends ep{constructor(e,t=null){super(e,t),this.state=xt.NONE,this.target=new F,this.cursor=new F,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:os.ROTATE,MIDDLE:os.DOLLY,RIGHT:os.PAN},this.touches={ONE:ss.ROTATE,TWO:ss.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new F,this._lastQuaternion=new sn,this._lastTargetPosition=new F,this._quat=new sn().setFromUnitVectors(e.up,new F(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new xc,this._sphericalDelta=new xc,this._scale=1,this._panOffset=new F,this._rotateStart=new ve,this._rotateEnd=new ve,this._rotateDelta=new ve,this._panStart=new ve,this._panEnd=new ve,this._panDelta=new ve,this._dollyStart=new ve,this._dollyEnd=new ve,this._dollyDelta=new ve,this._dollyDirection=new F,this._mouse=new ve,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Q_.bind(this),this._onPointerDown=J_.bind(this),this._onPointerUp=j_.bind(this),this._onContextMenu=av.bind(this),this._onMouseWheel=nv.bind(this),this._onKeyDown=iv.bind(this),this._onTouchStart=sv.bind(this),this._onTouchMove=rv.bind(this),this._onMouseDown=ev.bind(this),this._onMouseMove=tv.bind(this),this._interceptControlDown=ov.bind(this),this._interceptControlUp=lv.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.ownerDocument.addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=xt.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.ownerDocument.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Vc),this.update(),this.state=xt.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const t=this.object.position;Zt.copy(t).sub(this.target),Zt.applyQuaternion(this._quat),this._spherical.setFromVector3(Zt),this.autoRotate&&this.state===xt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=xn:i>Math.PI&&(i-=xn),s<-Math.PI?s+=xn:s>Math.PI&&(s-=xn),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Zt.setFromSpherical(this._spherical),Zt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Zt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=Zt.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new F(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new F(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=Zt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Pr.origin.copy(this.object.position),Pr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Pr.direction))<Z_?this.object.lookAt(this.target):(Wc.setFromNormalAndCoplanarPoint(this.object.up,this.target),Pr.intersectPlane(Wc,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Oa||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Oa||this._lastTargetPosition.distanceToSquared(this.target)>Oa?(this.dispatchEvent(Vc),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?xn/60*this.autoRotateSpeed*e:xn/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Zt.setFromMatrixColumn(t,0),Zt.multiplyScalar(-e),this._panOffset.add(Zt)}_panUp(e,t){this.screenSpacePanning===!0?Zt.setFromMatrixColumn(t,1):(Zt.setFromMatrixColumn(t,0),Zt.crossVectors(this.object.up,Zt)),Zt.multiplyScalar(e),this._panOffset.add(Zt)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Zt.copy(s).sub(this.target);let r=Zt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*t*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=e-i.left,r=t-i.top,a=i.width,o=i.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientY),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(xn*this._rotateDelta.x/t.clientHeight),this._rotateUp(xn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.zoomToCursor&&(this._performCursorZoom=!0,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(xn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-xn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(xn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-xn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(xn*this._rotateDelta.x/t.clientHeight),this._rotateUp(xn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new ve,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function J_(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function Q_(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function j_(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(ru),this.state=xt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function ev(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case os.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=xt.DOLLY;break;case os.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=xt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=xt.ROTATE}break;case os.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=xt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=xt.PAN}break;default:this.state=xt.NONE}this.state!==xt.NONE&&this.dispatchEvent(_l)}function tv(n){switch(this.state){case xt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case xt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case xt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function nv(n){this.enabled===!1||this.enableZoom===!1||this.state!==xt.NONE||(n.preventDefault(),this.dispatchEvent(_l),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(ru))}function iv(n){this.enabled!==!1&&this._handleKeyDown(n)}function sv(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case ss.ROTATE:if(this.enableRotate===!1){this.state=xt.NONE;break}this._handleTouchStartRotate(n),this.state=xt.TOUCH_ROTATE;break;case ss.PAN:if(this.enablePan===!1){this.state=xt.NONE;break}this._handleTouchStartPan(n),this.state=xt.TOUCH_PAN;break;default:this.state=xt.NONE}break;case 2:switch(this.touches.TWO){case ss.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=xt.TOUCH_DOLLY_PAN;break;case ss.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=xt.TOUCH_DOLLY_ROTATE;break;default:this.state=xt.NONE}break;default:this.state=xt.NONE}this.state!==xt.NONE&&this.dispatchEvent(_l)}function rv(n){switch(this._trackPointer(n),this.state){case xt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case xt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case xt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case xt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=xt.NONE}}function av(n){this.enabled!==!1&&n.preventDefault()}function ov(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.ownerDocument.addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function lv(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const bs=new F;function Pn(n,e,t,i,s,r){const a=2*Math.PI*s/4,o=Math.max(r-2*s,0),l=Math.PI/4;bs.copy(e),bs[i]=0,bs.normalize();const c=.5*a/(a+o),h=1-bs.angleTo(n)/l;return Math.sign(bs[t])===1?h*c:o/(a+o)+c+c*(1-h)}class $n extends Gi{constructor(e=1,t=1,i=1,s=2,r=.1){const a=s*2+1;if(r=Math.min(e/2,t/2,i/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:i,segments:s,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const l=new F,c=new F,h=new F(e,t,i).divideScalar(2).subScalar(r),d=this.attributes.position.array,u=this.attributes.normal.array,f=this.attributes.uv.array,g=d.length/6,b=new F,m=.5/a;for(let p=0,v=0;p<d.length;p+=3,v+=2)switch(l.fromArray(d,p),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),d[p+0]=h.x*Math.sign(l.x)+c.x*r,d[p+1]=h.y*Math.sign(l.y)+c.y*r,d[p+2]=h.z*Math.sign(l.z)+c.z*r,u[p+0]=c.x,u[p+1]=c.y,u[p+2]=c.z,Math.floor(p/g)){case 0:b.set(1,0,0),f[v+0]=Pn(b,c,"z","y",r,i),f[v+1]=1-Pn(b,c,"y","z",r,t);break;case 1:b.set(-1,0,0),f[v+0]=1-Pn(b,c,"z","y",r,i),f[v+1]=1-Pn(b,c,"y","z",r,t);break;case 2:b.set(0,1,0),f[v+0]=1-Pn(b,c,"x","z",r,e),f[v+1]=Pn(b,c,"z","x",r,i);break;case 3:b.set(0,-1,0),f[v+0]=1-Pn(b,c,"x","z",r,e),f[v+1]=1-Pn(b,c,"z","x",r,i);break;case 4:b.set(0,0,1),f[v+0]=1-Pn(b,c,"x","y",r,e),f[v+1]=1-Pn(b,c,"y","x",r,t);break;case 5:b.set(0,0,-1),f[v+0]=Pn(b,c,"x","y",r,e),f[v+1]=1-Pn(b,c,"y","x",r,t);break}}static fromJSON(e){return new $n(e.width,e.height,e.depth,e.segments,e.radius)}}const ft=Math.PI*2;function Ft(n,e,t,i,s,r){const a=Math.min(r,i/2,s/2);n.beginPath(),n.moveTo(e+a,t),n.arcTo(e+i,t,e+i,t+s,a),n.arcTo(e+i,t+s,e,t+s,a),n.arcTo(e,t+s,e,t,a),n.arcTo(e,t,e+i,t,a),n.closePath()}function Ba(n,e,t,i){n.beginPath();for(let s=0;s<e*2;s++){const r=s%2?i:t,a=s*Math.PI/e-Math.PI/2,o=Math.cos(a)*r,l=Math.sin(a)*r;s===0?n.moveTo(o,l):n.lineTo(o,l)}n.closePath()}function cv(n){n.beginPath(),n.moveTo(0,34),n.bezierCurveTo(-52,-2,-38,-40,-14,-40),n.bezierCurveTo(-4,-40,0,-32,0,-24),n.bezierCurveTo(0,-32,4,-40,14,-40),n.bezierCurveTo(38,-40,52,-2,0,34),n.closePath()}function au(n,e,t,i,s,r,a="#FFFFFF"){switch(n.save(),n.translate(t,i),n.scale(s/100,s/100),n.fillStyle=r,n.strokeStyle=r,n.lineWidth=8,n.lineCap="round",n.lineJoin="round",e){case"sun":{n.beginPath(),n.arc(0,0,20,0,ft),n.fill();for(let o=0;o<8;o++){const l=o*ft/8;n.beginPath(),n.moveTo(Math.cos(l)*30,Math.sin(l)*30),n.lineTo(Math.cos(l)*43,Math.sin(l)*43),n.stroke()}break}case"cup":{n.beginPath(),n.moveTo(-24,-28),n.lineTo(-17,32),n.lineTo(17,32),n.lineTo(24,-28),n.closePath(),n.fill(),n.strokeStyle=a,n.lineWidth=7,n.beginPath(),n.moveTo(-26,-8),n.lineTo(26,-8),n.stroke(),n.strokeStyle=r,n.beginPath(),n.moveTo(12,-30),n.lineTo(22,-48),n.stroke();break}case"balloon":{n.beginPath(),n.ellipse(0,-12,23,28,0,0,ft),n.fill(),n.beginPath(),n.moveTo(-6,15),n.lineTo(0,24),n.lineTo(6,15),n.closePath(),n.fill(),n.lineWidth=5,n.beginPath(),n.moveTo(0,24),n.bezierCurveTo(14,34,-12,42,2,50),n.stroke();break}case"book":{n.lineWidth=7,n.beginPath(),n.moveTo(-44,28),n.lineTo(-44,-26),n.quadraticCurveTo(-24,-34,0,-20),n.quadraticCurveTo(24,-34,44,-26),n.lineTo(44,28),n.quadraticCurveTo(24,20,0,32),n.quadraticCurveTo(-24,20,-44,28),n.closePath(),n.fill(),n.strokeStyle=a,n.lineWidth=5,n.beginPath(),n.moveTo(0,-20),n.lineTo(0,32),n.moveTo(-32,-14),n.quadraticCurveTo(-18,-16,-8,-8),n.moveTo(-32,0),n.quadraticCurveTo(-18,-2,-8,6),n.moveTo(32,-14),n.quadraticCurveTo(18,-16,8,-8),n.stroke();break}case"star":{Ba(n,5,44,19),n.fill();break}case"ball":{n.lineWidth=7,n.beginPath(),n.arc(0,0,34,0,ft),n.stroke(),n.beginPath(),n.arc(-18,0,34,-.85,.85),n.stroke(),n.beginPath(),n.arc(18,0,34,Math.PI-.85,Math.PI+.85),n.stroke();break}case"gift":{Ft(n,-32,-12,64,44,6),n.fill(),Ft(n,-38,-26,76,18,5),n.fill(),n.fillStyle=a,n.fillRect(-7,-26,14,58),n.fillRect(-38,-20,76,8),n.fillStyle=r,n.beginPath(),n.ellipse(-16,-34,13,9,-.5,0,ft),n.fill(),n.beginPath(),n.ellipse(16,-34,13,9,.5,0,ft),n.fill();break}case"blocks":{Ft(n,-36,2,32,32,5),n.fill(),Ft(n,4,2,32,32,5),n.fill(),Ft(n,-16,-32,32,32,5),n.fill(),n.fillStyle=a,n.font="bold 22px Fredoka, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText("A",-20,18),n.fillText("B",20,18),n.fillText("C",0,-16);break}case"cap":{n.beginPath(),n.moveTo(0,-24),n.lineTo(44,-6),n.lineTo(0,12),n.lineTo(-44,-6),n.closePath(),n.fill(),Ft(n,-20,4,40,14,5),n.fill(),n.lineWidth=5,n.beginPath(),n.moveTo(34,-1),n.lineTo(38,28),n.stroke(),n.beginPath(),n.arc(38,30,5,0,ft),n.fill();break}case"briefcase":{Ft(n,-42,-18,84,52,9),n.fill(),n.strokeStyle=a,n.lineWidth=7,Ft(n,-15,-34,30,20,5),n.stroke(),n.beginPath(),n.moveTo(-42,2),n.lineTo(42,2),n.stroke(),n.fillStyle=a,Ft(n,-8,-6,16,14,3),n.fill();break}case"laptop":{Ft(n,-34,-34,68,44,5),n.fill(),n.fillStyle=a,Ft(n,-26,-26,52,28,2),n.fill(),n.fillStyle=r,n.beginPath(),n.moveTo(-44,18),n.lineTo(44,18),n.lineTo(32,32),n.lineTo(-32,32),n.closePath(),n.fill();break}case"coffee":{n.beginPath(),n.moveTo(-26,-22),n.lineTo(-20,34),n.lineTo(20,34),n.lineTo(26,-22),n.closePath(),n.fill(),n.strokeStyle=r,n.lineWidth=8,n.beginPath(),n.arc(30,2,13,-1.2,1.2),n.stroke(),n.strokeStyle=a,n.lineWidth=5,n.beginPath(),n.moveTo(-8,-34),n.bezierCurveTo(-16,-42,0,-46,-8,-54),n.moveTo(10,-32),n.bezierCurveTo(2,-40,18,-44,10,-52),n.stroke();break}case"medal":{n.fillStyle=r,n.beginPath(),n.moveTo(-22,-46),n.lineTo(-6,-10),n.lineTo(-30,-16),n.closePath(),n.fill(),n.beginPath(),n.moveTo(22,-46),n.lineTo(6,-10),n.lineTo(30,-16),n.closePath(),n.fill(),n.beginPath(),n.arc(0,10,28,0,ft),n.fill(),n.fillStyle=a,Ba(n,5,16,7),n.fill();break}case"rocket":{n.beginPath(),n.moveTo(0,-48),n.bezierCurveTo(22,-30,24,-2,16,22),n.lineTo(-16,22),n.bezierCurveTo(-24,-2,-22,-30,0,-48),n.closePath(),n.fill(),n.beginPath(),n.moveTo(-16,10),n.lineTo(-36,32),n.lineTo(-16,28),n.closePath(),n.fill(),n.beginPath(),n.moveTo(16,10),n.lineTo(36,32),n.lineTo(16,28),n.closePath(),n.fill(),n.fillStyle=a,n.beginPath(),n.arc(0,-14,9,0,ft),n.fill(),n.fillStyle="#FF9F43",n.beginPath(),n.moveTo(-9,24),n.lineTo(0,48),n.lineTo(9,24),n.closePath(),n.fill();break}case"moon":{n.beginPath(),n.arc(0,0,38,0,ft),n.fill(),n.globalCompositeOperation="destination-out",n.beginPath(),n.arc(16,-10,30,0,ft),n.fill(),n.globalCompositeOperation="source-over",n.fillStyle=r,n.save(),n.translate(30,22),Ba(n,5,11,4.5),n.fill(),n.restore();break}case"compass":{n.lineWidth=8,n.beginPath(),n.arc(0,0,38,0,ft),n.stroke(),n.beginPath(),n.moveTo(0,-32),n.lineTo(10,0),n.lineTo(0,32),n.lineTo(-10,0),n.closePath(),n.fill(),n.fillStyle=a,n.beginPath(),n.moveTo(0,-32),n.lineTo(10,0),n.lineTo(-10,0),n.closePath(),n.fill();break}case"heart":{cv(n),n.fill();break}case"rings":{n.lineWidth=9,n.beginPath(),n.arc(-16,4,24,0,ft),n.stroke(),n.beginPath(),n.arc(16,4,24,0,ft),n.stroke(),n.fillStyle=a,n.beginPath(),n.arc(-16,-28,6,0,ft),n.fill();break}case"home":{n.beginPath(),n.moveTo(0,-44),n.lineTo(44,-6),n.lineTo(34,-6),n.lineTo(34,40),n.lineTo(-34,40),n.lineTo(-34,-6),n.lineTo(-44,-6),n.closePath(),n.fill(),n.fillStyle=a,Ft(n,-10,12,20,28,3),n.fill(),Ft(n,-27,4,12,12,2),n.fill(),Ft(n,15,4,12,12,2),n.fill();break}case"crib":{n.lineWidth=7,Ft(n,-36,-18,72,40,6),n.stroke();for(let o=-24;o<=24;o+=12)n.beginPath(),n.moveTo(o,-18),n.lineTo(o,22),n.stroke();n.beginPath(),n.moveTo(-36,-18),n.lineTo(-36,-36),n.lineTo(36,-36),n.lineTo(36,-18),n.stroke(),n.beginPath(),n.moveTo(-30,22),n.lineTo(-38,40),n.moveTo(30,22),n.lineTo(38,40),n.stroke();break}case"plane":{n.beginPath(),n.moveTo(46,-36),n.lineTo(-36,-6),n.lineTo(-4,6),n.lineTo(8,38),n.lineTo(20,12),n.closePath(),n.fill(),n.strokeStyle=a,n.lineWidth=5,n.beginPath(),n.moveTo(-36,-6),n.lineTo(20,12),n.stroke();break}case"flower":{n.fillStyle=r;for(let o=0;o<6;o++){const l=o*ft/6;n.beginPath(),n.ellipse(Math.cos(l)*20,-12+Math.sin(l)*20,13,9,l,0,ft),n.fill()}n.fillStyle="#FFD166",n.beginPath(),n.arc(0,-12,10,0,ft),n.fill(),n.strokeStyle=r,n.lineWidth=6,n.beginPath(),n.moveTo(0,4),n.quadraticCurveTo(-6,28,0,46),n.stroke(),n.fillStyle=r,n.beginPath(),n.ellipse(-14,26,13,7,-.6,0,ft),n.fill();break}case"shop":{Ft(n,-38,-10,76,50,5),n.fill(),n.fillStyle=a,Ft(n,-22,6,20,34,3),n.fill(),Ft(n,8,6,20,20,3),n.fill(),n.fillStyle=r;for(let o=0;o<4;o++)n.beginPath(),n.arc(-30+o*20,-10,10,Math.PI,0),n.fill();n.fillRect(-40,-14,80,8);break}case"nest":{n.lineWidth=8,n.beginPath(),n.arc(0,8,34,.15,Math.PI-.15),n.stroke(),n.beginPath(),n.arc(0,8,26,.1,Math.PI-.1),n.stroke(),n.fillStyle=a,n.beginPath(),n.ellipse(-10,0,11,14,.2,0,ft),n.fill(),n.beginPath(),n.ellipse(12,2,10,13,-.2,0,ft),n.fill();break}case"globe":{n.lineWidth=7,n.beginPath(),n.arc(0,0,36,0,ft),n.stroke(),n.beginPath(),n.ellipse(0,0,16,36,0,0,ft),n.stroke(),n.beginPath(),n.moveTo(-36,0),n.lineTo(36,0),n.stroke(),n.beginPath(),n.ellipse(0,0,34,14,0,0,ft),n.stroke();break}case"umbrella":{n.beginPath(),n.arc(0,-6,42,Math.PI,0),n.closePath(),n.fill(),n.strokeStyle=r,n.lineWidth=7,n.beginPath(),n.moveTo(0,-6),n.lineTo(0,34),n.arc(-10,34,10,0,Math.PI),n.stroke();break}case"mountain":{n.beginPath(),n.moveTo(-46,36),n.lineTo(-8,-38),n.lineTo(30,36),n.closePath(),n.fill(),n.fillStyle=a,n.beginPath(),n.moveTo(-20,-16),n.lineTo(-8,-38),n.lineTo(4,-16),n.lineTo(-4,-10),n.lineTo(-11,-18),n.closePath(),n.fill(),n.fillStyle=r,n.beginPath(),n.moveTo(6,36),n.lineTo(32,-12),n.lineTo(48,36),n.closePath(),n.fill();break}case"palette":{n.beginPath(),n.ellipse(0,0,42,36,0,0,ft),n.fill(),n.fillStyle=a,n.beginPath(),n.ellipse(20,16,11,9,.4,0,ft),n.fill();const o=[[-20,-14,"#FF7A6B"],[-2,-24,"#5B8DEF"],[18,-18,"#FFC44D"],[-24,8,"#59C08A"]];for(const[l,c,h]of o)n.fillStyle=h,n.beginPath(),n.arc(l,c,6,0,ft),n.fill();break}case"chart":{n.fillStyle=r,Ft(n,-36,12,16,28,3),n.fill(),Ft(n,-12,0,16,40,3),n.fill(),Ft(n,12,-18,16,58,3),n.fill(),n.strokeStyle=r,n.lineWidth=6,n.beginPath(),n.moveTo(-34,2),n.lineTo(-2,-18),n.lineTo(20,-28),n.stroke(),n.beginPath(),n.moveTo(20,-28),n.lineTo(8,-30),n.moveTo(20,-28),n.lineTo(22,-16),n.stroke();break}case"car":{n.beginPath(),n.moveTo(-44,14),n.lineTo(-34,-4),n.lineTo(-12,-8),n.lineTo(-2,-26),n.lineTo(22,-26),n.lineTo(32,-8),n.lineTo(42,-2),n.lineTo(42,14),n.closePath(),n.fill(),n.fillStyle=a,Ft(n,-2,-22,22,12,2),n.fill(),n.fillStyle="#26304A",n.beginPath(),n.arc(-24,18,11,0,ft),n.fill(),n.beginPath(),n.arc(26,18,11,0,ft),n.fill(),n.fillStyle="#DDE6F5",n.beginPath(),n.arc(-24,18,4,0,ft),n.fill(),n.beginPath(),n.arc(26,18,4,0,ft),n.fill();break}case"coin":{n.beginPath(),n.arc(0,0,36,0,ft),n.fill(),n.strokeStyle=a,n.lineWidth=6,n.beginPath(),n.arc(0,0,27,0,ft),n.stroke(),n.fillStyle=a,n.font="bold 42px Fredoka, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText("$",0,2);break}case"question":{n.font="bold 96px Fredoka, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText("?",0,6);break}case"flag":{n.lineWidth=8,n.beginPath(),n.moveTo(-20,44),n.lineTo(-20,-40),n.stroke(),n.beginPath(),n.moveTo(-18,-38),n.lineTo(40,-22),n.lineTo(-18,-4),n.closePath(),n.fill();break}case"trophy":{n.beginPath(),n.moveTo(-26,-38),n.lineTo(26,-38),n.lineTo(22,2),n.quadraticCurveTo(0,20,-22,2),n.closePath(),n.fill(),n.strokeStyle=r,n.lineWidth=7,n.beginPath(),n.arc(-30,-22,12,-1.2,1.2),n.stroke(),n.beginPath(),n.arc(30,-22,12,Math.PI-1.2,Math.PI+1.2),n.stroke(),n.fillRect(-6,14,12,18),Ft(n,-22,32,44,10,3),n.fill();break}default:n.beginPath(),n.arc(0,0,28,0,ft),n.fill()}n.restore()}function hv(n,e,t=96,i="transparent"){const s=document.createElement("canvas");s.width=t,s.height=t;const r=s.getContext("2d");return i!=="transparent"&&(r.fillStyle=i,r.fillRect(0,0,t,t)),au(r,n,t/2,t/2,t*.9,e),s.toDataURL("image/png")}function Lr(n,e,t,i,s,r){Ft(n,e,t,i,s,r)}const ka=Math.PI*2,za=new Map;function K(n,{rough:e=.82,metal:t=0,emissive:i=null,emissiveIntensity:s=1,flat:r=!0,transparent:a=!1,opacity:o=1}={}){const l=`${n}|${e}|${t}|${i}|${s}|${r}|${a}|${o}`;return za.has(l)||za.set(l,new Br({color:n,roughness:e,metalness:t,flatShading:r,transparent:a,opacity:o,...i?{emissive:i,emissiveIntensity:s}:{}})),za.get(l)}function Y(n,e,t,i=[0,0,0],s=[0,0,0]){const r=new qt(e,t);return r.position.set(...i),r.rotation.set(...s),r.castShadow=!0,r.receiveShadow=!0,n.add(r),r}function Ze(n,e,t,i=.03){return i>0?new $n(n,e,t,2,i):new Gi(n,e,t)}function Pt(n,e,t,i=10){return new An(n,e,t,i)}function Et(n,e=1){return new na(n,e)}function uv(n,e){const t=new Gt,i=new Gt;return t.add(i),Y(i,Pt(.26,.29,.055,18),K(n.dark,{rough:.6}),[0,.03,0]),Y(i,new ta(.135,.2,4,10),K(n.color,{rough:.65}),[0,.35,0]),Y(i,Et(.16,2),K("#FFD9B8",{rough:.7}),[0,.65,0]),Y(i,Et(.165,2),K(n.color,{rough:.65}),[0,.79,-.01]),Y(i,Et(.022,1),K("#2B3044",{rough:.4}),[-.055,.665,.145]),Y(i,Et(.022,1),K("#2B3044",{rough:.4}),[.055,.665,.145]),Y(i,Et(.028,1),K("#FFA9A0",{rough:.8}),[-.095,.62,.125]),Y(i,Et(.028,1),K("#FFA9A0",{rough:.8}),[.095,.62,.125]),Y(i,new yn(.135,.035,6,14),K(n.dark,{rough:.7}),[0,.5,0],[Math.PI/2,0,0]),e%4===0?(Y(i,Pt(.19,.19,.035,14),K(n.dark,{rough:.6}),[0,.85,0]),Y(i,Pt(.13,.15,.12,14),K(n.dark,{rough:.6}),[0,.92,0])):e%4===1?(Y(i,Et(.17,2),K(n.dark,{rough:.8}),[0,.87,0]),Y(i,Et(.06,1),K("#FFF6E6",{rough:.8}),[0,1.02,0])):e%4===2?(Y(i,Pt(.21,.21,.03,14),K("#3A2A22",{rough:.6}),[0,.85,0]),Y(i,Pt(.13,.13,.2,14),K("#3A2A22",{rough:.6}),[0,.96,0]),Y(i,Pt(.14,.14,.04,14),K(n.color,{rough:.6}),[0,.9,0])):(Y(i,Pt(.015,.015,.22,6),K(n.dark,{rough:.6}),[0,.94,0]),Y(i,Et(.055,1),K(n.color,{emissive:n.color,emissiveIntensity:.35}),[0,1.06,0])),t.userData.visual=i,t.userData.style=n,t.userData.phase=e*1.7,t}function ou(n,e,t){const i=new Gt,s=K("#FFF6E6",{rough:.9}),r=K(e,{rough:.75}),a=K(t,{rough:.7});return n===1?(Y(i,Ze(.36,.26,.32,.02),s,[0,.13,0]),Y(i,new gn(.3,.2,4),r,[0,.36,0],[0,Math.PI/4,0]),Y(i,Ze(.09,.16,.03,.01),a,[0,.08,.165])):n===2?(Y(i,Ze(.42,.4,.36,.02),s,[0,.2,0]),Y(i,new gn(.34,.22,4),r,[0,.51,0],[0,Math.PI/4,0]),Y(i,Ze(.16,.13,.18,.02),s,[.1,.6,0]),Y(i,new gn(.16,.13,4),r,[.1,.71,0],[0,Math.PI/4,0]),Y(i,Ze(.1,.2,.03,.01),a,[0,.1,.185]),Y(i,Ze(.08,.08,.02,.01),K("#8ED8F8",{rough:.3,metal:.1}),[-.12,.28,.185])):(Y(i,Ze(.5,.34,.4,.02),s,[0,.17,0]),Y(i,Ze(.24,.3,.28,.02),s,[.17,.47,0]),Y(i,new gn(.42,.2,4),r,[-.03,.44,0],[0,Math.PI/4,0]),Y(i,new gn(.2,.16,4),r,[.17,.69,0],[0,Math.PI/4,0]),Y(i,Ze(.12,.22,.03,.01),a,[-.1,.11,.205]),Y(i,Ze(.08,.08,.02,.01),K("#8ED8F8",{rough:.3}),[.08,.23,.205]),Y(i,Pt(.012,.012,.4,5),a,[.35,.56,0]),Y(i,Ze(.18,.1,.012,0),r,[.44,.7,0])),i}function dv(n,e){const t=new Gt,i=e||"#F3B944",s="#FFF6E6",r="#A56A45",a="#4FAF6A";switch(n.icon){case"sun":{Y(t,Et(.16,2),K("#FFC94A",{emissive:"#FFC94A",emissiveIntensity:.35,rough:.5}),[0,.3,0]);for(let o=0;o<8;o++){const l=o*ka/8;Y(t,Ze(.05,.05,.18,.01),K("#FFD166",{rough:.6}),[Math.cos(l)*.3,.3,Math.sin(l)*.3],[0,-l,0])}break}case"cup":{Y(t,Pt(.12,.09,.28,10),K("#FFD166",{rough:.5}),[0,.14,0]),Y(t,Pt(.012,.012,.28,5),K("#FF7A6B"),[.06,.3,0],[0,0,.3]);break}case"balloon":{Y(t,Et(.16,2),K("#F08BAD",{rough:.5}),[0,.36,0]),Y(t,Pt(.005,.005,.3,4),K(s),[0,.12,0]);break}case"book":{Y(t,Ze(.32,.06,.24,.01),K("#5B8DEF"),[0,.03,0]),Y(t,Ze(.3,.06,.22,.01),K("#F08BAD"),[.01,.09,0]),Y(t,Ze(.26,.05,.2,.01),K("#59C08A"),[-.02,.15,0]);break}case"star":{const o=new Bo;for(let l=0;l<10;l++){const c=l%2?.1:.24,h=l*Math.PI/5-Math.PI/2,d=Math.cos(h)*c,u=Math.sin(h)*c;l===0?o.moveTo(d,u):o.lineTo(d,u)}o.closePath(),Y(t,new Yr(o,{depth:.05,bevelEnabled:!1}),K("#FFC94A",{emissive:"#FFC94A",emissiveIntensity:.2}),[0,.32,0]);break}case"ball":{Y(t,Et(.18,2),K(s,{rough:.5}),[0,.18,0]),Y(t,new yn(.18,.018,6,18),K("#FF7A6B"),[0,.18,0],[Math.PI/2,0,0]);break}case"gift":{Y(t,Ze(.28,.22,.28,.02),K("#FF7A6B"),[0,.11,0]),Y(t,Ze(.06,.23,.29,.01),K("#FFD166"),[0,.12,0]),Y(t,Ze(.29,.23,.06,.01),K("#FFD166"),[0,.12,0]),Y(t,Et(.07,1),K("#FFD166"),[-.06,.27,0]),Y(t,Et(.07,1),K("#FFD166"),[.06,.27,0]);break}case"blocks":{Y(t,Ze(.18,.18,.18,.02),K("#FF7A6B"),[-.1,.09,0]),Y(t,Ze(.18,.18,.18,.02),K("#5B8DEF"),[.1,.09,.02]),Y(t,Ze(.18,.18,.18,.02),K("#FFC44D"),[0,.27,0]);break}case"cap":{Y(t,Ze(.34,.05,.34,.01),K("#2B3044"),[0,.24,0]),Y(t,Ze(.2,.1,.2,.02),K("#2B3044"),[0,.16,0]),Y(t,Pt(.008,.008,.22,4),K("#FFC44D"),[.16,.14,0]);break}case"briefcase":{Y(t,Ze(.32,.24,.12,.02),K("#A56A45"),[0,.12,0]),Y(t,new yn(.07,.018,5,10,Math.PI),K("#6B4226"),[0,.25,0]);break}case"laptop":{Y(t,Ze(.3,.2,.03,.01),K("#2B3044"),[0,.24,-.05],[-.25,0,0]),Y(t,Ze(.32,.03,.22,.01),K("#6B7A99"),[0,.04,.05]);break}case"coffee":{Y(t,Pt(.12,.1,.22,12),K(s),[0,.11,0]),Y(t,new yn(.07,.018,5,10,Math.PI),K(s),[.13,.12,0],[0,0,-Math.PI/2]),Y(t,Pt(.1,.1,.02,12),K("#6B4226"),[0,.225,0]);break}case"medal":{Y(t,Pt(.13,.13,.035,14),K("#FFC44D",{metal:.4,rough:.35}),[0,.3,0],[Math.PI/2,0,0]),Y(t,Ze(.09,.22,.02,.01),K("#5B8DEF"),[-.05,.12,0],[0,0,.18]),Y(t,Ze(.09,.22,.02,.01),K("#F08BAD"),[.05,.12,0],[0,0,-.18]);break}case"rocket":{Y(t,Pt(.05,.1,.34,8),K(s),[0,.24,0]),Y(t,new gn(.1,.16,8),K("#FF7A6B"),[0,.49,0]),Y(t,Ze(.04,.14,.12,.01),K("#FF7A6B"),[-.1,.16,0],[0,0,.2]),Y(t,Ze(.04,.14,.12,.01),K("#FF7A6B"),[.1,.16,0],[0,0,-.2]),Y(t,Et(.035,1),K("#8ED8F8"),[0,.3,.075]);break}case"moon":{Y(t,Et(.17,2),K("#FFF2C4",{emissive:"#FFF2C4",emissiveIntensity:.25}),[0,.32,0]),Y(t,Et(.05,1),K("#FFD166",{emissive:"#FFD166",emissiveIntensity:.4}),[.24,.45,0]);break}case"compass":{Y(t,Pt(.2,.2,.06,16),K("#FFC44D",{metal:.3,rough:.4}),[0,.03,0]),Y(t,Ze(.035,.02,.28,.005),K("#2B3044"),[0,.07,0],[0,.6,0]);break}case"heart":{const o=new Bo;o.moveTo(0,.18),o.bezierCurveTo(-.3,-.02,-.22,-.26,-.08,-.26),o.bezierCurveTo(-.02,-.26,0,-.2,0,-.16),o.bezierCurveTo(0,-.2,.02,-.26,.08,-.26),o.bezierCurveTo(.22,-.26,.3,-.02,0,.18),Y(t,new Yr(o,{depth:.09,bevelEnabled:!0,bevelSize:.02,bevelThickness:.02,bevelSegments:2}),K("#F08BAD"),[0,.38,-.045]);break}case"rings":{Y(t,new yn(.13,.025,8,20),K("#FFC44D",{metal:.5,rough:.3}),[-.06,.2,0],[Math.PI/2,.4,0]),Y(t,new yn(.13,.025,8,20),K("#FFF6E6",{metal:.4,rough:.3}),[.06,.2,0],[Math.PI/2,-.4,0]);break}case"home":{const o=ou(2,"#59C08A","#237B51");o.scale.setScalar(.85),t.add(o);break}case"crib":{Y(t,Ze(.34,.2,.22,.02),K("#A56A45"),[0,.2,0]);for(const o of[-.15,.15])for(const l of[-.1,.1])Y(t,Pt(.015,.015,.22,5),K("#6B4226"),[o,.11,l]);Y(t,Et(.05,1),K("#FFD9B8"),[0,.3,0]);break}case"plane":{Y(t,Ze(.4,.05,.14,.01),K(s),[0,.26,0]),Y(t,Ze(.16,.03,.24,.01),K("#8ED8F8"),[.02,.26,0]),Y(t,Ze(.12,.12,.02,.01),K("#FF7A6B"),[-.2,.32,0],[0,0,.2]);break}case"flower":{Y(t,Pt(.012,.012,.3,5),K(a),[0,.15,0]);for(let o=0;o<6;o++){const l=o*ka/6;Y(t,Et(.07,1),K("#F08BAD"),[Math.cos(l)*.1,.34,Math.sin(l)*.1])}Y(t,Et(.06,1),K("#FFD166"),[0,.35,0]);break}case"shop":{Y(t,Ze(.38,.26,.26,.02),K(s),[0,.13,0]),Y(t,Ze(.42,.06,.3,.01),K("#FF7A6B"),[0,.3,0]),Y(t,Ze(.1,.15,.02,.01),K("#8ED8F8"),[0,.12,.14]);break}case"nest":{Y(t,new yn(.18,.05,6,14),K("#A56A45"),[0,.08,0],[Math.PI/2,0,0]),Y(t,Et(.06,1),K("#FFF6E6"),[-.05,.14,.02]),Y(t,Et(.055,1),K("#FFF6E6"),[.06,.14,-.02]);break}case"globe":{Y(t,Et(.18,2),K("#5B8DEF"),[0,.25,0]),Y(t,new yn(.18,.01,4,18),K("#FFD166"),[0,.25,0],[Math.PI/2,.5,0]),Y(t,Pt(.02,.02,.12,5),K("#A56A45"),[0,.06,0]);break}case"umbrella":{Y(t,new gn(.24,.14,10,1,!0),K("#FF7A6B"),[0,.32,0]),Y(t,Pt(.012,.012,.32,5),K(r),[0,.14,0]);break}case"mountain":{Y(t,new gn(.28,.36,5),K("#8B7BB5"),[0,.18,0]),Y(t,new gn(.13,.14,5),K(s),[0,.34,0]);break}case"palette":{Y(t,Pt(.18,.18,.035,14),K("#E8C9A0"),[0,.25,0],[Math.PI/2,0,0]),["#FF7A6B","#5B8DEF","#FFC44D","#59C08A"].forEach((l,c)=>{const h=c*ka/4+.4;Y(t,Et(.035,1),K(l),[Math.cos(h)*.1,.26+Math.sin(h)*.1,.03])});break}case"chart":{Y(t,Ze(.07,.12,.08,.01),K("#59C08A"),[-.12,.06,0]),Y(t,Ze(.07,.2,.08,.01),K("#5B8DEF"),[0,.1,0]),Y(t,Ze(.07,.28,.08,.01),K("#FF7A6B"),[.12,.14,0]),Y(t,Ze(.36,.02,.02,.005),K("#FFC44D"),[0,.33,0],[0,0,.2]);break}case"car":{Y(t,Ze(.4,.14,.2,.04),K("#FF7A6B"),[0,.16,0]),Y(t,Ze(.2,.12,.18,.03),K("#FF7A6B"),[-.02,.28,0]),Y(t,Ze(.16,.08,.17,.02),K("#8ED8F8"),[-.02,.29,0]);for(const o of[-.13,.13])for(const l of[-.1,.1])Y(t,Pt(.055,.055,.03,10),K("#2B3044"),[o,.07,l],[Math.PI/2,0,0]);break}case"flag":{Y(t,Pt(.012,.012,.4,5),K(r),[0,.2,0]),Y(t,Ze(.24,.14,.015,0),K(i),[.13,.34,0]);break}default:Y(t,Et(.16,1),K(i),[0,.2,0])}return t}function Xc(n=1,e="#59B96B"){const t=new Gt;return Y(t,Pt(.09*n,.13*n,.7*n,7),K("#8A5A3B",{rough:.95}),[0,.35*n,0]),Y(t,Et(.38*n,1),K(e,{rough:.9}),[0,.85*n,0]),Y(t,Et(.3*n,1),K(e,{rough:.9}),[.25*n,.7*n,.06*n]),Y(t,Et(.27*n,1),K(e,{rough:.9}),[-.22*n,.75*n,-.05*n]),t}function $c(n=1){const e=new Gt,t=K("#FFFFFF",{rough:1,flat:!1}),i=[[0,0,0,.55],[.5,.08,.1,.42],[-.5,.02,-.05,.4],[.15,.22,-.1,.36],[-.2,.18,.15,.32]];for(const[s,r,a,o]of i)Y(e,new Fi(o*n,10,8),t,[s*n,r*n,a*n]);return e.traverse(s=>{s.isMesh&&(s.castShadow=!1)}),e}function qc(n="#A56A45"){const e=new Gt;Y(e,Ze(.7,.06,.24,.02),K(n),[0,.2,0]),Y(e,Ze(.7,.2,.05,.01),K(n),[0,.32,-.11]);for(const t of[-.28,.28])Y(e,Ze(.05,.2,.2,.01),K("#6B4226"),[t,.1,0]);return e}function fv(){const n=new Gt;Y(n,Pt(.025,.04,.75,6),K("#4B4F63"),[0,.37,0]),Y(n,Et(.09,1),K("#FFE7A3",{emissive:"#FFC44D",emissiveIntensity:1.6,rough:.4}),[0,.8,0]);const e=new $h("#FFD48A",1.6,3.2,2);return e.position.set(0,.8,0),n.add(e),n}function pv(n="LIFE IS A GAME",e="BUILD A LIFE · BEAT YOUR FRIENDS"){const t=document.createElement("canvas");t.width=1024,t.height=384;const i=t.getContext("2d");i.fillStyle="#F7E7C8",i.fillRect(0,0,1024,384),i.strokeStyle="#A56A45",i.lineWidth=18,i.strokeRect(9,9,1006,366),i.strokeStyle="#D9BE93",i.lineWidth=4,i.strokeRect(32,32,960,320),i.textAlign="center",i.fillStyle="#2B3044",i.font="700 118px Fredoka, sans-serif",i.fillText(n,512,190),i.fillStyle="#8A6B45",i.font="600 40px Nunito, sans-serif",i.fillText(e,512,274);const s=new ea(t);return s.colorSpace=rn,s.anisotropy=4,s}const mv=bi.length,Yc=1.95,Es=1.62,pn=.46,es=.32,Zc=10.9,Nt=Math.PI*2,js=[];for(let n=-4;n<=4;n++)js.push([n,4]);for(let n=3;n>=-4;n--)js.push([4,n]);for(let n=3;n>=-4;n--)js.push([n,-4]);for(let n=-3;n<=3;n++)js.push([-4,n]);const Un=js.map(([n,e])=>new F(n*Yc,0,e*Yc));function Ga(n){return 1-Math.pow(1-n,3)}function Kc(n){return n<.5?4*n*n*n:1-Math.pow(-2*n+2,3)/2}function Jc(n,e,t){const i=e.split(" "),s=[];let r="";for(const a of i){const o=r?`${r} ${a}`:a;n.measureText(o).width>t&&r?(s.push(r),r=a):r=o}return r&&s.push(r),s}function Qc(n,e=null,t=!1){const s=document.createElement("canvas");s.width=512,s.height=512;const r=s.getContext("2d"),a=Ps[n.district];r.clearRect(0,0,512,512),Lr(r,10,10,492,492,64),r.fillStyle="#FFF9ED",r.fill(),r.save(),Lr(r,10,10,492,492,64),r.clip(),r.fillStyle=a.color,r.fillRect(10,10,492,94),r.restore(),r.textBaseline="middle",r.fillStyle="#FFFFFF",r.font="600 27px Fredoka, sans-serif",r.textAlign="left",r.fillText(a.name.toUpperCase(),36,59),r.textAlign="right",r.font="700 38px Fredoka, sans-serif";const o=n.type==="property"?`$${n.price}`:n.type==="choice"||n.type==="emptyNest"?"MILESTONE":n.type==="event"?"LIFE EVENT":n.type==="bonus"?"BONUS":n.type==="start"?"START":"TAKE A BREAK";r.fillText(o,476,59),r.beginPath(),r.arc(256,232,92,0,Nt),r.fillStyle=a.soft,r.fill(),r.strokeStyle="rgba(255,255,255,0.8)",r.lineWidth=6,r.stroke(),au(r,n.icon,256,232,116,a.dark),r.fillStyle="#28304A",r.textAlign="center",r.font="700 52px Fredoka, sans-serif";let l=Jc(r,n.name,430);l.length>2&&(r.font="700 44px Fredoka, sans-serif",l=Jc(r,n.name,440)),l.length===1?r.fillText(l[0],256,392):(r.fillText(l[0],256,364),r.fillText(l[1],256,418)),r.font="600 27px Nunito, sans-serif",r.fillStyle=a.dark;let c="";n.type==="property"?c=`RENT $${n.rent[0]} · UPGRADABLE`:n.type==="start"?c="COLLECT SALARY":n.type==="event"?c="DRAW A CARD":n.type==="choice"?c="CHOOSE YOUR PATH":n.type==="bonus"?c=`+$${n.cash||0} BONUS`:n.type==="rest"?c="REST + HAPPINESS":n.type==="emptyNest"&&(c="A QUIETER HOUSE"),r.fillText(c,256,474),e&&(r.save(),Lr(r,10,10,492,492,64),r.strokeStyle=e,r.lineWidth=14,r.stroke(),t&&(r.strokeStyle="#FFC94A",r.lineWidth=5,Lr(r,24,24,464,464,52),r.stroke()),r.beginPath(),r.arc(452,446,24,0,Nt),r.fillStyle=e,r.fill(),r.strokeStyle="#FFF9ED",r.lineWidth=5,r.stroke(),r.fillStyle="#FFFFFF",r.font="700 26px Fredoka, sans-serif",r.textAlign="center",r.fillText("★",452,448),r.restore());const h=new ea(s);return h.colorSpace=rn,h.anisotropy=8,h.needsUpdate=!0,h}function gv(n){const e=document.createElement("canvas");e.width=256,e.height=256;const t=e.getContext("2d");t.fillStyle="#FFF7E8",t.fillRect(0,0,256,256),t.strokeStyle="#E8D3AF",t.lineWidth=10,t.strokeRect(5,5,246,246);const i={1:[[128,128]],2:[[72,72],[184,184]],3:[[72,72],[128,128],[184,184]],4:[[72,72],[184,72],[72,184],[184,184]],5:[[72,72],[184,72],[128,128],[72,184],[184,184]],6:[[72,64],[184,64],[72,128],[184,128],[72,192],[184,192]]};for(const[r,a]of i[n])t.beginPath(),t.arc(r,a,19,0,Nt),t.fillStyle="#2B3044",t.fill(),t.beginPath(),t.arc(r-5,a-5,5,0,Nt),t.fillStyle="rgba(255,255,255,0.18)",t.fill();const s=new ea(e);return s.colorSpace=rn,s.anisotropy=4,s}function _v(){const e=document.createElement("canvas");e.width=512,e.height=512;const t=e.getContext("2d"),i=512/2,s=512/2,r=["#F08BAD","#5B8DEF","#FFC44D","#59C08A","#A57BE0","#FF7A6B"];t.clearRect(0,0,512,512),t.beginPath(),t.arc(i,s,250,0,Nt),t.fillStyle="#FFF3D8",t.fill(),r.forEach((o,l)=>{const c=l/r.length*Nt-Math.PI/2,h=(l+1)/r.length*Nt-Math.PI/2;t.beginPath(),t.moveTo(i,s),t.arc(i,s,236,c,h),t.closePath(),t.fillStyle=o,t.fill()}),t.beginPath(),t.arc(i,s,118,0,Nt),t.fillStyle="#FFF9ED",t.fill(),t.strokeStyle="#FFC94A",t.lineWidth=18,t.beginPath(),t.arc(i,s,244,0,Nt),t.stroke(),t.beginPath(),t.arc(i,s,128,0,Nt),t.stroke(),t.fillStyle="#8A6B45",t.font="700 34px Fredoka, sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText("DESTINY",i,s+166);const a=new ea(e);return a.colorSpace=rn,a.anisotropy=8,a}async function vv({container:n,onTileTap:e,onHoverTile:t}){try{await Promise.all([document.fonts.load("700 52px Fredoka"),document.fonts.load("600 28px Nunito"),document.fonts.load("700 38px Fredoka")]),await document.fonts.ready}catch{}const i=new Y_({antialias:!0,alpha:!1,powerPreference:"high-performance"});i.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),i.outputColorSpace=rn,i.toneMapping=Ko,i.toneMappingExposure=1.08,i.shadowMap.enabled=!0,i.shadowMap.type=Ls,i.domElement.setAttribute("aria-label","3D game board"),n.appendChild(i.domElement);const s=new Qd;s.fog=new ol("#D8EEFF",46,120);const r=new Ln(40,1,.1,260);r.position.set(0,24,26);const a=new K_(r,i.domElement);a.enableDamping=!0,a.dampingFactor=.075,a.enablePan=!1,a.minDistance=10,a.maxDistance=90,a.minPolarAngle=.32,a.maxPolarAngle=1.3,a.rotateSpeed=.62,a.zoomSpeed=.8,a.autoRotateSpeed=.45,a.target.set(0,.5,0);const o=new F(.55,.4,.72).normalize(),l=new qt(new Fi(150,32,18),new Ti({side:_n,depthWrite:!1,fog:!1,uniforms:{topColor:{value:new ct("#79C3F2")},midColor:{value:new ct("#BFE8FF")},bottomColor:{value:new ct("#FFF0D3")},sunDir:{value:o}},vertexShader:`
        varying vec3 vWorld;
        void main() {
          vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        varying vec3 vWorld;
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 bottomColor;
        uniform vec3 sunDir;
        void main() {
          vec3 dir = normalize(vWorld);
          float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
          vec3 color = mix(bottomColor, midColor, smoothstep(0.35, 0.58, h));
          color = mix(color, topColor, smoothstep(0.58, 0.95, h));
          float sun = pow(max(dot(dir, sunDir), 0.0), 40.0);
          color = mix(color, vec3(1.0, 0.86, 0.62), sun * 0.65);
          gl_FragColor = vec4(color, 1.0);
        }
      `}));l.frustumCulled=!1,s.add(l);const c=new Zf("#FFF4DE","#9BBF92",1.05);s.add(c);const h=new _c("#FFF1D6",2.45);h.position.set(13,19,11),h.castShadow=!0;const d=window.innerWidth<760?1536:2048;h.shadow.mapSize.set(d,d),h.shadow.camera.left=-16,h.shadow.camera.right=16,h.shadow.camera.top=16,h.shadow.camera.bottom=-16,h.shadow.camera.near=1,h.shadow.camera.far=60,h.shadow.bias=-4e-4,h.shadow.normalBias=.025,s.add(h);const u=new _c("#A7CEFF",.55);u.position.set(-12,8,-10),s.add(u);const f=new $h("#FFD277",9,10,2);f.position.set(0,3.2,-1.2),s.add(f);const g=new Gt;s.add(g),Y(g,new $n(20.8,.38,20.8,4,.55),K("#F8E6C6",{rough:.92}),[0,.01,0]),Y(g,new $n(21.5,.52,21.5,4,.62),K("#E98262",{rough:.85}),[0,-.25,0]),Y(g,new $n(20.7,.95,20.7,4,.6),K("#B96B4A",{rough:.95}),[0,-.78,0]);const b=Y(g,new gn(9.6,6.8,9),K("#8B6B5A",{rough:1}),[0,-4.55,0],[Math.PI,.3,0]);b.castShadow=!1;const m=Y(g,new gn(5.4,4.6,7),K("#7A5C4D",{rough:1}),[5.2,-3.3,-4.4],[Math.PI,.9,0]);m.castShadow=!1;const p=Y(g,new gn(4.2,3.8,6),K("#7A5C4D",{rough:1}),[-5.6,-3.1,4.2],[Math.PI,1.4,0]);p.castShadow=!1;for(let W=0;W<12;W++){const oe=W/12*Nt+.3,_e=9.3+Math.sin(W*2.1)*.6,Me=.7+W%4*.35;Y(g,new An(.018,.012,Me,4),K("#4E9B5E",{rough:1}),[Math.cos(oe)*_e,-.95-Me/2,Math.sin(oe)*_e],[Math.sin(oe)*.08,0,Math.cos(oe)*.08])}const v=new Gt;v.position.y=es,s.add(v),Y(v,new $n(12.9,.1,12.9,4,.3),K("#F2D8A7",{rough:.95}),[0,-.06,0]),Y(v,new $n(12.35,.09,12.35,4,.3),K("#8ED081",{rough:.95}),[0,.01,0]);const E=K("#F4DFB6",{rough:.95});Y(v,Ze(1.2,.035,3.1,.14),E,[0,.06,4.55]),Y(v,Ze(3.4,.035,1.1,.14),E,[0,.06,2]),Y(v,new rs(2.1,24),E,[0,.062,.2],[-Math.PI/2,0,0]);const S=new Gt;v.add(S),Y(S,new An(2.1,2.5,.5,24),K("#7BC46F",{rough:1}),[0,.2,-1.2]),Y(S,new An(.32,.48,1.8,9),K("#8A5A3B",{rough:1}),[0,1.25,-1.2]);const R=["#5DBB72","#6ECB7F","#4CA862"];[[0,2.5,-1.2,1.05],[-.7,2.2,-.9,.72],[.75,2.3,-1,.78],[-.25,2.95,-1.35,.7],[.4,2.8,-1.6,.62],[-.55,2.75,-1.6,.56]].forEach(([W,oe,_e,Me],De)=>{Y(S,new na(Me,1),K(R[De%3],{rough:.9}),[W,oe,_e])}),Y(S,new yn(2.35,.06,6,40),K("#FFD166",{rough:.4,metal:.35}),[0,.45,-1.2],[Math.PI/2,0,0]);const _=new Gt;_.position.set(0,2.3,-1.2),S.add(_);for(let W=0;W<6;W++){const oe=W/6*Nt;Y(_,new Fi(.09,10,8),K(W%2?"#FFE08A":"#FFF6D8",{emissive:"#FFD166",emissiveIntensity:1.4,rough:.3}),[Math.cos(oe)*1.8,Math.sin(W*1.7)*.35,Math.sin(oe)*1.8])}const y=new Gt;y.position.set(-4.35,.03,-4.45),y.rotation.y=.38,v.add(y);for(const W of[-1.35,1.35])Y(y,new An(.07,.09,1.75,7),K("#8A5A3B",{rough:1}),[W,.875,0]);const C=new qt(new Ui(3.6,1.35),new Br({map:pv(),roughness:.9}));C.position.set(0,1.72,.055),C.castShadow=!0,y.add(C);const A=new Gt;A.position.set(4.1,.06,-3.5),v.add(A),Y(A,new rs(1.35,26),K("#6EC6E8",{rough:.18,metal:.15}),[0,0,0],[-Math.PI/2,0,0]),Y(A,new yn(1.38,.08,5,26),K("#D9BE93",{rough:1}),[0,.015,0],[Math.PI/2,0,0]);for(let W=0;W<7;W++){const oe=W/7*Nt;Y(A,new Fi(.12,6,4),K("#B8A58B",{rough:1}),[Math.cos(oe)*1.45,.04,Math.sin(oe)*1.45])}for(let W=0;W<3;W++)Y(A,new An(.15,.15,.02,8),K("#59C08A",{rough:.8}),[-.4+W*.35,.02,-.2+W*.25]);Y(A,new ta(.07,.18,3,8),K("#FF9F43",{rough:.5}),[.35,.04,.2],[0,0,Math.PI/2]);const D=qc();D.position.set(-4.6,.06,1.9),D.rotation.y=Math.PI/2,v.add(D);const O=qc();O.position.set(4.6,.06,1.9),O.rotation.y=-Math.PI/2,v.add(O);const X=[[-4.5,.06,-2.7,1],[3.9,.06,2.9,.78],[-3,.06,4.2,.72],[5,.06,4.5,.6],[-5,.06,4.3,.55]];for(const[W,oe,_e,Me]of X){const De=Xc(Me,Me>.9?"#4FAF6A":"#68C078");De.position.set(W,oe,_e),v.add(De)}const L=[[-5.1,.06,5.1],[5.1,.06,5.1],[-5.1,.06,-5.1],[5.1,.06,-5.1]];for(const[W,oe,_e]of L){const Me=fv();Me.position.set(W,oe,_e),v.add(Me)}const $=["#F08BAD","#FFC44D","#5B8DEF","#FFF6E6"];for(let W=0;W<26;W++){const oe=W/26*Nt+.2,_e=5.2+Math.sin(W*3.1)*.5;Y(v,new Fi(.055,5,4),K($[W%$.length],{rough:.7}),[Math.cos(oe)*_e,.1,Math.sin(oe)*_e])}const J=new Gt;J.position.set(0,.06,3.75),v.add(J),Y(J,new An(1.55,1.6,.1,40),K("#F8E6C6",{rough:.85}),[0,0,0]),Y(J,new yn(1.55,.06,8,48),K("#FFC94A",{rough:.35,metal:.4}),[0,.06,0],[Math.PI/2,0,0]);const G=new qt(new rs(1.5,48),new is({map:_v(),transparent:!0}));G.rotation.x=-Math.PI/2,G.position.y=.056,J.add(G);const he=[],Z=new Map,ae=new Map,le=new Map,Ue=new Map,qe=new $n(Es,.26,Es,3,.07),ne=new Ui(Es-.06,Es-.06);bi.forEach((W,oe)=>{const _e=Ps[W.district],Me=new Gt;Me.position.copy(Un[oe]),Me.position.y=.33,Me.userData.tileId=W.id;const De=K(_e.color,{rough:.88}),Ie=new qt(qe,De);Ie.castShadow=!0,Ie.receiveShadow=!0,Me.add(Ie);const Te=Qc(W),Qe=new is({map:Te}),wt=new qt(ne,Qe);wt.rotation.x=-Math.PI/2,wt.position.y=.136,wt.userData.tileId=W.id,Me.add(wt);const Dt=new qt(new yn(Es*.49,.018,4,4),K(_e.dark,{rough:.7}));if(Dt.rotation.x=Math.PI/2,Dt.rotation.z=Math.PI/4,Dt.position.y=.132,Me.add(Dt),g.add(Me),he.push(wt),Z.set(W.id,{group:Me,top:wt,base:Ie,texture:Te,topMat:Qe,district:_e}),W.type!=="property"){const Vt=dv(W,_e.color),x=Un[oe].clone().normalize();Vt.position.copy(Un[oe]).addScaledVector(x,.44),Vt.position.y=pn+.005,Vt.scale.setScalar(.9),Vt.traverse(I=>{I.isMesh&&(I.castShadow=!0)}),g.add(Vt)}});for(const W of bi){if(W.type!=="property")continue;const oe=new Gt,_e=Un[W.id].clone().normalize();oe.position.copy(Un[W.id]).addScaledVector(_e,.46),oe.position.y=pn+.02,oe.rotation.y=Math.atan2(_e.x,_e.z),oe.visible=!1;const Me=new qt(new An(.018,.018,.5,5),K("#FFF6E6",{rough:.6}));Me.position.y=.25,Me.castShadow=!0,oe.add(Me);const De=new qt(new Ui(.28,.18),new is({color:"#FFFFFF",side:Bn}));De.position.set(.14,.42,0),oe.add(De),oe.userData.flag=De,g.add(oe),Ue.set(W.id,oe)}const fe=new qt(new pl(.72,.86,40),new is({color:"#FF7A6B",transparent:!0,opacity:.9,side:Bn}));fe.rotation.x=-Math.PI/2,fe.position.y=pn+.012,fe.visible=!1,g.add(fe);const Ne=[],We=K("#FFFFFF",{rough:1,flat:!1,emissive:"#FFFFFF",emissiveIntensity:.22});for(let W=0;W<16;W++){const oe=$c(1.6+W%5*.8),_e=W/16*Nt+W*.17,Me=24+W%6*3.5;oe.position.set(Math.cos(_e)*Me,4+W%7*1.7,Math.sin(_e)*Me),oe.userData={a:_e,r:Me,y:oe.position.y,speed:.008+W%4*.003,phase:W*.7,layer:1},oe.traverse(De=>{De.isMesh&&(De.material=We)}),s.add(oe),Ne.push(oe)}for(let W=0;W<12;W++){const oe=$c(2.5+W%4*1.2),_e=W/12*Nt+.5,Me=16+W%5*5;oe.position.set(Math.cos(_e)*Me,-7-W%4*1.5,Math.sin(_e)*Me),oe.userData={a:_e,r:Me,y:oe.position.y,speed:.004,phase:W,layer:2},s.add(oe),Ne.push(oe)}const Ce=[];for(const[W,oe,_e,Me]of[[-18,3.5,-15,1.1],[19,1.2,-10,.8],[17,4.5,15,.65]]){const De=new Gt;De.position.set(W,oe,_e),De.scale.setScalar(Me),Y(De,new An(2.4,2.6,.6,8),K("#8ED081",{rough:1}),[0,0,0]),Y(De,new gn(2.4,3.4,8),K("#8B6B5A",{rough:1}),[0,-1.9,0],[Math.PI,0,0]);const Ie=Xc(.9,"#5DBB72");Ie.position.set(.2,.3,0),De.add(Ie),s.add(De),Ce.push(De)}const yt=[3,4,1,6,2,5].map(W=>new Br({map:gv(W),roughness:.55,metalness:0})),U=new qt(new $n(.62,.62,.62,4,.09),yt),k=new F(0,es+.42,3.75);U.position.copy(k),U.castShadow=!0,U.receiveShadow=!0,s.add(U);const j=new qt(new rs(.34,20),new is({color:"#4B3B2A",transparent:!0,opacity:.18,depthWrite:!1}));j.rotation.x=-Math.PI/2,j.position.set(0,es+.115,3.75),s.add(j);const B=new Map;let te="";const ce={1:[[0,0]],2:[[-.3,-.02],[.3,-.02]],3:[[-.32,-.2],[.32,-.2],[0,.28]],4:[[-.32,-.22],[.32,-.22],[-.32,.22],[.32,.22]]},pe=[[-5,2.8],[-5,3.55],[5,2.8],[5,3.55]];let de=1;function Ge(W){const oe=ce[de]||ce[4];return oe[W]||oe[0]}function Oe(W){return Un[W].clone()}function it(W,oe){const _e=B.get(W);if(!_e)return;if(oe.retired||oe.bankrupt){if(oe.bankrupt){_e.visible=!1;return}const[Te,Qe]=pe[W]||pe[0];_e.position.set(Te,es+.02,Qe),_e.rotation.y=Math.atan2(-Te,-Qe),_e.visible=!0;return}_e.visible=!0;const[Me,De]=Ge(W),Ie=Oe(oe.position);_e.position.set(Ie.x+Me,pn+.02,Ie.z+De)}const rt=new jf,lt=new ve;let N=null,Rt=!1,et=null;function St(W,oe){const _e=i.domElement.getBoundingClientRect();lt.x=(W-_e.left)/_e.width*2-1,lt.y=-((oe-_e.top)/_e.height)*2+1,rt.setFromCamera(lt,r);const Me=rt.intersectObjects(he,!1);return Me.length?Me[0].object.userData.tileId:null}function Ae(W){N={x:W.clientX,y:W.clientY,t:performance.now()}}function Lt(W){if(!N||!Rt)return;const oe=Math.hypot(W.clientX-N.x,W.clientY-N.y),_e=performance.now()-N.t;if(N=null,oe>9||_e>700)return;const Me=St(W.clientX,W.clientY);Me!==null&&e&&e(Me)}let $e=0;function Ke(W){!Rt||window.matchMedia("(pointer: coarse)").matches||$e||($e=requestAnimationFrame(()=>{$e=0;const oe=St(W.clientX,W.clientY);oe!==et&&(et=oe,i.domElement.style.cursor=oe===null?"grab":"pointer",t&&t(oe))}))}i.domElement.addEventListener("pointerdown",Ae),i.domElement.addEventListener("pointerup",Lt),i.domElement.addEventListener("pointermove",Ke);const w=[];function M(W,oe,_e=Ga){return new Promise(Me=>{w.push({start:performance.now(),duration:W*1e3,update:oe,resolve:Me,ease:_e})})}const H=new An(.06,.06,.025,8),ue=new Map,re=[];function Ee(W){return ue.has(W)||ue.set(W,new Br({color:W,roughness:.35,metalness:.3,emissive:W,emissiveIntensity:.2})),ue.get(W)}function Se(W,oe="#FFC94A",_e=10,Me=2.4){for(let De=0;De<_e;De++){const Ie=new qt(H,Ee(oe));Ie.position.copy(W),Ie.position.y+=.4,Ie.rotation.set(Math.random()*Nt,Math.random()*Nt,Math.random()*Nt),s.add(Ie);const Te=Math.random()*Nt,Qe=Me*(.4+Math.random()*.7);re.push({mesh:Ie,vx:Math.cos(Te)*Qe*.5,vz:Math.sin(Te)*Qe*.5,vy:2.2+Math.random()*Me,life:0,maxLife:.9+Math.random()*.5})}}let Q=30,se=new F(0,.5,0),ge=null,P=!1,ie=!1,ee=0,ye=0;function xe(W){const oe=ie?50:40;r.fov=oe;const _e=Math.tan(Xn.degToRad(oe/2)),Me=_e*W,De=ie?.68:.86,Ie=Math.sin(De),Te=Math.cos(De),Qe=Zc+.55,wt=Zc+.4,Dt=ie?.99:.94,Vt=wt*Ie+Qe/(Dt*Me),x=wt*Ie+wt*Te/(Dt*_e);return Math.max(Vt,x)*1.015}function be(W=!1){const oe=n.clientWidth||window.innerWidth,_e=n.clientHeight||window.innerHeight;if(!(!W&&oe===ee&&_e===ye)){ee=oe,ye=_e,ie=oe/_e<.92,i.setSize(oe,_e,!1),i.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),r.aspect=oe/_e,Q=xe(oe/_e);for(const Me of Ne){const De=Me.userData.layer===2;Me.visible=!ie||!De,Me.scale.setScalar(ie?De?.5:.62:1)}r.updateProjectionMatrix(),W?ge={from:r.position.distanceTo(a.target),to:Q,start:performance.now(),duration:500}:ge={from:r.position.distanceTo(a.target),to:Q,start:performance.now(),duration:0},a.maxDistance=Q*1.7,a.minDistance=Q*.42}}be(!0),r.position.set(0,Q*Math.cos(.86),Q*Math.sin(.86));const He=new ResizeObserver(()=>be());He.observe(n);function tt(W,oe=800){ge={from:r.position.distanceTo(a.target),to:W,start:performance.now(),duration:oe}}function me(W,oe){const _e=oe.players[W];if(_e){if(_e.retired||_e.bankrupt){se.set(0,.5,0),tt(Q,900);return}se.set(0,-2.8,0),tt(Q*(ie?1:.98),900)}}function Ye(W=!0){se.set(0,.5,0),tt(Q,W?800:0)}async function st(W){const _e={1:new sn,2:new sn().setFromEuler(new bn(-Math.PI/2,0,0)),3:new sn().setFromEuler(new bn(0,0,Math.PI/2)),4:new sn().setFromEuler(new bn(0,0,-Math.PI/2)),5:new sn().setFromEuler(new bn(Math.PI/2,0,0)),6:new sn().setFromEuler(new bn(Math.PI,0,0))}[W].clone();_e.multiply(new sn().setFromAxisAngle(new F(0,1,0),Math.random()*Nt));const Me=new sn().setFromEuler(new bn(Math.random()*Nt,Math.random()*Nt,Math.random()*Nt)),De=U.position.clone(),Ie=new F(Math.random()-.5,Math.random()*2-1,Math.random()-.5).normalize();await M(.9,Te=>{const Qe=Ga(Te);U.position.x=Xn.lerp(De.x,k.x,Qe),U.position.z=Xn.lerp(De.z,k.z,Qe),U.position.y=k.y+Math.sin(Te*Math.PI)*2.1+(1-Te)*.2;const wt=Me.clone().slerp(_e,Qe),Dt=new sn().setFromAxisAngle(Ie,(1-Te)*Math.PI*5);U.quaternion.copy(Dt).multiply(wt),U.scale.setScalar(1+Math.sin(Te*Math.PI)*.06)}),U.position.copy(k),U.quaternion.copy(_e),U.scale.setScalar(1),await M(.18,Te=>{const Qe=Math.sin(Te*Math.PI)*.12;U.position.y=k.y+Qe,U.scale.set(1+Qe*.6,1-Qe*1.2,1+Qe*.6)}),U.scale.setScalar(1),U.position.copy(k)}async function Pe(W,oe,_e){const Me=B.get(W);if(!Me)return;const[De,Ie]=Ge(W);let Te=Me.position.clone();for(const wt of oe){const Dt=Oe(wt),Vt=new F(Dt.x+De,pn+.02,Dt.z+Ie),x=Te.clone(),I=Vt.clone().sub(x),q=Math.atan2(I.x,I.z);await M(.24,z=>{const V=Kc(z);Me.position.x=Xn.lerp(x.x,Vt.x,V),Me.position.z=Xn.lerp(x.z,Vt.z,V),Me.position.y=pn+.02+Math.sin(z*Math.PI)*.34,Me.rotation.y=q;const we=1+Math.sin(z*Math.PI)*.08;Me.scale.set(1/we,we,1/we)}),Me.position.copy(Vt),Me.scale.set(1,1,1),await M(.08,z=>{Me.position.y=pn+.02+Math.sin(z*Math.PI)*.04}),Te=Vt,wt===0&&Se(new F(Vt.x,pn,Vt.z),"#FFC94A",8,1.8)}await M(.25,wt=>{Me.rotation.y=Xn.lerp(Me.rotation.y,0,wt)}),Me.rotation.y=0,Me.position.y=pn+.02;const Qe=_e.players[W];Qe?.retired&&it(W,Qe)}async function vt(W,oe){const _e=B.get(W);if(!_e)return;const[Me,De]=pe[W]||pe[0],Ie=_e.position.clone(),Te=new F(Me,es+.02,De),Qe=Math.atan2(-Me,-De);await M(1.1,wt=>{const Dt=Kc(wt);_e.position.lerpVectors(Ie,Te,Dt),_e.position.y+=Math.sin(wt*Math.PI)*.5,_e.rotation.y=Xn.lerp(0,Qe,Dt)}),_e.position.copy(Te),_e.rotation.y=Qe,Se(Te,"#FFD166",12,2)}function Ht(W,{instant:oe=!1}={}){de=W.players.length;const _e=W.players.map(De=>`${De.color}:${De.colorDark}`).join("|");if(B.size!==W.players.length||_e!==te){te=_e;for(const De of B.values())g.remove(De);B.clear(),W.players.forEach((De,Ie)=>{const Te=uv({color:De.color,dark:De.colorDark||"#333333"},Ie);g.add(Te),B.set(Ie,Te),it(Ie,De)})}W.players.forEach((De,Ie)=>{const Te=B.get(Ie);Te&&(oe&&it(Ie,De),De.bankrupt?Te.visible=!1:Te.visible=!0)});for(const De of bi){if(De.type!=="property")continue;const Ie=W.owners[De.id],Te=Ie?W.players[Ie.owner]:null,Qe=Ie?(zr[De.district]||[]).every(q=>W.owners[q]?.owner===Ie.owner):!1,wt=`${Ie?.owner??"none"}:${Ie?.level??0}:${Qe}`;if(ae.get(De.id)===wt)continue;ae.set(De.id,wt);const Dt=Z.get(De.id),Vt=Dt.texture;Dt.texture=Qc(De,Te?Te.color:null,Qe),Dt.topMat.map=Dt.texture,Dt.topMat.needsUpdate=!0,Vt.dispose();const x=le.get(De.id);if(x&&(g.remove(x),le.delete(De.id)),Ie&&Te){const q=ou(Ie.level,Te.color,Te.colorDark||"#333333"),z=Un[De.id].clone().normalize();q.position.copy(Un[De.id]).addScaledVector(z,.44),q.position.y=pn+.005,q.rotation.y=Math.atan2(-z.x,-z.z),q.scale.setScalar(Ie.level===3?.92:1),g.add(q),le.set(De.id,q)}const I=Ue.get(De.id);I&&(I.visible=!!Ie,Ie&&Te&&I.userData.flag.material.color.set(Te.color))}const Me=W.players[W.current];if(Me&&!Me.retired&&!Me.bankrupt&&W.phase!=="ended"){const De=Oe(Me.position);fe.position.set(De.x,pn+.012,De.z),fe.material.color.set(Me.color),fe.visible=!0}else fe.visible=!1;oe&&se.set(0,.5,0)}function Gn(W,oe){const _e=oe.players[W];if(!_e)return;const Me=Oe(_e.position);fe.position.set(Me.x,pn+.012,Me.z),fe.material.color.set(_e.color),fe.visible=!_e.retired&&!_e.bankrupt}function er(W){Rt=W,i.domElement.style.cursor=W?"grab":"default"}function _s(W){P=W,a.autoRotate=W}function ra(W){const oe=Un[W].clone();return oe.y=pn+.4,oe.project(r),{x:(oe.x*.5+.5)*ee,y:(-oe.y*.5+.5)*ye,visible:oe.z<1}}function tr(W,oe="#FFC94A",_e=10,Me=2.4){Se(Un[W].clone().setY(pn),oe,_e,Me)}function nr(){for(let W=0;W<8;W++){const oe=Math.floor(Math.random()*mv);Se(Un[oe].clone().setY(pn),["#FFC94A","#F08BAD","#5B8DEF","#59C08A"][W%4],8,3)}}let Hn=performance.now(),Mn=0;function ir(W){const oe=Math.min(.05,(W-Hn)/1e3);Hn=W,Mn+=oe;for(let Ie=w.length-1;Ie>=0;Ie--){const Te=w[Ie],Qe=Math.min(1,(W-Te.start)/Math.max(1,Te.duration));Te.update(Te.ease(Qe),Qe),Qe>=1&&(w.splice(Ie,1),Te.resolve())}for(const[Ie,Te]of B){if(!Te.visible)continue;const Qe=Te.userData.visual;Qe.position.y=Math.sin(Mn*1.8+Te.userData.phase)*.018,Qe.rotation.z=Math.sin(Mn*1.2+Te.userData.phase)*.015}_.rotation.y=Mn*.35,_.children.forEach((Ie,Te)=>{Ie.position.y=Math.sin(Mn*1.1+Te*1.7)*.35});for(const Ie of Ne){const Te=Ie.userData,Qe=Te.a+Mn*Te.speed;Ie.position.x=Math.cos(Qe)*Te.r,Ie.position.z=Math.sin(Qe)*Te.r,Ie.position.y=Te.y+Math.sin(Mn*.25+Te.phase)*.35}if(Ce.forEach((Ie,Te)=>{Ie.position.y+=Math.sin(Mn*.5+Te*2)*.0015,Ie.rotation.y+=oe*.01*(Te%2?1:-1)}),fe.visible){const Ie=1+Math.sin(Mn*3.2)*.05;fe.scale.setScalar(Ie),fe.material.opacity=.65+Math.sin(Mn*3.2)*.2}for(let Ie=re.length-1;Ie>=0;Ie--){const Te=re[Ie];Te.life+=oe,Te.vy-=9.5*oe,Te.mesh.position.x+=Te.vx*oe,Te.mesh.position.y+=Te.vy*oe,Te.mesh.position.z+=Te.vz*oe,Te.mesh.rotation.x+=oe*8,Te.mesh.rotation.y+=oe*6;const Qe=Te.life/Te.maxLife;Te.mesh.scale.setScalar(Math.max(.001,1-Qe*Qe)),Te.life>=Te.maxLife&&(s.remove(Te.mesh),re.splice(Ie,1))}const _e=a.target.clone();a.target.lerp(se,1-Math.exp(-4.2*oe));const Me=a.target.clone().sub(_e);if(r.position.add(Me),ge){const Ie=Math.min(1,(W-ge.start)/Math.max(1,ge.duration)),Te=r.position.distanceTo(a.target),Qe=Xn.lerp(ge.from,ge.to,Ga(Ie));if(Math.abs(Qe-Te)>.001){const wt=r.position.clone().sub(a.target).normalize(),Dt=Ie>=1?Qe:Xn.lerp(Te,Qe,.25);r.position.copy(a.target).addScaledVector(wt,Dt)}Ie>=1&&(ge=null)}j.position.set(U.position.x,es+.115,U.position.z);const De=Math.max(0,U.position.y-k.y);j.scale.setScalar(Math.max(.45,1-De*.14)),j.material.opacity=Math.max(.06,.2-De*.025),a.autoRotate=P,a.update(),i.render(s,r)}i.setAnimationLoop(ir),i.domElement.addEventListener("webglcontextlost",W=>{W.preventDefault(),console.warn("WebGL context lost")});function sr(){i.setAnimationLoop(null),He.disconnect(),i.domElement.removeEventListener("pointerdown",Ae),i.domElement.removeEventListener("pointerup",Lt),i.domElement.removeEventListener("pointermove",Ke),a.dispose(),i.dispose(),i.domElement.remove()}return{renderer:i,scene:s,camera:r,updateState:Ht,setActiveRing:Gn,focusPlayer:me,resetView:Ye,movePawn:Pe,rollDice:st,retirePawn:vt,burstAt:Se,burstTile:tr,projectTile:ra,setInteractive:er,setAutoRotate:_s,celebrate:nr,dispose:sr,getBaseRadius:()=>Q}}const $t=(n,e=document)=>e.querySelector(n),ts=(n,e=document)=>[...e.querySelectorAll(n)],Mv=Object.fromEntries(Jr.map(n=>[n.id,n])),Ha=new Map;function Va(n,e,t=96){const i=`${n}|${e}|${t}`;return Ha.has(i)||Ha.set(i,hv(n,e,t)),Ha.get(i)}const xv='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>',Sv='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="m16 9 5 5m0-5-5 5"/></svg>',yv='<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="5" y="5" width="54" height="54" rx="14" fill="#FFF7E8" stroke="#D9BE93" stroke-width="3"/><circle cx="21" cy="21" r="4.5" fill="#2B3044"/><circle cx="43" cy="21" r="4.5" fill="#2B3044"/><circle cx="32" cy="32" r="4.5" fill="#2B3044"/><circle cx="21" cy="43" r="4.5" fill="#2B3044"/><circle cx="43" cy="43" r="4.5" fill="#2B3044"/></svg>',bv='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',Ev='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/><circle cx="12" cy="12" r="2.5"/></svg>',jc={mode:"solo",count:3,laps:3,sound:!0};function Tv(){try{return{...jc,...JSON.parse(localStorage.getItem("liag.settings")||"{}")}}catch{return{...jc}}}function Dr(n){try{localStorage.setItem("liag.settings",JSON.stringify(n))}catch{}}function Ot(n){return`$${Math.round(n).toLocaleString("en-US")}`}function gt(n){return String(n).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function Wa(n){return(n||"?").trim().charAt(0).toUpperCase()}function wv({mode:n,count:e}){return n==="pass"?[{name:"Player 1",isAI:!1},{name:"Player 2",isAI:!1}]:[{name:"You",isAI:!1},...["Maya","Leo","Iris"].slice(0,Math.max(1,e-1)).map(i=>({name:i,isAI:!0}))]}function Av(){const n=$t("#ui"),e=Tv(),t={};let i=e.sound!==!1,s=null,r=!1,a="",o="",l=null,c=!1,h="",d="";n.innerHTML=`
    <div id="splash">
      <div class="splash-inner">
        <div class="splash-logo">L</div>
        <h1>Life is a Game</h1>
        <p>Build a life · beat your friends</p>
        <div class="splash-bar"><i></i></div>
      </div>
    </div>

    <div id="start-screen" class="hidden">
      <div class="start-top">
        <div class="brand-lockup">
          <div class="brand-mark">L</div>
          <div class="brand-text">
            <strong>LIFE IS A GAME</strong>
            <span>A 3D board game about being alive</span>
          </div>
        </div>
        <button class="sound-toggle" data-action="sound" aria-label="Toggle sound">
          <span class="dot"></span><span class="sound-label">Sound on</span>
        </button>
      </div>

      <div class="start-main">
        <section class="hero">
          <div class="hero-kicker">Buy a home · find love · retire happy</div>
          <h1>
            <span class="line">LIFE</span>
            <span class="line outline">IS A</span>
            <span class="line accent">GAME.</span>
          </h1>
          <p>Roll the die, travel through childhood, career, family and adventure, and build a life worth more than money.</p>
          <div class="hero-badges">
            <span>3D board</span>
            <span>2–4 players</span>
            <span>10–15 min</span>
            <span>No ads</span>
          </div>
        </section>

        <section class="setup-card" aria-label="Game setup">
          <h2>Start a new life</h2>
          <p class="sub">A little Monopoly, a little Game of Life, and a lot of choices.</p>

          <div class="field">
            <div class="field-label"><span>Play mode</span></div>
            <div class="segmented" id="mode-seg">
              <button data-mode="solo">Solo vs CPU</button>
              <button data-mode="pass">Pass &amp; play</button>
            </div>
          </div>

          <div class="field" id="count-field">
            <div class="field-label"><span>Players</span><span id="count-note">You + 2 friends</span></div>
            <div class="segmented" id="count-seg">
              <button data-count="2">2</button>
              <button data-count="3">3</button>
              <button data-count="4">4</button>
            </div>
          </div>

          <div class="field">
            <div class="field-label"><span>Life length</span></div>
            <div class="segmented" id="laps-seg">
              <button data-laps="2">Quick · 2 ch.</button>
              <button data-laps="3">Classic · 3 ch.</button>
            </div>
          </div>

          <div class="setup-actions">
            <button class="btn" data-action="start">Begin your life</button>
            <button class="btn continue-btn hidden" data-action="continue">Continue your life</button>
            <button class="btn secondary" data-action="how">How to play</button>
          </div>
        </section>
      </div>

      <div class="start-footer">
        <span>Made with care · works offline · no ads · no tracking</span>
        <span>v1.0</span>
      </div>
    </div>

    <div id="hud" class="hidden">
      <div class="hud-top">
        <div class="hud-brand">
          <div class="brand-mark">L</div>
          <div class="brand-text">
            <strong>LIFE IS A GAME</strong>
            <span>Build a life</span>
          </div>
        </div>
        <div class="chapter-pill" id="chapter-pill"></div>
        <div class="hud-actions">
          <button class="icon-btn" data-action="sound" aria-label="Toggle sound"></button>
          <button class="icon-btn" data-action="center" aria-label="Center board">${Ev}</button>
          <button class="icon-btn" data-action="menu" aria-label="Menu">${bv}</button>
        </div>
      </div>

      <div class="mobile-players" id="mobile-players"></div>

      <div class="players-panel" id="players-panel"></div>

      <div class="hud-main">
        <div class="center-column">
          <div class="turn-banner" id="turn-banner"></div>
          <div class="log-panel" id="log-panel"></div>
        </div>
        <div class="side-panel" id="side-panel"></div>
      </div>

      <div class="hud-bottom">
        <div class="dock" id="dock">
          <div class="die-preview">${yv}</div>
          <button class="btn roll-btn" data-action="roll">ROLL THE DIE</button>
          <button class="btn end-btn hidden" data-action="end">END TURN</button>
          <div class="hint" id="dock-hint"></div>
        </div>
      </div>
    </div>

    <div id="toasts" aria-live="polite"></div>
    <div id="floaters"></div>
    <div id="modal-root"></div>
    <div id="confetti"></div>
  `;const u=$t("#start-screen"),f=$t("#hud"),g=$t("#modal-root"),b=$t("#toasts"),m=$t("#floaters"),p=$t("#confetti");function v(){ts("#mode-seg button").forEach(k=>k.classList.toggle("active",k.dataset.mode===e.mode)),ts("#count-seg button").forEach(k=>k.classList.toggle("active",Number(k.dataset.count)===e.count)),ts("#laps-seg button").forEach(k=>k.classList.toggle("active",Number(k.dataset.laps)===e.laps)),$t("#count-field").classList.toggle("hidden",e.mode==="pass");const U=Math.max(1,e.count-1);$t("#count-note").textContent=e.mode==="pass"?"Two humans, one device":`You + ${U} ${U===1?"friend":"friends"}`}function E(U){i=U,e.sound=U,Dr(e),ts(".sound-toggle").forEach(k=>{k.classList.toggle("off",!U),k.innerHTML=`<span class="dot"></span><span class="sound-label">Sound ${U?"on":"off"}</span>`}),ts('.hud-actions .icon-btn[data-action="sound"]').forEach(k=>{k.innerHTML=U?xv:Sv})}function S(U){ts('[data-action="continue"]').forEach(k=>k.classList.toggle("hidden",!U))}function R({continueAvailable:U=!1}={}){G(!0),f.classList.add("hidden"),u.classList.remove("hidden"),S(U),v(),E(i),h="",d=""}function T(){u.classList.add("hidden"),f.classList.remove("hidden")}function _(U){return U.bankrupt?"OUT":U.retired?"RETIRED":U.isAI?"CPU":s?.players.filter(k=>!k.isAI).length>1?`P${U.id+1}`:"YOU"}function y(U){const k=Gr[U.goal];if(!k)return"";const j=Nl(s,U);return`<div class="player-goal ${j.met?"met":""}" title="${gt(k.desc)}"><b>${gt(k.name)}</b> · ${gt(j.text)}</div>`}function C(){const U=$t("#players-panel");U.innerHTML=s.players.map(j=>{const B=j.id===s.current&&s.phase!=="ended",te=_(j);return`
          <div class="player-card ${B?"active":""} ${j.retired||j.bankrupt?"retired":""}" style="--player-color:${j.color}">
            <div class="player-avatar">${Wa(j.name)}</div>
            <div>
              <div class="p-name">${gt(j.name)} <span class="tag">${te}</span></div>
              <div class="player-stats">
                <span class="cash">${Ot(j.cash)}</span>
                <span class="joy"><span class="joy-bar"><i style="width:${j.happiness}%"></i></span>${j.happiness}</span>
              </div>
              ${y(j)}
            </div>
          </div>
        `}).join("");const k=$t("#mobile-players");k.innerHTML=s.players.map(j=>`
          <div class="m-player ${j.id===s.current&&s.phase!=="ended"?"active":""} ${j.retired||j.bankrupt?"retired":""}" style="--player-color:${j.color}">
            <div class="m-avatar">${Wa(j.name)}</div>
            <div class="m-info">
              <span class="m-name">${gt(j.name)}</span>
              <span class="m-cash">${Ot(j.cash)}</span>
            </div>
          </div>
        `).join("")}function A(){const U=s.players[s.current],k=Math.min(U.laps+1,s.laps),j=Array.from({length:s.laps},(B,te)=>`<span class="chapter-dot ${te<U.laps?"done":""}"></span>`).join("");$t("#chapter-pill").innerHTML=`<span>Chapter ${k} / ${s.laps}</span><span class="chapter-dots">${j}</span>`}function D(){const U=s.players[s.current];if(!U)return;const k=`${s.turn}:${s.current}`;if(k===h)return;h=k;const j=$t("#turn-banner"),B=!U.isAI;j.style.setProperty("--player-color",U.color),j.innerHTML=`<span class="dot"></span><span>${B?s.players.filter(te=>!te.isAI).length>1?`${gt(U.name)}'s turn`:"Your turn":`${gt(U.name)}'s turn`}</span>`,j.classList.remove("enter"),j.offsetWidth,j.classList.add("enter")}function O(){const U=s.log.slice(-4),k=U.map(j=>j.id).join(",");k!==d&&(d=k,$t("#log-panel").innerHTML=U.map(j=>`<div class="log-entry ${j.kind}"><span class="log-dot"></span><span>${gt(j.text)}</span></div>`).join(""))}function X(){const U=s.players[s.current];if(!U)return;const k=Gr[U.goal],j=Nl(s,U),B=U.cash>900?"Landing on your own property lets you upgrade it. Higher levels mean much bigger rent.":"Complete a whole colour group to double the rent on every property in it.";$t("#side-panel").innerHTML=`
      <div class="side-note">
        <strong>${U.isAI?`${gt(U.name)}'s life goal`:"Your life goal"}</strong>
        ${k?`${gt(k.name)} — ${gt(k.desc)}`:""}
        <div style="margin-top:6px;color:${j.met?"#1f7a5c":"#8a7a63"};font-weight:800">${gt(j.text)}</div>
      </div>
      <div class="side-note"><strong>Little tip</strong>${gt(B)}</div>
    `}function L(){const U=s.players[s.current],k=$t(".roll-btn"),j=$t(".end-btn"),B=$t("#dock-hint"),te=$t("#dock");if(!U||s.phase==="ended"){k.classList.add("hidden"),j.classList.add("hidden"),B.textContent="";return}const ce=!U.isAI,pe=!ce;if(r){k.classList.remove("hidden"),j.classList.add("hidden"),k.disabled=!0,k.innerHTML=`<span class="thinking">${gt(a||"One moment")}<i></i><i></i><i></i></span>`,B.textContent="",te.classList.add("busy");return}if(te.classList.remove("busy"),s.phase==="roll"){pe?(k.classList.remove("hidden"),j.classList.add("hidden"),k.disabled=!0,k.innerHTML=`<span class="thinking">${gt(U.name)} is thinking<i></i><i></i><i></i></span>`,B.textContent="Watch the board."):(k.classList.remove("hidden"),j.classList.add("hidden"),k.disabled=!1,k.innerHTML="ROLL THE DIE",B.textContent="Tap the board to inspect a tile.");return}if(s.phase==="action"){k.classList.remove("hidden"),j.classList.add("hidden"),k.disabled=!0,k.innerHTML="MAKE A CHOICE",B.textContent="";return}if(s.phase==="end"){k.classList.add("hidden"),j.classList.remove("hidden"),j.disabled=!ce,B.textContent=ce?"That is your move. Ready for the next chapter?":"";return}k.classList.remove("hidden"),j.classList.add("hidden"),k.disabled=!0,k.innerHTML="ROLLING…",B.textContent=""}function $(U,k={}){s=U,s&&(typeof k.busy=="boolean"&&(r=k.busy),k.busyLabel!==void 0&&(a=k.busyLabel),C(),A(),D(),O(),X(),L())}function J(U,k=""){r=U,a=k,s&&L()}function G(U=!1){if(!l)return;const{wrap:k,backdrop:j}=l;if(l=null,U){k.remove(),j.remove();return}k.classList.remove("show"),j.classList.remove("show"),setTimeout(()=>{k.remove(),j.remove()},220)}function he(U,{kind:k="generic",wide:j=!1,closable:B=!0,onClose:te=null}={}){G(!0);const ce=document.createElement("div");ce.className="modal-backdrop";const pe=document.createElement("div");if(pe.className=`modal ${j?"wide":""}`,pe.setAttribute("role","dialog"),pe.setAttribute("aria-modal","true"),pe.innerHTML=U,B){const Ge=document.createElement("button");Ge.className="modal-close",Ge.setAttribute("data-close",""),Ge.setAttribute("aria-label","Close"),Ge.innerHTML="✕",pe.appendChild(Ge)}return g.append(ce,pe),requestAnimationFrame(()=>{ce.classList.add("show"),pe.classList.add("show")}),l={wrap:pe,backdrop:ce,kind:k,onClose:te},pe.addEventListener("click",Ge=>{Ge.target.closest("[data-close]")&&(G(),te?.())}),ce.addEventListener("click",()=>{B&&(G(),te?.())}),pe}function Z(U,k,j,B){const te=Ps[U.district],ce=k?s.players[k.owner]:null,pe=U.rent,de=B==="upgrade"&&k?Math.round(U.price*[.5,.8][k.level-1]/10)*10:0,Ge=B==="buy"?j.cash>=U.price:j.cash>=de,Oe=Ot(B==="buy"?U.price:de),it=B==="buy"?"For sale":`Level ${k?.level||1} → ${Math.min(3,(k?.level||1)+1)}`,rt=pe.map((Rt,et)=>`<div class="deed-row"><span>Level ${et+1} rent</span><b class="${et+1===(k?.level||0)?"rent":""}">${Ot(Rt)}</b></div>`).join(""),lt=B==="buy"?`Own all ${Ps[U.district].name} properties to double every rent in the group.`:`Upgrading raises the rent from ${Ot(pe[(k?.level||1)-1])} to ${Ot(pe[Math.min(2,k?.level||1)])}.`,N=B==="buy"?`<button class="btn" data-action="buy" ${Ge?"":"disabled"}>Buy for ${Ot(U.price)}</button>
           <button class="btn secondary" data-action="pass">Pass</button>`:`<button class="btn" data-action="upgrade" ${Ge?"":"disabled"}>Upgrade for ${Ot(de)}</button>
           <button class="btn secondary" data-action="skipUpgrade">Not now</button>`;return`
      <div class="deed">
        <div class="deed-head" style="background:linear-gradient(135deg, ${te.color}, ${te.dark})">
          <div class="kicker">${te.name} · ${B==="buy"?"Property":"Your property"}</div>
          <h2>${gt(U.name)}</h2>
          <div class="price">${Oe}</div>
        </div>
        <div class="deed-body">
          <span class="deed-badge ${ce?"owned":""}">${it}</span>
          ${rt}
          <div class="deed-row"><span>Full group bonus</span><b>×2 rent</b></div>
          <div class="deed-note">${gt(lt)}<br><strong>You have ${Ot(j.cash)}.</strong></div>
          <div class="modal-actions">${N}</div>
        </div>
      </div>
    `}function ae(U){const k=[];return U.cash&&k.push(`<span class="effect-pill ${U.cash>0?"good":"bad"}">${U.cash>0?"+":"−"}${Ot(Math.abs(U.cash))}</span>`),U.salary&&k.push(`<span class="effect-pill ${U.salary>0?"good":"bad"}">${U.salary>0?"+":"−"}${Ot(Math.abs(U.salary))} salary</span>`),U.happiness&&k.push(`<span class="effect-pill ${U.happiness>0?"joy":"bad"}">${U.happiness>0?"+":"−"}${Math.abs(U.happiness)} happiness</span>`),`
      <div class="event-card">
        <div class="event-icon"><img src="${Va(U.icon,"#8A5A00",128)}" alt="" /></div>
        <div class="kicker">Life happens</div>
        <h2>${gt(U.title)}</h2>
        <p class="event-text">${gt(U.text)}</p>
        <div class="effect-pills">${k.join("")}</div>
        <div class="modal-actions"><button class="btn" data-action="ack">Continue</button></div>
      </div>
    `}function le(U,k){const j=U.options.map(B=>{const te=!B.cost||k.cash>=B.cost,ce=U.options.indexOf(B)+1;return`
          <button class="choice-option ${te?"":"cant-afford"}" data-option="${B.id}" ${te?"":"disabled"}>
            <span class="opt-icon">${ce}</span>
            <span class="opt-main">
              <span class="opt-label">${gt(B.label)}</span>
              <span class="opt-detail">${gt(B.detail)}${te?"":" · not enough cash"}</span>
            </span>
            <span class="opt-arrow">›</span>
          </button>
        `}).join("");return`
      <div class="choice-card">
        <div class="choice-head">
          <div class="choice-icon"><img src="${Va(U.icon,"#8A5A00",96)}" alt="" /></div>
          <div>
            <div class="kicker" style="font-size:9px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#b0821d">Milestone</div>
            <h2>${gt(U.title)}</h2>
          </div>
        </div>
        <p class="modal-sub">${gt(U.prompt)}</p>
        <div class="choice-options">${j}</div>
        <div class="deed-note" style="margin-top:14px">You have ${Ot(k.cash)} in cash. Every path has a trade-off.</div>
      </div>
    `}function Ue(U){if(s=U,!s||!s.pending){o="",l&&["buy","upgrade","card","choice"].includes(l.kind)&&G(!0);return}const k=s.players[s.pending.playerId];if(!k||k.isAI)return;const j=`${s.pending.type}:${s.pending.tileId||""}:${s.pending.cardId||""}:${s.pending.choiceId||""}:${s.turn}`;if(!(j===o&&l)){if(s.pending.type==="buy"){const B=Yt[s.pending.tileId];he(Z(B,null,k,"buy"),{kind:"buy",closable:!1})}else if(s.pending.type==="upgrade"){const B=Yt[s.pending.tileId];he(Z(B,s.owners[B.id],k,"upgrade"),{kind:"upgrade",closable:!1})}else if(s.pending.type==="card"){const B=s.pending.cardId,te=Mv[B];te&&he(ae(te),{kind:"card",closable:!1})}else if(s.pending.type==="choice"){const B=Qr(s,s.pending.choiceId,k);he(le(B,k),{kind:"choice",closable:!1})}o=j}}function qe(U){s=U;const k=s.results||[],j=k[0],B=s.players[j?.playerId],te=B?ih(s,B):null,ce=k.map((de,Ge)=>{const Oe=s.players[de.playerId];return`
          <div class="rank-row ${Ge===0?"winner":""}" style="--player-color:${Oe.color}">
            <div class="rank">${Ge+1}</div>
            <div class="avatar">${Wa(Oe.name)}</div>
            <div>
              <div class="r-name">${gt(Oe.name)}</div>
              <div class="r-detail">${Ot(de.cash)} cash · ${Ot(de.assets)} assets · ${de.happiness/8} joy</div>
            </div>
            <div class="r-score">${de.total}</div>
          </div>
        `}).join(""),pe=te?`
        <div class="breakdown">
          <h3>How ${gt(B.name)} scored</h3>
          <div class="breakdown-grid">
            <div class="breakdown-row"><span>Cash</span><b>${Ot(te.cash)}</b></div>
            <div class="breakdown-row"><span>Assets</span><b>${Ot(te.assets)}</b></div>
            <div class="breakdown-row"><span>Happiness</span><b>${Ot(te.happiness)}</b></div>
            <div class="breakdown-row"><span>Family</span><b>${Ot(te.family)}</b></div>
            <div class="breakdown-row"><span>Life goal</span><b>${te.goalMet?Ot(te.goal):"—"}</b></div>
            <div class="breakdown-row"><span>Retirement</span><b>${Ot(te.retirement)}</b></div>
            <div class="breakdown-row total"><span>Life score</span><b>${te.total}</b></div>
          </div>
        </div>
      `:"";he(`
      <div class="results">
        <div class="results-head">
          <div class="crown">♛</div>
          <h2>${gt(B?.name||"Someone")} wins at life</h2>
          <p>${j?.goalMet?"They even pulled off their secret life goal.":"A life well lived — and a score to prove it."}</p>
        </div>
        <div class="ranking">${ce}</div>
        ${pe}
        <div class="results-actions">
          <button class="btn" data-action="playAgain">Play again</button>
          <button class="btn secondary" data-action="newLife">New life</button>
        </div>
      </div>
      `,{kind:"results",wide:!0,closable:!1}),Xe()}function ne(){if(!s)return;const U=s.players[s.current];he(`
      <div class="pause-card">
        <div class="logo-row">
          <div class="brand-mark">L</div>
          <div>
            <h2>Paused</h2>
            <p class="modal-sub" style="margin:2px 0 0">${gt(U?.name||"")} · chapter ${Math.min((U?.laps||0)+1,s.laps)} of ${s.laps}</p>
          </div>
        </div>
        <div class="pause-actions">
          <button class="btn" data-action="resume">Keep playing</button>
          <button class="btn secondary" data-action="restart">Restart this life</button>
          <button class="btn secondary" data-action="how">How to play</button>
          <button class="btn danger" data-action="quit">Leave to main menu</button>
        </div>
        <div class="pause-meta"><span>Turn ${s.turn}</span><span>Autosaved on this device</span></div>
      </div>
      `,{kind:"pause",closable:!0})}function fe(){const U=Eu.map(k=>`
        <div class="rule">
          <div class="rule-icon"><img src="${Va(k.icon,"#8A5A00",96)}" alt="" /></div>
          <div><strong>${gt(k.title)}</strong><p>${gt(k.text)}</p></div>
        </div>
      `).join("");he(`
      <div class="modal-pad">
        <h2>How to play</h2>
        <p class="modal-sub">Roll, travel, choose, and build a life. The highest life score after the final chapter wins.</p>
        <div class="rules-list">${U}</div>
        <div class="modal-actions">
          <button class="btn" data-close>Got it</button>
        </div>
      </div>
      `,{kind:"rules",closable:!0})}function Ne(U){if(!s||l)return;const k=Yt[U];if(!k)return;const j=Ps[k.district],B=s.owners[U],te=B?s.players[B.owner]:null;let ce="";k.type==="property"?(ce=k.rent.map((pe,de)=>`<div class="deed-row"><span>Level ${de+1} rent</span><b>${Ot(pe)}${de+1===B?.level?" · current":""}</b></div>`).join(""),ce+=`<div class="deed-row"><span>Price</span><b>${Ot(k.price)}</b></div>`,ce+=`<div class="deed-row"><span>Owner</span><b>${te?gt(te.name)+` · level ${B.level}`:"For sale"}</b></div>`):ce=`<div class="deed-row"><span>Type</span><b>${k.type==="choice"?"Milestone choice":k.type==="event"?"Life event":k.type==="bonus"?"Bonus":k.type==="rest"?"Rest":k.type==="start"?"Start":"Milestone"}</b></div>`,he(`
      <div class="deed inspect-card">
        <div class="deed-head" style="background:linear-gradient(135deg, ${j.color}, ${j.dark})">
          <div class="kicker">${j.name}</div>
          <h2>${gt(k.name)}</h2>
        </div>
        <div class="inspect-body">
          <p class="modal-sub" style="margin-bottom:12px">${gt(k.blurb)}</p>
          ${ce}
          <div class="modal-actions"><button class="btn secondary" data-close>Close</button></div>
        </div>
      </div>
      `,{kind:"inspect",closable:!0})}function We(U,k=""){const j=document.createElement("div");for(j.className=`toast ${k}`,j.textContent=U,b.appendChild(j);b.children.length>3;)b.firstElementChild.remove();setTimeout(()=>{j.classList.add("out"),setTimeout(()=>j.remove(),320)},2600)}function Ce(U,k,j,B=""){const te=document.createElement("div");te.className=`floater ${B}`,te.textContent=j,te.style.left=`${U}px`,te.style.top=`${k}px`,m.appendChild(te),setTimeout(()=>te.remove(),1500)}function Xe(){const U=["#FFC94A","#FF7A6B","#35C4B5","#9C7BF3","#59C08A","#F08BAD","#FFF6E6"];for(let k=0;k<90;k++){const j=document.createElement("div");j.className="confetti-piece",j.style.left=`${Math.random()*100}%`,j.style.background=U[k%U.length],j.style.animationDuration=`${2.2+Math.random()*2.2}s`,j.style.animationDelay=`${Math.random()*.8}s`,j.style.transform=`rotate(${Math.random()*360}deg)`,j.style.width=`${5+Math.random()*7}px`,j.style.height=`${9+Math.random()*10}px`,j.style.opacity=`${.7+Math.random()*.3}`,p.appendChild(j),setTimeout(()=>j.remove(),5200)}}function yt(){if(c)return;c=!0;const U=$t("#splash");U&&(U.classList.add("done"),setTimeout(()=>U.remove(),700))}return n.addEventListener("click",U=>{const k=U.target.closest("[data-mode]");if(k){e.mode=k.dataset.mode,Dr(e),v();return}const j=U.target.closest("[data-count]");if(j){e.count=Number(j.dataset.count),Dr(e),v();return}const B=U.target.closest("[data-laps]");if(B){e.laps=Number(B.dataset.laps),Dr(e),v();return}const te=U.target.closest("[data-option]");if(te){t.choose?.(te.dataset.option);return}const ce=U.target.closest("[data-action]");if(!ce)return;switch(ce.dataset.action){case"start":t.start?.({mode:e.mode,count:e.mode==="pass"?2:e.count,laps:e.laps,players:wv(e),sound:i});break;case"continue":t.continue?.();break;case"how":fe();break;case"sound":E(!i),t.sound?.(i);break;case"roll":t.roll?.();break;case"end":t.end?.();break;case"buy":t.buy?.();break;case"pass":t.pass?.();break;case"upgrade":t.upgrade?.();break;case"skipUpgrade":t.skipUpgrade?.();break;case"ack":t.ack?.();break;case"menu":t.menu?.();break;case"center":t.center?.();break;case"resume":G(),t.resume?.();break;case"restart":G(),t.restart?.();break;case"quit":G(),t.quit?.();break;case"playAgain":G(),t.playAgain?.();break;case"newLife":G(),t.newLife?.();break}}),document.addEventListener("keydown",U=>{if(U.key==="Escape"){if(l&&["pause","rules","inspect"].includes(l.kind)){const k=l.kind;G(),k==="pause"&&t.resume?.()}return}if(U.code==="Space"||U.key==="Enter"){if(!s||l)return;s.phase==="roll"&&!s.players[s.current].isAI&&!r?(U.preventDefault(),t.roll?.()):s.phase==="end"&&!s.players[s.current].isAI&&!r&&(U.preventDefault(),t.end?.())}}),E(i),{handlers:t,showStart:R,hideStart:T,setContinueAvailable:S,render:$,setBusy:J,showPending:Ue,closeModal:G,toast:We,floater:Ce,showResults:qe,showPause:ne,showRules:fe,showInspect:Ne,hideSplash:yt,confetti:Xe,setSound:E,get settings(){return e},get soundOn(){return i},get activeModal(){return l}}}let Ii=null,Os=null,Ys=!1;function vl(){if(typeof window>"u")return null;if(!Ii){const n=window.AudioContext||window.webkitAudioContext;if(!n)return null;Ii=new n,Os=Ii.createGain(),Os.gain.value=.55,Os.connect(Ii.destination)}return Ii.state==="suspended"&&Ii.resume().catch(()=>{}),Ii}function nn(n,e,{type:t="sine",gain:i=.2,when:s=0,slide:r=null,attack:a=.005}={}){const o=vl();if(!o||Ys)return;const l=o.currentTime+s,c=o.createOscillator(),h=o.createGain();c.type=t,c.frequency.setValueAtTime(n,l),r&&c.frequency.exponentialRampToValueAtTime(Math.max(20,r),l+e),h.gain.setValueAtTime(1e-4,l),h.gain.exponentialRampToValueAtTime(i,l+a),h.gain.exponentialRampToValueAtTime(1e-4,l+e),c.connect(h),h.connect(Os),c.start(l),c.stop(l+e+.02)}function Ts(n,{gain:e=.15,when:t=0,frequency:i=1200,q:s=.8}={}){const r=vl();if(!r||Ys)return;const a=r.currentTime+t,o=Math.max(1,Math.floor(r.sampleRate*n)),l=r.createBuffer(1,o,r.sampleRate),c=l.getChannelData(0);for(let f=0;f<o;f++)c[f]=(Math.random()*2-1)*(1-f/o);const h=r.createBufferSource();h.buffer=l;const d=r.createBiquadFilter();d.type="bandpass",d.frequency.value=i,d.Q.value=s;const u=r.createGain();u.gain.setValueAtTime(e,a),u.gain.exponentialRampToValueAtTime(1e-4,a+n),h.connect(d),d.connect(u),u.connect(Os),h.start(a)}function Wo(){vl()}function eh(n){Ys=!!n,Ys||Wo()}function Sn(n){if(!Ys)switch(n){case"click":nn(520,.05,{type:"triangle",gain:.08});break;case"dice":Ts(.09,{gain:.12,frequency:1800,q:1.2}),Ts(.07,{gain:.1,frequency:900,when:.11}),Ts(.06,{gain:.09,frequency:1400,when:.24});break;case"diceLand":Ts(.12,{gain:.16,frequency:700,q:1}),nn(190,.1,{type:"triangle",gain:.12,slide:130});break;case"step":nn(440,.06,{type:"triangle",gain:.07,slide:520});break;case"coin":nn(880,.12,{type:"triangle",gain:.13}),nn(1318,.18,{type:"triangle",gain:.1,when:.06});break;case"buy":[523,659,784].forEach((e,t)=>nn(e,.18,{type:"triangle",gain:.12,when:t*.07}));break;case"rent":nn(392,.16,{type:"triangle",gain:.11}),nn(294,.22,{type:"triangle",gain:.1,when:.12});break;case"card":Ts(.16,{gain:.09,frequency:2200,q:.6}),nn(660,.12,{type:"sine",gain:.07,when:.05});break;case"choice":[523,784].forEach((e,t)=>nn(e,.22,{type:"sine",gain:.1,when:t*.1}));break;case"joy":[659,880,1046].forEach((e,t)=>nn(e,.25,{type:"sine",gain:.09,when:t*.08}));break;case"bad":nn(220,.28,{type:"sawtooth",gain:.07,slide:120});break;case"retire":[523,659,784,1046].forEach((e,t)=>nn(e,.45,{type:"sine",gain:.09,when:t*.12}));break;case"win":[523,659,784,1046,1318].forEach((e,t)=>nn(e,.5,{type:"triangle",gain:.1,when:t*.11})),nn(1568,.8,{type:"sine",gain:.08,when:.55});break;case"bankrupt":[392,330,262,196].forEach((e,t)=>nn(e,.4,{type:"sawtooth",gain:.07,when:t*.14}));break;default:nn(600,.08,{type:"triangle",gain:.08})}}const Xa="liag.save.v1",$a=n=>new Promise(e=>setTimeout(e,n));async function On(n="light"){if(!Bs.isNativePlatform()){navigator.vibrate&&navigator.vibrate(n==="heavy"?18:8);return}try{const{Haptics:e,ImpactStyle:t}=await qa(async()=>{const{Haptics:s,ImpactStyle:r}=await import("./index-BlSXuUc7.js");return{Haptics:s,ImpactStyle:r}},[],import.meta.url),i={light:t.Light,medium:t.Medium,heavy:t.Heavy};await e.impact({style:i[n]||t.Light})}catch{}}function Rv(n){return{mode:n.players.filter(t=>!t.isAI).length>1?"pass":"solo",count:n.players.length,laps:n.laps,players:n.players.map(t=>({name:t.name,isAI:t.isAI}))}}class Cv{constructor(){this.state=null,this.scene=null,this.ui=null,this.busy=!1,this.paused=!1,this.token=0,this.savedState=null,this.lastSettings=null}async boot(){this.ui=Av(),Object.assign(this.ui.handlers,{start:e=>this.startNew(e),continue:()=>this.continueGame(),roll:()=>this.humanRoll(),end:()=>this.humanEnd(),buy:()=>this.humanBuy(),pass:()=>this.humanPass(),upgrade:()=>this.humanUpgrade(),skipUpgrade:()=>this.humanSkipUpgrade(),ack:()=>this.humanAcknowledge(),choose:e=>this.humanChoose(e),menu:()=>this.openPause(),resume:()=>this.resume(),restart:()=>this.restart(),quit:()=>this.quitToMenu(),playAgain:()=>this.startNew(this.lastSettings),newLife:()=>this.quitToMenu(),center:()=>this.scene?.resetView(!0),sound:e=>eh(!e)}),this.scene=await vv({container:document.getElementById("scene-container"),onTileTap:e=>this.inspectTile(e)}),this.scene.setInteractive(!1),this.scene.setAutoRotate(!0),this.scene.resetView(!1),this.loadSave(),this.ui.showStart({continueAvailable:!!this.savedState}),this.ui.setSound(!this.savedMuted()),eh(this.savedMuted()),document.addEventListener("pointerdown",Wo,{once:!0}),document.addEventListener("keydown",Wo,{once:!0}),setTimeout(()=>this.ui.hideSplash(),900)}savedMuted(){try{return JSON.parse(localStorage.getItem("liag.settings")||"{}").sound===!1}catch{return!1}}loadSave(){try{const e=localStorage.getItem(Xa),t=e?ku(e):null;if(!t||t.phase==="ended"){this.savedState=null;return}t.phase==="moving"&&(t.phase="roll",t.lastRoll=null),t.phase==="action"&&!t.pending&&(t.phase="end"),this.savedState=t}catch{this.savedState=null}}save(){try{this.state&&this.state.phase!=="ended"?(localStorage.setItem(Xa,Bu(this.state)),this.savedState=this.state):(localStorage.removeItem(Xa),this.savedState=null)}catch{}}startNew(e){if(!e)return;this.token+=1,this.paused=!1,this.busy=!1,this.lastSettings={...e,players:e.players||this.lastSettings?.players};const t=(e.players||[]).map((i,s)=>({...i,color:i.color||xi[s%xi.length].color,colorDark:i.colorDark||xi[s%xi.length].dark}));this.state=Ru({players:t,laps:e.laps,seed:Math.floor(Math.random()*1e9)}),this.lastSettings.players=this.state.players.map(i=>({name:i.name,isAI:i.isAI})),this.ui.hideStart(),this.ui.closeModal(!0),this.ui.setBusy(!1),this.scene.setAutoRotate(!1),this.scene.setInteractive(!0),this.scene.updateState(this.state,{instant:!0}),this.scene.resetView(!1),this.save(),this.beginTurn(),On("medium")}continueGame(){if(this.savedState){if(this.token+=1,this.paused=!1,this.busy=!1,this.state=this.savedState,this.lastSettings=Rv(this.state),this.ui.hideStart(),this.ui.closeModal(!0),this.scene.setAutoRotate(!1),this.scene.setInteractive(!0),this.scene.updateState(this.state,{instant:!0}),this.scene.resetView(!1),this.ui.render(this.state,{busy:!1}),this.scene.setActiveRing(this.state.current,this.state),this.scene.focusPlayer(this.state.current,this.state),this.state.phase==="ended"){this.endGame();return}this.state.pending?Bt(this.state).isAI?this.scheduleAI(700):this.ui.showPending(this.state):Bt(this.state).isAI&&this.scheduleAI(700)}}beginTurn(){if(!this.state||this.state.phase==="ended")return;this.busy=!1,this.ui.setBusy(!1),this.ui.render(this.state,{busy:!1}),this.scene.updateState(this.state),this.scene.setActiveRing(this.state.current,this.state),this.scene.focusPlayer(this.state.current,this.state),this.save(),Bt(this.state).isAI&&!this.paused&&this.scheduleAI(850)}scheduleAI(e=700){if(this.paused)return;const t=this.token;setTimeout(()=>{t!==this.token||this.paused||this.driveAI()},e)}async driveAI(){if(this.paused||this.busy||!this.state)return;const e=Bt(this.state);if(!(!e||!e.isAI||this.state.phase==="ended")&&!(this.state.phase==="roll"&&(await this.performRoll(!0),this.paused||(await $a(550),this.paused)))&&!(this.state.pending&&Bt(this.state).isAI&&(await this.resolveAI(),this.paused||(await $a(500),this.paused)))&&this.state.phase==="end"&&Bt(this.state).isAI){if(await $a(400),this.paused)return;await this.finishTurn(!0)}}async performRoll(e=!1){if(this.busy||this.paused||!this.state||this.state.phase!=="roll")return;const t=this.token,i=Bt(this.state);this.busy=!0,this.ui.setBusy(!0,"Rolling");const{roll:s,path:r}=Cu(this.state);if(Sn("dice"),On("light"),await this.scene.rollDice(s),t!==this.token){this.busy=!1;return}if(Sn("diceLand"),this.ui.setBusy(!0,"Moving"),await this.scene.movePawn(i.id,r,this.state),t!==this.token){this.busy=!1;return}const{events:a}=Pu(this.state);this.busy=!1,this.ui.setBusy(!1),this.applyEvents(a),this.save(),this.ui.render(this.state,{busy:!1}),this.scene.updateState(this.state),this.scene.setActiveRing(i.id,this.state),this.scene.focusPlayer(i.id,this.state),this.state.pending&&!i.isAI?(this.ui.showPending(this.state),On("light")):this.state.phase==="end"&&!i.isAI&&this.ui.toast("Move complete. End your turn when you are ready.","")}async humanRoll(){!this.state||this.busy||this.paused||Bt(this.state).isAI||await this.performRoll(!1)}async humanEnd(){!this.state||this.busy||this.paused||Bt(this.state).isAI||await this.finishTurn(!1)}async finishTurn(e=!1){if(!this.state||this.busy||this.paused||this.state.phase!=="end")return;this.busy=!0,this.ui.setBusy(!0,"Ending turn");const{events:t,ended:i}=Iu(this.state);if(this.applyEvents(t),this.busy=!1,this.ui.setBusy(!1),this.save(),i){this.endGame();return}this.beginTurn(),e||On("light")}humanBuy(){if(!this.state?.pending||this.state.pending.type!=="buy")return;const e=Bt(this.state),t=Yt[this.state.pending.tileId],{events:i}=Cl(this.state);this.ui.closeModal(!0),this.applyEvents(i),this.ui.toast(`${e.name} bought ${t.name}.`,"good"),Sn("buy"),On("medium"),this.afterDecision()}humanPass(){if(!this.state?.pending||this.state.pending.type!=="buy")return;const e=Yt[this.state.pending.tileId];Pl(this.state),this.ui.closeModal(!0),this.ui.toast(`You passed on ${e.name}.`,""),this.afterDecision()}humanUpgrade(){if(!this.state?.pending||this.state.pending.type!=="upgrade")return;const e=Yt[this.state.pending.tileId],{events:t}=Ll(this.state);this.ui.closeModal(!0),this.applyEvents(t),this.ui.toast(`${e.name} upgraded. Rent is now higher.`,"good"),Sn("buy"),On("medium"),this.afterDecision()}humanSkipUpgrade(){!this.state?.pending||this.state.pending.type!=="upgrade"||(Dl(this.state),this.ui.closeModal(!0),this.afterDecision())}humanAcknowledge(){!this.state?.pending||this.state.pending.type!=="card"||(Il(this.state),this.ui.closeModal(!0),this.afterDecision())}humanChoose(e){if(!this.state?.pending||this.state.pending.type!=="choice")return;const t=Bt(this.state),{events:i,option:s}=Fl(this.state,e);this.ui.closeModal(!0),this.applyEvents(i),this.ui.toast(`${t.name} chose “${s.label}”.`,""),Sn("choice"),this.afterDecision()}afterDecision(){this.save(),this.ui.render(this.state,{busy:!1}),this.scene.updateState(this.state),this.scene.setActiveRing(this.state.current,this.state),this.scene.focusPlayer(this.state.current,this.state),this.state.phase==="end"&&On("light")}async resolveAI(){if(!this.state?.pending||this.paused)return;const e=zu(this.state);if(!e)return;const t=Bt(this.state),i=this.state.pending;switch(e.type){case"buy":{const s=Yt[i.tileId],{events:r}=Cl(this.state);this.applyEvents(r),this.ui.toast(`${t.name} bought ${s.name}.`,"");break}case"pass":{Pl(this.state);break}case"upgrade":{const s=Yt[i.tileId],{events:r}=Ll(this.state);this.applyEvents(r),this.ui.toast(`${t.name} upgraded ${s.name}.`,"");break}case"skipUpgrade":Dl(this.state);break;case"card":Il(this.state);break;case"choice":{const{events:s,option:r}=Fl(this.state,e.optionId);this.applyEvents(s),this.ui.toast(`${t.name} chose “${r.label}”.`,"");break}}this.save(),this.ui.render(this.state,{busy:!1}),this.scene.updateState(this.state),this.scene.setActiveRing(this.state.current,this.state),this.scene.focusPlayer(this.state.current,this.state)}applyEvents(e=[]){for(const t of e){const i=t.playerId!==void 0?this.state.players[t.playerId]:null,s=i?this.scene.projectTile(i.position):null;switch(t.type){case"money":{if(!t.amount)break;const r=t.amount>0?"+":"−";s&&this.ui.floater(s.x,s.y,`${r}$${Math.abs(Math.round(t.amount))}`,t.amount<0?"negative":""),i&&!i.isAI&&this.ui.toast(`${r}$${Math.abs(Math.round(t.amount))} ${t.reason?`· ${t.reason}`:""}`.trim(),t.amount>0?"good":"bad"),Sn(t.amount>0?"coin":"bad"),t.amount>0&&this.scene.burstTile(i.position,"#FFC94A",8,2);break}case"happiness":{if(!t.amount)break;s&&this.ui.floater(s.x,s.y-12,`${t.amount>0?"+":"−"}${Math.abs(t.amount)} joy`,"joy"),t.amount>0&&Sn("joy");break}case"salary":{s&&this.ui.floater(s.x,s.y,`+$${t.amount}`,""),this.ui.toast(`${i.name} collected $${t.amount} salary.`,"gold"),Sn("coin"),this.scene.burstTile(i.position,"#FFD166",12,2.2);break}case"rent":{const r=this.state.players[t.fromId],a=this.state.players[t.toId];(!r.isAI||!a.isAI)&&this.ui.toast(`${r.name} paid ${a.name} $${Math.round(t.amount)} rent.`,r.isAI?"good":"bad");const l=this.scene.projectTile(r.position),c=this.scene.projectTile(a.position);this.ui.floater(l.x,l.y,`−$${Math.round(t.amount)}`,"negative"),this.ui.floater(c.x,c.y,`+$${Math.round(t.amount)}`,""),Sn("rent"),this.scene.burstTile(r.position,"#FFB4A8",8,1.8);break}case"buy":{this.scene.burstTile(t.tileId,"#9FC0FF",14,2.6),i?.isAI&&this.ui.toast(`${i.name} bought ${Yt[t.tileId].name}.`,""),On("light");break}case"upgrade":{this.scene.burstTile(t.tileId,"#FFD166",14,2.6),On("light");break}case"card":Sn("card");break;case"choice":Sn("choice");break;case"bankrupt":this.ui.toast(`${this.state.players[t.playerId].name} is out of the game.`,"bad"),Sn("bankrupt"),On("heavy");break;case"retire":{const r=this.state.players[t.playerId];this.ui.toast(`${r.name} retires with $${Math.round(r.cash)}.`,"gold"),Sn("retire"),this.scene.retirePawn(t.playerId,this.state);break}}}}endGame(){this.state&&(this.token+=1,this.paused=!1,this.busy=!1,this.ui.setBusy(!1),this.scene.setInteractive(!1),this.scene.setAutoRotate(!0),this.scene.resetView(!0),this.scene.updateState(this.state,{instant:!0}),this.scene.celebrate(),this.ui.render(this.state,{busy:!1}),this.ui.showResults(this.state),Sn("win"),On("heavy"),this.save())}openPause(){!this.state||this.state.phase==="ended"||(this.paused=!0,this.ui.showPause(),this.scene.setInteractive(!1))}resume(){this.state&&(this.paused=!1,this.scene.setInteractive(!0),this.ui.render(this.state,{busy:!1}),this.state.pending&&!Bt(this.state).isAI?this.ui.showPending(this.state):Bt(this.state).isAI&&this.scheduleAI(500))}restart(){this.lastSettings&&(this.ui.closeModal(!0),this.startNew(this.lastSettings))}quitToMenu(){this.token+=1,this.paused=!1,this.busy=!1,this.save(),this.state=null,this.loadSave(),this.ui.closeModal(!0),this.ui.setBusy(!1),this.scene.setInteractive(!1),this.scene.setAutoRotate(!0),this.scene.resetView(!0),this.ui.showStart({continueAvailable:!!this.savedState})}inspectTile(e){!this.state||this.paused||this.busy||this.ui.activeModal||this.ui.showInspect(e)}}const vi=new Cv;window.lifeIsAGame=vi;function Pv(n){const e=document.getElementById("splash");e&&(e.innerHTML=`
      <div class="splash-inner">
        <div class="splash-logo">L</div>
        <h1>Life is a Game</h1>
        <p style="max-width:280px;line-height:1.6;letter-spacing:.04em;text-transform:none;font-size:12px;text-align:center">${n}</p>
      </div>
    `)}async function Lv(){if(Bs.isNativePlatform()){try{const{StatusBar:n}=await qa(async()=>{const{StatusBar:e}=await import("./index-27mohTDt.js");return{StatusBar:e}},[],import.meta.url);await n.hide(),await n.setBackgroundColor({color:"#101b33"})}catch{}try{const{App:n}=await qa(async()=>{const{App:e}=await import("./index-B8U_88wc.js");return{App:e}},[],import.meta.url);n.addListener("backButton",()=>{if(vi.ui?.activeModal){const e=vi.ui.activeModal.kind;vi.ui.closeModal(),e==="pause"&&vi.resume();return}vi.state?vi.openPause():n.exitApp()})}catch{}}}vi.boot().then(Lv).catch(n=>{console.error(n),Pv("This game needs WebGL. Please update your browser or device and try again.")});export{$o as W,qa as _,Xo as r};
