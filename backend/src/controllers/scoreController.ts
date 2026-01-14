import { AuthenticatedRequest } from "../utils/jwt";
import { Request, Response } from "express";
import User from "../models/userModel";
import score from "../models/score";
import Level from "../models/Level";
import sequelize from "../config/sequelize";
import { calculateFinalXP } from "../utils/calculatexp";

export const submitLevelScore = async (req: AuthenticatedRequest, res: Response) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { levelId, blocksUsed, timeSpent } = req.body;
    const userId = req.user?.userId;

    // Validation
    if (!userId) {
      await transaction.rollback();
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!levelId || blocksUsed === undefined || timeSpent === undefined) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (blocksUsed < 0 || timeSpent < 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Invalid values for blocksUsed or timeSpent' });
    }

    // Check if level exists
    const levelData = await Level.findByPk(levelId);
    if (!levelData) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Level not found' });
    }

    // Check if user already completed this level
    const existingScore = await score.findOne({
      where: {
        user_id: userId,
        level_id: levelId
      },
      transaction
    });

    if (existingScore) {
      await transaction.rollback();
      return res.status(409).json({ 
        message: 'Level already completed',
        previousScore: {
          expGained: existingScore.exp_gained,
          blocksUsed: existingScore.blocks_used,
          timeSpent: existingScore.time_spent
        }
      });
    }

    // Calculate experience
    const expGained = calculateFinalXP(levelData.difficulty, blocksUsed, levelData.blocks_limit, timeSpent, levelData.time_limit);

    // Update user stats
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user stats
    user.total_exp += expGained;
    user.levels_completed += 1;
    await user.save({ transaction });

    // Create score record
    await score.create({
      user_id: userId,
      level_id: levelId,
      exp_gained: expGained,
      blocks_used: blocksUsed,
      time_spent: timeSpent
    }, { transaction });

    // Commit transaction
    await transaction.commit();

    res.status(200).json({ 
      message: 'Score submitted successfully', 
      expGained,
      totalExp: user.total_exp,
      levelsCompleted: user.levels_completed
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error submitting score:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
