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
- **v64.2 (consigliato, stesso aggiornamento):** con il nuovo `Code.gs` l’archivio di famiglia si ripara da solo se l’ultima revisione sul foglio è danneggiata (si usa l’ultima leggibile e la si riscrive), l’ora del server corregge gli orologi sbagliati dei dispositivi nei conflitti, ogni sincronizzazione senza novità costa una sola chiamata, e i backup personali oltre i 30 più recenti vengono eliminati dal foglio. Con il `Code.gs` precedente l’app continua a funzionare come prima (senza questi vantaggi). All’uscita dall’app le modifiche partono con un solo invio: sotto i 60 KB cifrati arrivano anche se la pagina si chiude, sopra arrivano se il browser lascia qualche secondo; altrimenti partono alla prossima apertura. Le eliminazioni più vecchie di 400 giorni vengono dimenticate: un dispositivo rimasto spento più a lungo potrebbe far ricomparire una persona eliminata (basta eliminarla di nuovo).
- **v64.3:** lo stato di sincronizzazione nel browser non duplica più l’albero (circa 6 volte più piccolo: più spazio prima del limite del browser). I pulsanti piccoli dell’albero e dei pannelli hanno un’area di tocco più ampia.
- **v64.4:** gli avvisi brevi restano visibili meno a lungo (da 2,5 a 6,5 secondi secondo la lunghezza), così coprono meno la barra e gli elenchi.
- **v64.5:** nella scheda persona i parenti mostrano date ed età senza aprirli (es. «Padre · 1890–1956 · 66 anni», «n. 29/03/1954 · 72 anni»); ogni unione è legata al partner in una riga sola («Matrimonio · 26/09/1987 · luogo»); «Dati tecnici» è più discreto.
- **v64.6:** nelle righe dei parenti la data di nascita compare senza «n.»; se le date non sono complete l’età è la semplice differenza degli anni con «~» (es. «1888–1947 · ~59 anni»). Le età esatte e quelle indicate nel GEDCOM restano invariate, come l’età nella scheda.
- **v64.7:** anche il pannello della persona selezionata usa la stessa riga breve (anni senza «n.», «~N anni» se le date non sono complete).
- **v64.8:** stessa regola ovunque: età non esatta come «~N anni» (semplice differenza degli anni) in Informazioni (senza «(dalle date)»), schede dell’lbero, elenco Persone, ruota, stampa, foglio leggibile e statistiche; date approssimative con «~» invece di «≈». Età da date intere ed età indicata nel GEDCOM invariate. Code.gs non cambia: la colonna Età del foglio leggibile è calcolata dall’pp.
- **v65:** modulo persona più pulito: una sola data di nascita (con «Data non esatta?» accanto), campi di morte solo se deceduto/a, luogo di morte dietro «+ Luogo di morte», data di sepoltura mostrata solo se già presente (mai persa nei dati, nel backup o nel GEDCOM). Il modulo si apre sempre nello stesso posto (pannello a destra sul computer, foglio dal basso sul telefono) e con gli stessi campi da ogni punto di ingresso, anche quando crei una persona dentro il modulo. Colore delle schede sempre legato al sesso (anche con «f»/«female» da file vecchi; i rami evidenziati usano solo una striscia laterale). Ramo compresso: i discendenti spariscono del tutto e sulla scheda resta «+N» per riaprirlo.
- **v65.1:** in Persone una riga di inserimento rapido fissa in alto (Nome, Cognome, Sesso, Nascita, Morte, Padre, Madre, Coniuge/Partner; date anche approssimate; scelta dall’elenco con anni di vita o «+ Crea», mai collegamenti automatici per nome; Invio salva, Esc pulisce; su telefono «+ Aggiungi persona»); toccare una riga apre il modulo. Una sola barra in alto per Albero, Ruota, Ceppi, Persone e Duplicati: stessa posizione e stessi spazi, con Vista/Riallinea/Stampa che in Persone diventano Filtri (in vita/deceduti, colonne), Ordina e Esporta (CSV, stampa elenco). Schede dell’albero pulite: solo icone informative e la matita «Modifica scheda»; le azioni di parentela (genitore, partner, figlio, fratello, collega esistente, mostra parenti, elimina) sono nella riga «Parentele» della scheda persona, che si apre anche con una pressione lunga.
- **v65.2:** eliminare una persona chiede sempre due conferme: prima «Eliminare Nome Cognome?» con il riepilogo dei legami che verranno staccati (genitori, figli, unioni; nessun altro viene eliminato), poi una «Conferma definitiva» ben distinta, con Annulla già selezionato (Esc o un clic fuori annullano). Vale per il cestino discreto in fondo a ogni riga di Persone (visibile al passaggio del mouse su computer, sempre su telefono) e per Parentele › Elimina nella scheda; anche «Elimina legame errato» chiede due conferme.
- **v66:** schede dell’albero ridisegnate: sfondo per sesso con un tono appena diverso per secolo di nascita; cerchio con le iniziali colorato per ramo di cognome (grigio se il ramo non è nell’albero); una riga «Luogo · mestiere»; al massimo 3 distintivi (consanguineità, unioni, figli, capostipite, longevo 90+, emigrato solo se i paesi di nascita e morte sono scritti e diversi); al posto delle righe Nascita/Morte una barra della vita su una scala comune (dal decennio della nascita più antica a oggi, tacche 1915–18 e 1940–45, anni agli estremi ed età, «~» = circa; in vita sfuma a oggi, da deceduto finisce con un punto, tratteggio se la data è incerta; date complete nel suggerimento). Deceduti: scheda un po’ desaturata con nastrino, niente angolo nero. Selezione: linee verso genitori, figli e unione in verde, gli altri leggermente attenuati, nessuno spostamento; Esc la toglie. Zoom semantico: da lontano solo cerchio, nome e barra; a zoom medio tutto; da vicino anche le tacche delle guerre. Valori derivati solo a schermo: dati, backup e GEDCOM invariati.
- **v66.1:** «Come leggere le schede» (dal pannello Vista e dalla Guida): una scheda d’esempio di una persona inventata, disegnata dal vero motore delle schede e ingrandita (segue il tema chiaro/scuro), con richiami numerati e spiegazioni brevi: colore del cerchio = ramo, luogo · mestiere, nastrino = deceduto, sfondo = sesso e secolo, distintivi (con l’elenco di tutte le icone, consanguineità inclusa), matita = modifica, barra della vita con scala comune e tacche delle guerre, anni ed età («~» = circa), fine della barra in vita/deceduto/data incerta, e i colori dei rami dell’albero aperto con «altri cognomi». Su telefono i richiami restano ai lati e le spiegazioni diventano un elenco numerato sotto la scheda; «‹ Indietro» torna da dove l’hai aperta, Esc chiude.
- **v66.2:** legenda più chiara. Tolte le tacche delle guerre (1915–18, 1940–45) da schede, legenda e Guida. La scala comune è spiegata con i numeri veri dell’albero aperto (dal decennio della nascita più antica a oggi), con un piccolo asse sotto la barra d’esempio. Elenco completo delle 22 icone di schede, scheda persona, elenco e ruota: ognuna con nome, descrizione e dove compare.
- **v66.3:** barra della vita più leggibile: l’età sta sopra la fine della barra (sul punto per i deceduti, su «oggi» per chi è in vita), centrata ma sempre dentro la scheda; sotto solo gli anni («1932» e «2011» o «oggi»), uniti in «1932–2011» quando la barra è troppo corta. Età sconosciuta → nessuna etichetta. Da lontano resta solo il numero dell’età sopra la fine. Legenda aggiornata.

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
