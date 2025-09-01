
# 🚀 AI-Powered Career Upskilling Platform  

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)  
[![Shadcn UI](https://img.shields.io/badge/UI-Shadcn%20UI-blue)](https://ui.shadcn.com/)  
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?logo=postgresql)](https://www.postgresql.org/)  
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)](https://www.prisma.io/)  
[![Inngest](https://img.shields.io/badge/Automation-Inngest-orange)](https://www.inngest.com/)  
[![Clerk](https://img.shields.io/badge/Auth-Clerk-purple)](https://clerk.com/)  
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%20API-red)](https://ai.google.dev/)  
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)  

- An AI-driven platform designed to help users **upskill their careers** with smart tools like a resume builder, AI-powered mock interviews, and real-time industry insights. 
---
## Live Demo: https://career-orbit-ai-ulcy.vercel.app/
---

## ✨ Features  

- 📄 **Resume Builder**  
  - Interactive **Markdown editor** for resumes  
  - **One-click PDF export** for seamless downloads  

- 🎤 **AI-Powered Mock Interviews**  
  - 20+ dynamic interview questions generated via **Gemini AI**  
  - Real-time performance analytics & personalized feedback  

- 📊 **Industry Insights & Updates**  
  - Automated **weekly personalized insights** delivered via **Inngest + Gemini AI**  
  - Keeps users updated with relevant career trends  

- 🎨 **Modern UI/UX**  
  - Built with **Shadcn UI** for accessibility and engagement  
  - Fully responsive & interactive design  

- 🔒 **Authentication & User Management**  
  - Secure sign-in and user sessions powered by **Clerk**  

---

## 🛠️ Tech Stack  

- **Frontend**: [Next.js 15](https://nextjs.org/), [Shadcn UI](https://ui.shadcn.com/)  
- **Backend**: [Prisma](https://www.prisma.io/), [PostgreSQL](https://www.postgresql.org/)  
- **AI/Automation**: [Gemini AI API](https://ai.google.dev/), [Inngest](https://www.inngest.com/)  
- **Auth**: [Clerk](https://clerk.com/)  

---

## ⚡ Getting Started  

### 1. Clone the repository  
```bash
git clone https://github.com/your-username/ai-upskilling-platform.git
cd ai-upskilling-platform
```

### 2. Setup environment variables  
- Create a .env file in the root directory:
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/yourdb
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
GEMINI_API_KEY=your_gemini_api_key
INNGEST_API_KEY=your_inngest_key
```

### 3.Run database migration
```bash
npx prisma migrate dev
```

### 4. Start the development server
```bash
npm run dev
```

## 📂 Project Structure  
```bash
.
├── app/         # Next.js App Router
├── components/  # Reusable UI components (Shadcn UI)
├── prisma/      # Prisma schema & migrations
├── inngest/     # Inngest event handlers
├── lib/         # Utility functions
├── public/      # Static assets
└── README.md
```




