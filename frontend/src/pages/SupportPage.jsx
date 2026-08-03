import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Phone, Mail, MessageCircle, HelpCircle, Clock, MapPin, 
    Send, User, FileText, Shield, Star, ChevronRight,
    Headphones, Users, Building, Zap, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SupportButton from '@/components/SupportButton';

const SupportPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            alert('Support request submitted successfully! We will contact you within 2 hours at bed.buddy777@gmail.com or call you at +91 78599 88312.');
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        }, 2000);
    };

    const supportChannels = [
        {
            icon: <Phone className="w-6 h-6" />,
            title: "Phone Support",
            description: "Call us for immediate assistance",
            contact: "+91 78599 88312",
            action: "tel:+917859988312",
            color: "from-blue-500 to-indigo-600",
            timing: "24/7 Available"
        },
        {
            icon: <Mail className="w-6 h-6" />,
            title: "Email Support", 
            description: "Send us detailed queries",
            contact: "bed.buddy777@gmail.com",
            action: "mailto:bed.buddy777@gmail.com",
            color: "from-emerald-500 to-teal-600",
            timing: "Response within 2 hours"
        },
        {
            icon: <MessageCircle className="w-6 h-6" />,
            title: "WhatsApp Support",
            description: "Chat with our team instantly",
            contact: "+91 78599 88312",
            action: "https://wa.me/917859988312",
            color: "from-green-500 to-emerald-600",
            timing: "Instant responses"
        }
    ];

    const commonIssues = [
        {
            icon: <Building className="w-5 h-5" />,
            title: "Property Booking",
            description: "Issues with booking hostels or PGs"
        },
        {
            icon: <User className="w-5 h-5" />,
            title: "Account Problems",
            description: "Login, profile, or account issues"
        },
        {
            icon: <FileText className="w-5 h-5" />,
            title: "Payment & Refunds",
            description: "Questions about payments and refunds"
        },
        {
            icon: <Shield className="w-5 h-5" />,
            title: "Safety & Security",
            description: "Safety concerns and verification"
        }
    ];

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            
            <main className="pt-24 pb-20">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-primary/10 to-primary-foreground/10 py-16">
                    <div className="container">
                        <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Headphones className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                                How Can We Help You?
                            </h1>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Our dedicated support team is here to assist you 24/7. Get instant help through multiple channels.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 mt-8">
                                <Badge className="bg-green-100 text-green-700 border-green-200 px-4 py-2">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    24/7 Available
                                </Badge>
                                <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
                                    <Zap className="w-4 h-4 mr-2" />
                                    Quick Response
                                </Badge>
                                <Badge className="bg-purple-100 text-purple-700 border-purple-200 px-4 py-2">
                                    <Star className="w-4 h-4 mr-2" />
                                    Expert Support
                                </Badge>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Support Channels */}
                <section className="container py-16">
                    <motion.div {...fadeIn} className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Contact Us</h2>
                        <p className="text-slate-600">Choose your preferred support channel</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {supportChannels.map((channel, index) => (
                            <motion.div
                                key={channel.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                <Card className="h-full border-2 border-slate-100 hover:border-primary/30 transition-all duration-300 hover:shadow-xl group-hover:-translate-y-1">
                                    <CardContent className="p-8 text-center">
                                        <div className={`w-16 h-16 bg-gradient-to-r ${channel.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                            {channel.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{channel.title}</h3>
                                        <p className="text-slate-600 mb-4">{channel.description}</p>
                                        <p className="font-bold text-primary text-lg mb-2">{channel.contact}</p>
                                        <p className="text-sm text-green-600 font-medium mb-6">{channel.timing}</p>
                                        <a 
                                            href={channel.action}
                                            className={`inline-flex items-center gap-2 bg-gradient-to-r ${channel.color} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                                        >
                                            Contact Now
                                            <ChevronRight className="w-4 h-4" />
                                        </a>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Quick Issues */}
                <section className="container py-16 bg-slate-50 rounded-3xl">
                    <motion.div {...fadeIn} className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Common Issues</h2>
                        <p className="text-slate-600">Quick solutions for frequently asked questions</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {commonIssues.map((issue, index) => (
                            <motion.div
                                key={issue.title}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer group"
                            >
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                    {issue.icon}
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">{issue.title}</h4>
                                <p className="text-sm text-slate-600">{issue.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Contact Form */}
                <section className="container py-16">
                    <motion.div {...fadeIn} className="max-w-2xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Send Us a Message</h2>
                            <p className="text-slate-600">Fill out the form below and we'll get back to you within 2 hours</p>
                        </div>

                        <Card className="border-2 border-slate-100 shadow-xl">
                            <CardContent className="p-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label className="text-sm font-semibold text-slate-700 mb-2 block">Your Name</Label>
                                            <Input
                                                type="text"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                required
                                                className="h-12 rounded-xl border-slate-200 focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-semibold text-slate-700 mb-2 block">Email Address</Label>
                                            <Input
                                                type="email"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                required
                                                className="h-12 rounded-xl border-slate-200 focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label className="text-sm font-semibold text-slate-700 mb-2 block">Phone Number</Label>
                                            <Input
                                                type="tel"
                                                placeholder="+91 98765 43210"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                className="h-12 rounded-xl border-slate-200 focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-semibold text-slate-700 mb-2 block">Subject</Label>
                                            <Input
                                                type="text"
                                                placeholder="How can we help?"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                                required
                                                className="h-12 rounded-xl border-slate-200 focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-semibold text-slate-700 mb-2 block">Message</Label>
                                        <Textarea
                                            placeholder="Please describe your issue in detail..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                                            required
                                            rows={6}
                                            className="rounded-xl border-slate-200 focus:border-primary resize-none"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                                Sending...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Send className="w-5 h-5" />
                                                Send Message
                                            </div>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </section>

                {/* Emergency Support */}
                <section className="container py-8">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-r from-red-500 to-orange-600 rounded-3xl p-8 text-center text-white"
                    >
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                <HelpCircle className="w-8 h-8" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Emergency Support</h3>
                        <p className="text-white/90 mb-6">For urgent issues, call our emergency hotline</p>
                        <a 
                            href="tel:+917859988312"
                            className="inline-flex items-center gap-3 bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/90 transition-all shadow-xl"
                        >
                            <Phone className="w-6 h-6" />
                            +91 78599 88312
                        </a>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default SupportPage;
