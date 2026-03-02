import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Headphones, User, Settings, LayoutDashboard, Building2, ChevronDown, ChevronRight, MapPin, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

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

                    {/* Owners Dropdown */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className={`flex items-center gap-1.5 text-sm font-semibold transition-all duration-300 hover:text-primary group ${effectiveScrolled ? "text-slate-600" : "text-white"
                                        }`}
                                >
                                    For Owners
                                    <ChevronDown className="w-4 h-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 p-2 rounded-2xl mt-2 shadow-2xl border-slate-100" align="start">
                                <DropdownMenuItem
                                    onClick={() => navigate('/add-property')}
                                    className="p-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors gap-3"
                                >
                                    <Building2 className="w-4 h-4 text-primary" />
                                    <span className="font-bold text-slate-700">List Your Property</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </motion.div>

                </div>

                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`relative h-10 w-10 rounded-full border-2 transition-all p-0 overflow-hidden ${effectiveScrolled ? "border-slate-100 shadow-sm" : "border-white/20"}`}
                                >
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                        <User className={`w-5 h-5 ${effectiveScrolled ? "text-primary" : "text-white"}`} />
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64 p-3 rounded-3xl mt-2 mr-0 shadow-2xl shadow-black/10 border-slate-100" align="end">
                                <DropdownMenuLabel className="font-heading p-2">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="text-base font-black text-slate-900">{user.full_name}</span>
                                            {user.is_owner && (
                                                <Badge className="bg-primary/10 text-primary border-none text-[10px] py-0.5 px-2 hover:bg-primary/20">Owner</Badge>
                                            )}
                                        </div>
                                        <span className="text-xs font-medium text-slate-500 truncate">{user.email}</span>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="my-2 bg-slate-100" />

                                {user.is_owner ? (
                                    <>
                                        <DropdownMenuItem onClick={() => navigate("/dashboard")} className="p-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors gap-3 mb-1">
                                            <LayoutDashboard className="w-4 h-4 text-slate-400" />
                                            <span className="font-bold text-slate-600">Owner Dashboard</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => navigate("/add-property")} className="p-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors gap-3 mb-1">
                                            <Building2 className="w-4 h-4 text-slate-400" />
                                            <span className="font-bold text-slate-600">Owner System</span>
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <DropdownMenuItem onClick={() => navigate("/dashboard")} className="p-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors gap-3 mb-1">
                                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                                        <span className="font-bold text-slate-600">User Dashboard</span>
                                    </DropdownMenuItem>
                                )}

                                <DropdownMenuItem onClick={() => navigate("/dashboard", { state: { activeTab: "profile" } })} className="p-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors gap-3 mb-1">
                                    <Settings className="w-4 h-4 text-slate-400" />
                                    <span className="font-bold text-slate-600">
                                        Settings
                                    </span>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="my-2 bg-slate-100" />
                                <DropdownMenuItem onClick={logout} className="p-3 rounded-xl cursor-pointer hover:bg-orange-50 transition-colors gap-3 text-orange-600 group">
                                    <LogOut className="w-4 h-4 text-orange-400 transition-colors" />
                                    <span className="font-black">Sign Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            className={`rounded-full px-6 font-bold shadow-lg transition-all active:scale-95 ${effectiveScrolled
                                ? "bg-primary text-white shadow-primary/20 hover:bg-primary/90"
                                : "bg-white text-primary shadow-white/10 hover:bg-white/90"
                                }`}
                            onClick={() => navigate("/login")}
                        >
                            Log in
                        </Button>
                    )}

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
                </div>

                <div className="md:hidden flex items-center gap-3">
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

                            {user ? (
                                <div className="flex flex-col gap-4">
                                    <Button
                                        onClick={() => { navigate("/dashboard"); setMobileOpen(false); }}
                                        className="w-full h-16 rounded-2xl bg-slate-100 text-slate-900 font-bold justify-start px-6 gap-4"
                                        variant="ghost"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        {user.is_owner ? "Owner Dashboard" : "User Dashboard"}
                                    </Button>
                                    {user.is_owner && (
                                        <Button
                                            onClick={() => { navigate("/add-property"); setMobileOpen(false); }}
                                            className="w-full h-16 rounded-2xl bg-slate-50 text-slate-900 font-bold justify-start px-6 gap-4"
                                            variant="ghost"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                                                <Building2 className="w-4 h-4 text-slate-600" />
                                            </div>
                                            Owner System
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => { navigate("/dashboard", { state: { activeTab: "profile" } }); setMobileOpen(false); }}
                                        className="w-full h-16 rounded-2xl bg-slate-50 text-slate-900 font-bold justify-start px-6 gap-4"
                                        variant="ghost"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                                            <Settings className="w-4 h-4 text-slate-600" />
                                        </div>
                                        Settings
                                    </Button>
                                    <Button
                                        onClick={() => { logout(); setMobileOpen(false); }}
                                        className="w-full h-16 rounded-2xl bg-orange-50 text-orange-600 font-bold justify-start px-6 gap-4"
                                        variant="ghost"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                            <LogOut className="w-4 h-4" />
                                        </div>
                                        Sign Out
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    onClick={() => { navigate("/login"); setMobileOpen(false); }}
                                    className="w-full bg-primary py-7 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20"
                                >
                                    Login / Signup
                                </Button>
                            )}

                            <div className="flex flex-col gap-2">
                                <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">For Owners</div>
                                <Button
                                    onClick={() => { navigate("/add-property"); setMobileOpen(false); }}
                                    className="w-full h-16 rounded-2xl bg-white border border-slate-100 text-slate-900 font-bold justify-start px-6 gap-4 shadow-sm"
                                    variant="ghost"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-primary" />
                                    </div>
                                    List Your Property
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav >
    );
};

export default Navbar;
