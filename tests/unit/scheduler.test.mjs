import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSession, pickNext, afterAnswer, interleave, countDue } from '../../js/core/scheduler.js';
import { schedule, newCardState, Rating, State } from '../../js/core/fsrs.js';

const NOW = new Date(2026, 9, 26, 10, 0).getTime();
const mk = (id, extra = {}) => ({ id, ...newCardState(), ...extra });

test('interleave espalha os novos entre as revisões', () => {
  assert.deepEqual(interleave([1, 2, 3, 4], ['a', 'b']), [1, 'a', 2, 3, 'b', 4]);
  assert.deepEqual(interleave([], ['a']), ['a']);
  assert.deepEqual(interleave([1], []), [1]);
  assert.equal(interleave([1, 2, 3], ['a', 'b', 'c', 'd', 'e']).length, 8);
});

test('buildSession respeita o limite diário de novos e a ordem', () => {
  const cards = [mk('n3', { order: 3 }), mk('n1', { order: 1 }), mk('n2', { order: 2 }),
    mk('r1', { state: State.Review, due: NOW - 1000 }), mk('r2', { state: State.Review, due: NOW + 86400000 })];
  const s = buildSession(cards, NOW, { newPerDay: 3, newDoneToday: 1 });
  assert.equal(s.newCount, 2);
  assert.equal(s.reviewCount, 1);
  assert.ok(s.queue.includes('n1') && s.queue.includes('n2') && !s.queue.includes('n3'));
  assert.ok(!s.queue.includes('r2'));
  assert.equal(countDue(cards, NOW, { newPerDay: 3, newDoneToday: 1 }), 3);
});

test('fluxo de sessão: cartão em aprendizagem volta e a sessão termina', () => {
  const cards = { a: mk('a', { order: 1 }) };
  let session = buildSession(Object.values(cards), NOW, { newPerDay: 10 });
  let t = NOW;
  let shown = 0;
  for (let guard = 0; guard < 10; guard++) {
    const next = pickNext(session, t);
    if (!next.id) break;
    shown++;
    session = next.session;
    cards[next.id] = schedule(cards[next.id], Rating.Good, t);
    session = afterAnswer(session, cards[next.id]);
    t += 60000;
  }
  assert.equal(shown, 2); // novo → 10 min (dentro da antecipação de 20 min) → graduado
  assert.equal(cards.a.state, State.Review);
});

test('pickNext espera se o cartão em aprendizagem vence depois de 20 min', () => {
  const session = { queue: [], learning: [{ id: 'x', due: NOW + 30 * 60000 }] };
  const r = pickNext(session, NOW);
  assert.equal(r.id, null);
  assert.equal(r.waitMs, 30 * 60000);
});

test('aprendizagem vencida tem prioridade sobre a fila', () => {
  const session = { queue: ['q'], learning: [{ id: 'l', due: NOW - 1 }] };
  assert.equal(pickNext(session, NOW).id, 'l');
});
