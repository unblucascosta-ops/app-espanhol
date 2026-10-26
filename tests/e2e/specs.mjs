import { test } from './harness.mjs';

test('início mostra meta, sequência e botão de revisão com cartões novos', async ({ page, base, assert }) => {
  await page.goto(base);
  const btn = page.locator('#start-review');
  await btn.waitFor();
  assert.match(await btn.textContent(), /Revisar · 10 cartões/);
  assert.match(await page.textContent('.ring'), /0\/20/);
});

test('revisão: digitar resposta, corrigir, avaliar e salvar progresso', async ({ page, base, assert }) => {
  await page.goto(`${base}#/review`);
  await page.locator('.answer-input').waitFor();
  // Primeiro cartão (lição "Saludos"): responde errado de propósito.
  await page.fill('.answer-input', 'xxxx');
  await page.click('text=Verificar');
  await page.locator('.feedback.bad').waitFor();
  assert.ok(await page.locator('.grade.g1.suggested').count(), 'sugere "De novo" ao errar');
  await page.click('.grade.g1');
  // Próximos cartões: lê a resposta certa do DOM e acerta.
  for (let i = 0; i < 3; i++) {
    await page.locator('.answer-input').waitFor();
    await page.click('text=Ver resposta');
    const word = (await page.textContent('.prompt-es .blank')).trim();
    await page.click('.grade.g3');
    assert.ok(word.length > 0);
  }
  // Volta para o início e confere a meta.
  await page.click('a[aria-label="Fechar"]');
  await page.locator('.ring').waitFor();
  assert.match(await page.textContent('.ring'), /4\/20/);
  await page.reload();
  await page.locator('.ring').waitFor();
  assert.match(await page.textContent('.ring'), /4\/20/, 'progresso persiste após recarregar');
});

test('revisão: resposta correta digitada é aceita (com tolerância a acentos)', async ({ page, base, assert }) => {
  await page.goto(`${base}#/review`);
  await page.locator('.answer-input').waitFor();
  // Descobre a resposta lendo o cartão no IndexedDB pela própria página.
  const cloze = await page.evaluate(async () => {
    const store = await import('./js/core/store.js');
    const cards = await store.getAllCards();
    const text = document.querySelector('.prompt-pt').textContent;
    return cards.find((c) => c.pt === text).cloze;
  });
  const noAccents = cloze.normalize('NFD').replace(/[̀-ͯ]/g, '');
  await page.fill('.answer-input', noAccents);
  await page.press('.answer-input', 'Enter');
  await page.locator('.feedback').waitFor();
  const cls = await page.getAttribute('.feedback', 'class');
  assert.ok(/ok|close/.test(cls), `aceita "${noAccents}" para "${cloze}"`);
});

test('funciona offline depois da primeira visita', async ({ page, context, base, assert }) => {
  await page.goto(base);
  await page.locator('#start-review').waitFor();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(async () => (await caches.keys()).length > 0 && (await (await caches.open((await caches.keys())[0])).keys()).length > 20);
  await context.setOffline(true);
  await page.reload();
  await page.locator('#start-review').waitFor();
  await page.goto(`${base}#/review`);
  await page.locator('.answer-input').waitFor();
  assert.ok(true);
});

test('lições: lista, detalhe e adicionar à revisão', async ({ page, base, assert }) => {
  await page.goto(`${base}#/lessons`);
  await page.locator('text=Sobrevivência em Madrid').waitFor();
  assert.ok((await page.locator('a.card.link').count()) >= 27);
  await page.click('text=B1');
  assert.ok((await page.locator('a.card.link').count()) < 27, 'filtro por nível');
  await page.click('text=Todos');
  await page.click('text=En el metro');
  await page.locator('.intro').waitFor();
  assert.equal(await page.locator('.phrase').count(), 16);
  await page.click('#start-lesson');
  await page.locator('text=Na sua revisão diária').waitFor();
  const n = await page.evaluate(async () => (await (await import('./js/core/store.js')).getAllCards()).filter((c) => c.lessonId === 'metro').length);
  assert.equal(n, 16);
});

test('shadowing: mostra frase, avança e conclui', async ({ page, base, assert }) => {
  await page.goto(`${base}#/shadow?lesson=bar`);
  await page.locator('.shadow-phrase').waitFor();
  assert.match(await page.textContent('.review-top'), /1\/16/);
  for (let i = 0; i < 16; i++) await page.click('button.btn.primary');
  await page.locator('text=¡Muy bien!').waitFor();
  assert.ok(true);
});

test('leitor: colar texto, tocar palavra, ver tradução e criar cartão', async ({ page, base, assert }) => {
  await page.goto(`${base}#/reader`);
  await page.click('#paste-text');
  await page.fill('textarea.paste', 'La empresa creció mucho el año pasado. Los ingresos publicitarios cayeron en picado.');
  await page.click('text=Abrir no leitor');
  await page.locator('.reader-text').waitFor();
  assert.ok(await page.locator('.w.known', { hasText: /^La$/ }).count(), 'artigo é conhecido');
  await page.click('.w:text-is("creció")');
  await page.locator('.word-title').waitFor();
  assert.match(await page.textContent('.sheet'), /forma de: crecer/);
  assert.match(await page.textContent('.sheet'), /crescer/);
  await page.click('#make-card');
  await page.locator('.w.learning:text-is("creció")').waitFor();
  const card = await page.evaluate(async () => (await (await import('./js/core/store.js')).getAllCards()).find((c) => c.source === 'reader'));
  assert.equal(card.cloze, 'creció');
  assert.equal(card.es, 'La empresa creció mucho el año pasado.');
  assert.equal(card.hint, 'crescer');
  // Reabre a lista: o texto foi salvo.
  await page.goto(`${base}#/reader`);
  await page.locator('text=Meus textos').waitFor();
});

test('leitor: texto graduado com tradução', async ({ page, base, assert }) => {
  await page.goto(`${base}#/reader/r-primer-dia`);
  await page.locator('.reader-text').waitFor();
  await page.click('text=🇧🇷 Tradução');
  assert.match(await page.textContent('#view'), /Meu nome é Pedro/);
});
