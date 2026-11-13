# MiskatDesigns — Portfolio

Sito statico (HTML, CSS, JavaScript), senza build. Tema scuro/chiaro, animazioni, configuratore di progetto e lavori realizzati.

## Avvio in locale
Apri `index.html` nel browser, oppure avvia un server locale:

```bash
npx serve .
# oppure
python -m http.server 8000
```

## Struttura
- `index.html` — home
- `servizi.html`, `siti-web.html`, `applicazioni.html`, `campagne.html` — servizi
- `soluzioni.html`, `progetti.html`, `metodo.html`, `contatti.html`
- `style.css` — design system (token in `:root`, tema chiaro in `[data-theme="light"]`)
- `main.js` — interazioni e funzioni
- `assets/` — font, icone e immagini
- `DESIGN.md` — direzione visiva e regole

## Screenshot dei lavori
Salva in `assets/images/` (16:10, es. 1600×1000):
- `work-cittaacolori.webp`
- `work-tmmmagic.webp`

Sostituiscono automaticamente le anteprime illustrate.

## Pubblicazione con GitHub Pages
Settings → Pages → Source: *Deploy from a branch* → Branch `main`, cartella `/ (root)`.
