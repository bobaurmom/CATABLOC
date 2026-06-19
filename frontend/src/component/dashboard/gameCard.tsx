import React from "react";
import catImage from "../../assets/cat.png";
import Btn from "../ui/Button";

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
      className="flex flex-row items-center justify-between min-h-[250px] bg-white rounded-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] cursor-pointer mt-[30px] max-md:flex-col max-md:pb-8"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      style={{ 
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.8 : 1 
      }}
    >
      <img src={gameImage} alt={text} className="w-[250px] h-[250px] object-cover bg-[#f0f0f0] shrink-0 max-md:w-full" />
      <div className="flex flex-1 h-auto gap-3 flex-col justify-between items-start mx-[15px]">
        <div>
          <h1 className="m-0 text-lg font-semibold text-black">{text}</h1>
        </div>
        <p className="m-0 text-[13px] leading-[1.4] text-[#666] line-clamp-2 overflow-hidden">{detail}</p>
        <Btn 
          btnType="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePlay();
          }}
          disabled={disabled}
          state={disabled ? "disabled" : "default"}
        >
          {disabled ? "SOON..." : "PLAY"}
        </Btn>

      </div>
    </div>
  );
};

export default GameCard;
