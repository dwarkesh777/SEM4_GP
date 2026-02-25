import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-24 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-heading font-bold text-foreground mb-6">Privacy Policy</h1>
                    <div className="prose prose-blue max-w-none text-muted-foreground space-y-6">
                        <p>Last Updated: February 2026</p>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground">1. Information We Collect</h2>
                            <p>
                                We collect information that you provide directly to us, such as when you create an account,
                                list a property, or contact us for support. This may include your name, email, phone number,
                                and property details.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground">2. How We Use Information</h2>
                            <p>
                                We use the information we collect to provide, maintain, and improve our services,
                                to communicate with you, and to protect BedBuddy and our users.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground">3. Information Sharing</h2>
                            <p>
                                We do not share your personal information with third parties except as described in
                                this policy, such as with your consent or to comply with legal obligations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground">4. Data Security</h2>
                            <p>
                                We take reasonable measures to protect your personal information from loss, theft,
                                misuse, and unauthorized access, disclosure, alteration, and destruction.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground">5. Your Choices</h2>
                            <p>
                                You may update or delete your account information at any time by logging into your account
                                settings or contacting our support team.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
