// Tela de revisão diária (SRS): recordação ativa com lacuna, digitação ou fala.

import { h, fill, toast } from '../dom.js';
import { schedule, preview, Rating, State } from '../../core/fsrs.js';
import { buildSession, pickNext, afterAnswer, LEARN_AHEAD_MS } from '../../core/scheduler.js';
import { checkAnswer, suggestRating, findCloze, compareWords } from '../../core/text.js';
import { formatInterval } from '../../core/time.js';
import { speak, stopSpeaking, hasSTT, listen } from '../../core/speech.js';
import * as store from '../../core/store.js';
import { getLesson } from '../../content/index.js';

const GRADES = [
  { r: Rating.Again, label: 'De novo' },
  { r: Rating.Hard, label: 'Difícil' },
  { r: Rating.Good, label: 'Bem' },
  { r: Rating.Easy, label: 'Fácil' },
];

const FEEDBACK = {
  exact: ['ok', '¡Perfecto! ✅'],
  accent: ['close', 'Quase! Atenção aos acentos/ñ.'],
  typo: ['close', 'Quase! Um errinho de digitação.'],
  wrong: ['bad', 'Não foi dessa vez.'],
  empty: ['bad', 'Sem resposta — tudo bem, agora memorize.'],
};

export async function render({ query }) {
  await store.ensureNewCards();
  const settings = await store.getSettings();
  const today = await store.getDay();
  const cards = new Map((await store.getAllCards()).map((c) => [c.id, c]));
  const extra = Number(query.extra || 0);
  let session = buildSession([...cards.values()], Date.now(), {
    newPerDay: settings.newPerDay + extra,
    newDoneToday: today.newCards,
  });
  const initialTotal = session.queue.length + session.learning.filter((l) => l.due <= Date.now() + LEARN_AHEAD_MS).length;
  let done = 0;
  let correct = 0;
  let lastDay = today;

  const root = h('section.review');
  const bar = h('div.progress-bar', h('i', { style: { width: '0%' } }));
  const counter = h('span.small.muted', '');
  const body = h('div.review-body');
  const actions = h('div.review-actions');
  root.append(
    h('div.review-top', h('a.icon-btn', { href: '#/', 'aria-label': 'Fechar' }, '✕'), bar, counter),
    body,
    actions,
  );

  let keyHandler = null;
  const setKeys = (fn) => {
    if (keyHandler) document.removeEventListener('keydown', keyHandler);
    keyHandler = fn;
    if (fn) document.addEventListener('keydown', fn);
  };
  let activeListener = null;
  root._cleanup = () => {
    setKeys(null);
    stopSpeaking();
    activeListener?.stop();
  };

  function updateProgress() {
    const remaining = session.queue.length + session.learning.length;
    const total = Math.max(initialTotal, done + remaining);
    bar.firstChild.style.width = `${total ? (done / total) * 100 : 100}%`;
    counter.textContent = remaining ? `${remaining}` : '';
  }

  function next() {
    const pick = pickNext(session, Date.now());
    if (!pick.id) return finish(pick.waitMs);
    session = pick.session;
    showQuestion(cards.get(pick.id));
  }

  function showQuestion(card) {
    updateProgress();
    const shownAt = Date.now();
    const lesson = card.lessonId ? getLesson(card.lessonId) : null;
    const full = settings.frontMode === 'full' && card.pt;
    const parts = findCloze(card.es, card.cloze) || { before: card.es, word: card.cloze, after: '' };
    const blank = h('span.blank', ' ? ');

    const meta = h(
      'div.row.small.muted',
      { style: { marginBottom: '16px' } },
      h('span', lesson ? `${lesson.emoji} ${lesson.title}` : card.source === 'reader' ? '📖 Do leitor' : '✍️ Seu cartão'),
      card.state === State.New ? h('span.pill', { style: { color: 'var(--primary)' } }, 'NOVO') : null,
    );
    const esLine = full
      ? h('div.prompt-es', { style: { color: 'var(--muted)', fontWeight: 500, fontSize: '1.1rem' } }, 'Diga ou escreva em espanhol:')
      : h('div.prompt-es', parts.before, blank, parts.after);
    const ptLine = card.pt ? h('div.prompt-pt', full ? h('b', { style: { color: 'var(--text)', fontSize: '1.3rem' } }, card.pt) : card.pt) : null;
    const hintLine = card.hint ? h('div.hint', `💡 ${card.cloze.length > 1 ? card.cloze[0] + '… = ' : ''}${card.hint}`) : null;
    fill(body, meta, esLine, ptLine, hintLine);

    const input = h('input.answer-input', {
      type: 'text',
      placeholder: full ? 'Escreva a frase…' : 'Palavra que falta…',
      autocapitalize: 'off',
      autocomplete: 'off',
      autocorrect: 'off',
      spellcheck: false,
      lang: 'es',
      enterkeyhint: 'done',
    });
    const reveal = h('button.btn.primary.big', { type: 'button' }, 'Ver resposta');
    const mic = hasSTT() ? h('button.btn.big', { type: 'button', style: { flex: '0 0 30%' }, 'aria-label': 'Responder falando' }, '🎤') : null;
    input.addEventListener('input', () => (reveal.textContent = input.value.trim() ? 'Verificar' : 'Ver resposta'));
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      // Impede que o mesmo Enter chegue ao atalho de avaliação da próxima etapa.
      e.preventDefault();
      e.stopPropagation();
      submitTyped();
    });
    reveal.addEventListener('click', submitTyped);
    mic?.addEventListener('click', submitSpoken);
    fill(actions, input, h('div.btn-row', mic, reveal));
    setKeys((e) => {
      if (e.target === input) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        submitTyped();
      }
    });

    function submitTyped() {
      const given = input.value;
      if (full) {
        const cmp = compareWords(given, card.es);
        const result = !given.trim() ? 'empty' : cmp.score >= 0.95 ? 'exact' : cmp.score >= 0.7 ? 'typo' : 'wrong';
        return showAnswer(card, { result, given, cmp, shownAt });
      }
      showAnswer(card, { result: checkAnswer(given, card.cloze), given, shownAt });
    }

    async function submitSpoken() {
      mic.textContent = '👂';
      mic.classList.add('listening');
      try {
        activeListener = listen({ onInterim: (t) => (input.value = t) });
        const { text, alternatives } = await activeListener.result;
        // Usa a alternativa que mais se parece com a frase esperada.
        const best = [text, ...alternatives].filter(Boolean).map((t) => ({ t, cmp: compareWords(t, card.es) }))
          .sort((a, b) => b.cmp.score - a.cmp.score)[0];
        if (!best) throw new Error('Não ouvi nada. Tente de novo.');
        const result = best.cmp.score >= 0.9 ? 'exact' : best.cmp.score >= 0.6 ? 'typo' : 'wrong';
        showAnswer(card, { result, given: best.t, cmp: best.cmp, shownAt, spoken: true });
      } catch (err) {
        toast(err.message);
        mic.textContent = '🎤';
        mic.classList.remove('listening');
      } finally {
        activeListener = null;
      }
    }
  }

  function showAnswer(card, { result, given, cmp, shownAt, spoken }) {
    const [cls, msg] = FEEDBACK[result];
    const suggested = suggestRating(result);
    const parts = findCloze(card.es, card.cloze) || { before: card.es, word: card.cloze, after: '' };
    const answerBlank = h(`span.blank.${cls}`, parts.word);
    const listenBtn = h('button.icon-btn.listen-btn', { type: 'button', 'aria-label': 'Ouvir', onclick: () => speak(card.es) }, '🔊');

    const children = [
      h('div.row', { style: { alignItems: 'flex-start' } }, h('div.prompt-es.grow', parts.before, answerBlank, parts.after), listenBtn),
      card.pt ? h('div.prompt-pt', card.pt) : null,
      card.hint ? h('div.hint', `💡 ${card.cloze} = ${card.hint}`) : null,
      h(`div.feedback.${cls}`, msg),
    ];
    if (given && result !== 'exact' && !cmp) children.push(h('div.small.muted', `Você escreveu: “${given}”`));
    if (cmp) {
      children.push(
        h('div.small.muted', { style: { marginTop: '8px' } }, spoken ? `Ouvi: “${given}”` : 'Comparação palavra por palavra:'),
        h('div.word-diff', cmp.tokens.map((t) => h(`span.${t.ok ? 'ok' : 'miss'}`, t.word))),
      );
    }
    fill(body, children);
    if (settings.autoplay) speak(card.es);

    const now = Date.now();
    const params = { requestRetention: settings.requestRetention };
    const intervals = preview(card, now, params);
    const buttons = GRADES.map(({ r, label }) =>
      h(
        `button.grade.g${r}${r === suggested ? '.suggested' : ''}`,
        { type: 'button', onclick: () => answer(card, r, shownAt) },
        label,
        h('small', formatInterval(intervals[r])),
      ),
    );
    fill(actions, 
      h('div.small.muted.center', 'Como foi? (a sugestão está destacada)'),
      h('div.grades', buttons),
    );
    setKeys((e) => {
      if (['1', '2', '3', '4'].includes(e.key)) answer(card, Number(e.key), shownAt);
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        answer(card, suggested, shownAt);
      }
    });
  }

  let busy = false;
  async function answer(card, rating, shownAt) {
    if (busy) return;
    busy = true;
    setKeys(null);
    try {
      const now = Date.now();
      const updated = schedule(card, rating, now, { requestRetention: settings.requestRetention });
      lastDay = await store.recordReview(card, updated, rating, now - shownAt);
      cards.set(updated.id, updated);
      session = afterAnswer(session, updated);
      done++;
      if (rating > 1) correct++;
      if (lastDay.goalMet && lastDay.reviews === settings.dailyGoal) toast('🎯 Meta do dia cumprida! ¡Olé!');
      next();
    } finally {
      busy = false;
    }
  }

  function finish(waitMs) {
    setKeys(null);
    bar.firstChild.style.width = '100%';
    counter.textContent = '';
    const acc = done ? Math.round((correct / done) * 100) : null;
    fill(body,
      h(
        'div.done',
        h('div.big-emoji', done ? '🎉' : '☀️'),
        h('h1', done ? '¡Muy bien!' : 'Nada para revisar agora'),
        done ? h('p', `${done} cartões revisados${acc != null ? ` · ${acc}% de acertos` : ''}.`) : h('p.muted', 'Você está em dia com as revisões.'),
        h('p.muted', `Hoje: ${lastDay.reviews}/${settings.dailyGoal} da meta${lastDay.goalMet ? ' ✅' : ''}`),
        waitMs ? h('p.small.muted', `Há cartões em aprendizagem que voltam em ${formatInterval(waitMs)}.`) : null,
      ),
    );
    fill(actions, 
      h('a.btn.primary.big', { href: '#/' }, 'Voltar ao início'),
      h('div.btn-row', h('a.btn', { href: '#/shadow' }, '🗣️ Shadowing'), h('a.btn', { href: `#/review?extra=${extra + 5}` }, '+5 novos')),
    );
  }

  next();
  return root;
}
