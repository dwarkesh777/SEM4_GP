import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const response = await fetch(`${API_URL}/api/auth/profile/`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                    } else {
                        localStorage.removeItem("token");
                    }
                } catch (error) {
                    console.error("Auth check failed:", error);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.access);
                const userResponse = await fetch(`${API_URL}/api/auth/profile/`, {
                    headers: { Authorization: `Bearer ${data.access}` }
                });
                const userData = await userResponse.json();
                setUser(userData);
                return { success: true };
            } else {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    error: errorData.detail || errorData.error || "Invalid credentials. Please try again."
                };
            }
        } catch (error) {
            console.error("Login failed:", error);
            return {
                success: false,
                error: `Cannot connect to server at ${API_URL}. Run: cd backend && python manage.py runserver 8000`
            };
        }
    };

    const ownerLogin = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/owner/login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.access);
                const userResponse = await fetch(`${API_URL}/api/auth/profile/`, {
                    headers: { Authorization: `Bearer ${data.access}` }
                });
                const userData = await userResponse.json();
                setUser(userData);
                return { success: true };
            } else {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    error: errorData.detail || errorData.error || "Invalid credentials. Please try again."
                };
            }
        } catch (error) {
            console.error("Owner login failed:", error);
            return {
                success: false,
                error: `Cannot connect to server at ${API_URL}. Run: cd backend && python manage.py runserver 8000`
            };
        }
    };

    const signup = async (email, password, fullName, isOwner) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/register/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, full_name: fullName, is_owner: isOwner })
            });
            if (response.ok) {
                return { success: true };
            } else {
                const errorData = await response.json().catch(() => ({}));
                // Handle various Django/DRF error formats
                let errorMessage = "Registration failed. Please try again.";

                if (errorData.email) {
                    errorMessage = Array.isArray(errorData.email) ? errorData.email[0] : errorData.email;
                    if (errorMessage.includes("already exists")) {
                        errorMessage = "This email is already registered.";
                    }
                } else if (errorData.detail) {
                    errorMessage = errorData.detail;
                } else if (errorData.error) {
                    errorMessage = errorData.error;
                } else if (errorData.non_field_errors) {
                    errorMessage = errorData.non_field_errors[0];
                }

                return { success: false, error: errorMessage };
            }
        } catch (error) {
            console.error("Signup failed:", error);
            return {
                success: false,
                error: `Cannot connect to server at ${API_URL}. Run: cd backend && python manage.py runserver 8000`
            };
        }
    };

    const requestOTP = async (email, isOwner = false) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/otp/request/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, is_owner: isOwner })
            });
            if (response.ok) {
                return { success: true };
            } else {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    error: errorData.error || "Failed to send OTP. Please try again."
                };
            }
        } catch (error) {
            console.error("Request OTP failed:", error);
            return {
                success: false,
                error: "Network error. Please check your connection."
            };
        }
    };

    const verifyOTP = async (email, code, isOwner = false) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/otp/verify/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code, is_owner: isOwner })
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.access);
                setUser(data.user);
                return { success: true };
            } else {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    error: errorData.error || "Invalid OTP. Please try again."
                };
            }
        } catch (error) {
            console.error("Verify OTP failed:", error);
            return {
                success: false,
                error: "Network error. Please check your connection."
            };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, ownerLogin, signup, logout, requestOTP, verifyOTP, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);