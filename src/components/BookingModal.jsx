import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Mail, MapPin, Calendar, Shield, Check, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const BookingModal = ({ isOpen, onClose, property, selectedRoom, onPaymentSuccess }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [bookingData, setBookingData] = useState({
        name: user?.full_name || "",
        email: user?.email || "",
        phone: user?.phone_number || "",
        address: "",
        specialRequest: ""
    });
    const [paymentData, setPaymentData] = useState(null);

    const handleInputChange = (e) => {
        setBookingData({
            ...bookingData,
            [e.target.name]: e.target.value
        });
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            // Validate form
            if (!bookingData.name || !bookingData.email || !bookingData.phone || !bookingData.address) {
                toast({
                    title: "Validation Error",
                    description: "Please fill in all required fields",
                    variant: "destructive",
                });
                setIsProcessing(false);
                return;
            }

            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                toast({
                    title: "Payment Error",
                    description: "Failed to load payment gateway. Please try again.",
                    variant: "destructive",
                });
                setIsProcessing(false);
                return;
            }

            // Create booking order (in real app, this would be API call)
            const orderData = {
                amount: selectedRoom.price * 100, // Convert to paise
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
                notes: {
                    property_id: property.id,
                    room_name: selectedRoom.name,
                    user_email: bookingData.email,
                    user_phone: bookingData.phone,
                    user_address: bookingData.address,
                    special_request: bookingData.specialRequest
                }
            };

            // Initialize Razorpay
            const options = {
                key: "rzp_live_SKk9PuXXC5dsm6", // Your Live Key ID
                amount: orderData.amount,
                currency: orderData.currency,
                name: "BedBuddy",
                description: `Booking for ${property.name} - ${selectedRoom.name}`,
                image: "/logo.png",
                order_id: `order_${Date.now()}`, // In real app, this comes from your server
                handler: async function (response) {
                    // Payment successful
                    const paymentInfo = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        property: property,
                        room: selectedRoom,
                        customer: bookingData,
                        amount: selectedRoom.price,
                        date: new Date().toISOString(),
                        status: "Confirmed"
                    };

                    setPaymentData(paymentInfo);
                    setShowReceipt(true);
                    
                    // Save booking to backend (in real app)
                    await saveBooking(paymentInfo);
                    
                    toast({
                        title: "Payment Successful!",
                        description: "Your booking has been confirmed.",
                        variant: "success",
                    });

                    onPaymentSuccess(paymentInfo);
                },
                prefill: {
                    name: bookingData.name,
                    email: bookingData.email,
                    contact: bookingData.phone,
                },
                notes: orderData.notes,
                theme: {
                    color: "#6366f1",
                },
                modal: {
                    ondismiss: function() {
                        setIsProcessing(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Payment error:", error);
            toast({
                title: "Payment Failed",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const saveBooking = async (paymentInfo) => {
        // In real app, save to backend
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/bookings/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(paymentInfo)
            });
            
            if (!response.ok) {
                throw new Error('Failed to save booking');
            }
        } catch (error) {
            console.error('Error saving booking:', error);
        }
    };

    const downloadReceipt = () => {
        if (!paymentData) return;

        // Create receipt content
        const receiptContent = `
BOOKING RECEIPT
================

Payment ID: ${paymentData.razorpay_payment_id}
Order ID: ${paymentData.razorpay_order_id}
Date: ${new Date(paymentData.date).toLocaleDateString()}

PROPERTY DETAILS
================
Property: ${paymentData.property.name}
Location: ${paymentData.property.location}
Room Type: ${paymentData.room.name}
Price: ₹${paymentData.room.price}/month

CUSTOMER DETAILS
================
Name: ${paymentData.customer.name}
Email: ${paymentData.customer.email}
Phone: ${paymentData.customer.phone}
Address: ${paymentData.customer.address}

PAYMENT DETAILS
================
Amount Paid: ₹${paymentData.amount}
Status: ${paymentData.status}
Payment Method: Razorpay

Special Request: ${paymentData.customer.specialRequest || 'None'}

Thank you for choosing BedBuddy!
        `;

        // Create and download file
        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `booking_receipt_${paymentData.razorpay_payment_id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const closeModal = () => {
        setShowReceipt(false);
        setPaymentData(null);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                    >
                        {!showReceipt ? (
                            <>
                                {/* Header */}
                                <div className="sticky top-0 bg-white border-b border-slate-100 p-6 rounded-t-[2rem] z-10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900">Complete Your Booking</h2>
                                            <p className="text-slate-500 text-sm mt-1">{property.name} - {selectedRoom.name}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={closeModal}
                                            className="rounded-full hover:bg-slate-100"
                                        >
                                            <X className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Form */}
                                <form onSubmit={handlePayment} className="p-6 space-y-6">
                                    {/* Property Summary */}
                                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-slate-900">{property.name}</h3>
                                                <p className="text-sm text-slate-600">{selectedRoom.name} • {selectedRoom.beds} Beds</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-black text-primary">₹{selectedRoom.price}</p>
                                                <p className="text-xs text-slate-500">per month</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer Details */}
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Your Information
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name *</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={bookingData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your full name"
                                                    required
                                                    className="rounded-xl"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address *</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={bookingData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="your@email.com"
                                                    required
                                                    className="rounded-xl"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number *</Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    value={bookingData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="+91 XXXXX XXXXX"
                                                    required
                                                    className="rounded-xl"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address">Address *</Label>
                                            <Textarea
                                                id="address"
                                                name="address"
                                                value={bookingData.address}
                                                onChange={handleInputChange}
                                                placeholder="Enter your complete address"
                                                required
                                                className="rounded-xl min-h-[100px]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="specialRequest">Special Request (Optional)</Label>
                                            <Textarea
                                                id="specialRequest"
                                                name="specialRequest"
                                                value={bookingData.specialRequest}
                                                onChange={handleInputChange}
                                                placeholder="Any specific requirements or preferences..."
                                                className="rounded-xl min-h-[80px]"
                                            />
                                        </div>
                                    </div>

                                    {/* Security Badge */}
                                    <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                                        <div className="flex items-center gap-3">
                                            <Shield className="w-5 h-5 text-emerald-600" />
                                            <div>
                                                <p className="font-bold text-emerald-900">Secure Payment</p>
                                                <p className="text-sm text-emerald-700">Your payment is protected by Razorpay's secure gateway</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={closeModal}
                                            className="rounded-xl flex-1"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="rounded-xl flex-1 bg-primary hover:bg-primary/90"
                                        >
                                            {isProcessing ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Processing...
                                                </div>
                                            ) : (
                                                `Pay ₹${selectedRoom.price}`
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            /* Receipt View */
                            <div className="p-6">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Check className="w-8 h-8 text-emerald-600" />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2">Payment Successful!</h2>
                                    <p className="text-slate-500">Your booking has been confirmed</p>
                                </div>

                                {paymentData && (
                                    <div className="bg-slate-50 rounded-2xl p-6 space-y-4 mb-6">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-slate-500">Payment ID</p>
                                                <p className="font-mono font-bold">{paymentData.razorpay_payment_id}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500">Amount Paid</p>
                                                <p className="font-bold text-primary">₹{paymentData.amount}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500">Property</p>
                                                <p className="font-bold">{paymentData.property.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500">Room Type</p>
                                                <p className="font-bold">{paymentData.room.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <Button
                                        onClick={downloadReceipt}
                                        className="rounded-xl flex-1 bg-primary hover:bg-primary/90"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Receipt
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={closeModal}
                                        className="rounded-xl"
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BookingModal;
