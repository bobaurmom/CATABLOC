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
import type { LevelLayout } from '../component/game/index';
import { GameEngine } from '../services/gameEngine';
import type { Facing, Position } from '../component/game/index';
import { completeGame } from '../services/gameService';
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
let catStart: Position = { x: 0, y: 0 };
let catFace: Facing = 'right';

const LevelPage: React.FC = () => {
  const [levelLayout, setLevelLayout] = React.useState<LevelData | null>(null);
  const { currentLevel, sessionId, gameId } = useGameSelection();
  const [catPos, setCatPos] = React.useState({ x: 0, y: 0 });
  const [catFacing, setCatFacing] = React.useState<'left' | 'right' | 'up' | 'down'>('right');
  const [gameEngine, setGameEngine] = React.useState<GameEngine | null>(null);
  const handleProvideCode = (provideCode: string[]): CodeBlock[] => {
    let newProvideCode: CodeBlock[] = [];
    for (const blockType of provideCode) {
      if(blockType === 'move_forward' || blockType === 'turn_left' || blockType === 'turn_right') {
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
      // Initialize cat position
      setCatPos(layout.layout.cat_start);
      setCatFacing(layout.layout.facing || 'right');
      setGameEngine(new GameEngine(layout.layout));
      catStart = layout.layout.cat_start;
      catFace = layout.layout.facing || 'right';
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
const organizeBlocks = (blocks: CodeBlock[]): [] => {
  let organizeArray: any = [];
  for(const block of blocks) {
    if(block.type === "action"){
      organizeArray.push(block.label);
    } else if(block.type === "if") {
      let ifBlocks = {type: "if", condition: block.condition, nested: organizeBlocks(block.nestedBlocks || [])};
      organizeArray.push(ifBlocks);
    } else if(block.type === "while") {
      let whileBlocks = {type: "while", condition: block.condition, nested: organizeBlocks(block.nestedBlocks || [])};
      organizeArray.push(whileBlocks);
    } else if(block.type === "repeat") {
      let repeatBlocks = {type: "repeat", repeat: block.condition, nested: organizeBlocks(block.nestedBlocks || [])};
      organizeArray.push(repeatBlocks);
    }
  }
  return organizeArray;
}
const executeBlocksSequentially = async (blocks: CodeBlock[]): Promise<void> => {
  for (const block of blocks) {
    if(block.type === 'action') {
      if(block.label === 'move_forward') {
        gameEngine?.moveForward();
      } else if(block.label === 'turn_left') {
        gameEngine?.turnLeft();
      } else if(block.label === 'turn_right') {
        gameEngine?.turnRight();
      }
      const catState = gameEngine?.getCatState();
      if(catState) {
        setCatPos(catState.cat_start);
        setCatFacing(catState.facing || 'right');
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    } else if(block.type === 'if' && block.condition === 'front_is_clear') {
      if(gameEngine?.isFrontClear()) {
        await executeBlocksSequentially(block.nestedBlocks || []);
      }
    } else if(block.type === 'while' && block.condition === 'front_is_clear') {
      while(gameEngine?.isFrontClear()) {
        await executeBlocksSequentially(block.nestedBlocks || []);
      }
    } else if(block.type === 'repeat' && block.nestedBlocks) {
      const times = parseInt((block.condition || '1 times').split(' ')[0]) || 1;
      for(let i = 0; i < times; i++) {
        await executeBlocksSequentially(block.nestedBlocks);
      }
    }
  }
};

const handleRunCode = async () => {
  if(gameEngine && levelLayout) {
    // Reset to start position
    gameEngine.reset();
    setCatPos(levelLayout.layout.cat_start);
    setCatFacing(levelLayout.layout.facing || 'right');
    
    setTimeout(async () => {
      await executeBlocksSequentially(userCode);
      
      

      const organized = organizeBlocks(userCode);
  
      if(sessionId && currentLevel && gameId) {
        const response = await completeGame(sessionId, currentLevel, userCode.length, 0, organized);
        if(response && response.ok) {
          console.log("Level completed successfully!");
        } else {
          console.error("Failed to complete level.");
        }
      } else {
        console.error("Missing required values for completeGame:", { sessionId, currentLevel, gameId });
      }
    }, 500);
  }
};
      


  return (
    <div className="level-page p-4 margin-auto">
      <h1 style={{ textAlign: 'center' }}>{`Level ${levelLayout?.levelNumber}: ${levelLayout?.title}`}</h1>
      {levelLayout && (
        <GameScene 
          layout={{
            ...levelLayout.layout,
            cat_start: catPos,
            facing: catFacing
          }} 
        />
      )}  
      <DndContext onDragEnd={handleDragEnd}>
        <div className="code-container flex w-full h-100 mt-4">
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
      <button onClick={() => {
        setCatPos(catStart);
        setCatFacing(catFace);
        setGameEngine(new GameEngine(levelLayout!.layout));
        handleRunCode();
      }} style={{ padding: '10px 20px', marginTop: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
        Run Code
      </button>
    </div>
  );
};

export default LevelPage;
