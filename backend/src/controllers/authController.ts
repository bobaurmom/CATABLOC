import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../utils/hash";
import { generateToken, generateRefreshToken, AuthenticatedRequest } from "../utils/jwt";
import { SignupRequest, LoginRequest, AuthResponse, ErrorResponse } from "../types/auth";

type fakeuser = {
    id: number;
    email: string;
    username: string;
    password: string;
    created_at: Date;
};
const emailToUser = new Map<string, fakeuser>();
let nextUserId = 1;
//new email
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, username, password }: SignupRequest = req.body;
        const normalEmail = email.toLowerCase();
        if (emailToUser.has(normalEmail)) {
            const response: ErrorResponse = {
                success: false,
                message: 'email already exists'
            };
            res.status(400).json(response);
            return;
        }
        //unique username??


        //generatetoken
        const hashed = await hashPassword(password);
        const now = new Date();
        const newUser: fakeuser = {
            id: nextUserId++,
            email: normalEmail,
            username,
            password: hashed,
            created_at: now

        }
        emailToUser.set(normalEmail, newUser);

        const token = await generateToken({
            userId: newUser.id,
            email: newUser.email,
            username: newUser.username
        });
        const refreshToken = await generateRefreshToken({
            userId: newUser.id,
            email: newUser.email,
            username: newUser.username
        });
        const { password: _, ...userWithoutPassword } = newUser;
        const response: AuthResponse = {
            success: true,
            message: 'user register successful',
            data: {
                user: userWithoutPassword
            },
            token,
            refreshToken
        };
        res.status(201).json(response);
    } catch (err) {
        const response: ErrorResponse = {
            success: false,
            message: 'internal server error'
        };
        res.status(500).json(response);
    }

};
export const login = async (req: AuthenticatedRequest, res: Response): Promise<void> =>{
    try {
        const {email , password}:LoginRequest = req.body;
        const normalEmail = email.toLowerCase();
        const user = emailToUser.get(normalEmail);
        if(!user){
            const response: ErrorResponse ={
                success:false,
                message:'invalid email or password'
            };
            res.status(401).json(response);
            return;
        }
        const ok = await comparePassword (password,user.password);
        if(!ok){
            const response : ErrorResponse ={
                success:false,
                message:'invalid email or password'
            };
            res.status(401).json(response);
            return;
        }
        //generatetoken
        const token = await generateToken({
            userId: user.id,
            email:user.email,
            username:user.username
        });
        const refreshToken = await generateRefreshToken ({
            userId: user.id,
            email:user.email,
            username:user.username
        });
        const { password: _, ...userWithoutPassword } = user;
        const response: AuthResponse = {
            success: true,
            message: 'user login successful',
            data: {
                user: userWithoutPassword
            },
            token,
            refreshToken
        };
        res.status(200).json(response);

    }catch (error) {
        console.error('login error:', error);
        const response: ErrorResponse = {
            success: false,
            message: 'internal server error'
        };
        res.status(500).json(response);
    }
};
