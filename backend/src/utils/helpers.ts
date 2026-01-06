//# Generic helper functions
import { User, Session } from "../models";

//streak updater
export const updateStreak = async (userId: number, transaction: any) => {
  const user = await User.findByPk(userId, { transaction });
  if (!user) return;

  const lastPlayed = await Session.findOne({
    where: { user_id: userId, is_completed: true },
    order: [['ended_at', 'DESC']],
    offset: 1, // Get the PREVIOUS completed session
    transaction
  });

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (!lastPlayed || !lastPlayed.ended_at) {
    await user.update({ current_streak: 1 }, { transaction });
    return;
  }

  const lastDate = new Date(lastPlayed.ended_at);
  const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());

  const diffTime = today.getTime() - lastDay.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays === 1) {
    // Played yesterday! Increment streak
    await user.increment('current_streak', { by: 1, transaction });
  } else if (diffDays > 1) {
    // Missed a day. Reset.
    await user.update({ current_streak: 1 }, { transaction });
  }
  // If diffDays === 0, they already played today, so do nothing.
};