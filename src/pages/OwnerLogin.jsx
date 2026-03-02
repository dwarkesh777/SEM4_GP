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
    const [loading, setLoading] = useState(false);
    const { ownerLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
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
            if (error.message === "Failed to fetch") {
                toast.error("Network error: Backend server is unreachable.");
            } else {
                toast.error("Something went wrong. Please try again.");
            }
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
                    <CardContent className="space-y-6 pt-2 bg-white px-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="font-bold text-slate-700 ml-1">Business Email</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="partner@company.com"
                                        className="pl-11 py-6 rounded-2xl border-slate-200 focus:ring-indigo-500/20"
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
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-11 py-6 rounded-2xl border-slate-200 focus:ring-indigo-500/20"
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
