/* Stirp&Radis — incolla in Code.gs del tuo Google Sheet privato.
   Esegui setup una volta, poi distribuisci come App web:
   Esegui come te / Accesso Chiunque. Conserva URL /exec e chiave.
   Backup e archivio di famiglia sono cifrati. Solo se lo attivi nell'app, le schede
   'Persone' e 'Unioni' contengono una copia leggibile (sola scrittura, mai restituita).
   Non modificare le righe a mano; ogni backup è una nuova versione.
   Versione 46: foglio leggibile ('Persone', 'Unioni') scritto dal dispositivo del proprietario.
   Versione 39: aggiunge l'archivio di famiglia condiviso (GT_Shared, GT_SharedData)
   con numero di revisione; i backup esistenti (GT_Backups) restano invariati. */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Apri Apps Script dalle Estensioni del Google Sheet.');
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty('GT_TOKEN');
  if (!token) token = (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '');
  props.setProperties({ GT_SHEET_ID: ss.getId(), GT_TOKEN: token });
  gtSheets_();
  gtShared_();
  console.log('CHIAVE STIRP&RADIS: ' + token);
  console.log('Conserva questa chiave. Dopo la distribuzione usa URL /exec.');
}
function gtSheets_() {
  var id = PropertiesService.getScriptProperties().getProperty('GT_SHEET_ID');
  if (!id) throw new Error('Esegui setup prima della distribuzione.');
  var ss = SpreadsheetApp.openById(id);
  var index = ss.getSheetByName('GT_Backups') || ss.insertSheet('GT_Backups');
  var chunks = ss.getSheetByName('GT_Payloads') || ss.insertSheet('GT_Payloads');
  if (!index.getLastRow()) {
    index.appendRow(['ID', 'Data UTC', 'Persone', 'SHA256', 'Parti']);
    index.setFrozenRows(1);
  }
  if (!chunks.getLastRow()) {
    chunks.appendRow(['ID', 'Parte', 'Backup cifrato']);
    chunks.setFrozenRows(1);
  }
  return { index: index, chunks: chunks };
}
function gtEnvelope_(payload) {
  var env;
  try { env = JSON.parse(payload); } catch (e) { env = {}; }
  if (env.format !== 'gt-aes-gcm-v1' || env.iterations !== 210000 ||
    !/^[A-Za-z0-9+/=]+$/.test(env.cipher || '') ||
    !/^[A-Za-z0-9+/=]{24}$/.test(env.salt || '') ||
    !/^[A-Za-z0-9+/=]{16}$/.test(env.iv || '')) throw new Error('Sono ammessi solo backup cifrati Stirp&Radis.');
}
/* Archivio di famiglia: GT_Shared = una riga per revisione [Rev, Data, SHA256, Parti, Op];
   GT_SharedData = frammenti cifrati. Si conservano le ultime 20 revisioni. */
function gtShared_() {
  var id = PropertiesService.getScriptProperties().getProperty('GT_SHEET_ID');
  if (!id) throw new Error('Esegui setup prima della distribuzione.');
  var ss = SpreadsheetApp.openById(id);
  var index = ss.getSheetByName('GT_Shared') || ss.insertSheet('GT_Shared');
  var chunks = ss.getSheetByName('GT_SharedData') || ss.insertSheet('GT_SharedData');
  if (!index.getLastRow()) { index.appendRow(['Rev', 'Data UTC', 'SHA256', 'Parti', 'Op']); index.setFrozenRows(1); }
  if (!chunks.getLastRow()) { chunks.appendRow(['Op', 'Parte', 'Archivio cifrato']); chunks.setFrozenRows(1); }
  return { index: index, chunks: chunks };
}
function gtSharedHead_(sheets) {
  var n = sheets.index.getLastRow();
  if (n < 2) return { rev: 0, at: '', sha: '', parts: 0, op: '' };
  var r = sheets.index.getRange(n, 1, 1, 5).getValues()[0];
  return { rev: Number(r[0]), at: String(r[1]), sha: String(r[2]), parts: Number(r[3]), op: String(r[4]) };
}
function gtSharedGet_(p) {
  var sheets = gtShared_(), head = gtSharedHead_(sheets), out = { ok: true, rev: head.rev, at: head.at, sha: head.sha, op: head.op };
  if (p.head === '1' || !head.rev) return out;
  var n = sheets.chunks.getLastRow();
  var rows = n > 1 ? sheets.chunks.getRange(2, 1, n - 1, 3).getValues() : [];
  rows = rows.filter(function (r) { return String(r[0]) === head.op; }).sort(function (a, b) { return Number(a[1]) - Number(b[1]); });
  if (rows.length !== head.parts) throw new Error('Parti dell’archivio mancanti.');
  out.payload = rows.map(function (r) { var t = String(r[2]); if (t.slice(0, 4) !== 'GT1:') throw new Error('Formato frammento non valido.'); return t.slice(4); }).join('');
  if (gtHash_(out.payload) !== head.sha) throw new Error('Archivio danneggiato.');
  return out;
}
/* Concorrenza ottimistica: si scrive solo se baseRev è ancora l'ultima revisione. */
function gtSharedPut_(p) {
  if (!/^s_[A-Za-z0-9]{8,40}$/.test(p.op || '')) throw new Error('Operazione non valida.');
  var payload = String(p.payload || ''), base = Number(p.baseRev);
  if (payload.length > 2000000 || payload.length < 100) throw new Error('Dimensione non valida.');
  if (!Number.isInteger(base) || base < 0) throw new Error('Revisione non valida.');
  gtEnvelope_(payload);
  var sha = gtHash_(payload);
  if (sha !== p.sha) throw new Error('Impronta dell’archivio errata.');
  var sheets = gtShared_(), head = gtSharedHead_(sheets);
  if (head.op === p.op) return { ok: true, rev: head.rev, op: p.op, sha: head.sha };
  if (base !== head.rev) return { ok: false, conflict: true, rev: head.rev, error: 'Archivio modificato da un altro familiare.' };
  var parts = [];
  for (var i = 0; i < payload.length; i += 40000) parts.push([p.op, parts.length, 'GT1:' + payload.slice(i, i + 40000)]);
  var start = sheets.chunks.getLastRow() + 1, required = start + parts.length - 1;
  if (sheets.chunks.getMaxRows() < required) sheets.chunks.insertRowsAfter(sheets.chunks.getMaxRows(), required - sheets.chunks.getMaxRows());
  sheets.chunks.getRange(start, 1, parts.length, 3).setNumberFormat('@').setValues(parts);
  SpreadsheetApp.flush();
  var at = new Date().toISOString(), rev = head.rev + 1;
  sheets.index.appendRow([rev, at, sha, parts.length, p.op]);
  SpreadsheetApp.flush();
  gtSharedPrune_(sheets, 20);
  return { ok: true, rev: rev, at: at, op: p.op, sha: sha };
}
function gtSharedPrune_(sheets, keep) {
  var n = sheets.index.getLastRow() - 1;
  if (n <= keep) return;
  var old = sheets.index.getRange(2, 5, n - keep, 1).getValues().map(function (r) { return String(r[0]); });
  var m = sheets.chunks.getLastRow() - 1, ops = m > 0 ? sheets.chunks.getRange(2, 1, m, 1).getValues() : [], k = 0;
  while (k < ops.length && old.indexOf(String(ops[k][0])) >= 0) k++;
  if (k > 0) sheets.chunks.deleteRows(2, k);
  sheets.index.deleteRows(2, n - keep);
}
/* Foglio leggibile: sovrascrive le schede 'Persone' e 'Unioni'. Sola scrittura: risponde solo con il numero di righe. */
var GT_READABLE = { Persone: ['ID', 'Nome', 'Cognome', 'Sesso', 'Nascita (data)', 'Nascita (luogo)', 'Morte (data)', 'Morte (luogo)', 'Padre', 'Madre', 'Partner', 'Note brevi'],
  Unioni: ['Partner 1', 'Partner 2', 'Tipo', 'Data', 'Luogo', 'Fine'] };
function gtCell_(v) {
  var t = String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').slice(0, 500);
  return /^[=+\-@]/.test(t) ? "'" + t : t;
}
function gtReadable_(p) {
  var raw = String(p.table || '');
  if (raw.length > 2000000) throw new Error('Tabella troppo grande.');
  var data; try { data = JSON.parse(raw); } catch (e) { throw new Error('Tabella non valida.'); }
  var id = PropertiesService.getScriptProperties().getProperty('GT_SHEET_ID');
  if (!id) throw new Error('Esegui setup prima della distribuzione.');
  var ss = SpreadsheetApp.openById(id), counts = {};
  Object.keys(GT_READABLE).forEach(function (name) {
    var head = GT_READABLE[name], rows = Array.isArray(data[name]) ? data[name].slice(0, 10000) : [];
    rows = rows.filter(Array.isArray).map(function (r) { var out = []; for (var j = 0; j < head.length; j++) out.push(gtCell_(r[j])); return out; });
    var sh = ss.getSheetByName(name) || ss.insertSheet(name);
    sh.clear();
    sh.getRange(1, 1, 1, 1).setValues([['Sola lettura: le modifiche qui non tornano nell\'app. Aggiornato ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC']]);
    sh.getRange(2, 1, 1, head.length).setValues([head]).setFontWeight('bold').setBackground('#e8f0ea');
    if (rows.length) sh.getRange(3, 1, rows.length, head.length).setNumberFormat('@').setValues(rows);
    sh.setFrozenRows(2);
    sh.autoResizeColumns(1, head.length);
    counts[name] = rows.length;
  });
  return { ok: true, persone: counts.Persone, unioni: counts.Unioni };
}
function gtAuth_(p) {
  var token = PropertiesService.getScriptProperties().getProperty('GT_TOKEN');
  if (!token || !p.token || p.token !== token) throw new Error('Chiave di accesso errata.');
}
function gtHash_(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8)
    .map(function (b) { return ('0' + ((b + 256) % 256).toString(16)).slice(-2); }).join('');
}
function gtRows_(sheet) {
  return sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues() : [];
}
function gtEntry_(r) {
  return { id: String(r[0]), at: String(r[1]), count: Number(r[2]), sha: String(r[3]), parts: Number(r[4]) };
}
function gtReply_(obj, callback) {
  var json = JSON.stringify(obj);
  if (callback && /^gtcb_[A-Za-z0-9]+$/.test(callback)) {
    return ContentService.createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}
function doGet(e) {
  var p = e && e.parameter || {};
  try {
    gtAuth_(p);
    if (p.action === 'caps') return gtReply_({ ok: true, caps: ['shared', 'readable'] }, p.callback);
    if (p.action === 'shared') return gtReply_(gtSharedGet_(p), p.callback);
    var sheets = gtSheets_(), rows = gtRows_(sheets.index);
    if (p.action === 'list') {
      return gtReply_({ ok: true, backups: rows.slice(-100).reverse().map(gtEntry_) }, p.callback);
    }
    if (p.action !== 'status' && p.action !== 'get') throw new Error('Operazione non valida.');
    var row = rows.find(function (r) { return String(r[0]) === p.id; });
    if (!row) {
      if (p.action === 'status') return gtReply_({ ok: true, found: false }, p.callback);
      throw new Error('Backup non trovato.');
    }
    var result = gtEntry_(row);
    result.ok = true; result.found = true;
    if (p.action === 'get') {
      var n = sheets.chunks.getLastRow();
      var chunks = n > 1 ? sheets.chunks.getRange(2, 1, n - 1, 3).getValues() : [];
      chunks = chunks.filter(function (r) { return String(r[0]) === p.id; })
        .sort(function (a, b) { return Number(a[1]) - Number(b[1]); });
      if (chunks.length !== result.parts) throw new Error('Parti del backup mancanti.');
      result.payload = chunks.map(function (r) { var text = String(r[2]); if (text.slice(0, 4) !== 'GT1:') throw new Error('Formato frammento non valido.'); return text.slice(4); }).join('');
      if (gtHash_(result.payload) !== result.sha) throw new Error('Backup danneggiato.');
    }
    return gtReply_(result, p.callback);
  } catch (err) { return gtReply_({ ok: false, error: err.message }, p.callback); }
}
function doPost(e) {
  var p = e && e.parameter || {}, lock = LockService.getScriptLock(), held = false;
  try {
    gtAuth_(p);
    if (p.action === 'sharedPut') { lock.waitLock(20000); held = true; return gtReply_(gtSharedPut_(p)); }
    if (p.action === 'readable') { lock.waitLock(20000); held = true; return gtReply_(gtReadable_(p)); }
    if (p.action !== 'save') throw new Error('Operazione non valida.');
    if (!/^b_[A-Za-z0-9]+$/.test(p.id || '')) throw new Error('ID non valido.');
    var payload = String(p.payload || ''), count = Number(p.count);
    if (payload.length > 2000000 || payload.length < 100) throw new Error('Dimensione non valida.');
    if (!Number.isInteger(count) || count < 0 || count > 10000) throw new Error('Conteggio non valido.');
    gtEnvelope_(payload);
    var sha = gtHash_(payload);
    if (sha !== p.sha) throw new Error('Impronta del backup errata.');
    lock.waitLock(20000); held = true;
    var sheets = gtSheets_(), rows = gtRows_(sheets.index);
    var existing = rows.find(function (r) { return String(r[0]) === p.id; });
    if (existing) {
      if (String(existing[3]) !== sha) throw new Error('ID già usato da un backup diverso.');
      return gtReply_({ ok: true, id: p.id, at: String(existing[1]), sha: sha });
    }
    // Rimuove solo frammenti non confermati dello STESSO tentativo.
    var n = sheets.chunks.getLastRow();
    if (n > 1) {
      var orphan = sheets.chunks.getRange(2, 1, n - 1, 1).getValues();
      for (var j = orphan.length - 1; j >= 0; j--) if (String(orphan[j][0]) === p.id) sheets.chunks.deleteRow(j + 2);
    }
    var parts = [];
    for (var i = 0; i < payload.length; i += 40000) parts.push([p.id, parts.length, 'GT1:' + payload.slice(i, i + 40000)]);
    var start = sheets.chunks.getLastRow() + 1, required = start + parts.length - 1;
    if (sheets.chunks.getMaxRows() < required) sheets.chunks.insertRowsAfter(sheets.chunks.getMaxRows(), required - sheets.chunks.getMaxRows());
    sheets.chunks.getRange(start, 1, parts.length, 3).setNumberFormat('@').setValues(parts);
    SpreadsheetApp.flush();
    var at = new Date().toISOString();
    sheets.index.appendRow([p.id, at, count, sha, parts.length]);
    SpreadsheetApp.flush();
    return gtReply_({ ok: true, id: p.id, at: at, sha: sha });
  } catch (err) { return gtReply_({ ok: false, error: err.message }); }
  finally { if (held) lock.releaseLock(); }
}
