# Español Madrid 🇪🇸

App web (PWA) para aprender **espanhol da Espanha** do A1 à fluência, feito para quem fala português.
Funciona **offline**, com **uma mão só** e pode ser **instalado na tela inicial** do celular.
Tudo fica salvo no próprio aparelho (IndexedDB) — sem login, sem servidor.

## O que tem

| Módulo | O que faz |
|---|---|
| **Revisão diária** | Repetição espaçada com **FSRS-5**. Frases em contexto com lacuna: você **digita** a palavra ou **fala** a frase (🎤) antes de ver a resposta. O app corrige (tolera acentos e 1 erro de digitação) e sugere a nota. Meta diária + sequência de dias 🔥. |
| **Lições** | 27 lições, **416 frases** (368 de A1–A2) em 5 trilhas: Sobrevivência em Madrid, Vida social, Universidade, Negócios e comunicação (até B2) e Armadilhas para brasileiros. Cada lição tem uma dica comparando com o português e modo **"ouvir tudo"** (mãos livres). |
| **Shadowing** | Ouve (normal/lento), repete em voz alta e o reconhecimento de voz es-ES compara palavra por palavra. Dá para gravar a própria voz e ouvir em seguida. |
| **Leitor** | 12 textos graduados (A1–B2, com tradução) + **colar qualquer texto** (ex.: estudo de caso). Palavras novas ficam destacadas; toque para ver tradução offline, ouvir e **criar um cartão** com a frase como contexto. |
| **Gramática** | 11 pílulas com exercícios: pronúncia da Espanha, ser/estar, gustar, vosotros, muy/mucho, artigos e heterogenéricos, preposições, perfecto × indefinido, pronomes, falsos amigos, subjuntivo. |
| **Desafio do dia** | Tema da sua vida real (Madrid, mestrado, audiovisual), escolhido para o seu nível. Escreva ou dite; fica salvo num diário. Botão para copiar o texto e pedir correção. |
| **Progresso** | Nível estimado pelo vocabulário, palavras aprendidas, tempo de estudo, % de acertos, revisões por dia, constância em 8 semanas. |
| **Ajustes** | Novos/dia, meta, retenção desejada, voz e velocidade, tema claro/escuro, **exportar/importar backup JSON**. |

## Usar no celular

1. Publique (veja abaixo) e abra o link no **Chrome (Android)** ou **Safari (iPhone)**.
2. Android: menu ⋮ → **Instalar app**. iPhone: **Compartilhar → Adicionar à Tela de Início**.
3. Abra uma vez com internet; depois funciona offline.

> Voz: o app usa as vozes do sistema. Se não houver voz "Espanhol (Espanha)", instale-a nas
> configurações de texto-para-fala do celular. Em muitos aparelhos o **reconhecimento** de voz
> precisa de internet — no metrô sem sinal, use a digitação ou o "gravar e comparar" do shadowing.

### Publicar no GitHub Pages

O workflow `.github/workflows/pages.yml` publica a cada push na `main`.
Uma vez só: **Settings → Pages → Source: GitHub Actions**. O endereço será
`https://<seu-usuario>.github.io/app-espanhol/`.

## Desenvolvimento

Sem dependências e sem build: é HTML + CSS + JavaScript (módulos ES).

```bash
npm start            # servidor local em http://localhost:8080
npm test             # testes unitários (node --test)
npm run test:e2e     # testes ponta a ponta no Chromium (Playwright)
npm run build:sw     # atualiza a lista de arquivos do cache offline (sw.js)
npm run check        # tudo acima
```

> Sempre que adicionar ou alterar arquivos, rode `npm run build:sw` — senão a versão offline
> continua com os arquivos antigos (um teste avisa se você esquecer).

### Estrutura

```
index.html · manifest.webmanifest · sw.js
css/app.css
js/main.js                 roteador, tema, contador de tempo de estudo
js/core/                   lógica (fsrs, scheduler, text, lemma, stats, backup, db, store, speech)
js/ui/screens/             uma tela por arquivo
js/content/                TODO o conteúdo ↓
tests/unit · tests/e2e
```

## Como adicionar conteúdo

Todo o conteúdo fica em `js/content/`. Depois de editar, rode `npm test`: o teste de conteúdo
verifica se a palavra-alvo aparece na frase, se não há frases duplicadas etc.

**Frases / lições** — `js/content/lessons/*.js`:

```js
{
  id: 'farmacia',            // único
  level: 'A2',
  emoji: '💊',
  title: 'En la farmacia',
  intro: `Dica para brasileiros (pode usar <b>negrito</b>)`,
  phrases: [
    // [espanhol, português, palavra-alvo (vira a lacuna do cartão)]
    ['¿Tiene algo para la tos?', 'Tem algo para tosse?', 'tos'],
  ],
}
```

Depois coloque o `id` em `CURRICULUM` (em `js/content/index.js`) na posição em que a lição deve
entrar automaticamente na revisão diária. Para criar uma trilha nova, importe o arquivo e adicione-o
em `TRACKS`.

**Textos do leitor** — `js/content/readings.js` (`{ id, level, title, es, pt }`, parágrafos separados por linha em branco).

**Pílulas de gramática** — `js/content/grammar/index.js` (`html` da explicação + `exercises`).

**Desafios** — `js/content/challenges.js`.

**Dicionário** — `js/content/dictionary.js`: uma linha `palavra|tradução` por palavra.
O bloco `FREQUENT` está em ordem aproximada de frequência (hoje ~890 palavras ranqueadas,
~1.400 no total) e pode ser estendido até as 2.000+ mais frequentes; o lematizador reconhece
conjugações e plurais automaticamente.

## Métodos usados

- **Repetição espaçada (FSRS-5)** com retenção-alvo de 90% e passos de 1 e 10 minutos.
- **Recordação ativa**: você produz a resposta antes de vê-la (digitando ou falando).
- **Input compreensível**: textos graduados e seus próprios textos, com tradução por toque.
- **Frequência**: lições começam pelo vocabulário mais comum e de sobrevivência.
- **Foco no brasileiro**: falsos amigos, ser/estar, gustar, vosotros, perfecto × indefinido,
  heterogenéricos, preposições e pronúncia de Madrid (distinción, j, ll/y, r/rr, vogais sem nasalizar).
- **Shadowing** e **produção diária**.
