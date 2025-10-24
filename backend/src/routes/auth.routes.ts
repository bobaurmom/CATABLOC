import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { validateRegister,validateLogin,validatePasswordMiddleware,sanitizeInput } from '../middleware/validation';


const router = Router();
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
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
 *     tags: [Auth]
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
export default router;