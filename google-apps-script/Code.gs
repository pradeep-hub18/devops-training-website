const SHEET_NAME = "Leads";
const REQUIRED_HEADERS = [
  "Timestamp",
  "Name",
  "Phone",
  "Email",
  "Experience",
  "Message",
  "Source",
  "Course",
  "Page URL",
];

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const sheet = getLeadSheet_();

    sheet.appendRow([
      new Date(),
      safeCell_(payload.name),
      safeCell_(payload.phone),
      safeCell_(payload.email),
      safeCell_(payload.experience),
      safeCell_(payload.message),
      safeCell_(payload.source),
      safeCell_(payload.courseName),
      safeCell_(payload.pageUrl),
    ]);

    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: error.message });
  }
}

function doGet(e) {
  const params = e.parameter || {};
  const callback = sanitizeCallback_(params.callback || "");

  try {
    if (params.action !== "list") {
      throw new Error("Unsupported action.");
    }

    verifyAdminToken_(params.token || "");
    const leads = listLeads_();
    return jsonp_(callback, { ok: true, leads: leads });
  } catch (error) {
    return jsonp_(callback, { ok: false, error: error.message });
  }
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("Missing request body.");
  }

  return JSON.parse(e.postData.contents);
}

function getLeadSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  const headerRange = sheet.getRange(1, 1, 1, REQUIRED_HEADERS.length);
  const currentHeaders = headerRange.getValues()[0];
  const needsHeaders = REQUIRED_HEADERS.some(function (header, index) {
    return currentHeaders[index] !== header;
  });

  if (needsHeaders) {
    headerRange.setValues([REQUIRED_HEADERS]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function listLeads_() {
  const sheet = getLeadSheet_();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return [];
  }

  const rows = sheet.getRange(2, 1, lastRow - 1, REQUIRED_HEADERS.length).getValues();

  return rows
    .reverse()
    .map(function (row) {
      return {
        timestamp: formatDate_(row[0]),
        name: row[1],
        phone: row[2],
        email: row[3],
        experience: row[4],
        message: row[5],
        source: row[6],
        courseName: row[7],
        pageUrl: row[8],
      };
    });
}

function verifyAdminToken_(token) {
  const expectedToken = PropertiesService.getScriptProperties().getProperty("ADMIN_TOKEN");

  if (!expectedToken) {
    throw new Error("ADMIN_TOKEN is not configured in Script Properties.");
  }

  if (token !== expectedToken) {
    throw new Error("Invalid admin token.");
  }
}

function safeCell_(value) {
  const text = String(value || "").trim();

  if (/^[=+\-@]/.test(text)) {
    return "'" + text;
  }

  return text;
}

function formatDate_(value) {
  if (!value) {
    return "";
  }

  return Utilities.formatDate(new Date(value), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
}

function sanitizeCallback_(callback) {
  if (!callback || !/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(callback)) {
    return "callback";
  }

  return callback;
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonp_(callback, payload) {
  return ContentService
    .createTextOutput(callback + "(" + JSON.stringify(payload) + ");")
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
