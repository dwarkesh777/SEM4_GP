import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, CheckCircle2 } from "lucide-react";

const PolicyPage = ({ title, lastUpdated, content }) => {
    return (
        <div className="min-h-screen bg-transparent">
            <Navbar />
            <main>
                <section className="bg-transparent pt-24 pb-16 border-b border-slate-200">
                    <div className="container max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-4 mb-6"
                        >
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-blue-600">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h1>
                        </motion.div>
                        <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
                            Last Updated: {lastUpdated}. These terms govern your use of the NestNode platform and services regarding {title.toLowerCase()}.
                        </p>
                    </div>
                </section>

                <section className="container max-w-5xl py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200"
                    >
                        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 hover:prose-a:text-blue-700">
                            {content.map((section, idx) => (
                                <div key={idx} className="mb-10 last:mb-0">
                                    <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                            <span className="text-sm font-bold text-slate-500">{idx + 1}</span>
                                        </div>
                                        {section.heading}
                                    </h2>
                                    <div className="pl-11 text-slate-600 leading-relaxed space-y-4">
                                        {section.paragraphs.map((p, pIdx) => (
                                            <p key={pIdx}>{p}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-12 text-center"
                    >
                        <p className="text-slate-500">
                            Questions about our {title.toLowerCase()}?{" "}
                            <a href="/contact" className="text-blue-600 font-bold hover:underline">Contact Support</a>
                        </p>
                    </motion.div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default PolicyPage;
