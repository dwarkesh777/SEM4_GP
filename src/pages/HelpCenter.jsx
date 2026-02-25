import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const HelpCenter = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-24 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-heading font-bold text-foreground mb-6">Help Center</h1>
                    <p className="text-muted-foreground mb-8">
                        Find answers to common questions about BedBuddy. If you can't find what you're looking for,
                        reach out to our support team.
                    </p>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>How do I book a hostel or PG?</AccordionTrigger>
                                    <AccordionContent>
                                        Simply browse through our listings, select a property you like, click "View Details",
                                        and use the contact information provided (Phone/Email) to reach out to the owner
                                        directly for booking.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Is there a service fee for students?</AccordionTrigger>
                                    <AccordionContent>
                                        No, BedBuddy is completely free for students and tenants to use.
                                        We do not charge any commission or service fee from seekers.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>How are the properties verified?</AccordionTrigger>
                                    <AccordionContent>
                                        Our team reviews every listing for authenticity. Owners are required to provide
                                        valid identification and property documents before their listings are fully approved.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>Can I list my property on BedBuddy?</AccordionTrigger>
                                    <AccordionContent>
                                        Yes! If you are a property owner, click on "For Owners" in the footer or navigation
                                        to create an account and list your hostel or PG.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </section>

                        <section className="bg-secondary/30 p-8 rounded-2xl">
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Still need help?</h2>
                            <p className="text-muted-foreground mb-6">
                                Contact our support team directly for any specific queries.
                            </p>
                            <div className="space-y-2 text-primary font-medium">
                                <p>Email: hello@bedbuddy.in</p>
                                <p>Phone: +91 98765 43210</p>
                                <p>Address: Navrangpura, Ahmedabad, Gujarat, India</p>
                            </div>
                        </section>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default HelpCenter;
