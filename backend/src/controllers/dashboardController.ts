import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../utils/jwt';
import User from '../models/userModel';
import { Op } from 'sequelize';

// Controller for fetching dashboard data (user stats and leaderboard)
const getDashboardData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user?.user_id;

    if (!user_id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Fetch user data
    const userData = await User.findByPk(user_id, {
      attributes: ['user_id', 'username', 'total_exp', 'current_streak']
    });

    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch leaderboard
    const leaderboard = await User.findAll({
      where: { status: 'active' },
      attributes: ['username', 'total_exp','status'],
      order: [['total_exp', 'DESC']],
      limit: 10
    });
    // Calculate user's rank
    const userRank = await User.count({
      where: {
        status: 'active',
        total_exp: { [Op.gt]: userData.get('total_exp') }
      }
    }) + 1;

    res.status(200).json({
      user: {
        username: userData.get('username'),
        xp: userData.get('total_exp'),
        streak: userData.get('current_streak') ?? 0,
        rank: userRank
      },
      leaderboard: leaderboard.map((user) => ({
        username: user.get('username'),
        total_exp: user.get('total_exp') 
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