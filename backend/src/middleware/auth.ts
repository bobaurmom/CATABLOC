//# JWT token verification
import { NextFunction, Response ,Request} from "express";
import { ErrorResponse } from "../types/auth";

export const errorHandler = (error:Error,req:Request,res:Response,next:NextFunction):void=>{
    console.error('error:',error);

    //error response
    const response : ErrorResponse ={
        success:false,
        message:process.env.NODE_ENV==='production' ? 'internal server error' : error.message
    };
    //specific error handling
    if (error.name === 'validationError'){
        response.message = 'validation error';
        res.status(400);
    }else if(error.name === 'UnauthorizedError'){
        response.message = 'unauthorized';
        res.status(401);
    }else if(error.name === 'ForbiddenError'){
        response.message = 'forbidden';
        res.status(403);
    }else if (error.name === 'NotFoundError'){
        response.message = 'not found';
        res.status(404);
    }else if (error.name === 'ConflictError'){
        response.message = 'conflict';
        res.status(409);
    }else if (error.name === 'tooManyRequestsError'){
        response.message = 'too many requests';
        res.status(429);
    }else {
        res.status(500);
    }
    res.json (response);
};
//404 not found
export const NotFoundHandler = (req:Request,res:Response):void=>{
    const response : ErrorResponse ={
        success:false,
        message:`Route ${req.method} ${req.path} not found`
    };
    res.status (404).json (response);
}; //async handler to wrap async functions and catch errors
export const asyncHandler = (fn:Function)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        Promise.resolve (fn (req,res,next)).catch (next);
    };  
};