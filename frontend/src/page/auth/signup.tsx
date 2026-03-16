import React, { useState, useEffect } from "react";
import TalkingCat from "../../component/ui/talkingCat";
import Input from "../../component/ui/input";
import Btn from "../../component/ui/button";
import { useAuth } from "../../hooks/useAuth";
import Verification from "../../component/ui/verification";
import { Link } from "react-router-dom";
import { validateRegisterForm } from "../../services/authService";


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

  useEffect(() => {
    setButtonState(popUp ? "completed" : "default");
  }, [popUp]);
  const handleFocus = () => {
    setErrorMessage({ email: null, username: null, password: null, confirmPassword: null });
    setButtonState("default");
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonState("disabled");
    const formData = new FormData(e.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? ""),
      username: String(formData.get("username") ?? ""),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    };
    const validationErrors = validateRegisterForm(payload);
    if (validationErrors.length > 0) {
      setButtonState("warning");
      setErrorMessage({
        email: validationErrors.find((error) => error.field === "email")?.message || null,
        username: validationErrors.find((error) => error.field === "username")?.message || null,
        password: validationErrors.find((error) => error.field === "password")?.message || null,
        confirmPassword: validationErrors.find((error) => error.field === "confirmPassword")?.message || null,
      });
      return;
    }

    // Get response from server
    try {
      const { response, data } = await register(payload);

      if (response.ok) {
        setEmail(payload.email);
        setButtonState("completed");
        setPopUp(true);
        return;
      }

      setButtonState("warning");
      if (data?.errors) {
        setErrorMessage({
          email: data.errors.find((error: any) => error.field === "email")?.message || null,
          username: data.errors.find((error: any) => error.field === "username")?.message || null,
          password: data.errors.find((error: any) => error.field === "password")?.message || null,
          confirmPassword: data.errors.find((error: any) => error.field === "confirmPassword")?.message || null,
        });
      } else if (data?.message) {
        const message = typeof data.message === "string" ? data.message : "Registration failed";
        setErrorMessage({
          email: message.toLowerCase().includes("email") ? message : null,
          username: message.toLowerCase().includes("username") ? message : null,
          password: message.toLowerCase().includes("password") ? message : null,
          confirmPassword: message.toLowerCase().includes("confirm") ? message : null,
        });
      } else {
        setErrorMessage({
          email: data?.message || "Registration failed",
          username: data?.message || "Registration failed",
          password: data?.message || "Registration failed",
          confirmPassword: data?.message || "Registration failed",
        })
      }
    } catch (error) {
      setButtonState("default");
      console.error("Signup error:", error);
    }
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
          onFocus={handleFocus}
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
            autoComplete="username"
          ></Input>
          <Input
            label="Password:"
            type="password"
            placeHolder="Password"
            name="password"
            error={errorMessage.password}
            autoComplete="new-password"
          ></Input>
          <Input
            label="Confirm Password:"
            type="password"
            placeHolder="Confirm Password"
            name="confirmPassword"
            error={errorMessage.confirmPassword}
            autoComplete="new-password"
          ></Input>
          <Btn text="Sign Up" btnType="submit" state={buttonState} disabled={buttonState === "disabled"}></Btn>
        </form>
        {/* <Footer/> */}
        <Link to="/login">I already have an account</Link>
      </div>
      {popUp && <Verification email={email} onClose={() => setPopUp(false)} />}
    </>
  );
};


export default SignUp;
