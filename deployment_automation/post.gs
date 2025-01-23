function doGet() {
  return HtmlService.createHtmlOutputFromFile('UploadPage').setTitle("Upload Deployment Document");
}

// Fetch pending deployment requests
function getPendingDeployments() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form responses 1");
  var data = sheet.getDataRange().getValues();
  var pendingRequests = [];

  for (var i = 1; i < data.length; i++) {
    if (data[i][16] === "") { // Column 17 (Deployment Document) is empty
      pendingRequests.push({
        row: i + 1, // Sheet row (1-based)
        project: data[i][2], // Column 3 (Project Name)
        environment: data[i][3], // Column 4 (Environment)
      });
    }
  }
  return pendingRequests;
}

// Handle file upload
function uploadDeploymentDocument(fileData, fileName, row) {
  try {
    var folder = DriveApp.getFolderById("1SveYCPQJHx2fE_i4TelXOdreLP3DK7xx"); // Set your actual Drive folder ID
    var blob = Utilities.newBlob(Utilities.base64Decode(fileData), MimeType.PDF, fileName);
    var file = folder.createFile(blob).setName(fileName);
    var fileUrl = file.getUrl();

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form responses 1");
    sheet.getRange(row, 17).setValue(fileUrl); // Store link in Column 17

    Logger.log(`File uploaded: ${fileUrl}`);

    // Notify Testing Team
    notifyTestingTeam(row, fileUrl);

    return { status: "success", message: "File uploaded successfully!" };
  } catch (error) {
    Logger.log(`Error uploading file: ${error.message}`);
    return { status: "error", message: `Error: ${error.message}` };
  }
}

// Notify Testing Team
function notifyTestingTeam(row, docLink) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form responses 1");
  var data = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];

  var subject = `Deployment Document Uploaded: ${data[2]} in ${data[3]}`;
  var body = `Dear Testing Team,\n\n` +
             `The deployment document for the following project has been uploaded.\n\n` +
             `Project: ${data[2]}\n` +
             `Environment: ${data[3]}\n\n` +
             `Deployment Document: ${docLink}\n\n` +
             `Please review and proceed with testing.\n\n` +
             `Best,\nDeployment System`;

  MailApp.sendEmail({
    to: "shubham@waybeyond.tech", // Replace with actual Testing Team email
    subject: subject,
    body: body
  });

  Logger.log(`Email sent to Testing Team for row ${row}`);
}
