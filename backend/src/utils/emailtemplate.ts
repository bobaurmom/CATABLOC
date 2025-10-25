// welcomeEmailTemplate.ts

export const WelcomeEmail = (userName: string): string => `

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome!</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #ffffff;
            color: #000000;
            line-height: 1.6;
            padding: 20px 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #000000;
            border-radius: 4px;
            overflow: hidden;

        }
        .header {
            background: #000000;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 1px;
            align-items: center;
        }
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        .content h2 {
            font-size: 24px;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .content p {
            margin: 15px 0;
            font-size: 16px;
        }
        .btn {
            display: inline-block;
            background: #000000;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 30px;
            margin: 25px 0;
            border-radius: 2px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        .btn:hover {
            background: #333333;
        }
        .footer {
            background: #f5f5f5;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #eeeeee;
            font-size: 14px;
            color: #666666;
        }
        .footer a {
            color: #000000;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        @media (max-width: 600px) {
            .content { padding: 30px 20px; }
            .header h1 { font-size: 24px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>WELCOME CATAGANGER</h1>
        </div>
        <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>Welcome to Catabloc. Ready to play some games?</p>
            <p>Your account has been successfully created and you're ready to get started.</p>
            <a href="#" class="btn">GET STARTED</a>
            <p>If you have any questions, just reply to this email – we're always happy to help.</p>
        </div>
        <div class="footer">
        </div>
    </div>
</body>
</html>
`;