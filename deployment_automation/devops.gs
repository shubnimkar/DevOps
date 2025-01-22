function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form responses 1");
  
  // Get parameters from the URL
  var action = e.parameter.action;
  var row = parseInt(e.parameter.row, 10);

  if (!row || row < 2) {
    return ContentService.createTextOutput("Invalid request.");
  }

  var approver = Session.getActiveUser().getEmail(); // Captures who is approving/rejecting
  var approvalStatus = (action === "approve") ? "Approved" : "Rejected";

  // Ensure the columns 14, 15, and 16 exist in the sheet
  var lastColumn = sheet.getLastColumn();
  
  if (lastColumn < 16) {
    return ContentService.createTextOutput("Sheet is not properly structured.");
  }

  // Update approval status, approver's email, and timestamp in the specified columns (14, 15, and 16)
  sheet.getRange(row, 14).setValue(approvalStatus);  // Column 14 for approval status
  sheet.getRange(row, 15).setValue(approver);        // Column 15 for approver's email
  sheet.getRange(row, 16).setValue(new Date());      // Column 16 for approval timestamp

  // Notify the DevOps Team if Approved
  if (action === "approve") {
    notifyDevOps(row);
  }

  return ContentService.createTextOutput(`Deployment ${approvalStatus} successfully.`);
}

// Function to notify DevOps Team after approval
function notifyDevOps(row) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form responses 1");
  var data = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Get values based on your sheet's structure
  var projectName = data[2]; // Column 3 (Project Name)
  var environment = data[3]; // Column 4 (Environment)
  var deploymentTags = data[4]; // Column 5 (Deployment Tags)
  var repoDetails = data[5]; // Column 6 (Repository Details)
  var phabLink = data[6]; // Column 7 (Phabricator Link)
  var description = data[7]; // Column 8 (Description of Changes)
  var targetURL = data[8]; // Column 9 (Target URL)

  var subject = `Deployment Approved: ${projectName} in ${environment}`;
  var body = `Dear DevOps Team,\n\n` +
             `The deployment request for the following project has been approved:\n\n` +
             `Project: ${projectName}\n` +
             `Environment: ${environment}\n` +
             `Deployment Tags: ${deploymentTags}\n` +
             `Repository: ${repoDetails}\n` +
             `Changes: ${description}\n` +
             `Phabricator Link: ${phabLink}\n` +
             `Target URL: ${targetURL}\n\n` +
             `Please proceed with the deployment.\n\n` +
             `Best,\nDeployment System`;

  MailApp.sendEmail({
    to: "shubham@waybeyond.tech", // Update with actual DevOps team email
    subject: subject,
    body: body
  });
}

