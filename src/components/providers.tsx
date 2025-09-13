"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/lib/query-provider";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Component } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isGamePage = pathname.startsWith("/game"); // adjust to your route

  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster
          richColors
          expand={true}
          duration={2500}
          position="top-right"
        />
      </QueryProvider>
    </SessionProvider>
  );
}
