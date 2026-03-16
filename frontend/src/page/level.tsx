// game page 
import React from 'react';
import GameScene from '../component/game';
import CodeBloc from '../component/game/codebloc';
import { DndContext, pointerWithin, DragOverlay} from '@dnd-kit/core';
import Draggable from '../component/game/draggable';
import DropZone from '../component/game/dropZone';
import type { CodeBlock, Position } from '../type/gameType';
import {fetchLayout} from '../services/gameService';
import type { LevelLayout } from '../component/game/index';
import type { Facing } from '../component/game/index';
import { completeGame } from '../services/gameService';
import Btn from '../component/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useTimer } from '../hooks/useTimer';
import WrapDropZone from '../component/game/wrapDropZone';
import organizeBlocks from '../utils/gameHelperFunc/purfectpath/organizeBlock' 
import clearAllBlockClasses from '../utils/gameHelperFunc/purfectpath/clearBlockClasses';
import executeBlock from '../utils/gameHelperFunc/purfectpath/executeBlock';
import useCodeblock from '../hooks/useCodeblock';
import useCatState from '../hooks/useCatState';

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

const rotationMap: Record<Facing, number> = { 
  up: -90, 
  right: 0, 
  down: 90, 
  left: 180 
};

const LevelPage: React.FC = () => {
  const navigate = useNavigate();
  const [ disabledRun, setDisabledRun ] = React.useState(false);
  const [ levelLayout, setLevelLayout ] = React.useState<LevelData | null>(null);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeData, setActiveData] = React.useState<any>(null);
  const positionRef = React.useRef<"above" | "below">("below");

  const { currentTime, startTimer, stopTimer, resumeTimer, resetTimer } = useTimer(true);
  const { userCode, createCodeBlocks, findBlockById, removeBlockById ,addBlock , addBlockInBetween, createCodeBlockWithData} = useCodeblock();
  const {layout, catPos, catDeg, initialize, updateCatState, getEngine, resetCatState} = useCatState();
  const { gameId, levelId } = useParams();
  React.useEffect(() => {
    const loadLayout = async () => {
      const layout: LevelData = await fetchLayout(Number(gameId), Number(levelId));
      if(layout && Array.isArray(layout.availableBlocksStr)){
        layout.availableBlocks = createCodeBlocks(["move_forward", "turn_left", "turn_right", "if", "while", "repeat"]);
      }
      console.log("Fetched layout:", layout);
      console.log("Calling initializer");
+     setLevelLayout(layout);
      initialize(layout.layout);
      console.log("Cat initial position after initialization:", catPos, "Cat initial degree after initialization:", catDeg);
    };
    loadLayout();
  }, [gameId, levelId]);

const handleDragStart = (event: any) => {
  setActiveId(event.active.id);
  setActiveData(event.active.data.current);
};
const handleDragCancel = () => {
  setActiveId(null);
  setActiveData(null);
};
const handleDragEnd = (event: any) => {
  // setActiveId(null);
  // setActiveData(null);
  const { active, over } = event;
  if(over?.id === 'dropZone' && active?.data?.current){ 
    const blockExists = findBlockById(active.id);
    if(!blockExists) {
      const newBlock: CodeBlock = createCodeBlockWithData(active.data.current.type, active.data.current.label, active.data.current.condition);
      addBlock(newBlock);
    } else {
      removeBlockById(active.id);
      addBlock(blockExists);
    }
  } else if(over?.id && over.id.startsWith("dropZone-") && active?.data?.current) {
    const parentBlockId = over.id.replace("dropZone-", "");
    const blockExists = findBlockById(active.id);
    if(!blockExists) {
      const newBlock: CodeBlock = createCodeBlockWithData(active.data.current.type, active.data.current.label, active.data.current.condition);
      addBlock(newBlock, parentBlockId);
    } else {
      removeBlockById(active.id);
      addBlock(blockExists, parentBlockId);
    }
  } else if(!over && active.id.startsWith("block-")) {
    removeBlockById(active.id);
  } else if(over?.id === active?.id) {
    return;
  } else if(over?.id && over.id.startsWith("block-") && active?.data?.current) {
    const blockExists = findBlockById(active.id);
    if(!blockExists) {
      const newBlock: CodeBlock = createCodeBlockWithData(active.data.current.type, active.data.current.label, active.data.current.condition);
      addBlockInBetween(newBlock, over.id, positionRef.current === "below");
    } else {
      removeBlockById(active.id);
      addBlockInBetween(blockExists, over.id, positionRef.current === "below");
    }
  }
};
  
const handleDragMove = (event: any) => {
  const { over, activatorEvent, delta} = event;
  console.log("Y:", activatorEvent?.clientY);
  console.log("Delta:", delta);
  
  if (over?.id && over.id.startsWith("block-") && over.rect) {
    const currentY = activatorEvent?.clientY + delta.y;
    const top = over.rect.top;
    const bottom = over.rect.bottom;
    
    // Only calculate if mouse is actually inside the block
    if (currentY && currentY >= top && currentY <= bottom) {
      const middle = top + (bottom - top) / 2;
      const position = currentY < middle ? 'above' : 'below';
      positionRef.current = position;
      console.log(`Inside block at: ${position}`);
    } else {
      console.log("Mouse outside block bounds");
    }
  }
}


const executeBlocksSequentially = async (blocks: CodeBlock[], currentPos: Position, currentDeg: number): Promise<void> => {
  let pos = currentPos;
  let deg = currentDeg;
  
  for (const block of blocks) {
    block.classList = "glow"; //glow when executing
    if(block.type === 'action') { //action for game engine
      const catState = executeBlock(block, getEngine()!);
      console.log("Cat state after executing block:", catState);
      console.log("Previous position:", pos, "Previous degree:", deg);
      if(catState?.cat_start.x === pos.x && catState?.cat_start.y === pos.y && catState.deg === deg) {
        block.classList = "wrong-block"; //check if the cat is in same state
      } else {
        pos = catState?.cat_start || pos;
        deg = catState?.deg || deg;
      }
      updateCatState(pos, deg);

      await new Promise(resolve => setTimeout(resolve, 1000));
      if(block.classList === "glow") {
        block.classList = ""; //If it is glowing, it should clear the glow after execution
      } else if(block.classList === "wrong-block") {
        return; //if is a wrong block, it should stop execution
      }
    } else if(block.type === 'if' && block.condition === 'front_is_clear') {
      if(getEngine()?.isFrontClear()) {
        await executeBlocksSequentially(block.nestedBlocks || [], pos, deg);
      }
    } else if(block.type === 'while' && block.condition === 'front_is_clear') {
      while(getEngine()?.isFrontClear()) {
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
  stopTimer();
  clearAllBlockClasses(userCode);

  if (!getEngine() || !layout) {
    resumeTimer();
    console.error("Game engine or level layout not initialized.");
    return;
  }
  console.log("Starting code execution. Initial cat position:", catPos, "Initial cat degree:", catDeg);
  // Reset to start position
  setDisabledRun(true);
  resetCatState();
  const initialPos = layout.cat_start;
  const initialDeg = rotationMap[layout.facing || 'right'];
  console.log("Cat position after reset:", catPos, "Cat degree after reset:", catDeg);
  
  setTimeout(async () => {
    try {
      console.log("Cat initial position:", catPos, "Cat initial degree:", catDeg);
      await executeBlocksSequentially(userCode, initialPos, initialDeg);
    
      const organized = organizeBlocks(userCode);
  
      if(levelId && gameId) {
        // const response = await completeGame(sessionId, currentLevel, userCode.length, 0, organized);
        // if(response && response.ok) {
        //   console.log("Level completed successfully!");
        // } else {
        //   console.error("Failed to complete level.");
        // }
      } else {
        // console.error("Missing required values for completeGame:", { sessionId, currentLevel, gameId });
      }
    } catch (error) {
      console.error("Error during code execution:", error);
    } finally {
      setDisabledRun(false);
      resumeTimer();
    }
  }, 500);
};
      


  return (

      <div className="level-page p-4 margin-auto flex flex-col w-full gap-4">
        <div className="title-container flex justify-between items-center">
          <Btn text="Back" onClick={() => navigate('/dashboard')}></Btn>
          <h1 style={{ textAlign: 'center' }}>{`Level ${levelLayout?.levelNumber}: ${levelLayout?.title}`}</h1>
          <div className="time-container">{`${currentTime.hour.toString().padStart(2, '0')}:${currentTime.minute.toString().padStart(2, '0')}:${currentTime.second.toString().padStart(2, '0')}`}</div>
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
      <DndContext onDragEnd={handleDragEnd} collisionDetection={pointerWithin} onDragMove={handleDragMove} onDragStart={handleDragStart} onDragCancel={handleDragCancel}>
        <div className="code-container flex w-full h-100 mt-4 px-10">
          <div className="provide-code-container flex-1 scrollbar-hide overflow-y-auto overflow-x-hidden p-2 bg-gray-100 shadow-md border flex flex-col gap-4 max-w-1/2">
            {levelLayout?.availableBlocks?.map((block) => (
              <Draggable key={block.id} id={block.id} data={{ type: block.type, label: block.label, condition: block.condition }}>
                <CodeBloc block={block} />
              </Draggable>
            ))}
          </div>
          <div className="user-code-container bg-blue-100 flex-1 gap-0.5 scrollbar-hide overflow-y-auto overflow-x-hidden p-2">
            <DropZone id="dropZone" className='h-200'>
              {userCode.map((block) => (
                <WrapDropZone id={block.id} key={block.id}>
                  <Draggable id={block.id} data={{ type: block.type, label: block.label, condition: block.condition }}>
                    <CodeBloc block={block} isUserBlock={true} />
                  </Draggable>
                </WrapDropZone>
              ))}
            </DropZone>
          </div>
        </div>
        <DragOverlay>
          {activeId && activeData ? (
            <div className="opacity-50 scale-100 shadow-2xl">
              <Draggable id={activeId} data={activeData}>
                <CodeBloc 
                  block={{
                    id: activeId,
                    type: activeData.type,
                    label: activeData.label,
                    condition: activeData.condition,
                    nestedBlocks: []
                  }} 
                />
              </Draggable>
            </div>
          ) : null}
      </DragOverlay>
      </DndContext>
      <div className="btn-container">
        <Btn onClick={() => {
          handleRunCode();
        }} text="Run Code" disabled={disabledRun} state={disabledRun ? "disabled" : "completed"} >
        </Btn>
      </div>
    </div>
    
  );
};

export default LevelPage;
