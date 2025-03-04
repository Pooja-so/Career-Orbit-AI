"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const genAIModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/* 1. ------------------------ Save Resume in DB function -------------------------- */
export async function saveResume(content) {
  // 1. Check if the user is logged in. If not throw an error
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // 2. Check if user exists in the database. If not throw an error
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("User not found");

  // 3. Save resume in database
  try {
    // upsert: update + insert
    const resume = await db.resume.upsert({
      where: { userId: user.id },
      //    If resume already exist in the db, update it
      update: { content },
      //   If resume does not existe, create it
      create: { userId: user.id, content },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

/* 2. ------------------------ Fetch Resume from DB function --------------------------*/
export async function getResume() {
  // 1. check if the user is logged in. If not throw an error
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // 2. Check if user exists in the database. If not throw an error
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("User not found");

  // 3. Fetch resume from database
  return await db.resume.findUnique({
    where: { userId: user.id },
  });
}

/* 3. ---------------------- Improve with AI function ------------------- */
export async function improveWithAI({ current, type }) {
  // 1. Check if the user is logged in. If not throw an error
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // 2. Check if user exists in the database. If not throw an error
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    include: {
      industryInsight: true,
    },
  });
  if (!user) throw new Error("User not found");

  // 3. Giving prompt to AI for improving content
  const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;

  try {
    const result = await genAIModel.generateContent(prompt);
    const response = result?.response;
    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    const improvedContent = text.replace(/```(?:json)?\n?/g, "").trim();
    return improvedContent;
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
}
