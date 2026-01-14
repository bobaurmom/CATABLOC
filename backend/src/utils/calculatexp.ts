// utils/xpCalculator.ts
export const calculateFinalXP = (
  difficulty: 'easy' | 'medium' | 'hard',
  blocksUsed: number,
  blockLimit: number | undefined,
  timeSpent: number,
  timeLimit: number | undefined
): number => {
  const base = { easy: 30, medium: 50, hard: 100 }[difficulty];
  
  // Calculate block bonus (only if blockLimit is defined)
  const blockBonus = blockLimit ? Math.max(0, blockLimit - blocksUsed) * 5 : 0;
  
  // Calculate time bonus (only if timeLimit is defined, assume 2 minute default if not provided)
  const effectiveTimeLimit = timeLimit || 120; // 2 minutes default
  const timeBonus = Math.max(0, effectiveTimeLimit - timeSpent) * 0.5; // Reduced multiplier
  
  return Math.round(base + blockBonus + timeBonus);
};