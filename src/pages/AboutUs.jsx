import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-24 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-heading font-bold text-foreground mb-6">About BedBuddy</h1>
                    <div className="prose prose-blue max-w-none text-muted-foreground space-y-6">
                        <section>
                            <h2 className="text-2xl font-semibold text-foreground">Our Mission</h2>
                            <p>
                                BedBuddy is India's leading platform dedicated to helping students and young professionals find perfect accommodation.
                                We understand that moving to a new city is challenging, and finding a safe, comfortable, and affordable place to stay
                                shouldn't be the hardest part.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground">Why BedBuddy?</h2>
                            <p>
                                We've revolutionized the hostel and PG search experience by providing verified listings, transparent pricing, and
                                direct communication with property owners. Our platform is designed with the unique needs of students in mind,
                                focusing on safety, community, and convenience.
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Verified properties for peace of mind</li>
                                <li>Transparent pricing with no hidden charges</li>
                                <li>Easy-to-use filter system to find exactly what you need</li>
                                <li>Comprehensive property details and images</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground">Our Story</h2>
                            <p>
                                Founded in 2024, BedBuddy started as a small project to solve the accommodation crisis in student hubs.
                                Today, we are proud to serve thousands of users across the country, bridging the gap between property
                                owners and those seeking a place to call home.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default AboutUs;
