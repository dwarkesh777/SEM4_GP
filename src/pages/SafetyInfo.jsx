import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, PhoneCall } from "lucide-react";

const SafetyInfo = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-24 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-heading font-bold text-foreground mb-6 text-center">Your Safety is Our Priority</h1>
                    <p className="text-muted-foreground mb-12 text-center text-lg">
                        At BedBuddy, we go the extra mile to ensure every stay listed on our platform is safe and secure.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="p-6 rounded-2xl bg-secondary/20 border border-border">
                            <Shield className="w-10 h-10 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
                            <p className="text-muted-foreground text-sm">
                                Every property goes through a multi-step verification process, including identity checks for owners.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-secondary/20 border border-border">
                            <Lock className="w-10 h-10 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Secure Information</h3>
                            <p className="text-muted-foreground text-sm">
                                Your personal data is encrypted and never shared with third parties without your explicit consent.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-secondary/20 border border-border">
                            <Eye className="w-10 h-10 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Transparent Reviews</h3>
                            <p className="text-muted-foreground text-sm">
                                Real reviews from real residents help you make informed decisions about the property's safety standards.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-secondary/20 border border-border">
                            <PhoneCall className="w-10 h-10 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                            <p className="text-muted-foreground text-sm">
                                Our support team is available around the clock to assist you with any safety concerns.
                            </p>
                        </div>
                    </div>

                    <div className="prose prose-blue max-w-none text-muted-foreground space-y-6">
                        <h2 className="text-2xl font-semibold text-foreground">Safety Tips for Students</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Always visit the property in person before making any major payments.</li>
                            <li>Check for basic safety features like fire extinguishers, emergency exits, and CCTV.</li>
                            <li>Meet the owner and roommates during your visit.</li>
                            <li>Read the rental agreement carefully before signing.</li>
                            <li>Report any suspicious listings or behavior to the BedBuddy team immediately.</li>
                        </ul>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default SafetyInfo;
