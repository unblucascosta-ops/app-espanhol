import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateBackup, BACKUP_APP } from '../../js/core/backup.js';

const ok = { app: BACKUP_APP, version: 1, data: { cards: [{ id: 'p_1', es: 'Hola', state: 0 }], days: [], kv: [] } };

test('aceita backup válido', () => assert.deepEqual(validateBackup(ok), []));

test('rejeita arquivos estranhos', () => {
  assert.ok(validateBackup(null).length);
  assert.ok(validateBackup({}).length);
  assert.ok(validateBackup({ ...ok, app: 'outro' }).length);
  assert.ok(validateBackup({ ...ok, version: 99 }).length);
  assert.ok(validateBackup({ ...ok, data: { cards: 'x' } }).length);
  assert.ok(validateBackup({ ...ok, data: { hackers: [] } }).length);
  assert.ok(validateBackup({ ...ok, data: { cards: [{ id: 1 }] } }).length);
});
