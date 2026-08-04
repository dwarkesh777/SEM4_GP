import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
    {
        question: "How do I book a hostel or PG?",
        answer: "You can book by searching for your desired location, selecting a property, and clicking the 'Book Now' button. You'll need to create a student account to complete the booking."
    },
    {
        question: "Is there any booking fee?",
        answer: "NestNode charges a small service fee to maintain the platform, which will be clearly displayed during checkout before you finalize your booking."
    },
    {
        question: "Can I cancel my booking?",
        answer: "Yes, you can cancel your booking. Please refer to our Refund Policy and Cancellation Policy for detailed information on deadlines and eligible refund amounts."
    },
    {
        question: "How are properties verified?",
        answer: "Our team personally visits and verifies each property before listing it on the platform to ensure high quality and safety standards."
    },
    {
        question: "I am a property owner. How can I list my property?",
        answer: "Click on 'Join as Owner' in the signup page, create an owner account, and you will be guided through the process of adding your property details and uploading images."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="min-h-screen bg-transparent">
            <Navbar />
            <main>
                <section className="bg-slate-900 pt-32 pb-24 border-b border-slate-800 text-white">
                    <div className="container max-w-4xl text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20">
                                <HelpCircle className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 font-heading">Frequently Asked Questions</h1>
                            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                                Find answers to common questions about booking, payments, and hosting on NestNode.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <section className="container max-w-3xl py-20">
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-blue-200 transition-colors"
                            >
                                <button 
                                    className="w-full px-6 py-5 text-left flex justify-between items-center bg-white"
                                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                >
                                    <span className="font-bold text-slate-800 text-lg">{faq.question}</span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>
                                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-slate-500 leading-relaxed pt-2 border-t border-slate-100">{faq.answer}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default FAQ;
