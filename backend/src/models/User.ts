//# User schema & methods
import { Pool } from 'pg';
import { hashPassword , comparePassword} from '../utils/hash';

export interface User {
    user_id: number;
    email: string;
    password: string;
    username: string;
    created_at: Date;
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