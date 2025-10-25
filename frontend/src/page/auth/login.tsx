import React from "react";
import Btn from "../../component/ui/button";
import TalkingCat from "../../component/ui/talkingCat";
import Input from "../../component/ui/input";
import { login } from "../../services/authService";

const Login: React.FC = () => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const res = await login(form);
    if (res) {
      console.log("Login successful");
      console.log(res);
    }
  };
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
          }}
        >
          <Input
            label="Email:"
            type="email"
            name="email"
            placeHolder="Email"
          ></Input>
          <Input
            label="Password:"
            type="password"
            name="password"
            placeHolder="Password"
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
