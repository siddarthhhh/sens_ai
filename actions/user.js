"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Fetch existing user
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        // 1) Try to find an existing IndustryInsight row
        let industryInsight = await tx.industryInsight.findUnique({
          where: { industry: data.industry },
        });

        // 2) If none exists, generate AI insights and create it
        if (!industryInsight) {
          const insights = await generateAIInsights(data.industry);

          // Notice that we:
          //  - assign back to `industryInsight` (singular)
          //  - use `tx.industryInsight.create(...)`, not `prisma.industryInsight.create(...)`
          industryInsight = await tx.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }

        // 3) Update the user record
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
      },
      { timeout: 10000 }
    );

    revalidatePath("/");
    return {
      success: true,
      user: result.updatedUser,
    };
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile");
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!existingUser) throw new Error("User not found");

  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true },
    });
    return {
      isOnboarded: !!user?.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}
