
import React, { use, useState } from "react";
import TalkingCat from "../../component/ui/talkingCat";
import Input from "../../component/ui/input";
import Btn from "../../component/ui/button";
import { signUp } from "../../services/authService";
import { useNavigate } from "react-router-dom";
// const form = document.getElementById("reg") as HTMLFormElement | null;
// if(form){
//     form.addEventListener("submit", async (e) => {
//         e.preventDefault();
//         const response = await signUp(form);
//         console.log(response);
//     });
// } else {
//     console.error("Form element not found");
// };
// const signUp = async (): Promise<Response | undefined> => {
//     console.log("signup function called");
//     const url = "http://localhost:8000/api/auth";
//     if (form) {
//         const formData = new FormData(form);
//         const data = Object.fromEntries(formData.entries());
        
//         try {
//             const res = await fetch(`${url}/register`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify(data)
//             });
//             if(!res.ok){
//                 throw new Error(`HTTP error! status: ${res.status}`);
//             }
//             console.log("signup called");
//             return res;
//         } catch (error) {
//             console.error("Signup error:", error);
//             throw error;
//         }
//     }
// };
const SignUp:React.FC = () =>{
    // const [formData, setFormData] = useState({
    //     email: "",
    //     username: "",
    //     password: "",
    //     confirmPassword: ""
    // });
    
    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target;
    //     setFormData(prev => ({
    //         ...prev,
    //         [name]: value
    //     }))
    // };
    const nav = useNavigate();
    const submit = async (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        const form = e.currentTarget;
        // console.log("form Data:",formData);// Debug line
        const response = await signUp(form);
        console.log(response);
        if(response && response.ok){
            // Handle successful signup (e.g., redirect to login page)
            console.log("Signup successful!");
            nav("/login"); 
        }
    }
    return(
        <>
        {/* <Header/> */}
        <div style={{display: "flex",flexDirection: "column",alignItems: "center", justifyContent:"center", margin:"120px 0px"}}>
        <TalkingCat text="create an account now to save your progress and save your creation \( >v< )/" />
        <form onSubmit={submit} id="reg" name="regForm" style={{display:"flex",flexDirection:"column",gap:"30px",margin:"40px 0",alignItems:"center"}}>
            <Input label="Email:" type="email" placeHolder="Email" name="email" required="required"></Input>
            <Input label="Username:" type="text" placeHolder="Username" name="username" required="required"></Input>
            <Input label="Password:" type="password" placeHolder="Password" name="password" required="required"></Input>
            <Input label="Confirm Password:" type="password" placeHolder="confirmPassword" name="confirmPassword" required="required"></Input>
            <Btn text="Sign Up" btnType="submit"></Btn>
        </form>
        <h1 id="test">Hello</h1>
        {/* <Footer/> */}
        </div>
        </>
    );
}
export default SignUp;