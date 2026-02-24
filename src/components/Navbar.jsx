import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Headphones, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
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
    { label: "For Owners", href: "/#owners" },
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
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-heading font-bold text-sm">N</span>
                    </div>
                    <span className="font-heading font-bold text-xl">
                        <span className="text-gradient">Nest</span>
                        <span className="text-foreground">Node</span>
                    </span>
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
                                <DropdownMenuItem className="gap-2 cursor-pointer py-2.5">
                                    <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                                    <span>User Dashboard</span>
                                </DropdownMenuItem>
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
                        <Link to="/login">
                            <Button variant="default" size="sm">
                                Login
                            </Button>
                        </Link>
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
                            {user ? (
                                <div className="space-y-3 pt-2 border-t mt-1">
                                    <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-xl mb-1">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-sm font-semibold">{user.full_name}</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1">
                                        <Button variant="ghost" size="sm" className="justify-start gap-3 h-11 text-muted-foreground">
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard
                                        </Button>
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
                                <Link to="/login" onClick={() => setMobileOpen(false)}>
                                    <Button variant="default" size="sm" className="w-full mt-2">
                                        Login
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
