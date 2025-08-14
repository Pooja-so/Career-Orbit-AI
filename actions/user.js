// In newer Next.js version, API's are in separate folder called "actions"
// actions contain server functions i.e. functions runs on server

"use server"; // server functions runs on server and in server components

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIInsights } from "./dashboard";

/* 1) ------------- Update User function ---------------------- */
// --> data in below function is coming from the onboarding Form data
export async function updateUser(data) {
  // 1. Before updating user, check if the user is logged in..
  const { userId } = await auth();
  // if not throw an error
  if (!userId) throw new Error("Unauthorized");

  // 2. Check if user exists in the database
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  // if not throw an error
  if (!user) throw new Error("User not found");

  // 3. If both condidtion is true i.e. user is logged in and exists in the database perform the logic
  try {
    const result = await db.$transaction(
      // API_3 : Transaction makes sure the all the 3 APIs complete. If anyone fails then transaction fails
      async (transaction) => {
        // 1. Find if the industry exists
        let industryInsight = await transaction.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });
        // 2. if industry doesn't exist, create it with default values
        if (!industryInsight) {
          const insights = await generateAIInsights(data.industry);

          industryInsight = await db.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }

        // 3. Update the user
        const updatedUser = await transaction.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });
        return { updatedUser, industryInsight };
      }, // async() function / transcation complete
      {
        timeout: 10000, // 10 seconds so that all 3 APIS can get effecient amount to execute
      }
    );

    return { ...result, success: true };
  } catch (error) {
    console.log("Error updating user and industry: ", error.message);
    throw new Error("Failed to update profile!");
  }
}

/* 2) ------------------ Fetching OnBorading data ---------------*/
export async function getUserOnBoardingStatus() {
  // 1. Before updating user, check if the user is logged in..
  const { userId } = await auth();
  // if not throw an error
  if (!userId) throw new Error("Unauthorized");

  // 2. Check if user exists in the database
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  // if not throw an error
  if (!user) throw new Error("User not found");

  // 3. Logic for fetching industry data
  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true },
    });

    return {
      isOnboarded: !!user?.industry,
    };
  } catch (error) {
    console.log("Error checking onboarding status!", error.message);
    throw new Error("Failed to check onboarding status!");
  }
}
