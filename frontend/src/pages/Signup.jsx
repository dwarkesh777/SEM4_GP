import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Building2, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Signup = () => {
    const navigate = useNavigate();

    const roles = [
        {
            title: "Join as Student",
            description: "Create an account to save properties and manage bookings.",
            icon: User,
            path: "/student/signup",
            gradient: "from-blue-500 to-cyan-500",
            bg: "bg-blue-50/80",
            text: "text-blue-600",
            glow: "group-hover:shadow-blue-500/20"
        },
        {
            title: "Join as Owner",
            description: "Register your property and start hosting students today.",
            icon: Building2,
            path: "/owner/signup",
            gradient: "from-violet-500 to-fuchsia-500",
            bg: "bg-violet-50/80",
            text: "text-violet-600",
            glow: "group-hover:shadow-violet-500/20"
        }
    ];

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Left side - Stunning Visuals */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80" 
                        alt="Beautiful hostel room" 
                        className="w-full h-full object-cover scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/40 backdrop-blur-[2px]" />
                </div>
                
                <Link to="/" className="relative z-10 flex items-center gap-3 w-fit group">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl group-hover:scale-105 group-hover:bg-white/20 transition-all duration-300">
                        <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl tracking-tighter font-heading text-white">
                        <span className="font-bold">Nest</span>
                        <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Node</span>
                    </span>
                </Link>

                <div className="relative z-10 max-w-lg mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <span className="inline-block py-1.5 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6 shadow-xl">
                            Unlock Premium Living
                        </span>
                        <h2 className="text-[3.5rem] font-black text-white font-heading leading-[1.1] tracking-tight mb-6">
                            Start your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">new chapter</span> today.
                        </h2>
                        <p className="text-white/70 text-xl leading-relaxed font-medium">
                            Whether you're looking for a second home or want to list your property, you're in the right place.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right side - Signup Options */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-24 relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100/50">
                {/* Subtle background decoration */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

                <div className="w-full max-w-[420px] relative z-10">
                    <Link to="/" className="lg:hidden flex items-center gap-2 mb-12">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl tracking-tight font-heading text-slate-900">
                            <span className="font-medium">Nest</span>
                            <span className="font-black text-blue-600">Node</span>
                        </span>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 text-center lg:text-left"
                    >
                        <h1 className="text-[2.5rem] font-black text-slate-900 mb-4 font-heading tracking-tight leading-none">Create Account</h1>
                        <p className="text-slate-500 font-medium text-lg">Pick a route to get started.</p>
                    </motion.div>

                    <div className="flex flex-col gap-6">
                        {roles.map((role, idx) => (
                            <Link key={role.title} to={role.path} className="group block outline-none">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.15 + 0.2, type: "spring", stiffness: 300, damping: 25 }}
                                    whileHover={{ scale: 1.02, y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`relative p-6 rounded-[2rem] bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/50 overflow-hidden transition-all duration-300 ${role.glow}`}
                                >
                                    {/* Glassmorphism shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    
                                    <div className="relative flex items-center gap-6">
                                        <div className={`w-16 h-16 rounded-[1.25rem] flex shrink-0 items-center justify-center ${role.bg} backdrop-blur-md shadow-inner transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110`}>
                                            <role.icon className={`w-8 h-8 ${role.text}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-bold text-slate-900 font-heading mb-1.5">{role.title}</h3>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed pr-2">{role.description}</p>
                                        </div>
                                        <div className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-slate-50 border border-slate-100 group-hover:bg-slate-900 group-hover:border-slate-900 transition-all duration-300 shadow-sm">
                                            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-14 text-center"
                    >
                        <p className="text-slate-500 font-medium">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">
                                Log in
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
