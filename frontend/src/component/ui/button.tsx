import React from "react";

interface ButtonProps {
  text?: string;
  btnType?: HTMLButtonElement["type"];
  width?: number | string;
  id?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onHover?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  state?: "default" | "disabled" | "completed" | "warning";
  className?: string;
  children?: React.ReactNode;
}

const stateClasses: Record<string, string> = {
  default: 'bg-[#1013c4] text-white hover:bg-[#2563EB]',
  disabled: 'bg-[#E5E7EB] text-[#9CA3AF]',
  warning: 'bg-[#EF4444] text-white hover:bg-[#DC2626]',
  completed: 'bg-[#10B981] text-white hover:bg-[#059669]',
};

const Btn: React.FC<ButtonProps> = ({
  text,
  btnType = "button",
  id,
  onClick,
  onHover,
  disabled = false,
  state = "default",
  className,
  children,
}) => {
  return (
    <button
      type={btnType}
      onClick={onClick}
      onMouseOver={onHover}
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
      className={(className ? className + " " : "") + (stateClasses[state] || stateClasses.default)}
    >
      {children}
    </button>
  );
};

export default Btn;
