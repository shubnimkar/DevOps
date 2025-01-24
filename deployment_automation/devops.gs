function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form responses 1");
  var action = e.parameter.action;
  var row = parseInt(e.parameter.row, 10);

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


// Function to notify DevOps Team after approval
function notifyDevOps(row) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form responses 1");
  var data = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Extract data from the sheet
  var projectName = data[2]; 
  var environment = data[3]; 
  var deploymentTags = data[4]; 
  var repoDetails = data[5]; 
  var phabLink = data[6]; 
  var description = data[7]; 
  var targetURL = data[8]; 
  var approver = data[14]; 

  // Format Phabricator links and Deployment Tags for line breaks
  var formattedPhabLinks = phabLink.replace(/\s+/g, '<br>');
  var formattedTags = deploymentTags.replace(/\s+/g, '<br>');

  // Email subject
  var subject = `Deployment Approved: ${projectName} in ${environment}`;

  // Email body with inline CSS for compatibility
  var body = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 20px;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
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
    .approval-message {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      color: #155724;
      background: #d4edda;
      padding: 15px;
      border-radius: 8px 8px 0 0;
    }
    .footer {
      text-align: center;
      font-size: 14px;
      font-weight: bold;
      color: #333;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <table>
    <tr>
      <td class="approval-message">✅ Deployment Approved</td>
    </tr>
    <tr>
      <td style="padding: 20px; font-size: 14px; color: #333;">
        <p>Hello DevOps Team,</p>
        <p>The deployment request for the following project has been <strong>approved</strong> by <strong>${approver}</strong>.</p>
        <table>
          <tr><th>Project</th><td>${projectName}</td></tr>
          <tr><th>Environment</th><td>${environment}</td></tr>
          <tr><th>Deployment Tags</th><td>${deploymentTags}</td></tr>
          <tr><th>Repository</th><td>${repoDetails}</td></tr>
          <tr><th>Changes</th><td>${description}</td></tr>
          <tr><th>Phabricator Link</th><td>${formattedPhabLinks}</td></tr>
          <tr><th>Target URL</th><td><a href="${targetURL}" target="_blank">${targetURL}</a></td></tr>
        </table>
        <p class="footer">Best,<br>Deployment System</p>
      </td>
    </tr>
  </table>
</body>
</html>

  `;

  // Send email
  MailApp.sendEmail({
    to: "shubham@waybeyond.tech", // Replace with actual DevOps team email
    subject: subject,
    htmlBody: body
  });
}
