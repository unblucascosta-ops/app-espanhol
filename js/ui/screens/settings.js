// Ajustes: ritmo de estudo, voz, tema e backup.

import { h, topbar, toast, downloadFile } from '../dom.js';
import * as store from '../../core/store.js';
import { exportAll, importAll, wipeAll } from '../../core/backup.js';
import { voicesReady, configureSpeech, speak, hasTTS, hasSTT } from '../../core/speech.js';
import { dayKey } from '../../core/time.js';
import { applyTheme } from '../theme.js';

function field(label, control, hint) {
  return h('label.field', h('span', label), control, hint ? h('div.small.muted', { style: { marginTop: '4px' } }, hint) : null);
}

function select(options, value, onChange) {
  const el = h('select', options.map(([v, label]) => h('option', { value: String(v), selected: String(v) === String(value) }, label)));
  el.addEventListener('change', () => onChange(el.value));
  return el;
}

export async function render({ navigate }) {
  const s = await store.getSettings();
  const save = async (patch, msg = 'Salvo') => {
    const next = await store.saveSettings(patch);
    configureSpeech({ voiceURI: next.voiceURI, rate: next.speechRate });
    applyTheme(next.theme);
    toast(msg);
  };

  // As vozes carregam de forma assíncrona: a tela abre já e a lista aparece depois.
  const voiceSelect = h('div.small.muted', 'Carregando vozes…');
  voicesReady().then((voices) => {
    voiceSelect.replaceWith(
      voices.length
        ? select([['', 'Automática (es-ES)'], ...voices.map((v) => [v.voiceURI, `${v.name} (${v.lang})`])], s.voiceURI, (v) => save({ voiceURI: v }))
        : h('div.small.muted', hasTTS() ? 'Nenhuma voz em espanhol encontrada. Instale "Espanhol (Espanha)" nas configurações de voz do celular.' : 'Este navegador não tem síntese de voz.'),
    );
  });

  const rate = h('input', { type: 'range', min: '0.6', max: '1.2', step: '0.05', value: String(s.speechRate) });
  const rateLabel = h('span', `${Math.round(s.speechRate * 100)}%`);
  rate.addEventListener('input', () => (rateLabel.textContent = `${Math.round(rate.value * 100)}%`));
  rate.addEventListener('change', () => save({ speechRate: Number(rate.value) }));

  const fileInput = h('input', { type: 'file', accept: 'application/json,.json', class: 'hidden' });
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;
    try {
      const obj = JSON.parse(await file.text());
      if (!confirm('Importar este backup vai SUBSTITUIR todo o progresso atual. Continuar?')) return;
      const counts = await importAll(obj);
      toast(`Backup importado: ${counts.cards} cartões, ${counts.reviews} revisões.`);
      navigate('#/progress');
    } catch (err) {
      toast(`Não foi possível importar: ${err.message}`, 4000);
    } finally {
      fileInput.value = '';
    }
  });

  async function doExport() {
    const data = await exportAll();
    downloadFile(`espanol-backup-${dayKey()}.json`, JSON.stringify(data));
    await store.kvSet('lastBackup', Date.now());
    toast('Backup exportado ✅');
  }

  async function doWipe() {
    if (!confirm('Apagar TODO o progresso deste aparelho? Exporte um backup antes.')) return;
    if (!confirm('Tem certeza? Isso não pode ser desfeito.')) return;
    await wipeAll();
    toast('Progresso apagado.');
    navigate('#/');
  }

  const lastBackup = await store.kvGet('lastBackup', null);

  return h(
    'div',
    topbar('Ajustes', { back: '#/progress' }),
    h('div.section-title', 'Ritmo'),
    h(
      'div.card',
      field('Cartões novos por dia', select([0, 5, 8, 10, 12, 15, 20, 25, 30].map((n) => [n, `${n}`]), s.newPerDay, (v) => save({ newPerDay: Number(v) })),
        'Com 20–30 min/dia, 8–12 novos é um bom ritmo (as revisões crescem com o tempo).'),
      field('Meta diária (cartões revisados)', select([10, 15, 20, 30, 40, 50, 75, 100].map((n) => [n, `${n}`]), s.dailyGoal, (v) => save({ dailyGoal: Number(v) })),
        'Cumprir a meta mantém a sequência de dias (🔥).'),
      field('Retenção desejada', select([[0.8, '80% — menos revisões'], [0.85, '85%'], [0.9, '90% — recomendado'], [0.95, '95% — mais revisões']], s.requestRetention, (v) => save({ requestRetention: Number(v) }))),
      field('Frente do cartão', select([['cloze', 'Lacuna (digitar a palavra)'], ['full', 'Tradução → frase inteira']], s.frontMode, (v) => save({ frontMode: v }))),
    ),
    h('div.section-title', 'Voz'),
    h(
      'div.card',
      field('Voz em espanhol', voiceSelect),
      field('Velocidade', h('div.row', h('div.grow', rate), rateLabel)),
      h('label.switch', h('span', 'Tocar áudio automaticamente'), h('input', { type: 'checkbox', checked: s.autoplay, onchange: (e) => save({ autoplay: e.target.checked }) })),
      h('button.btn.block', { type: 'button', onclick: () => speak('Hola, ¿qué tal? Vivo en Madrid y estudio un máster.') }, '🔊 Testar voz'),
      h('p.small.muted', { style: { marginTop: '8px' } },
        hasSTT() ? '🎤 Reconhecimento de voz disponível. Em alguns celulares ele precisa de internet.' : '🎤 Este navegador não tem reconhecimento de voz (use Chrome no Android ou Safari no iPhone).'),
    ),
    h('div.section-title', 'Aparência'),
    h('div.card', field('Tema', select([['auto', 'Automático (sistema)'], ['dark', 'Escuro'], ['light', 'Claro']], s.theme, (v) => save({ theme: v })))),
    h('div.section-title', 'Backup'),
    h(
      'div.card',
      h('p.small.muted', 'Tudo fica salvo só neste aparelho. Exporte um backup de vez em quando (e antes de trocar de celular).'),
      lastBackup ? h('p.small.muted', `Último backup: ${new Date(lastBackup).toLocaleDateString('pt-BR')}`) : null,
      h('div.btn-row', h('button.btn', { type: 'button', id: 'export', onclick: doExport }, '⬇️ Exportar JSON'), h('button.btn', { type: 'button', onclick: () => fileInput.click() }, '⬆️ Importar JSON')),
      fileInput,
    ),
    h('div.section-title', 'Instalar no celular'),
    h(
      'div.card.small',
      h('p', h('b', 'Android (Chrome): '), 'menu ⋮ → "Instalar app" ou "Adicionar à tela inicial".'),
      h('p', h('b', 'iPhone (Safari): '), 'botão Compartilhar → "Adicionar à Tela de Início".'),
      h('p.muted', 'Depois de aberto uma vez, o app funciona offline — inclusive no metrô.'),
    ),
    h('div.section-title', 'Zona de perigo'),
    h('button.btn.block', { type: 'button', style: { color: 'var(--again)' }, onclick: doWipe }, 'Apagar todo o progresso'),
  );
}
