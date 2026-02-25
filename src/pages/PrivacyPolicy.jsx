import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Lock, Eye, ShieldCheck, Database, FileText } from "lucide-react";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <Navbar />
            <main>
                <section className="bg-emerald-50/50 pt-24 pb-16 border-b border-emerald-100">
                    <div className="container max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-4 mb-6"
                        >
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-emerald-200 flex items-center justify-center text-emerald-600">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
                        </motion.div>
                        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                            Your privacy is paramount. This policy outlines how we collect, use,
                            and protect your personal information at BedBuddy.
                        </p>
                    </div>
                </section>

                <section className="container max-w-5xl py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2 space-y-12">
                            <article className="prose prose-emerald max-w-none">
                                <section>
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                        <Database className="w-6 h-6 text-emerald-600" />
                                        1. Information Collection
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        We collect information you provide directly to us (name, email, phone)
                                        and data related to your property searches or listings to provide a
                                        personalized experience.
                                    </p>
                                </section>

                                <section className="mt-12">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                        <Eye className="w-6 h-6 text-emerald-600" />
                                        2. Data Usage
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Your data is used solely to improve our services, facilitate
                                        owner-tenant communication, and ensure the safety of our community.
                                        We never sell your personal information to third parties.
                                    </p>
                                </section>

                                <section className="mt-12 bg-emerald-50 p-8 rounded-3xl border border-emerald-100">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                                        3. Safety & Security
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        We implement industry-standard encryption and security protocols to
                                        prevent unauthorized access or data breaches. Our systems are
                                        monitored 24/7 for potential threats.
                                    </p>
                                </section>

                                <section className="mt-12">
                                    <h2 className="text-2xl font-bold mb-4">4. Your Data Rights</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        You have the right to access, update, or delete your personal data
                                        at any time through your account settings or by contacting our
                                        privacy officer.
                                    </p>
                                </section>
                            </article>
                        </div>

                        <div className="space-y-8">
                            <div className="sticky top-24 p-8 bg-emerald-50 rounded-[2rem] border border-emerald-200">
                                <h4 className="font-bold mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-emerald-600" />
                                    Privacy Summary
                                </h4>
                                <ul className="text-sm space-y-4 text-muted-foreground font-medium">
                                    <li>• No selling of user data</li>
                                    <li>• End-to-end encryption</li>
                                    <li>• Transparent data usage</li>
                                    <li>• Full control over your account</li>
                                </ul>
                                <hr className="my-6 border-emerald-200" />
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Questions? Contact our Data Privacy Officer at privacy@bedbuddy.in
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

export default PrivacyPolicy;
