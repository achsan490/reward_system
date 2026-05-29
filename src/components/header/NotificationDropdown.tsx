"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MessageCircle, AlertCircle, Clock, User } from "lucide-react";
import { getMembersWithExpiringPoints } from "@/app/actions/point-expiration";
import WhatsAppButton from "../common/WhatsAppButton";
import { formatDateShortID } from "@/lib/expirationUtils";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const result = await getMembersWithExpiringPoints(30); // Points expiring in next 30 days
        if (result.success && result.data) {
          setNotifications(result.data);
          if (result.data.length > 0) {
            setNotifying(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    // Poll every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  function toggleDropdown() {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setNotifying(false); // Mark as seen
    }
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={toggleDropdown}
      >
        {notifying && (
          <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 flex">
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
          </span>
        )}
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Pemberitahuan
          </h5>
          <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
            {notifications.length} Perlu Tindakan
          </span>
        </div>

        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar flex-1">
          {loading && (
            <div className="flex items-center justify-center py-10">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"></div>
            </div>
          )}

          {!loading && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <AlertCircle className="mb-2 h-10 w-10 text-gray-300" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tidak ada tiket penukaran yang hampir kadaluarsa
              </p>
            </div>
          )}

          {!loading && notifications.map((item) => (
            <li key={item.member.id}>
              <div className="flex flex-col gap-2 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    <User className="h-5 w-5" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {item.member.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Tiket {item.expiringTransactions[0]?.rewardName || "Reward"} ({item.totalExpiringPoints} poin) akan hangus pada {formatDateShortID(item.earliestExpiryDate)}
                    </p>

                    <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{item.member.memberId}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-1 flex justify-end">
                  <WhatsAppButton
                    phone={item.member.phone}
                    message={`Halo ${item.member.name}, kami ingin mengingatkan bahwa tiket penukaran reward Anda (${item.expiringTransactions[0]?.rewardName || "Reward"}) dengan kode klaim ${item.expiringTransactions[0]?.claimCode || ""} akan segera kadaluarsa pada ${formatDateShortID(item.earliestExpiryDate)}. Yuk segera diambil di toko sebelum hangus!`}
                    variant="compact"
                    label="Kirim WA"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Link
          href="/reports/expiration"
          onClick={closeDropdown}
          className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Lihat Semua Laporan
        </Link>
      </Dropdown>
    </div>
  );
}
