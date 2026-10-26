// Lista de lições por trilha e nível.

import { h, topbar, levelPill, progressBar } from '../dom.js';
import * as store from '../../core/store.js';
import { State } from '../../core/fsrs.js';
import { TRACKS, LEVELS } from '../../content/index.js';

const LEVEL_KEY = 'lessons.level';

export async function render() {
  const [cards, progress] = await Promise.all([store.getAllCards(), store.getLessonProgress()]);
  const learned = {};
  for (const c of cards) if (c.lessonId && c.state === State.Review) learned[c.lessonId] = (learned[c.lessonId] || 0) + 1;

  let level = '';
  try {
    level = localStorage.getItem(LEVEL_KEY) || '';
  } catch {}
  const list = h('div');
  const chips = h('div.btn-row', { style: { marginBottom: '8px' } });

  function draw() {
    chips.replaceChildren(
      ...['', ...LEVELS].map((l) =>
        h(`button.btn.small${l === level ? '.primary' : ''}`, { type: 'button', onclick: () => select(l) }, l || 'Todos'),
      ),
    );
    list.replaceChildren(
      ...TRACKS.map((track) => {
        const lessons = track.lessons.filter((l) => !level || l.level === level);
        if (!lessons.length) return h('span');
        return h(
          'section',
          h('div.section-title', `${track.emoji} ${track.title}`),
          lessons.map((l) => {
            const done = learned[l.id] || 0;
            const total = l.phrases.length;
            const status = done >= total ? '✅ Concluída' : progress[l.id] ? `${done}/${total} aprendidas` : `${total} frases`;
            return h(
              'a.card.link',
              { href: `#/lesson/${l.id}` },
              h('div.row', h('span.emoji', l.emoji), h('div.grow', h('b', l.title), h('div.small.muted', status)), levelPill(l.level)),
              progress[l.id] ? h('div', { style: { marginTop: '10px' } }, progressBar(done / total)) : null,
            );
          }),
        );
      }),
    );
  }
  function select(l) {
    level = l;
    try {
      localStorage.setItem(LEVEL_KEY, l);
    } catch {}
    draw();
  }
  draw();
  return h('div', topbar('Lições'), chips, list);
}
