import { test } from 'node:test';
import assert from 'node:assert/strict';
import { schedule, preview, newCardState, retrievability, intervalFor, Rating, State } from '../../js/core/fsrs.js';
import { DAY_MS, startOfDay } from '../../js/core/time.js';

const NOW = new Date(2026, 9, 26, 10, 0).getTime();
const card = () => ({ id: 'x', ...newCardState() });

test('retrievability é 90% quando t = S e intervalo = S para retenção 0,9', () => {
  assert.ok(Math.abs(retrievability(10, 10) - 0.9) < 1e-9);
  assert.equal(intervalFor(10, 0.9), 10);
  assert.ok(intervalFor(10, 0.95) < 10);
});

test('cartão novo: De novo=1min, Difícil≈6min, Bem=10min, Fácil=revisão em dias', () => {
  const p = preview(card(), NOW);
  assert.equal(p[Rating.Again], 60000);
  assert.equal(p[Rating.Hard], 5.5 * 60000);
  assert.equal(p[Rating.Good], 10 * 60000);
  assert.ok(p[Rating.Easy] >= DAY_MS);
  const easy = schedule(card(), Rating.Easy, NOW);
  assert.equal(easy.state, State.Review);
  assert.equal(easy.reps, 1);
});

test('Bem duas vezes gradua o cartão para revisão no dia seguinte ou depois', () => {
  let c = schedule(card(), Rating.Good, NOW);
  assert.equal(c.state, State.Learning);
  assert.equal(c.step, 1);
  c = schedule(c, Rating.Good, NOW + 10 * 60000);
  assert.equal(c.state, State.Review);
  assert.ok(c.interval >= 1);
  assert.equal(c.due % 1, 0);
  // vencimento cai no início de um dia de estudo
  assert.equal(startOfDay(c.due), c.due);
});

test('em revisão: Difícil < Bem < Fácil e intervalos crescem com acertos', () => {
  let c = schedule(schedule(card(), Rating.Good, NOW), Rating.Good, NOW + 600000);
  let t = c.due;
  const intervals = [];
  for (let i = 0; i < 5; i++) {
    const p = preview(c, t);
    assert.ok(p[Rating.Hard] < p[Rating.Good], 'hard < good');
    assert.ok(p[Rating.Good] < p[Rating.Easy], 'good < easy');
    c = schedule(c, Rating.Good, t);
    intervals.push(c.interval);
    t = c.due;
  }
  for (let i = 1; i < intervals.length; i++) assert.ok(intervals[i] > intervals[i - 1], intervals.join(','));
});

test('esquecer (De novo) em revisão: lapso, reaprendizagem e estabilidade menor', () => {
  let c = schedule(schedule(card(), Rating.Good, NOW), Rating.Good, NOW + 600000);
  c = schedule(c, Rating.Good, c.due);
  const before = c.stability;
  const lapsed = schedule(c, Rating.Again, c.due);
  assert.equal(lapsed.state, State.Relearning);
  assert.equal(lapsed.lapses, 1);
  assert.ok(lapsed.stability < before);
  assert.equal(lapsed.due - c.due, 10 * 60000);
  const back = schedule(lapsed, Rating.Good, lapsed.due);
  assert.equal(back.state, State.Review);
});

test('dificuldade fica entre 1 e 10 e sobe com erros', () => {
  let c = schedule(card(), Rating.Good, NOW);
  const d0 = c.difficulty;
  for (let i = 0; i < 20; i++) c = schedule(c, Rating.Again, NOW + i * 60000);
  assert.ok(c.difficulty > d0 && c.difficulty <= 10);
  for (let i = 0; i < 50; i++) c = schedule(c, Rating.Easy, c.due);
  assert.ok(c.difficulty >= 1);
});

test('schedule não altera o cartão original e preserva campos extras', () => {
  const c = { ...card(), es: 'Hola', pt: 'Olá' };
  const copy = JSON.stringify(c);
  const n = schedule(c, Rating.Good, NOW);
  assert.equal(JSON.stringify(c), copy);
  assert.equal(n.es, 'Hola');
});
