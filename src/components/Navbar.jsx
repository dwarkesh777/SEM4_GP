import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Headphones, User, LogOut, Settings, LayoutDashboard, Building2, ChevronDown, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
    { label: "Hostels & PGs", href: "/#listings" },
    { label: "Search by College", href: "/#search" },
];

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Force solid navbar on all pages except the homepage
    const isHomePage = location.pathname === "/";
    const forceSolid = !isHomePage;
    const effectiveScrolled = isScrolled || forceSolid;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${effectiveScrolled
                ? "py-3 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/5"
                : "py-5 bg-transparent"
                }`}
        >
            <div className="container flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5 group transition-transform duration-300 hover:scale-105 active:scale-95">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500 ${effectiveScrolled ? "bg-primary shadow-lg shadow-primary/20" : "bg-white/20 backdrop-blur-md border border-white/30"
                        }`}>
                        <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-2xl tracking-tight transition-colors duration-500 font-heading ${effectiveScrolled ? "text-slate-900" : "text-white"}`}>
                        <span className="font-medium">Bed</span>
                        <span className="font-black text-primary">Buddy</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link, i) => (
                        <motion.div
                            key={link.label}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i + 0.2 }}
                        >
                            <a
                                href={link.href}
                                className={`text-sm font-semibold transition-colors relative group ${effectiveScrolled ? "text-slate-600" : "text-white"
                                    } hover:text-primary`}
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                            </a>
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <DropdownMenu>
                            <DropdownMenuTrigger className={`text-sm font-semibold transition-colors flex items-center gap-1 group outline-none ${effectiveScrolled ? "text-slate-600" : "text-white"
                                } hover:text-primary`}>
                                For Owners
                                <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="p-2 min-w-[200px] rounded-2xl border-white/20 shadow-2xl backdrop-blur-2xl">
                                <DropdownMenuItem
                                    className="gap-3 cursor-pointer bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold p-3 rounded-xl transition-all shadow-md group border-none mb-1"
                                    onClick={() => navigate('/add-property')}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                        <Building2 className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm">List Your Property</span>
                                        <span className="text-[10px] font-medium text-white/80">Start earning today</span>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </motion.div>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Button variant="ghost" size="sm" className={`gap-2 font-semibold rounded-full px-5 ${effectiveScrolled ? "text-slate-600 hover:bg-slate-100/50" : "text-white hover:bg-white/10"
                            }`}>
                            <Headphones className="w-4 h-4" />
                            Support
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className={`gap-2 px-4 rounded-full border-white/20 backdrop-blur-sm transition-all shadow-sm ${effectiveScrolled ? "bg-white/50 text-slate-700 hover:bg-white hover:border-primary/30" : "bg-white/10 text-white hover:bg-white/20"
                                        }`}>
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                                            <User className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <span className="text-sm font-bold">{user.full_name}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 p-2 mt-2 rounded-2xl border-white/20 shadow-2xl backdrop-blur-2xl">
                                    <DropdownMenuLabel className="font-heading px-3 py-2">
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Signed in as</p>
                                        <p className="text-sm font-bold truncate">{user.email}</p>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-slate-100" />
                                    {user.is_owner ? (
                                        <>
                                            <DropdownMenuItem className="gap-3 cursor-pointer py-3 px-3 rounded-xl focus:bg-primary/5 group" onClick={() => navigate('/owner-dashboard')}>
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-focus:scale-110 transition-transform">
                                                    <LayoutDashboard className="w-4 h-4" />
                                                </div>
                                                <span className="font-semibold text-slate-700">Owner Dashboard</span>
                                            </DropdownMenuItem>
                                        </>
                                    ) : (
                                        <DropdownMenuItem className="gap-3 cursor-pointer py-3 px-3 rounded-xl focus:bg-primary/5 group">
                                            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-focus:scale-110 transition-transform">
                                                <LayoutDashboard className="w-4 h-4" />
                                            </div>
                                            <span className="font-semibold text-slate-700">User Dashboard</span>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem className="gap-3 cursor-pointer py-3 px-3 rounded-xl focus:bg-slate-100 group">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 group-focus:scale-110 transition-transform">
                                            <Settings className="w-4 h-4" />
                                        </div>
                                        <span className="font-semibold text-slate-700">Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-slate-100" />
                                    <DropdownMenuItem onClick={handleLogout} className="gap-3 cursor-pointer py-3 px-3 rounded-xl focus:bg-red-50 group mt-1 transition-all border border-transparent focus:border-red-100">
                                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600 group-focus:scale-110 transition-transform">
                                            <LogOut className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-red-600">Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="px-8 rounded-full font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all outline-none">
                                        Login
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 p-2 mt-2 rounded-2xl border-white/20 shadow-2xl backdrop-blur-2xl">
                                    <DropdownMenuItem onClick={() => navigate('/student/login')} className="gap-3 cursor-pointer py-3 px-3 rounded-xl focus:bg-primary/5 group">
                                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-focus:scale-110 transition-transform">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-slate-700">Student Login</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate('/owner/login')} className="gap-3 cursor-pointer py-3 px-3 rounded-xl focus:bg-orange-50 group">
                                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 group-focus:scale-110 transition-transform">
                                            <Building2 className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-slate-700">Owner Login</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </motion.div>
                </div>

                <div className="md:hidden flex items-center gap-3">
                    {user && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                            <User className="w-4 h-4 text-primary" />
                        </div>
                    )}
                    <button
                        className={`p-2 rounded-lg transition-colors ${effectiveScrolled ? "text-slate-800" : "text-white"}`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass border-t border-slate-200/50 bg-white/95 backdrop-blur-3xl overflow-hidden"
                    >
                        <div className="container py-8 flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="text-lg font-bold text-slate-800 hover:text-primary transition-colors py-3 border-b border-slate-100 flex items-center justify-between group"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {link.label}
                                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                    </a>
                                ))}
                            </div>

                            <Button
                                onClick={() => { navigate('/add-property'); setMobileOpen(false); }}
                                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 py-7 text-lg font-bold rounded-2xl shadow-xl shadow-orange-500/20"
                            >
                                <Building2 className="w-5 h-5 mr-3" />
                                List Your Property
                            </Button>

                            <div className="grid grid-cols-2 gap-4 mt-2">
                                {user ? (
                                    <Button
                                        variant="outline"
                                        className="col-span-2 py-6 rounded-xl font-bold border-red-100 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all"
                                        onClick={() => { handleLogout(); setMobileOpen(false); }}
                                    >
                                        <LogOut className="w-5 h-5 mr-3" />
                                        Logout Account
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            className="py-6 rounded-xl font-bold border-slate-200"
                                            onClick={() => { navigate('/student/login'); setMobileOpen(false); }}
                                        >
                                            Student Login
                                        </Button>
                                        <Button
                                            className="py-6 rounded-xl font-bold"
                                            onClick={() => { navigate('/owner/login'); setMobileOpen(false); }}
                                        >
                                            Owner Login
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
