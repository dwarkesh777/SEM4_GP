import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Scale, FileText, CheckCircle2 } from "lucide-react";

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <Navbar />
            <main>
                <section className="bg-slate-50 pt-24 pb-16 border-b border-slate-200">
                    <div className="container max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-4 mb-6"
                        >
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-700">
                                <Scale className="w-6 h-6" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Terms of Service</h1>
                        </motion.div>
                        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                            Last Updated: February 2026. These terms govern your use of the BedBuddy
                            platform and services.
                        </p>
                    </div>
                </section>

                <section className="container max-w-5xl py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2 space-y-12">
                            <article className="prose prose-slate max-w-none">
                                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    By accessing or using BedBuddy, you agree to be bound by these Terms of Service.
                                    If you do not agree, please do not use our services.
                                </p>

                                <h2 className="text-2xl font-bold mt-12 mb-4">2. User Accounts</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    You are responsible for maintaining the confidentiality of your account credentials.
                                    BedBuddy reserves the right to suspend accounts that violate our community guidelines.
                                </p>

                                <h2 className="text-2xl font-bold mt-12 mb-4">3. Property Listings</h2>
                                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 my-8">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        Owners must provide accurate information, pricing, and high-quality images.
                                        Any misleading listings will be removed immediately.
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            "Accurate availability status",
                                            "Clear pricing without hidden costs",
                                            "Verified property documentation"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm font-medium">
                                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <h2 className="text-2xl font-bold mt-12 mb-4">4. Limitation of Liability</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    BedBuddy is a marketplace platform. While we verify listings, users should
                                    perform their own due diligence before making payments directly to owners.
                                </p>
                            </article>
                        </div>

                        <div className="space-y-8">
                            <div className="sticky top-24 p-8 bg-slate-50 rounded-[2rem] border border-slate-200">
                                <h4 className="font-bold mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-slate-500" />
                                    Sections
                                </h4>
                                <nav className="text-sm space-y-3 text-muted-foreground font-medium">
                                    <a href="#" className="block hover:text-primary transition-colors">1. Acceptance</a>
                                    <a href="#" className="block hover:text-primary transition-colors">2. User Accounts</a>
                                    <a href="#" className="block hover:text-primary transition-colors">3. Property Listings</a>
                                    <a href="#" className="block hover:text-primary transition-colors">4. Liability</a>
                                </nav>
                                <hr className="my-6 border-slate-200" />
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Have questions about our terms? Reach out to our legal team at legal@bedbuddy.in
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default TermsOfService;
