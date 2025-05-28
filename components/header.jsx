"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  ChevronDown,
  FileText,
  GraduationCap,
  LayoutDashboard,
  PenBox,
  StarIcon,
} from "lucide-react";

const Header = async() => {
  // await checkUser();
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo.png"
            alt="sensai Logo"
            width={200}
            height={60}
            className="h-12 w-auto object-contain py-1"
          />
        </Link>

        {/* Right side */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Dashboard button */}
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="outline">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:block">Industry Insights</span>
              </Button>
            </Link>
          

          {/* Growth Tools Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <StarIcon className="h-4 w-4" />
                <span className="hidden md:block">Growth Tools</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
               <DropdownMenuItem>
              <Link href="/resume"  className="flex item-center gap-2">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>build resume</span>
               </Link>   
               </DropdownMenuItem>
                
              <DropdownMenuItem>
                <Link href="/ai-cover-letter"  className="flex item-center gap-2">
                  <PenBox className="h-4 w-4 mr-2" />
                  <span>Cover Letter</span>
               </Link>  </DropdownMenuItem>
              <DropdownMenuItem><Link href="/interview"  className="flex item-center gap-2">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  <span>Interview Prep</span>
               </Link>  </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </SignedIn>

          {/* Auth buttons */}
          <SignedOut>
            <SignInButton>
              <Button variant={"outline"}>
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements:{
                  avatarBox:'w-10 h-10',
                  userButtonPopoverCard:"shadow-xl",
                  userPreviewMainIdentifier:"front-semibold"
                }
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
