/* Productos de marca con valores de etiqueta (por porción de consumo).
   Marca | Producto | alias | porción | g/ml | kcal | prot | carb | grasa | fibra | lácteo | fruta | sellos (A,G,S,C) | fuente */
const PROD_TXT=`
Soprole|Yoghurt Protein|yogurt protein,yogur proteina,yoghurt proteina,protein frutilla,protein vainilla,protein natural|1 unidad (155 g)|155|105|10.2|9.8|2.8|0|1|0||https://www.jumbo.cl/yoghurt-protein-frutilla-155-g/p
Soprole|Yoghurt Protein con trozos|yogurt protein trozos,yogur proteina trozos,protein trozos frutilla,protein trozos mango maracuya|1 unidad (155 g)|155|116|10.2|13.2|2.5|0|1|0||https://www.jumbo.cl/yoghurt-protein-trozos-de-frutilla-155-g/p
Soprole|Yoghurt Protein Power|protein power,yogurt protein power,yogur proteina power,protein power frutilla|1 pote (155 g)|155|130|16.1|11|2.3|0|1|0||https://www.jumbo.cl/yogurt-fruti-155g-2063989/p
Soprole|Yoghurt Proteína Frutos Secos|yogurt protein frutos secos,protein frutos secos,yogur proteina frutos secos|1 unidad (150 g)|150|204|12.3|14.4|10.8|0|1|0||https://www.jumbo.cl/yoghurt-cereal-1-1-pro-frutos-secos-140-g/p
Soprole|Yoghurt con cereal 1+1 Zucaritas|yogurt con cereal,uno mas uno,soprole mix,yogurt zucaritas,yogur con cereal,yogur 1 1|1 unidad (140 g)|140|179|5|25.8|6.2|0|1|0||https://www.jumbo.cl/yoghurt-1-1-soprole-140-g-zucaritas-con-cuchara/p
Soprole|Yoghurt batido 165 g|yogurt batido,yogur batido,batido frutilla,yoghurt batido grande|1 unidad (165 g)|165|150|5.8|21.8|4.5|0|1|0||https://www.jumbo.cl/yoghurt-batido-soprole-165-g-frutilla/p
Soprole|Yoghurt batido 120 g|yogurt batido,yogur batido,batido mora,batido frutilla,batido vainilla,batido chico|1 unidad (120 g)|120|101|3.7|15.5|2.6|0|1|0||https://www.jumbo.cl/yog-batido-soprole-120gr-mora-728541006/p
Soprole|Yoghurt natural aflanado|yogurt natural,yogur natural,yoghurt natural|1 unidad (155 g)|155|107|6.5|9.9|4.7|0|1|0||https://www.jumbo.cl/yoghurt-batido-soprole-155-g-natural/p
Soprole|Probiótico Uno|uno,uno probiotico,bebida lactea uno,uno frutilla,uno multifruta|1 unidad (80 ml)|80|23|1.1|4.1|0.2|0|0.4|0||https://www.jumbo.cl/bebida-lactea-soprole-uno-frutilla-multifruta-18-unid-80-ml-c-u/p
Soprole|Leche entera natural|leche entera,leche entera soprole|1 vaso (200 ml)|200|120|6.4|9.6|6.2|0|1|0||https://www.jumbo.cl/leche-soprole-natural-1-litro/p
Soprole|Leche entera cremosa|leche entera cremosa,leche cremosa|1 vaso (200 ml)|200|146|6.6|9.6|9|0|1|0||https://www.jumbo.cl/leche-entera-4-5-mg-soprole-1l-1881647/p
Soprole|Leche semidescremada|leche semidescremada,leche semi,leche semidescremada natural|1 vaso (200 ml)|200|90|6.4|9.2|3|0|1|0||https://www.jumbo.cl/leche-soprole-semi-descremada-1-litro/p
Soprole|Leche sin lactosa semidescremada|leche sin lactosa,zerolacto,leche zerolacto,leche semidescremada sin lactosa|1 vaso (200 ml)|200|92|6.4|9.8|3|0|1|0||https://www.jumbo.cl/leche-semi-descremada-zerolacto-soprole-1-l/p
Soprole|Leche chocolate semidescremada 200 ml|leche chocolate,leche con chocolate,chocolatada,leche chocolatada cajita|1 caja (200 ml)|200|100|5.8|11.8|3.2|0|1|0||https://www.jumbo.cl/leche-chocolate-soprole-caja-200-ml-semidescremada/p
Soprole|Leche chocolate En Simple|leche chocolate en simple,en simple chocolate,leche chocolatada|1 vaso (200 ml)|200|92|6|9.6|3.2|0|1|0||https://www.jumbo.cl/leche-choc-1l-2063902/p
Soprole|Leche Proteína natural|leche protein,leche proteina,leche protein natural,leche proteina blanca|1 vaso (200 ml)|200|110|12|9.8|2.6|0|1|0||https://www.jumbo.cl/leche-protein-soprole-blanca-semidesc-1l/p
Soprole|Leche Proteína chocolate|leche protein chocolate,leche proteina chocolate,protein chocolate bebible|1 vaso (200 ml)|200|126|12|12|3.8|0|1|0||https://www.jumbo.cl/leche-soprole-proteina-chocolate-1-l/p
Soprole|Leche Protein+ Power natural|protein,protein plus,protein mas,leche protein power,leche proteina power,protein bebible|1 vaso (200 ml)|200|136|16|11.2|3|0|1|0||https://www.jumbo.cl/leche-protein-1l-2086162/p
Soprole|Leche Protein+ Power peanut butter chocolate|protein plus mani,protein power peanut butter,leche proteina mani chocolate,protein chocolate|1 caja (200 ml)|200|138|16|11.2|3.2|0|1|0||https://www.jumbo.cl/leche-prote-200ml-2086164/p
Soprole|Leche cultivada Proteína natural|leche cultivada protein,cultivada protein,leche cultivada proteina|1 vaso (200 ml)|200|118|12.2|10.8|2.8|0|1|0||https://www.jumbo.cl/l-cult-prot-soprole-1l-natural-1855213004/p
Soprole|Quesillo|quesillo,quesillo soprole,quesillo sin lactosa,quesillo zerolacto|1 rebanada (30 g)|30|42|3.9|1.4|2.3|0|0.75|0||https://www.jumbo.cl/quesillo-soprole-con-sal-pote-300-g/p
Soprole|Queso mantecoso Quilque laminado|queso mantecoso,mantecoso,quilque,queso quilque|30 g|30|105|6.2|0.8|8.7|0|0.75|0|S|https://www.jumbo.cl/queso-mantecoso-quilque-granel/p
Soprole|Mantequilla Quilque|mantequilla,mantequilla quilque,mantequilla receta de campo|1 cucharadita (7 g)|7|53|0|0.1|5.8|0|0|0|G,S,C|https://www.jumbo.cl/manteq-soprole-receta-de-campo-pan-250g/p
Soprole|Manjar|manjar,dulce de leche,manjar soprole|1 cucharada (30 g)|30|94|2.4|15.6|2.4|0|0|0|A,G,C|https://www.jumbo.cl/manjar-soprole-bolsa-1-kg-2/p
Soprole|Postre Manjarate original|manjarate,postre manjarate,manjar con chocolate|1 unidad (80 g)|80|239|4.4|26.6|12.8|0|0.5|0|A,G,C|https://www.jumbo.cl/manjarate-soprole-manjar-chocolate-80-g/p
Soprole|Postre Leche asada|leche asada,postre leche asada,flan|1 unidad (120 g)|120|181|4.2|29.6|4.9|0|0.5|0|A|https://www.jumbo.cl/leche-asada-soprole-pote-120-g-2/p
Soprole|Postre Protein|postre protein,postre proteina,protein snack,postre protein chocolate,postre protein caramelo|1 unidad (130 g)|130|99|11.1|8.5|2.3|0|1|0||https://www.jumbo.cl/postre-protein-snack-soprole-choco-130gr-2051066/p
Soprole|Postre Arroz con leche|arroz con leche,postre arroz con leche|1 unidad (130 g)|130|108|4|18.5|2|0|0.5|0||https://www.jumbo.cl/arroz-con-leche-soprole-pote-130-g-2/p
Soprole|Postre Sémola con leche caramelo|semola con leche,semola caramelo,postre semola|1 unidad (140 g)|140|154|3.9|26.5|3.6|0|0.5|0||https://www.jumbo.cl/semola-con-leche-soprole-con-salsa-de-caramelo-pote-140-g-2/p
Soprole|Postre Gozzo vainilla manjar|gozzo,postre gozzo,gozzo manjar|1 unidad (100 g)|100|175|4.9|25.3|6|0|0.5|0|A,G|https://www.jumbo.cl/postre-sopro-100gr-2087329/p
Soprole|Postre Gold Creme Caramel|creme caramel,soprole gold,flan caramelo,postre gold|1 unidad (120 g)|120|224|3.2|34.8|8|0|0.5|0|A,G|https://www.jumbo.cl/postre-creme-caramel-soprole-gold-120-g/p
Colún|Yoghurt Protein Plus sin azúcar|yogurt protein plus,yogur proteina colun,protein plus frutilla,protein plus natural,protein plus sin azucar|1 sachet (150 g)|150|84|11.1|8.9|0.5|0|1|0||https://www.jumbo.cl/yog-colun-prot-plus-s-a-frutilla-150g-2007945/p
Colún|Yoghurt Protein Plus bebible 190 g|protein plus bebible,yogurt protein plus botella,protein plus frutilla 190,yogur proteina bebible|1 botella (190 g)|190|165|18.1|19|1.9|0|1|0||https://www.jumbo.cl/yoghurt-protein-plus-frutilla-190-gr-1871251001/p
Colún|Yoghurt Origen|yogurt origen,yogur origen,origen frutilla,yoghurt colun|1 vaso (120 g)|120|125|3.7|13.4|6.2|0|1|0||https://www.jumbo.cl/yoghurt-colun-origen-120g-frutilla-1959602003/p
Colún|Yoghurt Light|yogurt light,yogur light,light frutilla|1 vaso (120 g)|120|64|4.8|10.2|0.4|0|1|0||https://www.jumbo.cl/yog-colun-light-120gr-frutilla-1970302003/p
Colún|Yoghurt sin azúcar|yogurt sin azucar,yogur sin azucar,sin azucar frutilla|1 vaso (120 g)|120|52|4.4|7.7|0.4|0|1|0||https://www.jumbo.cl/yoghurt-colun-sin-azucar-120g-frutilla/p
Colún|Yoghurt Kéfir|kefir,yogurt kefir,yogur kefir,kefir frutilla|1 vaso (120 g)|120|103|3.7|13.6|3.7|0|1|0||https://www.jumbo.cl/yoghurt-kefir-colun-120g-frutilla-1961117003/p
Colún|Leche entera|leche entera,leche entera colun,leche entera sin lactosa|1 vaso (200 ml)|200|118|6.2|9.2|6.2|0|1|0||https://www.jumbo.cl/leche-entera-colun-caja-1-l-natural/p
Colún|Leche semidescremada|leche semidescremada,leche semi,leche semidescremada sin lactosa,leche sin lactosa|1 vaso (200 ml)|200|84|6.4|9.2|2.4|0|1|0||https://www.jumbo.cl/leche-colun-semi-descremada-1-litro/p
Colún|Leche descremada|leche descremada,leche descremada sin lactosa,leche light|1 vaso (200 ml)|200|68|6.6|9.4|0.2|0|1|0||https://www.jumbo.cl/leche-descremada-colun-1-l-2/p
Colún|Leche chocolate receta original|leche chocolate,leche con chocolate,chocolatada,leche chocolate original,cajita chocolate|1 vaso (200 ml)|200|156|6.2|25.6|3.2|0|1|0|A,C|https://www.jumbo.cl/leche-colun-original-chocolate-1l/p
Colún|Leche semidescremada chocolate|leche chocolate semidescremada,leche chocolate liviana|1 vaso (200 ml)|200|94|6.4|11.2|2.6|0|1|0||https://www.jumbo.cl/leche-colun-semi-descremada-chocolate-1-litro/p
Colún|Leche Origen chocolate|leche origen chocolate,origen chocolate|1 vaso (200 ml)|200|138|6|23.6|2.2|0|1|0|A|https://www.jumbo.cl/leche-choc-1l-2040263/p
Colún|Leche semidescremada frutilla|leche frutilla,leche con frutilla,leche sabor frutilla|1 caja (200 ml)|200|92|6.2|11|2.6|0|1|0||https://www.jumbo.cl/pack-leche-colun-frutilla-200-cc/p
Colún|Leche cultivada light 0% + fibra|leche cultivada,leche cultivada light,cultivada frutilla|1 vaso (200 ml)|200|60|5.6|8.6|0.3|3|1|0||https://www.jumbo.cl/leche-cultivada-descremada-light-colun-botella-1-l-frutilla/p
Colún|Queso gauda laminado|queso gauda,gauda,gouda,queso laminado,lamina de queso|1 rebanada (33 g)|33|114|7.6|0|9.2|0|0.8|0|S|https://www.jumbo.cl/queso-gouda-colun-500-g-2/p
Colún|Queso gauda Ranco laminado|queso ranco,ranco,gauda ranco|2 rebanadas (34 g)|34|112|8.2|0|8.8|0|0.85|0|S|https://www.jumbo.cl/queso-ranco-colun-laminado-al-vacio-250-g-2/p
Colún|Queso gauda light laminado|queso light,gauda light,queso laminado light|2 rebanadas (34 g)|34|87|10.2|0|5.1|0|0.85|0||https://www.jumbo.cl/queso-light-colun-semirigidolaminado500-g-2/p
Colún|Quesillo|quesillo,quesillo colun|1 rebanada (30 g)|30|41|3.9|1.4|2.3|0|0.75|0||https://www.jumbo.cl/quesillo-colun-pack-2-unidades-potes-de-160-g-c-u/p
Colún|Quesillo light|quesillo light,quesillo descremado|1 rebanada (30 g)|30|26|4.2|1.3|0.4|0|0.75|0||https://www.jumbo.cl/quesillo-light-colun-2-unidades-160-g-cu/p
Colún|Queso fresco|queso fresco,queso fresco colun|1 rebanada (30 g)|30|53|3.8|1.4|3.6|0|0.75|0||https://www.jumbo.cl/queso-fresco-colun-pack-2-unidades-potes-de-160-g-c-u/p
Colún|Queso crema|queso crema,queso crema colun,queso untable|1 cucharadita (15 g)|15|36|2.4|0.6|2.6|0|0|0|G,S|https://www.jumbo.cl/queso-crema-colun-200-g/p
Colún|Mantequilla con sal|mantequilla,mantequilla colun,mantequilla con sal|1 cucharadita (7 g)|7|53|0|0.1|5.8|0|0|0|G,C|https://www.jumbo.cl/mantequilla-con-sal-colun-250-g/p
Colún|Manjar tradicional|manjar,dulce de leche,manjar colun|2 cucharadas (30 g)|30|87|2.6|16.1|1.4|0|0|0|A,C|https://www.jumbo.cl/manjar-colun-bolsa-1-kg/p
Colún|Crema de leche|crema,crema de leche,crema colun|2 cucharadas (15 ml)|15|48|0.3|0.7|5|0|0|0||https://www.jumbo.cl/crema-de-leche-colun-caja-200-ml/p
Colún|Crema light|crema light,crema de leche light|2 cucharadas (15 ml)|15|22|0.4|0.8|2|0|0|0||https://www.jumbo.cl/crema-colun-light-200-cc/p
Colún|Postre del Sur chocolate|postre del sur,postre chocolate colun,postre colun|1 unidad (110 g)|110|180|3.7|24.4|5.7|0|0.5|0|A|https://www.jumbo.cl/postre-del-sur-colun-110gr-choco-1965565001/p
Loncoleche|Yoghurt Proteína|yogurt proteina,yogur protein,lonco protein,proteina frutilla,proteina natural,proteina vainilla|1 envase (140 g)|140|91|12.3|8.3|1|0|1|0||https://www.jumbo.cl/yoghurt-loncoleche-proteina-frutilla-140-g/p
Loncoleche|Yoghurt Proteína con trozos|yogurt proteina trozos,yogur proteina trozos,proteina trozos frutilla|1 envase (140 g)|140|91|10.9|11.2|0.3|0|1|0||https://www.jumbo.cl/yog-prot-loncoleche-trozos-140g-frutill-1836029004/p
Loncoleche|Yoghurt sin lactosa|yogurt sin lactosa,yogur sin lactosa,sin lactosa frutilla|1 pote (140 g)|140|108|4.9|15.8|2.8|0|1|0||https://www.jumbo.cl/yog-s-l-loncoleche-140g-frutilla-1960294001/p
Loncoleche|Leche semidescremada sin lactosa|leche sin lactosa,leche semidescremada,leche semi sin lactosa|1 vaso (200 ml)|200|90|6.4|10.6|2.4|0|1|0||https://www.jumbo.cl/leche-semidescremada-loncoleche-1-l-sin-lactosa-natural-caja-tapa-rosca/p
Loncoleche|Leche descremada sin lactosa|leche descremada,leche descremada sin lactosa|1 vaso (200 ml)|200|66|6.6|9.6|0.2|0|1|0||https://www.jumbo.cl/leche-descremada-loncoleche-1-l-sin-lactosa-caja-tapa-rosca/p
Loncoleche|Leche sin lactosa chocolate|leche chocolate,leche chocolate sin lactosa,chocolatada sin lactosa|1 vaso (200 ml)|200|86|5.8|9.4|2.8|0|1|0||https://www.jumbo.cl/leche-semidescremada-loncoleche-1-l-chocolate-sin-lactosa-caja-tapa-rosca/p
Loncoleche|Leche Extra Proteína|leche extra proteina,leche protein,leche proteina|1 vaso (200 ml)|200|82|9.2|10.2|0.4|0|1|0||https://www.jumbo.cl/leche-loncoleche-extra-proteina-1-l/p
Loncoleche|Leche Proteína capuccino|leche proteina capuccino,protein capuccino,leche protein cafe|1 envase (200 ml)|200|84|9.2|11|0.4|0|1|0||https://www.jumbo.cl/leche-loncoleche-proteina-200ml-cappuc-1892375/p
Loncoleche|Leche Full Proteína|leche full proteina,leche full pro,full protein|1 vaso (200 ml)|200|110|16|10.8|0.4|0|1|0||https://www.jumbo.cl/leche-prot-1-lt-2080067/p
Nestlé|Yoghurt Goodnes Protein|goodnes protein,yogurt nestle protein,nestle protein,yogur proteina nestle,goodnes frutilla|1 unidad (140 g)|140|113|10.1|12.3|2.7|0|1|0||https://www.jumbo.cl/yog-goodnes-protein-140g-frutilla-1993776001/p
Nestlé|Manjar clásico|manjar,manjar nestle,dulce de leche|1 cucharada (30 g)|30|90|2|15|2.4|0|0|0|A,C|https://www.jumbo.cl/manjar-nestle-bolsa-1-kg/p
Nestlé|Crema de leche tarro|crema,crema nestle,crema de leche,crema tarro|2 cucharadas (25 g)|25|58|0.6|1|5.8|0|0|0||https://www.jumbo.cl/crema-de-leche-nestle-lata-157-g-2/p
Nestlé|Crema de leche light tarro|crema light,crema nestle light|2 cucharadas (25 g)|25|48|0.7|1.2|4.5|0|0|0||https://www.jumbo.cl/crema-nestle-light-tarro-157-g/p
Nestlé|Postre Goodnes Protein|postre goodnes,postre protein nestle,postre proteina chocolate,goodnes postre|1 unidad (115 g)|115|98|10|9.8|2.1|0|1|0||https://www.jumbo.cl/postre-goodnes-protein-115gr-choco-2009189001/p
Nestlé|Postre Leche asada|leche asada,leche asada nestle,flan|1 unidad (120 g)|120|146|4.2|26|2.9|0|0.5|0|A|https://www.jumbo.cl/leche-asada-120-g/p
Nestlé|Postre Chandelle chocolate|chandelle,postre chandelle,chandelle chocolate|1 unidad (120 g)|120|187|4|28.8|6.2|0|0.5|0|A|https://www.jumbo.cl/postre-chand-120gr-2037539/p
Danone|Yoghurt griego Oikos natural endulzado|oikos,yogurt griego,yogur griego,griego natural,oikos natural|1 envase (110 g)|110|105|5.3|10.9|4.4|0|1|0||https://www.jumbo.cl/yoghurt-griego-sin-trozos-danone-natural-110-g/p
Danone|Yoghurt griego Oikos con trozos|oikos trozos,yogurt griego frutilla,yogur griego trozos,oikos frutilla|1 envase (110 g)|110|98|4.4|11.8|3.7|0|1|0||https://www.jumbo.cl/yoghurt-con-trozos-de-fruta-danone-110-g-frutilla/p
Quillayes|Yoghurt griego light con trozos|yogurt griego,yogur griego light,griego quillayes,griego frutilla|1 unidad (110 g)|110|79|4.4|10.5|2.2|0|1|0||https://www.jumbo.cl/yoghurt-light-quillayes-griego-con-trozos-de-frutilla-110-g/p
Quillayes|Yoghurt griego Proteína con trozos|griego proteina,yogurt griego protein,yogur griego proteina|1 unidad (110 g)|110|83|8.8|6.4|2.4|0|1|0||https://www.jumbo.cl/yog-griego-prot-quillayes-tr-frutillas-1865068001/p
Surlat|Leche entera|leche entera,leche entera surlat|1 taza (200 ml)|200|118|6.2|9.8|6.2|0|1|0||https://www.jumbo.cl/leche-entera-surlat-b-a-1l-1991554/p
Surlat|Leche semidescremada|leche semidescremada,leche semi|1 taza (200 ml)|200|86|6.4|9.8|2.4|0|1|0||https://www.jumbo.cl/leche-semidesc-surlat-b-a-1l-1991553/p
Surlat|Leche descremada sin lactosa|leche descremada,leche sin lactosa,leche descremada sin lactosa|1 taza (200 ml)|200|66|6.6|9.8|0.2|0|1|0||https://www.jumbo.cl/leche-descremada-surlat-caja-1-l-sin-lactosa/p
Philadelphia|Queso crema original|queso crema,philadelphia,queso filadelfia,queso untable|1 cucharadita (15 g)|15|37|0.8|0.5|3.6|0|0|0|G|https://www.jumbo.cl/queso-crema-philadelphia-150-g/p
Wild Protein|Barra Proteína Chocolate|barra wild,wild protein,wild chocolate,barra proteica chocolate,barrita proteina chocolate,barra proteina|1 barra (45 g)|45|167.9|15|17.5|4.2|0|0|0||https://www.jumbo.cl/barra-protein-wild-chocolate-5-un-x-45g/p
Wild Protein|Barra Proteína Chocolate Maní|wild choco mani,wild mani,barra wild mani,barra proteica mani,barrita proteina chocolate mani|1 barra (45 g)|45|179.6|15|16.1|6.1|0|0|0||https://www.jumbo.cl/barra-protein-wild-choco-mani-5-un-x-45g/p
Wild Protein|Barra Proteína Caramelo|wild caramelo,barra wild caramelo,barra proteica caramelo,barrita proteina caramelo|1 barra (45 g)|45|173.7|15|17|5|0|0|0||https://www.jumbo.cl/barra-wild-protein-caramelo-5un-1939070/p
Wild Protein|Barra Proteína Lemon Pie|wild lemon pie,barra wild limon,barra proteica limon,barrita proteina lemon pie|1 barra (45 g)|45|136.4|14.5|11|3.9|0|0|0||https://www.jumbo.cl/barra-wild-protein-lemon-pie-5un-2002966/p
Wild Protein|Barra Proteína Vegana|wild vegana,barra vegana,wild chocolate naranja,wild choco naranja,wild chocolate bitter,wild bitter,barra proteica vegana|1 barra (45 g)|45|173.3|14|17.4|5.3|0|0|0||https://www.jumbo.cl/barra-wild-protein-vegan-choconaranj-5un-1939073/p
Wild Protein|Munchy Choco Chips|munchy,munchy chocolate chips,wild munchy,barrita munchy chips,barra proteica chica|1 barra (30 g)|30|88.8|10|3.6|3.8|0|0|0||https://www.jumbo.cl/barra-wild-protein-munchy-choc-chips-4un-1990100/p
Wild Protein|Munchy Choco Maní|munchy mani,munchy chocolate mani,wild munchy mani,barrita munchy mani|1 barra (30 g)|30|97.8|10|3.8|4.7|0|0|0||https://www.jumbo.cl/barra-wild-protein-munchu-choc-mani-4un-1990101/p
Wild Protein|Barra Proteína Pro|wild pro,wild protein pro,barra wild pro,wild pro cookies and cream,wild pro cookies,wild pro chocolate,barra proteica 21 g|1 barra (60 g)|60|232.2|21|21.7|6.8|0|0|0||https://www.jumbo.cl/barra-wild-protein-pro-cookies-and-cream-4un-1954466/p
Nature Valley|Barra Protein|nature valley protein,nature valley proteina,barra nature valley proteina,nature valley caramelo mani,nature valley almendra chocolate,barra proteica nature valley|1 barra (40 g)|40|188|10|10|12|5.2|0|0|A,G,C|https://www.jumbo.cl/cereal-en-barra-nature-valley-201-g-proteina-almendra-y-chocolate/p
Quest|Protein Bar|quest,quest bar,barra quest,quest protein,quest chocolate,quest cookies,barra proteica quest|1 barra (60 g)|60|190|21|10|9|10|0|0||https://allnutrition.cl/products/quest-bar-60g
Quest|Hero Bar|quest hero,hero bar,barra quest hero,quest hero chocolate caramel pecan|1 barra (60 g)|60|160|16|20|7|10|0|0||https://allnutrition.cl/products/quest-hero-bar-60g
Your Goal|Twenty's Chocolate Fudge|twentys,twenty s,twentys fudge,barra your goal,your goal chocolate fudge,barra proteica twentys|1 barra (60 g)|60|129.6|18.8|1.8|5.3|15.3|0|0||https://www.jumbo.cl/barra-twentys-your-chocolate-fudge-4un-1901615/p
Your Goal|Bite Caramel|bite caramel,your goal bite,barra bite,bite caramelo,barra proteica bite|1 barra (55 g)|55|158.4|19.9|3|7.4|5.9|0|0|G,C|https://www.jumbo.cl/barra-protein-your-bite-caramel-4un-1901614/p
Your Goal|Twenty's Mini Fudge|twentys mini,mini fudge,your goal mini,barrita mini proteina|1 barra (25 g)|25|56|8.1|1|2.2|6.1|0|0||https://www.jumbo.cl/barra-your-goal-twentys-mini-fudge-5un-1977062/p
Your Goal|Protein Snack Chocolate Crispis|protein snack,your goal snack,chocolate crispis,barra crispis proteina|1 barra (42 g)|42|115.5|14.8|8.7|2.4|8.4|0|0||https://www.jumbo.cl/barra-protein-snack-choco-crispis-5x42g/p
Underfive|Barra Proteína Salted Peanut|underfive,underfive mani,salted peanut,barra underfive,barra proteica mani salado|1 barra (45 g)|45|157.2|14.1|14.1|4.9|4.7|0|0||https://www.jumbo.cl/barra-cereal-underfive-salted-peanut-5un-2003261/p
Underfive|Barra Proteína Almendra|underfive almendra,barra datil almendra,barra underfive almendra|1 barra (45 g)|45|160.8|14|16.9|4|2.8|0|0||https://www.jumbo.cl/barrita-datil-almendra-5un-underfive-1906446/p
NotCo|NotProtein Bar Lemon Cake|notprotein,not protein bar,notco barra,notco lemon cake,barra proteica notco limon|1 barra (45 g)|45|150.8|15.8|9.9|4.3|5.9|0|0||https://www.jumbo.cl/notsnacksbar-lemon-cake-5un-1996660/p
NotCo|NotProtein Bar Chocolate Fudge Brownie|notprotein brownie,notco brownie,notco chocolate,not protein chocolate|1 barra (45 g)|45|140.9|15.8|10.4|3.3|6.8|0|0||https://www.jumbo.cl/barra-notco-proteina-chocolate-5un-1967017/p
NotCo|NotSquare Peanut Butter|notsquare,not square,notsquare mani,notco mani chocolate,barrita notsquare|1 barra (30 g)|30|138|6.3|6.6|7.8|4.5|0|0||https://www.jumbo.cl/barra-notsquare-mantequilla-de-mani-2014566/p
Vivo|Barra Proteína Chocolate|vivo proteina,barra vivo,vivo chocolate,barra proteica vivo|1 barra (40 g)|40|144.4|15|15.8|2.4|0|0|0||https://www.jumbo.cl/barra-vivo-proteina-chocolate-5un-1960290/p
Vivo|Barra Proteína Coco|vivo coco,barra vivo coco,barra proteica coco|1 barra (40 g)|40|152|15|14.6|3.7|0|0|0||https://www.jumbo.cl/barra-vivo-proteina-coco-5-un-1983947/p
En Línea|Barra Proteína Chocolate|en linea proteina,barra en linea,en linea chocolate,barra proteica en linea|1 barra (40 g)|40|140.4|15.2|13.2|2.9|3|0|0||https://www.jumbo.cl/barra-proteina-chocolate-5-un/p
Marley Coffee|Barra Proteína Caramelo|marley,marley coffee,barra con cafeina,marley caramelo,barra proteica cafe|1 barra (45 g)|45|145.4|12.7|11.4|3|0|0|0||https://www.jumbo.cl/prot-caram-marley-2033096/p
Cuisine & Co|Barra Proteína Vegana Chocolate Maní|cuisine and co proteina,barra jumbo proteina,cuisine vegana mani,barra proteica cuisine|1 barra (45 g)|45|166|17.2|14|4.6|3.1|0|0||https://www.jumbo.cl/barra-de-prote-choc-mani-c-and-co-5un-1970672/p
JustProtein|Barra Isolate Brownie Maní|justprotein,just protein,isolate brownie mani,barra just protein|1 barra (50 g)|50|166|18|19|5.1|8.5|0|0||https://www.jumbo.cl/barra-justprotein-isolat-brown-mani-5un-1973299/p
Corny|Barra Protein Coco|corny,corny protein,corny coco,barra corny|1 barra (50 g)|50|189.5|15|14|9.5|0|0|0|G,C|https://www.jumbo.cl/barra-proteina-corny-sabor-coco-50g-1955116/p
Ecoterra|Barra Proteína Maní Cacao|ecoterra,ecoterra mani cacao,barra ecoterra|1 barra (42 g)|42|178.1|9.7|17.3|8.1|0|0|0||https://www.jumbo.cl/barras-ecoterra-c-cacao-5un-1959611/p
Nakd|Protein Cacao Avellana|nakd,nakd protein,nakd cacao avellana,barra nakd|1 barra (45 g)|45|192.2|7.7|14.9|9.9|0|0|0||https://www.jumbo.cl/cereal-nakd-prot-2038687/p
Costa|Cereal Bar Golden / Chococereal|cereal bar,cerealbar,cereal bar golden,golden cereal,chococereal,cereal bar chocolate,barra de cereal costa,barrita costa|1 barra (18 g)|18|68.9|0.8|13.2|1.5|0.3|0|0|A,C|https://www.jumbo.cl/barra-de-cereal-cereal-bar-caja-8-unid-golden-mas-leche/p
Costa|Cereal Bar Frutos Rojos + Yogurt|cereal bar frutos rojos,cerealbar yogurt,cereal bar berries,barrita costa frutos rojos|1 barra (21 g)|21|79.4|1.1|15.1|1.7|0.5|0|0|A,C|https://www.jumbo.cl/barra-de-cereal-cereal-bar-caja-8-unid-frutos-rojos-mas-yoghurt/p
Costa|Cereal Bar Nuts Maní|cereal bar nuts,cerealbar mani,costa nuts,barra cereal mani|1 barra (30 g)|30|150.6|3.6|14|8.9|1.2|0|0|A,G,C|https://www.jumbo.cl/barra-cereal-costa-nuts-mani-5un-1995039/p
Nature Valley|Crunchy Almendras|nature valley,nature valley crunchy,crujiente almendras,barra nature valley,barra de avena|2 barras (42 g)|42|184|3|25.2|8|2.9|0|0|A,C|https://www.jumbo.cl/barra-de-cereal-nature-valley-caja-12-unid-crujiente-sabor-almendras/p
Nature Valley|Chocolate y Frutos Secos|nature valley chocolate,nature valley frutos secos,barra nature valley chocolate|1 barra (35 g)|35|140.4|2|23.1|4.6|0|0|0|A,C|https://www.jumbo.cl/barra-de-cereal-nature-valley-caja-6-unid-chocolate-y-frutos-secos/p
En Línea|Barra de Cereal Chocolate|en linea barra cereal,barrita en linea,barra cereal sin azucar|1 barra (15 g)|15|40.2|0.8|9.2|0.6|2.7|0|0||https://www.jumbo.cl/barra-de-cereal-en-linea-chocolate-6-unid/p
Cuisine & Co|Barra de Cereal Chocolate|cuisine and co barra cereal,barra cereal jumbo,barrita cereal chocolate|1 barra (20 g)|20|57.4|1.5|9.1|0.7|3.7|0|0||https://www.jumbo.cl/barra-cereal-choco-2041986/p
Wild Soul|Soul Bar Maní|soul bar,wild soul,soul bar mani,barra natural mani|1 barra (35 g)|35|149.1|4.6|14.9|7.9|1.4|0|0||https://www.jumbo.cl/barra-cereal-soul-bar-mani-5un-1939077/p
Loncoleche|Leche Proteína Full Pro Chocolate|full pro,loncoleche full pro,leche proteina chocolate,batido proteina loncoleche|1 envase (250 ml)|250|135|20|12|0.8|0|1|0||https://www.jumbo.cl/leche-l-leche-prot-250ml-full-pro-choc-1892381/p
Loncoleche|Shot Proteína|shot protein,shot proteina,loncoleche shot,shot vainilla,shot berries|1 unidad (100 ml)|100|55|8|4.7|0.5|0|0|0||https://www.jumbo.cl/bebida-lactea-shot-protein-100ml-vainilla/p
Loncoleche|Leche Cultivada Proteína Berries|leche cultivada proteina,loncoleche protein berries,yogur bebible proteina|1 vaso (200 ml)|200|90|12|8.8|0.8|0|1|0||https://www.jumbo.cl/l-cult-loncoleche-protein-900g-berries-1921104002/p
Soprole|Leche Proteína Vainilla|soprole protein vainilla,leche proteina vainilla,soprole nitro vainilla,leche protein vainilla|1 vaso (200 ml)|200|112|12|9.8|2.8|0|1|0||https://www.jumbo.cl/leche-soprole-prot-nitro-vainilla-1lt-1983593001/p
Colún|Leche Descremada Protein Plus|colun protein,leche protein,leche protein plus,leche proteina colun,leche colun proteina|1 vaso (200 ml)|200|92|13|10|0.3|0|1|0||https://www.jumbo.cl/leche-prot-desc-1l-2086993/p
Spartan|Shake de Proteína Frutilla|spartan,shake spartan,batido proteina frutilla,shake proteina|1 botella (330 ml)|330|149.5|30.1|2.5|2.1|0|0|0||https://www.jumbo.cl/shake-fruti-330ml-2036259/p
Ensure|Advance|ensure,ensure advance,ensure vainilla,ensure chocolate,suplemento ensure|1 botella (220 ml)|220|237.6|12.1|29.7|7.5|0|0|0||https://www.jumbo.cl/alimento-nutricional-ensure-237-ml-advance/p
Winkler Nutrition|Agua Protein Frutos Rojos|agua protein,agua proteina,winkler agua,protein water|1 botella (500 ml)|500|95|20|0.5|0|0|0|0||https://www.jumbo.cl/agua-protein-500cc-2070607/p
Isopro|Bebida Isotónica Blue|isopro,isopro blue,isotonica proteina|1 botella (500 ml)|500|45|10|0.5|0|0|0|0||https://www.jumbo.cl/beb-isotonica-isopro-blue-500ml-1973990/p
Surlat|Yogurt Whey Protein Natural|surlat whey,yogurt whey,surlat protein,yogurt protein|1 unidad (140 g)|140|102.2|12|8|2.4|0|1|0||https://www.jumbo.cl/yogurt-whey-140g-2062273/p
Winkler Nutrition|Whey Pro Win|prowin,pro win,whey,whey winkler,winkler,proteina winkler|1 porción (33 g)|33|126|25|2.3|1.9|0|0|0||https://allnutrition.cl/products/whey-pro-win-2-2-lb
MuscleTech|Nitro-Tech 100% Whey Gold|nitro tech,nitrotech,nitro tech gold,whey,whey gold,proteina muscletech|1 medida (33 g)|33|120|24|2|2|0|0|0||https://www.allnutrition.cl/products/nitro-tech-100-whey-gold-2-2-lb
MuscleTech|Nitro-Tech Performance Hidrolizada|nitro tech performance,nitro tech hidrolizada,proteina hidrolizada|1 scoop (44 g)|44|160|30|4|2.5|0|0|0||https://allnutrition.cl/products/nitro-tech-perform-2-lb
Gatorade|Bebida Isotónica 500 cc|gatorade,gatorade naranja,gatorade tropical,gatorade chico,isotonica|1 botella (500 ml)|500|120|0|30|0|0|0|0||https://www.jumbo.cl/bebida-isotonica-gatorade-naranja-desechable-500-cc/p
Gatorade|Bebida Isotónica 750 cc|gatorade 750,gatorade limon,gatorade cool blue,gatorade tapa deportiva,gatorade grande|1 botella (750 ml)|750|180|0|45|0|0|0|0||https://www.jumbo.cl/bebida-isot-750cc-2089199/p
Gatorade|Zero|gatorade zero,gatorade sin azucar,gatorade blue berry zero,isotonica zero|1 botella (500 ml)|500|0|0|0|0|0|0|0||https://www.jumbo.cl/beb-isotonica-gatorade-bl-berry-zero-1l-1973060/p
Powerade|Bebida Isotónica|powerade,powerade naranja,powerade rojo,isotonica powerade|1 botella (500 ml)|500|105|0|24.5|0|0|0|0||https://www.jumbo.cl/beb-isot-powerade-naranja-des-1-1-lt-1937684/p
Electrolit|Bebida Hidratante|electrolit,electrolit maracuya,electrolit naranja,suero hidratante|1 botella (625 ml)|625|125|0|31.3|0|0|0|0||https://www.jumbo.cl/beb-hidrat-electrolit-sab-maracuya-625ml-1970577/p
Suerox|Zero|suerox,suerox zero,suero oral,suerox arandano pomelo|1 botella (630 ml)|630|9.8|0.9|1.6|0|0|0|0||https://www.jumbo.cl/bebida-suerox-630m-2068204/p
Marco Polo|Maní Sin Sal|mani sin sal,mani tostado,mani natural marco polo|2 cucharadas (28 g)|28|170.8|7.2|4.6|13.8|0|0|0|G,C|https://www.jumbo.cl/mani-sin-sal-marco-polo-150gr-2000510/p
Marco Polo|Maní Salado|mani salado,mani con sal,mani marco polo|2 cucharadas (28 g)|28|166.9|7.9|4.6|13|0|0|0|G,C|https://www.jumbo.cl/mani-salado-marco-polo-380gr-2000507/p
Marco Polo|Mix Frutos Secos|mix frutos secos,frutos secos,mix nueces,frutos secos marco polo|2 cucharadas (28 g)|28|171.9|6.2|5.8|13.8|0|0|0|G,C|https://www.jumbo.cl/mix-frutos-secos-1-2054233/p
Marco Polo|Mix Nuts|mix nuts,nuts,mix de nueces,mix nuts marco polo|2 cucharadas (28 g)|28|187|5.6|5.9|15.7|0|0|0|A,G,C|https://www.jumbo.cl/mix-nuts-marco-polo-350-g/p
Millantú|Mix Frutos Secos|millantu,mix millantu,frutos secos con pasas,mix frutos secos y pasas|1/4 taza (30 g)|30|144.3|4.3|13.7|9.1|2.1|0|0|G,C|https://www.jumbo.cl/mix-frutos-secos-millantu-120-g/p
Cuisine & Co|Almendras Saladas|almendras saladas,almendras tostadas cuisine|2 cucharadas (28 g)|28|168.6|5.7|2.1|15.3|0|0|0|G,C|https://www.jumbo.cl/almendras-saladas-80-g-cuisine-and-co-1787036/p
Tucapel|Galletas de Arroz Dulces|galletas de arroz,galleta de arroz,tortitas de arroz,galletas arroz tucapel|8 galletas (18 g)|18|66.6|1.7|14.1|0.4|0.3|0|0||https://www.jumbo.cl/galletas-de-arroz-tucapel-dulces-150-g/p
Ricecrisps|Galletas de Arroz Sal de Mar|ricecrisps,rice crisps,galletas arroz sal de mar,galletas de arroz saladas|10 galletas (20 g)|20|82.6|1.3|16.9|1.1|0.1|0|0|C|https://www.jumbo.cl/galletas-sal-de-mar-100-g/p
Ricecrisps|Galletas de Arroz Integral Multigrano|ricecrisps multigrano,galletas arroz integral,galletas multigrano|10 galletas (20 g)|20|83.8|1.4|14.2|2|1.6|0|0|C|https://www.jumbo.cl/galletas-de-arroz-integral-multigrano-100-g/p
Mizos|Galletas de Arroz Chocolate|mizos,mizos chocolate,galleta de arroz con chocolate,mizos individual|1 envase (20 g)|20|75.8|1.2|13.6|1.8|0|0|0|G,C|https://www.jumbo.cl/galleta-mizos-envase-20-g-de-arroz-mizos-chocolate/p
Ideal|Pan Blanco|pan blanco,pan de molde,pan de molde blanco,pan molde,rebanada de pan blanco|2 rebanadas (58 g)|58|149|5.7|27.3|1.9|0|0|0||https://www.jumbo.cl/pan-molde-ideal-blanco-580g-2011236/p
Ideal|Pan Blanco XL|pan blanco xl,pan de molde blanco xl,pan molde xl,pan molde grande|2 rebanadas (56 g)|56|144|5.5|26.3|1.9|0|0|0||https://www.jumbo.cl/m-ideal-bco-xl-750/p
Ideal|Pan Integral XL|pan integral,pan de molde integral,pan molde integral,rebanada integral|2 rebanadas (57 g)|57|132|6.8|22.2|1.8|3.6|0|0||https://www.jumbo.cl/pan-integral-770g-2058350/p
Ideal|Pan Cero Cero Integral|pan cero cero integral,pan integral cero cero,pan 00 integral,pan integral sin azucar|2 rebanadas (67 g)|67|149|8|26.8|1.1|4.7|0|0||https://www.jumbo.cl/pan-molde-ideal-cero-cero-integral-600g-1940568/p
Ideal|Pan Cero Cero Blanco|pan cero cero,pan cero cero blanco,pan 00,pan blanco sin azucar|2 rebanadas (64 g)|64|139|7|26.2|0.6|3.7|0|0||https://www.jumbo.cl/pan-molde-ideal-cero-cero-blanco-580g-1940567/p
Ideal|Pan Integral Protein 10|pan protein,pan proteico,pan con proteina,pan integral protein,pan de proteina|2 rebanadas (72 g)|72|171|10.1|28.1|2.1|2.7|0|0||https://www.jumbo.cl/pan-molde-ideal-integral-protein-10-650g-1934535/p
Ideal|Pan Blanco Sin Borde|pan sin borde,pan sin orilla,pan sin orillas,pan de molde sin borde,pan miga|2 rebanadas (53 g)|53|140|5.8|23.9|2.4|0|0|0||https://www.jumbo.cl/pan-molde-ideal-blanco-sin-bordes-400g/p
Ideal|Pan Hot Dog|pan hot dog,pan de hot dog,pan de completo,pan completo,pan de vienesa|1 unidad (60 g)|60|154|5.9|28.8|1.7|0|0|0||https://www.jumbo.cl/pan-hot-dog-ideal-8-un-480-gr/p
Ideal|Pan de Completo XL|pan completo xl,pan de completo grande,pan hot dog xl,pan de completo xl|1 unidad (88 g)|88|228|8.7|42.2|2.6|0|0|0||https://www.jumbo.cl/pan-completo-ideal-xl-8-unid-528-gr/p
Ideal|Pan de Hamburguesa|pan hamburguesa,pan de hamburguesa,pan para hamburguesa|1 unidad (63 g)|63|157|6|29|1.9|0|0|0||https://www.jumbo.cl/pan-hamburguesa-8u-2075127/p
Ideal|Pan de Hamburguesa Brioche Artesano|pan brioche,brioche,pan hamburguesa brioche,pan de hamburguesa brioche|1 unidad (88 g)|88|233|8.7|43.1|2.9|0|0|0||https://www.jumbo.cl/hamburguesa-ideal-brioche-4un-352g-1995699/p
Castaño|Pan Integral XL|pan integral,pan de molde integral,pan integral xl,rebanada integral|2 rebanadas (55 g)|55|137|7|23.4|1.8|3.5|0|0||https://www.jumbo.cl/molde-castano-integral-xl-770g-1992834/p
Castaño|Pan Blanco XL Sin Lactosa|pan blanco sin lactosa,pan de molde blanco sin lactosa,pan blanco xl|2 rebanadas (55 g)|55|141|5|25.4|2.1|1.4|0|0||https://www.jumbo.cl/pan-molde-castano-blanco-s-lactosa-770g-1932111/p
Castaño|Pan Miga Dúo|pan miga duo,pan miga,pan duo,pan de molde duo|2 rebanadas (49 g)|49|133|5.8|21|2.7|2.9|0|0||https://www.jumbo.cl/pan-molde-castano-miga-duo-440-g/p
Castaño|Pan Integral Multigrano Light Colágeno|pan multigrano,pan multigrano light,pan light,pan colageno,pan integral multigrano|2 rebanadas (60 g)|60|149|9.6|23.1|1.9|3.9|0|0||https://www.jumbo.cl/molde-multigrano-light-colageno-400g-2052051/p
Fuchs|Pan Multigrano|pan multigrano,pan de molde multigrano,pan con semillas,pan semillas|2 rebanadas (65 g)|65|146|8.5|25.4|1.2|3.6|0|0||https://www.jumbo.cl/pan-molde-fuchs-multigrano-620g-2003311/p
Ideal|Pan Pita Blanco|pan pita,pita,pita blanca,pan pita blanco|1 unidad (43 g)|43|105|4.2|21.1|0.4|0|0|0||https://www.jumbo.cl/pan-pita-blanco-ideal-bolsa-300-g-8-unid/p
Ideal|Pan Pita Integral|pita integral,pitas integrales,pan pita integral|1 unidad (43 g)|43|101|3.7|20.2|0.7|3.1|0|0||https://www.jumbo.cl/pan-pita-integral-ideal-bolsa-300-g-8-unid/p
Ideal|Pan Pita Light Linaza|pita light,pita linaza,pan pita light,pita diet|1 unidad (43 g)|43|97|4.2|17.6|1.1|2.7|0|0||https://www.jumbo.cl/pan-pita-diet-ideal-bolsa-300-g-8-unid-linaza/p
Ideal|Pan Pita Blanco Cero Cero|pita cero cero,pita 00,pita sin azucar|1 unidad (43 g)|43|102|4|20.6|0.4|3.1|0|0||https://www.jumbo.cl/pan-pita-ideal-blanco-cero-cero-8un-1996649/p
Ideal|Tortillas Rapiditas|rapidita,rapiditas,tortilla,tortilla de trigo,wrap|2 unidades (50 g)|50|137|4.6|24.5|2.3|0|0|0||https://www.jumbo.cl/tortillas-rapiditas-ideal-200-gr/p
Ideal|Tortillas Rapiditas XL Clásica|rapiditas xl,rapidita xl,tortilla xl,tortilla grande,wrap grande|1 unidad (52 g)|52|142|4.7|25.5|2.4|0|0|0||https://www.jumbo.cl/tortilla-r-xl-clas-2037346/p
Ideal|Tortillas Rapiditas XL Integral|rapiditas integrales,rapidita integral,tortilla integral,tortillas integrales,wrap integral|1 unidad (52 g)|52|138|4.4|25|2.2|3|0|0||https://www.jumbo.cl/tortilla-r-xl-inte-2037345/p
Ideal|Tortillas Rapiditas Cero Cero|rapiditas cero cero,rapidita cero cero,tortilla cero cero,rapiditas 00|2 unidades (50 g)|50|135|4.5|24|2.3|0|0|0||https://www.jumbo.cl/tortillas-rapidita-2055739/p
Nestlé|Chocapic|chocapic,cereal chocapic,cereal de chocolate|3/4 taza (30 g)|30|111|2.5|22.1|1.4|2.4|0|0|A,C|https://www.jumbo.cl/cereal-chocapic-receta-original-310-g/p
Nestlé|Fitness|fitness,fitnes,cereal fitness|3/4 taza (30 g)|30|98|2.9|20.3|0.7|4.1|0|0||https://www.jumbo.cl/cereal-fitness-nestle-630-g/p
Nestlé|Fitness Miel y Almendras|fitness miel,fitness almendras,fitness miel y almendras|3/4 taza (30 g)|30|102|2.9|19.1|1.7|4.5|0|0||https://www.jumbo.cl/cereal-nestle-fitness-miel-y-almendras-380-g/p
Nestlé|Milo Cereal|milo cereal,cereal milo,cereal de milo|3/4 taza (30 g)|30|109|3.2|21.7|1|2.4|0|0|A,C|https://www.jumbo.cl/cereal-milo-700-gr-1860646/p
Nestlé|Trix|trix,cereal trix|3/4 taza (30 g)|30|115|1.4|23.8|1.6|1.7|0|0|A,C|https://www.jumbo.cl/cereal-trix-300-g/p
Nestlé|Zucosos|zucosos,zucoso,cereal zucosos|3/4 taza (30 g)|30|111|1.6|24.3|0.8|1.7|0|0|A,C|https://www.jumbo.cl/cereal-zucosos-700gr-1927108/p
Nestlé|Corn Flakes|corn flakes,cornflakes,copos de maiz,hojuelas de maiz|3/4 taza (30 g)|30|108|2.1|23.1|0.8|2|0|0|C|https://www.jumbo.cl/cereal-corn-flakes-nestle-480gr/p
Kellogg's|Zucaritas|zucaritas,zucarita,cereal zucaritas|3/4 taza (30 g)|30|113|1.2|26.7|0.1|0.5|0|0|A,C|https://www.jumbo.cl/cereal-zucaritas-610-gr-2051605/p
Kellogg's|Corn Flakes|corn flakes,cornflakes,copos de maiz,hojuelas de maiz|1 taza (30 g)|30|109|1.8|24.9|0.2|1.4|0|0|C|https://www.jumbo.cl/cereal-corn-flakes-410-gr-2051606/p
Kellogg's|Choco Krispis|choco krispis,chocokrispis,choco krispies,chococrispis|1 taza (30 g)|30|114|1.6|25.8|0.5|1|0|0|A,C|https://www.jumbo.cl/cereal-choco-krispis-kelloggs-200gr-1993226/p
Kellogg's|Froot Loops|froot loops,fruit loops,frootloops,fruitloops|3/4 taza (30 g)|30|119|1.5|25.8|1.1|0.6|0|0|A,C|https://www.jumbo.cl/cereal-froot-loops-450gr-2051604/p
Quaker|Avena Tradicional|avena,avena tradicional,avena en hojuelas,hojuelas de avena|1/2 taza (30 g)|30|121|3.9|19.9|2.5|2.9|0|0||https://www.jumbo.cl/avena-tradicional-quaker-750-g-2/p
Quaker|Avena Instantánea|avena instantanea,avena rapida|1/2 taza (30 g)|30|121|3.9|19.9|2.5|2.9|0|0||https://www.jumbo.cl/avena-instantanea-quaker-900-g-2/p
Quaker|Granola Avena Miel y Almendras|granola,granola miel,granola almendras,granola miel y almendras|1/2 taza (40 g)|40|148|4|22.4|4|4.8|0|0|C|https://www.jumbo.cl/granola-quaker-380-g-miel-y-almendras-2/p
McKay|Soda Clásica|galletas soda,soda,galleta soda,galletas de soda|6 galletas (29 g)|29|124|2.9|22.5|2.5|0|0|0|C|https://www.jumbo.cl/galletas-soda-mckay-180-g/p
McKay|Soda Light|soda light,galletas soda light|6 galletas (29 g)|29|122|2.9|23.1|2|0|0|0|C|https://www.jumbo.cl/galletas-soda-light-mckay-180-g/p
McKay|Galletas de Agua|galletas de agua,galleta de agua|6 galletas (29 g)|29|124|2.5|22.1|2.9|0|0|0|C|https://www.jumbo.cl/galletas-de-agua-mckay-205-g/p
Selz|Galletas Soda Bajo en Sodio|selz,galletas selz,soda selz,soda bajo en sodio|7 galletas (34 g)|34|145|3.7|23.5|3.7|0.8|0|0|C|https://www.jumbo.cl/galletas-soda-selz-180-g-bajo-en-sodio/p
McKay|Galletas de Vino|galletas de vino,galleta de vino|5 galletas (30 g)|30|135|2|23.6|3.7|0|0|0|A,C|https://www.jumbo.cl/galletas-vino-mckay-155-g/p
McKay|Kuky Clásica|kuky,kukys,kuki,galletas kuky,galletas con chips|3 galletas (26 g)|26|133|1.7|18|6|0|0|0|A,G,C|https://www.jumbo.cl/galletas-mckay-120-g-kuky-clasica-sabor-chocolate-con-chips-de-chocolate/p
McKay|Morocha|morocha,morochas,galletas morocha|8 galletas (25 g)|25|122|1.5|18.5|4.7|0|0|0|A,G,C|https://www.jumbo.cl/galleta-morocha-family-120-gr-1961768/p
McKay|Tritón Mini Vainilla|triton,tritones,triton vainilla,mini triton,triton mini|1 bolsa (40 g)|40|196|2|29.4|7.8|0|0|0|A,G,C|https://www.jumbo.cl/galletas-triton-mckay-bolsa-40-g-minis-vainilla/p
McKay|Tritón Mini Chocolate|triton chocolate,triton de chocolate,mini triton chocolate|1 bolsa (40 g)|40|199|2.3|28.9|8.2|0|0|0|A,G,C|https://www.jumbo.cl/galleta-triton-mini-chocolate-40gr-2004851/p
McKay|Criollitas|criollita,criollitas,galletas criollitas|6 galletas (24 g)|24|98|2|19.3|1.4|0|0|0|A,C|https://www.jumbo.cl/galletas-criollitas-mckay-bolsa-100-g-criollitas-sabor-vainilla/p
McKay|Galletas de Mantequilla|galletas de mantequilla,galleta de mantequilla|5 galletas (30 g)|30|139|1.8|22.5|4.7|0|0|0|A,G,C|https://www.jumbo.cl/galletas-mckay-140-g-mantequilla/p
McKay|Niza|niza,galletas niza|5 galletas (30 g)|30|137|2|24.4|3.5|0|0|0|A,C|https://www.jumbo.cl/galletas-mckay-150-g-niza-con-cristales-de-azucar/p
McKay|Maravilla|maravilla,galletas maravilla|5 galletas (27 g)|27|124|1.8|21.1|3.7|0|0|0|A,C|https://www.jumbo.cl/galleta-mckay-maravilla-120-gr-1932761/p
McKay|Galletas de Coco|galletas de coco,galleta de coco|4 galletas (30 g)|30|148|1.8|20.4|6.5|0|0|0|A,G,C|https://www.jumbo.cl/galletas-mckay-120-g-coco/p
McKay|Grill Clásica|grill,galletas grill,galletitas grill|39 galletas (35 g)|35|158|3.2|26.4|4.4|0|0|0|S,C|https://www.jumbo.cl/galleta-grill-bolsa-mckay-140-g/p
Costa|Frac Clásica|frac,fracs,galletas frac,frac vainilla|3 galletas (34 g)|34|169|1.6|23.5|7.6|0|0|0|A,G,C|https://www.jumbo.cl/galleta-frac-clasica-110-gr-2004368/p
Costa|Frac Chocolate|frac chocolate,frac de chocolate|3 galletas (34 g)|34|170|1.6|23.7|7.6|0|0|0|A,G,C|https://www.jumbo.cl/galleta-frac-chocolate-110gr-2004369/p
Costa|Gretel Chocolate|gretel,gretels,gretel chocolate|4 galletas (30 g)|30|157|1.5|20.8|7.5|0|0|0|A,G,C|https://www.jumbo.cl/galletas-gretel-costa-85-g-rellenas-con-crema-de-chocolate-2/p
Costa|Gretel Yogurt Frutilla|gretel frutilla,gretel yogurt,gretel yogur frutilla|4 galletas (30 g)|30|154|1.4|20.4|7.4|0|0|0|A,G,C|https://www.jumbo.cl/galletas-gretel-costa-85-g-rellenas-con-crema-de-yoghurt-frutilla-2/p
Costa|Tuareg Coco|tuareg,tuaregs,galletas tuareg|3 galletas (38 g)|38|195|1.4|26.6|9.2|0|0|0|A,G,C|https://www.jumbo.cl/galletas-dulces-costa-120-g-tuareg/p
Costa|Galletas de Vino|galletas de vino,galleta de vino|5 galletas (33 g)|33|151|2.1|25.8|4.4|0|0|0|A,C|https://www.jumbo.cl/galletas-de-vino-costa-160-g-dulces/p
Costa|Obsesión|obsesion,galletas obsesion|6 galletas (34 g)|34|164|1|26.7|6.1|0|0|0|A,G,C|https://www.jumbo.cl/galletas-dulces-costa-85-g-obsesion/p
Costa|Mini Choco Chips|mini chips,mini choco chips,choco chips,galletas chips mini|1 bolsa (35 g)|35|180|1.5|23.8|8.8|0|0|0|A,G,C|https://www.jumbo.cl/galletas-con-chips-de-chococolate-costa-35-g/p
Costa|Galletas de Soda|galletas soda,soda,galleta soda,galletas de soda|5 galletas (30 g)|30|125|2.5|22.3|2.9|0|0|0|C|https://www.jumbo.cl/galleta-de-soda-160-gr-1972585/p
Costa|Nik Bocado|nik,niks,galletas nik,nik bocado|7 galletas (34 g)|34|180|1|23.5|9.1|0|0|0|A,G,C|https://www.jumbo.cl/galletas-dulces-costa-71-g-bocado-nik/p
Costa|Galletas de Mantequilla|galletas de mantequilla,galleta de mantequilla|4 galletas (38 g)|38|181|2|26.8|7.3|0|0|0|A,G,C|https://www.jumbo.cl/galletas-de-mantequilla-costa-140-g/p
Costa|Galletas de Agua Line|galletas de agua,galleta de agua,agua line|6 galletas (33 g)|33|135|2.5|27.1|1.9|0|0|0|C|https://www.jumbo.cl/galleta-agua-line-costa-175-gr-1939231/p
Costa|Galletas de Chocolate|galletas de chocolate,galleta de chocolate|4 galletas (38 g)|38|182|2|25.6|8.1|0|0|0|A,G,C|https://www.jumbo.cl/galletas-chocolate-costa-140-g-sabor-chocolate/p
Tucapel|Arroz Grado 1 Gran Selección|arroz,arroz blanco,arroz grado 1,arroz crudo,arroz grano largo|1/4 taza crudo (50 g)|50|169|3.1|38|0.5|0|0|0||https://www.jumbo.cl/arroz-grado-1-tucapel-gran-seleccion-grano-largo-y-ancho-1-kg/p
Tucapel|Arroz Integral|arroz integral,arroz integral crudo|1/4 taza crudo (50 g)|50|166|3.4|34.5|1.6|3|0|0||https://www.jumbo.cl/arroz-integral-tucapel-1-kg-grado-1/p
Tucapel|Arroz Pregraneado|arroz pregraneado,arroz que no se pega|1/4 taza crudo (50 g)|50|145|3.5|31.7|0.4|0|0|0||https://www.jumbo.cl/arroz-grado-1-tucapel-1-kg-pregraneado-grano-largo/p
Miraflores|Arroz Grado 1|arroz,arroz blanco,arroz grado 1,arroz crudo|1/4 taza crudo (50 g)|50|168|3.4|37|0.7|0|0|0||https://www.jumbo.cl/arroz-grado-1-miraflores-1-kg-grano-largo-y-ancho/p
Miraflores|Arroz Pregraneado|arroz pregraneado,arroz que no se pega|1/4 taza crudo (50 g)|50|177|3.7|38.9|0.7|0|0|0||https://www.jumbo.cl/arroz-miraflores-1-kg-pregraneado-grado-1-grano-largo/p
Carozzi|Spaghetti N°5|spaghetti,espagueti,tallarines,fideos,fideos largos,spaghetti 5|1/5 paquete crudo (80 g)|80|270|8.8|55.2|1.6|3.1|0|0||https://www.jumbo.cl/spaghetti-n-5-carozzi-bolsa-400-g-2/p
Carozzi|Espirales N°49|espirales,espiral,fideos espirales,fideos cortos|1/5 paquete crudo (80 g)|80|270|8.8|55.2|1.6|3.1|0|0||https://www.jumbo.cl/espirales-carozzi-bolsa-400-g/p
Carozzi|Spaghetti Integral|spaghetti integral,fideos integrales,tallarines integrales,espagueti integral|1/5 paquete crudo (80 g)|80|250|10|47|2.5|8.1|0|0||https://www.jumbo.cl/spaghetti-n-5-integral-400-g/p
Lucchetti|Spaghetti N°5|spaghetti,espagueti,tallarines,fideos|1/5 paquete crudo (80 g)|80|270|8|56|2.4|2.8|0|0||https://www.jumbo.cl/spaghetti-n-5-lucchetti-bolsa-400-g/p
Wasil|Porotos Blancos Listos|porotos,porotos blancos,porotos en caja,porotos listos|1/2 envase (190 g)|190|143|11|21.5|1.3|0|0|0||https://www.jumbo.cl/porotos-wasil-caja-380-g-blancos-listos-para-servir-2/p
Wasil|Porotos Negros|porotos negros,frijoles negros,porotos negros en caja|1/2 envase (190 g)|190|152|11.2|23.8|1.3|0|0|0||https://www.jumbo.cl/porotos-negros-wasil-caja-380-g-2/p
Wasil|Porotos Rojos Listos|porotos rojos,frijoles rojos,porotos rojos en caja|1/2 envase (190 g)|190|169|10.3|27.9|1.7|0|0|0||https://www.jumbo.cl/porotos-rojos-wasil-listo-para-servir-380-g/p
Wasil|Garbanzos|garbanzos,garbanzo,garbanzos en caja,garbanzos listos|1/2 envase (190 g)|190|190|11.2|26.8|4.2|0|0|0||https://www.jumbo.cl/garbanzos-wasil-caja-380-g-2/p
Wasil|Lentejas Listas para Servir|lentejas,lenteja,lentejas en caja,lentejas listas|1/2 envase (190 g)|190|139|10.3|22.2|1|0|0|0||https://www.jumbo.cl/lentejas-wasil-caja-380-g-listas-para-servir-2/p
Wasil|Porotos Granados|porotos granados,granados,porotos granados en caja|1 envase (380 g)|380|239|14.1|42.2|1.5|0|0|0||https://www.jumbo.cl/porotos-granados-wasil-caja-380-g-2/p
Lucchetti|Salsa de Tomates Natural|salsa de tomate,salsa de tomates,salsa tomate,salsa natural|2 cucharadas (40 g)|40|24|0.5|5|0|0|0|0||https://www.jumbo.cl/salsa-de-tomate-lucchetti-doypack-200-g-natural/p
Lucchetti|Salsa de Tomates Italiana|salsa italiana,salsa de tomate italiana|2 cucharadas (40 g)|40|25|0.5|5|0|0|0|0||https://www.jumbo.cl/salsa-de-tomate-lucchetti-doypack-200-g-italiana/p
`;
