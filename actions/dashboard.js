// server actions to fetch industry insights from the database
"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const genAIModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateAIInsights = async (industry) => {
  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;
  // Giving prompt to gemini AI for generating lastest industry insights in JSOn format
  const result = await genAIModel.generateContent(prompt);
  const response = result?.response; //AI Response
  // Extracting text safely
  const text = response?.candidates?.[0]?.content?.parts?.[0]?.text; // AI Content:

  if (!text) throw new Error("No response from AI model");

  // Remove Markdown (```json) and trim
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  return JSON.parse(cleanedText);
};

export const getIndustryInsights = async () => {
  // 1. Before fetchinf industry insights, check if the user is logged in..
  const { userId } = await auth();
  // if not throw an error
  if (!userId) throw new Error("Unauthorized");

  // 2. Check if user exists in the database and includes industryInsights
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    include: {
      industryInsight: true,
    },
  });
  // if not throw an error
  if (!user) throw new Error("User not found");

  // 3. If user does not include IndustryInsights generate them
  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    return industryInsight;
  }
  return user.industryInsight;
};
