// Utilidades de texto: normalização, tokenização, correção de respostas e lacunas.

const LETTER = '\\p{L}';

/** Minúsculas, sem pontuação (inclui ¿¡), espaços simples. Mantém acentos. */
export function normalize(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFC')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Remove acentos e til (á→a, ñ→n, ü→u). */
export function stripAccents(s) {
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC');
}

export function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

/**
 * Compara a resposta digitada com a esperada.
 * Resultado: 'exact' | 'accent' (só faltou acento/ñ) | 'typo' (1 letra) | 'wrong' | 'empty'.
 */
export function checkAnswer(given, expected) {
  const g = normalize(given);
  const e = normalize(expected);
  if (!g) return 'empty';
  if (g === e) return 'exact';
  const ga = stripAccents(g);
  const ea = stripAccents(e);
  if (ga === ea) return 'accent';
  const tolerance = ea.length >= 5 ? 1 : 0;
  if (tolerance && levenshtein(ga, ea) <= tolerance) return 'typo';
  return 'wrong';
}

/** Nota sugerida (1–4) a partir do resultado da correção. */
export function suggestRating(result) {
  return { exact: 3, accent: 2, typo: 2, wrong: 1, empty: 1 }[result] ?? 1;
}

/**
 * Localiza a palavra-alvo dentro da frase (palavra inteira, sem diferenciar maiúsculas).
 * Devolve { before, word, after } ou null.
 */
export function findCloze(sentence, target) {
  const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?<![${LETTER}])${escaped}(?![${LETTER}])`, 'iu');
  const m = re.exec(sentence);
  if (!m) return null;
  return { before: sentence.slice(0, m.index), word: m[0], after: sentence.slice(m.index + m[0].length) };
}

/**
 * Divide um texto em pedaços: palavras e "resto" (espaços/pontuação).
 * [{ text, word: true|false }]
 */
export function tokenize(text) {
  const out = [];
  const re = /[\p{L}\p{M}]+(?:['’-][\p{L}\p{M}]+)*|[^\p{L}\p{M}]+/gu;
  let m;
  while ((m = re.exec(text))) out.push({ text: m[0], word: /\p{L}/u.test(m[0]) });
  return out;
}

/** Divide em frases (para usar como contexto de um cartão). */
export function splitSentences(text) {
  return (text.match(/[^.!?…\n]+[.!?…]*["»”)]*/g) || []).map((s) => s.trim()).filter(Boolean);
}

/** Frase do texto que contém a posição `index` (em caracteres). */
export function sentenceAt(text, index) {
  let start = index;
  while (start > 0 && !/[.!?…\n]/.test(text[start - 1])) start--;
  let end = index;
  while (end < text.length && !/[.!?…\n]/.test(text[end])) end++;
  if (end < text.length && text[end] !== '\n') end++;
  return text.slice(start, end).trim();
}

/**
 * Compara frase falada/escrita com a esperada, palavra por palavra (LCS),
 * ignorando acentos e pontuação.
 * Devolve { tokens: [{ word, ok }], score: 0–1 } com as palavras da frase esperada.
 */
export function compareWords(given, expected) {
  const key = (w) => stripAccents(w);
  const g = normalize(given).split(' ').filter(Boolean).map(key);
  const eRaw = normalize(expected).split(' ').filter(Boolean);
  const e = eRaw.map(key);
  const dp = Array.from({ length: e.length + 1 }, () => new Array(g.length + 1).fill(0));
  for (let i = e.length - 1; i >= 0; i--) {
    for (let j = g.length - 1; j >= 0; j--) {
      dp[i][j] = e[i] === g[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const ok = new Array(e.length).fill(false);
  let i = 0;
  let j = 0;
  while (i < e.length && j < g.length) {
    if (e[i] === g[j]) {
      ok[i] = true;
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  const tokens = eRaw.map((word, k) => ({ word, ok: ok[k] }));
  const score = e.length ? ok.filter(Boolean).length / e.length : 0;
  return { tokens, score };
}

/** Hash curto e estável (FNV-1a) — usado para gerar ids de frases. */
export function hashId(s, prefix = 'p_') {
  let h = 0x811c9dc5;
  const str = normalize(s);
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return prefix + h.toString(36);
}

export function countWords(text) {
  return normalize(text).split(' ').filter(Boolean).length;
}
