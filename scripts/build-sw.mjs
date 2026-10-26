// Gera a lista de arquivos do cache offline dentro de sw.js (e muda a versão).
// Rode `npm run build:sw` sempre que adicionar/alterar arquivos do app.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const DIRS = ['js', 'css', 'icons'];
const FILES = ['./', 'index.html', 'manifest.webmanifest'];

async function walk(dir) {
  const out = [];
  for (const e of await readdir(join(ROOT, dir), { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

export async function precacheList() {
  const files = [...FILES];
  for (const d of DIRS) files.push(...(await walk(d)));
  return files.map((f) => f.split('\\').join('/')).sort();
}

export async function contentHash(files) {
  const h = createHash('sha256');
  for (const f of files) {
    if (f === './') continue;
    h.update(f);
    h.update(await readFile(join(ROOT, f)));
  }
  return h.digest('hex').slice(0, 10);
}

export async function buildSw() {
  const files = await precacheList();
  const version = await contentHash(files);
  const swPath = join(ROOT, 'sw.js');
  const src = await readFile(swPath, 'utf8');
  const block = `// <precache>\nconst VERSION = '${version}';\nconst PRECACHE = ${JSON.stringify(files, null, 2)};\n// </precache>`;
  const next = src.replace(/\/\/ <precache>[\s\S]*?\/\/ <\/precache>/, block);
  await writeFile(swPath, next);
  return { version, count: files.length, changed: next !== src };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const r = await buildSw();
  console.log(`sw.js: ${r.count} arquivos, versão ${r.version}${r.changed ? ' (atualizado)' : ''}`);
}
