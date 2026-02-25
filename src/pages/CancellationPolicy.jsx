import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { RefreshCcw, Clock, AlertCircle, FileText } from "lucide-react";

const CancellationPolicy = () => {
    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <Navbar />
            <main>
                <section className="bg-blue-50/50 pt-24 pb-16 border-b border-blue-100">
                    <div className="container max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-4 mb-6"
                        >
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-blue-100 flex items-center justify-center text-primary">
                                <RefreshCcw className="w-6 h-6" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Cancellation Policy</h1>
                        </motion.div>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Our guidelines for bookings, refunds, and security deposits to ensure
                            a fair experience for both residents and owners.
                        </p>
                    </div>
                </section>

                <section className="container max-w-5xl py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2 space-y-12">
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                            >
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Clock className="w-6 h-6 text-primary" />
                                    Standard Refund Terms
                                </h2>
                                <div className="space-y-4">
                                    {[
                                        { label: "Full Refund", time: "Within 24 Hours", detail: "If check-in is at least 7 days away from the booking time.", color: "bg-emerald-50 border-emerald-100" },
                                        { label: "50% Refund", time: "15 Days Prior", detail: "Eligible for a partial refund of the security deposit balance.", color: "bg-blue-50 border-blue-100" },
                                        { label: "No Refund", time: "Under 7 Days", detail: "Cancellations within a week of check-in are typically non-refundable.", color: "bg-gray-50 border-gray-100" },
                                    ].map((policy, i) => (
                                        <div key={i} className={`p-6 rounded-2xl border ${policy.color}`}>
                                            <div className="flex justify-between items-baseline mb-2">
                                                <span className="font-bold text-lg">{policy.label}</span>
                                                <span className="text-sm font-bold uppercase tracking-wider opacity-60">{policy.time}</span>
                                            </div>
                                            <p className="text-muted-foreground">{policy.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="bg-white p-10 rounded-3xl border border-border shadow-sm"
                            >
                                <h3 className="text-xl font-bold mb-6">Security Deposits</h3>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Security deposits are handled directly between the tenant and the owner.
                                    BedBuddy does not hold or process security deposits.
                                </p>
                                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                    <AlertCircle className="w-6 h-6 text-orange-500 mt-1 shrink-0" />
                                    <p className="text-sm text-orange-800 font-medium">
                                        We strongly recommend obtaining a digital receipt for any deposit paid
                                        and discussing physical refund terms before check-in.
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        <div className="space-y-8">
                            <div className="sticky top-24 p-8 bg-secondary/20 rounded-[2rem] border border-border">
                                <h4 className="font-bold mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Quick Summary
                                </h4>
                                <ul className="text-sm space-y-4 text-muted-foreground">
                                    <li>• Direct owner-tenant refunds</li>
                                    <li>• 24h grace period for full refund</li>
                                    <li>• Security deposits not held by us</li>
                                    <li>• Mediation available for disputes</li>
                                </ul>
                                <hr className="my-6 border-border" />
                                <button className="w-full py-4 text-primary font-bold hover:underline">
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default CancellationPolicy;
