import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Building2, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
    const navigate = useNavigate();

    const roles = [
        {
            title: "Student Portal",
            description: "Find and book your perfect hostel or PG with ease.",
            icon: User,
            path: "/student/login",
            gradient: "from-blue-500 to-indigo-600",
            bg: "bg-blue-50",
            text: "text-blue-600",
        },
        {
            title: "Property Owner",
            description: "List your property and reach thousands of students.",
            icon: Building2,
            path: "/owner/login",
            gradient: "from-violet-500 to-fuchsia-600",
            bg: "bg-violet-50",
            text: "text-violet-600",
        }
    ];

    return (
        <div className="min-h-screen flex bg-background">
            {/* Left side - Branding & Visuals */}
            <div className="hidden lg:flex w-1/2 relative bg-slate-950 overflow-hidden flex-col justify-between p-12">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-primary/20" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.15),transparent_50%)]" />
                    {/* Decorative blurred blobs */}
                    <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 blur-[100px] rounded-full animate-pulse-glow" />
                    <div className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-500/20 blur-[100px] rounded-full" />
                </div>
                
                <Link to="/" className="relative z-10 flex items-center gap-2 group w-fit">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg group-hover:scale-105 transition-transform">
                        <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl tracking-tight font-heading text-white">
                        <span className="font-medium">Nest</span>
                        <span className="font-black text-primary">Node</span>
                    </span>
                </Link>

                <div className="relative z-10 max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-5xl font-black text-white font-heading leading-tight mb-6 tracking-tight">
                            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">journey</span> starts here.
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed font-medium">
                            Join thousands of students and property owners on the most trusted platform for premium student housing.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right side - Login Options */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-24 relative overflow-hidden">
                {/* Mobile Background Elements */}
                <div className="absolute inset-0 lg:hidden bg-slate-50" />
                <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent lg:hidden" />
                
                <div className="w-full max-w-md relative z-10">
                    <Link to="/" className="lg:hidden flex items-center gap-2 mb-12">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary shadow-lg shadow-primary/20">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl tracking-tight font-heading text-slate-900">
                            <span className="font-medium">Nest</span>
                            <span className="font-black text-primary">Node</span>
                        </span>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10"
                    >
                        <h1 className="text-4xl font-black text-slate-900 mb-3 font-heading tracking-tight">Welcome Back</h1>
                        <p className="text-slate-500 font-medium text-lg">Select your account type to sign in.</p>
                    </motion.div>

                    <div className="flex flex-col gap-5">
                        {roles.map((role, idx) => (
                            <Link key={role.title} to={role.path} className="group">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 + 0.2 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="p-1 rounded-2xl bg-gradient-to-r hover:from-slate-200 hover:to-slate-100 transition-all duration-500"
                                >
                                    <div className="bg-white rounded-[14px] p-6 flex items-center gap-6 border border-slate-100 shadow-sm group-hover:shadow-xl group-hover:shadow-slate-200/50 transition-all duration-300">
                                        <div className={`w-16 h-16 rounded-2xl flex shrink-0 items-center justify-center ${role.bg} transition-transform group-hover:-rotate-3`}>
                                            <role.icon className={`w-8 h-8 ${role.text}`} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-slate-900 font-heading mb-1">{role.title}</h3>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed">{role.description}</p>
                                        </div>
                                        <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 group-hover:bg-slate-900 transition-colors">
                                            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 text-center"
                    >
                        <p className="text-sm text-slate-500 font-medium">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-primary font-bold hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;
