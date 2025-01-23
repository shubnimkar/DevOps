function sendApprovalRequest(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form responses 1");
  var lastRow = sheet.getLastRow();
  var data = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Extracting data from the sheet
  var timestamp = data[0];
  var date = data[1];
  var projectName = data[2];
  var environment = data[3];
  var deploymentTags = data[4];
  var repoDetails = data[5];
  var phabLink = data[6];
  var description = data[7];
  var targetURL = data[8];
  var email = data[12];
  
  // Generate Approval and Rejection Links
  var baseUrl = "https://script.google.com/a/macros/waybeyond.tech/s/AKfycbx9NRQSw3klP64o_nbJMNEQitS7p-SumlWQlIBbUL0mj9k2pFFgeFyHbm4jp16HVIZT/exec"; // Replace with your actual web app URL
  var approvalLink = `${baseUrl}?action=approve&row=${lastRow}`;
  var rejectLink = `${baseUrl}?action=reject&row=${lastRow}`;
  
  // Format Phabricator links and Deployment Tags for line breaks
  var formattedPhabLinks = phabLink.replace(/\s+/g, '<br>');
  var formattedTags = deploymentTags.replace(/\s+/g, '<br>');
  
  // Email subject and body with HTML formatting
  var subject = `Approval Request: ${projectName} Deployment in ${environment}`;
  var body = `
    <p>Dear Rutuja & Vaibhav,</p>
    <p>A new deployment request has been submitted. Please review the details below:</p>
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
      <tr><th>Project</th><td>${projectName}</td></tr>
      <tr><th>Environment</th><td>${environment}</td></tr>
      <tr><th>Deployment Tags</th><td>${formattedTags}</td></tr>
      <tr><th>Repository</th><td>${repoDetails}</td></tr>
      <tr><th>Changes</th><td>${description}</td></tr>
      <tr><th>Phabricator Link</th><td>${formattedPhabLinks}</td></tr>
      <tr><th>Target URL</th><td><a href="${targetURL}" target="_blank">${targetURL}</a></td></tr>
    </table>
    <p>Please click below to approve or reject the request:</p>
    <p>
      <a href="${approvalLink}">Approve</a> | <a href="${rejectLink}">Reject</a>
    </p>
    <p>Best,<br>Deployment System</p>
  `;
  
  // Sending email notification to Rutuja and Vaibhav
  MailApp.sendEmail({
    to: "shubham@waybeyond.tech",  // Update with actual email addresses
    subject: subject,
    htmlBody: body
  });
}
