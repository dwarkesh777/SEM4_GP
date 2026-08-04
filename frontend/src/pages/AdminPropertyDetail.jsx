import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Building2, MapPin, User, Mail, Phone, Check, X, Trash2, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

const AdminPropertyDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (!user) {
            navigate("/admin/login");
            return;
        }
        fetchPropertyDetails();
    }, [id, user, navigate]);

    const fetchPropertyDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/properties/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setProperty(data);
            } else {
                toast.error("Failed to fetch property details.");
                navigate("/admin/dashboard");
            }
        } catch (error) {
            console.error("Error fetching property:", error);
            toast.error("Network error.");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action) => {
        setActionLoading(action);
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
                    navigate("/admin");
                } else {
                    setProperty(prev => {
                        const newProp = { ...prev };
                        if (action === 'approve') newProp.is_verified = true;
                        if (action === 'reject') newProp.is_verified = false;
                        return newProp;
                    });
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

    const getStatusBadge = (isVerified) => {
        if (isVerified === true) return <span className="bg-green-100 text-green-700 border border-green-300 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">Approved</span>;
        if (isVerified === false) return <span className="bg-red-100 text-red-700 border border-red-300 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">Rejected</span>;
        return <span className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">Pending</span>;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (!property) return null;

    return (
        <div className="min-h-screen bg-white text-slate-900 pb-20 relative">
            {/* Background Pattern */}
            <div 
                className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5L5 25h5v30h40V25h5L30 5zm10 45H20V30h20v20zm-15-5h10v-10H25v10z' fill='%23000000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    backgroundSize: "60px 60px"
                }}
            />
            <div className="fixed inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none z-0" />

            {/* Header / Hero */}
            <header className="relative z-10 w-full h-[40vh] md:h-[50vh] bg-slate-900 flex flex-col justify-between">
                {property.main_image ? (
                    <img src={property.main_image} alt={property.name} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                        <Building2 className="w-32 h-32 text-slate-600" />
                    </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Navbar */}
                <div className="relative z-20 px-6 py-6 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate("/admin/dashboard")} className="text-white hover:bg-white/20 rounded-full px-6 backdrop-blur-md border border-white/20">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Button>
                    {getStatusBadge(property.is_verified)}
                </div>

                {/* Title Area */}
                <div className="relative z-20 px-6 pb-12 max-w-7xl mx-auto w-full flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white font-heading tracking-tight mb-3">
                            {property.name}
                        </h1>
                        <p className="text-slate-300 text-lg flex items-center">
                            <MapPin className="w-5 h-5 mr-2 text-primary" /> {property.address}, {property.city}
                        </p>
                    </div>
                    <a href={`/hostel/${property.id}`} target="_blank" rel="noreferrer" className="hidden md:flex items-center text-primary bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md transition-colors border border-white/10">
                        View Public Page <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                </div>
            </header>

            {/* Main Content Layout */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Left Column (Details) */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Description */}
                    <section>
                        <h3 className="text-2xl font-bold mb-4 text-slate-900 border-b border-slate-200 pb-3">About this Property</h3>
                        <p className="text-slate-600 text-lg whitespace-pre-wrap leading-relaxed">{property.description || "No description provided."}</p>
                    </section>

                    {/* Gallery */}
                    <section>
                        <h3 className="text-2xl font-bold mb-4 text-slate-900 border-b border-slate-200 pb-3">Photo Gallery</h3>
                        {property.images && property.images.length > 0 ? (
                            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 group">
                                <div className="aspect-video w-full relative flex items-center justify-center">
                                    <img 
                                        src={property.images[currentImageIndex].image} 
                                        alt={`Gallery ${currentImageIndex}`} 
                                        className="w-full h-full object-contain"
                                    />
                                    
                                    {/* Navigation Buttons */}
                                    {property.images.length > 1 && (
                                        <>
                                            <button 
                                                onClick={() => setCurrentImageIndex(prev => prev === 0 ? property.images.length - 1 : prev - 1)}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 hover:scale-105"
                                            >
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                            <button 
                                                onClick={() => setCurrentImageIndex(prev => prev === property.images.length - 1 ? 0 : prev + 1)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 hover:scale-105"
                                            >
                                                <ChevronRight className="w-6 h-6" />
                                            </button>
                                        </>
                                    )}

                                    {/* Image Counter */}
                                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-medium">
                                        {currentImageIndex + 1} / {property.images.length}
                                    </div>
                                </div>
                                
                                {/* Thumbnails */}
                                {property.images.length > 1 && (
                                    <div className="flex gap-2 p-4 bg-slate-800 overflow-x-auto snap-x scrollbar-hide">
                                        {property.images.map((img, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentImageIndex(i)}
                                                className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 snap-start transition-all border-2 ${currentImageIndex === i ? 'border-primary shadow-lg scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                            >
                                                <img src={img.image} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-slate-500">No additional photos available.</p>
                        )}
                    </section>
                    
                    {/* Features */}
                    <section>
                        <h3 className="text-2xl font-bold mb-4 text-slate-900 border-b border-slate-200 pb-3">Amenities & Appliances</h3>
                        <div className="flex flex-wrap gap-3">
                            {property.amenities?.map(a => (
                                <span key={a.name} className="bg-blue-50 px-4 py-2 rounded-xl text-sm font-medium border border-blue-100 text-blue-700 shadow-sm">
                                    {a.name}
                                </span>
                            ))}
                            {property.appliances?.map(a => (
                                <span key={a.name} className="bg-indigo-50 px-4 py-2 rounded-xl text-sm font-medium border border-indigo-100 text-indigo-700 shadow-sm">
                                    {a.name}
                                </span>
                            ))}
                            {(!property.amenities?.length && !property.appliances?.length) && (
                                <span className="text-slate-500 italic">No amenities or appliances listed.</span>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column (Sidebar Actions) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-8">
                        {/* Owner Details Card */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                            <h4 className="text-xl font-bold mb-6 flex items-center text-slate-900 border-b border-slate-100 pb-4">
                            <User className="w-6 h-6 mr-3 text-primary" /> Owner Information
                        </h4>
                        <div className="space-y-6">
                            <div className="flex flex-col">
                                <span className="text-sm text-slate-500 font-medium mb-1">Full Name</span>
                                <span className="font-bold text-slate-900 text-lg">{property.owner_name || "Unknown"}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-slate-500 font-medium mb-1">Email Address</span>
                                <a href={`mailto:${property.email}`} className="font-bold text-primary hover:underline flex items-center text-lg break-all">
                                    <Mail className="w-4 h-4 mr-2" /> {property.email || "N/A"}
                                </a>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-slate-500 font-medium mb-1">Phone Number</span>
                                <a href={`tel:${property.phone}`} className="font-bold text-primary hover:underline flex items-center text-lg">
                                    <Phone className="w-4 h-4 mr-2" /> {property.phone || "N/A"}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <h4 className="text-xl font-bold mb-6 text-slate-900 border-b border-slate-200 pb-4">Property Specifications</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100">
                                <span className="text-slate-500 font-medium">Type</span>
                                <span className="font-bold text-slate-900 text-lg">{property.type}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100">
                                <span className="text-slate-500 font-medium">Gender</span>
                                <span className="font-bold text-slate-900 text-lg">{property.gender}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-primary/20 bg-primary/5">
                                <span className="text-slate-700 font-medium">Base Price</span>
                                <span className="font-black text-primary text-xl">₹{property.price}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions Menu */}
                    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
                        <h4 className="text-xl font-bold mb-6 text-white text-center">Admin Controls</h4>
                        <div className="flex flex-col gap-4">
                            <Button 
                                size="lg"
                                onClick={() => handleAction("approve")}
                                disabled={actionLoading === "approve" || property.is_verified === true}
                                className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-400 hover:to-green-500 transition-all font-bold disabled:opacity-50 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 active:scale-[0.98] hover:-translate-y-1 border-none h-14 text-lg"
                            >
                                {actionLoading === "approve" ? <Loader2 className="w-6 h-6 animate-spin" /> : <Check className="w-6 h-6 mr-2" />}
                                Approve Property
                            </Button>
                            
                            <Button 
                                size="lg"
                                onClick={() => handleAction("reject")}
                                disabled={actionLoading === "reject" || property.is_verified === false}
                                className="w-full rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-400 hover:to-red-500 transition-all font-bold disabled:opacity-50 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 active:scale-[0.98] hover:-translate-y-1 border-none h-14 text-lg"
                            >
                                {actionLoading === "reject" ? <Loader2 className="w-6 h-6 animate-spin" /> : <X className="w-6 h-6 mr-2" />}
                                Reject Property
                            </Button>

                            <Button 
                                size="lg"
                                onClick={() => handleAction("delete")}
                                disabled={actionLoading === "delete"}
                                className="w-full rounded-2xl bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-500 hover:to-gray-600 transition-all font-bold disabled:opacity-50 shadow-lg shadow-gray-500/30 hover:shadow-xl hover:shadow-gray-500/40 active:scale-[0.98] hover:-translate-y-1 border-none h-14 text-lg"
                            >
                                {actionLoading === "delete" ? <Loader2 className="w-6 h-6 animate-spin" /> : <Trash2 className="w-6 h-6 mr-2" />}
                                Delete Property
                            </Button>
                        </div>
                    </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPropertyDetail;
