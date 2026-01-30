import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, AppSidebar } from "@/components/navigation";
import { MainContent } from "@/components/layout/main-content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyBuddy - Student Information System",
  description: "A comprehensive student information system for managing courses, grades, and academic progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white dark:bg-black">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black`}
      >
        <SidebarProvider>
          <AppSidebar />
          <MainContent>{children}</MainContent>
        </SidebarProvider>
      </body>
    </html>
  );
}

