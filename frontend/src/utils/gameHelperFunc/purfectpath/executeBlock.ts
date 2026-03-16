import type { GameEngine } from '../../../services/gameEngine';
import type { CodeBlock, Position} from '../../../type/gameType';
const executeBlock = (block: CodeBlock, gameEngine:GameEngine): {cat_start: Position, deg: number} => {
    if(block.type === "action") {
        switch (block.label) {
            case 'move_forward':
                gameEngine.moveForward();
                break;
            case 'turn_left':
                gameEngine.turnLeft();
                break;
            case 'turn_right':
                gameEngine.turnRight();
                break;
            default:
                throw new Error(`Unknown action: ${block.label}`);
        }
    } else {
        throw new Error(`Unsupported block type: ${block.type}`);
    }
    return gameEngine.getCatState();
}

// const executeBlockSequencially
export default executeBlock;