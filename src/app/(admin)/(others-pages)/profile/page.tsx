import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { getProfile } from "@/app/actions/profile";
import { Metadata } from "next";
import React from "react";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Profile | Admin Dashboard",
  description: "User profile settings",
};

export default async function Profile() {
  const result = await getProfile();

  if (!result.success || !result.data) {
    redirect("/login");
  }

  const profile = result.data;

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard profile={profile} />
          <UserInfoCard profile={profile} />
          <UserAddressCard profile={profile} />
        </div>
      </div>
    </div>
  );
}
