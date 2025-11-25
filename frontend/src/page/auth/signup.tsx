import React, { useState } from "react";
import TalkingCat from "../../component/ui/talkingCat";
import Input from "../../component/ui/input";
import Btn from "../../component/ui/button";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Verification from "../../component/ui/verification";


const SignUp: React.FC = () => {
  const { register } = useAuth();
  const [popUp, setPopUp] = useState(false);
  const [email, setEmail] = useState("");
  const [buttonState, setButtonState] = useState<"default" | "disabled" | "completed" | "warning">("default");
  const [errorMessage, setErrorMessage] = useState<{
    email: string | null;
    username: string | null;
    password: string | null;
    confirmPassword: string | null;
  }>({ email: null, username: null, password: null, confirmPassword: null });
  const nav = useNavigate();
  const change = () => {
    setErrorMessage({ email: null, username: null, password: null, confirmPassword: null });
    setButtonState("default");
  };
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonState("disabled");
    const form = e.currentTarget;
    try {
      const response = await register(form);
      if (response && response.ok) {
        // Handle successful signup (e.g., redirect to login page)
        setButtonState("completed");
        const formData = new FormData(form);
        const emailValue = formData.get("email") as string;
        setEmail(emailValue);
        // Navigate to verification page or show verification popup
        setPopUp(true);
      } else{
        setButtonState("default");
        const errorData = await response?.json();
        console.log("Signup error data:", errorData);
        if(errorData.errors){
          setErrorMessage({
            email: errorData.errors.find((error: any) => error.field === "email")?.message || null,
            username: errorData.errors.find((error: any) => error.field === "username")?.message || null,
            password: errorData.errors.find((error: any) => error.field === "password")?.message || null,
            confirmPassword: errorData.errors.find((error: any) => error.field === "confirmPassword")?.message || null,
          });
        } else  if(errorData.message) {
          const message = typeof errorData.message === "string" ? errorData.message : "";
          setErrorMessage({
            email: message.includes("email") ? message : null,
            username: message.includes("Username") ? message : null,
            password: message.includes("password") ? message : null,
            confirmPassword: message.includes("Password") ? message : null,
          });
        } else {
          window.alert("An unknown error occurred during signup. Please try again.");
        }
      }
    } catch (error) {
      setButtonState("default");
      console.error("Signup error:", error);
      throw error;
    };
}
  return (
    <>
      {/* <Header/> */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "120px 0px",
        }}
      >
        <TalkingCat text="create an account now to save your progress and save your creation \( >v< )/" />
        <form
          onSubmit={submit}
          onChange={change}
          id="reg"
          name="regForm"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            margin: "40px 0",
            alignItems: "center",
            width: "36%",
            minWidth: "300px",
          }}
        >
          <Input
            label="Email:"
            placeHolder="Email"
            name="email"
            type="email"
            error={errorMessage.email}
          ></Input>
          <Input
            label="Username:"
            type="text"
            placeHolder="Username"
            name="username"
            error={errorMessage.username}
          ></Input>
          <Input
            label="Password:"
            type="password"
            placeHolder="Password"
            name="password"
            error={errorMessage.password}
          ></Input>
          <Input
            label="Confirm Password:"
            type="password"
            placeHolder="Confirm Password"
            name="confirmPassword"
            error={errorMessage.confirmPassword}
          ></Input>
          <Btn text="Sign Up" btnType="submit" state={buttonState} disabled={buttonState === "disabled"}></Btn>
        </form>
        {/* <Footer/> */}
      </div>
      {popUp && <Verification email={email} onClose={() => setPopUp(false)} />}
    </>
  );
};


export default SignUp;
