import { useState } from "react";
import type { CodeBlock } from "../type/gameType";
import executeBlock from "../utils/gameHelperFunc/purfectpath/executeBlock";
import type { GameEngine } from "../services/gameEngine";

const canExecuteBlock = (blocks: CodeBlock[]): boolean => {
    if(blocks.length === 0) return false; 
    for(const block of blocks) {
        if(block.type === "action") {
            return true;
        } else 
        if(block.nestedBlocks) {
            if(block.nestedBlocks.length === 0){
                return false;
            } else if(block.nestedBlocks.length === 1){
                return canExecuteBlock(block.nestedBlocks);
            }
        } else {
            return false;
        }
    }
    return true;
}
const useExecution = (gameEngine: GameEngine) => {

    const [ executionStack, setExecutionStack ] = useState<CodeBlock[]>([]);
    const [ undoStack, setUndoStack ] = useState<CodeBlock[]>([]);

    const traverseBlocks = (blocks: CodeBlock[]): CodeBlock[] => {
        let result: CodeBlock[] = [];
        if(blocks.length === 0) return result;
        for (const block of blocks) {
            if(block.type === "action") {
                const success = executeBlock(block, gameEngine);
                if (success.success) {
                    result.push(block);
                } else {
                    return result;
                }
            } else if (block.type === "while"){
                if(block.condition === "front_is_clear") {
                    while(gameEngine.isFrontClear()) {
                        if(!canExecuteBlock(block.nestedBlocks || [])) break;
                        const nestedResult = traverseBlocks(block.nestedBlocks || []);
                        if(result.length > 100) break;
                        result.push(...nestedResult);
                    }
                }
            } else if (block.type === "if") {
                if(block.condition === "front_is_clear") {
                    if(gameEngine.isFrontClear()) {
                        const nestedResult = traverseBlocks(block.nestedBlocks || []);
                        result.push(...nestedResult);
                    }
                }
            } else if (block.type === "repeat") {
                const times = parseInt(block.condition || "0");
                for(let i = 0; i < times; i++) {
                    const nestedResult = traverseBlocks(block.nestedBlocks || []);
                    result.push(...nestedResult);
                }
            }
        }
        return result;
    };

    const resetStacks = () => {
        setExecutionStack([...undoStack.reverse()]);
        setUndoStack([]);
    }

    const executeCodeBlock = () => {
        const executionBlock = executionStack[executionStack.length - 1];
        if(executionBlock) {
            const result = executeBlock(executionBlock, gameEngine);
            setExecutionStack(prev => prev.slice(0, -1));
            setUndoStack(prev => prev.concat(executionBlock));
            return result;
        }
        return null;
    };

    const executeUndoBlock = (block: CodeBlock) => {
        console.log(undoStack);
        const undoBlock: CodeBlock = {...block, label: block.label === "move_forward" ? "move_backward" : block.label === "turn_left" ? "turn_right" : block.label === "turn_right" ? "turn_left" : block.label};
        return executeBlock(undoBlock, gameEngine);
    }

    const undoLastAction = () => {
        const lastAction = undoStack[undoStack.length - 1];
        if(lastAction) {
            const result = executeUndoBlock(lastAction);
            setUndoStack(prev => prev.slice(0, -1));
            setExecutionStack(prev => [...prev, lastAction]);
            return result;
        }
    }

    const containEmptyNestedBlocks = (blocks: CodeBlock[]): boolean => {
        if(blocks.length === 0) return true;
        for(const block of blocks) {
            console.log(`block is ${JSON.stringify(block)}`);
            if(block.type === "action") {
                continue;
            }
            if(block.nestedBlocks) {
                console.log(`block ${block.label} has nested blocks: ${block.nestedBlocks.length}`);
                if(block.nestedBlocks.length === 0) {
                    return true;
                } else {
                    if(containEmptyNestedBlocks(block.nestedBlocks)) {
                        return true;
                    }
                }
            }
        } 
        return false;
    }    

    const convertUserCodeToStack = (codeBlocks: CodeBlock[]): CodeBlock[] => {
        if(!codeBlocks || codeBlocks.length === 0) {
            setExecutionStack([]);
            setUndoStack([]);
            return [];
        };
        
        gameEngine.reset();
        const stack: CodeBlock[] = [];
        stack.push(...traverseBlocks(codeBlocks));
        gameEngine.reset();
        setExecutionStack(stack.reverse());
        setUndoStack([]);
        console.log("stack in convertUserCodeToStack:", stack);
        return stack;
    };

    const convertStackToUndoStack = () => {
        setUndoStack(undoStack.concat([...executionStack].reverse()));
        setExecutionStack([]);
    }

    const resetExecution = (): void => {
        setExecutionStack(prev => []);
        setUndoStack(prev => []);
    }
    

    return {
        undoStackLength: undoStack.length,
        redoStackLength: executionStack.length,
        executeCodeBlock,
        undoLastAction,
        containEmptyNestedBlocks,
        convertStackToUndoStack,
        convertUserCodeToStack,
        resetExecution,
        resetStacks
    }
};

export default useExecution;