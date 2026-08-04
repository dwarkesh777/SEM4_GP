import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import BookingHistory from "@/components/BookingHistory";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "@/lib/api";
import OwnerDashboard from "./OwnerDashboard";
import {
    User,
    Calendar,
    MessageSquare,
    LogOut,
    Camera,
    CheckCircle2,
    Loader2,
    Building2,
    MapPin,
    Star,
    History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || "profile");
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const startCamera = async () => {
        setShowCamera(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            toast({ title: "Camera Error", description: "Could not access camera.", variant: "destructive" });
            setShowCamera(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        setShowCamera(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const imageSrc = canvasRef.current.toDataURL('image/jpeg', 0.8);
            setProfileData({ ...profileData, face_photo: imageSrc });
            stopCamera();
        }
    };

    // Redirect developers to their own dashboard
    useEffect(() => {
        if (localStorage.getItem("userRole") === "developer") {
            navigate("/developer/dashboard", { replace: true });
        }
    }, [navigate]);

    // Profile State
    const [profileData, setProfileData] = useState({
        full_name: user?.full_name || "",
        email: user?.email || "",
        phone_number: user?.phone_number || "",
        business_name: user?.business_name || "",
        face_photo: user?.face_photo || "",
    });

    // Mock/Fetch Data States - keeping for enquiries
    const [enquiries, setEnquiries] = useState([]);
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
                business_name: user.business_name || "",
                face_photo: user.face_photo || "",
            });
            // Only fetch enquiries and properties - bookings handled by React Query
            fetchOtherData();
        }
    }, [user]);

    const fetchOtherData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const headers = { 'Authorization': `Bearer ${token}` };

                if (user?.is_owner) {
                    const [propertiesRes, enquiriesRes] = await Promise.all([
                        fetch(`${API_URL}/api/properties/?owner_id=${user.id}`, { headers }),
                        fetch(`${API_URL}/api/enquiries/`, { headers })
                    ]);

                    if (propertiesRes.ok) setProperties(await propertiesRes.json());
                    if (enquiriesRes.ok) setEnquiries(await enquiriesRes.json());
                } else {
                    const enquiriesRes = await fetch(`${API_URL}/api/enquiries/`, { headers });
                    if (enquiriesRes.ok) setEnquiries(await enquiriesRes.json());
                }
            }
        } catch (error) {
            console.error("Error fetching other data:", error);
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
                setIsEditing(false);
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
    ].filter(tab => !user?.is_owner || tab.id === "profile");

    // Booking History State
    const [showBookingHistory, setShowBookingHistory] = useState(false);

    // Fetch booking data - consolidated method
    const { data: bookingData = [], isLoading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = useQuery({
        queryKey: ['user-bookings'],
        queryFn: async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                return [];
            }

            try {
                const response = await fetch(`${API_URL}/api/bookings/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.');
                }

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch bookings: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                const bookings = data.results || data;

                return bookings;
            } catch (error) {
                throw error;
            }
        },
        enabled: !!user && !!localStorage.getItem('token'),
        retry: (failureCount, error) => {
            // Don't retry on authentication errors
            if (error.message?.includes('Authentication failed')) {
                return false;
            }
            return failureCount < 2;
        },
        retryDelay: 1000,
    });

    if (user?.is_owner) {
        return (
            <OwnerDashboard
                user={user}
                profileData={profileData}
                setProfileData={setProfileData}
                handleProfileUpdate={handleProfileUpdate}
                isLoading={isLoading}
                logout={logout}
                properties={properties}
                bookings={bookingData}
                enquiries={enquiries}
                refetchBookings={refetchBookings}
            />
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden">
            {/* Sidebar (Fixed on left) */}
            <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-slate-200 z-20">
                {/* Brand / Logo Area */}
                <div className="h-20 flex items-center px-8 border-b border-slate-100">
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">N</div>
                        <span className="font-heading font-black text-xl text-slate-900 tracking-tight">NestNode</span>
                    </Link>
                </div>

                {/* Navigation Menu */}
                <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 relative group overflow-hidden ${
                                activeTab === tab.id
                                    ? "text-blue-700 bg-blue-50/50"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                        >
                            {activeTab === tab.id && (
                                <motion.div 
                                    layoutId="activeTabIndicator" 
                                    className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <tab.icon className={`w-5 h-5 transition-colors ${activeTab === tab.id ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Profile Widget at Bottom */}
                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold overflow-hidden">
                                {profileData.face_photo ? (
                                    <img src={profileData.face_photo} alt={user?.full_name} className="w-full h-full object-cover" />
                                ) : (
                                    user?.full_name?.charAt(0) || <User className="w-5 h-5" />
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{user?.full_name}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 mt-3 p-3 text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Top Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 z-10 sticky top-0">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 font-heading capitalize">
                            {activeTab}
                        </h1>
                        <p className="text-sm text-slate-500 font-medium hidden sm:block">Manage your {activeTab} effortlessly</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Button variant="outline" className="hidden sm:flex gap-2 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50" onClick={() => navigate("/")}>
                            <MapPin className="w-4 h-4" />
                            Explore Properties
                        </Button>
                        <Button variant="outline" className="flex sm:hidden gap-2 rounded-xl text-red-500 border-red-200 hover:bg-red-50" onClick={logout}>
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </Button>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50 relative">
                    <div className="max-w-5xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                {activeTab === "profile" && (
                                    <div className="space-y-8">

                                        <Card className="rounded-[32px] border-slate-200 shadow-sm overflow-hidden bg-white">
                                            <div className="bg-slate-50 p-8 border-b border-slate-100">
                                                <div className="flex items-center gap-6">
                                                    <div className="relative group">
                                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg overflow-hidden">
                                                            {profileData.face_photo ? (
                                                                <img src={profileData.face_photo} alt={user?.full_name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <User className="w-10 h-10" />
                                                            )}
                                                        </div>
                                                        <button 
                                                            type="button"
                                                            onClick={startCamera}
                                                            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 shadow-md transition-colors hover:scale-110"
                                                        >
                                                            <Camera className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h2 className="text-2xl font-bold text-slate-900">{user?.full_name}</h2>
                                                        <p className="text-slate-500">Update your photo and personal details.</p>
                                                    </div>
                                                    <Button 
                                                        variant="outline" 
                                                        onClick={() => setIsEditing(!isEditing)}
                                                        className="ml-auto bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl"
                                                    >
                                                        {isEditing ? "Cancel" : "Edit Profile"}
                                                    </Button>
                                                </div>
                                            </div>
                                            <CardContent className="p-8">
                                                <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label className="font-bold text-slate-700">Full Name</Label>
                                                        <Input
                                                            value={profileData.full_name}
                                                            onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                                            disabled={!isEditing}
                                                            className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="font-bold text-slate-700">Email Address</Label>
                                                        <Input
                                                            value={profileData.email}
                                                            disabled
                                                            className="h-12 rounded-xl bg-slate-100 border-transparent text-slate-500 cursor-not-allowed"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="font-bold text-slate-700">Phone Number</Label>
                                                        <Input
                                                            value={profileData.phone_number}
                                                            onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                                                            disabled={!isEditing}
                                                            className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
                                                        />
                                                    </div>
                                                    {isEditing && (
                                                        <div className="col-span-full pt-4">
                                                            <Button
                                                                type="submit"
                                                                disabled={isLoading}
                                                                className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
                                                            >
                                                                {isLoading ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                                        <span>Saving Changes...</span>
                                                                    </div>
                                                                ) : (
                                                                    "Save Changes"
                                                                )}
                                                            </Button>
                                                        </div>
                                                    )}
                                                </form>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                {activeTab === "bookings" && (
                                    <div className="space-y-6">
                                        <div className="flex justify-end gap-3 mb-6">
                                            <Button
                                                onClick={() => setShowBookingHistory(true)}
                                                className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm font-bold gap-2 rounded-xl h-11"
                                            >
                                                <History className="w-4 h-4" /> History
                                            </Button>
                                            <Button
                                                onClick={() => refetchBookings()}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-200 rounded-xl h-11 px-6"
                                            >
                                                Refresh Data
                                            </Button>
                                        </div>

                                        {bookingsLoading ? (
                                            <div className="flex items-center justify-center py-20">
                                                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                                            </div>
                                        ) : bookingsError ? (
                                            <Card className="rounded-[32px] border-red-200 bg-red-50 p-12 text-center">
                                                <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4 text-red-500">
                                                    <Calendar className="w-8 h-8" />
                                                </div>
                                                <p className="text-xl font-bold text-red-900 mb-2">Error Loading Bookings</p>
                                                <p className="text-red-700 mb-6">{bookingsError.message}</p>
                                                <Button onClick={() => refetchBookings()} className="bg-red-600 hover:bg-red-700 text-white rounded-xl">Try Again</Button>
                                            </Card>
                                        ) : bookingData.length > 0 ? (
                                            <div className="grid gap-4">
                                                {bookingData.map((booking) => (
                                                    <motion.div 
                                                        key={booking.id} 
                                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                    >
                                                        <Card className="rounded-[24px] border-slate-200 p-6 bg-white hover:shadow-md transition-shadow">
                                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border border-blue-100">
                                                                        <Building2 className="w-7 h-7 text-blue-600" />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-bold text-lg text-slate-900">{booking.property_name}</h3>
                                                                        <p className="text-sm font-medium text-slate-500">
                                                                            {booking.room_name} • {new Date(booking.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                        </p>
                                                                        {booking.property_location && (
                                                                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
                                                                                <MapPin className="w-3 h-3" />
                                                                                {booking.property_location}, {booking.property_city}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                                                                    <div className="text-right">
                                                                        <div className="text-xl font-black text-slate-900">
                                                                            ₹{booking.amount?.toLocaleString('en-IN') || 'N/A'}
                                                                        </div>
                                                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Per Month</div>
                                                                    </div>
                                                                    <Badge
                                                                        className={`rounded-full px-3 py-1 font-bold ${
                                                                            booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                                                                            booking.status === 'Pending' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                                                                            'bg-red-100 text-red-700 border-red-200'
                                                                        }`}
                                                                    >
                                                                        {booking.status}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : (
                                            <Card className="rounded-[32px] border-slate-200 shadow-sm p-16 text-center bg-white">
                                                <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6 text-slate-300">
                                                    <Calendar className="w-12 h-12" />
                                                </div>
                                                <p className="text-2xl font-bold text-slate-900 mb-3">No bookings yet</p>
                                                <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
                                                    Looks like you haven't booked any accommodations. Start exploring our premium properties!
                                                </p>
                                                <Button onClick={() => navigate("/")} className="h-14 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200">
                                                    Explore Properties
                                                </Button>
                                            </Card>
                                        )}
                                    </div>
                                )}

                                {activeTab === "enquiries" && (
                                    <div className="space-y-6">
                                        {enquiries.length > 0 ? (
                                            <div className="grid gap-4">
                                                {enquiries.map((enquiry) => (
                                                    <motion.div key={enquiry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                                        <Card className="rounded-[24px] border-slate-200 p-6 bg-white hover:shadow-md transition-shadow relative overflow-hidden group">
                                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-24px opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            <div className="flex items-start justify-between mb-3">
                                                                <h3 className="font-bold text-lg text-slate-900">{enquiry.property_name}</h3>
                                                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                                                    {new Date(enquiry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                                </span>
                                                            </div>
                                                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                                                <p className="text-sm font-medium text-slate-700 italic">"{enquiry.message}"</p>
                                                            </div>
                                                        </Card>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : (
                                            <Card className="rounded-[32px] border-slate-200 shadow-sm p-16 text-center bg-white">
                                                <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6 text-slate-300">
                                                    <MessageSquare className="w-12 h-12" />
                                                </div>
                                                <p className="text-2xl font-bold text-slate-900 mb-3">No enquiries yet</p>
                                                <p className="text-slate-500 font-medium max-w-md mx-auto">
                                                    When you reach out to property owners, your messages and their replies will appear here.
                                                </p>
                                            </Card>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* Booking History Modal */}
            <BookingHistory
                isOpen={showBookingHistory}
                onClose={() => setShowBookingHistory(false)}
            />

            {/* Camera Modal */}
            <AnimatePresence>
                {showCamera && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-[32px] p-8 max-w-lg w-full flex flex-col items-center shadow-2xl"
                        >
                            <h3 className="text-2xl font-black text-slate-900 mb-6 font-heading">Take Profile Photo</h3>
                            <div className="relative rounded-[24px] overflow-hidden bg-slate-900 w-full aspect-square flex items-center justify-center mb-8 shadow-inner">
                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                                <canvas ref={canvasRef} className="hidden" />
                            </div>
                            <div className="flex gap-4 w-full">
                                <Button variant="outline" className="flex-1 h-14 rounded-2xl border-slate-200 font-bold" onClick={stopCamera}>Cancel</Button>
                                <Button className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-200" onClick={capturePhoto}>
                                    <Camera className="w-5 h-5 mr-2" />
                                    Capture
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserDashboard;
