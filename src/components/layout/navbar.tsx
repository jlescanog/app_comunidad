
"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { TestTubeDiagonalIcon, MenuIcon } from "lucide-react"; 
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-40 w-full border-b">
      <div className="container mx-auto flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 px-4">
        <Link href="/" className="flex items-center space-x-2">
          <TestTubeDiagonalIcon className="h-6 w-6 text-primary" />
          <span className="font-headline font-bold text-lg text-primary">{siteConfig.name}</span>
        </Link>
        
        {/* Desktop Navigation */}
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

        <div className="flex flex-1 items-center justify-end space-x-4 md:hidden">
          {/* Mobile Navigation Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Alternar menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="mb-6">
                <SheetTitle>
                  <Link href="/" className="flex items-center space-x-2">
                    <TestTubeDiagonalIcon className="h-6 w-6 text-primary" />
                    <span className="font-headline font-bold text-lg text-primary">{siteConfig.name}</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4">
                {siteConfig.mainNav.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      {item.title}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
