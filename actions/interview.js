"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const genAIModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/* 1) ----------------- Genarating quiz questions using AI----------------------- */
export async function generateQuiz() {
  // 1. Before generating quiz, check if the user is logged in. If not throw an error
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // 2. Check if user exists in the database. If not throw an error
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    select: {
      industry: true,
      skills: true,
    },
  });
  if (!user) throw new Error("User not found");

  // 3. Generate quiz using AI by giving prompt to the Gemini AI
  const prompt = `
  Generate 10 technical interview questions for a ${
    user.industry
  } professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.
  
  Each question should be multiple choice with 3 options.
  
  Return the response in this JSON format only, no additional text:
  {
    "questions": [
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correctAnswer": "string",
        "explanation": "string"
      }
    ]
  }
`;

  try {
    const result = await genAIModel.generateContent(prompt);
    const response = result?.response; //AI Response
    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text; // AI Content:
    if (!text) throw new Error("No response from AI model");
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim(); // Remove Markdown (```json) and trim
    const quiz = JSON.parse(cleanedText);

    return quiz.questions;
  } catch (error) {
    console.log("Error in generating quiz: ", error);
    throw new Error("Failed to generate quiz questions");
  }
}

/* 2) --------------------- Saving quiz results ------------------------------ */
export async function saveQuizResult(questions, answers, score) {
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

  // 3. Generating Quiz result and saving it in the database
  const questionResults = questions.map((q, index) => ({
    question: q.question,
    correctAnswer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  // Collect wrong answwers given by user if any
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  // Generate improvement tips using AI if they are wrong answers
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.correctAnswer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementTipPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
      const improvementTipResult = await genAIModel.generateContent(
        improvementTipPrompt
      );
      const text =
        improvementTipResult.response?.candidates?.[0]?.content?.parts?.[0]
          ?.text;
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

      improvementTip = cleanedText;
      console.log(improvementTip);
    } catch (error) {
      console.log("Error generating improvement tip:", error);
      // Continue without improvement tip if generation fails
    }
  }

  try {
    //   Storing quiz result in the assessment model in database
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.log("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

/* 3) --------------------- Fetching Assessment ------------------------------ */
export async function getAssessments() {
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

  // 3. Fetch assessment from database
  try {
    const assessments = await db.assessment.findMany({
      where: { userId: user.id },
      orderBy: {
        createdAt: "asc",
      },
    });
    return assessments;
  } catch (error) {
    console.log("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}
