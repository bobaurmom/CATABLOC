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
      case 'email_verification':
        return {
          subject: '🔐 Verify Your Email - CATABLOC',
          title: 'Email Verification',
          message: 'Please use the following code to verify your email address:'
        };
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
          message: 'Please use the following code:'
        };
    }
  };
  const { subject, title, message } = getSubjectAndMessage();
  return {
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4a90e2;">${title}</h1>
        <p>${message}</p>
        <div style="background-color: #f8f9fa; border: 2px solid #4a90e2; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">
          <h2 style="color: #4a90e2; font-size: 36px; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${otpCode}</h2>
        </div>
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #856404; margin: 0; font-size: 14px;">
            <strong>Important:</strong> This code will expire in 10 minutes. Do not share this code with anyone.
          </p>
        </div>
        <p>If you didn't request this code, please ignore this email.</p>
        <p>The CATABLOC Team</p>
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
            

            const result =await transporter.sendMail(mailOptions);
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
