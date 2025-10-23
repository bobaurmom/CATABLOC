
const signUp = async (form:HTMLFormElement): Promise<Response | undefined> => {
    console.log("signup function called");
    const url = "http://localhost:8000/api/auth";
    if (form) {
        const formData = new FormData(form);
        console.log("FormData entries:", Array.from(formData.entries()));
        const data = {
            email: formData.get("email"),
            username: formData.get("username"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword")
        }
        console.log("Form Data:", data);
        const jsonData = JSON.stringify(data);

        try {
            const res = await fetch(`${url}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: jsonData,
                credentials: "include" // Include cookies in the request
            });
            const resData = await res.json();
            if(!res.ok){
                throw new Error(`HTTP error!!! status: ${res.status} response ${JSON.stringify(resData)}` );
            }
            console.log("signup called");
            return res;
        } catch (error) {
            console.error("Signup error:", error);
            throw error;
        }
    }
};

export { signUp };