/**
 * 卿鬆翻一頁 — 電子報訂閱名單（Apps Script 網頁應用程式）
 *
 * GET  → 顯示提示頁（給部落格 iframe 預載，也方便直接開）
 * POST → 接收部落格表單，寫入「訂閱名單」工作表，回傳結果頁
 *
 * 部落格端是「零 JS」設計：純 HTML <form> + iframe，
 * 所以這裡一定要回傳 HTML（不是 JSON），結果才會顯示在 iframe 裡。
 */

var SHEET_NAME = '訂閱名單';
var HEADERS = ['訂閱時間', 'Email', '來源期數', '來源頁面', '狀態'];

var C = {
  text: '#3D2C1A',
  sub: '#7A6B5A',
  main: '#2A6F6F',
  okBg: '#F0F8F8',
  errBg: '#FDF2F2',
  errText: '#B4453C'
};

/** 取得（必要時建立）訂閱名單工作表 */
function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);

  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.setColumnWidth(1, 150);
    sh.setColumnWidth(2, 260);
    sh.setColumnWidth(4, 240);
    sh.getRange(2, 1, sh.getMaxRows() - 1, 1).setNumberFormat('yyyy/mm/dd hh:mm:ss');
  }
  return sh;
}

function normalizeEmail_(v) {
  return String(v || '').trim().toLowerCase();
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/** 用 Email 去重（不分大小寫） */
function alreadySubscribed_(sh, email) {
  var last = sh.getLastRow();
  if (last < 2) return false;
  var values = sh.getRange(2, 2, last - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (normalizeEmail_(values[i][0]) === email) return true;
  }
  return false;
}

function doPost(e) {
  var p = (e && e.parameter) || {};
  var email = normalizeEmail_(p.email);
  var vol = String(p.vol || '').replace(/[^\w\-\.]/g, '').slice(0, 20);
  var src = String(p.src || '').slice(0, 200);

  if (!email) return page_('還沒填 Email', '把 Email 填進去，再按一次訂閱就好。', 'error');
  if (!isValidEmail_(email)) return page_('Email 格式怪怪的', '看起來不像有效的 Email，回上一頁確認一下。', 'error');

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return page_('系統忙碌中', '請 30 秒後再按一次訂閱。', 'error');
  }

  try {
    var sh = getSheet_();
    if (alreadySubscribed_(sh, email)) {
      return page_('你已經在名單裡了', email + ' 之前就訂閱過，不用再按一次。', 'ok');
    }
    sh.appendRow([new Date(), email, vol, src, '有效']);
    return page_('訂閱成功，謝謝你', '下一期出刊，會寄到 ' + email + '。', 'ok');
  } catch (err) {
    console.error(err);
    return page_('暫時存不進去', '請稍後再試，或直接回信給卿鬆。', 'error');
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var embed = !!(e && e.parameter && String(e.parameter.embed) === '1');
  if (embed) return page_('', '送出後，訂閱結果會顯示在這裡。', 'hint');
  return page_('訂閱電子報', '填好 Email 按「訂閱」，結果會顯示在這裡。', 'hint');
}

/** 產生結果頁；zero-JS 模式下，這頁會顯示在部落格的 iframe 裡 */
function page_(title, msg, kind) {
  var bg = kind === 'ok' ? C.okBg : (kind === 'error' ? C.errBg : '#FFFCF8');
  var titleColor = kind === 'error' ? C.errText : C.main;
  var icon = kind === 'ok' ? '✅ ' : (kind === 'error' ? '⚠️ ' : '📮 ');

  var html =
    '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<style>' +
    'html,body{margin:0;padding:0;background:transparent;}' +
    'body{font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",Arial,sans-serif;}' +
    '.box{box-sizing:border-box;padding:14px 16px;border-radius:10px;background:' + bg + ';}' +
    '.t{margin:0 0 3px;font-size:15px;font-weight:700;color:' + titleColor + ';line-height:1.5;}' +
    '.m{margin:0;font-size:13px;color:' + C.sub + ';line-height:1.7;word-break:break-all;}' +
    '</style></head><body>' +
    '<div class="box">' +
    (title ? '<p class="t">' + icon + esc_(title) + '</p>' : '') +
    '<p class="m">' + esc_(msg) + '</p></div>' +
    '</body></html>';

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle('卿鬆翻一頁 — 訂閱');
}

function esc_(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** 第一次手動執行可建立工作表與表頭 */
function setup() {
  return getSheet_().getName();
}
