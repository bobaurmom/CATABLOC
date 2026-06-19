import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Btn from "../../component/ui/Button";
import TalkingCat from "../../component/ui/TalkingCat";
import Input from "../../component/ui/input";
import { useAuth } from "../../hooks/useAuth";
import BreadcrumbAlert from "../../component/ui/Snackbar";
import Verification from "../../component/ui/Verification";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    const { resetPassword } = useAuth();

    const existToken = sessionStorage.getItem("resetToken");

    useEffect(() => {
        return () => {
            sessionStorage.removeItem("resetToken");
        }
    }, [])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!existToken){
            try {
                const response = await resetPassword(email);
                if (response.status === 200) {
                    setShowPopup(true);
                } else {
                    setErrorMessage("Failed to send reset code. Please try again.");
                }
            } catch (error) {
                setErrorMessage("An error occurred. Please try again later.");
            }
        };
        
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin: "120px 0px",
            }}
        >
            <TalkingCat text="Forgot your password? No worries!" />
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
                {!existToken && (
                    <Input
                        label="Email:"
                        type="email"
                        name="email"
                        placeHolder="Email"
                        error={errorMessage}
                    onChange={(e: any) => {
                        setEmail(e.target.value);
                        setErrorMessage(null);
                    }}
                ></Input>
                )}
                {existToken && (
                    <div>
                        <Input
                            label="New Password:"
                            type="password"
                            name="newPassword"
                            placeHolder="New Password"
                        ></Input>
                        <Input
                            label="Confirm Password:"
                            type="password"
                            name="confirmPassword"
                            placeHolder="Confirm Password"
                        ></Input>
                    </div>
                )}
                <Btn btnType="submit" width="50">
                    Send Code
                </Btn>
            </form>
            <Link to="/login">Back to Login</Link>
            
            {showPopup && (
                <Verification email={email} OTPtype="password_reset" onClose={() => setShowPopup(false)} ></Verification>
            )}
        </div>
    );
}

export default ForgotPassword;