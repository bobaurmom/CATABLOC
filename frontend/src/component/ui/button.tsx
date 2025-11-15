import React from "react";
import "../../style/button.css";
interface ButtonProps {
  text: string;
  btnType?: HTMLButtonElement["type"]; //type for button element
  fSize?: number | string;
  width?: number | string;
  id?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  state?: "default" | "disabled" | "completed" | "warning";
}

const Btn: React.FC<ButtonProps> = ({
  text,
  btnType = "button",
  fSize = 1,
  width,
  id,
  onClick,
  disabled = false,
  state = "default",
}) => {
  return (
    <button
      type={btnType}
      onClick={onClick}
      disabled={disabled}
      style={{
        fontSize: `${fSize}rem`,
        width: width !== undefined ? `${width}%` : "auto", 
        border: "none",
        padding: "0.6rem 1rem",
        cursor: disabled ? "not-allowed" : "pointer",
        color: "white",
        borderRadius: "4px",
        transition: "all 0.2s ease",
        opacity: disabled ? 0.7 : 1,
      }}
      id={id}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "scale(1.02)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }
      }}
      className={state}
    >

      {text}
    </button>
  );
};

export default Btn;