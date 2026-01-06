//# User schema & methods
import { Pool } from 'pg';
import { hashPassword , comparePassword} from '../utils/hash';
import { DataTypes } from 'sequelize';

export interface User {
    user_id: number;
    email: string;
    password: string;
    username: string;
    created_at: Date;
    total_exp: number;
    current_streak: number;
    profile_pic?: string;
}
export interface Userlogin {
    email: string;
    password: string;
    username?: string;
}
export interface UserSignup {
    email: string;
    password: string;
    username: string;
}


export default User;