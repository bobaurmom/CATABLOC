import nodemailer , { Transporter ,SendMailOptions } from 'nodemailer';
import { config } from 'dotenv';
import { tr } from 'zod/locales';

config(); 

interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

interface EmailTemplate {
    subject: string;
    text: string;
    html: string;
}
const createTransporter = (): Transporter => {
    const emailConfig: EmailConfig = {
        host: process.env.SMTP_HOST || '',
        port: Number(process.env.SMTP_PORT) ,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || ''
        }
    };
    return nodemailer.createTransport(emailConfig);
};
const getOTPTemplate = (otpCode: string, type: 'email_verification' | 'password_reset'): EmailTemplate => {
  const getSubjectAndMessage = () => {
    switch (type) {
      case 'password_reset':
        return {
          subject: '🔑 Password Reset Code - CATABLOC',
          title: 'Password Reset',
          message: 'Please use the following code to reset your password:'
        };
      default:
        return {
          subject: '🔐 Verification Code - CATABLOC',
          title: 'Verification Code',
          message: ' Please use the following code:'
        };
    }
  };
  const { subject, title, message } = getSubjectAndMessage();
  return {
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; color: #1a1a1a;">
        <h1 style="color: #010a15; font-weight: 600; margin-bottom: 16px; font-size: 24px;">${title}</h1>
        <p style="line-height: 1.6; color: #2d2d2d;">${message}</p>

        <div style="background-color: #f8f9fa; border: 1px solid #0d0d0d; padding: 26px; border-radius: 12px; margin: 28px 0; text-align: center; box-shadow: 0 2px 4px rgba(1, 10, 21, 0.06);">
          <h2 style="color: #010a15; font-size: 30px; letter-spacing: 5px; margin: 0; font-family: 'Courier New', monospace; font-weight: normal;">${otpCode}</h2>
        </div>

        <div style="background-color: #e6f0fc; border-left: 4px solid #2c7be5; padding: 14px 16px; border-radius: 6px; margin: 24px 0;">
          <p style="color: #010a15; margin: 0; font-size: 14px; line-height: 1.5;">
            <strong style="color: #d92d2d;">Important:</strong> This code will expire in 10 minutes. Do not share this code with anyone.
          </p>
        </div>

        <p style="color: #5a5a5a; font-size: 14px; margin-top: 20px;">If you didn't request this code, please ignore this email.</p>
        <p style="color: #5a5a5a; font-size: 14px; margin-top: 24px; font-weight: 500;">The CATABLOC</p>
      </div>
    `,
    text: `${title}\n\n${message}\n\nYour verification code is: ${otpCode}\n\nThis code will expire in 10 minutes. Do not share this code with anyone.\n\nIf you didn't request this code, please ignore this email.\n\nThe CATABLOC Team`
  };
};
const createEmailService = () => {
    const fromEmail = process.env.EMAIL_USER ;
    const transporter = createTransporter();
    const sendEmail = async (to: string, template: EmailTemplate): Promise<boolean> => {
        try {
            const mailOptions: SendMailOptions = {
                from: fromEmail,
                to,
                subject: template.subject,
                html: template.html,
                text: template.text
            };

            const result = await transporter.sendMail(mailOptions);
            console.log('Email sent:', result.messageId);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    };
    const sendOTPEmail = async (userEmail: string, otpCode: string, type: 'email_verification' | 'password_reset'): Promise<boolean> => {
        const template = getOTPTemplate(otpCode, type);
        return await sendEmail(userEmail, template);
    }
    return {
        sendEmail,
        sendOTPEmail
    };
};

export default createEmailService;
