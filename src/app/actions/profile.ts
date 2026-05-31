"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getProfile() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const profile = await prisma.admin.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        bio: true,
        facebook: true,
        twitter: true,
        linkedin: true,
        instagram: true,
        country: true,
        cityState: true,
        postalCode: true,
        taxId: true,
      },
    });

    if (!profile) {
      return { success: false, error: "Profile not found" };
    }

    return { success: true, data: profile };
  } catch (error) {
    console.error("Error in getProfile:", error);
    return { success: false, error: "Internal server error" };
  }
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  country?: string;
  cityState?: string;
  postalCode?: string;
  taxId?: string;
}

export async function updateProfile(data: UpdateProfileInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const updatedProfile = await prisma.admin.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        facebook: data.facebook,
        twitter: data.twitter,
        linkedin: data.linkedin,
        instagram: data.instagram,
        country: data.country,
        cityState: data.cityState,
        postalCode: data.postalCode,
        taxId: data.taxId,
      },
    });

    revalidatePath("/profile");
    return { success: true, data: updatedProfile };
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}
