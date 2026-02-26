import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Calendar,
    MessageSquare,
    Heart,
    Settings,
    LogOut,
    MapPin,
    Phone,
    Mail,
    Camera,
    ChevronRight,
    ExternalLink,
    Clock,
    CheckCircle2,
    XCircle,
    Loader2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("profile");
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
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Fetch real bookings data
            const bookingsResponse = await fetch('http://localhost:8000/api/bookings/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (bookingsResponse.ok) {
                const bookingsData = await bookingsResponse.json();
                setBookings(bookingsData);
            } else {
                console.error('Failed to fetch bookings');
                setBookings([]);
            }

            // For now, keep enquiries and wishlist as empty arrays
            // These can be implemented later
            setEnquiries([]);
            setWishlist([]);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            // Set empty arrays on error
            setBookings([]);
            setEnquiries([]);
            setWishlist([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Simulate API Call
            await new Promise(resolve => setTimeout(resolve, 800));

            toast({
                title: "Profile Updated",
                description: "Your information has been saved successfully.",
                variant: "success",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "bookings", label: "Bookings", icon: Calendar },
        { id: "enquiries", label: "Enquiries", icon: MessageSquare },
        { id: "wishlist", label: "Wishlist", icon: Heart },
    ];

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Card className="w-full max-w-md p-8 text-center shadow-xl border-white/20 backdrop-blur-sm">
                    <User className="w-16 h-16 mx-auto mb-4 text-primary opacity-20" />
                    <CardTitle className="text-2xl mb-2 font-heading">Not Logged In</CardTitle>
                    <CardDescription className="mb-6">Please login to access your dashboard.</CardDescription>
                    <Button onClick={() => window.location.href = '/login'} className="w-full rounded-xl">Login Now</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />

            <div className="pt-28 pb-20 container max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center sticky top-28"
                        >
                            <div className="relative group mb-4">
                                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors">
                                    <User className="w-12 h-12" />
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-transform">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>

                            <h2 className="text-xl font-bold text-slate-900 mb-1">{user.full_name}</h2>
                            <p className="text-sm text-slate-500 font-medium mb-6">{user.email}</p>

                            <div className="w-full flex flex-col gap-1.5">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${activeTab === tab.id
                                                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                                                : "text-slate-600 hover:bg-primary/5 hover:text-primary"
                                            }`}
                                    >
                                        <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-inherit"}`} />
                                        <span className="font-semibold text-sm">{tab.label}</span>
                                        {activeTab === tab.id && (
                                            <motion.div layoutId="activeTabIndicator" className="ml-auto">
                                                <ChevronRight className="w-4 h-4" />
                                            </motion.div>
                                        )}
                                    </button>
                                ))}

                                <div className="my-4 border-t border-slate-100" />

                                <button
                                    onClick={logout}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 transition-all font-semibold text-sm"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="min-h-[600px]"
                            >
                                {/* PROFILE TAB */}
                                {activeTab === "profile" && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h1 className="text-3xl font-black text-slate-900 font-heading">Settings</h1>
                                                <p className="text-slate-500">Manage your personal information and preferences.</p>
                                            </div>
                                        </div>

                                        <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                                            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                                <CardTitle className="text-lg">Personal Information</CardTitle>
                                                <CardDescription>Keep your profile updated to help with quicker bookings.</CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-8">
                                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="fullName" className="font-bold text-slate-700 ml-1">Full Name</Label>
                                                            <div className="relative">
                                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                                <Input
                                                                    id="fullName"
                                                                    placeholder="Enter your full name"
                                                                    className="pl-11 py-6 rounded-2xl border-slate-200 focus:ring-primary/20"
                                                                    value={profileData.full_name}
                                                                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="email" className="font-bold text-slate-700 ml-1">Email Address</Label>
                                                            <div className="relative">
                                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                                <Input
                                                                    id="email"
                                                                    type="email"
                                                                    disabled
                                                                    className="pl-11 py-6 rounded-2xl bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
                                                                    value={profileData.email}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="phone" className="font-bold text-slate-700 ml-1">Phone Number</Label>
                                                            <div className="relative">
                                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                                <Input
                                                                    id="phone"
                                                                    placeholder="+91 00000 00000"
                                                                    className="pl-11 py-6 rounded-2xl border-slate-200 focus:ring-primary/20"
                                                                    value={profileData.phone_number}
                                                                    onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="font-bold text-slate-700 ml-1">Location</Label>
                                                            <div className="relative">
                                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                                <Input
                                                                    disabled
                                                                    className="pl-11 py-6 rounded-2xl bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
                                                                    value="Ahmedabad, Gujarat"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="pt-4 flex justify-end">
                                                        <Button
                                                            type="submit"
                                                            disabled={isLoading}
                                                            className="rounded-2xl px-10 py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 font-bold transition-all active:scale-95"
                                                        >
                                                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                                            Save Changes
                                                        </Button>
                                                    </div>
                                                </form>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                {/* BOOKINGS TAB */}
                                {activeTab === "bookings" && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h1 className="text-3xl font-black text-slate-900 font-heading">Your Bookings</h1>
                                                <p className="text-slate-500">Monitor your room reservations and status.</p>
                                            </div>
                                        </div>

                                        {bookings.length > 0 ? (
                                            <div className="grid gap-4">
                                                {bookings.map((booking) => (
                                                    <motion.div
                                                        key={booking.id}
                                                        whileHover={{ y: -5 }}
                                                        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6"
                                                    >
                                                        <div className="flex items-center gap-5">
                                                            <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                                                <Building2 className="w-8 h-8" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-slate-900 text-lg">{booking.property_name}</h3>
                                                                <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                                                                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {booking.date}</span>
                                                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                                    <span>{booking.room_name}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                                                            <div className="text-right">
                                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Price</p>
                                                                <p className="text-lg font-black text-slate-900">₹{booking.price}</p>
                                                            </div>
                                                            <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 ${booking.status === "Confirmed"
                                                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                                                    : "bg-amber-50 text-amber-600 border border-amber-100"
                                                                }`}>
                                                                {booking.status === "Confirmed" ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                                                {booking.status}
                                                            </div>
                                                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                                                                <ExternalLink className="w-5 h-5 text-slate-400" />
                                                            </Button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-slate-200 rounded-[2rem] bg-white/50">
                                                <Calendar className="w-16 h-16 text-slate-300 mb-4" />
                                                <p className="text-slate-500 font-bold text-lg text-center px-6">No bookings found.<br /><span className="text-sm font-medium opacity-60">Start exploring hostels to make your first booking!</span></p>
                                                <Button onClick={() => window.location.href = '/#listings'} className="mt-6 rounded-2xl px-10">Browse Hostels</Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ENQUIRIES TAB */}
                                {activeTab === "enquiries" && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h1 className="text-3xl font-black text-slate-900 font-heading">Enquiries</h1>
                                                <p className="text-slate-500">History of your questions sent to property owners.</p>
                                            </div>
                                        </div>

                                        <div className="grid gap-4">
                                            {enquiries.map((enquiry) => (
                                                <div key={enquiry.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                                <MessageSquare className="w-5 h-5" />
                                                            </div>
                                                            <h3 className="font-bold text-slate-900">{enquiry.property_name}</h3>
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {enquiry.date}</span>
                                                    </div>
                                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 text-sm leading-relaxed italic">
                                                        "{enquiry.message}"
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                            <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">{enquiry.status}</span>
                                                        </div>
                                                        <Button variant="link" className="text-primary font-bold hover:no-underline p-0 flex items-center gap-2">
                                                            View Conversation <ChevronRight className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}

                                            {enquiries.length === 0 && (
                                                <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-slate-200 rounded-[2rem] bg-white/50 text-center px-10">
                                                    <MessageSquare className="w-16 h-16 text-slate-300 mb-4" />
                                                    <p className="text-slate-500 font-bold text-lg">No enquiries yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* WISHLIST TAB */}
                                {activeTab === "wishlist" && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h1 className="text-3xl font-black text-slate-900 font-heading">Wishlist</h1>
                                                <p className="text-slate-500">Hostels and PGs you've shown interest in.</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {wishlist.map((item) => (
                                                <motion.div
                                                    key={item.id}
                                                    whileHover={{ y: -10 }}
                                                    className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-white hover:border-primary/20 transition-all"
                                                >
                                                    <div className="relative h-56 overflow-hidden">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <Button
                                                            variant="secondary"
                                                            size="icon"
                                                            className="absolute top-4 right-4 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl text-red-500 hover:bg-white hover:text-red-600"
                                                        >
                                                            <Heart className="w-5 h-5 fill-current" />
                                                        </Button>
                                                    </div>
                                                    <div className="p-8 space-y-4">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="text-xl font-black text-slate-900 mb-1">{item.name}</h3>
                                                                <p className="text-sm text-slate-500 flex items-center gap-1.5 font-medium italic"><MapPin className="w-3.5 h-3.5 text-primary" /> {item.location}</p>
                                                            </div>
                                                            <div className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl text-sm font-black flex items-center gap-1.5 border border-amber-100">
                                                                ⭐ {item.rating}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Starting at</p>
                                                                <p className="text-xl font-black text-primary">₹{item.price}<span className="text-sm text-slate-400 font-medium">/mo</span></p>
                                                            </div>
                                                            <Button className="rounded-2xl px-6 bg-slate-900 hover:bg-primary font-bold shadow-lg transition-all active:scale-95">
                                                                View Details
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}

                                            {wishlist.length === 0 && (
                                                <div className="col-span-full flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-slate-200 rounded-[2rem] bg-white/50 text-center px-10">
                                                    <Heart className="w-16 h-16 text-slate-300 mb-4" />
                                                    <p className="text-slate-500 font-bold text-lg">Your wishlist is empty.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Footer space or small copyright */}
            <div className="py-10 text-center text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
                &copy; 2024 BedBuddy • Premium Student Living
            </div>
        </div>
    );
};

// Internal icon component for Building
const Building2 = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
        <path d="M10 6h4" />
        <path d="M10 10h4" />
        <path d="M10 14h4" />
        <path d="M10 18h4" />
    </svg>
);

export default UserDashboard;
