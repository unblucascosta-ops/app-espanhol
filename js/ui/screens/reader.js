// Leitor: textos graduados ou colados. Toque numa palavra para ver a tradução e criar um cartão.

import { h, fill, topbar, levelPill, toast, sheet } from '../dom.js';
import * as store from '../../core/store.js';
import { State } from '../../core/fsrs.js';
import { tokenize, sentenceAt, clipAround, countWords, splitSentences } from '../../core/text.js';
import { lookup, lemmaOf } from '../../core/lemma.js';
import { speak, stopSpeaking } from '../../core/speech.js';
import { READINGS, getReading } from '../../content/readings.js';
import { FUNCTION_WORDS } from '../../content/dictionary.js';

export async function render({ params, navigate }) {
  return params.id ? renderText(params.id) : renderList(navigate);
}

// ---------- lista ----------
async function renderList(navigate) {
  const texts = (await store.getTexts()).sort((a, b) => b.createdAt - a.createdAt);

  function openPaste() {
    const title = h('input', { type: 'text', placeholder: 'Ex.: Caso Netflix — aula 3' });
    const body = h('textarea.paste', { placeholder: 'Cole aqui o texto em espanhol…', lang: 'es' });
    const s = sheet(
      h(
        'div',
        h('h2', 'Colar um texto'),
        h('label.field', h('span', 'Título (opcional)'), title),
        body,
        navigator.clipboard?.readText
          ? h('button.btn.small', { type: 'button', style: { marginTop: '8px' }, onclick: async () => {
              try {
                body.value = await navigator.clipboard.readText();
              } catch {
                toast('Não consegui ler a área de transferência — cole manualmente.');
              }
            } }, '📋 Colar da área de transferência')
          : null,
        h('button.btn.primary.big', { type: 'button', style: { marginTop: '12px' }, onclick: save }, 'Abrir no leitor'),
      ),
    );
    async function save() {
      const text = body.value.trim();
      if (!text) return toast('Cole um texto primeiro.');
      const id = `t_${Date.now().toString(36)}`;
      await store.saveText({ id, title: title.value.trim() || text.split(/\s+/).slice(0, 6).join(' ') + '…', body: text, createdAt: Date.now() });
      s.close();
      navigate(`#/reader/${id}`);
    }
  }

  const byLevel = {};
  for (const r of READINGS) (byLevel[r.level] ||= []).push(r);

  return h(
    'div',
    topbar('Ler'),
    h('button.btn.primary.big', { type: 'button', id: 'paste-text', onclick: openPaste }, '📋 Colar um texto (ex.: estudo de caso)'),
    h('p.small.muted', { style: { margin: '8px 4px 0' } }, 'Palavras desconhecidas ficam destacadas. Toque para ver a tradução, ouvir e criar um cartão com a frase como contexto.'),
    texts.length ? h('div.section-title', 'Meus textos') : null,
    texts.map((t) =>
      h(
        'div.card.row',
        h('a.grow', { href: `#/reader/${t.id}`, style: { textDecoration: 'none' } }, h('b', t.title), h('div.small.muted', `${countWords(t.body)} palavras`)),
        h('button.icon-btn', { type: 'button', 'aria-label': 'Apagar', onclick: async () => {
          if (!confirm(`Apagar "${t.title}"?`)) return;
          await store.deleteText(t.id);
          navigate('#/reader');
        } }, '🗑'),
      ),
    ),
    h('div.section-title', 'Textos graduados'),
    Object.entries(byLevel).map(([level, list]) =>
      list.map((r) =>
        h('a.card.link.row', { href: `#/reader/r-${r.id}` }, h('div.grow', h('b', r.title), h('div.small.muted', `${countWords(r.es)} palavras`)), levelPill(level)),
      ),
    ),
  );
}

// ---------- leitura ----------
async function renderText(id) {
  let doc;
  if (id.startsWith('r-')) {
    const r = getReading(id.slice(2));
    if (r) doc = { title: r.title, body: r.es, translation: r.pt, level: r.level };
  } else {
    const t = await store.getText(id);
    if (t) doc = { title: t.title, body: t.body };
  }
  if (!doc) return h('div', topbar('Texto não encontrado', { back: '#/reader' }));

  // Status das palavras: conhecida / aprendendo / desconhecida.
  const known = new Set(FUNCTION_WORDS);
  for (const w of await store.getWords()) known.add(w.word);
  const learning = new Set();
  for (const c of await store.getAllCards()) {
    const lemma = lemmaOf(c.cloze);
    if (c.state === State.Review) known.add(lemma);
    else learning.add(lemma);
  }
  const lemmaCache = new Map();
  const lemmaFor = (w) => {
    const k = w.toLowerCase();
    if (!lemmaCache.has(k)) lemmaCache.set(k, lemmaOf(k));
    return lemmaCache.get(k);
  };
  const statusOf = (w) => {
    const k = w.toLowerCase();
    const lemma = lemmaFor(k);
    if (known.has(k) || known.has(lemma)) return 'known';
    if (learning.has(lemma)) return 'learning';
    return 'unknown';
  };

  // Monta o texto com cada palavra num <span>.
  const tokens = tokenize(doc.body);
  let offset = 0;
  const spans = [];
  const textEl = h('div.reader-text', { lang: 'es' });
  for (const t of tokens) {
    if (t.word) {
      const span = h(`span.w.${statusOf(t.text)}`, { dataset: { i: String(spans.length) } }, t.text);
      span._offset = offset;
      spans.push(span);
      textEl.append(span);
    } else textEl.append(t.text);
    offset += t.text.length;
  }

  const counts = h('span.small.muted');
  function refresh() {
    for (const s of spans) s.className = `w ${statusOf(s.textContent)}`;
    const unknownLemmas = new Set(spans.filter((s) => s.classList.contains('unknown')).map((s) => lemmaFor(s.textContent)));
    counts.textContent = `${spans.length} palavras · ${unknownLemmas.size} novas`;
  }
  refresh();

  textEl.addEventListener('click', (e) => {
    const span = e.target.closest('.w');
    if (span) openWord(span);
  });

  function openWord(span) {
    spans.forEach((s) => s.classList.remove('sel'));
    span.classList.add('sel');
    const word = span.textContent;
    const info = lookup(word);
    const sentence = clipAround(sentenceAt(doc.body, span._offset), word);
    const gloss = h('input', { type: 'text', value: info.gloss || '', placeholder: 'Escreva a tradução' });
    const status = statusOf(word);
    const s = sheet(
      h(
        'div',
        h('div.row', h('div.grow', h('div.word-title', word), info.lemma && info.lemma !== word.toLowerCase() ? h('div.small.muted', `forma de: ${info.lemma}`) : null),
          h('button.icon-btn', { type: 'button', 'aria-label': 'Ouvir palavra', onclick: () => speak(word) }, '🔊')),
        info.gloss
          ? h('p', { style: { fontSize: '1.15rem', marginTop: '8px' } }, info.gloss)
          : h('p.muted', { style: { marginTop: '8px' } }, 'Sem tradução offline para esta palavra.'),
        info.rank ? h('div.small.muted', `⭐ Entre as ${Math.ceil(info.rank / 100) * 100} palavras mais usadas`) : null,
        h('div.card', { style: { marginTop: '12px' } }, h('div.small.muted', 'Contexto'), h('div', sentence),
          h('button.btn.small.ghost', { type: 'button', onclick: () => speak(sentence.replace(/…/g, '')) }, '🔊 Ouvir frase')),
        h('label.field', h('span', 'Tradução para o cartão'), gloss),
        h(
          'div.btn-row',
          h('button.btn.primary', { type: 'button', id: 'make-card', onclick: makeCard }, status === 'learning' ? '➕ Outro cartão' : '➕ Criar cartão'),
          h('button.btn', { type: 'button', onclick: markKnown }, '✓ Já sei'),
        ),
        h('a.btn.ghost.block', { href: `https://www.wordreference.com/espt/${encodeURIComponent(word.toLowerCase())}`, target: '_blank', rel: 'noopener', style: { marginTop: '8px' } }, '🌐 Ver no WordReference (online)'),
      ),
      { onClose: () => span.classList.remove('sel') },
    );
    speak(word);

    async function makeCard() {
      const { created } = await store.addCustomCard({ es: sentence.replace(/^…\s*|\s*…$/g, ''), cloze: word, hint: gloss.value, source: 'reader' });
      learning.add(lemmaFor(word));
      known.delete(word.toLowerCase());
      await store.removeWord(word);
      refresh();
      s.close();
      toast(created ? '✅ Cartão criado — aparece na próxima revisão' : 'Esse cartão já existe');
    }
    async function markKnown() {
      await store.setWord(lemmaFor(word), 'known');
      known.add(lemmaFor(word));
      refresh();
      s.close();
    }
  }

  // Ler em voz alta, frase por frase.
  let playing = false;
  const playBtn = h('button.btn', { type: 'button' }, '🔊 Ouvir');
  playBtn.addEventListener('click', async () => {
    if (playing) {
      playing = false;
      stopSpeaking();
      playBtn.textContent = '🔊 Ouvir';
      return;
    }
    playing = true;
    playBtn.textContent = '⏹ Parar';
    for (const sentence of splitSentences(doc.body)) {
      if (!playing) break;
      await speak(sentence);
    }
    playing = false;
    playBtn.textContent = '🔊 Ouvir';
  });

  const translation = doc.translation ? h('div.card.hidden', { style: { whiteSpace: 'pre-wrap' } }, doc.translation) : null;
  const root = h(
    'div',
    topbar(doc.title, { back: '#/reader' }),
    h('div.row', { style: { marginBottom: '8px' } }, levelPill(doc.level), counts),
    h(
      'div.btn-row',
      playBtn,
      translation ? h('button.btn', { type: 'button', onclick: () => translation.classList.toggle('hidden') }, '🇧🇷 Tradução') : null,
    ),
    h('div.legend', h('span', h('i', { style: { background: 'var(--unknown-bg)' } }), 'nova'), h('span', h('i', { style: { background: 'var(--learning-bg)' } }), 'aprendendo'), h('span', h('i', { style: { border: '1px solid var(--line)' } }), 'conhecida')),
    h('div.card', textEl),
    translation,
    h('button.btn.block', { type: 'button', style: { marginTop: '8px' }, onclick: markAllKnown }, '✓ Marcar todas as novas como conhecidas'),
  );
  async function markAllKnown() {
    const lemmas = new Set(spans.filter((s) => s.classList.contains('unknown')).map((s) => lemmaFor(s.textContent)));
    if (!lemmas.size) return toast('Nenhuma palavra nova neste texto.');
    if (!confirm(`Marcar ${lemmas.size} palavras como conhecidas?`)) return;
    for (const l of lemmas) {
      await store.setWord(l, 'known');
      known.add(l);
    }
    refresh();
    toast(`${lemmas.size} palavras marcadas como conhecidas`);
  }
  root._cleanup = () => {
    playing = false;
    stopSpeaking();
  };
  return root;
}
