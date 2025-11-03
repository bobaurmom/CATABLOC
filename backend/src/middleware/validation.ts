//# Request body validation
import { Request , Response, NextFunction } from "express";
import {  z} from "zod";
import { validatePassword } from "../utils/hash";
import { ValidationError , ErrorResponse } from "../types/auth";
//vali schema for register
export const registerSchema = z.object({
    email: z.string()
        .email('please provide a valid email address')
        .min(1, 'email is required')
        .max(255, 'email must be less than 255 characters'),
    username: z.string()
        .min(3, 'username must be at least 3 characters long')
        .max(50, 'username must be less than 50 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'username can only contain letters, numbers, and underscores and hyphens'),
    password: z.string()
        .min(1, 'password is required'),
    confirmPassword: z.string()
        .min(1, 'confirm password is required')
}).refine((data) => data.password === data.confirmPassword, {
    message: 'passwords do not match',

    path: ['confirmPassword'],
});

//vali schema for login
export const loginSchema = z.object({
    email: z.string()
        .email('please provide a valid email address')
        .min(1, 'email is required'),
    password: z.string()
        .min(1, 'password is required')
});
// schema validation middleware
export const validateSchema = (schema: z.ZodSchema<any>) => { 
    return (req: Request, res: Response, next: NextFunction) :void => { 
        try{ 
            const validatedData = schema.parse(req.body);  
            req.body = validatedData;
            next();
        }catch (error){
            if (error instanceof z.ZodError){
                const errors: ValidationError[]= error.issues.map((err:z.ZodIssue) => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                const response :ErrorResponse ={
                    success:false,
                    message:'validation error',
                    errors
                };
                res.status (400).json (response);
                return;
            } 
            res.status (500).json ({
                success:false,
                message:'internal server error'
            });
        }
    };
};
export const validateRegister = validateSchema(registerSchema); 
export const validateLogin = validateSchema(loginSchema);
// password validation middleware as the name suggests 
export const validatePasswordMiddleware = (req:Request,res:Response,next:NextFunction):void=>{
    const { password } = req.body;
    if (password) { // if password = we validate it
        const validation = validatePassword(password); //we use the util(hash) function
        if (!validation.isValid) { //valid or not 
            const response :ErrorResponse ={
                success:false,
                message:'password validation error',
                errors:[{
                    field:'password',
                    message:validation.messages
                }]
            };
            res.status (400).json (response);
            return;
        }
    }
    next();
};
// we sanitize input middleware
export const sanitizeInput = (req:Request,res:Response,next:NextFunction):void=>{
    // this prevent basic xss attacks 
    const sanitize = (obj :any):any => {
        if (typeof obj === 'string') { 
            return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''); // here we remove script tags
        }
        if (typeof obj === 'object' && obj !== null) {  // here we sanitize objects
            const sanitized: any = {};  
            for (const key in obj) {
                sanitized[key] = sanitize(obj[key]); 
            }
            return sanitized;
        }
        return obj;
    };
    req.body = sanitize(req.body);
    next(); // continue to next middleware
};  
export const validatePasswordResetSchema = z.object({
    email: z.string()
        .email('please provide a valid email address')
        .min(1, 'email is required')
        .max(100, 'email must be less than 100 characters'),
    resetToken: z.string()
        .min(1, 'reset token is required'),
    newPassword: z.string()
        .min(1, 'new password is required'),
    confirmNewPassword: z.string()
        .min(1, 'confirm new password is required')
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'new passwords do not match',
});
