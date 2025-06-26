"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

// ------------------------
// UPDATE USER ONBOARDING
// ------------------------
export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Ensure industry insight exists
      let industryInsight = await tx.industryInsight.findUnique({
        where: { industry: data.industry },
      });

      if (!industryInsight) {
        const insights = await generateAIInsights(data.industry);
        industryInsight = await tx.industryInsight.create({
          data: {
            industry: data.industry,
            ...insights,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      }

      // 2. Update user profile
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          industry: data.industry,
          experience: data.experience,
          bio: data.bio,
          skills: data.skills,
        },
      });

      return { updatedUser, industryInsight };
    });

    revalidatePath("/dashboard");
    return result.updatedUser;
  } catch (error) {
    console.error("❌ Failed to update user:", error.message);
    throw new Error("Failed to update profile");
  }
}

// -------------------------------
// CHECK IF USER IS ONBOARDED
// -------------------------------
export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  let user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, industry: true },
  });

  // Auto-create if user not found
  if (!user) {
    try {
      const res = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch user from Clerk");

      const clerkUser = await res.json();
      const name = `${clerkUser.first_name ?? ""} ${clerkUser.last_name ?? ""}`.trim();
      const email = clerkUser.email_addresses?.[0]?.email_address ?? "unknown@example.com";
      const imageUrl = clerkUser.image_url ?? "";

      const createdUser = await prisma.user.create({
        data: {
          clerkUserId: userId,
          name,
          email,
          imageUrl,
        },
        select: { industry: true },
      });

      return { isOnboarded: !!createdUser.industry };
    } catch (err) {
      console.error("❌ Failed to auto-create user from Clerk:", err);
      throw new Error("User creation failed");
    }
  }

  return { isOnboarded: !!user.industry };
}
