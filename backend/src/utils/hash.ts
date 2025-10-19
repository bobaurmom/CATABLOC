
import bcrypt from "bcryptjs";
const SALT_ROUNDS = 12;

// Function to hash a password
export const hashPassword = async (password: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error("Error hashing password");
    }
}
// Function to compare a plain password with a hashed password
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error("Error comparing the password");
    }
}
// validate if a password meets the thing
export const validatePassword = (password: string): { isValid: boolean; messages: string } => {
    
    if (password.length < 8) {
        return { isValid: false, messages: "Password must be at least 8 characters long" };
    }
    if (!/[a-z]/.test(password)) {
        return { isValid: false, messages: "Password must contain at least one lowercase letter" };
    }
    if (!/[0-9]/.test(password)) {
        return { isValid: false, messages: "Password must contain at least one digit" };
    }

    return { isValid: true, messages: "Password is valid" };
}
