// Header is rendered in layout.js
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image"; // Image from nextjs optimizes image and then render it on client-side
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

import {
  ChevronDown,
  FileText,
  GraduationCap,
  LayoutDashboard,
  PenBox,
  StarsIcon,
} from "lucide-react"; // luicide-react is avaialable in shadcn
import { checkUser } from "@/lib/checkUser";

const Header = async() => {
  await checkUser(); /* Everytime, when we land on our application, we check if the user is 
  stored in the db and return it else create it then return the created one*/
  return (
    <header className="fixed top-0 w-full py-2 border-b bg-background/80 backdrop-blur-md z-50 ">
      {/* removed container from nav */}
      <nav className="mx-5 py-2 h-16 flex items-center justify-between">
        {/* 1. logo */}
        <div className="flex">
          <Image
            src="/logo.png"
            alt="Career Orbit AI logo"
            width={200}
            height={30}
            className="h-20 py-1 w-auto object-contain"
          />
          <div className="self-center px-3 text-sm font-bold md:text-lg lg:text-xl xl:text-2xl shade-logo">
            <p>Career Orbit AI</p>
          </div>
        </div>

        {/*2. Displayed only for the signed in user */}
        <div className="flex items-center space-x-2 md:space-x-4 ">
          <SignedIn>
            {/* 2.1 Dashborad button for Industry insights */}
            <Link href={"/dashboard"}>
              <Button variant="outline">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:block text-base">
                  Industry Insights
                </span>
              </Button>
            </Link>
            {/* 2.2 Growth tools */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <StarsIcon className="h-4 w-4" />
                  <span className="hidden md:block text-base">
                    Growth Tools
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href={"/resume"} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-base">Build Resume</span>
                  </Link>
                </DropdownMenuItem>
                {/* PENDING: --------------- COVER LETTER ----------------- */}
                {/* <DropdownMenuItem>
                  <Link
                    href={"/ai-cover-letter"}
                    className="flex items-center gap-2"
                  >
                    <PenBox h-4 w-4 />
                    <span className="text-base">Cover Letter</span>
                  </Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem>
                  <Link href={"/interview"} className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span className="text-base">Interview Preparation</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>
          {/* 3. If user has signed out then clerk will display SignIn*/}
          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>
          {/* 4. If user is already signed in then clerk will display Userbutton*/}
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/" // after signed out go to home page
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
