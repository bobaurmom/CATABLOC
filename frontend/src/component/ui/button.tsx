import React from "react";

interface button {
  text: string;
  bgColor?: string;
  btnType?: HTMLButtonElement["type"];
  fSize?: string;
  width?: string;
  id?: string;
}
const Btn: React.FC<button> = ({
  text,
  bgColor = "blue",
  btnType,
  fSize = 1,
  width,
  id,
}) => {
  return (
    <button
      type={btnType}
      style={{
        backgroundColor: `${bgColor}`,
        fontSize: `${fSize}rem`,
        width: `${width}%`,
      }}
      id={id}
    >
      {text}
    </button>
  );
};
export default Btn;
