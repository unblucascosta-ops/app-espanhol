// Estatísticas puras: sequência de dias, nível estimado, resumo de acertos.

import { prevDayKey } from './time.js';
import { State } from './fsrs.js';

/**
 * Sequência (streak): dias seguidos com a meta cumprida, terminando hoje
 * (ou ontem, se hoje ainda não cumpriu — a sequência continua viva).
 * `days` é um objeto { 'AAAA-MM-DD': { goalMet } }.
 */
export function computeStreak(days, todayKey) {
  let key = days[todayKey]?.goalMet ? todayKey : prevDayKey(todayKey);
  let streak = 0;
  while (days[key]?.goalMet) {
    streak++;
    key = prevDayKey(key);
  }
  return streak;
}

export function bestStreak(days) {
  const keys = Object.keys(days).filter((k) => days[k].goalMet).sort();
  let best = 0;
  let cur = 0;
  let prev = null;
  for (const k of keys) {
    cur = prev && prevDayKey(k) === prev ? cur + 1 : 1;
    best = Math.max(best, cur);
    prev = k;
  }
  return best;
}

/** Palavras "aprendidas": palavras-alvo de cartões que já saíram da fase inicial. */
export function learnedWords(cards, lemmaFn = (w) => w.toLowerCase()) {
  const set = new Set();
  for (const c of cards) {
    if (c.state === State.Review && c.cloze) set.add(lemmaFn(c.cloze));
  }
  return set;
}

export function matureCount(cards) {
  return cards.filter((c) => c.state === State.Review && c.stability >= 21).length;
}

export const LEVELS = [
  { code: 'Pré-A1', min: 0 },
  { code: 'A1', min: 150 },
  { code: 'A2', min: 500 },
  { code: 'B1', min: 1200 },
  { code: 'B2', min: 2500 },
  { code: 'C1', min: 4000 },
];

/**
 * Nível estimado pelo vocabulário ativo (aproximação: as faixas seguem
 * estimativas comuns de vocabulário por nível do QECR).
 */
export function estimateLevel(wordCount) {
  let current = LEVELS[0];
  for (const l of LEVELS) if (wordCount >= l.min) current = l;
  const idx = LEVELS.indexOf(current);
  const next = LEVELS[idx + 1];
  const progress = next ? (wordCount - current.min) / (next.min - current.min) : 1;
  return { level: current.code, next: next?.code ?? null, nextAt: next?.min ?? null, progress: Math.min(1, progress) };
}

/** Taxa de acerto (nota ≥ 2) em um conjunto de registros de revisão. */
export function accuracy(reviews) {
  if (!reviews.length) return null;
  return reviews.filter((r) => r.rating > 1).length / reviews.length;
}
