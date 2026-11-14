# MiskatDesigns — Portfolio

Sito statico (HTML, CSS, JavaScript), senza build. Tema scuro/chiaro, animazioni, configuratore di progetto e lavori realizzati.

## Avvio in locale
Il sito usa percorsi assoluti (`/servizi/`, `/style.css`): aprilo con un server locale, non con doppio clic sul file.

```bash
npx serve .
# oppure
python -m http.server 8000
```

## URL e struttura
| URL | File |
|---|---|
| `/` | `index.html` |
| `/servizi/` | `servizi/index.html` |
| `/servizi/siti-web/` | `servizi/siti-web/index.html` |
| `/servizi/applicazioni/` | `servizi/applicazioni/index.html` |
| `/servizi/campagne/` | `servizi/campagne/index.html` |
| `/servizi/riprese-drone/` | `servizi/riprese-drone/index.html` |
| `/soluzioni/` | `soluzioni/index.html` |
| `/progetti/` | `progetti/index.html` |
| `/metodo/` | `metodo/index.html` |
| `/contatti/` | `contatti/index.html` |

- I vecchi indirizzi `*.html` nella radice sono reindirizzamenti verso i nuovi URL (non modificarli: servono a non rompere link già condivisi).
- `404.html` — pagina per gli indirizzi inesistenti.
- `sitemap.xml` e `robots.txt` — per Google. Dopo la pubblicazione, invia la sitemap da Google Search Console.
- Per una nuova pagina: crea `cartella/index.html`, usa link assoluti (`/contatti/`) e aggiungila a `sitemap.xml`.
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
