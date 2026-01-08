import React from 'react';
import strawberryCat from '../../assets/potatocat.svg';
interface Position {
  x: number;
  y: number;
}
export type Facing = 'up' | 'right' | 'down' | 'left';
interface CatProps extends Position {
  facing: Facing;
  tileSize: number;
}

const Cat: React.FC<CatProps> = ({ x, y, facing, tileSize }) => {
const rotationMap: Record<Facing, number> = { 
  up: -90, 
  right: 0, 
  down: 90, 
  left: 180 
};

  const style: React.CSSProperties = {
    width: `${tileSize}px`,
    height: `${tileSize}px`,
    position: 'absolute',
    transform: `translate(${x * tileSize}px, ${y * tileSize}px) rotate(${rotationMap[facing]}deg)`,
    transition: 'transform 0.3s ease-in-out', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  };

  return (
    <div style={style}>
      <img src={strawberryCat} alt="Strawberry Cat"
        style={{ 
          width: '90%', 
          height: '80%', 
          objectFit: 'contain' 
        }} 
      />
    </div>
  );
};
export default Cat;