import { createContext, createElement, useState,useEffect, type FC, type ReactNode } from "react";
import type { User as user } from "../type/user";
export interface AuthContextType {
  user?: user | null;
  isAuthenticated: boolean;
  login: (email:string,password:string) => Promise<Response | undefined>;
  register: (form: HTMLElement) => Promise<Response | undefined>;
  logout: () => void;
  getToken: () => string | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
const url = "http://localhost:8000/api/auth";
export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<user | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // useEffect(() => {
    //     const checkAuthentication = () => {
    //         return !!user;
    //     }
    //     checkAuthentication();
    // }, []);
    useEffect(() => {
        try {
            const storedUser = sessionStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to load user from sessionStorage:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);
    const login = async (email:string,password:string): Promise<Response | undefined> => {
        setIsLoading(true);
        try {
            const response = await fetch(`${url}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            if(response.ok){
                const responseData = await response.json();
                console.log("Login response data:", responseData);
                const user = {email:responseData.data.user.email,name:responseData.data.user.username};
                sessionStorage.setItem("user",JSON.stringify(user));
                setUser(user);
            }
            return response;
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }
    const register = async (form: HTMLElement): Promise<Response | undefined> => {
        const formData = new FormData(form as HTMLFormElement);
        const data = {
            email: formData.get("email"),
            username: formData.get("username"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword"),
        };
        const jsonData = JSON.stringify(data);
        console.log("Jason Data:", jsonData);
        try {
            const response = await fetch(`${url}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: jsonData,
            });
            if(response.ok){
                const resData = await response.json();
                const user = {email: data.email as string,name: data.username as string};
                sessionStorage.setItem("user",JSON.stringify(user));
                setUser(user);
            }
            return response;
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    }
    const getToken = () => {
        return localStorage.getItem("token");
    }
    const value: AuthContextType = {
        isLoading,
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        getToken,
    };
    return createElement(AuthContext.Provider, { value }, children);
};  
