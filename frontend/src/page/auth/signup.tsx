import React, { useState, useEffect } from "react";
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
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    console.log("popUp state changed to:", popUp, "email:", email);
  }, [popUp, email]);
  const change = (e: React.FormEvent<HTMLFormElement>) => {
    setErrorMessage({ email: null, username: null, password: null, confirmPassword: null });
    setButtonState("default");
    const form = e.currentTarget;
    const data: { [key: string]: string } = {};
    const inputs = form.querySelectorAll("input");
    inputs.forEach((input) => {
      data[input.name] = input.value;
    });
    setFormData(data);
  };
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonState("disabled");
    const form = e.currentTarget;
    try {
      // Create a custom fetch call that doesn't trigger auth update
      const formData = new FormData(form);
      const data = {
        email: formData.get("email"),
        username: formData.get("username"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
      };
      
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      console.log("Direct register response:", response);
      if (response.ok) {
        console.log("Signup successful");
        setEmail(data.email as string);
        setButtonState("completed");
        // Show popup BEFORE registering with auth context
        setPopUp(true);
        console.log("WHERE TF IS THE POPUP");
      } else {
        setButtonState("default");
        const errorData = await response?.json();
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
        <a href="/login">I already have an account</a>
      </div>
      {popUp && <Verification email={email} onClose={() => setPopUp(false)} />}
    </>
  );
};


export default SignUp;
