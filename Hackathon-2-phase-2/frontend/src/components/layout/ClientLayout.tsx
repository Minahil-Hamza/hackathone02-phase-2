"use client";

import { AuthProvider } from "@/lib/auth-context";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ReactNode } from "react";

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </AuthProvider>
  );
}
