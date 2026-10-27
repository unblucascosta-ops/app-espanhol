// Gera os PNGs dos ícones a partir de icons/icon.svg (usa o Chromium do Playwright).
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { readFile } from 'node:fs/promises';

const svg = await readFile(new URL('../icons/icon.svg', import.meta.url), 'utf8');
const browser = await chromium.launch();
const page = await browser.newPage();
async function shot(size, file, { maskable = false } = {}) {
  await page.setViewportSize({ width: size, height: size });
  const inner = maskable ? svg.replace('rx="112"', 'rx="0"') : svg;
  const pad = maskable ? Math.round(size * 0.1) : 0;
  await page.setContent(`<html><body style="margin:0;background:${maskable ? '#e14a30' : 'transparent'}">
    <div style="width:${size}px;height:${size}px;padding:${pad}px;box-sizing:border-box">${inner.replace('<svg ', `<svg width="${size - 2 * pad}" height="${size - 2 * pad}" `)}</div></body></html>`);
  await page.screenshot({ path: new URL(`../icons/${file}`, import.meta.url).pathname, omitBackground: !maskable });
}
await shot(192, 'icon-192.png');
await shot(512, 'icon-512.png');
await shot(512, 'maskable-512.png', { maskable: true });
await browser.close();
console.log('ícones gerados');
