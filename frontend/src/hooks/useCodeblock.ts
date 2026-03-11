import { useState, useCallback } from 'react';
import type { CodeBlock } from "../type/gameType";
let idCounter = 0;
function generateId(): string {
  return `block-${idCounter++}`;
} 

const useCodeblock = () => {
    const [userCode, setUserCode] = useState<CodeBlock[]>([]);

    const findBlockById = (blocks: CodeBlock[], id: string): CodeBlock | null => {
      for (const block of blocks) {
        if (block.id === id) {
          return block;
        } else if(block.nestedBlocks) {
          const found = findBlockById(block.nestedBlocks, id);
          if (found) return found;
        }
      }
      return null;
    };

    const removeBlockById = (blocks: CodeBlock[], blockId: string): CodeBlock[] => {
      return blocks
        .filter((block) => block.id !== blockId)
        .map((block) => {
          if (block.nestedBlocks) {
            return {
              ...block,
              nestedBlocks: removeBlockById(block.nestedBlocks, blockId),
            };
          }
          return block;
        });
    };


    const addBlock = (blocks: CodeBlock[], parentBlockId?: string, block: CodeBlock): CodeBlock[] => {
    if(!parentBlockId) return [...blocks, block];
      return blocks.map((bloc) => {
        if (bloc.id === parentBlockId) {
          return {
            ...bloc,
            nestedBlocks: [...(bloc.nestedBlocks || []), block],
          };
        } else if (bloc.nestedBlocks) {
          return {
            ...bloc,
            nestedBlocks: addBlock(bloc.nestedBlocks, parentBlockId, block),
          };
        }
        return bloc;
      });
    };


    const createCodeBlock = (): CodeBlock 

}
