import React from "react";
import Btn from "../../component/ui/Button";
import TalkingCat from "../../component/ui/TalkingCat";
import Input from "../../component/ui/input";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import BreadcrumbAlert from "../../component/ui/Snackbar";

const Login: React.FC = () => {
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = React.useState<{
    email: string | null;
    password: string | null;
  }>({
    email: null,
    password: null,
  });
  const [showAlert, setShowAlert] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowAlert(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const result = await login(email, password);
    
    if (result.response && result.response.ok) {
      // Login successful
    } else if (result.response && !result.response.ok) {
      const data = result.data;
      
      if (data.errors && Array.isArray(data.errors)) {
        const emailError = data.errors.find((error: any) => error.field === "email")?.message;
        const passwordError = data.errors.find((error: any) => error.field === "password")?.message;
        
        setErrorMessage({
          email: emailError || null,
          password: passwordError || null,
        });
      } else {
        setErrorMessage({
          email: data.message || null,
          password: data.message || null,
        });
      }
    }
    setShowAlert(false);
  }
  const handleInputChange = (fieldName: "email" | "password") => {
    setErrorMessage((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
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
        <TalkingCat text="Login to resume your progress!"></TalkingCat>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            margin: "40px 0",
            alignItems: "center",
            width: "30%",
            minWidth: "300px",
          }}
        >
          <Input
            label="Email:"
            type="email"
            name="email"
            placeHolder="Email"
            error={errorMessage.email}
            onChange={() => handleInputChange("email")}
          ></Input>
          <Input
            label="Password:"
            type="password"
            name="password"
            placeHolder="Password"
            error={errorMessage.password}
            onChange={() => handleInputChange("password")}
          ></Input>
          <Btn btnType="submit" width="30">
            Login
          </Btn>
        </form>
        <Link to="/forgot-password">Forgot password???</Link>
        <br />
        <Link to="/register">New to CATABLOC?? Sign Up</Link>
        {showAlert && (
          <BreadcrumbAlert state="default" duration={3000} onClose={() => setShowAlert(false)}>
            Logging in…
          </BreadcrumbAlert>
        )}
      </div>
    </>
  );
};
export default Login;
