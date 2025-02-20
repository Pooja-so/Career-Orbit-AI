/*
The createFunction method takes three objects as arguments:

1. Configuration: A unique id is required and it is the default name that will be displayed 
on the Inngest dashboard to refer to your function. You can also specify additional 
options such as concurrency, rateLimit, retries, or batchEvents, and others.
2. Trigger: event is the name of the event that triggers your function. 
Alternatively, you can use cron to specify a schedule to trigger this function. Learn more about triggers from documentation.
3. Handler: The function that is called when the event is received. 
The event payload is passed as an argument. Arguments include step to define 
durable steps within your handler and additional arguments include logging helpers and other data.

*/
import { inngest } from "./client";
import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const genAIModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateIndustryInsights = inngest.createFunction(
  { name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" }, // Triggers this function at every Sunday at midnight
  async ({ event, step }) => {
    const industries = await step.run("Fetch industries", async () => {
      return await db.industryInsight.findMany({
        select: { industry: true },
      });
    });

    for (const { industry } of industries) {
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

      const result = await step.ai.wrap(
        "gemini",
        async (p) => {
          return await genAIModel.generateContent(p);
        },
        prompt
      );

      const text =
        result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

      const insights = JSON.parse(cleanedText);

      // Update industry insights in the datbase with the latest fetched data from Gemini AI
      await step.run(`Update ${industry} insights`, async () => {
        await db.industryInsight.update({
          where: { industry },
          data: {
            ...insights,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      });
    }
  }
);
