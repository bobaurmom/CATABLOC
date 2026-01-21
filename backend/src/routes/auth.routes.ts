import { Router, Request, Response } from 'express';
import { register, login, sendOTP as sendOTPController, verifyOTP as verifyOTPController, resendOTP as resendOTPController, requestPasswordReset as forgotPasswordController, verifyAuth } from '../controllers/authController';
import { validateRegister,validateLogin,validatePasswordMiddleware,sanitizeInput  } from '../middleware/validation';
import { resetPassword as resetPasswordController } from '../controllers/authController';
import { authenticateToken } from '../utils/jwt';
import { profile } from '../controllers/authController';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const router = Router();

router.get('/', authenticateToken);

router.get('/me', authenticateToken, verifyAuth , profile );

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       '201':
 *         description: "User registered successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: "Invalid request"
 *       '409':
 *         description: "User already exists"
 */

router.post('/register', sanitizeInput, validateRegister, validatePasswordMiddleware, register); //register route
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       '200':
 *         description: "User logged in successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       '400':
 *         description: "Invalid request"
 *       '401':
 *         description: "Unauthorized"
 */
router.post('/login', sanitizeInput, validateLogin, login); //login route
/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP for email verification
 *     tags: [otp]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               type:
 *                 type: string
 *                 enum: [email_verification, password_reset]
 *             required: [email, type]
 *           example:
 *             email: "user@example.com"
 *             type: "email_verification"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request or OTP already sent
 *       429:
 *         description: Too many requests
 */
router.post('/send-otp', sanitizeInput, sendOTPController);
/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP code
 *     tags: [otp]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               code:
 *                 type: string
 *                 pattern: '^[0-9]{6}$'
 *               type:
 *                 type: string
 *                 enum: [email_verification, password_reset]
 *             required: [email, code, type]
 *           example:
 *             email: "user@example.com"
 *             code: "123456"
 *             type: "email_verification"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid OTP or expired
 *       429:
 *         description: Too many requests
 */
router.post('/verify-otp', sanitizeInput, verifyOTPController);

/**
 * @swagger
 * /api/auth/resend-otp:
 *   post:
 *     summary: Resend OTP code
 *     tags: [otp]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               type:
 *                 type: string
 *                 enum: [email_verification, password_reset]
 *             required: [email, type]
 *           example:
 *             email: "user@example.com"
 *             type: "email_verification"
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request
 *       429:
 *         description: Too many requests
 */
router.post('/resend-otp', sanitizeInput, resendOTPController);
/** 
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     tags: [otp]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             required:
 *               - email
 *           example:
 *             email: "user@example.com"
 *     responses:
 *       '200':
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       '400':
 *         description: Invalid email
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.post('/forgot-password', sanitizeInput, forgotPasswordController);
/**
 * @swagger
 * /api/auth/reset-password:
 *   patch:
 *     summary: Reset password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       '200':
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       '400':
 *         description: Invalid request
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.patch('/reset-password', sanitizeInput, resetPasswordController);
router.get('/verify-token', authenticateToken, (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Token is valid',
        user: req.user
    });
});
router.get('/verify', authenticateToken, verifyAuth);
router.post('/logout', authenticateToken, (req: Request, res: Response) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development',
        sameSite: 'lax',
    }
    );
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});
export default router;