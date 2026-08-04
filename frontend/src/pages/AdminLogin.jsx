import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, ArrowRight, ShieldCheck, Home } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { adminLogin } = useAuth();
    const navigate = useNavigate();

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await adminLogin(email, password);
            if (result.success) {
                toast.success("Welcome back, Admin!");
                navigate("/admin/dashboard");
            } else {
                toast.error(result.error || "Invalid admin credentials. Please try again.");
            }
        } catch (error) {
            console.error("Admin login error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4 pt-24 relative overflow-hidden">
            {/* House/PG Theme Background Pattern */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5L5 25h5v30h40V25h5L30 5zm10 45H20V30h20v20zm-15-5h10v-10H25v10z' fill='%23000000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    backgroundSize: "60px 60px"
                }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 to-transparent pointer-events-none z-0" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[100px] rounded-full animate-pulse-glow z-0" />
            
            <Navbar />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="border border-slate-200 shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-xl">
                    <CardHeader className="space-y-1 pb-8 text-center">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20 shadow-sm">
                            <Home className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-black text-slate-900 font-heading tracking-tight">Admin Portal</CardTitle>
                        <CardDescription className="text-slate-500 font-medium">
                            Enter your credentials to manage properties.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 pt-2 px-8">
                        <form onSubmit={handlePasswordSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="font-bold text-slate-700 ml-1">Admin Email</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@nestnode.com"
                                        className="pl-11 py-6 rounded-2xl border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-primary/50 transition-all placeholder:text-slate-400 shadow-sm"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <Label htmlFor="password" title="password" className="font-bold text-slate-700">Password</Label>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-11 py-6 rounded-2xl border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-primary/50 transition-all placeholder:text-slate-400 shadow-sm"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full py-7 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-lg shadow-primary/30 transition-all active:scale-[0.98] mt-6"
                                disabled={loading}
                            >
                                {loading ? "Verifying..." : "Login to Dashboard"}
                                {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 bg-slate-50/80 p-8 pt-6 border-t border-slate-100">
                        <div className="text-center text-sm font-medium text-slate-500">
                            Authorized personnel only.{" "}
                            <Link to="/admin/signup" className="text-primary font-bold hover:underline">
                                Request Access
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
