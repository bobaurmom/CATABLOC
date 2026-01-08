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
    // Initialize auth state on app load
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                    
                    // Verify token/cookies are still valid by making an authenticated request
                    try {
                        const response = await fetch(`${url}/verify`, {
                            method: "GET",
                            credentials: "include",
                        });
                        if (!response.ok) {
                            // If token is invalid, clear stored user
                            localStorage.removeItem("user");
                            localStorage.removeItem("token");
                            setUser(null);
                        }
                    } catch (error) {
                        console.error("Auth verification failed:", error);
                    }
                }
            } catch (error) {
                console.error("Failed to load user from localStorage:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        initializeAuth();
    }, []);
    const login = async (email:string,password:string): Promise<Response | undefined> => {
        setIsLoading(true);
        try {
            const response = await fetch(`${url}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });
            if(response.ok){
                const responseData = await response.json();
                console.log("Login response data:", responseData);
                const user = {email:responseData.data.user.email,name:responseData.data.user.username};
                localStorage.setItem("user",JSON.stringify(user));
                localStorage.setItem("token", responseData.data.token);
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
        try {
            const response = await fetch(`${url}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: jsonData,
            });
            if(response.ok){
                console.log(response)
                const user = {email: data.email as string,name: data.username as string};
                localStorage.setItem("user",JSON.stringify(user));
                setUser(user);
            }
            return response;
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }
    const logout = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        try {
            await fetch(`${url}/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Logout error:", error);
        }
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
