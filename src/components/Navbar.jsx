import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Headphones, User, LogOut, Settings, LayoutDashboard, Building2, LogIn } from "lucide-react";
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
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 glass"
        >
            <div className="container flex items-center justify-between h-16">
                <Link to="/" className="flex items-center">
                    <img src="/bedbuddy-logo-blue.svg" alt="BedBuddy Logo" className="h-10 w-auto" />
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                            For Owners
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                className="gap-2 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-md group"
                                onClick={() => navigate('/add-property')}
                            >
                                <Building2 className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                                <span className="text-white">List Your Property</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="hidden md:flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                        <Headphones className="w-4 h-4" />
                        Support
                    </Button>
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="sm" className="gap-2 px-4 rounded-full border border-border/50 hover:bg-secondary/80 transition-all">
                                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium">{user.full_name}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 mt-2">
                                <DropdownMenuLabel className="font-heading">My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {user.is_owner ? (
                                    <>
                                        <DropdownMenuItem className="gap-2 cursor-pointer py-2.5">
                                            <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                                            <span>Owner Dashboard</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="gap-2 cursor-pointer py-2.5">
                                            <Building2 className="w-4 h-4 text-muted-foreground" />
                                            <span>Owner System</span>
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <DropdownMenuItem className="gap-2 cursor-pointer py-2.5">
                                        <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                                        <span>User Dashboard</span>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="gap-2 cursor-pointer py-2.5">
                                    <Settings className="w-4 h-4 text-muted-foreground" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="gap-2 cursor-pointer py-2.5 text-destructive focus:text-destructive">
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="default" size="sm" className="gap-2">
                                    Login
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 mt-2">
                                <DropdownMenuItem onClick={() => navigate('/login')} className="gap-2 cursor-pointer py-2.5">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <span>User Login</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/owner-login')} className="gap-2 cursor-pointer py-2.5">
                                    <Building2 className="w-4 h-4 text-muted-foreground" />
                                    <span>Owner Login</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                <button
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden overflow-hidden glass border-t"
                    >
                        <div className="container py-4 flex flex-col gap-3">
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <button
                                onClick={() => { navigate('/add-property'); setMobileOpen(false); }}
                                className="flex items-center gap-2 text-sm font-bold bg-orange-500 text-white hover:bg-orange-600 transition-all py-3 px-4 rounded-xl shadow-sm"
                            >
                                <Building2 className="w-4 h-4" />
                                List Your Property
                            </button>
                            {user ? (
                                <div className="space-y-3 pt-2 border-t mt-1">
                                    <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-xl mb-1">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-sm font-semibold">{user.full_name}</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1">
                                        {user.is_owner ? (
                                            <>
                                                <Button variant="ghost" size="sm" className="justify-start gap-3 h-11 text-muted-foreground">
                                                    <LayoutDashboard className="w-4 h-4" />
                                                    Owner Dashboard
                                                </Button>
                                                <Button variant="ghost" size="sm" className="justify-start gap-3 h-11 text-muted-foreground">
                                                    <Building2 className="w-4 h-4" />
                                                    Owner System
                                                </Button>
                                            </>
                                        ) : (
                                            <Button variant="ghost" size="sm" className="justify-start gap-3 h-11 text-muted-foreground">
                                                <LayoutDashboard className="w-4 h-4" />
                                                User Dashboard
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="sm" className="justify-start gap-3 h-11 text-muted-foreground">
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => { handleLogout(); setMobileOpen(false); }}
                                            className="justify-start gap-3 h-11 text-destructive hover:text-destructive hover:bg-destructive/5"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <Link to="/login" onClick={() => setMobileOpen(false)}>
                                        <Button variant="outline" size="sm" className="w-full">
                                            User Login
                                        </Button>
                                    </Link>
                                    <Link to="/owner-login" onClick={() => setMobileOpen(false)}>
                                        <Button variant="default" size="sm" className="w-full">
                                            Owner Login
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
