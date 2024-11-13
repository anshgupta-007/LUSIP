const otpTemplate = (otp) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>OTP Verification Email</title>
        <style>
            body {
                background-color: #f8f8f8;
                font-family: 'Arial', sans-serif;
                font-size: 16px;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 30px;
                background-color: #ffffff;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
                line-height: 1.8;
                margin-bottom: 30px;
            }
    
            .otp-code {
                font-size: 36px;
                font-weight: bold;
                color: #FF5C8D;
                margin: 20px 0;
                background-color: #F7F4FF;
                display: inline-block;
                padding: 10px 20px;
                border-radius: 8px;
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
            }
    
            .support {
                font-size: 14px;
                color: #777777;
                margin-top: 20px;
                text-align: center;
            }
    
            .support a {
                color: #FF5C8D;
                text-decoration: none;
            }
    
            .footer {
                font-size: 12px;
                color: #aaa;
                margin-top: 40px;
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
            <div class="message">Your OTP Verification Code</div>
            <div class="body">
                <p>Hello!</p>
                <p>Thank you for choosing our platform. To complete your registration, please use the following One-Time Password (OTP) to verify your identity:</p>
                <h2 class="otp-code">${otp}</h2>
                <p>This OTP is valid for the next 5 minutes. If you didn't request this, please ignore this email.</p>
            </div>
            <div class="support">
                Need help? Contact us at <a href="mailto:22ucc018@lnmiit.ac.in">22ucc018@lnmiit.ac.in</a>.
            </div>
        </div>
        <div class="footer">
            <p>© 2024 Your Company. All rights reserved.</p>
            <p><a href="#">Unsubscribe</a> | <a href="#">Privacy Policy</a></p>
        </div>
    </body>
    
    </html>`;
};

module.exports = otpTemplate;
