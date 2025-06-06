// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";  // ← Remplacé Mona_Sans par Inter
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "DataDialog",
  description: "Messagerie structurée pour une communication efficace.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Navbar />
        <main className="container mx-auto pt-2 pb-8 flex-grow">{children}</main>
        <footer className="text-center p-4 text-sm text-muted-foreground border-t">
          © {new Date().getFullYear()} DataDialog - Tous droits réservés.
        </footer>
      </body>
    </html>
  );
}
