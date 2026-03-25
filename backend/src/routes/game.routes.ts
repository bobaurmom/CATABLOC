//# Routes for /api/games
import { Router } from 'express';
import { startSession, getLevel, verifyLevel, completeLevel, getCodeblocks, getLevelsCount } from '../controllers/gameController';
import { authenticateToken } from '../utils/jwt';

const router = Router();

/**
 * @swagger
 * /api/games/start:
 *   post:
 *     summary: Start a new game session
 *     tags: [Game Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - game_id
 *               - level_id
 *             properties:
 *               game_id:
 *                 type: integer
 *               level_id:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: Session started
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Game or level not found
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.post('/start', authenticateToken, startSession);

/**
 * @swagger
 * /api/games/{game_id}/level/{level_id}:
 *   get:
 *     summary: Get level data by ID
 *     tags: [Game Levels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: level_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: game_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Optional game ID to validate level
 *     responses:
 *       '200':
 *         description: Level data retrieved
 *       '400':
 *         description: Invalid level or doesn't belong to game
 *       '404':
 *         description: Level not found
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
//router.get ('/{game_id}/level/:level_id',); this is the multi-game version
router.get('/:game_id/level/:level_id', authenticateToken, getLevel);

router.get('/:game_id/levels-count', authenticateToken, getLevelsCount);

/**
 * @swagger
 * /api/games/verify:
 *   post:
 *     summary: Verify a level solution (dry run)
 *     tags: [Game Levels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session_id
 *               - commands
 *             properties:
 *               session_id:
 *                 type: integer
 *               commands:
 *                 type: array
 *     responses:
 *       '200':
 *         description: Verification result
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Session doesn't belong to user
 *       '404':
 *         description: Session not found
 *       '500':
 *         description: Internal server error
 */
router.post('/verify', authenticateToken, verifyLevel);

/**
 * @swagger
 * /api/games/complete:
 *   post:
 *     summary: Complete a level and record score
 *     tags: [Game Levels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session_id
 *               - level_id
 *               - blocks_used
 *               - time_spent
 *               - commands
 *             properties:
 *               session_id:
 *                 type: integer
 *               level_id:
 *                 type: integer
 *               blocks_used:
 *                 type: integer
 *               time_spent:
 *                 type: integer
 *               commands:
 *                 type: array
 *     responses:
 *       '200':
 *         description: Level completed
 *       '400':
 *         description: Bad request or goal not reached
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Session doesn't belong to user
 *       '404':
 *         description: Session or level not found
 *       '500':
 *         description: Internal server error
 */
router.post('/complete', authenticateToken , completeLevel);

/**
 * @swagger
 * /api/games/codeblocks:
 *   get:
 *     summary: Get codeblocks (optionally filter by session)
 *     tags: [Game Codeblocks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: session_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter by session ID
 *     responses:
 *       '200':
 *         description: Codeblocks retrieved
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */

router.get('/codeblocks', authenticateToken, getCodeblocks);

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

export default router;