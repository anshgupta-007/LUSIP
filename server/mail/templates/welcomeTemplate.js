const welcomeTemplate = (email) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Account Created Successfully</title>
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
                margin-bottom: 20px;
            }
    
            .email-highlight {
                font-size: 18px;
                font-weight: bold;
                color: #FF5C8D;
                margin: 15px 0;
                background-color: #F7F4FF;
                display: inline-block;
                padding: 10px 20px;
                border-radius: 8px;
            }
    
            .footer {
                font-size: 12px;
                color: #aaa;
                margin-top: 30px;
                text-align: center;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <div class="message">Account Created Successfully!</div>
            <div class="body">
                <p>Your account has been created with the following email address:</p>
                <div class="email-highlight">${email}</div>
                <p>You can now log in to your account using your credentials.</p>
            </div>
            <div class="footer">
                <p>© 2024 Your Company. All rights reserved.</p>
            </div>
        </div>
    </body>
    
    </html>`;
};

module.exports = welcomeTemplate;