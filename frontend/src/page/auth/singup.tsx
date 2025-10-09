import Header from "../../component/layout/header";
import Footer from "../../component/layout/footer";
import TalkingCat from "../../component/ui/talkingCat";
import Input from "../../component/ui/input";
import Btn from "../../component/ui/button";
const SignUp:React.FC = () =>{
    return(
        <>
        {/* <Header/> */}
        <div style={{display: "flex",flexDirection: "column",alignItems: "center", justifyContent:"center", margin:"120px 0px"}}>
        <TalkingCat text="create an account now to save your progress and save your creation \( >v< )/" />
        <form action="" method="" style={{display:"flex",flexDirection:"column",gap:"30px",margin:"40px 0",alignItems:"center"}}>
            <Input label="Email:" type="email" placeHolder="Email" name="email"></Input>
            <Input label="Username:" type="text" placeHolder="Username" name="uName"></Input>
            <Input label="Password:" type="password" placeHolder="Password" name="password"></Input>
            <Input label="Confirm Password:" type="password" placeHolder="Confirm Password" name="conPassword"></Input>
            <Btn text="Sign Up" btnType="submit"></Btn>
        </form>
        {/* <Footer/> */}
        </div>
        </>
    );
}
export default SignUp;