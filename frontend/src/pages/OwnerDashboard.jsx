import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Plot from "react-plotly.js";
import {
    User,
    Building2,
    CheckCircle2,
    PlusCircle,
    FileText,
    ShieldCheck,
    BarChart3,
    ArrowLeft,
    LayoutDashboard,
    Globe,
    MapPin,
    Phone,
    Mail,
    Camera,
    LogOut,
    Calendar,
    Edit,
    Bed,
    Menu,
    X,
    ChevronRight,
    Sparkles,
    Bell,
    TrendingUp,
    Star,
    Users,
    Trash2,
    MessageSquare,
    Search,
    Megaphone,
    Eye,
    MousePointerClick,
    Play,
    Pause,
    Target,
    Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/lib/api";

const OwnerDashboard = ({ user, profileData, setProfileData, handleProfileUpdate, isLoading, logout, properties = [], bookings = [], enquiries = [], refetchBookings }) => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [view, setView] = useState("home"); // home, listings, bookings, queries, analytics, profile, verify, management
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const analytics = useMemo(() => {
        const monthLabels = [];
        const monthKeys = [];

        for (let index = 5; index >= 0; index -= 1) {
            const date = new Date();
            date.setMonth(date.getMonth() - index);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            monthKeys.push(monthKey);
            monthLabels.push(date.toLocaleString("default", { month: "short" }));
        }

        const countByMonth = (items, dateField) => {
            const counts = Object.fromEntries(monthKeys.map((key) => [key, 0]));
            items.forEach((item) => {
                const rawDate = item?.[dateField];
                if (!rawDate) return;
                const parsed = new Date(rawDate);
                if (Number.isNaN(parsed.getTime())) return;
                const key = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
                if (key in counts) counts[key] += 1;
            });
            return monthKeys.map((key) => counts[key]);
        };

        const propertyByCity = properties.reduce((acc, property) => {
            const city = property?.city || "Unknown";
            acc[city] = (acc[city] || 0) + 1;
            return acc;
        }, {});

        const propertyTypes = properties.reduce((acc, property) => {
            const type = property?.type || "Unknown";
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});

        const bookingStatus = bookings.reduce((acc, booking) => {
            const status = booking?.status || "Pending";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        const propertyVerification = properties.reduce((acc, property) => {
            if (property?.is_verified === true) acc.approved += 1;
            else if (property?.is_verified === false) acc.rejected += 1;
            else acc.pending += 1;
            return acc;
        }, { approved: 0, pending: 0, rejected: 0 });

        const topCities = Object.entries(propertyByCity)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);

        const totalRevenue = bookings.reduce((sum, booking) => sum + Number(booking?.amount || 0), 0);
        const averageRating = properties.length
            ? (properties.reduce((sum, property) => sum + Number(property?.rating || 0), 0) / properties.length).toFixed(1)
            : "0.0";
        const conversionRate = properties.length
            ? ((bookings.length / Math.max(properties.length, 1)) * 100).toFixed(1)
            : "0.0";

        return {
            monthLabels,
            bookingSeries: countByMonth(bookings, "created_at"),
            enquirySeries: countByMonth(enquiries, "created_at"),
            topCities,
            propertyTypes,
            bookingStatus,
            propertyVerification,
            totalRevenue,
            averageRating,
            conversionRate,
        };
    }, [bookings, enquiries, properties]);

    // Auto-refresh bookings when accessing bookings view
    useEffect(() => {
        if (view === "bookings" && refetchBookings) {
            refetchBookings();
        }
    }, [view, refetchBookings]);

    const [verifyForm, setVerifyForm] = useState({
        pan_number: user?.pan_number || profileData?.pan_number || "",
        aadhar_number: user?.aadhar_number || profileData?.aadhar_number || "",
        bank_account: user?.bank_account || profileData?.bank_account || "",
        ifsc_code: user?.ifsc_code || profileData?.ifsc_code || ""
    });
    const [savingVerification, setSavingVerification] = useState(false);
    const [isEditingVerification, setIsEditingVerification] = useState(false);

    useEffect(() => {
        setVerifyForm({
            pan_number: profileData?.pan_number || user?.pan_number || "",
            aadhar_number: profileData?.aadhar_number || user?.aadhar_number || "",
            bank_account: profileData?.bank_account || user?.bank_account || "",
            ifsc_code: profileData?.ifsc_code || user?.ifsc_code || ""
        });
    }, [profileData, user]);

    const isVerified = Boolean(
        verifyForm.pan_number?.trim() &&
        verifyForm.aadhar_number?.trim() &&
        verifyForm.bank_account?.trim() &&
        verifyForm.ifsc_code?.trim()
    );

    const handleSaveVerification = async () => {
        const { pan_number, aadhar_number, bank_account, ifsc_code } = verifyForm;
        
        if (!pan_number?.trim() || !aadhar_number?.trim() || !bank_account?.trim() || !ifsc_code?.trim()) {
            toast({
                title: "All Fields Mandatory",
                description: "PAN Number, Aadhar Number, Bank Account, and IFSC Code are all required to complete verification.",
                variant: "destructive"
            });
            return;
        }

        setSavingVerification(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/profile/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    pan_number: pan_number.trim(),
                    aadhar_number: aadhar_number.trim(),
                    bank_account: bank_account.trim(),
                    ifsc_code: ifsc_code.trim()
                })
            });

            if (res.ok) {
                const updatedData = await res.json();
                if (setProfileData) {
                    setProfileData(updatedData);
                }
                try {
                    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
                    localStorage.setItem("user", JSON.stringify({ ...currentUser, ...updatedData }));
                } catch (e) {}

                toast({
                    title: "Verification Details Saved! 🎉",
                    description: "All details saved successfully to database. Account is now VERIFIED!",
                });
            } else {
                toast({
                    title: "Save Failed",
                    description: "Could not save details to database. Please check connection and try again.",
                    variant: "destructive"
                });
            }
        } catch (err) {
            toast({
                title: "Error",
                description: "Network error occurred while saving details.",
                variant: "destructive"
            });
        } finally {
            setSavingVerification(false);
        }
    };

    const navItems = [
        { id: "home", label: "Overview", icon: LayoutDashboard },
        { id: "listings", label: "My Properties", icon: Building2, count: properties.length },
        { id: "bookings", label: "Recent Bookings", icon: CheckCircle2, count: bookings.length },
        { id: "queries", label: "Student Queries", icon: Mail, count: enquiries.length },
        { id: "ads", label: "Promote & Ads", icon: Megaphone, badge: "New" },
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "management", label: "Management", icon: Users },
        { id: "profile", label: "Owner Profile", icon: User },
        { id: "verify", label: "Verification", icon: ShieldCheck, badge: isVerified ? "VERIFIED" : "PENDING" },
    ];

    const stats = [
        { label: "Total Properties", value: properties.length.toString(), icon: Building2, color: "text-blue-600", bg: "bg-blue-50/80" },
        { label: "Total Bookings", value: bookings.length.toString(), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50/80" },
        { label: "Student Queries", value: enquiries.length.toString(), icon: Mail, color: "text-indigo-600", bg: "bg-indigo-50/80" },
        { label: "Total Revenue", value: `₹${analytics.totalRevenue.toLocaleString("en-IN")}`, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50/80" },
    ];

    const [actionLoading, setActionLoading] = useState(null);
    const [editBookingId, setEditBookingId] = useState(null);
    const [editDate, setEditDate] = useState("");
    const [editPaymentBookingId, setEditPaymentBookingId] = useState(null);
    const [editPaymentDate, setEditPaymentDate] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isEditingStudent, setIsEditingStudent] = useState(false);
    const [editStudentForm, setEditStudentForm] = useState({ customer_name: "", customer_email: "", customer_phone: "" });
    const [isAddingStudent, setIsAddingStudent] = useState(false);
    const [addStudentForm, setAddStudentForm] = useState({ customer_name: "", customer_email: "", customer_phone: "", property_id: "", room_id: "" });
    const [searchQuery, setSearchQuery] = useState("");

    const [adsList, setAdsList] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("owner_ads_campaigns") || "[]");
        } catch {
            return [];
        }
    });
    const [isCreatingAd, setIsCreatingAd] = useState(false);
    const [adForm, setAdForm] = useState({
        propertyId: "",
        headline: "⚡ Special Offer: 15% OFF for First Month!",
        badgeText: "Sponsored • Top Featured",
        durationDays: "15",
        budget: "499"
    });

    const handleCreateAdSubmit = (e) => {
        e.preventDefault();
        if (!adForm.propertyId) {
            toast({ title: "Error", description: "Please select a property to promote.", variant: "destructive" });
            return;
        }

        const selectedProperty = properties.find(p => String(p.id) === String(adForm.propertyId));
        if (!selectedProperty) {
            toast({ title: "Error", description: "Selected property not found.", variant: "destructive" });
            return;
        }

        const newAd = {
            id: `ad-${Date.now()}`,
            propertyId: selectedProperty.id,
            propertyName: selectedProperty.name,
            location: selectedProperty.location || selectedProperty.city || "Ahmedabad",
            price: selectedProperty.price,
            originalPrice: selectedProperty.original_price || Number(selectedProperty.price) + 1500,
            rating: selectedProperty.rating || 4.8,
            reviewsCount: selectedProperty.reviews_count || 36,
            type: selectedProperty.type || "PG",
            gender: selectedProperty.gender || "Co-ed",
            image: selectedProperty.main_image || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
            headline: adForm.headline,
            badgeText: adForm.badgeText,
            durationDays: Number(adForm.durationDays),
            budget: Number(adForm.budget),
            clicks: 0,
            impressions: Math.floor(Math.random() * 80) + 140,
            status: "Active",
            createdAt: new Date().toISOString()
        };

        const updated = [newAd, ...adsList];
        setAdsList(updated);
        localStorage.setItem("owner_ads_campaigns", JSON.stringify(updated));
        setIsCreatingAd(false);
        toast({ title: "Ad Campaign Published! 🎉", description: "Your property is now live as a Sponsored Listing on the Home Page." });
    };

    const handleToggleAdStatus = (adId) => {
        const updated = adsList.map(ad => {
            if (ad.id === adId) {
                const nextStatus = ad.status === "Active" ? "Paused" : "Active";
                return { ...ad, status: nextStatus };
            }
            return ad;
        });
        setAdsList(updated);
        localStorage.setItem("owner_ads_campaigns", JSON.stringify(updated));
        toast({ title: "Ad Campaign Updated", description: "Campaign status toggled successfully." });
    };

    const handleDeleteAd = (adId) => {
        const updated = adsList.filter(ad => ad.id !== adId);
        setAdsList(updated);
        localStorage.setItem("owner_ads_campaigns", JSON.stringify(updated));
        toast({ title: "Campaign Deleted", description: "Ad campaign removed." });
    };

    const handleAddStudent = async () => {
        if (!addStudentForm.property_id || !addStudentForm.room_id) {
            toast({ title: "Error", description: "Property and Room are required.", variant: "destructive" });
            return;
        }
        setActionLoading("add-student");
        try {
            const res = await fetch(`${API_URL}/api/bookings/add_student/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(addStudentForm)
            });
            if (res.ok) {
                toast({ title: "Success", description: "Student added successfully." });
                setIsAddingStudent(false);
                setAddStudentForm({ customer_name: "", customer_email: "", customer_phone: "", property_id: "", room_id: "" });
                if (refetchBookings) refetchBookings();
            } else {
                let errorMsg = `Server returned ${res.status}`;
                try {
                    const data = await res.json();
                    if (data.error) errorMsg = data.error;
                } catch (e) {}
                toast({ title: "Error", description: errorMsg, variant: "destructive" });
            }
        } catch (err) {
            toast({ title: "Error", description: "Network error", variant: "destructive" });
        }
        setActionLoading(null);
    };

    const handleUpdateStudentProfile = async () => {
        if (!selectedStudent) return;
        setActionLoading("update-student");
        try {
            const res = await fetch(`${API_URL}/api/bookings/${selectedStudent.id}/update_student_profile/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(editStudentForm)
            });
            if (res.ok) {
                toast({ title: "Success", description: "Student profile updated successfully." });
                setSelectedStudent({ ...selectedStudent, ...editStudentForm });
                setIsEditingStudent(false);
                if (refetchBookings) refetchBookings();
            } else {
                let errorMsg = `Server returned ${res.status}`;
                try {
                    const data = await res.json();
                    if (data.error) errorMsg = data.error;
                } catch (e) {}
                toast({ title: "Error", description: errorMsg, variant: "destructive" });
            }
        } catch (err) {
            toast({ title: "Error", description: "Network error", variant: "destructive" });
        }
        setActionLoading(null);
    };

    const handleUpdateDate = async (bookingId) => {
        if (!editDate) return;
        setActionLoading(`update-${bookingId}`);
        try {
            const res = await fetch(`${API_URL}/api/bookings/${bookingId}/update_joined_date/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ created_at: editDate })
            });
            if (res.ok) {
                toast({ title: "Success", description: "Joined date updated successfully." });
                setEditBookingId(null);
                setEditDate("");
                if (refetchBookings) refetchBookings();
            } else {
                let errorMsg = `Server returned ${res.status}`;
                try {
                    const data = await res.json();
                    if (data.error) errorMsg = data.error;
                } catch (e) {}
                toast({ title: "Error", description: errorMsg, variant: "destructive" });
            }
        } catch (err) {
            toast({ title: "Error", description: "Network error", variant: "destructive" });
        }
        setActionLoading(null);
    };

    const handleUpdatePaymentDate = async (bookingId) => {
        if (!editPaymentDate) return;
        setActionLoading(`update-payment-${bookingId}`);
        try {
            const res = await fetch(`${API_URL}/api/bookings/${bookingId}/update_payment_date/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ payment_date: editPaymentDate })
            });
            if (res.ok) {
                toast({ title: "Success", description: "Payment date updated successfully." });
                setEditPaymentBookingId(null);
                setEditPaymentDate("");
                if (refetchBookings) refetchBookings();
            } else {
                let errorMsg = `Server returned ${res.status}`;
                try {
                    const data = await res.json();
                    if (data.error) errorMsg = data.error;
                } catch (e) {}
                toast({ title: "Error", description: errorMsg, variant: "destructive" });
            }
        } catch (err) {
            toast({ title: "Error", description: "Network error", variant: "destructive" });
        }
        setActionLoading(null);
    };

    const handleMarkPaid = async (booking) => {
        if (!confirm("Mark this booking as paid for the current cycle? This will advance the next due date by one month.")) return;
        
        // Advance the payment date by exactly 1 month from the current payment date
        const currentPaymentDate = new Date(booking.payment_date || booking.created_at);
        currentPaymentDate.setMonth(currentPaymentDate.getMonth() + 1);
        const newDateStr = currentPaymentDate.toISOString().split('T')[0];
        
        setActionLoading(`mark-paid-${booking.id}`);
        try {
            const res = await fetch(`${API_URL}/api/bookings/${booking.id}/update_payment_date/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ 
                    payment_date: newDateStr,
                    send_receipt: true
                })
            });
            if (res.ok) {
                toast({ title: "Success", description: "Payment marked successfully! Next due date updated." });
                if (refetchBookings) refetchBookings();
            } else {
                let errorMsg = `Server returned ${res.status}`;
                try {
                    const data = await res.json();
                    if (data.error) errorMsg = data.error;
                } catch (e) {}
                toast({ title: "Error", description: errorMsg, variant: "destructive" });
            }
        } catch (err) {
            toast({ title: "Error", description: "Network error", variant: "destructive" });
        }
        setActionLoading(null);
    };

    const handleRemoveUser = async (bookingId) => {
        if (!confirm("Are you sure you want to remove this user and cancel their booking? This will increase the available bed count.")) return;
        setActionLoading(`remove-${bookingId}`);
        try {
            const res = await fetch(`${API_URL}/api/bookings/${bookingId}/cancel/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (res.ok) {
                toast({ title: "Success", description: "User removed and booking deleted successfully." });
                if (refetchBookings) refetchBookings();
            } else {
                let errorMsg = `Server returned ${res.status}`;
                const text = await res.text();
                try {
                    const data = JSON.parse(text);
                    if (data.error) errorMsg = data.error;
                } catch (e) {
                    // Extract title from HTML if it's an HTML error
                    const match = text.match(/<title>(.*?)<\/title>/i);
                    if (match && match[1]) errorMsg = match[1];
                }
                toast({ title: "Error", description: errorMsg, variant: "destructive" });
            }
        } catch (err) {
            toast({ title: "Error", description: "Network error", variant: "destructive" });
        }
        setActionLoading(null);
    };

    const handleSendReminder = async (bookingId) => {
        setActionLoading(`remind-${bookingId}`);
        try {
            const res = await fetch(`${API_URL}/api/bookings/${bookingId}/remind_payment/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (res.ok) {
                toast({ title: "Reminder Sent", description: "Email reminder sent successfully to the user." });
            } else {
                const data = await res.json();
                toast({ title: "Error", description: data.error || "Failed to send reminder", variant: "destructive" });
            }
        } catch (err) {
            toast({ title: "Error", description: "Network error", variant: "destructive" });
        }
        setActionLoading(null);
    };

    const renderAdsSection = () => {
        const totalImpressions = adsList.reduce((acc, curr) => acc + (curr.impressions || 0), 0);
        const totalClicks = adsList.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
        const totalSpent = adsList.reduce((acc, curr) => acc + (curr.budget || 0), 0);
        const activeCount = adsList.filter(a => a.status === "Active").length;

        const selectedProp = properties.find(p => String(p.id) === String(adForm.propertyId)) || properties[0];

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-600/10 border border-amber-500/20 p-6 sm:p-8 rounded-3xl">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-amber-500 text-white font-bold text-xs uppercase px-2.5 py-0.5">
                                Google Ads Style
                            </Badge>
                            <span className="text-xs text-amber-700 font-bold">Featured Home Page Placements</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 font-heading">Promote & Ads Center</h1>
                        <p className="text-slate-500 mt-1 text-sm">Boost your property's bookings by launching sponsored ads on the Home Page.</p>
                    </div>
                    <Button 
                        onClick={() => setIsCreatingAd(true)} 
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl px-6 py-6 shadow-lg shadow-amber-500/25 flex items-center gap-2 text-base transition-transform active:scale-95"
                    >
                        <Megaphone className="w-5 h-5" />
                        Create New Ad Campaign
                    </Button>
                </div>

                {/* Ads Analytics Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <Card className="border-slate-100 shadow-sm rounded-2xl">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                                <Megaphone className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Ads</p>
                                <h3 className="text-2xl font-black text-slate-900 mt-0.5">{activeCount} / {adsList.length}</h3>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-100 shadow-sm rounded-2xl">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                                <Eye className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Impressions</p>
                                <h3 className="text-2xl font-black text-slate-900 mt-0.5">{totalImpressions.toLocaleString()}</h3>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-100 shadow-sm rounded-2xl">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                                <MousePointerClick className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Clicks</p>
                                <h3 className="text-2xl font-black text-slate-900 mt-0.5">{totalClicks.toLocaleString()}</h3>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-100 shadow-sm rounded-2xl">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ad Investment</p>
                                <h3 className="text-2xl font-black text-slate-900 mt-0.5">₹{totalSpent.toLocaleString()}</h3>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Create Ad Form Modal / Panel */}
                {isCreatingAd && (
                    <Card className="border-2 border-amber-300 bg-amber-50/30 rounded-3xl shadow-xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-amber-200">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 font-heading flex items-center gap-2">
                                    <Sparkles className="w-6 h-6 text-amber-500" />
                                    Launch Sponsored Ad Campaign
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">Configure your Google Ads style sponsored banner for your property.</p>
                            </div>
                            <Button size="icon" variant="ghost" onClick={() => setIsCreatingAd(false)} className="rounded-full">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <form onSubmit={handleCreateAdSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Form Inputs */}
                                <div className="space-y-4">
                                    <div>
                                        <Label className="font-bold text-slate-700">1. Select Property to Promote</Label>
                                        <select
                                            value={adForm.propertyId}
                                            onChange={(e) => setAdForm({ ...adForm, propertyId: e.target.value })}
                                            className="w-full mt-1.5 p-3.5 rounded-2xl bg-white border border-slate-200 font-medium text-slate-900 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                            required
                                        >
                                            <option value="">-- Select one of your properties --</option>
                                            {properties.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} ({p.type} • ₹{p.price}/mo)
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <Label className="font-bold text-slate-700">2. Ad Headline / Offer Tagline</Label>
                                        <Input
                                            value={adForm.headline}
                                            onChange={(e) => setAdForm({ ...adForm, headline: e.target.value })}
                                            placeholder="e.g. ⚡ 20% OFF First Month — Free Meals & Wi-Fi!"
                                            className="mt-1.5 p-3.5 rounded-2xl bg-white border border-slate-200 font-medium text-sm"
                                            maxLength={80}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label className="font-bold text-slate-700">3. Promotional Badge Text</Label>
                                        <select
                                            value={adForm.badgeText}
                                            onChange={(e) => setAdForm({ ...adForm, badgeText: e.target.value })}
                                            className="w-full mt-1.5 p-3.5 rounded-2xl bg-white border border-slate-200 font-medium text-slate-900 text-sm"
                                        >
                                            <option value="Sponsored • Top Featured">Sponsored • Top Featured</option>
                                            <option value="Sponsored • Recommended">Sponsored • Recommended</option>
                                            <option value="Sponsored • Hot Deal">Sponsored • Hot Deal</option>
                                            <option value="Sponsored • Best Value">Sponsored • Best Value</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="font-bold text-slate-700">Duration</Label>
                                            <select
                                                value={adForm.durationDays}
                                                onChange={(e) => {
                                                    const days = e.target.value;
                                                    const budgetMap = { "7": "299", "15": "499", "30": "899" };
                                                    setAdForm({ ...adForm, durationDays: days, budget: budgetMap[days] || "499" });
                                                }}
                                                className="w-full mt-1.5 p-3.5 rounded-2xl bg-white border border-slate-200 font-medium text-sm"
                                            >
                                                <option value="7">7 Days</option>
                                                <option value="15">15 Days</option>
                                                <option value="30">30 Days</option>
                                            </select>
                                        </div>

                                        <div>
                                            <Label className="font-bold text-slate-700">Campaign Budget</Label>
                                            <Input
                                                value={`₹${adForm.budget}`}
                                                disabled
                                                className="mt-1.5 p-3.5 rounded-2xl bg-slate-100 border border-slate-200 font-bold text-slate-900 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Live Google Ads Preview */}
                                <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                                            <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                                                <Flame className="w-4 h-4 text-amber-500" />
                                                Live Home Page Ad Preview
                                            </span>
                                            <Badge className="bg-amber-100 text-amber-800 text-[10px] font-bold">Google Ads Layout</Badge>
                                        </div>

                                        {selectedProp ? (
                                            <div className="border border-amber-200 rounded-xl p-3 bg-amber-50/20 space-y-3">
                                                <div className="flex gap-3">
                                                    <div className="w-24 h-20 rounded-lg overflow-hidden shrink-0 relative bg-slate-200">
                                                        <img
                                                            src={selectedProp.main_image || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800"}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute top-1 left-1 bg-black/80 text-amber-400 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                                                            Ad
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                                                            {adForm.badgeText}
                                                        </span>
                                                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1 mt-1">{selectedProp.name}</h4>
                                                        <p className="text-xs text-amber-800 font-medium line-clamp-2 mt-1 bg-white p-1 rounded border border-amber-200/50">
                                                            {adForm.headline}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-amber-100">
                                                    <span className="text-slate-900 text-sm">₹{selectedProp.price}/mo</span>
                                                    <Button size="sm" className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-3">
                                                        View Property
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center text-slate-400 py-8 text-sm">
                                                Select a property to see live preview
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                                        ⚡ Your ad will get instant top position placement in the **Promoted & Sponsored Listings** section on the Home Page.
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-amber-200">
                                <Button type="button" variant="outline" onClick={() => setIsCreatingAd(false)} className="rounded-xl font-bold">
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl px-8 shadow-lg shadow-amber-500/20">
                                    🚀 Publish Ad Campaign
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                {/* Campaigns List Table */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h3 className="font-heading font-black text-slate-900 text-xl">Your Property Ad Campaigns</h3>
                            <p className="text-slate-500 text-xs mt-0.5">Manage live ads, track clicks, or pause campaigns.</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Promoted Property</th>
                                    <th className="px-6 py-4 font-bold">Headline & Badge</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 font-bold text-center">Impressions</th>
                                    <th className="px-6 py-4 font-bold text-center">Clicks</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {adsList.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-medium">
                                            <Megaphone className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                                            No active ad campaigns yet. Click **"Create New Ad Campaign"** to promote your property on the Home Page!
                                        </td>
                                    </tr>
                                ) : (
                                    adsList.map((ad) => (
                                        <tr key={ad.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={ad.image || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800"}
                                                        alt={ad.propertyName}
                                                        className="w-12 h-10 rounded-lg object-cover bg-slate-100"
                                                    />
                                                    <div>
                                                        <div className="font-bold text-slate-900">{ad.propertyName}</div>
                                                        <div className="text-xs text-slate-400">₹{ad.price}/month • {ad.location}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs">
                                                <Badge className="bg-amber-100 text-amber-800 text-[10px] font-bold mb-1">
                                                    {ad.badgeText || "Sponsored"}
                                                </Badge>
                                                <div className="text-xs text-slate-700 font-medium line-clamp-1">{ad.headline}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                                    ad.status === "Active" 
                                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                                        : "bg-slate-100 text-slate-600 border border-slate-200"
                                                }`}>
                                                    <span className={`w-2 h-2 rounded-full ${ad.status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                                                    {ad.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center font-mono font-bold text-slate-700">
                                                {(ad.impressions || 150).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-center font-mono font-bold text-amber-600">
                                                {(ad.clicks || 0).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleToggleAdStatus(ad.id)}
                                                        className="p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                                        title={ad.status === "Active" ? "Pause Ad Campaign" : "Activate Ad Campaign"}
                                                    >
                                                        {ad.status === "Active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAd(ad.id)}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                        title="Delete Ad Campaign"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (view === "ads") {
            return renderAdsSection();
        }
        if (view === "management") {
            const activeBookings = bookings.filter(b => {
                if (b.status !== "Confirmed") return false;
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return (
                    (b.customer_name && b.customer_name.toLowerCase().includes(query)) ||
                    (b.customer_email && b.customer_email.toLowerCase().includes(query)) ||
                    (b.customer_phone && b.customer_phone.toLowerCase().includes(query)) ||
                    (b.property && b.property.name && b.property.name.toLowerCase().includes(query)) ||
                    (b.room && b.room.name && b.room.name.toLowerCase().includes(query))
                );
            });
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 font-heading">User Management</h1>
                            <p className="text-slate-500 mt-2">Manage your active residents, monitor payments, and free up beds.</p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input 
                                    placeholder="Search student..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 rounded-xl bg-white border-slate-200"
                                />
                            </div>
                            <Button 
                                onClick={() => setIsAddingStudent(true)} 
                                className="bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 whitespace-nowrap"
                            >
                                <PlusCircle className="w-5 h-5" />
                                Add Student
                            </Button>
                        </div>
                    </div>
                    
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Resident</th>
                                        <th className="px-6 py-4 font-bold">Property & Room</th>
                                        <th className="px-6 py-4 font-bold">Payment Schedule</th>
                                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {activeBookings.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                                No active residents found.
                                            </td>
                                        </tr>
                                    ) : activeBookings.map((booking) => {
                                        const joinedDate = new Date(booking.created_at);
                                        const paymentDate = new Date(booking.payment_date || booking.created_at);
                                        
                                        const nextPaymentDate = new Date(paymentDate);
                                        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

                                        const isOverdue = nextPaymentDate < new Date();

                                        const dateStr = joinedDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                                        const paymentDateStr = paymentDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                                        const nextDateStr = nextPaymentDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                                        
                                        return (
                                            <tr key={booking.id} className={`${isOverdue ? "bg-red-50 hover:bg-red-100" : "hover:bg-slate-50/50"} transition-colors`}>
                                                <td 
                                                    className="px-6 py-4 cursor-pointer hover:bg-slate-100/50 transition-colors"
                                                    onClick={() => {
                                                        setSelectedStudent(booking);
                                                        setEditStudentForm({
                                                            customer_name: booking.customer_name || "",
                                                            customer_email: booking.customer_email || "",
                                                            customer_phone: booking.customer_phone || ""
                                                        });
                                                        setIsEditingStudent(false);
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                            {booking.customer_name?.[0]?.toUpperCase() || "U"}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 hover:text-blue-600 transition-colors">{booking.customer_name || "Unknown"}</div>
                                                            <div className="text-xs text-slate-500">{booking.customer_email || "No email"}</div>
                                                            <div className="text-xs text-slate-500">{booking.customer_phone || "No phone"}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-slate-700">{booking.property_name}</div>
                                                    <div className="text-xs text-slate-500">Room: {booking.room_name}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-xs flex justify-between items-center">
                                                            <span className="text-slate-500">Joined:</span> 
                                                            {editBookingId === booking.id ? (
                                                                <div className="flex items-center gap-1">
                                                                    <input 
                                                                        type="date" 
                                                                        value={editDate}
                                                                        onChange={(e) => setEditDate(e.target.value)}
                                                                        className="text-xs border border-slate-300 rounded px-1 py-0.5 w-24"
                                                                    />
                                                                    <button 
                                                                        onClick={() => handleUpdateDate(booking.id)}
                                                                        disabled={actionLoading === `update-${booking.id}`}
                                                                        className="text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded hover:bg-emerald-100 disabled:opacity-50"
                                                                    >
                                                                        <CheckCircle2 className="w-3 h-3" />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => setEditBookingId(null)}
                                                                        className="text-slate-400 bg-slate-100 px-1 py-0.5 rounded hover:bg-slate-200"
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <span className="font-medium text-slate-700">{dateStr}</span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs flex justify-between items-center bg-slate-50 px-2 py-1 rounded-md">
                                                            <span className="text-slate-500">Last Paid:</span> 
                                                            {editPaymentBookingId === booking.id ? (
                                                                <div className="flex items-center gap-1">
                                                                    <input 
                                                                        type="date" 
                                                                        value={editPaymentDate}
                                                                        onChange={(e) => setEditPaymentDate(e.target.value)}
                                                                        className="text-xs border border-slate-300 rounded px-1 py-0.5 w-24"
                                                                    />
                                                                    <button 
                                                                        onClick={() => handleUpdatePaymentDate(booking.id)}
                                                                        disabled={actionLoading === `update-payment-${booking.id}`}
                                                                        className="text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded hover:bg-emerald-100 disabled:opacity-50"
                                                                    >
                                                                        <CheckCircle2 className="w-3 h-3" />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => setEditPaymentBookingId(null)}
                                                                        className="text-slate-400 bg-slate-100 px-1 py-0.5 rounded hover:bg-slate-200"
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium text-slate-700">{paymentDateStr}</span>
                                                                    <button 
                                                                        onClick={() => {
                                                                            setEditPaymentBookingId(booking.id);
                                                                            const dt = new Date(booking.payment_date || booking.created_at);
                                                                            setEditPaymentDate(dt.toISOString().split('T')[0]);
                                                                        }}
                                                                        className="text-slate-400 hover:text-amber-600 transition-colors"
                                                                        title="Edit Payment Date"
                                                                    >
                                                                        <Edit className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-blue-600 flex justify-between items-center bg-blue-50 px-2 py-1 rounded-md">
                                                            <span>Next Due:</span> 
                                                            <div className="flex items-center gap-1">
                                                                <span className="font-bold text-sm">{nextDateStr}</span>
                                                                <button 
                                                                    onClick={() => handleMarkPaid(booking)}
                                                                    disabled={actionLoading === `mark-paid-${booking.id}`}
                                                                    className="text-blue-500 hover:text-emerald-600 hover:bg-emerald-50 rounded p-1 transition-colors disabled:opacity-50"
                                                                    title="Mark as Paid (Advances date by 1 month)"
                                                                >
                                                                    <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <a 
                                                            href={`tel:${booking.customer_phone}`} 
                                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                            title="Call Resident"
                                                        >
                                                            <Phone className="w-4 h-4" />
                                                        </a>
                                                        <button 
                                                            onClick={() => {
                                                                setEditBookingId(booking.id);
                                                                // Extract YYYY-MM-DD from the booking date string
                                                                const dt = new Date(booking.created_at);
                                                                const isoDate = dt.toISOString().split('T')[0];
                                                                setEditDate(isoDate);
                                                            }}
                                                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                            title="Edit Joined Date"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleSendReminder(booking.id)}
                                                            disabled={actionLoading === `remind-${booking.id}`}
                                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Send Payment Reminder Email"
                                                        >
                                                            <Mail className="w-4 h-4" />
                                                        </button>
                                                        <div className="w-px h-6 bg-slate-200 mx-1"></div>
                                                        <button 
                                                            onClick={() => handleRemoveUser(booking.id)}
                                                            disabled={actionLoading === `remove-${booking.id}`}
                                                            className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                            Remove
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Student Profile Modal */}
                    <AnimatePresence>
                        {selectedStudent && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedStudent(null)}>
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
                                >
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                        <h2 className="text-xl font-bold text-slate-900">Student Profile</h2>
                                        <button onClick={() => setSelectedStudent(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    
                                    <div className="p-6 flex-1 overflow-y-auto">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-2xl">
                                                {selectedStudent.customer_name?.[0]?.toUpperCase() || "U"}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">{selectedStudent.customer_name || "Unknown"}</h3>
                                                <p className="text-sm text-slate-500">{selectedStudent.property_name} • {selectedStudent.room_name}</p>
                                            </div>
                                        </div>

                                        {isEditingStudent ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <Label className="text-slate-500 mb-1.5 block">Full Name</Label>
                                                    <Input 
                                                        value={editStudentForm.customer_name} 
                                                        onChange={(e) => setEditStudentForm({...editStudentForm, customer_name: e.target.value})}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-slate-500 mb-1.5 block">Email Address</Label>
                                                    <Input 
                                                        type="email"
                                                        value={editStudentForm.customer_email} 
                                                        onChange={(e) => setEditStudentForm({...editStudentForm, customer_email: e.target.value})}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-slate-500 mb-1.5 block">Phone Number</Label>
                                                    <Input 
                                                        value={editStudentForm.customer_phone} 
                                                        onChange={(e) => setEditStudentForm({...editStudentForm, customer_phone: e.target.value})}
                                                    />
                                                </div>
                                                <div className="pt-4 flex gap-3">
                                                    <Button 
                                                        variant="outline" 
                                                        className="flex-1 rounded-xl"
                                                        onClick={() => setIsEditingStudent(false)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button 
                                                        className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
                                                        onClick={handleUpdateStudentProfile}
                                                        disabled={actionLoading === "update-student"}
                                                    >
                                                        Save Changes
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50">
                                                        <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                                                        <div>
                                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</div>
                                                            <div className="font-medium text-slate-900">{selectedStudent.customer_email || "Not provided"}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50">
                                                        <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                                                        <div>
                                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</div>
                                                            <div className="font-medium text-slate-900">{selectedStudent.customer_phone || "Not provided"}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50">
                                                        <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                                                        <div>
                                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Joined Date</div>
                                                            <div className="font-medium text-slate-900">
                                                                {new Date(selectedStudent.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <Button 
                                                    className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 flex items-center gap-2"
                                                    onClick={() => setIsEditingStudent(true)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    Edit Profile Details
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Add Student Modal */}
                    <AnimatePresence>
                        {isAddingStudent && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddingStudent(false)}>
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
                                >
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                        <h2 className="text-xl font-bold text-slate-900">Add New Student</h2>
                                        <button onClick={() => setIsAddingStudent(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    
                                    <div className="p-6 flex-1 overflow-y-auto space-y-4">
                                        <div>
                                            <Label className="text-slate-500 mb-1.5 block">Full Name</Label>
                                            <Input 
                                                value={addStudentForm.customer_name} 
                                                onChange={(e) => setAddStudentForm({...addStudentForm, customer_name: e.target.value})}
                                                placeholder="Enter student's name"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-slate-500 mb-1.5 block">Email Address</Label>
                                            <Input 
                                                type="email"
                                                value={addStudentForm.customer_email} 
                                                onChange={(e) => setAddStudentForm({...addStudentForm, customer_email: e.target.value})}
                                                placeholder="Enter email address"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-slate-500 mb-1.5 block">Phone Number</Label>
                                            <Input 
                                                value={addStudentForm.customer_phone} 
                                                onChange={(e) => setAddStudentForm({...addStudentForm, customer_phone: e.target.value})}
                                                placeholder="Enter phone number"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-slate-500 mb-1.5 block">Select Property</Label>
                                            <select 
                                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={addStudentForm.property_id}
                                                onChange={(e) => setAddStudentForm({...addStudentForm, property_id: e.target.value, room_id: ""})}
                                            >
                                                <option value="">-- Select Property --</option>
                                                {properties.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {addStudentForm.property_id && (
                                            <div>
                                                <Label className="text-slate-500 mb-1.5 block">Select Room</Label>
                                                <select 
                                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    value={addStudentForm.room_id}
                                                    onChange={(e) => setAddStudentForm({...addStudentForm, room_id: e.target.value})}
                                                >
                                                    <option value="">-- Select Room --</option>
                                                    {properties.find(p => p.id === addStudentForm.property_id)?.rooms?.map(r => (
                                                        <option key={r.id} value={r.id}>{r.name} - ₹{r.price} ({r.available_beds} beds available)</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                        <div className="pt-4 flex gap-3">
                                            <Button 
                                                variant="outline" 
                                                className="flex-1 rounded-xl"
                                                onClick={() => setIsAddingStudent(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button 
                                                className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
                                                onClick={handleAddStudent}
                                                disabled={actionLoading === "add-student" || !addStudentForm.property_id || !addStudentForm.room_id}
                                            >
                                                Add Student
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            );
        }

        if (view === "analytics") {
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 font-heading">Analytics Overview</h1>
                            <p className="text-slate-500">Track property performance, demand, and booking activity in one place</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        <Card className="rounded-[28px] border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <p className="text-sm font-bold text-slate-500 mb-2">Total Revenue</p>
                                <p className="text-3xl font-black text-slate-900">₹{analytics.totalRevenue.toLocaleString("en-IN")}</p>
                                <p className="text-xs text-slate-400 mt-2">From all confirmed bookings</p>
                            </CardContent>
                        </Card>
                        <Card className="rounded-[28px] border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <p className="text-sm font-bold text-slate-500 mb-2">Average Rating</p>
                                <p className="text-3xl font-black text-slate-900">{analytics.averageRating}/5</p>
                                <p className="text-xs text-slate-400 mt-2">Across all listed properties</p>
                            </CardContent>
                        </Card>
                        <Card className="rounded-[28px] border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <p className="text-sm font-bold text-slate-500 mb-2">Booking Conversion</p>
                                <p className="text-3xl font-black text-slate-900">{analytics.conversionRate}%</p>
                                <p className="text-xs text-slate-400 mt-2">Bookings per listed property</p>
                            </CardContent>
                        </Card>
                        <Card className="rounded-[28px] border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <p className="text-sm font-bold text-slate-500 mb-2">Verification Status</p>
                                <p className="text-lg font-black text-slate-900">{analytics.propertyVerification.approved} approved</p>
                                <p className="text-xs text-slate-400 mt-2">{analytics.propertyVerification.pending} pending, {analytics.propertyVerification.rejected} rejected</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <Card className="rounded-[28px] border-slate-100 shadow-sm overflow-hidden">
                            <CardHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <CardTitle className="text-xl font-bold">Monthly Activity</CardTitle>
                                <CardDescription>Bookings versus enquiries over the last 6 months</CardDescription>
                            </CardHeader>
                            <CardContent className="p-2 sm:p-4">
                                <Plot
                                    data={[
                                        {
                                            x: analytics.monthLabels,
                                            y: analytics.bookingSeries,
                                            type: "scatter",
                                            mode: "lines+markers",
                                            name: "Bookings",
                                            line: { color: "#2563eb", width: 3 },
                                            marker: { size: 8 },
                                        },
                                        {
                                            x: analytics.monthLabels,
                                            y: analytics.enquirySeries,
                                            type: "scatter",
                                            mode: "lines+markers",
                                            name: "Enquiries",
                                            line: { color: "#7c3aed", width: 3 },
                                            marker: { size: 8 },
                                        },
                                    ]}
                                    layout={{
                                        autosize: true,
                                        height: 360,
                                        margin: { l: 40, r: 20, t: 20, b: 40 },
                                        paper_bgcolor: "transparent",
                                        plot_bgcolor: "transparent",
                                        font: { family: "Inter, sans-serif", color: "#475569" },
                                        xaxis: { gridcolor: "#e2e8f0" },
                                        yaxis: { gridcolor: "#e2e8f0", rangemode: "tozero" },
                                        legend: { orientation: "h", y: -0.2 },
                                    }}
                                    config={{ displayModeBar: false, responsive: true }}
                                    style={{ width: "100%" }}
                                />
                            </CardContent>
                        </Card>

                        <Card className="rounded-[28px] border-slate-100 shadow-sm overflow-hidden">
                            <CardHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <CardTitle className="text-xl font-bold">Properties by City</CardTitle>
                                <CardDescription>Where your listings are concentrated</CardDescription>
                            </CardHeader>
                            <CardContent className="p-2 sm:p-4">
                                <Plot
                                    data={[
                                        {
                                            x: analytics.topCities.map(([city]) => city),
                                            y: analytics.topCities.map(([, count]) => count),
                                            type: "bar",
                                            marker: { color: "#2563eb", line: { color: "#1d4ed8", width: 1 } },
                                        },
                                    ]}
                                    layout={{
                                        autosize: true,
                                        height: 360,
                                        margin: { l: 50, r: 20, t: 20, b: 60 },
                                        paper_bgcolor: "transparent",
                                        plot_bgcolor: "transparent",
                                        font: { family: "Inter, sans-serif", color: "#475569" },
                                        xaxis: { tickangle: -20, gridcolor: "#e2e8f0" },
                                        yaxis: { gridcolor: "#e2e8f0", rangemode: "tozero" },
                                    }}
                                    config={{ displayModeBar: false, responsive: true }}
                                    style={{ width: "100%" }}
                                />
                            </CardContent>
                        </Card>

                        <Card className="rounded-[28px] border-slate-100 shadow-sm overflow-hidden">
                            <CardHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <CardTitle className="text-xl font-bold">Property Types</CardTitle>
                                <CardDescription>Distribution of hostel and PG listings</CardDescription>
                            </CardHeader>
                            <CardContent className="p-2 sm:p-4">
                                <Plot
                                    data={[
                                        {
                                            values: Object.values(analytics.propertyTypes),
                                            labels: Object.keys(analytics.propertyTypes),
                                            type: "pie",
                                            hole: 0.55,
                                            marker: { colors: ["#2563eb", "#7c3aed", "#14b8a6"] },
                                            textinfo: "label+percent",
                                        },
                                    ]}
                                    layout={{
                                        autosize: true,
                                        height: 360,
                                        margin: { l: 20, r: 20, t: 20, b: 20 },
                                        paper_bgcolor: "transparent",
                                        plot_bgcolor: "transparent",
                                        font: { family: "Inter, sans-serif", color: "#475569" },
                                        showlegend: true,
                                        legend: { orientation: "h" },
                                    }}
                                    config={{ displayModeBar: false, responsive: true }}
                                    style={{ width: "100%" }}
                                />
                            </CardContent>
                        </Card>

                        <Card className="rounded-[28px] border-slate-100 shadow-sm overflow-hidden">
                            <CardHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <CardTitle className="text-xl font-bold">Booking Status</CardTitle>
                                <CardDescription>Confirmed and pending bookings</CardDescription>
                            </CardHeader>
                            <CardContent className="p-2 sm:p-4">
                                <Plot
                                    data={[
                                        {
                                            values: Object.values(analytics.bookingStatus),
                                            labels: Object.keys(analytics.bookingStatus),
                                            type: "pie",
                                            hole: 0.55,
                                            marker: { colors: ["#16a34a", "#f59e0b", "#ef4444", "#0f766e"] },
                                            textinfo: "label+percent",
                                        },
                                    ]}
                                    layout={{
                                        autosize: true,
                                        height: 360,
                                        margin: { l: 20, r: 20, t: 20, b: 20 },
                                        paper_bgcolor: "transparent",
                                        plot_bgcolor: "transparent",
                                        font: { family: "Inter, sans-serif", color: "#475569" },
                                        showlegend: true,
                                        legend: { orientation: "h" },
                                    }}
                                    config={{ displayModeBar: false, responsive: true }}
                                    style={{ width: "100%" }}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            );
        }

        if (view === "queries") {
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 font-heading">Student Queries</h1>
                        <p className="text-slate-500">Respond to students interested in your properties</p>
                    </div>

                    <div className="grid gap-6">
                        {enquiries.length > 0 ? (
                            enquiries.map((enquiry) => (
                                <Card key={enquiry.id} className="rounded-3xl border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                                                    <Mail className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-lg">{enquiry.name || "Anonymous Student"}</h3>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> Received on {new Date(enquiry.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 font-bold px-4 py-1.5 rounded-full">
                                                New Enquiry
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Property</p>
                                                <p className="font-bold text-slate-800">{enquiry.property_name}</p>
                                                {enquiry.property_image && (
                                                    <img src={enquiry.property_image} alt="" className="w-20 h-14 rounded-lg object-cover border border-slate-100" />
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Info</p>
                                                <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-blue-500" /> {enquiry.phone || "Not provided"}
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-2 rounded-xl text-blue-600 border-blue-200"
                                                    onClick={() => window.open(`tel:${enquiry.phone}`)}
                                                >
                                                    Call Now
                                                </Button>
                                            </div>
                                            <div className="col-span-full space-y-2 mt-4 pt-4 border-t border-slate-50">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Message</p>
                                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 italic text-slate-600">
                                                    "{enquiry.message}"
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Card className="rounded-[32px] border-slate-100 shadow-sm p-12 text-center">
                                <div className="w-20 h-20 rounded-[28px] bg-slate-50 flex items-center justify-center mx-auto mb-6">
                                    <Mail className="w-10 h-10 text-slate-300" />
                                </div>
                                <p className="text-xl font-bold text-slate-900 mb-2">No queries yet</p>
                                <p className="text-slate-500 font-medium max-w-sm mx-auto">
                                    When students enquire about your properties, their details will appear here.
                                </p>
                            </Card>
                        )}
                    </div>
                </div>
            );
        }

        if (view === "profile") {
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 font-heading">Complete Your Profile</h1>
                        <p className="text-slate-500">Fill in your details to increase visibility and trust</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm font-bold">
                            <span className="text-slate-700">Profile Completion</span>
                            <span className="text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded-lg">100%</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                className="h-full bg-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="lg:col-span-2 rounded-[32px] border-slate-100 shadow-sm overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                                    <User className="w-5 h-5 text-blue-600" />
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-10 border-b border-slate-100">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-[36px] bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center text-slate-300">
                                            {user?.face_photo ? (
                                                <img src={user.face_photo} alt={user.full_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-16 h-16" />
                                            )}
                                        </div>
                                        <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white border-4 border-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 shadow-lg transition-colors">
                                            <Camera className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h3 className="text-2xl font-black text-slate-900 mb-1">{user?.full_name}</h3>
                                        <p className="text-slate-500 font-bold mb-3">{user?.is_owner ? 'Property Owner' : 'Student'}</p>
                                        <Badge className="bg-blue-50 text-blue-600 border-blue-100 font-bold px-4 py-1.5 rounded-full">
                                            {user?.email}
                                        </Badge>
                                    </div>
                                </div>
                                <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-slate-700">Full Name</Label>
                                        <Input
                                            value={profileData.full_name}
                                            onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                            className="h-12 rounded-xl border-slate-200 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-slate-700">Phone Number</Label>
                                        <Input
                                            value={profileData.phone_number}
                                            onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                                            className="h-12 rounded-xl border-slate-200 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-full">
                                        <Label className="font-bold text-slate-700">Email</Label>
                                        <Input value={user?.email} disabled className="h-12 rounded-xl bg-slate-50 border-slate-200 text-slate-500" />
                                        <p className="text-[10px] text-slate-400 font-medium ml-1">Email cannot be changed</p>
                                    </div>

                                    <div className="col-span-full border-t border-slate-100 my-4" />

                                    <div className="col-span-full space-y-6">
                                        <h3 className="flex items-center gap-3 text-lg font-bold text-slate-900">
                                            <Building2 className="w-5 h-5 text-blue-600" />
                                            Business Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="font-bold text-slate-700">Business Name</Label>
                                                <Input
                                                    value={profileData.business_name}
                                                    onChange={(e) => setProfileData({ ...profileData, business_name: e.target.value })}
                                                    placeholder="Enter business name"
                                                    className="h-12 rounded-xl border-slate-200 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-slate-700">Business Type</Label>
                                                <select className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 font-medium focus:ring-blue-500">
                                                    <option>Partnership</option>
                                                    <option>Individual</option>
                                                    <option>Private Limited</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-full border-t border-slate-100 my-4" />

                                    <div className="col-span-full space-y-6">
                                        <h3 className="flex items-center gap-3 text-lg font-bold text-slate-900">
                                            <MapPin className="w-5 h-5 text-blue-600" />
                                            Address
                                        </h3>
                                        <div className="space-y-2">
                                            <Label className="font-bold text-slate-700">Full Address</Label>
                                            <textarea className="w-full h-24 rounded-xl border border-slate-200 bg-white p-4 font-medium focus:ring-blue-500" placeholder="Enter full office/business address" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <Label className="font-bold text-slate-700">City</Label>
                                                <Input className="h-12 rounded-xl border-slate-200" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-slate-700">State</Label>
                                                <Input className="h-12 rounded-xl border-slate-200" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-slate-700">PIN Code</Label>
                                                <Input className="h-12 rounded-xl border-slate-200" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-full border-t border-slate-100 my-4" />

                                    <div className="col-span-full space-y-4">
                                        <h3 className="flex items-center gap-3 text-lg font-bold text-slate-900">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                            About You
                                        </h3>
                                        <div className="space-y-2">
                                            <Label className="font-bold text-slate-700">Bio</Label>
                                            <textarea className="w-full h-32 rounded-xl border border-slate-200 bg-white p-4 font-medium focus:ring-blue-500" placeholder="Tell potential tenants about yourself and your properties..." />
                                        </div>
                                    </div>

                                    <Button type="submit" disabled={isLoading} className="col-span-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-lg font-black gap-3 shadow-xl shadow-blue-200">
                                        <CheckCircle2 className="w-6 h-6" />
                                        Save Profile
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="rounded-3xl border-orange-100 bg-orange-50/30 p-6">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                                    <Globe className="w-4 h-4 text-orange-500" />
                                    Profile Tips
                                </h3>
                                <ul className="space-y-3">
                                    {[
                                        "Complete all fields for 100% profile",
                                        "Add a professional bio",
                                        "Keep phone number updated",
                                        "Verify your account for trust badge"
                                    ].map((tip, i) => (
                                        <li key={i} className="flex gap-3 text-sm font-medium text-slate-600">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>
                    </div>
                </div>
            );
        }

        if (view === "bookings") {
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 font-heading">Recent Bookings</h1>
                            <p className="text-slate-500">Manage and view all guest bookings for your properties</p>
                        </div>
                        {refetchBookings && (
                            <Button
                                onClick={refetchBookings}
                                variant="outline"
                                size="sm"
                                className="rounded-xl gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                                Refresh
                            </Button>
                        )}
                    </div>

                    <div className="grid gap-6">
                        {bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <Card key={booking.id} className="rounded-3xl border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                                                    <User className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-lg">{booking.customer_name}</h3>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> Booked on {new Date(booking.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold px-4 py-1.5 rounded-full">
                                                {booking.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Property & Room</p>
                                                <p className="font-bold text-slate-800">{booking.property_name}</p>
                                                <p className="text-sm font-medium text-slate-500">{booking.room_name}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Info</p>
                                                <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                                    <Phone className="w-3.5 h-3.5" /> {booking.customer_phone}
                                                </p>
                                                <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                                    <Mail className="w-3.5 h-3.5" /> {booking.customer_email}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Status</p>
                                                <p className="text-sm font-bold text-blue-600">Paid ₹{booking.amount}</p>
                                                <p className="text-[10px] text-slate-400 font-mono select-all">ID: {booking.payment_id}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Card className="rounded-[32px] border-slate-100 shadow-sm p-12 text-center">
                                <div className="w-20 h-20 rounded-[28px] bg-slate-50 flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-slate-300" />
                                </div>
                                <p className="text-xl font-bold text-slate-900 mb-2">No bookings yet</p>
                                <p className="text-slate-500 font-medium max-w-sm mx-auto">
                                    New bookings will appear here as soon as guests book your properties.
                                </p>
                            </Card>
                        )}
                    </div>
                </div>
            );
        }

        if (view === "listings") {
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 font-heading">My Listed Properties</h1>
                            <p className="text-slate-500">Manage and view all your property listings</p>
                        </div>
                        <Button
                            onClick={() => navigate("/add-property")}
                            className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-lg shadow-blue-200 px-6 py-6"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Add New Property
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {properties.length > 0 ? (
                            properties.map((property) => {
                                const rooms = property.rooms || [];
                                const totalBeds = rooms.reduce((s, r) => s + (r.total_beds ?? 0), 0);
                                const bookedBeds = rooms.reduce((s, r) => s + (r.booked_beds ?? 0), 0);
                                const availableBeds = rooms.reduce((s, r) => s + (r.available_beds ?? 0), 0);

                                return (
                                <Card key={property.id} className="rounded-3xl border-slate-100 overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300">
                                    <div className="h-44 bg-slate-100 relative">
                                        {property.main_image ? (
                                            <img src={property.main_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Building2 className="w-12 h-12 text-slate-300" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <Badge className="bg-white/90 backdrop-blur-md text-blue-600 border-none font-bold">
                                                {property.type}
                                            </Badge>
                                            <Badge className={`backdrop-blur-md border-none font-bold ${
                                                property.is_verified === true ? 'bg-emerald-500/90 text-white' :
                                                property.is_verified === false ? 'bg-red-500/90 text-white' :
                                                'bg-amber-500/90 text-white'
                                            }`}>
                                                {property.is_verified === true ? '✓ Verified' : property.is_verified === false ? 'Rejected' : 'Pending'}
                                            </Badge>
                                        </div>
                                        <div className="absolute bottom-3 left-4">
                                            <h3 className="font-bold text-white text-lg drop-shadow">{property.name}</h3>
                                            <p className="text-xs text-white/80 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> {property.city}, {property.location}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="grid grid-cols-3 gap-3 mb-4">
                                            <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total</p>
                                                <p className="text-2xl font-black text-slate-800">{totalBeds}</p>
                                                <p className="text-[10px] font-bold text-slate-400">Beds</p>
                                            </div>
                                            <div className="bg-emerald-50 rounded-2xl p-3 text-center border border-emerald-100">
                                                <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">Available</p>
                                                <p className="text-2xl font-black text-emerald-700">{availableBeds}</p>
                                                <p className="text-[10px] font-bold text-emerald-400">Beds</p>
                                            </div>
                                            <div className="bg-blue-50 rounded-2xl p-3 text-center border border-blue-100">
                                                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Booked</p>
                                                <p className="text-2xl font-black text-blue-700">{bookedBeds}</p>
                                                <p className="text-[10px] font-bold text-blue-400">Beds</p>
                                            </div>
                                        </div>

                                        {rooms.length > 0 && (
                                            <div className="space-y-2 mb-4">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                    <Bed className="w-3.5 h-3.5" /> Room Types
                                                </p>
                                                <div className="space-y-1.5">
                                                    {rooms.map((room, ri) => (
                                                        <div key={ri} className="flex items-center justify-between text-xs bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                                                            <span className="font-bold text-slate-700 truncate max-w-[120px]">{room.name}</span>
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <span className="text-slate-400 font-medium">{room.total_beds ?? 0} total</span>
                                                                <span className="text-emerald-600 font-bold">{room.available_beds ?? 0} avail</span>
                                                                <span className="text-blue-600 font-bold">{room.booked_beds ?? 0} booked</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                            <span className="font-black text-blue-600 text-lg">₹{property.price}<span className="text-xs font-bold text-slate-400">/mo</span></span>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" className="text-xs font-bold text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-600" onClick={() => navigate(`/edit-property/${property.id}`)}>
                                                    <Edit className="w-3 h-3 mr-1" />
                                                    Edit
                                                </Button>
                                                <Button variant="ghost" size="sm" className="text-xs font-bold text-slate-400 hover:text-blue-600" onClick={() => navigate(`/hostel/${property.id}`)}>
                                                    View Page
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                                );
                            })
                        ) : (
                            <Card className="col-span-full rounded-[32px] border-slate-100 shadow-sm p-12 text-center">
                                <div className="w-20 h-20 rounded-[28px] bg-slate-50 flex items-center justify-center mx-auto mb-6">
                                    <Building2 className="w-10 h-10 text-slate-300" />
                                </div>
                                <p className="text-xl font-bold text-slate-900 mb-2">No properties listed yet</p>
                                <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">
                                    Start listing your properties to reach thousands of students effectively.
                                </p>
                                <Button
                                    onClick={() => navigate("/add-property")}
                                    className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-100"
                                >
                                    List Your Property
                                </Button>
                            </Card>
                        )}
                    </div>
                </div>
            );
        }

        if (view === "verify") {
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 font-heading">Get Verified</h1>
                            <p className="text-slate-500">Verify your identity to build trust with potential tenants</p>
                        </div>
                        {isVerified ? (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 px-3.5 py-1.5 text-xs font-black gap-1.5 self-start sm:self-auto uppercase tracking-wider">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                Verified Owner
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 px-3.5 py-1.5 text-xs font-black gap-1.5 self-start sm:self-auto uppercase tracking-wider">
                                <ShieldCheck className="w-4 h-4 text-amber-600" />
                                Verification Pending
                            </Badge>
                        )}
                    </div>

                    {/* Status Banner */}
                    <Card className={`rounded-[28px] overflow-hidden ${
                        isVerified 
                            ? "border-emerald-200 bg-emerald-50/60" 
                            : "border-amber-200 bg-amber-50/60"
                    }`}>
                        <CardContent className="p-6 flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm shrink-0 ${
                                isVerified 
                                    ? "bg-white text-emerald-600 shadow-emerald-200" 
                                    : "bg-white text-amber-600 shadow-amber-200"
                            }`}>
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold ${
                                    isVerified ? "text-emerald-900" : "text-amber-900"
                                }`}>
                                    {isVerified ? "Verified Account" : "Verification Incomplete"}
                                </h3>
                                <p className={`text-sm font-medium ${
                                    isVerified ? "text-emerald-700" : "text-amber-700"
                                }`}>
                                    {isVerified 
                                        ? "Your account is fully verified. All mandatory fields have been submitted and saved to the database."
                                        : "All 4 fields (PAN, Aadhar, Bank Account, IFSC) are mandatory. Fill all fields below and click Save to earn your Verified Badge."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="lg:col-span-2 rounded-[32px] border-slate-100 shadow-sm p-8 space-y-8">
                            <div className="space-y-6">
                                <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                                    Identity Verification
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-slate-700 flex items-center gap-1">
                                            PAN Number <span className="text-red-500 font-bold">*</span>
                                        </Label>
                                        <Input 
                                            value={verifyForm.pan_number}
                                            disabled={isVerified && !isEditingVerification}
                                            onChange={(e) => setVerifyForm(prev => ({ ...prev, pan_number: e.target.value }))}
                                            placeholder="e.g. BVRPS4074R" 
                                            className={`h-12 rounded-xl font-mono text-sm uppercase ${
                                                isVerified && !isEditingVerification
                                                    ? "bg-slate-50 text-slate-700 border-slate-200 cursor-not-allowed font-semibold"
                                                    : "border-slate-200"
                                            }`} 
                                        />
                                        <p className="text-[10px] font-medium text-slate-400 ml-1">10-character PAN number</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-slate-700 flex items-center gap-1">
                                            Aadhar Number <span className="text-red-500 font-bold">*</span>
                                        </Label>
                                        <Input 
                                            value={verifyForm.aadhar_number}
                                            disabled={isVerified && !isEditingVerification}
                                            onChange={(e) => setVerifyForm(prev => ({ ...prev, aadhar_number: e.target.value }))}
                                            placeholder="e.g. 224160267925" 
                                            className={`h-12 rounded-xl font-mono text-sm ${
                                                isVerified && !isEditingVerification
                                                    ? "bg-slate-50 text-slate-700 border-slate-200 cursor-not-allowed font-semibold"
                                                    : "border-slate-200"
                                            }`} 
                                        />
                                        <p className="text-[10px] font-medium text-slate-400 ml-1">12-digit Aadhar number</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-100" />

                            <div className="space-y-6">
                                <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                                    <Building2 className="w-6 h-6 text-blue-600" />
                                    Bank Details (for payouts)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-slate-700 flex items-center gap-1">
                                            Bank Account Number <span className="text-red-500 font-bold">*</span>
                                        </Label>
                                        <Input 
                                            value={verifyForm.bank_account}
                                            disabled={isVerified && !isEditingVerification}
                                            onChange={(e) => setVerifyForm(prev => ({ ...prev, bank_account: e.target.value }))}
                                            placeholder="Enter account number" 
                                            className={`h-12 rounded-xl font-mono text-sm ${
                                                isVerified && !isEditingVerification
                                                    ? "bg-slate-50 text-slate-700 border-slate-200 cursor-not-allowed font-semibold"
                                                    : "border-slate-200"
                                            }`} 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-slate-700 flex items-center gap-1">
                                            IFSC Code <span className="text-red-500 font-bold">*</span>
                                        </Label>
                                        <Input 
                                            value={verifyForm.ifsc_code}
                                            disabled={isVerified && !isEditingVerification}
                                            onChange={(e) => setVerifyForm(prev => ({ ...prev, ifsc_code: e.target.value }))}
                                            placeholder="e.g. SBIN0001234" 
                                            className={`h-12 rounded-xl uppercase font-mono text-sm ${
                                                isVerified && !isEditingVerification
                                                    ? "bg-slate-50 text-slate-700 border-slate-200 cursor-not-allowed font-semibold"
                                                    : "border-slate-200"
                                            }`} 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
                                {isVerified && !isEditingVerification ? (
                                    <Button
                                        onClick={() => setIsEditingVerification(true)}
                                        className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2 shadow-md active:scale-95 transition-all"
                                    >
                                        <Edit className="w-4 h-4 text-blue-400" />
                                        Edit Details
                                    </Button>
                                ) : (
                                    <>
                                        {isVerified && isEditingVerification && (
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsEditingVerification(false)}
                                                className="h-12 px-6 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-100"
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                        <Button
                                            onClick={async () => {
                                                await handleSaveVerification();
                                                setIsEditingVerification(false);
                                            }}
                                            disabled={savingVerification}
                                            className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            {savingVerification ? "Saving to Database..." : "Save & Update Verification"}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </Card>

                        <div className="space-y-6">
                            <Card className="rounded-[32px] border-indigo-100 bg-white p-8">
                                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                                    Benefits of Verification
                                </h3>
                                <div className="space-y-6">
                                    {[
                                        { title: "Trust Badge", desc: "Get a verified badge on your listings" },
                                        { title: "Higher Visibility", desc: "Verified listings appear higher in search" },
                                        { title: "More Bookings", desc: "Tenants prefer verified owners" },
                                        { title: "Payment Protection", desc: "Secure payment transfers" }
                                    ].map((benefit, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 leading-none mb-1">{benefit.title}</h4>
                                                <p className="text-xs text-slate-500 font-medium">{benefit.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            );
        }

        // Overview / Home View
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <Card key={i} className="rounded-[28px] border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                            <CardContent className="p-6 flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform shrink-0`}>
                                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{stat.label}</p>
                                    <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Navigation Cards */}
                <div className="space-y-4">
                    <h2 className="text-xl font-black text-slate-900 font-heading">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card
                            onClick={() => setView("listings")}
                            className="rounded-3xl border-slate-100 p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br from-white to-blue-50/30"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{properties.length} Active</span>
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-1">My Listed Properties</h3>
                            <p className="text-slate-500 text-xs font-medium">View, edit room availability and bed counts</p>
                        </Card>

                        <Card
                            onClick={() => setView("bookings")}
                            className="rounded-3xl border-slate-100 p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br from-white to-emerald-50/30"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{bookings.length} Bookings</span>
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-1">Recent Bookings</h3>
                            <p className="text-slate-500 text-xs font-medium">Check guest details and payment statuses</p>
                        </Card>

                        <Card
                            onClick={() => setView("queries")}
                            className="rounded-3xl border-slate-100 p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br from-white to-indigo-50/30"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-100/80 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{enquiries.length} Queries</span>
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-1">Student Queries</h3>
                            <p className="text-slate-500 text-xs font-medium">Direct messages and phone inquiries</p>
                        </Card>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50/50 flex">
            <Navbar />
            
            {/* Mobile Sidebar Overlay Backdrop */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Navigation */}
            <aside
                className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-in-out ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}
            >
                    <div>
                        {/* Brand Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="font-black text-slate-900 text-lg font-heading leading-none">NestNode</h2>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Owner Portal</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Owner Mini Profile Card */}
                        <div className="p-4 mx-4 my-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm overflow-hidden shrink-0">
                                {user?.face_photo ? (
                                    <img src={user.face_photo} alt={user.full_name} className="w-full h-full object-cover" />
                                ) : (
                                    user?.full_name?.[0] || "O"
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-slate-900 text-sm truncate">{user?.full_name}</p>
                                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                            </div>
                        </div>

                        {/* Navigation Items */}
                        <nav className="px-3 space-y-1">
                            {navItems.map((item) => {
                                const isActive = view === item.id;
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setView(item.id);
                                            setSidebarOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                                            isActive
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                                : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                                            <span>{item.label}</span>
                                        </div>
                                        {item.count !== undefined && (
                                            <span
                                                className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold ${
                                                    isActive
                                                        ? "bg-white/20 text-white"
                                                        : "bg-slate-100 text-slate-600"
                                                }`}
                                            >
                                                {item.count}
                                            </span>
                                        )}
                                        {item.badge && !item.count && (
                                            <span
                                                className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                                                    isActive
                                                        ? "bg-white/20 text-white"
                                                        : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                                }`}
                                            >
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Sidebar Footer / Logout */}
                    <div className="p-4 border-t border-slate-100 space-y-3">
                        <Button
                            onClick={() => navigate("/add-property")}
                            className="w-full h-11 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 font-bold gap-2 shadow-none"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Add New Property
                        </Button>
                        <Button
                            onClick={logout}
                            className="w-full h-11 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 font-bold gap-2 shadow-none"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </Button>
                    </div>
                </aside>

                {/* Main Content Workspace */}
                <div className="flex-1 flex flex-col min-w-0 pt-24">
                    {/* Mobile Menu Button */}
                    <div className="lg:hidden p-4 pb-0">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-sm flex items-center gap-2 font-bold text-sm"
                        >
                            <Menu className="w-5 h-5 text-blue-600" />
                            <span>Menu</span>
                        </button>
                    </div>

                    {/* Main Content Body */}
                    <main className="p-6 md:p-8 w-full flex-1 flex flex-col justify-between">
                        {renderContent()}
                    </main>
                </div>
        </div>
    );
};

export default OwnerDashboard;
