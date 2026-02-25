import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-24 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-heading font-bold text-foreground mb-6">Terms of Service</h1>
                    <div className="prose prose-blue max-w-none text-muted-foreground space-y-6">
                        <p>Last Updated: February 2026</p>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using BedBuddy, you agree to comply with and be bound by these Terms of Service.
                                If you do not agree to these terms, please do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground">2. User Accounts</h2>
                            <p>
                                To access certain features, you may be required to create an account. You are responsible for
                                maintaining the confidentiality of your account information and for all activities that
                                occur under your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground">3. Property Listings</h2>
                            <p>
                                Property owners are solely responsible for the accuracy and legality of their listings.
                                BedBuddy reserves the right to remove any listing that violates our policies or
                                receiver significant negative feedback.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground">4. Liability</h2>
                            <p>
                                BedBuddy is a platform for information exchange. We are not a party to any rental agreements
                                and are not liable for any disputes, damages, or losses arising from the interaction
                                between owners and tenants.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground">5. Modifications</h2>
                            <p>
                                We reserved the right to modify these terms at any time. Continued use of the platform after
                                changes constitutes acceptance of the new terms.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default TermsOfService;
