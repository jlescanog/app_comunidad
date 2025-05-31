
"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
// import { AuthButton } from "@/components/auth/auth-button"; // AuthButton removed
import { TestTubeDiagonalIcon } from "lucide-react"; 

export function Navbar() {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-40 w-full border-b">
      <div className="container mx-auto flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 px-4">
        <Link href="/" className="flex items-center space-x-2">
          <TestTubeDiagonalIcon className="h-6 w-6 text-primary" />
          <span className="font-headline font-bold text-lg text-primary">{siteConfig.name}</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {siteConfig.mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-primary"
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* <AuthButton /> Removed */}
        </div>
        
        <Button variant="ghost" className="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
          <span className="sr-only">Alternar menú</span>
        </Button>
      </div>
    </header>
  );
}
