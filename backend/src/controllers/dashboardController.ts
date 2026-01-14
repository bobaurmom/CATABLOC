import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../utils/jwt';
import User from '../models/userModel';

const getDashboardData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Fetch user data
    const userData = await User.findByPk(userId, {
      attributes: ['user_id', 'username', 'total_exp', 'current_streak']
    });

    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch leaderboard
    const leaderboard = await User.findAll({
      attributes: ['username', 'total_exp'],
      order: [['total_exp', 'DESC']],
      limit: 20
    });

    // Calculate user's rank
    const userRank = leaderboard.findIndex(
      (user) => user.get('username') === userData.get('username')
    ) + 1;

    res.status(200).json({
      user: {
        username: userData.get('username'),
        xp: userData.get('total_exp') || 0,
        streak: userData.get('current_streak') || 0,
        rank: userRank || null
      },
      leaderboard: leaderboard.map((user) => ({
        username: user.get('username'),
        total_exp: user.get('total_exp') || 0
      }))
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

export default getDashboardData;