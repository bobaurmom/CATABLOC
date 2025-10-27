import React from "react";
import "../style/gameCard.css";
import catImage from "../assets/cat.png";
import Btn from "./ui/button";
interface prop {
  text: string;
  detail: string;
}

const gameCard: React.FC<prop> = ({ text, detail }) => {
  return (
    <div className="card">
      <img src={catImage} alt="cat" className="image" />
      <div className="description">
        <h1>{text}</h1>
        <p>{detail}</p>
        <Btn text="Play" btnType="button"></Btn>
        {/* <button>Play</button> */}
      </div>
    </div>
  );
};

export default gameCard;
