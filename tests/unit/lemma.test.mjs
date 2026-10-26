import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lookup, lemmaOf } from '../../js/core/lemma.js';
import { ALL_PHRASES } from '../../js/content/index.js';

const cases = {
  cojo: 'coger', empecé: 'empezar', llegué: 'llegar', tuve: 'tener', habéis: 'haber', fui: 'ser',
  gustan: 'gustar', duele: 'doler', recomiendas: 'recomendar', aprietan: 'apretar', compartid: 'compartir',
  bloquearla: 'bloquear', empadronarme: 'empadronarse', tómese: 'tomar', póngame: 'poner',
  majos: 'majo', exquisitas: 'exquisito', patatas: 'patata', autobuses: 'autobús', exámenes: 'examen',
  jóvenes: 'joven', española: 'español', claramente: 'claro', haríais: 'hacer', juego: 'jugar',
};

test('lematiza formas conjugadas e flexionadas', () => {
  for (const [form, lemma] of Object.entries(cases)) assert.equal(lookup(form).lemma, lemma, form);
});

test('devolve tradução e ranking de frequência', () => {
  const r = lookup('Casa');
  assert.equal(r.lemma, 'casa');
  assert.ok(r.gloss.includes('casa'));
  assert.ok(r.rank > 0 && r.rank < 300);
  assert.equal(lookup('xyzzy').lemma, null);
  assert.equal(lemmaOf('xyzzy'), 'xyzzy');
});

test('toda palavra-alvo das lições tem tradução no dicionário', () => {
  const missing = ALL_PHRASES.filter((p) => !lookup(p.cloze).lemma).map((p) => p.cloze);
  assert.deepEqual(missing, []);
});
