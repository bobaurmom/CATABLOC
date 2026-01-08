import React from 'react';
import mouse from '../../assets/greycheese.svg';

export interface Position {
  x: number;
  y: number;
}

interface MouseProps extends Position {
  tileSize: number;
}

export type Facing = 'up' | 'right' | 'down' | 'left';

const Mouse: React.FC<MouseProps> = ({ x, y, tileSize }) => {
  const style: React.CSSProperties = {
    width: `${tileSize}px`,
    height: `${tileSize}px`,
    position: 'absolute',
    left: `${x * tileSize}px`,
    top: `${y * tileSize}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${tileSize * 0.5}px`,
  };

  return <div style={style}>
    <img src={mouse} alt="Mouse" 
      style={{ 
        width: '90%', 
        height: '60%', 
        objectFit: 'contain', 
        marginTop: '10%'
      }} 
    />
  </div>;
};
export default Mouse;