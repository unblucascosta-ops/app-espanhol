// Shadowing: ouvir uma frase, repetir em voz alta e comparar.

import { h, fill, toast, progressBar } from '../dom.js';
import * as store from '../../core/store.js';
import { compareWords } from '../../core/text.js';
import { speak, stopSpeaking, listen, record, hasSTT, hasRecorder } from '../../core/speech.js';
import { getLesson, LESSONS } from '../../content/index.js';
import { State } from '../../core/fsrs.js';

const ROUND = 10;

function shuffle(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function pickPhrases(lessonId) {
  if (lessonId && getLesson(lessonId)) return getLesson(lessonId).phrases;
  // Sem lição: frases que você já viu (priorizando as em aprendizagem).
  const cards = (await store.getAllCards()).filter((c) => c.state !== State.New);
  if (cards.length >= 3) {
    const sorted = cards.sort((a, b) => (a.stability || 0) - (b.stability || 0)).slice(0, 40);
    return shuffle(sorted).slice(0, ROUND).map((c) => ({ es: c.es, pt: c.pt }));
  }
  return LESSONS[0].phrases.slice(0, ROUND);
}

export async function render({ query, navigate }) {
  const settings = await store.getSettings();
  const phrases = await pickPhrases(query.lesson);
  const lesson = query.lesson ? getLesson(query.lesson) : null;
  let i = 0;
  let hideText = false;
  let recording = null;
  let myAudio = null;
  let listener = null;

  const root = h('section.review');
  const bar = h('div', { style: { flex: 1 } });
  const counter = h('span.small.muted');
  const body = h('div.review-body');
  const actions = h('div.review-actions');
  root.append(
    h('div.review-top', h('a.icon-btn', { href: lesson ? `#/lesson/${lesson.id}` : '#/', 'aria-label': 'Fechar' }, '✕'), bar, counter),
    body,
    actions,
  );
  root._cleanup = () => {
    stopSpeaking();
    listener?.stop();
  };

  function draw(result) {
    const p = phrases[i];
    fill(bar, progressBar(i / phrases.length));
    counter.textContent = `${i + 1}/${phrases.length}`;
    const text = hideText && !result
      ? h('div.shadow-phrase.muted', '🎧 Só ouvindo… (toque em "Mostrar texto")')
      : h('div.shadow-phrase', p.es);
    fill(
      body,
      h('div.small.muted.center', lesson ? `${lesson.emoji} ${lesson.title}` : '🗣️ Shadowing'),
      text,
      !hideText || result ? h('div.prompt-pt.center', p.pt) : null,
      h(
        'div.btn-row',
        { style: { margin: '20px 0' } },
        h('button.btn', { type: 'button', onclick: () => speak(p.es) }, '🔊 Ouvir'),
        h('button.btn', { type: 'button', onclick: () => speak(p.es, { rate: 0.6 }) }, '🐢 Lento'),
        h('button.btn', { type: 'button', onclick: () => ((hideText = !hideText), draw(result)) }, hideText ? '👁 Mostrar texto' : '🙈 Só ouvir'),
      ),
      result
        ? h(
            'div.card',
            h('div.score', `${Math.round(result.score * 100)}%`),
            h('div.small.muted.center', `Ouvi: “${result.text || '…'}”`),
            h('div.word-diff.center', { style: { marginTop: '8px' } }, result.tokens.map((t) => h(`span.${t.ok ? 'ok' : 'miss'}`, t.word))),
            h('p.small.muted.center', { style: { marginTop: '8px' } }, result.score >= 0.9 ? '¡Genial! Agora tente no mesmo ritmo do áudio.' : 'Ouça de novo e preste atenção às palavras em vermelho.'),
          )
        : null,
      myAudio ? h('audio', { src: myAudio, controls: true, style: { width: '100%', marginTop: '8px' } }) : null,
    );

    const mic = h('button.mic-btn', { type: 'button', 'aria-label': 'Falar' }, '🎤');
    mic.addEventListener('click', async () => {
      if (!hasSTT()) return toast('Reconhecimento de voz indisponível. Use "Gravar" para se ouvir.');
      mic.classList.add('listening');
      mic.textContent = '👂';
      try {
        listener = listen();
        const { text, alternatives } = await listener.result;
        const best = [text, ...alternatives].filter(Boolean).map((t) => ({ text: t, ...compareWords(t, p.es) }))
          .sort((a, b) => b.score - a.score)[0] || { text: '', ...compareWords('', p.es) };
        await store.addShadow();
        draw(best);
      } catch (err) {
        toast(err.message);
        draw(result);
      } finally {
        listener = null;
      }
    });
    const recBtn = hasRecorder()
      ? h('button.btn', { type: 'button' }, recording ? '⏹ Parar' : '⏺ Gravar')
      : null;
    recBtn?.addEventListener('click', async () => {
      try {
        if (recording) {
          myAudio = await recording.stop();
          recording = null;
          draw(result);
          // Toca o original e depois a sua gravação, para comparar.
          await speak(p.es);
          root.querySelector('audio')?.play();
        } else {
          recording = await record();
          recBtn.textContent = '⏹ Parar';
        }
      } catch {
        toast('Não consegui acessar o microfone.');
        recording = null;
      }
    });
    fill(
      actions,
      h('div.center.small.muted', hasSTT() ? 'Toque no microfone e repita a frase' : 'Seu navegador não reconhece voz — grave e compare'),
      hasSTT() ? mic : null,
      h('div.btn-row', recBtn, h('button.btn.primary', { type: 'button', onclick: nextPhrase }, i + 1 < phrases.length ? 'Próxima ›' : 'Concluir')),
    );
    if (!result && settings.autoplay) speak(p.es);
  }

  function nextPhrase() {
    stopSpeaking();
    myAudio = null;
    if (i + 1 >= phrases.length) {
      fill(bar, progressBar(1));
      counter.textContent = '';
      fill(body, h('div.done', h('div.big-emoji', '👏'), h('h1', '¡Muy bien!'), h('p.muted', `${phrases.length} frases praticadas em voz alta.`)));
      fill(actions, h('a.btn.primary.big', { href: '#/' }, 'Voltar ao início'), h('button.btn.block', { type: 'button', onclick: () => navigate(location.hash) }, 'Mais uma rodada'));
      return;
    }
    i++;
    draw();
  }

  draw();
  return root;
}
