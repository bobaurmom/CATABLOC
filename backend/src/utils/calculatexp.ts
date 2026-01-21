// utils/xpCalculator.ts
export const calculateFinalXP = (
  difficulty: 'easy' | 'medium' | 'hard',
  blocks_used: number,
  block_limit: number | undefined,
  time_spent: number,
  time_limit: number | undefined
): number => {
  const base = { easy: 30, medium: 50, hard: 100 }[difficulty];
  
  // Calculate block bonus (only if block_limit is defined)
  const block_bonus = block_limit ? Math.max(0, block_limit - blocks_used) * 5 : 0;
  
  // Calculate time bonus (only if time_limit is defined, assume 2 minute default if not provided)
  const effective_time_limit = time_limit || 120; // 2 minutes default
  const time_bonus = Math.max(0, effective_time_limit - time_spent) * 0.5; // Reduced multiplier
  
  return Math.round(base + block_bonus + time_bonus);
};