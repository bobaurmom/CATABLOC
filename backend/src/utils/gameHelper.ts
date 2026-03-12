//helper functions for game1 logic

type Direction = 'up' | 'right' | 'down' | 'left';
type Position = { x: number; y: number };
const MAX_COMMAND_DEPTH = 50;

export const normalizeDirection = (dir: string): Direction => {
  // Validate input to prevent null/undefined errors
  if (typeof dir !== 'string') {
    return 'right';
  }
  const dirMap: Record<string, Direction> = {
    'up': 'up',
    'right': 'right',
    'down': 'down',
    'left': 'left'
  };
  return dirMap[dir.toLowerCase()] || 'right';
};
// Helper function to move position in a given direction instead of using multiple if checks
export const moveInDirection = (position: Position, direction: Direction): Position => {
  const newPos: Position = { ...position };
  if (direction === 'up') newPos.y -= 1;
  else if (direction === 'right') newPos.x += 1;
  else if (direction === 'down') newPos.y += 1;
  else if (direction === 'left') newPos.x -= 1;
  return newPos;
};

// Helper function to validate if a position is within bounds
export const isWithinBounds = (position: Position, width: number, height: number): boolean => {
  return position.x >= 0 && position.x < width && 
         position.y >= 0 && position.y < height;
};

// Helper function to check if a position has a wall
export const hasWall = (position: Position, obstacles: Position[]): boolean => {
  return obstacles.some((w) => w.x === position.x && w.y === position.y);
};

// Helper to validate command depth
export const validateCommandDepth = (commands: any[], depth: number = 0): void => {
  if (depth > MAX_COMMAND_DEPTH) {
    throw new Error(`Command nesting exceeds maximum depth of ${MAX_COMMAND_DEPTH}`);
  }
  
  for (const cmd of commands) {
    if ((cmd?.type === 'repeat' || cmd?.type === 'while') && Array.isArray(cmd.commands)) {
      validateCommandDepth(cmd.commands, depth + 1);
    }
  }
};