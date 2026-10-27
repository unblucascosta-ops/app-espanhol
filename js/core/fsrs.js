// FSRS-5 (Free Spaced Repetition Scheduler) — implementação compacta.
// Referência: https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm
//
// Cada cartão guarda: state, due, stability (S, em dias), difficulty (D, 1–10),
// reps, lapses, lastReview e step (passo atual de aprendizagem).

import { DAY_MS, addDays, startOfDay } from './time.js';

export const Rating = Object.freeze({ Again: 1, Hard: 2, Good: 3, Easy: 4 });
export const State = Object.freeze({ New: 0, Learning: 1, Review: 2, Relearning: 3 });

const DECAY = -0.5;
const FACTOR = 19 / 81; // garante R = 90% quando t = S

export const DEFAULT_PARAMS = Object.freeze({
  // Pesos padrão do FSRS-5.
  w: [
    0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192,
    1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621,
  ],
  requestRetention: 0.9,
  maximumInterval: 36500,
  learningSteps: [1, 10], // minutos
  relearningSteps: [10], // minutos
});

const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
const clampD = (d) => clamp(d, 1, 10);

export function newCardState() {
  return { state: State.New, due: 0, stability: 0, difficulty: 0, reps: 0, lapses: 0, lastReview: null, step: 0 };
}

/** Probabilidade de lembrar depois de `t` dias com estabilidade `s`. */
export function retrievability(t, s) {
  if (s <= 0) return 0;
  return Math.pow(1 + (FACTOR * t) / s, DECAY);
}

/** Intervalo (dias inteiros) para atingir a retenção desejada `r`. */
export function intervalFor(s, r = 0.9, maximumInterval = 36500) {
  const ivl = (s / FACTOR) * (Math.pow(r, 1 / DECAY) - 1);
  return clamp(Math.round(ivl), 1, maximumInterval);
}

function initStability(w, g) {
  return Math.max(w[g - 1], 0.1);
}

function initDifficulty(w, g) {
  return w[4] - Math.exp(w[5] * (g - 1)) + 1;
}

function nextDifficulty(w, d, g) {
  const delta = -w[6] * (g - 3);
  const dLinear = d + (delta * (10 - d)) / 9; // amortecimento linear
  return clampD(w[7] * initDifficulty(w, Rating.Easy) + (1 - w[7]) * dLinear); // reversão à média
}

function recallStability(w, d, s, r, g) {
  const hardPenalty = g === Rating.Hard ? w[15] : 1;
  const easyBonus = g === Rating.Easy ? w[16] : 1;
  return s * (1 + Math.exp(w[8]) * (11 - d) * Math.pow(s, -w[9]) * (Math.exp(w[10] * (1 - r)) - 1) * hardPenalty * easyBonus);
}

function forgetStability(w, d, s, r) {
  const sf = w[11] * Math.pow(d, -w[12]) * (Math.pow(s + 1, w[13]) - 1) * Math.exp(w[14] * (1 - r));
  return Math.min(sf, s / Math.exp(w[17] * w[18]));
}

function shortTermStability(w, s, g) {
  return Math.max(0.1, s * Math.exp(w[17] * (g - 3 + w[18])));
}

/**
 * Aplica uma resposta ao cartão. Função pura: devolve um novo objeto
 * com os campos de agendamento atualizados (o resto do cartão é preservado).
 */
export function schedule(card, rating, now = Date.now(), params = DEFAULT_PARAMS) {
  const p = { ...DEFAULT_PARAMS, ...params };
  const { w } = p;
  const next = { ...card, reps: (card.reps || 0) + 1, lastReview: now };
  const elapsed = card.lastReview ? Math.max(0, (now - card.lastReview) / DAY_MS) : 0;
  const inMinutes = (m) => now + Math.round(m * 60000);
  const toReview = (s, minDays = 1) => {
    const ivl = Math.max(minDays, intervalFor(s, p.requestRetention, p.maximumInterval));
    next.state = State.Review;
    next.step = 0;
    next.due = addDays(startOfDay(now), ivl);
    next.interval = ivl;
  };

  // Passos de (re)aprendizagem: De novo → volta ao 1º passo; Difícil → repete o passo;
  // Bem → avança (ou gradua); Fácil → gradua.
  const stepThrough = (steps) => {
    const step = card.state === State.New ? 0 : card.step || 0;
    if (rating === Rating.Easy || steps.length === 0) return toReview(next.stability, rating === Rating.Easy ? 2 : 1);
    if (rating === Rating.Again) {
      next.step = 0;
      next.due = inMinutes(steps[0]);
    } else if (rating === Rating.Hard) {
      next.step = step;
      const delay = step === 0 && steps.length > 1 ? (steps[0] + steps[1]) / 2 : steps[step] ?? steps[steps.length - 1];
      next.due = inMinutes(delay);
    } else {
      const nextStep = card.state === State.New ? 1 : step + 1;
      if (nextStep >= steps.length) return toReview(next.stability);
      next.step = nextStep;
      next.due = inMinutes(steps[nextStep]);
    }
    next.interval = 0;
  };

  switch (card.state) {
    case State.New: {
      next.difficulty = clampD(initDifficulty(w, rating));
      next.stability = initStability(w, rating);
      next.state = State.Learning;
      stepThrough(p.learningSteps);
      break;
    }
    case State.Learning:
    case State.Relearning: {
      next.difficulty = nextDifficulty(w, card.difficulty, rating);
      next.stability = shortTermStability(w, card.stability, rating);
      stepThrough(card.state === State.Learning ? p.learningSteps : p.relearningSteps);
      break;
    }
    case State.Review:
    default: {
      const r = retrievability(elapsed, card.stability);
      next.difficulty = nextDifficulty(w, card.difficulty, rating);
      if (rating === Rating.Again) {
        next.stability = forgetStability(w, card.difficulty, card.stability, r);
        next.lapses = (card.lapses || 0) + 1;
        next.state = State.Relearning;
        next.step = 0;
        if (p.relearningSteps.length === 0) toReview(next.stability);
        else {
          next.due = inMinutes(p.relearningSteps[0]);
          next.interval = 0;
        }
        break;
      }
      // Calcula os três intervalos para garantir Difícil < Bem < Fácil.
      const sH = recallStability(w, card.difficulty, card.stability, r, Rating.Hard);
      const sG = recallStability(w, card.difficulty, card.stability, r, Rating.Good);
      const sE = recallStability(w, card.difficulty, card.stability, r, Rating.Easy);
      let iH = intervalFor(sH, p.requestRetention, p.maximumInterval);
      let iG = intervalFor(sG, p.requestRetention, p.maximumInterval);
      let iE = intervalFor(sE, p.requestRetention, p.maximumInterval);
      iH = Math.min(iH, iG);
      iG = Math.max(iG, iH + 1);
      iE = Math.max(iE, iG + 1);
      const [s, ivl] = rating === Rating.Hard ? [sH, iH] : rating === Rating.Good ? [sG, iG] : [sE, iE];
      next.stability = s;
      next.state = State.Review;
      next.step = 0;
      next.interval = Math.min(ivl, p.maximumInterval);
      next.due = addDays(startOfDay(now), next.interval);
    }
  }
  return next;
}

/** Prévia do próximo vencimento para cada nota (para mostrar nos botões). */
export function preview(card, now = Date.now(), params = DEFAULT_PARAMS) {
  const out = {};
  for (const r of [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy]) {
    out[r] = schedule(card, r, now, params).due - now;
  }
  return out;
}
