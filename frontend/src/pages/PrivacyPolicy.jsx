import React from "react";
import PolicyPage from "./PolicyPage";
import { Lock } from "lucide-react";

const privacyContent = [
    {
        heading: "1. Information We Collect",
        paragraphs: [
            "We collect personal information you provide directly to us when registering an account, filling out booking requests, or contacting property owners.",
            "This includes your name, email address, phone number, government ID for verification (if applicable for move-in), property search preferences, and transaction details."
        ]
    },
    {
        heading: "2. How We Use Your Data",
        paragraphs: [
            "Your data is strictly used to facilitate bookings, verify student/owner authenticity, improve algorithm search recommendations, and send instant booking notifications via SMS/email/WhatsApp.",
            "NestNode operates on a strict zero-spam policy. We NEVER sell, rent, or trade your personal contact details to third-party marketing companies."
        ]
    },
    {
        heading: "3. Data Security & Protection",
        paragraphs: [
            "We implement bank-grade SSL/TLS encryption, secure database hashing, and strict role-based access control to safeguard your sensitive information.",
            "Our security infrastructure undergoes routine vulnerability checks to guard against unauthorized access, data loss, or system breaches."
        ]
    },
    {
        heading: "4. Your Rights & Data Ownership",
        paragraphs: [
            "You hold full ownership over your personal data. At any time, you can request to view, export, update, or permanently delete your NestNode user profile.",
            "To request data removal or exercise your privacy rights under applicable data protection laws, contact our Privacy Officer at privacy@nestnode.in."
        ]
    }
];

const PrivacyPolicy = () => {
    return (
        <PolicyPage
            title="Privacy Policy"
            lastUpdated="February 2026"
            content={privacyContent}
            icon={Lock}
        />
    );
};

export default PrivacyPolicy;
