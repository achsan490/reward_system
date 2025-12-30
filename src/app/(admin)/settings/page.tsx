import { Metadata } from "next";
import { getPointConversionRate } from "@/app/actions/settings";
import { getPointExpirationSettings } from "@/app/actions/point-expiration";
import PointConversionSetting from "@/components/settings/PointConversionSetting";
import PointExpirationSetting from "@/components/settings/PointExpirationSetting";
import ResetDataSection from "@/components/settings/ResetDataSection";

export const metadata: Metadata = {
    title: "Pengaturan Sistem | Reward System",
    description: "Kelola pengaturan sistem reward",
};

export default async function SettingsPage() {
    const [rateResult, expirationResult] = await Promise.all([
        getPointConversionRate(),
        getPointExpirationSettings(),
    ]);

    const currentRate = (rateResult.success ? rateResult.data : undefined) ?? 5000;
    const expirationSettings = expirationResult.success
        ? expirationResult.data
        : { enabled: false, days: 90 };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Pengaturan Sistem
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Kelola konfigurasi sistem reward dan point
                </p>
            </div>

            <PointConversionSetting initialRate={currentRate} />

            <PointExpirationSetting
                initialEnabled={expirationSettings?.enabled ?? false}
                initialDays={expirationSettings?.days ?? 90}
            />

            <div className="border-t border-gray-200 pt-6 dark:border-gray-800">
                <ResetDataSection />
            </div>
        </div>
    );
}
