// Camada de dados do app: cartões, revisões, dias, configurações etc.

import * as db from './db.js';
import { newCardState, State } from './fsrs.js';
import { dayKey } from './time.js';
import { hashId } from './text.js';
import { lemmaOf } from './lemma.js';
import { learnedWords, estimateLevel } from './stats.js';
import { LESSONS, getLesson } from '../content/index.js';

export const DEFAULT_SETTINGS = {
  newPerDay: 10,
  dailyGoal: 20,
  requestRetention: 0.9,
  autoplay: true,
  speechRate: 0.9,
  voiceURI: '',
  theme: 'auto', // auto | dark | light
  frontMode: 'cloze', // cloze | full
};

// ---------- kv ----------
export async function kvGet(key, fallback) {
  const row = await db.get('kv', key);
  return row ? row.value : fallback;
}
export const kvSet = (key, value) => db.put('kv', { key, value });

let settingsCache = null;
export async function getSettings() {
  if (!settingsCache) settingsCache = { ...DEFAULT_SETTINGS, ...(await kvGet('settings', {})) };
  return settingsCache;
}
export async function saveSettings(patch) {
  settingsCache = { ...(await getSettings()), ...patch };
  await kvSet('settings', settingsCache);
  return settingsCache;
}
export function clearCaches() {
  settingsCache = null;
}

// ---------- dias ----------
export function emptyDay(day) {
  return { day, reviews: 0, correct: 0, newCards: 0, studyMs: 0, shadow: 0, exercises: 0, goalMet: false };
}
export async function getDay(key = dayKey()) {
  return (await db.get('days', key)) || emptyDay(key);
}
export async function getDays() {
  const rows = await db.getAll('days');
  return Object.fromEntries(rows.map((r) => [r.day, r]));
}
async function bumpDay(fields) {
  const day = await getDay();
  for (const [k, v] of Object.entries(fields)) day[k] = (day[k] || 0) + v;
  const settings = await getSettings();
  day.goalMet = day.reviews >= settings.dailyGoal;
  await db.put('days', day);
  return day;
}
export const addStudyTime = (ms) => bumpDay({ studyMs: Math.round(ms) });
export const addShadow = () => bumpDay({ shadow: 1 });
export const addExercise = () => bumpDay({ exercises: 1 });

// ---------- cartões ----------
export const getAllCards = () => db.getAll('cards');
export const getCard = (id) => db.get('cards', id);
export const putCard = (card) => db.put('cards', card);
export const deleteCard = (id) => db.del('cards', id);

/** Registra uma resposta: cartão + log + estatísticas do dia, numa transação. */
export async function recordReview(before, after, rating, durationMs = 0) {
  const day = await getDay();
  const settings = await getSettings();
  day.reviews += 1;
  if (rating > 1) day.correct += 1;
  if (before.state === State.New) day.newCards += 1;
  day.goalMet = day.reviews >= settings.dailyGoal;
  const log = { cardId: before.id, ts: Date.now(), rating, state: before.state, durationMs: Math.round(durationMs) };
  await db.putAcross([
    { store: 'cards', value: after },
    { store: 'reviews', value: log },
    { store: 'days', value: day },
  ]);
  return day;
}

export const getReviews = () => db.getAll('reviews');

// ---------- lições ----------
export async function getLessonProgress() {
  return kvGet('lessons', {});
}

/** Cria os cartões de uma lição (os que ainda não existem). Devolve quantos criou. */
export async function startLesson(lessonId) {
  const lesson = getLesson(lessonId);
  if (!lesson) throw new Error(`Lição não encontrada: ${lessonId}`);
  const progress = await getLessonProgress();
  const seq = (await kvGet('lessonSeq', 0)) + 1;
  const existing = new Set((await db.getAllByIndex('cards', 'lessonId', lessonId)).map((c) => c.id));
  const now = Date.now();
  const fresh = lesson.phrases
    .filter((p) => !existing.has(p.id))
    .map((p, i) => ({
      id: p.id,
      kind: 'phrase',
      es: p.es,
      pt: p.pt,
      cloze: p.cloze,
      lessonId,
      level: lesson.level,
      source: 'lesson',
      order: seq * 1000 + i,
      createdAt: now,
      ...newCardState(),
    }));
  if (fresh.length) await db.putMany('cards', fresh);
  if (!progress[lessonId]) progress[lessonId] = { startedAt: now, seq };
  await kvSet('lessons', progress);
  await kvSet('lessonSeq', seq);
  return fresh.length;
}

/** Se faltam cartões novos para hoje, inicia a próxima lição do currículo. */
export async function ensureNewCards(extra = 0) {
  const settings = await getSettings();
  const cards = await getAllCards();
  const today = await getDay();
  const needed = settings.newPerDay + extra - today.newCards;
  let available = cards.filter((c) => c.state === State.New).length;
  if (available >= needed) return null;
  const progress = await getLessonProgress();
  for (const lesson of LESSONS) {
    if (available >= needed) break;
    if (progress[lesson.id]) continue;
    available += await startLesson(lesson.id);
    return lesson;
  }
  return null;
}

/** Cartão criado pelo usuário (leitor ou manual). */
export async function addCustomCard({ es, cloze, hint = '', pt = '', source = 'reader' }) {
  const id = hashId(`${es}|${cloze}`, 'u_');
  const existing = await getCard(id);
  if (existing) return { card: existing, created: false };
  const card = {
    id,
    kind: 'phrase',
    es: es.trim(),
    pt: pt.trim(),
    hint: hint.trim(),
    cloze,
    lessonId: null,
    level: null,
    source,
    order: -Date.now(), // cartões salvos por você entram antes
    createdAt: Date.now(),
    ...newCardState(),
  };
  await putCard(card);
  return { card, created: true };
}

// ---------- vocabulário e nível ----------
/** Palavras aprendidas no SRS + marcadas como conhecidas no leitor, e o nível estimado. */
export async function vocabulary(cards) {
  cards ||= await getAllCards();
  const srs = learnedWords(cards, lemmaOf);
  const marked = (await getWords()).filter((w) => w.status === 'known').map((w) => w.word);
  const all = new Set([...srs, ...marked]);
  return { srs: srs.size, marked: marked.length, total: all.size, ...estimateLevel(all.size) };
}

/** Nível para escolher desafios: no mínimo A1. */
export async function workingLevel(cards) {
  const v = await vocabulary(cards);
  return v.level === 'Pré-A1' ? 'A1' : v.level;
}

// ---------- gramática ----------
export const getGrammarProgress = () => kvGet('grammar', {});
export async function saveGrammarScore(id, score) {
  const progress = await getGrammarProgress();
  progress[id] = { best: Math.max(score, progress[id]?.best ?? 0), last: score, ts: Date.now() };
  await kvSet('grammar', progress);
}

// ---------- palavras conhecidas (leitor) ----------
export const getWords = () => db.getAll('words');
export const setWord = (word, status) => db.put('words', { word: word.toLowerCase(), status, ts: Date.now() });
export const removeWord = (word) => db.del('words', word.toLowerCase());

// ---------- textos do leitor ----------
export const getTexts = () => db.getAll('texts');
export const getText = (id) => db.get('texts', id);
export const saveText = (t) => db.put('texts', t);
export const deleteText = (id) => db.del('texts', id);

// ---------- diário de produção ----------
export const getJournal = () => db.getAll('journal');
export const saveJournal = (entry) => db.put('journal', entry);
export const deleteJournal = (id) => db.del('journal', id);
