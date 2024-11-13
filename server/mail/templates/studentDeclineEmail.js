const studentDeclineEmail = (studentName, facultyName, projectName) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Project Application Status</title>
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
                color: #FF5C8D;
                font-size: 18px;
            }

            .cta {
                display: inline-block;
                padding: 12px 30px;
                background-color: #FF5C8D;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
                transition: background-color 0.3s ease;
            }

            .cta:hover {
                background-color: #e04e72;
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
            <div class="message">Application Update, ${studentName}</div>
            
            <div class="body">
                <p>We appreciate your interest in the project <span class="highlight">"${projectName}"</span> under the guidance of <span class="highlight">${facultyName}</span>.</p>
                <p>After careful consideration, we regret to inform you that we are unable to proceed with your application for this project at this time. This decision was challenging, and we encourage you to keep pursuing your goals.</p>
                <p>We value your interest and hope you will apply for future projects. We believe there will be many other opportunities where you can make an impact!</p>
            </div>
            
            <!-- Call-to-action button -->
            <a href="https://yourstudentdashboardlink.com" class="cta">View Other Opportunities</a>
            
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

module.exports = studentDeclineEmail;
