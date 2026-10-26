// Pílulas de gramática: explicação curta comparando com o português + exercícios.
// Formato de exercício: { q, options: [...], answer: índice, explain }
// `pairs` (opcional): palavras/frases para ouvir e repetir (pronúncia).

export const GRAMMAR = [
  {
    id: 'pronunciacion',
    level: 'A1',
    emoji: '👄',
    title: 'Pronúncia da Espanha',
    summary: 'j/g, z/c, ll/y, r/rr e vogais sem nasalizar',
    html: `
<p>O espanhol de Madrid tem sons que o português não tem — e o brasileiro tende a "abrasileirar" outros.</p>
<table>
<tr><th>Escrita</th><th>Som</th><th>Exemplo</th></tr>
<tr><td><b>j</b>, <b>g</b> + e/i</td><td>raspado no fundo da garganta (mais forte que o "rr" carioca)</td><td>jamón, gente, ojo</td></tr>
<tr><td><b>z</b>, <b>c</b> + e/i</td><td>como o "th" de <i>think</i> (a "distinción")</td><td>zapato, cerveza, gracias</td></tr>
<tr><td><b>s</b></td><td>sempre "s" sibilante — nunca "z", nem entre vogais</td><td>casa, mesa, rosa</td></tr>
<tr><td><b>ll</b>, <b>y</b></td><td>parecido com o "i" de "iate"</td><td>calle, yo, lluvia</td></tr>
<tr><td><b>r</b> × <b>rr</b></td><td>r = batido (como em "caro"); rr e r inicial = vibrado múltiplo</td><td>pero × perro</td></tr>
<tr><td><b>d</b> final / entre vogais</td><td>bem suave, quase some em Madrid</td><td>Madrid, cansado</td></tr>
<tr><td><b>b</b> = <b>v</b></td><td>mesmo som (nunca o "v" do português)</td><td>vino, vaso, Valencia</td></tr>
</table>
<div class="tip">🇧🇷 Os maiores "sotaques" de brasileiro: <b>nasalizar</b> vogais (<i>mano</i> ≠ "mãno", <i>bien</i> ≠ "biẽ"),
transformar <b>-e/-o finais</b> em "i/u" (<i>noche</i> é "notche", não "nótchi"; <i>todo</i> é "todo", não "todu")
e pronunciar <b>ti/di</b> como "tchi/dji" (<i>tienda</i>, <i>día</i>: t e d secos!).</div>
<p>Pares para ouvir — toque em 🔊 e repita em voz alta:</p>`,
    pairs: [
      ['casa', 'caza', 's sibilante × z (th)'],
      ['cien', 'sien', 'c = th × s'],
      ['pero', 'perro', 'r batido × rr vibrado'],
      ['caro', 'carro', 'r batido × rr vibrado'],
      ['jamón', 'gente', 'j e g raspados'],
      ['calle', 'yo', 'll e y iguais'],
      ['tienda', 'día', 't e d secos (sem "tch"/"dj")'],
      ['noche', 'todo', 'vogais finais fechadas: e, o'],
      ['mano', 'bien', 'sem nasalizar'],
      ['vino', 'bueno', 'b = v'],
    ],
    exercises: [
      { q: 'Em Madrid, "cerveza" se pronuncia com…', options: ['s, s', 'th, th (como em think)', 'z, z'], answer: 1, explain: 'c+e e z soam como "th" na distinción: cer-ve-za → "θerbeθa".' },
      { q: 'O "s" de "casa" e "mesa" soa…', options: ['como "z" (casa = "caza")', 'sempre como "s"'], answer: 1, explain: 'Em espanhol o s nunca vira z entre vogais.' },
      { q: '"Pero" e "perro" significam…', options: ['a mesma coisa', 'mas × cachorro'], answer: 1, explain: 'r batido × rr vibrado muda o sentido: pero = mas; perro = cachorro.' },
      { q: 'Como soa o "j" de "jamón"?', options: ['como o j de "janela"', 'raspado na garganta', 'como "i"'], answer: 1, explain: 'É uma fricativa velar forte, parecida com o "rr" carioca bem raspado.' },
      { q: 'O "v" de "vino"…', options: ['é igual ao "v" do português', 'soa como "b"'], answer: 1, explain: 'b e v têm o mesmo som em espanhol.' },
      { q: '"Día" se pronuncia…', options: ['"djía"', '"día" com d seco'], answer: 1, explain: 'O espanhol não palataliza t/d antes de i.' },
    ],
  },
  {
    id: 'ser-estar',
    level: 'A1',
    emoji: '⚖️',
    title: 'Ser × estar',
    summary: 'Parecido com o português… mas com armadilhas',
    html: `
<p>A lógica é a mesma do português: <b>ser</b> para identidade e características; <b>estar</b> para estados e localização.
As diferenças que travam brasileiros:</p>
<table>
<tr><th>Português</th><th>Espanhol</th></tr>
<tr><td>Ele <b>é</b> casado</td><td>Está casado <span class="muted">(estado civil → estar)</span></td></tr>
<tr><td>A festa <b>é</b> na casa da Ana</td><td>La fiesta <b>es</b> en casa de Ana <span class="muted">(evento → ser)</span></td></tr>
<tr><td>Madri <b>fica</b> no centro</td><td>Madrid <b>está</b> en el centro</td></tr>
<tr><td>Está bom! (comida)</td><td>¡Está bueno! — mas <i>es bueno</i> = é de boa qualidade</td></tr>
</table>
<p>Adjetivos que mudam de sentido:</p>
<ul>
<li><b>ser listo</b> = ser esperto · <b>estar listo</b> = estar pronto</li>
<li><b>ser aburrido</b> = ser chato · <b>estar aburrido</b> = estar entediado</li>
<li><b>ser malo</b> = ser mau · <b>estar malo</b> = estar doente</li>
<li><b>ser rico</b> = ser rico · <b>estar rico</b> = estar gostoso</li>
</ul>
<div class="tip">Truque: <b>onde acontece</b> um evento → <i>ser</i>. <b>Onde está</b> uma coisa/pessoa → <i>estar</i>.</div>`,
    exercises: [
      { q: 'Mi hermano ___ casado.', options: ['es', 'está'], answer: 1, explain: 'Estado civil com casado/soltero/divorciado usa estar.' },
      { q: 'La reunión ___ en la sala 4.', options: ['es', 'está'], answer: 0, explain: 'Lugar de um evento → ser.' },
      { q: 'Mis llaves ___ en la mesa.', options: ['son', 'están'], answer: 1, explain: 'Localização de objetos → estar.' },
      { q: '¿___ listo? Nos vamos.', options: ['Eres', 'Estás'], answer: 1, explain: 'Estar listo = estar pronto.' },
      { q: 'Esta paella ___ riquísima.', options: ['es', 'está'], answer: 1, explain: 'Sabor percebido agora → estar.' },
      { q: 'Ana ___ muy lista: siempre saca buenas notas.', options: ['es', 'está'], answer: 0, explain: 'Ser lista = ser inteligente.' },
      { q: 'Madrid ___ la capital de España.', options: ['es', 'está'], answer: 0, explain: 'Identidade/definição → ser.' },
      { q: 'Hoy no voy a clase, ___ malo.', options: ['soy', 'estoy'], answer: 1, explain: 'Estar malo = estar doente.' },
    ],
  },
  {
    id: 'gustar',
    level: 'A1',
    emoji: '❤️',
    title: 'Gustar (e encantar, doler, apetecer…)',
    summary: 'A coisa que agrada é o sujeito',
    html: `
<p>Em espanhol não se diz "yo gusto de". A estrutura é: <b>(a mí) me gusta + coisa</b> — a coisa é o sujeito,
por isso o verbo concorda com ela:</p>
<table>
<tr><td>Me gusta <b>el cine</b></td><td>Me gusta<b>n</b> <b>las series</b></td></tr>
<tr><td>Te gusta bailar</td><td>Nos gusta<b>n</b> los perros</td></tr>
<tr><td>Le gusta (a él/ella/usted)</td><td>Os gusta (a vosotros) · Les gusta (a ellos)</td></tr>
</table>
<p>Funcionam igual: <b>encantar</b> (adorar), <b>interesar</b>, <b>doler</b> (me duele la cabeza),
<b>apetecer</b> (¿te apetece un café?), <b>molestar</b>, <b>aburrir</b>, <b>importar</b>, <b>quedar</b> (me queda grande).</p>
<div class="tip">Sem "de"! <i>Me gusta <s>de</s> la música</i> ❌ → <b>Me gusta la música</b> ✅.
Para concordar: <b>a mí también</b> / <b>a mí tampoco</b>; para discordar: <b>a mí sí</b> / <b>a mí no</b>.</div>`,
    exercises: [
      { q: 'Me ___ mucho las películas españolas.', options: ['gusta', 'gustan'], answer: 1, explain: '"Las películas" é plural → gustan.' },
      { q: '¿___ gusta el fútbol a ti?', options: ['Te', 'Tú'], answer: 0, explain: 'O pronome é te: ¿Te gusta…?' },
      { q: 'A mis padres ___ encanta viajar.', options: ['les', 'los'], answer: 0, explain: 'Pronome de objeto indireto plural: les.' },
      { q: 'Me ___ los pies después de caminar tanto.', options: ['duele', 'duelen'], answer: 1, explain: 'Los pies (plural) → duelen.' },
      { q: '—No me gusta el café. —A mí ___.', options: ['también', 'tampoco'], answer: 1, explain: 'Concordar com uma negação → tampoco.' },
      { q: 'Escolha a frase correta:', options: ['Yo gusto de la música.', 'Me gusta la música.', 'Me gusta de la música.'], answer: 1, explain: 'Gustar não leva "de" e usa pronome: me gusta.' },
      { q: '¿Os ___ ir al cine esta noche?', options: ['apetece', 'apetecéis'], answer: 0, explain: 'O sujeito é "ir al cine" (singular) → apetece.' },
    ],
  },
  {
    id: 'vosotros',
    level: 'A1',
    emoji: '👥',
    title: 'Vosotros: o "vocês" da Espanha',
    summary: 'Tú/vosotros (informal) × usted/ustedes (formal)',
    html: `
<p>Na Espanha, "vocês" informal é <b>vosotros/vosotras</b>, com conjugação própria. <b>Ustedes</b> é formal.</p>
<table>
<tr><th></th><th>-ar</th><th>-er</th><th>-ir</th></tr>
<tr><td>vosotros</td><td>habl<b>áis</b></td><td>com<b>éis</b></td><td>viv<b>ís</b></td></tr>
<tr><td>imperativo</td><td>habl<b>ad</b></td><td>com<b>ed</b></td><td>viv<b>id</b></td></tr>
<tr><td>indefinido</td><td>habl<b>asteis</b></td><td>com<b>isteis</b></td><td>viv<b>isteis</b></td></tr>
</table>
<p>Irregulares importantes: <b>sois</b> (ser), <b>estáis</b>, <b>vais</b>, <b>tenéis</b>, <b>habéis</b> (+ particípio),
<b>podéis</b>, <b>queréis</b>. Pronomes: <b>os</b> (vos/a vocês) e <b>vuestro</b> (de vocês).</p>
<div class="tip">Em aula e com colegas use vosotros: <i>¿Habéis leído el caso?</i> · <i>¿Qué os parece?</i> ·
Com a professora (se ela usar usted): <i>¿Podría usted…?</i></div>`,
    exercises: [
      { q: '¿Vosotros ___ de Madrid?', options: ['son', 'sois', 'estáis'], answer: 1, explain: 'Ser → vosotros sois.' },
      { q: '¿___ leído el caso para mañana?', options: ['Habéis', 'Han', 'Hais'], answer: 0, explain: 'Haber → vosotros habéis.' },
      { q: 'Chicos, ¿qué ___ parece la propuesta?', options: ['les', 'os', 'vos'], answer: 1, explain: 'Pronome de vosotros: os.' },
      { q: '¡___ la tarea antes del viernes! (imperativo, terminar)', options: ['Terminad', 'Termináis', 'Terminen'], answer: 0, explain: 'Imperativo de vosotros: infinitivo com -r → -d.' },
      { q: '¿Dónde ___ ayer? (estar)', options: ['estuvisteis', 'estuvieron', 'estabais'], answer: 0, explain: 'Indefinido de vosotros: estuvisteis.' },
      { q: '¿Es ___ este piso? (de vocês)', options: ['su', 'vuestro'], answer: 1, explain: 'Possessivo de vosotros: vuestro/vuestra.' },
    ],
  },
  {
    id: 'muy-mucho',
    level: 'A1',
    emoji: '➕',
    title: 'Muy × mucho',
    summary: 'Em português é tudo "muito"',
    html: `
<p>O português usa "muito" para tudo; o espanhol separa:</p>
<ul>
<li><b>muy</b> + adjetivo ou advérbio: <i>muy bonito, muy bien, muy tarde</i></li>
<li><b>mucho/mucha/muchos/muchas</b> + substantivo (concorda!): <i>mucho calor, mucha gente, muchos amigos</i></li>
<li>verbo + <b>mucho</b> (invariável): <i>trabajo mucho, me gusta mucho</i></li>
</ul>
<div class="tip">Exceções: <b>mucho mejor / peor / mayor / menor / más / menos</b> (nunca "muy mejor").
E sozinho no fim da resposta: —¿Estás cansado? —Sí, <b>mucho</b>.</div>`,
    exercises: [
      { q: 'Madrid es ___ bonita.', options: ['muy', 'mucho', 'mucha'], answer: 0, explain: 'Antes de adjetivo → muy.' },
      { q: 'Hoy hace ___ calor.', options: ['muy', 'mucho'], answer: 1, explain: 'Calor é substantivo → mucho.' },
      { q: 'Hay ___ gente en el metro.', options: ['mucho', 'mucha', 'muy'], answer: 1, explain: 'Gente é feminino → mucha.' },
      { q: 'Me encuentro ___ mejor.', options: ['muy', 'mucho'], answer: 1, explain: 'Com mejor/peor usa-se mucho.' },
      { q: 'Estudio ___ los fines de semana.', options: ['muy', 'mucho'], answer: 1, explain: 'Depois do verbo → mucho.' },
      { q: 'Tengo ___ amigos en clase.', options: ['muchos', 'muy'], answer: 0, explain: 'Amigos é plural masculino → muchos.' },
    ],
  },
  {
    id: 'articulos',
    level: 'A1',
    emoji: '🔀',
    title: 'Artigos e heterogenéricos',
    summary: 'el puente, la leche, el color… e o neutro "lo"',
    html: `
<p><b>Heterogenéricos</b>: palavras com gênero diferente do português. As mais comuns:</p>
<table>
<tr><th>Masculino em espanhol</th><th>Feminino em espanhol</th></tr>
<tr><td>el puente (a ponte)<br>el árbol (a árvore)<br>el color (a cor)<br>el dolor (a dor)<br>el viaje, el paisaje, el garaje (-aje)<br>el origen (a origem)<br>el equipo (a equipe)</td>
<td>la leche (o leite)<br>la sal (o sal)<br>la miel (o mel)<br>la nariz (o nariz)<br>la sangre (o sangue)<br>la costumbre (o costume)<br>la señal (o sinal)</td></tr>
</table>
<p><b>El agua, el aula, el hambre</b>: palavras femininas que começam com <b>a-/ha- tônico</b> usam <i>el</i> no singular
(mas continuam femininas: <i>el agua fría</i>, <i>las aulas</i>).</p>
<p><b>Lo</b> (neutro) + adjetivo = "o que é…": <i>lo bueno</i> (o bom/o lado bom), <i>lo mejor</i>, <i>lo de siempre</i> (o de sempre).</p>
<div class="tip">Diferenças de uso: na Espanha se diz <b>en casa de Ana</b> (sem artigo), <b>los lunes</b> (às segundas)
e não se usa artigo antes de possessivo: <b>mi casa</b> (nunca "la mi casa").</div>`,
    exercises: [
      { q: '¿Me pasas ___ sal, por favor?', options: ['el', 'la'], answer: 1, explain: 'La sal é feminino em espanhol.' },
      { q: '___ puente de Segovia es muy antiguo.', options: ['El', 'La'], answer: 0, explain: 'El puente é masculino.' },
      { q: 'Quiero café con ___ leche fría.', options: ['el', 'la'], answer: 1, explain: 'La leche é feminino.' },
      { q: '___ agua del grifo en Madrid es muy buena.', options: ['El', 'La'], answer: 0, explain: 'Agua começa com a tônica → el agua (mas é feminina: buena).' },
      { q: '¿Qué tal ___ viaje?', options: ['el', 'la'], answer: 0, explain: 'Palavras em -aje são masculinas.' },
      { q: '___ mejor de Madrid es la gente.', options: ['El', 'Lo', 'La'], answer: 1, explain: 'Lo + adjetivo = o (que é) melhor.' },
      { q: 'Tengo ___ dolor de cabeza horrible.', options: ['un', 'una'], answer: 0, explain: 'El dolor é masculino.' },
    ],
  },
  {
    id: 'preposiciones',
    level: 'A2',
    emoji: '🧭',
    title: 'Preposições traiçoeiras',
    summary: 'a + pessoa, en/a, por/para, pensar en, soñar con…',
    html: `
<ul>
<li><b>a + pessoa</b> como objeto direto: <i>Veo <b>a</b> María</i>, <i>Conozco <b>a</b> tu hermano</i> (não existe em português).</li>
<li><b>ir a</b> (movimento) × <b>estar en</b> (lugar): <i>Voy <b>a</b> Madrid</i> / <i>Estoy <b>en</b> Madrid</i>. Nunca "voy en Madrid".</li>
<li><b>en</b> + transporte: <i>en metro, en tren, en coche</i> — mas <b>a pie</b>, <b>andando</b>.</li>
<li><b>por</b> = causa, meio, duração aproximada, "por" lugar: <i>gracias por, por la mañana, por la calle</i>.
<b>para</b> = finalidade, destino, prazo, opinião: <i>para ti, para mañana, para mí es fácil</i>.</li>
<li>Regência diferente: <b>pensar en</b> (pensar em), <b>soñar con</b> (sonhar com), <b>casarse con</b>,
<b>enamorarse de</b>, <b>tardar en</b> (demorar para), <b>quedar con</b> (encontrar alguém).</li>
<li>"Há (tempo)" = <b>hace</b>: <i>hace dos años</i>. "Desde há" = <b>desde hace</b>.</li>
</ul>`,
    exercises: [
      { q: 'Ayer vi ___ Lucía en la biblioteca.', options: ['—', 'a', 'en'], answer: 1, explain: 'Objeto direto de pessoa leva a.' },
      { q: 'Mañana voy ___ Toledo.', options: ['en', 'a', 'para'], answer: 1, explain: 'Movimento: ir a.' },
      { q: 'Siempre voy a clase ___ metro.', options: ['en', 'de', 'a'], answer: 0, explain: 'Meio de transporte: en metro.' },
      { q: 'Este regalo es ___ ti.', options: ['por', 'para'], answer: 1, explain: 'Destinatário: para.' },
      { q: 'Gracias ___ tu ayuda.', options: ['por', 'para'], answer: 0, explain: 'Causa/motivo: gracias por.' },
      { q: 'Estoy pensando ___ cambiar de piso.', options: ['de', 'en', 'a'], answer: 1, explain: 'Pensar en.' },
      { q: 'Vivo en Madrid ___ dos meses.', options: ['hace', 'desde hace', 'há'], answer: 1, explain: 'Duração até agora: desde hace.' },
      { q: 'Esta noche he quedado ___ unos amigos.', options: ['con', 'a', 'de'], answer: 0, explain: 'Quedar con alguien = encontrar-se com alguém.' },
    ],
  },
  {
    id: 'pasados',
    level: 'A2',
    emoji: '⏳',
    title: 'Perfecto × indefinido (o uso de Madrid)',
    summary: 'He comido × comí',
    html: `
<p>Na Espanha (e especialmente em Madrid) os dois passados convivem e a escolha depende do <b>período de tempo</b>:</p>
<table>
<tr><th>Pretérito perfecto (he + particípio)</th><th>Indefinido</th></tr>
<tr><td>Período que <b>inclui o agora</b>:<br>hoy, esta mañana, esta semana, este año, ya, todavía no, nunca, alguna vez, últimamente</td>
<td>Período <b>terminado</b>:<br>ayer, anoche, el lunes (pasado), la semana pasada, en 2019, hace dos años</td></tr>
<tr><td><i>Hoy <b>he ido</b> al banco.</i></td><td><i>Ayer <b>fui</b> al banco.</i></td></tr>
<tr><td><i>¿<b>Has estado</b> alguna vez en Sevilla?</i></td><td><i><b>Estuve</b> en Sevilla en 2022.</i></td></tr>
</table>
<p>Particípios irregulares: <b>hecho</b> (hacer), <b>dicho</b>, <b>visto</b>, <b>puesto</b>, <b>escrito</b>, <b>vuelto</b>, <b>abierto</b>, <b>roto</b>, <b>muerto</b>.</p>
<div class="tip">🇧🇷 O brasileiro diz "hoje fui" — em Madrid soa estranho. Treine: <b>Hoy he…</b> · <b>Esta semana he…</b>.
E o auxiliar não se separa do particípio: <i>Ya lo he hecho</i> (nunca "he ya hecho").</div>`,
    exercises: [
      { q: 'Hoy ___ en casa. (desayunar)', options: ['desayuné', 'he desayunado'], answer: 1, explain: 'Hoy → pretérito perfecto.' },
      { q: 'Ayer ___ al cine. (ir)', options: ['fui', 'he ido'], answer: 0, explain: 'Ayer → indefinido.' },
      { q: '¿___ alguna vez paella? (probar)', options: ['Probaste', 'Has probado'], answer: 1, explain: 'Experiência na vida (alguna vez) → perfecto.' },
      { q: 'En 2020 ___ a trabajar en una productora. (empezar)', options: ['empecé', 'he empezado'], answer: 0, explain: 'Data terminada → indefinido.' },
      { q: 'Todavía no ___ el caso. (leer)', options: ['leí', 'he leído'], answer: 1, explain: 'Todavía no → perfecto.' },
      { q: '¿Qué ___ hoy? (hacer)', options: ['has hecho', 'has hacido'], answer: 0, explain: 'Particípio irregular: hecho.' },
      { q: 'La semana pasada ___ tres exámenes. (tener)', options: ['tuve', 'he tenido'], answer: 0, explain: 'Semana pasada → indefinido.' },
      { q: 'Esta semana ___ mucho. (trabajar)', options: ['trabajé', 'he trabajado'], answer: 1, explain: 'Esta semana (ainda não acabou) → perfecto.' },
    ],
  },
  {
    id: 'pronombres',
    level: 'A2',
    emoji: '🎯',
    title: 'Pronomes: lo, la, le, se lo',
    summary: 'Onde colocar e como combinar',
    html: `
<p>Objeto direto: <b>lo, la, los, las</b>. Objeto indireto: <b>le, les</b>.</p>
<ul>
<li>Antes do verbo conjugado: <i><b>Lo</b> compro</i>. Colado no infinitivo, gerúndio e imperativo: <i>comprar<b>lo</b>, comprándo<b>lo</b>, ¡cómpra<b>lo</b>!</i></li>
<li>Com perífrase, duas opções: <i><b>Lo</b> voy a comprar</i> = <i>Voy a comprar<b>lo</b></i>.</li>
<li><b>le/les + lo/la → se lo/se la</b>: <i>Le doy el libro → <b>Se lo</b> doy</i> (nunca "le lo").</li>
<li>Diferente do português formal, é normal <b>começar a frase com o pronome</b>: <i>Me llamo…</i>, <i>Te escribo…</i>.
As regras de próclise/ênclise do português não se aplicam: a posição depende só da forma verbal.</li>
</ul>
<div class="tip">Em Madrid você vai ouvir o <b>leísmo</b>: <i>A Juan <b>le</b> vi ayer</i> (em vez de <i>lo vi</i>) para homens.
É aceito pela RAE para pessoa masculina singular — mas use <i>lo</i> e você nunca erra.</div>`,
    exercises: [
      { q: '¿El informe? Ya ___ he enviado.', options: ['le', 'lo', 'se'], answer: 1, explain: 'Objeto direto masculino (el informe) → lo.' },
      { q: '¿La cuenta? ¿___ pagas tú?', options: ['La', 'Le', 'Lo'], answer: 0, explain: 'La cuenta → la.' },
      { q: 'Doy el libro a Ana → ___ doy.', options: ['Le lo', 'Se lo', 'Lo le'], answer: 1, explain: 'le + lo → se lo.' },
      { q: 'Voy a llamar___ esta tarde. (a ella)', options: ['la', 'le'], answer: 0, explain: 'Llamar é transitivo direto: llamarla.' },
      { q: '¡Envía___ el correo a la profesora! (a ella + el correo)', options: ['selo', 'leselo', 'le lo'], answer: 0, explain: 'Imperativo + se + lo: envíaselo.' },
      { q: 'A mis compañeros ___ escribo todos los días.', options: ['los', 'les'], answer: 1, explain: 'Escribir a alguien → objeto indireto: les.' },
    ],
  },
  {
    id: 'falsos-amigos',
    level: 'A2',
    emoji: '⚠️',
    title: 'Falsos amigos',
    summary: 'exquisito, embarazada, oficina, polvo, borrar, rato…',
    html: `
<table>
<tr><th>Espanhol</th><th>Significa</th><th>"Parece" mas não é</th></tr>
<tr><td>exquisito</td><td>delicioso</td><td>esquisito → <i>raro</i></td></tr>
<tr><td>embarazada</td><td>grávida</td><td>embaraçada → <i>avergonzada</i></td></tr>
<tr><td>oficina</td><td>escritório</td><td>oficina mecânica → <i>taller</i></td></tr>
<tr><td>polvo</td><td>pó</td><td>polvo (animal) → <i>pulpo</i></td></tr>
<tr><td>borrar</td><td>apagar</td><td>borrar → <i>manchar</i></td></tr>
<tr><td>rato</td><td>um tempinho</td><td>rato (animal) → <i>ratón</i></td></tr>
<tr><td>pronto</td><td>cedo; logo</td><td>pronto → <i>listo</i></td></tr>
<tr><td>apellido</td><td>sobrenome</td><td>apelido → <i>apodo, mote</i></td></tr>
<tr><td>largo</td><td>comprido</td><td>largo → <i>ancho</i></td></tr>
<tr><td>propina</td><td>gorjeta</td><td>propina → <i>soborno</i></td></tr>
<tr><td>cena</td><td>jantar</td><td>cena → <i>escena</i></td></tr>
<tr><td>cola</td><td>fila</td><td>cola (de colar) → <i>pegamento</i></td></tr>
<tr><td>constipado</td><td>resfriado</td><td>constipado → <i>estreñido</i></td></tr>
<tr><td>éxito</td><td>sucesso</td><td>saída → <i>salida</i></td></tr>
<tr><td>sitio</td><td>lugar</td><td>sítio (fazenda) → <i>finca</i></td></tr>
<tr><td>presunto</td><td>suposto</td><td>presunto → <i>jamón</i></td></tr>
<tr><td>actual</td><td>atual (não "real")</td><td>—</td></tr>
<tr><td>prácticas</td><td>estágio</td><td>—</td></tr>
<tr><td>tirar</td><td>jogar fora; puxar</td><td>tirar (foto) → <i>hacer una foto</i></td></tr>
<tr><td>cachorro</td><td>filhote</td><td>cachorro → <i>perro</i></td></tr>
</table>`,
    exercises: [
      { q: 'La comida de este restaurante es exquisita. Significa que…', options: ['é estranha', 'é deliciosa'], answer: 1, explain: 'Exquisito = delicioso.' },
      { q: 'Como se diz "estou envergonhado"?', options: ['Estoy embarazado', 'Estoy avergonzado'], answer: 1, explain: 'Embarazada = grávida!' },
      { q: '"Espera un rato" significa…', options: ['espera um tempinho', 'espera o rato'], answer: 0, explain: 'Rato = momento, tempinho.' },
      { q: '"Borra la pizarra" significa…', options: ['suja a lousa', 'apaga a lousa'], answer: 1, explain: 'Borrar = apagar.' },
      { q: 'Como se diz "meu apelido é Lu"?', options: ['Mi apellido es Lu', 'Mi apodo es Lu'], answer: 1, explain: 'Apellido = sobrenome; apelido = apodo/mote.' },
      { q: '"Me voy pronto" significa…', options: ['vou embora cedo', 'estou pronto para ir'], answer: 0, explain: 'Pronto = cedo/logo.' },
      { q: 'Como se diz "fazer sucesso"?', options: ['tener éxito', 'tener suceso'], answer: 0, explain: 'Éxito = sucesso; suceso = acontecimento.' },
      { q: '"El presunto culpable"…', options: ['o culpado do presunto', 'o suposto culpado'], answer: 1, explain: 'Presunto = suposto; presunto (comida) = jamón.' },
    ],
  },
  {
    id: 'subjuntivo',
    level: 'B1',
    emoji: '🌫️',
    title: 'Subjuntivo: primeiros usos',
    summary: 'quiero que, es importante que, cuando + futuro',
    html: `
<p>Boa notícia: o subjuntivo espanhol é muito parecido com o português. Formação do presente: troque a vogal
(<b>-ar → -e</b>, <b>-er/-ir → -a</b>) a partir da 1ª pessoa: <i>hablo → hable</i>, <i>tengo → tenga</i>, <i>hago → haga</i>.</p>
<ul>
<li>Desejo/pedido com sujeitos diferentes: <i>Quiero que <b>vengas</b></i>.</li>
<li>Avaliação: <i>Es importante que el equipo <b>comparta</b> la visión</i>.</li>
<li>Futuro com <b>cuando</b>: <i>Cuando <b>termine</b> el máster…</i> (o português usa o futuro do subjuntivo "quando eu terminar" — o espanhol usa o <b>presente</b> do subjuntivo!).</li>
<li>Negação de opinião: <i>No creo que <b>sea</b> buena idea</i> (mas: <i>Creo que <b>es</b> buena idea</i>).</li>
<li>Pedidos educados: <i>Perdona que te <b>interrumpa</b></i>.</li>
</ul>
<div class="tip">🇧🇷 Armadilha: "se eu tiver tempo" = <b>si tengo tiempo</b> (indicativo!). Depois de <b>si</b> nunca vai presente do subjuntivo.</div>`,
    exercises: [
      { q: 'Quiero que tú ___ a la reunión. (venir)', options: ['vienes', 'vengas', 'vendrás'], answer: 1, explain: 'Querer que + sujeito diferente → subjuntivo.' },
      { q: 'Cuando ___ el máster, buscaré trabajo. (terminar)', options: ['terminaré', 'termine', 'terminar'], answer: 1, explain: 'Cuando + futuro → presente do subjuntivo.' },
      { q: 'Si ___ tiempo, te llamo. (tener)', options: ['tengo', 'tenga', 'tuviere'], answer: 0, explain: 'Si + presente do indicativo.' },
      { q: 'No creo que ___ una buena idea. (ser)', options: ['es', 'sea'], answer: 1, explain: 'No creo que → subjuntivo.' },
      { q: 'Creo que ___ una buena idea. (ser)', options: ['es', 'sea'], answer: 0, explain: 'Creo que (afirmativo) → indicativo.' },
      { q: 'Es fundamental que todos ___ el caso. (leer)', options: ['leen', 'lean'], answer: 1, explain: 'Avaliação → subjuntivo.' },
    ],
  },
];

export const getPill = (id) => GRAMMAR.find((g) => g.id === id);
