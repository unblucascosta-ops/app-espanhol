import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LESSONS, TRACKS, CURRICULUM, ALL_PHRASES, getLesson } from '../../js/content/index.js';
import { findCloze } from '../../js/core/text.js';

test('todas as lições do currículo existem e todas as lições estão no currículo', () => {
  for (const id of CURRICULUM) assert.ok(getLesson(id), `lição ausente: ${id}`);
  for (const t of TRACKS) for (const l of t.lessons) assert.ok(CURRICULUM.includes(l.id), `fora do currículo: ${l.id}`);
});

test('pelo menos 300 frases A1–A2', () => {
  const n = ALL_PHRASES.filter((p) => p.level === 'A1' || p.level === 'A2').length;
  assert.ok(n >= 300, `só ${n} frases A1–A2`);
});

test('cada frase tem tradução e a palavra-alvo aparece na frase', () => {
  for (const p of ALL_PHRASES) {
    assert.ok(p.es && p.pt && p.cloze, `frase incompleta em ${p.lessonId}: ${p.es}`);
    assert.ok(findCloze(p.es, p.cloze), `palavra-alvo "${p.cloze}" não está em "${p.es}" (${p.lessonId})`);
  }
});

test('ids de frases e de lições são únicos', () => {
  const ids = new Set();
  for (const p of ALL_PHRASES) {
    assert.ok(!ids.has(p.id), `frase duplicada: ${p.es}`);
    ids.add(p.id);
  }
  const lessonIds = LESSONS.map((l) => l.id);
  assert.equal(new Set(lessonIds).size, lessonIds.length);
});

test('lições têm nível, título e introdução', () => {
  for (const l of LESSONS) {
    assert.ok(['A1', 'A2', 'B1', 'B2', 'C1'].includes(l.level), l.id);
    assert.ok(l.title && l.intro && l.emoji, l.id);
  }
});

test('pílulas de gramática: respostas válidas e ids únicos', async () => {
  const { GRAMMAR } = await import('../../js/content/grammar/index.js');
  assert.equal(new Set(GRAMMAR.map((g) => g.id)).size, GRAMMAR.length);
  for (const g of GRAMMAR) {
    assert.ok(g.html && g.exercises.length >= 5, g.id);
    for (const ex of g.exercises) {
      assert.ok(ex.answer >= 0 && ex.answer < ex.options.length, `${g.id}: ${ex.q}`);
      assert.ok(ex.explain, `${g.id}: ${ex.q} sem explicação`);
    }
  }
});

test('desafios e textos graduados bem formados', async () => {
  const { CHALLENGES, challengeOfDay } = await import('../../js/content/challenges.js');
  const { READINGS } = await import('../../js/content/readings.js');
  assert.equal(new Set(CHALLENGES.map((c) => c.id)).size, CHALLENGES.length);
  assert.ok(challengeOfDay('2026-10-26') !== challengeOfDay('2026-10-27'));
  for (const r of READINGS) {
    assert.ok(r.es && r.pt && r.title && r.level, r.id);
    assert.equal(r.es.split('\n\n').length, r.pt.split('\n\n').length, `parágrafos da tradução: ${r.id}`);
  }
});
