/* Base de alimentos: nombre | alias | porción | gramos | kcal | prot | carb | grasa | fibra | verduras | frutas | lácteos | flags
   Valores aproximados por porción típica chilena. flags: leg, pes, fry, cnt4, <medida><factor> */
const BASE_TXT=`
Huevo (revuelto en agua, duro o a la copa)|huevo,huevos,huevo revuelto,huevos revueltos,huevo duro,huevos duros,huevo a la copa,huevo pochado,huevo de campo,huevos de campo|1 unidad (50 g)|50|72|6.3|0.4|4.8|0|0|0|0|sP
Huevo frito|huevo frito,huevos fritos,huevo revuelto con aceite|1 unidad con aceite|55|110|6.3|0.4|9|0|0|0|0|
Clara de huevo|clara,claras,clara de huevo|1 clara|33|17|3.6|0.2|0|0|0|0|0|
Leche descremada|leche,leche descremada|1 taza (200 ml)|200|70|6.8|10|0.2|0|0|0|1|vaso1
Leche semidescremada|leche semidescremada|1 taza (200 ml)|200|92|6.6|9.8|3|0|0|0|1|vaso1
Leche entera|leche entera|1 taza (200 ml)|200|124|6.4|9.6|6.6|0|0|0|1|vaso1
Leche chocolatada|leche chocolatada,leche con chocolate|1 caja (200 ml)|200|150|6|22|4|0.5|0|0|1|
Yogur natural|yogur,yogurt,yoghurt,yogur natural|1 unidad (125 g)|125|80|4.5|6|4|0|0|0|1|
Yogur proteico|yogur proteico,yogurt proteico,yogur protein,yogurt protein,protein yogurt|1 unidad (155 g)|155|100|15|9|0.3|0|0|0|1|sP
Quesillo|quesillo|1 trozo (50 g)|50|85|8|1.5|5.5|0|0|0|1|lamina0.5
Queso fresco|queso fresco|1 trozo (50 g)|50|110|9|1.5|7.5|0|0|0|1|
Queso laminado (gauda o mantecoso)|queso,queso gauda,queso mantecoso,queso laminado,lamina de queso|1 lámina (20 g)|20|70|5|0.3|5.4|0|0|0|0.5|
Queso cottage|cottage,queso cottage|1/2 taza (110 g)|110|100|12|3.5|4.5|0|0|0|1|sP
Mantequilla|mantequilla,margarina|1 cucharadita (5 g)|5|36|0|0|4|0|0|0|0|cda3,cucharada3
Marraqueta|marraqueta,pan batido,pan frances,pan,pancito|1 unidad (100 g)|100|270|8.5|56|1.5|2.5|0|0|0|sC
Hallulla|hallulla,dobladita|1 unidad (80 g)|80|245|6.4|42|5.5|1.8|0|0|0|
Pan ciabatta|ciabatta,pan ciabatta,chapata|1 unidad (80 g)|80|215|7.5|40|2.5|1.8|0|0|0|
Pan de molde integral|pan integral,pan de molde integral,pan molde integral,rebanada integral|1 rebanada (30 g)|30|75|3.5|12.5|1|2|0|0|0|
Pan de molde blanco|pan de molde,pan molde,rebanada de pan|1 rebanada (25 g)|25|67|2.2|12.5|0.9|0.6|0|0|0|
Pan pita|pan pita,pita|1 unidad (60 g)|60|165|5.5|33|0.7|1.3|0|0|0|
Tortilla de trigo|tortilla de trigo,wrap,tortilla mexicana,tortilla|1 unidad (40 g)|40|120|3.3|20|3|1.2|0|0|0|
Avena|avena|1/2 taza (40 g)|40|150|5.3|27|2.6|4|0|0|0|sC,taza2
Granola|granola|1/2 taza (50 g)|50|230|5.5|32|9|3.5|0|0|0|taza2
Cereal de desayuno|cereal,cereales,corn flakes,chocapic|1 taza (30 g)|30|115|2|25|0.8|1|0|0|0|
Galletas de agua|galletas de agua,galleta de agua,galletas soda|4 unidades (25 g)|25|110|2.5|17|3.5|0.8|0|0|0|
Galletas dulces|galleta,galletas,galletas dulces,triton,oreo|3 unidades (30 g)|30|145|1.8|21|6|0.6|0|0|0|
Arroz blanco|arroz,arroz blanco,arroz graneado|1 taza cocida (160 g)|160|205|4.2|45|0.4|0.6|0|0|0|sC,plato1.5
Arroz integral|arroz integral|1 taza cocida (195 g)|195|218|4.5|46|1.6|3.5|0|0|0|plato1.5
Fideos|fideos,tallarines,tallarin,pasta,spaghetti,espagueti,espirales,corbatas|1 taza cocida (140 g)|140|220|8|43|1.3|2.5|0|0|0|sC,plato1.5
Quínoa|quinoa|1 taza cocida (185 g)|185|222|8|39|3.6|5|0|0|0|sC,plato1.5
Papa cocida|papa,papas,papa cocida,papas cocidas,papa al horno,papas al horno|1 unidad mediana (150 g)|150|116|2.5|26|0.2|2.7|0|0|0|sC
Puré de papas|pure,pure de papas|1 taza (210 g)|210|215|4|35|7|3|0|0|0|plato1.5
Papas fritas|papas fritas,papitas fritas|1 porción mediana (120 g)|120|365|4|44|19|4|0|0|0|
Choclo|choclo|1 taza (150 g)|150|135|4.8|29|1.8|3.5|0|0|0|
Camote|camote|1 unidad (130 g)|130|112|2|26|0.1|3.9|0|0|0|
Pechuga de pollo|pechuga,pechuga de pollo,pollo,pollo a la plancha,filete de pollo,pollo al horno,pollo cocido,pollo desmenuzado|1 filete (150 g cocido)|150|248|46|0|5.4|0|0|0|0|sP,fry
Trutro de pollo|trutro,trutro de pollo,pierna de pollo,pollo asado,trutro entero|1 trutro (120 g sin hueso)|120|250|28|0|15|0|0|0|0|fry
Pavo|pavo,pechuga de pavo,filete de pavo|150 g cocido|150|220|45|0|3|0|0|0|0|sP
Carne molida|carne molida,molida,carne molida 5%|150 g cocida|150|255|39|0|10.5|0|0|0|0|sP
Bistec (posta o asiento)|bistec,posta,carne,filete de vacuno,asiento,carne de vacuno,carne a la plancha,palanca|1 bistec (150 g cocido)|150|270|45|0|9.5|0|0|0|0|sP,fry
Asado (lomo vetado, entraña)|lomo vetado,asado,entrana,lomo liso,costillar,plateada|150 g cocido|150|405|38|0|27|0|0|0|0|
Chuleta de cerdo|chuleta,chuleta de cerdo,cerdo,lomo de cerdo|1 chuleta (130 g cocida)|130|290|32|0|17.5|0|0|0|0|fry
Salmón|salmon,filete de salmon|1 filete (150 g cocido)|150|310|33|0|19|0|0|0|0|pes,sP
Merluza o reineta|merluza,reineta,pescado,congrio,tilapia,pescado a la plancha|1 filete (150 g cocido)|150|165|34|0|2.5|0|0|0|0|pes,sP,fry
Jurel en lata|jurel,jurel en lata|1/2 lata escurrida (110 g)|110|170|25|0|7.5|0|0|0|0|pes,sP,lata2
Atún al agua|atun,atun al agua,lata de atun|1 lata escurrida (120 g)|120|130|29|0|1|0|0|0|0|pes,sP
Atún en aceite|atun en aceite|1 lata escurrida (120 g)|120|235|31|0|12|0|0|0|0|pes
Jamón de pavo|jamon,jamon de pavo,jamon pierna,lamina de jamon,jamon acaramelado|1 lámina (15 g)|15|17|2.8|0.5|0.4|0|0|0|0|
Vienesa|vienesa,salchicha|1 unidad (40 g)|40|105|4.5|1.5|9|0|0|0|0|
Longaniza o chorizo|longaniza,chorizo,choripan|1 unidad (80 g)|80|260|12|1.5|23|0|0|0|0|
Tofu|tofu|100 g|100|144|15.5|3.5|8.7|2|0|0|0|
Proteína en polvo|proteina,whey,batido de proteina,scoop,proteina en polvo,shake de proteina|1 scoop (30 g)|30|120|24|3|1.5|0|0|0|0|sP
Lentejas|lentejas,lenteja|1 taza cocida (200 g)|200|230|18|40|0.8|15.6|0|0|0|leg,sP,plato1.5
Porotos|porotos,porotos negros,porotos granados,frijoles,porotos burros|1 taza cocida (180 g)|180|225|15|40|0.9|13|0|0|0|leg,plato1.5
Garbanzos|garbanzos,garbanzo|1 taza cocida (165 g)|165|270|14.5|45|4.2|12.5|0|0|0|leg,plato1.5
Hummus|hummus|2 cucharadas (30 g)|30|80|2.4|4.3|6|1.8|0|0|0|leg
Arvejas|arvejas,arveja|1/2 taza (80 g)|80|62|4.1|11|0.3|4.4|1|0|0|
Lechuga|lechuga,ensalada de lechuga|1 taza (50 g)|50|8|0.7|1.5|0.1|1|1|0|0|sV,plato2
Tomate|tomate,ensalada de tomate,tomate cherry,tomates cherry|1 unidad (120 g)|120|22|1|4.7|0.2|1.4|1|0|0|sV
Ensalada chilena|ensalada chilena|1 taza, tomate y cebolla (150 g)|150|35|1.4|7.5|0.2|1.8|1.5|0|0|sV,plato1.5
Ensalada mixta|ensalada,ensalada mixta,ensalada verde,ensaladas|1 plato, sin aliño (150 g)|150|35|2|6.5|0.3|2.5|1.5|0|0|sV
Zanahoria|zanahoria,ensalada de zanahoria,zanahoria rallada|1 unidad (80 g)|80|33|0.7|7.7|0.2|2.2|1|0|0|sV
Brócoli|brocoli|1 taza cocida (155 g)|155|55|3.7|11|0.6|5|2|0|0|sV
Coliflor|coliflor|1 taza cocida (125 g)|125|29|2.3|5|0.6|2.9|2|0|0|sV
Zapallo italiano|zapallo italiano,zucchini|1 unidad (200 g)|200|34|2.4|6.2|0.6|2|2|0|0|sV
Zapallo|zapallo,zapallo camote|1 taza cocido (200 g)|200|80|1.8|20|0.2|5|1|0|0|
Espinaca|espinaca|1 taza cocida (180 g)|180|41|5.3|6.8|0.5|4.3|2|0|0|sV
Acelga|acelga|1 taza cocida (175 g)|175|35|3.3|7|0.1|3.7|2|0|0|
Betarraga|betarraga,ensalada de betarraga|1/2 taza (85 g)|85|37|1.4|8.5|0.2|1.7|1|0|0|
Pepino|pepino,ensalada de pepino|1 taza (120 g)|120|18|0.8|4.3|0.1|0.6|1|0|0|sV
Porotos verdes|porotos verdes,vainitas|1 taza cocida (125 g)|125|44|2.4|10|0.3|4|2|0|0|sV
Pimentón|pimenton|1/2 unidad (80 g)|80|22|0.8|4.8|0.2|1.7|1|0|0|
Champiñones|champinones,champinon,hongos|1 taza (90 g)|90|20|2.8|3|0.3|0.9|1|0|0|
Cebolla|cebolla|1/2 unidad (60 g)|60|24|0.7|5.6|0|1|0.5|0|0|
Repollo|repollo,ensalada de repollo|1 taza (90 g)|90|22|1.1|5|0.1|2.3|1|0|0|
Apio|apio|1 taza (100 g)|100|16|0.7|3|0.2|1.6|1|0|0|
Verduras salteadas|verduras salteadas,salteado de verduras,wok de verduras,verduras al vapor,verduras|1 taza (150 g)|150|90|3|10|4.5|3.5|1.5|0|0|sV
Palta|palta,aguacate|1/4 de palta (40 g)|40|64|0.8|3.4|5.9|2.7|0|0|0|cnt4
Manzana|manzana,manzana verde,manzana roja|1 unidad (150 g)|150|78|0.4|21|0.3|3.6|0|1|0|sF
Plátano|platano,banana,banano|1 unidad (120 g)|120|107|1.3|27|0.4|3.1|0|1|0|sF
Naranja|naranja|1 unidad (150 g)|150|71|1.4|18|0.2|3.6|0|1|0|sF
Mandarina|mandarina,clementina|1 unidad (80 g)|80|43|0.7|11|0.2|1.4|0|0.5|0|
Pera|pera|1 unidad (170 g)|170|97|0.6|26|0.2|5.3|0|1|0|sF
Kiwi|kiwi,kiwi gold|1 unidad (75 g)|75|46|0.9|11|0.4|2.3|0|1|0|sF
Frutillas|frutillas,frutilla|1 taza (150 g)|150|48|1|11.5|0.5|3|0|1|0|sF
Uvas|uvas,uva,uva verde,uva morada|1 taza (150 g)|150|104|1.1|27|0.2|1.4|0|1|0|
Durazno|durazno,nectarin|1 unidad (150 g)|150|59|1.4|14|0.4|2.3|0|1|0|
Arándanos|arandanos,arandano|1 taza (140 g)|140|80|1|20|0.5|3.4|0|1|0|sF
Sandía|sandia|1 taza (150 g)|150|46|0.9|11.5|0.2|0.6|0|1|0|
Melón|melon,melon calameno,melon tuna|1 taza (160 g)|160|54|1.3|13|0.3|1.4|0|1|0|
Jugo natural|jugo,jugo natural,jugo de naranja|1 vaso (200 ml)|200|90|1.4|21|0.4|0.4|0|0|0|
Jugo en caja o néctar|jugo en caja,nectar|1 vaso (200 ml)|200|90|0|22|0|0|0|0|0|
Nueces|nueces,nuez|1 puñado (30 g)|30|196|4.6|4.1|19.5|2|0|0|0|sC
Almendras|almendras,almendra|1 puñado (30 g)|30|174|6.4|6.5|15|3.7|0|0|0|sC
Maní|mani|1 puñado (30 g)|30|170|7.7|4.8|14.8|2.4|0|0|0|
Mantequilla de maní|mantequilla de mani,peanut butter|1 cucharada (16 g)|16|95|3.6|3.2|8|1|0|0|0|sC
Aceite|aceite,aceite de oliva,aceite vegetal|1 cucharadita (5 ml)|5|45|0|0|5|0|0|0|0|cda3,cucharada3
Mayonesa|mayonesa,mayo|1 cucharada (15 g)|15|100|0.2|0.1|11|0|0|0|0|
Ketchup|ketchup|1 cucharada (17 g)|17|17|0.2|4|0|0|0|0|0|
Mostaza|mostaza|1 cucharadita (5 g)|5|3|0.2|0.3|0.2|0|0|0|0|
Manjar|manjar,dulce de leche|1 cucharada (20 g)|20|64|1.4|11|1.5|0|0|0|0|
Mermelada|mermelada|1 cucharada (20 g)|20|50|0|13|0|0|0|0|0|
Azúcar|azucar|1 cucharadita (5 g)|5|20|0|5|0|0|0|0|0|cda3,cucharada3
Miel|miel|1 cucharada (21 g)|21|64|0|17|0|0|0|0|0|
Café o té solo|cafe,te,cafe negro,te solo,agua de hierbas,infusion,mate|1 taza|200|2|0.1|0.3|0|0|0|0|0|
Café con leche|cafe con leche,cortado,latte,te con leche|1 taza (con 100 ml de leche)|200|50|3.4|5|1.5|0|0|0|0.5|
Bebida azucarada|bebida,coca cola,coca,fanta,sprite,bebida normal|1 lata (350 ml)|350|147|0|37|0|0|0|0|0|vaso0.6
Bebida zero o light|coca zero,bebida zero,bebida light,zero|1 lata (350 ml)|350|1|0|0|0|0|0|0|0|
Cerveza|cerveza,chela,schop|1 lata (350 ml)|350|150|1.6|12.5|0|0|0|0|0|
Vino|vino,copa de vino,vino tinto,vino blanco|1 copa (150 ml)|150|125|0.1|4|0|0|0|0|0|
Licuado de plátano con leche|leche con platano,batido de platano,licuado,licuado de platano|1 vaso (300 ml)|300|210|8|38|3.5|2|0|1|1|
Empanada de pino|empanada,empanada de pino|1 unidad de horno (250 g)|250|560|22|58|26|3|0|0|0|
Empanada de queso frita|empanada de queso|1 unidad (130 g)|130|380|12|35|21|1.5|0|0|0|
Completo italiano|completo,completo italiano,hot dog,italiano,dinamico,completo dinamico|1 unidad|250|500|15|45|29|4|0.5|0|0|
Sopaipilla|sopaipilla|1 unidad (60 g)|60|190|2.8|22|10|1.5|0|0|0|
Cazuela|cazuela,cazuela de vacuno,cazuela de pollo,cazuela de ave|1 plato|500|380|28|38|12|5|1|0|0|
Pastel de choclo|pastel de choclo|1 porción en greda (400 g)|400|640|30|60|30|6|0|0|0|
Porotos con riendas|porotos con riendas,porotos con mazamorra|1 plato (400 g)|400|470|20|75|9|15|0.5|0|0|leg
Charquicán|charquican|1 plato (350 g)|350|380|18|45|13|7|1|0|0|
Lentejas guisadas|lentejas guisadas,plato de lentejas,lentejas con arroz|1 plato (350 g)|350|360|22|55|6|18|0.5|0|0|leg
Humita|humita,humitas|1 unidad (200 g)|200|300|7|45|10|5|0|0|0|
Arroz con pollo|arroz con pollo|1 plato (350 g)|350|520|35|60|13|2|0|0|0|
Tallarines con salsa|tallarines con salsa,tallarines bolonesa,fideos con salsa,tallarines con carne,spaghetti bolonesa|1 plato (400 g)|400|560|28|75|15|5|0.5|0|0|
Pizza|pizza,trozo de pizza|1 trozo (110 g)|110|290|12|33|12|2|0|0|0|
Hamburguesa|hamburguesa|1 unidad completa|220|540|28|40|29|2.5|0|0|0|
Sushi|sushi,rolls,roll|10 piezas|250|400|15|65|8|2|0|0|0|
Handroll|handroll|1 unidad|220|330|12|50|9|1.5|0|0|0|
Churrasco o Barros Luco|churrasco,barros luco,chacarero,lomito,sandwich de lomo|1 sándwich|300|650|35|55|32|3|0|0|0|
Sándwich ave palta|ave palta,ave mayo,sandwich,sandwich de pollo|1 sándwich en marraqueta|220|450|25|45|18|3|0|0|0|
Mote con huesillo|mote con huesillo|1 vaso (400 ml)|400|330|3|78|0.5|4|0|0|0|
Chocolate|chocolate,barra de chocolate,sahne nuss,trencito|1 barra (30 g)|30|160|2|17|9.5|1|0|0|0|
Helado|helado|1 bola (60 g)|60|120|2|15|6|0|0|0|0|
Queque o kuchen|queque,kuchen,torta,pastel,trozo de torta|1 trozo (80 g)|80|300|4.5|42|13|1|0|0|0|
Barra de cereal|barra de cereal,barrita de cereal|1 unidad (25 g)|25|100|1.5|18|2.5|1|0|0|0|
Barra de proteína|barra de proteina,barrita proteica,barra proteica|1 unidad (45 g)|45|180|15|18|6|4|0|0|0|sP
Pan amasado|pan amasado,amasado|1 unidad (100 g)|100|300|8|50|7.5|2|0|0|0|
Pan de completo|pan de completo,pan de hot dog|1 unidad (60 g)|60|165|5|30|2.5|1.2|0|0|0|
Pan de hamburguesa|pan de hamburguesa|1 unidad (70 g)|70|190|6.5|35|3|1.5|0|0|0|
Tostadas|tostada,tostadas,pan tostado|2 rebanadas (50 g)|50|135|4.5|25|1.8|1.5|0|0|0|
Panqueque|panqueque,panqueques,crepe,crepes|1 unidad (50 g)|50|115|3.5|15|4.5|0.5|0|0|0|
Waffle|waffle,waffles,gofre|1 unidad (75 g)|75|220|6|25|11|1|0|0|0|
Tortilla de huevo con verduras|tortilla de huevo,omelette,omelet,tortilla de verduras,tortilla de acelga,tortilla de espinaca|2 huevos con verduras (150 g)|150|200|13.5|4|14.5|1|0.5|0|0|
Yogur griego|yogur griego,yogurt griego|1 unidad (150 g)|150|150|13|7|7.5|0|0|0|1|
Leche cultivada|leche cultivada,cultivado|1 unidad (200 ml)|200|150|6|23|3.5|0|0|0|1|
Queso de cabra|queso de cabra|1 trozo (30 g)|30|95|6|0.5|7.5|0|0|0|0.75|
Ricotta|ricotta|1/4 taza (60 g)|60|100|7|2|7|0|0|0|0.5|
Queso crema|queso crema,philadelphia|1 cucharada (15 g)|15|50|1|0.6|5|0|0|0|0|
Crema de leche|crema,crema de leche|1 cucharada (15 g)|15|50|0.3|0.4|5.3|0|0|0|0|
Milo o Cola Cao con leche|milo,cola cao,colacao,leche con milo,chocolate caliente|1 taza con leche (220 ml)|220|170|8|25|4|1|0|0|1|
Jugo en polvo|jugo en polvo,zuko|1 vaso (200 ml)|200|60|0|15|0|0|0|0|0|
Bebida energética|energetica,red bull,monster,bebida energetica|1 lata (250 ml)|250|115|0|28|0|0|0|0|0|
Pisco sour|pisco sour|1 vaso (150 ml)|150|240|1|20|0|0|0|0|0|
Piscola|piscola,roncola,ron con coca|1 vaso (250 ml)|250|210|0|23|0|0|0|0|0|
Terremoto|terremoto|1 vaso (500 ml)|500|450|0.5|60|1.5|0|0|0|0|
Cola de mono|cola de mono|1 vaso (150 ml)|150|220|3|25|3|0|0|0|0.5|
Arroz con leche|arroz con leche|1 taza (250 g)|250|330|8|60|6.5|0.5|0|0|1|
Sémola con leche|semola con leche,semola|1 taza (250 g)|250|250|8|45|4|0.5|0|0|1|
Mote de trigo|mote,mote de trigo|1 taza cocido (160 g)|160|190|6|40|1|5|0|0|0|plato1.5
Ñoquis|noquis,gnocchi|1 plato (250 g)|250|330|7|70|1.5|3|0|0|0|
Ravioles|ravioles,raviolis|1 plato (250 g)|250|450|18|60|15|3|0|0|0.5|
Lasaña|lasana,lasagna|1 porción (300 g)|300|480|26|40|23|3|0.5|0|1|
Canelones|canelones|2 unidades (300 g)|300|450|22|40|22|3|0.5|0|0.5|
Pollo arvejado|pollo arvejado|1 plato (350 g)|350|380|35|20|17|5|1|0|0|
Carbonada|carbonada|1 plato (400 g)|400|330|22|35|11|5|1|0|0|
Ajiaco|ajiaco|1 plato (400 g)|400|320|20|35|11|3|0.5|0|0|
Pantrucas|pantrucas|1 plato (400 g)|400|380|18|50|12|2|0.5|0|0|
Chupe de jaiba|chupe de jaiba,chupe de mariscos,chupe de locos,chupe|1 pocillo (250 g)|250|420|25|20|26|1|0|0|0.5|pes
Paila marina|paila marina|1 plato (450 g)|450|330|40|12|13|1|0.5|0|0|pes
Caldillo de congrio|caldillo de congrio,caldillo|1 plato (450 g)|450|320|32|22|11|2|0.5|0|0|pes
Budín de zapallo italiano|budin de zapallo italiano,budin|1 porción (200 g)|200|230|12|12|15|2|1|0|0.5|
Guiso de zapallo italiano|guiso de zapallo italiano,guiso|1 plato (300 g)|300|200|10|14|11|3|1.5|0|0|
Tomaticán|tomatican|1 plato (300 g)|300|310|22|20|15|4|1.5|0|0|
Pastel de papas|pastel de papas|1 porción (350 g)|350|520|28|45|25|4|0|0|0.5|
Empanada de mariscos|empanada de mariscos|1 unidad (220 g)|220|480|20|50|22|2|0|0|0|pes
Chorrillana|chorrillana|1 porción para uno (400 g)|400|950|40|65|58|6|0.5|0|0|
Papas mayo|papas mayo,papas con mayonesa|1 taza (200 g)|200|310|3.5|30|20|3|0|0|0|
Salpicón|salpicon|1 plato (300 g)|300|250|22|15|12|4|1.5|0|0|
Choritos|choritos,choros,mejillones|1 taza sin concha (150 g)|150|130|20|5|3.5|0|0|0|0|pes
Machas a la parmesana|machas,machas a la parmesana|6 unidades (150 g)|150|280|20|5|20|0|0|0|1|pes
Camarones|camarones,camaron|1 taza (150 g)|150|150|30|1|2|0|0|0|0|pes
Pescado frito|pescado frito,merluza frita,reineta frita,pescado apanado|1 filete apanado (180 g)|180|380|30|15|22|0.5|0|0|0|pes
Nuggets de pollo|nuggets,nugget,pollo apanado|6 unidades (100 g)|100|290|15|17|18|1|0|0|0|
Milanesa|milanesa,escalopa,schnitzel|1 unidad (150 g)|150|420|30|20|24|1|0|0|0|
Lomo a lo pobre|a lo pobre,bistec a lo pobre,lomo a lo pobre|1 plato con papas fritas, huevos y cebolla|500|1050|55|55|68|5|0|0|0|
Pernil|pernil|150 g|150|370|35|0|25|0|0|0|0|
Prieta|prieta|1 unidad (100 g)|100|330|14|8|27|0.5|0|0|0|
Arrollado|arrollado|2 rodajas (60 g)|60|180|10|1|15|0|0|0|0|
Cuarto de pollo asado|cuarto de pollo,pollo asado cuarto,cuarto de pollo asado|1/4 de pollo con piel (250 g)|250|500|50|0|33|0|0|0|0|
Jamón queso|jamon queso,jamon y queso,barros jarpa,sandwich de jamon|1 sándwich en marraqueta|180|420|20|50|15|2.5|0|0|0.5|
Shawarma|shawarma,shawarma de pollo|1 unidad|350|650|35|60|28|4|0.5|0|0|
Burrito|burrito|1 unidad|300|600|28|65|24|7|0.5|0|0|
Taco|taco|1 unidad|100|200|10|18|10|2|0.2|0|0|
Papas fritas de bolsa|papas fritas de bolsa,chips,papitas,ramitas,doritos,cheetos,suflitos|1 bolsa chica (45 g)|45|240|3|24|15|2|0|0|0|
Maní confitado|mani confitado|1 bolsa (50 g)|50|260|7|28|14|2|0|0|0|
Alfajor|alfajor|1 unidad (50 g)|50|220|3|30|10|1|0|0|0|
Berlín o donut|berlin,dona,donut|1 unidad (80 g)|80|300|5|38|14|1|0|0|0|
Calzones rotos|calzones rotos|2 unidades (60 g)|60|240|3.5|30|12|0.5|0|0|0|
Chilenito|chilenito|1 unidad (40 g)|40|170|2|28|6|0.3|0|0|0|
Cuchuflí|cuchufli|1 unidad (25 g)|25|110|1|18|3.5|0.3|0|0|0|
Sopaipillas pasadas|sopaipillas pasadas,sopaipilla pasada|2 unidades con chancaca|150|420|4|65|17|2|0|0|0|
Chirimoya|chirimoya|1 taza (160 g)|160|120|2.5|28|1|4.8|0|1|0|
Cerezas|cerezas,guindas|1 taza (140 g)|140|88|1.5|22|0.3|3|0|1|0|
Ciruelas|ciruela,ciruelas|2 unidades (130 g)|130|60|0.9|15|0.4|1.8|0|1|0|
Damascos|damasco,damascos|3 unidades (105 g)|105|50|1.5|12|0.4|2|0|1|0|
Mango|mango|1 taza (165 g)|165|100|1.4|25|0.6|2.6|0|1|0|
Piña|pina,anana|1 taza (165 g)|165|82|0.9|22|0.2|2.3|0|1|0|
Papaya|papaya|1 taza (145 g)|145|62|0.7|16|0.4|2.5|0|1|0|
Tunas|tuna,tunas|2 unidades (200 g)|200|82|1.5|19|1|7|0|1|0|
Pomelo|pomelo|1/2 unidad (150 g)|150|52|1|13|0.2|2|0|1|0|
Ensalada de frutas|ensalada de frutas,macedonia,fruta picada,fruta,frutas|1 taza (180 g)|180|100|1.2|25|0.3|2.8|0|1|0|
Pasas|pasas,pasas rubias|1 cucharada (15 g)|15|45|0.5|12|0|0.6|0|0|0|
Alcachofa|alcachofa|1 unidad (120 g)|120|60|3.5|13|0.2|6.5|1|0|0|
Espárragos|esparragos|1 taza (135 g)|135|27|3|5|0.2|2.8|1.5|0|0|
Berenjena|berenjena|1 taza cocida (100 g)|100|35|0.8|8.7|0.2|2.5|1|0|0|
Habas|habas|1/2 taza (85 g)|85|70|5|12|0.3|4|0|0|0|leg
Rúcula|rucula,espinaca baby,hojas verdes|1 taza (20 g)|20|5|0.5|0.7|0.1|0.3|0.5|0|0|plato3
Palmitos|palmitos|1/2 taza (75 g)|75|20|1.8|3.4|0.5|1.8|1|0|0|
Pebre|pebre|2 cucharadas (30 g)|30|15|0.3|1.5|1|0.4|0.25|0|0|
Crema o sopa de verduras|crema de verduras,sopa de verduras,crema de zapallo,crema de brocoli,sopa|1 plato (300 ml)|300|150|4|20|6|4|1.5|0|0|
Chía|chia|1 cucharada (12 g)|12|58|2|5|3.7|4.1|0|0|0|
Linaza|linaza|1 cucharada (10 g)|10|53|1.8|2.9|4.2|2.7|0|0|0|
Aceitunas|aceitunas,aceituna|5 unidades (20 g)|20|30|0.2|0.8|3|0.6|0|0|0|
Salsa de tomate|salsa de tomate,salsa pomarola,pomarola|1/2 taza (125 g)|125|45|1.5|9|0.4|2|0.5|0|0|
Frambuesas|frambuesa,frambuesas|1 taza (125 g)|125|65|1.5|15|0.8|8|0|1|0|
Moras|mora,moras,zarzamora|1 taza (145 g)|145|62|2|14|0.7|7.6|0|1|0|
Mix de berries|berries,mix de berries,frutos rojos,berries congelados|1 taza (140 g)|140|70|1.2|16|0.5|5.5|0|1|0|
Calafate|calafate|1/2 taza (50 g)|50|40|0.6|9|0.3|3|0|0.5|0|
Maqui|maqui|1/2 taza (50 g)|50|40|0.6|9|0.4|3|0|0.5|0|
Murta|murta,murtilla,uñi|1/2 taza (50 g)|50|40|0.4|9|0.3|3|0|0.5|0|
Membrillo|membrillo|1 unidad (150 g)|150|86|0.6|23|0.2|2.9|0|1|0|
Dulce de membrillo|dulce de membrillo|1 trozo (30 g)|30|80|0.1|20|0|0.5|0|0|0|
Granada|granada|1/2 unidad (140 g)|140|116|2.3|26|1.6|5.6|0|1|0|
Higos|higo,higos,breva,brevas|2 unidades (100 g)|100|74|0.8|19|0.3|2.9|0|1|0|
Caqui|caqui,kaki|1 unidad (170 g)|170|119|1|31|0.3|6|0|1|0|
Maracuyá|maracuya,fruta de la pasion|2 unidades (40 g de pulpa)|40|39|0.9|9|0.3|4|0|0.5|0|
Nísperos|nispero,nisperos|4 unidades (120 g)|120|56|0.5|14|0.2|2|0|1|0|
Lúcuma|lucuma|1/2 taza (100 g)|100|99|1.5|25|0.5|1.3|0|1|0|
Pepino dulce|pepino dulce|1 unidad (150 g)|150|33|0.6|8|0.1|1.5|0|1|0|
Limón|limon,jugo de limon|1 unidad (60 g)|60|17|0.6|5.4|0.2|1.6|0|0|0|
Coco rallado|coco,coco rallado|2 cucharadas (15 g)|15|54|0.5|2.3|5|1.4|0|0|0|
Dátiles|datil,datiles|3 unidades (24 g)|24|67|0.6|18|0|1.9|0|0|0|
Ciruelas secas|ciruelas secas,ciruela seca,ciruela deshidratada|4 unidades (40 g)|40|96|0.9|25|0.2|2.8|0|0.5|0|
Huesillos|huesillo,huesillos|2 unidades (30 g)|30|72|1|19|0.2|2.5|0|0.5|0|
Fruta deshidratada|damascos secos,orejones,fruta deshidratada,fruta seca|1/4 taza (40 g)|40|96|1.4|25|0.2|2.9|0|0.5|0|
Duraznos en conserva|durazno en conserva,duraznos en conserva,duraznos en almibar,conserva de durazno|2 mitades con jugo (120 g)|120|65|0.5|17|0|1.3|0|0.5|0|
Compota de manzana|compota,compota de manzana,pure de manzana|1 unidad (100 g)|100|68|0.2|17|0.1|1.2|0|0.5|0|
Rabanitos|rabanito,rabanitos,rabano|1/2 taza (60 g)|60|10|0.4|2|0.1|1|0.5|0|0|
Puerro|puerro,puerros|1/2 taza cocido (50 g)|50|16|0.4|4|0.1|0.5|0.5|0|0|
Kale|kale,col rizada|1 taza cruda (20 g)|20|10|0.9|1|0.3|0.8|0.5|0|0|
Repollitos de Bruselas|repollitos de bruselas,coles de bruselas,repollito de bruselas|1 taza cocida (155 g)|155|56|4|11|0.8|4|2|0|0|
Pepinillos|pepinillos,pepinillo|3 unidades (45 g)|45|5|0.2|1|0.1|0.5|0.25|0|0|
`;
