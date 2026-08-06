import React from "react";
import PolicyPage from "./PolicyPage";
import { ShieldCheck } from "lucide-react";

const cancellationContent = [
    {
        heading: "1. Standard Cancellation Policy",
        paragraphs: [
            "Students and tenants can cancel their booking up to 15 days before the scheduled move-in date to receive a 100% full refund of their advance security deposit.",
            "Cancellations requested within 7 to 14 days of move-in are subject to a nominal 10% processing fee."
        ]
    },
    {
        heading: "2. Late Cancellations",
        paragraphs: [
            "Cancellations requested less than 7 days prior to the move-in date may incur a penalty up to 50% of the first month's security deposit, as the room was held exclusively for you.",
            "In exceptional medical or emergency circumstances, proof can be submitted to our support team for a full fee waiver review."
        ]
    },
    {
        heading: "3. Refund Processing Timeline",
        paragraphs: [
            "Approved refunds are automatically credited back to your original payment method (Bank Account / UPI / Card) within 5 to 7 business days.",
            "You will receive instant SMS and email tracking notifications once the refund payout is initiated by NestNode."
        ]
    }
];

const CancellationPolicy = () => {
    return (
        <PolicyPage
            title="Cancellation Policy"
            lastUpdated="January 2026"
            content={cancellationContent}
            icon={ShieldCheck}
        />
    );
};

export default CancellationPolicy;
