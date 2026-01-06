
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../utils/jwt';
import User from '../models/userModel';

export const getDashboardData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const userData = await User.findByPk(userId, {
      attributes: ['username', 'total_exp', 'current_streak']
    });


    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    const leaderboard = await User.findAll({
      attributes: ['username', 'total_exp'],
      order: [['total_exp', 'DESC']],
      limit: 20
    });

    res.status(200).json({
      user: userData,
      leaderboard: leaderboard
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};