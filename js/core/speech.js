// Voz: síntese (TTS) e reconhecimento (STT) em es-ES com a Web Speech API.

const LANG = 'es-ES';
let preferredVoiceURI = '';
let defaultRate = 0.9;

export const hasTTS = () => typeof window !== 'undefined' && 'speechSynthesis' in window;
export const hasSTT = () => typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
export const hasRecorder = () => typeof window !== 'undefined' && !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);

export function configureSpeech({ voiceURI, rate } = {}) {
  if (voiceURI !== undefined) preferredVoiceURI = voiceURI;
  if (rate !== undefined) defaultRate = rate;
}

/** Vozes em espanhol; as de es-ES primeiro. */
export function spanishVoices() {
  if (!hasTTS()) return [];
  return speechSynthesis
    .getVoices()
    .filter((v) => v.lang?.toLowerCase().startsWith('es'))
    .sort((a, b) => score(b) - score(a));
}

function score(v) {
  const lang = v.lang.replace('_', '-').toLowerCase();
  return (lang === 'es-es' ? 10 : 0) + (v.localService ? 2 : 0) + (/google|premium|enhanced|natural/i.test(v.name) ? 1 : 0);
}

/** Espera as vozes carregarem (no Chrome elas chegam de forma assíncrona). */
export function voicesReady(timeout = 1500) {
  if (!hasTTS()) return Promise.resolve([]);
  if (speechSynthesis.getVoices().length) return Promise.resolve(spanishVoices());
  return new Promise((resolve) => {
    const done = () => resolve(spanishVoices());
    speechSynthesis.addEventListener('voiceschanged', done, { once: true });
    setTimeout(done, timeout);
  });
}

function pickVoice() {
  const voices = spanishVoices();
  return voices.find((v) => v.voiceURI === preferredVoiceURI) || voices[0] || null;
}

/** Fala um texto em espanhol da Espanha. Resolve quando termina. */
export function speak(text, { rate } = {}) {
  if (!hasTTS() || !text) return Promise.resolve(false);
  speechSynthesis.cancel();
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LANG;
    const voice = pickVoice();
    if (voice) u.voice = voice;
    u.rate = rate ?? defaultRate;
    u.onend = () => resolve(true);
    u.onerror = () => resolve(false);
    speechSynthesis.speak(u);
    // Alguns navegadores não disparam onend: garante a resolução.
    setTimeout(() => resolve(true), 15000);
  });
}

export function stopSpeaking() {
  if (hasTTS()) speechSynthesis.cancel();
}

/**
 * Ouve o microfone e transcreve em es-ES.
 * Devolve { result: Promise<{ text, alternatives }>, stop() }.
 */
export function listen({ onInterim } = {}) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return { result: Promise.reject(new Error('Reconhecimento de voz indisponível neste navegador.')), stop() {} };
  const rec = new SR();
  rec.lang = LANG;
  rec.interimResults = !!onInterim;
  rec.maxAlternatives = 3;
  rec.continuous = false;
  let finalText = '';
  let alternatives = [];
  const result = new Promise((resolve, reject) => {
    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) {
          finalText += r[0].transcript;
          alternatives = Array.from(r).map((a) => a.transcript);
        } else interim += r[0].transcript;
      }
      onInterim?.(finalText + interim);
    };
    rec.onerror = (e) => {
      const msg = {
        'not-allowed': 'Permita o uso do microfone para falar.',
        'no-speech': 'Não ouvi nada. Tente de novo.',
        network: 'O reconhecimento de voz precisa de internet neste aparelho.',
      }[e.error];
      reject(new Error(msg || `Erro no reconhecimento: ${e.error}`));
    };
    rec.onend = () => resolve({ text: finalText.trim(), alternatives });
  });
  rec.start();
  return { result, stop: () => rec.stop() };
}

/** Grava a própria voz para comparar. Devolve { stop: () => Promise<urlDoÁudio> }. */
export async function record() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const rec = new MediaRecorder(stream);
  const chunks = [];
  rec.ondataavailable = (e) => chunks.push(e.data);
  rec.start();
  return {
    stop: () =>
      new Promise((resolve) => {
        rec.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
          resolve(URL.createObjectURL(new Blob(chunks, { type: rec.mimeType })));
        };
        rec.stop();
      }),
  };
}
