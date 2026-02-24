import { motion } from "framer-motion";
import { Search, ShieldCheck, BadgeIndianRupee, Headphones, GraduationCap, Star } from "lucide-react";

const features = [
    {
        icon: Search,
        title: "Easy Search",
        description: "Find the perfect accommodation with our advanced search filters and user-friendly interface",
    },
    {
        icon: ShieldCheck,
        title: "Verified Listings",
        description: "All properties are verified by our team to ensure authenticity and quality standards",
    },
    {
        icon: BadgeIndianRupee,
        title: "Best Price",
        description: "Get competitive prices and exclusive deals on accommodations across India",
    },
    {
        icon: Headphones,
        title: "24/7 Support",
        description: "Round-the-clock customer support to help you with any queries or issues",
    },
    {
        icon: GraduationCap,
        title: "Near Colleges",
        description: "Find accommodations located near your college or university for convenience",
    },
    {
        icon: Star,
        title: "Top Rated",
        description: "Access highly-rated properties with genuine reviews from verified students",
    },
];

const WhyChooseUs = () => {
    return (
        <section className="py-20 bg-secondary/50">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-14"
                >
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
                        Why Choose NestNode?
                    </h2>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        We make finding the perfect accommodation simple and hassle-free
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-30px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -6 }}
                            className="bg-card rounded-xl p-6 card-elevated text-center group"
                        >
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                                <feature.icon className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="font-heading font-semibold text-card-foreground text-lg mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
