/* ====================== MOTOR LOCAL ======================
   Todo corre en el teléfono: lectura del texto, corrección de faltas, cantidades,
   aprendizaje de palabras nuevas, planificador de comidas y consejos. */
const FIELDS=["k","p","c","g","fi","v","fr","l"];
function norm(s){return String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9\/.,%\s]/g," ").replace(/\s+/g," ").trim()}
function slug(s){return norm(s).replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
function round2(x){return Math.round(x*100)/100}
function parseBase(txt){
  return txt.trim().split("\n").map(ln=>{
    const a=ln.split("|"); const fl=(a[12]||"").split(",").filter(Boolean);
    const f={id:"b:"+slug(a[0]),n:a[0],al:a[1].split(",").map(norm),q:a[2],gr:+a[3],src:"base",x:{},leg:0,pes:0,fry:0,cnt:0};
    FIELDS.forEach((k,j)=>f[k]=+a[4+j]);
    fl.forEach(t=>{ if(t==="leg")f.leg=1; else if(t==="pes")f.pes=1; else if(t==="fry")f.fry=1;
      else if(/^cnt/.test(t))f.cnt=+t.slice(3);
      else { const m=t.match(/^([a-z]+)([\d.]+)$/); if(m) f.x[m[1]]=+m[2]; }});
    return f;
  });
}
const BASE=parseBase(BASE_TXT);
const WATER={id:"agua",n:"Agua",al:["agua","agua mineral","agua con gas","agua sin gas","vaso de agua"],q:"1 vaso (250 ml)",gr:250,src:"base",x:{litro:4,litros:4,botella:2,botellas:2,jarro:1.5},water:1,k:0,p:0,c:0,g:0,fi:0,v:0,fr:0,l:0,leg:0,pes:0,fry:0,cnt:0};
const BYNAME={}; BASE.forEach(f=>BYNAME[f.n]=f);
const HUEVO="Huevo (revuelto en agua, duro o a la copa)";

const QW={un:1,una:1,uno:1,dos:2,tres:3,cuatro:4,cinco:5,seis:6,siete:7,ocho:8,nueve:9,diez:10,medio:.5,media:.5,cuarto:.25,doble:2,par:2};
const SIZE={grande:1.3,grandes:1.3,chico:.7,chica:.7,chicos:.7,chicas:.7,pequeno:.7,pequena:.7,harto:1.5,harta:1.5,hartos:1.5,hartas:1.5,abundante:1.5,poco:.5,poquito:.4,poca:.5};
const UNITS="g gr grs gramos ml cc kg litro litros taza tazas vaso vasos cucharada cucharadas cucharadita cucharaditas cda cdas cdta cdtas unidad unidades porcion porciones trozo trozos rebanada rebanadas lamina laminas lata latas bolsa bolsas punado punados pedazo pedazos plato platos pocillo botella botellas caja cajas copa copas jarro rodaja rodajas filete filetes presa presas".split(" ");
const STOP=new Set(("me comi comimos comio comiste tome tomamos tomo bebi desayune almorce cene once onces comer tomar hoy ayer en el la los las lo un una unos unas de del con sin y e o u a al para por que mas muy bien mi mis su sus tambien luego despues antes desayuno almuerzo cena colacion manana tarde noche dia mediodia "+
 "cocido cocida cocidos cocidas revuelto revueltos revuelta revueltas frito frita fritos fritas apanado apanada apanados plancha horno vapor hervido hervida hervidos asado asada asados salteado salteada salteados crudo cruda crudos grillado grillada parrilla sarten microondas "+
 "grande grandes chico chica chicos chicas pequeno pequena mediano mediana medianos entero entera enteros natural light diet casero casera caseros caseras solo sola solos caliente frio fria tibio tibia rico rica ricos ademas igual como otra otro otros otras nada algo tipo estilo etc eso esto esta este ese esa ahi aca alla casi hasta cada todo toda todos porque pero ya le les se nos fue era estaba habia hice hizo preparado preparada picado picada picados rallado rallada molido molida trozado trozada "+
 "ymedia harto harta hartos hartas poco poca poquito abundante algunos algunas varios varias cerca aprox aproximadamente unos lleno llena normal normales clasico clasica tradicional").split(" ").concat(UNITS));
STOP.delete("te");

function isAl(ch){return !!ch && /[a-z0-9]/.test(ch)}
function parseNum(s){s=String(s).replace(",",".");if(/^\d+\/\d+$/.test(s)){const [a,b]=s.split("/").map(Number);return b?a/b:null} const n=parseFloat(s);return isFinite(n)?n:null}
function isNumTok(w){return /^\d+([.,]\d+)?$|^\d+\/\d+$/.test(w)}

/* Damerau-Levenshtein (alineación óptima) con corte temprano */
function dist(a,b,max){
  if(Math.abs(a.length-b.length)>max) return max+1;
  const m=a.length,n=b.length; let p2=null,p1=Array.from({length:n+1},(_,j)=>j);
  for(let i=1;i<=m;i++){ const cur=[i]; let best=i;
    for(let j=1;j<=n;j++){ const c=a[i-1]===b[j-1]?0:1;
      let v=Math.min(p1[j]+1,cur[j-1]+1,p1[j-1]+c);
      if(p2&&i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1]) v=Math.min(v,p2[j-2]+1);
      cur.push(v); if(v<best)best=v; }
    if(best>max) return max+1; p2=p1; p1=cur; }
  return p1[n];
}

/* Índice de alias: base + alimentos propios + palabras aprendidas */
function buildIndex(mis,learned){
  const foods=(mis||[]).concat(BASE,[WATER]); const byId={}; foods.forEach(f=>byId[f.id]=f);
  const list=[], vocab=new Set();
  const add=(a,f)=>{ if(!a)return; list.push({a,f}); a.split(" ").forEach(w=>vocab.add(w));
    if(!/\s/.test(a)&&!/s$/.test(a)){ list.push({a:a+"s",f}); if(/[^aeiou]$/.test(a)) list.push({a:a+"es",f}); } };
  foods.forEach(f=>{ const set=new Set(f.al&&f.al.length?f.al:[]); set.add(norm(f.n).replace(/\s*\(.*$/,"")); [...set].forEach(a=>add(a,f)); });
  Object.entries(learned||{}).forEach(([w,id])=>{ if(byId[id]) add(norm(w),byId[id]); });
  list.sort((x,y)=>y.a.length-x.a.length || (x.f.src==="mio"?-1:1));
  return {list,vocab,byId,foods};
}

/* Corrige faltas, diminutivos y plurales palabra por palabra */
function correct(t,IX){
  const fixes=[];
  const out=t.split(" ").map(w=>{
    if(!w||w.length<3||IX.vocab.has(w)||STOP.has(w)||QW[w]!=null||SIZE[w]!=null||isNumTok(w)||/\d/.test(w)) return w;
    const tryW=c=>IX.vocab.has(c)?c:null;
    // diminutivos: huevito, pancito, cafecito, lechita, papitas
    let m=w.match(/^(.+?)(cit[oa]s?|it[oa]s?|ill[oa]s?)$/);
    if(m){ const b=m[1]; const r=tryW(b)||tryW(b+"o")||tryW(b+"a")||tryW(b+"e")||(b.endsWith("qu")&&tryW(b.slice(0,-2)+"co"))||(b.endsWith("gu")&&tryW(b.slice(0,-2)+"ga"));
      if(r){ if(w.endsWith("s")&&IX.vocab.has(r+"s")) return r+"s"; return r; } }
    // variantes de pronunciación chilena (quesiyo, pebre/pevre, zapayo)
    const ph=[w.replace(/y/g,"ll"),w.replace(/ll/g,"y"),w.replace(/v/g,"b"),w.replace(/b/g,"v"),w.replace(/z/g,"s"),w.replace(/s/g,"z"),w.replace(/k/g,"c"),w.replace(/^h?ue/,"hue"),w.replace(/h/g,"")];
    for(const c of ph){ if(c!==w&&IX.vocab.has(c)){ fixes.push([w,c]); return c; } }
    // plurales que no están en el índice
    if(w.endsWith("es")&&tryW(w.slice(0,-2))) return w.slice(0,-2);
    if(w.endsWith("s")&&tryW(w.slice(0,-1))) return w.slice(0,-1);
    // faltas de ortografía
    const max=w.length<=4?1:w.length<=7?1:2; let best=null,bd=max+1;
    for(const v of IX.vocab){ if(v.length<3||Math.abs(v.length-w.length)>max||v[0]!==w[0]&&w.length<6) continue;
      const d=dist(w,v,max); if(d<bd||(d===bd&&best&&v.length===w.length&&best.length!==w.length)){bd=d;best=v;} if(bd===0)break; }
    if(best&&bd<=max&&!STOP.has(best)){ fixes.push([w,best]); return best; }
    return w;
  });
  return {t:out.join(" "),fixes};
}

/* Lee el texto y devuelve alimentos con cantidad */
function parseText(text,IX){
  let raw=" "+norm(text)+" ";
  raw=raw.replace(/ y medi[oa](?= )/g," ymedia").replace(/ (en|con) agua(?= )/g," ").replace(/ cocid[oa]s? en agua /g," ");
  const cor=correct(raw.trim(),IX); const t=" "+cor.t+" ";
  const taken=new Array(t.length).fill(false), found=[];
  IX.list.forEach(({a,f})=>{
    let i=t.indexOf(a);
    while(i>=0){ const e=i+a.length;
      if(!isAl(t[i-1])&&!isAl(t[e])){ let free=true; for(let j=i;j<e;j++) if(taken[j]){free=false;break}
        if(free){for(let j=i;j<e;j++)taken[j]=true; found.push({s:i,e,f});} }
      i=t.indexOf(a,i+1); }
  });
  found.sort((x,y)=>x.s-y.s);
  const items=[];
  found.forEach((m,idx)=>{
    const prevEnd=idx?found[idx-1].e:0, nextStart=idx<found.length-1?found[idx+1].s:t.length;
    let pre=t.slice(prevEnd,m.s); const suf=t.slice(m.e,nextStart); const f=m.f;
    pre=pre.split(/\s(?:y|e|con|mas|ademas|luego|despues|tambien)\s|[,+;]/).pop();
    let fac=1, qtxt="", byAmount=false;
    const gm=pre.match(/(\d+(?:[.,]\d+)?)\s*(g|gr|grs|gramos|ml|cc|kg)\s*(?:de\s+)?$/) || suf.match(/^\s*(?:de\s+)?(\d+(?:[.,]\d+)?)\s*(g|gr|grs|gramos|ml|cc|kg)\b/);
    if(gm && f.gr>0){ let g=parseNum(gm[1]); if(gm[2]==="kg") g*=1000; fac=g/f.gr; byAmount=true; qtxt=Math.round(g)+" "+(/ml|cc/.test(gm[2])?"ml":"g"); }
    else{
      const toks=pre.trim().split(" ").filter(Boolean);
      let cnt=null, ci=-1;
      toks.forEach((w,i)=>{ if(w==="ymedia"){ if(cnt!=null)cnt+=.5; return; } const v=QW[w]!=null?QW[w]:(isNumTok(w)?parseNum(w):null); if(v!=null){ cnt=v; ci=i; } });
      let unitF=null;
      toks.slice(ci+1).forEach(w=>{ const b=w.replace(/(es|s)$/,""); if(f.x[w]!=null)unitF=f.x[w]; else if(f.x[b]!=null)unitF=f.x[b]; });
      if(cnt!=null) fac=cnt*(unitF!=null?unitF:(f.cnt||1)); else if(unitF!=null) fac=unitF;
    }
    // tamaño: grande, chico, harto, un poco
    const near=pre.trim().split(" ").slice(-3).concat(suf.trim().split(" ").slice(0,2));
    let sz=1; near.forEach(w=>{ if(SIZE[w]!=null) sz=SIZE[w]; }); if(!byAmount) fac*=sz;
    if(!(fac>0)) fac=1;
    if(f.water){ items.push({water:1,n:"Agua",q:"vasos de 250 ml",f:Math.max(1,Math.round(fac*2)/2),b:{k:0,p:0,c:0,g:0,fi:0,v:0,fr:0,l:0}}); return; }
    let name=f.n, b={}; FIELDS.forEach(k=>b[k]=f[k]);
    if(f.fry && /frit|apanad/.test(suf.slice(0,24))){ b.k+=60; b.g+=6.5; name+=" (frito)"; }
    if(byAmount){ FIELDS.forEach(k=>b[k]=round2(b[k]*fac)); fac=1; }
    items.push({n:name,q:qtxt||f.q,f:round2(fac),b,leg:f.leg,pes:f.pes,src:f.src==="mio"?"mio":"base",fid:f.id});
  });
  // palabras que no reconocí
  const unknown=[]; let w="", ws=0;
  const flush=end=>{ if(w.length>=3&&!STOP.has(w)&&QW[w]==null&&SIZE[w]==null&&!isNumTok(w)&&!/^\d/.test(w)&&!unknown.includes(w)) unknown.push(w); w=""; };
  for(let i=0;i<t.length;i++){ const ch=t[i]; if(isAl(ch)&&!taken[i]){ if(!w)ws=i; w+=ch; } else flush(i); }
  return {items,unknown,fixes:cor.fixes};
}

/* Candidatos para una palabra que no reconocí */
function suggestFoods(word,IX,n){
  const w=norm(word); const grams=s=>{const g=new Set(); const x="  "+s+" "; for(let i=0;i<x.length-2;i++)g.add(x.slice(i,i+3)); return g;};
  const gw=grams(w); const scored=[];
  IX.foods.filter(f=>!f.water).forEach(f=>{ let best=0;
    (f.al&&f.al.length?f.al:[norm(f.n)]).concat([norm(f.n)]).forEach(a=>{ a.split(" ").concat([a]).forEach(part=>{ const ga=grams(part); let inter=0; gw.forEach(g=>{if(ga.has(g))inter++;}); const s=inter/(gw.size+ga.size-inter); if(s>best)best=s; }); });
    scored.push([best,f]); });
  return scored.sort((a,b)=>b[0]-a[0]).slice(0,n||6).filter(x=>x[0]>0.12).map(x=>x[1]);
}

/* ====================== PLANIFICADOR ====================== */
const SLOTS=[["desayuno",5,11,.25],["colacion",11,12.5,.1],["almuerzo",12.5,16,.33],["once",16,19.5,.17],["cena",19.5,24,.25]];
const T_DES=[[["Avena",1],["Leche descremada",1],["Plátano",1]],[[HUEVO,2],["Pan de molde integral",2],["Palta",1],["Tomate",1]],[["Yogur proteico",1],["Granola",.5],["Frutillas",1]],[[HUEVO,2],["Marraqueta",1],["Quesillo",1],["Naranja",1]],[["Leche semidescremada",1],["Pan ciabatta",1],["Jamón de pavo",3],["Queso laminado (gauda o mantecoso)",1]],[["Yogur griego",1],["Avena",1],["Arándanos",1]]];
const T_COL=[[["Manzana",1],["Almendras",1]],[["Yogur proteico",1],["Plátano",1]],[["Plátano",1],["Mantequilla de maní",1],["Pan de molde integral",1]],[["Leche descremada",1],["Nueces",1]],[["Queso cottage",1],["Arándanos",1]],[[HUEVO,2],["Zanahoria",1]]];
const T_ONCE=[[["Marraqueta",1],["Palta",2],[HUEVO,1],["Café o té solo",1]],[["Pan de molde integral",2],["Quesillo",1],["Tomate",1],["Café o té solo",1]],[["Hallulla",1],["Jamón de pavo",3],["Queso laminado (gauda o mantecoso)",1],["Café o té solo",1]],[["Yogur natural",1],["Avena",1],["Manzana",1]],[["Pan ciabatta",1],["Atún al agua",.5],["Lechuga",1],["Tomate",1]]];
const MP=[["Pechuga de pollo",1],["Bistec (posta o asiento)",1],["Salmón",1],["Merluza o reineta",1],["Carne molida",1],["Pavo",1],["Lentejas",1.5],["Atún al agua",1],["Garbanzos",1],[HUEVO,3],["Porotos",1.5]];
const MC=[["Arroz blanco",1],["Fideos",1],["Papa cocida",1.5],["Quínoa",1],["Arroz integral",1],["Puré de papas",1],["Camote",1],[null,0]];
const MV=[["Ensalada chilena",1],["Brócoli",1],["Ensalada mixta",1],["Zapallo italiano",1],["Porotos verdes",1],["Espinaca",1],["Zanahoria",1],["Coliflor",1]];

function slotNow(h){ for(let i=SLOTS.length-1;i>=0;i--) if(h>=SLOTS[i][1]) return i; return 4; }
function sumComp(comp){ const t={k:0,p:0,c:0,g:0,fi:0,v:0,fr:0,l:0,leg:0,pes:0}; comp.forEach(([f,x])=>{ FIELDS.forEach(k=>t[k]+=f[k]*x); if(f.leg)t.leg=1; if(f.pes)t.pes=1; }); return t; }
function score(t,tg,ctx){
  let e=Math.abs(t.k-tg.k)/Math.max(tg.k,150);
  e+=Math.max(0,tg.p-t.p)/Math.max(tg.p,12)*2.2 + Math.max(0,t.p-tg.p*1.7)/Math.max(tg.p,12)*.4;
  e+=Math.max(0,tg.v-t.v)*.35 + Math.max(0,tg.fr-t.fr)*.2;
  if(ctx.wantLeg&&t.leg) e-=.08; if(ctx.wantPes&&t.pes) e-=.08;
  return e;
}
function prefOf(comp,ctx){ let s=0; comp.forEach(([f])=>{ const fq=ctx.freq[f.n]||0; s-=Math.min(.12,Math.log1p(fq)*.03); if(ctx.eaten.has(f.n)) s+=(f.p>10?.35:.15); }); return s; }
const F=n=>BYNAME[n];
function qround(f,x){ return /^(1|2) (unidad|lamina|lámina|rebanada|clara|rodaja)/.test(f.q)||f.n===HUEVO ? Math.max(1,Math.round(x)) : Math.max(.5,Math.round(x*2)/2); }
function bestTemplates(tpls,tg,ctx,top){
  const res=[];
  tpls.forEach((tp,ti)=>{
    const comp0=tp.map(([n,x])=>[F(n),x]).filter(c=>c[0]); if(!comp0.length) return;
    let pi=0; comp0.forEach((c,i)=>{ if(c[0].p*c[1]>comp0[pi][0].p*comp0[pi][1]) pi=i; });
    let best=null;
    [.75,1,1.25,1.5,2].forEach(g=>[1,1.5,2].forEach(pb=>{
      const comp=comp0.map(([f,x],i)=>{ const scal=f.k>15&&!f.fr; return [f,scal?qround(f,Math.min(x*2,x*g*(i===pi?pb:1))):x]; });
      const t=sumComp(comp); const s=score(t,tg,ctx)+prefOf(comp,ctx)+((ti*13+ctx.seed)%7)*.004;
      if(!best||s<best.s) best={s,comp,t}; }));
    res.push(best);
  });
  return res.sort((a,b)=>a.s-b.s).slice(0,top);
}
function bestMains(tg,ctx,top){
  const byP={};
  MP.forEach(([pn,px],pi)=>{ const P=F(pn); if(!P) return;
    const [vn,vx]=MV[(pi*3+ctx.seed)%MV.length]; let V=F(vn); if(ctx.eaten.has(vn)) V=F(MV[(pi*3+ctx.seed+1)%MV.length][0]);
    const vf=Math.min(2,Math.max(1,Math.ceil((tg.v||0)/Math.max(V.v,.5)*2)/2));
    MC.forEach(([cn,cx],ci)=>{ const C=cn?F(cn):null; if(cn&&!C) return; if(!C&&!P.leg) return;
      [.67,1,1.33,1.67].forEach(pf=>(C?[.5,.75,1,1.5,2]:[1]).forEach(cf=>[0,1,2,3].forEach(oil=>{
        const comp=[[P,qround(P,px*pf)]]; if(C) comp.push([C,qround(C,cx*cf)]); comp.push([V,vx*vf]); if(oil) comp.push([F("Aceite"),oil]);
        const t=sumComp(comp); const s=score(t,tg,ctx)+prefOf(comp,ctx)+((pi*7+ci*3+ctx.seed)%11)*.003;
        if(!byP[pn]||s<byP[pn].s) byP[pn]={s,comp,t}; }))); }); });
  return Object.values(byP).sort((a,b)=>a.s-b.s).slice(0,top);
}
/* ctx: {M, T, dayItems, hour, freq, weekLeg, weekPes, seed} */
function planRest(ctx){
  const M=ctx.M, T=ctx.T; const gap={k:M.kcal-T.k,p:M.prot-T.p,v:M.v-T.v,fr:M.fr-T.fr};
  if(gap.k<120&&gap.p<8) return {done:true,gap,meals:[]};
  const cur=slotNow(ctx.hour); const used=new Set(ctx.dayItems.map(i=>i.t));
  let rem=SLOTS.map((s,i)=>i).filter(i=>i>cur||(i===cur&&!used.has(SLOTS[i][0])));
  const mainsLeft=rem.filter(i=>SLOTS[i][0]!=="colacion").length;
  if(rem.includes(1)&&!(gap.k/Math.max(1,mainsLeft)>650)) rem=rem.filter(i=>i!==1);
  if(!rem.length) rem=[1];
  const wsum=rem.reduce((a,i)=>a+SLOTS[i][3],0);
  const vegSlots=rem.filter(i=>[2,4].includes(i)), frSlots=rem.filter(i=>[0,1,3].includes(i));
  const eaten=new Set(ctx.dayItems.map(i=>i.n));
  const c2={freq:ctx.freq||{},eaten,wantLeg:ctx.weekLeg<2,wantPes:ctx.weekPes<2,seed:ctx.seed||0};
  const meals=[]; let left={...gap};
  rem.forEach((i,ord)=>{
    const w=SLOTS[i][3]/rem.slice(ord).reduce((a,j)=>a+SLOTS[j][3],0);
    const tg={k:Math.max(150,left.k*w),p:Math.max(0,left.p*w),
      v:vegSlots.length?(vegSlots.includes(i)?Math.max(0,left.v)/vegSlots.filter(j=>rem.indexOf(j)>=ord).length:0):Math.max(0,left.v)*w,
      fr:frSlots.includes(i)?Math.max(0,left.fr)/Math.max(1,frSlots.filter(j=>rem.indexOf(j)>=ord).length):0};
    const key=SLOTS[i][0];
    const opts=key==="desayuno"?bestTemplates(T_DES,tg,c2,3):key==="colacion"?bestTemplates(T_COL,tg,c2,3):key==="once"?bestTemplates(T_ONCE,tg,c2,3):bestMains(tg,c2,3);
    meals.push({slot:key,tg,opts});
    const pick=opts[0]; if(pick){ left.k-=pick.t.k; left.p-=pick.t.p; left.v-=pick.t.v; left.fr-=pick.t.fr; pick.comp.forEach(([f])=>c2.eaten.add(f.n)); }
  });
  return {done:false,gap,meals};
}
function compToItems(comp){ return comp.map(([f,x])=>{ const b={}; FIELDS.forEach(k=>b[k]=f[k]); return {n:f.n,q:f.q,f:x,b,leg:f.leg,pes:f.pes,src:"plan",fid:f.id}; }); }

/* ====================== CONSEJOS ====================== */
function coach(ctx){
  const M=ctx.M,T=ctx.T,h=ctx.hour,out=[];
  if(T.v<0.5&&h>=14&&ctx.dayItems.length) out.push("Todavía no hay verduras hoy. Suma una ensalada o un plato de verduras a tu próxima comida.");
  const byMeal={}; ctx.dayItems.forEach(it=>{ const m=byMeal[it.t]||(byMeal[it.t]={k:0,p:0}); m.k+=it.b.k*it.f; m.p+=it.b.p*it.f; });
  const low=Object.entries(byMeal).find(([m,v])=>v.k>300&&v.p<18&&m!=="colacion");
  if(low) out.push(`Tu ${({desayuno:"desayuno",almuerzo:"almuerzo",once:"once",cena:"cena"})[low[0]]} tuvo ${Math.round(low[1].p)} g de proteína. Con 25 a 35 g por comida llegas más fácil a tu meta.`);
  const sweet=ctx.dayItems.filter(it=>/Bebida azucarada|Jugo|energ|Terremoto|Piscola/.test(it.n)).reduce((a,it)=>a+it.b.k*it.f,0);
  if(sweet>=180) out.push(`Las bebidas y jugos de hoy suman ${Math.round(sweet)} kcal casi sin proteína ni fibra.`);
  if(ctx.obj==="subir"&&h>=19&&T.k<M.kcal*0.7) out.push(`Para subir de peso te faltan ${Math.round(M.kcal-T.k)} kcal. Una colación densa, como plátano con mantequilla de maní o un licuado con leche, suma 300 a 400 kcal fácil.`);
  if(ctx.obj==="bajar"&&T.k>M.kcal*1.1) out.push("Hoy pasaste tu meta. Mañana prioriza proteína y verduras, que llenan con menos calorías.");
  const dow=ctx.dow; if(dow>=3&&ctx.weekLeg<2) out.push(`Esta semana llevas ${ctx.weekLeg} ${ctx.weekLeg===1?"día":"días"} con legumbres; las Guías recomiendan al menos 2.`);
  if(dow>=3&&ctx.weekPes<2) out.push(`Esta semana llevas ${ctx.weekPes} ${ctx.weekPes===1?"día":"días"} con pescado; lo recomendado son 2.`);
  return out.slice(0,2);
}

if(typeof module!=="undefined") module.exports={BASE,BYNAME,buildIndex,parseText,correct,suggestFoods,planRest,compToItems,coach,norm,FIELDS,slotNow,SLOTS};

/* "1 taza (140 g)" × 2 → "2 tazas (280 g)" */
function fmtQ(n){ const fr={0.25:"1/4",0.5:"1/2",0.75:"3/4"}; if(fr[n]) return fr[n]; const r=Math.round(n*100)/100; return String(r).replace(".",","); }
function plural(w){ if(/^(de|con|sin|cocid[oa]|cocido|chica|grande|mediana?|entero|y)$/.test(w)) return w; if(/[aeiou]$/.test(w)) return w+"s"; if(/z$/.test(w)) return w.slice(0,-1)+"ces"; if(/[lnrd]$/.test(w)) return w+"es"; if(/c$/.test(w)) return w+"s"; return w; }
function scaleQ(q,x){
  q=String(q||""); if(!x||x===1) return q;
  const m=q.match(/^(\d+\/\d+|\d+(?:[.,]\d+)?)\s+(.*)$/);
  if(!m) return fmtQ(x)+" × "+q;
  const base=m[1].includes("/")?(()=>{const [a,b]=m[1].split("/").map(Number);return a/b;})():parseFloat(m[1].replace(",","."));
  const tot=base>=10?Math.round(base*x):Math.round(base*x*100)/100;
  let rest=m[2].replace(/\((\d+(?:[.,]\d+)?)\s*(g|ml)([^)]*)\)/,(all,n,u,tail)=>"("+Math.round(parseFloat(n.replace(",","."))*x)+" "+u+tail+")");
  if(tot>1&&base<=1){ rest=rest.replace(/^([a-záéíóúñ]+)/i,w=>plural(w)); }
  return fmtQ(tot)+" "+rest;
}
if(typeof module!=="undefined") module.exports.scaleQ=scaleQ;
