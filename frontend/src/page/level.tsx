// game page 
import { useState, useRef, useEffect } from 'react';
import GameScene from '../component/game/GameScene';
import CodeBloc from '../component/game/Codebloc';
import { DndContext, pointerWithin, DragOverlay} from '@dnd-kit/core';
import Draggable from '../component/game/Draggable';
import DropZone from '../component/game/Dropzone';
import type { CodeBlock, Position } from '../type/gameType';
import {fetchLayout} from '../services/gameService';
import type { LevelLayout } from '../component/game/GameScene';
import type { Facing } from '../component/game/GameScene';
import { completeGame } from '../services/gameService';
import Btn from '../component/ui/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useTimer } from '../hooks/useTimer';
import WrapDropZone from '../component/game/WrapDropZone';
import organizeBlocks from '../utils/gameHelperFunc/purfectpath/organizeBlock' 
import clearAllBlockClasses from '../utils/gameHelperFunc/purfectpath/clearBlockClasses';
import executeBlock from '../utils/gameHelperFunc/purfectpath/executeBlock';
import useCodeblock from '../hooks/useCodeblock';
import useCatState from '../hooks/useCatState';
import useExecution from '../hooks/useExecution';
import type { GameEngine } from '../services/gameEngine';
import { startSession } from '../services/gameService';

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
  const [ disabledRun, setDisabledRun ] = useState(false);
  const [ levelLayout, setLevelLayout ] = useState<LevelData | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeData, setActiveData] = useState<any>(null);
  const isChangedRef = useRef(false);
  const [error, setError] = useState("");

  const positionRef = useRef<"above" | "below">("below");

  const { currentTime, stopTimer, resumeTimer } = useTimer(true);
  const { userCode, createCodeBlocks, findBlockById, removeBlockById ,addBlock , addBlockInBetween, createCodeBlockWithData} = useCodeblock();
  const {layout, catPos, catDeg, initialize, updateCatState, getEngine, resetCatState} = useCatState();
  const { gameId, levelId } = useParams();
  const { executeCodeBlock, undoLastAction, resetExecution, convertStackToUndoStack,containEmptyNestedBlocks, convertUserCodeToStack, undoStackLength, redoStackLength } = useExecution(getEngine() as GameEngine);

  // useEffect(() => {
  //   const startLevelSession = async () => {
  //     if(gameId && levelId) {
  //       const response = await startSession(Number(levelId));
  //       if(response && response.sessionId) {
  //         console.log("Session started with ID:", response.sessionId);
  //       } else {
  //         console.error("Failed to start session for level:", { gameId, levelId });
  //       }
  //     } else {
  //       console.error("Missing gameId or levelId in URL parameters:", { gameId, levelId });
  //     }
  //   };
  //   startLevelSession();
  // }, [gameId, levelId]);

useEffect(() => {
  const loadLayout = async () => {
    const layout: LevelData = await fetchLayout(Number(gameId), Number(levelId));
    if(layout && Array.isArray(layout.availableBlocksStr)){
      layout.availableBlocks = createCodeBlocks(["move_forward", "turn_left", "turn_right", "if", "while", "repeat"]);
    }
    setLevelLayout(layout);
    initialize(layout.layout);
  };
  loadLayout();
}, [gameId, levelId]);
useEffect(() => {
  if(containEmptyNestedBlocks(userCode) && userCode.length !== 0){
    setError("Nested Block Can't be empty");
  } else {
    setError("");
  }
  convertUserCodeToStack(userCode);
}, [userCode]);

const handleDragStart = (event: any) => {
  setActiveId(event.active.id);
  setActiveData(event.active.data.current);
};

const handleDragCancel = () => {
  setActiveId(null);
  setActiveData(null);
};

const handleDragEnd = (event: any) => {
  setActiveId(null);
  setActiveData(null);
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
    isChangedRef.current = true;
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
    isChangedRef.current = true;
  } else if(!over && active.id.startsWith("block-")) {
    removeBlockById(active.id);
    isChangedRef.current = true;
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
    isChangedRef.current = true;
  }
};
  
const handleDragMove = (event: any) => {
  const { over, activatorEvent, delta} = event;
  
  if (over?.id && over.id.startsWith("block-") && over.rect) {
    const currentY = activatorEvent?.clientY + delta.y;
    const top = over.rect.top;
    const bottom = over.rect.bottom;
    
    if (currentY && currentY >= top && currentY <= bottom) {
      const middle = top + (bottom - top) / 2;
      const position = currentY < middle ? 'above' : 'below';
      positionRef.current = position;
    }
  }
}

const executeBlocksSequentially = async (blocks: CodeBlock[], currentPos: Position, currentDeg: number): Promise<boolean> => {
  // if(!disabledRun) return false;
  let pos = currentPos;
  let deg = currentDeg;
  for (const block of blocks) {
    block.classList = "opacity-50";
    if(block.type === 'action') {
      console.log(`Executing block: ${block.label}`);
      const catState = executeBlock(block, getEngine() as GameEngine);
      isChangedRef.current = false;

      if(catState && !catState.success) {
        block.classList = "bg-[rgb(250,85,85)]"
      } else {
        if(catState && catState.cat_start !== undefined && catState.deg !== undefined) {
          pos = catState.cat_start;
          deg = catState.deg;
          updateCatState(pos, deg);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

    } else if(block.type === 'if' && block.condition === 'front_is_clear') {
      if(getEngine()?.isFrontClear()) {
        const result = await executeBlocksSequentially(block.nestedBlocks || [], pos, deg);
        if (!result) return false;
      }
    } else if(block.type === 'while' && block.condition === 'front_is_clear') {
      while(getEngine()?.isFrontClear()) {
        const result = await executeBlocksSequentially(block.nestedBlocks || [], pos, deg);
        if (!result) return false;
      }
    } else if(block.type === 'repeat' && block.nestedBlocks) {
      const times = parseInt((block.condition || '1 times').split(' ')[0]) || 1;
      for(let i = 0; i < times; i++) {
        const result = await executeBlocksSequentially(block.nestedBlocks || [], pos, deg);
        if (!result) return false;
      }
    }
    if(block.classList === "opacity-50") {
      block.classList = "";
    } else if(block.classList === "bg-[rgb(250,85,85)]") {
      return false;
    }
  }
  return true;
};
const handleRunCode = async () => {
  if(redoStackLength + undoStackLength >= 100){
    setError("Your Code might have an infinite loop or is too long to execute. Please reduce the number of execution.");
    return;
  }
  stopTimer();
  clearAllBlockClasses(userCode);

  if (!getEngine() || !layout) {
    resumeTimer();
    return;
  }
  // Reset to start position
  setDisabledRun(true);
  resetCatState();
  getEngine()?.reset();
  resetExecution();
  isChangedRef.current = false;


  const initialPos = layout.cat_start;
  const initialDeg = rotationMap[layout.facing || 'right'];
  
  setTimeout(async () => {
    try {

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
      convertStackToUndoStack();
      setDisabledRun(false);
      clearAllBlockClasses(userCode);
      resumeTimer();
    }
  }, 500);
};

const handleUndo = () => {
  stopTimer();
  const catState = undoLastAction();
  if(catState && catState.success){
    updateCatState(catState.cat_start, catState.deg);
  }
  resumeTimer();
}

const handleRedo = () => {
  stopTimer();
  if(isChangedRef.current) {
    resetCatState();
  }
  const catState = executeCodeBlock();
  if(catState && catState.success){
    updateCatState(catState.cat_start, catState.deg);
  }
  isChangedRef.current = false;
  resumeTimer();
}      
  return (

      <div className="level-page px-10 py-5 margin-auto flex flex-col justify-center items-center w-full gap-4​​">
        <div className="title-container flex justify-between items-center w-full">
          <Btn onClick={() => navigate('/dashboard')}>
            <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12l4-4m-4 4 4 4"/>
            </svg>
          </Btn>
          <h1 style={{ textAlign: 'center' }}>{`Level ${levelLayout?.levelNumber}: ${levelLayout?.title}`}</h1>
          <div className="time-container">{`${currentTime.hour.toString().padStart(2, '0')}:${currentTime.minute.toString().padStart(2, '0')}:${currentTime.second.toString().padStart(2, '0')}`}</div>
        </div>
        {error && (
          <div className='error-container flex justify-center items-center p-5 bg-red-100 m-auto rounded border border-red-400 text-red-700'>
            <p className='error'>{error}</p>
          </div>
        )}

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
            <div className="code-container flex w-full h-100 mt-4 min-w-70">
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
                        nestedBlocks: [...findBlockById(activeId)?.nestedBlocks || []]
                      }} 
                      isUserBlock={true}
                    />
                  </Draggable>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        <div className="btn-container flex items-start w-full gap-2 mt-4">
          <Btn onClick={() => {
            handleRunCode();
          }}
          disabled={disabledRun || (error !== "")} state={disabledRun || error ? "disabled" : "completed"} >
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M10.271 5.575C8.967 4.501 7 5.43 7 7.12v9.762c0 1.69 1.967 2.618 3.271 1.544l5.927-4.881a2 2 0 0 0 0-3.088l-5.927-4.88Z" clip-rule="evenodd"/>
            </svg>
          </Btn>
          <Btn onClick={() => {
            handleUndo();
          }} disabled={disabledRun || undoStackLength === 0 || error !== ""} state={disabledRun || undoStackLength === 0 || error ? "disabled" : "completed"} >
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M7 6a1 1 0 0 1 2 0v4l6.4-4.8A1 1 0 0 1 17 6v12a1 1 0 0 1-1.6.8L9 14v4a1 1 0 1 1-2 0V6Z" clip-rule="evenodd"/>
            </svg>
          </Btn>
          <Btn onClick={() => {
            handleRedo();
          }} 
          disabled={disabledRun || (redoStackLength === 0) || error !== ""} state={(disabledRun || (redoStackLength === 0) || error) ? "disabled" : "completed"} >
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M17 6a1 1 0 1 0-2 0v4L8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8L15 14v4a1 1 0 1 0 2 0V6Z" clip-rule="evenodd"/>
            </svg>
          </Btn>
        </div>
    </div>
    
  );
};

export default LevelPage;
