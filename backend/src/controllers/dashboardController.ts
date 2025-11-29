import { Request, type Response } from 'express';
import { authenticateToken } from '../utils/jwt';
import { AuthenticatedRequest} from '../utils/jwt';


export const getDashboardData = (req: AuthenticatedRequest, res: Response) => {
  // Implement the logic to retrieve dashboard data for the authenticated user
  // You can access the authenticated user's information from req.user if you have set it in the authentication middleware
  try {
    // Fetch and return user-specific dashboard data using user_id
    const userId = req.user?.userId;
    const username = req.user?.username;
    const dashboardData = [];
    // Use userId to fetch dashboard data]   = [];
    res.status(200).json({ message: `Dashboard data for user ${username}` });
    
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};