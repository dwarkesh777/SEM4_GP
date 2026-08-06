import React from "react";
import PolicyPage from "./PolicyPage";
import { Scale } from "lucide-react";

const termsContent = [
    {
        heading: "1. Acceptance of Terms",
        paragraphs: [
            "By accessing, browsing, or using the NestNode platform (website, mobile applications, and services), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must discontinue using our platform immediately.",
            "NestNode reserves the right to update or modify these terms at any time without prior notice. Your continued use of the platform following any changes constitutes your acceptance of the revised terms."
        ]
    },
    {
        heading: "2. User Registration & Accounts",
        paragraphs: [
            "To access certain features of NestNode, such as saving favorite properties, booking student accommodation, or creating property listings, you must register for an account.",
            "You are responsible for keeping your login credentials secure and confidential. Any activity occurring under your account is your sole responsibility. NestNode reserves the right to suspend or terminate accounts that violate community safety rules or present false documentation."
        ]
    },
    {
        heading: "3. Property Listings & Host Standards",
        paragraphs: [
            "Property owners and hosts listing hostels, PGs, or apartments on NestNode must provide 100% accurate information, genuine photos, and transparent pricing without hidden mandatory fees.",
            "All listed properties undergo strict verification checks. Any host submitting misleading information, fraudulent pricing, or unverified images will have their listings permanently removed."
        ]
    },
    {
        heading: "4. Student & Tenant Conduct",
        paragraphs: [
            "Tenants booking accommodation through NestNode must abide by property rules set by property managers and local regulations.",
            "Any unlawful behavior, damage to property, harassment of co-residents, or failure to comply with agreed rental terms may result in immediate eviction and account termination."
        ]
    },
    {
        heading: "5. Limitation of Liability",
        paragraphs: [
            "NestNode acts as a technology marketplace connecting verified hosts with tenants. While we enforce strict verification standards, users are encouraged to inspect properties during move-in and verify room amenities.",
            "NestNode shall not be liable for indirect, incidental, or consequential damages resulting from dispute between hosts and tenants outside platform policy scope."
        ]
    }
];

const TermsOfService = () => {
    return (
        <PolicyPage
            title="Terms of Service"
            lastUpdated="February 2026"
            content={termsContent}
            icon={Scale}
        />
    );
};

export default TermsOfService;
