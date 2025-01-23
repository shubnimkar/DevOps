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
  var baseUrl = "https://script.google.com/a/macros/waybeyond.tech/s/AKfycbyXsmXXg95_Mt3KdeZA0m9v-pBzExYW_BROWJEHv4hXYCbZ6aPGGTTDeWdN7OgYs_Q/exec"; // Replace with your actual web app URL
  var approvalLink = `${baseUrl}?action=approve&row=${lastRow}`;
  var rejectLink = `${baseUrl}?action=reject&row=${lastRow}`;
  
  // Format Phabricator links and Deployment Tags for line breaks
  var formattedPhabLinks = phabLink.replace(/\s+/g, '<br>');
  var formattedTags = deploymentTags.replace(/\s+/g, '<br>');
  
  // Email subject and body with HTML formatting
var subject = `Deployment Approval Request: ${projectName} Deployment in ${environment} environment`;
var body = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 20px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    a {
      text-decoration: none;
      /* Remove the color rule for links */
    }
    .btn {
      display: inline-block;
      padding: 10px 20px;
      border-radius: 5px;
    }
    .btn-success {
      background-color: #28a745; /* Green */
      color: #fff; /* White */
    }
    .btn-danger {
      background-color: #dc3545; /* Red */
      color: #fff; /* White */
    }
  </style>
</head>
<body>
  <p>Hello Rutuja & Vaibhav,</p>
  <p>A new deployment request has been submitted by ${email}. Please review the details below:</p>
  <table>
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
  <a href="${approvalLink}" class="btn btn-success" 
     style="background-color: #28a745; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">
    Approve
  </a>
  | 
  <a href="${rejectLink}" class="btn btn-danger" 
     style="background-color: #dc3545; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">
    Reject
  </a>
</p>

  <p>Best,<br>Deployment System</p>
  
</body>
</html>
`;
  
  // Sending email notification to Rutuja and Vaibhav
  MailApp.sendEmail({
    to: "shubham@waybeyond.tech",  // Update with actual email addresses
    subject: subject,
    htmlBody: body
  });
}
