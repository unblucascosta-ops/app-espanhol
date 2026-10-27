import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeStreak, bestStreak, estimateLevel, accuracy } from '../../js/core/stats.js';
import { dayKey, prevDayKey, startOfDay } from '../../js/core/time.js';

test('dayKey vira às 4h da manhã', () => {
  assert.equal(dayKey(new Date(2026, 9, 26, 3, 59).getTime()), '2026-10-25');
  assert.equal(dayKey(new Date(2026, 9, 26, 4, 0).getTime()), '2026-10-26');
  assert.equal(prevDayKey('2026-03-01'), '2026-02-28');
  assert.equal(prevDayKey('2026-01-01'), '2025-12-31');
  assert.equal(new Date(startOfDay(new Date(2026, 9, 26, 2).getTime())).getDate(), 25);
});

test('streak conta até hoje, ou até ontem se hoje ainda não cumpriu', () => {
  const days = { '2026-10-23': { goalMet: true }, '2026-10-24': { goalMet: true }, '2026-10-25': { goalMet: true } };
  assert.equal(computeStreak(days, '2026-10-26'), 3);
  assert.equal(computeStreak({ ...days, '2026-10-26': { goalMet: true } }, '2026-10-26'), 4);
  assert.equal(computeStreak(days, '2026-10-27'), 0);
  assert.equal(bestStreak({ ...days, '2026-10-01': { goalMet: true } }), 3);
});

test('nível estimado e acertos', () => {
  assert.equal(estimateLevel(0).level, 'Pré-A1');
  assert.equal(estimateLevel(600).level, 'A2');
  assert.equal(estimateLevel(9999).next, null);
  assert.equal(accuracy([{ rating: 1 }, { rating: 3 }]), 0.5);
  assert.equal(accuracy([]), null);
});
