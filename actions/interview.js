"use server"
import { auth } from "@clerk/nextjs/server";
export async function generateQuiz(params) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Fetch existing user
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");
}