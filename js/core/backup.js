// Backup: exportar/importar todo o progresso em JSON.

import * as db from './db.js';
import { clearCaches } from './store.js';

export const BACKUP_APP = 'espanol-madrid';
export const BACKUP_VERSION = 1;
const STORE_NAMES = Object.keys(db.STORES);

/** Valida um objeto de backup. Devolve a lista de problemas (vazia = ok). */
export function validateBackup(obj) {
  const errors = [];
  if (!obj || typeof obj !== 'object') return ['Arquivo vazio ou inválido.'];
  if (obj.app !== BACKUP_APP) errors.push('Este arquivo não é um backup deste app.');
  if (typeof obj.version !== 'number' || obj.version > BACKUP_VERSION) errors.push('Versão de backup não suportada.');
  if (!obj.data || typeof obj.data !== 'object') return [...errors, 'Backup sem dados.'];
  for (const [name, rows] of Object.entries(obj.data)) {
    if (!STORE_NAMES.includes(name)) errors.push(`Tabela desconhecida: ${name}`);
    else if (!Array.isArray(rows)) errors.push(`Tabela ${name} inválida.`);
  }
  for (const c of obj.data.cards || []) {
    if (!c || typeof c.id !== 'string' || typeof c.es !== 'string' || typeof c.state !== 'number') {
      errors.push('Há cartões malformados no backup.');
      break;
    }
  }
  return errors;
}

export async function exportAll() {
  const data = {};
  for (const name of STORE_NAMES) data[name] = await db.getAll(name);
  return { app: BACKUP_APP, version: BACKUP_VERSION, exportedAt: new Date().toISOString(), data };
}

/** Substitui todos os dados locais pelos do backup. */
export async function importAll(obj) {
  const errors = validateBackup(obj);
  if (errors.length) throw new Error(errors.join(' '));
  for (const name of STORE_NAMES) {
    await db.clear(name);
    const rows = obj.data[name] || [];
    if (rows.length) await db.putMany(name, rows);
  }
  clearCaches();
  return Object.fromEntries(STORE_NAMES.map((n) => [n, (obj.data[n] || []).length]));
}

export async function wipeAll() {
  for (const name of STORE_NAMES) await db.clear(name);
  clearCaches();
}
