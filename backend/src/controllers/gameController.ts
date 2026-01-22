import sequelize from "../config/sequelize";
import { User, Session, Codeblock } from "../models";
import Level, { LevelProgress } from "../models/Level";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../utils/jwt";
import BoardData from "../models/boardData";
import { updateStreak } from "../utils/helpers";
import { calculateFinalXP } from "../utils/calculatexp";

type Direction = 'up' | 'right' | 'down' | 'left';

// convert direction string to normalized Direction type
const normalizeDirection = (dir: string): Direction => {
  const dirMap: Record<string, Direction> = {
    'up': 'up',
    'right': 'right', 
    'down': 'down',
    'left': 'left'
  };
  return dirMap[dir.toLowerCase()] || 'right';
};

export const startSession = async (req: AuthenticatedRequest, res: Response) => {
  const { level_id } = req.body;
  const user_id = req.user?.user_id;
  if (!level_id) {
    return res.status(400).json({ error: "level_id is required" });
  }

  if (!user_id) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const session = await Session.create({
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

export const getLevel = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { level_id } = req.params;
    if (!level_id || isNaN(Number(level_id))) {
      return res.status(400).json({ error: "Invalid level ID" });
    }

    // Fetch the level from database
    const level = await Level.findByPk(level_id);

    if (!level) {
      return res.status(404).json({ error: "Level not found" });
    }

    // Parse level_layout 
    const level_layout = typeof level.level_layout === 'string' 
      ? JSON.parse(level.level_layout) 
      : level.level_layout;

    // Parse available_codeblocks 
    const available_codeblocks = typeof level.available_codeblocks === 'string'
      ? JSON.parse(level.available_codeblocks)
      : level.available_codeblocks;

    res.status(200).json({
      level_id: level.level_id,
      game_id: level.game_id,
      level_number: level.level_number,
      title: level.title,
      description: level.description,
      difficulty: level.difficulty,
      available_codeblocks: available_codeblocks,
      level_layout: level_layout,
      blocks_limit: level.blocks_limit,
      time_limit: level.time_limit
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
  const { session_id, level_id, blocks_used, time_spent, commands } = req.body;
  
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  if (!session_id || !level_id || blocks_used === undefined || time_spent === undefined || !commands) {
    return res.status(400).json({ 
      error: "Missing required fields: session_id, level_id, blocks_used, time_spent, commands" 
    });
  }

  if (!Array.isArray(commands)) {
    return res.status(400).json({ error: "commands must be an array" });
  }

  if (typeof blocks_used !== 'number' || blocks_used < 0) {
    return res.status(400).json({ error: "blocks_used must be a non-negative number" });
  }

  if (typeof time_spent !== 'number' || time_spent < 0) {
    return res.status(400).json({ error: "time_spent must be a non-negative number" });
  }

  const user_id = req.user.user_id;
  
  let t;
  
  try {
    t = await sequelize.transaction();
    
    const session = await Session.findByPk(session_id, { transaction: t });
    
    if (!session) {
      await t.rollback();
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.user_id !== user_id) {
      await t.rollback();
      return res.status(403).json({ error: "Session does not belong to user" });
    }

    if (session.level_id !== level_id) {
      await t.rollback();
      return res.status(400).json({ error: "Session level_id does not match request level_id" });
    }

    const level = await Level.findByPk(level_id, { transaction: t });
    
    if (!level) {
      await t.rollback();
      return res.status(404).json({ error: "Level not found" });
    }

    const layout = level.level_layout;
    
    // Validate layout has required fields
    if (!layout.width || !layout.height || !layout.cat_start || !layout.goal) {
      await t.rollback();
      return res.status(500).json({ error: "Invalid level layout configuration" });
    }

    const width = layout.width;
    const height = layout.height;
    const cat_start = layout.cat_start;
    const goal = layout.goal;
    const obstacles = layout.obstacles || [];
    
    console.log('Goal position:', goal);

    let current_pos = { ...cat_start };
    let facing: Direction = normalizeDirection(layout.facing || 'right');
    
    // prevent infinite loops
    const MAX_ITERATIONS = 10000;
    let total_iterations = 0;

    // check if there's a wall in front
    const is_wall_ahead = (): boolean => {
      let check_pos = { ...current_pos };
      
      if (facing === 'up') check_pos.y -= 1;
      else if (facing === 'right') check_pos.x += 1;
      else if (facing === 'down') check_pos.y += 1;
      else if (facing === 'left') check_pos.x -= 1;
      
      // Check if out of bounds
      if (check_pos.x < 0 || check_pos.x >= width || 
          check_pos.y < 0 || check_pos.y >= height) {
        return true;
      }
      
      return obstacles.some((w: any) => 
        w && w.x === check_pos.x && w.y === check_pos.y
      );
    };

    // Recursive function to execute commands
    const execute_commands = async (command_list: any[]): Promise<void> => {
      let i = 0;
      
      while (i < command_list.length) {
        total_iterations++;
        
        if (total_iterations > MAX_ITERATIONS) {
          throw new Error("Maximum iterations exceeded - possible infinite loop");
        }
        
        const cmd = command_list[i];
        
        if (cmd === 'turn_right') {
          if (facing === 'up') facing = 'right';
          else if (facing === 'right') facing = 'down';
          else if (facing === 'down') facing = 'left';
          else if (facing === 'left') facing = 'up';
          i++;
          
        } else if (cmd === 'turn_left') {
          if (facing === 'up') facing = 'left';
          else if (facing === 'left') facing = 'down';
          else if (facing === 'down') facing = 'right';
          else if (facing === 'right') facing = 'up';
          i++;
          
        } else if (cmd === 'move_forward') {
          let next_pos = { ...current_pos };
          
          if (facing === 'up') next_pos.y -= 1;
          else if (facing === 'right') next_pos.x += 1;
          else if (facing === 'down') next_pos.y += 1;
          else if (facing === 'left') next_pos.x -= 1;
          
          // Check bounds
          if (next_pos.x < 0 || next_pos.x >= width || 
              next_pos.y < 0 || next_pos.y >= height) {
            throw new Error(`Invalid path: Out of bounds at position (${next_pos.x}, ${next_pos.y})`);
          }
          
          // Check obstacles
          const hit_wall = obstacles.some((w: any) => 
            w && w.x === next_pos.x && w.y === next_pos.y
          );
          
          if (hit_wall) {
            throw new Error(`Invalid path: Hit a wall at position (${next_pos.x}, ${next_pos.y})`);
          }
          
          current_pos = next_pos;
          i++;
          
        } else if (cmd?.type === 'repeat') {
          // Validate REPEAT command
          if (!cmd.count || cmd.count < 1) {
            throw new Error("REPEAT command must have a count >= 1");
          }
          
          if (!Array.isArray(cmd.commands)) {
            throw new Error("REPEAT command must have a commands array");
          }
          
          const repeat_count = cmd.count;
          const repeat_commands = cmd.commands;
          
          for (let r = 0; r < repeat_count; r++) {
            await execute_commands(repeat_commands);
          }
          i++;
          
        } else if (cmd?.type === 'while') {
          // Validate WHILE command
          if (!cmd.condition) {
            throw new Error("WHILE command must have a condition");
          }
          
          if (!Array.isArray(cmd.commands)) {
            throw new Error("WHILE command must have a commands array");
          }
          
          const condition = cmd.condition;
          const while_commands = cmd.commands;
          
          while (true) {
            total_iterations++;
            
            if (total_iterations > MAX_ITERATIONS) {
              throw new Error("Maximum iterations exceeded in WHILE loop");
            }
            
            let condition_met = false;
            
            if (condition === 'wall_ahead') {
              condition_met = is_wall_ahead();
            } else if (condition === 'not_wall_ahead') {
              condition_met = !is_wall_ahead();
            } else if (condition === 'not_at_goal') {
              condition_met = !(current_pos.x === goal.x && current_pos.y === goal.y);
            } else {
              throw new Error(`Unknown WHILE condition: ${condition}`);
            }
            
            if (!condition_met) break;
            
            await execute_commands(while_commands);
          }
          i++;
          
        } else if (cmd) {
          throw new Error(`Unknown command: ${JSON.stringify(cmd)}`);
        } else {
          i++; // Skip undefined commands
        }
      }
    };
    // Execute all commands
    await execute_commands(commands);

    // Check if goal was reached
    const reached_goal = current_pos.x === goal.x && current_pos.y === goal.y;
    
    if (!reached_goal) {
      await t.rollback();
      return res.status(400).json({ 
        error: "Level not completed: Goal not reached",
        final_position: current_pos,
        goal_position: goal
      });
    }

    // Calculate score based on blocks used and time spent
    const score = calculateFinalXP(
      level.difficulty, 
      blocks_used, 
      level.blocks_limit, 
      time_spent, 
      level.time_limit
    );

    // Update Session
    session.is_completed = true;
    session.ended_at = new Date();
    await session.save({ transaction: t });

    // Update Progress and check if it's a first-time completion
    const [progress, created] = await LevelProgress.findOrCreate({
      where: { user_id: user_id, level_id: level.level_id },
      defaults: {
        user_id: user_id,
        level_id: level.level_id, 
        best_score: score,
        attempts: 1,
        completed: 'completed',
        last_played_at: new Date()
      },
      transaction: t
    });
    
    let xp_earned = score;
    
    if (!created) {
      // Update existing progress
      const new_best = Math.max(progress.best_score, score);
      await progress.update({
        best_score: new_best,
        attempts: progress.attempts + 1,
        last_played_at: new Date()
      }, { transaction: t });
    } else {
      // First time completion - add bonus XP
      xp_earned += 100;
      
      // Increment level completion count
      await User.increment('levels_completed', {
        by: 1,
        where: { user_id: user_id },
        transaction: t
      });
    }

    // Always add XP to user (score + potential first-time bonus)
    await User.increment('total_exp', {
      by: xp_earned,
      where: { user_id: user_id },
      transaction: t
    });

    // Update user streak
    await updateStreak(user_id, t);

    // Commit transaction
    await t.commit();

    res.status(200).json({
      message: "Level verified and recorded!",
      first_time_completion: created,
      final_position: current_pos,
      goal_position: goal,
      score: score,
      xp_earned: xp_earned,
      bonus_xp: created ? 100 : 0
    });

  } catch (error: any) {
    // Rollback transaction if it exists and hasn't been committed
    if (t) {
      try {
        await t.rollback();
      } catch (rollbackError) {
        console.error("ROLLBACK ERROR:", rollbackError);
      }
    }
    console.error("COMPLETION ERROR:", error);
    res.status(500).json({
      error: "Failed to complete level",
      detail: error.message
    });
  }
};

export const getSessionDetails = async (req: AuthenticatedRequest, res: Response) => {
  const { session_id } = req.params;

  if (!session_id || isNaN(Number(session_id))) {
    return res.status(400).json({ error: "Invalid session ID" });
  }

  try {
    const session = await Session.findByPk(session_id, {
      include: [{
        model: Level,
        attributes: ['title', 'level_layout'] 
      }]
    });

    if (!session || !session.Level) {
      return res.status(404).json({ error: "Session not found" });
    }

    const cat_starting_grid = session.Level.level_layout.cat_start;
    
    res.status(200).json({
      session_id: session.session_id,
      level_title: session.Level.title,
      cat_starting_grid
    });
  } catch (error: any) {
    console.error("GET SESSION DETAILS ERROR:", error);
    res.status(500).json({ 
      error: "Failed to fetch session details",
      detail: error.message
    });
  }
};

export const verifyLevel = async (req: AuthenticatedRequest, res: Response) => {
  const { session_id, commands } = req.body;

  // Validation
  if (!session_id) {
    return res.status(400).json({ error: "session_id is required" });
  }

  if (!Array.isArray(commands)) {
    return res.status(400).json({ error: "commands must be an array" });
  }

  try {
    const session = await Session.findByPk(session_id, {
      include: [{
        model: Level,
        include: [{ model: BoardData, as: 'layout' }]
      }]
    });

    if (!session?.Level) {
      return res.status(404).json({ error: "Session or Level not found" });
    }

    // Get layout from database
    const layout = session.Level.level_layout;
    
    // Validate layout
    if (!layout.width || !layout.height || !layout.cat_start || !layout.goal) {
      return res.status(500).json({ error: "Invalid level layout configuration" });
    }

    const width = layout.width;   
    const height = layout.height;
    const obstacles = layout.obstacles || [];

    let current_pos = { ...layout.cat_start };
    let facing: Direction = normalizeDirection(layout.facing || 'right');

    // Execute commands
    for (const cmd of commands) {
      if (cmd === 'turn_right') { 
        if (facing === 'up') facing = 'right';
        else if (facing === 'right') facing = 'down';
        else if (facing === 'down') facing = 'left';
        else if (facing === 'left') facing = 'up';
        continue;
      }
      
      if (cmd === 'turn_left') { 
        if (facing === 'up') facing = 'left';
        else if (facing === 'left') facing = 'down';
        else if (facing === 'down') facing = 'right';
        else if (facing === 'right') facing = 'up';
        continue;
      }

      if (cmd === 'move_forward') {
        if (facing === 'up') current_pos.y -= 1;
        else if (facing === 'right') current_pos.x += 1;
        else if (facing === 'down') current_pos.y += 1;
        else if (facing === 'left') current_pos.x -= 1;
      }

      // Check bounds
      if (current_pos.x < 0 || current_pos.x >= width || 
          current_pos.y < 0 || current_pos.y >= height) {
        return res.json({ 
          success: false, 
          message: "Out of bounds!",
          position: current_pos
        });
      }

      // Check walls
      const is_wall = obstacles.some((w: any) => 
        w && w.x === current_pos.x && w.y === current_pos.y
      );
      
      if (is_wall) {
        return res.json({ 
          success: false, 
          message: "Hit a wall!",
          position: current_pos
        });
      }
    }

    // Check if goal reached
    const reached_goal = current_pos.x === layout.goal.x && current_pos.y === layout.goal.y;
    
    res.json({ 
      success: reached_goal, 
      message: reached_goal ? "Correct!" : "Failed to reach goal",
      final_position: current_pos,
      goal_position: layout.goal
    });

  } catch (error: any) {
    console.error("VERIFY LEVEL ERROR:", error);
    res.status(500).json({ 
      error: "Failed to verify level",
      detail: error.message
    });
  }
};

export const getAllCodeblocks = async (req: Request, res: Response) => {
  try {
    const blocks = await Codeblock.findAll();
    res.status(200).json(blocks);
  } catch (error: any) {
    console.error("GET ALL CODEBLOCKS ERROR:", error);
    res.status(500).json({ 
      message: 'Error fetching blocks', 
      error: error.message 
    });
  }
};