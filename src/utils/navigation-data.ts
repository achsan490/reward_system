export type NavigationItem = {
    name: string;
    path: string;
    section: string;
};

export const NAVIGATION_DATA: NavigationItem[] = [
    { name: "Dashboard", path: "/", section: "Menu" },
    { name: "Data Transaksi", path: "/transactions", section: "Menu" },
    { name: "Data Pelanggan", path: "/customers", section: "Menu" },
    { name: "Penentuan Reward", path: "/reward-determination", section: "Reward System" },
    { name: "Reward Catalog", path: "/reward-catalog", section: "Reward System" },
    { name: "Redemption Requests", path: "/redemption-requests", section: "Reward System" },
    { name: "Pengaturan Sistem", path: "/settings", section: "Menu" },
    { name: "Laporan Kadaluarsa", path: "/reports/expiration", section: "Laporan & Analitik" },
    { name: "Analisis Transaksi", path: "/reports/transactions", section: "Laporan & Analitik" },
    { name: "QR Generator", path: "/member-portal/qr-generator", section: "Portal Member" },
    { name: "Member Cards", path: "/member-portal/member-cards", section: "Portal Member" },
    { name: "Cek Poin Member", path: "/member/check", section: "Link Publik" },

];
