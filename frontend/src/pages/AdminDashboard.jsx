import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Check, X, Building2, MapPin, Loader2, LogOut, ExternalLink, Search, 
  Trash2, Home, Users, UserCheck, Shield, Mail, Phone, Calendar, 
  ChevronRight, BadgeCheck, FileText, LayoutDashboard, Layers, Code2, User
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Active Sidebar Tab: 'properties' | 'students' | 'owners'
    const [activeTab, setActiveTab] = useState("properties");

    // Data States
    const [properties, setProperties] = useState([]);
    const [students, setStudents] = useState([]);
    const [owners, setOwners] = useState([]);
    const [developers, setDevelopers] = useState([]);

    // Loading States
    const [loading, setLoading] = useState(true);
    const [tabLoading, setTabLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [actionLoading, setActionLoading] = useState(null);

    // Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        full_name: "", email: "", phone_number: "", face_photo: ""
    });

    useEffect(() => {
        if (!user) {
            navigate("/admin/login");
            return;
        }
        setProfileData({
            full_name: user.full_name || "",
            email: user.email || "",
            phone_number: user.phone_number || "",
            face_photo: user.face_photo || ""
        });
        fetchAllProperties();
        fetchStudents();
        fetchOwners();
        fetchDevelopers();
    }, [user, navigate]);

    const fetchAllProperties = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/properties/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setProperties(data.results || data);
            }
        } catch (error) {
            console.error("Error fetching properties:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        setTabLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/admin/students/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setStudents(data);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setTabLoading(false);
        }
    };

    const fetchDevelopers = async () => {
        setTabLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/admin/developers/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setDevelopers(data);
            }
        } catch (error) {
            console.error("Error fetching developers:", error);
        } finally {
            setTabLoading(false);
        }
    };

    const fetchOwners = async () => {
        setTabLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/admin/owners/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setOwners(data);
            }
        } catch (error) {
            console.error("Error fetching owners:", error);
        } finally {
            setTabLoading(false);
        }
    };

    const handleAction = async (e, id, action) => {
        e.preventDefault();
        e.stopPropagation();
        setActionLoading(id);
        try {
            const token = localStorage.getItem("token");
            const url = action === 'delete' ? `${API_URL}/api/properties/${id}/` : `${API_URL}/api/properties/${id}/${action}/`;
            const method = action === 'delete' ? "DELETE" : "POST";
            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                toast.success(`Property ${action}d successfully`);
                if (action === 'delete') {
                    setProperties(prev => prev.filter(p => p.id !== id));
                } else {
                    setProperties(prev => prev.map(p => {
                        if (p.id === id) {
                            if (action === 'approve') p.is_verified = true;
                            if (action === 'reject') p.is_verified = false;
                        }
                        return p;
                    }));
                }
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

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/auth/profile/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });

            if (res.ok) {
                toast.success("Profile details saved successfully.");
                setIsEditing(false);
            } else {
                toast.error("Could not save profile details to database.");
            }
        } catch (error) {
            toast.error("Failed to update profile.");
        }
    };

    const getStatusBadge = (isVerified) => {
        if (isVerified === true) return <span className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Approved</span>;
        if (isVerified === false) return <span className="bg-red-100 text-red-700 border border-red-300 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Rejected</span>;
        return <span className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Pending</span>;
    };

    // Filter Logic per Tab
    const filteredProperties = properties.filter(p => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.owner_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredStudents = students.filter(s =>
        s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone_number?.includes(searchQuery)
    );

    const filteredOwners = owners.filter(o =>
        o.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.city?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredDevelopers = developers.filter(d =>
        d.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex text-slate-900 selection:bg-blue-500/20">
            {/* Background Texture */}
            <div 
                className="fixed inset-0 pointer-events-none opacity-[0.02] z-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5L5 25h5v30h40V25h5L30 5zm10 45H20V30h20v20zm-15-5h10v-10H25v10z' fill='%23000000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    backgroundSize: "60px 60px"
                }}
            />

            {/* ── SIDEBAR NAVIGATION ── */}
            <aside className="w-64 sm:w-72 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 sticky top-0 h-screen z-30 shadow-sm">
                <div>
                    {/* Header Logo */}
                    <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">Admin Command</h1>
                            <p className="text-xs text-blue-600 font-bold mt-1">NestNode Platform</p>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <nav className="p-4 space-y-1.5">
                        <div className="px-3 py-2 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                            Management Portal
                        </div>

                        {/* Properties Tab */}
                        <button
                            onClick={() => { setActiveTab("properties"); setSearchQuery(""); }}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                                activeTab === "properties"
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-[1.02]"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Building2 className="w-5 h-5" />
                                <span>Properties</span>
                            </div>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-black ${
                                activeTab === "properties" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                            }`}>
                                {properties.length}
                            </span>
                        </button>

                        {/* Students Tab */}
                        <button
                            onClick={() => { setActiveTab("students"); setSearchQuery(""); }}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                                activeTab === "students"
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-[1.02]"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5" />
                                <span>Students</span>
                            </div>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-black ${
                                activeTab === "students" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                            }`}>
                                {students.length}
                            </span>
                        </button>

                        {/* Owners Tab */}
                        <button
                            onClick={() => { setActiveTab("owners"); setSearchQuery(""); }}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                                activeTab === "owners"
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-[1.02]"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <UserCheck className="w-5 h-5" />
                                <span>Owners</span>
                            </div>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-black ${
                                activeTab === "owners" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                            }`}>
                                {owners.length}
                            </span>
                        </button>

                        {/* Developers Tab */}
                        <button
                            onClick={() => { setActiveTab("developers"); setSearchQuery(""); }}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                                activeTab === "developers"
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-[1.02]"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Code2 className="w-5 h-5" />
                                <span>Developers</span>
                            </div>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-black ${
                                activeTab === "developers" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                            }`}>
                                {developers.length}
                            </span>
                        </button>
                    </nav>
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100/80 px-3.5 py-2.5 rounded-xl border border-slate-200/80">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        Systems Operational
                    </div>

                    <button
                        onClick={() => setActiveTab("profile")}
                        className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center overflow-hidden">
                                {profileData.face_photo ? (
                                    <img src={profileData.face_photo} alt={user?.full_name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-4 h-4" />
                                )}
                            </div>
                            <div className="text-left flex flex-col">
                                <span className="text-sm font-bold truncate max-w-[120px]">{user?.full_name || "Admin"}</span>
                                <span className="text-[10px] text-slate-500 truncate max-w-[120px]">{user?.email}</span>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-sm font-bold"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* ── MAIN CONTENT AREA ── */}
            <main className="flex-1 min-w-0 p-6 sm:p-10 relative z-10 overflow-y-auto max-h-screen">
                {/* Search Bar & Header Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight capitalize">
                            {activeTab === "properties" && "Property Directory"}
                            {activeTab === "students" && "Student Directory"}
                            {activeTab === "owners" && "Property Owners Directory"}
                        </h2>
                        <p className="text-slate-500 font-medium text-sm mt-0.5">
                            {activeTab === "properties" && "Manage, approve, or reject listings across the platform."}
                            {activeTab === "students" && "Registered students looking for hostels & PGs."}
                            {activeTab === "owners" && "Verified property owners & partners on NestNode."}
                        </p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 py-5 bg-white border-slate-200 text-slate-900 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 shadow-sm"
                        />
                    </div>
                </div>

                {/* TAB 1: PROPERTIES DIRECTORY */}
                {activeTab === "properties" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredProperties.length === 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-[2rem] border border-slate-200 border-dashed"
                                >
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                        <Building2 className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">No properties found</h3>
                                    <p className="text-slate-500 text-sm">No properties matching your criteria.</p>
                                </motion.div>
                            ) : (
                                filteredProperties.map((property) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={property.id}
                                    >
                                        <Link 
                                            to={`/admin/property/${property.id}`}
                                            className="group block bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col sm:flex-row relative"
                                        >
                                            {/* Image */}
                                            <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden bg-slate-100">
                                                {property.main_image ? (
                                                    <img 
                                                        src={property.main_image} 
                                                        alt={property.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Building2 className="w-10 h-10 text-slate-300" />
                                                    </div>
                                                )}
                                                <div className="absolute top-4 left-4">
                                                    {getStatusBadge(property.is_verified)}
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="p-5 sm:w-3/5 flex flex-col justify-between bg-white">
                                                <div>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className="text-lg font-bold text-slate-900 leading-tight line-clamp-1">{property.name}</h3>
                                                        <a href={`/hostel/${property.id}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-slate-400 hover:text-blue-600 p-1">
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    </div>

                                                    <div className="flex items-center text-xs text-slate-500 mb-3">
                                                        <MapPin className="w-3.5 h-3.5 mr-1 text-blue-600" />
                                                        <span className="truncate">{property.city}, {property.location}</span>
                                                    </div>

                                                    <div className="space-y-1.5 mb-4 text-xs">
                                                        <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                            <span className="text-slate-500">Owner</span>
                                                            <span className="font-bold text-slate-900 truncate max-w-[120px]">{property.owner_name || "N/A"}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                            <span className="text-slate-500">Price</span>
                                                            <span className="font-bold text-slate-900">₹{property.price}/mo</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 mt-2" onClick={(e) => e.preventDefault()}>
                                                    <Button 
                                                        size="sm"
                                                        onClick={(e) => handleAction(e, property.id, "approve")}
                                                        disabled={actionLoading === property.id || property.is_verified === true}
                                                        className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                                                    >
                                                        {actionLoading === property.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3 mr-1" />}
                                                        Approve
                                                    </Button>

                                                    <Button 
                                                        size="sm"
                                                        onClick={(e) => handleAction(e, property.id, "reject")}
                                                        disabled={actionLoading === property.id || property.is_verified === false}
                                                        className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm"
                                                    >
                                                        {actionLoading === property.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3 mr-1" />}
                                                        Reject
                                                    </Button>

                                                    <Button 
                                                        size="sm"
                                                        onClick={(e) => handleAction(e, property.id, "delete")}
                                                        disabled={actionLoading === property.id}
                                                        className="rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* TAB 2: STUDENTS DIRECTORY */}
                {activeTab === "students" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Total Students</p>
                                    <h3 className="text-2xl font-black text-slate-900">{students.length}</h3>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                                    <BadgeCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Verified Accounts</p>
                                    <h3 className="text-2xl font-black text-slate-900">{students.length}</h3>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Active Searches</p>
                                    <h3 className="text-2xl font-black text-slate-900">Active</h3>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredStudents.length === 0 ? (
                                <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200">
                                    <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                                    <h4 className="text-lg font-bold text-slate-800">No Students Found</h4>
                                    <p className="text-sm text-slate-500">No student matching your search term.</p>
                                </div>
                            ) : (
                                filteredStudents.map((st) => (
                                    <div 
                                        key={st.id} 
                                        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-14 h-14 rounded-full bg-blue-100 border-2 border-blue-200 text-blue-700 flex items-center justify-center font-black text-xl shrink-0 overflow-hidden">
                                                {st.face_photo ? (
                                                    <img src={st.face_photo} alt={st.full_name} className="w-full h-full object-cover" />
                                                ) : (
                                                    st.full_name?.[0]?.toUpperCase() || "S"
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-extrabold text-base text-slate-900 truncate">{st.full_name || "Student"}</h4>
                                                <Badge className="bg-blue-100 text-blue-700 font-bold text-[10px] uppercase mt-0.5">Student Account</Badge>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                <span className="truncate">{st.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                <span>{st.phone_number || "Not provided"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 pt-1">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span>Joined {st.date_joined ? new Date(st.date_joined).toLocaleDateString() : 'Recently'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 3: OWNERS DIRECTORY */}
                {activeTab === "owners" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                                    <UserCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Property Owners</p>
                                    <h3 className="text-2xl font-black text-slate-900">{owners.length}</h3>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Total Properties</p>
                                    <h3 className="text-2xl font-black text-slate-900">{properties.length}</h3>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Verified Partners</p>
                                    <h3 className="text-2xl font-black text-slate-900">{owners.length}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredOwners.length === 0 ? (
                                <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200">
                                    <UserCheck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                                    <h4 className="text-lg font-bold text-slate-800">No Owners Found</h4>
                                    <p className="text-sm text-slate-500">No owner matching your search term.</p>
                                </div>
                            ) : (
                                filteredOwners.map((ow) => (
                                    <div 
                                        key={ow.id} 
                                        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-200 text-amber-700 flex items-center justify-center font-black text-xl shrink-0 overflow-hidden">
                                                    {ow.face_photo ? (
                                                        <img src={ow.face_photo} alt={ow.full_name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        ow.full_name?.[0]?.toUpperCase() || "O"
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-extrabold text-base text-slate-900 truncate">{ow.full_name || "Owner"}</h4>
                                                    <Badge className="bg-amber-100 text-amber-800 font-bold text-[10px] uppercase mt-0.5">
                                                        {ow.business_name || "Verified Partner"}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                    <span className="truncate">{ow.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                    <span>{ow.phone_number || "Not provided"}</span>
                                                </div>
                                                {ow.city && (
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                                        <span>{ow.city}, {ow.state || ''}</span>
                                                    </div>
                                                )}
                                                {ow.pan_number && (
                                                    <div className="flex items-center gap-2 text-slate-500 font-mono">
                                                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span>PAN: {ow.pan_number}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                            <span>Joined {ow.date_joined ? new Date(ow.date_joined).toLocaleDateString() : 'Recently'}</span>
                                            <span className="font-bold text-blue-600">
                                                {properties.filter(p => p.owner === ow.email || p.owner_name === ow.full_name).length} Properties
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 4: DEVELOPERS DIRECTORY */}
                {activeTab === "developers" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                                    <Code2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Developers</p>
                                    <h3 className="text-2xl font-black text-slate-900">{developers.length}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDevelopers.length === 0 ? (
                                <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200">
                                    <Code2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                                    <h4 className="text-lg font-bold text-slate-800">No Developers Found</h4>
                                    <p className="text-sm text-slate-500">No developer matching your search term.</p>
                                </div>
                            ) : (
                                filteredDevelopers.map((dev) => (
                                    <div 
                                        key={dev.id} 
                                        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-14 h-14 rounded-full bg-indigo-100 border-2 border-indigo-200 text-indigo-700 flex items-center justify-center font-black text-xl shrink-0 overflow-hidden">
                                                {dev.face_photo ? (
                                                    <img src={dev.face_photo} alt={dev.full_name} className="w-full h-full object-cover" />
                                                ) : (
                                                    dev.full_name?.[0]?.toUpperCase() || "D"
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-extrabold text-base text-slate-900 truncate">{dev.full_name || "Developer"}</h4>
                                                <Badge className="bg-indigo-100 text-indigo-700 font-bold text-[10px] uppercase mt-0.5">API Developer</Badge>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                <span className="truncate">{dev.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                <span>{dev.phone_number || "Not provided"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 pt-1">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span>Joined {dev.date_joined ? new Date(dev.date_joined).toLocaleDateString() : 'Recently'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 5: ADMIN PROFILE */}
                {activeTab === "profile" && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-32 h-32 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shadow-sm shrink-0 overflow-hidden relative group">
                                    {profileData.face_photo ? (
                                        <img src={profileData.face_photo} alt={user?.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-12 h-12" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900">{profileData.full_name || "Admin"}</h2>
                                            <p className="text-slate-500 font-medium">Administrator Profile</p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsEditing(!isEditing)}
                                            className="font-bold border-slate-200 text-slate-700"
                                        >
                                            {isEditing ? "Cancel" : "Edit Profile"}
                                        </Button>
                                    </div>

                                    <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 uppercase">Full Name</label>
                                            <Input
                                                className="bg-slate-50 border-slate-200 h-12 font-medium focus-visible:ring-blue-500"
                                                value={profileData.full_name}
                                                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                                disabled={!isEditing}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 uppercase">Email Address</label>
                                            <Input
                                                className="bg-slate-50 border-slate-200 h-12 font-medium"
                                                value={profileData.email}
                                                disabled={true} // Email should usually not be edited directly here
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 uppercase">Phone Number</label>
                                            <Input
                                                className="bg-slate-50 border-slate-200 h-12 font-medium focus-visible:ring-blue-500"
                                                value={profileData.phone_number}
                                                onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        {isEditing && (
                                            <div className="col-span-full pt-4">
                                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 w-full sm:w-auto">
                                                    Save Changes
                                                </Button>
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
