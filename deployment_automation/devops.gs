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
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deployment Approval</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
            padding: 0;
            background-color: #f5f5f5;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th,
        td {
            border: 1px solid #ddd;
            padding: 10px;
        }
        th {
            background-color: #e8e8e8;
            color: #333;
            font-weight: bold;
        }
        .approval-message {
            margin-top: 20px;
            text-align: center;
        }
        .approval-message td {
            background-color: #f5f5f5;
            color: #333;
            font-size: 20px;
            font-weight: bold;
            padding: 15px;
            border-radius: 8px 8px 0 0;
        }
        a {
            text-decoration: none;
            color: #666;
        }
    </style>
</head>
<body>
    <table width="100%" cellpadding="5" cellspacing="0">
        <tr>
            <td class="approval-message">
                ✅ Deployment Approved
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; font-size: 14px; color: #333;">
                <p>Hello DevOps Team,</p>
                <p>The deployment request for the following project has been <strong>approved</strong> by <strong>${approver}</strong>.</p>

                <table width="100%" cellpadding="5" cellspacing="0">
                    <tr>
                        <th>Project</th>
                        <td>${projectName}</td>
                    </tr>
                    <tr>
                        <th>Environment</th>
                        <td>${environment}</td>
                    </tr>
                    <tr>
                        <th>Deployment Tags</th>
                        <td>${deploymentTags}</td>
                    </tr>
                    <tr>
                        <th>Repository</th>
                        <td>${repoDetails}</td>
                    </tr>
                    <tr>
                        <th>Changes</th>
                        <td>${description}</td>
                    </tr>
                    <tr>
                        <th>Phabricator Link</th>
                        <td>${formattedPhabLinks}</td>
                    </tr>
                    <tr>
                        <th>Target URL</th>
                        <td><a href="${targetURL}" target="_blank">${targetURL}</a>
                    </tr>
                </table>

                <p style="text-align: center; font-size: 12px; color: #666; margin-top: 20px;">
                    Best,<br>
                    Deployment System
                </p>
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

