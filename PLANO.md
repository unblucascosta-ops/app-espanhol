# Plano — App de Espanhol (Espanha) A1 → fluência

## Arquitetura

- **PWA sem build e sem dependências**: HTML + CSS + JavaScript (módulos ES) puros.
  Abre direto do GitHub Pages (ou de qualquer servidor estático) e instala na tela inicial.
- **Offline-first**: um *service worker* guarda em cache todos os arquivos (app + conteúdo).
  Funciona no metrô sem rede.
- **Dados locais**: IndexedDB (cartões, histórico de revisões, estatísticas por dia, textos
  do leitor, diário de produção, configurações). Sem login. Backup exportando/importando JSON.
- **Voz**: Web Speech API — `speechSynthesis` (voz es-ES) e `SpeechRecognition` (es-ES).
  Gravação da própria voz com `MediaRecorder` para comparar no shadowing.
- **SRS**: algoritmo **FSRS-5** (o mesmo do Anki moderno), com passos de aprendizagem
  de 1 min / 10 min e retenção desejada de 90% (ajustável).

```
index.html, manifest.webmanifest, sw.js      ← casca do PWA
css/app.css                                  ← tema claro/escuro, botões grandes
js/core/   fsrs.js, scheduler.js, time.js    ← lógica pura (testada com node --test)
           text.js, lemma.js, stats.js, backup.js
           db.js, store.js                   ← IndexedDB
           speech.js                         ← síntese e reconhecimento de voz
js/ui/     dom.js + screens/*.js             ← uma tela por arquivo
js/content/                                  ← TODO o conteúdo, fácil de editar
           lessons/*.js   (frases: [espanhol, português, palavra-alvo])
           grammar/*.js   (pílulas + exercícios)
           readings.js, challenges.js, dictionary.js
tests/unit  (lógica)   tests/e2e (Playwright no Chromium)
```

## Telas (navegação inferior, pensada para o polegar)

1. **Hoje** — sequência (streak), meta do dia (anel), botão grande "Revisar (N)",
   desafio do dia, atalho para shadowing e para continuar a lição.
2. **Revisão** — cartão com frase em contexto e lacuna na palavra-alvo + tradução.
   Você **digita** a palavra ou **fala** a frase (🎤) antes de ver a resposta.
   O app corrige (tolerando acentos/erros de digitação), sugere a nota e você confirma
   em 4 botões grandes (De novo / Difícil / Bem / Fácil) que mostram o próximo intervalo.
3. **Lições** — trilhas por nível (A1 → B2): Sobrevivência em Madrid, Vida social,
   Universidade, Negócios e Comunicação. Cada lição: dica para brasileiros, frases com
   áudio, shadowing e "adicionar à revisão".
4. **Shadowing** — ouve (normal/lento), repete, o reconhecimento de voz compara palavra
   por palavra; opção de gravar e ouvir a própria voz.
5. **Ler** — textos graduados inclusos + "colar texto" (ex.: estudo de caso). Palavras
   coloridas por status; toque mostra tradução, áudio e cria cartão com a frase como contexto.
6. **Gramática** — pílulas curtas comparando com o português (ser/estar, gustar, vosotros,
   indefinido × perfecto em Madrid, artigos/preposições, heterogenéricos, falsos amigos,
   pronúncia) + exercícios.
7. **Desafio do dia** — tema real da sua vida (Madrid, mestrado, audiovisual) para escrever
   ou ditar; fica salvo num diário.
8. **Progresso** — palavras aprendidas, tempo de estudo, % de acertos, revisões por dia,
   nível estimado.
9. **Ajustes** — novos cartões/dia, meta, voz, velocidade, tema, exportar/importar backup.

## Etapas de construção

1. Núcleo: FSRS + agendador + IndexedDB + tela de revisão + casca PWA (testes unitários + e2e).
2. Conteúdo: ≥300 frases A1–A2 (+ trilha B1–B2 de negócios), tela de lições e shadowing.
3. Leitor + dicionário offline + textos graduados.
4. Gramática em pílulas + desafio diário.
5. Progresso, ajustes, backup; ícones, deploy no GitHub Pages, README.
