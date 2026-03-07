import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, BookOpen, CreditCard, ShieldCheck, UserCircle, MessageCircle, Phone } from "lucide-react";
import SupportButton from '@/components/SupportButton';

const HelpCenter = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const categories = [
        { icon: <BookOpen className="w-6 h-6" />, title: "Booking Guide", desc: "How to find and book your stay" },
        { icon: <CreditCard className="w-6 h-6" />, title: "Payments", desc: "Understanding deposits & rent" },
        { icon: <ShieldCheck className="w-6 h-6" />, title: "Safety", desc: "Our verification & safety rules" },
        { icon: <UserCircle className="w-6 h-6" />, title: "For Owners", desc: "Managing your property listings" },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main>
                {/* Header Section */}
                <section className="bg-gradient-to-b from-[#0070E0] to-[#005bb5] pt-24 pb-32">
                    <div className="container text-center">
                        <motion.h1
                            {...fadeIn}
                            className="text-4xl md:text-5xl font-bold text-white mb-6"
                        >
                            How can we help you?
                        </motion.h1>
                        <motion.div
                            {...fadeIn}
                            transition={{ delay: 0.2 }}
                            className="max-w-2xl mx-auto relative"
                        >
                            <input
                                type="text"
                                placeholder="Search for answers..."
                                className="w-full py-4 px-6 pl-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-lg"
                            />
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/60 w-6 h-6" />
                        </motion.div>
                    </div>
                </section>

                {/* Categories Grid */}
                <div className="container -mt-16 mb-24">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((cat, i) => (
                            <motion.div
                                key={cat.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-border/50 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
                            >
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors mb-6">
                                    {cat.icon}
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-2">{cat.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <section className="container max-w-4xl py-12 mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-muted-foreground">Quick answers to the most common questions from our community.</p>
                    </div>

                    <Accordion type="single" collapsible className="space-y-4">
                        {[
                            {
                                q: "How do I book a hostel or PG?",
                                a: "Simply browse through our listings, select a property you like, click \"View Details\", and use the contact information provided (Phone/Email) to reach out to the owner directly for booking."
                            },
                            {
                                q: "Is there a service fee for students?",
                                a: "No, BedBuddy is completely free for students and tenants to use. We do not charge any commission or service fee from seekers."
                            },
                            {
                                q: "How are the properties verified?",
                                a: "Our team reviews every listing for authenticity. Owners are required to provide valid identification and property documents before their listings are fully approved."
                            },
                            {
                                q: "Can I cancel my booking?",
                                a: "Yes, you can cancel, but refund terms depend on the specific property owner's policy. We recommend discussing this with the owner before making any payments."
                            }
                        ].map((faq, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="border rounded-2xl px-6 bg-white overflow-hidden shadow-sm">
                                <AccordionTrigger className="hover:no-underline font-bold text-lg text-left py-6">
                                    {faq.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-[16px]">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </section>

                {/* Support Card */}
                <section className="container mb-24">
                    <div className="bg-foreground rounded-[2.5rem] p-12 text-center text-background relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF66AA]/10 blur-[100px] pointer-events-none" />

                        <h2 className="text-3xl font-bold mb-6 relative z-10">Still have questions?</h2>
                        <p className="text-background/60 mb-10 max-w-xl mx-auto relative z-10">
                            Our support team is always here to help you find your perfect home.
                            Get in touch via email or phone.
                        </p>

                        <div className="flex flex-wrap justify-center gap-6 relative z-10">
                            <SupportButton 
                                variant="primary" 
                                size="lg"
                                onClick={() => window.location.href = '/support'}
                                icon="message"
                            >
                                Email Support
                            </SupportButton>
                            <SupportButton 
                                variant="secondary" 
                                size="lg"
                                onClick={() => window.location.href = '/support'}
                                icon="phone"
                            >
                                Call Us
                            </SupportButton>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default HelpCenter;
