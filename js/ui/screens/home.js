// Tela inicial: sequência, meta do dia e atalhos.

import { h } from '../dom.js';
import * as store from '../../core/store.js';
import { countDue } from '../../core/scheduler.js';
import { computeStreak } from '../../core/stats.js';
import { dayKey } from '../../core/time.js';
import { State } from '../../core/fsrs.js';
import { LESSONS } from '../../content/index.js';
import { challengeOfDay } from '../../content/challenges.js';

function ring(value, goal) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const frac = Math.min(1, goal ? value / goal : 0);
  const svg = `<svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
    <circle cx="48" cy="48" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="9"/>
    <circle cx="48" cy="48" r="${r}" fill="none" stroke="${frac >= 1 ? 'var(--good)' : 'var(--primary)'}" stroke-width="9"
      stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - frac)}"/></svg>`;
  return h('div.ring', { html: svg }, h('div.ring-label', h('div', `${value}/${goal}`, h('small', 'meta'))));
}

function greeting() {
  const hr = new Date().getHours();
  return hr < 6 ? '¡Buenas noches!' : hr < 14 ? '¡Buenos días!' : hr < 21 ? '¡Buenas tardes!' : '¡Buenas noches!';
}

export async function render() {
  await store.ensureNewCards();
  const [settings, today, days, cards, progress] = await Promise.all([
    store.getSettings(),
    store.getDay(),
    store.getDays(),
    store.getAllCards(),
    store.getLessonProgress(),
  ]);
  const due = countDue(cards, Date.now(), { newPerDay: settings.newPerDay, newDoneToday: today.newCards });
  const streak = computeStreak(days, dayKey());

  // Lição atual: a primeira iniciada com cartões novos; senão, a próxima não iniciada.
  const newByLesson = {};
  for (const c of cards) if (c.state === State.New && c.lessonId) newByLesson[c.lessonId] = (newByLesson[c.lessonId] || 0) + 1;
  const current = LESSONS.find((l) => progress[l.id] && newByLesson[l.id]) || LESSONS.find((l) => !progress[l.id]);
  const challenge = challengeOfDay(dayKey());

  return h(
    'div',
    h('header.topbar', h('h1', greeting()), h('a.icon-btn', { href: '#/settings', 'aria-label': 'Ajustes' }, '⚙️')),
    h(
      'div.card.hero',
      ring(today.reviews, settings.dailyGoal),
      h(
        'div.grow',
        h('div.streak', `🔥 ${streak}`),
        h('div.muted', streak === 1 ? 'dia seguido' : 'dias seguidos'),
        h('div.small.muted', today.goalMet ? 'Meta de hoje cumprida ✅' : `Faltam ${Math.max(0, settings.dailyGoal - today.reviews)} cartões para a meta`),
      ),
    ),
    due
      ? h('a.btn.primary.big', { href: '#/review', id: 'start-review' }, `Revisar · ${due} ${due === 1 ? 'cartão' : 'cartões'}`)
      : h('a.btn.big', { href: '#/review?extra=5', id: 'start-review' }, 'Em dia! ✨ Estudar +5 novos'),
    h('div.section-title', 'Hoje também'),
    h(
      'a.card.link.row',
      { href: '#/challenge' },
      h('span.emoji', '✍️'),
      h('div.grow', h('div', h('b', 'Desafio do dia')), h('div.small.muted', challenge.title)),
      h('span.chev', '›'),
    ),
    h(
      'a.card.link.row',
      { href: '#/shadow' },
      h('span.emoji', '🗣️'),
      h('div.grow', h('div', h('b', 'Shadowing rápido')), h('div.small.muted', 'Ouça, repita em voz alta e compare')),
      h('span.chev', '›'),
    ),
    current
      ? h(
          'a.card.link.row',
          { href: `#/lesson/${current.id}` },
          h('span.emoji', current.emoji),
          h('div.grow', h('div', h('b', progress[current.id] ? 'Continuar lição' : 'Próxima lição')), h('div.small.muted', `${current.level} · ${current.title}`)),
          h('span.chev', '›'),
        )
      : null,
    h(
      'a.card.link.row',
      { href: '#/reader' },
      h('span.emoji', '📖'),
      h('div.grow', h('div', h('b', 'Leitura')), h('div.small.muted', 'Textos curtos ou cole um estudo de caso')),
      h('span.chev', '›'),
    ),
  );
}
