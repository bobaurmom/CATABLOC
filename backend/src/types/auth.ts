import { error } from 'console';

export interface RegisterRequest {
    email: string;
    password: string;
    username: string;
    confirmPassword: string;
}
export interface LoginRequest {
    email: string;
    password: string;
    username?: string;
}
export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        user?: {
            id: number;
            email: string;
            username: string;
            createdAt: Date;
        };
    };
    token?: string;
    refreshToken?: string;
}
export interface userResponse {
    success: boolean;
    message: string;
    data: {
        id: number;
        email: string;
        username: string;
        created_at: Date;
    };
}
export interface Validationerror {
    field: string;
    message: string;
}
export interface ErrorResponse {
    success: false;
    message: string;
    errors?: Validationerror[];
}
export interface successResponse {
    success: true;
    message: string;
    data?: any;
}
export interface ValidationError {
    field: string;
    message: string;
}
export type { JWTPayload, AuthenticatedRequest } from '../utils/jwt';

