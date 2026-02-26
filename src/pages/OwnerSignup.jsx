import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, MapPin, ShieldCheck, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const OwnerSignup = () => {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast({
                title: "Passwords don't match",
                description: "Please make sure your passwords match.",
                variant: "destructive"
            });
            return;
        }

        if (password.length < 8) {
            toast({
                title: "Password too short",
                description: "Password must be at least 8 characters long for owner accounts.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        try {
            await signup(email, fullName, password, true); // true for owner
            toast({ title: "Owner Account Created!", description: "Your owner account has been created successfully." });
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
            {/* Left Side: Professional Management Branding */}
            <div className="hidden lg:flex relative bg-slate-950 items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                        alt="Property Management"
                        className="w-full h-full object-cover opacity-40 scale-105 animate-slow-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950/90 to-primary/20" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_50%)]" />
                </div>

                <div className="relative z-10 p-12 max-w-xl">
                    <Link to="/" className="flex items-center gap-2.5 group mb-12">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-110">
                            <MapPin className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-3xl tracking-tight transition-colors duration-500 font-heading text-white">
                            <span className="font-medium text-slate-200">Bed</span>
                            <span className="font-black text-primary">Buddy</span>
                            <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-black bg-primary/20 text-primary uppercase tracking-widest border border-primary/30 align-middle">Owner</span>
                        </span>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Building className="w-8 h-8 text-primary" />
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight">
                                List Properties
                            </h2>
                        </div>
                        <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                            Join thousands of property owners managing their student housing business with our premium platform.
                        </p>

                        <div className="space-y-4 pt-8 border-t border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <p className="text-slate-300">List unlimited properties</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <p className="text-slate-300">Manage bookings efficiently</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <p className="text-slate-300">Access analytics dashboard</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <p className="text-slate-300">Connect with verified students</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Owner Signup Form */}
            <main className="flex items-center justify-center p-6 md:p-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-10 lg:hidden text-center">
                        <Link to="/" className="inline-flex items-center gap-2.5">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl tracking-tight font-heading text-slate-900 font-black">
                                BedBuddy <span className="text-xs font-medium px-1.5 py-0.5 bg-slate-100 rounded ml-1">Owner</span>
                            </span>
                        </Link>
                    </div>

                    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
                        <div className="mb-10">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
                                <ShieldCheck className="w-7 h-7 text-primary" />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 mb-2">Owner Signup</h1>
                            <p className="text-slate-500">Create your owner account to start listing properties.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-slate-700 font-bold ml-1">Full Name</Label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="John Smith"
                                        className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-lg"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 font-bold ml-1">Work Email</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="owner@yourcompany.com"
                                        className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-lg"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-700 font-bold ml-1">Password</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-lg"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 ml-1">Must be at least 8 characters for security</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-slate-700 font-bold ml-1">Confirm Password</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-lg"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={8}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-14 rounded-2xl gap-2 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 bg-indigo-600 hover:bg-indigo-700" size="lg" disabled={isLoading}>
                                {isLoading ? "Creating Account..." : "Create Owner Account"}
                                {!isLoading && <ArrowRight className="w-5 h-5" />}
                            </Button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-slate-500 font-medium">
                                Already have an owner account?{' '}
                                <Link to="/owner/login" className="text-primary font-black hover:underline ml-1">
                                    Sign In as Owner
                                </Link>
                            </p>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-slate-400 text-sm">
                                Are you a student?{' '}
                                <Link to="/student/signup" className="text-primary font-bold hover:underline">
                                    Create Student Account
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 text-center px-6">
                        <p className="text-slate-400 text-xs leading-relaxed">
                            By creating an owner account, you agree to our Terms of Service and Privacy Policy.
                            Your account will be verified before listing properties.
                            Need help? <Link to="/help" className="text-slate-500 font-bold hover:underline">Contact Support</Link>
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default OwnerSignup;
