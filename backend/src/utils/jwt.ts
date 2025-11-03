import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Use different secrets for different token types
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET || 'reset-secret';

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'; // Shorter for access tokens

// Payload interfaces
export interface JWTPayload {
    userId: number;
    email: string;
    username: string;
}

export interface RefreshTokenPayload extends JWTPayload {
    type: 'refresh';
}

export interface ResetTokenPayload {
    email: string;
    type: 'password_reset';
}

// Extend request interface
export interface AuthenticatedRequest extends Request {
    user?: JWTPayload;
}

// Generate access token
export const generateToken = async (payload: JWTPayload): Promise<string> => {
    try {
        return jwt.sign(
            payload,
            JWT_ACCESS_SECRET,
            {
                expiresIn: JWT_EXPIRES_IN,
                issuer: 'catabloc-api',
                audience: 'catabloc-client'
            } as jwt.SignOptions
        );
    } catch (error) {
        throw new Error('Error generating access token');
    }
};

// Verify access token
export const verifyToken = async (token: string): Promise<JWTPayload> => {
    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET, {
            issuer: 'catabloc-api',
            audience: 'catabloc-client'
        }) as JWTPayload;
        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Token expired');
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid token');
        }
        throw new Error('Error verifying token');
    }
};

// Generate refresh token
export const generateRefreshToken = async (payload: JWTPayload): Promise<string> => {
    try {
        const refreshPayload: RefreshTokenPayload = {
            ...payload,
            type: 'refresh'
        };
        return jwt.sign(
            refreshPayload,
            JWT_REFRESH_SECRET, // Different secret!
            {
                expiresIn: '30d',
                issuer: 'catabloc-api',
                audience: 'catabloc-client'
            }
        );
    } catch (error) {
        throw new Error('Error generating refresh token');
    }
};

// Verify refresh token
export const verifyRefreshToken = async (token: string): Promise<RefreshTokenPayload> => {
    try {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
            issuer: 'catabloc-api',
            audience: 'catabloc-client'
        }) as RefreshTokenPayload;
        
        if (decoded.type !== 'refresh') {
            throw new Error('Invalid token type');
        }
        
        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Refresh token expired');
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid refresh token');
        }
        throw new Error('Error verifying refresh token');
    }
};

// Generate reset password token
export const generateResetPasswordToken = async (email: string): Promise<string> => {
    try {
        const payload: ResetTokenPayload = {
            email,
            type: 'password_reset'
        };
        return jwt.sign(
            payload,
            JWT_RESET_SECRET, // Different secret!
            {
                expiresIn: '15m',
                issuer: 'catabloc-api',
                audience: 'catabloc-client'
            }
        );
    } catch (error) {
        throw new Error('Error generating reset password token');
    }
};

// Verify reset password token
export const verifyResetPasswordToken = async (token: string): Promise<ResetTokenPayload> => {
    try {
        const decoded = jwt.verify(token, JWT_RESET_SECRET, {
            issuer: 'catabloc-api',
            audience: 'catabloc-client'
        }) as ResetTokenPayload;
        
        if (decoded.type !== 'password_reset') {
            throw new Error('Invalid token type');
        }
        
        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Reset token expired');
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid reset token');
        }
        throw new Error('Error verifying reset token');
    }
};


// Extract token from authorization header
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
    if (!authHeader) {
        return null;
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }
    return parts[1] || null;
};

// Middleware to REQUIRE authentication
export const authenticateToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);
        
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }
        
        const decoded = await verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : 'Invalid token'
        });
    }
};

// Middleware for OPTIONAL authentication
export const optionalAuth = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);
        
        if (token) {
            const decoded = await verifyToken(token);
            req.user = decoded;
        }
        next();
    } catch (error) {
        next();
    }
};
export const invalidateResetToken = (email: string, resetToken: string): void => {    
    try {
        const decoded = jwt.verify(resetToken, JWT_RESET_SECRET, {
            issuer: 'catabloc-api',
            audience: 'catabloc-client'
        }) as ResetTokenPayload;

        if (decoded.email !== email) {
            throw new Error('Invalid token');
        }

        // Invalidate the token (implementation depends on your strategy)
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Reset token expired');
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid reset token');
        }
        throw new Error('Error verifying reset token');
    }
};
