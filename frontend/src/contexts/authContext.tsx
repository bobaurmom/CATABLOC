import { createContext, createElement, useState,useEffect, type FC, type ReactNode } from "react";
import type { User as user } from "../type/user";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { AxiosResponse } from "axios";


export interface AuthContextType {
  user?: user | null;
  isAuthenticated: boolean;
  login: (email:string,password:string) => Promise<{response: Response, data?: any}>;
  register: (payload: { email: string; username: string; password: string; confirmPassword: string }) => Promise<{ response: Response; data: any }>;
  logout: () => void;
  getToken: () => string | null;
  isLoading: boolean;
  verifyEmail: (code: string, email: string, type?: "email_verification" | "password_reset") => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
}

interface AuthResponse {
    axiosResponse: any,
    ok: boolean
}
export const AuthContext = createContext<AuthContextType | null>(null);
const url = "http://localhost:8000/api/auth";
export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<user | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const nav = useNavigate();
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Check if user was previously logged in
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    // Verify the session is still valid
                    try {
                        const response = await fetch(`${url}/verify`, {
                            method: "GET",
                            credentials: "include",
                        });
                        if (response.ok) {
                            // Session is valid
                            const user = JSON.parse(storedUser);
                            setUser(user);
                        } else {
                            // Session expired, clear stored data
                            localStorage.removeItem("user");
                            setUser(null);
                        }
                    } catch (error) {
                        console.error("Auth verification failed:", error);
                        localStorage.removeItem("user");
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error("Failed to initialize auth:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        initializeAuth();
    }, [nav]);

    const mapResponseToAuthResponse = (response: AxiosResponse): AuthResponse => {
        return {
            axiosResponse: response,
            ok: response.status >= 200 && response.status < 300
        }
    };


    const login = async (email:string,password:string): Promise<{response: Response, data?: any}> => {
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
            
            const responseData = await response.json();
            
            if(response.ok){
                const user = {email:responseData.data.user.email, name:responseData.data.user.username};
                localStorage.setItem("user",JSON.stringify(user));
                setUser(user);
            }
            return { response, data: responseData };
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }
    const register = async (payload: { email: string; username: string; password: string; confirmPassword: string }): Promise<{ response: Response; data: any }> => {
        try {
            const response = await fetch(`${url}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            let data: any = null;
            try {
                data = await response.clone().json();
            } catch {
                data = null;
            }

            return { response, data };
        } catch (error) {
            throw error;
        }
    }
    const verifyEmail = async (code: string, email: string, type = "email_verification"): Promise<any> => {
        try {
            const response = await api.post(`${url}/verify-otp`, {email, code, type}, { withCredentials: true });
            
            if(type === "password_reset"){
                sessionStorage.setItem("resetToken", response.data.data.resetToken);
                return response;
            }

            const result = mapResponseToAuthResponse(response);
            
            if (result.ok && response.data?.data?.user) {
                const { user: userData, token, refreshToken } = response.data.data;
                const user = { email: userData.email, name: userData.username };
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("token", token);
                if (refreshToken) {
                    localStorage.setItem("refreshToken", refreshToken);
                }
                setUser(user);
            }
            
            return result;
        } catch (error) {
            throw {ok: false, error};
        }
    }

    const resetPassword = async (email: string): Promise<any> => {
        try {
            const response = await api.post(`${url}/forgot-password`, { email }, { withCredentials: true });
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        localStorage.removeItem("user");
        setUser(null);
        try {
            await fetch(`${url}/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            throw error;
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
        verifyEmail,
        resetPassword
    };
    return createElement(AuthContext.Provider, { value }, children);
};  
