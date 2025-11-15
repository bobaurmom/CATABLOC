const url = "http://localhost:8000/api/auth";
const signUp = async (form: HTMLFormElement): Promise<Response | undefined> => {
  if (form) {
    const formData = new FormData(form);
    const data = {
      email: formData.get("email"),
      username: formData.get("username"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };
    const jsonData = JSON.stringify(data);

    try {
      const res = await fetch(`${url}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: jsonData,
        credentials: "include", // Include cookies in the request
      });
      const resData = await res.json();
      if (!res.ok) { 
        return resData;  
      }
      return res;
    } catch (error) {
      throw error;
    }
  }
};

const login = async (form: HTMLFormElement): Promise<Response | undefined> => {
  console.log("login service called");
  if (form) {
    const formData = new FormData(form);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    const jsonData = JSON.stringify(data);

    try {
      const res = await fetch(`${url}/login`, {
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
  }
};

const verifycode = async (code:string,email:string): Promise<Response | undefined> => {
  const data = {email,code,type:"email_verification"};
  const jsonData = JSON.stringify(data);
  try {
    const res = await fetch(`${url}/verify-otp`, {
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

const resendcode = async (email:string): Promise<Response | undefined> => {
  const data = {email,type:"email_verification"};
  const jsonData = JSON.stringify(data);
  try {
    const res = await fetch(`${url}/send-otp`, {
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


export { signUp, login ,verifycode,resendcode};
