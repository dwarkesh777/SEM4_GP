import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Menu, X, User, Settings, LayoutDashboard, Building2, ChevronDown, ChevronRight, Home, LogOut, Headphones, Code2
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
    { label: "Developer", href: "/developer/login" },
];

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
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

    useEffect(() => {
        // Expand the navbar after a short delay on mount
        const timer = setTimeout(() => setIsExpanded(true), 400);
        return () => clearTimeout(timer);
    }, []);

    const UserMenu = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative rounded-full border-[2.5px] border-white/80 transition-all p-0 overflow-hidden h-9 w-9 shadow-lg shadow-slate-900/20 ring-2 ring-primary/20 focus:outline-none"
                >
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-violet-400/20 flex items-center justify-center overflow-hidden">
                        {user?.face_photo ? (
                            <img src={user.face_photo} alt={user.full_name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-4 h-4 text-primary" />
                        )}
                    </div>

                </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-3 rounded-3xl mt-3 shadow-2xl shadow-slate-900/15 border border-white/60 bg-white/95 backdrop-blur-xl" align="end">
                <DropdownMenuLabel className="font-heading p-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center border-2 border-primary/20 shrink-0">
                            {user?.face_photo ? (
                                <img src={user.face_photo} alt={user.full_name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-5 h-5 text-primary" />
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-black text-slate-900 truncate">{user.full_name}</span>
                                {user.is_owner && (
                                    <Badge className="bg-primary/10 text-primary border-none text-[9px] py-0 px-1.5 hover:bg-primary/20 shrink-0">Owner</Badge>
                                )}
                            </div>
                            <span className="text-xs font-medium text-slate-400 truncate">{user.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2 bg-slate-100" />

                {user.is_staff || user.is_superuser ? (
                    <DropdownMenuItem onClick={() => navigate("/admin/dashboard")} className="p-3 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors gap-3 mb-1">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                            <LayoutDashboard className="w-4 h-4 text-blue-500" />
                        </div>
                        <span className="font-bold text-slate-700">Admin Dashboard</span>
                    </DropdownMenuItem>
                ) : user.is_developer ? (
                    <DropdownMenuItem onClick={() => navigate("/developer/dashboard")} className="p-3 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors gap-3 mb-1">
                        <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center shrink-0">
                            <LayoutDashboard className="w-4 h-4 text-cyan-500" />
                        </div>
                        <span className="font-bold text-slate-700">Developer Dashboard</span>
                    </DropdownMenuItem>
                ) : user.is_owner ? (
                    <>
                        <DropdownMenuItem onClick={() => navigate("/dashboard")} className="p-3 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors gap-3 mb-1">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                <LayoutDashboard className="w-4 h-4 text-blue-500" />
                            </div>
                            <span className="font-bold text-slate-700">Owner Dashboard</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/add-property")} className="p-3 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors gap-3 mb-1">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Building2 className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-bold text-slate-700">Owner System</span>
                        </DropdownMenuItem>
                    </>
                ) : (
                    <DropdownMenuItem onClick={() => navigate("/dashboard")} className="p-3 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors gap-3 mb-1">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                            <LayoutDashboard className="w-4 h-4 text-blue-500" />
                        </div>
                        <span className="font-bold text-slate-700">User Dashboard</span>
                    </DropdownMenuItem>
                )}

                {!(user.is_staff || user.is_superuser || user.is_developer) && (
                    <DropdownMenuItem onClick={() => navigate("/dashboard", { state: { activeTab: "profile" } })} className="p-3 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors gap-3 mb-1">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <Settings className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="font-bold text-slate-700">Settings</span>
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="my-2 bg-slate-100" />
                <DropdownMenuItem onClick={logout} className="p-3 rounded-2xl cursor-pointer hover:bg-orange-50 transition-colors gap-3 text-orange-600 group">
                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                        <LogOut className="w-4 h-4 text-orange-400" />
                    </div>
                    <span className="font-black">Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <>
            {/* Floating Navbar */}
            <div className="fixed top-6 sm:top-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
                <motion.div
                    initial={{ width: "52px", opacity: 0, y: -40 }}
                    animate={{ 
                        width: isExpanded ? "100%" : "52px",
                        opacity: 1, 
                        y: 0 
                    }}
                    transition={{
                        width: { type: "spring", stiffness: 120, damping: 20 },
                        opacity: { duration: 0.4 },
                        y: { type: "spring", stiffness: 100, damping: 20 }
                    }}
                    className={`pointer-events-auto flex items-center px-2 py-2 rounded-full transition-colors duration-300 overflow-hidden ${
                        isScrolled
                            ? "bg-white/90 backdrop-blur-xl shadow-xl shadow-slate-900/12 border border-white/80"
                            : "bg-white/80 backdrop-blur-lg shadow-lg shadow-slate-900/8 border border-white/60"
                    }`}
                    style={{ maxWidth: "860px", height: "52px" }}
                >
                    {/* Logo (always visible, dictates the 52px height/width) */}
                    <Link
                        to="/"
                        className="flex items-center shrink-0"
                        onClick={() => setMobileOpen(false)}
                    >
                        <motion.div
                            whileHover={{ scale: 1.08, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-primary via-indigo-600 to-violet-600 shadow-lg shadow-primary/30"
                        >
                            <Home className="w-4 h-4 text-white" />
                        </motion.div>
                    </Link>

                    {/* Rest of the navbar content (fades in) */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isExpanded ? 1 : 0 }}
                        transition={{ duration: 0.3, delay: isExpanded ? 0.2 : 0 }}
                        className="flex items-center flex-1 min-w-[280px] md:min-w-[700px] pl-2 gap-2"
                        style={{ pointerEvents: isExpanded ? "auto" : "none" }}
                    >
                        {/* Title */}
                        <Link to="/" className="min-w-0 hidden sm:block mr-1">
                            <span className="block text-lg tracking-tight font-heading leading-none text-slate-900">
                                <span className="font-medium">Nest</span>
                                <span className="font-black text-gradient">Node</span>
                            </span>
                        </Link>

                        {/* Divider */}
                        <div className="hidden lg:block w-px h-5 bg-slate-200 mx-1" />

                        {/* Desktop Nav Links — pill group */}
                        <div className="hidden lg:flex items-center gap-0.5 flex-1">
                            {navLinks.map((link) => {
                                const active = isLinkActive(link.href);
                                return (
                                    <Link
                                        key={link.label}
                                        to={link.href}
                                        className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                                            active
                                                ? "text-slate-900"
                                                : "text-slate-500 hover:text-slate-800"
                                        }`}
                                    >
                                        {active && (
                                            <motion.span
                                                layoutId="nav-pill"
                                                className="absolute inset-0 bg-slate-100 rounded-full border border-slate-200"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                            />
                                        )}
                                        <span className="relative">{link.label}</span>
                                    </Link>
                                );
                            })}

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                                        For Owners
                                        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 p-2 rounded-2xl mt-3 shadow-2xl shadow-slate-900/10 border border-white/80 bg-white/95 backdrop-blur-xl" align="center">
                                    <DropdownMenuItem
                                        onClick={() => navigate("/add-property")}
                                        className="p-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors gap-3"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Building2 className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="font-bold text-slate-700">List Your Property</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Right Actions */}
                        <div className="hidden md:flex items-center gap-1.5 ml-auto">
                            {/* Support circle button */}
                            <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/support")}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/8 transition-colors border border-slate-200/80"
                                aria-label="Support"
                            >
                                <Headphones className="w-4 h-4" />
                            </motion.button>

                            {user ? (
                                <UserMenu />
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => navigate("/login")}
                                    className="px-5 h-9 rounded-full font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/15 transition-colors"
                                >
                                    Log in
                                </motion.button>
                            )}
                        </div>

                        {/* Mobile Right Actions */}
                        <div className="flex md:hidden items-center gap-1.5 ml-auto">
                            <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/support")}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                                aria-label="Support"
                            >
                                <Headphones className="w-4 h-4" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                                onClick={() => setMobileOpen(!mobileOpen)}
                                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {mobileOpen ? (
                                        <motion.span
                                            key="close"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <X className="w-4 h-4" />
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            key="open"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <Menu className="w-4 h-4" />
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm md:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -16, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -12, scale: 0.97 }}
                            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                            className="fixed top-20 left-4 right-4 z-50 md:hidden bg-white/95 backdrop-blur-xl border border-white/80 shadow-2xl shadow-slate-900/15 rounded-3xl overflow-hidden"
                        >
                            <div className="p-4 flex flex-col gap-3 max-h-[calc(100vh-6rem)] overflow-y-auto">
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
                                        className="w-full h-12 rounded-2xl bg-white border border-slate-200 text-slate-900 font-bold justify-start px-4 gap-3 shadow-sm hover:bg-slate-50"
                                        variant="ghost"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Building2 className="w-4 h-4 text-primary" />
                                        </div>
                                        List Your Property
                                    </Button>
                                </div>

                                {user ? (
                                    <div className="flex flex-col gap-2 pt-1 border-t border-slate-100">
                                        <div className="flex items-center gap-3 px-2 py-2">
                                            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center border-2 border-primary/20 shrink-0">
                                                {user?.face_photo ? (
                                                    <img src={user.face_photo} alt={user.full_name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-5 h-5 text-primary" />
                                                )}
                                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-900 truncate">{user.full_name}</p>
                                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                            </div>
                                            {user.is_owner && (
                                                <Badge className="ml-auto bg-primary/10 text-primary border-none text-[10px] shrink-0">Owner</Badge>
                                            )}
                                        </div>

                                        {[
                                            {
                                                label: user.is_owner ? "Owner Dashboard" : "User Dashboard",
                                                icon: <LayoutDashboard className="w-4 h-4 text-blue-500" />,
                                                iconBg: "bg-blue-50",
                                                onClick: () => { navigate("/dashboard"); setMobileOpen(false); }
                                            },
                                            ...(user.is_owner ? [{
                                                label: "Owner System",
                                                icon: <Building2 className="w-4 h-4 text-primary" />,
                                                iconBg: "bg-primary/10",
                                                onClick: () => { navigate("/add-property"); setMobileOpen(false); }
                                            }] : []),
                                            {
                                                label: "Settings",
                                                icon: <Settings className="w-4 h-4 text-slate-500" />,
                                                iconBg: "bg-slate-100",
                                                onClick: () => { navigate("/dashboard", { state: { activeTab: "profile" } }); setMobileOpen(false); }
                                            },
                                        ].map((item) => (
                                            <Button
                                                key={item.label}
                                                onClick={item.onClick}
                                                className="w-full h-12 rounded-2xl justify-start px-4 gap-3 font-bold text-slate-700 hover:bg-slate-50"
                                                variant="ghost"
                                            >
                                                <div className={`w-8 h-8 rounded-full ${item.iconBg} flex items-center justify-center shrink-0`}>
                                                    {item.icon}
                                                </div>
                                                {item.label}
                                            </Button>
                                        ))}

                                        <Button
                                            onClick={() => { logout(); setMobileOpen(false); }}
                                            className="w-full h-12 rounded-2xl justify-start px-4 gap-3 font-bold text-orange-600 hover:bg-orange-50"
                                            variant="ghost"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                                                <LogOut className="w-4 h-4 text-orange-400" />
                                            </div>
                                            Sign Out
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => { navigate("/login"); setMobileOpen(false); }}
                                        className="w-full h-12 rounded-full bg-slate-900 text-white font-bold shadow-lg shadow-slate-900/10 hover:bg-slate-800"
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
