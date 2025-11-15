import React, { useState } from "react";
import TalkingCat from "../../component/ui/talkingCat";
import Input from "../../component/ui/input";
import Btn from "../../component/ui/button";
import { signUp } from "../../services/authService";
import { useNavigate } from "react-router-dom";


const SignUp: React.FC = () => {
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
    const response = await signUp(form);
    if (response && response.ok) {
      // Handle successful signup (e.g., redirect to login page)
      setButtonState("completed");
      nav("/verify", { state: { email: form.email.value } });
    } else {
      setButtonState("default");
      const errorData = JSON.parse(JSON.stringify(response));
      if(errorData.errors){
        setErrorMessage({
          email: errorData.errors.find((error: any) => error.field === "email")?.message || null,
          username: errorData.errors.find((error: any) => error.field === "username")?.message || null,
          password: errorData.errors.find((error: any) => error.field === "password")?.message || null,
          confirmPassword: errorData.errors.find((error: any) => error.field === "confirmPassword")?.message || null,
        });
      } else {
        setErrorMessage({
          email: errorData.message.includes("email") ? errorData.message : null,
          username: errorData.message.includes("username") ? errorData.message : null,
          password: errorData.message.includes("password") ? errorData.message : null,
          confirmPassword: errorData.message.includes("Password") ? errorData.message : null,
        });
      }
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
    </>
  );
};


export default SignUp;
