function doGet(e) {
  var action = e.parameter.action;

  if (action === "approve" || action === "reject") {
    return handleApproval(e);
  }
  
  if (action === "getPendingDeployments") {
    return ContentService.createTextOutput(JSON.stringify(getPendingDeployments()))
                         .setMimeType(ContentService.MimeType.JSON);
  }

  // Serve the upload document page by default
  return HtmlService.createHtmlOutputFromFile('MainPage').setTitle("Deployment Management");
}

function handleApproval(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form responses 1");
  var row = parseInt(e.parameter.row, 10);
  var action = e.parameter.action;
  
  if (!row || row < 2) {
    return HtmlService.createHtmlOutput("<h3>Invalid request.</h3>");
  }

  var approver = Session.getActiveUser().getEmail();
  var approvalStatus = (action === "approve") ? "Approved" : "Rejected";

  var lastColumn = sheet.getLastColumn();
  if (lastColumn < 16) {
    return HtmlService.createHtmlOutput("<h3>Sheet is not properly structured.</h3>");
  }

  sheet.getRange(row, 14).setValue(approvalStatus);
  sheet.getRange(row, 15).setValue(approver);
  sheet.getRange(row, 16).setValue(new Date());

  if (action === "approve") {
    notifyDevOps(row);
  }

  var responseHtml = `
    <html>
      <head><title>Deployment Status</title></head>
      <body style="text-align: center; font-family: Arial;">
        <h2>Deployment ${approvalStatus} Successfully</h2>
        <p>Thank you, ${approver}, for your response.</p>
      </body>
    </html>`;

  return HtmlService.createHtmlOutput(responseHtml);
}

function getPendingDeployments() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form responses 1");
  var data = sheet.getDataRange().getValues();
  var pendingRequests = [];

  for (var i = 1; i < data.length; i++) {
    var docLink = data[i][16]; // Column 17 in 0-based index

    Logger.log(`Row ${i + 1}: Column 17 Value = ${docLink} (Type: ${typeof docLink})`); // Debugging

    if (!docLink || String(docLink).trim() === "") { // Convert to string first
      pendingRequests.push({
        row: i + 1, // Sheet row (1-based)
        project: data[i][2], // Column 3 (Project Name)
        environment: data[i][3] // Column 4 (Environment)
      });
    }
  }

  Logger.log("Pending Deployments: " + JSON.stringify(pendingRequests, null, 2)); // Debugging
  return pendingRequests;
}

function uploadDeploymentDocument(row, fileName, fileData) {
  var folder = DriveApp.getFolderById("1SveYCPQJHx2fE_i4TelXOdreLP3DK7xx"); // Change to your Drive folder ID
  var blob = Utilities.newBlob(Utilities.base64Decode(fileData), MimeType.PDF, fileName);
  var file = folder.createFile(blob);
  var fileUrl = file.getUrl();

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form responses 1");
  sheet.getRange(row, 17).setValue(fileUrl); // Store link in column 17
}

