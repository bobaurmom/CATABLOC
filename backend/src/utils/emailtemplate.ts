// otpEmailTemplate.ts

export const OTPTemplate = ( otpCode: string , title: string, message: string): string => `
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>

      <div class="email-card">
        <style>
          .CATABLOC {
            font-family: 'Arial Black', Arial, sans-serif;
            color: #0e0e0e;
            background-color: #020202;
            font-size: 32px;
            margin: 0;
            border-bottom: 2px solid #020202;
            padding-bottom: 16px;
            padding-top: 16px;

            text-align: center;
          }
          .email-header {
            padding-bottom: 10px;
            margin-bottom: 24px;
          }
          .email-card {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 24px;
            background-color: #ffffff;
            color: #1a1a1a;
          }

          .email-title {
            color: #010a15;
            font-weight: 600;
            font-size: 24px;
            text-align: left;
          }

          .email-text {
            line-height: 1.6;
            color: #2d2d2d;
            margin: 0 0 20px 0;
          }

          .otp-box {
            background-color: #f8f9fa;
            border: 1px solid #0d0d0d;
            padding: 26px;
            border-radius: 12px;
            margin: 28px 0;
            text-align: center;
            box-shadow: 0 2px 4px rgba(1, 10, 21, 0.06);
          }

          .otp-code {
            color: #010a15;
            font-size: 30px;
            letter-spacing: 5px;
            margin: 0;
            font-family: "Courier New", monospace;
            font-weight: 400;
          }

          .note {
            background-color: #e6f0fc;
            border-left: 4px solid #2c7be5;
            padding: 14px 16px;
            border-radius: 6px;
            margin: 24px 0;
          }

          .note p {
            color: #010a15;
            margin: 0;
            font-size: 14px;
            line-height: 1.5;
          }

          .important {
            color: #d92d2d;
            font-weight: 700;
          }

          .muted {
            color: #5a5a5a;
            font-size: 14px;
            margin-top: 20px;
          }

          .footer {
            color: #5a5a5a;
            font-size: 14px;
            margin-top: 24px;
            font-weight: 500;
          }
        </style>
        <div class="email-header">
            <h1 class="CATABLOC">CATABLOC</h1>
            <h1 class="email-title">${title}</h1>
            <p class="email-text">${message}</p>
        </div>


        <div class="otp-box">
          <h2 class="otp-code">${otpCode}</h2>
        </div>

        <div class="note">
          <p><span class="important">Important:</span> This code will expire in 10 minutes. Do not share this code with anyone.</p>
        </div>

        <p class="muted">Use this code to complete your login. <br>If you didn't request this code, please ignore this email.</p>
        <p class="footer">The CATABLOC</p>
      </div>
</body>
</html>`;