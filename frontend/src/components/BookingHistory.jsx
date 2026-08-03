import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
    Calendar,
    Clock,
    MapPin,
    Home,
    CreditCard,
    User,
    Phone,
    Mail,
    CheckCircle2,
    XCircle,
    AlertCircle,
    IndianRupee,
    Download,
    Loader2
} from 'lucide-react';
import { API_URL } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const fetchBookingHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/api/bookings/`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch booking history');
    }

    const data = await response.json();
    return data.results || data; // Handle both paginated and non-paginated responses
};

const BookingHistory = ({ isOpen, onClose }) => {
    const [selectedBooking, setSelectedBooking] = useState(null);

    const { data: bookings = [], isLoading, error } = useQuery({
        queryKey: ['booking-history'],
        queryFn: fetchBookingHistory,
        enabled: isOpen,
    });

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Confirmed': { color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
            'Pending': { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
            'Cancelled': { color: 'bg-red-100 text-red-800', icon: XCircle },
        };

        const config = statusConfig[status] || statusConfig['Pending'];
        const Icon = config.icon;

        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
                <Icon className="w-3 h-3" />
                {status}
            </Badge>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const generateReceipt = (booking) => {
        const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
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
        <div class="header">
            <div class="brand">
                <div class="brand-icon">N</div>
                <div>
                    <div class="brand-name">NestNode</div>
                    <div class="brand-sub">Booking Confirmation Receipt</div>
                </div>
            </div>
            <div class="receipt-badge">
                <div class="label">Booking ID</div>
                <div class="number">${booking.id}</div>
            </div>
        </div>

        <div class="success-banner">
            <div class="success-icon">✓</div>
            <div>
                <div class="success-title">Booking Confirmed</div>
                <div class="success-sub">Your accommodation has been successfully booked — ${formatDate(booking.created_at)}</div>
            </div>
        </div>

        <div class="amount-box">
            <div>
                <div class="amount-label">Total Amount Paid</div>
                <div class="amount-sub">Monthly Advance · Fully Secured</div>
            </div>
            <div class="amount-value">₹${booking.amount?.toLocaleString('en-IN') || 'N/A'}</div>
        </div>

        <div class="section">
            <div class="section-title">Customer Information</div>
            <div class="grid-2">
                <div class="info-card">
                    <div class="info-label">Full Name</div>
                    <div class="info-value">${booking.customer_name || 'N/A'}</div>
                </div>
                <div class="info-card">
                    <div class="info-label">Age</div>
                    <div class="info-value">${booking.customer_age || 'N/A'} years</div>
                </div>
                <div class="info-card">
                    <div class="info-label">Mobile Number</div>
                    <div class="info-value">+91 ${booking.customer_phone || 'N/A'}</div>
                </div>
                <div class="info-card">
                    <div class="info-label">Email Address</div>
                    <div class="info-value">${booking.customer_email || 'N/A'}</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Property Details</div>
            <div class="grid-2">
                <div class="info-card">
                    <div class="info-label">Property Name</div>
                    <div class="info-value">${booking.property_name || 'N/A'}</div>
                </div>
                <div class="info-card">
                    <div class="info-label">Room Type</div>
                    <div class="info-value">${booking.room_name || 'N/A'}</div>
                </div>
                <div class="info-card">
                    <div class="info-label">Location</div>
                    <div class="info-value">${booking.property?.location || 'N/A'}, ${booking.property?.city || 'N/A'}</div>
                </div>
                <div class="info-card">
                    <div class="info-label">Booking Status</div>
                    <div class="info-value">${booking.status}</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Payment Details</div>
            <div class="payment-ids">
                <div class="pid-row">
                    <span class="pid-key">Payment ID</span>
                    <span class="pid-val">${booking.payment_id || 'N/A'}</span>
                </div>
                <div class="pid-row">
                    <span class="pid-key">Order ID</span>
                    <span class="pid-val">${booking.razorpay_order_id || 'N/A'}</span>
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
                    <span class="pid-val">${formatDate(booking.created_at)}</span>
                </div>
            </div>
        </div>

        <div class="footer">
            <div class="footer-left">
                NestNode — Find Your Perfect Stay<br/>
                For support: support@nestnode.com<br/>
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

        const win = window.open("", "_blank", "width=900,height=700");
        win.document.write(receiptHTML);
        win.document.close();
        win.focus();
        setTimeout(() => {
            win.print();
        }, 500);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full h-full max-w-6xl max-h-[90vh] bg-white rounded-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Booking History</h2>
                            <p className="text-slate-600 mt-1">Your complete booking records and receipts</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <XCircle className="w-6 h-6 text-slate-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto max-h-[70vh] p-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <p className="text-slate-600">Failed to load booking history. Please try again.</p>
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-600">No bookings found yet.</p>
                                <p className="text-slate-400 text-sm mt-2">Your booking history will appear here once you make a booking.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {bookings.map((booking) => (
                                    <motion.div
                                        key={booking.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: bookings.indexOf(booking) * 0.1 }}
                                    >
                                        <Card className="hover:shadow-lg transition-shadow">
                                            <CardHeader className="pb-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-2">
                                                        <CardTitle className="text-lg">{booking.property_name}</CardTitle>
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <MapPin className="w-4 h-4" />
                                                            <span className="text-sm">{booking.property_location}, {booking.property_city}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Home className="w-4 h-4" />
                                                            <span className="text-sm">{booking.room_name}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        {getStatusBadge(booking.status)}
                                                        <div className="text-right">
                                                            <div className="text-2xl font-bold text-slate-900">
                                                                ₹{booking.amount?.toLocaleString('en-IN') || 'N/A'}
                                                            </div>
                                                            <div className="text-xs text-slate-500">Monthly Rent</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Calendar className="w-4 h-4" />
                                                            <span className="text-sm">Booked on: {formatDate(booking.created_at)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <User className="w-4 h-4" />
                                                            <span className="text-sm">{booking.customer_name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Phone className="w-4 h-4" />
                                                            <span className="text-sm">+91 {booking.customer_phone}</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Mail className="w-4 h-4" />
                                                            <span className="text-sm">{booking.customer_email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <CreditCard className="w-4 h-4" />
                                                            <span className="text-sm">Payment ID: {booking.payment_id || 'N/A'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <IndianRupee className="w-4 h-4" />
                                                            <span className="text-sm">Order ID: {booking.razorpay_order_id || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Separator />
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => generateReceipt(booking)}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Download Receipt
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {bookings.length > 0 && (
                        <div className="p-4 border-t border-slate-200 bg-slate-50">
                            <p className="text-center text-slate-600 text-sm">
                                Showing {bookings.length} booking{bookings.length > 1 ? 's' : ''} • All receipts available for download
                            </p>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BookingHistory;
