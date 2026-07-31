import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, X, Building2, MapPin, Loader2, ShieldCheck, LogOut, ExternalLink, Search, Pause, Home } from "lucide-react";
import { Input } from "@/components/ui/input";

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate("/admin/login");
            return;
        }
        fetchAllProperties();
    }, [user, navigate]);

    const fetchAllProperties = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/properties/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setProperties(data.results || data);
            } else {
                toast.error("Failed to fetch properties");
            }
        } catch (error) {
            console.error("Error fetching properties:", error);
            toast.error("Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (e, id, action) => {
        e.preventDefault();
        e.stopPropagation();
        setActionLoading(id);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/properties/${id}/${action}/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                toast.success(`Property ${action}d successfully`);
                setProperties(prev => prev.map(p => {
                    if (p.id === id) {
                        if (action === 'approve') p.is_verified = true;
                        if (action === 'reject') p.is_verified = false;
                        if (action === 'pause') p.is_verified = null;
                    }
                    return p;
                }));
            } else {
                toast.error(`Failed to ${action} property`);
            }
        } catch (error) {
            console.error(`Error ${action}ing property:`, error);
            toast.error("Error connecting to server");
        } finally {
            setActionLoading(null);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/admin/login");
    };

    const filteredProperties = properties.filter(p => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.owner_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (isVerified) => {
        if (isVerified === true) return <span className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Approved</span>;
        if (isVerified === false) return <span className="bg-red-100 text-red-700 border border-red-300 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Rejected</span>;
        return <span className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Pending</span>;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-primary/20 relative pb-20">
            {/* House/PG Theme Background Pattern */}
            <div 
                className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5L5 25h5v30h40V25h5L30 5zm10 45H20V30h20v20zm-15-5h10v-10H25v10z' fill='%23000000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    backgroundSize: "60px 60px"
                }}
            />
            
            <div className="fixed inset-0 bg-gradient-to-b from-blue-50/80 to-transparent pointer-events-none z-0" />

            {/* Sidebar / Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                            <Home className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 font-heading tracking-tight leading-none">Admin Command</h1>
                            <p className="text-xs text-slate-500 font-medium">NestNode Platform</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
                            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                            Systems Online
                        </div>
                        <Button 
                            variant="ghost" 
                            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 font-heading tracking-tight mb-2">Property Directory</h2>
                        <p className="text-slate-500 font-medium text-lg">Manage all PG & Hostel listings, review details, and control visibility.</p>
                    </div>
                    
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input 
                            type="text"
                            placeholder="Search properties..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 py-6 bg-white border-slate-200 text-slate-900 rounded-2xl focus:border-primary focus:ring-primary/20 transition-all placeholder:text-slate-400 shadow-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredProperties.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white/50 rounded-[2rem] border border-slate-200 border-dashed"
                            >
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 border border-slate-200 shadow-inner">
                                    <Building2 className="w-10 h-10 text-slate-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">No properties found</h3>
                                <p className="text-slate-500 max-w-md">There are no properties matching your search criteria.</p>
                            </motion.div>
                        ) : (
                            filteredProperties.map((property) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                    key={property.id}
                                >
                                    <Link 
                                        to={`/admin/property/${property.id}`}
                                        className="group block bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5 flex flex-col sm:flex-row relative"
                                    >
                                        {/* Image Section */}
                                        <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden bg-slate-100">
                                            {property.main_image ? (
                                                <img 
                                                    src={property.main_image} 
                                                    alt={property.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Building2 className="w-12 h-12 text-slate-300" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:bg-gradient-to-r" />
                                            
                                            <div className="absolute top-4 left-4">
                                                {getStatusBadge(property.is_verified)}
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-6 sm:w-3/5 flex flex-col justify-between z-10 bg-white">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-xl font-bold text-slate-900 font-heading leading-tight line-clamp-1">{property.name}</h3>
                                                    <a href={`/hostel/${property.id}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-slate-400 hover:text-primary transition-colors p-1">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>
                                                
                                                <div className="flex items-center text-sm text-slate-500 mb-4">
                                                    <MapPin className="w-3.5 h-3.5 mr-1 text-primary/70" />
                                                    <span className="truncate">{property.city}, {property.location}</span>
                                                </div>

                                                <div className="space-y-2 mb-6">
                                                    <div className="flex items-center justify-between text-sm bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                                                        <span className="text-slate-500">Owner</span>
                                                        <span className="font-bold text-slate-900 line-clamp-1 max-w-[120px] text-right">{property.owner_name || "N/A"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                                                        <span className="text-slate-500">Price</span>
                                                        <span className="font-bold text-slate-900">₹{property.price}<span className="text-slate-500 font-normal">/mo</span></span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 mt-4" onClick={(e) => e.preventDefault()}>
                                                <Button 
                                                    size="sm"
                                                    onClick={(e) => handleAction(e, property.id, "approve")}
                                                    disabled={actionLoading === property.id || property.is_verified === true}
                                                    className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-400 hover:to-green-500 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-green-500/30 hover:shadow-lg hover:shadow-green-500/40 active:scale-95 hover:-translate-y-0.5 border-none"
                                                >
                                                    {actionLoading === property.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3 mr-1" />}
                                                    Approve
                                                </Button>
                                                
                                                <Button 
                                                    size="sm"
                                                    onClick={(e) => handleAction(e, property.id, "reject")}
                                                    disabled={actionLoading === property.id || property.is_verified === false}
                                                    className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-400 hover:to-red-500 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-red-500/30 hover:shadow-lg hover:shadow-red-500/40 active:scale-95 hover:-translate-y-0.5 border-none"
                                                >
                                                    {actionLoading === property.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3 mr-1" />}
                                                    Reject
                                                </Button>

                                                <Button 
                                                    size="sm"
                                                    onClick={(e) => handleAction(e, property.id, "pause")}
                                                    disabled={actionLoading === property.id || property.is_verified === null}
                                                    className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-400 hover:to-indigo-500 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40 active:scale-95 hover:-translate-y-0.5 border-none"
                                                >
                                                    {actionLoading === property.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Pause className="w-3 h-3 mr-1" />}
                                                    Pause
                                                </Button>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
