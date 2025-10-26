import React, { useRef, useEffect } from "react";// use THE REACT HOOK WE USE REACT FOR A REASON
import logo from "../../assets/logo.svg";
import Btn from "./button";
import "../../style/verify.css";

const Verification: React.FC = () => {
  // Create ref for each input
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow digits
    if (!/^\d*$/.test(value)) {
      e.target.value = "";
      return;
    }

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = inputRefs.current
      .map(input => input?.value || "")
      .join("");

    if (code.length === 6) {
      alert(`Verification code entered: ${code}`);
    } else {
      alert("Please enter a valid 6-digit code.");
    }
  };
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
<div className="verification-popUp">
  <div className="verification-container">
    <img src={logo} alt="Catabloc Logo" className="verification-logo" />
    <h1 style={{ fontSize: "30px",  marginBottom: "25px", color: "#333" }}>🐾Activation Code🐾</h1>
    <p className="verification-instruction">
      We sent a secret 6-digit code to unlock your Catabloc account.     </p>
    <div className="input-container">
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          className="verification-input"
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          onChange={(e) => handleInputChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />
      ))}
    </div>
    <Btn text="Verify Email" id="verify-btn" onClick={handleVerify} width={100} />
  </div>
</div>
  );
};

export default Verification;