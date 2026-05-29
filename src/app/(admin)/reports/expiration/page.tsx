import { Metadata } from "next";
import { getExpirationReport } from "@/app/actions/reports";
import ExpirationReportContent from "@/components/reports/ExpirationReportContent";

export const metadata: Metadata = {
    title: "Laporan Poin Kadaluarsa | Reward System",
    description: "Laporan dan analisis poin yang kadaluarsa",
};

export const dynamic = "force-dynamic";

export default async function ExpirationReportPage() {
    const reportResult = await getExpirationReport();

    const reportData = reportResult.success
        ? reportResult.data
        : {
            summary: {
                totalExpired: 0,
                totalExpiringSoon: 0,
                affectedMembers: 0,
                totalValueLost: 0,
            },
            timeline: [],
            memberList: [],
        };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    📊 Laporan Tiket Kadaluarsa
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Monitoring dan analisis tiket penukaran yang kadaluarsa
                </p>
            </div>

            <ExpirationReportContent data={reportData!} />
        </div>
    );
}
