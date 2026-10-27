# Stirp&Radis

*Origini connesse.*  
*Dai radis ai rami di domani.*

Albero genealogico in **un solo file HTML**. Niente server e niente account: i dati restano nel browser che usi e l’app funziona anche offline. Se vuoi, puoi salvare l’albero cifrato su un tuo Foglio Google e compilarlo insieme ai parenti.

## Tre modi per usarla
1. **Dal sito:** apri **https://teo2810.github.io/stirp-radis/**. Per averla come app: Impostazioni › *Installa come app* (Chrome, Edge, Android); su iPhone e iPad: Safari › Condividi › *Aggiungi alla schermata Home*. Il sito non riceve i tuoi dati: restano nel tuo browser.
2. **Dal tuo GitHub Pages:** fai un *Fork* di questo repository, poi nel fork *Settings › Pages › Source: Deploy from a branch* › `main` / `(root)` › *Save*. Dopo un minuto l’app è su `https://<tuo-utente>.github.io/stirp-radis/`. Link di invito e installazione usano da soli il tuo indirizzo.
3. **Come file:** scarica `index.html` e aprilo con un doppio clic (computer o telefono). Funziona tutto offline, ma un file aperto dal disco non si può installare come app (è una regola dei browser). I link di invito creati da qui portano al sito del punto 1; per farli portare al tuo sito: Impostazioni › *Impostazioni avanzate* › App › *Indirizzo dell’app negli inviti*.

Ogni browser e ogni dispositivo ha i suoi dati. Per spostarli usa Impostazioni › *Importa / esporta file* (copia JSON) oppure il tuo archivio Google.

## Primo avvio
Con l’albero vuoto compare il benvenuto: **Entra nell’albero di famiglia** (link d’invito o QR), **Importa un file** (GEDCOM da MyHeritage, Ancestry… o una copia JSON), **Inizia da zero**, **Prova con l’esempio** (33 persone inventate: una fascia in alto dice «Stai guardando l’esempio» e **Esci** riporta esattamente il tuo albero; le modifiche all’esempio restano a parte). Lo ritrovi in Impostazioni › *Impostazioni avanzate* › App › *Schermata di benvenuto*.

## Il tuo archivio Google (facoltativo)
Serve per due cose: copie di sicurezza **cifrate** e l’**albero di famiglia condiviso**. Lo prepara una sola persona per famiglia, una volta; i parenti invitati non devono fare nulla di tutto questo. Il foglio resta privato e Google vede solo dati cifrati.

1. Apri [Google Sheets](https://sheets.google.com) e crea un foglio vuoto (per esempio *Stirp&Radis — Backup*).
2. Nel foglio apri **Estensioni › Apps Script**.
3. Cancella il contenuto di `Code.gs` e incolla il codice di [`Code.gs`](Code.gs) (lo stesso che copi dall’app con Impostazioni › *Impostazioni avanzate* › *Copia codice Apps Script*). Salva.
4. Nell’elenco delle funzioni scegli **setup** e premi **Esegui**. Autorizza il progetto quando Google lo chiede.
5. Nel **Registro di esecuzione** copia il valore dopo **CHIAVE STIRP&RADIS:**. È la chiave del tuo archivio: conservala.
6. **Esegui il deployment › Nuovo deployment**, tipo **App web**. *Esegui come:* **me**. *Chi può accedere:* **Chiunque**. Premi **Esegui il deployment** e copia l’URL dell’app web, quello che termina con **/exec**. Si pubblica il servizio, non il foglio: senza la chiave non risponde, e i dati sono cifrati.
7. Nell’app:
   - **per condividere con la famiglia:** Impostazioni › *Condividi il mio albero*. Incolla URL `/exec` e chiave, scrivi il tuo nome, scegli una **password di famiglia** (almeno 12 caratteri) e premi **Condividi**. Manda ai parenti il link o il QR; **la password dalla a parte**.
   - **per le copie personali:** Impostazioni › *Impostazioni avanzate* › *Backup personale su Google* › *Collegamento e password*: URL, chiave e una password tua (almeno 12 caratteri). Poi *Verifica connessione* e *Salva su Google*.

**Quando esce un nuovo `Code.gs`:** in Apps Script sostituisci il contenuto di `Code.gs` e salva, poi **Esegui il deployment › Gestisci deployment** › matita › **Versione: Nuova versione** › **Esegui il deployment**. L’URL `/exec` e la chiave non cambiano e non serve rieseguire *setup*. Con il `Code.gs` precedente l’app continua a funzionare.

## Famiglia condivisa: come funziona
- **I parenti** aprono il link d’invito, scrivono il proprio nome e la password di famiglia e premono *Entra*.
- Il link contiene solo l’indirizzo dell’archivio e la chiave, dopo il `#`: non passa da nessun server. La password non è mai nel link.
- Le modifiche si sincronizzano all’apertura, pochi secondi dopo ogni cambiamento e con *Sincronizza ora*. Si fondono persona per persona; se due persone cambiano lo stesso dato vince l’ultima e il caso compare in *Modifiche in conflitto*.
- Cifratura end‑to‑end (PBKDF2 + AES‑GCM 256) sul dispositivo. Le copie personali (`GT_Backups`) restano separate.

## Funzioni principali
- Albero, Ruota, Ceppi; Persone (Elenco, Duplicati, Cognomi, Unioni); *Cerca una persona* (lente in alto, «/» o Ctrl+F).
- Unioni (matrimoni, convivenze, divorzi), adozioni, fratellastri; date esatte o approssimative («circa 1890», «tra 1921 e 1923»); età solo a schermo, «~N anni» se la data non è esatta.
- Importa GEDCOM con unione intelligente (ID `_UID`, nome e data di nascita); esporta GEDCOM 5.5.1 UTF-8 e JSON.
- Trova duplicati e unione guidata; *Storia del cognome*; alberi grandi con il pannello *Vista* e i rami compressi.
- Tema chiaro, scuro o di sistema. Stampa dell’albero e dell’elenco.

## Dove sono i dati
Nel `localStorage` del browser (chiave `gt-v22`, compatibile con le versioni precedenti e con tutti i backup JSON).

## File
| File | A cosa serve |
|---|---|
| `index.html` | L’app completa (l’unico file indispensabile) |
| `sw.js` | Service worker: offline e installazione quando è pubblicata su https |
| `manifest.webmanifest` | Manifest dell’app installabile (nome, colori, icone) |
| `icons/` | Icone dell’app e logo (`logo.svg`, `logo-small.svg`, `logo-mono.svg`) |
| `Code.gs` | Facoltativo: codice Apps Script per l’archivio Google |
| `CHANGELOG.md` | Le novità di ogni versione |

## Struttura del codice (per chi contribuisce)
Tutto è in `index.html`, che deve funzionare anche da `file://` e senza dipendenze esterne:
- **`<style>`**: in testa un indice di 24 sezioni, una per componente (token del design system in `:root`, base, avvio, albero, ruota, ceppi, elenco, condivisione, scheda persona, struttura, … stampa, animazioni), poi i «Ritocchi in cascata». Le nuove regole vanno nella sezione del componente. Un secondo `<style id="printCss">` contiene la stampa.
- **`<script>`**: un’unica funzione `'use strict'` divisa in 41 moduli con intestazioni `/* ===== JS N. … ===== */`; l’elenco è nell’«INDICE DEL CODICE» all’inizio dello script (stato, date ed età, dati e salvataggio `gt-v22`, disposizione e disegno dell’albero, schede, Google, GEDCOM, PWA, famiglia collegata, benvenuto…).
- **`<script type="text/plain" id="gas-template">`**: la copia di `Code.gs` che l’app offre con *Copia codice Apps Script*.
- Verso l’esterno c’è un solo oggetto globale, `window.SR`: le funzioni chiamate dall’HTML (`onclick="SR.go('tree')"`) e `SR.__gt` per i test.

Regole: niente `alert/confirm/prompt` nativi (si usa il dialogo dell’app), solo valori dei token nel CSS e nei colori, commenti in italiano, nessun dato reale nel repository (solo esempi inventati).

## Colori
Un solo verde (#338259) e una sola sabbia (#a87b3e) in entrambi i temi. Nell’albero e nella ruota i rami hanno gli stessi colori: azzurro e verde per il lato paterno, sabbia e rosa per quello materno, rispetto alla «Persona al centro».

## Versioni
Le novità di ogni versione sono in [CHANGELOG.md](CHANGELOG.md).
