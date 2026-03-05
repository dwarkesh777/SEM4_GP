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

const StudentLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [loginMethod, setLoginMethod] = useState("password"); // "password" or "otp"
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login, sendOTP, loginWithOTP, loginWithGoogle } = useAuth();
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
                                        <Link to="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
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

                        <div className="relative flex items-center gap-4 py-2">
                            <div className="flex-1 h-px bg-slate-100" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">OR</span>
                            <div className="flex-1 h-px bg-slate-100" />
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={loginWithGoogle}
                            className="w-full py-7 rounded-2xl border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </Button>
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
        </div>
    );
};

export default StudentLogin;
