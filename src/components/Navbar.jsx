import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Headphones, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

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
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full">
                                <User className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">{user.full_name}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground">
                                <LogOut className="w-4 h-4" />
                                Logout
                            </Button>
                        </div>
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
                                <>
                                    <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-xl mb-1">
                                        <User className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-medium">{user.full_name}</span>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleLogout} className="w-full gap-2">
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </Button>
                                </>
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
