# Stirp&Radis

*Origini connesse.*  
*Dai radis ai rami di domani.*

Albero genealogico personale in **un solo file HTML**: niente server, niente account, i dati restano nel tuo browser.

## Come si usa
- **Da file locale:** scarica `index.html` e aprilo con doppio clic (Linux, Windows, macOS, telefono). Funziona tutto offline.
- **Online come app (PWA):** apri la pagina pubblicata (es. GitHub Pages) e scegli “Installa app” / “Aggiungi a schermata Home”. Il service worker (`sw.js`) la rende disponibile anche senza rete. Su `file://` la parte PWA si disattiva da sola.

## Funzioni principali
- Albero e vista a ruota, elenco persone, unioni (matrimoni, convivenze, divorzi), adozioni, fratellastri.
- Date esatte o approssimative (“circa 1890”, “tra 1921 e 1923”), sepoltura, data e luogo delle unioni.
- **Importa GEDCOM** (MyHeritage, Ancestry, FamilySearch…) con unione intelligente (ID `_UID`, nome e data di nascita) ed **esporta GEDCOM 5.5.1 UTF-8** per MyHeritage.
- **Trova duplicati** (nomi senza accenti, piccoli refusi, date, genitori) e unione guidata delle schede.
- Backup JSON, ripristino, “Elimina tutte le persone” con tre conferme e copia automatica.
- Backup facoltativo **cifrato** su un tuo Google Sheet (AES‑GCM 256, password mai inviata). Il codice Apps Script è in `Code.gs` e dentro l’app (Impostazioni › Google).

## Colori
Verde bosco come colore principale, sabbia come secondario. Nell’albero e nella ruota i rami hanno gli stessi colori: azzurro e verde per il lato paterno, sabbia e rosa per quello materno, rispetto alla “Persona al centro”.

## Dove sono i dati
Nel `localStorage` del browser che usi (chiave `gt-v22`, compatibile con le versioni precedenti). Ogni browser/dispositivo ha i suoi dati: usa il backup JSON o Google per spostarli.

## File
| File | A cosa serve |
|---|---|
| `index.html` | L’app completa (unico file indispensabile) |
| `sw.js` | Facoltativo: funzionamento offline quando pubblicata su https |
| `Code.gs` | Facoltativo: codice per il backup su Google Sheet |
| `sample-myheritage.ged` | Albero di prova **fittizio** in formato GEDCOM |
| `icons/logo.svg` | Logo: “&” tinta unita verde bosco (germogli compresi), radici staccate color sabbia |
| `icons/logo-small.svg` | Stessa forma, riquadro quadrato per favicon (le icone PWA sono già incluse in `index.html`) |
| `icons/logo-mono.svg` | Versione monocromatica nera |

## Pubblicare con GitHub Pages
Settings › Pages › Source: *Deploy from a branch* › `main` / `(root)`. Dopo un minuto l’app è su `https://<utente>.github.io/stirp-radis/`.
