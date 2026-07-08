/*  AMS Site Visit — Cloud collection endpoint (Google Apps Script)
    Paste this into a Google Sheet: Extensions ▸ Apps Script, then Deploy ▸ New deployment ▸ Web app.
    See CLOUD_SETUP.md for the full 6-step guide.                                              */

var SHEET_NAME  = 'Submissions';
var SHARED_CODE = '';   // optional: set a code (e.g. 'AMR2026') to restrict who can submit/collect

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) { sh = ss.insertSheet(SHEET_NAME); sh.appendRow(['Timestamp', 'Code', 'Hospital', 'JSON']); }
  return sh;
}

// Hospitals submit here (called automatically by the app's "Submit my data" button)
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || '{}');
    if (SHARED_CODE && String(body.key || '') !== SHARED_CODE) return ContentService.createTextOutput('DENIED');
    var items = Array.isArray(body.hospitals) ? body.hospitals : [body];
    var sh = sheet_(), now = new Date();
    items.forEach(function (h) { sh.appendRow([now, body.key || '', h.name || 'Unknown', JSON.stringify(h)]); });
    return ContentService.createTextOutput('OK');
  } catch (err) { return ContentService.createTextOutput('ERR: ' + err); }
}

// The AMR Unit collects everything here (called by the app's "Collect all" button, via JSONP)
function doGet(e) {
  var cb = e.parameter.callback || 'callback';
  if (SHARED_CODE && String(e.parameter.code || '') !== SHARED_CODE)
    return ContentService.createTextOutput(cb + '([])').setMimeType(ContentService.MimeType.JAVASCRIPT);
  var rows = sheet_().getDataRange().getValues(), out = [];
  for (var i = 1; i < rows.length; i++) {
    try { out.push({ ts: rows[i][0], name: rows[i][2], hospital: JSON.parse(rows[i][3]) }); } catch (err) {}
  }
  return ContentService.createTextOutput(cb + '(' + JSON.stringify(out) + ')').setMimeType(ContentService.MimeType.JAVASCRIPT);
}
