// Painel de progresso: vocabulário, nível estimado, tempo, acertos e histórico.

import { h, topbar, progressBar } from '../dom.js';
import * as store from '../../core/store.js';
import { State } from '../../core/fsrs.js';
import { computeStreak, bestStreak, matureCount, accuracy } from '../../core/stats.js';
import { dayKey, DAY_MS } from '../../core/time.js';
import { LESSONS } from '../../content/index.js';
import { GRAMMAR } from '../../content/grammar/index.js';

const fmtMinutes = (ms) => {
  const min = Math.round(ms / 60000);
  return min < 60 ? `${min} min` : `${Math.floor(min / 60)} h ${min % 60} min`;
};

function stat(value, label) {
  return h('div.card', h('div.stat-num', value), h('div.stat-label', label));
}

export async function render() {
  const [cards, days, reviews, journal, grammar, vocab] = await Promise.all([
    store.getAllCards(),
    store.getDays(),
    store.getReviews(),
    store.getJournal(),
    store.getGrammarProgress(),
    store.vocabulary(),
  ]);
  const today = dayKey();
  const streak = computeStreak(days, today);
  const best = bestStreak(days);
  const totalMs = Object.values(days).reduce((s, d) => s + (d.studyMs || 0), 0);
  const recent = reviews.filter((r) => r.ts > Date.now() - 30 * DAY_MS);
  const acc = accuracy(recent);
  const byState = { new: 0, learning: 0, review: 0 };
  for (const c of cards) {
    if (c.state === State.New) byState.new++;
    else if (c.state === State.Review) byState.review++;
    else byState.learning++;
  }
  const learnedByLesson = {};
  for (const c of cards) if (c.lessonId && c.state === State.Review) learnedByLesson[c.lessonId] = (learnedByLesson[c.lessonId] || 0) + 1;
  const lessonsDone = LESSONS.filter((l) => (learnedByLesson[l.id] || 0) >= l.phrases.length).length;
  const pillsDone = GRAMMAR.filter((g) => (grammar[g.id]?.best ?? 0) >= 0.8).length;

  // Últimos 14 dias de revisões.
  const keys = [];
  for (let i = 13; i >= 0; i--) keys.push(dayKey(Date.now() - i * DAY_MS));
  const max = Math.max(1, ...keys.map((k) => days[k]?.reviews || 0));
  const bars = h(
    'div.bars',
    keys.map((k) => {
      const n = days[k]?.reviews || 0;
      return h(
        `div.bar${k === today ? '.today' : ''}`,
        { title: `${k}: ${n} revisões` },
        h('i', { style: { height: `${(n / max) * 100}%` } }),
        h('small', String(Number(k.slice(8)))),
      );
    }),
  );

  // Mapa de calor: últimas 8 semanas (cada quadrado = um dia).
  const heatKeys = [];
  for (let i = 55; i >= 0; i--) heatKeys.push(dayKey(Date.now() - i * DAY_MS));
  const heat = h(
    'div.heat',
    heatKeys.map((k) => {
      const d = days[k];
      const lvl = !d || !d.reviews ? '' : d.goalMet ? '.l3' : d.reviews >= 5 ? '.l2' : '.l1';
      return h(`i${lvl}`, { title: k });
    }),
  );

  return h(
    'div',
    topbar('Progresso', { actions: [h('a.icon-btn', { href: '#/settings', 'aria-label': 'Ajustes' }, '⚙️')] }),
    h(
      'div.card',
      h('div.small.muted', 'Nível estimado (pelo vocabulário)'),
      h('div.row', h('div.stat-num.grow', { id: 'level' }, vocab.level), vocab.next ? h('span.small.muted', `próximo: ${vocab.next} (${vocab.nextAt} palavras)`) : null),
      h('div', { style: { margin: '10px 0 6px' } }, progressBar(vocab.progress)),
      h('div.small.muted', `${vocab.total} ${vocab.total === 1 ? 'palavra' : 'palavras'}: ${vocab.srs} aprendidas na revisão + ${vocab.marked} marcadas como conhecidas no leitor.`),
    ),
    h(
      'div.grid2',
      stat(`🔥 ${streak}`, `dias seguidos (recorde: ${best})`),
      stat(fmtMinutes(totalMs), `tempo de estudo (hoje: ${fmtMinutes(days[today]?.studyMs || 0)})`),
      stat(acc == null ? '—' : `${Math.round(acc * 100)}%`, 'acertos (últimos 30 dias)'),
      stat(String(reviews.length), 'revisões no total'),
      stat(String(matureCount(cards)), 'cartões maduros (≥ 21 dias)'),
      stat(`${lessonsDone}/${LESSONS.length}`, 'lições concluídas'),
      stat(`${pillsDone}/${GRAMMAR.length}`, 'pílulas dominadas (≥ 80%)'),
      stat(String(journal.length), 'textos no diário'),
    ),
    h('div.section-title', 'Revisões · últimos 14 dias'),
    h('div.card', bars),
    h('div.section-title', 'Constância · 8 semanas'),
    h('div.card', heat, h('div.small.muted', { style: { marginTop: '8px' } }, 'Verde forte = meta do dia cumprida.')),
    h('div.section-title', 'Seus cartões'),
    h(
      'div.card',
      h('div.row', h('span.grow', '🆕 Novos (ainda não vistos)'), h('b', String(byState.new))),
      h('div.row', h('span.grow', '🌱 Em aprendizagem'), h('b', String(byState.learning))),
      h('div.row', h('span.grow', '🌳 Em revisão'), h('b', String(byState.review))),
    ),
  );
}
