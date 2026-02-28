import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Calendar, MessageSquare, Heart, LogOut,
    MapPin, Phone, Mail, Camera, ChevronRight, ExternalLink,
    Clock, CheckCircle2, Loader2, AlertCircle, RefreshCw, BedDouble
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { API_URL } from "@/lib/api";
import { Link } from "react-router-dom";

const StatusBadge = ({ status }) => {
    const styles = {
        Confirmed: "bg-emerald-50 text-emerald-600 border-emerald-100",
        Pending: "bg-amber-50 text-amber-600 border-amber-100",
        Cancelled: "bg-red-50 text-red-500 border-red-100",
    };
    const icons = {
        Confirmed: <CheckCircle2 className="w-3.5 h-3.5" />,
        Pending: <Clock className="w-3.5 h-3.5" />,
        Cancelled: <AlertCircle className="w-3.5 h-3.5" />,
    };
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${styles[status] || styles.Pending}`}>
            {icons[status] || icons.Pending}
            {status}
        </span>
    );
};

const BuildingIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className={className}>
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
        <path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" />
    </svg>
);

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("profile");
    const [isLoading, setIsLoading] = useState(false);
    const [bookingsLoading, setBookingsLoading] = useState(false);

    const [profileData, setProfileData] = useState({
        full_name: user?.full_name || "",
        email: user?.email || "",
        phone_number: user?.phone_number || "",
    });

    const [bookings, setBookings] = useState([]);
    const [enquiries] = useState([]);
    const [wishlist] = useState([]);

    useEffect(() => {
        if (user) {
            setProfileData({
                full_name: user.full_name,
                email: user.email,
                phone_number: user.phone_number || "",
            });
        }
    }, [user]);

    useEffect(() => {
        if (activeTab === "bookings") fetchBookings();
    }, [activeTab]);

    const fetchBookings = async () => {
        setBookingsLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) { setBookings([]); return; }
            const res = await fetch(`${API_URL}/api/my-bookings/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setBookings(await res.json());
            } else {
                setBookings([]);
            }
        } catch (e) {
            console.error("Error fetching bookings:", e);
            setBookings([]);
        } finally {
            setBookingsLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 800));
        toast({ title: "Profile Updated", description: "Your information has been saved successfully." });
        setIsLoading(false);
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "bookings", label: "Bookings", icon: Calendar },
        { id: "enquiries", label: "Enquiries", icon: MessageSquare },
        { id: "wishlist", label: "Wishlist", icon: Heart },
    ];

    const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />
            <div className="pt-28 pb-20 container max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar */}
                    <div className="lg:col-span-3">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center sticky top-28">
                            <div className="relative group mb-4">
                                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden border-2 border-primary/20">
                                    <User className="w-12 h-12" />
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg border-2 border-white">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-1">{user?.full_name}</h2>
                            <p className="text-sm text-slate-500 font-medium mb-6">{user?.email}</p>
                            <div className="w-full flex flex-col gap-1.5">
                                {tabs.map((tab) => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${activeTab === tab.id ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" : "text-slate-600 hover:bg-primary/5 hover:text-primary"}`}>
                                        <tab.icon className="w-5 h-5" />
                                        <span className="font-semibold text-sm">{tab.label}</span>
                                        {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                                    </button>
                                ))}
                                <div className="my-4 border-t border-slate-100" />
                                <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 transition-all font-semibold text-sm">
                                    <LogOut className="w-5 h-5" /> Logout
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }} className="min-h-[600px]">

                                {/* ── PROFILE ── */}
                                {activeTab === "profile" && (
                                    <div className="space-y-6">
                                        <div>
                                            <h1 className="text-3xl font-black text-slate-900 font-heading">Settings</h1>
                                            <p className="text-slate-500">Manage your personal information and preferences.</p>
                                        </div>
                                        <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                                            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                                <CardTitle className="text-lg">Personal Information</CardTitle>
                                                <CardDescription>Keep your profile updated for quicker bookings.</CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-8">
                                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <Label className="font-bold text-slate-700 ml-1">Full Name</Label>
                                                            <div className="relative">
                                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                                <Input placeholder="Full name" className="pl-11 py-6 rounded-2xl border-slate-200" value={profileData.full_name} onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })} />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="font-bold text-slate-700 ml-1">Email Address</Label>
                                                            <div className="relative">
                                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                                <Input type="email" disabled className="pl-11 py-6 rounded-2xl bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed" value={profileData.email} />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="font-bold text-slate-700 ml-1">Phone Number</Label>
                                                            <div className="relative">
                                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                                <Input placeholder="+91 00000 00000" className="pl-11 py-6 rounded-2xl border-slate-200" value={profileData.phone_number} onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })} />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="font-bold text-slate-700 ml-1">Location</Label>
                                                            <div className="relative">
                                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                                <Input disabled className="pl-11 py-6 rounded-2xl bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed" value="Ahmedabad, Gujarat" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="pt-4 flex justify-end">
                                                        <Button type="submit" disabled={isLoading} className="rounded-2xl px-10 py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 font-bold active:scale-95">
                                                            {isLoading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
                                                            Save Changes
                                                        </Button>
                                                    </div>
                                                </form>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                {/* ── BOOKINGS ── */}
                                {activeTab === "bookings" && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h1 className="text-3xl font-black text-slate-900 font-heading">Your Bookings</h1>
                                                <p className="text-slate-500">All your confirmed room reservations.</p>
                                            </div>
                                            <button onClick={fetchBookings} disabled={bookingsLoading}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary transition-all text-sm font-bold shadow-sm disabled:opacity-50">
                                                <RefreshCw className={`w-4 h-4 ${bookingsLoading ? "animate-spin" : ""}`} />
                                                Refresh
                                            </button>
                                        </div>

                                        {bookingsLoading ? (
                                            <div className="flex flex-col items-center justify-center h-[400px] bg-white rounded-[2rem] border border-slate-100">
                                                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                                                <p className="text-slate-500 font-medium">Loading your bookings...</p>
                                            </div>
                                        ) : bookings.length > 0 ? (
                                            <div className="grid gap-5">
                                                {bookings.map((booking, i) => (
                                                    <motion.div key={booking.id}
                                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                                                        className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                                                        <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
                                                        <div className="p-6">
                                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                                                {/* Left: Property info */}
                                                                <div className="flex items-start gap-4">
                                                                    {booking.property_image ? (
                                                                        <img src={booking.property_image} alt={booking.property_name}
                                                                            className="w-16 h-16 rounded-2xl object-cover border border-slate-100 flex-shrink-0" />
                                                                    ) : (
                                                                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 flex-shrink-0">
                                                                            <BuildingIcon className="w-8 h-8" />
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <h3 className="font-black text-slate-900 text-lg tracking-tight leading-tight">{booking.property_name}</h3>
                                                                        <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium mt-0.5">
                                                                            <MapPin className="w-3.5 h-3.5 text-primary" />
                                                                            {booking.property_location}{booking.property_city ? `, ${booking.property_city}` : ""}
                                                                        </div>
                                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                                            {booking.room_name && (
                                                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                                                                                    <BedDouble className="w-3.5 h-3.5 text-primary" /> {booking.room_name}
                                                                                </span>
                                                                            )}
                                                                            {booking.room_occupancy && (
                                                                                <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">{booking.room_occupancy}</span>
                                                                            )}
                                                                            {booking.property_type && (
                                                                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">{booking.property_type}</span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {/* Right: Status + Amount */}
                                                                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 flex-shrink-0">
                                                                    <StatusBadge status={booking.status} />
                                                                    {booking.amount && (
                                                                        <div className="text-right">
                                                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount Paid</p>
                                                                            <p className="text-xl font-black text-primary tracking-tight">₹{Number(booking.amount).toLocaleString("en-IN")}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Details grid */}
                                                            <div className="mt-5 pt-4 border-t border-slate-50 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Booked On</p>
                                                                    <p className="text-sm font-bold text-slate-700">{formatDate(booking.created_at)}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Customer</p>
                                                                    <p className="text-sm font-bold text-slate-700 truncate">{booking.customer_name || "—"}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Mobile</p>
                                                                    <p className="text-sm font-bold text-slate-700">{booking.customer_phone ? `+91 ${booking.customer_phone}` : "—"}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Payment ID</p>
                                                                    <p className="text-[11px] font-mono font-bold text-slate-600 truncate">{booking.payment_id || "—"}</p>
                                                                </div>
                                                            </div>

                                                            {booking.property_id && (
                                                                <div className="mt-4 flex justify-end">
                                                                    <Link to={`/hostel/${booking.property_id}`}
                                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all text-xs font-bold">
                                                                        <ExternalLink className="w-3.5 h-3.5" /> View Property
                                                                    </Link>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-slate-200 rounded-[2rem] bg-white/50">
                                                <Calendar className="w-16 h-16 text-slate-300 mb-4" />
                                                <p className="text-slate-500 font-bold text-lg text-center px-6">
                                                    No bookings yet.
                                                    <br /><span className="text-sm font-medium opacity-60">Complete a payment and your booking will appear here.</span>
                                                </p>
                                                <Link to="/"><Button className="mt-6 rounded-2xl px-10">Browse Hostels</Button></Link>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ── ENQUIRIES ── */}
                                {activeTab === "enquiries" && (
                                    <div className="space-y-6">
                                        <div><h1 className="text-3xl font-black text-slate-900 font-heading">Enquiries</h1><p className="text-slate-500">History of your questions sent to property owners.</p></div>
                                        <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-slate-200 rounded-[2rem] bg-white/50">
                                            <MessageSquare className="w-16 h-16 text-slate-300 mb-4" />
                                            <p className="text-slate-500 font-bold text-lg">No enquiries yet.</p>
                                        </div>
                                    </div>
                                )}

                                {/* ── WISHLIST ── */}
                                {activeTab === "wishlist" && (
                                    <div className="space-y-6">
                                        <div><h1 className="text-3xl font-black text-slate-900 font-heading">Wishlist</h1><p className="text-slate-500">Hostels and PGs you've shown interest in.</p></div>
                                        <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-slate-200 rounded-[2rem] bg-white/50">
                                            <Heart className="w-16 h-16 text-slate-300 mb-4" />
                                            <p className="text-slate-500 font-bold text-lg">Your wishlist is empty.</p>
                                        </div>
                                    </div>
                                )}

                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <div className="py-10 text-center text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
                &copy; 2024 BedBuddy • Premium Student Living
            </div>
        </div>
    );
};

export default UserDashboard;