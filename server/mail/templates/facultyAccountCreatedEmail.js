const facultyAccountCreatedEmail = (facultyName, facultyEmail, password, institutionName = "The LNM Institute of Information Technology, Jaipur") => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Account Created Successfully</title>
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
                color: #4f46e5;
                font-size: 18px;
            }

            .credentials-box {
                background-color: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                padding: 20px;
                margin: 20px 0;
                text-align: left;
            }

            .cta {
                display: inline-block;
                padding: 12px 30px;
                background-color: #4f46e5;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
                transition: background-color 0.3s ease;
            }

            .cta:hover {
                background-color: #3b41c5;
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
            <div class="message">Welcome to ${institutionName}!</div>
            
            <div class="body">
                <p>Dear ${facultyName},</p>
                <p>Your faculty account has been successfully created. You can now access your account and start exploring the available resources and tools.</p>
                
                <div class="credentials-box">
                    <p><span class="highlight">Your Login Credentials:</span></p>
                    <p><strong>Email:</strong> ${facultyEmail}</p>
                    <p><strong>Password:</strong> ${password}</p>
                    <p style="color: #ef4444; font-size: 14px;">Please change your password after first login for security.</p>
                </div>

                <a href="[Login URL]" class="cta">Login to Your Account</a>
            </div>
            
            <div class="support">
                If you have any questions or need assistance, feel free to contact us at <a href="mailto:sandeep.saini@lnmiit.ac.in>Sandeep Saini</a>. We're here to help!
            </div>
        </div>

        <div class="footer">
            <p>© 2024 ${institutionName}. All rights reserved.</p>
        </div>
    </body>
    
    </html>`;
};

module.exports = facultyAccountCreatedEmail;
