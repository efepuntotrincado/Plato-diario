import json,re,hashlib,os
P='parts/'
css=open(P+'style_old.css').read()
head=open(P+'head.html').read().replace('/*CSS_OLD*/',css)
html=head+open(P+'body.html').read()+'<script>\n"use strict";\n'+open(P+'db.js').read()+'\n'+open(P+'engine.js').read()+'\n'+open(P+'app.js').read()+'\n</script>\n</body>\n</html>\n'
os.makedirs('dist',exist_ok=True)
open('dist/index.html','w').write(html)
ver=hashlib.sha1(html.encode()).hexdigest()[:10]
sw=open(P+'sw.js').read().replace('__VER__',ver)
open('dist/sw.js','w').write(sw)
print('index.html',len(html)//1024,'KB · cache',ver)
