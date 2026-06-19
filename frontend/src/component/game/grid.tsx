import bush from '../../assets/bush.svg';
import React from 'react';
interface GridProps {
  width: number;
  height: number;
  obstacles: Position[];
  tileSize: number;
  items?: { type: string; x: number; y: number }[];
}
interface Position {
  x: number;
  y: number;
}
const Grid: React.FC<GridProps> = ({ width, height, obstacles, tileSize, items }) => {
  const cells = [];

  // Loop through every Y and X to create a physical tile for every spot
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const isObstacle = obstacles.some(obs => obs.x === x && obs.y === y);
      cells.push(
        <div 
          key={`${x}-${y}`} 
          style={{ 
            width: tileSize, 
            height: tileSize, 
            border: '1px solid rgba(0, 0, 0, 0.05)', 
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            position: 'relative'
          }}
        >
          {isObstacle && (
            <img 
              src={bush} 
              alt="Bush Obstacle" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain' 
              }} 
            />
          )}
          {items?.some(item => item.x === x && item.y === y) && (
            <img 
              src={"https://files.nc.gov/deq/styles/article_card/public/images/2021-10/atlantic-bonito.jpg?VersionId=9QEVa4aBWw5AhgQt6Y5lrmKitWoetlw5&itok=7yNIlyIm"} 
              alt="Fish Item" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain' 
              }} 
            />
          )}
        </div>
      );
    }
  }

  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${width}, ${tileSize}px)`,
        gridTemplateRows: `repeat(${height}, ${tileSize}px)`,
        position: 'absolute', // Sits behind the Cat and Mouse
        top: 0,
        left: 0,
      }}
    >
      {cells}
    </div>
  );
};

export default Grid;