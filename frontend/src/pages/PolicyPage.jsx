import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { 
    ShieldCheck, 
    FileText, 
    CheckCircle2, 
    Scale, 
    Lock, 
    RotateCcw, 
    BookOpen, 
    HeartHandshake,
    ArrowLeft,
    HelpCircle,
    Mail
} from "lucide-react";

const legalTabs = [
    { title: "Terms of Service", path: "/terms", icon: Scale },
    { title: "Privacy Policy", path: "/privacy", icon: Lock },
    { title: "Refund Policy", path: "/refund", icon: RotateCcw },
    { title: "Booking Policy", path: "/booking-policy", icon: BookOpen },
    { title: "Non-Discrimination", path: "/equality", icon: HeartHandshake },
    { title: "Cancellation", path: "/cancellation", icon: ShieldCheck },
];

const PolicyPage = ({ title, lastUpdated, content, icon: HeaderIcon = ShieldCheck }) => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
            <Navbar />
            
            <main className="flex-1">
                {/* Hero Header */}
                <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-28 pb-20">
                    {/* Background glow effects */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="container max-w-6xl mx-auto px-4 relative z-10">
                        {/* Back Link */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link 
                                to="/"
                                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors mb-6 group"
                            >
                                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                Back to Home
                            </Link>
                        </motion.div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                                    <HeaderIcon className="w-4 h-4" />
                                    <span>Official Policy Document</span>
                                </div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-heading">
                                    {title}
                                </h1>
                                <p className="mt-3 text-slate-400 text-sm sm:text-base font-medium max-w-xl">
                                    Last Updated: <span className="text-white font-semibold">{lastUpdated}</span>. Please review how NestNode manages {title.toLowerCase()}.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="bg-slate-800/80 backdrop-blur-md border border-slate-700/60 p-5 rounded-2xl max-w-xs shadow-2xl"
                            >
                                <div className="flex items-center gap-3 text-emerald-400 font-bold text-sm mb-1">
                                    <ShieldCheck className="w-5 h-5" />
                                    <span>100% Verified Guidelines</span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    All policies are designed to protect both student tenants and verified property hosts.
                                </p>
                            </motion.div>
                        </div>

                        {/* Top Policy Quick Navigation Pills */}
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="mt-10 pt-6 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar pb-2"
                        >
                            {legalTabs.map((tab) => {
                                const isActive = location.pathname === tab.path;
                                const IconComp = tab.icon;
                                return (
                                    <Link
                                        key={tab.path}
                                        to={tab.path}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                            isActive 
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105" 
                                                : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50"
                                        }`}
                                    >
                                        <IconComp className="w-3.5 h-3.5" />
                                        <span>{tab.title}</span>
                                    </Link>
                                );
                            })}
                        </motion.div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-16 sm:py-20">
                    <div className="container max-w-6xl mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            
                            {/* Left Main Content */}
                            <div className="lg:col-span-8 space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100"
                                >
                                    <div className="space-y-10">
                                        {content && content.map((section, idx) => (
                                            <motion.div 
                                                key={idx}
                                                initial={{ opacity: 0, y: 15 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                                className="group"
                                            >
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 font-black text-sm flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                                                        {idx + 1}
                                                    </div>
                                                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-1">
                                                        {section.heading}
                                                    </h2>
                                                </div>

                                                <div className="pl-13 space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                                                    {section.paragraphs && section.paragraphs.map((p, pIdx) => (
                                                        <p key={pIdx} className="font-medium text-slate-600">
                                                            {p}
                                                        </p>
                                                    ))}
                                                </div>

                                                {idx < content.length - 1 && (
                                                    <hr className="mt-8 border-slate-100" />
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Right Sidebar */}
                            <div className="lg:col-span-4 space-y-6">
                                {/* Navigation Sidebar Box */}
                                <div className="sticky top-28 space-y-6">
                                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-4">
                                        <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                            Legal Directory
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium">
                                            Easily navigate through all NestNode legal documentation:
                                        </p>
                                        <div className="space-y-1.5 pt-2">
                                            {legalTabs.map((tab) => {
                                                const isActive = location.pathname === tab.path;
                                                const IconComp = tab.icon;
                                                return (
                                                    <Link
                                                        key={tab.path}
                                                        to={tab.path}
                                                        className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                                                            isActive
                                                                ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2.5">
                                                            <IconComp className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                                                            <span>{tab.title}</span>
                                                        </div>
                                                        {isActive && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Support Card */}
                                    <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 p-6 rounded-3xl text-white shadow-xl shadow-blue-600/20 space-y-4">
                                        <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                                            <HelpCircle className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-lg">Have Questions?</h4>
                                            <p className="text-xs text-blue-100 mt-1 leading-relaxed font-medium">
                                                Our support team is available 24/7 to clarify any policy or booking concerns.
                                            </p>
                                        </div>
                                        <Link 
                                            to="/contact"
                                            className="inline-flex items-center justify-center gap-2 w-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-md active:scale-95"
                                        >
                                            <Mail className="w-4 h-4" />
                                            Contact Support Team
                                        </Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default PolicyPage;
