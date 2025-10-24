import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../utils/hash";
import { generateToken, generateRefreshToken, AuthenticatedRequest } from "../utils/jwt";
import { RegisterRequest, LoginRequest, AuthResponse, ErrorResponse } from "../types/auth";

// type fakeuser = {
//     id: number;
//     email: string;
//     username: string;
//     password: string;
//     created_at: Date;
// };
import User from "../models/userModel";
export const register = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, username, password }: RegisterRequest = req.body;

    const normalizedEmail = email.toLowerCase();

    // Check if user already exists by email
    const existingEmailUser = await User.findOne({
      where: { email: normalizedEmail }
    });

    if (existingEmailUser) {
      const response: ErrorResponse = {
        success: false,
        message: 'User with this email already exists'
      };
      res.status(400).json(response);
      return;
    }

    // Check if username is taken
    const existingUsernameUser = await User.findOne({
      where: { username }
    });

    if (existingUsernameUser) {
      const response: ErrorResponse = {
        success: false,
        message: 'Username is already taken'
      };
      res.status(400).json(response);
      return;
    }

    // Hash password
    const hashed = await hashPassword(password);

    // Create new user in database
    const newUser = await User.create({
      email: normalizedEmail,
      username,
      password_hash: hashed
    });

    // Generate tokens
    const token = await generateToken({
      userId: (newUser as any).user_id,
      email: newUser.email,
      username: newUser.username
    });

    const refreshToken = await generateRefreshToken({
      userId: (newUser as any).user_id,
      email: newUser.email,
      username: newUser.username
    });

    // Remove password from response
    const userResponse = {
      id: (newUser as any).user_id,
      email: newUser.email,
      username: newUser.username,
      created_at: (newUser as any).created_at || newUser.created_at,
      updated_at: (newUser as any).updated_at || newUser.updated_at
    };

    const response: AuthResponse = {
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse as any
      },
      token,
      refreshToken
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Registration error:', error);
    
    const response: ErrorResponse = {
      success: false,
      message: error instanceof Error ? error.message : 'Registration failed'
    };

    res.status(400).json(response);
  }
};

// Login user
export const login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    const normalizedEmail = email.toLowerCase();

    // Find user by email
    const user = await User.findOne({
      where: { email: normalizedEmail }
    });

    if (!user) {
      const response: ErrorResponse = {
        success: false,
        message: 'Invalid email or password'
      };
      res.status(401).json(response);
      return;
    }

    // Verify password
    const passwordValid = await comparePassword(password, (user as any).password_hash);
    if (!passwordValid) {
      const response: ErrorResponse = {
        success: false,
        message: 'Invalid email or password'
      };
      res.status(401).json(response);
      return;
    }

    // Generate tokens
    const token = await generateToken({
      userId: (user as any).user_id,
      email: user.email,
      username: user.username
    });

    const refreshToken = await generateRefreshToken({
      userId: (user as any).user_id,
      email: user.email,
      username: user.username
    });

    // Prepare response without password
    const userResponse = {
      id: (user as any).user_id,
      email: user.email,
      username: user.username,
      created_at: (user as any).created_at || user.created_at,
      updated_at: (user as any).updated_at || user.updated_at
    };

    const response: AuthResponse = {
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse as any
      },
      token,
      refreshToken
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Login error:', error);
    
    const response: ErrorResponse = {
      success: false,
      message: error instanceof Error ? error.message : 'Login failed'
    };

    res.status(500).json(response);
  }
};
