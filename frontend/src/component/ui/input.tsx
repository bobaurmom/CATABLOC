import React from "react";
type require = "required";
interface input {
  label: string;
  placeHolder: string;
  name: string;
  type?: string;
  required?: require;
  error?: string | null;
  autoComplete?: string;
  onChange?: () => void;
}
const Input: React.FC<input> = ({
  label,
  type,
  name,
  placeHolder,
  required,
  error,
  onChange,
  autoComplete
}) => {
  return (
    <div style={{width: "100%"}}>
      <label htmlFor={name}>{label}</label>
      <br />
      <input
        type={type}
        placeholder={placeHolder}
        style={{
          width: "100%",
          border: `1px solid ${error ? "red" : "blue"}`,
          borderRadius: "20px",
          padding: "15px 0",
          textIndent: "10px",
        }}
        required={required === "required"}
        name={name}
        id={name}
        onChange={onChange}
        autoComplete={autoComplete}
      />
      {error && <p style={{ color: "red", fontSize: "12px" ,margin:"0"}}>{error}</p>}
    </div>
  );
};
export default Input;
