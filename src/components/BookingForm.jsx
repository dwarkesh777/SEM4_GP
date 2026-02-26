import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Mail, MapPin, Calendar, Building2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const BookingForm = ({ isOpen, onClose, property, selectedRoom, onBookingSuccess }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    
    // Form data
    const [formData, setFormData] = useState({
        name: user?.full_name || "",
        email: user?.email || "",
        phone: user?.phone_number || "",
        address: "",
        special_requests: "",
        check_in_date: "",
        check_out_date: "",
    });

    // Booking details
    const [bookingDetails, setBookingDetails] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.full_name || "",
                email: user.email || "",
                phone: user.phone_number || "",
            }));
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            toast({ title: "Error", description: "Please enter your full name", variant: "destructive" });
            return false;
        }
        if (!formData.email.trim()) {
            toast({ title: "Error", description: "Please enter your email", variant: "destructive" });
            return false;
        }
        if (!formData.phone.trim()) {
            toast({ title: "Error", description: "Please enter your phone number", variant: "destructive" });
            return false;
        }
        if (!formData.address.trim()) {
            toast({ title: "Error", description: "Please enter your address", variant: "destructive" });
            return false;
        }
        if (!formData.check_in_date) {
            toast({ title: "Error", description: "Please select check-in date", variant: "destructive" });
            return false;
        }
        return true;
    };

    const handleSubmitBooking = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Create booking data
            const bookingData = {
                property_id: property.id,
                property_name: property.name,
                room_name: selectedRoom?.name || "Standard Room",
                room_price: selectedRoom?.price || property.price,
                check_in_date: formData.check_in_date,
                check_out_date: formData.check_out_date,
                guest_info: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                },
                special_requests: formData.special_requests,
                total_amount: selectedRoom?.price || property.price,
                status: "pending_payment",
            };

            // Store booking in backend
            const response = await fetch('http://localhost:8000/api/bookings/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                throw new Error('Failed to create booking');
            }

            const booking = await response.json();
            setBookingDetails(booking);
            setStep(2); // Move to payment step
            
        } catch (error) {
            console.error('Booking error:', error);
            toast({
                title: "Booking Error",
                description: "Failed to create booking. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const initiatePayment = async () => {
        setPaymentLoading(true);
        
        try {
            // Load Razorpay script dynamically
            if (!window.Razorpay) {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.async = true;
                
                script.onload = () => {
                    createRazorpayOrder();
                };
                
                script.onerror = () => {
                    setPaymentLoading(false);
                    toast({
                        title: "Payment Error",
                        description: "Failed to load payment gateway. Please try again.",
                        variant: "destructive",
                    });
                };
                
                document.body.appendChild(script);
            } else {
                createRazorpayOrder();
            }
        } catch (error) {
            console.error('Payment initiation error:', error);
            toast({
                title: "Payment Error",
                description: "Failed to initiate payment. Please try again.",
                variant: "destructive",
            });
            setPaymentLoading(false);
        }
    };

    const createRazorpayOrder = async () => {
        try {
            // Create Razorpay order on backend
            const orderResponse = await fetch('http://localhost:8000/api/payments/create-order/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    amount: bookingDetails.total_amount * 100, // Amount in paise
                    currency: 'INR',
                    receipt: `booking_${bookingDetails.id}`,
                    notes: {
                        booking_id: bookingDetails.id,
                        property_name: bookingDetails.property_name,
                        guest_name: bookingDetails.guest_info.name,
                    }
                }),
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create payment order');
            }

            const orderData = await orderResponse.json();
            
            const options = {
                key: 'rzp_live_SKk9PuXXC5dsm6', // Your Live Key ID
                amount: bookingDetails.total_amount * 100, // Amount in paise
                currency: 'INR',
                name: 'BedBuddy',
                description: `Booking for ${bookingDetails.property_name}`,
                image: '/logo.png', // Add your logo
                order_id: orderData.id,
                handler: async function (response) {
                    // Handle successful payment
                    await verifyPayment(response);
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                notes: {
                    booking_id: bookingDetails.id,
                    property_name: bookingDetails.property_name,
                },
                theme: {
                    color: '#3B82F6',
                },
                modal: {
                    ondismiss: function() {
                        setPaymentLoading(false);
                        toast({
                            title: "Payment Cancelled",
                            description: "You cancelled the payment process.",
                            variant: "destructive",
                        });
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Order creation error:', error);
            toast({
                title: "Payment Error",
                description: "Failed to create payment order. Please try again.",
                variant: "destructive",
            });
            setPaymentLoading(false);
        }
    };

    const verifyPayment = async (paymentResponse) => {
        try {
            const verifyResponse = await fetch('http://localhost:8000/api/payments/verify/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    razorpay_order_id: paymentResponse.razorpay_order_id,
                    razorpay_payment_id: paymentResponse.razorpay_payment_id,
                    razorpay_signature: paymentResponse.razorpay_signature,
                    booking_id: bookingDetails.id,
                }),
            });

            if (!verifyResponse.ok) {
                throw new Error('Payment verification failed');
            }

            const paymentData = await verifyResponse.json();
            setPaymentDetails(paymentData);
            setStep(3); // Move to success step
            
            // Generate PDF receipt
            await generatePDFReceipt(paymentData);
            
            // Notify parent component
            if (onBookingSuccess) {
                onBookingSuccess(paymentData);
            }

        } catch (error) {
            console.error('Payment verification error:', error);
            toast({
                title: "Payment Verification Failed",
                description: "There was an issue verifying your payment. Please contact support.",
                variant: "destructive",
            });
        } finally {
            setPaymentLoading(false);
        }
    };

    const generatePDFReceipt = async (paymentData) => {
        try {
            // This would generate a PDF receipt
            // For now, we'll just log it - you can implement jsPDF or similar library
            console.log('Generating PDF receipt for:', paymentData);
            
            // Example using jsPDF (you'd need to install it)
            // const { jsPDF } = await import('jspdf');
            // const doc = new jsPDF();
            // ... PDF generation logic
            
        } catch (error) {
            console.error('PDF generation error:', error);
        }
    };

    const downloadReceipt = () => {
        // Download the generated PDF
        if (paymentDetails?.receipt_url) {
            window.open(paymentDetails.receipt_url, '_blank');
        }
    };

    const resetForm = () => {
        setStep(1);
        setBookingDetails(null);
        setPaymentDetails(null);
        setFormData({
            name: user?.full_name || "",
            email: user?.email || "",
            phone: user?.phone_number || "",
            address: "",
            special_requests: "",
            check_in_date: "",
            check_out_date: "",
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="bg-white rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-slate-100 p-6 rounded-t-[2rem] z-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 font-heading">
                                    {step === 1 && "Complete Your Booking"}
                                    {step === 2 && "Complete Payment"}
                                    {step === 3 && "Booking Confirmed!"}
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    {step === 1 && "Fill in your details to proceed"}
                                    {step === 2 && "Secure payment with Razorpay"}
                                    {step === 3 && "Your booking has been successfully confirmed"}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={resetForm}
                                className="rounded-full hover:bg-slate-100"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Step 1: Booking Form */}
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                {/* Property Summary */}
                                <Card className="border-primary/20 bg-primary/5">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <Building2 className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-slate-900">{property?.name}</h3>
                                                <p className="text-sm text-slate-600">{selectedRoom?.name || "Standard Room"} - ₹{selectedRoom?.price || property?.price}/month</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <form onSubmit={handleSubmitBooking} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="font-bold text-slate-700">
                                                Full Name *
                                            </Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your full name"
                                                    className="pl-10 h-12 rounded-xl"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="font-bold text-slate-700">
                                                Email Address *
                                            </Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="your@email.com"
                                                    className="pl-10 h-12 rounded-xl"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="font-bold text-slate-700">
                                                Phone Number *
                                            </Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="+91 00000 00000"
                                                    className="pl-10 h-12 rounded-xl"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="check_in_date" className="font-bold text-slate-700">
                                                Check-in Date *
                                            </Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                                <Input
                                                    id="check_in_date"
                                                    name="check_in_date"
                                                    type="date"
                                                    value={formData.check_in_date}
                                                    onChange={handleInputChange}
                                                    className="pl-10 h-12 rounded-xl"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address" className="font-bold text-slate-700">
                                            Full Address *
                                        </Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                            <Textarea
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="Enter your complete address"
                                                className="pl-10 min-h-[100px] rounded-xl resize-none"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="special_requests" className="font-bold text-slate-700">
                                            Special Requests (Optional)
                                        </Label>
                                        <Textarea
                                            id="special_requests"
                                            name="special_requests"
                                            value={formData.special_requests}
                                            onChange={handleInputChange}
                                            placeholder="Any special requirements or preferences..."
                                            className="min-h-[80px] rounded-xl resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={resetForm}
                                            className="flex-1 h-12 rounded-xl"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90"
                                        >
                                            {loading ? "Processing..." : "Proceed to Payment"}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <Card className="border-amber-200 bg-amber-50">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <AlertCircle className="w-5 h-5 text-amber-600" />
                                            <p className="text-sm text-amber-800">
                                                Please complete the payment to confirm your booking
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Booking Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Property</span>
                                            <span className="font-bold">{bookingDetails?.property_name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Room Type</span>
                                            <span className="font-bold">{bookingDetails?.room_name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Check-in</span>
                                            <span className="font-bold">{bookingDetails?.check_in_date}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Guest Name</span>
                                            <span className="font-bold">{bookingDetails?.guest_info?.name}</span>
                                        </div>
                                        <div className="border-t pt-4">
                                            <div className="flex justify-between text-lg">
                                                <span className="font-bold">Total Amount</span>
                                                <span className="font-bold text-primary">₹{bookingDetails?.total_amount}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="flex gap-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setStep(1)}
                                        className="flex-1 h-12 rounded-xl"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={initiatePayment}
                                        disabled={paymentLoading}
                                        className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90"
                                    >
                                        {paymentLoading ? "Loading..." : "Pay with Razorpay"}
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Success */}
                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6"
                            >
                                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">Booking Confirmed!</h3>
                                    <p className="text-slate-600">
                                        Your booking has been successfully confirmed and payment received.
                                    </p>
                                </div>

                                <Card>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="text-left space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Booking ID</span>
                                                <span className="font-mono font-bold">{paymentDetails?.booking_id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Payment ID</span>
                                                <span className="font-mono text-sm">{paymentDetails?.payment_id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Amount Paid</span>
                                                <span className="font-bold text-primary">₹{paymentDetails?.amount}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Payment Date</span>
                                                <span className="font-bold">{new Date().toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="flex gap-4">
                                    <Button
                                        onClick={downloadReceipt}
                                        className="flex-1 h-12 rounded-xl"
                                        variant="outline"
                                    >
                                        Download Receipt
                                    </Button>
                                    <Button
                                        onClick={resetForm}
                                        className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90"
                                    >
                                        Done
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BookingForm;
