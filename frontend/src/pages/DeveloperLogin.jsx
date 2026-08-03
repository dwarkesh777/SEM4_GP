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

const DeveloperLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [loginMethod, setLoginMethod] = useState("password");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
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
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <Navbar />
            <div className="flex-1 flex pt-20">
                {/* Left panel — terminal / code aesthetic */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.15),transparent_60%)]" />
                <div className="absolute top-24 left-16 w-80 h-80 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-16 right-16 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full" />

                {/* Grid lines overlay */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)",
                        backgroundSize: "48px 48px"
                    }}
                />

                {/* Logo */}
                <Link to="/" className="relative z-10 flex items-center gap-2.5 group w-fit">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/15 backdrop-blur-md border border-emerald-500/30 shadow-lg group-hover:scale-105 transition-transform">
                        <Code2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-2xl tracking-tight font-heading text-white">
                        <span className="font-medium">Nest</span>
                        <span className="font-black text-emerald-400">Node</span>
                    </span>
                </Link>

                {/* Terminal mock */}
                <div className="relative z-10 max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9 }}
                    >
                        {/* Fake terminal window */}
                        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-2xl shadow-black/40 mb-8">
                            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-700/60 bg-slate-800/60">
                                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                                <span className="ml-2 text-xs text-slate-500 font-mono">nestnode-api — bash</span>
                            </div>
                            <div className="p-5 font-mono text-sm space-y-2">
                                <div className="flex gap-2">
                                    <span className="text-emerald-400">$</span>
                                    <span className="text-slate-300">curl https://nestnode.app/api/public/properties/list/</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-slate-600">#</span>
                                    <span className="text-slate-500">-H 'X-API-Key: dev_••••••••••••'</span>
                                </div>
                                <div className="mt-3 text-emerald-400 text-xs">
                                    {"{"} "status": 200, "count": 42, "results": [...] {"}"}
                                </div>
                                <div className="flex items-center gap-1 mt-2">
                                    <span className="text-emerald-400">$</span>
                                    <span className="w-1.5 h-4 bg-emerald-400 animate-pulse rounded-sm" />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-4xl font-black text-white font-heading leading-tight mb-4 tracking-tight">
                            Build with{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                NestNode APIs
                            </span>
                        </h2>
                        <p className="text-slate-400 text-base leading-relaxed font-medium">
                            Access hostel data, manage bookings, and integrate with our platform using our developer-grade REST API.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right panel — login form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-slate-50">
                {/* Subtle mobile bg */}
                <div className="absolute inset-0 lg:hidden bg-gradient-to-br from-slate-50 to-emerald-50/30" />

                <div className="w-full max-w-md relative z-10">
                    {/* Mobile logo */}
                    <Link to="/" className="lg:hidden flex items-center gap-2 mb-10">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
                            <Code2 className="w-5 h-5 text-white" />
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
                        <Card className="border-none shadow-2xl shadow-emerald-500/5 rounded-[2rem] overflow-hidden">
                            <CardHeader className="space-y-1 pb-6 text-center bg-white pt-8">
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
                            <div className="px-8 bg-white">
                                <div className="flex p-1 bg-slate-100 rounded-2xl mb-4">
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

                            <CardContent className="space-y-5 pt-2 bg-white px-8 pb-6">
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
                                                    className="pl-11 py-6 rounded-2xl border-slate-200 focus-visible:ring-emerald-500/20"
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
                                                <Link to="#" className="text-xs font-bold text-emerald-600 hover:underline">
                                                    Forgot password?
                                                </Link>
                                            </div>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                                <Input
                                                    id="dev-password"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="pl-11 py-6 rounded-2xl border-slate-200 focus-visible:ring-emerald-500/20"
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
                                                    className="pl-11 py-6 rounded-2xl border-slate-200 focus-visible:ring-emerald-500/20"
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
                                                        className="pl-11 py-6 rounded-2xl border-slate-200 font-mono tracking-widest focus-visible:ring-emerald-500/20"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setOtpSent(false)}
                                                    className="text-xs font-bold text-emerald-600 hover:underline ml-1"
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
                                    <Link to="/developer/signup" className="text-emerald-600 font-bold hover:underline">
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
        </div>
        </div>
    );
};

export default DeveloperLogin;
