function doPost(e) {
  try {
    const payload = typeof e.postData.contents === 'string' ? JSON.parse(e.postData.contents) : {};
    const sheet = getSheet();
    const timestamp = new Date().toISOString();
    const row = [
      timestamp,
      payload.businessName || '',
      payload.ownerName || '',
      payload.phone || '',
      payload.email || '',
      payload.instagram || '',
      payload.website || '',
      payload.businessType || '',
      payload.goal || '',
      payload.budget || '',
      payload.contactMethod || '',
      payload.primaryService || '',
      payload.projectFocus || '',
      Array.isArray(payload.services) ? payload.services.join(', ') : '',
      Array.isArray(payload.platforms) ? payload.platforms.join(', ') : '',
      payload.contactTime || '',
      payload.notes || '',
      payload.additionalNotes || '',
      payload.leadScore || '',
      payload.recommendation || ''
    ];

    sheet.appendRow(row);
    sendEmail(payload);

    return ContentService.createTextOutput(JSON.stringify({ ok: true, message: 'Lead saved' })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('Halal Foodistan Apps Script is running.');
}

function getSheet() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!spreadsheetId) {
    throw new Error('Add your Google Sheet ID as a script property named SHEET_ID.');
  }

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  let sheet = spreadsheet.getSheetByName('Leads');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Leads');
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Submitted At',
      'Business Name',
      'Owner Name',
      'Phone',
      'Email',
      'Instagram',
      'Website',
      'Business Type',
      'Goal',
      'Budget',
      'Contact Method',
      'Primary Service',
      'Project Focus',
      'Services',
      'Platforms',
      'Best Time',
      'Notes',
      'Additional Notes',
      'Lead Score',
      'Recommendation'
    ]);
  }

  return sheet;
}

function sendEmail(payload) {
  const recipient = PropertiesService.getScriptProperties().getProperty('EMAIL_TO') || 'sale@halalfoodistan.com';
  const subject = `New Halal Foodistan Lead - ${payload.businessName || 'Unknown Business'}`;
  const body = [
    'New lead submitted from the Halal Foodistan inquiry form.',
    '',
    `Business: ${payload.businessName || ''}`,
    `Owner: ${payload.ownerName || ''}`,
    `Phone: ${payload.phone || ''}`,
    `Email: ${payload.email || ''}`,
    `Instagram: ${payload.instagram || ''}`,
    `Business Type: ${payload.businessType || ''}`,
    `Goal: ${payload.goal || ''}`,
    `Budget: ${payload.budget || ''}`,
    `Services: ${Array.isArray(payload.services) ? payload.services.join(', ') : ''}`,
    `Primary Service: ${payload.primaryService || ''}`,
    `Project Focus: ${payload.projectFocus || ''}`,
    `Platforms: ${Array.isArray(payload.platforms) ? payload.platforms.join(', ') : ''}`,
    `Lead Score: ${payload.leadScore || ''}`,
    `Recommendation: ${payload.recommendation || ''}`,
    `Notes: ${payload.notes || ''}`,
    `Additional Notes: ${payload.additionalNotes || ''}`,
    `Submitted: ${new Date().toISOString()}`
  ].join('\n');

  MailApp.sendEmail(recipient, subject, body);
}
