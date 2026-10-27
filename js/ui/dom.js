// Helpers de DOM: criação de elementos, toast e "bottom sheet".

/**
 * h('div.card#id', { onclick, class, ... }, filhos...)
 * Filhos podem ser strings (viram texto, nunca HTML), nós, arrays, null/false.
 * Para HTML confiável (conteúdo do próprio app) use { html: '...' }.
 */
export function h(sel, attrs, ...children) {
  if (attrs == null || typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs)) {
    children.unshift(attrs);
    attrs = {};
  }
  const [, tag = 'div', rest = ''] = sel.match(/^([a-z0-9-]*)(.*)$/i);
  const el = document.createElement(tag || 'div');
  for (const part of rest.match(/[.#][^.#]+/g) || []) {
    if (part[0] === '.') el.classList.add(part.slice(1));
    else el.id = part.slice(1);
  }
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'html') el.innerHTML = v;
    else if (k === 'class') el.className = [el.className, v].filter(Boolean).join(' ');
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (k in el && typeof v !== 'string') el[k] = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  append(el, children);
  return el;
}

/** Substitui os filhos de `el` (aceita os mesmos filhos que h(), ignorando null/false). */
export function fill(el, ...children) {
  el.replaceChildren();
  append(el, children);
  return el;
}

function append(el, children) {
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false || c === true) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}

let toastTimer;
export function toast(msg, ms = 2200) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

/** Abre um painel inferior. Devolve { close }. */
export function sheet(content, { onClose } = {}) {
  const backdrop = h('div.sheet-backdrop');
  const panel = h('div.sheet', { role: 'dialog', 'aria-modal': 'true' }, h('div.grab'), content);
  const close = () => {
    backdrop.remove();
    panel.remove();
    document.removeEventListener('keydown', onKey);
    onClose?.();
  };
  const onKey = (e) => e.key === 'Escape' && close();
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', onKey);
  document.body.append(backdrop, panel);
  return { close, panel };
}

export function topbar(title, { back, actions = [] } = {}) {
  return h(
    'header.topbar',
    back ? h('a.icon-btn', { href: back, 'aria-label': 'Voltar' }, '←') : null,
    h('h1', title),
    ...actions,
  );
}

export function levelPill(level) {
  return level ? h(`span.pill.${level}`, level) : null;
}

export function progressBar(fraction) {
  return h('div.progress-bar', h('i', { style: { width: `${Math.round(Math.min(1, Math.max(0, fraction)) * 100)}%` } }));
}

export function confirmDialog(message) {
  return window.confirm(message);
}

export function downloadFile(filename, text, type = 'application/json') {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
