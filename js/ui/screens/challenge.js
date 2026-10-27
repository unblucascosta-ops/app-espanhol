// Desafio diário de produção: escrever ou ditar sobre um tema real da sua vida.

import { h, fill, topbar, levelPill, toast } from '../dom.js';
import * as store from '../../core/store.js';
import { dayKey } from '../../core/time.js';
import { countWords } from '../../core/text.js';
import { speak, listen, hasSTT } from '../../core/speech.js';
import { CHALLENGES, CHECKLIST, challengeOfDay } from '../../content/challenges.js';

export async function render({ query, navigate }) {
  const today = dayKey();
  const challenge = CHALLENGES.find((c) => c.id === query.id) || challengeOfDay(today, await store.workingLevel());
  const journal = (await store.getJournal()).sort((a, b) => b.ts - a.ts);
  const entryId = `${today}_${challenge.id}`;
  const existing = journal.find((j) => j.id === entryId);

  const textarea = h('textarea.paste', { placeholder: 'Escreva em espanhol (ou use o ditado 🎤)…', lang: 'es', spellcheck: true });
  textarea.value = existing?.text || '';
  const wordCount = h('span.small.muted');
  const updateCount = () => (wordCount.textContent = `${countWords(textarea.value)} palavras`);
  textarea.addEventListener('input', updateCount);
  updateCount();

  const checks = CHECKLIST.map((label, i) => {
    const input = h('input', { type: 'checkbox', checked: !!existing?.checks?.[i] });
    return { input, el: h('label.switch', h('span.small', label), input) };
  });

  let listener = null;
  const dictate = hasSTT() ? h('button.btn', { type: 'button' }, '🎤 Ditar') : null;
  dictate?.addEventListener('click', async () => {
    if (listener) return listener.stop();
    dictate.textContent = '⏹ Parar';
    const before = textarea.value.trim();
    try {
      listener = listen({ onInterim: (t) => (textarea.value = `${before} ${t}`.trim()) });
      const { text } = await listener.result;
      textarea.value = `${before} ${text}`.trim();
      updateCount();
    } catch (err) {
      toast(err.message);
    } finally {
      listener = null;
      dictate.textContent = '🎤 Ditar';
    }
  });

  async function save() {
    const text = textarea.value.trim();
    if (!text) return toast('Escreva alguma coisa primeiro 🙂');
    await store.saveJournal({
      id: entryId,
      day: today,
      challengeId: challenge.id,
      title: challenge.title,
      text,
      words: countWords(text),
      checks: checks.map((c) => c.input.checked),
      ts: existing?.ts || Date.now(),
    });
    toast('✍️ Salvo no seu diário. ¡Muy bien!');
    navigate('#/challenge' + (query.id ? `?id=${query.id}` : ''));
  }

  async function copyForCorrection() {
    const prompt = `Corrija este texto em espanhol da Espanha (nível ${challenge.level}). Liste os erros, explique em português e dê uma versão corrigida e natural:\n\nTema: ${challenge.prompt}\n\n${textarea.value.trim()}`;
    try {
      await navigator.clipboard.writeText(prompt);
      toast('Copiado! Cole para um professor ou um assistente corrigir.');
    } catch {
      toast('Não foi possível copiar.');
    }
  }

  const useful = h('div.btn-row', challenge.useful.map((u) =>
    h('button.btn.small', { type: 'button', onclick: () => {
      textarea.value = `${textarea.value.trim()} ${u.replace(/…$/, '')}`.trim() + ' ';
      textarea.focus();
      updateCount();
    } }, u),
  ));

  const others = h('details', h('summary.small.muted', { style: { cursor: 'pointer', margin: '12px 4px' } }, 'Escolher outro desafio'),
    CHALLENGES.map((c) => h('a.card.link.row', { href: `#/challenge?id=${c.id}` }, h('div.grow', c.title), levelPill(c.level))));

  const history = journal.length
    ? h('div', h('div.section-title', `Diário · ${journal.length} ${journal.length === 1 ? 'texto' : 'textos'}`),
        journal.slice(0, 20).map((j) => h('details.card', h('summary', h('b', j.title), h('span.small.muted', ` · ${j.day} · ${j.words} palavras`)), h('p', { style: { whiteSpace: 'pre-wrap', marginTop: '8px' } }, j.text))))
    : null;

  const root = h(
    'div',
    topbar('Desafio do dia', { back: '#/' }),
    h(
      'div.card',
      h('div.row', levelPill(challenge.level), h('b.grow', challenge.title), h('button.icon-btn', { type: 'button', 'aria-label': 'Ouvir', onclick: () => speak(challenge.prompt) }, '🔊')),
      h('p', { style: { fontSize: '1.1rem', marginTop: '10px' }, lang: 'es' }, challenge.prompt),
      h('div.small.muted', 'Expressões úteis (toque para inserir):'),
      useful,
    ),
    textarea,
    h('div.row', { style: { margin: '6px 4px 12px' } }, wordCount, h('span.grow'), existing ? h('span.small.muted', '✓ salvo hoje') : null),
    h('div.btn-row', dictate, h('button.btn.primary', { type: 'button', id: 'save-challenge', onclick: save }, 'Salvar')),
    h('div.section-title', 'Antes de salvar, confira'),
    h('div.card', checks.map((c) => c.el)),
    h('button.btn.block.ghost', { type: 'button', onclick: copyForCorrection }, '📋 Copiar para pedir correção'),
    others,
    history,
  );
  root._cleanup = () => listener?.stop();
  return root;
}
