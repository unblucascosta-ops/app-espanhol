// Desafios diários de produção (escrever ou falar) sobre a sua vida real.
// Para adicionar: inclua um objeto { id, level, title, prompt, useful: [...] }.

import { DAY_MS } from '../core/time.js';

export const CHALLENGES = [
  { id: 'c01', level: 'A1', title: 'Preséntate', prompt: 'Preséntate como si fuera el primer día del máster: nombre, de dónde eres, qué estudias y qué te gusta.', useful: ['Me llamo…', 'Soy de…', 'Estudio un máster en…', 'Me gusta…'] },
  { id: 'c02', level: 'A1', title: 'Tu trayecto en metro', prompt: 'Describe tu trayecto en metro: qué línea coges, dónde haces transbordo y cuánto tardas.', useful: ['Cojo la línea…', 'Hago transbordo en…', 'Tardo una hora', 'Me bajo en…'] },
  { id: 'c03', level: 'A1', title: 'Tu barrio', prompt: '¿Cómo es tu barrio en Madrid? ¿Qué hay cerca de tu casa?', useful: ['Mi barrio es…', 'Hay un/una…', 'Está cerca de…', 'Lo que más me gusta es…'] },
  { id: 'c04', level: 'A1', title: 'Un día normal', prompt: 'Cuenta un día normal entre semana: a qué hora te levantas, qué haces por la mañana y por la tarde.', useful: ['Me levanto a las…', 'Por la mañana…', 'Por la tarde voy a clase', 'Ceno a las…'] },
  { id: 'c05', level: 'A1', title: 'Tu comida favorita', prompt: '¿Qué comida española te gusta más? ¿Y cuál echas de menos de Brasil?', useful: ['Me encanta…', 'No me gusta nada…', 'Echo de menos…', 'Está riquísimo'] },
  { id: 'c06', level: 'A1', title: 'Tu familia', prompt: 'Describe a una persona de tu familia: cómo es (ser) y cómo está ahora (estar).', useful: ['Mi madre es…', 'Ahora está…', 'Vive en…', 'Trabaja de…'] },
  { id: 'c07', level: 'A1', title: 'En el bar', prompt: 'Escribe un diálogo corto pidiendo el desayuno en un bar de Madrid.', useful: ['¿Me pones…?', 'Para mí…', '¿Me cobras?', 'Un café con leche'] },
  { id: 'c08', level: 'A1', title: 'Tus gustos', prompt: 'Habla de tres cosas que te gustan y dos que no te gustan nada (¡cuidado con gusta/gustan!).', useful: ['Me gusta…', 'Me gustan…', 'No me gusta nada…', 'Me encanta…'] },
  { id: 'c09', level: 'A1', title: 'Tu piso', prompt: 'Describe tu piso o tu habitación: cuántas habitaciones tiene, con quién vives y cómo es.', useful: ['Vivo con…', 'Mi habitación es…', 'Tiene…', 'Está en la cuarta planta'] },
  { id: 'c10', level: 'A1', title: 'El fin de semana', prompt: '¿Qué vas a hacer este fin de semana? Usa «voy a + infinitivo».', useful: ['Voy a…', 'El sábado…', 'El domingo…', 'He quedado con…'] },
  { id: 'c11', level: 'A2', title: 'Hoy', prompt: 'Cuenta qué has hecho hoy (pretérito perfecto: he ido, he comido, he estudiado…).', useful: ['Hoy he…', 'Esta mañana he…', 'Todavía no he…', 'Ya he…'] },
  { id: 'c12', level: 'A2', title: 'Ayer', prompt: 'Cuenta qué hiciste ayer (indefinido: fui, comí, estudié…). Compara con lo que has hecho hoy.', useful: ['Ayer fui…', 'Por la noche…', 'Después…', 'Al final…'] },
  { id: 'c13', level: 'A2', title: 'Tu llegada a Madrid', prompt: '¿Cuándo llegaste a España y cómo fueron tus primeros días?', useful: ['Llegué en…', 'Al principio…', 'Lo más difícil fue…', 'Me sorprendió…'] },
  { id: 'c14', level: 'A2', title: 'Tu experiencia en audiovisual', prompt: 'Describe un proyecto audiovisual en el que trabajaste: qué era, cuál era tu papel y qué aprendiste.', useful: ['Trabajé como…', 'Me encargaba de…', 'Fue un proyecto de…', 'Aprendí a…'] },
  { id: 'c15', level: 'A2', title: 'Correo a un profesor', prompt: 'Escribe un correo breve a un profesor pidiendo una tutoría para hablar del trabajo final.', useful: ['Estimado/a profesor/a:', 'Le escribo para…', '¿Sería posible…?', 'Un saludo cordial'] },
  { id: 'c16', level: 'A2', title: 'Quedar con compañeros', prompt: 'Escribe un mensaje al grupo de WhatsApp de clase para quedar y preparar una presentación.', useful: ['¿Quedamos…?', '¿Qué os parece…?', 'Podemos…', '¿Os viene bien…?'] },
  { id: 'c17', level: 'A2', title: 'Ser o estar', prompt: 'Describe Madrid usando 4 frases con «ser» y 4 con «estar».', useful: ['Madrid es…', 'Madrid está…', 'Las calles están…', 'La gente es…'] },
  { id: 'c18', level: 'A2', title: 'Un problema en casa', prompt: 'Escribe un mensaje a tu casero explicando que algo se ha roto en el piso.', useful: ['Le escribo porque…', 'Se ha roto…', '¿Podría…?', 'Gracias de antemano'] },
  { id: 'c19', level: 'A2', title: 'En el médico', prompt: 'Explica a un médico qué te pasa: qué te duele, desde cuándo y qué has tomado.', useful: ['Me duele…', 'Desde hace…', 'He tomado…', 'Me encuentro…'] },
  { id: 'c20', level: 'A2', title: 'Tu serie favorita', prompt: 'Recomienda una serie o película a un compañero: de qué trata y por qué te gusta.', useful: ['Trata de…', 'El guion es…', 'Te la recomiendo porque…', 'Lo mejor es…'] },
  { id: 'c21', level: 'A2', title: 'Brasil y España', prompt: 'Compara la vida en Brasil y en España: horarios, comida, transporte.', useful: ['En Brasil… mientras que en España…', 'Más… que…', 'Menos… que…', 'Tan… como…'] },
  { id: 'c22', level: 'A2', title: 'Tu clase favorita', prompt: '¿Qué asignatura del máster te gusta más y por qué?', useful: ['La asignatura que más me gusta es…', 'El profesor…', 'Aprendemos…', 'Me parece…'] },
  { id: 'c23', level: 'A2', title: 'Planes de futuro', prompt: '¿Dónde te gustaría trabajar cuando termines el máster?', useful: ['Me gustaría…', 'Quiero…', 'Cuando termine…', 'Mi objetivo es…'] },
  { id: 'c24', level: 'A2', title: 'Falsos amigos', prompt: 'Escribe 5 frases usando bien: exquisito, embarazada, oficina, rato y pronto.', useful: ['Las croquetas están exquisitas', 'Tengo un rato…', 'Me voy pronto…'] },
  { id: 'c25', level: 'B1', title: 'Resumen de un caso', prompt: 'Resume en 5–6 frases el último estudio de caso de clase: empresa, problema y decisión.', useful: ['El caso trata de…', 'La empresa se enfrenta a…', 'El principal problema es…', 'Se plantea…'] },
  { id: 'c26', level: 'B1', title: 'Tu opinión sobre el caso', prompt: '¿Qué harías tú en el lugar del director del caso? Justifica tu decisión.', useful: ['En mi opinión…', 'Yo propondría…', 'A corto plazo…', 'Por un lado… por otro…'] },
  { id: 'c27', level: 'B1', title: 'Presentarte en una entrevista', prompt: 'Responde a «Háblame de ti» en una entrevista para una productora o agencia.', useful: ['Tengo experiencia en…', 'Mi punto fuerte es…', 'Me interesa este puesto porque…', 'Actualmente estudio…'] },
  { id: 'c28', level: 'B1', title: 'Streaming vs. televisión', prompt: '¿Las plataformas de streaming van a acabar con la televisión tradicional? Da tu opinión con argumentos.', useful: ['Creo que…', 'No creo que + subjuntivo', 'Sin embargo…', 'Además…'] },
  { id: 'c29', level: 'B1', title: 'Inicio de una presentación', prompt: 'Escribe (o di en voz alta) el primer minuto de una presentación para tu clase.', useful: ['Buenos días a todos…', 'Hoy os voy a presentar…', 'En primer lugar…', 'A continuación…'] },
  { id: 'c30', level: 'B1', title: 'Un consejo', prompt: 'Un amigo brasileño viene a estudiar a Madrid. Dale consejos (imperativo y «te recomiendo que + subjuntivo»).', useful: ['Te recomiendo que…', 'No olvides…', 'Es mejor que…', 'Busca…'] },
  { id: 'c31', level: 'B1', title: 'Una marca que admiras', prompt: 'Analiza la estrategia de comunicación de una marca que admiras.', useful: ['Su público objetivo es…', 'Comunica…', 'Lo que la diferencia es…', 'Cabe destacar…'] },
  { id: 'c32', level: 'B2', title: 'Correo formal', prompt: 'Escribe un correo formal a una empresa solicitando unas prácticas en su departamento de contenidos.', useful: ['Me pongo en contacto con ustedes…', 'Me gustaría…', 'Quedo a su disposición…', 'Sin otro particular…'] },
  { id: 'c33', level: 'B2', title: 'Hipótesis', prompt: '¿Qué habría pasado si no hubieras venido a Madrid? (si + pluscuamperfecto de subjuntivo).', useful: ['Si no hubiera venido…', 'habría…', 'Probablemente…', 'Seguramente…'] },
  { id: 'c34', level: 'B2', title: 'Negociación', prompt: 'Simula una negociación: quieres vender los derechos de un documental a una cadena española.', useful: ['Estamos dispuestos a…', 'Si ustedes…, nosotros…', 'Esa cifra…', 'Podríamos llegar a un acuerdo si…'] },
  { id: 'c35', level: 'B2', title: 'El futuro de los medios', prompt: '¿Cómo serán los medios de comunicación dentro de diez años? Argumenta.', useful: ['Es probable que…', 'Todo indica que…', 'A no ser que…', 'En definitiva…'] },
];

/** Desafio do dia: muda a cada dia, sempre o mesmo para a mesma data. */
export function challengeOfDay(dayKeyStr) {
  const [y, m, d] = dayKeyStr.split('-').map(Number);
  const n = Math.floor(Date.UTC(y, m - 1, d) / DAY_MS);
  return CHALLENGES[n % CHALLENGES.length];
}

export const CHECKLIST = [
  'Usei pelo menos um verbo no passado',
  'Usei «vosotros» ou um pronome (le, lo, la, os)',
  'Usei ser e estar corretamente',
  'Usei palavras novas desta semana',
  'Li em voz alta o que escrevi',
];
