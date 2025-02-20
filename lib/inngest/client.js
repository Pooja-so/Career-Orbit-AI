import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "careerorbitai",
  name: "Career Orbit AI",
  // Providing Gemini APi Key to the inngest
  credentials: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  },
});
