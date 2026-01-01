"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { createWhatsAppUrl } from "@/lib/phoneUtils";

interface WhatsAppButtonProps {
    phone: string | null | undefined;
    message: string;
    label?: string;
    variant?: "compact" | "full" | "outline";
    className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
    phone,
    message,
    label = "WhatsApp",
    variant = "full",
    className = "",
}) => {
    const whatsappUrl = createWhatsAppUrl(phone, message);

    if (!whatsappUrl) return null;

    const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 rounded-xl shadow-lg hover:shadow-green-500/25 active:scale-95";

    const variants = {
        full: "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 px-4 py-2.5 text-sm",
        compact: "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 px-3 py-1.5 text-xs shadow-md",
        outline: "border-2 border-green-500 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 px-4 py-2 text-sm shadow-none hover:shadow-sm",
    };

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            <MessageCircle className={`${variant === "compact" ? "h-3.5 w-3.5" : "h-4 w-4"} animate-pulse-gentle`} />
            <span>{label}</span>
        </a>
    );
};

export default WhatsAppButton;
