# Stirp&Radis

*Origini connesse.*  
*Dai radis ai rami di domani.*

Albero genealogico personale in **un solo file HTML**: niente server, niente account, i dati restano nel tuo browser.

## Come si usa
- **Da file locale:** scarica `index.html` e aprilo con doppio clic (Linux, Windows, macOS, telefono). Funziona tutto offline.
- **Come app installata (PWA):** apri **https://teo2810.github.io/stirp-radis/** e usa Impostazioni › *Installa come app* (Chrome/Edge/Android), oppure il menu del browser › “Installa app”. Su iPhone/iPad: Safari › Condividi › *Aggiungi alla schermata Home*.
- **Perché da file non si installa:** una pagina aperta da disco (`file://`) non può mai diventare un'app installata: è una regola dei browser (serve https + manifest + service worker). Il file locale funziona comunque offline. I dati del file locale e dell'app installata sono separati: spostali con *Scarica backup JSON* / *Carica backup JSON*.

## Navigazione
Albero · Persone (Elenco · Duplicati · Cognomi · Unioni) · ＋ Nuova · Impostazioni: barra in basso su telefono, barra laterale comprimibile su computer. Tema Sole / Luna / Sistema dalla barra laterale (su telefono: pulsante sul grafico).

## Funzioni principali
- **Storia del cognome** (Persone › Cognomi): chi lo porta, antenato più antico, trasmissione per generazioni, nascite per decennio e luogo, evidenziazione nell’albero.
- Albero e vista a ruota, elenco persone, unioni (matrimoni, convivenze, divorzi), adozioni, fratellastri.
- Date esatte o approssimative (“circa 1890”, “tra 1921 e 1923”), sepoltura, data e luogo delle unioni.
- **Importa GEDCOM** (MyHeritage, Ancestry, FamilySearch…) con unione intelligente (ID `_UID`, nome e data di nascita) ed **esporta GEDCOM 5.5.1 UTF-8** per MyHeritage.
- **Trova duplicati** (nomi senza accenti, piccoli refusi, date, genitori) e unione guidata delle schede.
- Backup JSON, ripristino, “Elimina tutte le persone” con tre conferme e copia automatica.
- **Alberi grandi**: pulsante *Vista* sull’albero — *Attorno a una persona* (antenati/discendenti regolabili, “+” per espandere), ramo *Paterno/Materno*, filtro per *Cognome*; la freccia sotto una scheda comprime il ramo in una sola scheda “Cognome · N persone”. Le scelte restano salvate.
- **Famiglia condivisa**: un archivio cifrato comune sul Google Drive di chi lo crea, compilato insieme ai parenti (vedi sotto).
- Backup facoltativo **cifrato** su un tuo Google Sheet (AES‑GCM 256, password mai inviata). Il codice Apps Script è in `Code.gs` e dentro l’app (Impostazioni › Dati › *Backup personale su Google*). Dalla v64 il foglio leggibile ha anche la colonna **Età** (calcolata dalle date): per averla incolla il nuovo `Code.gs` e pubblica una *Nuova versione* del deployment; senza aggiornare tutto continua a funzionare, la colonna semplicemente non compare.

## Colori
Un solo verde (#338259) e una sola sabbia (#a87b3e) in entrambi i temi. Nell’albero e nella ruota i rami hanno gli stessi colori: azzurro e verde per il lato paterno, sabbia e rosa per quello materno, rispetto alla “Persona al centro”.

## Dove sono i dati
Nel `localStorage` del browser che usi (chiave `gt-v22`, compatibile con le versioni precedenti). Ogni browser/dispositivo ha i suoi dati: usa il backup JSON o Google per spostarli.

## File
| File | A cosa serve |
|---|---|
| `index.html` | L’app completa (unico file indispensabile) |
| `sw.js` | Service worker: offline e installazione quando pubblicata su https |
| `manifest.webmanifest` | Manifest dell'app installabile (nome, colori, icone) |
| `icons/icon.svg`, `icons/icon-maskable.svg` | Icone dell'app installata (anche in PNG dentro il manifest) |
| `Code.gs` | Facoltativo: codice Apps Script per backup e archivio di famiglia |
| `icons/logo.svg` | Logo: “&” verde #338259 (germogli compresi), radici staccate sabbia #a87b3e, stessi colori in tema chiaro e scuro |
| `icons/logo-small.svg` | Stessa forma, riquadro quadrato per favicon  |
| `icons/logo-mono.svg` | Versione monocromatica nera |

## Famiglia condivisa (archivio comune)
Un solo archivio **cifrato end‑to‑end** (PBKDF2 + AES‑GCM 256) sul foglio Google di chi lo crea; Google vede solo dati illeggibili.

**Chi crea l’archivio (una volta):**
1. Prepara il foglio come per il backup (Impostazioni › Dati › *Backup personale su Google* › guida) oppure usa quello che hai già.
2. In Apps Script incolla il nuovo `Code.gs` e salva. Non serve rieseguire `setup`: le schede `GT_Shared` e `GT_SharedData` si creano da sole.
3. **Esegui il deployment › Gestisci deployment** › matita › **Versione: Nuova versione** › *Esegui come: me* › *Chi può accedere: Chiunque* › **Esegui il deployment**. L’URL `/exec` non cambia.
4. Nell’app: Impostazioni › Famiglia › **Albero di famiglia condiviso**: URL, chiave, il tuo nome e una **password di famiglia** (almeno 12 caratteri) › **Collega**.
5. **Condividi con la famiglia**: link o QR. Il link contiene solo URL e chiave dopo il `#` (non arriva a nessun server); **la password va data a parte**.

**I parenti:** aprono il link, scrivono il proprio nome e la password, premono **Collega**.

**Come si sincronizza:** all’apertura, pochi secondi dopo ogni modifica e con **Sincronizza ora**. Le modifiche si fondono persona per persona (ID stabile, esportato come `_UID`); se due persone cambiano lo stesso dato vince l’ultima e il caso compare in **Modifiche in conflitto**. Le eliminazioni restano come “lapidi”, così non ricompaiono. L’invio usa un numero di revisione: se qualcuno ha scritto nel frattempo, l’app riscarica, fonde e riprova. Offline si continua a lavorare: si sincronizza al ritorno della rete.

I backup personali (`GT_Backups`) restano separati e compatibili.

## Primo avvio e invito per i parenti
Con l’albero vuoto l’app mostra un benvenuto con tre scelte: **Entra nell’albero di famiglia** (incolla il link d’invito o inquadra il QR), **Importa un file GEDCOM/JSON**, **Inizia da zero**, più un breve “Come funziona”.
Chi apre un **link d’invito** va dritto alla schermata di ingresso: scrive solo il proprio nome e la password di famiglia, tocca *Entra* e vede subito l’albero. Ai parenti non serve configurare alcun backup.
Impostazioni è divisa in **Famiglia**, **Dati** (importa, esporta, copie, backup personale), **Strumenti** (duplicati, cognomi, esempio) e **App** (benvenuto, guida, installa, versione).

## Pubblicare con GitHub Pages
Settings › Pages › Source: *Deploy from a branch* › `main` / `(root)`. Dopo un minuto l’app è su `https://<utente>.github.io/stirp-radis/`.

## Struttura del codice (per chi contribuisce)
Tutto è in `index.html`, un solo file che deve funzionare anche da `file://`. Dentro, nell'ordine:
- **`<style>`** — token del design system (`:root`: spaziature `--sp-*`, raggi `--r-*`, testo `--fs-*`, colori, ombre, durate) → base → componenti → viste (albero, Persone, Impostazioni) → struttura (barra laterale, barra mobile, colonna destra) → scheda persona.
- **`<script>`** — un'unica funzione `'use strict'`, divisa in sezioni con intestazioni `// ===== … =====`: stato e salvataggio (`localStorage` `gt-v22`, sempre compatibile con i backup precedenti) · modello (persone, unioni, duplicati) · impaginazione dell'albero · disegno (`render`, `drawEdges` + `routeEdgeLanes`) · componenti (dialoghi dell'app, tooltip, scheda) · import/export GEDCOM e JSON · Google (backup cifrato) · PWA.
- Verso l'esterno c'è un solo oggetto globale, `window.SR`: contiene le funzioni chiamate dall'HTML (`onclick="SR.go('tree')"`) e `SR.__gt` per i test. Ogni funzione ha una sola implementazione (niente funzioni riavvolte da fuori).

Regole: niente `alert/confirm/prompt` nativi (usa `appConfirm`), solo valori dei token nel CSS e nei colori JS (`tok('--nome')`), commenti in italiano, nessun dato reale nel repository (solo esempi fittizi).
