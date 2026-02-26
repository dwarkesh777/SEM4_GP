import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, MapPin, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const StudentSignup = () => {
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

        if (password.length < 6) {
            toast({
                title: "Password too short",
                description: "Password must be at least 6 characters long.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        try {
            await signup(email, fullName, password, false); // false for student
            toast({ title: "Account created!", description: "Your student account has been created successfully." });
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
                        src="https://images.unsplash.com/photo-1555854817-5b2260d50c47?q=80&w=2070&auto=format&fit=crop"
                        alt="Student Housing"
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
                        <div className="flex items-center gap-3 mb-6">
                            <GraduationCap className="w-8 h-8 text-primary" />
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight">
                                Join Students
                            </h2>
                        </div>
                        <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                            Create your student account and get access to thousands of verified hostels and PGs across India.
                        </p>

                        <div className="space-y-4 pt-8 border-t border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <p className="text-slate-300">Browse verified properties</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <p className="text-slate-300">Compare prices and amenities</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <p className="text-slate-300">Book your perfect stay</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Signup Form */}
            <main className="flex items-center justify-center p-6 md:p-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
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
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <GraduationCap className="w-6 h-6 text-primary" />
                                <h1 className="text-3xl font-black text-slate-900">Student Signup</h1>
                            </div>
                            <p className="text-slate-500">Create your student account to get started.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-slate-700 font-bold ml-1">Full Name</Label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="John Doe"
                                        className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-lg"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 font-bold ml-1">Email address</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
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
                                        minLength={6}
                                    />
                                </div>
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
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-14 rounded-2xl gap-2 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5" size="lg" disabled={isLoading}>
                                {isLoading ? "Creating Account..." : "Create Student Account"}
                                {!isLoading && <ArrowRight className="w-5 h-5" />}
                            </Button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-slate-500 font-medium">
                                Already have an account?{' '}
                                <Link to="/student/login" className="text-primary font-black hover:underline ml-1">
                                    Sign In as Student
                                </Link>
                            </p>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-slate-400 text-sm">
                                Are you a property owner?{' '}
                                <Link to="/owner/signup" className="text-primary font-bold hover:underline">
                                    Create Owner Account
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 text-center px-6">
                        <p className="text-slate-400 text-xs leading-relaxed">
                            By creating an account, you agree to our Terms of Service and Privacy Policy.
                            Need help? <Link to="/help" className="text-slate-500 font-bold hover:underline">Contact Support</Link>
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default StudentSignup;
