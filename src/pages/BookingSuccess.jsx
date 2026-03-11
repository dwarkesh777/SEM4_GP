import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { useQueryClient } from '@tanstack/react-query';
import {
    CheckCircle2,
    Building2,
    MapPin,
    Home,
    Calendar,
    User,
    Phone,
    Mail,
    CreditCard,
    IndianRupee,
    Download,
    ArrowLeft,
    Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const BookingSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [bookingDetails, setBookingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get booking data from location state or URL params
    const bookingData = location.state?.bookingData || location.state?.booking;

    useEffect(() => {
        // Refresh booking data in all queries when arriving at success page
        queryClient.invalidateQueries(['user-bookings']);
        queryClient.invalidateQueries(['booking-history']);
        
        if (bookingData) {
            // If booking data is passed from payment page
            setBookingDetails(bookingData);
            setLoading(false);
        } else {
            // Try to get the latest booking from API
            fetchLatestBooking();
        }
    }, [bookingData, queryClient]);

    const fetchLatestBooking = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${API_URL}/api/bookings/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const bookings = data.results || data;
                if (bookings.length > 0) {
                    // Get the most recent booking
                    setBookingDetails(bookings[0]);
                }
            }
        } catch (err) {
            console.error('Error fetching booking:', err);
            setError('Failed to load booking details');
        } finally {
            setLoading(false);
        }
    };

    const generateReceipt = () => {
        if (!bookingDetails) return;

        const receiptContent = `
            <html>
                <head>
                    <title>Booking Receipt - BedBuddy</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
                        .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
                        .logo { font-size: 28px; font-weight: bold; color: #3b82f6; margin-bottom: 10px; }
                        .booking-info { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; }
                        .section { margin: 25px 0; }
                        .section-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
                        .info-row { display: flex; justify-content: space-between; margin: 8px 0; padding: 5px 0; }
                        .info-label { font-weight: 600; color: #6b7280; }
                        .info-value { color: #1f2937; }
                        .status-badge { background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; text-align: center; font-weight: bold; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
                        @media print { body { margin: 20px; } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">🏠 BedBuddy</div>
                        <h2>Booking Receipt</h2>
                        <p>Thank you for choosing BedBuddy for your accommodation needs!</p>
                    </div>
                    
                    <div class="status-badge">✓ Booking Confirmed</div>
                    
                    <div class="section">
                        <div class="section-title">📋 Booking Information</div>
                        <div class="booking-info">
                            <div>
                                <div class="info-row">
                                    <span class="info-label">Booking ID:</span>
                                    <span class="info-value">${bookingDetails.id || 'N/A'}</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Booking Date:</span>
                                    <span class="info-value">${new Date(bookingDetails.created_at).toLocaleDateString('en-IN')}</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Status:</span>
                                    <span class="info-value">${bookingDetails.status || 'Confirmed'}</span>
                                </div>
                            </div>
                            <div>
                                <div class="info-row">
                                    <span class="info-label">Monthly Rent:</span>
                                    <span class="info-value">₹${bookingDetails.amount?.toLocaleString('en-IN') || 'N/A'}</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Payment ID:</span>
                                    <span class="info-value">${bookingDetails.payment_id || 'N/A'}</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Order ID:</span>
                                    <span class="info-value">${bookingDetails.razorpay_order_id || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">🏢 Property Details</div>
                        <div class="info-row">
                            <span class="info-label">Property Name:</span>
                            <span class="info-value">${bookingDetails.property_name || 'N/A'}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Location:</span>
                            <span class="info-value">${bookingDetails.property_location || 'N/A'}, ${bookingDetails.property_city || 'N/A'}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Room Type:</span>
                            <span class="info-value">${bookingDetails.room_name || 'N/A'}</span>
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">👤 Customer Information</div>
                        <div class="booking-info">
                            <div>
                                <div class="info-row">
                                    <span class="info-label">Name:</span>
                                    <span class="info-value">${bookingDetails.customer_name || 'N/A'}</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Email:</span>
                                    <span class="info-value">${bookingDetails.customer_email || 'N/A'}</span>
                                </div>
                            </div>
                            <div>
                                <div class="info-row">
                                    <span class="info-label">Phone:</span>
                                    <span class="info-value">+91 ${bookingDetails.customer_phone || 'N/A'}</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Age:</span>
                                    <span class="info-value">${bookingDetails.customer_age || 'N/A'} years</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p><strong>BedBuddy - Premium Student Living</strong></p>
                        <p>📞 Support: +91 9876543210 | 📧 support@bedbuddy.com</p>
                        <p>🌐 www.bedbuddy.com | 📍 Multiple Cities Across India</p>
                        <p style="margin-top: 10px; font-size: 12px;">*This is a computer-generated receipt and does not require a signature.</p>
                    </div>
                </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(receiptContent);
        printWindow.document.close();
        printWindow.print();
    };

    const shareBooking = () => {
        if (!bookingDetails) return;

        const shareText = `🏠 I just booked ${bookingDetails.property_name} in ${bookingDetails.property_location} through BedBuddy! 🎉\n\n📅 Booked on: ${new Date(bookingDetails.created_at).toLocaleDateString('en-IN')}\n💰 Monthly Rent: ₹${bookingDetails.amount?.toLocaleString('en-IN')}\n🏢 Room: ${bookingDetails.room_name}\n\nCheck out BedBuddy for amazing student accommodations! 📚✨`;

        if (navigator.share) {
            navigator.share({
                title: 'Booking Confirmation - BedBuddy',
                text: shareText,
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(shareText);
            alert('Booking details copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC]">
                <Navbar />
                <div className="flex items-center justify-center min-h-[70vh]">
                    <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (error || !bookingDetails) {
        return (
            <div className="min-h-screen bg-[#F8FAFC]">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 pt-28 pb-20">
                    <div className="text-center py-12">
                        <div className="w-20 h-20 rounded-[32px] bg-red-50 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Booking Not Found</h2>
                        <p className="text-slate-600 mb-8">{error || 'Unable to load booking details.'}</p>
                        <Button onClick={() => navigate('/dashboard')} className="h-12 px-6">
                            Go to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 pt-28 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 rounded-[32px] bg-green-50 flex items-center justify-center mx-auto mb-6"
                        >
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </motion.div>
                        <h1 className="text-4xl font-black text-slate-900 font-heading mb-4">
                            Booking Confirmed! 🎉
                        </h1>
                        <p className="text-xl text-slate-600">
                            Your accommodation has been successfully booked. Here are your booking details:
                        </p>
                    </div>

                    {/* Booking Details Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="rounded-[40px] border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                                            {bookingDetails.property_name}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <MapPin className="w-5 h-5" />
                                            <span className="text-lg">
                                                {bookingDetails.property_location}, {bookingDetails.property_city}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                                        {bookingDetails.status || 'Confirmed'}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="p-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left Column - Property & Room Info */}
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <Building2 className="w-5 h-5 text-blue-600" />
                                                Property Details
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <Home className="w-4 h-4 text-slate-400" />
                                                    <div>
                                                        <p className="text-sm text-slate-500">Room Type</p>
                                                        <p className="font-semibold text-slate-900">{bookingDetails.room_name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <MapPin className="w-4 h-4 text-slate-400" />
                                                    <div>
                                                        <p className="text-sm text-slate-500">Location</p>
                                                        <p className="font-semibold text-slate-900">
                                                            {bookingDetails.property_location}, {bookingDetails.property_city}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="w-4 h-4 text-slate-400" />
                                                    <div>
                                                        <p className="text-sm text-slate-500">Booked On</p>
                                                        <p className="font-semibold text-slate-900">
                                                            {new Date(bookingDetails.created_at).toLocaleDateString('en-IN', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <CreditCard className="w-5 h-5 text-green-600" />
                                                Payment Information
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                                                    <span className="text-sm text-slate-600">Monthly Rent</span>
                                                    <span className="text-2xl font-bold text-green-700">
                                                        ₹{bookingDetails.amount?.toLocaleString('en-IN') || 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-slate-600 space-y-1">
                                                    <p><span className="font-medium">Payment ID:</span> {bookingDetails.payment_id || 'N/A'}</p>
                                                    <p><span className="font-medium">Order ID:</span> {bookingDetails.razorpay_order_id || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Customer Info */}
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <User className="w-5 h-5 text-purple-600" />
                                                Customer Information
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <User className="w-4 h-4 text-slate-400" />
                                                    <div>
                                                        <p className="text-sm text-slate-500">Name</p>
                                                        <p className="font-semibold text-slate-900">{bookingDetails.customer_name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Mail className="w-4 h-4 text-slate-400" />
                                                    <div>
                                                        <p className="text-sm text-slate-500">Email</p>
                                                        <p className="font-semibold text-slate-900">{bookingDetails.customer_email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Phone className="w-4 h-4 text-slate-400" />
                                                    <div>
                                                        <p className="text-sm text-slate-500">Phone</p>
                                                        <p className="font-semibold text-slate-900">+91 {bookingDetails.customer_phone}</p>
                                                    </div>
                                                </div>
                                                {bookingDetails.customer_age && (
                                                    <div className="flex items-center gap-3">
                                                        <User className="w-4 h-4 text-slate-400" />
                                                        <div>
                                                            <p className="text-sm text-slate-500">Age</p>
                                                            <p className="font-semibold text-slate-900">{bookingDetails.customer_age} years</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-4">Important Information</h3>
                                            <div className="bg-blue-50 p-4 rounded-xl">
                                                <ul className="text-sm text-blue-800 space-y-2">
                                                    <li>• Booking confirmation email sent to your registered email</li>
                                                    <li>• Please carry this receipt during check-in</li>
                                                    <li>• Contact property owner 24 hours before arrival</li>
                                                    <li>• Cancellation policy applies as per terms</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <Separator className="my-8" />

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button
                                        onClick={generateReceipt}
                                        className="flex items-center gap-2 h-12 px-6 bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download Receipt
                                    </Button>
                                    <Button
                                        onClick={shareBooking}
                                        variant="outline"
                                        className="flex items-center gap-2 h-12 px-6"
                                    >
                                        <Share2 className="w-5 h-5" />
                                        Share Booking
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            queryClient.invalidateQueries(['user-bookings']);
                                            queryClient.invalidateQueries(['booking-history']);
                                            navigate('/dashboard');
                                        }}
                                        variant="outline"
                                        className="flex items-center gap-2 h-12 px-6"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        Back to Dashboard
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Next Steps */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 text-center"
                    >
                        <h3 className="text-xl font-bold text-slate-900 mb-4">What's Next?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-100">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-6 h-6 text-blue-600" />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">Check Email</h4>
                                <p className="text-sm text-slate-600">Booking confirmation sent to your email</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-100">
                                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                                    <Phone className="w-6 h-6 text-green-600" />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">Contact Property</h4>
                                <p className="text-sm text-slate-600">Call property owner before visiting</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-100">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-6 h-6 text-purple-600" />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">Plan Move-in</h4>
                                <p className="text-sm text-slate-600">Schedule your move-in date</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default BookingSuccess;
