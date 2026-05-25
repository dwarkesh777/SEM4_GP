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
    Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = ({ user, profileData, setProfileData, handleProfileUpdate, isLoading, logout, properties = [], bookings = [], enquiries = [], refetchBookings }) => {
    const navigate = useNavigate();
    const [view, setView] = useState("home"); // home, profile, verify, analytics

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

    const stats = [
        { label: "Total Properties", value: properties.length.toString(), icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Total Queries", value: enquiries.length.toString(), icon: Mail, color: "text-indigo-600", bg: "bg-indigo-50" },
    ];

    const quickActions = [
        { id: "add", label: "Add New Property", icon: PlusCircle, color: "bg-blue-600", textColor: "text-white", action: () => navigate("/add-property") },
        { id: "listings", label: `Listed Property (${properties.length})`, icon: Building2, color: "bg-white", textColor: "text-blue-600", border: "border-blue-200", action: () => setView("listings") },
        { id: "bookings", label: `Recent Booking (${bookings.length})`, icon: CheckCircle2, color: "bg-white", textColor: "text-blue-600", border: "border-blue-200", action: () => setView("bookings") },
        { id: "queries", label: `Recent Query (${enquiries.length})`, icon: Mail, color: "bg-white", textColor: "text-blue-600", border: "border-blue-200", action: () => setView("queries") },
        { id: "profile", label: "Complete Profile", icon: FileText, color: "bg-white", textColor: "text-blue-600", border: "border-blue-200", action: () => setView("profile") },
        { id: "verify", label: "Get Verified", icon: ShieldCheck, color: "bg-white", textColor: "text-blue-600", border: "border-blue-200", action: () => setView("verify") },
        { id: "analytics", label: "View Analytics", icon: BarChart3, color: "bg-white", textColor: "text-blue-600", border: "border-blue-200", action: () => setView("analytics") },
        { id: "logout", label: "Sign Out", icon: LogOut, color: "bg-orange-50", textColor: "text-orange-600", border: "border-orange-100", action: logout },
    ];

    if (view === "analytics") {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 font-heading">Analytics Overview</h1>
                        <p className="text-slate-500">Track property performance, demand, and booking activity in one place</p>
                    </div>
                    <Button variant="outline" onClick={() => setView("home")} className="rounded-xl gap-2 border-blue-200 text-blue-600 hover:bg-blue-50">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <Card className="rounded-[32px] border-slate-100 shadow-lg shadow-slate-100/50">
                        <CardContent className="p-8">
                            <p className="text-sm font-bold text-slate-500 mb-2">Total Revenue</p>
                            <p className="text-3xl font-black text-slate-900">₹{analytics.totalRevenue.toLocaleString("en-IN")}</p>
                            <p className="text-xs text-slate-400 mt-2">From all confirmed bookings</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-[32px] border-slate-100 shadow-lg shadow-slate-100/50">
                        <CardContent className="p-8">
                            <p className="text-sm font-bold text-slate-500 mb-2">Average Rating</p>
                            <p className="text-3xl font-black text-slate-900">{analytics.averageRating}/5</p>
                            <p className="text-xs text-slate-400 mt-2">Across all listed properties</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-[32px] border-slate-100 shadow-lg shadow-slate-100/50">
                        <CardContent className="p-8">
                            <p className="text-sm font-bold text-slate-500 mb-2">Booking Conversion</p>
                            <p className="text-3xl font-black text-slate-900">{analytics.conversionRate}%</p>
                            <p className="text-xs text-slate-400 mt-2">Bookings per listed property</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-[32px] border-slate-100 shadow-lg shadow-slate-100/50">
                        <CardContent className="p-8">
                            <p className="text-sm font-bold text-slate-500 mb-2">Verification Status</p>
                            <p className="text-lg font-black text-slate-900">{analytics.propertyVerification.approved} approved</p>
                            <p className="text-xs text-slate-400 mt-2">{analytics.propertyVerification.pending} pending, {analytics.propertyVerification.rejected} rejected</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <Card className="rounded-[32px] border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
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

                    <Card className="rounded-[32px] border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
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

                    <Card className="rounded-[32px] border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
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

                    <Card className="rounded-[32px] border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 font-heading">Student Queries</h1>
                        <p className="text-slate-500">Respond to students interested in your properties</p>
                    </div>
                    <Button variant="outline" onClick={() => setView("home")} className="rounded-xl gap-2 border-blue-200 text-blue-600 hover:bg-blue-50">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Button>
                </div>

                <div className="grid gap-6">
                    {enquiries.length > 0 ? (
                        enquiries.map((enquiry) => (
                            <Card key={enquiry.id} className="rounded-3xl border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
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
                        <Card className="rounded-[40px] border-slate-100 shadow-xl shadow-slate-200/50 p-12 text-center">
                            <div className="w-20 h-20 rounded-[32px] bg-slate-50 flex items-center justify-center mx-auto mb-6">
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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 font-heading">Complete Your Profile</h1>
                        <p className="text-slate-500">Fill in your details to increase visibility and trust</p>
                    </div>
                    <Button variant="outline" onClick={() => setView("home")} className="rounded-xl gap-2 border-blue-200 text-blue-600 hover:bg-blue-50">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Button>
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
                    <Card className="lg:col-span-2 rounded-[32px] border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                            <CardTitle className="flex items-center gap-3 text-xl font-bold">
                                <User className="w-5 h-5 text-blue-600" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-10 border-b border-slate-100">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-[40px] bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center text-slate-300">
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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 font-heading">Recent Bookings</h1>
                        <p className="text-slate-500">Manage and view all guest bookings for your properties</p>
                    </div>
                    <div className="flex gap-2">
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
                        <Button variant="outline" onClick={() => setView("home")} className="rounded-xl gap-2 border-blue-200 text-blue-600 hover:bg-blue-50">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6">
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <Card key={booking.id} className="rounded-3xl border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
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
                        <Card className="rounded-[40px] border-slate-100 shadow-xl shadow-slate-200/50 p-12 text-center">
                            <div className="w-20 h-20 rounded-[32px] bg-slate-50 flex items-center justify-center mx-auto mb-6">
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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 font-heading">My Listed Properties</h1>
                        <p className="text-slate-500">Manage and view all your property listings</p>
                    </div>
                    <Button variant="outline" onClick={() => setView("home")} className="rounded-xl gap-2 border-blue-200 text-blue-600 hover:bg-blue-50">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.length > 0 ? (
                        properties.map((property) => (
                            <Card key={property.id} className="rounded-3xl border-slate-100 overflow-hidden group">
                                <div className="h-40 bg-slate-100 relative">
                                    {property.main_image && (
                                        <img src={property.main_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    )}
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <Badge className="bg-white/90 backdrop-blur-md text-blue-600 border-none font-bold">
                                            {property.type}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-slate-900 truncate text-lg mb-1">{property.name}</h3>
                                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                                        <MapPin className="w-3 h-3" /> {property.city}, {property.location}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <span className="font-black text-blue-600">₹{property.price}/mo</span>
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
                        ))
                    ) : (
                        <Card className="col-span-full rounded-[40px] border-slate-100 shadow-xl shadow-slate-200/50 p-12 text-center">
                            <div className="w-20 h-20 rounded-[32px] bg-slate-50 flex items-center justify-center mx-auto mb-6">
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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 font-heading">Get Verified</h1>
                        <p className="text-slate-500">Verify your identity to build trust with potential tenants</p>
                    </div>
                    <Button variant="outline" onClick={() => setView("home")} className="rounded-xl gap-2 border-blue-200 text-blue-600 hover:bg-blue-50">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Button>
                </div>

                <Card className="rounded-[32px] border-emerald-100 bg-emerald-50/30 overflow-hidden">
                    <CardContent className="p-8 flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center shadow-lg shadow-emerald-200/50">
                            <ShieldCheck className="w-8 h-8 text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-emerald-900">Verified</h3>
                            <p className="text-emerald-700 font-medium">Your account is verified. You have the trust badge!</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 rounded-[32px] border-slate-100 shadow-xl shadow-slate-200/50 p-8 space-y-8">
                        <div className="space-y-6">
                            <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                                <ShieldCheck className="w-6 h-6 text-blue-600" />
                                Identity Verification
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">PAN Number</Label>
                                    <Input defaultValue="BVRPS4074R" className="h-12 rounded-xl border-slate-200" />
                                    <p className="text-[10px] font-medium text-slate-400 ml-1">10-character PAN number</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Aadhar Number</Label>
                                    <Input defaultValue="224160267925" className="h-12 rounded-xl border-slate-200" />
                                    <p className="text-[10px] font-medium text-slate-400 ml-1">12-digit Aadhar number</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-100" />

                        <div className="space-y-6">
                            <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                                <Building2 className="w-6 h-6 text-blue-600" />
                                Bank Details (for payments)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Bank Account Number</Label>
                                    <Input placeholder="Enter account number" className="h-12 rounded-xl border-slate-200" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">IFSC Code</Label>
                                    <Input placeholder="Enter IFSC" className="h-12 rounded-xl border-slate-200" />
                                </div>
                            </div>
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

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Banner */}
            <div className="relative h-48 rounded-[40px] bg-gradient-to-r from-blue-600 to-indigo-700 p-10 flex flex-col justify-center overflow-hidden shadow-2xl shadow-blue-200">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full -ml-10 -mb-10 blur-2xl" />

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md border-2 border-white/30 overflow-hidden flex items-center justify-center shadow-inner">
                            {user?.face_photo ? (
                                <img src={user.face_photo} alt={user.full_name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-10 h-10 text-white" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-4xl font-black text-white font-heading tracking-tight">
                                Welcome back, {user?.full_name?.split(' ')[0]}! 👋
                            </h1>
                            <p className="text-blue-100 text-lg font-medium opacity-90">
                                {user?.business_name || "Manage your properties and track performance"}
                            </p>
                        </div>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-none px-4 py-2 rounded-xl backdrop-blur-md font-bold flex gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Verified
                    </Badge>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="rounded-[32px] border-slate-50 shadow-lg shadow-slate-100/50 hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden">
                        <CardContent className="p-8 flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`w-7 h-7 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-500 mb-0.5">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 font-heading">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <motion.button
                            key={action.id}
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={action.action}
                            className={`flex flex-col items-center justify-center gap-4 p-6 rounded-[28px] border ${action.border || 'border-transparent'} ${action.color} ${action.textColor} shadow-lg shadow-slate-200/30 group transition-all h-32`}
                        >
                            <action.icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-sm tracking-tight">{action.label}</span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
