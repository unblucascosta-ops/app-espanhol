// Lematizador simples: leva formas conjugadas/flexionadas à forma do dicionário.
// Estratégia: gera candidatos (irregulares, plural, feminino, terminações verbais,
// pronomes enclíticos) e devolve o primeiro que existe no dicionário.

import { DICT, RANK } from '../content/dictionary.js';
import { stripAccents } from './text.js';

// Formas irregulares frequentes → infinitivo.
const IRREGULAR = {
  ser: 'soy eres es somos sois son fui fuiste fue fuimos fuisteis fueron era eras éramos erais eran sea seas seamos seáis sean sido siendo sería serían será serán',
  estar: 'estoy estás está estamos estáis están estuve estuviste estuvo estuvimos estuvieron esté estés estén estaba estaban estado estuviera estuvieran estuviéramos',
  ir: 'voy vas va vamos vais van iba ibas íbamos ibais iban vaya vayas vayamos vayan ido yendo id',
  haber: 'he has ha hemos habéis han había habías habíamos habían hubo haya hayas hayamos hayan habría habrían hubiera hubiéramos hubieran habrá hubiese',
  tener: 'tengo tienes tiene tenemos tenéis tienen tuve tuviste tuvo tuvimos tuvieron tenga tengas tengamos tengan tendré tendrá tendría ten tengáis tendríamos',
  hacer: 'hago haces hace hacemos hacéis hacen hice hiciste hizo hicimos hicieron haga hagas hagamos hagan haré hará haría haríamos haríais harían hecho haz',
  poder: 'puedo puedes puede podemos podéis pueden pude pudiste pudo pudimos pudieron pueda puedas puedan podré podrá podría podríamos podrían pudiendo',
  querer: 'quiero quieres quiere queremos queréis quieren quise quiso quisieron quiera quieras querré querría',
  decir: 'digo dices dice decimos decís dicen dije dijiste dijo dijimos dijeron diga digas digan diré dirá diría dicho diciendo di',
  venir: 'vengo vienes viene venimos venís vienen vine viniste vino vinimos vinieron venga vengas vengan vendré vendrá vendría viniendo ven',
  ver: 'veo ves ve vemos veis ven vi viste vio vimos visteis vieron vea veas vean visto veía veían',
  dar: 'doy das da damos dais dan di diste dio dimos dieron dé des den dado',
  saber: 'sé sabes sabe sabemos sabéis saben supe supiste supo supimos supieron sepa sepas sepan sabré sabría',
  poner: 'pongo pones pone ponemos ponéis ponen puse pusiste puso pusimos pusieron ponga pongas pongan pondré pondría puesto pon',
  salir: 'salgo sales sale salimos salís salen salga salgas salgan saldré saldría sal',
  traer: 'traigo traes trae traemos traen traje trajiste trajo trajeron traiga traído trayendo',
  oír: 'oigo oyes oye oímos oís oyen oí oyó oyeron oiga oído oyendo',
  caer: 'caigo cae caen cayó cayeron caiga caído cayendo',
  conocer: 'conozco conozca conozcas conozcan',
  conducir: 'conduzco conduje condujo',
  producir: 'produzco produje produjo produjeron',
  leer: 'leyó leyeron leyendo leído',
  dormir: 'duermo duermes duerme duermen durmió durmieron durmiendo duerma',
  morir: 'muero muere mueren murió murieron muerto',
  pedir: 'pido pides pide piden pidió pidieron pida pidiendo',
  seguir: 'sigo sigues sigue siguen siguió siguieron siga siguiendo',
  sentir: 'siento sientes siente sienten sintió sintieron sienta sintiendo',
  preferir: 'prefiero prefieres prefiere prefieren prefirió',
  elegir: 'elijo elige eligen eligió elija',
  coger: 'cojo coja cojas cojan',
  proponer: 'propongo propones propone proponemos proponen propuse propuso propuesto proponga',
  mantener: 'mantengo mantiene mantienen mantuvo mantén mantenga',
  resolver: 'resuelto resuelvo resuelve resuelven',
  jugar: 'juego juegas juega jugamos jugáis juegan jugué juegue',
  escribir: 'escrito',
  abrir: 'abierto',
  volver: 'vuelto vuelvo vuelves vuelve vuelven vuelva',
  romper: 'roto',
};

const IRREGULAR_MAP = new Map();
for (const [inf, forms] of Object.entries(IRREGULAR)) {
  for (const f of forms.split(' ')) if (!IRREGULAR_MAP.has(f)) IRREGULAR_MAP.set(f, inf);
}

// Terminações verbais regulares (das mais longas para as mais curtas).
const AR = ['ábamos', 'aríamos', 'áramos', 'ásemos', 'asteis', 'aremos', 'aríais', 'arían', 'arías', 'abais', 'arais', 'aseis', 'aron', 'aban', 'abas', 'aría', 'arás', 'arán', 'aréis', 'aste', 'amos', 'ando', 'aras', 'aran', 'ase', 'aba', 'ado', 'ada', 'ados', 'adas', 'ará', 'aré', 'ara', 'áis', 'éis', 'emos', 'en', 'es', 'as', 'an', 'ad', 'ó', 'é', 'o', 'a', 'e'];
const ER_IR = ['iéramos', 'eríamos', 'iríamos', 'isteis', 'ieron', 'ierais', 'iendo', 'eremos', 'iremos', 'erían', 'irían', 'erías', 'irías', 'íamos', 'ieras', 'ieran', 'iera', 'iese', 'ería', 'iría', 'erás', 'irás', 'erán', 'irán', 'éis', 'íais', 'emos', 'imos', 'iste', 'ían', 'ías', 'ido', 'ida', 'idos', 'idas', 'ía', 'ió', 'ís', 'erá', 'irá', 'eré', 'iré', 'amos', 'áis', 'en', 'es', 'an', 'as', 'ed', 'id', 'í', 'o', 'e', 'a'];

const CLITICS = /^(?:me|te|se|lo|la|le|nos|os|los|las|les)+$/;

function stemVariants(stem) {
  const out = new Set([stem]);
  const add = (s) => out.add(s);
  // mudanças de radical: ie→e, ue→o, i→e (pedir/pido), u→o
  if (stem.includes('ie')) add(stem.replace(/ie(?=[^ie]*$)/, 'e'));
  if (stem.includes('ue')) add(stem.replace(/ue(?=[^ue]*$)/, 'o'));
  const lastI = stem.lastIndexOf('i');
  if (lastI >= 0) add(stem.slice(0, lastI) + 'e' + stem.slice(lastI + 1));
  // ortografia: busqué→busc, llegué→lleg, empecé→empez, cojo→cog, conozco→conoc
  if (stem.endsWith('qu')) add(stem.slice(0, -2) + 'c');
  if (stem.endsWith('gu')) add(stem.slice(0, -1));
  if (stem.endsWith('c')) add(stem.slice(0, -1) + 'z');
  if (stem.endsWith('j')) add(stem.slice(0, -1) + 'g');
  if (stem.endsWith('zc')) add(stem.slice(0, -2) + 'c');
  return [...out];
}

function verbCandidates(w) {
  const out = [];
  for (const [endings, infs] of [[AR, ['ar']], [ER_IR, ['er', 'ir']]]) {
    for (const end of endings) {
      if (!w.endsWith(end) || w.length - end.length < 2) continue;
      const stem = w.slice(0, -end.length);
      for (const s of stemVariants(stem)) for (const inf of infs) out.push(s + inf);
    }
  }
  return out;
}

function nominalCandidates(w) {
  const out = [];
  if (w.endsWith('ísimo') || w.endsWith('ísima') || w.endsWith('ísimos') || w.endsWith('ísimas')) {
    const base = w.replace(/ísim[oa]s?$/, '');
    out.push(base + 'o', base + 'e', base.replace(/qu$/, 'c') + 'o', base.replace(/gu$/, 'g') + 'o');
  }
  if (w.endsWith('mente')) {
    const adj = w.slice(0, -5);
    out.push(adj, adj.replace(/a$/, 'o'));
  }
  if (w.endsWith('ces')) out.push(w.slice(0, -3) + 'z');
  if (w.endsWith('es')) out.push(w.slice(0, -2), accentLast(w.slice(0, -2)));
  if (w.endsWith('s')) out.push(w.slice(0, -1));
  if (w.endsWith('as')) out.push(w.slice(0, -2) + 'o', w.slice(0, -2) + 'os', w.slice(0, -2));
  if (w.endsWith('a')) out.push(w.slice(0, -1) + 'o', w.slice(0, -1));
  // plural que perde/ganha acento: canciones→canción, exámenes→examen
  if (w.endsWith('ones')) out.push(w.slice(0, -4) + 'ón');
  if (w.endsWith('enes')) out.push(stripAccents(w.slice(0, -4)) + 'en');
  return out;
}

// autobus → autobús (plural sem acento → singular com acento na última vogal)
function accentLast(s) {
  const i = Math.max(...['a', 'e', 'i', 'o', 'u'].map((v) => s.lastIndexOf(v)));
  return i < 0 ? s : s.slice(0, i) + { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' }[s[i]] + s.slice(i + 1);
}

/** Todas as formas candidatas (em ordem de preferência). */
export function candidates(word) {
  const w = word.toLowerCase();
  const out = [w];
  if (IRREGULAR_MAP.has(w)) out.push(IRREGULAR_MAP.get(w));
  out.push(...nominalCandidates(w));
  // pronomes enclíticos: dímelo, bloquearla, empadronarme, levantarse
  for (let i = 2; i < w.length - 1; i++) {
    if (!CLITICS.test(w.slice(i))) continue;
    const base = stripAccents(w.slice(0, i));
    if (IRREGULAR_MAP.has(base)) out.push(IRREGULAR_MAP.get(base));
    if (base.length > 2) out.push(base, base + 'se', ...verbCandidates(base));
  }
  out.push(...verbCandidates(w));
  // verbos pronominais no dicionário (encargarse, equivocarse...)
  for (const c of [...out]) if (/(ar|er|ir)$/.test(c)) out.push(c + 'se');
  // sem acento (usuário pode ter colado texto sem acentos)
  out.push(stripAccents(w));
  return [...new Set(out)];
}

/**
 * Procura uma palavra no dicionário.
 * Devolve { word, lemma, gloss, rank } ou { word, lemma: null } se não encontrar.
 */
export function lookup(word) {
  const w = word.toLowerCase();
  for (const c of candidates(w)) {
    if (DICT.has(c)) return { word: w, lemma: c, gloss: DICT.get(c), rank: RANK.get(c) ?? null };
  }
  return { word: w, lemma: null, gloss: null, rank: null };
}

/** Forma canônica para contar "palavras aprendidas" (lema se conhecido). */
export function lemmaOf(word) {
  return lookup(word).lemma || word.toLowerCase();
}
