import React from "react";

interface ButtonProps {
  text: string;
  bgColor?: string;
  btnType?: HTMLButtonElement["type"]; //type for button element
  fSize?: number | string;
  width?: number | string;
  id?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Btn: React.FC<ButtonProps> = ({
  text,
  bgColor = "blue",
  btnType = "button",
  fSize = 1,
  width,
  id,
  onClick,
}) => {
  return (
    <button
      type={btnType}
      onClick={onClick}
      style={{
        backgroundColor: bgColor,
        fontSize: `${fSize}rem`,
        width: width !== undefined ? `${width}%` : "auto", 
        border: "none",
        padding: "0.5rem 1rem",
        cursor: "pointer",
        color: "white",
        borderRadius: "4px",
      }}
      id={id}
    >
      {text}
    </button>
  );
};

export default Btn;