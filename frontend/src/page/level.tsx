// game page 
import React from 'react';
import GameScene from '../component/game';
import CodeBloc from '../component/game/codebloc';

interface LevelLayout {
  width: number;
  height: number;
  catStart: { x: number; y: number };
  facing?: 'left' | 'right' | 'up' | 'down';
  goal: { x: number; y: number };
  obstacles: { x: number; y: number }[];
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
const LevelPage: React.FC = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Level 1: The Great  Chase</h1>
      <GameScene layout={sampleLevel} />
      <CodeBloc
        block={{
          id: '5',
          type: 'repeat',
          condition: '5 times',
          nestedBlocks: [
            { id: '6', type: 'action', label: 'Move Forward' },
          ],
        }}
      />

    </div>
  );
};
export default LevelPage;
