import React, { useRef, useEffect } from "react";
import logo from "../../assets/logo.svg";
import Btn from "./Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resendcode } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

type borderColorType = 'black' | 'red';
type errorMessage = string | null;
const Verification: React.FC<{email: string, OTPtype: "email_verification" | "password_reset", onClose: () => void}> = ({ email, OTPtype = "email_verification", onClose }) => {
  // Create ref for each input
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const { verifyEmail } = useAuth();
  const [borderColor, setBorderColor] = useState<borderColorType>("black");
  const [errorMessage, setErrorMessage] = useState<errorMessage>(null);
  const [isError, setIsError] = useState(false);
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

  const handleFocus = (index: number) => {
    if(index > 0 && !inputRefs.current[index - 1]?.value){
      inputRefs.current[index - 1]?.focus();
    }
  };


  const handleVerify = async () => {
    const code = inputRefs.current
      .map(input => input?.value || "")
      .join("");
    try {
      const res = await verifyEmail(code, email, OTPtype);
      if(res){
        console.log("response",res);
        if(res.status === 200){
          onClose();
        } else {
          setErrorMessage("Invalid verification code. Please check again.");
          setBorderColor("red");
        }
      }
    } catch (error) {
      setIsError(true);
      setErrorMessage("Invalid verification code. Please check again.");
      setBorderColor("red");
    }
  };

  const handleResend = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const res = await resendcode(email, OTPtype);
    if(res){
      if(res.status === 200){
        setErrorMessage("Verification code resent successfully.");
        setIsError(false);
        setBorderColor("black");
      } else {
        setIsError(true);
        setErrorMessage("Failed to resend code. Please try again later.");
        setBorderColor("red");
      }
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
<div className="fixed inset-0 w-full h-full bg-black/70 backdrop-blur-[8px] flex justify-center items-center z-[2000]" onClick={onClose}>
  <div className="bg-white p-10 rounded-[16px] shadow-[0_10px_30px_rgba(0,0,0,0.15)] text-center max-w-[90%] w-[400px] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
    <img src={logo} alt="Catabloc Logo" className="w-[80px] mb-[5px]" />
    <h1 style={{ fontSize: "30px",  marginBottom: "25px", color: "#333" }}>🐾{OTPtype === "email_verification" ? "Activation Code" : "Password Reset"}🐾</h1>
    <p className="text-[15.2px] text-[#666] my-4 mb-6 leading-[1.5]">
      We sent a secret 6-digit code to <strong>{email}</strong> {OTPtype === "email_verification" ? "to activate your account" : "to reset your password"}.</p>
    <div className="flex justify-center gap-[10px] mb-[28.8px]">
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          className="w-[50px] h-[60px] text-2xl text-center border-2 border-[#ddd] rounded-[8px] outline-none transition-all duration-200 bg-[#fafafa] focus:border-[#4a6cf7] focus:bg-white focus:shadow-[0_0_0_3px_rgba(74,108,247,0.2)] placeholder:text-transparent"
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          onChange={(e) => handleInputChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
        />
      ))}
    </div>
    {errorMessage && <p className={`relative -top-5 ${isError ? 'text-red-500' : 'text-green-500'}`}>{errorMessage}</p>}
    <Btn id="verify-btn" onClick={handleVerify} width={100}>
      Verify Email
    </Btn>
    <a href="" onClick={handleResend}>
      Resend Code
    </a>
  </div>
</div>
  );
};

export default Verification;