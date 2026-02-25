import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, MapPin, ShieldCheck, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [isOwner, setIsOwner] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await signup(email, fullName, password, isOwner);
            toast({ title: "Account created!", description: `Welcome to BedBuddy as a ${isOwner ? 'Property Owner' : 'Student'}!` });
            navigate('/');
        } catch (error) {
            toast({
                title: "Signup failed",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50">
            {/* Left Side: Visual & Branding */}
            <div className="hidden lg:flex relative bg-slate-950 items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1590274853856-f22d5ee3d228?q=80&w=2070&auto=format&fit=crop"
                        alt="Modern Interior"
                        className="w-full h-full object-cover opacity-40 scale-105 animate-slow-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/80 to-primary/20" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.15),transparent_50%)]" />
                </div>

                <div className="relative z-10 p-12 max-w-xl">
                    <Link to="/" className="flex items-center gap-2.5 group mb-12">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-110">
                            <MapPin className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-3xl tracking-tight transition-colors duration-500 font-heading text-white">
                            <span className="font-medium">Bed</span>
                            <span className="font-black text-primary">Buddy</span>
                        </span>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                            Start Your <span className="text-primary italic">Journey</span> with BedBuddy.
                        </h2>
                        <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                            Whether you're looking for a room or looking to list one, we've got you covered with the best-in-class tools.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                                <span className="font-medium tracking-tight">100% Verified Properties</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                                <span className="font-medium tracking-tight">Direct Connect with Owners</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                                <span className="font-medium tracking-tight">Zero Brokerage Guarantee</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Signup Form */}
            <main className="flex items-center justify-center p-6 md:p-12 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md py-8"
                >
                    <div className="mb-10 lg:hidden">
                        <Link to="/" className="flex items-center gap-2.5 justify-center">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl tracking-tight font-heading text-slate-900 font-black">
                                BedBuddy
                            </span>
                        </Link>
                    </div>

                    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
                        <div className="mb-8 text-center lg:text-left">
                            <h1 className="text-3xl font-black text-slate-900 mb-2">Create Account</h1>
                            <p className="text-slate-500">Join the community of modern student living.</p>
                        </div>

                        {/* Role Selection */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button
                                type="button"
                                onClick={() => setIsOwner(false)}
                                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all group ${!isOwner
                                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                                        : "border-slate-100 bg-slate-50 hover:border-slate-200"
                                    }`}
                            >
                                <GraduationCap className={`w-8 h-8 mb-2 transition-colors ${!isOwner ? "text-primary" : "text-slate-400 group-hover:text-slate-600"}`} />
                                <span className={`text-sm font-bold ${!isOwner ? "text-primary" : "text-slate-500 group-hover:text-slate-700"}`}>I'm a Student</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOwner(true)}
                                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all group ${isOwner
                                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                                        : "border-slate-100 bg-slate-50 hover:border-slate-200"
                                    }`}
                            >
                                <ShieldCheck className={`w-8 h-8 mb-2 transition-colors ${isOwner ? "text-primary" : "text-slate-400 group-hover:text-slate-600"}`} />
                                <span className={`text-sm font-bold ${isOwner ? "text-primary" : "text-slate-500 group-hover:text-slate-700"}`}>I'm an Owner</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="fullName" className="text-slate-700 font-bold ml-1 text-sm">Full Name</Label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="John Doe"
                                        className="pl-11 h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-medium"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-slate-700 font-bold ml-1 text-sm">Email address</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        className="pl-11 h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-medium"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password" title="" className="text-slate-700 font-bold ml-1 text-sm">Password</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-11 h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-medium"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-12 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5 mt-4" disabled={isLoading}>
                                {isLoading ? "Creating account..." : "Create Account"}
                                {!isLoading && <ArrowRight className="w-4 h-4" />}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-500 font-medium">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary font-black hover:underline ml-1">
                                    Log In
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 text-center px-6">
                        <p className="text-slate-400 text-[10px] leading-relaxed">
                            By joining, you agree to BedBuddy's Terms of Service and Privacy Policy.
                            Owner accounts are subject to verification.
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Signup;
