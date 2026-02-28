import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, Download, FileText, CheckCircle2, Calendar,
    MapPin, User, Phone, Mail, BedDouble, IndianRupee,
    Receipt, Hash, Clock, AlertCircle, Trash2, RefreshCw
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Reusable PDF generator (same as HostelDetail) ───────────────────────────
const generateReceiptPDF = (receipt) => {
    const dateStr = new Date(receipt.date).toLocaleString("en-IN", {
        day: "2-digit", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
    });
    const amount = (receipt.amount || 0).toLocaleString("en-IN");

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Segoe UI',Arial,sans-serif; background:#fff; color:#1e293b; }
  .page { width:794px; min-height:1123px; padding:60px; }
  .header { display:flex; align-items:center; justify-content:space-between; padding-bottom:32px; border-bottom:3px solid #3b82f6; margin-bottom:40px; }
  .brand { display:flex; align-items:center; gap:12px; }
  .brand-icon { width:48px; height:48px; background:#3b82f6; border-radius:14px; display:flex; align-items:center; justify-content:center; color:white; font-size:22px; font-weight:900; }
  .brand-name { font-size:28px; font-weight:900; color:#1e293b; letter-spacing:-1px; }
  .brand-sub { font-size:12px; color:#94a3b8; font-weight:600; letter-spacing:2px; text-transform:uppercase; }
  .receipt-badge { background:#f0fdf4; border:2px solid #bbf7d0; border-radius:12px; padding:10px 20px; text-align:right; }
  .receipt-badge .label { font-size:10px; font-weight:700; color:#16a34a; text-transform:uppercase; letter-spacing:2px; }
  .receipt-badge .number { font-size:18px; font-weight:900; color:#15803d; }
  .banner { background:linear-gradient(135deg,#3b82f6 0%,#4f46e5 100%); border-radius:20px; padding:30px 36px; color:white; margin-bottom:40px; display:flex; align-items:center; gap:20px; }
  .banner-icon { width:56px; height:56px; background:rgba(255,255,255,0.2); border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:28px; flex-shrink:0; }
  .banner-title { font-size:22px; font-weight:900; }
  .banner-sub { font-size:13px; opacity:0.8; margin-top:4px; }
  .section { margin-bottom:32px; }
  .section-title { font-size:11px; font-weight:800; color:#94a3b8; text-transform:uppercase; letter-spacing:2px; margin-bottom:14px; padding-bottom:8px; border-bottom:1px solid #f1f5f9; }
  .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; }
  .card-label { font-size:10px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:4px; }
  .card-value { font-size:14px; font-weight:800; color:#1e293b; }
  .amount-box { background:linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%); border:2px solid #bbf7d0; border-radius:16px; padding:24px 28px; display:flex; align-items:center; justify-content:space-between; margin-bottom:32px; }
  .amount-label { font-size:12px; font-weight:700; color:#15803d; text-transform:uppercase; letter-spacing:1.5px; }
  .amount-value { font-size:36px; font-weight:900; color:#15803d; letter-spacing:-1px; }
  .pid-table { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; }
  .pid-row { display:flex; justify-content:space-between; padding:10px 20px; border-bottom:1px solid #f1f5f9; }
  .pid-row:last-child { border-bottom:none; }
  .pid-key { font-size:12px; font-weight:700; color:#64748b; }
  .pid-val { font-size:12px; font-weight:800; color:#1e293b; font-family:monospace; }
  .footer { margin-top:48px; padding-top:24px; border-top:2px dashed #e2e8f0; display:flex; justify-content:space-between; align-items:center; }
  .footer-left { font-size:11px; color:#94a3b8; font-weight:600; line-height:1.6; }
  .verified { display:inline-flex; align-items:center; gap:6px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:20px; padding:6px 14px; font-size:11px; font-weight:700; color:#15803d; }
  @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
</style>
</head>
<body>
<div class="page">
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
      <div class="number">${receipt.receiptNo}</div>
    </div>
  </div>

  <div class="banner">
    <div class="banner-icon">✓</div>
    <div>
      <div class="banner-title">Payment Successful</div>
      <div class="banner-sub">Booking confirmed — ${dateStr}</div>
    </div>
  </div>

  <div class="amount-box">
    <div>
      <div class="amount-label">Total Amount Paid</div>
      <div style="font-size:11px;color:#4ade80;font-weight:600;margin-top:2px;">Monthly Advance · Fully Secured</div>
    </div>
    <div class="amount-value">₹${amount}</div>
  </div>

  <div class="section">
    <div class="section-title">Customer Information</div>
    <div class="grid-2">
      <div class="card"><div class="card-label">Full Name</div><div class="card-value">${receipt.customer?.name || "—"}</div></div>
      <div class="card"><div class="card-label">Age</div><div class="card-value">${receipt.customer?.age || "—"} years</div></div>
      <div class="card"><div class="card-label">Mobile</div><div class="card-value">+91 ${receipt.customer?.phone || "—"}</div></div>
      <div class="card"><div class="card-label">Email</div><div class="card-value">${receipt.customer?.email || "—"}</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Booking Details</div>
    <div class="grid-2">
      <div class="card"><div class="card-label">Property</div><div class="card-value">${receipt.property?.name || "—"}</div></div>
      <div class="card"><div class="card-label">Room Type</div><div class="card-value">${receipt.room?.name || "—"}</div></div>
      <div class="card"><div class="card-label">Location</div><div class="card-value">${receipt.property?.location || "—"}, ${receipt.property?.city || "—"}</div></div>
      <div class="card"><div class="card-label">Occupancy</div><div class="card-value">${receipt.room?.occupancy || "—"}</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Transaction Details</div>
    <div class="pid-table">
      <div class="pid-row"><span class="pid-key">Razorpay Payment ID</span><span class="pid-val">${receipt.paymentId}</span></div>
      <div class="pid-row"><span class="pid-key">Payment Method</span><span class="pid-val">Razorpay Secure Gateway</span></div>
      <div class="pid-row"><span class="pid-key">Status</span><span class="pid-val" style="color:#15803d;">✓ CAPTURED</span></div>
      <div class="pid-row"><span class="pid-key">Date & Time</span><span class="pid-val">${dateStr}</span></div>
    </div>
  </div>

  <div class="footer">
    <div class="footer-left">BedBuddy — Find Your Perfect Stay<br/>support@bedbuddy.com<br/>Computer-generated receipt. No signature required.</div>
    <div style="text-align:right">
      <div class="verified">✓ Verified & Authentic</div>
      <div style="margin-top:8px;font-size:11px;color:#94a3b8;font-weight:600;">Powered by Razorpay</div>
    </div>
  </div>
</div>
</body>
</html>`;

    const win = window.open("", "_blank", "width=900,height=700");
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
};

// ─── Main Component ───────────────────────────────────────────────────────────
const PaymentReceipts = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [receipts, setReceipts] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        loadReceipts();
    }, []);

    const loadReceipts = () => {
        try {
            const data = JSON.parse(localStorage.getItem("bb_receipts") || "[]");
            setReceipts(data);
        } catch { setReceipts([]); }
    };

    const deleteReceipt = (id) => {
        const updated = receipts.filter(r => r.id !== id);
        localStorage.setItem("bb_receipts", JSON.stringify(updated));
        setReceipts(updated);
        if (selected?.id === id) setSelected(null);
    };

    const formatDate = (iso) => new Date(iso).toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
    });

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-sm">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Receipt className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-2">Login Required</h2>
                    <p className="text-slate-500 text-sm mb-6">Please log in to view your payment receipts.</p>
                    <button onClick={() => navigate("/login")} className="w-full py-3 rounded-2xl bg-primary text-white font-bold">
                        Log In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar />
            <main className="pt-28 pb-20">
                <div className="container max-w-6xl px-4">

                    {/* ── Page Header ── */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors mb-6">
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </Link>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                        <Receipt className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payment Receipts</h1>
                                        <p className="text-slate-500 font-medium text-sm">{receipts.length} successful booking{receipts.length !== 1 ? "s" : ""}</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={loadReceipts}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:border-primary/40 hover:text-primary transition-all shadow-sm"
                            >
                                <RefreshCw className="w-4 h-4" /> Refresh
                            </button>
                        </div>
                    </motion.div>

                    {/* ── Empty State ── */}
                    {receipts.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-24 text-center"
                        >
                            <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center mb-6">
                                <FileText className="w-12 h-12 text-slate-300" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">No Receipts Yet</h2>
                            <p className="text-slate-500 font-medium max-w-sm mb-8">
                                Your payment receipts will appear here after you complete a booking.
                            </p>
                            <button
                                onClick={() => navigate("/")}
                                className="px-8 py-4 rounded-2xl bg-primary text-white font-black hover:bg-primary/90 transition-all shadow-xl shadow-primary/25"
                            >
                                Browse Properties
                            </button>
                        </motion.div>
                    )}

                    {/* ── Receipts Grid ── */}
                    {receipts.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                            {/* Left: Receipt List */}
                            <div className="lg:col-span-5 space-y-4">
                                {receipts.map((receipt, i) => (
                                    <motion.div
                                        key={receipt.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => setSelected(receipt)}
                                        className={`relative p-5 rounded-[1.5rem] bg-white border-2 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-lg group ${selected?.id === receipt.id
                                            ? "border-primary shadow-primary/10"
                                            : "border-slate-100 hover:border-primary/30"
                                            }`}
                                    >
                                        {/* Status dot */}
                                        <div className="absolute top-4 right-4 flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Paid</span>
                                        </div>

                                        {/* Property info */}
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <MapPin className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-black text-slate-900 text-base truncate">{receipt.property?.name}</h3>
                                                <p className="text-xs font-bold text-slate-400 mt-0.5">{receipt.property?.location}, {receipt.property?.city}</p>
                                            </div>
                                        </div>

                                        {/* Room & amount row */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-xs font-bold text-slate-600">{receipt.room?.name}</span>
                                            </div>
                                            <span className="text-lg font-black text-primary">₹{receipt.amount?.toLocaleString()}</span>
                                        </div>

                                        {/* Date & receipt no */}
                                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-3 border-t border-slate-50">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" />
                                                {formatDate(receipt.date)}
                                            </div>
                                            <span>{receipt.receiptNo}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Right: Receipt Detail */}
                            <div className="lg:col-span-7">
                                <AnimatePresence mode="wait">
                                    {!selected ? (
                                        <motion.div
                                            key="empty"
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="h-full flex flex-col items-center justify-center py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200"
                                        >
                                            <FileText className="w-12 h-12 text-slate-200 mb-4" />
                                            <p className="font-bold text-slate-400">Select a receipt to view details</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key={selected.id}
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden"
                                        >
                                            {/* Card top bar */}
                                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                                    <div>
                                                        <p className="text-white font-black text-base">Payment Confirmed</p>
                                                        <p className="text-white/70 text-xs font-bold">{selected.receiptNo}</p>
                                                    </div>
                                                </div>
                                                <span className="text-2xl font-black text-white">₹{selected.amount?.toLocaleString()}</span>
                                            </div>

                                            <div className="p-6 space-y-5">
                                                {/* Customer */}
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Customer Information</p>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {[
                                                            { icon: User, label: "Name", value: selected.customer?.name },
                                                            { icon: Hash, label: "Age", value: `${selected.customer?.age} years` },
                                                            { icon: Phone, label: "Mobile", value: `+91 ${selected.customer?.phone}` },
                                                            { icon: Mail, label: "Email", value: selected.customer?.email },
                                                        ].map(({ icon: Icon, label, value }) => (
                                                            <div key={label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                                    <Icon className="w-3.5 h-3.5 text-primary" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">{label}</p>
                                                                    <p className="text-xs font-black text-slate-800 truncate max-w-[100px]">{value || "—"}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Property */}
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Booking Details</p>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {[
                                                            { label: "Property", value: selected.property?.name },
                                                            { label: "Room", value: selected.room?.name },
                                                            { label: "Location", value: `${selected.property?.location}, ${selected.property?.city}` },
                                                            { label: "Occupancy", value: selected.room?.occupancy },
                                                        ].map(({ label, value }) => (
                                                            <div key={label} className="p-3 bg-slate-50 rounded-xl">
                                                                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">{label}</p>
                                                                <p className="text-xs font-black text-slate-800">{value || "—"}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Transaction */}
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Transaction Info</p>
                                                    <div className="bg-slate-50 rounded-2xl divide-y divide-slate-100 overflow-hidden">
                                                        {[
                                                            { label: "Payment ID", value: selected.paymentId, mono: true },
                                                            { label: "Date", value: formatDate(selected.date) },
                                                            { label: "Status", value: "✓ CAPTURED", green: true },
                                                            { label: "Gateway", value: "Razorpay" },
                                                        ].map(({ label, value, mono, green }) => (
                                                            <div key={label} className="flex justify-between items-center px-4 py-2.5">
                                                                <span className="text-xs font-bold text-slate-500">{label}</span>
                                                                <span className={`text-xs font-black ${green ? "text-green-600" : mono ? "font-mono text-slate-700" : "text-slate-800"} max-w-[180px] truncate text-right`}>{value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Action buttons */}
                                                <div className="flex gap-3 pt-2">
                                                    <button
                                                        onClick={() => generateReceiptPDF(selected)}
                                                        className="flex-1 h-13 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Download PDF
                                                    </button>
                                                    <button
                                                        onClick={() => deleteReceipt(selected.id)}
                                                        className="h-13 py-3.5 px-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-500 font-black text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PaymentReceipts;