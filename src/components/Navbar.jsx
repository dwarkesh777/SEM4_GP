import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Menu, X, User, Settings, LayoutDashboard, Building2, ChevronDown, ChevronRight, Home, LogOut, Headphones
} from "lucide-react";
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
    { label: "Search by College", href: "/college-search" },
];

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const isLinkActive = (href) => {
        if (href.startsWith("/#")) return location.pathname === "/";
        return location.pathname === href;
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 8);
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    const linkClass = (href) => {
        const active = isLinkActive(href);
        return active
            ? "bg-white text-slate-900 shadow-sm border border-slate-200"
            : "text-slate-600 hover:text-slate-900 hover:bg-white/80";
    };

    const UserMenu = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="relative rounded-full border-2 border-slate-200 transition-all p-0 overflow-hidden h-10 w-10 shadow-sm"
                >
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {user?.face_photo ? (
                            <img src={user.face_photo} alt={user.full_name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-5 h-5 text-primary" />
                        )}
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-3 rounded-3xl mt-2 shadow-2xl shadow-slate-900/10 border-slate-100" align="end">
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
                    <span className="font-bold text-slate-600">Settings</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-2 bg-slate-100" />
                <DropdownMenuItem onClick={logout} className="p-3 rounded-xl cursor-pointer hover:bg-orange-50 transition-colors gap-3 text-orange-600 group">
                    <LogOut className="w-4 h-4 text-orange-400 transition-colors" />
                    <span className="font-black">Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 bg-white border-b transition-shadow duration-300 ${
                    isScrolled ? "border-slate-200 shadow-md shadow-slate-900/5" : "border-slate-100"
                }`}
            >
                <nav className="container flex items-center justify-between gap-4 h-16 md:h-[4.25rem]">
                    <Link
                        to="/"
                        className="flex items-center gap-3 group min-w-0"
                        onClick={() => setMobileOpen(false)}
                    >
                        <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl shrink-0 bg-gradient-to-br from-primary via-indigo-600 to-violet-600 shadow-lg shadow-primary/20">
                            <Home className="w-5 h-5 text-white" />
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
                        </div>
                        <div className="min-w-0">
                            <span className="block text-xl sm:text-2xl tracking-tight font-heading leading-none text-slate-900">
                                <span className="font-medium">Nest</span>
                                <span className="font-black text-gradient">Node</span>
                            </span>
                            <span className="hidden sm:block text-[11px] font-semibold tracking-wide mt-0.5 text-slate-500">
                                Find your perfect stay
                            </span>
                        </div>
                    </Link>

                    <div className="hidden lg:flex items-center gap-1 p-1 rounded-full border bg-slate-100/90 border-slate-200/80">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.href}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${linkClass(link.href)}`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${linkClass("")}`}
                                >
                                    For Owners
                                    <ChevronDown className="w-4 h-4 opacity-70" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 p-2 rounded-2xl mt-3 shadow-2xl shadow-slate-900/10 border-slate-100" align="center">
                                <DropdownMenuItem
                                    onClick={() => navigate("/add-property")}
                                    className="p-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors gap-3"
                                >
                                    <Building2 className="w-4 h-4 text-primary" />
                                    <span className="font-bold text-slate-700">List Your Property</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="hidden md:flex items-center gap-2 sm:gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/support")}
                            className="rounded-full h-10 px-3 sm:px-4 font-semibold gap-2 text-slate-600 hover:text-primary hover:bg-primary/5"
                        >
                            <Headphones className="w-4 h-4" />
                            <span className="hidden xl:inline">Support</span>
                        </Button>

                        {user ? (
                            <UserMenu />
                        ) : (
                            <Button
                                className="rounded-full px-5 h-10 font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all active:scale-95"
                                onClick={() => navigate("/login")}
                            >
                                Log in
                            </Button>
                        )}
                    </div>

                    <div className="flex md:hidden items-center gap-1">
                        <button
                            onClick={() => navigate("/support")}
                            className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                            aria-label="Support"
                        >
                            <Headphones className="w-5 h-5" />
                        </button>
                        <button
                            className="p-2.5 rounded-xl text-slate-800 hover:bg-slate-100 transition-colors"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        >
                            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </nav>
            </motion.header>

            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm md:hidden top-16"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            className="fixed top-16 left-0 right-0 z-50 md:hidden bg-white border-b border-slate-200 shadow-lg overflow-hidden"
                        >
                            <div className="container py-4 flex flex-col gap-3 max-h-[calc(100vh-4rem)] overflow-y-auto">
                                <div className="grid gap-1">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.label}
                                            to={link.href}
                                            className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-bold transition-colors ${
                                                isLinkActive(link.href)
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-slate-800 hover:bg-slate-50"
                                            }`}
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            {link.label}
                                            <ChevronRight className="w-5 h-5 opacity-40" />
                                        </Link>
                                    ))}
                                </div>

                                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
                                        For Owners
                                    </p>
                                    <Button
                                        onClick={() => { navigate("/add-property"); setMobileOpen(false); }}
                                        className="w-full h-12 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold justify-start px-4 gap-3 shadow-sm hover:bg-slate-50"
                                        variant="ghost"
                                    >
                                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <Building2 className="w-4 h-4 text-primary" />
                                        </div>
                                        List Your Property
                                    </Button>
                                </div>

                                {user ? (
                                    <div className="flex flex-col gap-2 pt-1 border-t border-slate-100">
                                        <div className="flex items-center gap-3 px-2 py-2">
                                            <div className="w-11 h-11 rounded-full border-2 border-slate-100 overflow-hidden bg-primary/10 flex items-center justify-center">
                                                {user?.face_photo ? (
                                                    <img src={user.face_photo} alt={user.full_name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-5 h-5 text-primary" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-900 truncate">{user.full_name}</p>
                                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                            </div>
                                            {user.is_owner && (
                                                <Badge className="ml-auto bg-primary/10 text-primary border-none text-[10px]">Owner</Badge>
                                            )}
                                        </div>

                                        <Button
                                            onClick={() => { navigate("/dashboard"); setMobileOpen(false); }}
                                            className="w-full h-12 rounded-xl justify-start px-4 gap-3 font-bold text-slate-700 hover:bg-slate-50"
                                            variant="ghost"
                                        >
                                            <LayoutDashboard className="w-4 h-4 text-slate-400" />
                                            {user.is_owner ? "Owner Dashboard" : "User Dashboard"}
                                        </Button>

                                        {user.is_owner && (
                                            <Button
                                                onClick={() => { navigate("/add-property"); setMobileOpen(false); }}
                                                className="w-full h-12 rounded-xl justify-start px-4 gap-3 font-bold text-slate-700 hover:bg-slate-50"
                                                variant="ghost"
                                            >
                                                <Building2 className="w-4 h-4 text-slate-400" />
                                                Owner System
                                            </Button>
                                        )}

                                        <Button
                                            onClick={() => { navigate("/dashboard", { state: { activeTab: "profile" } }); setMobileOpen(false); }}
                                            className="w-full h-12 rounded-xl justify-start px-4 gap-3 font-bold text-slate-700 hover:bg-slate-50"
                                            variant="ghost"
                                        >
                                            <Settings className="w-4 h-4 text-slate-400" />
                                            Settings
                                        </Button>

                                        <Button
                                            onClick={() => { logout(); setMobileOpen(false); }}
                                            className="w-full h-12 rounded-xl justify-start px-4 gap-3 font-bold text-orange-600 hover:bg-orange-50"
                                            variant="ghost"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => { navigate("/login"); setMobileOpen(false); }}
                                        className="w-full h-12 rounded-xl bg-slate-900 text-white font-bold shadow-lg shadow-slate-900/10 hover:bg-slate-800"
                                    >
                                        Log in / Sign up
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
