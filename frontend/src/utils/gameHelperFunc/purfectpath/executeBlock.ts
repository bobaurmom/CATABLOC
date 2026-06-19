import type { GameEngine } from '../../../services/gameEngine';
import type { CodeBlock, Position} from '../../../type/gameType';
const executeBlock = (block: CodeBlock, gameEngine:GameEngine): {success: boolean, cat_start: Position, deg: number} => {
    let success = false;
    if(block.type === "action") {
        switch (block.label) {
            case 'move_forward':
                success = gameEngine.moveForward();
                break;
            case 'move_backward':
                success = gameEngine.moveBackward();
                break;
            case 'turn_left':
                gameEngine.turnLeft();
                success = true;
                break;
            case 'turn_right':
                gameEngine.turnRight();
                success = true;
                break;
            default:
                throw new Error(`Unknown action: ${block.label}`);
        }
    } else {
        throw new Error(`Unsupported block type: ${block.type}`);
    }
    console.log(`Executed block ${block.label}, success: ${success}`);
    return { ...gameEngine.getCatState(), success };
}

// const executeBlockSequencially
export default executeBlock;