import React from "react";
import logo from "../../assets/logo.svg";
import Btn from "./button";
import "../../style/verify.css";
const Verification: React.FC = () => {
  const inputs = document.getElementsByClassName("verification-input") as HTMLCollectionOf<HTMLInputElement>;
  if(inputs){
    Array.from(inputs).forEach((input,index) => {
      input.addEventListener("input",() =>{
        if(input.value.length && index <inputs.length -1){
          inputs[index + 1].focus();
        }
        if(!(input.value >= "0" && input.value <= "9")){
          input.value = "";
          input.focus();
        }
      })
      input.addEventListener("keydown",(e) =>{
        if(e.key === "Backspace" && !input.value && index >0){
          inputs[index - 1].focus();
        }
      })
      input.addEventListener("click",() =>{
        Array.from(inputs).find((input) =>{ return input.value === ""})?.focus();
      })
    })
  }
  const verifyBtn = document.getElementById("verify-btn");
  if(verifyBtn){
    verifyBtn.addEventListener("click",(e) =>{
      e.preventDefault();
      let code = "";
      Array.from(inputs).forEach((input) =>{
        code += input.value;
      })
      if(code.length === 6){
        alert(`Verification code entered: ${code}`);
      } else {
        alert("Please enter a valid 6-digit code.");
      }
        
    })
    
  }
  return (
    <div className="verification-popUp">
        <div className="verification-container">
            <img src={logo} alt="Catabloc Logo" className="verification-logo" />
            <h1>Activation Code</h1>
            <div className="input-container">
                <input type="text" maxLength={1} data-index={0} className="verification-input"/>
                <input type="text" maxLength={1} data-index={1} className="verification-input"/>
                <input type="text" maxLength={1} data-index={2} className="verification-input"/>
                <input type="text" maxLength={1} data-index={3} className="verification-input"/>
                <input type="text" maxLength={1} data-index={4} className="verification-input"/>
                <input type="text" maxLength={1} data-index={5} className="verification-input"/>
            </div>
            <p style={{textAlign: "center"
            }}>You are ready to setup your new CATABLOC account.Copy your activation code or click the button below to activate your account.</p>
            <Btn text="Verify Email" id="verify-btn"></Btn>
        </div>
    </div>
  );
};
export default Verification;