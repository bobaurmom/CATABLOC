import { Op } from 'sequelize';
import OTP from '../models/OTP';
import emailService from './email';
import crypto from 'crypto';    
import { ca } from 'zod/locales';
import { send } from 'process';
import bcrypt from 'bcrypt';

export interface OTPRequest {
    email: string;
    type: 'email_verification' | 'password_reset';
}
export interface OTPVerification{
    email: string;
    hashedOTPCode: string;
    type: 'email_verification' | 'password_reset';

}

const OTP_LENGTH = 6;
const OTP_EXPIRATION_MINUTES = 10;  
const MAX_OTP_ATTEMPTS = 3;

//GENERATE RANDOM OTP CODE

const generateOTPCode = (): string => {
    const min = Math.pow(10, OTP_LENGTH - 1);
    const max = Math.pow(10, OTP_LENGTH) - 1;
    // Use a cryptographically secure function
    return crypto.randomInt(min, max + 1).toString();
};

//CALCULATE EXPIRATION TIME
const calculateExpiration = (): Date => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + OTP_EXPIRATION_MINUTES );
    return now;
}

//cleanUP EXPIRED OTPS
async function cleanUpExpiredOTPs( email: string, type: string ): Promise<void> {

    await OTP.destroy({
        where: {
            email,
            otp_type: type,
            [Op.or]: [
                { expired: true },
                { expired_at: { [Op.lt]: new Date() } },
                { attempts: { [Op.gte]: MAX_OTP_ATTEMPTS } },
            ],
        },
    });
}

//send OTP
export async function sendOTP(request: OTPRequest): Promise<{ success: boolean , message: string    }> {
    try{
        const {email,type} = request;
        await cleanUpExpiredOTPs(email,type);
        const existingOTP = await OTP.findOne({
            where: {
                email: email,
                otp_type: type,
                expired: false,
                expired_at: { [Op.gt]: new Date() },
                attempts: { [Op.lt]: MAX_OTP_ATTEMPTS }
            }
         });
        if(existingOTP){
            return { success: false, message: 'An active OTP already exists. Please check your email.' };
        }
        const code = generateOTPCode();
        const expired_at = calculateExpiration();

        //send email with OTP code(this take too long so i optimize it by sending email after saving to DB)
        // const emailSent = await emailService().sendOTPEmail(email,code,type);
        // if(!emailSent){
        //     await OTP.destroy({ where: { email, otp_type: type, code } });
        //     return { 
        //         success: false, 
        //         message: 'Failed to send OTP email. Please try again later.' 
        //     };
        // }else{
        //     const hashedCode = await bcrypt.hash(code, 10);
        //     await OTP.create({
        //         email,
        //         otp_type: type,
        //         code: hashedCode,
        //         expired_at,
        //         attemptLimit: MAX_OTP_ATTEMPTS,
        //         attempts: 0,
        //         expired: false,
        //     });
        // }

        //optimized way
        const hashedCode = await bcrypt.hash(code, 10);
        await OTP.create({
            email,
            otp_type: type,
            code: hashedCode,
            expired_at,
            attemptLimit: MAX_OTP_ATTEMPTS,
            attempts: 0,
            expired: false,
        });
        emailService().sendOTPEmail(email,code,type).then(sent => {
            if (!sent) {
                OTP.destroy({ where: { email, otp_type: type, code } });
                throw new Error('Email service not available');
            }else{
                console.log('OTP email sent to:', email);
            }
            }).catch(error => {
                console.error('Error sending OTP email:', error);
            });

        return { 
            success: true,
            message: 'OTP sent successfully.'
        };
    } catch (error) {
        console.error('Error sending OTP:', error);
        return { 
            success: false,
            message: 'Failed to send OTP. Please try again later.' 
        };
    }
}
    //VERIFY OTP
export async function verifyOTP(verification: OTPVerification): Promise<{ success: boolean; message: string; data?: any }> {
    try {
        const { email, hashedOTPCode: plainCode, type } = verification;
        // Find ALL active OTP records for this email
        const otpRecords = await OTP.findAll({
            where: {
                email,
                otp_type: type,
                expired: false,
                expired_at: { [Op.gt]: new Date() },
                attempts: { [Op.lt]: MAX_OTP_ATTEMPTS }
            },
        });
        if (!otpRecords || otpRecords.length === 0) {
            return { 
                success: false, 
                message: 'Invalid or expired OTP. Please try again.' 
            };
        }
        // Check plain code against each hashed code in database
        let matchedRecord = null;
        for (const record of otpRecords) {
            const isMatch = await bcrypt.compare(plainCode, record.code);
            if (isMatch) {
                matchedRecord = record;
                break;
            }
        }

        if (!matchedRecord) {
            return { 
                success: false, 
                message: 'Invalid OTP code. Please try again.' 
            };
        }
        // Mark as expired and save
        matchedRecord.markAsExpired();
        await matchedRecord.save();
        return {
            success: true,
            message: 'OTP verified successfully.',
            data: { email, type }
        };

    } catch (error) {
        console.error('Error verifying OTP:', error);
        return { 
            success: false, 
            message: 'Failed to verify OTP. Please try again later.' 
        };
    }
}

//increment OTP attempts
export async function incrementOTPAttempts(email: string, hashedOTPCode: string, type: string): Promise<void> {
    try {
        const otpRecord = await OTP.findOne({
            where: {
                email,
                code: hashedOTPCode,
                otp_type: type,
                expired: false,
            },
        });
        if (otpRecord && !otpRecord.expired) {
            otpRecord.attempts += 1;
            await otpRecord.save();
        }
    } catch (error) {
        console.error('Error incrementing OTP attempts:', error);
    }
}
//reset OTPs for email and type
export async function resendOTP( request: OTPRequest ): Promise< {success : boolean ; message : string}> {
    try {
        const { email, type } = request;
        await OTP.destroy({
            where: {
                email,
                otp_type: type,
            }
        });
        return await sendOTP(request);
    } catch (error) {
        console.error('Error resetting OTPs:', error);
        return { success: false, message: 'Failed to reset OTPs. Please try again later.' };
    }
}

