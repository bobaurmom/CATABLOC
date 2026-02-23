import sequelize from "../config/sequelize";
import { Session, Codeblock, Game, score } from "../models";
import Level from "../models/Level";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../utils/jwt";
import BoardData from "../models/boardData";
import { calculateFinalXP } from "../utils/calculatexp";
import { GridEngine } from '../engines/gridEngine';
import { validateCommandDepth} from "../utils/gameHelper";


type Direction = 'up' | 'right' | 'down' | 'left';
export interface Position {
  x: number;
  y: number;
}
export type GridPoint = Position;

//handle game session start and level fetching, verification, completion logic
export const startSession = async (req: AuthenticatedRequest, res: Response) => {
  const { level_id, game_id } = req.body;
  const user_id = req.user?.user_id;
  if (!game_id) {
    return res.status(400).json({ error: "game_id is required" });
  }
  if (!level_id) {
    return res.status(400).json({ error: "level_id is required" });
  }

  if (!user_id) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    // Verify the game exists
    const game = await Game.findByPk(game_id);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    // Verify the level exists and belongs to the specified game
    const level = await Level.findByPk(level_id);
    if (!level) {
      return res.status(404).json({ error: "Level not found" });
    }
    // verify game match to prevent mismatch between game_id and level_id
    if (level.game_id !== game_id) {
      return res.status(400).json({ error: "Level does not belong to the specified game" });
    }
    // create new session
    const session = await Session.create({
      game_id: game_id,
      user_id: user_id,
      level_id: level_id,
      started_at: new Date(),
      is_completed: false
    });

    res.status(201).json({ session_id: session.session_id });
  } catch (error) {
    console.error("START SESSION ERROR:", error);
    res.status(500).json({ error: "Failed to start session" });
  }
};
//function to get session details
export const getSessionDetails = async (req: AuthenticatedRequest, res: Response) => {
  const { session_id } = req.params;

  if (!session_id || isNaN(Number(session_id))) {
    return res.status(400).json({ error: "Invalid session ID" });
  }

  try {
    const session = await Session.findByPk(session_id, {
      include: [{
        model: Level,
        attributes: ['title'] 
      }]
    });

    if (!session || !session.Level) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Fetch board data (single source of truth for level layout)
    const boardData = await BoardData.findOne({ where: { level_id: session.level_id } });
    if (!boardData || !boardData.level_layout) {
      return res.status(404).json({ error: "Level layout not found" });
    }

    // Normalize level_layout handling - may be stored as string or object
    const layout = typeof boardData.level_layout === 'string'
      ? JSON.parse(boardData.level_layout)
      : boardData.level_layout;

    const cat_starting_grid = layout.cat_start;
    
    res.status(200).json({
      session_id: session.session_id,
      level_title: session.Level.title,
      cat_starting_grid
    });
  } catch (error: any) {
    // Log full error details on the server for debugging/monitoring
    console.error("GET SESSION DETAILS ERROR:", error);
    // Return a safe, generic error response to the client
    res.status(500).json({ 
      error: "Failed to fetch session details",
      errorCode: "SESSION_FETCH_FAILED"
    });
  }
};
//function to get level details
export const getLevel = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { level_id, game_id } = req.params;
    
    if (!level_id || isNaN(Number(level_id))) {
      return res.status(400).json({ error: "Invalid level ID" });
    }

    if (!game_id || isNaN(Number(game_id))) {
      return res.status(400).json({ error: "Invalid game ID" });
    }

    // Fetch the level from database with game_id filter
    const level = await Level.findOne({
      where: { 
        level_id: Number(level_id), 
        game_id: Number(game_id) 
      },
      include: [{
        model: Game,
        attributes: ['game_id','game_type', 'title']
      }]
    });

    if (!level) {
      return res.status(404).json({ error: "Level not found for the specified game" });
    }

    // Fetch board data (single source of truth for level layout)
    const boardData = await BoardData.findOne({ where: { level_id: Number(level_id) } });
    if (!boardData) {
      return res.status(404).json({ error: "Level layout not found" });
    }

    // Parse level_layout from board_data
    const level_layout = typeof boardData.level_layout === 'string' 
      ? JSON.parse(boardData.level_layout) 
      : boardData.level_layout;

    // Fetch available codeblocks for this level
    const codeblocks = await Codeblock.findAll({ 
      where: { level_id: Number(level_id) },
      attributes: ['codeblock_id', 'name', 'description', 'type']
    });
    
    const available_codeblocks = codeblocks.map((cb: any) => ({
      codeblock_id: cb.codeblock_id,
      name: cb.name,
      description: cb.description,
      type: cb.type
    }));

    res.status(200).json({
      level_id: level.level_id,
      game_id: level.game_id,
      level_number: level.level_number,
      title: level.title,
      description: level.description,
      difficulty: level.difficulty,
      available_codeblocks: available_codeblocks,
      level_layout: level_layout,
      blocks_limit: boardData.block_limit,
      time_limit: level.time_limit
    });

  } catch (error: any) {
    // Log full error details on the server for debugging/monitoring
    console.error("GET LEVEL ERROR:", error);
    // Return a safe, generic error response to the client
    res.status(500).json({
      error: "Failed to fetch level",
    });
  }
};



const ENGINE_MAP: Record<string, any> = {
  'puzzle': GridEngine,
};

const ALLOWED_ENGINES = Object.keys(ENGINE_MAP);
const MAX_COMMAND_LENGTH = 1000;

export const completeLevel = async (req: AuthenticatedRequest, res: Response) => {
  const { session_id, level_id, blocks_used, time_spent, commands } = req.body;
  const user_id = req.user?.user_id;

  if (!user_id) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!session_id) {
    return res.status(400).json({ error: "session_id is required" });
  }

  if (!level_id) {
    return res.status(400).json({ error: "level_id is required" });
  }

  if (commands.length > MAX_COMMAND_LENGTH) {
    return res.status(400).json({ error: `commands exceeds maximum length of ${MAX_COMMAND_LENGTH}` });
  }

  // Validate each command structure
  for (const command of commands) {
    if (typeof command !== "object" || command === null) {
      return res.status(400).json({ error: "Each command must be a non-null object" });
    }

    if (typeof command.type !== "string") {
      return res.status(400).json({ error: "Each command must have a string 'type' field" });
    }
  }

  // Validate optional numeric metrics
  if (blocks_used !== undefined && (typeof blocks_used !== "number" || Number.isNaN(blocks_used) || blocks_used < 0)) {
    return res.status(400).json({ error: "blocks_used must be a non-negative number" });
  }

  if (time_spent !== undefined && (typeof time_spent !== "number" || Number.isNaN(time_spent) || time_spent < 0)) {
    return res.status(400).json({ error: "time_spent must be a non-negative number" });
  }

  const t = await sequelize.transaction();

  try {
    // 1. Fetch Context
    const level = await Level.findByPk(level_id, { 
        include: [{ model: Game }], transaction: t 
    }) as any;

    if (!level) {
      await t.rollback();
      return res.status(404).json({ error: "Level not found" });
    }

    
    const board = await BoardData.findOne({ where: { level_id }, transaction: t });

    if (!board) {
      await t.rollback();
      return res.status(404).json({ error: "Board data not found for level" });
    }

    // Normalize board layout (can be stored as JSON string or object)
    const boardLayout = typeof board.level_layout === 'string'
      ? JSON.parse(board.level_layout)
      : board.level_layout;

    // 2. Select Engine
    const engine = ENGINE_MAP[level.Game.game_type];
    if (!engine) throw new Error(`No engine for ${level.Game.game_type}`);

    // 3. Execute Engine Logic
    const result = engine.verify(commands, boardLayout);

    if (!result.success) {
      await t.rollback();
      return res.status(400).json({ error: result.message, state: result.finalState });
    }

    // 4. Record Results (Shared logic for ALL games)

    // Validate runtime metrics from user input before using them
    const safeBlocksUsed = blocks_used ?? 0;
    const safeTimeSpent = time_spent ?? 0;

    const xp_earned = calculateFinalXP(
      level.difficulty,
      safeBlocksUsed,
      board.block_limit,
      safeTimeSpent,
      level.time_limit
    );

    await score.create(
      {
        user_id,
        game_id: level.game_id,
        level_id,
        exp_gained: xp_earned,
        blocks_used: safeBlocksUsed,
        time_spent: safeTimeSpent
      },
      { transaction: t }
    );
    
    // ... Update session and progress as you did before ...

    await t.commit();
    res.status(200).json({ success: true, xp_earned });

  } catch (error: any) {
    if (t) await t.rollback();
    console.error("COMPLETE LEVEL ERROR:", error);
    res.status(500).json({
      error: "An unexpected error occurred while completing the level.",
    });
  }
};


export const verifyLevel = async (req: AuthenticatedRequest, res: Response) => {
  const { session_id, commands } = req.body;
  const user_id = req.user?.user_id;

  // Validation
  if (!session_id) {
    return res.status(400).json({ error: "session_id is required" });
  }

  if (!user_id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!Array.isArray(commands)) {
    return res.status(400).json({ error: "commands must be an array" });
  }

  // Validate maximum command array length to prevent DoS
  if (commands.length > MAX_COMMAND_LENGTH) {
    return res.status(400).json({ 
      error: `commands array exceeds maximum length of ${MAX_COMMAND_LENGTH}` 
    });
  }

  try {
    const session = await Session.findByPk(session_id, {
      include: [{
        model: Level,
        include: [{ model: Game }]
      }]
    }) as any;

    // Verify session belongs to user
    if (session && session.user_id !== user_id) {
      return res.status(403).json({ error: "Session does not belong to user" });
    }

    if (!session?.Level || !session.Level.Game) {
      return res.status(404).json({ error: "Session, Level, or Game not found" });
    }

    // Prevent duplicate completions
    if (session.is_completed) {
      return res.status(400).json({ error: "Session already completed" });
    }

    // Validate command depth before execution
    validateCommandDepth(commands);

    // Fetch board data (single source of truth for level layout)
    const boardData = await BoardData.findOne({ where: { level_id: session.level_id } });
    if (!boardData) {
      return res.status(404).json({ error: "Level layout not found" });
    }

    // Get layout from board_data
    const layout = typeof boardData.level_layout === 'string' 
      ? JSON.parse(boardData.level_layout) 
      : boardData.level_layout;
    
    // Validate layout
    if (!layout.width || !layout.height || !layout.cat_start || !layout.goal) {
      return res.status(500).json({ error: "Invalid level layout configuration" });
    }

    // Select Engine
    const engine = ENGINE_MAP[session.Level.Game.game_type];
    if (!engine) throw new Error(`No engine for ${session.Level.Game.game_type}`);

    // Execute Engine Logic
    const result = engine.verify(commands, layout);

    res.json({ 
      success: result.success, 
      message: result.message,
      final_position: result.finalState?.position,
      goal_position: layout.goal
    });

  } catch (error: any) {
    // Log full error details on the server for debugging/monitoring
    console.error("VERIFY LEVEL ERROR:", error);
    // Return a safe, generic error response to the client
    res.status(500).json({ 
      error: "Failed to verify level",
    });
  }
};

