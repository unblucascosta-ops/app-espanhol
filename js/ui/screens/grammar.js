// Gramática em pílulas: lista, explicação e exercícios.

import { h, fill, topbar, levelPill, toast } from '../dom.js';
import * as store from '../../core/store.js';
import { speak, listen, hasSTT } from '../../core/speech.js';
import { normalize, stripAccents } from '../../core/text.js';
import { GRAMMAR, getPill } from '../../content/grammar/index.js';

export async function render({ params }) {
  const progress = await store.getGrammarProgress();
  return params.id ? renderPill(params.id, progress) : renderList(progress);
}

function renderList(progress) {
  return h(
    'div',
    topbar('Gramática'),
    h('p.small.muted', { style: { margin: '0 4px 12px' } }, 'Explicações curtas comparando com o português, seguidas de exercícios.'),
    GRAMMAR.map((g) => {
      const best = progress[g.id]?.best;
      return h(
        'a.card.link.row',
        { href: `#/grammar/${g.id}` },
        h('span.emoji', g.emoji),
        h('div.grow', h('b', g.title), h('div.small.muted', best != null ? `${g.summary} · melhor: ${Math.round(best * 100)}%` : g.summary)),
        levelPill(g.level),
      );
    }),
  );
}

function renderPill(id, progress) {
  const pill = getPill(id);
  if (!pill) return h('div', topbar('Pílula não encontrada', { back: '#/grammar' }));
  const quiz = h('div');
  const pairs = pill.pairs
    ? h('div.card', pill.pairs.map(([a, b, note]) => h('div.pair', pairButton(a), pairButton(b), h('span.small.muted.grow', note))))
    : null;

  const root = h(
    'div',
    topbar(`${pill.emoji} ${pill.title}`, { back: '#/grammar' }),
    h('div.row', { style: { marginBottom: '8px' } }, levelPill(pill.level), progress[id] ? h('span.small.muted', `Melhor resultado: ${Math.round(progress[id].best * 100)}%`) : null),
    h('div.card.explain', { html: pill.html }),
    pairs,
    quiz,
  );
  fill(quiz, h('button.btn.primary.big', { type: 'button', id: 'start-quiz', onclick: () => runQuiz(pill, quiz) }, `Praticar · ${pill.exercises.length} exercícios`));
  return root;
}

function pairButton(word) {
  const btn = h('button.btn.small', { type: 'button' }, `🔊 ${word}`);
  btn.addEventListener('click', () => speak(word, { rate: 0.8 }));
  if (!hasSTT()) return btn;
  const mic = h('button.btn.small.ghost', { type: 'button', 'aria-label': `Repetir ${word}` }, '🎤');
  mic.addEventListener('click', async () => {
    mic.textContent = '👂';
    try {
      const { text, alternatives } = await listen().result;
      const ok = [text, ...alternatives].some((t) => stripAccents(normalize(t)).split(' ').includes(stripAccents(normalize(word))));
      toast(ok ? `✅ Entendi "${word}"!` : `Ouvi "${text || '…'}". Tente de novo.`);
    } catch (err) {
      toast(err.message);
    } finally {
      mic.textContent = '🎤';
    }
  });
  return h('span', btn, mic);
}

function shuffle(a) {
  return a.map((x) => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
}

function runQuiz(pill, container) {
  const items = shuffle(pill.exercises);
  let i = 0;
  let right = 0;

  function show() {
    const ex = items[i];
    let answered = false;
    const feedback = h('div');
    const next = h('button.btn.primary.big.hidden', { type: 'button', onclick: advance }, i + 1 < items.length ? 'Próximo ›' : 'Ver resultado');
    const options = ex.options.map((opt, k) =>
      h('button.option', { type: 'button', onclick: () => choose(k) }, opt),
    );
    async function choose(k) {
      if (answered) return;
      answered = true;
      const ok = k === ex.answer;
      if (ok) right++;
      options[ex.answer].classList.add('right');
      if (!ok) options[k].classList.add('wrong');
      fill(feedback, h(`p.feedback.${ok ? 'ok' : 'bad'}`, ok ? '¡Correcto! ' : 'Ops… '), h('p.small', ex.explain));
      next.classList.remove('hidden');
      await store.addExercise();
      // Lê a frase completa quando a resposta é um preenchimento de lacuna.
      if (ex.q.includes('___')) speak(ex.q.replace('___', ex.options[ex.answer]).replace(/\(.*?\)/g, ''));
    }
    fill(
      container,
      h('div.section-title', `Exercício ${i + 1} de ${items.length}`),
      h('div.card', h('p', { style: { fontSize: '1.2rem', fontWeight: 600 } }, ex.q), options, feedback),
      next,
    );
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function advance() {
    i++;
    if (i < items.length) return show();
    const score = right / items.length;
    await store.saveGrammarScore(pill.id, score);
    fill(
      container,
      h(
        'div.card.done',
        h('div.big-emoji', score >= 0.8 ? '🏆' : score >= 0.5 ? '💪' : '📚'),
        h('h2', `${right}/${items.length} corretas`),
        h('p.muted', score >= 0.8 ? '¡Estupendo! Esta pílula está dominada.' : 'Releia a explicação e tente de novo amanhã.'),
        h('button.btn.block', { type: 'button', onclick: () => runQuiz(pill, container) }, 'Refazer'),
      ),
    );
  }
  show();
}
