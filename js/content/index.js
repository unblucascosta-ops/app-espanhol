// Registro central do conteúdo. Para adicionar uma lição:
//  1. crie/edite um arquivo em js/content/lessons/ (formato: [espanhol, português, palavra-alvo])
//  2. coloque o id da lição em CURRICULUM (ordem em que o app introduz as lições)
//  3. rode `npm test` — o teste de conteúdo avisa se algo estiver errado.

import { hashId } from '../core/text.js';
import madrid from './lessons/madrid.js';
import social from './lessons/social.js';
import universidad from './lessons/universidad.js';
import negocios from './lessons/negocios.js';
import brasileiros from './lessons/brasileiros.js';

export const TRACKS = [
  { id: 'madrid', title: 'Sobrevivência em Madrid', emoji: '🏙️', lessons: madrid },
  { id: 'social', title: 'Vida social', emoji: '🎉', lessons: social },
  { id: 'universidad', title: 'Universidade', emoji: '🎓', lessons: universidad },
  { id: 'negocios', title: 'Negócios e comunicação', emoji: '💼', lessons: negocios },
  { id: 'brasileiros', title: 'Armadilhas para brasileiros', emoji: '🇧🇷', lessons: brasileiros },
];

// Ordem em que as lições entram automaticamente na revisão diária.
export const CURRICULUM = [
  'saludos', 'bar', 'metro', 'numeros', 'gustos', 'familia', 'ciudad', 'mercado', 'clase', 'ropa',
  'quedar', 'pasado', 'piso', 'restaurante', 'falsos', 'grupo', 'trabajo', 'medico', 'banco',
  'tramites', 'profesores', 'reuniones', 'medios',
  'presentaciones', 'casos', 'correos', 'estrategia',
];

export const LEVELS = ['A1', 'A2', 'B1', 'B2'];

function normalizeLesson(raw, track) {
  return {
    ...raw,
    track: track.id,
    phrases: raw.phrases.map(([es, pt, cloze]) => ({ id: hashId(es), es, pt, cloze })),
  };
}

const byId = new Map();
for (const track of TRACKS) {
  track.lessons = track.lessons.map((l) => normalizeLesson(l, track));
  for (const l of track.lessons) byId.set(l.id, l);
}

/** Lições na ordem do currículo (as que não estiverem em CURRICULUM vão para o fim). */
export const LESSONS = [
  ...CURRICULUM.map((id) => byId.get(id)).filter(Boolean),
  ...[...byId.values()].filter((l) => !CURRICULUM.includes(l.id)),
];

export const getLesson = (id) => byId.get(id);

export const ALL_PHRASES = LESSONS.flatMap((l) => l.phrases.map((p) => ({ ...p, lessonId: l.id, level: l.level })));
