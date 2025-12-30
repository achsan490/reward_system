"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface CustomerSearchProps {
    onSearch: (query: string) => void;
}

export default function CustomerSearch({ onSearch }: CustomerSearchProps) {
    const [query, setQuery] = useState("");

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query, onSearch]);

    const handleClear = () => {
        setQuery("");
        onSearch("");
    };

    return (
        <div className="relative w-full md:w-96">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari nama, email, atau member ID..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-brand-600"
            />
            {query && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <X className="h-5 w-5" />
                </button>
            )}
        </div>
    );
}
