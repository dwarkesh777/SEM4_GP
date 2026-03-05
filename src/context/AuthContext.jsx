import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

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
        setUser(null);
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

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();

            const response = await fetch(`${API_URL}/api/auth/firebase-login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: idToken })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.access);
                setUser(data.user);
                toast.success(`Welcome ${data.user.full_name || 'back'}!`);
                return { success: true };
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.error || "Firebase authentication failed.");
                return { success: false, error: errorData.error };
            }
        } catch (error) {
            console.error("Google login failed:", error);
            if (error.code === 'auth/popup-closed-by-user') {
                toast.error("Login popup closed. Please try again.");
            } else if (error.code === 'auth/unauthorized-domain') {
                toast.error("This domain is not authorized for Firebase auth. Add it in Firebase Console.");
            } else {
                toast.error("Google login failed. Please check your Firebase configuration.");
            }
            return { success: false, error: error.message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, ownerLogin, signup, logout, loading, sendOTP, loginWithOTP, loginWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);