// game page 
import React from 'react';
import GameScene from '../component/game';
import CodeBloc from '../component/game/codebloc';
import { DndContext } from '@dnd-kit/core';
import Draggable from '../component/game/draggable';
import DropZone from '../component/game/dropZone';
import type { CodeBlock } from '../component/game/codebloc';
interface LevelLayout {
  width: number;
  height: number;
  catStart: { x: number; y: number };
  facing?: 'left' | 'right' | 'up' | 'down';
  goal: { x: number; y: number };
  obstacles: { x: number; y: number }[];
}
let id = 0;
let provideCode = [
  { id: generateId(), type: 'action' as const, label: 'Move Forward' },
  { id: generateId(), type: 'action' as const, label: 'Turn Left' },
  { id: generateId(), type: 'action' as const, label: 'Turn Right' },
  { id: generateId(), type: 'if' as const ,condition: 'front_is_clear'},
  { id: generateId(), type: 'while' as const ,condition: 'front_is_clear'},
  { id: generateId(), type: 'repeat' as const , condition: '1 times'},
]
function generateId() {
  return `block-${id++}`;
}
const sampleLevel: LevelLayout = {
  width: 10,
  height: 8,
  catStart: { x: 1, y: 1 },
  facing: 'right',
  goal: { x: 8, y: 6 },
  obstacles: [
    { x: 3, y: 3 },
    { x: 4, y: 3 },
    { x: 5, y: 3 },
    { x: 6, y: 5 },
    { x: 2, y: 6 },
  ],
}; 
// const handleBlockClick = (block:{id: string}) => {
//   return <Draggable id={`${block.id}`}></Draggable>
// }

const LevelPage: React.FC = () => {
  const [userCode, setUserCode] = React.useState<CodeBlock[]>([]);
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over?.id === 'dropZone' && active?.data?.current) {
      // Check if the block already exists in userCode
      const blockExists = userCode.some((block) => block.id === active.id);
      
      if (!blockExists) {
        const newBlock: CodeBlock = {
          id: generateId(),
          type: active.data.current.type,
          label: active.data.current.label,
          condition: active.data.current.condition,
          nestedBlocks: [],
        };
        setUserCode((prevUserCode) => [...prevUserCode, newBlock]);
      }
    } else if (!over && active?.id?.startsWith('block-')) {
        setUserCode((prevUserCode) => 
          prevUserCode.filter((block) => block.id !== active.id)
        );
    }
  };
  return (
    <div className="level-page p-4 margin-auto">
      <h1 style={{ textAlign: 'center' }}>Level 1: The Great  Chase</h1>
      <GameScene layout={sampleLevel} />
      <DndContext onDragEnd={handleDragEnd}>
        <div className="code-container flex w-full h-64 mt-4">
          <div className="provide-code-container bg-red-100 flex-1 scrollbar-hide overflow-y-auto p-2">
            {provideCode.map((block) => (
              <Draggable key={block.id} id={block.id} data={{ type: block.type, label: block.label, condition: block.condition }}>
                <CodeBloc block={block} />
              </Draggable>
            ))}
          </div>
          <div className="user-code-container bg-blue-100 flex-1 gap-0.5 scrollbar-hide overflow-y-auto p-2">
            <DropZone id="dropZone">
              {userCode.map((block) => (
                <Draggable key={block.id} id={block.id} data={{ type: block.type, label: block.label, condition: block.condition }}>
                  <CodeBloc block={block} />
                </Draggable>
              ))}
            </DropZone>
          </div>
        </div>
      </DndContext>
      <button onClick={() => console.log(userCode)}>Log User Code</button>
            {/* <CodeBloc
        block={{
          id: '5',
          type: 'repeat',
          condition: '5 times',
          nestedBlocks: [
            { id: '6', type: 'action', label: 'Move Forward' },
          ],
        }}
            /> */}

    </div>
  );
};
export default LevelPage;
