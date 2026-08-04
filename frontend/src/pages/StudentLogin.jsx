import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Mail, Lock, ArrowRight, User } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";

const StudentLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [loginMethod, setLoginMethod] = useState("password"); // "password" or "otp"
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const { login, sendOTP, loginWithOTP } = useAuth();
    const navigate = useNavigate();

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await login(email, password);
            if (result.success) {
                toast.success("Welcome back!");
                navigate("/");
            } else {
                toast.error(result.error || "Invalid credentials. Please try again.");
            }
        } catch (error) {
            console.error("Student login error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Please enter your email.");
        setLoading(true);
        try {
            const result = await sendOTP(email);
            if (result.success) {
                setOtpSent(true);
                toast.success(result.message || "OTP sent to your email!");
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        if (!otp) return toast.error("Please enter the OTP.");
        setLoading(true);
        try {
            const result = await loginWithOTP(email, otp);
            if (result.success) {
                toast.success("Welcome back!");
                navigate("/");
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("OTP Verification failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-4 pt-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="border-none shadow-2xl shadow-primary/5 rounded-[2rem] overflow-hidden">
                    <CardHeader className="space-y-1 pb-8 text-center bg-white">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                            <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-black text-slate-900 font-heading">Student Login</CardTitle>
                        <CardDescription className="text-slate-500 font-medium tracking-tight">
                            Find your perfect home away from home.
                        </CardDescription>
                    </CardHeader>

                    {/* Login Method Toggle */}
                    <div className="px-8 bg-white">
                        <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
                            <button
                                onClick={() => { setLoginMethod("password"); setOtpSent(false); }}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${loginMethod === "password" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                Password
                            </button>
                            <button
                                onClick={() => setLoginMethod("otp")}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${loginMethod === "otp" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                Email OTP
                            </button>
                        </div>
                    </div>

                    <CardContent className="space-y-6 pt-2 bg-white px-8">
                        {loginMethod === "password" ? (
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="font-bold text-slate-700 ml-1">Email Address</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            className="pl-11 py-6 rounded-2xl border-slate-200"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between ml-1">
                                        <Label htmlFor="password" title="password" className="font-bold text-slate-700">Password</Label>
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotModal(true)}
                                            className="text-xs font-bold text-primary hover:underline cursor-pointer"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-11 py-6 rounded-2xl border-slate-200"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full py-7 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-[0.98] mt-4"
                                    disabled={loading}
                                >
                                    {loading ? "Signing in..." : "Continue"}
                                    {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={otpSent ? handleOTPSubmit : handleSendOTP} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="font-bold text-slate-700 ml-1">Email Address</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            className="pl-11 py-6 rounded-2xl border-slate-200"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={otpSent}
                                        />
                                    </div>
                                </div>

                                {otpSent && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor="otp" className="font-bold text-slate-700 ml-1">One-Time Password (OTP)</Label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                id="otp"
                                                type="text"
                                                placeholder="Enter 6-digit code"
                                                maxLength={6}
                                                className="pl-11 py-6 rounded-2xl border-slate-200"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setOtpSent(false)}
                                            className="text-xs font-bold text-primary hover:underline ml-1"
                                        >
                                            Change email address
                                        </button>
                                    </motion.div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full py-7 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-[0.98] mt-4"
                                    disabled={loading}
                                >
                                    {loading ? (otpSent ? "Verifying..." : "Sending...") : (otpSent ? "Login" : "Get OTP")}
                                    {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 bg-slate-50/50 p-8 pt-6">
                        <div className="text-center text-sm font-medium text-slate-500">
                            Don't have an account?{" "}
                            <Link to="/student/signup" className="text-primary font-bold hover:underline">
                                Create an account
                            </Link>
                        </div>
                        <div className="w-full h-px bg-slate-200" />
                        <Link
                            to="/owner/login"
                            className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors flex items-center gap-2"
                        >
                            <User className="w-3.5 h-3.5" />
                            Are you a property owner?
                        </Link>
                    </CardFooter>
                </Card>
            </motion.div>

            <ForgotPasswordModal
                isOpen={showForgotModal}
                onClose={() => setShowForgotModal(false)}
                initialEmail={email}
            />
        </div>
    );
};

export default StudentLogin;
