import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building2, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Signup = () => {
    const navigate = useNavigate();

    const roles = [
        {
            title: "Join as Student",
            description: "Create an account to save properties and manage bookings.",
            icon: User,
            path: "/student/signup",
            color: "primary",
            bg: "bg-primary/10",
            border: "hover:border-primary/50"
        },
        {
            title: "Join as Owner",
            description: "Register your property and start hosting students today.",
            icon: Building2,
            path: "/owner/signup",
            color: "indigo-600",
            bg: "bg-indigo-50",
            border: "hover:border-indigo-500/50"
        }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-4 pt-24">
            <div className="w-full max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="mx-auto w-16 h-16 bg-white rounded-3xl shadow-xl shadow-primary/5 flex items-center justify-center mb-6">
                        <MapPin className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-3 font-heading tracking-tight">Create Account</h1>
                    <p className="text-slate-500 font-medium text-lg">Pick a route to get started.</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 px-4">
                    {roles.map((role, idx) => (
                        <Link
                            key={role.title}
                            to={role.path}
                            className="block h-full"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="h-full"
                            >
                                <Card
                                    className={`h-full border-2 border-transparent ${role.border} cursor-pointer transition-all duration-300 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden`}
                                >
                                    <CardHeader className="p-10 pb-6 text-center">
                                        <div className={`mx-auto w-20 h-20 ${role.bg} rounded-3xl flex items-center justify-center mb-6`}>
                                            <role.icon className={`w-10 h-10 text-${role.color}`} />
                                        </div>
                                        <CardTitle className="text-2xl font-black text-slate-900 font-heading">{role.title}</CardTitle>
                                        <CardDescription className="text-slate-500 font-medium mt-3 leading-relaxed">
                                            {role.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-10 pt-0 flex justify-center">
                                        <Button
                                            variant="ghost"
                                            className={`font-black text-sm uppercase tracking-widest text-${role.color} hover:bg-${role.color}/5`}
                                        >
                                            Start Now <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Signup;
