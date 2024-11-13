const studentApprovalEmail = (studentName, facultyName, projectName) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Project Application Approved</title>
        <style>
            body {
                background-color: #f4f7fa;
                font-family: 'Arial', sans-serif;
                font-size: 16px;
                color: #333;
                margin: 0;
                padding: 0;
            }

            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 30px;
                background-color: #ffffff;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                text-align: center;
            }

            .logo {
                max-width: 180px;
                margin-bottom: 20px;
            }

            .message {
                font-size: 24px;
                font-weight: bold;
                color: #333;
                margin-bottom: 20px;
            }

            .body {
                font-size: 16px;
                color: #555;
                line-height: 1.6;
                margin-bottom: 30px;
            }

            .highlight {
                font-weight: bold;
                color: #4CAF50;
                font-size: 18px;
            }

            .cta {
                display: inline-block;
                padding: 12px 30px;
                background-color: #4CAF50;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
                transition: background-color 0.3s ease;
            }

            .cta:hover {
                background-color: #43a047;
            }

            .support {
                font-size: 14px;
                color: #777;
                margin-top: 30px;
                line-height: 1.6;
            }

            .footer {
                font-size: 12px;
                color: #aaa;
                margin-top: 50px;
                text-align: center;
            }

            .footer a {
                color: #aaa;
                text-decoration: none;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <!-- Optional logo -->
            
            <!-- Main message -->
            <div class="message">Congratulations, ${studentName}!</div>
            
            <div class="body">
                <p>We are excited to inform you that <span class="highlight">${facultyName}</span> has approved your application for the project <span class="highlight">"${projectName}"</span>.</p>
                <p>You are now officially a part of this project! Further details and next steps will be shared with you soon. We look forward to seeing the great contributions you’ll make to this project.</p>
            </div>
            
            <!-- Call-to-action button -->
            <a href="https://yourstudentdashboardlink.com" class="cta">Visit Website</a>
            
            <!-- Support Info -->
            <div class="support">
                If you have any questions or need assistance, feel free to contact us at <a href="mailto:support@lnmiit.ac.in">support@lnmiit.ac.in</a>. We're here to help!
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>© 2024 LUSIP. All rights reserved.</p>
            <p><a href="#">Unsubscribe</a> | <a href="#">Privacy Policy</a></p>
        </div>
    </body>
    
    </html>`;
};

module.exports = studentApprovalEmail;
