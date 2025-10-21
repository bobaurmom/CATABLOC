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
//in-memory user store need to replace with database
const emailToUser = new Map<string, fakeuser>();
let nextUserId = 1;
//new email register
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, username, password ,confirmPassword}: SignupRequest = req.body; //signup request body
        const normalEmail = email.toLowerCase(); //email casesensitive
        //unique email
        if (emailToUser.has(normalEmail)) { 
            const response: ErrorResponse = {
                success: false,
                message: 'email already exists'
            };
            res.status(400).json(response);
            return;
        }
        //unique username
        if ([...emailToUser.values()].some(user => user.username === username)) {
            const response: ErrorResponse = {
                success: false,
                message: 'username already exists'
            };
            res.status(400).json(response);
            return;
        }
        //password match confirm password
        if (password !== confirmPassword) {
            const response: ErrorResponse = {
                success: false,
                message: 'passwords do not match'
            };
            res.status(400).json(response);
            return;
        }
        const hashed = await hashPassword(password); //hash password
        const now = new Date(); //current date
        //create new user
        const newUser: fakeuser = {
            id: nextUserId++,
            email: normalEmail,
            username,
            password: hashed,
            created_at: now

        }
        emailToUser.set(normalEmail, newUser); //store user
        //generate token
        const token = await generateToken({
            userId: newUser.id,
            email: newUser.email,
            username: newUser.username
        });
        //refresh token
        const refreshToken = await generateRefreshToken({
            userId: newUser.id,
            email: newUser.email,
            username: newUser.username
        });
        const { password: _, ...userWithoutPassword } = newUser; //exclude password for security?
        const response: AuthResponse = { //response body
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
// login existing user
export const login = async (req: AuthenticatedRequest, res: Response): Promise<void> =>{
    try {
        const {email , password}:LoginRequest = req.body; //req body login
        const normalEmail = email.toLowerCase(); //email casesensitive
        const user = emailToUser.get(normalEmail); //get user from store
        //invalid email or password
        if(!user){
            const response: ErrorResponse ={
                success:false,
                message:'invalid email or password'
            };
            res.status(401).json(response);
            return;
        }
        const ok = await comparePassword (password,user.password); //compare password
        if(!ok){ //if invalid password
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
        //refresh token
        const refreshToken = await generateRefreshToken ({
            userId: user.id,
            email:user.email,
            username:user.username
        });
        const { password: _, ...userWithoutPassword } = user; //exclude password
        const response: AuthResponse = { //response body
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
