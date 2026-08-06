import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Search, MessageSquare, PhoneCall, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const categories = ["All", "Students & Booking", "Owners & Hosts", "Payments & Refunds", "Verification"];

const faqs = [
    {
        category: "Students & Booking",
        question: "How do I search and book a hostel, PG, or apartment?",
        answer: "Simply enter your preferred city or college name in the search bar on the home page. Browse through verified properties, review amenities, photos, and monthly rent, then click 'Book Now' or 'Contact Host' to reserve your spot."
    },
    {
        category: "Students & Booking",
        question: "Is there any hidden fee during booking?",
        answer: "No. NestNode is committed to 100% pricing transparency. All monthly rent charges, refundable security deposit details, and utility fees are clearly broken down upfront before you make a payment."
    },
    {
        category: "Students & Booking",
        question: "Can I schedule a physical site visit before paying?",
        answer: "Yes! You can contact the property host directly via phone or WhatsApp from the property listing page to schedule a site visit at your preferred date and time."
    },
    {
        category: "Owners & Hosts",
        question: "I am a property owner. How can I list my hostel or PG?",
        answer: "Click on 'Join as Owner' in the top right menu, create your free owner account, and complete your property listing form with photos, pricing, amenities, and location. Once verified by our team, your ad goes live instantly!"
    },
    {
        category: "Owners & Hosts",
        question: "How do I promote my property on the home page?",
        answer: "In your Owner Dashboard under the 'Promote & Ads' section, you can launch a sponsored campaign to feature your property banner on the home page to attract maximum student bookings."
    },
    {
        category: "Payments & Refunds",
        question: "What payment methods are supported?",
        answer: "We support all major Indian payment channels including UPI (Google Pay, PhonePe, Paytm), Debit Cards, Credit Cards, Net Banking, and direct host transfers."
    },
    {
        category: "Payments & Refunds",
        question: "What is your refund policy if I cancel my booking?",
        answer: "Full 100% refunds are provided for cancellations requested at least 15 days before your scheduled move-in date. Check our Refund & Cancellation Policy page for detailed terms."
    },
    {
        category: "Verification",
        question: "How does NestNode verify properties and owners?",
        answer: "Our verification team performs physical property audits, checks government identity proofs of property managers, and verifies high-resolution photos before awarding the 'NestNode Verified' badge."
    }
];

const FAQ = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [openIndex, setOpenIndex] = useState(0);

    const filteredFaqs = faqs.filter(faq => {
        const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
            <Navbar />
            
            <main className="flex-1">
                {/* Hero Banner */}
                <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-28 pb-20">
                    <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="container max-w-4xl mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-16 h-16 bg-blue-500/10 border border-blue-400/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6 shadow-xl">
                                <HelpCircle className="w-8 h-8" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-heading">
                                Frequently Asked Questions
                            </h1>
                            <p className="mt-3 text-slate-400 text-base sm:text-lg max-w-xl font-medium">
                                Everything you need to know about booking, host verification, payments, and student living on NestNode.
                            </p>

                            {/* Search Input */}
                            <div className="mt-8 w-full max-w-lg relative">
                                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search questions (e.g., refund, verify, list property)..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-sm font-medium shadow-2xl"
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* FAQ Content Area */}
                <section className="py-16 sm:py-20">
                    <div className="container max-w-4xl mx-auto px-4">
                        
                        {/* Category Filter Pills */}
                        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-10">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => {
                                        setActiveCategory(cat);
                                        setOpenIndex(0);
                                    }}
                                    className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                                        activeCategory === cat
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
                                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Questions Accordion List */}
                        <div className="space-y-4">
                            {filteredFaqs.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
                                    <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <h3 className="text-lg font-bold text-slate-800">No questions found</h3>
                                    <p className="text-xs text-slate-500 mt-1">Try searching with a different keyword or browse all categories.</p>
                                </div>
                            ) : (
                                filteredFaqs.map((faq, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                                        className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
                                    >
                                        <button
                                            onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                                            className="w-full p-6 text-left flex justify-between items-center bg-white gap-4"
                                        >
                                            <span className="font-extrabold text-slate-800 text-base sm:text-lg leading-snug">
                                                {faq.question}
                                            </span>
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                                openIndex === idx ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
                                            </div>
                                        </button>

                                        <AnimatePresence>
                                            {openIndex === idx && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-6 pb-6 pt-2 text-slate-600 text-sm leading-relaxed border-t border-slate-100 font-medium">
                                                        {faq.answer}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Still Have Questions Box */}
                        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-10 text-white text-center shadow-xl shadow-blue-600/20 relative overflow-hidden">
                            <div className="relative z-10 max-w-xl mx-auto space-y-4">
                                <h3 className="text-2xl sm:text-3xl font-black font-heading">Still Have Questions?</h3>
                                <p className="text-sm text-blue-100 font-medium leading-relaxed">
                                    Can't find the answer you're looking for? Please reach out to our friendly support team for instant assistance.
                                </p>
                                <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                                    <Link
                                        to="/contact"
                                        className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center gap-2"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        Contact Us Page
                                    </Link>
                                    <a
                                        href="tel:+917859988312"
                                        className="bg-blue-700/60 hover:bg-blue-700 text-white border border-blue-400/30 font-bold px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                                    >
                                        <PhoneCall className="w-4 h-4" />
                                        +91 78599 88312
                                    </a>
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

export default FAQ;
