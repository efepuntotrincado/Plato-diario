/* ====================== ESTADO (solo en este teléfono) ====================== */
const VERSION="2.1.0";
const LS="plato-diario-v1";
const MEALS=[["desayuno","Desayuno"],["colacion","Colación"],["almuerzo","Almuerzo"],["once","Once"],["cena","Cena"]];
const MEAL_ORDER=MEALS.map(m=>m[0]);
const mealName=k=>(MEALS.find(m=>m[0]===k)||[k,k])[1];
function blank(){return {v:2,perfil:null,pin:null,mis:[],alias:{},freq:{},pesos:[],cfg:{},upd:0,bkLast:0,dias:{},desp:[],compras:[],menu:null}}
function lsGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
function lsSet(k,v){try{localStorage.setItem(k,v);return true}catch(e){return false}}
function ssGet(k){try{return sessionStorage.getItem(k)}catch(e){return null}}
function ssSet(k,v){try{sessionStorage.setItem(k,v)}catch(e){}}
function migrate(r){ const s=Object.assign(blank(),r||{}); s.alias=s.alias||{}; s.freq=s.freq||{}; s.desp=s.desp||[]; s.compras=s.compras||[]; s.cfg=s.cfg||{}; s.mis=(s.mis||[]).map(m=>Object.assign({x:{},al:[norm(m.n)],src:"mio",gr:0},m,{id:m.id&&m.id.startsWith("m")?m.id:"m"+uid()})); return s; }
let S=(()=>{try{const r=JSON.parse(lsGet(LS)||"null"); if(r&&r.dias) return migrate(r);}catch(e){} return blank();})();
function save(){ if(!lsSet(LS,JSON.stringify(S))) toast("No pude guardar. Revisa el espacio del teléfono."); }
const uid=()=>Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4);
try{ navigator.storage&&navigator.storage.persist&&navigator.storage.persist(); }catch(e){}

const pad=n=>String(n).padStart(2,"0");
function keyOf(d){return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())}
function fromKey(k){const [y,m,d]=k.split("-").map(Number);return new Date(y,m-1,d)}
function addDays(k,n){const d=fromKey(k);d.setDate(d.getDate()+n);return keyOf(d)}
const TODAY=()=>keyOf(new Date());
let CUR=TODAY();
function day(k){return S.dias[k]||{items:[],agua:0,upd:0}}
function ensureDay(k){if(!S.dias[k])S.dias[k]={items:[],agua:0,upd:0};return S.dias[k]}
function touchDay(k){ensureDay(k).upd=Date.now();save()}
function touchPerfil(){S.upd=Date.now();save()}

let IX=null; function ix(){ if(!IX) IX=buildIndex(S.mis,S.alias); return IX; }
function ixDirty(){ IX=null; }

/* ====================== METAS ====================== */
const ACT=[[1.2,"Sedentario (casi todo el día sentado)"],[1.375,"Ligero (de pie a ratos, caminatas)"],[1.55,"Moderado (ejercicio 3 a 5 días)"],[1.725,"Alto (ejercicio intenso casi a diario)"]];
function latestPeso(){const a=(S.pesos||[]).slice().sort((x,y)=>x.f<y.f?-1:1);return a.length?a[a.length-1].kg:null}
function metas(p){
  p=p||S.perfil; if(!p) return null;
  const peso=latestPeso()||p.peso;
  const tmb=10*peso+6.25*p.talla-5*p.edad+(p.sexo==="m"?-161:5);
  const get=tmb*p.act;
  const ajuste=p.obj==="subir"?p.sup:p.obj==="bajar"?-p.sup:0;
  const kcal=p.metaKcal>0?p.metaKcal:Math.round((get+ajuste)/10)*10;
  const prot=p.metaProt>0?p.metaProt:Math.round(peso*p.protKg);
  const g=Math.round(kcal*0.28/9);
  const c=Math.max(0,Math.round((kcal-prot*4-g*9)/4));
  return {kcal,prot,g,c,fi:Math.max(25,Math.round(kcal*0.014)),v:3,fr:2,l:3,agua:8,tmb:Math.round(tmb),get:Math.round(get),peso};
}
function tot(items){const t={k:0,p:0,c:0,g:0,fi:0,v:0,fr:0,l:0,leg:0,pes:0};
  items.forEach(it=>{FIELDS.forEach(k=>t[k]+=(it.b[k]||0)*it.f); if(it.leg)t.leg=1; if(it.pes)t.pes=1;});return t}
function weekCount(flag,k){
  k=k||CUR; const d=fromKey(k); const dow=(d.getDay()+6)%7; let n=0;
  for(let i=0;i<=dow;i++){ const kk=addDays(k,-i); if((S.dias[kk]||{items:[]}).items.some(it=>it[flag])) n++; }
  return n;
}

/* ====================== PIN ====================== */
async function hashPin(p){
  const s="plato-diario:"+p;
  try{ const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));
    return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join(""); }
  catch(e){ let h=5381; for(const ch of s) h=((h<<5)+h+ch.charCodeAt(0))|0; return "d"+(h>>>0).toString(16); }
}
function showLock(){ $("lock").hidden=false; $("lockHello").textContent=S.perfil&&S.perfil.nombre?`Hola, ${S.perfil.nombre}. Ingresa tu PIN`:"Ingresa tu PIN"; setTimeout(()=>$("lockIn").focus(),60); }
async function tryUnlock(){
  const v=$("lockIn").value.trim();
  if(await hashPin(v)===S.pin){ ssSet("pd-ok","1"); $("lock").hidden=true; $("lockErr").hidden=true; $("lockIn").value=""; render(); }
  else { $("lockErr").hidden=false; $("lockIn").value=""; }
}

/* ====================== UTILIDADES UI ====================== */
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const nf0=new Intl.NumberFormat("es-CL",{maximumFractionDigits:0});
const nf1=new Intl.NumberFormat("es-CL",{maximumFractionDigits:1});
const nf2=new Intl.NumberFormat("es-CL",{maximumFractionDigits:2});
const fk=n=>nf0.format(Math.round(n||0));
const fg=n=>(n||0)<10?nf1.format(n||0):nf0.format(Math.round(n||0));
const fp=n=>nf1.format(Math.round((n||0)*2)/2);
function toast(msg){ const h=$("toastHost"); h.innerHTML=`<div class="toast" role="status">${esc(msg)}</div>`; clearTimeout(toast.t); toast.t=setTimeout(()=>h.innerHTML="",2600); }
function hourNow(){ const d=new Date(); return d.getHours()+d.getMinutes()/60; }
function mealNow(){ return SLOTS[slotNow(hourNow())][0]; }
function dayLabel(k){ const t=TODAY(); if(k===t) return "Hoy"; if(k===addDays(t,-1)) return "Ayer";
  return fromKey(k).toLocaleDateString("es-CL",{weekday:"long",day:"numeric",month:"long"}); }
function qLabel(it){ return scaleQ(it.q,it.f); }
function sellosHtml(se){ if(!se) return ""; return `<span class="sellos">${se.split(",").filter(x=>SELLOS[x]).map(x=>`<span class="sello" title="${SELLOS[x]}">${SELLOS[x].replace("ALTO EN ","ALTO EN<br>")}</span>`).join("")}</span>`; }
function itemFromFood(f,x){ const b={}; FIELDS.forEach(k=>b[k]=f[k]); return {n:f.n,q:f.q,f:x||1,b,leg:f.leg,pes:f.pes,src:f.src,fid:f.id,se:f.se||""}; }

/* ====================== VISTAS ====================== */
let TAB="hoy", PREV=[], PREV_NOTE="", PREV_UNK=[], PREV_FIX=[], SHOW_ALL_PLAN=false, FFILTER="all";
function render(){
  const setupNeeded=!S.perfil;
  $("vSetup").hidden=!setupNeeded;
  document.querySelector(".tabs").hidden=setupNeeded;
  const V={hoy:"vHoy",desp:"vDesp",hist:"vHist",alim:"vAlim",ajus:"vAjus"};
  Object.keys(V).forEach(t=>$(V[t]).hidden=setupNeeded||TAB!==t);
  document.querySelectorAll(".tabs button").forEach(b=>b.setAttribute("aria-current",b.dataset.tab===TAB?"page":"false"));
  $("hello").textContent=S.perfil&&S.perfil.nombre?S.perfil.nombre:"";
  if(setupNeeded){ renderSetup(); return; }
  if(TAB==="hoy") renderHoy(); else if(TAB==="desp") renderDesp(); else if(TAB==="hist") renderHist(); else if(TAB==="alim") renderAlim(); else renderAjus();
}

function perfilFields(p,pre){
  p=p||{sexo:"",edad:"",talla:"",peso:"",act:1.375,obj:"mantener",sup:400,protKg:1.8};
  return `<div class="grid2">
    <div class="field"><label for="${pre}sexo">Sexo</label><select id="${pre}sexo"><option value="h"${p.sexo==="h"?" selected":""}>Hombre</option><option value="m"${p.sexo==="m"?" selected":""}>Mujer</option></select></div>
    <div class="field"><label for="${pre}edad">Edad (años)</label><input id="${pre}edad" type="number" inputmode="numeric" min="14" max="99" value="${esc(p.edad)}" placeholder="30"></div>
    <div class="field"><label for="${pre}talla">Estatura (cm)</label><input id="${pre}talla" type="number" inputmode="numeric" min="120" max="230" value="${esc(p.talla)}" placeholder="170"></div>
    <div class="field"><label for="${pre}peso">Peso (kg)</label><input id="${pre}peso" type="number" inputmode="decimal" step="0.1" min="30" max="250" value="${esc(p.peso)}" placeholder="65"></div>
  </div>
  <div class="field"><label for="${pre}act">Actividad diaria</label><select id="${pre}act">${ACT.map(([v,t])=>`<option value="${v}"${+p.act===v?" selected":""}>${t}</option>`).join("")}</select></div>
  <div class="grid2">
    <div class="field"><label for="${pre}obj">Objetivo</label><select id="${pre}obj">
      <option value="subir"${p.obj==="subir"?" selected":""}>Subir de peso</option>
      <option value="mantener"${p.obj==="mantener"?" selected":""}>Mantener</option>
      <option value="bajar"${p.obj==="bajar"?" selected":""}>Bajar de peso</option></select></div>
    <div class="field"><label for="${pre}sup">Kcal a sumar o restar</label><select id="${pre}sup">${[250,300,400,500].map(v=>`<option value="${v}"${+p.sup===v?" selected":""}>${v}</option>`).join("")}</select></div>
  </div>
  <div class="field"><label for="${pre}prot">Proteína por kilo</label><select id="${pre}prot">${[1.2,1.4,1.6,1.8,2.0,2.2].map(v=>`<option value="${v}"${+p.protKg===v?" selected":""}>${nf1.format(v)} g/kg</option>`).join("")}</select></div>`;
}
function readPerfil(pre,old){
  const p=Object.assign({},old||{});
  p.sexo=$(pre+"sexo").value; p.edad=+$(pre+"edad").value; p.talla=+$(pre+"talla").value; p.peso=+String($(pre+"peso").value).replace(",",".");
  p.act=+$(pre+"act").value; p.obj=$(pre+"obj").value; p.sup=+$(pre+"sup").value; p.protKg=+$(pre+"prot").value;
  if(!(p.edad>=14&&p.edad<=99)) return "Escribe tu edad (entre 14 y 99 años).";
  if(!(p.talla>=120&&p.talla<=230)) return "La estatura va en centímetros, por ejemplo 165.";
  if(!(p.peso>=30&&p.peso<=250)) return "El peso va en kilos, por ejemplo 60.";
  return p;
}
function renderSetup(){ if(!$("sedad")) $("setupForm").innerHTML=perfilFields(null,"s"); }

function bar(label,val,goal,color,unit){
  const pct=goal>0?Math.min(100,val/goal*100):0;
  return `<div class="bar"><div class="t"><b>${label}</b><span class="num">${fg(val)} / ${fg(goal)} ${unit}</span></div>
    <div class="track"><div class="fill" style="width:${pct}%;background:${color}"></div></div></div>`;
}
function renderHoy(){
  const M=metas(), d=day(CUR), T=tot(d.items);
  $("installTip").hidden=!showInstallTip();
  $("dLbl").textContent=dayLabel(CUR); $("dNext").style.visibility=CUR>=TODAY()?"hidden":"visible";
  const R=64, C=2*Math.PI*R, pct=Math.min(1,T.k/M.kcal), over=T.k-M.kcal;
  $("ring").innerHTML=`<svg viewBox="0 0 150 150" aria-hidden="true"><circle cx="75" cy="75" r="${R}" fill="none" stroke="var(--surface-2)" stroke-width="14"/>
    <circle cx="75" cy="75" r="${R}" fill="none" stroke="${over>0?"var(--warn)":"var(--accent)"}" stroke-width="14" stroke-linecap="round" stroke-dasharray="${C*pct} ${C}"/></svg>
    <div class="c"><span class="big num">${fk(T.k)}</span><span class="small muted num">de ${fk(M.kcal)} kcal</span>
    <span class="small num" style="font-weight:700;color:${over>0?"var(--warn)":"var(--accent)"}">${over>0?"+"+fk(over)+" sobre la meta":"faltan "+fk(-over)}</span></div>`;
  $("ring").setAttribute("aria-label",`${fk(T.k)} de ${fk(M.kcal)} kilocalorías`);
  $("macros").innerHTML=bar("Proteína",T.p,M.prot,"var(--prot)","g")+bar("Carbos",T.c,M.c,"var(--carb)","g")+bar("Grasas",T.g,M.g,"var(--fat)","g")+bar("Fibra",T.fi,M.fi,"var(--veg)","g");
  const chips=[["Proteína",T.p>=M.prot*0.95,`${fk(T.p)}/${M.prot} g`],["Verduras",T.v>=M.v,`${fp(T.v)}/${M.v}`],["Frutas",T.fr>=M.fr,`${fp(T.fr)}/${M.fr}`],["Lácteos",T.l>=M.l,`${fp(T.l)}/${M.l}`],["Agua",(d.agua||0)>=6,`${d.agua||0}/${M.agua}`]];
  $("balance").innerHTML=chips.map(([n,ok,v])=>`<span class="chip${ok?" ok":""}"><span class="pip" aria-hidden="true"></span>${n} <span class="num">${v}</span>${ok?" ✓":""}</span>`).join("");
  const ms=$("mealSel"); if(!ms.dataset.ready){ ms.innerHTML=MEALS.map(([v,t])=>`<option value="${v}">${t}</option>`).join(""); ms.value=mealNow(); ms.dataset.ready="1"; }
  renderRecents(); renderPreview(); renderPlan(M,T,d);
  const a=d.agua||0; $("aguaLbl").textContent=`${a} de 6 a 8 vasos`;
  $("glasses").innerHTML=Array.from({length:Math.max(8,a)},(_,i)=>`<span class="glass${i<a?" on":""}" aria-hidden="true"></span>`).join("");
  const groups=MEAL_ORDER.map(m=>[m,d.items.filter(it=>it.t===m)]);
  $("meals").innerHTML= d.items.length? groups.filter(g=>g[1].length).map(([m,its])=>{ const tt=tot(its);
    return `<div class="meal"><div class="meal-h"><h3>${mealName(m)}</h3><span class="small num"><b>${fk(tt.k)}</b> kcal · <span style="color:var(--prot);font-weight:700">${fk(tt.p)} g prot</span></span></div>
      ${its.map(it=>`<button class="entry" data-edit="${it.id}"><span class="nm">${esc(it.n)}</span><span class="k num">${fk(it.b.k*it.f)} kcal</span>
        <span class="small muted">${esc(qLabel(it))}${it.se?" · "+it.se.split(",").map(x=>(SELLOS[x]||"").replace("ALTO EN ","alto en ").toLowerCase()).join(", "):""}</span><span class="small num" style="text-align:right;color:var(--prot)">${fg(it.b.p*it.f)} g</span></button>`).join("")}</div>`;}).join("")
    : `<div class="empty">Todavía no hay nada registrado ${CUR===TODAY()?"hoy":"este día"}. Escribe arriba lo que comiste, por ejemplo "un pan ciabatta con palta y un café con leche".</div>`;
}
function renderRecents(){
  const seen=new Map();
  for(let i=0;i<21&&seen.size<10;i++){ const k=addDays(TODAY(),-i); const its=(S.dias[k]||{items:[]}).items.slice().reverse();
    its.forEach(it=>{ const key=norm(it.n)+"|"+it.f; if(!seen.has(key)&&seen.size<10) seen.set(key,it); }); }
  const arr=[...seen.values()];
  const ex=["2 huevos revueltos en agua","1 pan ciabatta","150 g de pechuga de pollo","1 taza de brócoli"];
  $("recents").innerHTML= arr.length
    ? `<span class="label" style="width:100%">Repetir</span>`+arr.map((it,i)=>`<button class="chip btnchip" data-rec="${i}">${esc(it.f!==1?nf2.format(it.f)+" × ":"")}${esc(it.n)}</button>`).join("")
    : `<span class="label" style="width:100%">Prueba con</span>`+ex.map(e=>`<button class="chip btnchip" data-ex="${esc(e)}">${esc(e)}</button>`).join("");
  $("recents").onclick=e=>{ const b=e.target.closest("button"); if(!b)return;
    if(b.dataset.rec!=null){ const it=arr[+b.dataset.rec]; PREV.push({n:it.n,q:it.q,f:it.f,b:Object.assign({},it.b),leg:it.leg,pes:it.pes,src:it.src}); renderPreview(); }
    else { $("inTxt").value=b.dataset.ex; doParse(); } };
}
function renderPreview(){
  const box=$("preview");
  const fixHtml=PREV_FIX.length?`<p class="small muted">Entendí ${PREV_FIX.map(([a,b])=>`"${esc(b)}" donde escribiste "${esc(a)}"`).join(", ")}.</p>`:"";
  const unkHtml=PREV_UNK.length?`<div class="unk"><span class="small" style="font-weight:700;color:var(--warn)">No reconocí</span>${PREV_UNK.map((w,i)=>`<button class="chip warn" data-unk="${i}">${esc(w)} · ¿qué es?</button>`).join("")}</div>`:"";
  if(!PREV.length){ box.innerHTML=(unkHtml||fixHtml||PREV_NOTE)?`<div class="stack">${unkHtml}${fixHtml}${PREV_NOTE?`<p class="small muted">${esc(PREV_NOTE)}</p>`:""}</div>`:""; bindPreview(box); return; }
  const T=tot(PREV);
  box.innerHTML=`<div class="preview">
    <div class="row between"><span class="label">Por agregar a ${esc(mealName($("mealSel").value))}</span><span class="num small"><b>${fk(T.k)} kcal</b> · ${fk(T.p)} g prot</span></div>
    ${PREV.map((it,i)=>`<div class="pitem">
      <div class="nm">${esc(it.n)}<div class="small muted" style="font-weight:400">${esc(it.water?"vasos de 250 ml":scaleQ(it.q,it.f))}</div>${sellosHtml(it.se)}
        ${it.alts&&it.alts.length?`<select class="altsel" data-alt="${i}" aria-label="Cambiar producto"><option value="">Otra variante de ${esc((ix().byId[it.fid]||{}).brand||"la marca")}…</option>${it.alts.map(id=>ix().byId[id]).filter(Boolean).map(f=>`<option value="${esc(f.id)}">${esc(f.n.replace(/^.*? · /,""))} · ${fk(f.k)} kcal</option>`).join("")}</select>`:""}</div>
      <div class="stepper"><button data-pm="${i}" aria-label="Menos">−</button><span class="num">${nf2.format(it.f)}×</span><button data-pp="${i}" aria-label="Más">+</button></div>
      <div class="macline num">${it.water?`<span>Suma ${nf1.format(it.f)} ${it.f===1?"vaso":"vasos"} al agua del día</span>`:`<span><b>${fk(it.b.k*it.f)}</b> kcal</span><span class="p">P ${fg(it.b.p*it.f)}</span><span>C ${fg(it.b.c*it.f)}</span><span>G ${fg(it.b.g*it.f)}</span>${it.b.v?`<span class="v">verd ${fp(it.b.v*it.f)}</span>`:""}${it.b.fr?`<span class="f">fruta ${fp(it.b.fr*it.f)}</span>`:""}`}</div>
      <button class="btn sm ghost" data-px="${i}">Quitar</button>
    </div>`).join("")}
    ${unkHtml}${fixHtml}${PREV_NOTE?`<p class="small muted">${esc(PREV_NOTE)}</p>`:""}
    <div class="row"><button class="btn pri" id="pvAdd">Agregar</button><button class="btn ghost" id="pvCancel">Descartar</button></div>
  </div>`;
  bindPreview(box);
}
function bindPreview(box){
  box.onchange=e=>{ const sel=e.target.closest("[data-alt]"); if(!sel||!sel.value) return; const i=+sel.dataset.alt, old=PREV[i], f=ix().byId[sel.value]; if(!f) return;
    const others=[old.fid].concat(old.alts||[]).filter(id=>id&&id!==f.id); const nw=itemFromFood(f,old.f); nw.alts=others; PREV[i]=nw; renderPreview(); };
  box.onclick=e=>{ const b=e.target.closest("button"); if(!b)return;
    if(b.dataset.pm!=null){ const it=PREV[+b.dataset.pm]; it.f=Math.max(0.25,round2(it.f-(it.f>1?0.5:0.25))); renderPreview(); }
    else if(b.dataset.pp!=null){ const it=PREV[+b.dataset.pp]; it.f=round2(it.f+(it.f>=1?0.5:0.25)); renderPreview(); }
    else if(b.dataset.px!=null){ PREV.splice(+b.dataset.px,1); renderPreview(); }
    else if(b.dataset.unk!=null) openResolve(+b.dataset.unk);
    else if(b.id==="pvAdd") commitPreview();
    else if(b.id==="pvCancel"){ PREV=[]; PREV_NOTE=""; PREV_UNK=[]; PREV_FIX=[]; renderPreview(); } };
}
function commitPreview(){
  const d=ensureDay(CUR), t=$("mealSel").value; let n=0;
  PREV.forEach(it=>{
    if(it.water){ d.agua=(d.agua||0)+Math.round(it.f); return; }
    d.items.push({id:uid(),t,n:it.n,q:it.q,f:it.f,b:it.b,leg:it.leg||0,pes:it.pes||0,src:it.src||"base",se:it.se||"",ts:Date.now()}); n++;
    S.freq[it.n]=(S.freq[it.n]||0)+1;
  });
  PREV=[]; PREV_NOTE=""; PREV_UNK=[]; PREV_FIX=[]; $("inTxt").value="";
  touchDay(CUR); render(); toast(n===0?"Agua sumada":n===1?"Agregado":"Agregados "+n+" alimentos");
}
function learnFood(it,word){
  const key=norm(it.n); if(!key) return null;
  const ex=(S.mis||[]).find(m=>norm(m.n)===key);
  const rec={id:ex?ex.id:"m"+uid(),n:it.n,al:[key],q:it.q||"1 porción",gr:0,src:"mio",x:{},leg:it.leg||0,pes:it.pes||0,fry:0,cnt:0};
  FIELDS.forEach(k=>rec[k]=round2((it.b[k]||0)*it.f));
  if(word){ const w=norm(word); if(w&&!rec.al.includes(w)) rec.al.push(w); }
  if(ex){ rec.al=[...new Set((ex.al||[]).concat(rec.al))]; Object.assign(ex,rec); } else S.mis.push(rec);
  ixDirty(); touchPerfil(); return rec;
}
function doParse(){
  const txt=$("inTxt").value.trim(); if(!txt) return;
  const r=parseText(txt,ix());
  PREV=PREV.concat(r.items); PREV_UNK=r.unknown; PREV_FIX=r.fixes;
  PREV_NOTE=r.items.length? (r.unknown.length?"Toca lo que no reconocí para enseñármelo. Lo recordaré la próxima vez.":"Revisa las cantidades con − y + antes de agregar.")
    : (r.unknown.length?"No reconocí ningún alimento. Toca la palabra para decirme qué es, o usa \"A mano\".":"Escribe qué comiste, por ejemplo \"1 marraqueta con quesillo\".");
  renderPreview();
}

/* ---- enseñar una palabra nueva ---- */
function openResolve(i){
  const word=PREV_UNK[i]; if(!word) return;
  const list=q=>(q?suggestFoods(q,ix(),12):suggestFoods(word,ix(),6));
  const rows=fs=>fs.map(f=>`<button class="food" style="width:100%;text-align:left" data-pick="${esc(f.id)}"><div style="min-width:0"><b>${esc(f.n)}</b><div class="small muted">${esc(f.q)} · ${fk(f.k)} kcal · P ${fg(f.p)} g</div></div><span class="btn sm">Es esto</span></button>`).join("")||`<p class="small muted">Sin coincidencias.</p>`;
  openSheet(`<h2>¿Qué es "${esc(word)}"?</h2>
    <p class="small muted">Elige el alimento más parecido. La próxima vez que escribas "${esc(word)}" lo reconozco solo.</p>
    <input id="rsQ" type="text" placeholder="Buscar en la base" aria-label="Buscar alimento">
    <div id="rsList">${rows(list(""))}</div>
    <div class="row"><button class="btn" id="rsManual">No está, lo agrego a mano</button><button class="btn ghost" id="rsSkip">Ignorar esta palabra</button></div>`,
  e=>{ const b=e.target.closest("button"); if(!b) return;
    if(b.dataset.pick){ const f=ix().byId[b.dataset.pick]; if(!f) return; S.alias[word]=f.id; ixDirty(); touchPerfil();
      PREV.push(itemFromFood(f,1));
      PREV_UNK.splice(i,1); closeSheet(); renderPreview(); toast(`Aprendido: "${word}" es ${f.n}`); }
    if(b.id==="rsManual"){ closeSheet(); openManual(word,()=>{ PREV_UNK.splice(i,1); renderPreview(); }); }
    if(b.id==="rsSkip"){ PREV_UNK.splice(i,1); closeSheet(); renderPreview(); } });
  $("rsQ").oninput=e=>{ $("rsList").innerHTML=rows(list(e.target.value.trim())); };
}

/* ---- planificador y consejos ---- */
function planCtx(M,T,d){ const H=pantry(); return {M,T,dayItems:d.items,hour:hourNow(),freq:S.freq,weekLeg:weekCount("leg"),weekPes:weekCount("pes"),seed:fromKey(CUR).getDate(),obj:S.perfil.obj,dow:(new Date().getDay()+6)%7,have:H.have.size?H.have:null,strict:!!S.cfg.soloDesp&&H.have.size>0}; }
function optHtml(o,mi,oi,label){
  const H=pantry();
  return `<div class="opt">${label?`<span class="label">${esc(label)}</span>`:""}<ul>${o.comp.map(([f,x])=>`<li>${esc(scaleQ(f.q,x))} <b>${esc(f.n)}</b>${H.have.size&&!STAPLE.has(f.n)?(H.have.has(f.n)?` <span class="small have">· lo tienes</span>`:` <span class="small miss">· falta</span>`):""}</li>`).join("")}</ul>
    <div class="row between"><span class="small num"><b>${fk(o.t.k)}</b> kcal · <span style="color:var(--prot);font-weight:700">${fk(o.t.p)} g prot</span>${o.t.v?` · <span style="color:var(--veg);font-weight:700">verd ${fp(o.t.v)}</span>`:""}</span>
    <button class="btn sm" data-opt="${mi}:${oi}">Registrar esto</button></div></div>`;
}
let PLAN=null, MENU_TODAY=null;
function renderPlan(M,T,d){
  const gk=M.kcal-T.k, gp=M.prot-T.p, gv=M.v-T.v, gf=M.fr-T.fr; const lines=[];
  if(gk>0) lines.push(`<b class="num">${fk(gk)} kcal</b>`);
  if(gp>1) lines.push(`<b class="num" style="color:var(--prot)">${fk(gp)} g de proteína</b>`);
  if(gv>0.25) lines.push(`<b class="num" style="color:var(--veg)">${fp(gv)} ${gv>1?"porciones":"porción"} de verduras</b>`);
  if(gf>0.25) lines.push(`<b class="num" style="color:var(--fruit)">${fp(gf)} de fruta</b>`);
  let html= lines.length? `<h2>Te falta</h2><p>${lines.join(", ").replace(/, ([^,]*)$/," y $1")}.</p>`
    : `<h2>Meta cumplida</h2><p class="muted small">Calorías, proteína, verduras y fruta al día.${T.k-M.kcal>300?" Te pasaste un poco en calorías; mañana se equilibra.":""}</p>`;
  const ctx=planCtx(M,T,d);
  if(CUR===TODAY()){
    coach(ctx).forEach(t=>html+=`<div class="tip">${esc(t)}</div>`);
    PLAN=planRest(ctx);
    if(!PLAN.done&&PLAN.meals.length){
      const m0=PLAN.meals[0]; const fromMenu=menuMeal(CUR,m0.slot);
      MENU_TODAY=fromMenu?{slot:m0.slot,opt:fromMenu}:null;
      html+=`<div class="plan"><div class="row between"><span class="label">Próxima comida: ${esc(mealName(m0.slot))}</span><span class="small muted num">apunta a ~${fk(m0.tg.k)} kcal y ${fk(m0.tg.p)} g</span></div>
        ${fromMenu?optHtml(fromMenu,-1,0,"De tu menú de la semana"):""}
        ${m0.relaxed?`<p class="small muted">Con lo que tienes no alcanza para esta comida; estas opciones usan algo que falta.</p>`:""}
        ${m0.opts.map((o,oi)=>optHtml(o,0,oi)).join("")}</div>`;
      if(PLAN.meals.length>1){
        html+= SHOW_ALL_PLAN? PLAN.meals.slice(1).map((m,mi)=>`<div class="plan"><span class="label">${esc(mealName(m.slot))}</span>${m.opts[0]?optHtml(m.opts[0],mi+1,0):""}</div>`).join("")+`<button class="btn ghost" id="planLess">Ocultar el resto del día</button>`
          : `<button class="btn ghost" id="planMore">Ver cómo cerrar el día (${PLAN.meals.length-1} ${PLAN.meals.length-1===1?"comida más":"comidas más"})</button>`;
      }
    }
  }
  html+=`<p class="small muted">Esta semana: legumbres ${ctx.weekLeg} de 2 días · pescado ${ctx.weekPes} de 2 días.</p>`;
  $("gapCard").innerHTML=html;
  $("gapCard").onclick=e=>{ const b=e.target.closest("button"); if(!b)return;
    if(b.dataset.opt){ const [mi,oi]=b.dataset.opt.split(":").map(Number); const m=mi<0?MENU_TODAY:PLAN.meals[mi], o=mi<0?MENU_TODAY.opt:m.opts[oi];
      PREV=PREV.concat(compToItems(o.comp,pantry().swap)); $("mealSel").value=m.slot; PREV_NOTE="Ajusta las porciones si comiste otra cantidad."; renderPreview(); $("preview").scrollIntoView({behavior:"smooth",block:"center"}); }
    if(b.id==="planMore"){ SHOW_ALL_PLAN=true; renderPlan(M,T,d); }
    if(b.id==="planLess"){ SHOW_ALL_PLAN=false; renderPlan(M,T,d); } };
}

/* ---- hojas ---- */
function openSheet(html,onClick){
  $("sheetHost").innerHTML=`<div class="sheet-bg" id="sbg"><div class="sheet" role="dialog" aria-modal="true">${html}</div></div>`;
  $("sbg").onclick=e=>{ if(e.target.id==="sbg"){closeSheet();return;} onClick&&onClick(e); };
}
function closeSheet(){ $("sheetHost").innerHTML=""; }
function macroInputs(b,f){ f=f||1;
  const L=[["k","Calorías (kcal)"],["p","Proteína (g)"],["c","Carbohidratos (g)"],["g","Grasas (g)"],["fi","Fibra (g)"],["v","Verduras (porciones)"],["fr","Frutas (porciones)"],["l","Lácteos (porciones)"]];
  return `<div class="grid2">${L.map(([k,t])=>`<div class="field"><label for="m_${k}">${t}</label><input id="m_${k}" type="number" inputmode="decimal" step="0.1" min="0" value="${b?round2((b[k]||0)*f):""}"></div>`).join("")}</div>`;
}
function readMacros(){ const b={}; FIELDS.forEach(k=>{const v=parseFloat(String($("m_"+k).value).replace(",","."));b[k]=isFinite(v)&&v>=0?v:0;}); return b; }
function openManual(word,after){
  openSheet(`<h2>Agregar a mano</h2>
    <p class="small muted">Si es un envase, copia los valores de la tabla nutricional por porción.</p>
    <div class="field"><label for="mn">Nombre</label><input id="mn" type="text" value="${esc(word?word.charAt(0).toUpperCase()+word.slice(1):"")}" placeholder="Ej. Pan amasado de la feria"></div>
    <div class="field"><label for="mq">Porción</label><input id="mq" type="text" placeholder="Ej. 1 unidad (90 g)"></div>
    ${macroInputs(null)}
    <label class="row" for="mleg"><input type="checkbox" id="mleg" style="width:20px;height:20px"> Es legumbre</label>
    <label class="row" for="mpes"><input type="checkbox" id="mpes" style="width:20px;height:20px"> Es pescado o marisco</label>
    <label class="row" for="msave"><input type="checkbox" id="msave" checked style="width:20px;height:20px"> Recordarlo para la próxima</label>
    <p class="err" id="merr" hidden></p>
    <div class="row"><button class="btn pri" id="mok">Agregar a la lista</button><button class="btn ghost" id="mcancel">Cancelar</button></div>`,
  e=>{ const b=e.target.closest("button"); if(!b)return;
    if(b.id==="mcancel") closeSheet();
    if(b.id==="mok"){ const n=$("mn").value.trim(); const m=readMacros();
      if(!n){ $("merr").textContent="Ponle un nombre."; $("merr").hidden=false; return; }
      if(!(m.k>0)){ $("merr").textContent="Escribe las calorías. Están en la tabla nutricional del envase."; $("merr").hidden=false; return; }
      const it={n,q:$("mq").value.trim()||"1 porción",f:1,b:m,leg:$("mleg").checked?1:0,pes:$("mpes").checked?1:0,src:"mio"};
      if($("msave").checked){ learnFood(it,word); }
      PREV.push(it); closeSheet(); after&&after(); renderPreview(); } });
}
function openEdit(id){
  const d=day(CUR), it=d.items.find(x=>x.id===id); if(!it) return;
  openSheet(`<h2>${esc(it.n)}</h2><p class="small muted">${esc(qLabel(it))} · valores del total consumido</p>
    <div class="field"><label for="en">Nombre</label><input id="en" type="text" value="${esc(it.n)}"></div>
    <div class="field"><label for="et">Tiempo de comida</label><select id="et">${MEALS.map(([v,t])=>`<option value="${v}"${it.t===v?" selected":""}>${t}</option>`).join("")}</select></div>
    ${macroInputs(it.b,it.f)}
    <div class="row"><button class="btn pri" id="eok">Guardar</button><button class="btn ghost" id="emine">Guardar y recordar</button><button class="btn danger" id="edel">Eliminar</button></div>`,
  e=>{ const b=e.target.closest("button"); if(!b)return;
    if(b.id==="eok"||b.id==="emine"){ it.n=$("en").value.trim()||it.n; it.t=$("et").value; it.b=readMacros(); it.q=qLabel(it); it.f=1;
      if(b.id==="emine") learnFood(it); touchDay(CUR); closeSheet(); render(); toast(b.id==="emine"?"Guardado y recordado":"Cambios guardados"); }
    if(b.id==="edel"){ d.items=d.items.filter(x=>x.id!==id); touchDay(CUR); closeSheet(); render(); toast("Eliminado"); } });
}

/* ---- despensa, compras y menú ---- */
let DSEG="tengo";
const LOCS=[["refri","Refrigerador"],["congelador","Congelador"],["despensa","Despensa"]];
function pantry(){
  const have=new Set(), swap={};
  (S.desp||[]).forEach(e=>{ if(e.st==="nada") return; const f=e.fid?ix().byId[e.fid]:null; const bn=e.base||(f?baseOf(f):null); if(bn){ have.add(bn); if(f&&f.src==="marca"&&!swap[bn]) swap[bn]=f; } });
  return {have,swap};
}
function autoLoc(f,n){ const sec=sectionOf(f,n); return /Lácteos|Carnes|Fiambrería|Frutas/.test(sec)?"refri":sec==="Congelados"?"congelador":"despensa"; }
function textToEntries(txt){
  const r=parseText(txt,ix()); const out=[];
  r.items.filter(it=>!it.water).forEach(it=>{ const f=it.fid?ix().byId[it.fid]:null; out.push({n:it.n,fid:it.fid||null,base:f?baseOf(f):null,x:it.f,q:it.q,f}); });
  r.unknown.forEach(w=>out.push({n:w.charAt(0).toUpperCase()+w.slice(1),fid:null,base:null,x:1,q:"",f:null}));
  return out;
}
function addToPantry(list,loc){
  let n=0; list.forEach(e=>{ const ex=S.desp.find(d=>(e.fid&&d.fid===e.fid)||norm(d.n)===norm(e.n));
    if(ex){ ex.st="hay"; ex.upd=Date.now(); } else S.desp.push({id:uid(),n:e.n,fid:e.fid,base:e.base,loc:loc&&loc!=="auto"?loc:autoLoc(e.f,e.n),st:"hay",upd:Date.now()}); n++; });
  return n;
}
function addToShop(list){
  let n=0; list.forEach(e=>{ const ex=S.compras.find(c=>!c.done&&((e.fid&&c.fid===e.fid)||norm(c.n)===norm(e.n)));
    if(ex){ ex.x=round2((ex.x||1)+(e.x||1)); } else S.compras.push({id:uid(),n:e.n,fid:e.fid,q:e.q||"",x:e.x||1,sec:sectionOf(e.f,e.n),done:false}); n++; });
  return n;
}
function menuMeal(k,slot){
  if(!S.menu||!S.menu.days) return null; const i=Math.round((fromKey(k)-fromKey(S.menu.start))/864e5); const d=S.menu.days[i]; if(!d) return null;
  const m=d.find(x=>x.slot===slot); if(!m) return null; const comp=m.comp.map(([id,x])=>[ix().byId[id],x]).filter(c=>c[0]); if(!comp.length) return null;
  const t={k:0,p:0,v:0,fr:0}; comp.forEach(([f,x])=>{ t.k+=f.k*x; t.p+=f.p*x; t.v+=f.v*x; t.fr+=f.fr*x; }); return {comp,t};
}
function renderDesp(){
  document.querySelectorAll("#dSeg button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.d===DSEG?"true":"false"));
  $("dTengo").hidden=DSEG!=="tengo"; $("dCompras").hidden=DSEG!=="compras"; $("dMenu").hidden=DSEG!=="menu";
  if(DSEG==="tengo"){
    const by=LOCS.map(([k,t])=>[k,t,S.desp.filter(e=>e.loc===k)]).filter(g=>g[2].length);
    $("dList").innerHTML= by.length? by.map(([k,t,list])=>`<div class="card"><div class="row between"><h3>${t}</h3><span class="small muted">${list.length}</span></div><div class="pan">
      ${list.sort((a,b)=>a.n.localeCompare(b.n,"es")).map(e=>`<div class="prow"><button class="st ${e.st}" data-st="${e.id}" aria-label="Cambiar estado de ${esc(e.n)}">${e.st==="poco"?"Queda poco":"Hay"}</button>
        <span class="nm">${esc(e.n)}${e.base&&e.base!==e.n?`<span class="small muted" style="font-weight:400"> · cuenta como ${esc(e.base.replace(/\s*\(.*$/,""))}</span>`:""}${!e.fid?`<span class="small muted" style="font-weight:400"> · sin datos nutricionales</span>`:""}</span>
        <button class="xbtn" data-out="${e.id}" aria-label="Se acabó ${esc(e.n)}" title="Se acabó: pasa a compras">✓</button></div>`).join("")}</div></div>`).join("")
      +`<p class="small muted">Toca "Hay" para marcar que queda poco. El ✓ indica que se acabó y lo pasa a la lista de compras.</p>`
      : `<div class="empty">Todavía no anotas lo que tienes. Escribe arriba lo que hay en tu despensa y refrigerador, y el planificador lo usará primero.</div>`;
  }
  if(DSEG==="compras"){
    const pend=S.compras.filter(c=>!c.done).length;
    const by=SECCIONES.map(sec=>[sec,S.compras.filter(c=>c.sec===sec)]).filter(g=>g[1].length);
    $("cList").innerHTML= by.length? by.map(([sec,list])=>`<div class="card"><h3>${esc(sec)}</h3><div class="pan">
      ${list.map(c=>`<label class="prow${c.done?" done":""}" for="ck_${c.id}"><input type="checkbox" class="chk" id="ck_${c.id}" data-ck="${c.id}"${c.done?" checked":""}>
        <span class="nm">${esc(c.n)}${c.q?`<span class="small muted" style="font-weight:400"> · ${esc(scaleQ(c.q,c.x))}</span>`:""}</span>
        <button class="xbtn" data-cx="${c.id}" aria-label="Quitar ${esc(c.n)}">×</button></label>`).join("")}</div></div>`).join("")
      : `<div class="empty">La lista está vacía. Agrega cosas aquí, marca algo como acabado en la despensa o arma el menú de la semana y manda lo que falte.</div>`;
    $("cMsg").textContent=S.compras.length?`${pend} por comprar · ${S.compras.length-pend} en el carro`:"";
  }
  if(DSEG==="menu"){
    $("mStrict").checked=!!S.cfg.soloDesp;
    const H=pantry(); $("mShop").hidden=!S.menu;
    if(!S.menu){ $("mList").innerHTML=`<div class="empty">Aún no armas un menú. ${H.have.size?`Usaré los ${H.have.size} alimentos de tu despensa primero.`:"Si anotas tu despensa, la uso primero."}</div>`; return; }
    $("mList").innerHTML=S.menu.days.map((d,i)=>{ const k=addDays(S.menu.start,i); let tk=0,tp=0;
      const rows=d.map(m=>{ const comp=m.comp.map(([id,x])=>[ix().byId[id],x]).filter(c=>c[0]); comp.forEach(([f,x])=>{tk+=f.k*x;tp+=f.p*x;});
        return `<div class="ml"><b>${esc(mealName(m.slot))}</b><span>${comp.map(([f,x])=>`${esc(scaleQ(f.q,x))} ${esc(f.n.replace(/\s*\(.*$/,""))}${H.have.size&&!STAPLE.has(f.n)&&!H.have.has(f.n)?` <span class="miss">*</span>`:""}`).join(" · ")}</span></div>`; }).join("");
      return `<div class="card dayplan"><div class="row between"><h3>${esc(dayLabel(k))}</h3><span class="small num"><b>${fk(tk)}</b> kcal · <span style="color:var(--prot);font-weight:700">${fk(tp)} g prot</span></span></div>${rows}</div>`; }).join("")
      + (H.have.size?`<p class="small muted"><span class="miss">*</span> no está en tu despensa.</p>`:"");
  }
}
function buildMenu(){
  const M=metas(); const H=pantry(); const strict=!!S.cfg.soloDesp&&H.have.size>0;
  const wk=weekMenu({M,freq:S.freq,weekLeg:0,weekPes:0,seed:new Date().getDate(),have:H.have.size?H.have:null,strict},7);
  S.menu={start:TODAY(),strict,days:wk.map(d=>d.map(m=>({slot:m.slot,comp:m.comp.map(([f,x])=>[f.id,x])})))};
  touchPerfil(); const relaxed=wk.some(d=>d.some(m=>m.relaxed));
  $("mMsg").textContent=strict&&relaxed?"Con lo que tienes no alcanzó para todas las comidas; en algunas agregué lo que falta.":"Menú listo. Cada comida aparece también en Hoy como primera opción.";
  renderDesp();
}
function menuToShop(){
  if(!S.menu) return; const H=pantry(); const need={};
  S.menu.days.forEach(d=>d.forEach(m=>m.comp.forEach(([id,x])=>{ const f=ix().byId[id]; if(!f||STAPLE.has(f.n)||H.have.has(f.n)) return; need[id]=(need[id]||0)+x; })));
  const list=Object.entries(need).map(([id,x])=>{ const f=ix().byId[id]; return {n:f.n,fid:id,q:f.q,x:round2(x),f}; });
  const n=addToShop(list); touchPerfil(); toast(n?`Agregué ${n} ${n===1?"producto":"productos"} a compras`:"Ya tienes todo lo del menú"); if(n){ DSEG="compras"; renderDesp(); }
}

/* ---- historial ---- */
function renderHist(){
  const M=metas(), days=[]; for(let i=13;i>=0;i--){ const k=addDays(TODAY(),-i); const d=S.dias[k]; days.push({k,T:tot(d?d.items:[]),n:d?d.items.length:0}); }
  const W=340,H=170,pl=34,pb=22,pt=10, mx=Math.max(M.kcal*1.25,...days.map(x=>x.T.k))||1;
  const y=v=>pt+(H-pt-pb)*(1-v/mx), bw=(W-pl-4)/14;
  const ticks=[0,Math.round(mx/2/100)*100,Math.round(mx/100)*100].filter((v,i,a)=>a.indexOf(v)===i&&v<=mx);
  $("histChart").innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Calorías de los últimos 14 días">
    ${ticks.map(v=>`<line x1="${pl}" x2="${W}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)" stroke-width="1"/><text x="${pl-4}" y="${y(v)+4}" text-anchor="end" font-size="9" fill="var(--muted)">${nf0.format(v)}</text>`).join("")}
    ${days.map((x,i)=>{ const h=Math.max(0,(H-pt-pb)-(y(x.T.k)-pt)); const ok=x.T.k>=M.kcal*0.9&&x.T.k<=M.kcal*1.15;
      return `<rect x="${pl+i*bw+2}" y="${y(x.T.k)}" width="${bw-4}" height="${h}" rx="3" fill="${x.n?(ok?"var(--accent)":"var(--carb)"):"var(--surface-2)"}"/>
      <text x="${pl+i*bw+bw/2}" y="${H-8}" text-anchor="middle" font-size="9" fill="var(--muted)">${fromKey(x.k).getDate()}</text>`;}).join("")}
    <line x1="${pl}" x2="${W}" y1="${y(M.kcal)}" y2="${y(M.kcal)}" stroke="var(--prot)" stroke-width="1.5" stroke-dasharray="4 3"/>
    <text x="${W-2}" y="${y(M.kcal)-4}" text-anchor="end" font-size="9" font-weight="700" fill="var(--prot)">meta ${nf0.format(M.kcal)}</text></svg>
    <p class="small muted">Verde: dentro del rango (90% a 115% de la meta). Ámbar: lejos de la meta.</p>`;
  const reg=days.filter(x=>x.n);
  const avgK=reg.length?reg.reduce((a,x)=>a+x.T.k,0)/reg.length:0, avgP=reg.length?reg.reduce((a,x)=>a+x.T.p,0)/reg.length:0;
  const protOk=reg.filter(x=>x.T.p>=M.prot*0.95).length, vegOk=reg.filter(x=>x.T.v>=M.v).length;
  $("weekStats").innerHTML=[["Promedio diario",fk(avgK)+" kcal",`meta ${fk(M.kcal)}`],["Proteína promedio",fk(avgP)+" g",`meta ${M.prot} g`],["Días con proteína",protOk+" de "+reg.length,"de los días registrados"],["Días con verduras",vegOk+" de "+reg.length,`al menos ${M.v} porciones`]]
    .map(([a,b,c])=>`<div class="stat"><span class="label">${a}</span><span class="v num">${b}</span><span class="small muted">${c}</span></div>`).join("");
  const P=(S.pesos||[]).slice().sort((a,b)=>a.f<b.f?-1:1).slice(-30);
  const dshort=k=>fromKey(k).toLocaleDateString("es-CL",{day:"numeric",month:"short"});
  $("pesoLbl").textContent=P.length?`${nf1.format(P[P.length-1].kg)} kg el ${dshort(P[P.length-1].f)}`:`perfil: ${nf1.format(S.perfil.peso)} kg`;
  if(P.length>=2){ const mn=Math.min(...P.map(p=>p.kg))-0.5, mxp=Math.max(...P.map(p=>p.kg))+0.5, Wp=340,Hp=110,l=34;
    const X=i=>l+(Wp-l-10)*(i/(P.length-1)), Y=v=>8+(Hp-30)*(1-(v-mn)/(mxp-mn)); const pts=P.map((p,i)=>`${X(i)},${Y(p.kg)}`).join(" ");
    $("pesoChart").innerHTML=`<svg viewBox="0 0 ${Wp} ${Hp}" role="img" aria-label="Evolución del peso">
      <line x1="${l}" x2="${Wp}" y1="${Y(mn+0.5)}" y2="${Y(mn+0.5)}" stroke="var(--line)"/><text x="${l-4}" y="${Y(mn+0.5)+3}" text-anchor="end" font-size="9" fill="var(--muted)">${nf1.format(mn+0.5)}</text>
      <line x1="${l}" x2="${Wp}" y1="${Y(mxp-0.5)}" y2="${Y(mxp-0.5)}" stroke="var(--line)"/><text x="${l-4}" y="${Y(mxp-0.5)+3}" text-anchor="end" font-size="9" fill="var(--muted)">${nf1.format(mxp-0.5)}</text>
      <polygon points="${X(0)},${Hp-22} ${pts} ${X(P.length-1)},${Hp-22}" fill="var(--accent)" opacity=".12"/>
      <polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="${X(P.length-1)}" cy="${Y(P[P.length-1].kg)}" r="4.5" fill="var(--accent)"/>
      <text x="${X(0)}" y="${Hp-6}" font-size="9" fill="var(--muted)">${dshort(P[0].f)}</text><text x="${Wp-10}" y="${Hp-6}" text-anchor="end" font-size="9" fill="var(--muted)">${dshort(P[P.length-1].f)}</text></svg>`;
  } else $("pesoChart").innerHTML=`<p class="small muted">Registra tu peso una vez por semana, en ayunas, para ver la curva.</p>`;
  const keys=Object.keys(S.dias).filter(k=>S.dias[k].items.length).sort().reverse().slice(0,60);
  $("dayList").innerHTML=keys.length?keys.map(k=>{ const T=tot(S.dias[k].items);
    return `<button class="dayrow" data-day="${k}"><b>${esc(dayLabel(k))}</b><span class="num"><b>${fk(T.k)}</b> kcal</span>
      <span class="small muted num">P ${fk(T.p)} g · verd ${fp(T.v)} · fruta ${fp(T.fr)}</span><span class="small num" style="text-align:right;color:${T.p>=M.prot*0.95?"var(--ok)":"var(--muted)"}">${T.p>=M.prot*0.95?"proteína ✓":"proteína corta"}</span></button>`;}).join("")
    :`<div class="empty">Cuando registres comidas, aquí aparece cada día con su resumen.</div>`;
  $("dayList").onclick=e=>{ const b=e.target.closest("[data-day]"); if(!b)return; CUR=b.dataset.day; TAB="hoy"; PREV=[]; render(); window.scrollTo(0,0); };
}

/* ---- alimentos ---- */
function renderAlim(){
  document.querySelectorAll("#fFilter button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.f===FFILTER?"true":"false"));
  if(FFILTER==="learn"){
    const ents=Object.entries(S.alias||{});
    $("foodList").innerHTML=ents.length?ents.map(([w,id])=>{ const f=ix().byId[id]; return `<div class="food"><div><b>"${esc(w)}"</b><div class="small muted">se entiende como ${esc(f?f.n:"(alimento borrado)")}</div></div><button class="btn sm ghost" data-unlearn="${esc(w)}">Olvidar</button></div>`; }).join("")
      :`<div class="empty">Cuando me enseñes una palabra que no reconocí, aparece aquí.</div>`;
  } else {
    const q=norm($("fSearch").value);
    const src=FFILTER==="mio"?(S.mis||[]):FFILTER==="marca"?PRODUCTS:(S.mis||[]).concat(BASE,PRODUCTS);
    const qs=q.split(" ").filter(Boolean);
    const list=src.filter(f=>{ if(!qs.length) return true; const hay=norm(f.n)+" "+(f.al||[]).join(" "); return qs.every(w=>hay.includes(w)); }).slice(0,q?100:400);
    $("foodList").innerHTML=list.map(f=>`<div class="food"><div style="min-width:0"><b>${esc(f.n)}</b> ${f.src==="mio"?`<span class="tag">mío</span>`:f.src==="marca"?`<span class="tag">etiqueta</span>`:""}${f.leg?` <span class="tag">legumbre</span>`:""}${f.pes?` <span class="tag">pescado</span>`:""}
        <div class="small muted">${esc(f.q)}${f.url&&/^https:\/\//.test(f.url)?` · <a href="${esc(f.url)}" target="_blank" rel="noopener">fuente</a>`:""}</div>${sellosHtml(f.se)}
        <div class="macline num"><span><b>${fk(f.k)}</b> kcal</span><span class="p">P ${fg(f.p)}</span><span>C ${fg(f.c)}</span><span>G ${fg(f.g)}</span>${f.v?`<span class="v">verd ${fp(f.v)}</span>`:""}${f.fr?`<span class="f">fruta ${fp(f.fr)}</span>`:""}</div></div>
        <div class="row" style="flex-wrap:nowrap">${f.src==="mio"?`<button class="btn sm ghost" data-del="${f.id}" aria-label="Quitar ${esc(f.n)}">Quitar</button>`:""}<button class="btn sm" data-add="${f.id}">+ Hoy</button></div></div>`).join("")
      || `<div class="empty">${FFILTER==="mio"?"Todavía no guardas alimentos propios. Se agregan al usar \"A mano\" o \"Guardar y recordar\".":`No encontré "${esc($("fSearch").value)}". Agrégalo con "A mano" en la pestaña Hoy.`}</div>`;
  }
  $("foodList").onclick=e=>{ const b=e.target.closest("button"); if(!b)return;
    if(b.dataset.add){ const f=ix().byId[b.dataset.add]; if(!f) return;
      PREV.push(itemFromFood(f,1)); CUR=TODAY(); TAB="hoy"; render(); window.scrollTo(0,0); toast("Listo para agregar. Revisa y confirma"); }
    if(b.dataset.del){ S.mis=S.mis.filter(x=>x.id!==b.dataset.del); Object.keys(S.alias).forEach(w=>{ if(S.alias[w]===b.dataset.del) delete S.alias[w]; }); ixDirty(); touchPerfil(); renderAlim(); }
    if(b.dataset.unlearn){ delete S.alias[b.dataset.unlearn]; ixDirty(); touchPerfil(); renderAlim(); } };
}

/* ---- ajustes ---- */
function renderAjus(){
  if(!$("aedad")){ $("perfForm").innerHTML=perfilFields(S.perfil,"a"); $("aNombre").value=S.perfil.nombre||""; }
  const M=metas();
  $("metaBox").innerHTML=`<div class="grid2">
      <div class="stat"><span class="label">Gasto en reposo</span><span class="v num">${fk(M.tmb)}</span><span class="small muted">kcal al día</span></div>
      <div class="stat"><span class="label">Gasto con actividad</span><span class="v num">${fk(M.get)}</span><span class="small muted">kcal al día</span></div>
      <div class="stat"><span class="label">Meta de calorías</span><span class="v num">${fk(M.kcal)}</span><span class="small muted">${S.perfil.metaKcal>0?"fijada a mano":"calculada"}</span></div>
      <div class="stat"><span class="label">Meta de proteína</span><span class="v num">${M.prot} g</span><span class="small muted">${S.perfil.metaProt>0?"fijada a mano":`${nf1.format(S.perfil.protKg)} g × ${nf1.format(M.peso)} kg`}</span></div>
    </div>
    <p class="small muted num">Carbohidratos ${fk(M.c)} g · Grasas ${fk(M.g)} g · Fibra ${M.fi} g · Verduras ${M.v} y frutas ${M.fr} porciones · Lácteos ${M.l} · Agua 6 a 8 vasos</p>
    <details><summary>Fijar metas a mano</summary>
      <div class="grid2" style="margin-top:8px">
        <div class="field"><label for="aMk">Calorías (vacío = calcular)</label><input id="aMk" type="number" inputmode="numeric" value="${S.perfil.metaKcal>0?S.perfil.metaKcal:""}"></div>
        <div class="field"><label for="aMp">Proteína g (vacío = calcular)</label><input id="aMp" type="number" inputmode="numeric" value="${S.perfil.metaProt>0?S.perfil.metaProt:""}"></div>
      </div></details>`;
  $("bkLast").textContent=S.bkLast?`Último respaldo: ${new Date(S.bkLast).toLocaleDateString("es-CL",{day:"numeric",month:"long"})}.`:"Todavía no haces un respaldo.";
  $("appUrl").textContent=location.origin+location.pathname.replace(/index\.html$/,"");
  $("verLbl").textContent="Plato Diario "+VERSION;
}

/* ---- respaldo (AirDrop, Archivos, WhatsApp) ---- */
async function exportBk(){
  const data=JSON.stringify({app:"plato-diario",version:2,exportado:new Date().toISOString(),datos:S});
  const name="plato-diario-"+slug(S.perfil&&S.perfil.nombre||"respaldo")+"-"+TODAY()+".json";
  const file=new File([data],name,{type:"application/json"});
  try{ if(navigator.canShare&&navigator.canShare({files:[file]})){ await navigator.share({files:[file],title:"Respaldo Plato Diario"}); S.bkLast=Date.now(); save(); renderAjus(); toast("Respaldo listo"); return; } }
  catch(e){ if(e&&e.name==="AbortError"){ toast("Respaldo cancelado"); return; } }
  try{ const url=URL.createObjectURL(file); const a=document.createElement("a"); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),4000); S.bkLast=Date.now(); save(); renderAjus(); toast("Respaldo descargado"); }
  catch(e){ toast("No pude crear el archivo de respaldo"); }
}
function readBk(file,cb){
  const r=new FileReader();
  r.onload=()=>{ try{ const j=JSON.parse(r.result); const D=j&&j.datos?j.datos:j; if(!D||typeof D.dias!=="object") throw 0; cb(null,D); }catch(e){ cb("Ese archivo no es un respaldo de Plato Diario."); } };
  r.onerror=()=>cb("No pude leer el archivo."); r.readAsText(file);
}
function mergeInto(D){
  Object.entries(D.dias||{}).forEach(([k,d])=>{ const cur=ensureDay(k); const ids=new Set(cur.items.map(i=>i.id));
    (d.items||[]).forEach(it=>{ if(!ids.has(it.id)) cur.items.push(it); }); cur.agua=Math.max(cur.agua||0,d.agua||0); cur.upd=Date.now(); });
  (D.mis||[]).forEach(m=>{ if(!S.mis.some(x=>norm(x.n)===norm(m.n))) S.mis.push(m); });
  (D.desp||[]).forEach(e=>{ if(!S.desp.some(x=>norm(x.n)===norm(e.n))) S.desp.push(e); }); (D.compras||[]).forEach(c=>{ if(!S.compras.some(x=>x.id===c.id)) S.compras.push(c); });
  Object.assign(S.alias,D.alias||{}); (D.pesos||[]).forEach(p=>{ if(!S.pesos.some(x=>x.f===p.f)) S.pesos.push(p); });
}
function importBk(file,box,fromSetup){
  readBk(file,(err,D)=>{
    if(err){ box.innerHTML=`<p class="err">${esc(err)}</p>`; return; }
    const nd=Object.keys(D.dias).length, who=D.perfil&&D.perfil.nombre?` de ${esc(D.perfil.nombre)}`:"";
    box.innerHTML=`<p class="small">Respaldo${who} con ${nd} ${nd===1?"día":"días"} registrados.${fromSetup?" Se restaura con su perfil y su PIN.":""}</p>
      <div class="row"><button class="btn pri" data-bk="replace">${fromSetup?"Restaurar":"Reemplazar todo"}</button>${fromSetup?"":`<button class="btn" data-bk="merge">Unir con lo actual</button>`}<button class="btn ghost" data-bk="no">Cancelar</button></div>`;
    box.onclick=e=>{ const b=e.target.closest("[data-bk]"); if(!b) return;
      if(b.dataset.bk==="no"){ box.innerHTML=""; return; }
      if(b.dataset.bk==="replace"){ S=migrate(D); S.upd=Date.now(); }
      else mergeInto(D);
      ixDirty(); save(); box.innerHTML=""; $("perfForm").innerHTML=""; if(fromSetup) ssSet("pd-ok","");
      if(S.pin&&ssGet("pd-ok")!=="1") showLock(); render(); toast("Respaldo restaurado"); };
  });
}

/* ---- instalación ---- */
const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
const isStandalone=()=>window.navigator.standalone===true||(window.matchMedia&&matchMedia("(display-mode: standalone)").matches);
function showInstallTip(){ return isIOS&&!isStandalone()&&ssGet("pd-noinst")!=="1"; }
if("serviceWorker" in navigator && location.protocol==="https:"){
  navigator.serviceWorker.register("sw.js").then(reg=>{
    reg.addEventListener("updatefound",()=>{ const nw=reg.installing; if(!nw) return;
      nw.addEventListener("statechange",()=>{ if(nw.state==="installed"&&navigator.serviceWorker.controller){
        $("updHost").innerHTML=`<button class="update" id="updGo">Hay una versión nueva. Toca para actualizar</button>`;
        $("updGo").onclick=()=>{ nw.postMessage("skip"); }; } }); });
  }).catch(()=>{});
  let reloaded=false; navigator.serviceWorker.addEventListener("controllerchange",()=>{ if(reloaded) return; reloaded=true; location.reload(); });
}

/* ====================== EVENTOS ====================== */
document.querySelector(".tabs").onclick=e=>{ const b=e.target.closest("[data-tab]"); if(!b)return; TAB=b.dataset.tab; if(TAB==="ajus") $("perfForm").innerHTML=""; render(); window.scrollTo(0,0); };
$("dPrev").onclick=()=>{ CUR=addDays(CUR,-1); PREV=[]; PREV_UNK=[]; PREV_FIX=[]; PREV_NOTE=""; render(); };
$("dNext").onclick=()=>{ if(CUR<TODAY()){ CUR=addDays(CUR,1); PREV=[]; PREV_UNK=[]; PREV_FIX=[]; PREV_NOTE=""; render(); } };
$("btnParse").onclick=doParse;
$("inTxt").addEventListener("keydown",e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); doParse(); } });
$("btnManual").onclick=()=>openManual("");
$("mealSel").onchange=renderPreview;
$("meals").onclick=e=>{ const b=e.target.closest("[data-edit]"); if(b) openEdit(b.dataset.edit); };
$("aPlus").onclick=()=>{ const d=ensureDay(CUR); d.agua=(d.agua||0)+1; touchDay(CUR); renderHoy(); };
$("aMinus").onclick=()=>{ const d=ensureDay(CUR); d.agua=Math.max(0,(d.agua||0)-1); touchDay(CUR); renderHoy(); };
$("installX").onclick=()=>{ ssSet("pd-noinst","1"); $("installTip").hidden=true; };
$("fSearch").oninput=()=>{ if(FFILTER==="learn") FFILTER="all"; renderAlim(); };
$("fFilter").onclick=e=>{ const b=e.target.closest("[data-f]"); if(!b)return; FFILTER=b.dataset.f; renderAlim(); };
$("pesoGo").onclick=()=>{ const v=parseFloat(String($("pesoIn").value).replace(",",".")); if(!(v>=30&&v<=250)){toast("Escribe tu peso en kilos, por ejemplo 65,4");return;}
  S.pesos=(S.pesos||[]).filter(p=>p.f!==TODAY()); S.pesos.push({f:TODAY(),kg:v}); S.perfil.peso=v; touchPerfil(); $("pesoIn").value=""; renderHist(); toast("Peso registrado, meta recalculada"); };
$("perfSave").onclick=()=>{ const p=readPerfil("a",S.perfil); if(typeof p==="string"){toast(p);return;}
  const mk=+$("aMk").value, mp=+$("aMp").value; p.metaKcal=mk>=1000&&mk<=6000?mk:0; p.metaProt=mp>=20&&mp<=400?mp:0; p.nombre=$("aNombre").value.trim().slice(0,40);
  S.perfil=p; touchPerfil(); render(); toast("Perfil guardado"); };
$("pinSave").onclick=async()=>{ const o=$("pOld").value.trim(), n=$("pNew").value.trim(), m=$("pinMsg");
  if(await hashPin(o)!==S.pin){ m.textContent="El PIN actual no coincide."; m.className="small err"; m.hidden=false; return; }
  if(!/^\d{4,8}$/.test(n)){ m.textContent="El PIN nuevo debe tener entre 4 y 8 dígitos."; m.className="small err"; m.hidden=false; return; }
  S.pin=await hashPin(n); touchPerfil(); $("pOld").value=""; $("pNew").value=""; m.textContent="PIN cambiado."; m.className="small"; m.hidden=false; };
$("bkOut").onclick=exportBk;
$("bkIn").onchange=e=>{ if(e.target.files[0]) importBk(e.target.files[0],$("bkBox"),false); e.target.value=""; };
$("setupBk").onchange=e=>{ if(e.target.files[0]) importBk(e.target.files[0],$("setupBkBox"),true); e.target.value=""; };
function wipeUI(box,onCancel){
  box.innerHTML=`<p class="small">Se borra tu perfil, tus días y tus alimentos de este teléfono. Si no tienes respaldo, no se pueden recuperar. Escribe BORRAR para confirmar.</p>
    <input id="wipeTxt" type="text" autocomplete="off" aria-label="Escribe BORRAR"><div class="row"><button class="btn danger" id="wipe2">Borrar definitivamente</button><button class="btn ghost" id="wipeNo">Cancelar</button></div>`;
  $("wipeNo").onclick=onCancel;
  $("wipe2").onclick=()=>{ if($("wipeTxt").value.trim().toUpperCase()!=="BORRAR"){toast("Escribe BORRAR para confirmar");return;}
    S=blank(); save(); ssSet("pd-ok",""); location.reload(); };
}
function wipeStart(){ wipeUI($("wipeBox"),()=>{ $("wipeBox").innerHTML=`<button class="btn danger" id="wipe1">Borrar todos mis datos</button>`; $("wipe1").onclick=wipeStart; }); }
$("wipe1").onclick=wipeStart;
$("lockForgot").onclick=()=>{ const box=$("forgotBox");
  box.innerHTML=`<div class="stack" style="text-align:left"><p class="small">El PIN no se puede recuperar porque nada sale de este teléfono. Tienes dos caminos: restaurar un respaldo (vuelve con el PIN que tenía ese respaldo) o borrar todo y empezar de nuevo.</p>
    <label class="btn photo-label">Restaurar un respaldo<input type="file" id="forgotBk" accept="application/json,.json"></label><button class="btn danger" id="forgotWipe">Borrar todo</button><div id="forgotBkBox"></div></div>`;
  $("forgotBk").onchange=e=>{ if(e.target.files[0]){ readBk(e.target.files[0],(err,D)=>{ if(err){ $("forgotBkBox").innerHTML=`<p class="err">${esc(err)}</p>`; return; } S=migrate(D); ixDirty(); save(); $("forgotBkBox").innerHTML=`<p class="small">Respaldo restaurado. Entra con el PIN de ese respaldo.</p>`; }); } e.target.value=""; };
  $("forgotWipe").onclick=()=>wipeUI($("forgotBkBox"),()=>{ $("forgotBkBox").innerHTML=""; }); };
$("setupGo").onclick=async()=>{
  const p=readPerfil("s",null), err=$("setupErr");
  if(typeof p==="string"){ err.textContent=p; err.hidden=false; return; }
  p.nombre=$("sNombre").value.trim().slice(0,40);
  if(!p.nombre){ err.textContent="Escribe tu nombre."; err.hidden=false; return; }
  const a=$("sPin").value.trim(), b=$("sPin2").value.trim();
  if(!/^\d{4,8}$/.test(a)){ err.textContent="El PIN debe tener entre 4 y 8 dígitos."; err.hidden=false; return; }
  if(a!==b){ err.textContent="Los dos PIN no coinciden."; err.hidden=false; return; }
  p.metaKcal=0; p.metaProt=0; S.perfil=p; S.pin=await hashPin(a); S.pesos=[{f:TODAY(),kg:p.peso}];
  ssSet("pd-ok","1"); touchPerfil(); render(); toast("Listo, "+p.nombre+". Registra tu primera comida");
};
$("lockGo").onclick=tryUnlock;
$("lockIn").addEventListener("keydown",e=>{ if(e.key==="Enter") tryUnlock(); });
document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="hidden") ssSet("pd-hid",String(Date.now()));
  else { const h=+ssGet("pd-hid")||0; if(S.pin&&h&&Date.now()-h>10*60*1000){ ssSet("pd-ok",""); showLock(); }
    if(CUR!==TODAY()&&render.lastDay&&CUR===render.lastDay){ CUR=TODAY(); } render.lastDay=TODAY(); if(!$("lock").hidden) return; render(); } });

$("dSeg").onclick=e=>{ const b=e.target.closest("[data-d]"); if(!b)return; DSEG=b.dataset.d; renderDesp(); };
$("dAdd").onclick=()=>{ const t=$("dIn").value.trim(); if(!t) return; const n=addToPantry(textToEntries(t),$("dLoc").value); touchPerfil(); $("dIn").value=""; $("dMsg").textContent=`Agregué ${n} a tu despensa.`; renderDesp(); };
$("dList").onclick=e=>{ const b=e.target.closest("button"); if(!b) return;
  if(b.dataset.st){ const it=S.desp.find(x=>x.id===b.dataset.st); if(!it) return; it.st=it.st==="hay"?"poco":"hay"; touchPerfil(); renderDesp(); }
  if(b.dataset.out){ const it=S.desp.find(x=>x.id===b.dataset.out); if(!it) return; S.desp=S.desp.filter(x=>x!==it); const f=it.fid?ix().byId[it.fid]:null;
    addToShop([{n:it.n,fid:it.fid,q:f?f.q:"",x:1,f}]); touchPerfil(); renderDesp(); toast(`${it.n} pasó a la lista de compras`); } };
$("cAdd").onclick=()=>{ const t=$("cIn").value.trim(); if(!t) return; const n=addToShop(textToEntries(t)); touchPerfil(); $("cIn").value=""; renderDesp(); toast(`Agregué ${n} a compras`); };
$("cList").onchange=e=>{ const c=e.target.closest("[data-ck]"); if(!c) return; const it=S.compras.find(x=>x.id===c.dataset.ck); if(it){ it.done=c.checked; touchPerfil(); renderDesp(); } };
$("cList").onclick=e=>{ const b=e.target.closest("[data-cx]"); if(!b) return; e.preventDefault(); S.compras=S.compras.filter(x=>x.id!==b.dataset.cx); touchPerfil(); renderDesp(); };
$("cDone").onclick=()=>{ const done=S.compras.filter(c=>c.done); if(!done.length){ toast("Marca primero lo que compraste"); return; }
  addToPantry(done.map(c=>{ const f=c.fid?ix().byId[c.fid]:null; return {n:c.n,fid:c.fid,base:f?baseOf(f):null,f}; }),"auto");
  S.compras=S.compras.filter(c=>!c.done); touchPerfil(); renderDesp(); toast(`${done.length} ${done.length===1?"cosa pasó":"cosas pasaron"} a la despensa`); };
$("cClear").onclick=()=>{ const n=S.compras.filter(c=>c.done).length; S.compras=S.compras.filter(c=>!c.done); touchPerfil(); renderDesp(); toast(n?`Borré ${n}`:"No hay nada marcado"); };
$("mStrict").onchange=e=>{ S.cfg.soloDesp=e.target.checked; touchPerfil(); };
$("mGo").onclick=buildMenu;
$("mShop").onclick=menuToShop;

/* ====================== ARRANQUE ====================== */
render.lastDay=TODAY();
if(S.pin && ssGet("pd-ok")!=="1") showLock();
render();
