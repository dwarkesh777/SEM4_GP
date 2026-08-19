import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    MapPin, Mail, Lock, ArrowRight, User, Building2, ShieldCheck, 
    Eye, EyeOff, Loader2, CheckCircle2, Sparkles, KeyRound
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";

// The primary toggle roles requested: Student and Property Owner
const MAIN_ROLES = [
    {
        id: "student",
        label: "Student",
        shortLabel: "Student",
        title: "Student Portal",
        badge: "WELCOME TO THE FUTURE OF HOUSING",
        description: "Find and book your perfect hostel or PG with ease.",
        headline: <>Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">journey</span> starts here.</>,
        tagline: "Join thousands of students discovering verified, budget-friendly and premium hostels.",
        icon: User,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
        accent: "blue",
        themeGradient: "from-blue-600 to-cyan-600",
        pillActive: "bg-blue-600",
        buttonBg: "bg-blue-600 hover:bg-blue-700 shadow-blue-600/25",
        signupLink: "/signup/user",
        signupText: "Sign up as Student",
        emailPlaceholder: "student@example.com"
    },
    {
        id: "owner",
        label: "Property Owner",
        shortLabel: "Property",
        title: "Owner Portal",
        badge: "GROW YOUR HOSTEL BUSINESS",
        description: "Manage your listings, rooms, bookings and tenant requests.",
        headline: <>Empower your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-300">properties</span> today.</>,
        tagline: "Reach thousands of verified students, fill occupancy faster, and streamline payments effortlessly.",
        icon: Building2,
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80",
        accent: "indigo",
        themeGradient: "from-indigo-600 to-violet-600",
        pillActive: "bg-indigo-600",
        buttonBg: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25",
        signupLink: "/signup/owner",
        signupText: "Register as Property Owner",
        emailPlaceholder: "partner@nestnode.com"
    }
];

// Fallback metadata for admin & developer if accessed directly via dedicated route/props
const ALL_ROLES_MAP = {
    student: MAIN_ROLES[0],
    owner: MAIN_ROLES[1],
   
};

const Login = ({ defaultRole }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const roleParam = searchParams.get("role");

    // Initialize active role based on prop, URL param, or default to student
    const initialRole = defaultRole || (roleParam === "owner" ? "owner" : roleParam === "admin" ? "admin" : "student");
    const [activeRole, setActiveRole] = useState(initialRole);

    // Form inputs state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState("");
    const [loginMethod, setLoginMethod] = useState("password"); // "password" | "otp"
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    const { login, ownerLogin, adminLogin, developerLogin, sendOTP, loginWithOTP } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Sync state if defaultRole prop changes
    useEffect(() => {
        if (defaultRole && defaultRole !== activeRole) {
            setActiveRole(defaultRole);
        }
    }, [defaultRole]);

    // Handle role toggle change between Student and Property Owner
    const handleRoleChange = (roleId) => {
        setActiveRole(roleId);
        setSearchParams({ role: roleId }, { replace: true });
        setOtpSent(false);
        setOtp("");
    };

    const currentRole = ALL_ROLES_MAP[activeRole] || MAIN_ROLES[0];

    // Password submission
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password) {
            toast.error("Please provide both email and password.");
            return;
        }

        setLoading(true);
        try {
            let result;
            if (activeRole === "student") {
                result = await login(email.trim(), password);
                if (result.success) {
                    toast.success("Welcome back to NestNode!");
                    const dest = location.state?.from || "/";
                    navigate(dest);
                } else {
                    toast.error(result.error || "Invalid student credentials.");
                }
            } else if (activeRole === "owner") {
                result = await ownerLogin(email.trim(), password);
                if (result.success) {
                    toast.success("Welcome back, Property Owner!");
                    const dest = location.state?.from || "/";
                    navigate(dest);
                } else {
                    toast.error(result.error || "Invalid owner credentials.");
                }
            } 
        } catch (error) {
            console.error("Login submission error:", error);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Send OTP for OTP login flow
    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error("Please enter your registered email address.");
            return;
        }

        setLoading(true);
        try {
            const result = await sendOTP(email.trim());
            if (result.success) {
                setOtpSent(true);
                toast.success(result.message || "OTP code sent to your email!");
            } else {
                toast.error(result.error || "Failed to send OTP.");
            }
        } catch (error) {
            toast.error("Network error while sending OTP.");
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP submission
    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        if (!otp.trim()) {
            toast.error("Please enter the 6-digit OTP code.");
            return;
        }

        setLoading(true);
        try {
            const result = await loginWithOTP(email.trim(), otp.trim());
            if (result.success) {
                toast.success("Verification successful! Welcome back.");
                const dest = location.state?.from || "/";
                navigate(dest);
            } else {
                toast.error(result.error || "Invalid or expired OTP code.");
            }
        } catch (error) {
            toast.error("OTP verification failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Left Side: Hero Branding & Visual Showcase (Desktop) */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 select-none">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentRole.id}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0"
                    >
                        <img 
                            src={currentRole.image} 
                            alt={currentRole.title} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/40 backdrop-blur-[1px]" />
                    </motion.div>
                </AnimatePresence>

                {/* Top Logo */}
                <Link to="/" className="relative z-10 flex items-center gap-3 w-fit group">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl group-hover:scale-105 group-hover:bg-white/20 transition-all duration-300">
                        <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl tracking-tighter font-heading text-white">
                        <span className="font-bold">Nest</span>
                        <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Node</span>
                    </span>
                </Link>

                {/* Dynamic Hero Messaging */}
                <div className="relative z-10 max-w-lg mb-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentRole.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <span className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6 shadow-xl">
                                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                {currentRole.badge}
                            </span>
                            
                            <h2 className="text-[3.25rem] font-black text-white font-heading leading-[1.1] tracking-tight mb-5">
                                {currentRole.headline}
                            </h2>
                            
                            <p className="text-white/80 text-lg leading-relaxed font-medium mb-8">
                                {currentRole.tagline}
                            </p>

                            {/* Trust Stats Bar */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                                <div>
                                    <div className="text-2xl font-black text-white">50K+</div>
                                    <div className="text-xs text-white/60 font-medium">Active Students</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white">1,200+</div>
                                    <div className="text-xs text-white/60 font-medium">Verified Hostels</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white">4.9 / 5</div>
                                    <div className="text-xs text-white/60 font-medium">Student Rating</div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Right Side: Interactive Login Form with ONLY Student and Property Toggle */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 xl:p-16 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100/60">
                {/* Background Ambient Glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-violet-100/30 rounded-full blur-[90px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

                <div className="w-full max-w-[460px] relative z-10 py-6">
                    {/* Mobile Brand Header */}
                    <div className="lg:hidden flex items-center justify-between mb-8">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 shadow-md shadow-blue-600/20">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl tracking-tight font-heading text-slate-900">
                                <span className="font-bold">Nest</span>
                                <span className="font-black text-blue-600">Node</span>
                            </span>
                        </Link>
                        <Link to="/" className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
                            ← Back to Home
                        </Link>
                    </div>

                    {/* Toggle between Student and Property */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2.5 px-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Account Type</span>
                            <span className="text-xs font-semibold text-slate-500">
                                Logging in as: <strong className="text-slate-900">{currentRole.label}</strong>
                            </span>
                        </div>
                        
                        {/* Clean 2-Segment Toggle Button: Student & Property */}
                        <div className="grid grid-cols-2 p-1.5 bg-slate-200/70 backdrop-blur-md rounded-2xl border border-slate-200 shadow-inner gap-1.5">
                            {MAIN_ROLES.map((role) => {
                                const Icon = role.icon;
                                const isSelected = activeRole === role.id;
                                return (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => handleRoleChange(role.id)}
                                        className={`relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 select-none ${
                                            isSelected 
                                                ? "text-white shadow-md shadow-slate-900/10" 
                                                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                                        }`}
                                    >
                                        {isSelected && (
                                            <motion.div
                                                layoutId="activeRolePill"
                                                className={`absolute inset-0 rounded-xl ${
                                                    role.id === "student" ? "bg-blue-600" : "bg-indigo-600"
                                                }`}
                                                transition={{ type: "spring", stiffness: 450, damping: 35 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center gap-2">
                                            <Icon className="w-4 h-4 shrink-0" />
                                            <span>{role.label}</span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Login Card */}
                    <Card className="border border-slate-200/80 shadow-2xl shadow-slate-200/60 rounded-[2rem] overflow-hidden bg-white/90 backdrop-blur-xl">
                        <CardHeader className="space-y-1.5 pb-6 text-center bg-white px-8 pt-8">
                            <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-inner transition-colors duration-300"
                                 style={{
                                     backgroundColor: activeRole === "student" ? "#eff6ff" :
                                                      activeRole === "owner" ? "#eef2ff" : "#f1f5f9",
                                     color: activeRole === "student" ? "#2563eb" :
                                            activeRole === "owner" ? "#4f46e5" : "#0f172a"
                                 }}>
                                <currentRole.icon className="w-7 h-7" />
                            </div>
                            <CardTitle className="text-3xl font-black text-slate-900 font-heading tracking-tight">
                                {currentRole.title}
                            </CardTitle>
                            <CardDescription className="text-slate-500 font-medium text-sm">
                                {currentRole.description}
                            </CardDescription>
                        </CardHeader>

                        {/* Password vs OTP Method Switcher */}
                        {activeRole !== "admin" && (
                            <div className="px-8 bg-white">
                                <div className="flex p-1 bg-slate-100/90 rounded-xl mb-6">
                                    <button
                                        type="button"
                                        onClick={() => { setLoginMethod("password"); setOtpSent(false); }}
                                        className={`flex-1 py-2 text--xs font-bold rounded-lg transition-all ${
                                            loginMethod === "password" 
                                                ? "bg-white text-slate-900 shadow-sm" 
                                                : "text-slate-500 hover:text-slate-800"
                                        }`}
                                    >
                                        Password Login
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setLoginMethod("otp")}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                                            loginMethod === "otp" 
                                                ? "bg-white text-slate-900 shadow-sm" 
                                                : "text-slate-500 hover:text-slate-800"
                                        }`}
                                    >
                                        Email OTP Code
                                    </button>
                                </div>
                            </div>
                        )}

                        <CardContent className="space-y-5 pt-0 bg-white px-8">
                            {/* Password Flow */}
                            {loginMethod === "password" ? (
                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="login-email" className="font-bold text-slate-700 ml-1 text-xs uppercase tracking-wider">
                                            {activeRole === "owner" ? "Business Email" : "Email Address"}
                                        </Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="login-email"
                                                type="email"
                                                placeholder={currentRole.emailPlaceholder}
                                                className="pl-11 py-6 rounded-2xl border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-primary/50 transition-all placeholder:text-slate-400 shadow-sm text-sm"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between ml-1">
                                            <Label htmlFor="login-password" className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                                                Password
                                            </Label>
                                            <button
                                                type="button"
                                                onClick={() => setShowForgotModal(true)}
                                                className="text-xs font-bold text-primary hover:underline cursor-pointer"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="login-password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••••••"
                                                className="pl-11 pr-11 py-6 rounded-2xl border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-primary/50 transition-all placeholder:text-slate-400 shadow-sm text-sm"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 focus:outline-none p-1"
                                                title={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remember Me Checkbox */}
                                    <div className="flex items-center justify-between pt-1">
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input 
                                                type="checkbox" 
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 accent-primary" 
                                            />
                                            <span className="text-xs font-medium text-slate-600">Remember me on this device</span>
                                        </label>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full py-6 rounded-2xl text-white font-bold text-base shadow-xl transition-all duration-200 active:scale-[0.98] mt-4 flex items-center justify-center gap-2 ${
                                            activeRole === "student" ? "bg-blue-600 hover:bg-blue-700 shadow-blue-600/25" :
                                            activeRole === "owner" ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25" :
                                            "bg-slate-900 hover:bg-slate-800 shadow-slate-900/25"
                                        }`}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Authenticating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Log in to {currentRole.label}</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            ) : (
                                /* OTP Login Flow */
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="otp-email" className="font-bold text-slate-700 ml-1 text-xs uppercase tracking-wider">
                                            Email Address
                                        </Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="otp-email"
                                                type="email"
                                                placeholder={currentRole.emailPlaceholder}
                                                className="pl-11 py-6 rounded-2xl border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-primary/50 transition-all placeholder:text-slate-400 shadow-sm text-sm"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                disabled={otpSent}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {!otpSent ? (
                                        <Button
                                            type="button"
                                            onClick={handleSendOTP}
                                            disabled={loading || !email}
                                            className={`w-full py-6 rounded-2xl text-white font-bold text-base shadow-xl transition-all duration-200 active:scale-[0.98] mt-2 flex items-center justify-center gap-2 ${
                                                activeRole === "student" ? "bg-blue-600 hover:bg-blue-700 shadow-blue-600/25" :
                                                "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25"
                                            }`}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Sending OTP Code...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Send 6-Digit OTP</span>
                                                    <ArrowRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </Button>
                                    ) : (
                                        <form onSubmit={handleOTPSubmit} className="space-y-4 animate-in fade-in-50 duration-300">
                                            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2 text-emerald-800 text-xs">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>A 6-digit code has been sent to <strong>{email}</strong></span>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between ml-1">
                                                    <Label htmlFor="otp-input" className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                                                        Enter OTP Code
                                                    </Label>
                                                    <button
                                                        type="button"
                                                        onClick={handleSendOTP}
                                                        disabled={loading}
                                                        className="text-xs font-bold text-primary hover:underline cursor-pointer"
                                                    >
                                                        Resend Code
                                                    </button>
                                                </div>
                                                <div className="relative group">
                                                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                    <Input
                                                        id="otp-input"
                                                        type="text"
                                                        maxLength={6}
                                                        placeholder="123456"
                                                        className="pl-11 py-6 rounded-2xl border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-primary/50 transition-all font-mono tracking-widest text-center text-lg shadow-sm"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={loading || otp.length < 4}
                                                className={`w-full py-6 rounded-2xl text-white font-bold text-base shadow-xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 ${
                                                    activeRole === "student" ? "bg-blue-600 hover:bg-blue-700 shadow-blue-600/25" :
                                                    "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25"
                                                }`}
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        <span>Verifying OTP...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Verify & Sign In</span>
                                                        <ArrowRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </Button>

                                            <div className="text-center pt-1">
                                                <button
                                                    type="button"
                                                    onClick={() => { setOtpSent(false); setOtp(""); }}
                                                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                                                >
                                                    Use a different email address
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            )}
                        </CardContent>

                        {/* Card Footer: Contextual Signup Link */}
                        <CardFooter className="flex flex-col space-y-3 bg-slate-50/70 p-6 sm:p-8 pt-6 border-t border-slate-100 text-center">
                            <div className="text-sm font-medium text-slate-500">
                                Don't have an account?{" "}
                                <Link 
                                    to={currentRole.signupLink} 
                                    className={`font-bold hover:underline transition-colors ${
                                        activeRole === "student" ? "text-blue-600 hover:text-blue-700" :
                                        "text-indigo-600 hover:text-indigo-700"
                                    }`}
                                >
                                    {currentRole.signupText}
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* Forgot Password Modal Dialog */}
            <ForgotPasswordModal
                isOpen={showForgotModal}
                onClose={() => setShowForgotModal(false)}
                initialEmail={email}
            />
        </div>
    );
};

export default Login;
