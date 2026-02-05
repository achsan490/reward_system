import { Metadata } from "next";
import {
  getDashboardChartData,
  getDashboardStats,
  getRecentActivity,
} from "@/app/actions/dashboard";
import { getActiveCampaignStats } from "@/app/actions/dashboard-widgets";
import DashboardStatsCards from "@/components/dashboard/DashboardStatsCards";
import DashboardChart from "@/components/dashboard/DashboardChart";
import RecentActivityList from "@/components/dashboard/RecentActivityList";
import QuickActions from "@/components/dashboard/QuickActions";
import ExpiringPointsAlert from "@/components/dashboard/ExpiringPointsAlert";
import ActiveCampaignCard from "@/components/dashboard/ActiveCampaignCard";
import HallOfFameCard from "@/components/dashboard/HallOfFameCard";

export const metadata: Metadata = {
  title: "Dashboard | Reward System",
  description: "Overview sistem reward dan statistik",
};

export default async function DashboardPage() {
  // Parallel data fetching for performance
  const [statsResult, chartResult, activityResult, widgetsResult] = await Promise.all([
    getDashboardStats(),
    getDashboardChartData(),
    getRecentActivity(),
    getActiveCampaignStats(),
  ]);

  const stats = statsResult.success
    ? statsResult.data!
    : {
      totalMembers: 0,
      totalActiveCampaigns: 0,
      totalRewardsClaimed: 0,
      totalTransactions: 0,
      totalAmount: 0,
      totalPoints: 0,
      pointsExpiringSoon: 0,
      membersWithExpiringPoints: 0,
    };

  const chartData = chartResult.success ? chartResult.data! : [];
  const activities = activityResult.success ? activityResult.data! : [];
  const widgetsData = widgetsResult.success ? widgetsResult.data! : { activeCampaign: null, lastWinners: [] };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Selamat datang kembali! Berikut ringkasan performa sistem reward Anda.
        </p>
      </div>

      {/* Key Metrics */}
      <DashboardStatsCards stats={stats} />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Main Chart */}
        <div className="col-span-12 xl:col-span-8">
          <DashboardChart data={chartData} />
        </div>

        {/* Quick Actions & Side Widgets */}
        <div className="col-span-12 space-y-6 xl:col-span-4">
          {/* Active Campaign Widget */}
          <ActiveCampaignCard data={widgetsData.activeCampaign} />

          {/* Hall of Fame Widget */}
          <HallOfFameCard winners={widgetsData.lastWinners} />

          {/* Quick Actions */}
          <QuickActions />
        </div>
      </div>

      {/* Recent Activity Feed */}
      <RecentActivityList activities={activities} />
    </div>
  );
}
