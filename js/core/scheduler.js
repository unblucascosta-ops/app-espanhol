// Monta a sessão de revisão do dia e decide qual cartão mostrar a seguir.
// Lógica pura (sem IndexedDB), para poder ser testada no Node.

import { State } from './fsrs.js';

export const LEARN_AHEAD_MS = 20 * 60 * 1000;

const isLearning = (c) => c.state === State.Learning || c.state === State.Relearning;

/** Espalha `b` de forma uniforme dentro de `a` (novos no meio das revisões). */
export function interleave(a, b) {
  if (!a.length) return [...b];
  if (!b.length) return [...a];
  const out = [];
  const gap = (a.length + 1) / (b.length + 1);
  let bi = 0;
  for (let i = 0; i < a.length; i++) {
    out.push(a[i]);
    while (bi < b.length && Math.floor((bi + 1) * gap) <= i + 1) out.push(b[bi++]);
  }
  while (bi < b.length) out.push(b[bi++]);
  return out;
}

/**
 * Cria a sessão: cartões em aprendizagem, revisões vencidas e novos
 * (respeitando o limite diário de novos).
 */
export function buildSession(cards, now, { newPerDay = 10, newDoneToday = 0, reviewLimit = 300 } = {}) {
  const learning = cards.filter(isLearning).map((c) => ({ id: c.id, due: c.due }));
  const reviews = cards
    .filter((c) => c.state === State.Review && c.due <= now)
    .sort((x, y) => x.due - y.due)
    .slice(0, reviewLimit)
    .map((c) => c.id);
  const newIds = cards
    .filter((c) => c.state === State.New)
    .sort((x, y) => (x.order ?? 0) - (y.order ?? 0))
    .slice(0, Math.max(0, newPerDay - newDoneToday))
    .map((c) => c.id);
  return { queue: interleave(reviews, newIds), learning, newCount: newIds.length, reviewCount: reviews.length };
}

/** Quantos cartões estão disponíveis hoje (para o botão "Revisar (N)"). */
export function countDue(cards, now, opts) {
  const s = buildSession(cards, now, opts);
  return s.queue.length + s.learning.filter((l) => l.due <= now + LEARN_AHEAD_MS).length;
}

/**
 * Próximo cartão da sessão. Ordem: aprendizagem já vencida → fila principal →
 * aprendizagem que vence nos próximos 20 min (para terminar no metrô sem esperar).
 * Devolve { id, session } ou { id: null, waitMs } quando acabou.
 */
export function pickNext(session, now) {
  const learning = [...session.learning].sort((a, b) => a.due - b.due);
  const take = (id) => ({
    id,
    session: { ...session, queue: session.queue.filter((q) => q !== id), learning: learning.filter((l) => l.id !== id) },
  });
  if (learning.length && learning[0].due <= now) return take(learning[0].id);
  if (session.queue.length) return take(session.queue[0]);
  if (learning.length && learning[0].due <= now + LEARN_AHEAD_MS) return take(learning[0].id);
  return { id: null, session, waitMs: learning.length ? learning[0].due - now : 0 };
}

/** Depois de responder: se o cartão continua em aprendizagem, volta para a sessão. */
export function afterAnswer(session, card) {
  const learning = session.learning.filter((l) => l.id !== card.id);
  if (isLearning(card)) learning.push({ id: card.id, due: card.due });
  return { ...session, learning };
}
