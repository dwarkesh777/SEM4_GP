import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Mail, Lock, ArrowRight, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const OwnerLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [loginMethod, setLoginMethod] = useState("password"); // "password" or "otp"
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const { ownerLogin, sendOTP, loginWithOTP } = useAuth();
    const navigate = useNavigate();

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await ownerLogin(email, password);
            if (result.success) {
                toast.success("Welcome back, Partner!");
                navigate("/");
            } else {
                toast.error(result.error || "Invalid owner credentials. Please try again.");
            }
        } catch (error) {
            console.error("Owner login error:", error);
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
        <div className="min-h-screen flex items-center justify-center bg-indigo-50/30 p-4 pt-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="border-none shadow-2xl shadow-indigo-500/5 rounded-[2rem] overflow-hidden">
                    <CardHeader className="space-y-1 pb-8 text-center bg-white">
                        <div className="mx-auto w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4">
                            <Building2 className="w-6 h-6 text-indigo-600" />
                        </div>
                        <CardTitle className="text-3xl font-black text-slate-900 font-heading">Owner Portal</CardTitle>
                        <CardDescription className="text-slate-500 font-medium tracking-tight">
                            Manage your properties and connect with residents.
                        </CardDescription>
                    </CardHeader>

                    {/* Login Method Toggle */}
                    <div className="px-8 bg-white">
                        <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
                            <button
                                onClick={() => { setLoginMethod("password"); setOtpSent(false); }}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${loginMethod === "password" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                Password
                            </button>
                            <button
                                onClick={() => setLoginMethod("otp")}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${loginMethod === "otp" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                Email OTP
                            </button>
                        </div>
                    </div>

                    <CardContent className="space-y-6 pt-2 bg-white px-8">
                        {loginMethod === "password" ? (
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="font-bold text-slate-700 ml-1">Business Email</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="partner@company.com"
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
                                        <Link to="#" className="text-xs font-bold text-indigo-600 hover:underline">Forgot password?</Link>
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
                                    className="w-full py-7 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] mt-4"
                                    disabled={loading}
                                >
                                    {loading ? "Verifying..." : "Partner Login"}
                                    {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={otpSent ? handleOTPSubmit : handleSendOTP} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="font-bold text-slate-700 ml-1">Business Email</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="partner@company.com"
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
                                            className="text-xs font-bold text-indigo-600 hover:underline ml-1"
                                        >
                                            Change email address
                                        </button>
                                    </motion.div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full py-7 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] mt-4"
                                    disabled={loading}
                                >
                                    {loading ? (otpSent ? "Verifying..." : "Sending...") : (otpSent ? "Login" : "Get OTP")}
                                    {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 bg-slate-50/50 p-8 pt-6 border-t border-slate-100">
                        <div className="text-center text-sm font-medium text-slate-500">
                            New partner?{" "}
                            <Link to="/owner/signup" className="text-indigo-600 font-bold hover:underline">
                                Register your business
                            </Link>
                        </div>
                        <div className="w-full h-px bg-slate-200" />
                        <Link
                            to="/student/login"
                            className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <MapPin className="w-3.5 h-3.5" />
                            Looking for a stay? Student Login
                        </Link>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default OwnerLogin;
