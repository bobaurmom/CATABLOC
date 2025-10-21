import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET|| 'example';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
//payload interface
export interface JWTPayload {
    userId: number ; 
    email: string;
    username: string;

}
//extend request interface
export interface AuthenticatedRequest extends Request{
    user?:JWTPayload;
}
//generate token function
export const generateToken = async (payload:JWTPayload):Promise <string>=>{
    try{
        return jwt.sign(payload,JWT_SECRET,{ //options
            expiresIn :JWT_EXPIRES_IN,
            issuer:'CATABLOC-API',
            audience:'CATABLOC-USER'
        }as jwt.SignOptions);
    }catch (error){
        throw new Error ('Error generating token');
    }
};
//verify token function
export const verifyToken = async (token:string):Promise <JWTPayload> =>{
    try{
        const decoded = jwt.verify(token,JWT_SECRET,{ //options
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
//extract token from authorization header
export const extractTokenFromHeader = (authHeader:string|undefined):string|null=>{
    if (!authHeader){ //if no header
        return null;
    }
    const parts = authHeader.split(' '); //split by space
    if (parts.length!=2||parts[0]!=='Bearer'){ //we check format
        return null;
    }
    return parts[1]||null;
}
//middleware to authenticate token
export const authenticateToken = async ( req:AuthenticatedRequest,res:Response,next:NextFunction):Promise <void>=>{ 
    try{
        const authHeader = req.headers.authorization; //get auth header
        const token = extractTokenFromHeader(authHeader); //extract the token
        if (token ){
            const decoded = await verifyToken(token); //verify 
            req.user = decoded;
        }
        next();
    }catch (error){
        //continue wuthout authen if token invalid
        next();
    }
};
//generate refresh token function after certain day
export const generateRefreshToken = async (payload: JWTPayload): Promise<string> => {
  try {
    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: '30d', // Refresh tokens last for 30 days 
      issuer: 'catabloc-api',
      audience: 'catabloc-client'
    });
  } catch (error) {
    throw new Error('Error generating refresh token');
  }
    
};