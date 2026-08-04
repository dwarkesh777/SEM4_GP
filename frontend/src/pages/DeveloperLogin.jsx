import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Mail, Lock, ArrowRight, Terminal, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";

const DeveloperLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [loginMethod, setLoginMethod] = useState("password");
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
                localStorage.setItem("userRole", "developer");
                toast.success("Welcome to the Developer Portal!");
                navigate("/developer/dashboard");
            } else {
                toast.error(result.error || "Invalid credentials. Please try again.");
            }
        } catch (error) {
            console.error("Developer login error:", error);
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
        } catch {
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
                localStorage.setItem("userRole", "developer");
                toast.success("Welcome to the Developer Portal!");
                navigate("/developer/dashboard");
            } else {
                toast.error(result.error);
            }
        } catch {
            toast.error("OTP Verification failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <div className="flex-1 flex pt-20">
            {/* Login form */}
            <div className="w-full flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-slate-50">
                {/* Subtle mobile bg */}
                <div className="absolute inset-0 lg:hidden bg-gradient-to-br from-slate-50 to-emerald-50/30" />

                <div className="w-full max-w-md relative z-10">
                    {/* Mobile logo */}
                    <Link to="/" className="flex items-center gap-2 mb-10 justify-center">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/15 backdrop-blur-md border border-emerald-500/30 shadow-lg">
                            <Code2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className="text-2xl tracking-tight font-heading text-slate-900">
                            <span className="font-medium">Nest</span>
                            <span className="font-black text-emerald-600">Node</span>
                        </span>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="border border-slate-100 bg-white/90 backdrop-blur-xl shadow-2xl shadow-emerald-500/5 rounded-[2rem] overflow-hidden">
                            <CardHeader className="space-y-1 pb-6 text-center border-b border-slate-100 pt-8">
                                <div className="mx-auto w-14 h-14 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
                                    <Terminal className="w-7 h-7 text-white" />
                                </div>
                                <CardTitle className="text-3xl font-black text-slate-900 font-heading">
                                    Developer Login
                                </CardTitle>
                                <CardDescription className="text-slate-500 font-medium tracking-tight">
                                    Access your API keys and developer dashboard.
                                </CardDescription>
                            </CardHeader>

                            {/* Method toggle */}
                            <div className="px-8 pt-6">
                                <div className="flex p-1 bg-slate-100 border border-slate-200 rounded-2xl mb-4">
                                    <button
                                        onClick={() => { setLoginMethod("password"); setOtpSent(false); }}
                                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${loginMethod === "password" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                    >
                                        Password
                                    </button>
                                    <button
                                        onClick={() => setLoginMethod("otp")}
                                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${loginMethod === "otp" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                    >
                                        Email OTP
                                    </button>
                                </div>
                            </div>

                            <CardContent className="space-y-5 pt-2 px-8 pb-6">
                                {loginMethod === "password" ? (
                                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="dev-email" className="font-bold text-slate-700 ml-1">
                                                Email Address
                                            </Label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                                <Input
                                                    id="dev-email"
                                                    type="email"
                                                    placeholder="developer@example.com"
                                                    className="pl-11 py-6 rounded-2xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between ml-1">
                                                <Label htmlFor="dev-password" className="font-bold text-slate-700">
                                                    Password
                                                </Label>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowForgotModal(true)}
                                                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                                                >
                                                    Forgot password?
                                                </button>
                                            </div>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                                <Input
                                                    id="dev-password"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="pl-11 py-6 rounded-2xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full py-7 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold text-base shadow-xl shadow-emerald-500/25 transition-all active:scale-[0.98] mt-2"
                                            disabled={loading}
                                        >
                                            {loading ? "Authenticating..." : "Access Developer Portal"}
                                            {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                                        </Button>
                                    </form>
                                ) : (
                                    <form onSubmit={otpSent ? handleOTPSubmit : handleSendOTP} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="dev-otp-email" className="font-bold text-slate-700 ml-1">
                                                Email Address
                                            </Label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                                <Input
                                                    id="dev-otp-email"
                                                    type="email"
                                                    placeholder="developer@example.com"
                                                    className="pl-11 py-6 rounded-2xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
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
                                                <Label htmlFor="dev-otp" className="font-bold text-slate-700 ml-1">
                                                    One-Time Password (OTP)
                                                </Label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                                    <Input
                                                        id="dev-otp"
                                                        type="text"
                                                        placeholder="Enter 6-digit code"
                                                        maxLength={6}
                                                        className="pl-11 py-6 rounded-2xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 font-mono tracking-widest focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setOtpSent(false)}
                                                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline ml-1"
                                                >
                                                    Change email address
                                                </button>
                                            </motion.div>
                                        )}
                                        <Button
                                            type="submit"
                                            className="w-full py-7 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold text-base shadow-xl shadow-emerald-500/25 transition-all active:scale-[0.98] mt-2"
                                            disabled={loading}
                                        >
                                            {loading
                                                ? (otpSent ? "Verifying..." : "Sending...")
                                                : (otpSent ? "Verify & Login" : "Send OTP")}
                                            {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>

                            <CardFooter className="flex flex-col space-y-4 bg-slate-50/70 p-8 pt-6 border-t border-slate-100">
                                <div className="text-center text-sm font-medium text-slate-500">
                                    No developer account?{" "}
                                    <Link to="/developer/signup" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline transition-colors">
                                        Register here
                                    </Link>
                                </div>
                                <div className="w-full h-px bg-slate-200" />
                                <Link
                                    to="/login"
                                    className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Cpu className="w-3.5 h-3.5" />
                                    Back to main login
                                </Link>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </div>
            </div>

            <ForgotPasswordModal
                isOpen={showForgotModal}
                onClose={() => setShowForgotModal(false)}
                initialEmail={email}
            />
        </div>
        </div>
    );
};

export default DeveloperLogin;
