import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET|| 'example';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export interface JWTPayload {
    userId: number ; 
    email: string;
    username: string;

}
export interface AuthenticatedRequest extends Request{
    user?:JWTPayload;
}
export const generateToken = async (payload:JWTPayload):Promise <string>=>{
    try{
        return jwt.sign(payload,JWT_SECRET,{
            expiresIn :JWT_EXPIRES_IN,
            issuer:'CATABLOC-API',
            audience:'CATABLOC-USER'
        }as jwt.SignOptions);
    }catch (error){
        throw new Error ('Error generating token');
    }
};
export const verifyToken = async (token:string):Promise <JWTPayload> =>{
    try{
        const decoded = jwt.verify(token,JWT_SECRET,{
            issuer:'CATABLOC-API',
            audience:'CATABLOC-USER'
        }) as JWTPayload;
        return decoded;
    }catch (error){
        if (error instanceof jwt.TokenExpiredError){
            throw new Error ('token expired');
        }else if (error instanceof jwt.JsonWebTokenError){
            throw new Error ('invalid token');
        }
        throw new Error ('error verifying token');
    }
};
export const extractTokenFromHeader = (authHeader:string|undefined):string|null=>{
    if (!authHeader){
        return null;
    }
    const parts = authHeader.split(' ');
    if (parts.length!=2||parts[0]!=='Bearer'){
        return null;
    }
    return parts[1]||null;
}
export const authenticateToken = async (
    req:AuthenticatedRequest,
    res:Response,
    next:NextFunction

):Promise <void>=>{
    try{
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);
        if (token ){
            const decoded = await verifyToken(token);
            req.user = decoded;
        }
        next();
    }catch (error){
        //continue wuthout authen if token invalid
        next();
    }
};
export const generateRefreshToken = async (payload: JWTPayload): Promise<string> => {
  try {
    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: '30d', // Refresh tokens last longer
      issuer: 'catabloc-api',
      audience: 'catabloc-client'
    });
  } catch (error) {
    throw new Error('Error generating refresh token');
  }
    
};