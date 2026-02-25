import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const CancellationPolicy = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-24 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-heading font-bold text-foreground mb-6">Cancellation Policy</h1>
                    <div className="prose prose-blue max-w-none text-muted-foreground space-y-6">
                        <p>
                            At BedBuddy, we aim to make the booking and cancellation process as transparent as possible.
                            As a platform that connects students with property owners, the specific cancellation terms
                            may vary depending on the individual property.
                        </p>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground">Standard Cancellation Terms</h2>
                            <p>
                                Unless otherwise specified by the property owner, the following standard terms apply to
                                bookings made through BedBuddy:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Full Refund:</strong> Cancellations made within 24 hours of booking, provided the check-in date is at least 7 days away.</li>
                                <li><strong>Partial Refund:</strong> Cancellations made at least 15 days before the check-in date may be eligible for a 50% refund of the security deposit.</li>
                                <li><strong>No Refund:</strong> Cancellations made less than 7 days before the check-in date are typically non-refundable.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground">Security Deposits</h2>
                            <p>
                                Security deposits are handled directly between the tenant and the owner. BedBuddy does not hold
                                or process security deposits. We recommend obtaining a clear receipt for any deposit paid
                                and discussing physical refund terms before check-in.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground">Disputes</h2>
                            <p>
                                In case of a dispute regarding cancellations or refunds, BedBuddy can act as a mediator
                                between the parties. However, the final decision rests on the agreed-upon terms between
                                the owner and the tenant at the time of booking.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default CancellationPolicy;
