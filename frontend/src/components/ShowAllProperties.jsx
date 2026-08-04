import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ShowAllProperties = ({ showAll, onShowAll, propertiesCount, onBackToHome }) => {
    const navigate = useNavigate();
    
    const handleBackToHome = () => {
        if (onBackToHome) {
            onBackToHome();
        } else {
            navigate('/');
        }
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center mt-20"
        >
            {showAll && (
                <div className="mb-8">
                    <Button 
                        variant="outline"
                        size="lg" 
                        className="h-14 px-8 rounded-2xl font-bold border-slate-200 hover:border-primary hover:text-primary transition-all group"
                        onClick={handleBackToHome}
                    >
                        <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home Page
                        <Home className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            )}
            
            {!showAll && propertiesCount >= 1 && (
                <div className="p-1 rounded-[2.5rem] bg-slate-100/80 backdrop-blur-sm border border-white">
                    <Button 
                        size="lg" 
                        className="h-16 px-12 rounded-[2.25rem] bg-primary text-white hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-all text-lg font-bold group"
                        onClick={onShowAll}
                    >
                        Show All Properties
                        <div className="ml-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </Button>
                </div>
            )}
            <p className="mt-6 text-sm text-slate-400 font-medium">
                {showAll ? (
                    <>Showing all <span className="text-slate-600 font-bold">{propertiesCount}</span> verified properties</>
                ) : (
                    <>Over <span className="text-slate-600 font-bold">2,500+</span> verified properties available</>
                )}
            </p>
        </motion.div>
    );
};

export default ShowAllProperties;
