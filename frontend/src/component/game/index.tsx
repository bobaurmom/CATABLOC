import React, { useState, useEffect } from 'react';
import Cat from './cat';
import Mouse from './mouse';
import Grid from './grid';
interface Position {
  x: number;
  y: number;
}

type Facing = 'left' | 'right' | 'up' | 'down';

interface LevelLayout {
  width: number;
  height: number;
  catStart: Position;
  facing?: Facing;
  goal: Position;
  obstacles: Position[];
}

interface GameSceneProps {
  layout: LevelLayout;
}

const GameScene: React.FC<GameSceneProps> = ({ layout }) => {
  const TILE_SIZE = 64;
  const [currentPos, setCurrentPos] = useState<Position>(layout.catStart);
  const [facing, setFacing] = useState<Facing>(layout.facing || 'right');
useEffect(() => {
    console.log("New layout detected, resetting cat to:", layout.catStart);
    setCurrentPos(layout.catStart);
    setFacing(layout.facing || 'right');
  }, [layout]);
  return (
      <div 
        className="game-container"
        style={{
          width: layout.width * TILE_SIZE,
          height: layout.height * TILE_SIZE,
          position: 'relative', // Context for absolute children
          border: '1px solid #333',
          overflow: 'hidden',  // Prevents cat from showing outside
          margin: '20px auto',
          backgroundColor: '#f9f9f9'
        }}
      >
        <Grid 
          width={layout.width} 
          height={layout.height} 
          obstacles={layout.obstacles} 
          tileSize={TILE_SIZE} 
        />
        
        {/* Cat and Mouse are absolutely positioned over the grid */}
        <Mouse x={layout.goal.x} y={layout.goal.y} tileSize={TILE_SIZE} />
        <Cat x={currentPos.x} y={currentPos.y} facing={facing} tileSize={TILE_SIZE} />
      </div>
  );
};

export default GameScene;