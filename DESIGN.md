# MiskatDesigns

## Direction

Sito commerciale italiano di un professionista indipendente che realizza siti, applicazioni e strumenti digitali per negozi e piccole imprese. L’azione principale è avviare una conversazione via email.

La direzione usa fotografie fornite dal titolare come superfici principali, testo ampio e leggibile, bianco, inchiostro scuro e blu cobalto. La firma visiva è l’apertura fotografica con il telefono luminoso, seguita da due colonne indipendenti di card fotografiche. Le immagini mantengono le proporzioni originali.

La home presenta una selezione breve. La galleria completa appartiene alla pagina Progetti. Le immagini di terzi sono identificate come riferimenti visivi. Non vengono attribuiti a MiskatDesigns lavori, recensioni o risultati economici non documentati.

## Runtime ownership

style.css contiene un unico sistema di regole, senza sovrapposizioni delle vecchie direzioni. I token in :root sono la fonte normativa dei colori, delle spaziature principali e dei raggi.

| Ruolo | Token | Valore |
| --- | --- | --- |
| Fondo | --bg | #ffffff |
| Superfici | --surface | #f3f5f7 |
| Testo | --text | #121d29 |
| Testo secondario | --muted | #596573 |
| Divisori | --line | #dce2e8 |
| Accento | --accent | #284edb |
| Raggio base | --radius | 24px |

Manrope variabile auto-ospitato per titoli e corpo. Consolas per etichette di servizio e numeri di fase. Licenza SIL OFL inclusa in assets/fonts/OFL.txt. Preload locale e font-display optional.

Contenitore di 1240 px, esteso a 1400 px sopra 1700 px. Menu compatto a 900 px. Griglie fotografiche impilate a 640 px. Spaziatura di sezione definita da --space-section. Tutte le pagine condividono header, footer, pulsanti, form, disclosure e modali.

## Interaction

main.js gestisce i comportamenti condivisi. Menu a espansione con Escape e ritorno del focus. Filtri dei riferimenti con stato premuto e conteggio. Scelta del settore e dell’obiettivo con pannello aggiornato. Ingrandimento immagini con dialog personalizzato, chiusura Escape e ritorno al comando di apertura.

Il form prepara localmente un’email da rivedere prima di aprire il programma di posta. Nessun invio automatico. Qualsiasi modifica invalida l’anteprima precedente. Gli errori sono associati al campo, il testo resta disponibile e il focus va al campo da correggere.

Animazioni limitate agli ingressi e alle icone direzionali. Nessuno zoom delle foto delle card. prefers-reduced-motion disattiva movimento e scorrimento animato.

## Content

Lingua italiana. Email confermata miskatdesigns@gmail.com. Numero di telefono in attesa. I testi descrivono servizi e modalità di collaborazione. I lavori reali richiedono materiali del titolare.

## Arrow icons

Icone lineari Untitled UI integrate come SVG con currentColor, aria-hidden e focusable=false. Le frecce usano un riquadro fisso. La diagonale accompagna le azioni principali, le frecce strette la navigazione.

Fonte https://www.untitledui.com/free-icons

## Fotografie e card richieste

I file forniti dal titolare sono copiati senza modifica. La fascia di apertura usa hand-phone.jpg. small-business.webp presenta le piccole imprese, plant-app.webp le applicazioni, open-hand.jpg le idee su misura e restaurant-website.jpg i siti web.

Le card hanno width 100%, height auto e una larghezza massima uguale a quella nativa. open-hand.jpg resta al massimo di 320 px. La fascia di apertura ha una composizione dedicata e un testo HTML sovrapposto. Le immagini conservano eventuali testi incorporati.

Le precedenti immagini di riferimento restano nella galleria. Le illustrazioni generate in precedenza sono archiviate e non sono utilizzate nella nuova home.

## Verification

Il titolare ha scelto di procedere senza anteprima nel browser. I controlli disponibili riguardano sintassi JavaScript, destinazioni dei collegamenti, struttura HTML e logica delle interazioni eseguita in un ambiente simulato.

Il controllo statico della skill riconosce soltanto handler HTML inline e non individua addEventListener nel file condiviso. Le relative segnalazioni vengono registrate e confrontate con i binding effettivi e i controlli di interazione. Non si modifica l’architettura degli eventi per soddisfare questa limitazione del controllo.

## Fotografie e card richieste
I cinque nuovi file sono copiati senza modifica e usati nella home. Apertura orizzontale con hand-phone.jpg quadrato intero su desktop, sfondo coordinato e testo HTML sovrapposto. Su mobile la fascia mantiene il testo leggibile e il telefono sul lato destro. Le quattro card sono link con la fotografia come superficie, senza contenitore a dimensioni forzate. Larghezza massima uguale alla dimensione nativa, width 100% e height auto per il ridimensionamento responsive, senza ingrandimenti o ritagli delle card. File e proporzioni restano originali. open-hand.jpg resta al massimo 320 px. Il layout ristorante è un riferimento fornito, anche nella galleria. I testi live dei servizi possono essere aggiornati con i contenuti che il titolare fornirà.

## Direzione premium (novembre 2026)

Tema scuro predefinito (#07090e) con tema chiaro avorio (#f5f3ee) commutabile e salvato nel browser. Manrope per testi, Instrument Serif corsivo per le parole d’accento con gradiente animato, JetBrains Mono per etichette. Grana tattile, aurore sfumate, header a capsula in vetro che si nasconde scorrendo.

Animazioni: preloader alla prima visita della sessione, transizioni tra pagine, titoli che entrano parola per parola, rivelazioni sfalsate, parallasse, inclinazione 3D delle card, pulsanti magnetici, cursore personalizzato (solo mouse), marquee dei servizi, testo del manifesto che si illumina scorrendo, processo in quattro passi con indicatore. prefers-reduced-motion disattiva tutto.

Funzioni nuove: configuratore di progetto in home (tipo, pagine, funzioni, tempi, livello di struttura qualitativo, nessun prezzo) che precompila il modulo contatti con ?brief=; orologio di Roma; copia email con notifica; chiusura del lightbox cliccando fuori.

Immagini pesanti convertite in WebP (hero-devices, service-*, restaurant-website, hand-phone): da circa 7 MB a meno di 300 KB. I file originali restano nella cartella.
