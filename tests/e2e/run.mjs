// Testes ponta a ponta no Chromium (Playwright pré-instalado).
// Uso: npm run test:e2e   (opcional: HEADED=1 para ver o navegador)
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { startServer } from '../../scripts/serve.mjs';
import { buildSw } from '../../scripts/build-sw.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
import { tests } from './harness.mjs';
import './specs.mjs';

await buildSw();
const server = await startServer(0);
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch({ headless: !process.env.HEADED });
let failed = 0;
for (const t of tests) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'pt-BR' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && !/favicon|ERR_INTERNET_DISCONNECTED/.test(m.text()) && errors.push(m.text()));
  try {
    await t.fn({ page, context, base, assert });
    assert.deepEqual(errors, [], 'erros no console');
    console.log(`✔ ${t.name}`);
  } catch (e) {
    failed++;
    console.log(`✘ ${t.name}\n  ${e.stack || e}`);
    await page.screenshot({ path: `test-results/e2e-${tests.indexOf(t)}.png` }).catch(() => {});
  }
  await context.close();
}
await browser.close();
server.close();
console.log(failed ? `\n${failed} teste(s) falharam` : `\n${tests.length} testes passaram`);
process.exit(failed ? 1 : 0);
