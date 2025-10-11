
import React from "react";
import Btn from "../../component/ui/button";
import TalkingCat from "../../component/ui/talkingCat";
import Input from "../../component/ui/input";

const Login :React.FC = () =>{
    return(
        <>
        {/* <Header/> */}
        <div style={{display: "flex",flexDirection: "column",alignItems: "center", justifyContent:"center", margin:"120px 0px"}}>
        <TalkingCat text="Login to resume your progress!"></TalkingCat>
        <form action="" method="" style={{display:"flex",flexDirection:"column",gap:"30px",margin:"40px 0",alignItems:"center"}}>
        <Input label="Email:" type="email" name="email" placeHolder="Email"></Input>
        <Input label="Password:" type="password" name="password" placeHolder="Password"></Input>
        <Btn text="Login" btnType="submit" width="30"></Btn>
        </form>
        <a href="#">Forgot password???</a><br/>
        <a href="/signUp">New to CATABLOC?? Sign Up</a>
        {/* <Footer/> */}
        </div>
        </>
    )
}
export default Login;
