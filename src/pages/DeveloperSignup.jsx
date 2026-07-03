import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Mail, Lock, User, ArrowRight, Terminal, Cpu, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";
import Navbar from "@/components/Navbar";

const DeveloperSignup = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const e = {};
        if (!formData.fullName.trim()) e.fullName = "Full name is required";
        if (!formData.email.trim()) e.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Email is invalid";
        if (!formData.password) e.password = "Password is required";
        else if (formData.password.length < 6) e.password = "Minimum 6 characters";
        if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords don't match";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (id) => (e) => {
        setFormData({ ...formData, [id]: e.target.value });
        if (errors[id]) setErrors({ ...errors, [id]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/register/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    is_owner: false,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Developer account created! Please log in.");
                navigate("/developer/login");
            } else {
                const msg =
                    data.email?.[0] ||
                    data.detail ||
                    data.error ||
                    "Registration failed.";
                toast.error(
                    msg.includes("already exists") ? "This email is already registered." : msg
                );
            }
        } catch {
            toast.error("Network error: Backend server is unreachable.");
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { id: "fullName", label: "Full Name", icon: User, type: "text", placeholder: "Jane Smith" },
        { id: "email", label: "Email Address", icon: Mail, type: "email", placeholder: "developer@example.com" },
        { id: "password", label: "Password", icon: Lock, type: "password", placeholder: "••••••••" },
        { id: "confirmPassword", label: "Confirm Password", icon: Lock, type: "password", placeholder: "••••••••" },
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <Navbar />
            <div className="flex-1 flex pt-20">
                {/* Left panel — dev branding */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.12),transparent_60%)]" />
                <div className="absolute top-32 right-12 w-72 h-72 bg-cyan-500/10 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute bottom-24 left-12 w-64 h-64 bg-emerald-500/10 blur-[90px] rounded-full" />

                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: "linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)",
                        backgroundSize: "48px 48px"
                    }}
                />

                {/* Logo */}
                <Link to="/" className="relative z-10 flex items-center gap-2.5 group w-fit">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/15 backdrop-blur-md border border-cyan-500/30 shadow-lg group-hover:scale-105 transition-transform">
                        <Code2 className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="text-2xl tracking-tight font-heading text-white">
                        <span className="font-medium">Nest</span>
                        <span className="font-black text-cyan-400">Node</span>
                    </span>
                </Link>

                {/* Feature list */}
                <div className="relative z-10 max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9 }}
                    >
                        <h2 className="text-4xl font-black text-white font-heading leading-tight mb-6 tracking-tight">
                            Join the{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                                developer
                            </span>{" "}
                            ecosystem
                        </h2>

                        <div className="space-y-4">
                            {[
                                { icon: "🔑", title: "Instant API Key", desc: "Get your API key immediately after registration." },
                                { icon: "📡", title: "RESTful Endpoints", desc: "Access hostel listings, rooms, and booking data." },
                                { icon: "⚡", title: "Real-time Updates", desc: "Receive booking webhooks and live availability." },
                                { icon: "🛡️", title: "Secure & Scalable", desc: "Enterprise-grade authentication and rate limiting." },
                            ].map((item) => (
                                <div key={item.title} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm">
                                    <span className="text-2xl">{item.icon}</span>
                                    <div>
                                        <p className="font-bold text-white text-sm">{item.title}</p>
                                        <p className="text-slate-400 text-sm mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right panel — signup form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-slate-50">
                <div className="absolute inset-0 lg:hidden bg-gradient-to-br from-slate-50 to-cyan-50/30" />

                <div className="w-full max-w-md relative z-10">
                    {/* Mobile logo */}
                    <Link to="/" className="lg:hidden flex items-center gap-2 mb-10">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500 shadow-lg shadow-cyan-500/20">
                            <Code2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl tracking-tight font-heading text-slate-900">
                            <span className="font-medium">Nest</span>
                            <span className="font-black text-cyan-600">Node</span>
                        </span>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="border-none shadow-2xl shadow-cyan-500/5 rounded-[2rem] overflow-hidden">
                            <CardHeader className="space-y-1 pb-6 text-center bg-white pt-8">
                                <div className="mx-auto w-14 h-14 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/30">
                                    <Terminal className="w-7 h-7 text-white" />
                                </div>
                                <CardTitle className="text-3xl font-black text-slate-900 font-heading">
                                    Create Dev Account
                                </CardTitle>
                                <CardDescription className="text-slate-500 font-medium tracking-tight">
                                    Register to access the NestNode Developer API.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4 pt-4 bg-white px-8 pb-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {fields.map(({ id, label, icon: Icon, type, placeholder }) => (
                                        <div key={id} className="space-y-1">
                                            <Label htmlFor={`signup-${id}`} className="font-bold text-slate-700 ml-1">
                                                {label}
                                            </Label>
                                            <div className="relative group">
                                                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                                                <Input
                                                    id={`signup-${id}`}
                                                    type={type}
                                                    placeholder={placeholder}
                                                    className={`pl-11 py-6 rounded-2xl border-slate-200 focus-visible:ring-cyan-500/20 ${errors[id] ? "border-red-400" : ""}`}
                                                    value={formData[id]}
                                                    onChange={handleChange(id)}
                                                />
                                            </div>
                                            {errors[id] && (
                                                <p className="text-xs text-red-500 ml-1">{errors[id]}</p>
                                            )}
                                        </div>
                                    ))}

                                    {/* Terms note */}
                                    <p className="text-xs text-slate-400 text-center pt-1">
                                        By registering you agree to our{" "}
                                        <Link to="/terms" className="text-cyan-600 hover:underline font-semibold">
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link to="/privacy" className="text-cyan-600 hover:underline font-semibold">
                                            Privacy Policy
                                        </Link>
                                        .
                                    </p>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-7 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-bold text-base shadow-xl shadow-cyan-500/25 transition-all active:scale-[0.98] mt-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                Create Developer Account
                                                <ArrowRight className="ml-2 w-5 h-5" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>

                            <CardFooter className="flex flex-col space-y-4 bg-slate-50/70 p-8 pt-6 border-t border-slate-100">
                                <div className="text-center text-sm font-medium text-slate-500">
                                    Already have an account?{" "}
                                    <Link to="/developer/login" className="text-cyan-600 font-bold hover:underline">
                                        Sign in here
                                    </Link>
                                </div>
                                <div className="w-full h-px bg-slate-200" />
                                <Link
                                    to="/login"
                                    className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-cyan-600 transition-colors flex items-center justify-center gap-2"
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

export default DeveloperSignup;
