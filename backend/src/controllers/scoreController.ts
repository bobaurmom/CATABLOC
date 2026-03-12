import { AuthenticatedRequest } from "../utils/jwt";
import { Request, Response } from "express";
import User from "../models/userModel";
import score from "../models/score";
import Level from "../models/Level";
import BoardData from "../models/boardData";
import sequelize from "../config/sequelize";
import { calculateFinalXP } from "../utils/calculatexp";

export const submitLevelScore = async (req: AuthenticatedRequest, res: Response) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { level_id, blocks_used, time_spent } = req.body;
    const user_id = req.user?.user_id;

    // Validation
    if (!user_id) {
      await transaction.rollback();
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!level_id || blocks_used === undefined || time_spent === undefined) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (blocks_used < 0 || time_spent < 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Invalid values for blocks_used or time_spent' });
    }

    // Check if level exists
    const levelData = await Level.findByPk(level_id);
    if (!levelData) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Level not found' });
    }

    // Fetch board data to get blocks_limit (board configuration)
    const boardData = await BoardData.findOne({
      where: { level_id: level_id },
      transaction
    });
    if (!boardData) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Level configuration not found' });
    }

    // Check if user already completed this level
    const existingScore = await score.findOne({
      where: {
        user_id: user_id,
        level_id: level_id
      },
      transaction
    });

    if (existingScore) {
      await transaction.rollback();
      return res.status(409).json({ 
        message: 'Level already completed',
        previous_score: {
          exp_gained: existingScore.exp_gained,
          blocks_used: existingScore.blocks_used,
          time_spent: existingScore.time_spent
        }
      });
    }

    // Calculate experience using blocks_limit from board_data
    const blocks_limit = boardData.block_limit || 10; // Default fallback
    const exp_gained = calculateFinalXP(levelData.difficulty, blocks_used, blocks_limit, time_spent, levelData.time_limit);

    // Update user stats
    const user = await User.findByPk(user_id, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user stats
    user.total_exp += exp_gained;
    user.levels_completed += 1;
    await user.save({ transaction });

    // Create score record
    await score.create({
      user_id: user_id,
      game_id: levelData.game_id,
      level_id: level_id,
      exp_gained: exp_gained,
      blocks_used: blocks_used,
      time_spent: time_spent
    }, { transaction });

    // Commit transaction
    await transaction.commit();

    res.status(200).json({ 
      message: 'Score submitted successfully', 
      exp_gained,
      total_exp: user.total_exp,
      levels_completed: user.levels_completed
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error submitting score:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
