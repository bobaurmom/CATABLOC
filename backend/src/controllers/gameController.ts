//# Validate answers, update scores
import sequelize from "../config/sequelize";
import { User, Session } from "../models";
import Level, { LevelProgress } from "../models/Level";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../utils/jwt";
import BoardData from "../models/boardData";
import { updateStreak } from "../utils/helpers";

export const startSession = async (req: AuthenticatedRequest, res: Response) => {
  const { levelId } = req.body;
  const userId = req.user?.userId;

  try {
    const session = await Session.create({
      user_id: userId!,
      level_id: levelId,
      started_at: new Date(),
      is_completed: false
    });

    res.status(201).json({ sessionId: session.session_id });
  } catch (error) {
    res.status(500).json({ error: "Failed to start session" });
  }
};
export const getLevel = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { levelId } = req.params;

    // Validate levelId
    if (!levelId || isNaN(Number(levelId))) {
      return res.status(400).json({ error: "Invalid level ID" });
    }

    // Fetch the level from database
    const level = await Level.findByPk(levelId);

    if (!level) {
      return res.status(404).json({ error: "Level not found" });
    }

    // Parse level_layout if it's stored as a string
    const levelLayout = typeof level.level_layout === 'string' 
      ? JSON.parse(level.level_layout) 
      : level.level_layout;

    // Parse available_codeblocks if it's stored as a string
    const availableCodeblocks = typeof level.available_codeblocks === 'string'
      ? JSON.parse(level.available_codeblocks)
      : level.available_codeblocks;

    // Return the level data
    res.status(200).json({
      level_id: level.level_id,
      game_id: level.game_id,
      level_number: level.level_number,
      title: level.title,
      description: level.description,
      difficulty: level.difficulty,
      available_codeblocks: availableCodeblocks,
      level_layout: levelLayout
    });

  } catch (error: any) {
    console.error("GET LEVEL ERROR:", error);
    res.status(500).json({
      error: "Failed to fetch level",
      detail: error.message
    });
  }
};


export const completeLevel = async (req: AuthenticatedRequest, res: Response) => {
  const { sessionId, levelId, score, commands } = req.body;
  
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  if (!sessionId || !levelId || score === undefined || !commands) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const userId = req.user.userId;
  
  // Declare transaction ONCE at the top level
  let t = await sequelize.transaction();
  
  try {
    const session = await Session.findByPk(sessionId);
    
    if (!session) {
      await t.rollback();
      return res.status(404).json({ error: "Session not found" });
    }

    // Fetch the level based on the levelId from the request body
    const level = await Level.findByPk(levelId);
    
    if (!level) {
      await t.rollback();
      return res.status(404).json({ error: "Level not found" });
    }

    const layout = level.level_layout;
    
    // Provide defaults using Nullish Coalescing operator
    const width = layout.width ?? 5;
    const height = layout.height ?? 5;
    const catStart = layout.catStart ?? { x: 0, y: 0 };
    const goal = layout.goal ;
    const walls = layout.walls ?? [];
    console.log('🎯 Goal position:', goal);

    if (!goal) {
    throw new Error('Goal position not found in level layout');
  }

    let currentPos = { ...catStart };
    const directionMap: Record<string, 'up' | 'right' | 'down' | 'left'> = {
      "up": "up",
      "right": "right",
      "down": "down",
      "left": "left"
    };

// Start facing the direction defined in the level layout
  let facing = directionMap[layout.facing] ?? 'right';
    
    // Maximum iterations to prevent infinite loops
    const MAX_ITERATIONS = 10000;
    let totalIterations = 0;

    // Helper function to check if there's a wall in front
    const isWallAhead = () => {
      let checkPos = { ...currentPos };
      
      if (facing === 'up') checkPos.y -= 1;
      else if (facing === 'right') checkPos.x += 1;
      else if (facing === 'down') checkPos.y += 1;
      else if (facing === 'left') checkPos.x -= 1;
      
      // Check if out of bounds
      if (checkPos.x < 0 || checkPos.x >= width || 
          checkPos.y < 0 || checkPos.y >= height) {
        return true; // Treat out of bounds as a wall
      }
      
      return walls.some((w: any) => 
        w && w.x === checkPos.x && w.y === checkPos.y
      );
    };

    // Recursive function to execute commands
    const executeCommands = async (commandList: any[]): Promise<void> => {
      let i = 0;
      
      while (i < commandList.length) {
        totalIterations++;
        
        if (totalIterations > MAX_ITERATIONS) {
          throw new Error("Maximum iterations exceeded - possible infinite loop");
        }
        
        const cmd = commandList[i];
        
        if (cmd === 'TURN_RIGHT') {
          if (facing === 'up') facing = 'right';
          else if (facing === 'right') facing = 'down';
          else if (facing === 'down') facing = 'left';
          else if (facing === 'left') facing = 'up';
          i++;
          
        } else if (cmd === 'TURN_LEFT') {
          if (facing === 'up') facing = 'left';
          else if (facing === 'left') facing = 'down';
          else if (facing === 'down') facing = 'right';
          else if (facing === 'right') facing = 'up';
          i++;
          
        } else if (cmd === 'MOVE_FORWARD') {
          let nextPos = { ...currentPos };
          
          if (facing === 'up') nextPos.y -= 1;
          else if (facing === 'right') nextPos.x += 1;
          else if (facing === 'down') nextPos.y += 1;
          else if (facing === 'left') nextPos.x -= 1;
          
          // Check bounds
          if (nextPos.x < 0 || nextPos.x >= width || 
              nextPos.y < 0 || nextPos.y >= height) {
            throw new Error(`Invalid path: Out of bounds at position (${nextPos.x}, ${nextPos.y})`);
          }
          
          // Check walls
          const hitWall = walls.some((w: any) => 
            w && w.x === nextPos.x && w.y === nextPos.y
          );
          
          if (hitWall) {
            throw new Error(`Invalid path: Hit a wall at position (${nextPos.x}, ${nextPos.y})`);
          }
          
          currentPos = nextPos;
          i++;
          
        } else if (cmd.type === 'REPEAT') {
          // REPEAT structure: { type: 'REPEAT', count: 3, commands: [...] }
          const repeatCount = cmd.count || 0;
          const repeatCommands = cmd.commands || [];
          
          for (let r = 0; r < repeatCount; r++) {
            await executeCommands(repeatCommands);
          }
          i++;
          
        } else if (cmd.type === 'WHILE') {
          // WHILE structure: { type: 'WHILE', condition: 'wallAhead', commands: [...] }
          const condition = cmd.condition;
          const whileCommands = cmd.commands || [];
          
          while (true) {
            totalIterations++;
            
            if (totalIterations > MAX_ITERATIONS) {
              throw new Error("Maximum iterations exceeded in WHILE loop");
            }
            
            let conditionMet = false;
            
            if (condition === 'wallAhead') {
              conditionMet = isWallAhead();
            } else if (condition === 'notWallAhead') {
              conditionMet = !isWallAhead();
            } else if (condition === 'notAtGoal') {
              conditionMet = !(currentPos.x === goal.x && currentPos.y === goal.y);
            }
            
            if (!conditionMet) break;
            
            await executeCommands(whileCommands);
          }
          i++;
          
        } else {
          i++; // Skip unknown commands
        }
      }
    };

    // Execute all commands
    await executeCommands(commands);

    // Check if goal was reached
    const reachedGoal = currentPos.x === goal.x && currentPos.y === goal.y;
    
    if (!reachedGoal) {
      await t.rollback();
      return res.status(400).json({ 
        error: "Level not completed: Goal not reached",
        finalPosition: currentPos,
        goalPosition: goal
      });
    }

    // Update Session
    session.is_completed = true;
    session.ended_at = new Date();
    await session.save({ transaction: t });

    // Update Progress and check if it's a first-time win
    const [progress, created] = await LevelProgress.findOrCreate({
      where: { user_id: userId, level_id: levelId },
      defaults: {
        user_id: userId,
        level_id: levelId,
        best_score: score,
        attempts: 1,
        completed: 'completed',
        last_played_at: new Date()
      },
      transaction: t
    });

    if (!created) {
      // Update existing progress
      const newBest = Math.max(progress.best_score, score);
      await progress.update({
        best_score: newBest,
        attempts: progress.attempts + 1,
        last_played_at: new Date()
      }, { transaction: t });
    } else {
      // First time completion bonus
      await User.increment('total_exp', {
        by: 100,
        where: { user_id: userId },
        transaction: t
      });
    }

    // Update user streak
    await updateStreak(userId, t);

    // Commit transaction
    await t.commit();

    res.status(200).json({
      message: "Level verified and recorded!",
      newLevelUnlocked: created,
      finalPosition: currentPos,
      score: score
    });

  } catch (error: any) {
    // Rollback transaction if it exists
    if (t) {
      await t.rollback();
    }
    console.error("COMPLETION ERROR:", error);
    res.status(500).json({
      error: "Failed to complete level",
      detail: error.message
    });
  }
};

export const getSessionDetails = async (req: AuthenticatedRequest, res: Response) => {
  const { sessionId } = req.params;

  const session = await Session.findByPk(sessionId, {
    include: [{
      model: Level,
      attributes: ['title', 'level_layout'] 
    }]
  });

  if (!session || !session.Level) {
    return res.status(404).json({ error: "Session not found" });
  }

  const catStartingGrid = session.Level.level_layout.catStart;
  res.status(200).json({
    sessionId: session.session_id,
    levelTitle: session.Level.title,
    catStartingGrid
  });
};
export const verifyLevel = async (req: AuthenticatedRequest, res: Response) => {
  const { sessionId, commands } = req.body;

  try {
    const session = await Session.findByPk(sessionId, {
      include: [{
        model: Level,
        include: [{ model: BoardData, as: 'layout' }]
      }]
    });

    if (!session?.Level) return res.status(404).json({ error: "Session or Level not found" });

    // GET DYNAMIC DIMENSIONS FROM DATABASE
    const layout = session.Level.level_layout;
    const width = layout.width;   
    const height = layout.height;

    let currentPos = { ...layout.catStart };
    let facing = 0; 

    for (const cmd of commands) {
      if (cmd === 'TURN_RIGHT') { facing = (facing + 1) % 4; continue; }
      if (cmd === 'TURN_LEFT') { facing = (facing + 3) % 4; continue; }

      if (cmd === 'MOVE_FORWARD') {
        if (facing === 0) currentPos.y -= 1;
        if (facing === 1) currentPos.x += 1;
        if (facing === 2) currentPos.y += 1;
        if (facing === 3) currentPos.x -= 1;
      }

      // uses the actual width/height of the specific level
      if (currentPos.x < 0 || currentPos.x >= width || currentPos.y < 0 || currentPos.y >= height) {
        return res.json({ success: false, message: "Out of bounds!" });
      }

      const isWall = layout.walls.some(w => w.x === currentPos.x && w.y === currentPos.y);
      if (isWall) return res.json({ success: false, message: "Hit a wall!" });
    }

    const reachedGoal = currentPos.x === layout.goal.x && currentPos.y === layout.goal.y;
    res.json({ 
      success: reachedGoal, 
      message: reachedGoal ? "Correct!" : "Failed to reach goal" 
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to verify level" });
  }
};
