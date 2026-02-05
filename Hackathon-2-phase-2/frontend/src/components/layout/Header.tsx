"use client";

import Link from "next/link";
import { CheckSquare, LogOut, LayoutDashboard, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
            <CheckSquare className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            TaskFlow
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          <Link
            href="/"
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              pathname === "/"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            Home
          </Link>
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5",
                pathname === "/dashboard"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-9 w-20 bg-muted rounded-lg animate-pulse" />
          ) : isAuthenticated ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground max-w-[150px] truncate">{user?.email}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleLogout}
                className="rounded-lg text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-1.5" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button size="sm" variant="ghost" className="rounded-lg">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="rounded-lg">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
