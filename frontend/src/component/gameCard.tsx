import React, { useState } from "react";
import "../style/gameCard.css";
import catImage from "../assets/cat.png";
import Btn from "./ui/button";

interface GameCardProps {
  text: string;
  detail: string;
  gameImage?: string;
  onPlay?: () => void;
  disabled?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ 
  text, 
  detail, 
  gameImage = catImage,
  onPlay,
  disabled = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handlePlay = () => {
    if (!disabled && onPlay) {
      onPlay();
    }
  };

  const handleCardClick = () => {
    if (!disabled) {
      handlePlay();
    }
  };

  return (
    <div 
      className="card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleCardClick()}
      style={{ 
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.8 : 1 
      }}
    >
      <img src={gameImage} alt={text} className="image" />
      <div className="description">
        <div>
          <h1>{text}</h1>
        </div>
        <p>{detail}</p>
        <Btn 
          text={disabled ? "COMING SOON" : "PLAY"} 
          btnType="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePlay();
          }}
          bgColor={disabled ? "#999" : isHovered ? "#393CFF" : "#1013C4"}
        />
      </div>
    </div>
  );
};

export default GameCard;
