import React, { use, useState } from "react";
import TalkingCat from "../../component/ui/talkingCat";
import Input from "../../component/ui/input";
import Btn from "../../component/ui/button";
import { signUp } from "../../services/authService";
import { useNavigate } from "react-router-dom";
const SignUp: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<{
    email: string | null;
    username: string | null;
    password: string | null;
    confirmPassword: string | null;
  }>({ email: null, username: null, password: null, confirmPassword: null });
  const nav = useNavigate();
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    // console.log("form Data:",formData);// Debug line
    const response = await signUp(form);
    console.log(response);
    if (response && response.ok) {
      // Handle successful signup (e.g., redirect to login page)
      console.log("Signup successful!");
      nav("/login");
    } else {
      const errorData = JSON.parse(JSON.stringify(response));
      console.log("Error Data:", errorData);
      console.log("Error Message:", errorData.message);
      setErrorMessage({
        email: errorData.message.includes("email") ? errorData.message : null,
        username: errorData.message.includes("username") ? errorData.message : null,
        password: errorData.message.includes("password") ? errorData.message : null,
        confirmPassword: errorData.message.includes("password") ? errorData.message : null,
      });
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
          id="reg"
          name="regForm"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            margin: "40px 0",
            alignItems: "center",
          }}
        >
          <Input
            label="Email:"
            type="email"
            placeHolder="Email"
            name="email"
            required="required"
            error={errorMessage.email}
          ></Input>
          <Input
            label="Username:"
            type="text"
            placeHolder="Username"
            name="username"
            required="required"
            error={errorMessage.username}
          ></Input>
          <Input
            label="Password:"
            type="password"
            placeHolder="Password"
            name="password"
            required="required"
            error={errorMessage.password}
          ></Input>
          <Input
            label="Confirm Password:"
            type="password"
            placeHolder="confirmPassword"
            name="confirmPassword"
            required="required"
            error={errorMessage.confirmPassword}
          ></Input>
          <Btn text="Sign Up" btnType="submit"></Btn>
        </form>
        <h1 id="test">Hello</h1>
        {/* <Footer/> */}
      </div>
    </>
  );
};


export default SignUp;
