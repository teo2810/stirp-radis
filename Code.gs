/* Stirp&Radis — incolla in Code.gs del tuo Google Sheet privato.
   Esegui setup una volta, poi distribuisci come App web:
   Esegui come te / Accesso Chiunque. Conserva URL /exec e chiave.
   Il foglio contiene SOLO backup cifrati, non nomi in chiaro.
   Non modificare le righe a mano; ogni backup è una nuova versione. */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Apri Apps Script dalle Estensioni del Google Sheet.');
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty('GT_TOKEN');
  if (!token) token = (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '');
  props.setProperties({ GT_SHEET_ID: ss.getId(), GT_TOKEN: token });
  gtSheets_();
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
    if (p.action !== 'save') throw new Error('Operazione non valida.');
    if (!/^b_[A-Za-z0-9]+$/.test(p.id || '')) throw new Error('ID non valido.');
    var payload = String(p.payload || ''), count = Number(p.count);
    if (payload.length > 2000000 || payload.length < 100) throw new Error('Dimensione non valida.');
    if (!Number.isInteger(count) || count < 0 || count > 10000) throw new Error('Conteggio non valido.');
    var env = JSON.parse(payload);
    if (env.format !== 'gt-aes-gcm-v1' || env.iterations !== 210000 ||
      !/^[A-Za-z0-9+/=]+$/.test(env.cipher || '') ||
      !/^[A-Za-z0-9+/=]{24}$/.test(env.salt || '') ||
      !/^[A-Za-z0-9+/=]{16}$/.test(env.iv || '')) throw new Error('Sono ammessi solo backup cifrati Stirp&Radis.');
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
