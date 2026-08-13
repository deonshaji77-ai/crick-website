import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RJ Doctor Bat | Premium Cricket Gear Studio",
  description: "Handpicked bats and bespoke cricket gear for the purist.",
};

import { StoreProvider } from "@/lib/StoreContext";
import { AuthProvider } from "@/lib/AuthContext";
import { AdminEditor } from "@/components/AdminEditor";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>
          <StoreProvider>
            {children}
            <AdminEditor />
          </StoreProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
