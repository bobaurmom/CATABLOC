import { Op } from 'sequelize';
import OTP from '../models/OTP';
import emailService from './email';
import { ca } from 'zod/locales';
import { send } from 'process';

export interface OTPRequest {
    email: string;
    type: 'email_verification' | 'password_reset';
}
export interface OTPVerification{
    email: string;
    code: string;
    type: 'email_verification' | 'password_reset';

}


const OTP_LENGTH = 6;
const OTP_EXPIRATION_MINUTES = 10;  
const MAX_OTP_ATTEMPTS = 3;

//GENERATE RANDOM OTP CODE
const generateOTPCode = (): string => {
    let code = '';
    for (let i = 0; i < OTP_LENGTH; i++) {
        code += Math.floor(Math.random() * 10).toString();
    }
    return code;
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
            type,
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
            where:{
                email,
                type,
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
        //STORE OTP IN DB
        await OTP.create({
            email,
            type,
            code,
            expired_at,
            attemptLimit: MAX_OTP_ATTEMPTS,
            attempts: 0,
            expired: false,
        });
        const emailSent = await emailService().sendOTPEmail(email,code,type);
        if(!emailSent){
            await OTP.destroy({ where: { email, type, code } });
            return { 
                success: false, 
                message: 'Failed to send OTP email. Please try again later.' 
            };
        }
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
export async function verifyOTP(verification: OTPVerification): Promise<{ success: boolean; message: string ;data?: any}> {
    try {
        const { email, code, type } = verification;
        const otpRecord = await OTP.findOne({
            where: {
                email,
                code,
                type,
            },
        });
        if (!otpRecord) {
            return { success: false, message: 'Invalid OTP. Please try again.' };
        }
        if (otpRecord.expired) {
            await otpRecord.destroy();
            return { success: false, message: 'OTP has already been used.' };
        }
        if ( otpRecord.attempts >= MAX_OTP_ATTEMPTS ) {
            await otpRecord.destroy();
            return { success: false, message: 'OTP has been blocked due to too many attempts. Please request a new one.' };
        }

        if ( otpRecord.isExpired() ) {
            otpRecord.markAsExpired();
            await otpRecord.save();
            return { success: false, message: 'OTP has expired.' };
        }
        otpRecord.markAsExpired();
        await otpRecord.save();
        return { 
            success: true,
            message: 'OTP verified successfully.',
            data: { email, type }
        };
    }catch (error) {
        console.error('Error verifying OTP:', error);
        return { success: false, message: 'Failed to verify OTP. Please try again later.' };
    }
    
}
//increment OTP attempts
export async function incrementOTPAttempts(email: string, code: string, type: string): Promise<void> {
    try {
        const otpRecord = await OTP.findOne({
            where: {
                email,
                code,
                type,
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
                type,
            }
        });
        return await sendOTP(request);
    } catch (error) {
        console.error('Error resetting OTPs:', error);
        return { success: false, message: 'Failed to reset OTPs. Please try again later.' };
    }
}

