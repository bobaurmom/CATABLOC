import { Router } from 'express';
import { authenticateToken } from '../utils/jwt';
const router = Router();
//# Routes for /api/users 
/**
 * @swagger
 * /api/users/dashboard:
 *   get:
 *    summary: Get user dashboard data
 *   tags: [User Dashboard]
 *  responses:
 *    '200':
 *     description: "User dashboard data retrieved successfully"
 *    content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/DashboardData'
 *   '401':
 *    description: "Unauthorized"
 * 
 */
router.get('/dashboard', authenticateToken,);

export default router;

