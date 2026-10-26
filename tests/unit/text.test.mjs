import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, checkAnswer, suggestRating, findCloze, tokenize, compareWords, hashId, sentenceAt, stripAccents } from '../../js/core/text.js';

test('normalize remove pontuação espanhola e mantém acentos', () => {
  assert.equal(normalize('¿Dónde está   el METRO?'), 'dónde está el metro');
  assert.equal(stripAccents('mañana, cómo, pingüino'), 'manana, como, pinguino');
});

test('checkAnswer tolera acentos e um erro de digitação', () => {
  assert.equal(checkAnswer('está', 'está'), 'exact');
  assert.equal(checkAnswer(' Está ', 'está'), 'exact');
  assert.equal(checkAnswer('esta', 'está'), 'accent');
  assert.equal(checkAnswer('manana', 'mañana'), 'accent');
  assert.equal(checkAnswer('parda', 'parada'), 'typo');
  assert.equal(checkAnswer('es', 'está'), 'wrong');
  assert.equal(checkAnswer('', 'está'), 'empty');
  assert.equal(suggestRating('exact'), 3);
  assert.equal(suggestRating('accent'), 2);
  assert.equal(suggestRating('wrong'), 1);
});

test('findCloze encontra palavra inteira, sem confundir com pedaços', () => {
  const r = findCloze('Vamos a la estación de Sol.', 'estación');
  assert.deepEqual(r, { before: 'Vamos a la ', word: 'estación', after: ' de Sol.' });
  assert.equal(findCloze('Esta es mi casa', 'es').before, 'Esta ');
  assert.equal(findCloze('Hola', 'adiós'), null);
  assert.equal(findCloze('Me gusta mucho.', 'me gusta').word, 'Me gusta');
});

test('tokenize separa palavras e pontuação', () => {
  const t = tokenize('¡Hola, Madrid!');
  assert.deepEqual(t.map((x) => x.text), ['¡', 'Hola', ', ', 'Madrid', '!']);
  assert.deepEqual(t.filter((x) => x.word).map((x) => x.text), ['Hola', 'Madrid']);
});

test('compareWords marca palavras acertadas', () => {
  const r = compareWords('donde esta la parada', '¿Dónde está la parada de metro?');
  assert.deepEqual(r.tokens.map((t) => t.ok), [true, true, true, true, false, false]);
  assert.ok(Math.abs(r.score - 4 / 6) < 1e-9);
});

test('hashId é estável e ignora pontuação/maiúsculas', () => {
  assert.equal(hashId('Hola, ¿qué tal?'), hashId('hola qué tal'));
  assert.notEqual(hashId('Hola'), hashId('Adiós'));
});

test('sentenceAt devolve a frase em volta da posição', () => {
  const txt = 'Primera frase. La empresa creció mucho. Fin.';
  assert.equal(sentenceAt(txt, txt.indexOf('empresa')), 'La empresa creció mucho.');
});

test('clipAround encurta frases longas mantendo a palavra', async () => {
  const { clipAround } = await import('../../js/core/text.js');
  const long = Array.from({ length: 60 }, (_, i) => `p${i}`).join(' ');
  const c = clipAround(long, 'p40', 10);
  assert.ok(c.includes('p40') && c.startsWith('…') && c.endsWith('…'));
  assert.equal(clipAround('frase curta', 'curta'), 'frase curta');
});
