import React from "react";
import "../style/gameCard.css";
import catImage from "../assets/cat.png";

const gameCard: React.FC = () => {
  return (
    <div className="card">
      <img src={catImage} alt="cat" className="image" />
      <div className="description">
        <h1>Purfect Pathing</h1>
        <p>
          Ready to be a cat catching a mouse? Program a cat to catch a mouse.
          Use simple commands to set the cat's path. Plan your moves to
          outsmart the mouse. It's a fun way to learn basic coding logic.
        </p>
        <button>Play</button>
      </div>
    </div>
  );
};

export default gameCard;
