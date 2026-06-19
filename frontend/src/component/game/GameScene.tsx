import React, { useState, useEffect } from 'react';
import Cat from './Cat';
import Mouse from './Mouse';
import Grid from './Grid';
import type { Position } from '../../type/gameType';

export type Facing = 'left' | 'right' | 'up' | 'down';

export type LevelLayout = {
  width: number;
  height: number;
  cat_start: Position;
  facing?: Facing;
  goal: Position;
  obstacles: Position[];
  items: { type: string; x: number; y: number }[];
}

interface GameSceneProps {
  layout: LevelLayout;
}

const GameScene: React.FC<GameSceneProps & { deg: number }> = ({ layout, deg }) => {
  const TILE_SIZE = 64;
  const [currentPos, setCurrentPos] = useState<Position>(layout.cat_start);
useEffect(() => {
    setCurrentPos(layout.cat_start);
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
          items={layout.items}
          tileSize={TILE_SIZE} 
        />
        
        {/* Cat and Mouse are absolutely positioned over the grid */}
        <Mouse x={layout.goal.x} y={layout.goal.y} tileSize={TILE_SIZE} />
        <Cat x={currentPos.x} y={currentPos.y} rotateDegrees={deg} tileSize={TILE_SIZE} />
      </div>
  );
};

export default GameScene;