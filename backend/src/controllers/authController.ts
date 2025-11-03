import e, { Request, Response } from "express";
import { comparePassword, hashPassword } from "../utils/hash";
import { generateToken, generateRefreshToken, AuthenticatedRequest ,generateResetPasswordToken, verifyResetPasswordToken } from "../utils/jwt";
import { RegisterRequest, LoginRequest, AuthResponse, ErrorResponse, EmailVerificationRequest, ResetPasswordRequest } from "../types/auth";
import { sendOTP as sendOTPService , verifyOTP as verifyOTPService , resendOTP as resendOTPService, incrementOTPAttempts } from '../service/otpgenerator';

import User from "../models/userModel";


export const register = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, username, password }: RegisterRequest = req.body;

    const normalizedEmail = email.toLowerCase();
    const normalizedUsername = username.toLowerCase();
    const pendingUsers = await User.findAll({
      where: { email: normalizedEmail, status: 'pending' }
    });
    // Delete pending users with the same email
    if(pendingUsers){
      await User.destroy({ where: { email: normalizedEmail, status: 'pending' } });
    }
    // Check if user already exists by email
    const existingEmailUser = await User.findOne({
      where: { email: normalizedEmail, status: 'active' }
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
    const existingUsernameUser = await User.findOne({ where: { username: username ,status: 'active'}});
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
      username: username,
      password_hash: hashed,
      status: 'pending'
    });
    //send OTP after registration
    const otpResult = await sendOTPService({ email: normalizedEmail, type: 'email_verification' });
    if (!otpResult.success) {
      await User.destroy({ where: { user_id: newUser.user_id } });
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP. '
      });
      return;
    }
  } 
  catch (error) {
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
    const { email, password ,status }: LoginRequest = req.body;

    const normalizedEmail = email.toLowerCase();

    // Find user by email
    const user = await User.findOne({
      where: { email: normalizedEmail ,status:"active"}
    });

    if (!user || user.status !== 'active') {
      const response: ErrorResponse = {
        success: false,
        message: 'Invalid email or password'
      };
      res.status(401).json(response);
      return;
    }
    //hash password
    // Verify password
    const passwordValid = await comparePassword(password, user.password_hash);
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
      userId: user.user_id,
      email: user.email,
      username: user.username
    });

    const refreshToken = await generateRefreshToken({
      userId: user.user_id,
      email: user.email,
      username: user.username
    });

    // Prepare response without password
    const userResponse = {
      user_id: user.user_id,
      email: user.email,
      username: user.username,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    const response: AuthResponse = {
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse as any,
        token,
        refreshToken
      }
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
//send otp
export const sendOTP = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, type } = req.body;

    if (!email || !type) {
      const response: ErrorResponse = {
        success: false,
        message: 'Email and type are required'
      };
      res.status(400).json(response);
      return;
    }

    const result = await sendOTPService({ email, type });
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    
    const response: ErrorResponse = {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send OTP'
    };

    res.status(500).json(response);
  }
};

// Verify OTP
export const verifyOTP = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, code, type } = req.body;

    if (!email || !code || !type) {
      const response: ErrorResponse = {
        success: false,
        message: 'Email, code, and type are required'
      };
      res.status(400).json(response);
      return;
    }

    const result = await verifyOTPService({ email, hashedOTPCode: code, type });
    
    if (result.success) {
      //find user with pending
      const user = await User.findOne({
        where: { email, status: 'pending' }
      });
      if (!user) {
        res.status(400).json({
          success: false,
          message: 'No pending user found for this email'
        });
        return;
      }
      // Update user status to 'active'
      await User.update({ status: 'active' }, { where: { email } });

    // Generate token 
    const token = await generateToken({
      userId: user.user_id,
      email: user.email,
      username: user.username
    });

    const refreshToken = await generateRefreshToken({
      userId: user.user_id,
      email: user.email,
      username: user.username
    });

    //Remove password from response
    const userResponse = {
      user_id: user.user_id,
      email: user.email,
      username: user.username,
      created_at: user.created_at,
      updated_at: user.updated_at
    };


    const response: AuthResponse = {
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token,
        refreshToken 
      } 
    };
    res.status(200).json(response);
    } else {

      await incrementOTPAttempts(email, code, type);
      //delete user if max attempts reached
      if(result.message === 'Maximum OTP verification attempts exceeded. Please request a new OTP.'){
        const deleted = await User.destroy({ where: { email } });
        console.log(`[VerifyOTP] Deleted ${deleted} user(s) after max OTP attempts for email: ${email}`);
      }
      
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
    

  } catch (error) {
    console.error('Verify OTP error:', error);
    
    const response: ErrorResponse = {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to verify OTP'
    };

    res.status(500).json(response);
  }
};

// Resend OTP
export const resendOTP = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, type } = req.body;

    if (!email || !type) {
      const response: ErrorResponse = {
        success: false,
        message: 'Email and type are required'
      };
      res.status(400).json(response);
      return;
    }

    const result = await resendOTPService({ email, type });
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    
    const response: ErrorResponse = {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to resend OTP'
    };

    res.status(500).json(response);
  }
};


// Request password reset (sends OTP)
export const requestPasswordReset = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email }: { email: string } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      where: { email: normalizedEmail, status: 'active' }
    });

    // Always return success to prevent email enumeration
    if (!user) {
      res.status(200).json({
        success: true,
        message: 'If your email is registered, a reset code has been sent.'
      });
      return;
    }

    // Send OTP for password reset
    const result = await sendOTPService({ 
      email: normalizedEmail, 
      type: 'password_reset' 
    });
    
    if (!result.success) {
      res.status(400).json({ success: false, message: result.message });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'If your email is registered, a reset code has been sent.'
    });

  } catch (error) {
    console.error('Request Password Reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process request'
    });
  }
};

// 2. Verify OTP code
export const verifyResetCode = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, code }: { email: string; code: string } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const otpResult = await verifyOTPService({ 
      email: normalizedEmail, 
      hashedOTPCode: code, 
      type: 'password_reset' 
    });

    if (!otpResult.success) {
      res.status(400).json({ success: false, message: otpResult.message });
      return;
    }

    // Generate a short-lived reset token (optional but recommended)
    // This proves the user verified the OTP
    const resetToken = await generateResetPasswordToken(normalizedEmail);

    res.status(200).json({
      success: true,
      message: 'Code verified successfully',
      resetToken // Send this to client to use in next step
    });

  } catch (error) {
    console.error('Verify Reset Code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify code'
    });
  }
};

//Reset password (requires verified token)
export const resetPassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { resetToken, newPassword, confirmNewPassword } = req.body;

        if (!newPassword || !confirmNewPassword) {
            res.status(400).json({
                success: false,
                message: 'New password and confirmation are required'
            });
            return;
        }

        if (newPassword !== confirmNewPassword) {
            res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
            return;
        }

        // Verify reset token
        const decoded = await verifyResetPasswordToken(resetToken);
        const normalizedEmail = decoded.email.toLowerCase().trim();

        // Update password
        const hashedPassword = await hashPassword(newPassword);
        await User.update(
            { password_hash: hashedPassword },
            { where: { email: normalizedEmail, status: 'active' } }
        );
        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Reset Password error:', error);
        res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : 'Invalid or expired reset token'
        });
    }
};

