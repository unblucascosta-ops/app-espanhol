// Detalhe de uma lição: dica para brasileiros, frases com áudio, modo "ouvir tudo".

import { h, fill, topbar, levelPill, toast } from '../dom.js';
import * as store from '../../core/store.js';
import { State } from '../../core/fsrs.js';
import { findCloze } from '../../core/text.js';
import { speak, stopSpeaking } from '../../core/speech.js';
import { getLesson } from '../../content/index.js';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export async function render({ params }) {
  const lesson = getLesson(params.id);
  if (!lesson) return h('div', topbar('Lição não encontrada', { back: '#/lessons' }));
  const cards = new Map((await store.getAllCards()).filter((c) => c.lessonId === lesson.id).map((c) => [c.id, c]));
  const settings = await store.getSettings();

  const status = h('div');
  function drawStatus() {
    const started = cards.size > 0;
    const learned = [...cards.values()].filter((c) => c.state === State.Review).length;
    fill(
      status,
      started
        ? h('div.card.row', h('span.emoji', '✅'), h('div.grow', h('b', 'Na sua revisão diária'), h('div.small.muted', `${learned}/${lesson.phrases.length} frases já aprendidas`)))
        : h('button.btn.primary.big', { type: 'button', id: 'start-lesson', onclick: start }, '➕ Adicionar à revisão'),
    );
  }
  async function start() {
    const n = await store.startLesson(lesson.id);
    for (const c of await store.getAllCards()) if (c.lessonId === lesson.id) cards.set(c.id, c);
    toast(`${n} frases adicionadas. Elas entram aos poucos (${settings.newPerDay} novas/dia).`);
    drawStatus();
  }
  drawStatus();

  // Modo "ouvir tudo": lê cada frase duas vezes (normal e mais lenta) — bom para o metrô.
  let playing = false;
  const playBtn = h('button.btn.block', { type: 'button' }, '▶ Ouvir tudo');
  playBtn.addEventListener('click', async () => {
    if (playing) {
      playing = false;
      stopSpeaking();
      return;
    }
    playing = true;
    playBtn.textContent = '⏹ Parar';
    for (const [i, p] of lesson.phrases.entries()) {
      if (!playing) break;
      rows[i].scrollIntoView({ block: 'center', behavior: 'smooth' });
      rows[i].style.background = 'var(--surface-2)';
      await speak(p.es);
      if (playing) await wait(1200);
      if (playing) await speak(p.es, { rate: Math.max(0.6, settings.speechRate - 0.25) });
      rows[i].style.background = '';
      if (playing) await wait(1500);
    }
    playing = false;
    playBtn.textContent = '▶ Ouvir tudo';
  });

  const rows = lesson.phrases.map((p) => {
    const parts = findCloze(p.es, p.cloze);
    return h(
      'div.phrase.row',
      { onclick: () => speak(p.es), style: { cursor: 'pointer', borderRadius: '10px' } },
      h('div.grow', h('div.es', parts.before, h('u', parts.word), parts.after), h('div.pt', p.pt)),
      h('span.muted', '🔊'),
    );
  });

  const root = h(
    'div',
    topbar(`${lesson.emoji} ${lesson.title}`, { back: '#/lessons' }),
    h('div.row', { style: { marginBottom: '12px' } }, levelPill(lesson.level), h('span.small.muted', `${lesson.phrases.length} frases`)),
    h('div.card.intro', h('div.small.muted', { style: { marginBottom: '6px' } }, '🇧🇷 Dica para brasileiros'), h('div', { html: lesson.intro })),
    status,
    h('div.btn-row', { style: { margin: '12px 0' } }, h('a.btn', { href: `#/shadow?lesson=${lesson.id}` }, '🗣️ Shadowing'), playBtn),
    h('div.card', rows),
  );
  root._cleanup = () => {
    playing = false;
    stopSpeaking();
  };
  return root;
}
