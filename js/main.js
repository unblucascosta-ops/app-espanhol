// Ponto de entrada: tema, roteador por hash, contador de tempo de estudo e service worker.

import { getSettings, addStudyTime } from './core/store.js';
import { configureSpeech } from './core/speech.js';
import { h } from './ui/dom.js';
import { applyTheme } from './ui/theme.js';

// Cada rota carrega a tela sob demanda. `full: true` esconde a barra inferior.
const ROUTES = [
  { path: '/', tab: 'home', load: () => import('./ui/screens/home.js') },
  { path: '/review', full: true, load: () => import('./ui/screens/review.js') },
  { path: '/lessons', tab: 'lessons', load: () => import('./ui/screens/lessons.js') },
  { path: '/lesson/:id', tab: 'lessons', load: () => import('./ui/screens/lesson.js') },
  { path: '/shadow', full: true, load: () => import('./ui/screens/shadow.js') },
  { path: '/reader', tab: 'reader', load: () => import('./ui/screens/reader.js') },
  { path: '/reader/:id', tab: 'reader', load: () => import('./ui/screens/reader.js') },
  { path: '/grammar', tab: 'grammar', load: () => import('./ui/screens/grammar.js') },
  { path: '/grammar/:id', tab: 'grammar', load: () => import('./ui/screens/grammar.js') },
  { path: '/challenge', tab: 'home', load: () => import('./ui/screens/challenge.js') },
  { path: '/progress', tab: 'progress', load: () => import('./ui/screens/progress.js') },
  { path: '/settings', tab: 'progress', load: () => import('./ui/screens/settings.js') },
];

function match(hash) {
  const [rawPath, rawQuery = ''] = hash.replace(/^#/, '').split('?');
  const path = rawPath || '/';
  const query = Object.fromEntries(new URLSearchParams(rawQuery));
  for (const r of ROUTES) {
    const keys = [];
    const re = new RegExp(`^${r.path.replace(/:(\w+)/g, (_, k) => (keys.push(k), '([^/]+)'))}$`);
    const m = path.match(re);
    if (m) return { route: r, params: Object.fromEntries(keys.map((k, i) => [k, decodeURIComponent(m[i + 1])])), query };
  }
  return { route: ROUTES[0], params: {}, query };
}

function navigate(hash) {
  if (location.hash === hash) render();
  else location.hash = hash;
}

let cleanup = null;
let renderId = 0;
async function render() {
  const id = ++renderId;
  const { route, params, query } = match(location.hash);
  const view = document.getElementById('view');
  const app = document.getElementById('app');
  cleanup?.();
  cleanup = null;
  try {
    const mod = await route.load();
    const node = await mod.render({ params, query, navigate });
    if (id !== renderId) return; // outra navegação aconteceu no meio
    app.classList.toggle('fullscreen', !!route.full);
    document.querySelectorAll('#tabbar a').forEach((a) => a.classList.toggle('active', a.dataset.tab === route.tab));
    view.replaceChildren(node);
    cleanup = node._cleanup || null;
    window.scrollTo(0, 0);
    view.focus({ preventScroll: true });
  } catch (err) {
    console.error(err);
    view.replaceChildren(h('div.card', h('h2', 'Ops, algo deu errado'), h('p.muted', String(err.message || err)), h('a.btn', { href: '#/' }, 'Voltar ao início')));
  }
}

// Tempo de estudo: conta enquanto o app está visível e houve interação no último minuto.
function startStudyTimer() {
  let lastActivity = Date.now();
  let pending = 0;
  const mark = () => (lastActivity = Date.now());
  ['pointerdown', 'keydown', 'touchstart'].forEach((ev) => addEventListener(ev, mark, { passive: true }));
  setInterval(() => {
    if (document.visibilityState === 'visible' && Date.now() - lastActivity < 60000) pending += 5000;
    if (pending >= 30000) {
      addStudyTime(pending);
      pending = 0;
    }
  }, 5000);
  addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && pending) {
      addStudyTime(pending);
      pending = 0;
    }
  });
}

async function boot() {
  const settings = await getSettings();
  applyTheme(settings.theme);
  configureSpeech({ voiceURI: settings.voiceURI, rate: settings.speechRate });
  addEventListener('hashchange', render);
  await render();
  startStudyTimer();
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch((e) => console.warn('SW não registrado', e));
  }
}

boot();
