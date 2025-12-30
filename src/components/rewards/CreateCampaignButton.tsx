"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import CreateCampaignModal from "./CreateCampaignModal";

export default function CreateCampaignButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
                <Plus className="h-5 w-5" />
                Buat Campaign Baru
            </button>

            <CreateCampaignModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}
