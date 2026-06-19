const url = "http://localhost:8000/api/auth";

interface errorResponse {
  field: string;
  message: string;
}


const resendcode = async (email:string, type: "email_verification" | "password_reset"): Promise<Response | undefined> => {
  const data = {email, type};
  const jsonData = JSON.stringify(data);
  try {
    const res = await fetch(`${url}/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: jsonData,
      credentials: "include",
    });
    const resData = await res.json();
    if (!res.ok) {
      return resData;
    }
    return res;
  } catch (error) {
    throw error;
  }
};

const validateRegisterForm = (data: { email: string; username: string; password: string; confirmPassword: string }): errorResponse[] => {
  const errors: errorResponse[] = [];

  if (!data.email) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (data.email.length >= 255){
    errors.push({ field: "email", message: "Email must be less than 255 characters" });
  }


  if (!data.username) {
    errors.push({ field: "username", message: "Username is required" });
  } else if(data.username.length < 3){
    errors.push({ field: "username", message: "Username must be at least 3 characters long" });
  } else if(data.username.length >= 50){
    errors.push({ field: "username", message: "Username must be less than 50 characters" });
  } else if (!/^[a-zA-Z0-9_-]+$/.test(data.username)) {
    errors.push({ field: "username", message: "Username can only contain letters, numbers, underscores, and hyphens" });
  }

  if (!data.password) {
    errors.push({ field: "password", message: "Password is required" });
  } else if(data.password.length < 8){
    errors.push({ field: "password", message: "Password must be at least 8 characters long" });
  } else if (!/[a-z]/.test(data.password)) {
    errors.push({ field: "password", message: "Password must contain at least one lowercase letter" });
  } else if (!/[0-9]/.test(data.password)) {
    errors.push({ field: "password", message: "Password must contain at least one digit" });
  }

  if (data.password !== data.confirmPassword) {
    errors.push({ field: "confirmPassword", message: "Passwords do not match" });
  }

  return errors;
};


export { resendcode, validateRegisterForm };
