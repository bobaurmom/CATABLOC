/** 
 * @file useCodeblock.ts
 * @description Custom React hook for managing code blocks in a visual programming interface. 
 * Provides functions to create, find, add, and remove code blocks, as well as to manage nested block structures.
 * The hook maintains the state of user-created code blocks and offers utility functions to manipulate them,
 * generating unique IDs for each block and supporting various block types such as actions, conditions, loops, and procedures.
 * 
 * @author sovat
 * @version 1.0
 * @date 2026-03-15
 * 
 * @property {CodeBlock[]} userCode - The current state of user-created code blocks.
 * @property {function} findBlockById - Function to find a code block by its unique ID.
 * @property {function} removeBlockById - Function to remove a code block by its unique ID.
 * @property {function} addBlock - Function to add a new code block, optionally specifying a parent block for nesting.
 * @property {function} createCodeBlocks - Function to create multiple code blocks from an array of block type strings.
 * @property {function} addBlockInBetween - Function to add a new code block in between existing blocks, based on a target block ID.
 * @property {function} createCodeBlockWithData - Function to create a code block with specific type, label, and condition data.
 * 
 * 
 **/


import { useState, useCallback, use } from 'react';
import type { CodeBlock } from "../type/gameType";
let idCounter = 0;


const generateId = (): string => {
  return `block-${idCounter++}`;
} 

const findBlockByIdHelper = (blocks: CodeBlock[], id: string): CodeBlock | null => {
  for (const block of blocks) {
    if (block.id === id) {
      return block;
    } else if(block.nestedBlocks) {
      const found = findBlockByIdHelper(block.nestedBlocks, id);
      if (found) return found;
    }
  }
  return null;
};

const removeBlockByIdHelper = (blocks: CodeBlock[], blockId: string): CodeBlock[] => {
  return blocks
    .filter((block) => block.id !== blockId)
    .map((block) => {
      if (block.nestedBlocks) {
        return {
          ...block,
          nestedBlocks: removeBlockByIdHelper(block.nestedBlocks, blockId),
        };
      }
      return block;
    });
};

const addBlockHelper = (blocks: CodeBlock[],block: CodeBlock ,parentBlockId?: string): CodeBlock[] => {
  if(!parentBlockId) {
    block.parentId = undefined;
    return [...blocks, block];
  }


  return blocks.map((bloc) => {
    if (bloc.id === parentBlockId) {
      block.parentId = parentBlockId;
      return {
        ...bloc,
        nestedBlocks: [...(bloc.nestedBlocks || []), block],
      };
    } else if (bloc.nestedBlocks) {
      return {
        ...bloc,
        nestedBlocks: addBlockHelper(bloc.nestedBlocks, block, parentBlockId),
      };
    }
    return bloc;
  });
};

const addBlockInBetweenHelper = (
  blocks: CodeBlock[],
  block: CodeBlock,
  targetBlockId: string,
  isBelow: boolean = true
): CodeBlock[] => {
  
  const targetParentId: string | undefined = findBlockByIdHelper(blocks, targetBlockId)?.parentId;
  
  if (!targetParentId) {
    const targetIndex: number = blocks.findIndex(b => b.id === targetBlockId);
    if (targetIndex === -1) return blocks;
    
    const newBlocks: CodeBlock[] = [...blocks];
    block.parentId = undefined;
    if(isBelow) {
      newBlocks.splice(targetIndex + 1, 0, block);
    } else {
      newBlocks.splice(targetIndex, 0, block);
    }
    return newBlocks;
  }
  
  return blocks.map((bloc) => {
    if (bloc.id === targetParentId) {
      const nested: CodeBlock[] = [...(bloc.nestedBlocks || [])];
      const targetIndex: number = nested.findIndex(b => b.id === targetBlockId);
      
      if (targetIndex === -1) return bloc;
      
      block.parentId = targetParentId;
      if(isBelow) {
        nested.splice(targetIndex + 1, 0, block);
      } else {
        nested.splice(targetIndex, 0, block);
      }
      
      return {
        ...bloc,
        nestedBlocks: nested
      };
    }
    
    if (bloc.nestedBlocks) {
      return {
        ...bloc,
        nestedBlocks: addBlockInBetweenHelper(bloc.nestedBlocks, block, targetBlockId, isBelow)
      };
    }
    
    return bloc;
  });
};
const useCodeblock = () => {
  const [userCode, setUserCode] = useState<CodeBlock[]>([]);
  
  const createCodeBlock = (codeBlockStr: string): CodeBlock => {
    if(codeBlockStr === 'move_forward' || codeBlockStr === 'turn_left' || codeBlockStr === 'turn_right') {
      return { id: generateId(), type: 'action' as const, label: codeBlockStr };
    } else if (codeBlockStr === 'if') {
      return { id: generateId(), type: 'if' as const ,condition: 'front_is_clear', nestedBlocks: []};
    } else if (codeBlockStr === 'while') {
      return { id: generateId(), type: 'while' as const ,condition: 'front_is_clear', nestedBlocks: []};
    } else if (codeBlockStr === 'repeat') {
      return { id: generateId(), type: 'repeat' as const , condition: '2 times', nestedBlocks: []};
    }
    return { id: generateId(), type: 'action' as const, label: codeBlockStr }; // Default to action if unknown type
  }

  const createCodeBlockWithData = (type: 'action' | 'if' | 'while' | 'repeat',label: string | undefined, condition: string | undefined): CodeBlock => { 
    return { id: generateId(), type, label, condition, nestedBlocks: [] };
  };

  const createCodeBlocks = (codeBlockStrs: string[]): CodeBlock[] => {
    return codeBlockStrs.map(createCodeBlock);
  };

  const findBlockById = useCallback((id: string): CodeBlock | null => {
    return findBlockByIdHelper(userCode, id);
  }, [userCode]);

  const removeBlockById = useCallback((blockId: string): void => {
    setUserCode((prevUserCode) => removeBlockByIdHelper(prevUserCode, blockId));
  }, []);
  
  const addBlock = useCallback((block: CodeBlock, parentBlockId?: string): void => {
    setUserCode((prevUserCode) => addBlockHelper(prevUserCode, block, parentBlockId));
  }, []);

  const addBlockInBetween = useCallback((block: CodeBlock, targetBlockId: string, isBelow: boolean): void => {
    setUserCode((prevUserCode) => addBlockInBetweenHelper(prevUserCode, block, targetBlockId, isBelow));
  }, []);

  return { userCode, findBlockById, removeBlockById, addBlock, createCodeBlocks, addBlockInBetween, createCodeBlockWithData };
}

export default useCodeblock;
