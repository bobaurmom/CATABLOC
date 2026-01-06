import { Router } from 'express';
import { authenticateToken } from '../utils/jwt';
import { getDashboardData } from '../controllers/dashboardController';
import { checkUserActive } from '../middleware/dash';
const router = Router();

/**
 * @swagger
 * /api/dashboard/dashboard:
 *   get:
 *     summary: Get user dashboard data
 *     tags: [User Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     total_exp:
 *                       type: integer
 *                     current_streak:
 *                       type: integer
 *                 leaderboard:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       total_exp:
 *                         type: integer
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.get('/dashboard', authenticateToken , checkUserActive , getDashboardData );

export default router;