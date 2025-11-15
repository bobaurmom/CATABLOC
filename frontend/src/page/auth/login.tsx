import React from "react";
import Btn from "../../component/ui/button";
import TalkingCat from "../../component/ui/talkingCat";
import Input from "../../component/ui/input";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const nav = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState<{
    email: string | null;
    password: string | null;
  }>({
    email: null,
    password: null,
  });
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const res = await login(form);
    if (res && res.ok) {
      nav("/dashboard");
    } else {
      const data = JSON.parse(JSON.stringify(res));
      console.log("Error Data:", data);
      if (data.errors) {
        console.log("There are errors array");
        setErrorMessage({
          email: data.errors.find((error: any) => error.field === "email")?.message || null,
          password: data.errors.find((error: any) => error.field === "password")?.message || null,
        });
        console.log(errorMessage);
      } else {
        setErrorMessage({
          email:data.message || null,
          password:data.message || null,
        });
      }
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
          ></Input>
          <Input
            label="Password:"
            type="password"
            name="password"
            placeHolder="Password"
            error={errorMessage.password}
          ></Input>
          <Btn text="Login" btnType="submit" width="30"></Btn>
        </form>
        <a href="#">Forgot password???</a>
        <br />
        <a href="/register">New to CATABLOC?? Sign Up</a>
        {/* <Footer/> */}
      </div>
    </>
  );
};
export default Login;
