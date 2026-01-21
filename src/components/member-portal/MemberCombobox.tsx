"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";

interface Member {
    id: string;
    memberId: string;
    name: string;
    phone?: string | null;
}

interface MemberComboboxProps {
    members: Member[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export default function MemberCombobox({
    members,
    value,
    onChange,
    disabled = false,
    placeholder = "Pilih Member..."
}: MemberComboboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selectedMember = members.find(m => m.memberId === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredMembers = members.filter(member => {
        const lowerQuery = query.toLowerCase();
        return (
            member.name.toLowerCase().includes(lowerQuery) ||
            member.memberId.toLowerCase().includes(lowerQuery) ||
            (member.phone && member.phone.includes(lowerQuery))
        );
    });

    return (
        <div ref={wrapperRef} className="relative">
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center justify-between rounded-lg border bg-white px-4 py-2.5 text-gray-900 
                    cursor-pointer transition-colors
                    ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:border-gray-400 dark:hover:border-gray-600'}
                    ${isOpen ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-gray-300 dark:border-gray-700'}
                    dark:bg-gray-800 dark:text-white
                `}
            >
                <div className="truncate">
                    {selectedMember ? (
                        <span>{selectedMember.name} <span className="text-gray-500 dark:text-gray-400">({selectedMember.memberId})</span></span>
                    ) : (
                        <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
                    )}
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari nama, ID, atau WA..."
                                autoFocus
                                className="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto p-1">
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => (
                                <button
                                    key={member.id}
                                    onClick={() => {
                                        onChange(member.memberId);
                                        setIsOpen(false);
                                        setQuery("");
                                    }}
                                    className={`
                                        w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                                        flex items-center justify-between
                                        ${member.memberId === value
                                            ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                                        }
                                    `}
                                >
                                    <div>
                                        <div className="font-medium">{member.name}</div>
                                        <div className="text-xs opacity-75">
                                            ID: {member.memberId} {member.phone && `• WA: ${member.phone}`}
                                        </div>
                                    </div>
                                    {member.memberId === value && <Check className="h-4 w-4" />}
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                Tidak ada member ditemukan
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
