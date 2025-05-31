"use client";

import { useAuth } from "@/hooks/use-auth"; 
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn, LogOut, UserCircle, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AuthButton() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) {
    return <Button variant="outline" size="icon" disabled><Loader2 className="h-4 w-4 animate-spin" /></Button>;
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} data-ai-hint="profile avatar" />
              <AvatarFallback>
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserCircle className="h-5 w-5"/>}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={signInWithGoogle}>
      <LogIn className="mr-2 h-4 w-4" />
      Login with Google
    </Button>
  );
}
