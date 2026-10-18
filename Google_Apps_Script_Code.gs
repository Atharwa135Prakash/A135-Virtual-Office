/**
 * A135 Virtual Office — Google Form response → master database copier.
 * Install an installable "On form submit" trigger on the response spreadsheet.
 * Configure MASTER_SPREADSHEET_ID and MASTER_TAB below before running setupOffice().
 */
const MASTER_SPREADSHEET_ID = 'PASTE_MASTER_SPREADSHEET_ID_HERE';
const MASTER_TAB = 'A135_MASTER_DATABASE';
const SOURCE_LABEL = 'Google Form Responses';

function setupOffice() {
  if (MASTER_SPREADSHEET_ID.indexOf('PASTE_') === 0) {
    throw new Error('Set MASTER_SPREADSHEET_ID in Code.gs first.');
  }
  const master = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
  let sheet = master.getSheetByName(MASTER_TAB);
  if (!sheet) sheet = master.insertSheet(MASTER_TAB);
  const headers = ['Master ID', 'Received At', 'Source Spreadsheet ID', 'Source Sheet', 'Source Row', 'Form Data JSON'];
  if (sheet.getLastRow() === 0) sheet.appendRow(headers);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
  Logger.log('Master database ready: ' + master.getUrl());
}

/**
 * Trigger event handler. Add an installable trigger:
 * function = onFormSubmit
 * event source = From spreadsheet
 * event type = On form submit
 *
 * Best installed in the response spreadsheet's Apps Script project.
 * Set SOURCE_SPREADSHEET_ID to the spreadsheet containing form responses.
 */
function onFormSubmit(e) {
  if (!e || !e.range) throw new Error('No form-submit event found. Do not run this handler manually.');
  if (MASTER_SPREADSHEET_ID.indexOf('PASTE_') === 0) throw new Error('Set MASTER_SPREADSHEET_ID first.');

  const sourceSheet = e.range.getSheet();
  const sourceSpreadsheet = sourceSheet.getParent();
  const rowNumber = e.range.getRow();
  const lastColumn = sourceSheet.getLastColumn();
  const headers = sourceSheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];
  const values = sourceSheet.getRange(rowNumber, 1, 1, lastColumn).getDisplayValues()[0];
  const data = {};
  headers.forEach((h, i) => { data[h || ('Column ' + (i + 1))] = values[i]; });

  const master = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
  let target = master.getSheetByName(MASTER_TAB);
  if (!target) {
    target = master.insertSheet(MASTER_TAB);
    target.appendRow(['Master ID', 'Received At', 'Source Spreadsheet ID', 'Source Sheet', 'Source Row', 'Form Data JSON']);
    target.setFrozenRows(1);
  }

  // Idempotency: skip a source row already copied.
  const sourceKey = sourceSpreadsheet.getId() + '|' + sourceSheet.getSheetId() + '|' + rowNumber;
  const last = target.getLastRow();
  if (last > 1) {
    const existing = target.getRange(2, 3, last - 1, 3).getDisplayValues();
    if (existing.some(r => r[0] + '|' + r[1] + '|' + r[2] === sourceKey)) return;
  }

  const masterId = 'A135-' + Utilities.getUuid().slice(0, 8).toUpperCase();
  target.appendRow([
    masterId,
    new Date(),
    sourceSpreadsheet.getId(),
    sourceSheet.getName(),
    rowNumber,
    JSON.stringify(data)
  ]);
}

/** Utility: run manually to print the master spreadsheet URL in the execution log. */
function showMasterUrl() {
  if (MASTER_SPREADSHEET_ID.indexOf('PASTE_') === 0) throw new Error('Set MASTER_SPREADSHEET_ID first.');
  Logger.log(SpreadsheetApp.openById(MASTER_SPREADSHEET_ID).getUrl());
}
