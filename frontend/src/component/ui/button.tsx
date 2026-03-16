import React from "react";
import "../../style/button.css";
interface ButtonProps {
  text: string;
  btnType?: HTMLButtonElement["type"]; //type for button element
  width?: number | string;
  id?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  state?: "default" | "disabled" | "completed" | "warning";
  className?: string;
}

const Btn: React.FC<ButtonProps> = ({
  text,
  btnType = "button",
  id,
  onClick,
  disabled = false,
  state = "default",
  className
}) => {
  return (
    <button
      type={btnType}
      onClick={onClick}
      disabled={disabled}
      style={{
        border: "none",
        padding: "10px 3rem",
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: "10px",
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
      className={className ? className + " " + state : state}
    >


      {text}
    </button>
  );
};

export default Btn;