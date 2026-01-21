//# Routes for /api/games
import { Router } from 'express';
import { startSession, getLevel, completeLevel, verifyLevel ,getAllCodeblocks} from '../controllers/gameController';
import { authenticateToken } from '../utils/jwt';
import { get } from 'http';

const router = Router();
/**
 * @swagger
 * /api/games/start:
 *   post:
 *     summary: Start a new game session
 *     tags: [Game Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '201':
 *         description: Game session started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 session_id:
 *                   type: integer
 *               description: ID of the started session
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post('/start', authenticateToken, startSession);
/**
 * @swagger
 * /api/games/level/{id}:
 *   get:
 *     summary: Get level data by ID
 *     tags: [Game Levels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Level ID
 *     responses:
 *       '200':
 *         description: Level data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Level'
 *       '404':
 *         description: Level not found
 *       '500':
 *         description: Internal server error
 */
router.get('/level/:level_id', authenticateToken, getLevel);
/**
 * @swagger
 * /api/games/complete:
 *   post:
 *     summary: Complete a level and record the score
 *     tags: [Game Levels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Level completed and score recorded successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.post('/complete', authenticateToken, completeLevel);
router.get('/block', getAllCodeblocks);
export default router;