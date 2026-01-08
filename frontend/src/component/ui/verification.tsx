import React, { useRef, useEffect } from "react";// use THE REACT HOOK WE USE REACT FOR A REASON
import logo from "../../assets/logo.svg";
import Btn from "./button";
import "../../style/verify.css";
import { verifycode } from "../../services/authService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resendcode } from "../../services/authService";

type borderColorType = 'black' | 'red';
type errorMessage = string | null;
const Verification: React.FC<{email: string, onClose: () => void}> = ({ email, onClose }) => {
  // Create ref for each input
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [borderColor, setBorderColor] = useState<borderColorType>("black");
  const [errorMessage, setErrorMessage] = useState<errorMessage>(null);
  const nav = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    } 
  }, []);
  // Update border color based on state
  inputRefs.current.forEach((input) => {
    if (input) {
      input.style.borderColor = borderColor;
    }
  });
  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBorderColor("black");
    setErrorMessage(null);
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
    if(e.key === "Enter"){
      handleVerify();
    }
  
  };

  const handleVerify = async () => {
    const code = inputRefs.current
      .map(input => input?.value || "")
      .join("");
    const res = await verifycode(code,email);
    if(res){
      console.log("response",res);
      if(res.ok){
        nav("/dashboard");
      } else {
        setErrorMessage("Invalid verification code. Please try again.");
        setBorderColor("red");
      }
    }
  };

  const handleResend = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const res = await resendcode(email);
    if(res){
      if(res.ok){
        setErrorMessage("Verification code resent successfully.");
      } else {
        setErrorMessage("Failed to resend code. Please try again later.");
      }
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
<div className="verification-popUp" onClick={onClose}>
  <div className="verification-container" onClick={(e) => e.stopPropagation()}>
    <img src={logo} alt="Catabloc Logo" className="verification-logo" />
    <h1 style={{ fontSize: "30px",  marginBottom: "25px", color: "#333" }}>🐾Activation Code🐾</h1>
    <p className="verification-instruction">
      We sent a secret 6-digit code to <strong>{email}</strong> unlock your Catabloc account.     </p>
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
    {errorMessage && <p className="verification-error">{errorMessage}</p>}
    <Btn text="Verify Email" id="verify-btn" onClick={handleVerify} width={100} />
    <a href="" onClick={handleResend}>Resend Code</a>
  </div>
</div>
  );
};

export default Verification;