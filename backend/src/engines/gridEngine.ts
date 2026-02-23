// src/engines/GridEngine.ts
import { GameEngine, VerificationResult } from './baseEngine';
import { moveInDirection, isWithinBounds, hasWall, normalizeDirection } from '../utils/gameHelper';

// Type definitions
type Direction = 'up' | 'right' | 'down' | 'left';

type CommandType = 'move_forward' | 'turn_left' | 'turn_right' | 'repeat' | 'if_path_ahead' | 'pick_up'| 'while';

interface Command {
  type: CommandType | string;
  // Add payload fields as needed :
  // steps?: number;
  repeat?: number;
  commands?: Command[];
  
}

interface GridPosition {
  x: number;
  y: number;
}

interface GridLayout {
  width: number;
  height: number;
  cat_start: GridPosition;
  facing?: Direction | string;
  obstacles: GridPosition[];
  goal: GridPosition;
  objects?: GridPosition[]; // Optional: positions of objects to interact with
}

// Helper function to turn left
// This function takes the current facing direction and returns the new direction after turning left
const turnLeft = (direction: 'up' | 'right' | 'down' | 'left'): 'up' | 'right' | 'down' | 'left' => {
  const turns = { 'up': 'left', 'left': 'down', 'down': 'right', 'right': 'up' };
  return turns[direction] as 'up' | 'right' | 'down' | 'left';
};

// Helper function to turn right
// This function takes the current facing direction and returns the new direction after turning right example: if facing is 'up', turning right will change it to 'right'
const turnRight = (direction: 'up' | 'right' | 'down' | 'left'): 'up' | 'right' | 'down' | 'left' => {
  const turns = { 'up': 'right', 'right': 'down', 'down': 'left', 'left': 'up' };
  return turns[direction] as 'up' | 'right' | 'down' | 'left';
};

//fix repeat level
export const GridEngine: GameEngine = {
  verify: (commands: Command[], layout: GridLayout): VerificationResult => {
    let current_pos = { ...layout.cat_start };
    let facing = normalizeDirection(layout.facing || 'right');
    const { width, height, obstacles, goal } = layout;
    let objects = layout.objects ? [...layout.objects] : [];
    console.log("Starting verification with layout:", layout);
    console.log("Commands to verify:", commands);
    for (const command of commands) {
      if (!command || !command.type) continue;
      const commandType = command.type.toLowerCase();

      if (commandType === 'move_forward') {
        const next_pos = moveInDirection(current_pos, facing);
        if (isWithinBounds(next_pos, width, height) && !hasWall(next_pos, obstacles)) {
          current_pos = next_pos;
        } else {
          const withinBounds = isWithinBounds(next_pos, width, height);
          const hasObstacle = hasWall(next_pos, obstacles);
          const reason = !withinBounds ? `(out of bounds: {x:${next_pos.x}, y:${next_pos.y}} vs width:${width}, height:${height})` : `(obstacle at {x:${next_pos.x}, y:${next_pos.y}})`;
          return { success: false, message: `Cannot move forward: obstacle in the way ${reason}`, finalState: { current_pos, goal, facing, objects } };
        }
      } else if (commandType === 'turn_left') {
        facing = turnLeft(facing);
      } else if (commandType === 'turn_right') {
        facing = turnRight(facing);
      } else if (commandType === 'repeat' && command.commands) {
        const repeatCount = command.repeat || 3;

        for (let i = 0; i < repeatCount; i++) {
          const result = GridEngine.verify(command.commands, { ...layout, cat_start: current_pos, facing, objects });
          
          // Only return on execution errors (obstacle, no object, etc), not on "goal not reached"
          // since nested commands aren't expected to reach the goal
          const isExecutionError = !result.success && 
            result.message && 
            !result.message.includes("Failed to reach the goal");
          
          if (isExecutionError) {
            return result;
          }
          
          current_pos = result.finalState.current_pos;
          facing = result.finalState.facing;
          objects = result.finalState.objects || [];
        }
      }
       else if (commandType === 'if_path_ahead') {
        const next_pos = moveInDirection(current_pos, facing);
        if (isWithinBounds(next_pos, width, height) && !hasWall(next_pos, obstacles)) {
          if (command.commands) {
            const result = GridEngine.verify(command.commands, { ...layout, cat_start: current_pos, facing, objects });
            
            const isExecutionError = !result.success && 
              result.message && 
              !result.message.includes("Failed to reach the goal");
            
            if (isExecutionError) return result;
            
            current_pos = result.finalState.current_pos;
            facing = result.finalState.facing;
            objects = result.finalState.objects || [];
          }
        }
      } else if (commandType === 'pick_up') {
        const objectIndex = objects.findIndex(obj => obj.x === current_pos.x && obj.y === current_pos.y);
        if (objectIndex >= 0) {
          objects.splice(objectIndex, 1);
        } else {
          return { 
            success: false, 
            message: "No object to interact with at the current position", 
            finalState: { current_pos, goal, facing, objects } };
        }
      } else if (commandType === 'while' && command.commands) {
        const MAX_ITERATIONS = 1000; // guard against infinite loops
        let iterations = 0;
        while (iterations++ < MAX_ITERATIONS) {
          const next_pos = moveInDirection(current_pos, facing);
          if (isWithinBounds(next_pos, width, height) && !hasWall(next_pos, obstacles)) {
            const result = GridEngine.verify(command.commands, { ...layout, cat_start: current_pos, facing, objects });
            
            const isExecutionError = !result.success && 
              result.message && 
              !result.message.includes("Failed to reach the goal");
            
            if (isExecutionError) return result;
            
            current_pos = result.finalState.current_pos;
            facing = result.finalState.facing;
            objects = result.finalState.objects || [];
          } else {
            break;
          }
        }
      }
      console.log("After executing command:", command, "Updated state:", { current_pos, facing, objects });
    }

    const reached_goal = current_pos.x === goal.x && current_pos.y === goal.y;
    return {
      success: reached_goal,
      message: reached_goal ? "Goal reached!" : "Failed to reach the goal.",
      finalState: { current_pos, goal, facing, objects }
    };
  }
};