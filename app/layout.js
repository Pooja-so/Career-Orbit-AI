import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Career Orbit AI",
  description: "An app for career path making",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* 1. Header */}
            <Header />
            {/* 2. Main content */}
            <main className="min-h-screen">
              {children} {/* children represents the page.js at root level */}
            </main>
            {/* 3. Toast */}
            <Toaster rich /> {/* Toast configuration: For displaying toast  */}
            {/* 4. Footer */}
            <footer className="b-muted/50 py-12">
              <div className="container mx-auto px-4 text-center text-gray-200">
                <p className="text-base md:text-lg lg:text-xl xl:text-2xl tracking-normal">
                  Made by Pooja Singh
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
