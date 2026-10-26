import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { precacheList, contentHash } from '../../scripts/build-sw.mjs';

test('sw.js está atualizado (rode `npm run build:sw` se falhar)', async () => {
  const sw = await readFile(new URL('../../sw.js', import.meta.url), 'utf8');
  const files = await precacheList();
  const version = await contentHash(files);
  assert.ok(sw.includes(`const VERSION = '${version}';`), 'versão do cache desatualizada');
  for (const f of files) assert.ok(sw.includes(JSON.stringify(f)), `arquivo fora do cache offline: ${f}`);
});
