// game page 
import React from 'react';
import GameScene from '../component/game';
import CodeBloc from '../component/game/codebloc';
import { DndContext, pointerWithin } from '@dnd-kit/core';
import Draggable from '../component/game/draggable';
import DropZone from '../component/game/dropZone';
import type { CodeBlock, Position } from '../type/gameType';
import {fetchLayout} from '../services/gameService';
import { useGameSelection } from '../hooks/useGameSelection';
import type { LevelLayout } from '../component/game/index';
import { GameEngine } from '../services/gameEngine';
import type { Facing } from '../component/game/index';
import { completeGame } from '../services/gameService';
import Btn from '../component/ui/button';
import { useNavigate } from 'react-router-dom';
import WrapDropZone from '../component/game/wrapDropZone';
import organizeBlocks from '../utils/gameHelperFunc/purfectpath/organizeBlock' // Update path if needed
import clearAllBlockClasses from '../utils/gameHelperFunc/purfectpath/clearBlockClasses';
import executeBlock from '../utils/gameHelperFunc/purfectpath/executeBlock';

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
};
let idCounter = 0;
function generateId(): string {
  return `block-${idCounter++}`;
} 
type timeFormat = {
  hour: number,
  minute: number,
  second: number
}
const rotationMap: Record<Facing, number> = { 
  up: -90, 
  right: 0, 
  down: 90, 
  left: 180 
};
// let catStart: Position = { x: 0, y: 0 };
let catFace: Facing = 'right';
let initialDeg: number = 0;
let startTime: number = 0;

const LevelPage: React.FC = () => {
  const navigate = useNavigate();
  const [levelLayout, setLevelLayout] = React.useState<LevelData | null>(null);
  const [time, setTime] = React.useState<timeFormat>({hour: 0, minute: 0, second: 0});
  const { currentLevel, sessionId, gameId } = useGameSelection();
  const [catPos, setCatPos] = React.useState<Position>({ x: 0, y: 0 });
  const [catDeg, setCatFacing] = React.useState(0);
  const [gameEngine, setGameEngine] = React.useState<GameEngine | null>(null);
  const [disabledRun, setDisabledRun] = React.useState(false);
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
      startTime = Date.now();
      // Initialize cat position
      catFace = layout.layout.facing || 'right';
      initialDeg = rotationMap[catFace];
      setCatFacing(initialDeg);
      setCatPos(layout.layout.cat_start);
      setGameEngine(new GameEngine(layout.layout, initialDeg));
      // catStart = layout.layout.cat_start;
    };
    loadLayout();
  }, []);

  React.useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    
    const updateTime = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const hours = Math.floor(elapsed / 3600);
      const minutes = Math.floor((elapsed % 3600) / 60);
      const seconds = elapsed % 60;
      
      setTime({ hour: hours, minute: minutes, second: seconds });
    };

    intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
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
const handleDragOver = (event: any) => {
  const { active, over } = event;
  const blockExists = findBlockById(userCode, active.id);
  if(over?.id && over.id.startsWith("block-") && active?.data?.current) {
    if(blockExists) {
      
    }
  }
};

const executeBlocksSequentially = async (blocks: CodeBlock[], currentPos: Position, currentDeg: number): Promise<void> => {
  let pos = currentPos;
  let deg = currentDeg;
  
  for (const block of blocks) {
    block.classList = "glow"; //glow when executing
    if(block.type === 'action') { //action for game engine
      const catState = executeBlock(block, gameEngine!);
      if(catState?.cat_start.x === pos.x && catState?.cat_start.y === pos.y && catState.deg === deg) {
        block.classList = "wrong-block"; //check if the cat is in same state
      } else {
        pos = catState?.cat_start || pos; // else update state
        deg = catState?.deg || deg;
      }
      setCatPos(catState?.cat_start);
      setCatFacing(catState?.deg);

      await new Promise(resolve => setTimeout(resolve, 1000));
      if(block.classList === "glow") {
        block.classList = ""; //If it is glowing, it should clear the glow after execution
      } else if(block.classList === "wrong-block") {
        return; //if is a wrong block, it should stop execution
      }
    } else if(block.type === 'if' && block.condition === 'front_is_clear') {
      if(gameEngine?.isFrontClear()) {
        await executeBlocksSequentially(block.nestedBlocks || [], pos, deg);
      }
    } else if(block.type === 'while' && block.condition === 'front_is_clear') {
      while(gameEngine?.isFrontClear()) {
        await executeBlocksSequentially(block.nestedBlocks || [], pos, deg);
      }
    } else if(block.type === 'repeat' && block.nestedBlocks) {
      const times = parseInt((block.condition || '1 times').split(' ')[0]) || 1;
      for(let i = 0; i < times; i++) {
        await executeBlocksSequentially(block.nestedBlocks, pos, deg);
      }
    }
  }
};
const handleRunCode = async () => {
  clearAllBlockClasses(userCode);
  if(gameEngine && levelLayout) {
    // Reset to start position
    setDisabledRun(true);
    gameEngine.reset();
    const startPos = levelLayout.layout.cat_start;
    const startDeg = rotationMap[levelLayout.layout.facing || 'right'];
    setCatPos(startPos);
    setCatFacing(startDeg);
    
    setTimeout(async () => {
      await executeBlocksSequentially(userCode, startPos, startDeg);
      
      

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
      setDisabledRun(false);
    }, 500);
  }
};
      


  return (
    <div className="level-page p-4 margin-auto flex flex-col w-full gap-4">
    <div className="title-container flex justify-between items-center">
      <Btn text="Back" onClick={() => navigate('/dashboard')}></Btn>
      <h1 style={{ textAlign: 'center' }}>{`Level ${levelLayout?.levelNumber}: ${levelLayout?.title}`}</h1>
      <div className="time-container">{`${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}:${time.second.toString().padStart(2, '0')}`}</div>
    </div>
      {levelLayout && (
        <GameScene 
          layout={{
            ...levelLayout.layout,
            cat_start: catPos,
          }} 
          deg={catDeg}
        />
      )}  
      <DndContext onDragEnd={handleDragEnd} collisionDetection={pointerWithin} onDragOver={handleDragOver}>
        <div className="code-container flex w-full h-100 mt-4 px-10">
          <div className="provide-code-container flex-1 scrollbar-hide overflow-y-auto overflow-x-hidden p-2 bg-gray-100 shadow-md border flex flex-col gap-4">
            {levelLayout?.availableBlocks?.map((block) => (
              <Draggable key={block.id} id={block.id} data={{ type: block.type, label: block.label, condition: block.condition }}>
                <CodeBloc block={block} />
              </Draggable>
            ))}
          </div>
          <div className="user-code-container bg-blue-100 flex-1 gap-0.5 scrollbar-hide overflow-y-auto overflow-x-hidden p-2">
            <DropZone id="dropZone">
              {userCode.map((block) => (
                <WrapDropZone id={block.id}>
                  <Draggable key={block.id} id={block.id} data={{ type: block.type, label: block.label, condition: block.condition }}>
                    <CodeBloc block={block} isUserBlock={true} />
                  </Draggable>
                </WrapDropZone>
              ))}
            </DropZone>
          </div>
        </div>
      </DndContext>
      <div className="btn-container">
        <Btn onClick={() => {
          setGameEngine(new GameEngine(levelLayout!.layout, initialDeg));
          handleRunCode();
        }} text="Run Code" disabled={disabledRun} state={disabledRun ? "disabled" : "completed"} >
        </Btn>
      </div>
    </div>
  );
};

export default LevelPage;
