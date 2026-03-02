import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, ArrowRight, MapPin, Star, Phone, Mail, Wifi, Sofa, Droplets, Shield,
    Car, Tv, Wind, ChevronLeft, ChevronRight, Users, Check, X as XIcon,
    Shirt, Sparkles, BedDouble, Heart, Share2, Calendar, ShieldCheck,
    Coffee, Utensils, Zap, Lock, Info, Clock, ExternalLink, LayoutDashboard, User,
    CreditCard, IndianRupee, CheckCircle2, AlertCircle, Loader2, Hash, Download, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/lib/api";

const amenityDetails = {
    wifi: { icon: <Wifi className="w-5 h-5" />, label: "Wi-Fi", category: "Essentials" },
    "fully furnished": { icon: <Sofa className="w-5 h-5" />, label: "Fully Furnished", category: "Basics" },
    hot_water: { icon: <Droplets className="w-5 h-5" />, label: "Hot Water", category: "Essentials" },
    security: { icon: <Shield className="w-5 h-5" />, label: "24/7 Security", category: "Safety" },
    laundry: { icon: <Shirt className="w-5 h-5" />, label: "Laundry", category: "Essentials" },
    parking: { icon: <Car className="w-5 h-5" />, label: "Parking", category: "Basics" },
    ac: { icon: <Wind className="w-5 h-5" />, label: "Air Conditioning", category: "Essentials" },
    tv: { icon: <Tv className="w-5 h-5" />, label: "Television", category: "Entertainment" },
    house_keeping: { icon: <Sparkles className="w-5 h-5" />, label: "House Keeping", category: "Essentials" },
    mattress: { icon: <BedDouble className="w-5 h-5" />, label: "Premium Mattress", category: "Basics" },
    drinking_water: { icon: <Droplets className="w-5 h-5" />, label: "Filtered Water", category: "Essentials" },
    meals: { icon: <Utensils className="w-5 h-5" />, label: "Daily Meals", category: "Essentials" },
};

const fetchProperty = async (id) => {
    const res = await fetch(`${API_URL}/api/properties/${id}/`);
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
};

// ─── Razorpay Script Loader ──────────────────────────────────────────────────
const loadRazorpay = () => new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
});

const RAZORPAY_KEY_ID = "rzp_live_SKk9PuXXC5dsm6";

// ─── PDF Receipt Generator (pure canvas, no external lib needed) ──────────────
const generateReceiptPDF = ({ paymentId, bookingForm, selectedRoom, property, orderId }) => {
    const receiptNo = "BB-" + Date.now().toString().slice(-8);
    const dateStr = new Date().toLocaleString("en-IN", {
        day: "2-digit", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true
    });
    const amount = (selectedRoom?.price || property?.price || 0).toLocaleString("en-IN");

    // Build HTML receipt in a hidden iframe then print-to-PDF
    const receiptHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #1e293b; }
  .page { width: 794px; min-height: 1123px; padding: 60px; background: #fff; }
  .header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 32px; border-bottom: 3px solid #3b82f6; margin-bottom: 40px; }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand-icon { width: 48px; height: 48px; background: #3b82f6; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; font-size: 22px; font-weight: 900; }
  .brand-name { font-size: 28px; font-weight: 900; color: #1e293b; letter-spacing: -1px; }
  .brand-sub { font-size: 12px; color: #94a3b8; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; }
  .receipt-badge { background: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 12px; padding: 10px 20px; text-align: right; }
  .receipt-badge .label { font-size: 10px; font-weight: 700; color: #16a34a; text-transform: uppercase; letter-spacing: 2px; }
  .receipt-badge .number { font-size: 18px; font-weight: 900; color: #15803d; letter-spacing: -0.5px; }
  .success-banner { background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%); border-radius: 20px; padding: 30px 36px; color: white; margin-bottom: 40px; display: flex; align-items: center; gap: 20px; }
  .success-icon { width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
  .success-title { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; }
  .success-sub { font-size: 13px; opacity: 0.8; margin-top: 4px; font-weight: 500; }
  .section { margin-bottom: 32px; }
  .section-title { font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
  .info-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px; }
  .info-value { font-size: 14px; font-weight: 800; color: #1e293b; }
  .amount-box { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #bbf7d0; border-radius: 16px; padding: 24px 28px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; }
  .amount-label { font-size: 12px; font-weight: 700; color: #15803d; text-transform: uppercase; letter-spacing: 1.5px; }
  .amount-value { font-size: 36px; font-weight: 900; color: #15803d; letter-spacing: -1px; }
  .amount-sub { font-size: 11px; color: #4ade80; font-weight: 600; margin-top: 2px; }
  .payment-ids { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; }
  .pid-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
  .pid-row:last-child { border-bottom: none; }
  .pid-key { font-size: 12px; font-weight: 700; color: #64748b; }
  .pid-val { font-size: 12px; font-weight: 800; color: #1e293b; font-family: monospace; }
  .footer { margin-top: 48px; padding-top: 24px; border-top: 2px dashed #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
  .footer-left { font-size: 11px; color: #94a3b8; font-weight: 600; line-height: 1.6; }
  .footer-right { text-align: right; font-size: 11px; color: #94a3b8; font-weight: 600; }
  .verified-badge { display: inline-flex; align-items: center; gap: 6px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 20px; padding: 6px 14px; font-size: 11px; font-weight: 700; color: #15803d; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">
  <!-- Header -->
  <div class="header">
    <div class="brand">
      <div class="brand-icon">B</div>
      <div>
        <div class="brand-name">BedBuddy</div>
        <div class="brand-sub">Official Payment Receipt</div>
      </div>
    </div>
    <div class="receipt-badge">
      <div class="label">Receipt No.</div>
      <div class="number">${receiptNo}</div>
    </div>
  </div>

  <!-- Success Banner -->
  <div class="success-banner">
    <div class="success-icon">✓</div>
    <div>
      <div class="success-title">Payment Successful</div>
      <div class="success-sub">Your booking has been confirmed — ${dateStr}</div>
    </div>
  </div>

  <!-- Amount -->
  <div class="amount-box">
    <div>
      <div class="amount-label">Total Amount Paid</div>
      <div class="amount-sub">Monthly Advance · Fully Secured</div>
    </div>
    <div class="amount-value">₹${amount}</div>
  </div>

  <!-- Customer Details -->
  <div class="section">
    <div class="section-title">Customer Information</div>
    <div class="grid-2">
      <div class="info-card">
        <div class="info-label">Full Name</div>
        <div class="info-value">${bookingForm.name}</div>
      </div>
      <div class="info-card">
        <div class="info-label">Age</div>
        <div class="info-value">${bookingForm.age} years</div>
      </div>
      <div class="info-card">
        <div class="info-label">Mobile Number</div>
        <div class="info-value">+91 ${bookingForm.phone}</div>
      </div>
      <div class="info-card">
        <div class="info-label">Email Address</div>
        <div class="info-value">${bookingForm.email}</div>
      </div>
    </div>
  </div>

  <!-- Property Details -->
  <div class="section">
    <div class="section-title">Booking Details</div>
    <div class="grid-2">
      <div class="info-card">
        <div class="info-label">Property Name</div>
        <div class="info-value">${property?.name || "—"}</div>
      </div>
      <div class="info-card">
        <div class="info-label">Room Type</div>
        <div class="info-value">${selectedRoom?.name || "—"}</div>
      </div>
      <div class="info-card">
        <div class="info-label">Location</div>
        <div class="info-value">${property?.location || "—"}, ${property?.city || "—"}</div>
      </div>
      <div class="info-card">
        <div class="info-label">Occupancy</div>
        <div class="info-value">${selectedRoom?.occupancy || "—"}</div>
      </div>
    </div>
  </div>

  <!-- Payment IDs -->
  <div class="section">
    <div class="section-title">Transaction Details</div>
    <div class="payment-ids">
      <div class="pid-row">
        <span class="pid-key">Razorpay Payment ID</span>
        <span class="pid-val">${paymentId}</span>
      </div>
      <div class="pid-row">
        <span class="pid-key">Payment Method</span>
        <span class="pid-val">Razorpay Secure Gateway</span>
      </div>
      <div class="pid-row">
        <span class="pid-key">Payment Status</span>
        <span class="pid-val" style="color:#15803d;">✓ CAPTURED</span>
      </div>
      <div class="pid-row">
        <span class="pid-key">Date & Time</span>
        <span class="pid-val">${dateStr}</span>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-left">
      BedBuddy — Find Your Perfect Stay<br/>
      For support: support@bedbuddy.com<br/>
      This is a computer-generated receipt. No signature required.
    </div>
    <div class="footer-right">
      <div class="verified-badge">✓ Verified & Authentic</div>
      <div style="margin-top:8px;">Powered by Razorpay</div>
    </div>
  </div>
</div>
</body>
</html>`;

    // Open in a new window and trigger print-to-PDF
    const win = window.open("", "_blank", "width=900,height=700");
    win.document.write(receiptHTML);
    win.document.close();
    win.focus();
    setTimeout(() => {
        win.print();
        // win.close(); // optional: close after print dialog
    }, 500);
};

const HostelDetail = () => {
    const { id } = useParams();
    const { data: property, isLoading, error } = useQuery({
        queryKey: ["property", id],
        queryFn: () => fetchProperty(id),
        enabled: !!id,
    });
    const [currentImage, setCurrentImage] = useState(0);
    const { toast } = useToast();

    // ── Booking Modal State ──
    const [bookingModal, setBookingModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [bookingStep, setBookingStep] = useState("form"); // "form" | "processing" | "success" | "failed"
    const [paymentId, setPaymentId] = useState("");
    const [orderId, setOrderId] = useState("");
    const [bookingForm, setBookingForm] = useState({
        name: "", phone: "", age: "", email: ""
    });
    const [enquiryForm, setEnquiryForm] = useState({
        name: "", phone: "", message: ""
    });
    const [formErrors, setFormErrors] = useState({});

    const openBookingModal = (room) => {
        setSelectedRoom(room);
        setBookingModal(true);
        setBookingStep("form");
        setBookingForm({ name: "", phone: "", age: "", email: "" });
        setFormErrors({});
    };

    const closeBookingModal = () => {
        setBookingModal(false);
        setSelectedRoom(null);
        setBookingStep("form");
    };

    const validateForm = () => {
        const errs = {};
        if (!bookingForm.name.trim()) errs.name = "Full name is required";
        if (!bookingForm.phone.match(/^[6-9]\d{9}$/)) errs.phone = "Enter a valid 10-digit mobile number";
        const age = parseInt(bookingForm.age);
        if (!bookingForm.age || isNaN(age) || age < 15 || age > 60) errs.age = "Enter a valid age (15–60)";
        if (!bookingForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Enter a valid email address";
        setFormErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleProceedToPayment = async () => {
        if (!validateForm()) return;
        setBookingStep("processing");

        try {
            // Step 1: Load Razorpay SDK
            const loaded = await loadRazorpay();
            if (!loaded) {
                toast({ title: "Error", description: "Failed to load payment gateway. Check your internet.", variant: "destructive" });
                setBookingStep("form");
                return;
            }

            const token = localStorage.getItem('token');
            // Step 2: Create order on backend
            const orderRes = await fetch(`${API_URL}/api/payment/create-order/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    amount: selectedRoom?.price || property?.price,
                    property_id: property?.id,
                    room_name: selectedRoom?.name,
                    customer_name: bookingForm.name,
                }),
            });

            if (!orderRes.ok) {
                const errData = await orderRes.json();
                throw new Error(errData.error || "Failed to create payment order");
            }

            const orderData = await orderRes.json();

            // Step 3: Open Razorpay Checkout
            const options = {
                key: RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                order_id: orderData.order_id,
                name: "BedBuddy",
                description: `Booking: ${selectedRoom?.name || "Room"} at ${property?.name}`,
                image: "/bedbuddy-logo-blue.svg",
                prefill: {
                    name: bookingForm.name,
                    email: bookingForm.email,
                    contact: bookingForm.phone,
                },
                notes: {
                    property_name: property?.name,
                    room_name: selectedRoom?.name,
                    customer_age: bookingForm.age,
                },
                theme: { color: "#3b82f6" },
                handler: async (response) => {
                    // Step 4: Verify payment signature
                    try {
                        const token = localStorage.getItem('token');

                        const verifyRes = await fetch(`${API_URL}/api/payment/verify/`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                ...(token ? { "Authorization": `Bearer ${token}` } : {})
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                property_id: property?.id,
                                room_id: selectedRoom?.id,
                                amount: selectedRoom?.price || property?.price,
                                customer_details: {
                                    name: bookingForm.name,
                                    phone: bookingForm.phone,
                                    email: bookingForm.email,
                                    age: bookingForm.age,
                                }
                            }),
                        });
                        const verifyData = await verifyRes.json();
                        if (verifyData.verified) {
                            setPaymentId(response.razorpay_payment_id);
                            setOrderId(response.razorpay_order_id);
                            setBookingStep("success");
                            // Auto-trigger receipt generation after a short delay
                            setTimeout(() => {
                                generateReceiptPDF({
                                    paymentId: response.razorpay_payment_id,
                                    bookingForm,
                                    selectedRoom,
                                    property,
                                    orderId: response.razorpay_order_id,
                                });
                            }, 800);
                        } else {
                            setBookingStep("failed");
                        }
                    } catch {
                        setBookingStep("failed");
                    }
                },
                modal: {
                    ondismiss: () => {
                        if (bookingStep === "processing") setBookingStep("form");
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", () => setBookingStep("failed"));
            rzp.open();
            setBookingStep("form"); // reset so modal stays open while Razorpay overlay is showing

        } catch (err) {
            console.error("Payment error:", err);
            toast({ title: "Payment Error", description: err.message, variant: "destructive" });
            setBookingStep("form");
        }
    };

    const scrollToBooking = () => {
        const element = document.getElementById("booking-sidebar");
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.classList.add("ring-4", "ring-primary/20");
            setTimeout(() => element.classList.remove("ring-4", "ring-primary/20"), 2000);
        }
    };




    const mapContainerStyle = {
        width: "100%",
        height: "400px",
        borderRadius: "2rem",
    };

    const mapOptions = {
        disableDefaultUI: false,
        zoomControl: true,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
            },
        ],
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Loading details...</p>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
                <h1 className="text-2xl font-heading font-bold text-foreground">Property Not Found</h1>
                <Link to="/">
                    <Button variant="default" className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Button>
                </Link>
            </div>
        );
    }

    const genderColor = property.gender === "Boys" ? "bg-blue-500" : property.gender === "Girls" ? "bg-pink-500" : "bg-accent";

    const nextImage = () => {
        if (property.images?.length > 0) {
            setCurrentImage((p) => (p + 1) % property.images.length);
        }
    };
    const prevImage = () => {
        if (property.images?.length > 0) {
            setCurrentImage((p) => (p - 1 + property.images.length) % property.images.length);
        }
    };

    const handleEnquiry = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/enquiries/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    property: id,
                    name: enquiryForm.name,
                    phone: enquiryForm.phone,
                    message: enquiryForm.message,
                }),
            });

            if (res.ok) {
                toast({ title: "Enquiry Sent!", description: "The owner will contact you soon." });
                setEnquiryForm({ name: "", phone: "", message: "" });
            } else {
                const errData = await res.json();
                toast({
                    title: "Error",
                    description: errData.error || "Failed to send enquiry. Please log in first.",
                    variant: "destructive"
                });
            }
        } catch (err) {
            toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar />

            {/* Premium Header / Progress Bar could go here */}

            <main className="pt-24 pb-20">
                <div className="container max-w-7xl">
                    {/* Navigation and Actions */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:text-primary hover:border-primary/30 transition-all shadow-sm active:scale-95"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Explorations
                            </Link>
                        </motion.div>

                        <div className="flex items-center gap-3">
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-3 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 transition-colors shadow-sm active:scale-95"
                            >
                                <Heart className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="p-3 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-primary transition-colors shadow-sm active:scale-95"
                            >
                                <Share2 className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* LEFT COLUMN: Main Content */}
                        <div className="lg:col-span-8 space-y-12">

                            {/* CINEMATIC GALLERY SECTION */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="group relative"
                            >
                                <div className="relative aspect-[16/10] sm:aspect-[21/9] lg:aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl bg-slate-200 ring-1 ring-black/5">
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={currentImage}
                                            src={property.images && property.images.length > 0 ? property.images[currentImage]?.image : property.main_image}
                                            alt={property.name}
                                            className="w-full h-full object-cover"
                                            initial={{ opacity: 0, scale: 1.1 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.6 }}
                                        />
                                    </AnimatePresence>

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                                    {/* Gallery Controls */}
                                    <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={prevImage} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all active:scale-90 shadow-xl">
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button onClick={nextImage} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all active:scale-90 shadow-xl">
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {/* Property Badges (Floating on image) */}
                                    <div className="absolute top-6 left-6 flex items-center gap-3">
                                        <Badge className="bg-primary hover:bg-primary px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-full shadow-lg border-none">
                                            {property.type}
                                        </Badge>
                                        <Badge className={`${genderColor} px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-full shadow-lg border-none`}>
                                            {property.gender}
                                        </Badge>
                                        {property.verified && (
                                            <Badge className="bg-green-500 px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-full shadow-lg border-none flex items-center gap-1.5">
                                                <ShieldCheck className="w-3.5 h-3.5" /> Verified
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Thumbnail Strip (Overlay) */}
                                    <div className="absolute bottom-6 left-6 right-6 hidden sm:flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                        {property.images?.map((img, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentImage(i)}
                                                className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 ${i === currentImage ? "border-primary scale-110 shadow-xl" : "border-white/20 opacity-60 hover:opacity-100 hover:scale-105"}`}
                                            >
                                                <img src={img.image} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>

                                    {/* Status Dots (for mobile) */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:hidden">
                                        {property.images?.map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImage ? "bg-white w-8 shadow-glow" : "bg-white/40 w-1.5"}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* TITLE & QUICK INFO */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="space-y-6"
                            >
                                <div className="flex flex-col gap-4">
                                    <h1 className="text-4xl md:text-5xl font-heading font-black text-slate-900 tracking-tight leading-none">
                                        {property.name}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-6">
                                        <div className="flex items-center gap-2 p-1.5 pr-4 bg-white rounded-full border border-slate-100 shadow-sm transition-all hover:bg-slate-50">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-600">{property.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 p-1.5 px-4 bg-amber-50 rounded-full border border-amber-100/50 shadow-sm">
                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            <span className="text-sm font-black text-amber-700">{property.rating?.toFixed(1) || "0.0"}</span>
                                            <span className="mx-1 text-amber-300">|</span>
                                            <span className="text-sm font-bold text-amber-700/70">{property.reviews || 0} Professional Reviews</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                                        <Info className="w-12 h-12" />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                                        <ArrowRight className="w-3 h-3 text-primary" /> About Property
                                    </h3>
                                    <p className="text-lg text-slate-600 font-medium leading-relaxed relative z-10">
                                        {property.description}
                                    </p>
                                </div>
                            </motion.div>

                            {/* AMENITIES SECTION - REDESIGNED */}
                            <motion.section
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-heading font-black text-slate-900 tracking-tight">
                                        Lifestyle <span className="text-primary italic">Amenities</span>
                                    </h2>
                                    <Badge variant="outline" className="px-3 py-1 border-slate-200 text-slate-400 font-bold uppercase tracking-tighter">
                                        {property.amenities?.length}+ Included
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {property.amenities?.map((amenity, i) => {
                                        const detail = amenityDetails[amenity];
                                        return (
                                            <motion.div
                                                key={amenity}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.05 }}
                                                className="group p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-inner mb-4">
                                                    {detail?.icon || <Check className="w-6 h-6" />}
                                                </div>
                                                <p className="font-black text-slate-800 tracking-tight">{detail?.label || amenity}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                    {detail?.category || "Standard"}
                                                </p>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.section>

                            {/* ROOM TYPES SECTION */}
                            <motion.section
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-3xl font-heading font-black text-slate-900 mb-8 tracking-tight">
                                    Selection of <span className="text-primary italic">Spaces</span>
                                </h2>
                                <div className="space-y-4">
                                    {property.rooms?.map((room, i) => (
                                        <motion.div
                                            key={room.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="group relative overflow-hidden p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                        <Users className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-black text-slate-900 tracking-tight">{room.name}</h4>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                                                <BedDouble className="w-3.5 h-3.5" />
                                                                {room.beds} Beds
                                                            </div>
                                                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                                                <LayoutDashboard className="w-3.5 h-3.5" />
                                                                {room.occupancy}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between sm:justify-end gap-10">
                                                    <div className="text-right">
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-2xl font-black text-primary tracking-tighter">₹{room.price?.toLocaleString()}</span>
                                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/mo</span>
                                                        </div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">All-Inclusive Rent</p>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row items-center gap-3 min-w-[120px]">
                                                        {room.available ? (
                                                            <>
                                                                <div className="w-full sm:w-auto px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase tracking-tighter flex items-center justify-center gap-2 border border-emerald-100 whitespace-nowrap">
                                                                    <Check className="w-3.5 h-3.5" /> Live Now
                                                                </div>
                                                                <Button
                                                                    onClick={() => openBookingModal(room)}
                                                                    className="w-full sm:w-auto h-10 px-6 rounded-xl bg-slate-900 hover:bg-primary text-white font-bold text-xs transition-all active:scale-95 shadow-lg shadow-slate-200 hover:shadow-primary/20"
                                                                >
                                                                    Book Now
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <div className="w-full px-4 py-2 rounded-full bg-red-50 text-red-600 font-black text-[10px] uppercase tracking-tighter flex items-center justify-center gap-2 border border-red-100 whitespace-nowrap">
                                                                <XIcon className="w-3.5 h-3.5" /> Sold Out
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Decoration */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 pointer-events-none" />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>

                            {/* LOCATION & MAP SECTION */}
                            <motion.section
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="space-y-8"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-heading font-black text-slate-900 tracking-tight">Location & <span className="text-primary italic">Surroundings</span></h2>
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm font-bold text-slate-600 text-sm">
                                        <MapPin className="w-4 h-4 text-primary" /> {property.city}, {property.location}
                                    </div>
                                </div>

                                <div className="p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl group relative">
                                    <div className="flex flex-wrap gap-4 items-center">
                                        <div className="flex-1 min-w-[200px] p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Full Address</p>
                                            <p className="text-sm font-bold text-slate-700 leading-tight">{property.address}</p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="h-auto py-4 px-6 rounded-2xl border-slate-200 hover:border-primary hover:text-primary transition-all font-bold gap-2"
                                            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`, "_blank")}
                                        >
                                            <ExternalLink className="w-4 h-4" /> Get Directions
                                        </Button>
                                    </div>
                                </div>
                            </motion.section>

                            {/* REVIEWS SECTION - POLISHED */}
                            <motion.section
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="pb-10"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-heading font-black text-slate-900 tracking-tight">Verified <span className="text-primary italic">Reviews</span></h2>
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm font-bold text-slate-600">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        {property.rating?.toFixed(1)} <span className="text-slate-200">|</span> {property.reviews_list?.length || 0} Ratings
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {property.reviews_list?.map((review, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm relative overflow-hidden group"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg shadow-inner">
                                                        {review.name?.[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-slate-800 tracking-tight">{review.name}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {review.date ? new Date(review.date).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "Verified Student"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-0.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                                                    {Array.from({ length: 5 }).map((_, s) => (
                                                        <Star key={s} className={`w-3 h-3 ${s < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                                                "{review.comment}"
                                            </p>

                                            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform">
                                                <Star className="w-8 h-8" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        </div>

                        {/* RIGHT COLUMN: Glassmorphism Booking Sidebar */}
                        <div className="lg:col-span-4 lg:relative" id="booking-sidebar">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="lg:sticky lg:top-28 space-y-6"
                            >
                                <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white/40 backdrop-blur-3xl ring-1 ring-white/50">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-primary-foreground" />
                                    <div className="p-8">
                                        <div className="flex flex-col gap-1 mb-8">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-black text-primary tracking-tighter">₹{property.price?.toLocaleString()}</span>
                                                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Starting /mo</span>
                                            </div>
                                            {property.originalPrice && (
                                                <span className="text-sm text-slate-400 line-through font-bold">₹{property.originalPrice.toLocaleString()} - Market Rate</span>
                                            )}
                                        </div>

                                        <form onSubmit={handleEnquiry} className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="group relative">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-1 block group-focus-within:text-primary transition-colors">Your Contact Name</Label>
                                                    <div className="relative">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary" />
                                                        <Input
                                                            placeholder="E.g. Dwarkesh Patel"
                                                            className="pl-12 h-14 rounded-2xl bg-white/50 border-slate-100 focus:bg-white focus:ring-primary/20 transition-all font-bold text-slate-700"
                                                            required
                                                            value={enquiryForm.name}
                                                            onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="group relative">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-1 block group-focus-within:text-primary transition-colors">Connect via Phone</Label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary" />
                                                        <Input
                                                            type="tel"
                                                            placeholder="+91 XXXXX XXXXX"
                                                            className="pl-12 h-14 rounded-2xl bg-white/50 border-slate-100 focus:bg-white focus:ring-primary/20 transition-all font-bold text-slate-700"
                                                            required
                                                            value={enquiryForm.phone}
                                                            onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="group relative">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-1 block group-focus-within:text-primary transition-colors">Any Specific Request?</Label>
                                                    <Textarea
                                                        placeholder="E.g. Prefer corner room, need single occupancy..."
                                                        className="min-h-[100px] rounded-2xl bg-white/50 border-slate-100 focus:bg-white focus:ring-primary/20 transition-all font-bold text-slate-700 p-4 resize-none"
                                                        value={enquiryForm.message}
                                                        onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <Button type="submit" className="w-full h-16 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:via-indigo-800 hover:to-violet-800 text-white font-black text-lg shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all duration-300 active:scale-[0.98] group border-none">
                                                    Send Enquiry
                                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                                </Button>
                                                <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                                                    <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> Response Time &lt; 2 Hours
                                                </p>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Trust Badges */}
                                    <div className="bg-slate-50 p-6 flex flex-col gap-4">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary">
                                                <ShieldCheck className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black tracking-tight tracking-tight uppercase tracking-tighter leading-none">Safe & Secure Booking</p>
                                                <p className="text-[10px] text-slate-400 font-bold">Payment via BedBuddy Direct</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black tracking-tight uppercase tracking-tighter leading-none">Instant Site Visit</p>
                                                <p className="text-[10px] text-slate-400 font-bold">Schedule for Free within 24h</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <div className="p-8 rounded-[2.5rem] bg-indigo-900 overflow-hidden relative group">
                                    <div className="relative z-10 text-white space-y-4">
                                        <h4 className="text-xl font-black tracking-tight">Need Expert Advice?</h4>
                                        <p className="text-sm font-medium text-indigo-100/80 leading-relaxed">
                                            Our student consultants help you find the best hostels based on your college location.
                                        </p>
                                        <Button className="w-full rounded-xl bg-white text-indigo-900 border-none hover:bg-indigo-50 font-bold">
                                            Talk to Consultant
                                        </Button>
                                    </div>

                                    {/* Decoration */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform" />
                                    <Coffee className="absolute bottom-4 right-4 w-12 h-12 text-white/10 group-hover:rotate-12 transition-transform" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* ══════════════════════════════════════════════
                BOOKING MODAL WITH RAZORPAY INTEGRATION
            ══════════════════════════════════════════════ */}
            <AnimatePresence>
                {bookingModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.target === e.currentTarget && bookingStep !== "processing" && closeBookingModal()}
                    >
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />

                        {/* Modal Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 30 }}
                            transition={{ type: "spring", stiffness: 300, damping: 28 }}
                            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/20 overflow-hidden"
                        >
                            {/* Top gradient bar */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-primary to-indigo-500" />

                            {/* ── FORM STEP ─────────────────────── */}
                            {(bookingStep === "form" || bookingStep === "processing") && (
                                <div className="p-8">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-7">
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Book Your Stay</h2>
                                            {selectedRoom && (
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedRoom.name}</span>
                                                    <span className="text-slate-200">•</span>
                                                    <span className="text-sm font-black text-primary">₹{selectedRoom.price?.toLocaleString()}<span className="text-xs font-bold text-slate-400">/mo</span></span>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={closeBookingModal}
                                            disabled={bookingStep === "processing"}
                                            className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-all disabled:opacity-40"
                                        >
                                            <XIcon className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="space-y-4">
                                        {/* Name */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Dwarkesh Savalia"
                                                    value={bookingForm.name}
                                                    onChange={(e) => setBookingForm(p => ({ ...p, name: e.target.value }))}
                                                    disabled={bookingStep === "processing"}
                                                    className={`w-full h-14 pl-11 pr-4 rounded-2xl bg-slate-50 border-2 font-bold text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:bg-white transition-all disabled:opacity-60 ${formErrors.name ? "border-red-300 focus:border-red-400" : "border-slate-100 focus:border-primary/40"}`}
                                                />
                                            </div>
                                            {formErrors.name && <p className="text-xs font-bold text-red-500 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{formErrors.name}</p>}
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Mobile Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                <input
                                                    type="tel"
                                                    placeholder="10-digit mobile number"
                                                    maxLength={10}
                                                    value={bookingForm.phone}
                                                    onChange={(e) => setBookingForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))}
                                                    disabled={bookingStep === "processing"}
                                                    className={`w-full h-14 pl-11 pr-4 rounded-2xl bg-slate-50 border-2 font-bold text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:bg-white transition-all disabled:opacity-60 ${formErrors.phone ? "border-red-300 focus:border-red-400" : "border-slate-100 focus:border-primary/40"}`}
                                                />
                                            </div>
                                            {formErrors.phone && <p className="text-xs font-bold text-red-500 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{formErrors.phone}</p>}
                                        </div>

                                        {/* Age + Email - 2 col */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Age</label>
                                                <div className="relative">
                                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                    <input
                                                        type="number"
                                                        placeholder="e.g. 20"
                                                        min="15" max="60"
                                                        value={bookingForm.age}
                                                        onChange={(e) => setBookingForm(p => ({ ...p, age: e.target.value }))}
                                                        disabled={bookingStep === "processing"}
                                                        className={`w-full h-14 pl-11 pr-4 rounded-2xl bg-slate-50 border-2 font-bold text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:bg-white transition-all disabled:opacity-60 ${formErrors.age ? "border-red-300 focus:border-red-400" : "border-slate-100 focus:border-primary/40"}`}
                                                    />
                                                </div>
                                                {formErrors.age && <p className="text-xs font-bold text-red-500 ml-1"><AlertCircle className="w-3 h-3 inline mr-0.5" />{formErrors.age}</p>}
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                    <input
                                                        type="email"
                                                        placeholder="you@email.com"
                                                        value={bookingForm.email}
                                                        onChange={(e) => setBookingForm(p => ({ ...p, email: e.target.value }))}
                                                        disabled={bookingStep === "processing"}
                                                        className={`w-full h-14 pl-11 pr-4 rounded-2xl bg-slate-50 border-2 font-bold text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:bg-white transition-all disabled:opacity-60 ${formErrors.email ? "border-red-300 focus:border-red-400" : "border-slate-100 focus:border-primary/40"}`}
                                                    />
                                                </div>
                                                {formErrors.email && <p className="text-xs font-bold text-red-500 ml-1"><AlertCircle className="w-3 h-3 inline mr-0.5" />{formErrors.email}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amount Summary */}
                                    <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-slate-500">Amount Payable</p>
                                            <p className="text-xs font-bold text-slate-400">Monthly advance payment</p>
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <IndianRupee className="w-5 h-5 text-primary font-black" />
                                            <span className="text-2xl font-black text-primary">{(selectedRoom?.price || property?.price)?.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Proceed Button */}
                                    <button
                                        onClick={handleProceedToPayment}
                                        disabled={bookingStep === "processing"}
                                        className="mt-5 w-full h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-base shadow-xl shadow-blue-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {bookingStep === "processing" ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Connecting to Razorpay...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="w-5 h-5" />
                                                Proceed to Payment
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>

                                    {/* Trust row */}
                                    <div className="mt-4 flex items-center justify-center gap-4 text-slate-400">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                                            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                                            Secured by Razorpay
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                                            <Lock className="w-3.5 h-3.5 text-blue-500" />
                                            256-bit SSL Encrypted
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── SUCCESS STEP ─────────────────────── */}
                            {bookingStep === "success" && (
                                <div className="p-8 flex flex-col items-center text-center gap-5">
                                    {/* Animated success icon */}
                                    <motion.div
                                        initial={{ scale: 0, rotate: -20 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                        className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-[2rem] flex items-center justify-center shadow-xl shadow-green-500/30"
                                    >
                                        <CheckCircle2 className="w-12 h-12 text-white" />
                                    </motion.div>

                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Booking Confirmed! 🎉</h2>
                                        <p className="text-slate-500 font-medium mt-2 text-sm leading-relaxed">
                                            Payment successful. Owner will contact <span className="font-black text-slate-700">{bookingForm.phone}</span> within 2 hours.
                                        </p>
                                    </motion.div>

                                    {/* Receipt preview card */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                        className="w-full rounded-2xl border border-slate-100 overflow-hidden"
                                    >
                                        {/* Card header */}
                                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-white/80" />
                                                <span className="text-white font-black text-sm uppercase tracking-widest">Payment Receipt</span>
                                            </div>
                                            <span className="text-white/70 font-bold text-xs">BB-{Date.now().toString().slice(-6)}</span>
                                        </div>
                                        {/* Card rows */}
                                        <div className="bg-slate-50 divide-y divide-slate-100 text-left">
                                            {[
                                                { label: "Name", value: bookingForm.name },
                                                { label: "Mobile", value: `+91 ${bookingForm.phone}` },
                                                { label: "Property", value: property?.name },
                                                { label: "Room", value: selectedRoom?.name },
                                                { label: "Amount Paid", value: `₹${(selectedRoom?.price || property?.price)?.toLocaleString()}`, highlight: true },
                                                { label: "Payment ID", value: paymentId, mono: true },
                                            ].map(({ label, value, highlight, mono }) => (
                                                <div key={label} className="flex justify-between items-center px-5 py-2.5">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                                                    <span className={`text-xs font-black ${highlight ? "text-green-600 text-sm" : mono ? "font-mono text-slate-600" : "text-slate-800"}`}>
                                                        {value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* PDF auto-generated notice */}
                                    <motion.p
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                                        className="text-xs font-bold text-green-600 flex items-center gap-1.5 bg-green-50 px-4 py-2 rounded-full border border-green-100"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Receipt PDF opened automatically — save via Print → Save as PDF
                                    </motion.p>

                                    {/* Action buttons */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                                        className="w-full flex gap-3"
                                    >
                                        {/* Download PDF button */}
                                        <button
                                            onClick={() => generateReceiptPDF({ paymentId, bookingForm, selectedRoom, property, orderId })}
                                            className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-xl shadow-blue-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download PDF
                                        </button>
                                        {/* Done button */}
                                        <button
                                            onClick={closeBookingModal}
                                            className="flex-1 h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm transition-all active:scale-[0.98]"
                                        >
                                            Done
                                        </button>
                                    </motion.div>
                                </div>
                            )}

                            {/* ── FAILED STEP ─────────────────────── */}
                            {bookingStep === "failed" && (
                                <div className="p-10 flex flex-col items-center text-center gap-5">
                                    <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center">
                                        <AlertCircle className="w-12 h-12 text-red-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900">Payment Failed</h2>
                                        <p className="text-slate-500 font-medium mt-2 text-sm">
                                            Something went wrong. Your money was not deducted. Please try again.
                                        </p>
                                    </div>
                                    <div className="flex gap-3 w-full">
                                        <button
                                            onClick={() => setBookingStep("form")}
                                            className="flex-1 h-12 rounded-2xl bg-primary text-white font-black hover:bg-primary/90 transition-all"
                                        >
                                            Try Again
                                        </button>
                                        <button
                                            onClick={closeBookingModal}
                                            className="flex-1 h-12 rounded-2xl bg-slate-100 text-slate-700 font-black hover:bg-slate-200 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HostelDetail;