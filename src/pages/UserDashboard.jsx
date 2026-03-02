import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "@/lib/api";
import OwnerDashboard from "./OwnerDashboard";
import {
    User,
    Calendar,
    MessageSquare,
    Heart,
    LogOut,
    Camera,
    CheckCircle2,
    Loader2,
    Building2,
    MapPin,
    Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || "profile");
    const [isLoading, setIsLoading] = useState(false);

    // Profile State
    const [profileData, setProfileData] = useState({
        full_name: user?.full_name || "",
        email: user?.email || "",
        phone_number: user?.phone_number || "",
    });

    // Mock/Fetch Data States
    const [bookings, setBookings] = useState([]);
    const [enquiries, setEnquiries] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    useEffect(() => {
        if (user) {
            setProfileData({
                full_name: user.full_name,
                email: user.email,
                phone_number: user.phone_number || "",
            });
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const headers = { 'Authorization': `Bearer ${token}` };

                if (user?.is_owner) {
                    const [propertiesRes, bookingsRes, enquiriesRes] = await Promise.all([
                        fetch(`${API_URL}/api/properties/?owner_id=${user.id}`, { headers }),
                        fetch(`${API_URL}/api/bookings/`, { headers }),
                        fetch(`${API_URL}/api/enquiries/`, { headers })
                    ]);

                    if (propertiesRes.ok) setProperties(await propertiesRes.json());
                    if (bookingsRes.ok) setBookings(await bookingsRes.json());
                    if (enquiriesRes.ok) setEnquiries(await enquiriesRes.json());
                } else {
                    const [bookingsRes, enquiriesRes, wishlistRes] = await Promise.all([
                        fetch(`${API_URL}/api/bookings/`, { headers }),
                        fetch(`${API_URL}/api/enquiries/`, { headers }),
                        fetch(`${API_URL}/api/wishlist/`, { headers })
                    ]);

                    if (bookingsRes.ok) setBookings(await bookingsRes.json());
                    if (enquiriesRes.ok) setEnquiries(await enquiriesRes.json());
                    if (wishlistRes.ok) setWishlist(await wishlistRes.json());
                }
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/auth/profile/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });
            if (res.ok) {
                toast({ title: "Profile Updated", description: "Your changes have been saved." });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "bookings", label: "Bookings", icon: Calendar },
        { id: "enquiries", label: "Enquiries", icon: MessageSquare },
        { id: "wishlist", label: "Wishlist", icon: Heart },
    ].filter(tab => !user?.is_owner || tab.id === "profile");

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
                {user?.is_owner ? (
                    <OwnerDashboard
                        user={user}
                        handleProfileUpdate={handleProfileUpdate}
                        isLoading={isLoading}
                        logout={logout}
                        properties={properties}
                        bookings={bookings}
                        enquiries={enquiries}
                    />
                ) : (
                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Sidebar */}
                        <aside className="w-full lg:w-80 space-y-6">
                            <Card className="rounded-[40px] border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                                <CardContent className="p-8">
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className="relative group">
                                            <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform duration-500">
                                                <User className="w-12 h-12" />
                                            </div>
                                            <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white border-4 border-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 shadow-lg transition-colors">
                                                <Camera className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-slate-900 font-heading">{user?.full_name}</h2>
                                            <p className="text-sm font-medium text-slate-500 truncate max-w-[200px]">{user?.email}</p>
                                        </div>
                                    </div>

                                    <div className="mt-10 space-y-2">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${activeTab === tab.id
                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1"
                                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                                    }`}
                                            >
                                                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-slate-400"}`} />
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-slate-100">
                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-orange-500 hover:bg-orange-50 transition-all duration-300"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Sign Out
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Verification Card */}
                            <Card className="rounded-[32px] border-emerald-100 bg-emerald-50/30 p-8 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <span className="font-bold text-emerald-900">Verified User</span>
                                </div>
                                <p className="text-xs font-medium text-emerald-700 leading-relaxed">
                                    Your account is verified. You get faster support and better trust badges on your reviews.
                                </p>
                            </Card>
                        </aside>

                        {/* Content Area */}
                        <div className="flex-1 min-w-0">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {activeTab === "profile" && (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h1 className="text-3xl font-black text-slate-900 font-heading">Settings</h1>
                                                    <p className="text-slate-500">Manage your personal information and preferences.</p>
                                                </div>
                                            </div>

                                            <Card className="rounded-[40px] border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                                                <CardHeader className="bg-slate-50/30 p-8 border-b border-slate-100">
                                                    <CardTitle className="font-bold text-xl">Personal Information</CardTitle>
                                                    <CardDescription className="font-medium text-slate-500">Update your account detail and public profile.</CardDescription>
                                                </CardHeader>
                                                <CardContent className="p-8">
                                                    <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div className="space-y-3">
                                                            <Label className="font-bold text-slate-700 ml-1">Full Name</Label>
                                                            <Input
                                                                value={profileData.full_name}
                                                                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                                                className="h-14 rounded-2xl border-slate-200 bg-white shadow-sm focus:ring-blue-500 font-medium"
                                                            />
                                                        </div>
                                                        <div className="space-y-3">
                                                            <Label className="font-bold text-slate-700 ml-1">Email Address</Label>
                                                            <Input
                                                                value={profileData.email}
                                                                disabled
                                                                className="h-14 rounded-2xl bg-slate-50 border-slate-200 text-slate-500 font-medium cursor-not-allowed"
                                                            />
                                                        </div>
                                                        <div className="space-y-3">
                                                            <Label className="font-bold text-slate-700 ml-1">Phone Number</Label>
                                                            <Input
                                                                value={profileData.phone_number}
                                                                onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                                                                className="h-14 rounded-2xl border-slate-200 bg-white shadow-sm focus:ring-blue-500 font-medium"
                                                            />
                                                        </div>
                                                        <div className="col-span-full pt-6">
                                                            <Button
                                                                type="submit"
                                                                disabled={isLoading}
                                                                className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
                                                            >
                                                                {isLoading ? (
                                                                    <div className="flex items-center gap-3">
                                                                        <Loader2 className="w-6 h-6 animate-spin" />
                                                                        <span>Saving...</span>
                                                                    </div>
                                                                ) : (
                                                                    "Save Profile"
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </form>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    )}

                                    {activeTab === "bookings" && (
                                        <div className="space-y-6">
                                            <h2 className="text-3xl font-black text-slate-900 font-heading">My Bookings</h2>
                                            {bookings.length > 0 ? (
                                                <div className="grid gap-4">
                                                    {bookings.map((booking) => (
                                                        <Card key={booking.id} className="rounded-3xl border-slate-100 p-6 flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                                                    <Building2 className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-bold text-slate-900">{booking.property_name}</h3>
                                                                    <p className="text-xs text-slate-500">{new Date(booking.created_at).toLocaleDateString()}</p>
                                                                </div>
                                                            </div>
                                                            <Badge variant={booking.status === "confirmed" ? "success" : "secondary"}>
                                                                {booking.status}
                                                            </Badge>
                                                        </Card>
                                                    ))}
                                                </div>
                                            ) : (
                                                <Card className="rounded-[40px] border-slate-100 shadow-xl shadow-slate-200/50 p-12 text-center">
                                                    <div className="w-20 h-20 rounded-[32px] bg-slate-50 flex items-center justify-center mx-auto mb-6">
                                                        <Calendar className="w-10 h-10 text-slate-300" />
                                                    </div>
                                                    <p className="text-xl font-bold text-slate-900 mb-2">No bookings yet</p>
                                                    <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">
                                                        Start exploring properties and secure your stay at the best hostels and PGs.
                                                    </p>
                                                    <Button
                                                        onClick={() => navigate("/")}
                                                        className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-100"
                                                    >
                                                        Explore Properties
                                                    </Button>
                                                </Card>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === "enquiries" && (
                                        <div className="space-y-6">
                                            <h2 className="text-3xl font-black text-slate-900 font-heading">My Enquiries</h2>
                                            {enquiries.length > 0 ? (
                                                <div className="grid gap-4">
                                                    {enquiries.map((enquiry) => (
                                                        <Card key={enquiry.id} className="rounded-3xl border-slate-100 p-6">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <h3 className="font-bold text-slate-900">{enquiry.property_name}</h3>
                                                                <p className="text-xs text-slate-400">{new Date(enquiry.created_at).toLocaleDateString()}</p>
                                                            </div>
                                                            <p className="text-sm text-slate-600 italic">"{enquiry.message}"</p>
                                                        </Card>
                                                    ))}
                                                </div>
                                            ) : (
                                                <Card className="rounded-[40px] border-slate-100 shadow-xl shadow-slate-200/50 p-12 text-center">
                                                    <div className="w-20 h-20 rounded-[32px] bg-slate-50 flex items-center justify-center mx-auto mb-6">
                                                        <MessageSquare className="w-10 h-10 text-slate-300" />
                                                    </div>
                                                    <p className="text-xl font-bold text-slate-900 mb-2">No enquiries yet</p>
                                                    <p className="text-slate-500 font-medium max-w-sm mx-auto">
                                                        When you ask about a property, your message history will appear here.
                                                    </p>
                                                </Card>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === "wishlist" && (
                                        <div className="space-y-6">
                                            <h2 className="text-3xl font-black text-slate-900 font-heading">My Wishlist</h2>
                                            {wishlist.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {wishlist.map((item) => (
                                                        <Card key={item.id} className="rounded-3xl border-slate-100 overflow-hidden group">
                                                            <div className="h-40 bg-slate-100 relative">
                                                                <img src={item.property_details?.main_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                            </div>
                                                            <div className="p-4">
                                                                <h3 className="font-bold text-slate-900 truncate">{item.property_details?.name}</h3>
                                                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                                                    <MapPin className="w-3 h-3" /> {item.property_details?.location}
                                                                </p>
                                                            </div>
                                                        </Card>
                                                    ))}
                                                </div>
                                            ) : (
                                                <Card className="rounded-[40px] border-slate-100 shadow-xl shadow-slate-200/50 p-12 text-center">
                                                    <div className="w-20 h-20 rounded-[32px] bg-slate-50 flex items-center justify-center mx-auto mb-6">
                                                        <Heart className="w-10 h-10 text-slate-300" />
                                                    </div>
                                                    <p className="text-xl font-bold text-slate-900 mb-2">Your wishlist is empty</p>
                                                    <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">
                                                        Save your favorite properties to easily find them later and compare features.
                                                    </p>
                                                    <Button
                                                        onClick={() => navigate("/")}
                                                        className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-100"
                                                    >
                                                        Find Properties
                                                    </Button>
                                                </Card>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </main>

            <div className="py-10 text-center text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
                &copy; 2024 BedBuddy • Premium Student Living
            </div>
        </div>
    );
};

export default UserDashboard;
