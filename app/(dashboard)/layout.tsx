import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Dashboard-specific header could go here */}
      <div className="p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}

