// game page 
import React from 'react';
import GameScene from '../component/game';
import CodeBloc from '../component/game/codebloc';
import { DndContext } from '@dnd-kit/core';
import Draggable from '../component/game/draggable';
import DropZone from '../component/game/dropZone';
import type { CodeBlock } from '../component/game/codebloc';
import {fetchLayout} from '../services/gameService';
import { useGameSelection } from '../hooks/useGameSelection';
interface LevelLayout {
  width: number;
  height: number;
  catStart: { x: number; y: number };
  facing?: 'left' | 'right' | 'up' | 'down';
  goal: { x: number; y: number };
  obstacles: { x: number; y: number }[];
  items: { type: string; x: number; y: number }[];  
}
interface LevelData {
  levelId: number;
  gameId: number;
  levelNumber: number;
  title: string;
  description: string;
  availableBlocksStr: string[];
  availableBlocks: CodeBlock[];
  layout: LevelLayout;
  blockLimit: number;
  timeLimit: number;
}
let id = 0;
function generateId(): string {
  return `block-${id++}`;
} 

const LevelPage: React.FC = () => {
  const [levelLayout, setLevelLayout] = React.useState<LevelData | null>(null);
  const { currentLevel } = useGameSelection();
  const handleProvideCode = (provideCode: string[]): CodeBlock[] => {
    let newProvideCode: CodeBlock[] = [];
    for (const blockType of provideCode) {
      if(blockType === 'Move Forward' || blockType === 'Turn Left' || blockType === 'Turn Right') {
        newProvideCode.push({ id: generateId(), type: 'action' as const, label: blockType });
      } else if (blockType === 'if') {
        newProvideCode.push({ id: generateId(), type: 'if' as const ,condition: 'front_is_clear'});
      } else if (blockType === 'while') { 
        newProvideCode.push({ id: generateId(), type: 'while' as const ,condition: 'front_is_clear'});
      } else if (blockType === 'repeat') {
        newProvideCode.push({ id: generateId(), type: 'repeat' as const , condition: '2 times'});
      }
    }
    return newProvideCode;

  }
  React.useEffect(() => {
    const loadLayout = async () => {
      const layout = await fetchLayout(currentLevel);
      if(layout && Array.isArray(layout.availableBlocksStr)){
        layout.availableBlocks = handleProvideCode(layout.availableBlocksStr);
      }
      setLevelLayout(layout);
      console.log(layout);
      console.log("Level layout loaded:", layout.layout);
    };
    loadLayout();
  }, []);

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
const [userCode, setUserCode] = React.useState<CodeBlock[]>([]);
const handleDragEnd = (event: any) => {
  const { active, over } = event;
  
  setUserCode((prevUserCode) => {
    const removeBlock = (blocks: CodeBlock[], blockId: string): CodeBlock[] => {
      return blocks
        .filter((block) => block.id !== blockId)
        .map((block) => {
          if (block.nestedBlocks) {
            return {
              ...block,
              nestedBlocks: removeBlock(block.nestedBlocks, blockId),
            };
          }
          return block;
        });
    };

    const addToTopLevel = (blocks: CodeBlock[], block: CodeBlock): CodeBlock[] => {
      return [...blocks, block];
    };

    const addToNested = (blocks: CodeBlock[], parentBlockId: string, block: CodeBlock): CodeBlock[] => {
      return blocks.map((bloc) => {
        if (bloc.id === parentBlockId) {
          return {
            ...bloc,
            nestedBlocks: [...(bloc.nestedBlocks || []), block],
          };
        } else if (bloc.nestedBlocks) {
          return {
            ...bloc,
            nestedBlocks: addToNested(bloc.nestedBlocks, parentBlockId, block),
          };
        }
        return bloc;
      });
    };

    if (over?.id === 'dropZone' && active?.data?.current) {
      const blockExists = findBlockById(prevUserCode, active.id);
      
      if (!blockExists) {
        // New block from palette
        const newBlock: CodeBlock = {
          id: generateId(),
          type: active.data.current.type,
          label: active.data.current.label,
          condition: active.data.current.condition,
          nestedBlocks: [],
        };
        return addToTopLevel(prevUserCode, newBlock);
      } else {
        // Existing nested block moved to top level
        return addToTopLevel(removeBlock(prevUserCode, active.id), blockExists);
      }
    } else if (over?.id && over.id.startsWith("dropZone-") && active?.data?.current) {
      const parentBlockId = over.id.replace("dropZone-", "");
      const blockExists = findBlockById(prevUserCode, active.id);
      
      if (!blockExists) {
        // New block from palette
        const newBlock: CodeBlock = {
          id: generateId(),
          type: active.data.current.type,
          label: active.data.current.label,
          condition: active.data.current.condition,
          nestedBlocks: [],
        };
        return addToNested(prevUserCode, parentBlockId, newBlock);
      } else {
        return addToNested(removeBlock(prevUserCode, active.id), parentBlockId, blockExists);
      }
    } else if (!over && active.id.startsWith("block-")) {
      return removeBlock(prevUserCode, active.id);
    } else {
      return prevUserCode;
    }
  });
};

  return (
    <div className="level-page p-4 margin-auto">
      <h1 style={{ textAlign: 'center' }}>{`Level ${levelLayout?.levelNumber}: ${levelLayout?.title}`}</h1>
      {levelLayout && <GameScene layout={levelLayout.layout} />}  
      <DndContext onDragEnd={handleDragEnd}>
        <div className="code-container flex w-full h-180 mt-4">
          <div className="provide-code-container bg-red-100 flex-1 scrollbar-hide overflow-y-auto p-2">
            {levelLayout?.availableBlocks?.map((block) => (
              <Draggable key={block.id} id={block.id} data={{ type: block.type, label: block.label, condition: block.condition }}>
                <CodeBloc block={block} />
              </Draggable>
            ))}
          </div>
          <div className="user-code-container bg-blue-100 flex-1 gap-0.5 scrollbar-hide overflow-y-auto p-2">
            <DropZone id="dropZone">
              {userCode.map((block) => (
                <Draggable key={block.id} id={block.id} data={{ type: block.type, label: block.label, condition: block.condition }}>
                  <CodeBloc block={block} isUserBlock={true} />
                </Draggable>
              ))}
            </DropZone>
          </div>
        </div>
      </DndContext>
      <button onClick={() => console.log(userCode)}>Log User Code</button>
    </div>
  );
};
export default LevelPage;
