
import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../utils/jwt";
import { User} from "../models/userModel";

export const checkUserActive = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user_id = req.user?.user_id;

    const user = await User.findByPk(user_id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ success: false, message: "Account is not active" });
    }

    req.fullUser = user; 
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Error verifying user status" });
  }
};