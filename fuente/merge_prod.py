import glob,re,unicodedata
def norm(s): s=unicodedata.normalize('NFD',s.lower()); s=''.join(c for c in s if unicodedata.category(c)!='Mn'); return re.sub(r'\s+',' ',re.sub(r'[^a-z0-9/.,%\s]',' ',s)).strip()
rows,seen,flag=[],set(),[]
for fn in sorted(glob.glob('/home/claude/plato/agentes/*.txt')):
  for ln in open(fn):
    ln=ln.strip().strip('`')
    if ln.count('|')<12 or ln.upper().startswith('NOTAS') or ln.startswith('Marca|'): continue
    a=[x.strip() for x in ln.split('|')]
    if len(a)==13: a.append('')
    if len(a)>14: a=a[:13]+['|'.join(a[13:])]
    try: nums=[float(a[i].replace(',','.') or 0) for i in (4,5,6,7,8,9,10,11)]
    except: flag.append(('nonum',ln)); continue
    gr,k,p,c,g,fi,l,fr=nums
    if k<0 or k>2500: flag.append(('kcal',ln)); continue
    est=4*p+4*c+9*g
    if k>40 and abs(est-k)>max(40,0.3*k): flag.append(('macro %d vs %d'%(k,est),ln))
    key=norm(a[0]+' '+a[1])
    if key in seen: continue
    seen.add(key)
    a[2]=','.join(sorted(set(norm(x) for x in a[2].split(',') if norm(x)),key=lambda x:a[2].lower().find(x) if x in a[2].lower() else 999))
    a[12]=','.join(x for x in re.split(r'[,\s]+',a[12].upper()) if x in 'AGSC' and x)
    a[3]=a[3].replace('|','/')
    rows.append('|'.join([a[0],a[1],a[2],a[3]]+[('%g'%v) for v in nums]+[a[12],a[13]]))
open('/home/claude/plato/parts/productos.js','w').write('/* Productos de marca con valores de etiqueta (por porción de consumo).\n   Marca | Producto | alias | porción | g/ml | kcal | prot | carb | grasa | fibra | lácteo | fruta | sellos (A,G,S,C) | fuente */\nconst PROD_TXT=`\n'+'\n'.join(r.replace('`',"'") for r in rows)+'\n`;\n')
print('productos',len(rows)); print('marcas',len(set(r.split('|')[0] for r in rows)))
for f in flag: print('REVISAR',f[0],'::',f[1][:150])
