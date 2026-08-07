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

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        setUser(null);
        window.location.href = "/";
    };

    const sendOTP = async (email) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/send-otp/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            let data;
            try {
                data = await response.json();
            } catch (e) {
                return { success: false, error: "Server returned an invalid response. Please check your backend." };
            }

            if (response.ok) {
                return { success: true, message: data.message };
            } else {
                return { success: false, error: data.error || data.detail || "Failed to send OTP." };
            }
        } catch (error) {
            console.error("Send OTP failed:", error);
            return { success: false, error: "Network connection failed. Make sure your server is running." };
        }
    };

    const loginWithOTP = async (email, otp) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/verify-otp/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp })
            });

            let data;
            try {
                data = await response.json();
            } catch (e) {
                return { success: false, error: "Server returned an invalid response." };
            }

            if (response.ok) {
                localStorage.setItem("token", data.access);
                setUser(data.user);
                return { success: true };
            } else {
                return { success: false, error: data.error || data.detail || "Invalid OTP." };
            }
        } catch (error) {
            console.error("OTP Verification failed:", error);
            return { success: false, error: "Network connection failed." };
        }
    };

    const adminLogin = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/admin/login/`, {
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
                    error: errorData.detail || errorData.error || "Invalid admin credentials."
                };
            }
        } catch (error) {
            console.error("Admin login failed:", error);
            return {
                success: false,
                error: `Cannot connect to server at ${API_URL}.`
            };
        }
    };

    const adminSignup = async (email, password, fullName) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/signup/admin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, full_name: fullName })
            });
            if (response.ok) {
                return { success: true };
            } else {
                const errorData = await response.json().catch(() => ({}));
                let errorMessage = "Registration failed.";
                if (errorData.email) {
                    errorMessage = Array.isArray(errorData.email) ? errorData.email[0] : errorData.email;
                } else if (errorData.detail) {
                    errorMessage = errorData.detail;
                }
                return { success: false, error: errorMessage };
            }
        } catch (error) {
            console.error("Admin signup failed:", error);
            return { success: false, error: `Cannot connect to server at ${API_URL}.` };
        }
    };

    const developerLogin = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/developer/login/`, {
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
                    error: errorData.detail || errorData.error || "Invalid developer credentials."
                };
            }
        } catch (error) {
            console.error("Developer login failed:", error);
            return {
                success: false,
                error: `Cannot connect to server at ${API_URL}.`
            };
        }
    };

    const developerSignup = async (email, password, fullName) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/developer/signup/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, full_name: fullName })
            });
            if (response.ok) {
                return { success: true };
            } else {
                const errorData = await response.json().catch(() => ({}));
                let errorMessage = "Registration failed.";
                if (errorData.email) {
                    errorMessage = Array.isArray(errorData.email) ? errorData.email[0] : errorData.email;
                } else if (errorData.detail) {
                    errorMessage = errorData.detail;
                }
                return { success: false, error: errorMessage };
            }
        } catch (error) {
            console.error("Developer signup failed:", error);
            return { success: false, error: `Cannot connect to server at ${API_URL}.` };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, ownerLogin, adminLogin, developerLogin, signup, adminSignup, developerSignup, logout, loading, sendOTP, loginWithOTP }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);